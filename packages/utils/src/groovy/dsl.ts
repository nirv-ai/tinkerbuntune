/**
 * @see https://tinkerpop.apache.org/docs/3.7.0/reference/#gremlin-javascript-dsl
 */
import gremlin, { type structure } from 'gremlin'

const { GraphTraversal, GraphTraversalSource } = gremlin.process

/**
 * redeclare types
 */
export type WithOptions = typeof gremlin.process.withOptions
export type EnumValue = gremlin.process.EnumValue
export type Nullable<T> = T | null
export type Traverser = typeof gremlin.process.Traverser
export type TraverserMap<T> = Map<string, T>
export type Graph = structure.Graph
export type Bytecode = gremlin.process.Bytecode
export type TraversalStrategies = gremlin.process.TraversalStrategies

/**
 * GroovyTraversal
 *
 * steps that are made available on this class are also available as spawns for anonymous traversals
 */
export class GroovyTraversal extends GraphTraversal {
  keys() {
    return this.valueMap().select(gremlin.process.column.keys)
  }

  override next<T>() {
    return super.next() as Promise<IteratorResult<T>>
  }

  nextMap<T>() {
    return this.next<TraverserMap<T>>()
  }
}

/**
 * spawns for anonymous traversals
 *
 * similar to gremlin.process.statics
 */
function anonymous() {
  /* eslint-disable-next-line unicorn/no-null */
  return new GroovyTraversal(null, null, new gremlin.process.Bytecode())
}
export const keys = () => anonymous().keys()

/**
 * GroovyTraversalSource
 *
 * Steps added here are meant to be start steps
 */
export class GroovyTraversalSource extends GraphTraversalSource<GroovyTraversal> {
  constructor(
    graph: Graph,
    traversalStrategies: TraversalStrategies,
    bytecode: Bytecode,
  ) {
    super(
      graph,
      traversalStrategies,
      bytecode,
      GroovyTraversalSource,
      GroovyTraversal,
    )
  }
}
