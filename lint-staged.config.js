import micromatch from 'micromatch';

export default (stagedFiles) => {
  const buildFiles = micromatch(stagedFiles, [
    'packages/**/{build,types}',
  ]).join(' ');

  return buildFiles.length ? ['bun run build'] : [];
};
