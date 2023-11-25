/// <reference types="bun-types" />
/// <reference types="gremlin" />
declare module "eslint.config" {
    const _default: any[];
    export default _default;
}
declare module "src/api/serialization" {
    import { encode, decode, decodeAsync, ExtensionCodec } from '@msgpack/msgpack';
    /**
     *
     * @param object
     */
    export function deepFreezeCopy(object: any): any;
    /**
     *
     * @param map
     */
    export function mapToJsonIterator<T = Record<any, any>>(map: Map<any, any>): T;
    export const toJson: <T = Record<any, any>>(data: Map<any, any>) => T;
    /**
     *
     * @param key
     * @param value
     */
    export function mapTojsonReplacer(key: unknown, value: unknown): any;
    export const toJsonStringified: (data: Map<any, any>) => string;
    export const toBunBuffer: (data: unknown) => SharedArrayBuffer;
    export const fromBunBuffer: <T = unknown>(data: ArrayBufferLike | TypedArray | Buffer) => T;
    export const encoder: {
        encode: typeof encode;
    };
    export const decoder: {
        decode: typeof decode;
        decodeAsync: typeof decodeAsync;
    };
    export const extensionCodec: ExtensionCodec<undefined>;
    export const MSGPACK_HEADERS: {
        'Content-Type': string;
    };
    export const SET_EXT_TYPE = 0;
    export const MAP_EXT_TYPE = 1;
    export const msgpackToJsonIterator: <T = Record<any, any>>(arr: [any, any]) => T;
    export const msgpackToJson: <T = Record<any, any>>(resp: Response) => Promise<T | null>;
}
declare module "src/api/index" {
    export * from "src/api/serialization";
}
declare module "src/browser" {
    export * from "src/api/index";
}
declare module "src/groovy/dsl" {
    /**
     * @see https://tinkerpop.apache.org/docs/3.7.0/reference/#gremlin-javascript-dsl
     */
    import gremlin, { type structure } from 'gremlin';
    const GraphTraversal: typeof gremlin.process.GraphTraversal, GraphTraversalSource: typeof gremlin.process.GraphTraversalSource;
    /**
     * redeclare types
     */
    export type WithOptions = typeof gremlin.process.withOptions;
    export type EnumValue = gremlin.process.EnumValue;
    export type Nullable<T> = T | null;
    export type Traverser = typeof gremlin.process.Traverser;
    export type TraverserMap<T> = Map<string, T>;
    export type Graph = structure.Graph;
    export type Bytecode = gremlin.process.Bytecode;
    export type TraversalStrategies = gremlin.process.TraversalStrategies;
    /**
     * GroovyTraversal
     *
     * steps that are made available on this class are also available as spawns for anonymous traversals
     */
    export class GroovyTraversal extends GraphTraversal {
        constructor(graph: Nullable<Graph>, traversalStrategies: Nullable<TraversalStrategies>, bytecode: Bytecode);
        keys(): this;
        next<T>(): Promise<IteratorResult<T, any>>;
        nextMap<T>(): Promise<IteratorResult<TraverserMap<T>, any>>;
    }
    export const keys: () => GroovyTraversal;
    /**
     * GroovyTraversalSource
     *
     * Steps added here are meant to be start steps
     */
    export class GroovyTraversalSource extends GraphTraversalSource<GroovyTraversal> {
        constructor(graph: Graph, traversalStrategies: TraversalStrategies, bytecode: Bytecode);
    }
}
declare module "src/groovy/common" {
    import gremlin from 'gremlin';
    import { type GroovyTraversal } from "src/groovy/dsl";
    /**
     * used with {@link go} to programmatically traverse the graph
     * consumers dont need to know the direction, but can still pick the edge/vert
     */
    export enum EDir {
        out = "out",
        in = "in"
    }
    /**
     * aids in reusing traversal patterns
     * e.g. a bunch of common queries from V > E > V can be specified in a json config
     * { x: [vID, eID, vID], y: [vID, eID, vID]} you can use {@link go} to automatically traverse this graph
     * @param dir {@link EDir}
     * @returns
     */
    export const go: (dir: EDir) => {
        to: {
            e: (...args: any[]) => GroovyTraversal;
            v: (...args: any[]) => GroovyTraversal;
        };
        both: (...args: any[]) => GroovyTraversal;
        bothE: (...args: any[]) => GroovyTraversal;
        bothV: (...args: any[]) => GroovyTraversal;
        otherV: (...args: any[]) => GroovyTraversal;
        inV: (...args: any[]) => GroovyTraversal;
        outV: (...args: any[]) => GroovyTraversal;
        inE: (...args: any[]) => GroovyTraversal;
        in: (...args: any[]) => GroovyTraversal;
        outE: (...args: any[]) => GroovyTraversal;
        out: (...args: any[]) => GroovyTraversal;
    };
    /**
     * common imports to match globals available in gremlin-groovy.
     * useful for those coming from the practical gremlin book
     * and want a similar environment in bun without violating typescript best practices
     * @see  https://tinkerpop.apache.org/docs/3.7.0/reference/#gremlin-javascript-imports
     */
    export const common: {
        gremlin: typeof gremlin;
        p: typeof gremlin.process.P;
        traversal: typeof gremlin.process.AnonymousTraversalSource.traversal;
        DriverRemoteConnection: typeof gremlin.driver.DriverRemoteConnection;
        __: gremlin.process.Statics<GroovyTraversal>;
        textp: typeof gremlin.process.TextP;
        Direction: {
            BOTH: gremlin.process.EnumValue;
            from_: gremlin.process.EnumValue;
            IN: gremlin.process.EnumValue;
            OUT: gremlin.process.EnumValue;
            to: gremlin.process.EnumValue;
        };
        go: (dir: EDir) => {
            to: {
                e: (...args: any[]) => GroovyTraversal;
                v: (...args: any[]) => GroovyTraversal;
            };
            both: (...args: any[]) => GroovyTraversal;
            bothE: (...args: any[]) => GroovyTraversal;
            bothV: (...args: any[]) => GroovyTraversal;
            otherV: (...args: any[]) => GroovyTraversal;
            inV: (...args: any[]) => GroovyTraversal;
            outV: (...args: any[]) => GroovyTraversal;
            inE: (...args: any[]) => GroovyTraversal;
            in: (...args: any[]) => GroovyTraversal;
            outE: (...args: any[]) => GroovyTraversal;
            out: (...args: any[]) => GroovyTraversal;
        };
        Bytecode: typeof gremlin.process.Bytecode;
        EnumValue: typeof gremlin.process.EnumValue;
        P: typeof gremlin.process.P;
        TextP: typeof gremlin.process.TextP;
        Traversal: typeof gremlin.process.Traversal;
        TraversalSideEffects: typeof gremlin.process.TraversalSideEffects;
        TraversalStrategies: typeof gremlin.process.TraversalStrategies;
        TraversalStrategy: typeof gremlin.process.TraversalStrategy;
        Traverser: typeof gremlin.process.Traverser;
        barrier: {
            normSack: gremlin.process.EnumValue;
        };
        cardinality: {
            list: gremlin.process.EnumValue;
            set: gremlin.process.EnumValue;
            single: gremlin.process.EnumValue;
        };
        column: {
            keys: gremlin.process.EnumValue;
            values: gremlin.process.EnumValue;
        };
        direction: gremlin.process.Direction;
        graphSONVersion: {
            v1_0: gremlin.process.EnumValue;
            v2_0: gremlin.process.EnumValue;
            v3_0: gremlin.process.EnumValue;
        };
        gryoVersion: {
            v1_0: gremlin.process.EnumValue;
            v3_0: gremlin.process.EnumValue;
        };
        merge: gremlin.process.Merge;
        operator: gremlin.process.Operator;
        order: {
            asc: gremlin.process.EnumValue;
            desc: gremlin.process.EnumValue;
            shuffle: gremlin.process.EnumValue;
        };
        pick: {
            any: gremlin.process.EnumValue;
            none: gremlin.process.EnumValue;
        };
        pop: {
            all: gremlin.process.EnumValue;
            first: gremlin.process.EnumValue;
            last: gremlin.process.EnumValue;
            mixed: gremlin.process.EnumValue;
        };
        scope: {
            global: gremlin.process.EnumValue;
            local: gremlin.process.EnumValue;
        };
        t: {
            id: gremlin.process.EnumValue;
            key: gremlin.process.EnumValue;
            label: gremlin.process.EnumValue;
            value: gremlin.process.EnumValue;
        };
        GraphTraversal: typeof gremlin.process.GraphTraversal;
        GraphTraversalSource: typeof gremlin.process.GraphTraversalSource;
        statics: gremlin.process.Statics<gremlin.process.GraphTraversal>;
        Translator: typeof gremlin.process.Translator;
        AnonymousTraversalSource: typeof gremlin.process.AnonymousTraversalSource;
        withOptions: gremlin.process.WithOptions;
        Transaction: typeof gremlin.process.Transaction;
    };
}
declare module "src/groovy/index" {
    export * from "src/groovy/common";
    export * from "src/groovy/dsl";
}
declare module "src/logger" {
    export const log: (msg: string, ...x: any) => void;
}
declare module "src/loader/utils" {
    import type { NumStr } from "src/index";
    /**
     * drops the extension from a path
     * @param fname string e.g. blah.csv
     * @returns string
     */
    export const fnameToBname: (fname: string) => string;
    /**
     * adds an extension to a filename
     * @param bname a filename e.g. `blah`
     * @param ext to add to filename e.g. `csv`
     * @returns string with extension added
     */
    export const bnameTofname: (bname: string, ext?: string) => string;
    /**
     * converts a postgres date string to a javascript date object
     * @see https://docs.aws.amazon.com/neptune/latest/userguide/best-practices-gremlin-datetime-glv.html
     * @param date string
     * @returns javascript Date
     */
    export const pgDateToJs: (date: string) => Date;
    /**
     * creates a hash of some string
     * @param id
     * @see https://bun.sh/docs/api/hashing#bun-hash
     */
    export const hashId: (id: string) => string;
    /**
     * neptune requires 1 label for every edge
     * @param data array with a single edge label
     * @returns {@link NumStr}
     */
    export const getEdgeLabel: (data: NumStr) => NumStr;
    /**
     * neptune allows 1/more labels for every vertex but recommends at most 1
     * but tinkergraph only allows 1 label, we use the label at index 0
     * @param data array with 1/more edge labels
     * @returns
     */
    export const getVertexLabel: (data: NumStr[]) => NumStr;
    /**
     * returns a fn to retrieve a vertex/edge label depending on the config type
     * @param type V or E
     * @returns
     */
    export const getLabel: <T = "v" | "e">(type: T) => typeof getVertexLabel | typeof getEdgeLabel;
    /**
     * reduces a Promise.allSettled response to {success[], failure[]} object
     * @param result PromiseSettledResult
     * @returns
     */
    export const recordsCreatedHandler: (result: PromiseSettledResult<unknown[]>[]) => {
        success: any[];
        failure: string[];
    };
}
declare module "src/loader/loaders" {
    import type { ConfigSpec, TinkerDataEdge, TinkerDataVertex } from "src/index";
    export const tinkerDataEdge: (tdata: TinkerDataEdge) => Map<string | import("gremlin").process.EnumValue, any>[][];
    export const tinkerDataVertex: (tdata: TinkerDataVertex) => Map<string | import("gremlin").process.EnumValue, any>[];
    /**
     * merges vertices and edges into a tinkergraph based on a specification
     * @param data
     * @param spec
     */
    export const tinkerData: (data: TinkerDataEdge[] | TinkerDataVertex[], spec: ConfigSpec) => Promise<{
        success: string[];
        failure: string[];
    }>;
}
declare module "src/loader/transformers" {
    import type { ConfigSpec, ConfigSpecEdge, ConfigSpecVertex, CsvParsed, NeptuneValue, NumStr, PropsAndLabels, TinkerDataEdge, TinkerDataVertex } from "src/index";
    export const validateNumStr: (value: NeptuneValue) => NumStr;
    /**
     * extracts properties and labels from a CSV record
     * @param spec
     * @param headers
     * @param record
     */
    export const transformPropsAndLabels: (spec: ConfigSpec, headers: string[], record: NeptuneValue[]) => PropsAndLabels;
    /**
     * converts a csv record to {@link TinkerDataEdge}
     * @param spec
     * @param data
     * @param headers
     */
    export const csvToTinkerDataEdge: (spec: ConfigSpecEdge, data: string[][], headers: string[]) => TinkerDataEdge[];
    /**
     * converts a csv record to {@link TinkerDataVertex}
     * @param spec
     * @param data
     * @param headers
     */
    export const csvToTinkerDataVertex: (spec: ConfigSpecVertex, data: string[][], headers: string[]) => TinkerDataVertex[];
    /**
     * transforms a csv file to {@link TinkerDataEdge} or {@link TinkerDataVertex} based on a {@link ConfigSpec}
     * @param spec
     * @param dataParsed
     */
    export const csvToTinkerData: (spec: ConfigSpec, dataParsed: CsvParsed) => Promise<TinkerDataEdge[] | TinkerDataVertex[]>;
}
declare module "src/loader/etl" {
    import type { Config, ConfigSpec, CsvParsed, TinkerDataEdge, TinkerDataVertex } from "src/index";
    export const getStore: (overrides?: {}) => {
        files: Set<string>;
        parsed: Map<string, CsvParsed>;
        transformed: Map<string, {
            spec: ConfigSpec;
            data: TinkerDataEdge[] | TinkerDataVertex[];
        }>;
    };
    /**
     * transforms a CSV file to TinkerData and saves it as dataKey || bname
     * @param bname filename of the CSV file without extension
     * @param spec associated {@link ConfigSpec}
     * @param dataKey generally only used when spec.recursive = actualBname
     * @param store
     */
    export const transformAndSaveTinkerData: (bname: string, spec: ConfigSpec, dataKey?: string, store?: {
        files: Set<string>;
        parsed: Map<string, CsvParsed>;
        transformed: Map<string, {
            spec: ConfigSpec;
            data: TinkerDataEdge[] | TinkerDataVertex[];
        }>;
    }) => Promise<void>;
    /**
     * parses and saves a file
     * @param bname
     * @param filepath
     * @param store
     */
    export const parseFile: (bname: string, filepath: string, store?: {
        files: Set<string>;
        parsed: Map<string, CsvParsed>;
        transformed: Map<string, {
            spec: ConfigSpec;
            data: TinkerDataEdge[] | TinkerDataVertex[];
        }>;
    }) => Promise<void>;
    /**
     * retrieves all filenames with .csv extension at path
     * @param csvDir
     * @param store
     */
    export const readCsvDir: (csvDir: string, store?: {
        files: Set<string>;
        parsed: Map<string, CsvParsed>;
        transformed: Map<string, {
            spec: ConfigSpec;
            data: TinkerDataEdge[] | TinkerDataVertex[];
        }>;
    }) => Promise<void>;
    /**
     * transforms all {@link ConfigSpec}s in {@link Config}.files and saves each as {@link TinkerData}
     * @param config
     * @param store
     */
    export const transformConfigFiles: (config: Config, store?: {
        files: Set<string>;
        parsed: Map<string, CsvParsed>;
        transformed: Map<string, {
            spec: ConfigSpec;
            data: TinkerDataEdge[] | TinkerDataVertex[];
        }>;
    }) => Promise<void>;
    /**
     * transforms unmapped csv files and saves each as {@link TinkerData}
     * @param config
     * @param store
     */
    export const transformUnmappedFiles: (config: Config, store?: {
        files: Set<string>;
        parsed: Map<string, CsvParsed>;
        transformed: Map<string, {
            spec: ConfigSpec;
            data: TinkerDataEdge[] | TinkerDataVertex[];
        }>;
    }) => Promise<void>;
    /**
     * loads all {@link TinkerData} into tinkergraph
     * @param config
     * @param store
     */
    export const loadTinkerData: (config: Config, store?: {
        files: Set<string>;
        parsed: Map<string, CsvParsed>;
        transformed: Map<string, {
            spec: ConfigSpec;
            data: TinkerDataEdge[] | TinkerDataVertex[];
        }>;
    }) => Promise<void>;
    /**
     * extracts CSV data, transforms to Tinkerdata and loads into Tinkergraph
     * @param config {@link Config}
     * @param store
     */
    export const csvToTinkergraph: (config: Config, store?: {
        files: Set<string>;
        parsed: Map<string, CsvParsed>;
        transformed: Map<string, {
            spec: ConfigSpec;
            data: TinkerDataEdge[] | TinkerDataVertex[];
        }>;
    }) => Promise<void>;
    export const tinkergraphToNeptuneCsv: () => null;
}
declare module "src/loader/index" {
    export * from "src/loader/etl";
    export * from "src/loader/loaders";
    export * from "src/loader/transformers";
    export * from "src/loader/utils";
}
declare module "src/query/queryUtils" {
    import type { GroovyTraversal } from "src/index";
    import { type EnumValue } from "src/index";
    /**
     * base opts for a gremlin traversal
     * @property end if false returns a GroovyTraveral for chaining
     * @property limitX e.g. traversal.range(limitX, limitY)
     * @property limitY e.g. traversal.range(limitX, limitY)
     */
    export interface BaseOpts {
        limitX?: number;
        limitY?: number;
        [x: string]: unknown;
    }
    /**
     * helper fn for supplying options to a {@link GroovyTraversal}
     * @param overrides
     * @returns
     */
    export const getBaseOpts: (overrides: BaseOpts) => {
        limitX: number;
        limitY: number;
    };
    export const throwIfEmpty: (thing: string, received?: unknown) => false | undefined;
    export const throwInvalidQuery: (reason: string, ...extra: any[]) => never;
    export interface ElementProps {
        elements?: GroovyTraversal;
        elKeys?: (string | EnumValue)[];
        as?: string[];
    }
    export const elementProps: ({ as, elements, elKeys, }: ElementProps) => GroovyTraversal;
    export interface CombineProps extends Exclude<ElementProps, 'as'> {
        traversals?: GroovyTraversal[];
    }
    export const combineProps: ({ elements, elKeys, traversals, }: CombineProps) => GroovyTraversal;
    export const groupByIdentity: ({ elements, elKeys, }: Exclude<ElementProps, 'as'>) => GroovyTraversal;
}
declare module "src/query/index" {
    export * from "src/query/queryUtils";
}
declare module "src/remote" {
    import { GroovyTraversalSource } from "src/index";
    export const g: GroovyTraversalSource;
    export const client: import("gremlin").driver.Client;
}
declare module "src/types" {
    import type { RequireAtLeastOne, SetRequired } from 'type-fest';
    export type CsvParsed = string[][];
    export type NumStr = string | number;
    export type NeptuneValueSingle = NumStr | boolean | Date;
    export type NeptuneValueArray = NeptuneValueSingle[];
    export type NeptuneValue = NeptuneValueSingle | NeptuneValueArray;
    export interface PropsAndLabels {
        p?: Record<string, NeptuneValue>;
        l?: NumStr[];
    }
    export type PropLabelNumStr = (pl: PropsAndLabels, record: NeptuneValue[]) => NumStr;
    export interface EdgeConfig {
        f: PropLabelNumStr;
        t: PropLabelNumStr;
        l: PropLabelNumStr;
        recordId: PropLabelNumStr;
        p?: (pl: PropsAndLabels) => PropsAndLabels['p'];
    }
    export interface EdgeData {
        f: ReturnType<EdgeConfig['f']>;
        t: ReturnType<EdgeConfig['t']>;
        l: ReturnType<EdgeConfig['l']>;
        p?: Pick<PropsAndLabels, 'p'>;
        recordId: ReturnType<EdgeConfig['recordId']>;
    }
    /**
     * specifies how to transform a CSV into a {@link TinkerData} configuration
     * @property default p: property | l: label
     *    default col assignment for unassigned columns
     *    will ignore unknown columns if not set
     * @property ignoreCols always ignore these columns
     * @property ignoreEmptyCol whether to ignore empty columns
     * @property l map specific col indexes to labels
     * @property p map specific col indexes to properties
     * @property transform mutate the column's value
     */
    export interface ConfigSpecColMap {
        default?: 'p' | 'l';
        ignoreCols?: number[];
        ignoreEmptyCol?: boolean;
        l?: number[];
        p?: number[];
        transform?: (i: number, col: NeptuneValue) => NeptuneValue;
    }
    /**
     * inject new labels / properties before any other transformations take place
     * @property l labels
     * @property p properties
     */
    export type ConfigSpecInject = RequireAtLeastOne<{
        l?: NumStr[];
        p?: Record<string, NeptuneValue>;
    }, 'l' | 'p'>;
    /**
     * Base type for configs
     * @property colMap {@link ConfigSpecColMap}
     * @property edges {@link EdgeConfig}
     * @property inject {@link ConfigSpecInject}
     * @property recursive basename of a previously parsed csv file to reuse a {@link TinkerData} for a new ETL job
     * @property transformHeaders process the header array
     * @property transformRecord process the record as a whole
     * @property type the CSV contains v (vertices) or e (edges)
     */
    interface ConfigSpecBase {
        colMap?: ConfigSpecColMap;
        edges?: EdgeConfig[];
        inject?: ConfigSpecInject;
        recursive?: string;
        transformHeaders?: (headers: string[]) => string[];
        transformRecord?: (record: string[]) => NeptuneValue[];
        type: 'v' | 'e';
    }
    /**
     * Vertex {@link ConfigSpec}
     */
    export type ConfigSpecVertex = ConfigSpecBase & {
        colMap: ConfigSpecColMap;
        recordId: PropLabelNumStr;
        type: 'v';
    };
    /**
     * Edge {@link ConfigSpec}
     */
    export type ConfigSpecEdge = ConfigSpecBase & {
        edges: EdgeConfig[];
        type: 'e';
    };
    export type ConfigSpec = ConfigSpecVertex | ConfigSpecEdge;
    /**
     * @returns specification {@link ConfigSpec} or undefined to ignore this file
     * @param basename the filename with no extension
     */
    export type ConfigSpecGetter = (basename: string) => ConfigSpec | undefined;
    /**
     * utility type to match expected type of Config['files']
     */
    export type ConfigFilesMapValue = ConfigSpec | ((fname: string) => ConfigSpec);
    /**
     * Loader Configuration
     * @property csvDir absolute path to directory containing csv files
     * @property files map of filenames to explicit {@link ConfigSpec}s definitions
     * @property getSpec {@link ConfigSpecGetter} called for each load file
     * @property includeUnmappeDfiles if true, will process any csv if getSpec returns a valid {@link ConfigSpec}
     * @property persistResultLog will save whatever is returned from tinkergraph to file
     */
    export type Config = RequireAtLeastOne<{
        csvDir: string;
        files?: Map<string, ConfigFilesMapValue>;
        getSpec?: ConfigSpecGetter;
        includeUnmappedFiles?: boolean;
        persistResultLog?: boolean;
    }, 'files' | 'getSpec'>;
    /**
     * base TinkerData for vertices and edges
     */
    export interface TinkerDataBase extends PropsAndLabels {
        recordId?: NumStr;
        edges?: EdgeData[];
    }
    /**
     * Vertex {@link TinkerDataBase}
     */
    export type TinkerDataVertex = SetRequired<TinkerDataBase, 'recordId'>;
    /**
     * Edge {@link TinkerDataBase}
     */
    export type TinkerDataEdge = SetRequired<TinkerDataBase, 'edges'>;
    export type TinkerData = TinkerDataVertex | TinkerDataEdge;
}
declare module "src/index" {
    export * from "src/api/index";
    export * from "src/groovy/index";
    export * from "src/loader/index";
    export * from "src/logger";
    export * from "src/query/index";
    export * from "src/remote";
    export * from "src/types";
}
declare module "src/bun" {
    export * from "src/index";
}
declare module "src/node" {
    export * from "src/index";
}
//# sourceMappingURL=index.d.ts.map