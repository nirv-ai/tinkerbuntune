/**
 * @see  https://tinkerpop.apache.org/docs/3.7.0/reference/#gremlin-javascript-imports
 *
 * common imports to match globals available in gremlin-groovy
 * useful for those coming from the practical gremlin book
 * and want a similar environment in bun without violating typescript best practices
 */

import gremlin from "gremlin";

// NIRVAI
export enum EDir {
  out = "out",
  in = "in",
}

// TODO: create bug in apache repo: this doesnt exist on gremlin.process
// ^ const CardinalityValue = gremlin.process.CardinalityValue;

// re-export types
export type WithOptions = typeof gremlin.process.withOptions;
export type EnumValue = gremlin.process.EnumValue;

const __ = gremlin.process.statics;
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
  go: {
    [EDir.in]: {
      in_: __.in_,
      inE: __.inE,
      inV: __.inV,
    },
    [EDir.out]: {
      out: __.out,
      outE: __.outE,
      outV: __.outV,
    },
  },
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
