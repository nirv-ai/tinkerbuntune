/**
 * @see https://tinkerpop.apache.org/docs/3.7.0/reference/#gremlin-javascript-dsl
 */
import gremlin, { type structure } from "gremlin";
declare const GraphTraversal: typeof gremlin.process.GraphTraversal, GraphTraversalSource: typeof gremlin.process.GraphTraversalSource;
/**
 * redeclare types
 */
export type Nullable<T> = T | null;
export type Traverser = typeof gremlin.process.Traverser;
export type TraverserMap = Traverser & Map<string, any>;
export interface Graph extends structure.Graph {
}
export interface Bytecode extends gremlin.process.Bytecode {
}
export interface TraversalStrategies extends gremlin.process.TraversalStrategies {
}
/**
 * GroovyTraversal
 *
 * steps that are made available on this class are also available as spawns for anonymous traversals
 */
export declare class GroovyTraversal extends GraphTraversal {
    constructor(graph: Nullable<Graph>, traversalStrategies: Nullable<TraversalStrategies>, bytecode: Bytecode);
    keys(): this;
}
export declare const keys: () => GroovyTraversal;
/**
 * GroovyTraversalSource
 *
 * Steps added here are meant to be start steps
 */
export declare class GroovyTraversalSource extends GraphTraversalSource<GroovyTraversal> {
    constructor(graph: Graph, traversalStrategies: TraversalStrategies, bytecode: Bytecode);
}
export {};
