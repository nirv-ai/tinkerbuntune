import micromatch from 'micromatch'

export default (stagedFiles) => {
  const codeFiles = micromatch(stagedFiles, '*.?(*){j,t}s?(x|on*)', {
    matchBase: true,
  }).join(' ')

  const lintAndTests = codeFiles.length > 0
    ? [
        `bun --bun x eslint --max-warnings=0 --no-warn-ignored --fix --fix-type suggestion,layout,problem,directive -f unix ${codeFiles}`,
      ]
    : []

  const buildFiles = micromatch.some(
    stagedFiles,
    [
      './packages/*/(build,types)/**',
      'package.json$',
      'tsconfig*.json$',
      'typedoc.json$',
    ],
    {
      matchBase: true,
    },
  )

  const runBuild = buildFiles ? ['bun run build'] : []

  return [...lintAndTests, ...runBuild]
}
