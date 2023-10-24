import { common } from "groovy/common";
import { g } from "remote";
import * as utils from "./utils";
import type { ConfigSpec, TinkerDataEdge, TinkerDataVertex } from "types";

const { t, Direction } = common;

type EnumValue = InstanceType<typeof common.EnumValue>;

export const tinkerDataEdge = (tdata: TinkerDataEdge) => {
  return tdata.edges.map((edgeData) => {
    const recordProps = new Map<string | EnumValue, any>(
      Object.entries(edgeData.p || {})
    );
    recordProps.set(t.label, edgeData.l);
    recordProps.set(Direction.OUT, edgeData.f);
    recordProps.set(Direction.IN, edgeData.t);
    recordProps.set(t.id, edgeData.recordId);

    return recordProps;
  });
};

export const tinkerDataVertex = (tdata: TinkerDataVertex) => {
  const recordProps = new Map<string | EnumValue, any>(
    Object.entries(tdata.p!)
  );

  recordProps.set(t.id, tdata.recordId);
  if (tdata.l) recordProps.set(t.label, utils.getVertexLabel(tdata.l));

  return recordProps;
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
        return spec.type === "v"
          ? g.mergeV(tinkerDataVertex(<TinkerDataVertex>tdata)).toList()
          : tinkerDataEdge(<TinkerDataEdge>tdata).map((edgeData) =>
              g.mergeE(edgeData).toList()
            );
      })
      .filter(Boolean)
  ).then(utils.recordsCreatedHandler);
};
