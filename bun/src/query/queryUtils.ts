import { TraverserMap, GroovyTraversal } from "groovy/dsl";
import { common, type EnumValue } from "groovy/common";

const { t } = common;
const { keys, values } = common.column;
const { addAll } = common.operator;
const { flatMap, group, identity, project, select, unfold, union, valueMap } =
  common.__;

/**
 * base opts for a gremlin traversal
 * @prop end if false returns a GroovyTraveral for chaining
 * @prop limitX e.g. traversal.range(limitX, limitY)
 * @prop limitY e.g. traversal.range(limitX, limitY)
 */
export type OptsForResult = {
  limitX?: number; // TODO (noah): this should be an array of limits
  limitY?: number;
};
export type BaseOpts<T extends { [x: string]: any }> = T["end"] extends "T"
  ? T & OptsForResult
  : { end: "F" } & OptsForResult;
export type CreateBaseOpts<T, Opts> = BaseOpts<{ end: T }> & Opts;
/**
 * helper fn for supplying options to a {@link GroovyTraversal}
 * @param overrides
 * @returns
 */
export const getBaseOpts = <T extends { [x: string]: any }>(
  overrides: BaseOpts<T>
) => ({
  ...overrides,
  limitX: overrides.limitX ?? 0,
  limitY: overrides.limitY ?? (overrides.limitX ?? 0) + 10,
});

export function isGroovy(
  gt: any,
  end?: "T" | "F" | undefined
): gt is GroovyTraversal {
  return end === "F";
}

export const throwIfEmpty = (
  thing: string,
  received?: unknown
): false | undefined => {
  if (!Array.isArray(received) || !received.length)
    throw new Error(
      `${thing} must be a non empty array\nreceived: ${received}`
    );

  return false;
};

export const throwInvalidQuery = (reason: string, ...extra: any[]) => {
  throw new Error(`Invalid Query\n${reason}\n${JSON.stringify(extra)}`);
};

/*
  uses sack to create an updatable object over the lifetime of a traversal
*/
export interface ElementProps {
  elements?: GroovyTraversal | ReturnType<typeof identity>;
  elKeys?: (string | EnumValue)[];
  as?: string[];
}
export const elementProps = ({
  as = [],
  elements = identity(),
  elKeys = [],
}: ElementProps): GroovyTraversal => {
  // @ts-ignore GraphTraversal doesnt have keys
  return elements
    .as(...as.concat("base"))
    .valueMap(...elKeys)
    .by(unfold())
    .sack(addAll)
    .select("base")
    .project("id", "label")
    .by(t.id)
    .by(t.label)
    .sack(addAll);
};

/*
  a simpler version of elementProps that adds id & label
*/
export interface CombineProps extends Exclude<ElementProps, "as"> {
  traversals?: GroovyTraversal[];
}
export const combineProps = ({
  elements = identity(),
  elKeys = [],
  traversals = [],
}: CombineProps): GroovyTraversal => {
  // @ts-ignore GraphTraversal doesnt have keys
  return elements.local(
    union(
      project("id", "label").by(t.id).by(t.label),
      valueMap(...elKeys).by(unfold()),
      ...traversals
    )
      .unfold()
      .group()
      .by(keys)
      .by(select(values))
  );
};

/*
  groups an element by some key
*/
export const groupByIdentity = ({
  elements = identity(),
  elKeys = [],
}: Exclude<ElementProps, "as">): GroovyTraversal =>
  // @ts-ignore GraphTraversal doesnt have keys
  elements
    .group()
    .by(elKeys[0] ?? t.id)
    .by(flatMap(identity()));
