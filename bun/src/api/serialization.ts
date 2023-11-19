import { serialize, deserialize } from "bun:jsc";
import { encode, decode, decodeAsync, ExtensionCodec } from "@msgpack/msgpack";

// @see https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
export function jsonReplacer(key: unknown, value: unknown) {
  if (value instanceof Map) {
    return Object.fromEntries(value.entries());
  } else {
    return value;
  }
}

// @see https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
export function mapToJsonIterator<T = Record<any, any>>(map: Map<any, any>): T {
  // @ts-ignore
  return Array.from(map).reduce((acc, [key, value]) => {
    if (value instanceof Map) {
      // @ts-ignore
      acc[key] = mapToJsonIterator(value);
    } else {
      // @ts-ignore
      acc[key] = value;
    }

    return acc;
  }, {});
}

// FYI: ~183k nanoseconds
export const toJson = <T = Record<any, any>>(data: Map<any, any>): T =>
  mapToJsonIterator<T>(data);

// FYI: ~155k nanoseconds
export const toJsonStringified = (data: Map<any, any>): string =>
  JSON.stringify(data, jsonReplacer);

// @see https://bun.sh/docs/api/utils#serialize-deserialize-in-bun-jsc
// FYI: ~28k nanoseconds to deserialize(serialize(data))
export const toSharedBuffer = (data: unknown) => serialize(data);
export const fromBuffer = <T = unknown>(
  data: ArrayBufferLike | TypedArray | Buffer
): T => deserialize(data);

// MSG pack
// @see https://github.com/msgpack/msgpack-javascript/issues/236
// FYI: ~78k nanoseconds to decode(encode(data, {extensionCode}), { extensionCode})
export const encoder = { encode }; //new Encoder();
export const decoder = { decode, decodeAsync }; //new Decoder();
export const extensionCodec = new ExtensionCodec();
export const MSGPACK_HEADERS = { "Content-Type": "application/x-msgpack" };

// Set<T>
export const SET_EXT_TYPE = 0; // Any in 0-127
extensionCodec.register({
  type: SET_EXT_TYPE,
  encode: (object: unknown): Uint8Array | null => {
    if (object instanceof Set) {
      return encoder.encode([...object], { extensionCodec });
    } else {
      return null;
    }
  },
  decode: (data: Uint8Array) => {
    const array = decoder.decode(data, { extensionCodec }) as Array<unknown>;
    return new Set(array);
  },
  // @ts-ignore verified working to handle decoder.decodeAsync((await fetch(some url returning msgdata)).body)
  decodeAsync: async (
    data: ReadableStream<ArrayLike<number> | BufferSource>
  ) => {
    const array = (await decoder.decodeAsync(data, {
      extensionCodec,
    })) as Array<unknown>;
    return new Set(array);
  },
});

// Map<T>
export const MAP_EXT_TYPE = 1; // Any in 0-127
extensionCodec.register({
  type: MAP_EXT_TYPE,
  encode: (object: unknown): Uint8Array => {
    if (object instanceof Map) {
      return encoder.encode([...object], { extensionCodec });
    } else {
      // @ts-ignore copypasta from docs
      return null;
    }
  },
  decode: (data: Uint8Array) => {
    const array = decoder.decode(data, { extensionCodec }) as Array<
      [unknown, unknown]
    >;
    return new Map(array);
  },
  // @ts-ignore verified working to handle decoder.decodeAsync((await fetch(some url returning msgdata)).body)
  decodeAsync: async (
    data: ReadableStream<ArrayLike<number> | BufferSource>
  ) => {
    const array = (await decoder.decodeAsync(data, {
      extensionCodec,
    })) as Array<[unknown, unknown]>;
    return new Map(array);
  },
});

// @see https://github.com/noahehall/theBookOfNoah/blob/master/languages/javascript/opensource/msgpack.md#web-example
export const msgpackToJsonIterator = <T = Record<any, any>>(
  arr: [any, any]
): T => {
  return arr.reduce((acc, [key, value]) => {
    if (value?.type === MAP_EXT_TYPE && value?.data instanceof Uint8Array) {
      acc[key] = msgpackToJsonIterator(
        // @ts-ignore object is unknown
        decoder.decode(value.data, { extensionCodec })
      );
    } else {
      // @ts-ignore
      acc[key] = value;
    }

    return acc;
  }, {});
};

export const msgpackToJson = async <T = Record<any, any>>(
  resp: Response
): Promise<T | null> => {
  if (!resp.body) return null;
  return <T>msgpackToJsonIterator<T>(
    // @ts-ignore object is unknown
    decoder.decode(
      // @ts-ignore object is unknown
      (await decoder.decodeAsync(resp.body, { extensionCodec })).data,
      { extensionCodec }
    )
  );
};
