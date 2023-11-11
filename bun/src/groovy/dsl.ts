/**
 * @see https://tinkerpop.apache.org/docs/3.7.0/reference/#gremlin-javascript-dsl
 */
import gremlin, { type structure } from "gremlin";

const { GraphTraversal, GraphTraversalSource } = gremlin.process;

/**
 * redeclare types
 */
export type Nullable<T> = T | null;
export type Traverser = typeof gremlin.process.Traverser;
export type TraverserMap<T = unknown> = Traverser &
  IteratorResult<Map<string, T>, Map<string, T>>;
export interface Graph extends structure.Graph {}
export interface Bytecode extends gremlin.process.Bytecode {}
export interface TraversalStrategies
  extends gremlin.process.TraversalStrategies {}

/**
 * GroovyTraversal
 *
 * steps that are made available on this class are also available as spawns for anonymous traversals
 */
export class GroovyTraversal extends GraphTraversal {
  constructor(
    graph: Nullable<Graph>,
    traversalStrategies: Nullable<TraversalStrategies>,
    bytecode: Bytecode
  ) {
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
export class GroovyTraversalSource extends GraphTraversalSource<GroovyTraversal> {
  constructor(
    graph: Graph,
    traversalStrategies: TraversalStrategies,
    bytecode: Bytecode
  ) {
    super(
      graph,
      traversalStrategies,
      bytecode,
      GroovyTraversalSource,
      GroovyTraversal
    );
  }
}
