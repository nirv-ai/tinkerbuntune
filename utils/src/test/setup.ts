import * as buntest from "bun:test";

import * as remote from "remote";
import * as groovy from "groovy";
import type * as types from "types";

declare global {
  // bun stuff
  var describe: typeof buntest.describe;
  var expect: typeof buntest.expect;
  var test: typeof buntest.test;

  // not bun stuff
  type GroovyTraversal = groovy.GroovyTraversal;
  var common: typeof groovy.common;
  var configs: Record<string, Map<string, types.Config>>;
  var g: typeof remote.g;
  var testCsvDirPath: string;
}

// bun stuff
globalThis.describe = buntest.describe;
globalThis.expect = buntest.expect;
globalThis.test = buntest.test;

// not bun stuff
globalThis.g = remote.g;
globalThis.common = groovy.common;
globalThis.testCsvDirPath = `${import.meta.dir}/csvs`;
globalThis.configs = {
  good: new Map([
    ["functionSpecs", {}],
    ["jsonSpecs", {}],
    ["recursiveSpecs", {}],
    ["mixedSpec", {}],
  ]),
  bad: new Map([
    ["noMatchingCsvSpec", {}],
    ["configWithNoFiles", {}],
  ]),
};
