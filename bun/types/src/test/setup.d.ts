import * as buntest from "bun:test";
import * as groovy from "groovy";
import * as query from "query";
declare global {
    var describe: typeof buntest.describe;
    var expect: typeof buntest.expect;
    var test: typeof buntest.test;
    type GroovyTraversal = groovy.GroovyTraversal;
    type TraverserMap = groovy.TraverserMap;
    var next: typeof query.next;
}
//# sourceMappingURL=setup.d.ts.map