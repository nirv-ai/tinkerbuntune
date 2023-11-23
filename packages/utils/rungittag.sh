#!/usr/bin/env bash

git tag -f $(cat ./package.json | jq -r .version)
