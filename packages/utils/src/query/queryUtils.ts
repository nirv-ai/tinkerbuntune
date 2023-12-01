import { common } from '#utils'
import type { GroovyTraversal, type EnumValue } from '#utils'

const { t } = common
const { keys, values } = common.column
const { addAll } = common.operator
const { flatMap, identity, project, select, unfold, union, valueMap }
  = common.__

/**
 * base opts for a gremlin traversal
 * @property end if false returns a GroovyTraveral for chaining
 * @property limitX e.g. traversal.range(limitX, limitY)
 * @property limitY e.g. traversal.range(limitX, limitY)
 */
export interface BaseOpts {
  limitX?: number // TODO (noah): this should be an array of limits
  limitY?: number
  [x: string]: unknown
}

/**
 * helper fn for supplying options to a {@link GroovyTraversal}
 * @param overrides
 * @returns
 */
export const getBaseOpts = (overrides: BaseOpts) => ({
  ...overrides,
  limitX: overrides.limitX ?? 0,
  limitY: overrides.limitY ?? (overrides.limitX ?? 0) + 10,
})

export const throwIfEmpty = (
  thing: string,
  received?: unknown,
): false | undefined => {
  if (!Array.isArray(received) || !received.length) {
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
export interface ElementProps {
  elements?: GroovyTraversal
  elKeys?: (string | EnumValue)[]
  as?: string[]
}
export const elementProps = ({
  as = [],
  elements = identity(),
  elKeys = [],
}: ElementProps): GroovyTraversal =>
  elements
    .as(...as.concat('base'))
    .valueMap(...elKeys)
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
export interface CombineProps extends Exclude<ElementProps, 'as'> {
  traversals?: GroovyTraversal[]
}
export const combineProps = ({
  elements = identity(),
  elKeys = [],
  traversals = [],
}: CombineProps): GroovyTraversal =>
  elements.local(
    union(
      project('id', 'label').by(t.id).by(t.label),
      valueMap(...elKeys).by(unfold()),
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
  elKeys = [],
}: Exclude<ElementProps, 'as'>): GroovyTraversal =>
  elements
    .group()
    .by(elKeys[0] ?? t.id)
    .by(flatMap(identity()))
