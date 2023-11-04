/**
 * migrating CSV -> tinkergraph or tinkergraph -> neptune CSV
 */
import type { Config, ConfigSpec } from "types";
/**
 * transforms a CSV file to TinkerData and saves it as dataKey || bname
 * @param bname filename of the CSV file without extension
 * @param spec associated {@link ConfigSpec}
 * @param dataKey generally only used when spec.recursive = actualBname
 */
export declare const saveTinkerData: (bname: string, spec: ConfigSpec, dataKey?: string) => Promise<void>;
/**
 * parses and saves a file
 */
export declare const parseFile: (bname: string, filepath: string) => Promise<void>;
/**
 * retrieves all filenames with .csv extension at path
 */
export declare const readCsvDir: (csvDir: string) => Promise<void>;
/**
 * transforms all {@link ConfigSpec}s in {@link Config}.files and saves each as {@link TinkerData}
 */
export declare const transformConfigFiles: (config: Config) => Promise<void>;
/**
 * transforms unmapped csv files and saves each as {@link TinkerData}
 */
export declare const transformUnmappedFiles: (config: Config) => Promise<void>;
/**
 * loads all {@link TinkerData} into tinkergraph
 */
export declare const loadTinkerData: (config: Config) => Promise<void>;
/**
 * extracts CSV data, transforms to Tinkerdata and loads into Tinkergraph
 * @param config {@link Config}
 */
export declare const csvToTinkergraph: (config: Config) => Promise<void>;
//# sourceMappingURL=etl.d.ts.map