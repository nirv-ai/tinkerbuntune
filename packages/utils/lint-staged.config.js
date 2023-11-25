import micromatch from 'micromatch';

export default (stagedFiles) => {
  const codeFiles = micromatch(stagedFiles, ['src/**/*.*{js,ts}']).join(' ');

  return codeFiles.length
    ? [
        `bunx eslint --fix ${codeFiles}`,
        `bun run test:ci ${codeFiles}`,
        'bun run build',
      ]
    : [];
};
