/**
 * @see  https://tinkerpop.apache.org/docs/3.7.0/reference/#gremlin-javascript-imports
 *
 * common imports to match globals available in gremlin-groovy
 * useful for those coming from the practical gremlin book
 * and want a similar environment in bun without violating typescript best practices
 */

import gremlin from "gremlin";

const __ = gremlin.process.statics;
// NIRVAI
// programmaticaly traverse the graph
// allowing the consumer to inspect the ege/vert along the way
export enum EDir {
  out = "out",
  in = "in",
}
// @see https://tinkerpop.apache.org/docs/3.7.0/reference/#vertex-stepsm0ren1rv!
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
  };
  if (dir === EDir.in) {
    return {
      ...base,
      to: {
        e: __.inE,
        v: __.in_,
      },
    };
  } else if (dir === EDir.out) {
    return {
      ...base,
      to: {
        e: __.outE,
        v: __.out,
      },
    };
  } else throw new Error(`invalid direction, expect in|out`);
};

// TODO: create bug in apache repo: this doesnt exist on gremlin.process
// ^ const CardinalityValue = gremlin.process.CardinalityValue;

// re-export types
export type WithOptions = typeof gremlin.process.withOptions;
export type EnumValue = gremlin.process.EnumValue;

export const common = {
  ...gremlin.process,
  gremlin: gremlin,
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
  "P",
  "AnonymousTraversalSource",
  "statics",
  "driver",
  "TextP",
  "direction",
  // @ts-ignore
].forEach((prop) => delete common[prop]);
