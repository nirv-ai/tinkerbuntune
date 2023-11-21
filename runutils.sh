#!/usr/bin/env bash

docker compose --profile tinkerbuntune-utils build
docker compose run --rm --name tinkerbuntune-utils tinkerbuntune-utils bash
