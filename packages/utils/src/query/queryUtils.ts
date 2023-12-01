import { common } from '#utils'
import type { GroovyTraversal, EnumValue } from '#utils'

const { t } = common
const { keys, values } = common.column
const { addAll } = common.operator
const { flatMap, identity, project, select, unfold, union, valueMap }
  = common.__

/**
 * base opts for a gremlin traversal
 * @param end - if false returns a GroovyTraveral for chaining
 * @param limitX - e.g. traversal.range(limitX, limitY)
 * @param limitY - e.g. traversal.range(limitX, limitY)
 */
export interface BaseOptions {
  limitX?: number // TODO (noah): this should be an array of limits
  limitY?: number
  [x: string]: unknown
}

/**
 * helper fn for supplying options to a {@link GroovyTraversal}
 * @param overrides - ...
 * @returns
 */
export const getBaseOpts = (overrides: BaseOptions) => ({
  ...overrides,
  limitX: overrides.limitX ?? 0,
  limitY: overrides.limitY ?? (overrides.limitX ?? 0) + 10,
})

export const throwIfEmpty = (
  thing: string,
  received?: unknown,
): false | undefined => {
  if (!Array.isArray(received) || received.length === 0) {
    throw new Error(
      `${thing} must be a non empty array\nreceived: ${received?.toString?.()}`,
    )
  }

  return false
}

export const throwInvalidQuery = (reason: string, ...extra: any[]) => {
  throw new Error(`Invalid Query\n${reason}\n${JSON.stringify(extra)}`)
}

/*
  uses sack to create an updatable object over the lifetime of a traversal
*/
export interface ElementProperties {
  elements?: GroovyTraversal
  elKeys?: (string | EnumValue)[]
  as?: string[]
}
export const elementProps = ({
  as = [],
  elements = identity(),
  elKeys: elementKeys = [],
}: ElementProperties): GroovyTraversal =>
  elements
    .as(...as, 'base')
    .valueMap(...elementKeys)
    .by(unfold())
    .sack(addAll)
    .select('base')
    .project('id', 'label')
    .by(t.id)
    .by(t.label)
    .sack(addAll)

/*
  a simpler version of elementProps that adds id & label
*/
export interface CombineProperties extends Exclude<ElementProperties, 'as'> {
  traversals?: GroovyTraversal[]
}
export const combineProps = ({
  elements = identity(),
  elKeys: elementKeys = [],
  traversals = [],
}: CombineProperties): GroovyTraversal =>
  elements.local(
    union(
      project('id', 'label').by(t.id).by(t.label),
      valueMap(...elementKeys).by(unfold()),
      ...traversals,
    )
      .unfold()
      .group()
      .by(keys)
      .by(select(values)),
  )

/*
  groups an element by some key
*/
export const groupByIdentity = ({
  elements = identity(),
  elKeys: elementKeys = [],
}: Exclude<ElementProperties, 'as'>): GroovyTraversal =>
  elements
    .group()
    .by(elementKeys[0] ?? t.id)
    .by(flatMap(identity()))
