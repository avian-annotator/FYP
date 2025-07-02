try {
    Invoke-RestMethod -Uri http://localhost:8080/v3/api-docs -OutFile generated\openapi.json -ErrorAction Stop
} catch {
    Write-Host "localhost:8080 is not running or /v3/api-docs is unavailable."
    exit 1
}

Remove-Item -Recurse -Force generated -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path generated

# Check if localhost:8080 is responding
try {
    $response = Invoke-WebRequest -Uri http://localhost:8080/v3/api-docs -OutFile generated/openapi.json -TimeoutSec 5 -ErrorAction Stop
} catch {
    Write-Error "localhost:8080 is not running or /v3/api-docs is unavailable."
    exit 1
}

Set-Location generated
docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli generate -i /local/openapi.json -g typescript-axios -o /local/out
Set-Location ..

Set-Location generate_scripts
bun generate-use-query-hooks.ts
Set-Location ..
