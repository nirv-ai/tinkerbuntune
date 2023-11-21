import * as buntest from "bun:test";

import * as groovy from "groovy";
import * as query from "query";
import type * as types from "types";

declare global {
  // bun stuff
  var describe: typeof buntest.describe;
  var expect: typeof buntest.expect;
  var test: typeof buntest.test;
  var config: types.Config;
  var configSpec: types.ConfigSpec;

  // not bun stuff
  type GroovyTraversal = groovy.GroovyTraversal;
}

// bun stuff
globalThis.describe = buntest.describe;
globalThis.expect = buntest.expect;
globalThis.test = buntest.test;

// not bun stuff
