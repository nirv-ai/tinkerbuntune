import { common } from "groovy/common";
import { g } from "remote";
import * as utils from "./utils";
import type { ConfigSpec, TinkerDataEdge, TinkerDataVertex } from "types";

const { t, Direction, merge } = common;

type EnumValue = InstanceType<typeof common.EnumValue>;

export const tinkerDataEdge = (tdata: TinkerDataEdge) => {
  return tdata.edges.map((edgeData) => {
    if (!edgeData.recordId)
      throw new Error(
        `all edges require a user supplied recordId\n${JSON.stringify(
          edgeData
        )}`
      );

    const recordProps = new Map<string | EnumValue, any>(
      Object.entries(edgeData.p || {})
    );

    recordProps.set(t.label, edgeData.l);
    recordProps.set(Direction.OUT, edgeData.f);
    recordProps.set(Direction.IN, edgeData.t);

    return [new Map([[t.id, edgeData.recordId]]), recordProps];
  });
};

export const tinkerDataVertex = (tdata: TinkerDataVertex) => {
  if (!tdata.recordId)
    throw new Error(`all vertices require a user supplied recordId`);

  const recordProps = new Map<string | EnumValue, any>(
    Object.entries(tdata.p!)
  );

  recordProps.set(t.label, utils.getVertexLabel(tdata.l!));

  return [new Map([[t.id, tdata.recordId]]), recordProps];
};

/**
 * merges vertices and edges into a tinkergraph based on a specification
 */
export const tinkerData = async (
  data: TinkerDataEdge[] | TinkerDataVertex[],
  spec: ConfigSpec
): Promise<{ success: string[]; failure: string[] }> => {
  return Promise.allSettled(
    data
      .flatMap((tdata) => {
        if (spec.type === "v") {
          const [idMap, recordProps] = tinkerDataVertex(
            <TinkerDataVertex>tdata
          );
          return g
            .mergeV(idMap)
            .option(merge.onCreate, recordProps)
            .option(merge.onMatch, recordProps)
            .toList();
        }
        return tinkerDataEdge(<TinkerDataEdge>tdata).map(
          ([idMap, recordProps]) =>
            g
              .mergeE(idMap)
              .option(merge.onCreate, recordProps)
              .option(merge.onMatch, recordProps)
              .toList()
        );
      })
      .filter(Boolean)
  ).then(utils.recordsCreatedHandler);
};