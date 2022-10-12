#!/bin/bash

source "$(git rev-parse --show-toplevel)/shell/pre.sh"

set -e # Enable set -e

DOCKER_PSQL_CONTAINER=$(docker ps -qf "name=teller-db-1")

docker exec -it $DOCKER_PSQL_CONTAINER psql -U postgres teller
