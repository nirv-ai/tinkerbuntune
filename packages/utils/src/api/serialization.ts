import { encode, decode, decodeAsync, ExtensionCodec } from '@msgpack/msgpack';

const jsc = import.meta.resolveSync('bun:jsc') && (await import('bun:jsc'));

/**
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze#examples
 */
export function deepFreezeCopy(object: any) {
  const copy = Object.create(null);

  // Retrieve the property names defined on object
  const propNames = Reflect.ownKeys(object).filter(
    (k) => typeof k === 'string'
  );

  // Freeze properties before freezing self
  for (const name of propNames) {
    const value = object[name];

    copy[name] =
      value && value instanceof Object ? deepFreezeCopy(value) : value;
  }

  return Object.freeze(copy);
}

// @see https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
/**
 *
 * @param map
 */
export function mapToJsonIterator<T = Record<any, any>>(map: Map<any, any>): T {
  return Array.from(map).reduce((acc, [key, value]) => {
    acc[key] = value instanceof Map ? mapToJsonIterator(value) : value;

    return acc;
  }, Object.create(null));
}

// FYI: ~183k nanoseconds
export const toJson = <T = Record<any, any>>(data: Map<any, any>): T =>
  deepFreezeCopy(mapToJsonIterator<T>(data));

// @see https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
// FYI: ~155k nanoseconds
/**
 *
 * @param key
 * @param value
 */
export function mapTojsonReplacer(key: unknown, value: unknown) {
  if (typeof key !== 'string' || typeof key !== 'number') {
    return undefined;
  }
  return value instanceof Map ? Object.fromEntries(value.entries()) : value;
}
export const toJsonStringified = (data: Map<any, any>): string =>
  JSON.stringify(data, mapTojsonReplacer);

// @see https://bun.sh/docs/api/utils#serialize-deserialize-in-bun-jsc
// FYI: ~28k nanoseconds to deserialize(serialize(data))
export const toBunBuffer = (data: unknown) => {
  if (!jsc) {
    throw new Error('toBunBuffer requires the bun runtime');
  }
  return jsc.serialize(data);
};
export const fromBunBuffer = <T = unknown>(
  data: ArrayBufferLike | TypedArray | Buffer
): T => {
  if (!jsc) {
    throw new Error('fromBunBuffer requires the bun runtime');
  }
  return jsc.deserialize(data);
};

// MSG pack
// @see https://github.com/msgpack/msgpack-javascript/issues/236
// FYI: ~78k nanoseconds to decode(encode(data, {extensionCode}), { extensionCode})
export const encoder = { encode }; // new Encoder();
export const decoder = { decode, decodeAsync }; // new Decoder();
export const extensionCodec = new ExtensionCodec();
export const MSGPACK_HEADERS = { 'Content-Type': 'application/x-msgpack' };

// Set<T>
export const SET_EXT_TYPE = 0; // Any in 0-127
extensionCodec.register({
  type: SET_EXT_TYPE,
  encode(object: unknown): Uint8Array | null {
    if (object instanceof Set) {
      return encoder.encode([...object], { extensionCodec });
    }
    return null;
  },
  decode(data: Uint8Array) {
    const array = decoder.decode(data, { extensionCodec }) as unknown[];

    return new Set(array);
  },

  // @ts-expect-error verified working to handle decoder.decodeAsync((await fetch(some url returning msgdata)).body)
  async decodeAsync(data: ReadableStream<ArrayLike<number> | BufferSource>) {
    const array = (await decoder.decodeAsync(data, {
      extensionCodec,
    })) as unknown[];

    return new Set(array);
  },
});

// Map<T>
export const MAP_EXT_TYPE = 1; // Any in 0-127
extensionCodec.register({
  type: MAP_EXT_TYPE,
  encode(object: unknown): Uint8Array {
    if (object instanceof Map) {
      return encoder.encode([...object], { extensionCodec });
    }

    // @ts-expect-error copypasta from docs
    return null;
  },
  decode(data: Uint8Array) {
    const array = decoder.decode(data, { extensionCodec }) as [
      unknown,
      unknown
    ][];

    return new Map(array);
  },

  // @ts-expect-error verified working to handle decoder.decodeAsync((await fetch(some url returning msgdata)).body)
  async decodeAsync(data: ReadableStream<ArrayLike<number> | BufferSource>) {
    const array = (await decoder.decodeAsync(data, {
      extensionCodec,
    })) as [unknown, unknown][];

    return new Map(array);
  },
});

// @see https://github.com/noahehall/theBookOfNoah/blob/master/languages/javascript/opensource/msgpack.md#web-example
export const msgpackToJsonIterator = <T = Record<any, any>>(
  arr: [any, any]
): T =>
  arr.reduce((acc, [key, value]) => {
    acc[key] =
      value?.type === MAP_EXT_TYPE && value?.data instanceof Uint8Array
        ? msgpackToJsonIterator(
            decoder.decode(value.data, { extensionCodec }) as [any, any]
          )
        : value;

    return acc;
  }, Object.create(null));

export const msgpackToJson = async <T = Record<any, any>>(
  resp: Response
): Promise<T | null> => {
  if (
    resp.headers.get('Content-Type') !== MSGPACK_HEADERS['Content-Type'] ||
    !resp.body
  ) {
    return null;
  }

  return deepFreezeCopy(
    msgpackToJsonIterator<T>(
      decoder.decode(
        // @ts-expect-error object is unknown
        (await decoder.decodeAsync(resp.body, { extensionCodec })).data,
        { extensionCodec }
      ) as [any, any]
    )
  );
};
