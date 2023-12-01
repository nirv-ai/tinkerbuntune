import type { RequireAtLeastOne, SetRequired } from 'type-fest'

export type CsvParsed = string[][]
export type NumStr = string | number

export type NeptuneValueSingle = NumStr | boolean | Date
export type NeptuneValueArray = NeptuneValueSingle[]
export type NeptuneValue = NeptuneValueSingle | NeptuneValueArray

export interface PropertiesAndLabels {
  p?: Record<string, NeptuneValue>
  l?: NumStr[]
}
export type PropLabelNumStr = (
  pl: PropertiesAndLabels,
  record: NeptuneValue[]
) => NumStr
export interface EdgeConfig {
  f: PropLabelNumStr
  t: PropLabelNumStr
  l: PropLabelNumStr
  recordId: PropLabelNumStr
  p?: (pl: PropertiesAndLabels) => PropertiesAndLabels['p']
}

// TODO(noah) we shoudnt need this: typescript should automatically figure this out
export interface EdgeData {
  f: ReturnType<EdgeConfig['f']>
  t: ReturnType<EdgeConfig['t']>
  l: ReturnType<EdgeConfig['l']>
  p?: Pick<PropertiesAndLabels, 'p'>
  recordId: ReturnType<EdgeConfig['recordId']>
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
  default?: 'p' | 'l'
  ignoreCols?: number[]
  ignoreEmptyCol?: boolean
  l?: number[]
  p?: number[]
  transform?: (index: number, col: NeptuneValue) => NeptuneValue
}

/**
 * inject new labels / properties before any other transformations take place
 * @property l labels
 * @property p properties
 */
export type ConfigSpecInject = RequireAtLeastOne<
  {
    l?: NumStr[]
    p?: Record<string, NeptuneValue>
  },
  'l' | 'p'
>

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
  colMap?: ConfigSpecColMap
  edges?: EdgeConfig[]
  inject?: ConfigSpecInject
  recursive?: string
  transformHeaders?: (headers: string[]) => string[]
  transformRecord?: (record: string[]) => NeptuneValue[]
  type: 'v' | 'e'
}

/**
 * Vertex {@link ConfigSpec}
 */
export type ConfigSpecVertex = ConfigSpecBase & {
  colMap: ConfigSpecColMap
  recordId: PropLabelNumStr
  type: 'v' // TODO (noah): this type flag shouldnt be necessary anymore
}

/**
 * Edge {@link ConfigSpec}
 */
export type ConfigSpecEdge = ConfigSpecBase & {
  edges: EdgeConfig[]
  type: 'e'
}

export type ConfigSpec = ConfigSpecVertex | ConfigSpecEdge

/**
 * @returns specification {@link ConfigSpec} or undefined to ignore this file
 * @param basename the filename with no extension
 */
export type ConfigSpecGetter = (basename: string) => ConfigSpec | undefined

/**
 * utility type to match expected type of Config['files']
 */
export type ConfigFilesMapValue = ConfigSpec | ((fname: string) => ConfigSpec)

/**
 * Loader Configuration
 * @property csvDir absolute path to directory containing csv files
 * @property files map of filenames to explicit {@link ConfigSpec}s definitions
 * @property getSpec {@link ConfigSpecGetter} called for each load file
 * @property includeUnmappeDfiles if true, will process any csv if getSpec returns a valid {@link ConfigSpec}
 * @property persistResultLog will save whatever is returned from tinkergraph to file
 */
export type Config = RequireAtLeastOne<
  {
    csvDir: string
    files?: Map<string, ConfigFilesMapValue>
    getSpec?: ConfigSpecGetter
    includeUnmappedFiles?: boolean
    persistResultLog?: boolean
  },
  'files' | 'getSpec'
>

/**
 * base TinkerData for vertices and edges
 */
export interface TinkerDataBase extends PropertiesAndLabels {
  recordId?: NumStr
  edges?: EdgeData[]
}

/**
 * Vertex {@link TinkerDataBase}
 */
export type TinkerDataVertex = SetRequired<TinkerDataBase, 'recordId'>

/**
 * Edge {@link TinkerDataBase}
 */
export type TinkerDataEdge = SetRequired<TinkerDataBase, 'edges'>

export type TinkerData = TinkerDataVertex | TinkerDataEdge
