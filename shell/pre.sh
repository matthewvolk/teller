#!/bin/bash

set -u # Script exits with reference error
set -e # Exit if any command [1] has a non-zero exit status

cd "$(git rev-parse --show-toplevel)"

set +e

RED='\033[0;31m'
GREEN='\033[0;32m'
COLOR_RESET='\033[0m'

DOCKER_VERSION=$(docker -v)

if [ $? -gt 0 ]; then
  printf "\n${RED}[ERROR] Docker is not installed. Please install Docker CLI version 20.10.17 or higher.${COLOR_RESET}\n\n"
  exit 1
fi

DOCKER_COMPOSE_VERSION=$(docker-compose -v)

if [ $? -gt 0 ]; then
  printf "\n${RED}[ERROR] Docker Compose is not installed. Please install Docker Compose CLI version 2.6.1 or higher.${COLOR_RESET}\n\n\e[0m"
  exit 1
fi
