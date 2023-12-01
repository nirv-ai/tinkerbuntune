// @ts-check

import micromatch from 'micromatch'

export default async (stagedFiles) => {
  const codeFiles = micromatch(stagedFiles, '*.?(*){j,t}s?(x|on*)', {
    matchBase: true,
  }).join(' ')

  const tsOnly = micromatch(stagedFiles, '*.?(*)ts?(x)', {
    matchBase: true,
  }).join(' ')

  const buildFiles = micromatch.some(
    stagedFiles,
    ['tsconfig*.json$', 'package.json$'],
    {
      matchBase: true,
    },
  )

  // console.info('\n\n codefiles', codeFiles, tsOnly, buildFiles);

  const lintAndTests = codeFiles.length
    ? [
        `bun --bun x eslint --max-warnings=0 --no-warn-ignored --fix --fix-type suggestion,layout,problem,directive -f unix ${codeFiles}`,
        `bun test --bail ${codeFiles}`,
      ]
    : []

  const typeCoverage = lintAndTests.concat(
    tsOnly.length
      ? [
          `bun --bun -x typescript-coverage-report -o './coverage-ts' -p './tsconfig.build.json' --cache=false -s=true -t=99`,
        ]
      : [],
  )

  const matches = typeCoverage.concat(
    typeCoverage.length || buildFiles ? 'bun run build' : [],
  )

  return matches
}
