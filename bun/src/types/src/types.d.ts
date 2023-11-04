import type { RequireAtLeastOne, SetRequired } from "type-fest";
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
    p?: (pl: PropsAndLabels) => PropsAndLabels["p"];
}
export interface EdgeData {
    f: ReturnType<EdgeConfig["f"]>;
    t: ReturnType<EdgeConfig["t"]>;
    l: ReturnType<EdgeConfig["l"]>;
    p?: Pick<PropsAndLabels, "p">;
    recordId: ReturnType<EdgeConfig["recordId"]>;
}
/**
 * specifies how to transform a CSV into a {@link TinkerData} configuration
 *
 * @prop default p: property | l: label
 *    default col assignment for unassigned columns
 *    will ignore unknown columns if not set
 * @prop ignoreCols always ignore these columns
 * @prop ignoreEmptyCol whether to ignore empty columns
 * @prop l map specific col indexes to labels
 * @prop p map specific col indexes to properties
 * @prop transform mutate the column's value
 */
export type ConfigSpecColMap = {
    default?: "p" | "l";
    ignoreCols?: number[];
    ignoreEmptyCol?: boolean;
    l?: number[];
    p?: number[];
    transform?: (i: number, col: NeptuneValue) => NeptuneValue;
};
/**
 * inject new labels / properties before any other transformations take place
 *
 * @prop l labels
 * @prop p properties
 */
export type ConfigSpecInject = RequireAtLeastOne<{
    l?: NumStr[];
    p?: Record<string, NeptuneValue>;
}, "l" | "p">;
/**
 * Base type for configs
 *
 * @prop colMap {@link ConfigSpecColMap}
 * @prop edges {@link EdgeConfig}
 * @prop inject {@link ConfigSpecInject}
 * @prop recursive basename of a previously parsed csv file to reuse a {@link TinkerData} for a new ETL job
 * @prop transformHeaders process the header array
 * @prop transformRecord process the record as a whole
 * @prop type the CSV contains v (vertices) or e (edges)
 */
interface ConfigSpecBase {
    colMap?: ConfigSpecColMap;
    edges?: EdgeConfig[];
    inject?: ConfigSpecInject;
    recursive?: string;
    transformHeaders?: (headers: string[]) => string[];
    transformRecord?: (record: string[]) => NeptuneValue[];
    type: "v" | "e";
}
/**
 * Vertex {@link ConfigSpec}
 */
export type ConfigSpecVertex = ConfigSpecBase & {
    colMap: ConfigSpecColMap;
    recordId: PropLabelNumStr;
    type: "v";
};
/**
 * Edge {@link ConfigSpec}
 */
export type ConfigSpecEdge = ConfigSpecBase & {
    edges: EdgeConfig[];
    type: "e";
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
 *
 * @prop csvDir absolute path to directory containing csv files
 * @prop files map of filenames to explicit {@link ConfigSpec}s definitions
 * @prop getSpec {@link ConfigSpecGetter} called for each load file
 * @prop includeUnmappeDfiles if true, will process any csv if getSpec returns a valid {@link ConfigSpec}
 * @prop persistResultLog will save whatever is returned from tinkergraph to file
 */
export type Config = RequireAtLeastOne<{
    csvDir: string;
    files?: Map<string, ConfigFilesMapValue>;
    getSpec?: ConfigSpecGetter;
    includeUnmappedFiles?: boolean;
    persistResultLog?: boolean;
}, "files" | "getSpec">;
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
export interface TinkerDataVertex extends SetRequired<TinkerDataBase, "recordId"> {
}
/**
 * Edge {@link TinkerDataBase}
 */
export interface TinkerDataEdge extends SetRequired<TinkerDataBase, "edges"> {
}
export type TinkerData = TinkerDataVertex | TinkerDataEdge;
export {};
