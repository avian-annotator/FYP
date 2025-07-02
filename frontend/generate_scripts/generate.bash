#!/bin/bash
if ! curl -sSf http://localhost:8080/v3/api-docs > /dev/null; then
  echo "localhost:8080 is not running or /v3/api-docs is unavailable."
  exit 1
fi

rm -rf generated
mkdir generated

# Check if localhost:8080 is responding
if ! curl -sf http://localhost:8080/v3/api-docs -o generated/openapi.json; then
  echo "localhost:8080 is not running or /v3/api-docs is unavailable."
  exit 1
fi

cd generated
docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli generate -i /local/openapi.json -g typescript-axios -o /local/axios
cd ..

cd generate_scripts
bun generate-use-query-hooks.ts
cd ..
