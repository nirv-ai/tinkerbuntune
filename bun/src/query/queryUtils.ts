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
  end?: boolean;
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
  end: true,
  ...overrides,
});

export type Next = { gt: GroovyTraversal; end?: unknown };
export type NextResult<T> = Promise<TraverserMap<T>>;
/**
 * fuck typescript
 * give param `end` any value and it will return {@link GroovyTraversal}
 * else it returns a fucking {@link NextResult} of type T
 */
export function next<T = GroovyTraversal>({
  gt,
  end,
}: Next): T extends GroovyTraversal ? GroovyTraversal : NextResult<T> {
  // @ts-ignore fk typescript
  return typeof end !== "undefined"
    ? <GroovyTraversal>gt
    : <NextResult<T>>gt.next();
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
  elements: GroovyTraversal;
  elKeys?: (string | EnumValue)[];
  as?: string[];
}
export const elementProps = ({
  as = [],
  elements,
  elKeys = [],
}: ElementProps): GroovyTraversal => {
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
  elements,
  elKeys = [],
  traversals = [],
}: CombineProps) => {
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
  elements,
  elKeys = [],
}: Exclude<ElementProps, "as">) =>
  elements
    .group()
    .by(elKeys[0] ?? t.id)
    .by(flatMap(identity()));
