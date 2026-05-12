param(
  [string]$ZipPath,
  [string]$TargetDir
)

$ErrorActionPreference = "Stop"

if (-not $TargetDir) {
  $TargetDir = $PSScriptRoot
}

if (-not $ZipPath) {
  $ZipPath = Read-Host "Drag the latest NudgeEAPDesignSystem-Windows.zip here, then press Enter"
}

$ZipPath = $ZipPath.Trim().Trim('"')
$TargetDir = (Resolve-Path $TargetDir).Path

if (-not (Test-Path $ZipPath)) {
  throw "Zip file not found: $ZipPath"
}

$TempDir = Join-Path ([System.IO.Path]::GetTempPath()) ("nudge-eap-ds-update-" + [System.Guid]::NewGuid())
New-Item -ItemType Directory -Path $TempDir | Out-Null

try {
  Expand-Archive -LiteralPath $ZipPath -DestinationPath $TempDir -Force

  $ExpandedRoot = Join-Path $TempDir "NudgeEAPDesignSystem-Windows"
  if (-not (Test-Path $ExpandedRoot)) {
    $Dirs = Get-ChildItem -Path $TempDir -Directory
    if ($Dirs.Count -eq 1) {
      $ExpandedRoot = $Dirs[0].FullName
    }
  }

  if (-not (Test-Path (Join-Path $ExpandedRoot "nudge-eap-mcp.cmd"))) {
    throw "Invalid bundle zip. nudge-eap-mcp.cmd was not found."
  }

  Write-Host "Updating bundle:"
  Write-Host "  From: $ExpandedRoot"
  Write-Host "  To:   $TargetDir"

  Copy-Item -Path (Join-Path $ExpandedRoot "*") -Destination $TargetDir -Recurse -Force

  Write-Host ""
  Write-Host "Bundle files updated."

  $SetupCmd = Join-Path $TargetDir "setup-env.cmd"
  if (Test-Path $SetupCmd) {
    Write-Host ""
    Write-Host "Checking Node.js/pnpm environment..."
    & $SetupCmd --no-pause
    if ($LASTEXITCODE -ne 0) {
      throw "setup-env.cmd failed with exit code $LASTEXITCODE"
    }
  }

  Write-Host ""
  Write-Host "Update complete. Restart Claude/Codex."
  Write-Host "If mockup projects need updated DS packages, run install-ds-packages.cmd in each mockup project."
  exit 0
} finally {
  Remove-Item -Path $TempDir -Recurse -Force -ErrorAction SilentlyContinue
}
