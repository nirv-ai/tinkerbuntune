import micromatch from 'micromatch';

export default (stagedFiles) => {
  const buildFiles = micromatch(stagedFiles, [
    '**/packages/**/{build,types}',
    '**/tsconfig*.json',
    '**/typedoc.json',
  ]).join(' ');

  // console.info('\n\n root/files', buildFiles);

  return buildFiles.length ? ['bun run build'] : [];
};
