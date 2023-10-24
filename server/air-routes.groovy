// @see https://kelvinlawrence.net/book/Gremlin-Graph-Guide.html#servertinkergraph

def globals = [:]

globals << [hook : [
  onStartUp: { ctx ->
    ctx.logger.info("Loading 'air-routes' graph data.")
    graph.io(graphml()).readGraph('data/air-routes.graphml')
  }
] as LifeCycleHook]

globals << [g : graph.traversal()]
