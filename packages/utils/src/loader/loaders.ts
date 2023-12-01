import { common, g } from '#utils'
import * as utils from '#utils/loader/utils'
import type { ConfigSpec, TinkerDataEdge, TinkerDataVertex } from '#utils'

const { t, Direction, merge } = common

type EnumValue = InstanceType<typeof common.EnumValue>

export const tinkerDataEdge = (tdata: TinkerDataEdge) =>
  tdata.edges.map((edgeData) => {
    if (!edgeData.recordId) {
      throw new Error(
        `all edges require a user supplied recordId\n${JSON.stringify(
          edgeData,
        )}`,
      )
    }

    const recordProperties = new Map<string | EnumValue, unknown>(
      Object.entries(edgeData.p ?? {}),
    )

    recordProperties.set(t.label, edgeData.l)
    recordProperties.set(Direction.OUT, edgeData.f)
    recordProperties.set(Direction.IN, edgeData.t)

    return [new Map([[t.id, edgeData.recordId]]), recordProperties]
  })

export const tinkerDataVertex = (tdata: TinkerDataVertex) => {
  if (!tdata.recordId) {
    throw new Error('all vertices require a user supplied recordId')
  }

  const recordProperties = tdata.p
    ? new Map<string | EnumValue, unknown>(Object.entries(tdata.p))
    : new Map()

  if (!tdata.l) {
    throw new Error(`all vertex require a label: ${tdata.l}`)
  }

  recordProperties.set(t.label, utils.getVertexLabel(tdata.l))

  return [new Map([[t.id, tdata.recordId]]), recordProperties]
}

/**
 * merges vertices and edges into a tinkergraph based on a specification
 * @param data
 * @param spec
 */
export const tinkerData = async (
  data: TinkerDataEdge[] | TinkerDataVertex[],
  spec: ConfigSpec,
): Promise<{ success: string[], failure: string[] }> =>
  Promise.allSettled(
    data
      .flatMap((tdata) => {
        if (spec.type === 'v') {
          const [idMap, recordProperties] = tinkerDataVertex(
            tdata as TinkerDataVertex,
          )

          return g
            .mergeV(idMap)
            .option(merge.onCreate, recordProperties)
            .option(merge.onMatch, recordProperties)
            .toList()
        }
        return tinkerDataEdge(tdata as TinkerDataEdge).map(
          ([idMap, recordProperties]) =>
            g
              .mergeE(idMap)
              .option(merge.onCreate, recordProperties)
              .option(merge.onMatch, recordProperties)
              .toList(),
        )
      })
      .filter(Boolean),
  ).then(utils.recordsCreatedHandler)
