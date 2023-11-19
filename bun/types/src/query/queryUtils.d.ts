import type { TraverserMap, GroovyTraversal } from "groovy/dsl";
import { type EnumValue } from "groovy/common";
declare const identity: (...args: any[]) => import("gremlin").process.GraphTraversal;
/**
 * base opts for a gremlin traversal
 * @prop end if truthy returns a traversal value, else returns a traversal for chaining
 * @prop limitX e.g. traversal.range(limitX, limitY)
 * @prop limitY e.g. traversal.range(limitX, limitY)
 */
export type BaseOpts<T = Record<string, any>> = T & {
    end?: unknown;
    limitX?: number;
    limitY?: number;
};
/**
 * helper fn for supplying options to a {@link GroovyTraversal}
 * @param overrides
 * @returns
 */
export declare const getBaseOpts: <T>(overrides: BaseOpts<T>) => {
    limitX: number;
    limitY: number;
} & T & {
    end?: unknown;
    limitX?: number | undefined;
    limitY?: number | undefined;
};
export type Next = {
    gt: GroovyTraversal;
    end?: unknown;
};
/**
 * returns a {@link TraverserMap} that resolves to T
 * @param nextOps {@link Next}
 */
export declare function next<T = unknown>(nextOps: Omit<Next, "end">): Promise<TraverserMap<T>>;
/**
 * returns a {@link GroovyTraversal} for chaining
 * @param nextOpts {@link Next}
 */
export declare function next<T = GroovyTraversal>(nextOpts: Next): GroovyTraversal;
export declare const throwIfEmpty: (thing: string, received?: unknown) => false | undefined;
export declare const throwInvalidQuery: (reason: string, ...extra: any[]) => never;
export interface ElementProps {
    elements?: GroovyTraversal | ReturnType<typeof identity>;
    elKeys?: (string | EnumValue)[];
    as?: string[];
}
export declare const elementProps: ({ as, elements, elKeys, }: ElementProps) => GroovyTraversal;
export interface CombineProps extends Exclude<ElementProps, "as"> {
    traversals?: GroovyTraversal[];
}
export declare const combineProps: ({ elements, elKeys, traversals, }: CombineProps) => GroovyTraversal;
export declare const groupByIdentity: ({ elements, elKeys, }: Exclude<ElementProps, "as">) => GroovyTraversal;
export {};
//# sourceMappingURL=queryUtils.d.ts.map