import { common } from "groovy/common";
const { t } = common;
const { keys, values } = common.column;
const { addAll } = common.operator;
const { flatMap, group, identity, project, select, unfold, union, valueMap } = common.__;
/**
 * helper fn for supplying options to a {@link GroovyTraversal}
 * @param overrides
 * @returns
 */
export const getBaseOpts = (overrides) => ({
    limitX: 0,
    limitY: (overrides.limitX ?? 0) + 10,
    ...overrides,
});
export function next(nextOpts) {
    return typeof nextOpts.end === "undefined"
        ? nextOpts.gt.next()
        : nextOpts.gt;
}
export const throwIfEmpty = (thing, received) => {
    if (!Array.isArray(received) || !received.length)
        throw new Error(`${thing} must be a non empty array\nreceived: ${received}`);
    return false;
};
export const throwInvalidQuery = (reason, ...extra) => {
    throw new Error(`Invalid Query\n${reason}\n${JSON.stringify(extra)}`);
};
export const elementProps = ({ as = [], elements = identity(), elKeys = [], }) => {
    // @ts-ignore GraphTraversal doesnt have keys
    return elements
        .as(...as.concat("base"))
        .valueMap(...elKeys)
        .by(unfold())
        .sack(addAll)
        .select("base")
        .project("id", "label")
        .by(t.id)
        .by(t.label)
        .sack(addAll);
};
export const combineProps = ({ elements = identity(), elKeys = [], traversals = [], }) => {
    // @ts-ignore GraphTraversal doesnt have keys
    return elements.local(union(project("id", "label").by(t.id).by(t.label), valueMap(...elKeys).by(unfold()), ...traversals)
        .unfold()
        .group()
        .by(keys)
        .by(select(values)));
};
/*
  groups an element by some key
*/
export const groupByIdentity = ({ elements = identity(), elKeys = [], }) => 
// @ts-ignore GraphTraversal doesnt have keys
elements
    .group()
    .by(elKeys[0] ?? t.id)
    .by(flatMap(identity()));
