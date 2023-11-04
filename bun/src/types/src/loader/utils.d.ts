import type { NumStr } from "types";
/**
 * drops the extension from a path
 *
 * @param fname string e.g. blah.csv
 * @returns string
 */
export declare const fnameToBname: (fname: string) => string;
/**
 * adds an extension to a filename
 *
 * @param bname a filename e.g. `blah`
 * @param ext to add to filename e.g. `csv`
 * @returns string with extension added
 */
export declare const bnameTofname: (bname: string, ext?: string) => string;
/**
 * converts a postgres date string to a javascript date object
 * @see https://docs.aws.amazon.com/neptune/latest/userguide/best-practices-gremlin-datetime-glv.html
 *
 * @param date string
 * @returns javascript Date
 */
export declare const pgDateToJs: (date: string) => Date;
/**
 * creates a hash of some string
 * @see https://bun.sh/docs/api/hashing#bun-hash
 */
export declare const hashId: (id: string) => string;
/**
 * neptune requires 1 label for every edge
 *
 * @param data array with a single edge label
 * @returns {@link NumStr}
 */
export declare const getEdgeLabel: (data: NumStr) => NumStr;
/**
 * neptune allows 1/more labels for every vertex but recommends at most 1
 * but tinkergraph only allows 1 label, we use the label at index 0
 *
 * @param data array with 1/more edge labels
 * @returns
 */
export declare const getVertexLabel: (data: NumStr[]) => NumStr;
/**
 * returns a fn to retrieve a vertex/edge label depending on the config type
 *
 * @param type V or E
 * @returns
 */
export declare const getLabel: <T = "v" | "e">(type: T) => typeof getVertexLabel | typeof getEdgeLabel;
/**
 * reduces a Promise.allSettled response to {success[], failure[]} object
 *
 * @param result PromiseSettledResult
 * @returns
 */
export declare const recordsCreatedHandler: (result: PromiseSettledResult<unknown[]>[]) => {
    success: any[];
    failure: string[];
};
