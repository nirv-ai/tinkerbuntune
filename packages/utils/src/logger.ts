export const log = (message: string, ...x: unknown[]) => {
  console.info(`${new Date().toString()}\n`, `${message}\n`, ...x, '\n\n')
}
