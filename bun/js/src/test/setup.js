import * as buntest from "bun:test";
import * as query from "query";
// bun stuff
globalThis.describe = buntest.describe;
globalThis.expect = buntest.expect;
globalThis.test = buntest.test;
// not bun stuff
globalThis.next = query.next;
