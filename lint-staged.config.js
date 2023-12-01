// @ts-check
import micromatch from 'micromatch';

export default (stagedFiles) => {
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
    }
  );

  // console.info('\n\n root/files', buildFiles);

  return buildFiles ? ['bun run build'] : [];
};
