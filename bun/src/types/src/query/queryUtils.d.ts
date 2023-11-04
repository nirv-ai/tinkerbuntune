import { ValueOf } from "type-fest";
import type { TraverserMap, GroovyTraversal } from "groovy/dsl";
import { type EnumValue } from "groovy/common";
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
export declare const getBaseOpts: <T>(overrides: BaseOpts<T>) => {
    limitX: number;
    limitY: number;
    end: boolean;
} & T & {
    end?: boolean | undefined;
    limitX?: number | undefined;
    limitY?: number | undefined;
};
export type Next = {
    gt: NextT["GT"];
    end?: BaseOpts["end"];
};
export type NextResult<T> = {
    value: Map<string, T>;
    done: boolean;
};
/**
 * takes a {@link GroovyTraversal} and returns either a {@link GroovyTraversal} or {@link TraverserMap}
 * @see {@link NextT} for potential return types
 */
export declare const next: <T = NextTUnion>({ gt, end, }: Next) => T extends GroovyTraversal ? T : Promise<NextResult<T>>;
export declare const throwIfEmpty: (thing: string, received?: unknown) => false | undefined;
export declare const throwInvalidQuery: (reason: string, ...extra: any[]) => never;
export interface ElementProps {
    elements: NextT["GT"];
    elKeys?: (string | EnumValue)[];
    as?: string[];
}
export declare const elementProps: ({ as, elements, elKeys, }: ElementProps) => NextT["GT"];
export interface CombineProps extends Exclude<ElementProps, "as"> {
    traversals?: NextT["GT"][];
}
export declare const combineProps: ({ elements, elKeys, traversals, }: CombineProps) => GroovyTraversal;
export declare const groupByIdentity: ({ elements, elKeys, }: Exclude<ElementProps, "as">) => GroovyTraversal;
