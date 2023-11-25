export const log = (msg: string, ...x: any) => {
  console.info(`${Date()}\n`, `${msg}\n`, ...x, '\n\n')
}
