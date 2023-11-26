export const log = (msg: string, ...x: unknown[]) => {
  // eslint-disable-next-line no-console
  console.info(`${Date()}\n`, `${msg}\n`, ...x, '\n\n')
}
