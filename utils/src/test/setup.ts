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
  var config: types.Config;
  var g: typeof remote.g;
}

// bun stuff
globalThis.describe = buntest.describe;
globalThis.expect = buntest.expect;
globalThis.test = buntest.test;

// not bun stuff
globalThis.g = remote.g;
globalThis.common = groovy.common;
