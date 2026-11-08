#!/usr/bin/env bash
# Sustituye estos valores antes de ejecutar.
set -euo pipefail
ACCOUNT=TU_CUENTA
REGION=eu-west-3
REPO=miax-suma
REGISTRY="$ACCOUNT.dkr.ecr.$REGION.amazonaws.com"

aws ecr create-repository --repository-name "$REPO" --region "$REGION"
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$REGISTRY"
docker build --platform linux/amd64 -t "$REGISTRY/$REPO:latest" .
docker push "$REGISTRY/$REPO:latest"

# Para probar en local:
# docker run -p 8080:8080 "$REGISTRY/$REPO:latest"
