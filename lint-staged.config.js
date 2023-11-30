import micromatch from 'micromatch';

export default (stagedFiles) => {
  const buildFiles = micromatch(stagedFiles, [
    '**/packages/**/{build,types}',
    '**/package.json',
    '**/tsconfig*.json',
    '**/typedoc.json',
  ]);

  // console.info('\n\n root/files', buildFiles);

  return [];
  return buildFiles.length ? ['bun run build'] : [];
};
