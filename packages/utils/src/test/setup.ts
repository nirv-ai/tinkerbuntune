import * as buntest from 'bun:test'

import type * as types from '#utils'
import * as utils from '#utils'

declare global {

  // bun stuff
  var describe: typeof buntest.describe
  var expect: typeof buntest.expect
  var test: typeof buntest.test

  // not bun stuff
  type GroovyTraversal = utils.GroovyTraversal
  var common: typeof utils.common
  var configs: Record<string, Map<string, types.Config>>
  var g: typeof utils.g
  var testCsvDirPath: string
}

// bun stuff
globalThis.describe = buntest.describe
globalThis.expect = buntest.expect
globalThis.test = buntest.test

// not bun stuff
globalThis.g = utils.g
globalThis.common = utils.common
globalThis.testCsvDirPath = `${import.meta.dir}/csvs`
globalThis.configs = {
  good: new Map([
    ['functionSpecs', {}],
    ['jsonSpecs', {}],
    ['recursiveSpecs', {}],
    ['mixedSpec', {}],
  ]),
  bad: new Map([
    ['noMatchingCsvSpec', {}],
    ['configWithNoFiles', {}],
  ]),
}
