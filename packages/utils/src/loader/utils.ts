import path from 'node:path'

import type { NumStr, ConfigSpec } from '#utils'

/**
 * drops the extension from a path
 * @param fname string e.g. blah.csv
 * @returns string
 */
export const fnameToBname = (fname: string) => path.parse(fname).name

/**
 * adds an extension to a filename
 * @param bname a filename e.g. `blah`
 * @param ext to add to filename e.g. `csv`
 * @returns string with extension added
 */
export const bnameTofname = (bname: string, ext = 'csv') =>
    `${bname}.${ext}`

/**
 * converts a postgres date string to a javascript date object
 * @see https://docs.aws.amazon.com/neptune/latest/userguide/best-practices-gremlin-datetime-glv.html
 * @param date string
 * @returns javascript Date
 */
export const pgDateToJs = (date: string) =>
  new Date(date.replace(/['"]+/g, ''))

const hashIdCache = Object.create(null)

// TODO (noah): consumers should be able to override this fn
/**
 * creates a hash of some string
 * @param id
 * @see https://bun.sh/docs/api/hashing#bun-hash
 */
export const hashId = (id: string): string => {
  if (!hashIdCache[id]) {
    hashIdCache[id] = Bun.hash(id).toString()
  }
  return hashIdCache[id]
}

/**
 * neptune requires 1 label for every edge
 * @param data array with a single edge label
 * @returns {@link NumStr}
 */
export const getEdgeLabel = (data: NumStr) => {
  if (!String(data).length) {
    throw new Error(
            `neptune requires edges to have exactly 1 label: ${data} received`,
    )
  }

  return data
}

// TODO (noah): convert multiple labels to a vertex multi-property so we can capture that in tinkergraph
// ^ @see https://tinkerpop.apache.org/docs/3.7.0/reference/#vertex-properties
/**
 * neptune allows 1/more labels for every vertex but recommends at most 1
 * but tinkergraph only allows 1 label, we use the label at index 0
 * @param data array with 1/more edge labels
 * @returns
 */
export const getVertexLabel = (data: NumStr[]): NumStr => {
  if (!data.length) {
    throw new Error('neptune requires at least 1 label for vertices')
  }
  return data[0]
}

/**
 * returns a fn to retrieve a vertex/edge label depending on the config type
 * @param type V or E
 * @returns
 */
export const getLabel = <T = ConfigSpec['type']>(
  type: T,
): typeof getVertexLabel | typeof getEdgeLabel =>
    (type === 'v' ? getVertexLabel : getEdgeLabel)

/**
 * reduces a Promise.allSettled response to {success[], failure[]} object
 * @param result PromiseSettledResult
 * @returns
 */
export const recordsCreatedHandler = (
  result: PromiseSettledResult<unknown[]>[],
) =>
  result.reduce<{ success: any[], failure: string[] }>(
    (p, c) => {
      if (c.status === 'rejected') {
        p.failure.push((c.reason as string))
      }
      else {
        p.success.push(c.value)
      }

      return p
    },
    { success: [], failure: [] },
  )
