import * as buntest from "bun:test";

declare global {
  // bun stuff
  var describe: typeof buntest.describe;
  var expect: typeof buntest.expect;
  var test: typeof buntest.test;

  // not bun stuff
}

// bun stuff
// buntest.beforeAll(() => {
// TODO (noah): create a bug with bun: beforeAll isnt being executed before the tests
globalThis.describe = buntest.describe;
globalThis.expect = buntest.expect;
globalThis.test = buntest.test;

// not bun stuff
// });
