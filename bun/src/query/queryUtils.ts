import { ValueOf } from "type-fest";

import type { TraverserMap, GroovyTraversal } from "groovy/dsl";

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
  limitX?: number;
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
  // FYI using next() > .elementMap().toList() to enable more complex chaining
  // @ts-ignore dunno how to fix this
  return end ? <Promise<NextResult<T>>>gt.next() : <T>gt;
};

export const throwEdgeEmpty = (
  edgeName: string,
  received?: unknown
): false | undefined => {
  if (!Array.isArray(received) || !received.length)
    throw new Error(
      `${edgeName} must be a non empty array\nreceived: ${received}`
    );

  return false;
};

export const throwInvalidQuery = (reason: string, ...extra: any[]) => {
  throw new Error(`Invalid Query\n${reason}\n${JSON.stringify(extra)}`);
};
