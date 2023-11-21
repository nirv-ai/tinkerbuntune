// @bun
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __require = (id) => {
  return import.meta.require(id);
};

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/process/traversal.js
var require_traversal = __commonJS((exports, module) => {
  var createP = function(operator, args) {
    args.unshift(null, operator);
    return new (Function.prototype.bind.apply(P, args));
  };
  var createTextP = function(operator, args) {
    args.unshift(null, operator);
    return new (Function.prototype.bind.apply(TextP, args));
  };
  var toEnum = function(typeName, keys) {
    const result = {};
    keys.split(" ").forEach((k) => {
      let jsKey = k;
      if (jsKey === jsKey.toUpperCase()) {
        jsKey = jsKey.toLowerCase();
      }
      result[jsKey] = new EnumValue(typeName, k);
    });
    return result;
  };
  var itemDone = Object.freeze({ value: null, done: true });
  var asyncIteratorSymbol = Symbol.asyncIterator || Symbol("@@asyncIterator");

  class Traversal {
    constructor(graph, traversalStrategies, bytecode) {
      this.graph = graph;
      this.traversalStrategies = traversalStrategies;
      this.bytecode = bytecode;
      this.traversers = null;
      this.sideEffects = null;
      this._traversalStrategiesPromise = null;
      this._traversersIteratorIndex = 0;
    }
    [asyncIteratorSymbol]() {
      return this;
    }
    getBytecode() {
      return this.bytecode;
    }
    toList() {
      return this._applyStrategies().then(() => {
        const result = [];
        let it;
        while ((it = this._getNext()) && !it.done) {
          result.push(it.value);
        }
        return result;
      });
    }
    hasNext() {
      return this._applyStrategies().then(() => this.traversers && this.traversers.length > 0 && this._traversersIteratorIndex < this.traversers.length && this.traversers[this._traversersIteratorIndex].bulk > 0);
    }
    iterate() {
      this.bytecode.addStep("none");
      return this._applyStrategies().then(() => {
        let it;
        while ((it = this._getNext()) && !it.done) {
        }
      });
    }
    next() {
      return this._applyStrategies().then(() => this._getNext());
    }
    _getNext() {
      while (this.traversers && this._traversersIteratorIndex < this.traversers.length) {
        const traverser = this.traversers[this._traversersIteratorIndex];
        if (traverser.bulk > 0) {
          traverser.bulk--;
          return { value: traverser.object, done: false };
        }
        this._traversersIteratorIndex++;
      }
      return itemDone;
    }
    _applyStrategies() {
      if (this._traversalStrategiesPromise) {
        return this._traversalStrategiesPromise;
      }
      return this._traversalStrategiesPromise = this.traversalStrategies.applyStrategies(this);
    }
    toJSON() {
      return this.bytecode.stepInstructions;
    }
    toString() {
      return this.bytecode.toString();
    }
  }

  class IO {
    static get graphml() {
      return "graphml";
    }
    static get graphson() {
      return "graphson";
    }
    static get gryo() {
      return "gryo";
    }
    static get reader() {
      return "~tinkerpop.io.reader";
    }
    static get registry() {
      return "~tinkerpop.io.registry";
    }
    static get writer() {
      return "~tinkerpop.io.writer";
    }
  }

  class P {
    constructor(operator, value, other) {
      this.operator = operator;
      this.value = value;
      this.other = other;
    }
    toString() {
      function formatValue(value) {
        if (Array.isArray(value)) {
          const acc = [];
          for (const item of value) {
            acc.push(formatValue(item));
          }
          return acc;
        }
        if (value && typeof value === "string") {
          return `'${value}'`;
        }
        return value;
      }
      if (this.other === undefined || this.other === null) {
        return this.operator + "(" + formatValue(this.value) + ")";
      }
      return this.operator + "(" + formatValue(this.value) + ", " + formatValue(this.other) + ")";
    }
    and(arg) {
      return new P("and", this, arg);
    }
    or(arg) {
      return new P("or", this, arg);
    }
    static within(...args) {
      if (args.length === 1 && Array.isArray(args[0])) {
        return new P("within", args[0], null);
      }
      return new P("within", args, null);
    }
    static without(...args) {
      if (args.length === 1 && Array.isArray(args[0])) {
        return new P("without", args[0], null);
      }
      return new P("without", args, null);
    }
    static between(...args) {
      return createP("between", args);
    }
    static eq(...args) {
      return createP("eq", args);
    }
    static gt(...args) {
      return createP("gt", args);
    }
    static gte(...args) {
      return createP("gte", args);
    }
    static inside(...args) {
      return createP("inside", args);
    }
    static lt(...args) {
      return createP("lt", args);
    }
    static lte(...args) {
      return createP("lte", args);
    }
    static neq(...args) {
      return createP("neq", args);
    }
    static not(...args) {
      return createP("not", args);
    }
    static outside(...args) {
      return createP("outside", args);
    }
    static test(...args) {
      return createP("test", args);
    }
  }

  class TextP {
    constructor(operator, value, other) {
      this.operator = operator;
      this.value = value;
      this.other = other;
    }
    toString() {
      function formatValue(value) {
        if (value && typeof value === "string") {
          return `'${value}'`;
        }
        return value;
      }
      if (this.other === undefined) {
        return this.operator + "(" + formatValue(this.value) + ")";
      }
      return this.operator + "(" + formatValue(this.value) + ", " + formatValue(this.other) + ")";
    }
    and(arg) {
      return new P("and", this, arg);
    }
    or(arg) {
      return new P("or", this, arg);
    }
    static containing(...args) {
      return createTextP("containing", args);
    }
    static endingWith(...args) {
      return createTextP("endingWith", args);
    }
    static notContaining(...args) {
      return createTextP("notContaining", args);
    }
    static notEndingWith(...args) {
      return createTextP("notEndingWith", args);
    }
    static notStartingWith(...args) {
      return createTextP("notStartingWith", args);
    }
    static startingWith(...args) {
      return createTextP("startingWith", args);
    }
    static regex(...args) {
      return createTextP("regex", args);
    }
    static notRegex(...args) {
      return createTextP("notRegex", args);
    }
  }

  class Traverser {
    constructor(object, bulk) {
      this.object = object;
      this.bulk = bulk || 1;
    }
  }

  class TraversalSideEffects {
  }
  var withOptions = {
    tokens: "~tinkerpop.valueMap.tokens",
    none: 0,
    ids: 1,
    labels: 2,
    keys: 4,
    values: 8,
    all: 15,
    indexer: "~tinkerpop.index.indexer",
    list: 0,
    map: 1
  };

  class EnumValue {
    constructor(typeName, elementName) {
      this.typeName = typeName;
      this.elementName = elementName;
    }
    toString() {
      return this.elementName;
    }
  }
  module.exports = {
    EnumValue,
    P,
    TextP,
    withOptions,
    IO,
    Traversal,
    TraversalSideEffects,
    Traverser,
    barrier: toEnum("Barrier", "normSack"),
    cardinality: toEnum("Cardinality", "list set single"),
    column: toEnum("Column", "keys values"),
    direction: toEnum("Direction", "BOTH IN OUT from_ to"),
    graphSONVersion: toEnum("GraphSONVersion", "V1_0 V2_0 V3_0"),
    gryoVersion: toEnum("GryoVersion", "V1_0 V3_0"),
    merge: toEnum("Merge", "onCreate onMatch outV inV"),
    operator: toEnum("Operator", "addAll and assign div max min minus mult or sum sumLong"),
    order: toEnum("Order", "asc desc shuffle"),
    pick: toEnum("Pick", "any none"),
    pop: toEnum("Pop", "all first last mixed"),
    scope: toEnum("Scope", "global local"),
    t: toEnum("T", "id key label value")
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/process/traversal-strategy.js
var require_traversal_strategy = __commonJS((exports, module) => {
  var Traversal = require_traversal().Traversal;

  class TraversalStrategies {
    constructor(parent) {
      if (parent) {
        this.strategies = [...parent.strategies];
      } else {
        this.strategies = [];
      }
    }
    addStrategy(strategy) {
      this.strategies.push(strategy);
    }
    removeStrategy(strategy) {
      const idx = this.strategies.findIndex((s) => s.fqcn === strategy.fqcn);
      if (idx !== -1) {
        return this.strategies.splice(idx, 1)[0];
      }
      return;
    }
    applyStrategies(traversal) {
      return this.strategies.reduce((promise, strategy) => promise.then(() => strategy.apply(traversal)), Promise.resolve());
    }
  }

  class TraversalStrategy {
    constructor(fqcn, configuration = {}) {
      this.fqcn = fqcn;
      this.configuration = configuration;
    }
    apply(traversal) {
    }
  }

  class ConnectiveStrategy extends TraversalStrategy {
    constructor() {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.decoration.ConnectiveStrategy");
    }
  }

  class ElementIdStrategy extends TraversalStrategy {
    constructor() {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.decoration.ElementIdStrategy");
    }
  }

  class HaltedTraverserStrategy extends TraversalStrategy {
    constructor(haltedTraverserFactory) {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.decoration.HaltedTraverserStrategy");
      if (haltedTraverserFactory !== undefined) {
        this.configuration["haltedTraverserFactory"] = haltedTraverserFactory;
      }
    }
  }

  class OptionsStrategy extends TraversalStrategy {
    constructor(options) {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.decoration.OptionsStrategy", options);
    }
  }

  class PartitionStrategy extends TraversalStrategy {
    constructor(options) {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.decoration.PartitionStrategy", options);
    }
  }

  class SubgraphStrategy extends TraversalStrategy {
    constructor(options) {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.decoration.SubgraphStrategy", options);
      if (this.configuration.vertices instanceof Traversal) {
        this.configuration.vertices = this.configuration.vertices.bytecode;
      }
      if (this.configuration.edges instanceof Traversal) {
        this.configuration.edges = this.configuration.edges.bytecode;
      }
      if (this.configuration.vertexProperties instanceof Traversal) {
        this.configuration.vertexProperties = this.configuration.vertexProperties.bytecode;
      }
    }
  }

  class ProductiveByStrategy extends TraversalStrategy {
    constructor(options) {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.optimization.ProductiveByStrategy", options);
    }
  }

  class VertexProgramStrategy extends TraversalStrategy {
    constructor(options) {
      super("org.apache.tinkerpop.gremlin.process.computer.traversal.strategy.decoration.VertexProgramStrategy", options);
    }
  }

  class MatchAlgorithmStrategy extends TraversalStrategy {
    constructor(matchAlgorithm) {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.finalization.MatchAlgorithmStrategy");
      if (matchAlgorithm !== undefined) {
        this.configuration["matchAlgorithm"] = matchAlgorithm;
      }
    }
  }

  class AdjacentToIncidentStrategy extends TraversalStrategy {
    constructor() {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.optimization.AdjacentToIncidentStrategy");
    }
  }

  class FilterRankingStrategy extends TraversalStrategy {
    constructor() {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.optimization.FilterRankingStrategy");
    }
  }

  class IdentityRemovalStrategy extends TraversalStrategy {
    constructor() {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.optimization.IdentityRemovalStrategy");
    }
  }

  class IncidentToAdjacentStrategy extends TraversalStrategy {
    constructor() {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.optimization.IncidentToAdjacentStrategy");
    }
  }

  class InlineFilterStrategy extends TraversalStrategy {
    constructor() {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.optimization.InlineFilterStrategy");
    }
  }

  class LazyBarrierStrategy extends TraversalStrategy {
    constructor() {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.optimization.LazyBarrierStrategy");
    }
  }

  class MatchPredicateStrategy extends TraversalStrategy {
    constructor() {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.optimization.MatchPredicateStrategy");
    }
  }

  class OrderLimitStrategy extends TraversalStrategy {
    constructor() {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.optimization.OrderLimitStrategy");
    }
  }

  class PathProcessorStrategy extends TraversalStrategy {
    constructor() {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.optimization.PathProcessorStrategy");
    }
  }

  class PathRetractionStrategy extends TraversalStrategy {
    constructor() {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.optimization.PathRetractionStrategy");
    }
  }

  class CountStrategy extends TraversalStrategy {
    constructor() {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.optimization.CountStrategy");
    }
  }

  class RepeatUnrollStrategy extends TraversalStrategy {
    constructor() {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.optimization.RepeatUnrollStrategy");
    }
  }

  class GraphFilterStrategy extends TraversalStrategy {
    constructor() {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.optimization.GraphFilterStrategy");
    }
  }

  class EarlyLimitStrategy extends TraversalStrategy {
    constructor() {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.optimization.EarlyLimitStrategy");
    }
  }

  class LambdaRestrictionStrategy extends TraversalStrategy {
    constructor() {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.verification.LambdaRestrictionStrategy");
    }
  }

  class ReadOnlyStrategy extends TraversalStrategy {
    constructor() {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.verification.ReadOnlyStrategy");
    }
  }

  class EdgeLabelVerificationStrategy extends TraversalStrategy {
    constructor(logWarnings = false, throwException = false) {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.verification.EdgeLabelVerificationStrategy", {
        logWarnings,
        throwException
      });
    }
  }

  class ReservedKeysVerificationStrategy extends TraversalStrategy {
    constructor(logWarnings = false, throwException = false, keys = ["id", "label"]) {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.verification.ReservedKeysVerificationStrategy", {
        logWarnings,
        throwException,
        keys
      });
    }
  }

  class SeedStrategy extends TraversalStrategy {
    constructor(options) {
      super("org.apache.tinkerpop.gremlin.process.traversal.strategy.decoration.SeedStrategy", {
        seed: options.seed
      });
    }
  }
  module.exports = {
    TraversalStrategies,
    TraversalStrategy,
    ConnectiveStrategy,
    ElementIdStrategy,
    HaltedTraverserStrategy,
    OptionsStrategy,
    PartitionStrategy,
    SeedStrategy,
    SubgraphStrategy,
    VertexProgramStrategy,
    MatchAlgorithmStrategy,
    AdjacentToIncidentStrategy,
    FilterRankingStrategy,
    IdentityRemovalStrategy,
    IncidentToAdjacentStrategy,
    InlineFilterStrategy,
    LazyBarrierStrategy,
    MatchPredicateStrategy,
    OrderLimitStrategy,
    PathProcessorStrategy,
    PathRetractionStrategy,
    ProductiveByStrategy,
    CountStrategy,
    RepeatUnrollStrategy,
    GraphFilterStrategy,
    EarlyLimitStrategy,
    EdgeLabelVerificationStrategy,
    LambdaRestrictionStrategy,
    ReadOnlyStrategy,
    ReservedKeysVerificationStrategy
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/driver/remote-connection.js
var require_remote_connection = __commonJS((exports, module) => {
  var t = require_traversal();
  var TraversalStrategy = require_traversal_strategy().TraversalStrategy;

  class RemoteConnection {
    constructor(url, options = {}) {
      this.url = url;
      this.options = options;
    }
    open() {
      throw new Error("open() must be implemented");
    }
    get isOpen() {
      throw new Error("isOpen() must be implemented");
    }
    get isSessionBound() {
      return false;
    }
    submit(bytecode) {
      throw new Error("submit() must be implemented");
    }
    createSession() {
      throw new Error("createSession() must be implemented");
    }
    commit() {
      throw new Error("commit() must be implemented");
    }
    rollback() {
      throw new Error("rollback() must be implemented");
    }
    close() {
      throw new Error("close() must be implemented");
    }
  }

  class RemoteTraversal extends t.Traversal {
    constructor(traversers, sideEffects) {
      super(null, null, null);
      this.traversers = traversers;
      this.sideEffects = sideEffects;
    }
  }

  class RemoteStrategy extends TraversalStrategy {
    constructor(connection) {
      super("js:RemoteStrategy");
      this.connection = connection;
    }
    apply(traversal) {
      if (traversal.traversers) {
        return Promise.resolve();
      }
      return this.connection.submit(traversal.getBytecode()).then(function(remoteTraversal) {
        traversal.sideEffects = remoteTraversal.sideEffects;
        traversal.traversers = remoteTraversal.traversers;
      });
    }
  }
  module.exports = { RemoteConnection, RemoteStrategy, RemoteTraversal };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/process/bytecode.js
var require_bytecode = __commonJS((exports, module) => {
  var { Traversal } = require_traversal();

  class Bytecode {
    constructor(toClone) {
      if (!toClone) {
        this.sourceInstructions = [];
        this.stepInstructions = [];
      } else {
        this.sourceInstructions = [...toClone.sourceInstructions];
        this.stepInstructions = [...toClone.stepInstructions];
      }
    }
    addSource(name, values) {
      if (name === undefined) {
        throw new Error("Name is not defined");
      }
      const instruction = new Array(values.length + 1);
      instruction[0] = name;
      for (let i = 0;i < values.length; ++i) {
        instruction[i + 1] = values[i];
      }
      this.sourceInstructions.push(Bytecode._generateInstruction(name, values));
      return this;
    }
    addStep(name, values) {
      if (name === undefined) {
        throw new Error("Name is not defined");
      }
      this.stepInstructions.push(Bytecode._generateInstruction(name, values));
      return this;
    }
    static _generateInstruction(name, values) {
      const length = (values ? values.length : 0) + 1;
      const instruction = new Array(length);
      instruction[0] = name;
      for (let i = 1;i < length; i++) {
        const val = values[i - 1];
        if (val instanceof Traversal && val.graph != null) {
          throw new Error(`The child traversal of ${val} was not spawned anonymously - use ` + "the __ class rather than a TraversalSource to construct the child traversal");
        }
        instruction[i] = val;
      }
      return instruction;
    }
    toString() {
      return JSON.stringify([this.sourceInstructions, this.stepInstructions]);
    }
    static _createGraphOp(name, values) {
      const bc = new Bytecode;
      bc.addSource(name, values);
      return bc;
    }
    static get GraphOp() {
      return {
        commit: Bytecode._createGraphOp("tx", ["commit"]),
        rollback: Bytecode._createGraphOp("tx", ["rollback"])
      };
    }
  }
  module.exports = Bytecode;
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/process/transaction.js
var require_transaction = __commonJS((exports, module) => {
  var remote = require_remote_connection();
  var Bytecode = require_bytecode();
  var { TraversalStrategies } = require_traversal_strategy();

  class Transaction {
    constructor(g) {
      this._g = g;
      this._sessionBasedConnection = undefined;
    }
    begin() {
      if (this._sessionBasedConnection) {
        throw new Error("Transaction already started on this object");
      }
      this._sessionBasedConnection = this._g.remoteConnection.createSession();
      const traversalStrategy = new TraversalStrategies;
      traversalStrategy.addStrategy(new remote.RemoteStrategy(this._sessionBasedConnection));
      return new this._g.graphTraversalSourceClass(this._g.graph, traversalStrategy, new Bytecode(this._g.bytecode), this._g.graphTraversalSourceClass, this._g.graphTraversalClass);
    }
    commit() {
      return this._sessionBasedConnection.commit().then(() => this.close());
    }
    rollback() {
      return this._sessionBasedConnection.rollback().then(() => this.close());
    }
    get isOpen() {
      return this._sessionBasedConnection.isOpen;
    }
    close() {
      if (this._sessionBasedConnection) {
        this._sessionBasedConnection.close();
      }
    }
  }
  module.exports = {
    Transaction
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/process/graph-traversal.js
var require_graph_traversal = __commonJS((exports, module) => {
  var callOnEmptyTraversal = function(fnName, args) {
    const g = new GraphTraversal(null, null, new Bytecode);
    return g[fnName].apply(g, args);
  };
  var { Traversal } = require_traversal();
  var { Transaction } = require_transaction();
  var remote = require_remote_connection();
  var Bytecode = require_bytecode();
  var { TraversalStrategies, VertexProgramStrategy, OptionsStrategy } = require_traversal_strategy();

  class GraphTraversalSource {
    constructor(graph, traversalStrategies, bytecode, graphTraversalSourceClass, graphTraversalClass) {
      this.graph = graph;
      this.traversalStrategies = traversalStrategies;
      this.bytecode = bytecode || new Bytecode;
      this.graphTraversalSourceClass = graphTraversalSourceClass || GraphTraversalSource;
      this.graphTraversalClass = graphTraversalClass || GraphTraversal;
      const strat = traversalStrategies.strategies.find((ts) => ts.fqcn === "js:RemoteStrategy");
      this.remoteConnection = strat !== undefined ? strat.connection : undefined;
    }
    withRemote(remoteConnection) {
      const traversalStrategy = new TraversalStrategies(this.traversalStrategies);
      traversalStrategy.addStrategy(new remote.RemoteStrategy(remoteConnection));
      return new this.graphTraversalSourceClass(this.graph, traversalStrategy, new Bytecode(this.bytecode), this.graphTraversalSourceClass, this.graphTraversalClass);
    }
    tx() {
      if (this.remoteConnection && this.remoteConnection.isSessionBound) {
        throw new Error("This TraversalSource is already bound to a transaction - child transactions are not supported");
      }
      return new Transaction(this);
    }
    withComputer(graphComputer, workers, result, persist, vertices, edges, configuration) {
      const m = {};
      if (graphComputer !== undefined) {
        m.graphComputer = graphComputer;
      }
      if (workers !== undefined) {
        m.workers = workers;
      }
      if (result !== undefined) {
        m.result = result;
      }
      if (persist !== undefined) {
        m.graphComputer = persist;
      }
      if (vertices !== undefined) {
        m.vertices = vertices;
      }
      if (edges !== undefined) {
        m.edges = edges;
      }
      if (configuration !== undefined) {
        m.configuration = configuration;
      }
      return this.withStrategies(new VertexProgramStrategy(m));
    }
    with_(key, value = undefined) {
      const val = value === undefined ? true : value;
      let optionsStrategy = this.bytecode.sourceInstructions.find((i) => i[0] === "withStrategies" && i[1] instanceof OptionsStrategy);
      if (optionsStrategy === undefined) {
        optionsStrategy = new OptionsStrategy({ [key]: val });
        return this.withStrategies(optionsStrategy);
      }
      optionsStrategy[1].configuration[key] = val;
      return new this.graphTraversalSourceClass(this.graph, new TraversalStrategies(this.traversalStrategies), this.bytecode, this.graphTraversalSourceClass, this.graphTraversalClass);
    }
    toString() {
      return "graphtraversalsource[" + this.graph.toString() + "]";
    }
    withBulk(...args) {
      const b = new Bytecode(this.bytecode).addSource("withBulk", args);
      return new this.graphTraversalSourceClass(this.graph, new TraversalStrategies(this.traversalStrategies), b, this.graphTraversalSourceClass, this.graphTraversalClass);
    }
    withPath(...args) {
      const b = new Bytecode(this.bytecode).addSource("withPath", args);
      return new this.graphTraversalSourceClass(this.graph, new TraversalStrategies(this.traversalStrategies), b, this.graphTraversalSourceClass, this.graphTraversalClass);
    }
    withSack(...args) {
      const b = new Bytecode(this.bytecode).addSource("withSack", args);
      return new this.graphTraversalSourceClass(this.graph, new TraversalStrategies(this.traversalStrategies), b, this.graphTraversalSourceClass, this.graphTraversalClass);
    }
    withSideEffect(...args) {
      const b = new Bytecode(this.bytecode).addSource("withSideEffect", args);
      return new this.graphTraversalSourceClass(this.graph, new TraversalStrategies(this.traversalStrategies), b, this.graphTraversalSourceClass, this.graphTraversalClass);
    }
    withStrategies(...args) {
      const b = new Bytecode(this.bytecode).addSource("withStrategies", args);
      return new this.graphTraversalSourceClass(this.graph, new TraversalStrategies(this.traversalStrategies), b, this.graphTraversalSourceClass, this.graphTraversalClass);
    }
    withoutStrategies(...args) {
      const b = new Bytecode(this.bytecode).addSource("withoutStrategies", args);
      return new this.graphTraversalSourceClass(this.graph, new TraversalStrategies(this.traversalStrategies), b, this.graphTraversalSourceClass, this.graphTraversalClass);
    }
    E(...args) {
      const b = new Bytecode(this.bytecode).addStep("E", args);
      return new this.graphTraversalClass(this.graph, new TraversalStrategies(this.traversalStrategies), b);
    }
    V(...args) {
      const b = new Bytecode(this.bytecode).addStep("V", args);
      return new this.graphTraversalClass(this.graph, new TraversalStrategies(this.traversalStrategies), b);
    }
    addE(...args) {
      const b = new Bytecode(this.bytecode).addStep("addE", args);
      return new this.graphTraversalClass(this.graph, new TraversalStrategies(this.traversalStrategies), b);
    }
    mergeE(...args) {
      const b = new Bytecode(this.bytecode).addStep("mergeE", args);
      return new this.graphTraversalClass(this.graph, new TraversalStrategies(this.traversalStrategies), b);
    }
    addV(...args) {
      const b = new Bytecode(this.bytecode).addStep("addV", args);
      return new this.graphTraversalClass(this.graph, new TraversalStrategies(this.traversalStrategies), b);
    }
    mergeV(...args) {
      const b = new Bytecode(this.bytecode).addStep("mergeV", args);
      return new this.graphTraversalClass(this.graph, new TraversalStrategies(this.traversalStrategies), b);
    }
    inject(...args) {
      const b = new Bytecode(this.bytecode).addStep("inject", args);
      return new this.graphTraversalClass(this.graph, new TraversalStrategies(this.traversalStrategies), b);
    }
    io(...args) {
      const b = new Bytecode(this.bytecode).addStep("io", args);
      return new this.graphTraversalClass(this.graph, new TraversalStrategies(this.traversalStrategies), b);
    }
    call(...args) {
      const b = new Bytecode(this.bytecode).addStep("call", args);
      return new this.graphTraversalClass(this.graph, new TraversalStrategies(this.traversalStrategies), b);
    }
  }

  class GraphTraversal extends Traversal {
    constructor(graph, traversalStrategies, bytecode) {
      super(graph, traversalStrategies, bytecode);
    }
    clone() {
      return new GraphTraversal(this.graph, this.traversalStrategies, this.getBytecode());
    }
    V(...args) {
      this.bytecode.addStep("V", args);
      return this;
    }
    addE(...args) {
      this.bytecode.addStep("addE", args);
      return this;
    }
    addV(...args) {
      this.bytecode.addStep("addV", args);
      return this;
    }
    aggregate(...args) {
      this.bytecode.addStep("aggregate", args);
      return this;
    }
    and(...args) {
      this.bytecode.addStep("and", args);
      return this;
    }
    as(...args) {
      this.bytecode.addStep("as", args);
      return this;
    }
    barrier(...args) {
      this.bytecode.addStep("barrier", args);
      return this;
    }
    both(...args) {
      this.bytecode.addStep("both", args);
      return this;
    }
    bothE(...args) {
      this.bytecode.addStep("bothE", args);
      return this;
    }
    bothV(...args) {
      this.bytecode.addStep("bothV", args);
      return this;
    }
    branch(...args) {
      this.bytecode.addStep("branch", args);
      return this;
    }
    by(...args) {
      this.bytecode.addStep("by", args);
      return this;
    }
    call(...args) {
      this.bytecode.addStep("call", args);
      return this;
    }
    cap(...args) {
      this.bytecode.addStep("cap", args);
      return this;
    }
    choose(...args) {
      this.bytecode.addStep("choose", args);
      return this;
    }
    coalesce(...args) {
      this.bytecode.addStep("coalesce", args);
      return this;
    }
    coin(...args) {
      this.bytecode.addStep("coin", args);
      return this;
    }
    connectedComponent(...args) {
      this.bytecode.addStep("connectedComponent", args);
      return this;
    }
    constant(...args) {
      this.bytecode.addStep("constant", args);
      return this;
    }
    count(...args) {
      this.bytecode.addStep("count", args);
      return this;
    }
    cyclicPath(...args) {
      this.bytecode.addStep("cyclicPath", args);
      return this;
    }
    dedup(...args) {
      this.bytecode.addStep("dedup", args);
      return this;
    }
    drop(...args) {
      this.bytecode.addStep("drop", args);
      return this;
    }
    element(...args) {
      this.bytecode.addStep("element", args);
      return this;
    }
    elementMap(...args) {
      this.bytecode.addStep("elementMap", args);
      return this;
    }
    emit(...args) {
      this.bytecode.addStep("emit", args);
      return this;
    }
    fail(...args) {
      this.bytecode.addStep("fail", args);
      return this;
    }
    filter(...args) {
      this.bytecode.addStep("filter", args);
      return this;
    }
    flatMap(...args) {
      this.bytecode.addStep("flatMap", args);
      return this;
    }
    fold(...args) {
      this.bytecode.addStep("fold", args);
      return this;
    }
    from_(...args) {
      this.bytecode.addStep("from", args);
      return this;
    }
    group(...args) {
      this.bytecode.addStep("group", args);
      return this;
    }
    groupCount(...args) {
      this.bytecode.addStep("groupCount", args);
      return this;
    }
    has(...args) {
      this.bytecode.addStep("has", args);
      return this;
    }
    hasId(...args) {
      this.bytecode.addStep("hasId", args);
      return this;
    }
    hasKey(...args) {
      this.bytecode.addStep("hasKey", args);
      return this;
    }
    hasLabel(...args) {
      this.bytecode.addStep("hasLabel", args);
      return this;
    }
    hasNot(...args) {
      this.bytecode.addStep("hasNot", args);
      return this;
    }
    hasValue(...args) {
      this.bytecode.addStep("hasValue", args);
      return this;
    }
    id(...args) {
      this.bytecode.addStep("id", args);
      return this;
    }
    identity(...args) {
      this.bytecode.addStep("identity", args);
      return this;
    }
    in_(...args) {
      this.bytecode.addStep("in", args);
      return this;
    }
    inE(...args) {
      this.bytecode.addStep("inE", args);
      return this;
    }
    inV(...args) {
      this.bytecode.addStep("inV", args);
      return this;
    }
    index(...args) {
      this.bytecode.addStep("index", args);
      return this;
    }
    inject(...args) {
      this.bytecode.addStep("inject", args);
      return this;
    }
    is(...args) {
      this.bytecode.addStep("is", args);
      return this;
    }
    key(...args) {
      this.bytecode.addStep("key", args);
      return this;
    }
    label(...args) {
      this.bytecode.addStep("label", args);
      return this;
    }
    limit(...args) {
      this.bytecode.addStep("limit", args);
      return this;
    }
    local(...args) {
      this.bytecode.addStep("local", args);
      return this;
    }
    loops(...args) {
      this.bytecode.addStep("loops", args);
      return this;
    }
    map(...args) {
      this.bytecode.addStep("map", args);
      return this;
    }
    match(...args) {
      this.bytecode.addStep("match", args);
      return this;
    }
    math(...args) {
      this.bytecode.addStep("math", args);
      return this;
    }
    max(...args) {
      this.bytecode.addStep("max", args);
      return this;
    }
    mean(...args) {
      this.bytecode.addStep("mean", args);
      return this;
    }
    mergeE(...args) {
      this.bytecode.addStep("mergeE", args);
      return this;
    }
    mergeV(...args) {
      this.bytecode.addStep("mergeV", args);
      return this;
    }
    min(...args) {
      this.bytecode.addStep("min", args);
      return this;
    }
    none(...args) {
      this.bytecode.addStep("none", args);
      return this;
    }
    not(...args) {
      this.bytecode.addStep("not", args);
      return this;
    }
    option(...args) {
      this.bytecode.addStep("option", args);
      return this;
    }
    optional(...args) {
      this.bytecode.addStep("optional", args);
      return this;
    }
    or(...args) {
      this.bytecode.addStep("or", args);
      return this;
    }
    order(...args) {
      this.bytecode.addStep("order", args);
      return this;
    }
    otherV(...args) {
      this.bytecode.addStep("otherV", args);
      return this;
    }
    out(...args) {
      this.bytecode.addStep("out", args);
      return this;
    }
    outE(...args) {
      this.bytecode.addStep("outE", args);
      return this;
    }
    outV(...args) {
      this.bytecode.addStep("outV", args);
      return this;
    }
    pageRank(...args) {
      this.bytecode.addStep("pageRank", args);
      return this;
    }
    path(...args) {
      this.bytecode.addStep("path", args);
      return this;
    }
    peerPressure(...args) {
      this.bytecode.addStep("peerPressure", args);
      return this;
    }
    profile(...args) {
      this.bytecode.addStep("profile", args);
      return this;
    }
    program(...args) {
      this.bytecode.addStep("program", args);
      return this;
    }
    project(...args) {
      this.bytecode.addStep("project", args);
      return this;
    }
    properties(...args) {
      this.bytecode.addStep("properties", args);
      return this;
    }
    property(...args) {
      this.bytecode.addStep("property", args);
      return this;
    }
    propertyMap(...args) {
      this.bytecode.addStep("propertyMap", args);
      return this;
    }
    range(...args) {
      this.bytecode.addStep("range", args);
      return this;
    }
    read(...args) {
      this.bytecode.addStep("read", args);
      return this;
    }
    repeat(...args) {
      this.bytecode.addStep("repeat", args);
      return this;
    }
    sack(...args) {
      this.bytecode.addStep("sack", args);
      return this;
    }
    sample(...args) {
      this.bytecode.addStep("sample", args);
      return this;
    }
    select(...args) {
      this.bytecode.addStep("select", args);
      return this;
    }
    shortestPath(...args) {
      this.bytecode.addStep("shortestPath", args);
      return this;
    }
    sideEffect(...args) {
      this.bytecode.addStep("sideEffect", args);
      return this;
    }
    simplePath(...args) {
      this.bytecode.addStep("simplePath", args);
      return this;
    }
    skip(...args) {
      this.bytecode.addStep("skip", args);
      return this;
    }
    store(...args) {
      this.bytecode.addStep("store", args);
      return this;
    }
    subgraph(...args) {
      this.bytecode.addStep("subgraph", args);
      return this;
    }
    sum(...args) {
      this.bytecode.addStep("sum", args);
      return this;
    }
    tail(...args) {
      this.bytecode.addStep("tail", args);
      return this;
    }
    timeLimit(...args) {
      this.bytecode.addStep("timeLimit", args);
      return this;
    }
    times(...args) {
      this.bytecode.addStep("times", args);
      return this;
    }
    to(...args) {
      this.bytecode.addStep("to", args);
      return this;
    }
    toE(...args) {
      this.bytecode.addStep("toE", args);
      return this;
    }
    toV(...args) {
      this.bytecode.addStep("toV", args);
      return this;
    }
    tree(...args) {
      this.bytecode.addStep("tree", args);
      return this;
    }
    unfold(...args) {
      this.bytecode.addStep("unfold", args);
      return this;
    }
    union(...args) {
      this.bytecode.addStep("union", args);
      return this;
    }
    until(...args) {
      this.bytecode.addStep("until", args);
      return this;
    }
    value(...args) {
      this.bytecode.addStep("value", args);
      return this;
    }
    valueMap(...args) {
      this.bytecode.addStep("valueMap", args);
      return this;
    }
    values(...args) {
      this.bytecode.addStep("values", args);
      return this;
    }
    where(...args) {
      this.bytecode.addStep("where", args);
      return this;
    }
    with_(...args) {
      this.bytecode.addStep("with", args);
      return this;
    }
    write(...args) {
      this.bytecode.addStep("write", args);
      return this;
    }
  }
  var statics = {
    V: (...args) => callOnEmptyTraversal("V", args),
    addE: (...args) => callOnEmptyTraversal("addE", args),
    addV: (...args) => callOnEmptyTraversal("addV", args),
    aggregate: (...args) => callOnEmptyTraversal("aggregate", args),
    and: (...args) => callOnEmptyTraversal("and", args),
    as: (...args) => callOnEmptyTraversal("as", args),
    barrier: (...args) => callOnEmptyTraversal("barrier", args),
    both: (...args) => callOnEmptyTraversal("both", args),
    bothE: (...args) => callOnEmptyTraversal("bothE", args),
    bothV: (...args) => callOnEmptyTraversal("bothV", args),
    branch: (...args) => callOnEmptyTraversal("branch", args),
    call: (...args) => callOnEmptyTraversal("call", args),
    cap: (...args) => callOnEmptyTraversal("cap", args),
    choose: (...args) => callOnEmptyTraversal("choose", args),
    coalesce: (...args) => callOnEmptyTraversal("coalesce", args),
    coin: (...args) => callOnEmptyTraversal("coin", args),
    constant: (...args) => callOnEmptyTraversal("constant", args),
    count: (...args) => callOnEmptyTraversal("count", args),
    cyclicPath: (...args) => callOnEmptyTraversal("cyclicPath", args),
    dedup: (...args) => callOnEmptyTraversal("dedup", args),
    drop: (...args) => callOnEmptyTraversal("drop", args),
    element: (...args) => callOnEmptyTraversal("element", args),
    elementMap: (...args) => callOnEmptyTraversal("elementMap", args),
    emit: (...args) => callOnEmptyTraversal("emit", args),
    fail: (...args) => callOnEmptyTraversal("fail", args),
    filter: (...args) => callOnEmptyTraversal("filter", args),
    flatMap: (...args) => callOnEmptyTraversal("flatMap", args),
    fold: (...args) => callOnEmptyTraversal("fold", args),
    group: (...args) => callOnEmptyTraversal("group", args),
    groupCount: (...args) => callOnEmptyTraversal("groupCount", args),
    has: (...args) => callOnEmptyTraversal("has", args),
    hasId: (...args) => callOnEmptyTraversal("hasId", args),
    hasKey: (...args) => callOnEmptyTraversal("hasKey", args),
    hasLabel: (...args) => callOnEmptyTraversal("hasLabel", args),
    hasNot: (...args) => callOnEmptyTraversal("hasNot", args),
    hasValue: (...args) => callOnEmptyTraversal("hasValue", args),
    id: (...args) => callOnEmptyTraversal("id", args),
    identity: (...args) => callOnEmptyTraversal("identity", args),
    in_: (...args) => callOnEmptyTraversal("in_", args),
    inE: (...args) => callOnEmptyTraversal("inE", args),
    inV: (...args) => callOnEmptyTraversal("inV", args),
    index: (...args) => callOnEmptyTraversal("index", args),
    inject: (...args) => callOnEmptyTraversal("inject", args),
    is: (...args) => callOnEmptyTraversal("is", args),
    key: (...args) => callOnEmptyTraversal("key", args),
    label: (...args) => callOnEmptyTraversal("label", args),
    limit: (...args) => callOnEmptyTraversal("limit", args),
    local: (...args) => callOnEmptyTraversal("local", args),
    loops: (...args) => callOnEmptyTraversal("loops", args),
    map: (...args) => callOnEmptyTraversal("map", args),
    match: (...args) => callOnEmptyTraversal("match", args),
    math: (...args) => callOnEmptyTraversal("math", args),
    max: (...args) => callOnEmptyTraversal("max", args),
    mean: (...args) => callOnEmptyTraversal("mean", args),
    mergeE: (...args) => callOnEmptyTraversal("mergeE", args),
    mergeV: (...args) => callOnEmptyTraversal("mergeV", args),
    min: (...args) => callOnEmptyTraversal("min", args),
    not: (...args) => callOnEmptyTraversal("not", args),
    optional: (...args) => callOnEmptyTraversal("optional", args),
    or: (...args) => callOnEmptyTraversal("or", args),
    order: (...args) => callOnEmptyTraversal("order", args),
    otherV: (...args) => callOnEmptyTraversal("otherV", args),
    out: (...args) => callOnEmptyTraversal("out", args),
    outE: (...args) => callOnEmptyTraversal("outE", args),
    outV: (...args) => callOnEmptyTraversal("outV", args),
    path: (...args) => callOnEmptyTraversal("path", args),
    project: (...args) => callOnEmptyTraversal("project", args),
    properties: (...args) => callOnEmptyTraversal("properties", args),
    property: (...args) => callOnEmptyTraversal("property", args),
    propertyMap: (...args) => callOnEmptyTraversal("propertyMap", args),
    range: (...args) => callOnEmptyTraversal("range", args),
    repeat: (...args) => callOnEmptyTraversal("repeat", args),
    sack: (...args) => callOnEmptyTraversal("sack", args),
    sample: (...args) => callOnEmptyTraversal("sample", args),
    select: (...args) => callOnEmptyTraversal("select", args),
    sideEffect: (...args) => callOnEmptyTraversal("sideEffect", args),
    simplePath: (...args) => callOnEmptyTraversal("simplePath", args),
    skip: (...args) => callOnEmptyTraversal("skip", args),
    store: (...args) => callOnEmptyTraversal("store", args),
    subgraph: (...args) => callOnEmptyTraversal("subgraph", args),
    sum: (...args) => callOnEmptyTraversal("sum", args),
    tail: (...args) => callOnEmptyTraversal("tail", args),
    timeLimit: (...args) => callOnEmptyTraversal("timeLimit", args),
    times: (...args) => callOnEmptyTraversal("times", args),
    to: (...args) => callOnEmptyTraversal("to", args),
    toE: (...args) => callOnEmptyTraversal("toE", args),
    toV: (...args) => callOnEmptyTraversal("toV", args),
    tree: (...args) => callOnEmptyTraversal("tree", args),
    unfold: (...args) => callOnEmptyTraversal("unfold", args),
    union: (...args) => callOnEmptyTraversal("union", args),
    until: (...args) => callOnEmptyTraversal("until", args),
    value: (...args) => callOnEmptyTraversal("value", args),
    valueMap: (...args) => callOnEmptyTraversal("valueMap", args),
    values: (...args) => callOnEmptyTraversal("values", args),
    where: (...args) => callOnEmptyTraversal("where", args)
  };
  module.exports = {
    GraphTraversal,
    GraphTraversalSource,
    statics
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/graph.js
var require_graph = __commonJS((exports, module) => {
  var areEqual = function(obj1, obj2) {
    if (obj1 === obj2) {
      return true;
    }
    if (typeof obj1.equals === "function") {
      return obj1.equals(obj2);
    }
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) {
        return false;
      }
      for (let i = 0;i < obj1.length; i++) {
        if (!areEqual(obj1[i], obj2[i])) {
          return false;
        }
      }
      return true;
    }
    return false;
  };
  var summarize = function(value) {
    if (value === null || value === undefined) {
      return value;
    }
    const strValue = value.toString();
    return strValue.length > 20 ? strValue.substr(0, 20) : strValue;
  };
  var gt = require_graph_traversal();
  var { TraversalStrategies } = require_traversal_strategy();

  class Graph {
    traversal(traversalSourceClass) {
      const traversalSourceConstructor = traversalSourceClass || gt.GraphTraversalSource;
      return new traversalSourceConstructor(this, new TraversalStrategies);
    }
    toString() {
      return "graph[]";
    }
  }

  class Element {
    constructor(id, label) {
      this.id = id;
      this.label = label;
    }
    equals(other) {
      return other instanceof Element && this.id === other.id;
    }
  }

  class Vertex extends Element {
    constructor(id, label, properties) {
      super(id, label);
      this.properties = properties;
    }
    toString() {
      return `v[${this.id}]`;
    }
  }

  class Edge extends Element {
    constructor(id, outV, label, inV, properties) {
      super(id, label);
      this.outV = outV;
      this.inV = inV;
      this.properties = {};
      if (properties) {
        const keys = Object.keys(properties);
        for (let i = 0;i < keys.length; i++) {
          const k = keys[i];
          this.properties[k] = properties[k].value;
        }
      }
    }
    toString() {
      const outVId = this.outV ? this.outV.id : "?";
      const inVId = this.inV ? this.inV.id : "?";
      return `e[${this.id}][${outVId}-${this.label}->${inVId}]`;
    }
  }

  class VertexProperty extends Element {
    constructor(id, label, value, properties) {
      super(id, label);
      this.value = value;
      this.key = this.label;
      this.properties = properties;
    }
    toString() {
      return `vp[${this.label}->${summarize(this.value)}]`;
    }
  }

  class Property {
    constructor(key, value) {
      this.key = key;
      this.value = value;
    }
    toString() {
      return `p[${this.key}->${summarize(this.value)}]`;
    }
    equals(other) {
      return other instanceof Property && this.key === other.key && this.value === other.value;
    }
  }

  class Path {
    constructor(labels, objects) {
      this.labels = labels;
      this.objects = objects;
    }
    toString() {
      return `path[${(this.objects || []).join(", ")}]`;
    }
    equals(other) {
      if (!(other instanceof Path)) {
        return false;
      }
      if (other === this) {
        return true;
      }
      return areEqual(this.objects, other.objects) && areEqual(this.labels, other.labels);
    }
  }
  module.exports = {
    Edge,
    Graph,
    Path,
    Property,
    Vertex,
    VertexProperty
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/utils.js
var require_utils = __commonJS((exports) => {
  var generateUserAgent = function() {
    const applicationName = "utils".replace("_", " ");
    let driverVersion;
    try {
      driverVersion = JSON.parse(readFileSync(__dirname + "/../package.json")).version.replace("_", " ");
    } catch (e) {
      driverVersion = "NotAvailable";
    }
    const runtimeVersion = process.version.replace(" ", "_");
    const osName = os.platform().replace(" ", "_");
    const osVersion = os.release().replace(" ", "_");
    const cpuArch = process.arch.replace(" ", "_");
    const userAgent2 = `${applicationName} Gremlin-Javascript.${driverVersion} ${runtimeVersion} ${osName}.${osVersion} ${cpuArch}`;
    return userAgent2;
  };
  var __dirname = "/home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib";
  var crypto = import.meta.require("crypto");
  var os = import.meta.require("os");
  var { readFileSync } = import.meta.require("fs");
  exports.toLong = function toLong(value) {
    return new Long(value);
  };
  var Long = exports.Long = function Long(value) {
    if (typeof value !== "string" && typeof value !== "number") {
      throw new TypeError("The value must be a string or a number");
    }
    this.value = value.toString();
  };
  exports.getUuid = function getUuid() {
    const buffer = crypto.randomBytes(16);
    buffer[6] &= 15;
    buffer[6] |= 64;
    buffer[8] &= 63;
    buffer[8] |= 128;
    const hex = buffer.toString("hex");
    return hex.substr(0, 8) + "-" + hex.substr(8, 4) + "-" + hex.substr(12, 4) + "-" + hex.substr(16, 4) + "-" + hex.substr(20, 12);
  };
  exports.emptyArray = Object.freeze([]);

  class ImmutableMap extends Map {
    constructor(iterable) {
      super(iterable);
    }
    set() {
      return this;
    }
    ["delete"]() {
      return false;
    }
    clear() {
    }
  }
  exports.ImmutableMap = ImmutableMap;
  exports.getUserAgentHeader = function getUserAgentHeader() {
    return "User-Agent";
  };
  var userAgent = generateUserAgent();
  exports.getUserAgent = function getUserAgent() {
    return userAgent;
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/type-serializers.js
var require_type_serializers = __commonJS((exports, module) => {
  var t = require_traversal();
  var ts = require_traversal_strategy();
  var Bytecode = require_bytecode();
  var g = require_graph();
  var utils = require_utils();
  var valueKey = "@value";
  var typeKey = "@type";

  class TypeSerializer {
    serialize() {
      throw new Error("serialize() method not implemented for " + this.constructor.name);
    }
    deserialize() {
      throw new Error("deserialize() method not implemented for " + this.constructor.name);
    }
    canBeUsedFor() {
      throw new Error("canBeUsedFor() method not implemented for " + this.constructor.name);
    }
  }

  class NumberSerializer extends TypeSerializer {
    serialize(item) {
      if (isNaN(item)) {
        return {
          [typeKey]: "g:Double",
          [valueKey]: "NaN"
        };
      } else if (item === Number.POSITIVE_INFINITY) {
        return {
          [typeKey]: "g:Double",
          [valueKey]: "Infinity"
        };
      } else if (item === Number.NEGATIVE_INFINITY) {
        return {
          [typeKey]: "g:Double",
          [valueKey]: "-Infinity"
        };
      }
      return item;
    }
    deserialize(obj) {
      const val = obj[valueKey];
      if (val === "NaN") {
        return NaN;
      } else if (val === "Infinity") {
        return Number.POSITIVE_INFINITY;
      } else if (val === "-Infinity") {
        return Number.NEGATIVE_INFINITY;
      }
      return parseFloat(val);
    }
    canBeUsedFor(value) {
      return typeof value === "number";
    }
  }

  class DateSerializer extends TypeSerializer {
    serialize(item) {
      return {
        [typeKey]: "g:Date",
        [valueKey]: item.getTime()
      };
    }
    deserialize(obj) {
      return new Date(obj[valueKey]);
    }
    canBeUsedFor(value) {
      return value instanceof Date;
    }
  }

  class LongSerializer extends TypeSerializer {
    serialize(item) {
      return {
        [typeKey]: "g:Int64",
        [valueKey]: item.value
      };
    }
    canBeUsedFor(value) {
      return value instanceof utils.Long;
    }
  }

  class BytecodeSerializer extends TypeSerializer {
    serialize(item) {
      let bytecode = item;
      if (item instanceof t.Traversal) {
        bytecode = item.getBytecode();
      }
      const result = {};
      result[typeKey] = "g:Bytecode";
      const resultValue = result[valueKey] = {};
      const sources = this._serializeInstructions(bytecode.sourceInstructions);
      if (sources) {
        resultValue["source"] = sources;
      }
      const steps = this._serializeInstructions(bytecode.stepInstructions);
      if (steps) {
        resultValue["step"] = steps;
      }
      return result;
    }
    _serializeInstructions(instructions) {
      if (instructions.length === 0) {
        return null;
      }
      const result = new Array(instructions.length);
      result[0] = instructions[0];
      for (let i = 0;i < instructions.length; i++) {
        result[i] = instructions[i].map((item) => this.writer.adaptObject(item));
      }
      return result;
    }
    canBeUsedFor(value) {
      return value instanceof Bytecode || value instanceof t.Traversal;
    }
  }

  class PSerializer extends TypeSerializer {
    serialize(item) {
      const result = {};
      result[typeKey] = "g:P";
      const resultValue = result[valueKey] = {
        predicate: item.operator
      };
      if (item.other === undefined || item.other === null) {
        resultValue["value"] = this.writer.adaptObject(item.value);
      } else {
        resultValue["value"] = [this.writer.adaptObject(item.value), this.writer.adaptObject(item.other)];
      }
      return result;
    }
    canBeUsedFor(value) {
      return value instanceof t.P;
    }
  }

  class TextPSerializer extends TypeSerializer {
    serialize(item) {
      const result = {};
      result[typeKey] = "g:TextP";
      const resultValue = result[valueKey] = {
        predicate: item.operator
      };
      if (item.other === undefined || item.other === null) {
        resultValue["value"] = this.writer.adaptObject(item.value);
      } else {
        resultValue["value"] = [this.writer.adaptObject(item.value), this.writer.adaptObject(item.other)];
      }
      return result;
    }
    canBeUsedFor(value) {
      return value instanceof t.TextP;
    }
  }

  class LambdaSerializer extends TypeSerializer {
    serialize(item) {
      const lambdaDef = item();
      const returnIsString = typeof lambdaDef === "string";
      const script = returnIsString ? lambdaDef : lambdaDef[0];
      const lang = returnIsString ? "gremlin-groovy" : lambdaDef[1];
      const argCount = lang === "gremlin-groovy" && script.includes("->") ? script.substring(0, script.indexOf("->")).includes(",") ? 2 : 1 : -1;
      return {
        [typeKey]: "g:Lambda",
        [valueKey]: {
          arguments: argCount,
          language: lang,
          script
        }
      };
    }
    canBeUsedFor(value) {
      return typeof value === "function";
    }
  }

  class EnumSerializer extends TypeSerializer {
    serialize(item) {
      return {
        [typeKey]: "g:" + item.typeName,
        [valueKey]: item.elementName
      };
    }
    canBeUsedFor(value) {
      return value && value.typeName && value instanceof t.EnumValue;
    }
  }

  class TraverserSerializer extends TypeSerializer {
    serialize(item) {
      return {
        [typeKey]: "g:Traverser",
        [valueKey]: {
          value: this.writer.adaptObject(item.object),
          bulk: this.writer.adaptObject(item.bulk)
        }
      };
    }
    deserialize(obj) {
      const value = obj[valueKey];
      return new t.Traverser(this.reader.read(value["value"]), this.reader.read(value["bulk"]));
    }
    canBeUsedFor(value) {
      return value instanceof t.Traverser;
    }
  }

  class TraversalStrategySerializer extends TypeSerializer {
    serialize(item) {
      const conf = {};
      for (const k in item.configuration) {
        if (item.configuration.hasOwnProperty(k)) {
          conf[k] = this.writer.adaptObject(item.configuration[k]);
        }
      }
      return {
        [typeKey]: "g:" + item.constructor.name,
        [valueKey]: conf
      };
    }
    canBeUsedFor(value) {
      return value instanceof ts.TraversalStrategy;
    }
  }

  class VertexSerializer extends TypeSerializer {
    deserialize(obj) {
      const value = obj[valueKey];
      return new g.Vertex(this.reader.read(value["id"]), value["label"], this.reader.read(value["properties"]));
    }
    serialize(item) {
      return {
        [typeKey]: "g:Vertex",
        [valueKey]: {
          id: this.writer.adaptObject(item.id),
          label: item.label
        }
      };
    }
    canBeUsedFor(value) {
      return value instanceof g.Vertex;
    }
  }

  class VertexPropertySerializer extends TypeSerializer {
    deserialize(obj) {
      const value = obj[valueKey];
      return new g.VertexProperty(this.reader.read(value["id"]), value["label"], this.reader.read(value["value"]), this.reader.read(value["properties"]));
    }
  }

  class PropertySerializer extends TypeSerializer {
    deserialize(obj) {
      const value = obj[valueKey];
      return new g.Property(value["key"], this.reader.read(value["value"]));
    }
  }

  class EdgeSerializer extends TypeSerializer {
    deserialize(obj) {
      const value = obj[valueKey];
      return new g.Edge(this.reader.read(value["id"]), new g.Vertex(this.reader.read(value["outV"]), this.reader.read(value["outVLabel"])), value["label"], new g.Vertex(this.reader.read(value["inV"]), this.reader.read(value["inVLabel"])), this.reader.read(value["properties"]));
    }
    serialize(item) {
      return {
        [typeKey]: "g:Edge",
        [valueKey]: {
          id: this.writer.adaptObject(item.id),
          label: item.label,
          outV: this.writer.adaptObject(item.outV.id),
          outVLabel: item.outV.label,
          inV: this.writer.adaptObject(item.inV.id),
          inVLabel: item.inV.label
        }
      };
    }
    canBeUsedFor(value) {
      return value instanceof g.Edge;
    }
  }

  class PathSerializer extends TypeSerializer {
    deserialize(obj) {
      const value = obj[valueKey];
      const objects = value["objects"].map((o) => this.reader.read(o));
      return new g.Path(this.reader.read(value["labels"]), objects);
    }
  }

  class Path3Serializer extends TypeSerializer {
    deserialize(obj) {
      const value = obj[valueKey];
      return new g.Path(this.reader.read(value["labels"]), this.reader.read(value["objects"]));
    }
  }

  class TSerializer extends TypeSerializer {
    deserialize(obj) {
      return t.t[obj[valueKey]];
    }
  }

  class DirectionSerializer extends TypeSerializer {
    deserialize(obj) {
      return t.direction[obj[valueKey].toLowerCase()];
    }
  }

  class ArraySerializer extends TypeSerializer {
    constructor(typeKey2) {
      super();
      this.typeKey = typeKey2;
    }
    deserialize(obj) {
      const value = obj[valueKey];
      if (!Array.isArray(value)) {
        throw new Error("Expected Array, obtained: " + value);
      }
      return value.map((x) => this.reader.read(x));
    }
    serialize(item) {
      return {
        [typeKey]: this.typeKey,
        [valueKey]: item.map((x) => this.writer.adaptObject(x))
      };
    }
    canBeUsedFor(value) {
      return Array.isArray(value);
    }
  }

  class BulkSetSerializer extends TypeSerializer {
    deserialize(obj) {
      const value = obj[valueKey];
      if (!Array.isArray(value)) {
        throw new Error("Expected Array, obtained: " + value);
      }
      let result = [];
      for (let ix = 0, iy = value.length;ix < iy; ix += 2) {
        const pair = value.slice(ix, ix + 2);
        result = result.concat(Array(this.reader.read(pair[1])).fill(this.reader.read(pair[0])));
      }
      return result;
    }
  }

  class MapSerializer extends TypeSerializer {
    deserialize(obj) {
      const value = obj[valueKey];
      if (!Array.isArray(value)) {
        throw new Error("Expected Array, obtained: " + value);
      }
      const result = new Map;
      for (let i = 0;i < value.length; i += 2) {
        result.set(this.reader.read(value[i]), this.reader.read(value[i + 1]));
      }
      return result;
    }
    serialize(map) {
      const arr = [];
      map.forEach((v, k) => {
        arr.push(this.writer.adaptObject(k));
        arr.push(this.writer.adaptObject(v));
      });
      return {
        [typeKey]: "g:Map",
        [valueKey]: arr
      };
    }
    canBeUsedFor(value) {
      return value instanceof Map;
    }
  }

  class ListSerializer extends ArraySerializer {
    constructor() {
      super("g:List");
    }
  }

  class SetSerializer extends ArraySerializer {
    constructor() {
      super("g:Set");
    }
  }
  module.exports = {
    BulkSetSerializer,
    BytecodeSerializer,
    DateSerializer,
    DirectionSerializer,
    EdgeSerializer,
    EnumSerializer,
    LambdaSerializer,
    ListSerializer,
    LongSerializer,
    MapSerializer,
    NumberSerializer,
    Path3Serializer,
    PathSerializer,
    PropertySerializer,
    PSerializer,
    TextPSerializer,
    SetSerializer,
    TSerializer,
    TraverserSerializer,
    TraversalStrategySerializer,
    typeKey,
    valueKey,
    VertexPropertySerializer,
    VertexSerializer
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/graph-serializer.js
var require_graph_serializer = __commonJS((exports, module) => {
  var typeSerializers = require_type_serializers();
  var Bytecode = require_bytecode();

  class GraphSON2Writer {
    constructor(options) {
      this._options = options || {};
      this._serializers = this.getDefaultSerializers().map((serializerConstructor) => {
        const s = new serializerConstructor;
        s.writer = this;
        return s;
      });
      const customSerializers = this._options.serializers || {};
      Object.keys(customSerializers).forEach((key) => {
        const s = customSerializers[key];
        if (!s.serialize) {
          return;
        }
        s.writer = this;
        this._serializers.unshift(s);
      });
    }
    getDefaultSerializers() {
      return graphSON2Serializers;
    }
    adaptObject(value) {
      let s;
      for (let i = 0;i < this._serializers.length; i++) {
        const currentSerializer = this._serializers[i];
        if (currentSerializer.canBeUsedFor && currentSerializer.canBeUsedFor(value)) {
          s = currentSerializer;
          break;
        }
      }
      if (s) {
        return s.serialize(value);
      }
      if (Array.isArray(value)) {
        return value.map((item) => this.adaptObject(item));
      }
      return value;
    }
    write(obj) {
      return JSON.stringify(this.adaptObject(obj));
    }
    writeRequest({ requestId, op, processor, args }) {
      const req = {
        requestId: { "@type": "g:UUID", "@value": requestId },
        op,
        processor,
        args: this._adaptArgs(args, true)
      };
      if (req.args["gremlin"] instanceof Bytecode) {
        req.args["gremlin"] = this.adaptObject(req.args["gremlin"]);
      }
      return Buffer.from(JSON.stringify(req));
    }
    _adaptArgs(args, protocolLevel) {
      if (args instanceof Object) {
        const newObj = {};
        Object.keys(args).forEach((key) => {
          if (protocolLevel && key === "bindings") {
            newObj[key] = this._adaptArgs(args[key], false);
          } else {
            newObj[key] = this.adaptObject(args[key]);
          }
        });
        return newObj;
      }
      return args;
    }
  }

  class GraphSON3Writer extends GraphSON2Writer {
    getDefaultSerializers() {
      return graphSON3Serializers;
    }
  }

  class GraphSON2Reader {
    constructor(options) {
      this._options = options || {};
      this._deserializers = {};
      const defaultDeserializers = this.getDefaultDeserializers();
      Object.keys(defaultDeserializers).forEach((typeName) => {
        const serializerConstructor = defaultDeserializers[typeName];
        const s = new serializerConstructor;
        s.reader = this;
        this._deserializers[typeName] = s;
      });
      if (this._options.serializers) {
        const customSerializers = this._options.serializers || {};
        Object.keys(customSerializers).forEach((key) => {
          const s = customSerializers[key];
          if (!s.deserialize) {
            return;
          }
          s.reader = this;
          this._deserializers[key] = s;
        });
      }
    }
    getDefaultDeserializers() {
      return graphSON2Deserializers;
    }
    read(obj) {
      if (obj === undefined) {
        return;
      }
      if (obj === null) {
        return null;
      }
      if (Array.isArray(obj)) {
        return obj.map((item) => this.read(item));
      }
      const type = obj[typeSerializers.typeKey];
      if (type) {
        const d = this._deserializers[type];
        if (d) {
          return d.deserialize(obj);
        }
        return obj[typeSerializers.valueKey];
      }
      if (obj && typeof obj === "object" && obj.constructor === Object) {
        return this._deserializeObject(obj);
      }
      return obj;
    }
    readResponse(buffer) {
      return this.read(JSON.parse(buffer.toString()));
    }
    _deserializeObject(obj) {
      const keys = Object.keys(obj);
      const result = {};
      for (let i = 0;i < keys.length; i++) {
        result[keys[i]] = this.read(obj[keys[i]]);
      }
      return result;
    }
  }

  class GraphSON3Reader extends GraphSON2Reader {
    getDefaultDeserializers() {
      return graphSON3Deserializers;
    }
  }
  var graphSON2Deserializers = {
    "g:Traverser": typeSerializers.TraverserSerializer,
    "g:TraversalStrategy": typeSerializers.TraversalStrategySerializer,
    "g:Int32": typeSerializers.NumberSerializer,
    "g:Int64": typeSerializers.NumberSerializer,
    "g:Float": typeSerializers.NumberSerializer,
    "g:Double": typeSerializers.NumberSerializer,
    "g:Date": typeSerializers.DateSerializer,
    "g:Direction": typeSerializers.DirectionSerializer,
    "g:Vertex": typeSerializers.VertexSerializer,
    "g:Edge": typeSerializers.EdgeSerializer,
    "g:VertexProperty": typeSerializers.VertexPropertySerializer,
    "g:Property": typeSerializers.PropertySerializer,
    "g:Path": typeSerializers.Path3Serializer,
    "g:TextP": typeSerializers.TextPSerializer,
    "g:T": typeSerializers.TSerializer,
    "g:BulkSet": typeSerializers.BulkSetSerializer
  };
  var graphSON3Deserializers = Object.assign({}, graphSON2Deserializers, {
    "g:List": typeSerializers.ListSerializer,
    "g:Set": typeSerializers.SetSerializer,
    "g:Map": typeSerializers.MapSerializer
  });
  var graphSON2Serializers = [
    typeSerializers.NumberSerializer,
    typeSerializers.DateSerializer,
    typeSerializers.BytecodeSerializer,
    typeSerializers.TraverserSerializer,
    typeSerializers.TraversalStrategySerializer,
    typeSerializers.PSerializer,
    typeSerializers.TextPSerializer,
    typeSerializers.LambdaSerializer,
    typeSerializers.EnumSerializer,
    typeSerializers.VertexSerializer,
    typeSerializers.EdgeSerializer,
    typeSerializers.LongSerializer
  ];
  var graphSON3Serializers = graphSON2Serializers.concat([
    typeSerializers.ListSerializer,
    typeSerializers.SetSerializer,
    typeSerializers.MapSerializer
  ]);
  module.exports = {
    GraphSON3Writer,
    GraphSON3Reader,
    GraphSON2Writer,
    GraphSON2Reader,
    GraphSONWriter: GraphSON3Writer,
    GraphSONReader: GraphSON3Reader
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/process/translator.js
var require_translator = __commonJS((exports, module) => {
  var Traversal = require_traversal().Traversal;
  var Bytecode = require_bytecode();

  class Translator {
    constructor(traversalSource) {
      this._traversalSource = traversalSource;
    }
    getTraversalSource() {
      return this._traversalSource;
    }
    getTargetLanguage() {
      return "gremlin-groovy";
    }
    of(traversalSource) {
      this._traversalSource = traversalSource;
    }
    translate(bytecodeOrTraversal, child = false) {
      let script = child ? "__" : this._traversalSource;
      const bc = bytecodeOrTraversal instanceof Bytecode ? bytecodeOrTraversal : bytecodeOrTraversal.getBytecode();
      const instructions = bc.stepInstructions;
      for (let i = 0;i < instructions.length; i++) {
        const params = instructions[i].slice(1);
        script += "." + instructions[i][0] + "(";
        if (params.length) {
          for (let k = 0;k < params.length; k++) {
            if (k > 0) {
              script += ", ";
            }
            script += this.convert(params[k]);
          }
        }
        script += ")";
      }
      return script;
    }
    convert(anyObject) {
      let script = "";
      if (Object(anyObject) === anyObject) {
        if (anyObject instanceof Traversal) {
          script += this.translate(anyObject.getBytecode(), true);
        } else if (anyObject.toString() === "[object Object]") {
          Object.keys(anyObject).forEach(function(key, index) {
            if (index > 0) {
              script += ", ";
            }
            script += `('${key}', `;
            if (anyObject[key] instanceof String || typeof anyObject[key] === "string") {
              script += `'${anyObject[key]}'`;
            } else {
              script += anyObject[key];
            }
            script += ")";
          });
        } else if (Array.isArray(anyObject)) {
          const parts = [];
          for (const item of anyObject) {
            parts.push(this.convert(item));
          }
          script += "[" + parts.join(", ") + "]";
        } else {
          script += anyObject.toString();
        }
      } else if (anyObject === undefined) {
        script += "";
      } else if (typeof anyObject === "number" || typeof anyObject === "boolean") {
        script += anyObject;
      } else {
        script += `'${anyObject}'`;
      }
      return script;
    }
  }
  module.exports = Translator;
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/DataType.js
var require_DataType = __commonJS((exports, module) => {
  var DataType = {
    INT: 1,
    LONG: 2,
    STRING: 3,
    DATE: 4,
    TIMESTAMP: 5,
    CLASS: 6,
    DOUBLE: 7,
    FLOAT: 8,
    LIST: 9,
    MAP: 10,
    SET: 11,
    UUID: 12,
    EDGE: 13,
    PATH: 14,
    PROPERTY: 15,
    GRAPH: 16,
    VERTEX: 17,
    VERTEXPROPERTY: 18,
    BARRIER: 19,
    BINDING: 20,
    BYTECODE: 21,
    CARDINALITY: 22,
    COLUMN: 23,
    DIRECTION: 24,
    OPERATOR: 25,
    ORDER: 26,
    PICK: 27,
    POP: 28,
    LAMBDA: 29,
    P: 30,
    SCOPE: 31,
    T: 32,
    TRAVERSER: 33,
    BIGDECIMAL: 34,
    BIGINTEGER: 35,
    BYTE: 36,
    BYTEBUFFER: 37,
    SHORT: 38,
    BOOLEAN: 39,
    TEXTP: 40,
    TRAVERSALSTRATEGY: 41,
    BULKSET: 42,
    TREE: 43,
    METRICS: 44,
    TRAVERSALMETRICS: 45,
    MERGE: 46,
    CHAR: 128,
    DURATION: 129,
    INETADDRESS: 130,
    INSTANT: 131,
    LOCALDATE: 132,
    LOCALDATETIME: 133,
    LOCALTIME: 134,
    MONTHDAY: 135,
    OFFSETDATETIME: 136,
    OFFSETTIME: 137,
    PERIOD: 138,
    YEAR: 139,
    YEARMONTH: 140,
    ZONEDATETIME: 141,
    ZONEOFFSET: 142,
    CUSTOM: 0,
    UNSPECIFIED_NULL: 254
  };
  module.exports = DataType;
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/utils.js
var require_utils2 = __commonJS((exports, module) => {
  var des_error = ({ serializer, args, cursor, err }) => {
    if (cursor === undefined) {
      cursor = args[0];
    }
    let cursor_tail = "";
    if (cursor instanceof Buffer) {
      if (cursor.length > 32) {
        cursor_tail = "...";
      }
      cursor = cursor.slice(0, 32).toString("hex");
    }
    const fullyQualifiedFormat = args[1];
    const nullable = args[2];
    let m = `${serializer.constructor.name}.deserialize(cursor=${cursor}${cursor_tail}`;
    if (fullyQualifiedFormat !== undefined) {
      m += `, fullyQualifiedFormat=${fullyQualifiedFormat}`;
    }
    if (nullable !== undefined) {
      m += `, nullable=${nullable}`;
    }
    m += `): ${err.message.replace(/\.$/, "")}.`;
    err.message = m;
    return err;
  };
  module.exports = {
    des_error
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/IntSerializer.js
var require_IntSerializer = __commonJS((exports, module) => {
  module.exports = class IntSerializer {
    get INT32_MIN() {
      return -2147483648;
    }
    get INT32_MAX() {
      return 2147483647;
    }
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.INT] = this;
    }
    canBeUsedFor(value) {
      if (typeof value !== "number") {
        return false;
      }
      if (value < this.INT32_MIN || value > this.INT32_MAX) {
        return false;
      }
      return true;
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.INT, 1]);
        }
        return Buffer.from([0, 0, 0, 0]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.INT, 0]));
      }
      const v = Buffer.alloc(4);
      v.writeInt32BE(item);
      bufs.push(v);
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.INT) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        if (cursor.length < 4) {
          throw new Error("unexpected {value} length");
        }
        len += 4;
        const v = cursor.readInt32BE();
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/LongSerializer.js
var require_LongSerializer = __commonJS((exports, module) => {
  module.exports = class LongSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.LONG] = this;
    }
    canBeUsedFor() {
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.LONG, 1]);
        }
        return Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.LONG, 0]));
      }
      const v = Buffer.alloc(8);
      v.writeBigInt64BE(BigInt(item));
      bufs.push(v);
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.LONG) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        if (cursor.length < 8) {
          throw new Error("unexpected {value} length");
        }
        len += 8;
        let v = cursor.readBigInt64BE();
        if (v < Number.MIN_SAFE_INTEGER || v > Number.MAX_SAFE_INTEGER) {
          v = parseFloat(v.toString());
        } else {
          v = Number(v);
        }
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/LongSerializerNg.js
var require_LongSerializerNg = __commonJS((exports, module) => {
  module.exports = class LongSerializerNg {
    constructor(ioc) {
      this.ioc = ioc;
    }
    canBeUsedFor() {
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.LONG, 1]);
        }
        return Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.LONG, 0]));
      }
      const v = Buffer.alloc(8);
      v.writeBigInt64BE(BigInt(item));
      bufs.push(v);
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.LONG) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        if (cursor.length < 8) {
          throw new Error("unexpected {value} length");
        }
        len += 8;
        const v = cursor.readBigInt64BE();
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/StringSerializer.js
var require_StringSerializer = __commonJS((exports, module) => {
  module.exports = class StringSerializer {
    constructor(ioc, ID) {
      this.ioc = ioc;
      this.ID = ID;
      this.ioc.serializers[ID] = this;
    }
    canBeUsedFor(value) {
      return typeof value === "string";
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ID, 1]);
        }
        return this.ioc.intSerializer.serialize(0, false);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ID, 0]));
      }
      const v = Buffer.from(String(item), "utf8");
      bufs.push(this.ioc.intSerializer.serialize(v.length, false));
      bufs.push(v);
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true, nullable = false) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ID) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
        }
        if (fullyQualifiedFormat || nullable) {
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        let length, length_len;
        try {
          ({ v: length, len: length_len } = this.ioc.intSerializer.deserialize(cursor, false));
          len += length_len;
        } catch (err) {
          err.message = "{length}: " + err.message;
          throw err;
        }
        if (length < 0) {
          throw new Error("{length} is less than zero");
        }
        cursor = cursor.slice(length_len);
        if (cursor.length < length) {
          throw new Error("unexpected {text_value} length");
        }
        len += length;
        const v = cursor.toString("utf8", 0, length);
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/DateSerializer.js
var require_DateSerializer = __commonJS((exports, module) => {
  module.exports = class DateSerializer {
    constructor(ioc, ID) {
      this.ioc = ioc;
      this.ID = ID;
      this.ioc.serializers[ID] = this;
    }
    canBeUsedFor(value) {
      return value instanceof Date;
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ID, 1]);
        }
        return Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ID, 0]));
      }
      const v = Buffer.alloc(8);
      v.writeBigInt64BE(BigInt(item.getTime()));
      bufs.push(v);
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ID) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        if (cursor.length < 8) {
          throw new Error("unexpected {value} length");
        }
        len += 8;
        const ms = cursor.readBigInt64BE();
        const v = new Date(Number(ms));
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/DoubleSerializer.js
var require_DoubleSerializer = __commonJS((exports, module) => {
  module.exports = class DoubleSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.DOUBLE] = this;
    }
    canBeUsedFor(value) {
      return typeof value === "number" && !Number.isInteger(value);
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.DOUBLE, 1]);
        }
        return Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.DOUBLE, 0]));
      }
      const v = Buffer.alloc(8);
      v.writeDoubleBE(item);
      bufs.push(v);
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.DOUBLE) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        if (cursor.length < 8) {
          throw new Error("unexpected {value} length");
        }
        len += 8;
        const v = cursor.readDoubleBE();
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/FloatSerializer.js
var require_FloatSerializer = __commonJS((exports, module) => {
  module.exports = class FloatSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.FLOAT] = this;
    }
    canBeUsedFor(value) {
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.FLOAT, 1]);
        }
        return Buffer.from([0, 0, 0, 0]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.FLOAT, 0]));
      }
      const v = Buffer.alloc(4);
      v.writeFloatBE(item);
      bufs.push(v);
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.FLOAT) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        if (cursor.length < 4) {
          throw new Error("unexpected {value} length");
        }
        len += 4;
        const v = cursor.readFloatBE();
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/ArraySerializer.js
var require_ArraySerializer = __commonJS((exports, module) => {
  module.exports = class ArraySerializer {
    constructor(ioc, ID) {
      this.ioc = ioc;
      this.ID = ID;
      this.ioc.serializers[ID] = this;
    }
    canBeUsedFor(value) {
      return Array.isArray(value);
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ID, 1]);
        }
        return Buffer.from([0, 0, 0, 0]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ID, 0]));
      }
      let length = item.length;
      if (length < 0) {
        length = 0;
      }
      if (length > this.ioc.intSerializer.INT32_MAX) {
        throw new Error(`Array length=${length} is greater than supported max_length=${this.ioc.intSerializer.INT32_MAX}.`);
      }
      bufs.push(this.ioc.intSerializer.serialize(length, false));
      for (let i = 0;i < length; i++) {
        bufs.push(this.ioc.anySerializer.serialize(item[i]));
      }
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ID) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        let length, length_len;
        try {
          ({ v: length, len: length_len } = this.ioc.intSerializer.deserialize(cursor, false));
          len += length_len;
        } catch (err) {
          err.message = "{length}: " + err.message;
          throw err;
        }
        if (length < 0) {
          throw new Error("{length} is less than zero");
        }
        cursor = cursor.slice(length_len);
        const v = [];
        for (let i = 0;i < length; i++) {
          let value, value_len;
          try {
            ({ v: value, len: value_len } = this.ioc.anySerializer.deserialize(cursor));
            len += value_len;
          } catch (err) {
            err.message = `{item_${i}}: ` + err.message;
            throw err;
          }
          cursor = cursor.slice(value_len);
          v.push(value);
        }
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/MapSerializer.js
var require_MapSerializer = __commonJS((exports, module) => {
  module.exports = class MapSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.MAP] = this;
    }
    canBeUsedFor(value) {
      if (value === null || value === undefined) {
        return false;
      }
      if (value instanceof Map) {
        return true;
      }
      if (Array.isArray(value)) {
        return false;
      }
      return typeof value === "object";
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.MAP, 1]);
        }
        return this.ioc.intSerializer.serialize(0, false);
      }
      const isMap = item instanceof Map;
      const keys = isMap ? Array.from(item.keys()) : Object.keys(item);
      let map_length = keys.length;
      if (map_length < 0) {
        map_length = 0;
      } else if (map_length > this.ioc.intSerializer.INT32_MAX) {
        map_length = this.ioc.intSerializer.INT32_MAX;
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.MAP, 0]));
      }
      bufs.push(this.ioc.intSerializer.serialize(map_length, false));
      for (let i = 0;i < map_length; i++) {
        const key = keys[i];
        const value = isMap ? item.get(key) : item[key];
        bufs.push(this.ioc.anySerializer.serialize(key), this.ioc.anySerializer.serialize(value));
      }
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.MAP) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        let length, length_len;
        try {
          ({ v: length, len: length_len } = this.ioc.intSerializer.deserialize(cursor, false));
          len += length_len;
        } catch (err) {
          err.message = "{length}: " + err.message;
          throw err;
        }
        if (length < 0) {
          throw new Error("{length} is less than zero");
        }
        cursor = cursor.slice(length_len);
        const v = new Map;
        for (let i = 0;i < length; i++) {
          let key, key_len;
          try {
            ({ v: key, len: key_len } = this.ioc.anySerializer.deserialize(cursor));
            len += key_len;
          } catch (err) {
            err.message = `{item_${i}} key: ` + err.message;
            throw err;
          }
          cursor = cursor.slice(key_len);
          let value, value_len;
          try {
            ({ v: value, len: value_len } = this.ioc.anySerializer.deserialize(cursor));
            len += value_len;
          } catch (err) {
            err.message = `{item_${i}} value: ` + err.message;
            throw err;
          }
          cursor = cursor.slice(value_len);
          v.set(key, value);
        }
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/UuidSerializer.js
var require_UuidSerializer = __commonJS((exports, module) => {
  module.exports = class UuidSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.UUID] = this;
    }
    canBeUsedFor(value) {
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.UUID, 1]);
        }
        return Buffer.from([
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ]);
      }
      const uuid_str = String(item).replace(/^urn:uuid:/, "").replace(/[{}-]/g, "");
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.UUID, 0]));
      }
      const v = Buffer.alloc(16, 0);
      for (let i = 0;i < 16 && i * 2 < uuid_str.length; i++) {
        v[i] = parseInt(uuid_str.slice(i * 2, i * 2 + 2), 16);
      }
      bufs.push(v);
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true, nullable = false) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.UUID) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
        }
        if (fullyQualifiedFormat || nullable) {
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        if (cursor.length < 16) {
          throw new Error("unexpected {value} length");
        }
        len += 16;
        const v = cursor.slice(0, 4).toString("hex") + "-" + cursor.slice(4, 6).toString("hex") + "-" + cursor.slice(6, 8).toString("hex") + "-" + cursor.slice(8, 10).toString("hex") + "-" + cursor.slice(10, 16).toString("hex");
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/EdgeSerializer.js
var require_EdgeSerializer = __commonJS((exports, module) => {
  var g = require_graph();
  module.exports = class EdgeSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.EDGE] = this;
    }
    canBeUsedFor(value) {
      return value instanceof g.Edge;
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.EDGE, 1]);
        }
        const id = [3, 0, 0, 0, 0, 0];
        const label = [0, 0, 0, 0];
        const inVId2 = [3, 0, 0, 0, 0, 0];
        const inVLabel2 = [0, 0, 0, 0];
        const outVId2 = [3, 0, 0, 0, 0, 0];
        const outVLabel2 = [0, 0, 0, 0];
        const parent = [254, 1];
        const properties = [254, 1];
        return Buffer.from([...id, ...label, ...inVId2, ...inVLabel2, ...outVId2, ...outVLabel2, ...parent, ...properties]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.EDGE, 0]));
      }
      bufs.push(this.ioc.anySerializer.serialize(item.id));
      bufs.push(this.ioc.stringSerializer.serialize(item.label, false));
      const inVId = item.inV && item.inV.id;
      bufs.push(this.ioc.anySerializer.serialize(inVId));
      const inVLabel = item.inV && item.inV.label;
      bufs.push(this.ioc.stringSerializer.serialize(inVLabel, false));
      const outVId = item.outV && item.outV.id;
      bufs.push(this.ioc.anySerializer.serialize(outVId));
      const outVLabel = item.outV && item.outV.label;
      bufs.push(this.ioc.stringSerializer.serialize(outVLabel, false));
      bufs.push(this.ioc.unspecifiedNullSerializer.serialize(null));
      bufs.push(this.ioc.unspecifiedNullSerializer.serialize(null));
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.EDGE) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        let id, id_len;
        try {
          ({ v: id, len: id_len } = this.ioc.anySerializer.deserialize(cursor));
          len += id_len;
        } catch (err) {
          err.message = "{id}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(id_len);
        let label, label_len;
        try {
          ({ v: label, len: label_len } = this.ioc.stringSerializer.deserialize(cursor, false));
          len += label_len;
        } catch (err) {
          err.message = "{label}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(label_len);
        let inVId, inVId_len;
        try {
          ({ v: inVId, len: inVId_len } = this.ioc.anySerializer.deserialize(cursor));
          len += inVId_len;
        } catch (err) {
          err.message = "{inVId}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(inVId_len);
        let inVLabel, inVLabel_len;
        try {
          ({ v: inVLabel, len: inVLabel_len } = this.ioc.stringSerializer.deserialize(cursor, false));
          len += inVLabel_len;
        } catch (err) {
          err.message = "{inVLabel}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(inVLabel_len);
        let outVId, outVId_len;
        try {
          ({ v: outVId, len: outVId_len } = this.ioc.anySerializer.deserialize(cursor));
          len += outVId_len;
        } catch (err) {
          err.message = "{outVId}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(outVId_len);
        let outVLabel, outVLabel_len;
        try {
          ({ v: outVLabel, len: outVLabel_len } = this.ioc.stringSerializer.deserialize(cursor, false));
          len += outVLabel_len;
        } catch (err) {
          err.message = "{outVLabel}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(outVLabel_len);
        let parent_len;
        try {
          ({ len: parent_len } = this.ioc.anySerializer.deserialize(cursor));
          len += parent_len;
        } catch (err) {
          err.message = "{parent}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(parent_len);
        let properties, properties_len;
        try {
          ({ v: properties, len: properties_len } = this.ioc.anySerializer.deserialize(cursor));
          len += properties_len;
        } catch (err) {
          err.message = "{properties}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(properties_len);
        const v = new g.Edge(id, new g.Vertex(outVId, outVLabel, null), label, new g.Vertex(inVId, inVLabel, null), properties);
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/PathSerializer.js
var require_PathSerializer = __commonJS((exports, module) => {
  var g = require_graph();
  module.exports = class PathSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.PATH] = this;
    }
    canBeUsedFor(value) {
      return value instanceof g.Path;
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.PATH, 1]);
        }
        return Buffer.concat([
          this.ioc.listSerializer.serialize([]),
          this.ioc.listSerializer.serialize([])
        ]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.PATH, 0]));
      }
      bufs.push(this.ioc.listSerializer.serialize(item.labels));
      bufs.push(this.ioc.listSerializer.serialize(item.objects));
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.PATH) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        let labels, labels_len;
        try {
          ({ v: labels, len: labels_len } = this.ioc.listSerializer.deserialize(cursor));
          len += labels_len;
        } catch (err) {
          err.message = "{labels}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(labels_len);
        let objects, objects_len;
        try {
          ({ v: objects, len: objects_len } = this.ioc.listSerializer.deserialize(cursor));
          len += objects_len;
        } catch (err) {
          err.message = "{objects}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(objects_len);
        const v = new g.Path(labels, objects);
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/PropertySerializer.js
var require_PropertySerializer = __commonJS((exports, module) => {
  var g = require_graph();
  module.exports = class PropertySerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.PROPERTY] = this;
    }
    canBeUsedFor(value) {
      return value instanceof g.Property;
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.PROPERTY, 1]);
        }
        return Buffer.concat([
          this.ioc.stringSerializer.serialize("", false),
          this.ioc.unspecifiedNullSerializer.serialize(null),
          this.ioc.unspecifiedNullSerializer.serialize(null)
        ]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.PROPERTY, 0]));
      }
      bufs.push(this.ioc.stringSerializer.serialize(item.key, false));
      bufs.push(this.ioc.anySerializer.serialize(item.value));
      bufs.push(this.ioc.unspecifiedNullSerializer.serialize(null));
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.PROPERTY) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        let key, key_len;
        try {
          ({ v: key, len: key_len } = this.ioc.stringSerializer.deserialize(cursor, false));
          len += key_len;
        } catch (err) {
          err.message = "{key}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(key_len);
        let value, value_len;
        try {
          ({ v: value, len: value_len } = this.ioc.anySerializer.deserialize(cursor));
          len += value_len;
        } catch (err) {
          err.message = "{value}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(value_len);
        let parent_len;
        try {
          ({ len: parent_len } = this.ioc.unspecifiedNullSerializer.deserialize(cursor));
          len += parent_len;
        } catch (err) {
          err.message = "{parent}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(parent_len);
        const v = new g.Property(key, value);
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/VertexSerializer.js
var require_VertexSerializer = __commonJS((exports, module) => {
  var g = require_graph();
  module.exports = class VertexSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.VERTEX] = this;
    }
    canBeUsedFor(value) {
      return value instanceof g.Vertex;
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.VERTEX, 1]);
        }
        const id = [3, 0, 0, 0, 0, 0];
        const label = [0, 0, 0, 0];
        const properties = [254, 1];
        return Buffer.from([...id, ...label, ...properties]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.VERTEX, 0]));
      }
      bufs.push(this.ioc.anySerializer.serialize(item.id));
      bufs.push(this.ioc.stringSerializer.serialize(item.label, false));
      bufs.push(this.ioc.anySerializer.serialize(item.properties));
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.VERTEX) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        let id, id_len;
        try {
          ({ v: id, len: id_len } = this.ioc.anySerializer.deserialize(cursor));
          len += id_len;
        } catch (err) {
          err.message = "{id}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(id_len);
        let label, label_len;
        try {
          ({ v: label, len: label_len } = this.ioc.stringSerializer.deserialize(cursor, false));
          len += label_len;
        } catch (err) {
          err.message = "{label}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(label_len);
        let properties, properties_len;
        try {
          ({ v: properties, len: properties_len } = this.ioc.anySerializer.deserialize(cursor));
          len += properties_len;
        } catch (err) {
          err.message = "{properties}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(properties_len);
        const v = new g.Vertex(id, label, properties);
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/VertexPropertySerializer.js
var require_VertexPropertySerializer = __commonJS((exports, module) => {
  var g = require_graph();
  module.exports = class VertexPropertySerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.VERTEXPROPERTY] = this;
    }
    canBeUsedFor(value) {
      return value instanceof g.VertexProperty;
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.VERTEXPROPERTY, 1]);
        }
        return Buffer.concat([
          this.ioc.unspecifiedNullSerializer.serialize(null),
          this.ioc.stringSerializer.serialize("", false),
          this.ioc.unspecifiedNullSerializer.serialize(null),
          this.ioc.unspecifiedNullSerializer.serialize(null),
          this.ioc.unspecifiedNullSerializer.serialize(null)
        ]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.VERTEXPROPERTY, 0]));
      }
      bufs.push(this.ioc.anySerializer.serialize(item.id));
      bufs.push(this.ioc.stringSerializer.serialize(item.label, false));
      bufs.push(this.ioc.anySerializer.serialize(item.value));
      bufs.push(this.ioc.unspecifiedNullSerializer.serialize(null));
      bufs.push(this.ioc.anySerializer.serialize(item.properties));
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.VERTEXPROPERTY) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        let id, id_len;
        try {
          ({ v: id, len: id_len } = this.ioc.anySerializer.deserialize(cursor));
          len += id_len;
        } catch (err) {
          err.message = "{id}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(id_len);
        let label, label_len;
        try {
          ({ v: label, len: label_len } = this.ioc.stringSerializer.deserialize(cursor, false));
          len += label_len;
        } catch (err) {
          err.message = "{label}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(label_len);
        let value, value_len;
        try {
          ({ v: value, len: value_len } = this.ioc.anySerializer.deserialize(cursor));
          len += value_len;
        } catch (err) {
          err.message = "{value}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(value_len);
        let parent_len;
        try {
          ({ len: parent_len } = this.ioc.unspecifiedNullSerializer.deserialize(cursor));
          len += parent_len;
        } catch (err) {
          err.message = "{parent}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(parent_len);
        let properties, properties_len;
        try {
          ({ v: properties, len: properties_len } = this.ioc.unspecifiedNullSerializer.deserialize(cursor));
          len += properties_len;
        } catch (err) {
          err.message = "{properties}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(properties_len);
        const v = new g.VertexProperty(id, label, value, properties);
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/BytecodeSerializer.js
var require_BytecodeSerializer = __commonJS((exports, module) => {
  var Bytecode = require_bytecode();
  var t = require_traversal();
  module.exports = class BytecodeSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.BYTECODE] = this;
    }
    canBeUsedFor(value) {
      return value instanceof Bytecode || value instanceof t.Traversal;
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.BYTECODE, 1]);
        }
        const steps_length = [0, 0, 0, 0];
        const sources_length = [0, 0, 0, 0];
        return Buffer.from([...steps_length, ...sources_length]);
      }
      if (item instanceof t.Traversal) {
        item = item.getBytecode();
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.BYTECODE, 0]));
      }
      bufs.push(this.ioc.intSerializer.serialize(item.stepInstructions.length, false));
      for (let i = 0;i < item.stepInstructions.length; i++) {
        const step = item.stepInstructions[i];
        const name = step[0];
        const values_length = step.length - 1;
        bufs.push(this.ioc.stringSerializer.serialize(name, false));
        bufs.push(this.ioc.intSerializer.serialize(values_length, false));
        for (let j = 0;j < values_length; j++) {
          bufs.push(this.ioc.anySerializer.serialize(step[1 + j], true));
        }
      }
      bufs.push(this.ioc.intSerializer.serialize(item.sourceInstructions.length, false));
      for (let i = 0;i < item.sourceInstructions.length; i++) {
        const source = item.sourceInstructions[i];
        const name = source[0];
        const values_length = source.length - 1;
        bufs.push(this.ioc.stringSerializer.serialize(name, false));
        bufs.push(this.ioc.intSerializer.serialize(values_length, false));
        for (let j = 0;j < values_length; j++) {
          bufs.push(this.ioc.anySerializer.serialize(source[1 + j], true));
        }
      }
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.BYTECODE) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        const v = new Bytecode;
        let steps_length, steps_length_len;
        try {
          ({ v: steps_length, len: steps_length_len } = this.ioc.intSerializer.deserialize(cursor, false));
          len += steps_length_len;
        } catch (err) {
          err.message = "{steps_length}: " + err.message;
          throw err;
        }
        if (steps_length < 0) {
          throw new Error("{steps_length} is less than zero");
        }
        cursor = cursor.slice(steps_length_len);
        for (let i = 0;i < steps_length; i++) {
          let name, name_len;
          try {
            ({ v: name, len: name_len } = this.ioc.stringSerializer.deserialize(cursor, false));
            len += name_len;
          } catch (err) {
            err.message = `{step_${i}} {name}: ` + err.message;
            throw err;
          }
          cursor = cursor.slice(name_len);
          let values_length, values_length_len;
          try {
            ({ v: values_length, len: values_length_len } = this.ioc.intSerializer.deserialize(cursor, false));
            len += values_length_len;
          } catch (err) {
            err.message = `{step_${i}} {values_length}: ` + err.message;
            throw err;
          }
          if (values_length < 0) {
            throw new Error(`{step_${i}} {values_length} is less than zero`);
          }
          cursor = cursor.slice(values_length_len);
          const values = [];
          let value, value_len;
          for (let j = 0;j < values_length; j++) {
            try {
              ({ v: value, len: value_len } = this.ioc.anySerializer.deserialize(cursor));
              len += value_len;
              values.push(value);
            } catch (err) {
              err.message = `{step_${i}} {value_${j}}: ` + err.message;
              throw err;
            }
            cursor = cursor.slice(value_len);
          }
          v.addStep(name, values);
        }
        let sources_length, sources_length_len;
        try {
          ({ v: sources_length, len: sources_length_len } = this.ioc.intSerializer.deserialize(cursor, false));
          len += sources_length_len;
        } catch (err) {
          err.message = "{sources_length}: " + err.message;
          throw err;
        }
        if (sources_length < 0) {
          throw new Error("{sources_length} is less than zero");
        }
        cursor = cursor.slice(sources_length_len);
        for (let i = 0;i < sources_length; i++) {
          let name, name_len;
          try {
            ({ v: name, len: name_len } = this.ioc.stringSerializer.deserialize(cursor, false));
            len += name_len;
          } catch (err) {
            err.message = `{source_${i}} {name}: ` + err.message;
            throw err;
          }
          cursor = cursor.slice(name_len);
          let values_length, values_length_len;
          try {
            ({ v: values_length, len: values_length_len } = this.ioc.intSerializer.deserialize(cursor, false));
            len += values_length_len;
          } catch (err) {
            err.message = `{source_${i}} {values_length}: ` + err.message;
            throw err;
          }
          if (values_length < 0) {
            throw new Error(`{source_${i}} {values_length} is less than zero`);
          }
          cursor = cursor.slice(values_length_len);
          const values = [];
          let value, value_len;
          for (let j = 0;j < values_length; j++) {
            try {
              ({ v: value, len: value_len } = this.ioc.anySerializer.deserialize(cursor));
              len += value_len;
              values.push(value);
            } catch (err) {
              err.message = `{source_${i}} {value_${j}}: ` + err.message;
              throw err;
            }
            cursor = cursor.slice(value_len);
          }
          v.addSource(name, values);
        }
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/PSerializer.js
var require_PSerializer = __commonJS((exports, module) => {
  var t = require_traversal();
  module.exports = class PSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.P] = this;
    }
    canBeUsedFor(value) {
      return value instanceof t.P;
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.P, 1]);
        }
        const name = [0, 0, 0, 0];
        const values_length = [0, 0, 0, 0];
        return Buffer.from([...name, ...values_length]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.P, 0]));
      }
      bufs.push(this.ioc.stringSerializer.serialize(item.operator, false));
      let list;
      if (item.other === undefined || item.other === null) {
        if (Array.isArray(item.value)) {
          list = item.value;
        } else {
          list = [item.value];
        }
      } else {
        list = [item.value, item.other];
      }
      bufs.push(this.ioc.listSerializer.serialize(list, false));
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.P) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        let name, name_len;
        try {
          ({ v: name, len: name_len } = this.ioc.stringSerializer.deserialize(cursor, false));
          len += name_len;
        } catch (err) {
          err.message = "{name}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(name_len);
        let values, values_len;
        try {
          ({ v: values, len: values_len } = this.ioc.listSerializer.deserialize(cursor, false));
          len += values_len;
        } catch (err) {
          err.message = "{values}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(values_len);
        if (values.length < 1) {
          return { v: new t.P(""), len };
        }
        let v;
        const P_static = t.P[name];
        if (typeof P_static === "function") {
          v = P_static(...values);
        } else {
          v = new t.P(name, ...values);
        }
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/TraverserSerializer.js
var require_TraverserSerializer = __commonJS((exports, module) => {
  var t = require_traversal();
  module.exports = class TraverserSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.TRAVERSER] = this;
    }
    canBeUsedFor(value) {
      return value instanceof t.Traverser;
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.TRAVERSER, 1]);
        }
        const bulk = [0, 0, 0, 0, 0, 0, 0, 1];
        const value = [254, 1];
        return Buffer.from([...bulk, ...value]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.TRAVERSER, 0]));
      }
      bufs.push(this.ioc.longSerializer.serialize(item.bulk, false));
      bufs.push(this.ioc.anySerializer.serialize(item.object));
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.TRAVERSER) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        let bulk, bulk_len;
        try {
          ({ v: bulk, len: bulk_len } = this.ioc.longSerializer.deserialize(cursor, false));
          len += bulk_len;
        } catch (err) {
          err.message = "{bulk}: " + err.message;
          throw err;
        }
        if (bulk < 0) {
          throw new Error("{bulk} is less than zero");
        }
        cursor = cursor.slice(bulk_len);
        let value, value_len;
        try {
          ({ v: value, len: value_len } = this.ioc.anySerializer.deserialize(cursor));
          len += value_len;
        } catch (err) {
          err.message = "{value}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(value_len);
        const v = new t.Traverser(value, bulk);
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/EnumSerializer.js
var require_EnumSerializer = __commonJS((exports, module) => {
  var t = require_traversal();
  module.exports = class EnumSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      const to_orig_enum = (obj) => {
        const r = {};
        Object.values(obj).forEach((e) => r[e.elementName] = e);
        return r;
      };
      const DT = ioc.DataType;
      this.types = [
        { name: "Barrier", code: DT.BARRIER, enum: to_orig_enum(t.barrier) },
        { name: "Cardinality", code: DT.CARDINALITY, enum: to_orig_enum(t.cardinality) },
        { name: "Column", code: DT.COLUMN, enum: to_orig_enum(t.column) },
        { name: "Direction", code: DT.DIRECTION, enum: to_orig_enum(t.direction) },
        { name: "Merge", code: DT.MERGE, enum: to_orig_enum(t.merge) },
        { name: "Operator", code: DT.OPERATOR, enum: to_orig_enum(t.operator) },
        { name: "Order", code: DT.ORDER, enum: to_orig_enum(t.order) },
        { name: "Pick", code: DT.PICK, enum: to_orig_enum(t.pick) },
        { name: "Pop", code: DT.POP, enum: to_orig_enum(t.pop) },
        { name: "Scope", code: DT.SCOPE, enum: to_orig_enum(t.scope) },
        { name: "T", code: DT.T, enum: to_orig_enum(t.t) }
      ];
      this.byname = {};
      this.bycode = {};
      for (const type of this.types) {
        this.ioc.serializers[type.code] = this;
        this.byname[type.name] = type;
        this.bycode[type.code] = type;
      }
    }
    canBeUsedFor(value) {
      if (!(value instanceof t.EnumValue)) {
        return false;
      }
      if (!this.byname[value.typeName]) {
        throw new Error(`EnumSerializer.serialize: typeName=${value.typeName} is not supported.`);
      }
      return true;
    }
    serialize(item, fullyQualifiedFormat = true) {
      const type = this.byname[item.typeName];
      if (item.elementName === undefined || item.elementName === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([type.code, 1]);
        }
        return Buffer.from([this.ioc.DataType.STRING, 0, 0, 0, 0, 0]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([type.code, 0]));
      }
      bufs.push(this.ioc.stringSerializer.serialize(item.elementName, true));
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        let type = undefined;
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          type = this.bycode[type_code];
          if (!type) {
            throw new Error(`unexpected {type_code}=${type_code}`);
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        let elementName, elementName_len;
        try {
          ({ v: elementName, len: elementName_len } = this.ioc.stringSerializer.deserialize(cursor, true));
          len += elementName_len;
        } catch (err) {
          err.message = "elementName: " + err.message;
          throw err;
        }
        cursor = cursor.slice(elementName_len);
        let v;
        if (!type) {
          v = new t.EnumValue(undefined, elementName);
        } else {
          v = type.enum[elementName];
        }
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/LambdaSerializer.js
var require_LambdaSerializer = __commonJS((exports, module) => {
  var { valueKey, LambdaSerializer: GraphsonLambdaSerializer } = require_type_serializers();
  module.exports = class LambdaSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.graphsonLambdaSerializer = new GraphsonLambdaSerializer;
    }
    canBeUsedFor(value) {
      return this.graphsonLambdaSerializer.canBeUsedFor(value);
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.LAMBDA, 1]);
        }
        const language2 = [0, 0, 0, 0];
        const script2 = [0, 0, 0, 0];
        const arguments_length = [0, 0, 0, 0];
        return Buffer.from([...language2, ...script2, ...arguments_length]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.LAMBDA, 0]));
      }
      const graphson = this.graphsonLambdaSerializer.serialize(item);
      const language = graphson[valueKey].language;
      const script = graphson[valueKey].script;
      const arguments_ = graphson[valueKey]["arguments"];
      bufs.push(this.ioc.stringSerializer.serialize(language, false));
      bufs.push(this.ioc.stringSerializer.serialize(script, false));
      bufs.push(this.ioc.intSerializer.serialize(arguments_, false));
      return Buffer.concat(bufs);
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/BigIntegerSerializer.js
var require_BigIntegerSerializer = __commonJS((exports, module) => {
  module.exports = class BigIntegerSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.BIGINTEGER] = this;
    }
    canBeUsedFor(value) {
      return typeof value === "bigint";
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.BIGINTEGER, 1]);
        }
        return Buffer.from([0, 0, 0, 1, 0]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.BIGINTEGER, 0]));
      }
      let v;
      if (item >= 0) {
        let hex_str = item.toString(16);
        if (hex_str.length % 2 !== 0) {
          hex_str = "0" + hex_str;
        }
        if (Number.parseInt(hex_str[0], 16) > 7) {
          hex_str = "00" + hex_str;
        }
        v = Buffer.from(hex_str, "hex");
      } else {
        let hex_str = (-item).toString(16);
        const bytes = (hex_str.length + hex_str.length % 2) / 2;
        let N = BigInt(bytes) * BigInt(8);
        const INTN_MIN = -(BigInt(2) ** (N - BigInt(1)));
        if (item < INTN_MIN) {
          N += BigInt(8);
        }
        const twos_complement = BigInt(2) ** N + item;
        hex_str = twos_complement.toString(16);
        if (hex_str.length % 2 !== 0) {
          hex_str = "0" + hex_str;
        }
        v = Buffer.from(hex_str, "hex");
      }
      bufs.push(this.ioc.intSerializer.serialize(v.length, false));
      bufs.push(v);
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.BIGINTEGER) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        let length, length_len;
        try {
          ({ v: length, len: length_len } = this.ioc.intSerializer.deserialize(cursor, false));
          len += length_len;
        } catch (err) {
          err.message = "{length}: " + err.message;
          throw err;
        }
        if (length < 1) {
          throw new Error(`{length}=${length} is less than one`);
        }
        cursor = cursor.slice(length_len);
        len += length;
        cursor = cursor.slice(0, length);
        let v = BigInt(`0x${cursor.toString("hex")}`);
        const is_sign_bit_set = (cursor[0] & 128) === 128;
        if (is_sign_bit_set) {
          v = BigInt.asIntN(length * 8, v);
        }
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/ByteSerializer.js
var require_ByteSerializer = __commonJS((exports, module) => {
  module.exports = class ByteSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.BYTE] = this;
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.BYTE, 1]);
        }
        return Buffer.from([0]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.BYTE, 0]));
      }
      const v = Buffer.alloc(1);
      v.writeUInt8(item);
      bufs.push(v);
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.BYTE) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        if (cursor.length < 1) {
          throw new Error("unexpected {value} length");
        }
        len += 1;
        const v = cursor.readUInt8();
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/ByteBufferSerializer.js
var require_ByteBufferSerializer = __commonJS((exports, module) => {
  module.exports = class ByteBufferSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.BYTEBUFFER] = this;
    }
    canBeUsedFor(value) {
      return value instanceof Buffer;
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.BYTEBUFFER, 1]);
        }
        return Buffer.from([0, 0, 0, 0]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.BYTEBUFFER, 0]));
      }
      let length = item.length;
      if (length < 0) {
        length = 0;
      }
      if (length > this.ioc.intSerializer.INT32_MAX) {
        throw new Error(`Buffer length=${length} is greater than supported max_length=${this.ioc.intSerializer.INT32_MAX}.`);
      }
      bufs.push(this.ioc.intSerializer.serialize(length, false));
      bufs.push(item);
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.BYTEBUFFER) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        let length, length_len;
        try {
          ({ v: length, len: length_len } = this.ioc.intSerializer.deserialize(cursor, false));
          len += length_len;
        } catch (err) {
          err.message = "{length}: " + err.message;
          throw err;
        }
        if (length < 0) {
          throw new Error("{length} is less than zero");
        }
        cursor = cursor.slice(length_len);
        if (length !== cursor.length) {
          throw new Error(`{value}: unexpected actual {value} length=${cursor.length} when {length}=${length}`);
        }
        const v = cursor.slice(0, length);
        len += length;
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/ShortSerializer.js
var require_ShortSerializer = __commonJS((exports, module) => {
  module.exports = class ShortSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.SHORT] = this;
    }
    canBeUsedFor(value) {
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.SHORT, 1]);
        }
        return Buffer.from([0, 0]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.SHORT, 0]));
      }
      const v = Buffer.alloc(2);
      v.writeInt16BE(item);
      bufs.push(v);
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.SHORT) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        if (cursor.length < 2) {
          throw new Error("unexpected {value} length");
        }
        len += 2;
        const v = cursor.readInt16BE();
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/BooleanSerializer.js
var require_BooleanSerializer = __commonJS((exports, module) => {
  module.exports = class BooleanSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.BOOLEAN] = this;
    }
    canBeUsedFor(value) {
      return typeof value === "boolean";
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.BOOLEAN, 1]);
        }
        return Buffer.from([0]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.BOOLEAN, 0]));
      }
      bufs.push(Buffer.from([item ? 1 : 0]));
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.BOOLEAN) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        if (cursor.length < 1) {
          throw new Error("unexpected {value} length");
        }
        len += 1;
        let v = cursor.readUInt8();
        if (v !== 0 && v !== 1) {
          throw new Error(`unexpected boolean byte=${v}`);
        }
        v = v === 1;
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/TextPSerializer.js
var require_TextPSerializer = __commonJS((exports, module) => {
  var t = require_traversal();
  module.exports = class TextPSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.TEXTP] = this;
    }
    canBeUsedFor(value) {
      return value instanceof t.TextP;
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.TEXTP, 1]);
        }
        const name = [0, 0, 0, 0];
        const values_length = [0, 0, 0, 0];
        return Buffer.from([...name, ...values_length]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.TEXTP, 0]));
      }
      bufs.push(this.ioc.stringSerializer.serialize(item.operator, false));
      let list;
      if (item.other === undefined || item.other === null) {
        if (Array.isArray(item.value)) {
          list = item.value;
        } else {
          list = [item.value];
        }
      } else {
        list = [item.value, item.other];
      }
      bufs.push(this.ioc.listSerializer.serialize(list, false));
      return Buffer.concat(bufs);
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.TEXTP) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        let name, name_len;
        try {
          ({ v: name, len: name_len } = this.ioc.stringSerializer.deserialize(cursor, false));
          len += name_len;
        } catch (err) {
          err.message = "{name}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(name_len);
        let values, values_len;
        try {
          ({ v: values, len: values_len } = this.ioc.listSerializer.deserialize(cursor, false));
          len += values_len;
        } catch (err) {
          err.message = "{values}: " + err.message;
          throw err;
        }
        cursor = cursor.slice(values_len);
        if (values.length < 1) {
          return { v: new t.TextP(""), len };
        }
        let v;
        const TextP_static = t.TextP[name];
        if (typeof TextP_static === "function") {
          v = TextP_static(...values);
        } else {
          v = new t.TextP(name, ...values);
        }
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/TraversalStrategySerializer.js
var require_TraversalStrategySerializer = __commonJS((exports, module) => {
  var { TraversalStrategySerializer: GraphsonTraversalStrategySerializer } = require_type_serializers();
  module.exports = class TraversalStrategySerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.graphsonTraversalStrategySerializer = new GraphsonTraversalStrategySerializer;
    }
    canBeUsedFor(value) {
      return this.graphsonTraversalStrategySerializer.canBeUsedFor(value);
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (item === undefined || item === null) {
        if (fullyQualifiedFormat) {
          return Buffer.from([this.ioc.DataType.TRAVERSALSTRATEGY, 1]);
        }
        const strategy_class2 = [0, 0, 0, 0];
        const configuration = [0, 0, 0, 0];
        return Buffer.from([...strategy_class2, ...configuration]);
      }
      const bufs = [];
      if (fullyQualifiedFormat) {
        bufs.push(Buffer.from([this.ioc.DataType.TRAVERSALSTRATEGY, 0]));
      }
      const strategy_class = item.fqcn;
      const conf = {};
      for (const k in item.configuration) {
        if (item.configuration.hasOwnProperty(k)) {
          conf[k] = item.configuration[k];
        }
      }
      bufs.push(this.ioc.classSerializer.serialize(strategy_class, false));
      bufs.push(this.ioc.mapSerializer.serialize(conf, false));
      return Buffer.concat(bufs);
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/BulkSetSerializer.js
var require_BulkSetSerializer = __commonJS((exports, module) => {
  module.exports = class BulkSetSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.BULKSET] = this;
    }
    deserialize(buffer, fullyQualifiedFormat = true) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        if (fullyQualifiedFormat) {
          const type_code = cursor.readUInt8();
          len++;
          if (type_code !== this.ioc.DataType.BULKSET) {
            throw new Error("unexpected {type_code}");
          }
          cursor = cursor.slice(1);
          if (cursor.length < 1) {
            throw new Error("{value_flag} is missing");
          }
          const value_flag = cursor.readUInt8();
          len++;
          if (value_flag === 1) {
            return { v: null, len };
          }
          if (value_flag !== 0) {
            throw new Error("unexpected {value_flag}");
          }
          cursor = cursor.slice(1);
        }
        let length, length_len;
        try {
          ({ v: length, len: length_len } = this.ioc.intSerializer.deserialize(cursor, false));
          len += length_len;
        } catch (err) {
          err.message = "{length}: " + err.message;
          throw err;
        }
        if (length < 0) {
          throw new Error("{length} is less than zero");
        }
        cursor = cursor.slice(length_len);
        let v = new Array;
        for (let i = 0;i < length; i++) {
          let value, value_len;
          try {
            ({ v: value, len: value_len } = this.ioc.anySerializer.deserialize(cursor));
            len += value_len;
          } catch (err) {
            err.message = `{item_${i}} value: ` + err.message;
            throw err;
          }
          cursor = cursor.slice(value_len);
          let bulk, bulk_len;
          try {
            ({ v: bulk, len: bulk_len } = this.ioc.longSerializer.deserialize(cursor, false));
            len += bulk_len;
          } catch (err) {
            err.message = `{item_${i}} bulk: ` + err.message;
            throw err;
          }
          if (bulk < 0) {
            throw new Error(`{item_${i}}: bulk is less than zero`);
          }
          if (bulk > 4294967295) {
            throw new Error(`{item_${i}}: bulk is greater than 2^32-1`);
          }
          cursor = cursor.slice(bulk_len);
          bulk = Number(bulk);
          const item = new Array(bulk).fill(value);
          v = v.concat(item);
        }
        return { v, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/UnspecifiedNullSerializer.js
var require_UnspecifiedNullSerializer = __commonJS((exports, module) => {
  module.exports = class UnspecifiedNullSerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.ioc.serializers[ioc.DataType.UNSPECIFIED_NULL] = this;
    }
    canBeUsedFor(value) {
      return value === null || value === undefined;
    }
    serialize(item) {
      return Buffer.from([this.ioc.DataType.UNSPECIFIED_NULL, 1]);
    }
    deserialize(buffer) {
      let len = 0;
      let cursor = buffer;
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        const type_code = cursor.readUInt8();
        len++;
        if (type_code !== this.ioc.DataType.UNSPECIFIED_NULL) {
          throw new Error("unexpected {type_code}");
        }
        cursor = cursor.slice(1);
        if (cursor.length < 1) {
          throw new Error("{value_flag} is missing");
        }
        const value_flag = cursor.readUInt8();
        len++;
        if (value_flag !== 1) {
          throw new Error("unexpected {value_flag}");
        }
        cursor = cursor.slice(1);
        return { v: null, len };
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, cursor, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/NumberSerializationStrategy.js
var require_NumberSerializationStrategy = __commonJS((exports, module) => {
  module.exports = class NumberSerializationStrategy {
    constructor(ioc) {
      this.ioc = ioc;
    }
    canBeUsedFor(value) {
      if (Number.isNaN(value) || value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY) {
        return true;
      }
      if (typeof value === "number") {
        return true;
      }
      if (typeof value === "bigint") {
        return true;
      }
      return false;
    }
    serialize(item, fullyQualifiedFormat = true) {
      if (typeof item === "number") {
        if (Number.isNaN(item) || item === Number.POSITIVE_INFINITY || item === Number.NEGATIVE_INFINITY || !Number.isInteger(item)) {
          return this.ioc.doubleSerializer.serialize(item, fullyQualifiedFormat);
        }
        if (item >= -2147483648 && item <= 2147483647) {
          return this.ioc.intSerializer.serialize(item, fullyQualifiedFormat);
        }
        return this.ioc.longSerializer.serialize(item, fullyQualifiedFormat);
      }
      if (typeof item === "bigint") {
        return this.ioc.bigIntegerSerializer.serialize(item, fullyQualifiedFormat);
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/AnySerializer.js
var require_AnySerializer = __commonJS((exports, module) => {
  module.exports = class AnySerializer {
    constructor(ioc) {
      this.ioc = ioc;
      this.serializers = [
        ioc.unspecifiedNullSerializer,
        ioc.numberSerializationStrategy,
        ioc.booleanSerializer,
        ioc.dateSerializer,
        ioc.bytecodeSerializer,
        ioc.pSerializer,
        ioc.traverserSerializer,
        ioc.enumSerializer,
        ioc.listSerializer,
        ioc.uuidSerializer,
        ioc.edgeSerializer,
        ioc.pathSerializer,
        ioc.propertySerializer,
        ioc.vertexSerializer,
        ioc.vertexPropertySerializer,
        ioc.stringSerializer,
        ioc.textPSerializer,
        ioc.traversalStrategySerializer,
        ioc.byteBufferSerializer,
        ioc.lambdaSerializer,
        ioc.mapSerializer
      ];
    }
    getSerializerCanBeUsedFor(item) {
      for (let i = 0;i < this.serializers.length; i++) {
        if (this.serializers[i].canBeUsedFor(item)) {
          return this.serializers[i];
        }
      }
      throw new Error(`No serializer found to support item where typeof(item)='${typeof item}' and String(item)='${String(item)}'.`);
    }
    serialize(item, fullyQualifiedFormat = true) {
      return this.getSerializerCanBeUsedFor(item).serialize(item, fullyQualifiedFormat);
    }
    deserialize(buffer) {
      try {
        if (buffer === undefined || buffer === null || !(buffer instanceof Buffer)) {
          throw new Error("buffer is missing");
        }
        if (buffer.length < 1) {
          throw new Error("buffer is empty");
        }
        const type_code = buffer.readUInt8();
        const serializer = this.ioc.serializers[type_code];
        if (!serializer) {
          throw new Error("unknown {type_code}");
        }
        return serializer.deserialize(buffer);
      } catch (err) {
        throw this.ioc.utils.des_error({ serializer: this, args: arguments, err });
      }
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/GraphBinaryReader.js
var require_GraphBinaryReader = __commonJS((exports, module) => {
  module.exports = class GraphBinaryReader {
    constructor(ioc) {
      this.ioc = ioc;
    }
    readResponse(buffer) {
      if (buffer === undefined || buffer === null) {
        throw new Error("Buffer is missing.");
      }
      if (!(buffer instanceof Buffer)) {
        throw new Error("Not an instance of Buffer.");
      }
      if (buffer.length < 1) {
        throw new Error("Buffer is empty.");
      }
      const response = { status: {}, result: {} };
      let cursor = buffer;
      let len;
      const version = cursor[0];
      if (version !== 129) {
        throw new Error(`Unsupported version '${version}'.`);
      }
      cursor = cursor.slice(1);
      ({ v: response.requestId, len } = this.ioc.uuidSerializer.deserialize(cursor, false, true));
      cursor = cursor.slice(len);
      ({ v: response.status.code, len } = this.ioc.intSerializer.deserialize(cursor, false));
      cursor = cursor.slice(len);
      ({ v: response.status.message, len } = this.ioc.stringSerializer.deserialize(cursor, false, true));
      cursor = cursor.slice(len);
      ({ v: response.status.attributes, len } = this.ioc.mapSerializer.deserialize(cursor, false));
      cursor = cursor.slice(len);
      ({ v: response.result.meta, len } = this.ioc.mapSerializer.deserialize(cursor, false));
      cursor = cursor.slice(len);
      ({ v: response.result.data } = this.ioc.anySerializer.deserialize(cursor));
      return response;
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/internals/GraphBinaryWriter.js
var require_GraphBinaryWriter = __commonJS((exports, module) => {
  module.exports = class GraphBinaryWriter {
    constructor(ioc) {
      this.ioc = ioc;
    }
    writeRequest({ requestId, op, processor, args }) {
      const bufs = [
        Buffer.from([129]),
        this.ioc.uuidSerializer.serialize(requestId, false),
        this.ioc.stringSerializer.serialize(op, false),
        this.ioc.stringSerializer.serialize(processor, false),
        this.ioc.mapSerializer.serialize(args, false)
      ];
      return Buffer.concat(bufs);
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/structure/io/binary/GraphBinary.js
var require_GraphBinary = __commonJS((exports, module) => {
  var ioc = {};
  ioc.DataType = require_DataType();
  ioc.utils = require_utils2();
  ioc.serializers = {};
  ioc.intSerializer = new (require_IntSerializer())(ioc);
  ioc.longSerializer = new (require_LongSerializer())(ioc);
  ioc.longSerializerNg = new (require_LongSerializerNg())(ioc);
  ioc.stringSerializer = new (require_StringSerializer())(ioc, ioc.DataType.STRING);
  ioc.dateSerializer = new (require_DateSerializer())(ioc, ioc.DataType.DATE);
  ioc.timestampSerializer = new (require_DateSerializer())(ioc, ioc.DataType.TIMESTAMP);
  ioc.classSerializer = new (require_StringSerializer())(ioc, ioc.DataType.CLASS);
  ioc.doubleSerializer = new (require_DoubleSerializer())(ioc);
  ioc.floatSerializer = new (require_FloatSerializer())(ioc);
  ioc.listSerializer = new (require_ArraySerializer())(ioc, ioc.DataType.LIST);
  ioc.mapSerializer = new (require_MapSerializer())(ioc);
  ioc.setSerializer = new (require_ArraySerializer())(ioc, ioc.DataType.SET);
  ioc.uuidSerializer = new (require_UuidSerializer())(ioc);
  ioc.edgeSerializer = new (require_EdgeSerializer())(ioc);
  ioc.pathSerializer = new (require_PathSerializer())(ioc);
  ioc.propertySerializer = new (require_PropertySerializer())(ioc);
  ioc.vertexSerializer = new (require_VertexSerializer())(ioc);
  ioc.vertexPropertySerializer = new (require_VertexPropertySerializer())(ioc);
  ioc.bytecodeSerializer = new (require_BytecodeSerializer())(ioc);
  ioc.pSerializer = new (require_PSerializer())(ioc);
  ioc.traverserSerializer = new (require_TraverserSerializer())(ioc);
  ioc.enumSerializer = new (require_EnumSerializer())(ioc);
  ioc.lambdaSerializer = new (require_LambdaSerializer())(ioc);
  ioc.bigIntegerSerializer = new (require_BigIntegerSerializer())(ioc);
  ioc.byteSerializer = new (require_ByteSerializer())(ioc);
  ioc.byteBufferSerializer = new (require_ByteBufferSerializer())(ioc);
  ioc.shortSerializer = new (require_ShortSerializer())(ioc);
  ioc.booleanSerializer = new (require_BooleanSerializer())(ioc);
  ioc.textPSerializer = new (require_TextPSerializer())(ioc);
  ioc.traversalStrategySerializer = new (require_TraversalStrategySerializer())(ioc);
  ioc.bulkSetSerializer = new (require_BulkSetSerializer())(ioc);
  ioc.unspecifiedNullSerializer = new (require_UnspecifiedNullSerializer())(ioc);
  ioc.numberSerializationStrategy = new (require_NumberSerializationStrategy())(ioc);
  ioc.anySerializer = new (require_AnySerializer())(ioc);
  ioc.graphBinaryReader = new (require_GraphBinaryReader())(ioc);
  ioc.graphBinaryWriter = new (require_GraphBinaryWriter())(ioc);
  module.exports = ioc;
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/driver/result-set.js
var require_result_set = __commonJS((exports, module) => {
  var util = import.meta.require("util");
  var inspect = util.inspect.custom || "inspect";
  var utils = require_utils();
  var emptyMap = Object.freeze(new utils.ImmutableMap);

  class ResultSet {
    constructor(items, attributes) {
      if (!Array.isArray(items)) {
        throw new TypeError("items must be an Array instance");
      }
      this._items = items;
      this.attributes = attributes || emptyMap;
      this.length = items.length;
    }
    [Symbol.iterator]() {
      return this._items[Symbol.iterator]();
    }
    [inspect]() {
      return this._items;
    }
    toArray() {
      return this._items;
    }
    first() {
      const item = this._items[0];
      return item !== undefined ? item : null;
    }
  }
  module.exports = ResultSet;
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/driver/response-error.js
var require_response_error = __commonJS((exports, module) => {
  class ResponseError extends Error {
    constructor(message, responseStatus) {
      super(message);
      this.name = "ResponseError";
      this.statusCode = responseStatus.code;
      this.statusMessage = responseStatus.message;
      this.statusAttributes = responseStatus.attributes || {};
    }
  }
  module.exports = ResponseError;
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/driver/connection.js
var require_connection = __commonJS((exports, module) => {
  var EventEmitter = import.meta.require("events");
  var Stream = import.meta.require("stream");
  var WebSocket = import.meta.require("ws");
  var util = import.meta.require("util");
  var utils = require_utils();
  var serializer = require_graph_serializer();
  var { graphBinaryReader, graphBinaryWriter } = require_GraphBinary();
  var ResultSet = require_result_set();
  var ResponseError = require_response_error();
  var responseStatusCode = {
    success: 200,
    noContent: 204,
    partialContent: 206,
    authenticationChallenge: 407
  };
  var defaultMimeType = "application/vnd.gremlin-v3.0+json";
  var graphSON2MimeType = "application/vnd.gremlin-v2.0+json";
  var graphBinaryMimeType = "application/vnd.graphbinary-v1.0";
  var pingIntervalDelay = 60 * 1000;
  var pongTimeoutDelay = 30 * 1000;

  class Connection extends EventEmitter {
    constructor(url, options) {
      super();
      this.url = url;
      this.options = options = options || {};
      this.mimeType = options.mimeType || defaultMimeType;
      this._responseHandlers = {};
      this._reader = options.reader || this._getDefaultReader(this.mimeType);
      this._writer = options.writer || this._getDefaultWriter(this.mimeType);
      this._openPromise = null;
      this._openCallback = null;
      this._closePromise = null;
      this._closeCallback = null;
      this._pingInterval = null;
      this._pongTimeout = null;
      this._header = String.fromCharCode(this.mimeType.length) + this.mimeType;
      this._header_buf = Buffer.from(this._header);
      this.isOpen = false;
      this.traversalSource = options.traversalSource || "g";
      this._authenticator = options.authenticator;
      this._enableUserAgentOnConnect = options.enableUserAgentOnConnect !== false;
      this._pingEnabled = this.options.pingEnabled === false ? false : true;
      this._pingIntervalDelay = this.options.pingInterval || pingIntervalDelay;
      this._pongTimeoutDelay = this.options.pongTimeout || pongTimeoutDelay;
      if (this.options.connectOnStartup) {
        console.warn("connectOnStartup is now deprecated and non-functional. To open a connection, please call open() after instantiating connection object.");
      }
    }
    open() {
      if (this.isOpen) {
        return Promise.resolve();
      }
      if (this._openPromise) {
        return this._openPromise;
      }
      this.emit("log", "ws open");
      let headers = this.options.headers;
      if (this._enableUserAgentOnConnect) {
        if (!headers) {
          headers = [];
        }
        headers[utils.getUserAgentHeader()] = utils.getUserAgent();
      }
      this._ws = new WebSocket(this.url, {
        headers,
        ca: this.options.ca,
        cert: this.options.cert,
        pfx: this.options.pfx,
        rejectUnauthorized: this.options.rejectUnauthorized
      });
      this._ws.on("message", (data) => this._handleMessage(data));
      this._ws.on("close", (code, message) => this._handleClose(code, message));
      this._ws.on("pong", () => {
        this.emit("log", "ws pong received");
        if (this._pongTimeout) {
          clearTimeout(this._pongTimeout);
          this._pongTimeout = null;
        }
      });
      this._ws.on("ping", () => {
        this.emit("log", "ws ping received");
        this._ws.pong();
      });
      return this._openPromise = new Promise((resolve, reject) => {
        this._ws.on("open", () => {
          this.isOpen = true;
          if (this._pingEnabled) {
            this._pingHeartbeat();
          }
          resolve();
        });
        this._ws.on("error", (err) => {
          this._handleError(err);
          reject(err);
        });
      });
    }
    submit(processor, op, args, requestId) {
      const rid = (requestId || utils.getUuid()).toLowerCase();
      return this.open().then(() => new Promise((resolve, reject) => {
        if (op !== "authentication") {
          this._responseHandlers[rid] = {
            callback: (err, result) => err ? reject(err) : resolve(result),
            result: null
          };
        }
        const request = {
          requestId: rid,
          op: op || "bytecode",
          processor: !processor && op !== "eval" ? "traversal" : processor,
          args: args || {}
        };
        const request_buf = this._writer.writeRequest(request);
        const message = Buffer.concat([this._header_buf, request_buf]);
        this._ws.send(message);
      }));
    }
    stream(processor, op, args, requestId) {
      const rid = (requestId || utils.getUuid()).toLowerCase();
      const readableStream = new Stream.Readable({
        objectMode: true,
        read() {
        }
      });
      this._responseHandlers[rid] = {
        callback: (err) => err ? readableStream.destroy(err) : readableStream.push(null),
        result: readableStream
      };
      this.open().then(() => {
        const request = {
          requestId: rid,
          op: op || "bytecode",
          processor: !processor && op !== "eval" ? "traversal" : processor,
          args: args || {}
        };
        const request_buf = this._writer.writeRequest(request);
        const message = Buffer.concat([this._header_buf, request_buf]);
        this._ws.send(message);
      }).catch((err) => readableStream.destroy(err));
      return readableStream;
    }
    _getDefaultReader(mimeType) {
      if (mimeType === graphBinaryMimeType) {
        return graphBinaryReader;
      }
      return mimeType === graphSON2MimeType ? new serializer.GraphSON2Reader : new serializer.GraphSONReader;
    }
    _getDefaultWriter(mimeType) {
      if (mimeType === graphBinaryMimeType) {
        return graphBinaryWriter;
      }
      return mimeType === graphSON2MimeType ? new serializer.GraphSON2Writer : new serializer.GraphSONWriter;
    }
    _pingHeartbeat() {
      if (this._pingInterval) {
        clearInterval(this._pingInterval);
        this._pingInterval = null;
      }
      this._pingInterval = setInterval(() => {
        if (this.isOpen === false) {
          if (this._pingInterval) {
            clearInterval(this._pingInterval);
            this._pingInterval = null;
          }
        }
        this._pongTimeout = setTimeout(() => {
          this._ws.terminate();
        }, this._pongTimeoutDelay);
        this._ws.ping();
      }, this._pingIntervalDelay);
    }
    _handleError(err) {
      this.emit("log", `ws error ${err}`);
      this._cleanupWebsocket(err);
      this.emit("socketError", err);
    }
    _handleClose(code, message) {
      this.emit("log", `ws close code=${code} message=${message}`);
      this._cleanupWebsocket();
      if (this._closeCallback) {
        this._closeCallback();
      }
      this.emit("close", code, message);
    }
    _handleMessage(data) {
      const response = this._reader.readResponse(data);
      if (response.requestId === null || response.requestId === undefined) {
        Object.keys(this._responseHandlers).forEach((requestId) => {
          const handler2 = this._responseHandlers[requestId];
          this._clearHandler(requestId);
          if (response.status !== undefined && response.status.message) {
            return handler2.callback(new ResponseError(util.format("Server error (no request information): %s (%d)", response.status.message, response.status.code), response.status));
          }
          return handler2.callback(new ResponseError(util.format("Server error (no request information): %j", response), response.status));
        });
        return;
      }
      response.requestId = response.requestId.toLowerCase();
      const handler = this._responseHandlers[response.requestId];
      if (!handler) {
        return;
      }
      if (response.status.code === responseStatusCode.authenticationChallenge && this._authenticator) {
        this._authenticator.evaluateChallenge(response.result.data).then((res) => this.submit(undefined, "authentication", res, response.requestId)).catch(handler.callback);
        return;
      } else if (response.status.code >= 400) {
        return handler.callback(new ResponseError(util.format("Server error: %s (%d)", response.status.message, response.status.code), response.status));
      }
      const isStreamingResponse = handler.result instanceof Stream.Readable;
      switch (response.status.code) {
        case responseStatusCode.noContent:
          this._clearHandler(response.requestId);
          if (isStreamingResponse) {
            handler.result.push(new ResultSet(utils.emptyArray, response.status.attributes));
            return handler.callback(null);
          }
          return handler.callback(null, new ResultSet(utils.emptyArray, response.status.attributes));
        case responseStatusCode.partialContent:
          if (isStreamingResponse) {
            handler.result.push(new ResultSet(response.result.data, response.status.attributes));
            break;
          }
          handler.result = handler.result || [];
          handler.result.push.apply(handler.result, response.result.data);
          break;
        default:
          if (isStreamingResponse) {
            handler.result.push(new ResultSet(response.result.data, response.status.attributes));
            return handler.callback(null);
          }
          if (handler.result) {
            handler.result.push.apply(handler.result, response.result.data);
          } else {
            handler.result = response.result.data;
          }
          this._clearHandler(response.requestId);
          return handler.callback(null, new ResultSet(handler.result, response.status.attributes));
      }
    }
    _cleanupWebsocket(err) {
      if (this._pingInterval) {
        clearInterval(this._pingInterval);
      }
      this._pingInterval = null;
      if (this._pongTimeout) {
        clearTimeout(this._pongTimeout);
      }
      this._pongTimeout = null;
      Object.keys(this._responseHandlers).forEach((requestId) => {
        const handler = this._responseHandlers[requestId];
        const isStreamingResponse = handler.result instanceof Stream.Readable;
        if (isStreamingResponse) {
          handler.callback(null);
        } else {
          const cause = err ? err : new Error("Connection has been closed.");
          handler.callback(cause);
        }
      });
      this._ws.removeAllListeners();
      this._openPromise = null;
      this._closePromise = null;
      this.isOpen = false;
    }
    _clearHandler(requestId) {
      delete this._responseHandlers[requestId];
    }
    close() {
      if (this.isOpen === false) {
        return Promise.resolve();
      }
      if (!this._closePromise) {
        this._closePromise = new Promise((resolve) => {
          this._closeCallback = resolve;
          this._ws.close();
        });
      }
      return this._closePromise;
    }
  }
  module.exports = Connection;
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/driver/client.js
var require_client = __commonJS((exports, module) => {
  var utils = require_utils();
  var Connection = require_connection();
  var Bytecode = require_bytecode();

  class Client {
    constructor(url, options = {}) {
      this._options = options;
      if (this._options.processor === "session") {
        this._options.session = options.session || utils.getUuid();
      }
      if (this._options.session) {
        this._options.processor = options.processor || "session";
      }
      this._connection = new Connection(url, options);
    }
    open() {
      return this._connection.open();
    }
    get isOpen() {
      return this._connection.isOpen;
    }
    submit(message, bindings, requestOptions) {
      const requestIdOverride = requestOptions && requestOptions.requestId;
      if (requestIdOverride) {
        delete requestOptions["requestId"];
      }
      const args = Object.assign({
        gremlin: message,
        aliases: { g: this._options.traversalSource || "g" }
      }, requestOptions);
      if (this._options.session && this._options.processor === "session") {
        args["session"] = this._options.session;
      }
      if (message instanceof Bytecode) {
        if (this._options.session && this._options.processor === "session") {
          return this._connection.submit("session", "bytecode", args, requestIdOverride);
        }
        return this._connection.submit("traversal", "bytecode", args, requestIdOverride);
      } else if (typeof message === "string") {
        args["bindings"] = bindings;
        args["language"] = "gremlin-groovy";
        args["accept"] = this._connection.mimeType;
        return this._connection.submit(this._options.processor || "", "eval", args, requestIdOverride);
      }
      throw new TypeError("message must be of type Bytecode or string");
    }
    stream(message, bindings, requestOptions) {
      const requestIdOverride = requestOptions && requestOptions.requestId;
      if (requestIdOverride) {
        delete requestOptions["requestId"];
      }
      const args = Object.assign({
        gremlin: message,
        aliases: { g: this._options.traversalSource || "g" }
      }, requestOptions);
      if (this._options.session && this._options.processor === "session") {
        args["session"] = this._options.session;
      }
      if (message instanceof Bytecode) {
        if (this._options.session && this._options.processor === "session") {
          return this._connection.stream("session", "bytecode", args, requestIdOverride);
        }
        return this._connection.stream("traversal", "bytecode", args, requestIdOverride);
      } else if (typeof message === "string") {
        args["bindings"] = bindings;
        args["language"] = "gremlin-groovy";
        args["accept"] = this._connection.mimeType;
        return this._connection.stream(this._options.processor || "", "eval", args, requestIdOverride);
      }
      throw new TypeError("message must be of type Bytecode or string");
    }
    close() {
      if (this._options.session && this._options.processor === "session") {
        const args = { session: this._options.session };
        return this._connection.submit(this._options.processor, "close", args, null).then(() => this._connection.close());
      }
      return this._connection.close();
    }
    addListener(event, handler) {
      this._connection.on(event, handler);
    }
    removeListener(event, handler) {
      this._connection.removeListener(event, handler);
    }
  }
  module.exports = Client;
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/driver/driver-remote-connection.js
var require_driver_remote_connection = __commonJS((exports, module) => {
  var rcModule = require_remote_connection();
  var RemoteConnection = rcModule.RemoteConnection;
  var RemoteTraversal = rcModule.RemoteTraversal;
  var utils = require_utils();
  var Client = require_client();
  var Bytecode = require_bytecode();
  var OptionsStrategy = require_traversal_strategy().OptionsStrategy;

  class DriverRemoteConnection extends RemoteConnection {
    constructor(url, options = {}) {
      super(url, options);
      this._client = new Client(url, options);
    }
    open() {
      return this._client.open();
    }
    get isOpen() {
      return this._client.isOpen;
    }
    submit(bytecode) {
      const optionsStrategy = bytecode.sourceInstructions.find((i) => i[0] === "withStrategies" && i[1] instanceof OptionsStrategy);
      const allowedKeys = ["evaluationTimeout", "scriptEvaluationTimeout", "batchSize", "requestId", "userAgent"];
      let requestOptions = undefined;
      if (optionsStrategy !== undefined) {
        requestOptions = {};
        const conf = optionsStrategy[1].configuration;
        for (const key in conf) {
          if (conf.hasOwnProperty(key) && allowedKeys.indexOf(key) > -1) {
            requestOptions[key] = conf[key];
          }
        }
      }
      return this._client.submit(bytecode, null, requestOptions).then((result) => new RemoteTraversal(result.toArray()));
    }
    createSession() {
      if (this.isSessionBound) {
        throw new Error("Connection is already bound to a session - child sessions are not allowed");
      }
      const copiedOptions = Object.assign({}, this.options);
      copiedOptions.session = utils.getUuid();
      return new DriverRemoteConnection(this.url, copiedOptions);
    }
    get isSessionBound() {
      return this.options.session;
    }
    commit() {
      return this._client.submit(Bytecode.GraphOp.commit, null);
    }
    rollback() {
      return this._client.submit(Bytecode.GraphOp.rollback, null);
    }
    close() {
      return this._client.close();
    }
    addListener(...args) {
      return this._client.addListener(...args);
    }
    removeListener(...args) {
      return this._client.removeListener(...args);
    }
  }
  module.exports = DriverRemoteConnection;
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/driver/auth/authenticator.js
var require_authenticator = __commonJS((exports, module) => {
  class Authenticator {
    constructor(options) {
      this._options = options;
    }
    evaluateChallenge(challenge) {
      throw new Error("evaluateChallenge should be implemented");
    }
  }
  module.exports = Authenticator;
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/driver/auth/mechanisms/sasl-mechanism-base.js
var require_sasl_mechanism_base = __commonJS((exports, module) => {
  class SaslMechanismBase {
    constructor(options) {
      this.setopts(options);
    }
    get name() {
      return null;
    }
    setopts(options) {
      this._options = options;
    }
    evaluateChallenge(challenge) {
      throw new Error("evaluateChallenge should be implemented");
    }
  }
  module.exports = SaslMechanismBase;
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/driver/auth/mechanisms/sasl-mechanism-plain.js
var require_sasl_mechanism_plain = __commonJS((exports, module) => {
  var SaslMechanismBase = require_sasl_mechanism_base();

  class SaslMechanismPlain extends SaslMechanismBase {
    constructor(options) {
      super(options);
      if (this._options.username === undefined || this._options.username === null || this._options.username.length === 0 || this._options.password === undefined || this._options.password === null || this._options.password.length === 0) {
        throw new Error("Missing credentials for SASL PLAIN mechanism");
      }
    }
    get name() {
      return "PLAIN";
    }
    evaluateChallenge(challenge) {
      if (this._hasInitialResponse(challenge)) {
        return Promise.resolve({
          saslMechanism: this.name,
          sasl: this._saslArgument(this._options.authzid, this._options.username, this._options.password)
        });
      }
      return Promise.resolve({
        sasl: this._saslArgument(this._options.authzid, this._options.username, this._options.password)
      });
    }
    _saslArgument(authzid, username, password) {
      if (authzid === undefined || authzid === null) {
        authzid = "";
      }
      if (username === undefined || username === null) {
        username = "";
      }
      if (password === undefined || password.length === null) {
        password = "";
      }
      return Buffer.from(`${authzid}\0${username}\0${password}`).toString("base64");
    }
    _hasInitialResponse(challenge) {
      if (challenge === undefined || challenge === null) {
        return false;
      }
      return true;
    }
  }
  module.exports = SaslMechanismPlain;
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/driver/auth/plain-text-sasl-authenticator.js
var require_plain_text_sasl_authenticator = __commonJS((exports, module) => {
  var Authenticator = require_authenticator();
  var SaslMechanismPlain = require_sasl_mechanism_plain();

  class PlainTextSaslAuthenticator extends Authenticator {
    constructor(username, password, authzid) {
      const options = {
        mechanism: new SaslMechanismPlain({
          username,
          password,
          authzid
        })
      };
      super(options);
    }
    evaluateChallenge(challenge) {
      return this._options.mechanism.evaluateChallenge(challenge);
    }
  }
  module.exports = PlainTextSaslAuthenticator;
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/lib/process/anonymous-traversal.js
var require_anonymous_traversal = __commonJS((exports, module) => {
  var graphTraversalModule = require_graph_traversal();
  var TraversalStrategies = require_traversal_strategy().TraversalStrategies;
  var GraphTraversalSource = graphTraversalModule.GraphTraversalSource;
  var Graph = require_graph().Graph;

  class AnonymousTraversalSource {
    constructor(traversalSourceClass) {
      this.traversalSourceClass = traversalSourceClass;
    }
    static traversal(traversalSourceClass) {
      return new AnonymousTraversalSource(traversalSourceClass || GraphTraversalSource);
    }
    withRemote(remoteConnection) {
      return this.withGraph(new Graph).withRemote(remoteConnection);
    }
    withGraph(graph) {
      return new this.traversalSourceClass(graph, new TraversalStrategies);
    }
  }
  module.exports = AnonymousTraversalSource;
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/gremlin/index.js
var require_gremlin = __commonJS((exports, module) => {
  var t = require_traversal();
  var gt = require_graph_traversal();
  var strategiesModule = require_traversal_strategy();
  var graph = require_graph();
  var gs = require_graph_serializer();
  var rc = require_remote_connection();
  var Bytecode = require_bytecode();
  var Translator = require_translator();
  var utils = require_utils();
  var DriverRemoteConnection = require_driver_remote_connection();
  var ResponseError = require_response_error();
  var Client = require_client();
  var ResultSet = require_result_set();
  var Authenticator = require_authenticator();
  var PlainTextSaslAuthenticator = require_plain_text_sasl_authenticator();
  var AnonymousTraversalSource = require_anonymous_traversal();
  module.exports = {
    driver: {
      RemoteConnection: rc.RemoteConnection,
      RemoteStrategy: rc.RemoteStrategy,
      RemoteTraversal: rc.RemoteTraversal,
      ResponseError,
      DriverRemoteConnection,
      Client,
      ResultSet,
      auth: {
        Authenticator,
        PlainTextSaslAuthenticator
      }
    },
    process: {
      Bytecode,
      EnumValue: t.EnumValue,
      P: t.P,
      TextP: t.TextP,
      Traversal: t.Traversal,
      TraversalSideEffects: t.TraversalSideEffects,
      TraversalStrategies: strategiesModule.TraversalStrategies,
      TraversalStrategy: strategiesModule.TraversalStrategy,
      Traverser: t.Traverser,
      barrier: t.barrier,
      cardinality: t.cardinality,
      column: t.column,
      direction: t.direction,
      merge: t.merge,
      operator: t.operator,
      order: t.order,
      pick: t.pick,
      pop: t.pop,
      scope: t.scope,
      t: t.t,
      GraphTraversal: gt.GraphTraversal,
      GraphTraversalSource: gt.GraphTraversalSource,
      statics: gt.statics,
      Translator,
      traversal: AnonymousTraversalSource.traversal,
      AnonymousTraversalSource,
      withOptions: t.withOptions
    },
    structure: {
      io: gs,
      Edge: graph.Edge,
      Graph: graph.Graph,
      Path: graph.Path,
      Property: graph.Property,
      Vertex: graph.Vertex,
      VertexProperty: graph.VertexProperty,
      toLong: utils.toLong
    }
  };
});

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/@msgpack/msgpack/dist.es5+esm/utils/utf8.mjs
function utf8Count(str) {
  var strLength = str.length;
  var byteLength = 0;
  var pos = 0;
  while (pos < strLength) {
    var value = str.charCodeAt(pos++);
    if ((value & 4294967168) === 0) {
      byteLength++;
      continue;
    } else if ((value & 4294965248) === 0) {
      byteLength += 2;
    } else {
      if (value >= 55296 && value <= 56319) {
        if (pos < strLength) {
          var extra = str.charCodeAt(pos);
          if ((extra & 64512) === 56320) {
            ++pos;
            value = ((value & 1023) << 10) + (extra & 1023) + 65536;
          }
        }
      }
      if ((value & 4294901760) === 0) {
        byteLength += 3;
      } else {
        byteLength += 4;
      }
    }
  }
  return byteLength;
}
function utf8EncodeJs(str, output, outputOffset) {
  var strLength = str.length;
  var offset = outputOffset;
  var pos = 0;
  while (pos < strLength) {
    var value = str.charCodeAt(pos++);
    if ((value & 4294967168) === 0) {
      output[offset++] = value;
      continue;
    } else if ((value & 4294965248) === 0) {
      output[offset++] = value >> 6 & 31 | 192;
    } else {
      if (value >= 55296 && value <= 56319) {
        if (pos < strLength) {
          var extra = str.charCodeAt(pos);
          if ((extra & 64512) === 56320) {
            ++pos;
            value = ((value & 1023) << 10) + (extra & 1023) + 65536;
          }
        }
      }
      if ((value & 4294901760) === 0) {
        output[offset++] = value >> 12 & 15 | 224;
        output[offset++] = value >> 6 & 63 | 128;
      } else {
        output[offset++] = value >> 18 & 7 | 240;
        output[offset++] = value >> 12 & 63 | 128;
        output[offset++] = value >> 6 & 63 | 128;
      }
    }
    output[offset++] = value & 63 | 128;
  }
}
function utf8EncodeTE(str, output, outputOffset) {
  sharedTextEncoder.encodeInto(str, output.subarray(outputOffset));
}
function utf8Encode(str, output, outputOffset) {
  if (str.length > TEXT_ENCODER_THRESHOLD) {
    utf8EncodeTE(str, output, outputOffset);
  } else {
    utf8EncodeJs(str, output, outputOffset);
  }
}
function utf8DecodeJs(bytes, inputOffset, byteLength) {
  var offset = inputOffset;
  var end = offset + byteLength;
  var units = [];
  var result = "";
  while (offset < end) {
    var byte1 = bytes[offset++];
    if ((byte1 & 128) === 0) {
      units.push(byte1);
    } else if ((byte1 & 224) === 192) {
      var byte2 = bytes[offset++] & 63;
      units.push((byte1 & 31) << 6 | byte2);
    } else if ((byte1 & 240) === 224) {
      var byte2 = bytes[offset++] & 63;
      var byte3 = bytes[offset++] & 63;
      units.push((byte1 & 31) << 12 | byte2 << 6 | byte3);
    } else if ((byte1 & 248) === 240) {
      var byte2 = bytes[offset++] & 63;
      var byte3 = bytes[offset++] & 63;
      var byte4 = bytes[offset++] & 63;
      var unit = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
      if (unit > 65535) {
        unit -= 65536;
        units.push(unit >>> 10 & 1023 | 55296);
        unit = 56320 | unit & 1023;
      }
      units.push(unit);
    } else {
      units.push(byte1);
    }
    if (units.length >= CHUNK_SIZE) {
      result += String.fromCharCode.apply(String, units);
      units.length = 0;
    }
  }
  if (units.length > 0) {
    result += String.fromCharCode.apply(String, units);
  }
  return result;
}
function utf8DecodeTD(bytes, inputOffset, byteLength) {
  var stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
  return sharedTextDecoder.decode(stringBytes);
}
function utf8Decode(bytes, inputOffset, byteLength) {
  if (byteLength > TEXT_DECODER_THRESHOLD) {
    return utf8DecodeTD(bytes, inputOffset, byteLength);
  } else {
    return utf8DecodeJs(bytes, inputOffset, byteLength);
  }
}
var sharedTextEncoder = new TextEncoder;
var TEXT_ENCODER_THRESHOLD = 50;
var CHUNK_SIZE = 4096;
var sharedTextDecoder = new TextDecoder;
var TEXT_DECODER_THRESHOLD = 200;

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/@msgpack/msgpack/dist.es5+esm/ExtData.mjs
var ExtData = function() {
  function ExtData2(type, data) {
    this.type = type;
    this.data = data;
  }
  return ExtData2;
}();

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/@msgpack/msgpack/dist.es5+esm/DecodeError.mjs
var __extends = function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __);
  };
}();
var DecodeError = function(_super) {
  __extends(DecodeError2, _super);
  function DecodeError2(message) {
    var _this = _super.call(this, message) || this;
    var proto = Object.create(DecodeError2.prototype);
    Object.setPrototypeOf(_this, proto);
    Object.defineProperty(_this, "name", {
      configurable: true,
      enumerable: false,
      value: DecodeError2.name
    });
    return _this;
  }
  return DecodeError2;
}(Error);

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/@msgpack/msgpack/dist.es5+esm/utils/int.mjs
function setUint64(view, offset, value) {
  var high = value / 4294967296;
  var low = value;
  view.setUint32(offset, high);
  view.setUint32(offset + 4, low);
}
function setInt64(view, offset, value) {
  var high = Math.floor(value / 4294967296);
  var low = value;
  view.setUint32(offset, high);
  view.setUint32(offset + 4, low);
}
function getInt64(view, offset) {
  var high = view.getInt32(offset);
  var low = view.getUint32(offset + 4);
  return high * 4294967296 + low;
}
function getUint64(view, offset) {
  var high = view.getUint32(offset);
  var low = view.getUint32(offset + 4);
  return high * 4294967296 + low;
}
var UINT32_MAX = 4294967295;

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/@msgpack/msgpack/dist.es5+esm/timestamp.mjs
function encodeTimeSpecToTimestamp(_a) {
  var { sec, nsec } = _a;
  if (sec >= 0 && nsec >= 0 && sec <= TIMESTAMP64_MAX_SEC) {
    if (nsec === 0 && sec <= TIMESTAMP32_MAX_SEC) {
      var rv = new Uint8Array(4);
      var view = new DataView(rv.buffer);
      view.setUint32(0, sec);
      return rv;
    } else {
      var secHigh = sec / 4294967296;
      var secLow = sec & 4294967295;
      var rv = new Uint8Array(8);
      var view = new DataView(rv.buffer);
      view.setUint32(0, nsec << 2 | secHigh & 3);
      view.setUint32(4, secLow);
      return rv;
    }
  } else {
    var rv = new Uint8Array(12);
    var view = new DataView(rv.buffer);
    view.setUint32(0, nsec);
    setInt64(view, 4, sec);
    return rv;
  }
}
function encodeDateToTimeSpec(date) {
  var msec = date.getTime();
  var sec = Math.floor(msec / 1000);
  var nsec = (msec - sec * 1000) * 1e6;
  var nsecInSec = Math.floor(nsec / 1e9);
  return {
    sec: sec + nsecInSec,
    nsec: nsec - nsecInSec * 1e9
  };
}
function encodeTimestampExtension(object) {
  if (object instanceof Date) {
    var timeSpec = encodeDateToTimeSpec(object);
    return encodeTimeSpecToTimestamp(timeSpec);
  } else {
    return null;
  }
}
function decodeTimestampToTimeSpec(data) {
  var view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  switch (data.byteLength) {
    case 4: {
      var sec = view.getUint32(0);
      var nsec = 0;
      return { sec, nsec };
    }
    case 8: {
      var nsec30AndSecHigh2 = view.getUint32(0);
      var secLow32 = view.getUint32(4);
      var sec = (nsec30AndSecHigh2 & 3) * 4294967296 + secLow32;
      var nsec = nsec30AndSecHigh2 >>> 2;
      return { sec, nsec };
    }
    case 12: {
      var sec = getInt64(view, 4);
      var nsec = view.getUint32(0);
      return { sec, nsec };
    }
    default:
      throw new DecodeError("Unrecognized data size for timestamp (expected 4, 8, or 12): ".concat(data.length));
  }
}
function decodeTimestampExtension(data) {
  var timeSpec = decodeTimestampToTimeSpec(data);
  return new Date(timeSpec.sec * 1000 + timeSpec.nsec / 1e6);
}
var EXT_TIMESTAMP = -1;
var TIMESTAMP32_MAX_SEC = 4294967296 - 1;
var TIMESTAMP64_MAX_SEC = 17179869184 - 1;
var timestampExtension = {
  type: EXT_TIMESTAMP,
  encode: encodeTimestampExtension,
  decode: decodeTimestampExtension
};

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/@msgpack/msgpack/dist.es5+esm/ExtensionCodec.mjs
var ExtensionCodec = function() {
  function ExtensionCodec2() {
    this.builtInEncoders = [];
    this.builtInDecoders = [];
    this.encoders = [];
    this.decoders = [];
    this.register(timestampExtension);
  }
  ExtensionCodec2.prototype.register = function(_a) {
    var { type, encode, decode } = _a;
    if (type >= 0) {
      this.encoders[type] = encode;
      this.decoders[type] = decode;
    } else {
      var index = 1 + type;
      this.builtInEncoders[index] = encode;
      this.builtInDecoders[index] = decode;
    }
  };
  ExtensionCodec2.prototype.tryToEncode = function(object, context) {
    for (var i = 0;i < this.builtInEncoders.length; i++) {
      var encodeExt = this.builtInEncoders[i];
      if (encodeExt != null) {
        var data = encodeExt(object, context);
        if (data != null) {
          var type = -1 - i;
          return new ExtData(type, data);
        }
      }
    }
    for (var i = 0;i < this.encoders.length; i++) {
      var encodeExt = this.encoders[i];
      if (encodeExt != null) {
        var data = encodeExt(object, context);
        if (data != null) {
          var type = i;
          return new ExtData(type, data);
        }
      }
    }
    if (object instanceof ExtData) {
      return object;
    }
    return null;
  };
  ExtensionCodec2.prototype.decode = function(data, type, context) {
    var decodeExt = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
    if (decodeExt) {
      return decodeExt(data, type, context);
    } else {
      return new ExtData(type, data);
    }
  };
  ExtensionCodec2.defaultCodec = new ExtensionCodec2;
  return ExtensionCodec2;
}();

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/@msgpack/msgpack/dist.es5+esm/utils/typedArrays.mjs
function ensureUint8Array(buffer) {
  if (buffer instanceof Uint8Array) {
    return buffer;
  } else if (ArrayBuffer.isView(buffer)) {
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  } else if (buffer instanceof ArrayBuffer) {
    return new Uint8Array(buffer);
  } else {
    return Uint8Array.from(buffer);
  }
}
function createDataView(buffer) {
  if (buffer instanceof ArrayBuffer) {
    return new DataView(buffer);
  }
  var bufferView = ensureUint8Array(buffer);
  return new DataView(bufferView.buffer, bufferView.byteOffset, bufferView.byteLength);
}

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/@msgpack/msgpack/dist.es5+esm/Encoder.mjs
var DEFAULT_MAX_DEPTH = 100;
var DEFAULT_INITIAL_BUFFER_SIZE = 2048;
var Encoder = function() {
  function Encoder2(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    this.extensionCodec = (_a = options === null || options === undefined ? undefined : options.extensionCodec) !== null && _a !== undefined ? _a : ExtensionCodec.defaultCodec;
    this.context = options === null || options === undefined ? undefined : options.context;
    this.useBigInt64 = (_b = options === null || options === undefined ? undefined : options.useBigInt64) !== null && _b !== undefined ? _b : false;
    this.maxDepth = (_c = options === null || options === undefined ? undefined : options.maxDepth) !== null && _c !== undefined ? _c : DEFAULT_MAX_DEPTH;
    this.initialBufferSize = (_d = options === null || options === undefined ? undefined : options.initialBufferSize) !== null && _d !== undefined ? _d : DEFAULT_INITIAL_BUFFER_SIZE;
    this.sortKeys = (_e = options === null || options === undefined ? undefined : options.sortKeys) !== null && _e !== undefined ? _e : false;
    this.forceFloat32 = (_f = options === null || options === undefined ? undefined : options.forceFloat32) !== null && _f !== undefined ? _f : false;
    this.ignoreUndefined = (_g = options === null || options === undefined ? undefined : options.ignoreUndefined) !== null && _g !== undefined ? _g : false;
    this.forceIntegerToFloat = (_h = options === null || options === undefined ? undefined : options.forceIntegerToFloat) !== null && _h !== undefined ? _h : false;
    this.pos = 0;
    this.view = new DataView(new ArrayBuffer(this.initialBufferSize));
    this.bytes = new Uint8Array(this.view.buffer);
  }
  Encoder2.prototype.reinitializeState = function() {
    this.pos = 0;
  };
  Encoder2.prototype.encodeSharedRef = function(object) {
    this.reinitializeState();
    this.doEncode(object, 1);
    return this.bytes.subarray(0, this.pos);
  };
  Encoder2.prototype.encode = function(object) {
    this.reinitializeState();
    this.doEncode(object, 1);
    return this.bytes.slice(0, this.pos);
  };
  Encoder2.prototype.doEncode = function(object, depth) {
    if (depth > this.maxDepth) {
      throw new Error("Too deep objects in depth ".concat(depth));
    }
    if (object == null) {
      this.encodeNil();
    } else if (typeof object === "boolean") {
      this.encodeBoolean(object);
    } else if (typeof object === "number") {
      if (!this.forceIntegerToFloat) {
        this.encodeNumber(object);
      } else {
        this.encodeNumberAsFloat(object);
      }
    } else if (typeof object === "string") {
      this.encodeString(object);
    } else if (this.useBigInt64 && typeof object === "bigint") {
      this.encodeBigInt64(object);
    } else {
      this.encodeObject(object, depth);
    }
  };
  Encoder2.prototype.ensureBufferSizeToWrite = function(sizeToWrite) {
    var requiredSize = this.pos + sizeToWrite;
    if (this.view.byteLength < requiredSize) {
      this.resizeBuffer(requiredSize * 2);
    }
  };
  Encoder2.prototype.resizeBuffer = function(newSize) {
    var newBuffer = new ArrayBuffer(newSize);
    var newBytes = new Uint8Array(newBuffer);
    var newView = new DataView(newBuffer);
    newBytes.set(this.bytes);
    this.view = newView;
    this.bytes = newBytes;
  };
  Encoder2.prototype.encodeNil = function() {
    this.writeU8(192);
  };
  Encoder2.prototype.encodeBoolean = function(object) {
    if (object === false) {
      this.writeU8(194);
    } else {
      this.writeU8(195);
    }
  };
  Encoder2.prototype.encodeNumber = function(object) {
    if (!this.forceIntegerToFloat && Number.isSafeInteger(object)) {
      if (object >= 0) {
        if (object < 128) {
          this.writeU8(object);
        } else if (object < 256) {
          this.writeU8(204);
          this.writeU8(object);
        } else if (object < 65536) {
          this.writeU8(205);
          this.writeU16(object);
        } else if (object < 4294967296) {
          this.writeU8(206);
          this.writeU32(object);
        } else if (!this.useBigInt64) {
          this.writeU8(207);
          this.writeU64(object);
        } else {
          this.encodeNumberAsFloat(object);
        }
      } else {
        if (object >= -32) {
          this.writeU8(224 | object + 32);
        } else if (object >= -128) {
          this.writeU8(208);
          this.writeI8(object);
        } else if (object >= -32768) {
          this.writeU8(209);
          this.writeI16(object);
        } else if (object >= -2147483648) {
          this.writeU8(210);
          this.writeI32(object);
        } else if (!this.useBigInt64) {
          this.writeU8(211);
          this.writeI64(object);
        } else {
          this.encodeNumberAsFloat(object);
        }
      }
    } else {
      this.encodeNumberAsFloat(object);
    }
  };
  Encoder2.prototype.encodeNumberAsFloat = function(object) {
    if (this.forceFloat32) {
      this.writeU8(202);
      this.writeF32(object);
    } else {
      this.writeU8(203);
      this.writeF64(object);
    }
  };
  Encoder2.prototype.encodeBigInt64 = function(object) {
    if (object >= BigInt(0)) {
      this.writeU8(207);
      this.writeBigUint64(object);
    } else {
      this.writeU8(211);
      this.writeBigInt64(object);
    }
  };
  Encoder2.prototype.writeStringHeader = function(byteLength) {
    if (byteLength < 32) {
      this.writeU8(160 + byteLength);
    } else if (byteLength < 256) {
      this.writeU8(217);
      this.writeU8(byteLength);
    } else if (byteLength < 65536) {
      this.writeU8(218);
      this.writeU16(byteLength);
    } else if (byteLength < 4294967296) {
      this.writeU8(219);
      this.writeU32(byteLength);
    } else {
      throw new Error("Too long string: ".concat(byteLength, " bytes in UTF-8"));
    }
  };
  Encoder2.prototype.encodeString = function(object) {
    var maxHeaderSize = 1 + 4;
    var byteLength = utf8Count(object);
    this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
    this.writeStringHeader(byteLength);
    utf8Encode(object, this.bytes, this.pos);
    this.pos += byteLength;
  };
  Encoder2.prototype.encodeObject = function(object, depth) {
    var ext = this.extensionCodec.tryToEncode(object, this.context);
    if (ext != null) {
      this.encodeExtension(ext);
    } else if (Array.isArray(object)) {
      this.encodeArray(object, depth);
    } else if (ArrayBuffer.isView(object)) {
      this.encodeBinary(object);
    } else if (typeof object === "object") {
      this.encodeMap(object, depth);
    } else {
      throw new Error("Unrecognized object: ".concat(Object.prototype.toString.apply(object)));
    }
  };
  Encoder2.prototype.encodeBinary = function(object) {
    var size = object.byteLength;
    if (size < 256) {
      this.writeU8(196);
      this.writeU8(size);
    } else if (size < 65536) {
      this.writeU8(197);
      this.writeU16(size);
    } else if (size < 4294967296) {
      this.writeU8(198);
      this.writeU32(size);
    } else {
      throw new Error("Too large binary: ".concat(size));
    }
    var bytes = ensureUint8Array(object);
    this.writeU8a(bytes);
  };
  Encoder2.prototype.encodeArray = function(object, depth) {
    var size = object.length;
    if (size < 16) {
      this.writeU8(144 + size);
    } else if (size < 65536) {
      this.writeU8(220);
      this.writeU16(size);
    } else if (size < 4294967296) {
      this.writeU8(221);
      this.writeU32(size);
    } else {
      throw new Error("Too large array: ".concat(size));
    }
    for (var _i = 0, object_1 = object;_i < object_1.length; _i++) {
      var item = object_1[_i];
      this.doEncode(item, depth + 1);
    }
  };
  Encoder2.prototype.countWithoutUndefined = function(object, keys) {
    var count = 0;
    for (var _i = 0, keys_1 = keys;_i < keys_1.length; _i++) {
      var key = keys_1[_i];
      if (object[key] !== undefined) {
        count++;
      }
    }
    return count;
  };
  Encoder2.prototype.encodeMap = function(object, depth) {
    var keys = Object.keys(object);
    if (this.sortKeys) {
      keys.sort();
    }
    var size = this.ignoreUndefined ? this.countWithoutUndefined(object, keys) : keys.length;
    if (size < 16) {
      this.writeU8(128 + size);
    } else if (size < 65536) {
      this.writeU8(222);
      this.writeU16(size);
    } else if (size < 4294967296) {
      this.writeU8(223);
      this.writeU32(size);
    } else {
      throw new Error("Too large map object: ".concat(size));
    }
    for (var _i = 0, keys_2 = keys;_i < keys_2.length; _i++) {
      var key = keys_2[_i];
      var value = object[key];
      if (!(this.ignoreUndefined && value === undefined)) {
        this.encodeString(key);
        this.doEncode(value, depth + 1);
      }
    }
  };
  Encoder2.prototype.encodeExtension = function(ext) {
    var size = ext.data.length;
    if (size === 1) {
      this.writeU8(212);
    } else if (size === 2) {
      this.writeU8(213);
    } else if (size === 4) {
      this.writeU8(214);
    } else if (size === 8) {
      this.writeU8(215);
    } else if (size === 16) {
      this.writeU8(216);
    } else if (size < 256) {
      this.writeU8(199);
      this.writeU8(size);
    } else if (size < 65536) {
      this.writeU8(200);
      this.writeU16(size);
    } else if (size < 4294967296) {
      this.writeU8(201);
      this.writeU32(size);
    } else {
      throw new Error("Too large extension object: ".concat(size));
    }
    this.writeI8(ext.type);
    this.writeU8a(ext.data);
  };
  Encoder2.prototype.writeU8 = function(value) {
    this.ensureBufferSizeToWrite(1);
    this.view.setUint8(this.pos, value);
    this.pos++;
  };
  Encoder2.prototype.writeU8a = function(values) {
    var size = values.length;
    this.ensureBufferSizeToWrite(size);
    this.bytes.set(values, this.pos);
    this.pos += size;
  };
  Encoder2.prototype.writeI8 = function(value) {
    this.ensureBufferSizeToWrite(1);
    this.view.setInt8(this.pos, value);
    this.pos++;
  };
  Encoder2.prototype.writeU16 = function(value) {
    this.ensureBufferSizeToWrite(2);
    this.view.setUint16(this.pos, value);
    this.pos += 2;
  };
  Encoder2.prototype.writeI16 = function(value) {
    this.ensureBufferSizeToWrite(2);
    this.view.setInt16(this.pos, value);
    this.pos += 2;
  };
  Encoder2.prototype.writeU32 = function(value) {
    this.ensureBufferSizeToWrite(4);
    this.view.setUint32(this.pos, value);
    this.pos += 4;
  };
  Encoder2.prototype.writeI32 = function(value) {
    this.ensureBufferSizeToWrite(4);
    this.view.setInt32(this.pos, value);
    this.pos += 4;
  };
  Encoder2.prototype.writeF32 = function(value) {
    this.ensureBufferSizeToWrite(4);
    this.view.setFloat32(this.pos, value);
    this.pos += 4;
  };
  Encoder2.prototype.writeF64 = function(value) {
    this.ensureBufferSizeToWrite(8);
    this.view.setFloat64(this.pos, value);
    this.pos += 8;
  };
  Encoder2.prototype.writeU64 = function(value) {
    this.ensureBufferSizeToWrite(8);
    setUint64(this.view, this.pos, value);
    this.pos += 8;
  };
  Encoder2.prototype.writeI64 = function(value) {
    this.ensureBufferSizeToWrite(8);
    setInt64(this.view, this.pos, value);
    this.pos += 8;
  };
  Encoder2.prototype.writeBigUint64 = function(value) {
    this.ensureBufferSizeToWrite(8);
    this.view.setBigUint64(this.pos, value);
    this.pos += 8;
  };
  Encoder2.prototype.writeBigInt64 = function(value) {
    this.ensureBufferSizeToWrite(8);
    this.view.setBigInt64(this.pos, value);
    this.pos += 8;
  };
  return Encoder2;
}();

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/@msgpack/msgpack/dist.es5+esm/encode.mjs
function encode(value, options) {
  var encoder = new Encoder(options);
  return encoder.encodeSharedRef(value);
}

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/@msgpack/msgpack/dist.es5+esm/utils/prettyByte.mjs
function prettyByte(byte) {
  return "".concat(byte < 0 ? "-" : "", "0x").concat(Math.abs(byte).toString(16).padStart(2, "0"));
}

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/@msgpack/msgpack/dist.es5+esm/CachedKeyDecoder.mjs
var DEFAULT_MAX_KEY_LENGTH = 16;
var DEFAULT_MAX_LENGTH_PER_KEY = 16;
var CachedKeyDecoder = function() {
  function CachedKeyDecoder2(maxKeyLength, maxLengthPerKey) {
    if (maxKeyLength === undefined) {
      maxKeyLength = DEFAULT_MAX_KEY_LENGTH;
    }
    if (maxLengthPerKey === undefined) {
      maxLengthPerKey = DEFAULT_MAX_LENGTH_PER_KEY;
    }
    this.maxKeyLength = maxKeyLength;
    this.maxLengthPerKey = maxLengthPerKey;
    this.hit = 0;
    this.miss = 0;
    this.caches = [];
    for (var i = 0;i < this.maxKeyLength; i++) {
      this.caches.push([]);
    }
  }
  CachedKeyDecoder2.prototype.canBeCached = function(byteLength) {
    return byteLength > 0 && byteLength <= this.maxKeyLength;
  };
  CachedKeyDecoder2.prototype.find = function(bytes, inputOffset, byteLength) {
    var records = this.caches[byteLength - 1];
    FIND_CHUNK:
      for (var _i = 0, records_1 = records;_i < records_1.length; _i++) {
        var record = records_1[_i];
        var recordBytes = record.bytes;
        for (var j = 0;j < byteLength; j++) {
          if (recordBytes[j] !== bytes[inputOffset + j]) {
            continue FIND_CHUNK;
          }
        }
        return record.str;
      }
    return null;
  };
  CachedKeyDecoder2.prototype.store = function(bytes, value) {
    var records = this.caches[bytes.length - 1];
    var record = { bytes, str: value };
    if (records.length >= this.maxLengthPerKey) {
      records[Math.random() * records.length | 0] = record;
    } else {
      records.push(record);
    }
  };
  CachedKeyDecoder2.prototype.decode = function(bytes, inputOffset, byteLength) {
    var cachedValue = this.find(bytes, inputOffset, byteLength);
    if (cachedValue != null) {
      this.hit++;
      return cachedValue;
    }
    this.miss++;
    var str = utf8DecodeJs(bytes, inputOffset, byteLength);
    var slicedCopyOfBytes = Uint8Array.prototype.slice.call(bytes, inputOffset, inputOffset + byteLength);
    this.store(slicedCopyOfBytes, str);
    return str;
  };
  return CachedKeyDecoder2;
}();

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/@msgpack/msgpack/dist.es5+esm/Decoder.mjs
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = function(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1)
      throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f)
      throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _)
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
          return t;
        if (y = 0, t)
          op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2])
              _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return { value: op[0] ? op[1] : undefined, done: true };
  }
};
var __asyncValues = function(o) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d });
    }, reject);
  }
};
var __await = function(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
};
var __asyncGenerator = function(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n) {
    if (g[n])
      i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length)
      resume(q[0][0], q[0][1]);
  }
};
var STATE_ARRAY = "array";
var STATE_MAP_KEY = "map_key";
var STATE_MAP_VALUE = "map_value";
var isValidMapKeyType = function(key) {
  return typeof key === "string" || typeof key === "number";
};
var HEAD_BYTE_REQUIRED = -1;
var EMPTY_VIEW = new DataView(new ArrayBuffer(0));
var EMPTY_BYTES = new Uint8Array(EMPTY_VIEW.buffer);
try {
  EMPTY_VIEW.getInt8(0);
} catch (e) {
  if (!(e instanceof RangeError)) {
    throw new Error("This module is not supported in the current JavaScript engine because DataView does not throw RangeError on out-of-bounds access");
  }
}
var DataViewIndexOutOfBoundsError = RangeError;
var MORE_DATA = new DataViewIndexOutOfBoundsError("Insufficient data");
var sharedCachedKeyDecoder = new CachedKeyDecoder;
var Decoder = function() {
  function Decoder2(options) {
    var _a, _b, _c, _d, _e, _f, _g;
    this.totalPos = 0;
    this.pos = 0;
    this.view = EMPTY_VIEW;
    this.bytes = EMPTY_BYTES;
    this.headByte = HEAD_BYTE_REQUIRED;
    this.stack = [];
    this.extensionCodec = (_a = options === null || options === undefined ? undefined : options.extensionCodec) !== null && _a !== undefined ? _a : ExtensionCodec.defaultCodec;
    this.context = options === null || options === undefined ? undefined : options.context;
    this.useBigInt64 = (_b = options === null || options === undefined ? undefined : options.useBigInt64) !== null && _b !== undefined ? _b : false;
    this.maxStrLength = (_c = options === null || options === undefined ? undefined : options.maxStrLength) !== null && _c !== undefined ? _c : UINT32_MAX;
    this.maxBinLength = (_d = options === null || options === undefined ? undefined : options.maxBinLength) !== null && _d !== undefined ? _d : UINT32_MAX;
    this.maxArrayLength = (_e = options === null || options === undefined ? undefined : options.maxArrayLength) !== null && _e !== undefined ? _e : UINT32_MAX;
    this.maxMapLength = (_f = options === null || options === undefined ? undefined : options.maxMapLength) !== null && _f !== undefined ? _f : UINT32_MAX;
    this.maxExtLength = (_g = options === null || options === undefined ? undefined : options.maxExtLength) !== null && _g !== undefined ? _g : UINT32_MAX;
    this.keyDecoder = (options === null || options === undefined ? undefined : options.keyDecoder) !== undefined ? options.keyDecoder : sharedCachedKeyDecoder;
  }
  Decoder2.prototype.reinitializeState = function() {
    this.totalPos = 0;
    this.headByte = HEAD_BYTE_REQUIRED;
    this.stack.length = 0;
  };
  Decoder2.prototype.setBuffer = function(buffer) {
    this.bytes = ensureUint8Array(buffer);
    this.view = createDataView(this.bytes);
    this.pos = 0;
  };
  Decoder2.prototype.appendBuffer = function(buffer) {
    if (this.headByte === HEAD_BYTE_REQUIRED && !this.hasRemaining(1)) {
      this.setBuffer(buffer);
    } else {
      var remainingData = this.bytes.subarray(this.pos);
      var newData = ensureUint8Array(buffer);
      var newBuffer = new Uint8Array(remainingData.length + newData.length);
      newBuffer.set(remainingData);
      newBuffer.set(newData, remainingData.length);
      this.setBuffer(newBuffer);
    }
  };
  Decoder2.prototype.hasRemaining = function(size) {
    return this.view.byteLength - this.pos >= size;
  };
  Decoder2.prototype.createExtraByteError = function(posToShow) {
    var _a = this, view = _a.view, pos = _a.pos;
    return new RangeError("Extra ".concat(view.byteLength - pos, " of ").concat(view.byteLength, " byte(s) found at buffer[").concat(posToShow, "]"));
  };
  Decoder2.prototype.decode = function(buffer) {
    this.reinitializeState();
    this.setBuffer(buffer);
    var object = this.doDecodeSync();
    if (this.hasRemaining(1)) {
      throw this.createExtraByteError(this.pos);
    }
    return object;
  };
  Decoder2.prototype.decodeMulti = function(buffer) {
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          this.reinitializeState();
          this.setBuffer(buffer);
          _a.label = 1;
        case 1:
          if (!this.hasRemaining(1))
            return [3, 3];
          return [4, this.doDecodeSync()];
        case 2:
          _a.sent();
          return [3, 1];
        case 3:
          return [2];
      }
    });
  };
  Decoder2.prototype.decodeAsync = function(stream) {
    var _a, stream_1, stream_1_1;
    var _b, e_1, _c, _d;
    return __awaiter(this, undefined, undefined, function() {
      var decoded, object, buffer, e_1_1, _e, headByte, pos, totalPos;
      return __generator(this, function(_f) {
        switch (_f.label) {
          case 0:
            decoded = false;
            _f.label = 1;
          case 1:
            _f.trys.push([1, 6, 7, 12]);
            _a = true, stream_1 = __asyncValues(stream);
            _f.label = 2;
          case 2:
            return [4, stream_1.next()];
          case 3:
            if (!(stream_1_1 = _f.sent(), _b = stream_1_1.done, !_b))
              return [3, 5];
            _d = stream_1_1.value;
            _a = false;
            try {
              buffer = _d;
              if (decoded) {
                throw this.createExtraByteError(this.totalPos);
              }
              this.appendBuffer(buffer);
              try {
                object = this.doDecodeSync();
                decoded = true;
              } catch (e) {
                if (!(e instanceof DataViewIndexOutOfBoundsError)) {
                  throw e;
                }
              }
              this.totalPos += this.pos;
            } finally {
              _a = true;
            }
            _f.label = 4;
          case 4:
            return [3, 2];
          case 5:
            return [3, 12];
          case 6:
            e_1_1 = _f.sent();
            e_1 = { error: e_1_1 };
            return [3, 12];
          case 7:
            _f.trys.push([7, , 10, 11]);
            if (!(!_a && !_b && (_c = stream_1.return)))
              return [3, 9];
            return [4, _c.call(stream_1)];
          case 8:
            _f.sent();
            _f.label = 9;
          case 9:
            return [3, 11];
          case 10:
            if (e_1)
              throw e_1.error;
            return [7];
          case 11:
            return [7];
          case 12:
            if (decoded) {
              if (this.hasRemaining(1)) {
                throw this.createExtraByteError(this.totalPos);
              }
              return [2, object];
            }
            _e = this, headByte = _e.headByte, pos = _e.pos, totalPos = _e.totalPos;
            throw new RangeError("Insufficient data in parsing ".concat(prettyByte(headByte), " at ").concat(totalPos, " (").concat(pos, " in the current buffer)"));
        }
      });
    });
  };
  Decoder2.prototype.decodeArrayStream = function(stream) {
    return this.decodeMultiAsync(stream, true);
  };
  Decoder2.prototype.decodeStream = function(stream) {
    return this.decodeMultiAsync(stream, false);
  };
  Decoder2.prototype.decodeMultiAsync = function(stream, isArray) {
    return __asyncGenerator(this, arguments, function decodeMultiAsync_1() {
      var isArrayHeaderRequired, arrayItemsLeft, _a, stream_2, stream_2_1, buffer, e_2, e_3_1;
      var _b, e_3, _c, _d;
      return __generator(this, function(_e) {
        switch (_e.label) {
          case 0:
            isArrayHeaderRequired = isArray;
            arrayItemsLeft = -1;
            _e.label = 1;
          case 1:
            _e.trys.push([1, 15, 16, 21]);
            _a = true, stream_2 = __asyncValues(stream);
            _e.label = 2;
          case 2:
            return [4, __await(stream_2.next())];
          case 3:
            if (!(stream_2_1 = _e.sent(), _b = stream_2_1.done, !_b))
              return [3, 14];
            _d = stream_2_1.value;
            _a = false;
            _e.label = 4;
          case 4:
            _e.trys.push([4, , 12, 13]);
            buffer = _d;
            if (isArray && arrayItemsLeft === 0) {
              throw this.createExtraByteError(this.totalPos);
            }
            this.appendBuffer(buffer);
            if (isArrayHeaderRequired) {
              arrayItemsLeft = this.readArraySize();
              isArrayHeaderRequired = false;
              this.complete();
            }
            _e.label = 5;
          case 5:
            _e.trys.push([5, 10, , 11]);
            _e.label = 6;
          case 6:
            if (false)
              ;
            return [4, __await(this.doDecodeSync())];
          case 7:
            return [4, _e.sent()];
          case 8:
            _e.sent();
            if (--arrayItemsLeft === 0) {
              return [3, 9];
            }
            return [3, 6];
          case 9:
            return [3, 11];
          case 10:
            e_2 = _e.sent();
            if (!(e_2 instanceof DataViewIndexOutOfBoundsError)) {
              throw e_2;
            }
            return [3, 11];
          case 11:
            this.totalPos += this.pos;
            return [3, 13];
          case 12:
            _a = true;
            return [7];
          case 13:
            return [3, 2];
          case 14:
            return [3, 21];
          case 15:
            e_3_1 = _e.sent();
            e_3 = { error: e_3_1 };
            return [3, 21];
          case 16:
            _e.trys.push([16, , 19, 20]);
            if (!(!_a && !_b && (_c = stream_2.return)))
              return [3, 18];
            return [4, __await(_c.call(stream_2))];
          case 17:
            _e.sent();
            _e.label = 18;
          case 18:
            return [3, 20];
          case 19:
            if (e_3)
              throw e_3.error;
            return [7];
          case 20:
            return [7];
          case 21:
            return [2];
        }
      });
    });
  };
  Decoder2.prototype.doDecodeSync = function() {
    DECODE:
      while (true) {
        var headByte = this.readHeadByte();
        var object = undefined;
        if (headByte >= 224) {
          object = headByte - 256;
        } else if (headByte < 192) {
          if (headByte < 128) {
            object = headByte;
          } else if (headByte < 144) {
            var size = headByte - 128;
            if (size !== 0) {
              this.pushMapState(size);
              this.complete();
              continue DECODE;
            } else {
              object = {};
            }
          } else if (headByte < 160) {
            var size = headByte - 144;
            if (size !== 0) {
              this.pushArrayState(size);
              this.complete();
              continue DECODE;
            } else {
              object = [];
            }
          } else {
            var byteLength = headByte - 160;
            object = this.decodeUtf8String(byteLength, 0);
          }
        } else if (headByte === 192) {
          object = null;
        } else if (headByte === 194) {
          object = false;
        } else if (headByte === 195) {
          object = true;
        } else if (headByte === 202) {
          object = this.readF32();
        } else if (headByte === 203) {
          object = this.readF64();
        } else if (headByte === 204) {
          object = this.readU8();
        } else if (headByte === 205) {
          object = this.readU16();
        } else if (headByte === 206) {
          object = this.readU32();
        } else if (headByte === 207) {
          if (this.useBigInt64) {
            object = this.readU64AsBigInt();
          } else {
            object = this.readU64();
          }
        } else if (headByte === 208) {
          object = this.readI8();
        } else if (headByte === 209) {
          object = this.readI16();
        } else if (headByte === 210) {
          object = this.readI32();
        } else if (headByte === 211) {
          if (this.useBigInt64) {
            object = this.readI64AsBigInt();
          } else {
            object = this.readI64();
          }
        } else if (headByte === 217) {
          var byteLength = this.lookU8();
          object = this.decodeUtf8String(byteLength, 1);
        } else if (headByte === 218) {
          var byteLength = this.lookU16();
          object = this.decodeUtf8String(byteLength, 2);
        } else if (headByte === 219) {
          var byteLength = this.lookU32();
          object = this.decodeUtf8String(byteLength, 4);
        } else if (headByte === 220) {
          var size = this.readU16();
          if (size !== 0) {
            this.pushArrayState(size);
            this.complete();
            continue DECODE;
          } else {
            object = [];
          }
        } else if (headByte === 221) {
          var size = this.readU32();
          if (size !== 0) {
            this.pushArrayState(size);
            this.complete();
            continue DECODE;
          } else {
            object = [];
          }
        } else if (headByte === 222) {
          var size = this.readU16();
          if (size !== 0) {
            this.pushMapState(size);
            this.complete();
            continue DECODE;
          } else {
            object = {};
          }
        } else if (headByte === 223) {
          var size = this.readU32();
          if (size !== 0) {
            this.pushMapState(size);
            this.complete();
            continue DECODE;
          } else {
            object = {};
          }
        } else if (headByte === 196) {
          var size = this.lookU8();
          object = this.decodeBinary(size, 1);
        } else if (headByte === 197) {
          var size = this.lookU16();
          object = this.decodeBinary(size, 2);
        } else if (headByte === 198) {
          var size = this.lookU32();
          object = this.decodeBinary(size, 4);
        } else if (headByte === 212) {
          object = this.decodeExtension(1, 0);
        } else if (headByte === 213) {
          object = this.decodeExtension(2, 0);
        } else if (headByte === 214) {
          object = this.decodeExtension(4, 0);
        } else if (headByte === 215) {
          object = this.decodeExtension(8, 0);
        } else if (headByte === 216) {
          object = this.decodeExtension(16, 0);
        } else if (headByte === 199) {
          var size = this.lookU8();
          object = this.decodeExtension(size, 1);
        } else if (headByte === 200) {
          var size = this.lookU16();
          object = this.decodeExtension(size, 2);
        } else if (headByte === 201) {
          var size = this.lookU32();
          object = this.decodeExtension(size, 4);
        } else {
          throw new DecodeError("Unrecognized type byte: ".concat(prettyByte(headByte)));
        }
        this.complete();
        var stack = this.stack;
        while (stack.length > 0) {
          var state = stack[stack.length - 1];
          if (state.type === STATE_ARRAY) {
            state.array[state.position] = object;
            state.position++;
            if (state.position === state.size) {
              stack.pop();
              object = state.array;
            } else {
              continue DECODE;
            }
          } else if (state.type === STATE_MAP_KEY) {
            if (!isValidMapKeyType(object)) {
              throw new DecodeError("The type of key must be string or number but " + typeof object);
            }
            if (object === "__proto__") {
              throw new DecodeError("The key __proto__ is not allowed");
            }
            state.key = object;
            state.type = STATE_MAP_VALUE;
            continue DECODE;
          } else {
            state.map[state.key] = object;
            state.readCount++;
            if (state.readCount === state.size) {
              stack.pop();
              object = state.map;
            } else {
              state.key = null;
              state.type = STATE_MAP_KEY;
              continue DECODE;
            }
          }
        }
        return object;
      }
  };
  Decoder2.prototype.readHeadByte = function() {
    if (this.headByte === HEAD_BYTE_REQUIRED) {
      this.headByte = this.readU8();
    }
    return this.headByte;
  };
  Decoder2.prototype.complete = function() {
    this.headByte = HEAD_BYTE_REQUIRED;
  };
  Decoder2.prototype.readArraySize = function() {
    var headByte = this.readHeadByte();
    switch (headByte) {
      case 220:
        return this.readU16();
      case 221:
        return this.readU32();
      default: {
        if (headByte < 160) {
          return headByte - 144;
        } else {
          throw new DecodeError("Unrecognized array type byte: ".concat(prettyByte(headByte)));
        }
      }
    }
  };
  Decoder2.prototype.pushMapState = function(size) {
    if (size > this.maxMapLength) {
      throw new DecodeError("Max length exceeded: map length (".concat(size, ") > maxMapLengthLength (").concat(this.maxMapLength, ")"));
    }
    this.stack.push({
      type: STATE_MAP_KEY,
      size,
      key: null,
      readCount: 0,
      map: {}
    });
  };
  Decoder2.prototype.pushArrayState = function(size) {
    if (size > this.maxArrayLength) {
      throw new DecodeError("Max length exceeded: array length (".concat(size, ") > maxArrayLength (").concat(this.maxArrayLength, ")"));
    }
    this.stack.push({
      type: STATE_ARRAY,
      size,
      array: new Array(size),
      position: 0
    });
  };
  Decoder2.prototype.decodeUtf8String = function(byteLength, headerOffset) {
    var _a;
    if (byteLength > this.maxStrLength) {
      throw new DecodeError("Max length exceeded: UTF-8 byte length (".concat(byteLength, ") > maxStrLength (").concat(this.maxStrLength, ")"));
    }
    if (this.bytes.byteLength < this.pos + headerOffset + byteLength) {
      throw MORE_DATA;
    }
    var offset = this.pos + headerOffset;
    var object;
    if (this.stateIsMapKey() && ((_a = this.keyDecoder) === null || _a === undefined ? undefined : _a.canBeCached(byteLength))) {
      object = this.keyDecoder.decode(this.bytes, offset, byteLength);
    } else {
      object = utf8Decode(this.bytes, offset, byteLength);
    }
    this.pos += headerOffset + byteLength;
    return object;
  };
  Decoder2.prototype.stateIsMapKey = function() {
    if (this.stack.length > 0) {
      var state = this.stack[this.stack.length - 1];
      return state.type === STATE_MAP_KEY;
    }
    return false;
  };
  Decoder2.prototype.decodeBinary = function(byteLength, headOffset) {
    if (byteLength > this.maxBinLength) {
      throw new DecodeError("Max length exceeded: bin length (".concat(byteLength, ") > maxBinLength (").concat(this.maxBinLength, ")"));
    }
    if (!this.hasRemaining(byteLength + headOffset)) {
      throw MORE_DATA;
    }
    var offset = this.pos + headOffset;
    var object = this.bytes.subarray(offset, offset + byteLength);
    this.pos += headOffset + byteLength;
    return object;
  };
  Decoder2.prototype.decodeExtension = function(size, headOffset) {
    if (size > this.maxExtLength) {
      throw new DecodeError("Max length exceeded: ext length (".concat(size, ") > maxExtLength (").concat(this.maxExtLength, ")"));
    }
    var extType = this.view.getInt8(this.pos + headOffset);
    var data = this.decodeBinary(size, headOffset + 1);
    return this.extensionCodec.decode(data, extType, this.context);
  };
  Decoder2.prototype.lookU8 = function() {
    return this.view.getUint8(this.pos);
  };
  Decoder2.prototype.lookU16 = function() {
    return this.view.getUint16(this.pos);
  };
  Decoder2.prototype.lookU32 = function() {
    return this.view.getUint32(this.pos);
  };
  Decoder2.prototype.readU8 = function() {
    var value = this.view.getUint8(this.pos);
    this.pos++;
    return value;
  };
  Decoder2.prototype.readI8 = function() {
    var value = this.view.getInt8(this.pos);
    this.pos++;
    return value;
  };
  Decoder2.prototype.readU16 = function() {
    var value = this.view.getUint16(this.pos);
    this.pos += 2;
    return value;
  };
  Decoder2.prototype.readI16 = function() {
    var value = this.view.getInt16(this.pos);
    this.pos += 2;
    return value;
  };
  Decoder2.prototype.readU32 = function() {
    var value = this.view.getUint32(this.pos);
    this.pos += 4;
    return value;
  };
  Decoder2.prototype.readI32 = function() {
    var value = this.view.getInt32(this.pos);
    this.pos += 4;
    return value;
  };
  Decoder2.prototype.readU64 = function() {
    var value = getUint64(this.view, this.pos);
    this.pos += 8;
    return value;
  };
  Decoder2.prototype.readI64 = function() {
    var value = getInt64(this.view, this.pos);
    this.pos += 8;
    return value;
  };
  Decoder2.prototype.readU64AsBigInt = function() {
    var value = this.view.getBigUint64(this.pos);
    this.pos += 8;
    return value;
  };
  Decoder2.prototype.readI64AsBigInt = function() {
    var value = this.view.getBigInt64(this.pos);
    this.pos += 8;
    return value;
  };
  Decoder2.prototype.readF32 = function() {
    var value = this.view.getFloat32(this.pos);
    this.pos += 4;
    return value;
  };
  Decoder2.prototype.readF64 = function() {
    var value = this.view.getFloat64(this.pos);
    this.pos += 8;
    return value;
  };
  return Decoder2;
}();

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/@msgpack/msgpack/dist.es5+esm/decode.mjs
function decode(buffer, options) {
  var decoder = new Decoder(options);
  return decoder.decode(buffer);
}

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/@msgpack/msgpack/dist.es5+esm/utils/stream.mjs
function isAsyncIterable(object) {
  return object[Symbol.asyncIterator] != null;
}
var assertNonNull = function(value) {
  if (value == null) {
    throw new Error("Assertion Failure: value must not be null nor undefined");
  }
};
function asyncIterableFromStream(stream) {
  return __asyncGenerator2(this, arguments, function asyncIterableFromStream_1() {
    var reader, _a, done, value;
    return __generator2(this, function(_b) {
      switch (_b.label) {
        case 0:
          reader = stream.getReader();
          _b.label = 1;
        case 1:
          _b.trys.push([1, , 9, 10]);
          _b.label = 2;
        case 2:
          if (false)
            ;
          return [4, __await2(reader.read())];
        case 3:
          _a = _b.sent(), done = _a.done, value = _a.value;
          if (!done)
            return [3, 5];
          return [4, __await2(undefined)];
        case 4:
          return [2, _b.sent()];
        case 5:
          assertNonNull(value);
          return [4, __await2(value)];
        case 6:
          return [4, _b.sent()];
        case 7:
          _b.sent();
          return [3, 2];
        case 8:
          return [3, 10];
        case 9:
          reader.releaseLock();
          return [7];
        case 10:
          return [2];
      }
    });
  });
}
function ensureAsyncIterable(streamLike) {
  if (isAsyncIterable(streamLike)) {
    return streamLike;
  } else {
    return asyncIterableFromStream(streamLike);
  }
}
var __generator2 = function(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1)
      throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f)
      throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _)
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
          return t;
        if (y = 0, t)
          op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2])
              _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return { value: op[0] ? op[1] : undefined, done: true };
  }
};
var __await2 = function(v) {
  return this instanceof __await2 ? (this.v = v, this) : new __await2(v);
};
var __asyncGenerator2 = function(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n) {
    if (g[n])
      i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await2 ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length)
      resume(q[0][0], q[0][1]);
  }
};

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/@msgpack/msgpack/dist.es5+esm/decodeAsync.mjs
function decodeAsync(streamLike, options) {
  return __awaiter2(this, undefined, undefined, function() {
    var stream2, decoder;
    return __generator3(this, function(_a) {
      stream2 = ensureAsyncIterable(streamLike);
      decoder = new Decoder(options);
      return [2, decoder.decodeAsync(stream2)];
    });
  });
}
var __awaiter2 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator3 = function(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1)
      throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f)
      throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _)
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
          return t;
        if (y = 0, t)
          op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2])
              _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return { value: op[0] ? op[1] : undefined, done: true };
  }
};

// src/api/serialization.ts
function deepFreezeCopy(object) {
  const copy = Object.create(null);
  const propNames = Reflect.ownKeys(object).filter((k) => typeof k === "string");
  for (const name of propNames) {
    const value = object[name];
    copy[name] = value && value instanceof Object ? deepFreezeCopy(value) : value;
  }
  return Object.freeze(copy);
}
function mapToJsonIterator(map) {
  return Array.from(map).reduce((acc, [key, value]) => {
    acc[key] = value instanceof Map ? mapToJsonIterator(value) : value;
    return acc;
  }, Object.create(null));
}
function jsonReplacer(key, value) {
  if (value instanceof Map) {
    return Object.fromEntries(value.entries());
  } else {
    return value;
  }
}
var jsc = typeof Bun !== "undefined" && await import("bun:jsc");
var toJson = (data) => deepFreezeCopy(mapToJsonIterator(data));
var toJsonStringified = (data) => JSON.stringify(data, jsonReplacer);
var toBunBuffer = (data) => {
  if (!jsc)
    throw new Error(`toBunBuffer requires the bun runtime`);
  return jsc.serialize(data);
};
var fromBunBuffer = (data) => {
  if (!jsc)
    throw new Error(`fromBunBuffer requires the bun runtime`);
  return jsc.deserialize(data);
};
var encoder = { encode };
var decoder = { decode, decodeAsync };
var extensionCodec = new ExtensionCodec;
var MSGPACK_HEADERS = { "Content-Type": "application/x-msgpack" };
var SET_EXT_TYPE = 0;
extensionCodec.register({
  type: SET_EXT_TYPE,
  encode: (object) => {
    if (object instanceof Set) {
      return encoder.encode([...object], { extensionCodec });
    } else {
      return null;
    }
  },
  decode: (data) => {
    const array = decoder.decode(data, { extensionCodec });
    return new Set(array);
  },
  decodeAsync: async (data) => {
    const array = await decoder.decodeAsync(data, {
      extensionCodec
    });
    return new Set(array);
  }
});
var MAP_EXT_TYPE = 1;
extensionCodec.register({
  type: MAP_EXT_TYPE,
  encode: (object) => {
    if (object instanceof Map) {
      return encoder.encode([...object], { extensionCodec });
    } else {
      return null;
    }
  },
  decode: (data) => {
    const array = decoder.decode(data, { extensionCodec });
    return new Map(array);
  },
  decodeAsync: async (data) => {
    const array = await decoder.decodeAsync(data, {
      extensionCodec
    });
    return new Map(array);
  }
});
var msgpackToJsonIterator = (arr) => {
  return arr.reduce((acc, [key, value]) => {
    acc[key] = value?.type === MAP_EXT_TYPE && value?.data instanceof Uint8Array ? msgpackToJsonIterator(decoder.decode(value.data, { extensionCodec })) : value;
    return acc;
  }, Object.create(null));
};
var msgpackToJson = async (resp) => {
  if (resp.headers.get("Content-Type") !== MSGPACK_HEADERS["Content-Type"] || !resp.body)
    return null;
  return deepFreezeCopy(msgpackToJsonIterator(decoder.decode((await decoder.decodeAsync(resp.body, { extensionCodec })).data, { extensionCodec })));
};
// src/groovy/common.ts
var import_gremlin = __toESM(require_gremlin(), 1);
var __ = import_gremlin.default.process.statics;
var EDir;
(function(EDir2) {
  EDir2["out"] = "out";
  EDir2["in"] = "in";
})(EDir || (EDir = {}));
var go = (dir) => {
  const base = {
    both: __.both,
    bothE: __.bothE,
    bothV: __.bothV,
    otherV: __.otherV,
    inV: __.inV,
    outV: __.outV,
    inE: __.inE,
    in: __.in_,
    outE: __.outE,
    out: __.out
  };
  if (dir === EDir.in) {
    return {
      ...base,
      to: {
        e: __.inE,
        v: __.in_
      }
    };
  } else if (dir === EDir.out) {
    return {
      ...base,
      to: {
        e: __.outE,
        v: __.out
      }
    };
  } else
    throw new Error(`invalid direction, expect in|out`);
};
var common = {
  ...import_gremlin.default.process,
  gremlin: import_gremlin.default,
  p: import_gremlin.default.process.P,
  traversal: import_gremlin.default.process.AnonymousTraversalSource.traversal,
  DriverRemoteConnection: import_gremlin.default.driver.DriverRemoteConnection,
  __,
  textp: import_gremlin.default.process.TextP,
  Direction: {
    BOTH: import_gremlin.default.process.direction.both,
    from_: import_gremlin.default.process.direction.in,
    IN: import_gremlin.default.process.direction.in,
    OUT: import_gremlin.default.process.direction.out,
    to: import_gremlin.default.process.direction.out
  },
  go
};
[
  "P",
  "AnonymousTraversalSource",
  "statics",
  "driver",
  "TextP",
  "direction"
].forEach((prop) => delete common[prop]);
// src/groovy/dsl.ts
var import_gremlin2 = __toESM(require_gremlin(), 1);
var anonymous = function() {
  return new GroovyTraversal(null, null, new import_gremlin2.default.process.Bytecode);
};
var { GraphTraversal, GraphTraversalSource } = import_gremlin2.default.process;

class GroovyTraversal extends GraphTraversal {
  constructor(graph, traversalStrategies, bytecode) {
    super(graph, traversalStrategies, bytecode);
  }
  keys() {
    return this.valueMap().select(import_gremlin2.default.process.column.keys);
  }
  next() {
    return super.next();
  }
}
var keys = () => anonymous().keys();

class GroovyTraversalSource extends GraphTraversalSource {
  constructor(graph, traversalStrategies, bytecode) {
    super(graph, traversalStrategies, bytecode, GroovyTraversalSource, GroovyTraversal);
  }
}
// /home/poop/git/private/nirv/tinkerbuntune/node_modules/csv-generate/lib/index.js
import stream2 from "stream";
import util from "util";

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/csv-generate/lib/api/init_state.js
var init_state = (options) => {
  return {
    start_time: options.duration ? Date.now() : null,
    fixed_size_buffer: "",
    count_written: 0,
    count_created: 0
  };
};

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/csv-generate/lib/api/random.js
var random = function(options = {}) {
  if (options.seed) {
    return options.seed = options.seed * Math.PI * 100 % 100 / 100;
  } else {
    return Math.random();
  }
};

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/csv-generate/lib/api/types.js
var types = {
  ascii: function({ options }) {
    const column = [];
    const nb_chars = Math.ceil(random(options) * options.maxWordLength);
    for (let i = 0;i < nb_chars; i++) {
      const char = Math.floor(random(options) * 32);
      column.push(String.fromCharCode(char + (char < 16 ? 65 : 97 - 16)));
    }
    return column.join("");
  },
  int: function({ options }) {
    return Math.floor(random(options) * Math.pow(2, 52));
  },
  bool: function({ options }) {
    return Math.floor(random(options) * 2);
  }
};

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/csv-generate/lib/api/normalize_options.js
var camelize = function(str) {
  return str.replace(/_([a-z])/gi, function(_, match) {
    return match.toUpperCase();
  });
};
var normalize_options = (opts) => {
  if (opts.object_mode) {
    opts.objectMode = opts.object_mode;
  }
  if (opts.high_water_mark) {
    opts.highWaterMark = opts.high_water_mark;
  }
  const options = {};
  for (const k in opts) {
    options[camelize(k)] = opts[k];
  }
  const dft = {
    columns: 8,
    delimiter: ",",
    duration: null,
    encoding: null,
    end: null,
    eof: false,
    fixedSize: false,
    length: -1,
    maxWordLength: 16,
    rowDelimiter: "\n",
    seed: false,
    sleep: 0
  };
  for (const k in dft) {
    if (options[k] === undefined) {
      options[k] = dft[k];
    }
  }
  if (options.eof === true) {
    options.eof = options.rowDelimiter;
  }
  if (typeof options.columns === "number") {
    options.columns = new Array(options.columns);
  }
  const accepted_header_types = Object.keys(types).filter((t) => !["super_", "camelize"].includes(t));
  for (let i = 0;i < options.columns.length; i++) {
    const v = options.columns[i] || "ascii";
    if (typeof v === "string") {
      if (!accepted_header_types.includes(v)) {
        throw Error(`Invalid column type: got "${v}", default values are ${JSON.stringify(accepted_header_types)}`);
      }
      options.columns[i] = types[v];
    }
  }
  return options;
};

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/csv-generate/lib/api/read.js
var read = (options, state, size, push, close) => {
  const data = [];
  let recordsLength = 0;
  if (options.fixedSize) {
    recordsLength = state.fixed_size_buffer.length;
    if (recordsLength !== 0) {
      data.push(state.fixed_size_buffer);
    }
  }
  while (true) {
    if (state.count_created === options.length || options.end && Date.now() > options.end || options.duration && Date.now() > state.start_time + options.duration) {
      if (data.length) {
        if (options.objectMode) {
          for (const record2 of data) {
            push(record2);
          }
        } else {
          push(data.join("") + (options.eof ? options.eof : ""));
        }
        state.end = true;
      } else {
        close();
      }
      return;
    }
    let record = [];
    let recordLength;
    for (const fn of options.columns) {
      const result = fn({ options, state });
      const type = typeof result;
      if (result !== null && type !== "string" && type !== "number") {
        close(Error([
          "INVALID_VALUE:",
          "values returned by column function must be",
          "a string, a number or null,",
          `got ${JSON.stringify(result)}`
        ].join(" ")));
        return;
      }
      record.push(result);
    }
    if (options.objectMode) {
      recordLength = 0;
      for (const column of record) {
        recordLength += column.length;
      }
    } else {
      record = (state.count_created === 0 ? "" : options.rowDelimiter) + record.join(options.delimiter);
      recordLength = record.length;
    }
    state.count_created++;
    if (recordsLength + recordLength > size) {
      if (options.objectMode) {
        data.push(record);
        for (const record2 of data) {
          push(record2);
        }
      } else {
        if (options.fixedSize) {
          state.fixed_size_buffer = record.substr(size - recordsLength);
          data.push(record.substr(0, size - recordsLength));
        } else {
          data.push(record);
        }
        push(data.join(""));
      }
      return;
    }
    recordsLength += recordLength;
    data.push(record);
  }
};

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/csv-generate/lib/index.js
var Generator = function(options = {}) {
  this.options = normalize_options(options);
  stream2.Readable.call(this, this.options);
  this.state = init_state(this.options);
  return this;
};
util.inherits(Generator, stream2.Readable);
Generator.prototype.end = function() {
  this.push(null);
};
Generator.prototype._read = function(size) {
  setImmediate(() => {
    this.__read(size);
  });
};
Generator.prototype.__read = function(size) {
  read(this.options, this.state, size, (chunk) => {
    this.__push(chunk);
  }, (err) => {
    if (err) {
      this.destroy(err);
    } else {
      this.push(null);
    }
  });
};
Generator.prototype.__push = function(record) {
  const push = () => {
    this.state.count_written++;
    this.push(record);
    if (this.state.end === true) {
      return this.push(null);
    }
  };
  this.options.sleep > 0 ? setTimeout(push, this.options.sleep) : push();
};

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/csv-parse/lib/api/CsvError.js
class CsvError extends Error {
  constructor(code, message, options, ...contexts) {
    if (Array.isArray(message))
      message = message.join(" ").trim();
    super(message);
    if (Error.captureStackTrace !== undefined) {
      Error.captureStackTrace(this, CsvError);
    }
    this.code = code;
    for (const context of contexts) {
      for (const key in context) {
        const value = context[key];
        this[key] = Buffer.isBuffer(value) ? value.toString(options.encoding) : value == null ? value : JSON.parse(JSON.stringify(value));
      }
    }
  }
}

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/csv-parse/lib/utils/is_object.js
var is_object = function(obj) {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
};

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/csv-parse/lib/api/normalize_columns_array.js
var normalize_columns_array = function(columns) {
  const normalizedColumns = [];
  for (let i = 0, l = columns.length;i < l; i++) {
    const column = columns[i];
    if (column === undefined || column === null || column === false) {
      normalizedColumns[i] = { disabled: true };
    } else if (typeof column === "string") {
      normalizedColumns[i] = { name: column };
    } else if (is_object(column)) {
      if (typeof column.name !== "string") {
        throw new CsvError("CSV_OPTION_COLUMNS_MISSING_NAME", [
          "Option columns missing name:",
          `property "name" is required at position ${i}`,
          "when column is an object literal"
        ]);
      }
      normalizedColumns[i] = column;
    } else {
      throw new CsvError("CSV_INVALID_COLUMN_DEFINITION", [
        "Invalid column definition:",
        "expect a string or a literal object,",
        `got ${JSON.stringify(column)} at position ${i}`
      ]);
    }
  }
  return normalizedColumns;
};

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/csv-parse/lib/utils/ResizeableBuffer.js
class ResizeableBuffer {
  constructor(size = 100) {
    this.size = size;
    this.length = 0;
    this.buf = Buffer.allocUnsafe(size);
  }
  prepend(val) {
    if (Buffer.isBuffer(val)) {
      const length = this.length + val.length;
      if (length >= this.size) {
        this.resize();
        if (length >= this.size) {
          throw Error("INVALID_BUFFER_STATE");
        }
      }
      const buf = this.buf;
      this.buf = Buffer.allocUnsafe(this.size);
      val.copy(this.buf, 0);
      buf.copy(this.buf, val.length);
      this.length += val.length;
    } else {
      const length = this.length++;
      if (length === this.size) {
        this.resize();
      }
      const buf = this.clone();
      this.buf[0] = val;
      buf.copy(this.buf, 1, 0, length);
    }
  }
  append(val) {
    const length = this.length++;
    if (length === this.size) {
      this.resize();
    }
    this.buf[length] = val;
  }
  clone() {
    return Buffer.from(this.buf.slice(0, this.length));
  }
  resize() {
    const length = this.length;
    this.size = this.size * 2;
    const buf = Buffer.allocUnsafe(this.size);
    this.buf.copy(buf, 0, 0, length);
    this.buf = buf;
  }
  toString(encoding) {
    if (encoding) {
      return this.buf.slice(0, this.length).toString(encoding);
    } else {
      return Uint8Array.prototype.slice.call(this.buf.slice(0, this.length));
    }
  }
  toJSON() {
    return this.toString("utf8");
  }
  reset() {
    this.length = 0;
  }
}
var ResizeableBuffer_default = ResizeableBuffer;

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/csv-parse/lib/api/init_state.js
var np = 12;
var cr = 13;
var nl = 10;
var space = 32;
var tab = 9;
var init_state3 = function(options) {
  return {
    bomSkipped: false,
    bufBytesStart: 0,
    castField: options.cast_function,
    commenting: false,
    error: undefined,
    enabled: options.from_line === 1,
    escaping: false,
    escapeIsQuote: Buffer.isBuffer(options.escape) && Buffer.isBuffer(options.quote) && Buffer.compare(options.escape, options.quote) === 0,
    expectedRecordLength: Array.isArray(options.columns) ? options.columns.length : undefined,
    field: new ResizeableBuffer_default(20),
    firstLineToHeaders: options.cast_first_line_to_header,
    needMoreDataSize: Math.max(options.comment !== null ? options.comment.length : 0, ...options.delimiter.map((delimiter) => delimiter.length), options.quote !== null ? options.quote.length : 0),
    previousBuf: undefined,
    quoting: false,
    stop: false,
    rawBuffer: new ResizeableBuffer_default(100),
    record: [],
    recordHasError: false,
    record_length: 0,
    recordDelimiterMaxLength: options.record_delimiter.length === 0 ? 0 : Math.max(...options.record_delimiter.map((v) => v.length)),
    trimChars: [Buffer.from(" ", options.encoding)[0], Buffer.from("\t", options.encoding)[0]],
    wasQuoting: false,
    wasRowDelimiter: false,
    timchars: [
      Buffer.from(Buffer.from([cr], "utf8").toString(), options.encoding),
      Buffer.from(Buffer.from([nl], "utf8").toString(), options.encoding),
      Buffer.from(Buffer.from([np], "utf8").toString(), options.encoding),
      Buffer.from(Buffer.from([space], "utf8").toString(), options.encoding),
      Buffer.from(Buffer.from([tab], "utf8").toString(), options.encoding)
    ]
  };
};

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/csv-parse/lib/utils/underscore.js
var underscore = function(str) {
  return str.replace(/([A-Z])/g, function(_, match) {
    return "_" + match.toLowerCase();
  });
};

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/csv-parse/lib/api/normalize_options.js
var normalize_options3 = function(opts) {
  const options = {};
  for (const opt in opts) {
    options[underscore(opt)] = opts[opt];
  }
  if (options.encoding === undefined || options.encoding === true) {
    options.encoding = "utf8";
  } else if (options.encoding === null || options.encoding === false) {
    options.encoding = null;
  } else if (typeof options.encoding !== "string" && options.encoding !== null) {
    throw new CsvError("CSV_INVALID_OPTION_ENCODING", [
      "Invalid option encoding:",
      "encoding must be a string or null to return a buffer,",
      `got ${JSON.stringify(options.encoding)}`
    ], options);
  }
  if (options.bom === undefined || options.bom === null || options.bom === false) {
    options.bom = false;
  } else if (options.bom !== true) {
    throw new CsvError("CSV_INVALID_OPTION_BOM", [
      "Invalid option bom:",
      "bom must be true,",
      `got ${JSON.stringify(options.bom)}`
    ], options);
  }
  options.cast_function = null;
  if (options.cast === undefined || options.cast === null || options.cast === false || options.cast === "") {
    options.cast = undefined;
  } else if (typeof options.cast === "function") {
    options.cast_function = options.cast;
    options.cast = true;
  } else if (options.cast !== true) {
    throw new CsvError("CSV_INVALID_OPTION_CAST", [
      "Invalid option cast:",
      "cast must be true or a function,",
      `got ${JSON.stringify(options.cast)}`
    ], options);
  }
  if (options.cast_date === undefined || options.cast_date === null || options.cast_date === false || options.cast_date === "") {
    options.cast_date = false;
  } else if (options.cast_date === true) {
    options.cast_date = function(value) {
      const date = Date.parse(value);
      return !isNaN(date) ? new Date(date) : value;
    };
  } else if (typeof options.cast_date !== "function") {
    throw new CsvError("CSV_INVALID_OPTION_CAST_DATE", [
      "Invalid option cast_date:",
      "cast_date must be true or a function,",
      `got ${JSON.stringify(options.cast_date)}`
    ], options);
  }
  options.cast_first_line_to_header = null;
  if (options.columns === true) {
    options.cast_first_line_to_header = undefined;
  } else if (typeof options.columns === "function") {
    options.cast_first_line_to_header = options.columns;
    options.columns = true;
  } else if (Array.isArray(options.columns)) {
    options.columns = normalize_columns_array(options.columns);
  } else if (options.columns === undefined || options.columns === null || options.columns === false) {
    options.columns = false;
  } else {
    throw new CsvError("CSV_INVALID_OPTION_COLUMNS", [
      "Invalid option columns:",
      "expect an array, a function or true,",
      `got ${JSON.stringify(options.columns)}`
    ], options);
  }
  if (options.group_columns_by_name === undefined || options.group_columns_by_name === null || options.group_columns_by_name === false) {
    options.group_columns_by_name = false;
  } else if (options.group_columns_by_name !== true) {
    throw new CsvError("CSV_INVALID_OPTION_GROUP_COLUMNS_BY_NAME", [
      "Invalid option group_columns_by_name:",
      "expect an boolean,",
      `got ${JSON.stringify(options.group_columns_by_name)}`
    ], options);
  } else if (options.columns === false) {
    throw new CsvError("CSV_INVALID_OPTION_GROUP_COLUMNS_BY_NAME", [
      "Invalid option group_columns_by_name:",
      "the `columns` mode must be activated."
    ], options);
  }
  if (options.comment === undefined || options.comment === null || options.comment === false || options.comment === "") {
    options.comment = null;
  } else {
    if (typeof options.comment === "string") {
      options.comment = Buffer.from(options.comment, options.encoding);
    }
    if (!Buffer.isBuffer(options.comment)) {
      throw new CsvError("CSV_INVALID_OPTION_COMMENT", [
        "Invalid option comment:",
        "comment must be a buffer or a string,",
        `got ${JSON.stringify(options.comment)}`
      ], options);
    }
  }
  if (options.comment_no_infix === undefined || options.comment_no_infix === null || options.comment_no_infix === false) {
    options.comment_no_infix = false;
  } else if (options.comment_no_infix !== true) {
    throw new CsvError("CSV_INVALID_OPTION_COMMENT", [
      "Invalid option comment_no_infix:",
      "value must be a boolean,",
      `got ${JSON.stringify(options.comment_no_infix)}`
    ], options);
  }
  const delimiter_json = JSON.stringify(options.delimiter);
  if (!Array.isArray(options.delimiter))
    options.delimiter = [options.delimiter];
  if (options.delimiter.length === 0) {
    throw new CsvError("CSV_INVALID_OPTION_DELIMITER", [
      "Invalid option delimiter:",
      "delimiter must be a non empty string or buffer or array of string|buffer,",
      `got ${delimiter_json}`
    ], options);
  }
  options.delimiter = options.delimiter.map(function(delimiter) {
    if (delimiter === undefined || delimiter === null || delimiter === false) {
      return Buffer.from(",", options.encoding);
    }
    if (typeof delimiter === "string") {
      delimiter = Buffer.from(delimiter, options.encoding);
    }
    if (!Buffer.isBuffer(delimiter) || delimiter.length === 0) {
      throw new CsvError("CSV_INVALID_OPTION_DELIMITER", [
        "Invalid option delimiter:",
        "delimiter must be a non empty string or buffer or array of string|buffer,",
        `got ${delimiter_json}`
      ], options);
    }
    return delimiter;
  });
  if (options.escape === undefined || options.escape === true) {
    options.escape = Buffer.from('"', options.encoding);
  } else if (typeof options.escape === "string") {
    options.escape = Buffer.from(options.escape, options.encoding);
  } else if (options.escape === null || options.escape === false) {
    options.escape = null;
  }
  if (options.escape !== null) {
    if (!Buffer.isBuffer(options.escape)) {
      throw new Error(`Invalid Option: escape must be a buffer, a string or a boolean, got ${JSON.stringify(options.escape)}`);
    }
  }
  if (options.from === undefined || options.from === null) {
    options.from = 1;
  } else {
    if (typeof options.from === "string" && /\d+/.test(options.from)) {
      options.from = parseInt(options.from);
    }
    if (Number.isInteger(options.from)) {
      if (options.from < 0) {
        throw new Error(`Invalid Option: from must be a positive integer, got ${JSON.stringify(opts.from)}`);
      }
    } else {
      throw new Error(`Invalid Option: from must be an integer, got ${JSON.stringify(options.from)}`);
    }
  }
  if (options.from_line === undefined || options.from_line === null) {
    options.from_line = 1;
  } else {
    if (typeof options.from_line === "string" && /\d+/.test(options.from_line)) {
      options.from_line = parseInt(options.from_line);
    }
    if (Number.isInteger(options.from_line)) {
      if (options.from_line <= 0) {
        throw new Error(`Invalid Option: from_line must be a positive integer greater than 0, got ${JSON.stringify(opts.from_line)}`);
      }
    } else {
      throw new Error(`Invalid Option: from_line must be an integer, got ${JSON.stringify(opts.from_line)}`);
    }
  }
  if (options.ignore_last_delimiters === undefined || options.ignore_last_delimiters === null) {
    options.ignore_last_delimiters = false;
  } else if (typeof options.ignore_last_delimiters === "number") {
    options.ignore_last_delimiters = Math.floor(options.ignore_last_delimiters);
    if (options.ignore_last_delimiters === 0) {
      options.ignore_last_delimiters = false;
    }
  } else if (typeof options.ignore_last_delimiters !== "boolean") {
    throw new CsvError("CSV_INVALID_OPTION_IGNORE_LAST_DELIMITERS", [
      "Invalid option `ignore_last_delimiters`:",
      "the value must be a boolean value or an integer,",
      `got ${JSON.stringify(options.ignore_last_delimiters)}`
    ], options);
  }
  if (options.ignore_last_delimiters === true && options.columns === false) {
    throw new CsvError("CSV_IGNORE_LAST_DELIMITERS_REQUIRES_COLUMNS", [
      "The option `ignore_last_delimiters`",
      "requires the activation of the `columns` option"
    ], options);
  }
  if (options.info === undefined || options.info === null || options.info === false) {
    options.info = false;
  } else if (options.info !== true) {
    throw new Error(`Invalid Option: info must be true, got ${JSON.stringify(options.info)}`);
  }
  if (options.max_record_size === undefined || options.max_record_size === null || options.max_record_size === false) {
    options.max_record_size = 0;
  } else if (Number.isInteger(options.max_record_size) && options.max_record_size >= 0) {
  } else if (typeof options.max_record_size === "string" && /\d+/.test(options.max_record_size)) {
    options.max_record_size = parseInt(options.max_record_size);
  } else {
    throw new Error(`Invalid Option: max_record_size must be a positive integer, got ${JSON.stringify(options.max_record_size)}`);
  }
  if (options.objname === undefined || options.objname === null || options.objname === false) {
    options.objname = undefined;
  } else if (Buffer.isBuffer(options.objname)) {
    if (options.objname.length === 0) {
      throw new Error(`Invalid Option: objname must be a non empty buffer`);
    }
    if (options.encoding === null) {
    } else {
      options.objname = options.objname.toString(options.encoding);
    }
  } else if (typeof options.objname === "string") {
    if (options.objname.length === 0) {
      throw new Error(`Invalid Option: objname must be a non empty string`);
    }
  } else if (typeof options.objname === "number") {
  } else {
    throw new Error(`Invalid Option: objname must be a string or a buffer, got ${options.objname}`);
  }
  if (options.objname !== undefined) {
    if (typeof options.objname === "number") {
      if (options.columns !== false) {
        throw Error("Invalid Option: objname index cannot be combined with columns or be defined as a field");
      }
    } else {
      if (options.columns === false) {
        throw Error("Invalid Option: objname field must be combined with columns or be defined as an index");
      }
    }
  }
  if (options.on_record === undefined || options.on_record === null) {
    options.on_record = undefined;
  } else if (typeof options.on_record !== "function") {
    throw new CsvError("CSV_INVALID_OPTION_ON_RECORD", [
      "Invalid option `on_record`:",
      "expect a function,",
      `got ${JSON.stringify(options.on_record)}`
    ], options);
  }
  if (options.quote === null || options.quote === false || options.quote === "") {
    options.quote = null;
  } else {
    if (options.quote === undefined || options.quote === true) {
      options.quote = Buffer.from('"', options.encoding);
    } else if (typeof options.quote === "string") {
      options.quote = Buffer.from(options.quote, options.encoding);
    }
    if (!Buffer.isBuffer(options.quote)) {
      throw new Error(`Invalid Option: quote must be a buffer or a string, got ${JSON.stringify(options.quote)}`);
    }
  }
  if (options.raw === undefined || options.raw === null || options.raw === false) {
    options.raw = false;
  } else if (options.raw !== true) {
    throw new Error(`Invalid Option: raw must be true, got ${JSON.stringify(options.raw)}`);
  }
  if (options.record_delimiter === undefined) {
    options.record_delimiter = [];
  } else if (typeof options.record_delimiter === "string" || Buffer.isBuffer(options.record_delimiter)) {
    if (options.record_delimiter.length === 0) {
      throw new CsvError("CSV_INVALID_OPTION_RECORD_DELIMITER", [
        "Invalid option `record_delimiter`:",
        "value must be a non empty string or buffer,",
        `got ${JSON.stringify(options.record_delimiter)}`
      ], options);
    }
    options.record_delimiter = [options.record_delimiter];
  } else if (!Array.isArray(options.record_delimiter)) {
    throw new CsvError("CSV_INVALID_OPTION_RECORD_DELIMITER", [
      "Invalid option `record_delimiter`:",
      "value must be a string, a buffer or array of string|buffer,",
      `got ${JSON.stringify(options.record_delimiter)}`
    ], options);
  }
  options.record_delimiter = options.record_delimiter.map(function(rd, i) {
    if (typeof rd !== "string" && !Buffer.isBuffer(rd)) {
      throw new CsvError("CSV_INVALID_OPTION_RECORD_DELIMITER", [
        "Invalid option `record_delimiter`:",
        "value must be a string, a buffer or array of string|buffer",
        `at index ${i},`,
        `got ${JSON.stringify(rd)}`
      ], options);
    } else if (rd.length === 0) {
      throw new CsvError("CSV_INVALID_OPTION_RECORD_DELIMITER", [
        "Invalid option `record_delimiter`:",
        "value must be a non empty string or buffer",
        `at index ${i},`,
        `got ${JSON.stringify(rd)}`
      ], options);
    }
    if (typeof rd === "string") {
      rd = Buffer.from(rd, options.encoding);
    }
    return rd;
  });
  if (typeof options.relax_column_count === "boolean") {
  } else if (options.relax_column_count === undefined || options.relax_column_count === null) {
    options.relax_column_count = false;
  } else {
    throw new Error(`Invalid Option: relax_column_count must be a boolean, got ${JSON.stringify(options.relax_column_count)}`);
  }
  if (typeof options.relax_column_count_less === "boolean") {
  } else if (options.relax_column_count_less === undefined || options.relax_column_count_less === null) {
    options.relax_column_count_less = false;
  } else {
    throw new Error(`Invalid Option: relax_column_count_less must be a boolean, got ${JSON.stringify(options.relax_column_count_less)}`);
  }
  if (typeof options.relax_column_count_more === "boolean") {
  } else if (options.relax_column_count_more === undefined || options.relax_column_count_more === null) {
    options.relax_column_count_more = false;
  } else {
    throw new Error(`Invalid Option: relax_column_count_more must be a boolean, got ${JSON.stringify(options.relax_column_count_more)}`);
  }
  if (typeof options.relax_quotes === "boolean") {
  } else if (options.relax_quotes === undefined || options.relax_quotes === null) {
    options.relax_quotes = false;
  } else {
    throw new Error(`Invalid Option: relax_quotes must be a boolean, got ${JSON.stringify(options.relax_quotes)}`);
  }
  if (typeof options.skip_empty_lines === "boolean") {
  } else if (options.skip_empty_lines === undefined || options.skip_empty_lines === null) {
    options.skip_empty_lines = false;
  } else {
    throw new Error(`Invalid Option: skip_empty_lines must be a boolean, got ${JSON.stringify(options.skip_empty_lines)}`);
  }
  if (typeof options.skip_records_with_empty_values === "boolean") {
  } else if (options.skip_records_with_empty_values === undefined || options.skip_records_with_empty_values === null) {
    options.skip_records_with_empty_values = false;
  } else {
    throw new Error(`Invalid Option: skip_records_with_empty_values must be a boolean, got ${JSON.stringify(options.skip_records_with_empty_values)}`);
  }
  if (typeof options.skip_records_with_error === "boolean") {
  } else if (options.skip_records_with_error === undefined || options.skip_records_with_error === null) {
    options.skip_records_with_error = false;
  } else {
    throw new Error(`Invalid Option: skip_records_with_error must be a boolean, got ${JSON.stringify(options.skip_records_with_error)}`);
  }
  if (options.rtrim === undefined || options.rtrim === null || options.rtrim === false) {
    options.rtrim = false;
  } else if (options.rtrim !== true) {
    throw new Error(`Invalid Option: rtrim must be a boolean, got ${JSON.stringify(options.rtrim)}`);
  }
  if (options.ltrim === undefined || options.ltrim === null || options.ltrim === false) {
    options.ltrim = false;
  } else if (options.ltrim !== true) {
    throw new Error(`Invalid Option: ltrim must be a boolean, got ${JSON.stringify(options.ltrim)}`);
  }
  if (options.trim === undefined || options.trim === null || options.trim === false) {
    options.trim = false;
  } else if (options.trim !== true) {
    throw new Error(`Invalid Option: trim must be a boolean, got ${JSON.stringify(options.trim)}`);
  }
  if (options.trim === true && opts.ltrim !== false) {
    options.ltrim = true;
  } else if (options.ltrim !== true) {
    options.ltrim = false;
  }
  if (options.trim === true && opts.rtrim !== false) {
    options.rtrim = true;
  } else if (options.rtrim !== true) {
    options.rtrim = false;
  }
  if (options.to === undefined || options.to === null) {
    options.to = -1;
  } else {
    if (typeof options.to === "string" && /\d+/.test(options.to)) {
      options.to = parseInt(options.to);
    }
    if (Number.isInteger(options.to)) {
      if (options.to <= 0) {
        throw new Error(`Invalid Option: to must be a positive integer greater than 0, got ${JSON.stringify(opts.to)}`);
      }
    } else {
      throw new Error(`Invalid Option: to must be an integer, got ${JSON.stringify(opts.to)}`);
    }
  }
  if (options.to_line === undefined || options.to_line === null) {
    options.to_line = -1;
  } else {
    if (typeof options.to_line === "string" && /\d+/.test(options.to_line)) {
      options.to_line = parseInt(options.to_line);
    }
    if (Number.isInteger(options.to_line)) {
      if (options.to_line <= 0) {
        throw new Error(`Invalid Option: to_line must be a positive integer greater than 0, got ${JSON.stringify(opts.to_line)}`);
      }
    } else {
      throw new Error(`Invalid Option: to_line must be an integer, got ${JSON.stringify(opts.to_line)}`);
    }
  }
  return options;
};

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/csv-parse/lib/api/index.js
var isRecordEmpty = function(record) {
  return record.every((field) => field == null || field.toString && field.toString().trim() === "");
};
var cr2 = 13;
var nl2 = 10;
var boms = {
  utf8: Buffer.from([239, 187, 191]),
  utf16le: Buffer.from([255, 254])
};
var transform = function(original_options = {}) {
  const info = {
    bytes: 0,
    comment_lines: 0,
    empty_lines: 0,
    invalid_field_length: 0,
    lines: 1,
    records: 0
  };
  const options = normalize_options3(original_options);
  return {
    info,
    original_options,
    options,
    state: init_state3(options),
    __needMoreData: function(i, bufLen, end) {
      if (end)
        return false;
      const { encoding, escape, quote } = this.options;
      const { quoting, needMoreDataSize, recordDelimiterMaxLength } = this.state;
      const numOfCharLeft = bufLen - i - 1;
      const requiredLength = Math.max(needMoreDataSize, recordDelimiterMaxLength === 0 ? Buffer.from("\r\n", encoding).length : recordDelimiterMaxLength, quoting ? (escape === null ? 0 : escape.length) + quote.length : 0, quoting ? quote.length + recordDelimiterMaxLength : 0);
      return numOfCharLeft < requiredLength;
    },
    parse: function(nextBuf, end, push, close) {
      const { bom, comment_no_infix, encoding, from_line, ltrim, max_record_size, raw, relax_quotes, rtrim, skip_empty_lines, to, to_line } = this.options;
      let { comment, escape, quote, record_delimiter } = this.options;
      const { bomSkipped, previousBuf, rawBuffer, escapeIsQuote } = this.state;
      let buf;
      if (previousBuf === undefined) {
        if (nextBuf === undefined) {
          close();
          return;
        } else {
          buf = nextBuf;
        }
      } else if (previousBuf !== undefined && nextBuf === undefined) {
        buf = previousBuf;
      } else {
        buf = Buffer.concat([previousBuf, nextBuf]);
      }
      if (bomSkipped === false) {
        if (bom === false) {
          this.state.bomSkipped = true;
        } else if (buf.length < 3) {
          if (end === false) {
            this.state.previousBuf = buf;
            return;
          }
        } else {
          for (const encoding2 in boms) {
            if (boms[encoding2].compare(buf, 0, boms[encoding2].length) === 0) {
              const bomLength = boms[encoding2].length;
              this.state.bufBytesStart += bomLength;
              buf = buf.slice(bomLength);
              this.options = normalize_options3({ ...this.original_options, encoding: encoding2 });
              ({ comment, escape, quote } = this.options);
              break;
            }
          }
          this.state.bomSkipped = true;
        }
      }
      const bufLen = buf.length;
      let pos;
      for (pos = 0;pos < bufLen; pos++) {
        if (this.__needMoreData(pos, bufLen, end)) {
          break;
        }
        if (this.state.wasRowDelimiter === true) {
          this.info.lines++;
          this.state.wasRowDelimiter = false;
        }
        if (to_line !== -1 && this.info.lines > to_line) {
          this.state.stop = true;
          close();
          return;
        }
        if (this.state.quoting === false && record_delimiter.length === 0) {
          const record_delimiterCount = this.__autoDiscoverRecordDelimiter(buf, pos);
          if (record_delimiterCount) {
            record_delimiter = this.options.record_delimiter;
          }
        }
        const chr = buf[pos];
        if (raw === true) {
          rawBuffer.append(chr);
        }
        if ((chr === cr2 || chr === nl2) && this.state.wasRowDelimiter === false) {
          this.state.wasRowDelimiter = true;
        }
        if (this.state.escaping === true) {
          this.state.escaping = false;
        } else {
          if (escape !== null && this.state.quoting === true && this.__isEscape(buf, pos, chr) && pos + escape.length < bufLen) {
            if (escapeIsQuote) {
              if (this.__isQuote(buf, pos + escape.length)) {
                this.state.escaping = true;
                pos += escape.length - 1;
                continue;
              }
            } else {
              this.state.escaping = true;
              pos += escape.length - 1;
              continue;
            }
          }
          if (this.state.commenting === false && this.__isQuote(buf, pos)) {
            if (this.state.quoting === true) {
              const nextChr = buf[pos + quote.length];
              const isNextChrTrimable = rtrim && this.__isCharTrimable(buf, pos + quote.length);
              const isNextChrComment = comment !== null && this.__compareBytes(comment, buf, pos + quote.length, nextChr);
              const isNextChrDelimiter = this.__isDelimiter(buf, pos + quote.length, nextChr);
              const isNextChrRecordDelimiter = record_delimiter.length === 0 ? this.__autoDiscoverRecordDelimiter(buf, pos + quote.length) : this.__isRecordDelimiter(nextChr, buf, pos + quote.length);
              if (escape !== null && this.__isEscape(buf, pos, chr) && this.__isQuote(buf, pos + escape.length)) {
                pos += escape.length - 1;
              } else if (!nextChr || isNextChrDelimiter || isNextChrRecordDelimiter || isNextChrComment || isNextChrTrimable) {
                this.state.quoting = false;
                this.state.wasQuoting = true;
                pos += quote.length - 1;
                continue;
              } else if (relax_quotes === false) {
                const err = this.__error(new CsvError("CSV_INVALID_CLOSING_QUOTE", [
                  "Invalid Closing Quote:",
                  `got "${String.fromCharCode(nextChr)}"`,
                  `at line ${this.info.lines}`,
                  "instead of delimiter, record delimiter, trimable character",
                  "(if activated) or comment"
                ], this.options, this.__infoField()));
                if (err !== undefined)
                  return err;
              } else {
                this.state.quoting = false;
                this.state.wasQuoting = true;
                this.state.field.prepend(quote);
                pos += quote.length - 1;
              }
            } else {
              if (this.state.field.length !== 0) {
                if (relax_quotes === false) {
                  const info2 = this.__infoField();
                  const bom2 = Object.keys(boms).map((b) => boms[b].equals(this.state.field.toString()) ? b : false).filter(Boolean)[0];
                  const err = this.__error(new CsvError("INVALID_OPENING_QUOTE", [
                    "Invalid Opening Quote:",
                    `a quote is found on field ${JSON.stringify(info2.column)} at line ${info2.lines}, value is ${JSON.stringify(this.state.field.toString(encoding))}`,
                    bom2 ? `(${bom2} bom)` : undefined
                  ], this.options, info2, {
                    field: this.state.field
                  }));
                  if (err !== undefined)
                    return err;
                }
              } else {
                this.state.quoting = true;
                pos += quote.length - 1;
                continue;
              }
            }
          }
          if (this.state.quoting === false) {
            const recordDelimiterLength = this.__isRecordDelimiter(chr, buf, pos);
            if (recordDelimiterLength !== 0) {
              const skipCommentLine = this.state.commenting && (this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0);
              if (skipCommentLine) {
                this.info.comment_lines++;
              } else {
                if (this.state.enabled === false && this.info.lines + (this.state.wasRowDelimiter === true ? 1 : 0) >= from_line) {
                  this.state.enabled = true;
                  this.__resetField();
                  this.__resetRecord();
                  pos += recordDelimiterLength - 1;
                  continue;
                }
                if (skip_empty_lines === true && this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0) {
                  this.info.empty_lines++;
                  pos += recordDelimiterLength - 1;
                  continue;
                }
                this.info.bytes = this.state.bufBytesStart + pos;
                const errField = this.__onField();
                if (errField !== undefined)
                  return errField;
                this.info.bytes = this.state.bufBytesStart + pos + recordDelimiterLength;
                const errRecord = this.__onRecord(push);
                if (errRecord !== undefined)
                  return errRecord;
                if (to !== -1 && this.info.records >= to) {
                  this.state.stop = true;
                  close();
                  return;
                }
              }
              this.state.commenting = false;
              pos += recordDelimiterLength - 1;
              continue;
            }
            if (this.state.commenting) {
              continue;
            }
            const commentCount = comment === null ? 0 : this.__compareBytes(comment, buf, pos, chr);
            if (commentCount !== 0 && (comment_no_infix === false || this.state.field.length === 0)) {
              this.state.commenting = true;
              continue;
            }
            const delimiterLength = this.__isDelimiter(buf, pos, chr);
            if (delimiterLength !== 0) {
              this.info.bytes = this.state.bufBytesStart + pos;
              const errField = this.__onField();
              if (errField !== undefined)
                return errField;
              pos += delimiterLength - 1;
              continue;
            }
          }
        }
        if (this.state.commenting === false) {
          if (max_record_size !== 0 && this.state.record_length + this.state.field.length > max_record_size) {
            return this.__error(new CsvError("CSV_MAX_RECORD_SIZE", [
              "Max Record Size:",
              "record exceed the maximum number of tolerated bytes",
              `of ${max_record_size}`,
              `at line ${this.info.lines}`
            ], this.options, this.__infoField()));
          }
        }
        const lappend = ltrim === false || this.state.quoting === true || this.state.field.length !== 0 || !this.__isCharTrimable(buf, pos);
        const rappend = rtrim === false || this.state.wasQuoting === false;
        if (lappend === true && rappend === true) {
          this.state.field.append(chr);
        } else if (rtrim === true && !this.__isCharTrimable(buf, pos)) {
          return this.__error(new CsvError("CSV_NON_TRIMABLE_CHAR_AFTER_CLOSING_QUOTE", [
            "Invalid Closing Quote:",
            "found non trimable byte after quote",
            `at line ${this.info.lines}`
          ], this.options, this.__infoField()));
        } else {
          if (lappend === false) {
            pos += this.__isCharTrimable(buf, pos) - 1;
          }
          continue;
        }
      }
      if (end === true) {
        if (this.state.quoting === true) {
          const err = this.__error(new CsvError("CSV_QUOTE_NOT_CLOSED", [
            "Quote Not Closed:",
            `the parsing is finished with an opening quote at line ${this.info.lines}`
          ], this.options, this.__infoField()));
          if (err !== undefined)
            return err;
        } else {
          if (this.state.wasQuoting === true || this.state.record.length !== 0 || this.state.field.length !== 0) {
            this.info.bytes = this.state.bufBytesStart + pos;
            const errField = this.__onField();
            if (errField !== undefined)
              return errField;
            const errRecord = this.__onRecord(push);
            if (errRecord !== undefined)
              return errRecord;
          } else if (this.state.wasRowDelimiter === true) {
            this.info.empty_lines++;
          } else if (this.state.commenting === true) {
            this.info.comment_lines++;
          }
        }
      } else {
        this.state.bufBytesStart += pos;
        this.state.previousBuf = buf.slice(pos);
      }
      if (this.state.wasRowDelimiter === true) {
        this.info.lines++;
        this.state.wasRowDelimiter = false;
      }
    },
    __onRecord: function(push) {
      const { columns, group_columns_by_name, encoding, info: info2, from, relax_column_count, relax_column_count_less, relax_column_count_more, raw, skip_records_with_empty_values } = this.options;
      const { enabled, record } = this.state;
      if (enabled === false) {
        return this.__resetRecord();
      }
      const recordLength = record.length;
      if (columns === true) {
        if (skip_records_with_empty_values === true && isRecordEmpty(record)) {
          this.__resetRecord();
          return;
        }
        return this.__firstLineToColumns(record);
      }
      if (columns === false && this.info.records === 0) {
        this.state.expectedRecordLength = recordLength;
      }
      if (recordLength !== this.state.expectedRecordLength) {
        const err = columns === false ? new CsvError("CSV_RECORD_INCONSISTENT_FIELDS_LENGTH", [
          "Invalid Record Length:",
          `expect ${this.state.expectedRecordLength},`,
          `got ${recordLength} on line ${this.info.lines}`
        ], this.options, this.__infoField(), {
          record
        }) : new CsvError("CSV_RECORD_INCONSISTENT_COLUMNS", [
          "Invalid Record Length:",
          `columns length is ${columns.length},`,
          `got ${recordLength} on line ${this.info.lines}`
        ], this.options, this.__infoField(), {
          record
        });
        if (relax_column_count === true || relax_column_count_less === true && recordLength < this.state.expectedRecordLength || relax_column_count_more === true && recordLength > this.state.expectedRecordLength) {
          this.info.invalid_field_length++;
          this.state.error = err;
        } else {
          const finalErr = this.__error(err);
          if (finalErr)
            return finalErr;
        }
      }
      if (skip_records_with_empty_values === true && isRecordEmpty(record)) {
        this.__resetRecord();
        return;
      }
      if (this.state.recordHasError === true) {
        this.__resetRecord();
        this.state.recordHasError = false;
        return;
      }
      this.info.records++;
      if (from === 1 || this.info.records >= from) {
        const { objname } = this.options;
        if (columns !== false) {
          const obj = {};
          for (let i = 0, l = record.length;i < l; i++) {
            if (columns[i] === undefined || columns[i].disabled)
              continue;
            if (group_columns_by_name === true && obj[columns[i].name] !== undefined) {
              if (Array.isArray(obj[columns[i].name])) {
                obj[columns[i].name] = obj[columns[i].name].concat(record[i]);
              } else {
                obj[columns[i].name] = [obj[columns[i].name], record[i]];
              }
            } else {
              obj[columns[i].name] = record[i];
            }
          }
          if (raw === true || info2 === true) {
            const extRecord = Object.assign({ record: obj }, raw === true ? { raw: this.state.rawBuffer.toString(encoding) } : {}, info2 === true ? { info: this.__infoRecord() } : {});
            const err = this.__push(objname === undefined ? extRecord : [obj[objname], extRecord], push);
            if (err) {
              return err;
            }
          } else {
            const err = this.__push(objname === undefined ? obj : [obj[objname], obj], push);
            if (err) {
              return err;
            }
          }
        } else {
          if (raw === true || info2 === true) {
            const extRecord = Object.assign({ record }, raw === true ? { raw: this.state.rawBuffer.toString(encoding) } : {}, info2 === true ? { info: this.__infoRecord() } : {});
            const err = this.__push(objname === undefined ? extRecord : [record[objname], extRecord], push);
            if (err) {
              return err;
            }
          } else {
            const err = this.__push(objname === undefined ? record : [record[objname], record], push);
            if (err) {
              return err;
            }
          }
        }
      }
      this.__resetRecord();
    },
    __firstLineToColumns: function(record) {
      const { firstLineToHeaders } = this.state;
      try {
        const headers = firstLineToHeaders === undefined ? record : firstLineToHeaders.call(null, record);
        if (!Array.isArray(headers)) {
          return this.__error(new CsvError("CSV_INVALID_COLUMN_MAPPING", [
            "Invalid Column Mapping:",
            "expect an array from column function,",
            `got ${JSON.stringify(headers)}`
          ], this.options, this.__infoField(), {
            headers
          }));
        }
        const normalizedHeaders = normalize_columns_array(headers);
        this.state.expectedRecordLength = normalizedHeaders.length;
        this.options.columns = normalizedHeaders;
        this.__resetRecord();
        return;
      } catch (err) {
        return err;
      }
    },
    __resetRecord: function() {
      if (this.options.raw === true) {
        this.state.rawBuffer.reset();
      }
      this.state.error = undefined;
      this.state.record = [];
      this.state.record_length = 0;
    },
    __onField: function() {
      const { cast, encoding, rtrim, max_record_size } = this.options;
      const { enabled, wasQuoting } = this.state;
      if (enabled === false) {
        return this.__resetField();
      }
      let field = this.state.field.toString(encoding);
      if (rtrim === true && wasQuoting === false) {
        field = field.trimRight();
      }
      if (cast === true) {
        const [err, f] = this.__cast(field);
        if (err !== undefined)
          return err;
        field = f;
      }
      this.state.record.push(field);
      if (max_record_size !== 0 && typeof field === "string") {
        this.state.record_length += field.length;
      }
      this.__resetField();
    },
    __resetField: function() {
      this.state.field.reset();
      this.state.wasQuoting = false;
    },
    __push: function(record, push) {
      const { on_record } = this.options;
      if (on_record !== undefined) {
        const info2 = this.__infoRecord();
        try {
          record = on_record.call(null, record, info2);
        } catch (err) {
          return err;
        }
        if (record === undefined || record === null) {
          return;
        }
      }
      push(record);
    },
    __cast: function(field) {
      const { columns, relax_column_count } = this.options;
      const isColumns = Array.isArray(columns);
      if (isColumns === true && relax_column_count && this.options.columns.length <= this.state.record.length) {
        return [undefined, undefined];
      }
      if (this.state.castField !== null) {
        try {
          const info2 = this.__infoField();
          return [undefined, this.state.castField.call(null, field, info2)];
        } catch (err) {
          return [err];
        }
      }
      if (this.__isFloat(field)) {
        return [undefined, parseFloat(field)];
      } else if (this.options.cast_date !== false) {
        const info2 = this.__infoField();
        return [undefined, this.options.cast_date.call(null, field, info2)];
      }
      return [undefined, field];
    },
    __isCharTrimable: function(buf, pos) {
      const isTrim = (buf2, pos2) => {
        const { timchars } = this.state;
        loop1:
          for (let i = 0;i < timchars.length; i++) {
            const timchar = timchars[i];
            for (let j = 0;j < timchar.length; j++) {
              if (timchar[j] !== buf2[pos2 + j])
                continue loop1;
            }
            return timchar.length;
          }
        return 0;
      };
      return isTrim(buf, pos);
    },
    __isFloat: function(value) {
      return value - parseFloat(value) + 1 >= 0;
    },
    __compareBytes: function(sourceBuf, targetBuf, targetPos, firstByte) {
      if (sourceBuf[0] !== firstByte)
        return 0;
      const sourceLength = sourceBuf.length;
      for (let i = 1;i < sourceLength; i++) {
        if (sourceBuf[i] !== targetBuf[targetPos + i])
          return 0;
      }
      return sourceLength;
    },
    __isDelimiter: function(buf, pos, chr) {
      const { delimiter, ignore_last_delimiters } = this.options;
      if (ignore_last_delimiters === true && this.state.record.length === this.options.columns.length - 1) {
        return 0;
      } else if (ignore_last_delimiters !== false && typeof ignore_last_delimiters === "number" && this.state.record.length === ignore_last_delimiters - 1) {
        return 0;
      }
      loop1:
        for (let i = 0;i < delimiter.length; i++) {
          const del = delimiter[i];
          if (del[0] === chr) {
            for (let j = 1;j < del.length; j++) {
              if (del[j] !== buf[pos + j])
                continue loop1;
            }
            return del.length;
          }
        }
      return 0;
    },
    __isRecordDelimiter: function(chr, buf, pos) {
      const { record_delimiter } = this.options;
      const recordDelimiterLength = record_delimiter.length;
      loop1:
        for (let i = 0;i < recordDelimiterLength; i++) {
          const rd = record_delimiter[i];
          const rdLength = rd.length;
          if (rd[0] !== chr) {
            continue;
          }
          for (let j = 1;j < rdLength; j++) {
            if (rd[j] !== buf[pos + j]) {
              continue loop1;
            }
          }
          return rd.length;
        }
      return 0;
    },
    __isEscape: function(buf, pos, chr) {
      const { escape } = this.options;
      if (escape === null)
        return false;
      const l = escape.length;
      if (escape[0] === chr) {
        for (let i = 0;i < l; i++) {
          if (escape[i] !== buf[pos + i]) {
            return false;
          }
        }
        return true;
      }
      return false;
    },
    __isQuote: function(buf, pos) {
      const { quote } = this.options;
      if (quote === null)
        return false;
      const l = quote.length;
      for (let i = 0;i < l; i++) {
        if (quote[i] !== buf[pos + i]) {
          return false;
        }
      }
      return true;
    },
    __autoDiscoverRecordDelimiter: function(buf, pos) {
      const { encoding } = this.options;
      const rds = [
        Buffer.from("\r\n", encoding),
        Buffer.from("\n", encoding),
        Buffer.from("\r", encoding)
      ];
      loop:
        for (let i = 0;i < rds.length; i++) {
          const l = rds[i].length;
          for (let j = 0;j < l; j++) {
            if (rds[i][j] !== buf[pos + j]) {
              continue loop;
            }
          }
          this.options.record_delimiter.push(rds[i]);
          this.state.recordDelimiterMaxLength = rds[i].length;
          return rds[i].length;
        }
      return 0;
    },
    __error: function(msg) {
      const { encoding, raw, skip_records_with_error } = this.options;
      const err = typeof msg === "string" ? new Error(msg) : msg;
      if (skip_records_with_error) {
        this.state.recordHasError = true;
        if (this.options.on_skip !== undefined) {
          this.options.on_skip(err, raw ? this.state.rawBuffer.toString(encoding) : undefined);
        }
        return;
      } else {
        return err;
      }
    },
    __infoDataSet: function() {
      return {
        ...this.info,
        columns: this.options.columns
      };
    },
    __infoRecord: function() {
      const { columns, raw, encoding } = this.options;
      return {
        ...this.__infoDataSet(),
        error: this.state.error,
        header: columns === true,
        index: this.state.record.length,
        raw: raw ? this.state.rawBuffer.toString(encoding) : undefined
      };
    },
    __infoField: function() {
      const { columns } = this.options;
      const isColumns = Array.isArray(columns);
      return {
        ...this.__infoRecord(),
        column: isColumns === true ? columns.length > this.state.record.length ? columns[this.state.record.length].name : null : this.state.record.length,
        quoting: this.state.wasQuoting
      };
    }
  };
};

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/csv-parse/lib/sync.js
var parse = function(data, opts = {}) {
  if (typeof data === "string") {
    data = Buffer.from(data);
  }
  const records = opts && opts.objname ? {} : [];
  const parser = transform(opts);
  const push = (record) => {
    if (parser.options.objname === undefined)
      records.push(record);
    else {
      records[record[0]] = record[1];
    }
  };
  const close = () => {
  };
  const err1 = parser.parse(data, false, push, close);
  if (err1 !== undefined)
    throw err1;
  const err2 = parser.parse(undefined, true, push, close);
  if (err2 !== undefined)
    throw err2;
  return records;
};

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/csv-stringify/lib/utils/get.js
var charCodeOfDot = ".".charCodeAt(0);
var rePropName = RegExp('[^.[\\]]+|\\[(?:([^"\'][^[]*)|(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2)\\]|(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))', "g");

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/csv-stringify/lib/api/index.js
var bom_utf8 = Buffer.from([239, 187, 191]);

// /home/poop/git/private/nirv/tinkerbuntune/node_modules/stream-transform/lib/index.js
import stream3 from "stream";
import util2 from "util";
var Transformer = function(options = {}, handler) {
  this.options = options;
  if (options.consume === undefined || options.consume === null) {
    this.options.consume = false;
  }
  this.options.objectMode = true;
  if (options.parallel === undefined || options.parallel === null) {
    this.options.parallel = 100;
  }
  if (options.params === undefined || options.params === null) {
    options.params = null;
  }
  this.handler = handler;
  stream3.Transform.call(this, this.options);
  this.state = {
    running: 0,
    started: 0,
    finished: 0,
    paused: false
  };
  return this;
};
util2.inherits(Transformer, stream3.Transform);
Transformer.prototype._transform = function(chunk, _, cb) {
  this.state.started++;
  this.state.running++;
  if (!this.state.paused && this.state.running < this.options.parallel) {
    cb();
    cb = null;
  }
  try {
    let l = this.handler.length;
    if (this.options.params !== null) {
      l--;
    }
    if (l === 1) {
      const result = this.handler.call(this, chunk, this.options.params);
      this.__done(null, [result], cb);
    } else if (l === 2) {
      const callback = (err, ...chunks) => this.__done(err, chunks, cb);
      this.handler.call(this, chunk, callback, this.options.params);
    } else {
      throw Error("Invalid handler arguments");
    }
    return false;
  } catch (err) {
    this.__done(err);
  }
};
Transformer.prototype._flush = function(cb) {
  if (this.state.running === 0) {
    cb();
  } else {
    this._ending = function() {
      cb();
    };
  }
};
Transformer.prototype.__done = function(err, chunks, cb) {
  this.state.running--;
  if (err) {
    return this.emit("error", err);
  }
  this.state.finished++;
  for (let chunk of chunks) {
    if (typeof chunk === "number") {
      chunk = `${chunk}`;
    }
    if (chunk !== undefined && chunk !== null && chunk !== "") {
      this.state.paused = !this.push(chunk);
    }
  }
  if (cb) {
    cb();
  }
  if (this._ending && this.state.running === 0) {
    this._ending();
  }
};

// src/loader/etl.ts
import fs from "fs/promises";

// src/logger.ts
var log = (msg, ...x) => console.info(`${Date()}\n`, `${msg}\n`, ...x, "\n\n");

// src/remote.ts
var { traversal, DriverRemoteConnection, gremlin: gremlin3 } = common;
var g = traversal(GroovyTraversalSource).withRemote(new DriverRemoteConnection("ws://0.0.0.0:8182/gremlin"));
var client = new gremlin3.driver.Client("ws://0.0.0.0:8182/gremlin", {
  traversalSource: "g",
  session: `${Date.now()}`
});

// src/loader/utils.ts
import path from "path";
var fnameToBname = (fname) => path.parse(fname).name;
var bnameTofname = (bname, ext = "csv") => `${bname}.${ext}`;
var pgDateToJs = (date) => new Date(date.replace(/['"]+/g, ""));
var hashIdCache = Object.create(null);
var hashId = (id) => {
  if (!hashIdCache[id])
    hashIdCache[id] = Bun.hash(id).toString();
  return hashIdCache[id];
};
var getEdgeLabel = (data) => {
  if (!String(data).length)
    throw new Error(`neptune requires edges to have exactly 1 label: ${data} received`);
  return data;
};
var getVertexLabel = (data) => {
  if (!data.length)
    throw new Error(`neptune requires at least 1 label for vertices`);
  return data[0];
};
var getLabel = (type) => type === "v" ? getVertexLabel : getEdgeLabel;
var recordsCreatedHandler = (result) => result.reduce((p, c) => {
  if (c.status === "rejected")
    p.failure.push(c.reason);
  else
    p.success.push(c.value);
  return p;
}, { success: [], failure: [] });

// src/loader/loaders.ts
var { t, Direction, merge } = common;
var tinkerDataEdge = (tdata) => {
  return tdata.edges.map((edgeData) => {
    if (!edgeData.recordId)
      throw new Error(`all edges require a user supplied recordId\n${JSON.stringify(edgeData)}`);
    const recordProps = new Map(Object.entries(edgeData.p || {}));
    recordProps.set(t.label, edgeData.l);
    recordProps.set(Direction.OUT, edgeData.f);
    recordProps.set(Direction.IN, edgeData.t);
    return [new Map([[t.id, edgeData.recordId]]), recordProps];
  });
};
var tinkerDataVertex = (tdata) => {
  if (!tdata.recordId)
    throw new Error(`all vertices require a user supplied recordId`);
  const recordProps = new Map(Object.entries(tdata.p));
  recordProps.set(t.label, getVertexLabel(tdata.l));
  return [new Map([[t.id, tdata.recordId]]), recordProps];
};
var tinkerData = async (data, spec) => {
  return Promise.allSettled(data.flatMap((tdata) => {
    if (spec.type === "v") {
      const [idMap, recordProps] = tinkerDataVertex(tdata);
      return g.mergeV(idMap).option(merge.onCreate, recordProps).option(merge.onMatch, recordProps).toList();
    }
    return tinkerDataEdge(tdata).map(([idMap, recordProps]) => g.mergeE(idMap).option(merge.onCreate, recordProps).option(merge.onMatch, recordProps).toList());
  }).filter(Boolean)).then(recordsCreatedHandler);
};

// src/loader/transformers.ts
var validateNumStr = (value) => {
  if (typeof value !== "string" || typeof value !== "number")
    throw new Error(`invalid type, expected number|string, received: ${typeof value}`);
  return value;
};
var transformPropsAndLabels = (spec, headers, record) => {
  const p = { ...spec.inject?.p || {} }, l = spec.inject?.l?.slice() ?? [];
  record.forEach((col, i2) => {
    if (spec.colMap?.ignoreCols?.includes(i2))
      return;
    if (spec.colMap?.ignoreEmptyCol && String(col).length === 0)
      return;
    const header = headers[i2];
    const value = spec.colMap?.transform?.(i2, col) ?? col;
    if (spec.colMap?.p?.includes(i2))
      p[header] = value;
    else if (spec.colMap?.l?.includes(i2)) {
      if (l.length)
        p[header] = value;
      else
        l.push(validateNumStr(value));
    } else if (spec.colMap?.default) {
      switch (spec.colMap.default) {
        case "p":
          p[header] = value;
          break;
        default:
          if (l.length)
            p[header] = value;
          else
            l.push(validateNumStr(value));
      }
    }
  });
  return { p, l };
};
var csvToTinkerDataEdge = (spec, data, headers) => {
  return data.map((recordRaw, i) => {
    const record = spec.transformRecord?.(recordRaw) ?? recordRaw;
    const pl = transformPropsAndLabels(spec, headers, record);
    return {
      edges: spec.edges.map((edgeConfig) => {
        return {
          f: edgeConfig.f(pl, record),
          t: edgeConfig.t(pl, record),
          l: edgeConfig.l(pl, record),
          p: edgeConfig.p?.(pl) ?? {},
          recordId: edgeConfig.recordId(pl, record)
        };
      })
    };
  });
};
var csvToTinkerDataVertex = (spec, data, headers) => {
  return data.map((recordRaw, i) => {
    const record = spec.transformRecord?.(recordRaw) ?? recordRaw;
    const pl = transformPropsAndLabels(spec, headers, record);
    const recordId = spec.recordId(pl, record);
    return { recordId, ...pl };
  });
};
var csvToTinkerData = async (spec, dataParsed) => {
  const headers = spec.transformHeaders?.(dataParsed[0]) ?? dataParsed[0];
  switch (spec.type) {
    case "v":
      return csvToTinkerDataVertex(spec, dataParsed.slice(1), headers);
    case "e":
      return csvToTinkerDataEdge(spec, dataParsed.slice(1), headers);
  }
};

// src/loader/etl.ts
var csvs = new Set;
var csvsParsed = new Map;
var tinkerData2 = new Map;
var saveTinkerData = async (bname, spec, dataKey) => {
  if (!csvsParsed.has(bname))
    throw new Error(`csv not parsed: ${bname}`);
  tinkerData2.set(dataKey || bname, {
    spec,
    data: await csvToTinkerData(spec, csvsParsed.get(bname))
  });
};
var parseFile = async (bname, filepath) => {
  try {
    csvsParsed.set(bname, parse(await Bun.file(filepath).text()));
  } catch (e) {
    throw new Error(`invalid csv ${bname}: ${filepath}\n${e}`);
  }
};
var readCsvDir = async (csvDir) => {
  (await fs.readdir(csvDir)).filter((x) => x.endsWith(".csv")).forEach((fname) => csvs.add(fname));
  log("total csv files found", csvs.size);
};
var transformConfigFiles = async (config) => {
  if (!config.files)
    return;
  for (const [bnameOrDataKey, spec] of config.files) {
    const configSpec = typeof spec === "function" ? spec(bnameOrDataKey) : spec;
    if (configSpec.recursive) {
      await saveTinkerData(configSpec.recursive, configSpec, bnameOrDataKey);
    } else {
      const fname = bnameTofname(bnameOrDataKey);
      if (!csvs.has(fname))
        throw new Error(`could not find file: ${fname}`);
      csvs.delete(fname);
      await parseFile(bnameOrDataKey, `${config.csvDir}/${fname}`);
      await saveTinkerData(bnameOrDataKey, configSpec);
    }
  }
  log("transformed config.files", tinkerData2.size);
};
var transformUnmappedFiles = async (config) => {
  if (!config.includeUnmappedFiles)
    return;
  if (!config.getSpec)
    throw new Error("Including unmapped files requires config.getSpec to be defined");
  let filesProcessed = 0;
  for (const fname of csvs) {
    const bname = fnameToBname(fname);
    const configSpec = config.getSpec(bname);
    if (!configSpec)
      continue;
    filesProcessed++;
    csvs.delete(fname);
    await parseFile(bname, `${config.csvDir}/${fname}`);
    await saveTinkerData(bname, configSpec);
  }
  log(`
    unmapped csvs processed ${filesProcessed}
    unmapped csvs ignored: ${csvs.size}
    `);
};
var loadTinkerData = async (config) => {
  if (!tinkerData2.size)
    throw new Error(`
      no CSV files transformed. Did you correctly map CSV filenames to config specs?
      CSVs pared: ${csvsParsed.size}
      CSVs ignored: ${csvs.size}
      CSVs transformed: ${tinkerData2.size}
      `);
  for (const [dataKey, data] of tinkerData2.entries()) {
    const result = await tinkerData(data.data, data.spec);
    if (config.persistResultLog) {
      const logname = `${config.csvDir}/${dataKey}.csv.json`;
      Bun.write(logname, JSON.stringify(result || "result is empty"));
      log(`result log saved to ${logname}`);
    }
    log(`loaded ${dataKey} into tinkergraph`, {
      success: result?.success.length ?? 0,
      failure: result?.failure.length ?? 0
    });
  }
  log("total csvs loaded in tinkergraph", tinkerData2.size);
};
var csvToTinkergraph = async (config) => {
  await readCsvDir(config.csvDir);
  await transformConfigFiles(config);
  await transformUnmappedFiles(config);
  await loadTinkerData(config);
};
var tinkergraphToNeptuneCsv = () => null;
// src/query/queryUtils.ts
var { t: t2 } = common;
var { keys: keys2, values } = common.column;
var { addAll } = common.operator;
var { flatMap, identity, project, select, unfold, union, valueMap } = common.__;
var getBaseOpts = (overrides) => ({
  ...overrides,
  limitX: overrides.limitX ?? 0,
  limitY: overrides.limitY ?? (overrides.limitX ?? 0) + 10
});
var throwIfEmpty = (thing, received) => {
  if (!Array.isArray(received) || !received.length)
    throw new Error(`${thing} must be a non empty array\nreceived: ${received}`);
  return false;
};
var throwInvalidQuery = (reason, ...extra) => {
  throw new Error(`Invalid Query\n${reason}\n${JSON.stringify(extra)}`);
};
var elementProps = ({
  as = [],
  elements = identity(),
  elKeys = []
}) => {
  return elements.as(...as.concat("base")).valueMap(...elKeys).by(unfold()).sack(addAll).select("base").project("id", "label").by(t2.id).by(t2.label).sack(addAll);
};
var combineProps = ({
  elements = identity(),
  elKeys = [],
  traversals = []
}) => {
  return elements.local(union(project("id", "label").by(t2.id).by(t2.label), valueMap(...elKeys).by(unfold()), ...traversals).unfold().group().by(keys2).by(select(values)));
};
var groupByIdentity = ({
  elements = identity(),
  elKeys = []
}) => elements.group().by(elKeys[0] ?? t2.id).by(flatMap(identity()));
export {
  validateNumStr,
  transformUnmappedFiles,
  transformPropsAndLabels,
  transformConfigFiles,
  toJsonStringified,
  toJson,
  toBunBuffer,
  tinkergraphToNeptuneCsv,
  tinkerDataVertex,
  tinkerDataEdge,
  tinkerData,
  throwInvalidQuery,
  throwIfEmpty,
  saveTinkerData,
  recordsCreatedHandler,
  readCsvDir,
  pgDateToJs,
  parseFile,
  msgpackToJsonIterator,
  msgpackToJson,
  mapToJsonIterator,
  log,
  loadTinkerData,
  keys,
  jsonReplacer,
  hashId,
  groupByIdentity,
  go,
  getVertexLabel,
  getLabel,
  getEdgeLabel,
  getBaseOpts,
  g,
  fromBunBuffer,
  fnameToBname,
  extensionCodec,
  encoder,
  elementProps,
  deepFreezeCopy,
  decoder,
  csvToTinkergraph,
  csvToTinkerDataVertex,
  csvToTinkerDataEdge,
  csvToTinkerData,
  common,
  combineProps,
  client,
  bnameTofname,
  SET_EXT_TYPE,
  MSGPACK_HEADERS,
  MAP_EXT_TYPE,
  GroovyTraversalSource,
  GroovyTraversal,
  EDir
};
