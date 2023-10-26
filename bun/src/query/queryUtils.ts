import { ValueOf } from "type-fest";

import type { TraverserMap, GroovyTraversal } from "groovy/dsl";

/**
 * Generic return type for a gremlin traversal
 * currently supports {@link GroovyTraversal} for chaining and {@link TraverserMap} for results
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
 * @prop limitX e.g. traversal.range(limitX, limitY)
 * @prop limitY e.g. traversal.range(limitX, limitY)
 * @prop end if truthy returns a traversal value, else returns a traversal for chaining
 */
export type BaseOpts<T = Record<string, any>> = T & {
  limitX?: number;
  limitY?: number;
  end?: boolean;
};

/**
 * helper fn for supplying options to a gremlin traversal
 * @param overrides
 * @returns
 */
export const getBaseOpts = <T>(overrides: BaseOpts<T>) => ({
  limitX: 0,
  limitY: (overrides.limitX ?? 0) + 10,
  ...overrides,
});

export type Next = { gt: NextT["GT"]; end?: BaseOpts["end"] };
/**
 * takes a {@link GroovyTraversal} and returns either a {@link GroovyTraversal} or {@link TraverserMap}
 * @see {@link NextT} for potential return types
 */
export const next = <T = NextTUnion>({
  gt,
  end = true,
}: Next): T extends NextT["GT"] ? T : Promise<T[]> => {
  // @ts-ignore dunno how to fix this
  return end ? <Promise<T[]>>gt.elementMap().toList() : <T>gt;
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

export const throwInvalidQuery = (reason: string) => {
  throw new Error(`Invalid Query\n${reason}`);
};
