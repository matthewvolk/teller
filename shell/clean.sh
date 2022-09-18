#!/bin/bash

source "$(git rev-parse --show-toplevel)/shell/pre.sh"

printf "${GREEN}[teller] Removing Docker containers...${COLOR_RESET}\n"

# Remove Docker containers
DOCKER_CONTAINERS=$(docker ps -aq)
docker rm -f $DOCKER_CONTAINERS

printf "${GREEN}[teller] Success${COLOR_RESET}\n"

printf "${GREEN}[teller] Removing Docker images...${COLOR_RESET}\n"

# Remove Docker images
DOCKER_IMAGES=$(docker images -aq)
docker rmi -f $DOCKER_IMAGES

printf "${GREEN}[teller] Success${COLOR_RESET}\n"

printf "${GREEN}[teller] Deleting local Docker Database copy...${COLOR_RESET}\n"

# Delete local Docker Database Directory
rm -rf ./tmp

printf "${GREEN}[teller] Success${COLOR_RESET}\n"

printf "${GREEN}[teller] Removing Docker volumes...${COLOR_RESET}\n"

# Ensure Docker volumes are removed
DOCKER_VOLUMES=$(docker volume ls -q)
docker volume rm $DOCKER_VOLUMES

printf "${GREEN}[teller] Success${COLOR_RESET}\n\n"
printf "${GREEN}[teller] Successfully cleaned all existing Docker artifacts!${COLOR_RESET}\n"

exit 0
