#!/usr/bin/env bash

docker compose --profile bun build
docker compose run --rm --name gbun gbun bash
