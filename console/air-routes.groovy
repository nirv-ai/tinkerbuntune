// @see https://github.com/krlawrence/graph/blob/main/sample-data/load-air-routes-graph-34.groovy
// You can use this file to load the air-routes graph from the Gremlin Console

// To execute use the console command ":load scripts/air-routes.groovy"
airRoutesData = "/opt/gremlin-console/data/air-routes.graphml"

conf = new BaseConfiguration()
conf.setProperty("gremlin.tinkergraph.vertexIdManager","LONG")
conf.setProperty("gremlin.tinkergraph.edgeIdManager","LONG")
conf.setProperty("gremlin.tinkergraph.vertexPropertyIdManager","LONG")

graph = TinkerGraph.open(conf)
graph.io(graphml()).readGraph(airRoutesData);
g = traversal().withEmbedded(graph);
