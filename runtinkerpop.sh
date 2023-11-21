#!/usr/bin/env bash

# @see https://github.com/apache/tinkerpop/tree/master/docker
# @see https://tinkerpop.apache.org/docs/current/reference/#gremlin-console-docker-image

docker compose --profile console build
docker compose --profile console up -d
