#!/usr/bin/env bash

docker compose --profile utils build
docker compose run --rm --name utils utils bash
