/**
 * @see  https://tinkerpop.apache.org/docs/3.7.0/reference/#gremlin-javascript-imports
 *
 * common imports to match globals available in gremlin-groovy
 * useful for those coming from the practical gremlin book
 * and want a similar environment in bun without violating typescript best practices
 */

import gremlin from "gremlin";

// TODO: create bug in apache repo: this doesnt exist on gremlin.process
// const CardinalityValue = gremlin.process.CardinalityValue;

export const common = {
  ...gremlin.process,
  ...gremlin.process.P,
  ...gremlin.process.order,
  gremlin: gremlin,
  operator: gremlin.process.operator,
  p: gremlin.process.P,
  traversal: gremlin.process.AnonymousTraversalSource.traversal,
  DriverRemoteConnection: gremlin.driver.DriverRemoteConnection,
  __: gremlin.process.statics,
  textp: gremlin.process.TextP,
  Direction: {
    BOTH: gremlin.process.direction.both,
    from_: gremlin.process.direction.in,
    IN: gremlin.process.direction.in,
    OUT: gremlin.process.direction.out,
    to: gremlin.process.direction.out,
  },
};

[
  "P",
  "AnonymousTraversalSource",
  "statics",
  "driver",
  "TextP",
  "direction",
  // @ts-ignore
].forEach((prop) => delete common[prop]);

export type WithOptions = typeof common.withOptions;
