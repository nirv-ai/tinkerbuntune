import micromatch from 'micromatch';

export default async (stagedFiles) => {
  const codeFiles = micromatch(stagedFiles, ['**/src/**/*.*{js,ts}?(x)']).join(
    ' '
  );
  const bulidFiles = micromatch(stagedFiles, [
    '**/tsconfig*.json',
    '**/package.json',
  ]).join(' ');

  // console.info('\n\n utils/codeFiles', codeFiles);
  const tsOnly = micromatch(stagedFiles, ['**/**.*ts?(x)']).join(' ');

  const tsLinters = tsOnly.length
    ? [
        `bunx typescript-coverage-report -o './coverage-ts' -p './tsconfig.build.json' --cache=false -s=true -t=99`,
      ]
    : [];

  const linters = codeFiles.length
    ? [
        `bunx --bun eslint --max-warnings=0 --no-warn-ignored --fix --fix-type suggestion,layout,problem,directive -f unix ${codeFiles}`,
        `bun run test:ci ${codeFiles}`,
      ]
    : [];

  return tsLinters.concat(
    linters.length || bulidFiles.length ? linters.concat('bun run build') : []
  );
};
