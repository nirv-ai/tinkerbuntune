import type { ConfigSpec, TinkerDataEdge, TinkerDataVertex } from "types";
export declare const tinkerDataEdge: (tdata: TinkerDataEdge) => Map<string | import("gremlin").process.EnumValue, any>[][];
export declare const tinkerDataVertex: (tdata: TinkerDataVertex) => Map<string | import("gremlin").process.EnumValue, any>[];
/**
 * merges vertices and edges into a tinkergraph based on a specification
 */
export declare const tinkerData: (data: TinkerDataEdge[] | TinkerDataVertex[], spec: ConfigSpec) => Promise<{
    success: string[];
    failure: string[];
}>;
//# sourceMappingURL=loaders.d.ts.map