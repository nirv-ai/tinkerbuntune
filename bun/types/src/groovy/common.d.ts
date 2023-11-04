/**
 * @see  https://tinkerpop.apache.org/docs/3.7.0/reference/#gremlin-javascript-imports
 *
 * common imports to match globals available in gremlin-groovy
 * useful for those coming from the practical gremlin book
 * and want a similar environment in bun without violating typescript best practices
 */
import gremlin from "gremlin";
export type WithOptions = typeof gremlin.process.withOptions;
export type EnumValue = gremlin.process.EnumValue;
export declare const common: {
    gremlin: typeof gremlin;
    p: typeof gremlin.process.P;
    traversal: typeof gremlin.process.AnonymousTraversalSource.traversal;
    DriverRemoteConnection: typeof gremlin.driver.DriverRemoteConnection;
    __: gremlin.process.Statics<gremlin.process.GraphTraversal>;
    textp: typeof gremlin.process.TextP;
    Direction: {
        BOTH: gremlin.process.EnumValue;
        from_: gremlin.process.EnumValue;
        IN: gremlin.process.EnumValue;
        OUT: gremlin.process.EnumValue;
        to: gremlin.process.EnumValue;
    };
    Bytecode: typeof gremlin.process.Bytecode;
    EnumValue: typeof gremlin.process.EnumValue;
    P: typeof gremlin.process.P;
    TextP: typeof gremlin.process.TextP;
    Traversal: typeof gremlin.process.Traversal;
    TraversalSideEffects: typeof gremlin.process.TraversalSideEffects;
    TraversalStrategies: typeof gremlin.process.TraversalStrategies;
    TraversalStrategy: typeof gremlin.process.TraversalStrategy;
    Traverser: typeof gremlin.process.Traverser;
    barrier: {
        normSack: gremlin.process.EnumValue;
    };
    cardinality: {
        list: gremlin.process.EnumValue;
        set: gremlin.process.EnumValue;
        single: gremlin.process.EnumValue;
    };
    column: {
        keys: gremlin.process.EnumValue;
        values: gremlin.process.EnumValue;
    };
    direction: gremlin.process.Direction;
    graphSONVersion: {
        v1_0: gremlin.process.EnumValue;
        v2_0: gremlin.process.EnumValue;
        v3_0: gremlin.process.EnumValue;
    };
    gryoVersion: {
        v1_0: gremlin.process.EnumValue;
        v3_0: gremlin.process.EnumValue;
    };
    merge: gremlin.process.Merge;
    operator: gremlin.process.Operator;
    order: {
        asc: gremlin.process.EnumValue;
        desc: gremlin.process.EnumValue;
        shuffle: gremlin.process.EnumValue;
    };
    pick: {
        any: gremlin.process.EnumValue;
        none: gremlin.process.EnumValue;
    };
    pop: {
        all: gremlin.process.EnumValue;
        first: gremlin.process.EnumValue;
        last: gremlin.process.EnumValue;
        mixed: gremlin.process.EnumValue;
    };
    scope: {
        global: gremlin.process.EnumValue;
        local: gremlin.process.EnumValue;
    };
    t: {
        id: gremlin.process.EnumValue;
        key: gremlin.process.EnumValue;
        label: gremlin.process.EnumValue;
        value: gremlin.process.EnumValue;
    };
    GraphTraversal: typeof gremlin.process.GraphTraversal;
    GraphTraversalSource: typeof gremlin.process.GraphTraversalSource;
    statics: gremlin.process.Statics<gremlin.process.GraphTraversal>;
    Translator: typeof gremlin.process.Translator;
    AnonymousTraversalSource: typeof gremlin.process.AnonymousTraversalSource;
    withOptions: gremlin.process.WithOptions;
    Transaction: typeof gremlin.process.Transaction;
};
//# sourceMappingURL=common.d.ts.map