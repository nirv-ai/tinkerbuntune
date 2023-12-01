import type {
  ConfigSpec,
  ConfigSpecEdge,
  ConfigSpecVertex,
  CsvParsed,
  NeptuneValue,
  NumStr,
  PropsAndLabels,
  TinkerDataEdge,
  TinkerDataVertex,
} from '#utils'

export const validateNumStr = (value: NeptuneValue): NumStr => {
  if (typeof value !== 'string' || typeof value !== 'number') {
    throw new TypeError(
      `invalid type, expected number|string, received: ${typeof value}`,
    )
  }

  return value
}

/**
 * extracts properties and labels from a CSV record
 * @param spec
 * @param headers
 * @param record
 */
export const transformPropsAndLabels = (
  spec: ConfigSpec,
  headers: string[],
  record: NeptuneValue[],
): PropsAndLabels => {
  const p = { ...(spec.inject?.p) },
    l = spec.inject?.l?.slice() ?? []

  for (const [index2, col] of record.entries()) {
    if (spec.colMap?.ignoreCols?.includes(index2)) {
      continue
    }
    if (spec.colMap?.ignoreEmptyCol && String(col).length === 0) {
      continue
    }

    const header = headers[index2]
    const value = spec.colMap?.transform?.(index2, col) ?? col

    // TODO (noah): tinkergraph only allows 1 label per element
    // so we set all other labels to be properties
    if (spec.colMap?.p?.includes(index2)) {
      p[header] = value
    }
    else if (spec.colMap?.l?.includes(index2)) {
      if (l.length > 0) {
        p[header] = value
      }
      else {
        l.push(validateNumStr(value))
      }
    }
    else if (spec.colMap?.default) {
      switch (spec.colMap.default) {
        case 'p': {
          p[header] = value
          break
        }
        default: {
          if (l.length > 0) {
            p[header] = value
          }
          else {
            l.push(validateNumStr(value))
          }
        }
      }
    }
  }

  return { p, l }
}

/**
 * converts a csv record to {@link TinkerDataEdge}
 * @param spec
 * @param data
 * @param headers
 */
export const csvToTinkerDataEdge = (
  spec: ConfigSpecEdge,
  data: string[][],
  headers: string[],
): TinkerDataEdge[] =>
  data.map((recordRaw) => {
    const record = spec.transformRecord?.(recordRaw) ?? recordRaw

    const pl = transformPropsAndLabels(spec, headers, record)

    return {
      edges: spec.edges.map(edgeConfig => ({
        f: edgeConfig.f(pl, record),
        t: edgeConfig.t(pl, record),
        l: edgeConfig.l(pl, record),
        p: edgeConfig.p?.(pl) ?? {},
        recordId: edgeConfig.recordId(pl, record),
      })),
    }
  })

/**
 * converts a csv record to {@link TinkerDataVertex}
 * @param spec
 * @param data
 * @param headers
 */
export const csvToTinkerDataVertex = (
  spec: ConfigSpecVertex,
  data: string[][],
  headers: string[],
): TinkerDataVertex[] =>
  data.map((recordRaw) => {
    const record = spec.transformRecord?.(recordRaw) ?? recordRaw
    const pl = transformPropsAndLabels(spec, headers, record)
    const recordId = spec.recordId(pl, record)

    return { recordId, ...pl }
  })

/**
 * transforms a csv file to {@link TinkerDataEdge} or {@link TinkerDataVertex} based on a {@link ConfigSpec}
 * @param spec
 * @param dataParsed
 */
export const csvToTinkerData = (
  spec: ConfigSpec,
  dataParsed: CsvParsed,
): Promise<TinkerDataEdge[] | TinkerDataVertex[]> => {
  const headers = spec.transformHeaders?.(dataParsed[0]) ?? dataParsed[0]

  switch (spec.type) {
    case 'v': {
      return csvToTinkerDataVertex(spec, dataParsed.slice(1), headers)
    }
    case 'e': {
      return csvToTinkerDataEdge(spec, dataParsed.slice(1), headers)
    }
    default: {
      // @ts-expect-error spec is anow a never
      throw new Error(`invalid spec type: ${spec.type}`)
    }
  }
}
