export const log = (message: string, ...x: unknown[]) => {
  // eslint-disable-next-line no-console
  console.info(`${new Date()}\n`, `${message}\n`, ...x, '\n\n')
}
