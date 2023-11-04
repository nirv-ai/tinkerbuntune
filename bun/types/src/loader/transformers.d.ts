import type { ConfigSpec, ConfigSpecEdge, ConfigSpecVertex, CsvParsed, NeptuneValue, NumStr, PropsAndLabels, TinkerDataEdge, TinkerDataVertex } from "types";
export declare const validateNumStr: (value: NeptuneValue) => NumStr;
/**
 * extracts properties and labels from a CSV record
 */
export declare const transformPropsAndLabels: (spec: ConfigSpec, headers: string[], record: NeptuneValue[]) => PropsAndLabels;
/**
 * converts a csv record to {@link TinkerDataEdge}
 */
export declare const csvToTinkerDataEdge: (spec: ConfigSpecEdge, data: string[][], headers: string[]) => TinkerDataEdge[];
/**
 * converts a csv record to {@link TinkerDataVertex}
 */
export declare const csvToTinkerDataVertex: (spec: ConfigSpecVertex, data: string[][], headers: string[]) => TinkerDataVertex[];
/**
 * transforms a csv file to {@link TinkerDataEdge} or {@link TinkerDataVertex} based on a {@link ConfigSpec}
 */
export declare const csvToTinkerData: (spec: ConfigSpec, dataParsed: CsvParsed) => Promise<TinkerDataEdge[] | TinkerDataVertex[]>;
//# sourceMappingURL=transformers.d.ts.map