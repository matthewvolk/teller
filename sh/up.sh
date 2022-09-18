#!/bin/bash

source "$(git rev-parse --show-toplevel)/sh/pre.sh"

set -e # Enable set -e

# Build Node image
docker build -t teller .

# Start containers
docker compose up
