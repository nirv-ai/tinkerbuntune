/// <reference types="bun-types" />
import { encode, decode, decodeAsync, ExtensionCodec } from "@msgpack/msgpack";
export declare function jsonReplacer(key: unknown, value: unknown): any;
export declare function mapToJsonIterator<T = Record<any, any>>(map: Map<any, any>): T;
export declare const toJson: <T = Record<any, any>>(data: Map<any, any>) => T;
export declare const toJsonStringified: (data: Map<any, any>) => string;
export declare const toSharedBuffer: (data: unknown) => SharedArrayBuffer;
export declare const fromBuffer: <T = unknown>(data: ArrayBufferLike | TypedArray | Buffer) => T;
export declare const encoder: {
    encode: typeof encode;
};
export declare const decoder: {
    decode: typeof decode;
    decodeAsync: typeof decodeAsync;
};
export declare const extensionCodec: ExtensionCodec<undefined>;
export declare const MSGPACK_HEADERS: {
    "Content-Type": string;
};
export declare const SET_EXT_TYPE = 0;
export declare const MAP_EXT_TYPE = 1;
export declare const msgpackToJsonIterator: <T = Record<any, any>>(arr: [any, any]) => T;
export declare const msgpackToJson: <T = Record<any, any>>(resp: Response) => Promise<T | null>;
//# sourceMappingURL=serialization.d.ts.map