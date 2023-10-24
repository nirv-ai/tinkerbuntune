# @see # @see https://github.com/apache/tinkerpop/tree/master/docker
# @see https://tinkerpop.apache.org/docs/current/reference/#gremlin-server-docker-image

# sync with latest neptune version
FROM tinkerpop/gremlin-server:3.6.2

COPY server/air-routes.yaml /opt/gremlin-server/conf/gremlin-server.yaml
COPY server/tinkergraph-empty.properties /opt/gremlin-server/conf/tinkergraph-empty.properties
