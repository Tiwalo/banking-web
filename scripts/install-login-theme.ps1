# Install into the existing local development container. Client selection is in the setup guide.
param([string] $Container = 'banking-core-api-keycloak-1')
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$theme = '/opt/keycloak/themes/tiwalo'
docker exec $Container mkdir -p "$theme/login/resources/fonts" "$theme/login/resources/img"
if ($LASTEXITCODE) { throw 'Cannot create the Keycloak theme directory.' }
function Copy-ThemeAsset([string] $Source, [string] $Target) {
    docker cp (Join-Path $root $Source) ("${Container}:" + $Target)
    if ($LASTEXITCODE) { throw "Could not install $Source." }
}
Copy-ThemeAsset 'keycloak/tiwalo/login/.' "$theme/login/"
Copy-ThemeAsset 'assets/fonts/InterVariable.woff2' "$theme/login/resources/fonts/"
Copy-ThemeAsset 'assets/fonts/OFL.txt' "$theme/login/resources/fonts/"
Copy-ThemeAsset 'public/images/terraces-720.webp' "$theme/login/resources/img/terraces.webp"
