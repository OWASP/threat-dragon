[CmdletBinding()]
param(
    [Alias("h")]
    [switch]$Help,
    [string]$Tag,
    [string]$ArtifactDirectory
)

$ErrorActionPreference = "Stop"
$Repository = "OWASP/threat-dragon"

function Show-Usage {
    Write-Host "Usage: td-finish-windows-release.ps1 -Tag vMAJOR.MINOR.PATCH[-RCNUMBER] -ArtifactDirectory PATH"
    Write-Host ""
    Write-Host "Generate Windows updater files from a signed installer and upload them to a draft release."
}

function Fail([string]$Message) {
    [Console]::Error.WriteLine("td-finish-windows-release.ps1: $Message")
    exit 2
}

if ($Help) {
    Show-Usage
    exit 0
}

if (-not $Tag -or -not $ArtifactDirectory) {
    Show-Usage
    Fail "provide both -Tag and -ArtifactDirectory"
}

if ($Tag -cnotmatch '^v(?<Version>\d+\.\d+\.\d+(?:-RC[1-9]\d*)?)$') {
    Fail "tag must match vMAJOR.MINOR.PATCH or vMAJOR.MINOR.PATCH-RCNUMBER"
}

$Version = $Matches.Version
if (-not (Test-Path -PathType Container $ArtifactDirectory)) {
    Fail "artifact directory not found: $ArtifactDirectory"
}
$ArtifactDirectory = (Resolve-Path $ArtifactDirectory -ErrorAction Stop).Path
$InstallerName = "Threat-Dragon-ng-Setup-$Version.exe"
$Installer = Join-Path $ArtifactDirectory $InstallerName
$LatestFile = Join-Path $ArtifactDirectory "latest.yml"
$ChecksumFile = Join-Path $ArtifactDirectory "checksum.yml"
$BlockmapFile = "$Installer.blockmap"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$BlockmapModule = Join-Path $RepoRoot "td.vue/node_modules/app-builder-lib/out/targets/blockmap/blockmap.js"

foreach ($Command in @("node", "gh", "signtool")) {
    if (-not (Get-Command $Command -ErrorAction SilentlyContinue)) {
        Fail "required command not found: $Command"
    }
}

foreach ($File in @($Installer, $BlockmapModule)) {
    if (-not (Test-Path -PathType Leaf $File)) {
        Fail "required file not found: $File"
    }
}

$ReleaseJson = gh release view $Tag --repo $Repository --json isDraft,tagName
if ($LASTEXITCODE -ne 0) {
    Fail "GitHub draft release not found for $Tag"
}

try {
    $Release = $ReleaseJson | ConvertFrom-Json
} catch {
    Fail "GitHub returned invalid release data for $Tag"
}

if ($Release.tagName -ne $Tag) {
    Fail "GitHub returned the wrong release tag: $($Release.tagName)"
}
if (-not $Release.isDraft) {
    Fail "release $Tag is not a draft; no files were uploaded"
}

signtool verify /pa /all /v $Installer
if ($LASTEXITCODE -ne 0) {
    Fail "Windows signature verification failed for $InstallerName"
}

$BlockmapCode = "require(process.argv[1]).buildBlockMap(process.argv[2], 'gzip', process.argv[2] + '.blockmap').then(result => console.log(JSON.stringify(result)))"
$BlockmapJson = node -e $BlockmapCode $BlockmapModule $Installer
if ($LASTEXITCODE -ne 0) {
    Fail "could not generate the blockmap for $InstallerName"
}

try {
    $Blockmap = $BlockmapJson | ConvertFrom-Json
} catch {
    Fail "blockmap generator returned an invalid result for $InstallerName"
}

if (-not (Test-Path -PathType Leaf $BlockmapFile) -or (Get-Item $BlockmapFile).Length -eq 0) {
    Fail "blockmap was not created for $InstallerName"
}

$ReleaseDate = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
$LatestMetadata = @(
    "version: $Version"
    "files:"
    "  - url: $InstallerName"
    "    sha512: $($Blockmap.sha512)"
    "    size: $($Blockmap.size)"
    "path: $InstallerName"
    "sha512: $($Blockmap.sha512)"
    "releaseDate: '$ReleaseDate'"
)
[System.IO.File]::WriteAllText($LatestFile, ($LatestMetadata -join "`n") + "`n")

$Hash = (Get-FileHash $Installer -Algorithm SHA512).Hash.ToLowerInvariant()
"$Hash  $InstallerName" | Set-Content -NoNewline -Encoding ascii $ChecksumFile

foreach ($File in @($Installer, $BlockmapFile, $LatestFile, $ChecksumFile)) {
    if (-not (Test-Path -PathType Leaf $File) -or (Get-Item $File).Length -eq 0) {
        Fail "release file is missing or empty: $File"
    }
}

$UploadFiles = @($Installer, $BlockmapFile, $LatestFile, $ChecksumFile)
gh release upload $Tag @UploadFiles --repo $Repository --clobber
if ($LASTEXITCODE -ne 0) {
    Fail "GitHub upload failed for $Tag"
}

Write-Host "Updated the Windows files in draft release $Tag."
