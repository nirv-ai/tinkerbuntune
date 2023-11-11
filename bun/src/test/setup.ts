import * as buntest from "bun:test";

import * as groovy from "groovy";
import * as query from "query";

declare global {
  // bun stuff
  var describe: typeof buntest.describe;
  var expect: typeof buntest.expect;
  var test: typeof buntest.test;

  // not bun stuff
  type GroovyTraversal = groovy.GroovyTraversal;
  type TraverserMap = groovy.TraverserMap;
  var next: typeof query.next;
}

// bun stuff
globalThis.describe = buntest.describe;
globalThis.expect = buntest.expect;
globalThis.test = buntest.test;

// not bun stuff
globalThis.next = query.next;
