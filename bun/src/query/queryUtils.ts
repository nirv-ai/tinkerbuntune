import { ValueOf } from "type-fest";

import type { TraverserMap, GroovyTraversal } from "groovy/dsl";
import { common } from "groovy/common";

const { t } = common;
const { keys, values } = common.column;
const { addAll } = common.operator;

const { project, select, unfold, union, valueMap } = common.__;

/**
 * Generic return type for a {@link GroovyTraversal} invocation
 * currently supports {@link GroovyTraversal} for chaining and {@link TraverserMap} for traversal results
 */
export interface NextT {
  GT: GroovyTraversal;
  TM: TraverserMap;
}

/**
 * union type of {@link NextT} object values
 */
export type NextTUnion = ValueOf<NextT>;

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

export type Next = { gt: NextT["GT"]; end?: BaseOpts["end"] };
export type NextResult<T> = { value: Map<string, T>; done: boolean };
/**
 * takes a {@link GroovyTraversal} and returns either a {@link GroovyTraversal} or {@link TraverserMap}
 * @see {@link NextT} for potential return types
 */
export const next = <T = NextTUnion>({
  gt,
  end = true,
}: Next): T extends NextT["GT"] ? T : Promise<NextResult<T>> => {
  // @ts-ignore dunno how to fix this
  // TODO (noah): find a more scalable pattern
  // ^ the generic type should be the underlying domain object and not just a traversal/promise
  return end ? <Promise<NextResult<T>>>gt.next() : <T>gt;
};

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
  elements: NextT["GT"];
  elKeys?: string[];
  as?: string[];
}
export const elementProps = ({
  elements,
  elKeys = [],
  as = [],
}: ElementProps): NextT["GT"] => {
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
export const combineProps = ({
  elements,
  elKeys = [],
}: Exclude<ElementProps, "as">) => {
  return elements.local(
    union(
      project("id", "label").by(t.id).by(t.label),
      valueMap(...elKeys).by(unfold())
    )
      .unfold()
      .group()
      .by(keys)
      .by(select(values))
  );
};
