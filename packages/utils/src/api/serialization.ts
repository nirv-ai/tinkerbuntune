// TODO (noah): bunches of eslint disables in this file
import { encode, decode, decodeAsync, ExtensionCodec } from '@msgpack/msgpack'

/**
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze#examples
 */
export function deepFreezeCopy<T extends Record<string, unknown>>(object: T): T {
  const copy = Object.create(null) as T

  // Retrieve the property names defined on object
  const propertyNames = Reflect.ownKeys(object).filter(
    k => typeof k === 'string',
  ) as string[]

  // Freeze properties before freezing self
  for (const name of propertyNames) {
    const value = object[name]

    copy[name]
      = value && value instanceof Object ? deepFreezeCopy((value as Record<string, unknown>)) : value
  }

  return Object.freeze(copy)
}

// @see https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
/**
 *
 * @param map -
 */
export function mapToJsonIterator<T extends Record<string, unknown>>(
  map: Map<unknown, unknown>,
): T {
  return [...map].reduce((accumulator, [key, value]) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    (accumulator)[(key as string)] = value instanceof Map ? mapToJsonIterator(value) : value

    return accumulator as T
  }, Object.create(null)) as T
}

// FYI: ~183k nanoseconds
export const toJson = <T extends Record<string, unknown>>(
  data: Map<unknown, unknown>,
): T => deepFreezeCopy(mapToJsonIterator<T>(data))

// @see https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
// FYI: ~155k nanoseconds
/**
 *
 * @param key -
 * @param value -
 */
export function mapTojsonReplacer(key: unknown, value: unknown) {
  if (typeof key !== 'string' || typeof key !== 'number') {
    return
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return value instanceof Map ? Object.fromEntries(value.entries()) : value
}
export const toJsonStringified = (data: Map<unknown, unknown>): string =>
  JSON.stringify(data, mapTojsonReplacer)

// MSG pack
// @see https://github.com/msgpack/msgpack-javascript/issues/236
// FYI: ~78k nanoseconds to decode(encode(data, {extensionCode}), { extensionCode})
export const encoder = { encode } // new Encoder();
export const decoder = { decode, decodeAsync } // new Decoder();
export const extensionCodec = new ExtensionCodec()
export const MSGPACK_HEADERS = { 'Content-Type': 'application/x-msgpack' }

// Set<T>
export const SET_EXT_TYPE = 0 // Any in 0-127
extensionCodec.register({
  type: SET_EXT_TYPE,
  encode(object: unknown): Uint8Array | null {
    if (object instanceof Set) {
      return encoder.encode([...object], { extensionCodec })
    }
    // eslint-disable-next-line unicorn/no-null
    return null
  },
  decode(data: Uint8Array) {
    const array = decoder.decode(data, { extensionCodec }) as unknown[]

    return new Set(array)
  },

  // @ts-expect-error verified working to handle decoder.decodeAsync((await fetch(some url returning msgdata)).body)
  async decodeAsync(data: ReadableStream<ArrayLike<number> | BufferSource>) {
    const array = (await decoder.decodeAsync(data, {
      extensionCodec,
    })) as unknown[]

    return new Set(array)
  },
})

// Map<T>
export const MAP_EXT_TYPE = 1 // Any in 0-127
extensionCodec.register({
  type: MAP_EXT_TYPE,
  encode(object: unknown): Uint8Array {
    if (object instanceof Map) {
      return encoder.encode([...object], { extensionCodec })
    }

    // @ts-expect-error copypasta from docs
    return undefined
  },
  decode(data: Uint8Array) {
    const array = decoder.decode(data, { extensionCodec }) as [
      unknown,
      unknown,
    ][]

    return new Map(array)
  },

  // @ts-expect-error verified working to handle decoder.decodeAsync((await fetch(some url returning msgdata)).body)
  async decodeAsync(data: ReadableStream<ArrayLike<number> | BufferSource>) {
    const array = (await decoder.decodeAsync(data, {
      extensionCodec,
    })) as [unknown, unknown][]

    return new Map(array)
  },
})

// @see https://github.com/noahehall/theBookOfNoah/blob/master/languages/javascript/opensource/msgpack.md#web-example
export const msgpackToJsonIterator = <T extends Record<string, unknown>>(
  array: [unknown, unknown],
): T =>
    (array.reduce((accumulator, [key, value]) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      accumulator[key]
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      = value?.type === MAP_EXT_TYPE && value?.data instanceof Uint8Array
          ? msgpackToJsonIterator(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            (decoder.decode(value.data, { extensionCodec }) as [unknown, unknown]),
          )
          : value

      return accumulator as T
    }, Object.create(null)) as T)

export const msgpackToJson = async <T extends Record<string, unknown>>(
  resp: Response,
): Promise<T | undefined> => {
  if (
    resp.headers.get('Content-Type') !== MSGPACK_HEADERS['Content-Type']
    || !resp.body
  ) {
    return undefined
  }

  return deepFreezeCopy(
    msgpackToJsonIterator(
      decoder.decode(
        (await decoder.decodeAsync(resp.body, { extensionCodec }))?.data as ArrayLike<number>,
        { extensionCodec },
      ) as [unknown, unknown],
    ),
  )
}
