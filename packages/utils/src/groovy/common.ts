import gremlin from 'gremlin'
import { type GroovyTraversal } from './dsl'

const __ = gremlin.process.statics as gremlin.process.Statics<GroovyTraversal>

/**
 * used with {@link go} to programmatically traverse the graph
 * consumers dont need to know the direction, but can still pick the edge/vert
 */
export enum EDir {
  out = 'out',
  in = 'in',
}

/**
 * aids in reusing traversal patterns
 * e.g. a bunch of common queries from V > E > V can be specified in a json config
 * { x: [vID, eID, vID], y: [vID, eID, vID]} you can use {@link go} to automatically traverse this graph
 * @param dir {@link EDir}
 * @returns
 */
export const go = (dir: EDir) => {
  const base = {
    both: __.both,
    bothE: __.bothE,
    bothV: __.bothV,
    otherV: __.otherV,
    inV: __.inV,
    outV: __.outV,
    inE: __.inE,
    in: __.in_,
    outE: __.outE,
    out: __.out,
  }

  switch (dir) {
    case EDir.in:
      return {
        ...base,
        to: {
          e: __.inE,
          v: __.in_,
        },
      }
    case EDir.out:
      return {
        ...base,
        to: {
          e: __.outE,
          v: __.out,
        },
      }
    default:
      throw new Error(`invalid: ${dir}\nexpected an EDir}`)
  }
}

/**
 * common imports to match globals available in gremlin-groovy.
 * useful for those coming from the practical gremlin book
 * and want a similar environment in bun without violating typescript best practices
 * @see  https://tinkerpop.apache.org/docs/3.7.0/reference/#gremlin-javascript-imports
 */
export const common = {
  ...gremlin.process,
  gremlin,
  p: gremlin.process.P,
  traversal: gremlin.process.AnonymousTraversalSource.traversal,
  DriverRemoteConnection: gremlin.driver.DriverRemoteConnection,
  __,
  textp: gremlin.process.TextP,
  Direction: {
    BOTH: gremlin.process.direction.both,
    from_: gremlin.process.direction.in,
    IN: gremlin.process.direction.in,
    OUT: gremlin.process.direction.out,
    to: gremlin.process.direction.out,
  },
  go,
};

// remove these duplicates since we destuctured them under different names
[
  'P',
  'AnonymousTraversalSource',
  'statics',
  'driver',
  'TextP',
  'direction',

  // @ts-expect-error implicit any
].forEach(prop => delete common[prop])
