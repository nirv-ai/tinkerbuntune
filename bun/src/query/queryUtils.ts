import type { TraverserMap, GroovyTraversal } from "groovy/dsl";
import { common, type EnumValue } from "groovy/common";

const { t } = common;
const { keys, values } = common.column;
const { addAll } = common.operator;
const { flatMap, group, identity, project, select, unfold, union, valueMap } =
  common.__;

/**
 * base opts for a gremlin traversal
 * @prop end if truthy returns a traversal value, else returns a traversal for chaining
 * @prop limitX e.g. traversal.range(limitX, limitY)
 * @prop limitY e.g. traversal.range(limitX, limitY)
 */
export type BaseOpts<T = Record<string, any>> = T & {
  end?: unknown;
  limitX?: number; // TODO (noah): this should be an array of limits
  limitY?: number;
};

/**
 * helper fn for supplying options to a {@link GroovyTraversal}
 * @param overrides
 * @returns
 */
export const getBaseOpts = <T>(overrides: BaseOpts<T>) => ({
  limitX: 0,
  limitY: (overrides.limitX ?? 0) + 10,
  ...overrides,
});

export type Next = { gt: GroovyTraversal; end?: unknown };
/**
 * returns a {@link TraverserMap} that resolves to T
 * @param nextOps {@link Next}
 */
export function next<T = unknown>(
  nextOps: Omit<Next, "end">
): Promise<TraverserMap<T>>;
/**
 * returns a {@link GroovyTraversal} for chaining
 * @param nextOpts {@link Next}
 */
export function next<T = GroovyTraversal>(nextOpts: Next): GroovyTraversal;
export function next<T = GroovyTraversal>(nextOpts: Next) {
  return typeof nextOpts.end === "undefined"
    ? <Promise<TraverserMap<T>>>nextOpts.gt.next()
    : <GroovyTraversal>nextOpts.gt;
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

// @see https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
function replacer(key: unknown, value: unknown) {
  if (value instanceof Map) {
    return Object.fromEntries(value.entries());
  } else {
    return value;
  }
}
export const toJson = <T = Record<any, any>>(data: unknown): T =>
  JSON.parse(JSON.stringify(data, replacer));
