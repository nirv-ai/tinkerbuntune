import micromatch from 'micromatch';

export default (stagedFiles) => {
  const codeFiles = micromatch(stagedFiles, ['**/src/**/*.*{js,ts}']).join(' ');
  const bulidFiles = micromatch(stagedFiles, [
    '**/tsconfig*.json',
    '**/package.json',
  ]).join(' ');

  // console.info('\n\n utils/codeFiles', codeFiles);
  const linters = codeFiles.length
    ? [
        `bunx --bun eslint --fix src --fix-type directive, problem, suggestion, layout ${codeFiles}`,
        `bun run test:ci ${codeFiles}`,
      ]
    : [];

  return linters.length || bulidFiles.length
    ? linters.concat('bun run build', 'git add -A')
    : [];
};
