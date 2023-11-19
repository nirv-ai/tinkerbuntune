/**
 * migrating CSV -> tinkergraph or tinkergraph -> neptune CSV
 */
import { parse } from "csv/sync"; // TODO (noah): convert to async api
import fs from "node:fs/promises";
import { log } from "logger";
import * as loaders from "./loaders";
import * as transform from "./transformers";
import * as utils from "./utils";
const csvs = new Set();
const csvsParsed = new Map();
const tinkerData = new Map();
/**
 * transforms a CSV file to TinkerData and saves it as dataKey || bname
 * @param bname filename of the CSV file without extension
 * @param spec associated {@link ConfigSpec}
 * @param dataKey generally only used when spec.recursive = actualBname
 */
export const saveTinkerData = async (bname, spec, dataKey) => {
    if (!csvsParsed.has(bname))
        throw new Error(`csv not parsed: ${bname}`);
    tinkerData.set(dataKey || bname, {
        spec,
        data: await transform.csvToTinkerData(spec, csvsParsed.get(bname)),
    });
};
/**
 * parses and saves a file
 */
export const parseFile = async (bname, filepath) => {
    // TODO (noah): convert bun.file to stream api
    try {
        csvsParsed.set(bname, parse(await Bun.file(filepath).text()));
    }
    catch (e) {
        throw new Error(`invalid csv ${bname}: ${filepath}\n${e}`);
    }
};
/**
 * retrieves all filenames with .csv extension at path
 */
export const readCsvDir = async (csvDir) => {
    // get all CSVs
    (await fs.readdir(csvDir))
        .filter((x) => x.endsWith(".csv"))
        .forEach((fname) => csvs.add(fname));
    log("total csv files found", csvs.size);
};
/**
 * transforms all {@link ConfigSpec}s in {@link Config}.files and saves each as {@link TinkerData}
 */
export const transformConfigFiles = async (config) => {
    if (!config.files)
        return;
    for (const [bnameOrDataKey, spec] of config.files) {
        const configSpec = typeof spec === "function" ? spec(bnameOrDataKey) : spec;
        // recursive specs depend on previously loaded files
        if (configSpec.recursive) {
            await saveTinkerData(configSpec.recursive, configSpec, bnameOrDataKey);
        }
        else {
            // need to load file
            const fname = utils.bnameTofname(bnameOrDataKey);
            if (!csvs.has(fname))
                throw new Error(`could not find file: ${fname}`);
            csvs.delete(fname);
            await parseFile(bnameOrDataKey, `${config.csvDir}/${fname}`);
            await saveTinkerData(bnameOrDataKey, configSpec);
        }
    }
    log("transformed config.files", tinkerData.size);
};
/**
 * transforms unmapped csv files and saves each as {@link TinkerData}
 */
export const transformUnmappedFiles = async (config) => {
    if (!config.includeUnmappedFiles)
        return;
    if (!config.getSpec)
        throw new Error("Including unmapped files requires config.getSpec to be defined");
    let filesProcessed = 0;
    for (const fname of csvs) {
        const bname = utils.fnameToBname(fname);
        const configSpec = config.getSpec(bname);
        if (!configSpec)
            continue;
        filesProcessed++;
        csvs.delete(fname);
        await parseFile(bname, `${config.csvDir}/${fname}`);
        await saveTinkerData(bname, configSpec);
    }
    log(`
    unmapped csvs processed ${filesProcessed}
    unmapped csvs ignored: ${csvs.size}
    `);
};
/**
 * loads all {@link TinkerData} into tinkergraph
 */
export const loadTinkerData = async (config) => {
    if (!tinkerData.size)
        throw new Error(`
      no CSV files transformed. Did you correctly map CSV filenames to config specs?
      CSVs pared: ${csvsParsed.size}
      CSVs ignored: ${csvs.size}
      CSVs transformed: ${tinkerData.size}
      `);
    for (const [dataKey, data] of tinkerData.entries()) {
        const result = await loaders.tinkerData(data.data, data.spec);
        if (config.persistResultLog) {
            const logname = `${config.csvDir}/${dataKey}.csv.json`;
            Bun.write(logname, JSON.stringify(result || "result is empty"));
            log(`result log saved to ${logname}`);
        }
        log(`loaded ${dataKey} into tinkergraph`, {
            success: result?.success.length ?? 0,
            failure: result?.failure.length ?? 0,
        });
    }
    log("total csvs loaded in tinkergraph", tinkerData.size);
};
/**
 * extracts CSV data, transforms to Tinkerdata and loads into Tinkergraph
 * @param config {@link Config}
 */
export const csvToTinkergraph = async (config) => {
    await readCsvDir(config.csvDir);
    await transformConfigFiles(config);
    await transformUnmappedFiles(config);
    await loadTinkerData(config);
};
// FYI: @see https://kelvinlawrence.net/book/Gremlin-Graph-Guide.html#graphsonmapper
// ^ v3 will give you the datatypes required for neptune loader
export const tinkergraphToNeptuneCsv = () => null;
