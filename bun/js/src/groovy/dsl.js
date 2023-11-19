/**
 * @see https://tinkerpop.apache.org/docs/3.7.0/reference/#gremlin-javascript-dsl
 */
import gremlin from "gremlin";
const { GraphTraversal, GraphTraversalSource } = gremlin.process;
/**
 * GroovyTraversal
 *
 * steps that are made available on this class are also available as spawns for anonymous traversals
 */
export class GroovyTraversal extends GraphTraversal {
    constructor(graph, traversalStrategies, bytecode) {
        super(graph, traversalStrategies, bytecode);
    }
    keys() {
        return this.valueMap().select(gremlin.process.column.keys);
    }
}
/**
 * spawns for anonymous traversals
 *
 * similar to gremlin.process.statics
 */
function anonymous() {
    return new GroovyTraversal(null, null, new gremlin.process.Bytecode());
}
export const keys = () => anonymous().keys();
/**
 * GroovyTraversalSource
 *
 * Steps added here are meant to be start steps
 */
export class GroovyTraversalSource extends GraphTraversalSource {
    constructor(graph, traversalStrategies, bytecode) {
        super(graph, traversalStrategies, bytecode, GroovyTraversalSource, GroovyTraversal);
    }
}
