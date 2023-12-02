/**
 * migrating CSV to tinkergraph or tinkergraph tp neptune CSV
 *
 */

// TODO (noah): check how he loads it via g.inject: https://github.com/krlawrence/graph/blob/main/sample-data/tree-with-500-nodes-map.groovy

import { parse } from 'csv/sync' // TODO (noah): convert to async api
import fs from 'node:fs/promises'

import { log } from '../logger'
import * as loaders from './loaders'
import * as transform from './transformers'
import * as utils from './utils'
import type {
  Config,
  ConfigSpec,
  CsvParsed,
  TinkerDataEdge,
  TinkerDataVertex,
} from '#utils'

export const getStore = (overrides = {}) => ({
  files: new Set<string>(),
  parsed: new Map<string, CsvParsed>(),
  transformed: new Map<
    string,
    { spec: ConfigSpec, data: TinkerDataEdge[] | TinkerDataVertex[] }
  >(),
  ...overrides,
})

/**
 * transforms a CSV file to TinkerData and saves it as dataKey || bname
 * @param bname - filename of the CSV file without extension
 * @param spec - associated {@link ConfigSpec}
 * @param dataKey - generally only used when spec.recursive = actualBname
 * @param store -
 */
export const transformAndSaveTinkerData = async (
  bname: string,
  spec: ConfigSpec,
  dataKey: string,
  store = getStore(),
) => {
  const csvParsed = store.parsed.get(bname)
  if (csvParsed) {
    store.transformed.set(dataKey || bname, {
      spec,
      data: await transform.csvToTinkerData(spec, csvParsed),
    })
  }
  else {
    throw new Error(`csv not parsed: ${bname}`)
  }
}

/**
 * parses and saves a file
 * @param bname -
 * @param filepath -
 * @param store -
 */
export const parseFile = async (
  bname: string,
  filepath: string,
  store = getStore(),
) => {
  // TODO (noah): convert bun.file to stream api
  try {
    store.parsed.set(
      bname,
      parse(await Bun.file(filepath).text()) as CsvParsed,
    )
  }
  catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error'
    throw new Error(`invalid csv ${bname}: ${filepath}\n${message}`)
  }
}

/**
 * retrieves all filenames with .csv extension at path
 * @param csvDir -
 * @param store -
 */
export const readCsvDir = async (csvDir: string, store = getStore()) => {
  for (const fname of (await fs.readdir(csvDir))) fname.endsWith('.csv') && store.files.add(fname)

  log('total csv files found', store.files.size)
}

/**
 * transforms all {@link ConfigSpec}s in {@link Config}.files and saves each as {@link TinkerData}
 * @param config -
 * @param store -
 */
export const transformConfigFiles = async (
  config: Config,
  store = getStore(),
) => {
  if (!config.files) {
    return
  }

  for (const [bnameOrDataKey, spec] of config.files) {
    const configSpec = typeof spec === 'function' ? spec(bnameOrDataKey) : spec

    // recursive specs depend on previously loaded files
    if (configSpec.recursive) {
      await transformAndSaveTinkerData(
        configSpec.recursive,
        configSpec,
        bnameOrDataKey,
        store,
      )
    }
    else {
      // need to load file
      const fname = utils.bnameTofname(bnameOrDataKey)

      if (!store.files.has(fname)) {
        throw new Error(`could not find file: ${fname}`)
      }
      store.files.delete(fname)

      await parseFile(bnameOrDataKey, `${config.csvDir}/${fname}`, store)
      await transformAndSaveTinkerData(bnameOrDataKey, configSpec, '', store)
    }
  }

  log('transformed config.files', store.transformed.size)
}

/**
 * transforms unmapped csv files and saves each as {@link TinkerData}
 * @param config -
 * @param store -
 */
export const transformUnmappedFiles = async (
  config: Config,
  store = getStore(),
) => {
  if (!config.includeUnmappedFiles) {
    return
  }
  if (!config.getSpec) {
    throw new Error(
      'Including unmapped files requires config.getSpec to be defined',
    )
  }

  let filesProcessed = 0

  for (const fname of store.files) {
    const bname = utils.fnameToBname(fname)
    const configSpec = config.getSpec(bname)

    if (!configSpec) {
      continue
    }
    filesProcessed++
    store.files.delete(fname)

    await parseFile(bname, `${config.csvDir}/${fname}`, store)
    await transformAndSaveTinkerData(bname, configSpec, '', store)
  }

  log(
    `
    unmapped csvs processed ${filesProcessed}
    unmapped csvs ignored: ${store.files.size}
    `,
  )
}

/**
 * loads all {@link TinkerData} into tinkergraph
 * @param config -
 * @param store -
 */
export const loadTinkerData = async (config: Config, store = getStore()) => {
  if (store.transformed.size === 0) {
    throw new Error(
      `
      no CSV files transformed. Did you correctly map CSV filenames to config specs?
      CSVs pared: ${store.parsed.size}
      CSVs ignored: ${store.files.size}
      CSVs transformed: ${store.transformed.size}
      `,
    )
  }

  for (const [dataKey, data] of store.transformed.entries()) {
    const result = await loaders.tinkerData(data.data, data.spec)

    if (config.persistResultLog) {
      const logname = `${config.csvDir}/${dataKey}.csv.json`

      void Bun.write(logname, JSON.stringify(result))

      log(`result log saved to ${logname}`)
    }
    log(`loaded ${dataKey} into tinkergraph`, {
      success: result.success.length,
      failure: result.failure.length,
    })
  }
  log('total csvs loaded in tinkergraph', store.transformed.size)
}

/**
 * extracts CSV data, transforms to Tinkerdata and loads into Tinkergraph
 * @param config - {@link Config}
 * @param store -
 */
export const csvToTinkergraph = async (config: Config, store = getStore()) => {
  await readCsvDir(config.csvDir, store)
  await transformConfigFiles(config, store)
  await transformUnmappedFiles(config, store)
  await loadTinkerData(config, store)
}

// FYI: @see https://kelvinlawrence.net/book/Gremlin-Graph-Guide.html#graphsonmapper
// ^ v3 will give you the datatypes required for neptune loader
// FYI: @see https://github.com/awslabs/amazon-neptune-tools/blob/master/csv-gremlin/README.md
// TODO (noah): make sure you review the above links before continuing
export const tinkergraphToNeptuneCsv = () => 'not implemented'
