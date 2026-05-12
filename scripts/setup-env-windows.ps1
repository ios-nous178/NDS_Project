$ErrorActionPreference = "Stop"

$RootCandidates = @($PSScriptRoot, (Join-Path $PSScriptRoot ".."))
$Root = $null
foreach ($Candidate in $RootCandidates) {
  $Resolved = Resolve-Path $Candidate -ErrorAction SilentlyContinue
  if ($Resolved -and (Test-Path (Join-Path $Resolved "package.json"))) {
    $Root = $Resolved
    break
  }
}
if (-not $Root) {
  throw "Could not find package.json near setup-env-windows.ps1."
}
$PackageJson = Get-Content (Join-Path $Root "package.json") -Raw | ConvertFrom-Json
$RequiredNodeVersion = if ($PackageJson.volta.node) { $PackageJson.volta.node } else { $PackageJson.engines.node -replace "\.x$", ".0" }
$RequiredNodeMajor = [int]($RequiredNodeVersion.Split(".")[0])
$RequiredPnpmVersion = ($PackageJson.packageManager -replace "^pnpm@", "")
$NoPause = $args -contains "--no-pause"

function Has-Command($Name) {
  return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

function Wait-IfNeeded {
  if (-not $NoPause) {
    Write-Host ""
    Read-Host "Press Enter to close"
  }
}

function Run-Step($Label, $Command, $Arguments) {
  Write-Host ""
  Write-Host "==> $Label"
  & $Command @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "$Label failed with exit code $LASTEXITCODE"
  }
}

function Get-NodeVersion {
  if (-not (Has-Command "node")) {
    return $null
  }
  return (& node -p "process.versions.node").Trim()
}

function Ensure-Node {
  $nodeVersion = Get-NodeVersion
  if ($nodeVersion) {
    $major = [int]($nodeVersion.Split(".")[0])
    if ($major -eq $RequiredNodeMajor) {
      Write-Host "Node.js OK: v$nodeVersion"
      return
    }
    Write-Host "Node.js version mismatch: v$nodeVersion found, v$RequiredNodeMajor.x required."
  } else {
    Write-Host "Node.js is not installed or not available in PATH."
  }

  if (Has-Command "nvm") {
    Write-Host "nvm-windows found. Installing/using Node.js $RequiredNodeVersion..."
    Run-Step "nvm install $RequiredNodeVersion" "nvm" @("install", $RequiredNodeVersion)
    Run-Step "nvm use $RequiredNodeVersion" "nvm" @("use", $RequiredNodeVersion)

    $nodeVersion = Get-NodeVersion
    if (-not $nodeVersion) {
      throw "Node.js is still not available. Close this terminal, open it again, and run setup-env.cmd once more."
    }
    Write-Host "Node.js OK: v$nodeVersion"
    return
  }

  if (Has-Command "winget") {
    Write-Host "nvm-windows is not installed."
    Write-Host "Installing nvm-windows with winget. Windows may ask for permission."
    Run-Step "winget install nvm-windows" "winget" @("install", "-e", "--id", "CoreyButler.NVMforWindows")
    throw "nvm-windows was installed. Close this terminal, open it again, and run setup-env.cmd once more."
  }

  throw "Install Node.js $RequiredNodeMajor.x or nvm-windows first, then run setup-env.cmd again."
}

function Ensure-Pnpm {
  if (Has-Command "pnpm") {
    $version = (& pnpm -v).Trim()
    Write-Host "pnpm OK: v$version"
    return
  }

  Write-Host "pnpm is not installed."
  if (Has-Command "corepack") {
    Run-Step "corepack enable" "corepack" @("enable")
    Run-Step "corepack prepare pnpm@$RequiredPnpmVersion" "corepack" @("prepare", "pnpm@$RequiredPnpmVersion", "--activate")
  } elseif (Has-Command "npm") {
    Run-Step "npm install -g pnpm@$RequiredPnpmVersion" "npm" @("install", "-g", "pnpm@$RequiredPnpmVersion")
  } else {
    throw "npm/corepack not found. Reinstall Node.js, then run setup-env.cmd again."
  }

  if (-not (Has-Command "pnpm")) {
    throw "pnpm was installed but is not available in PATH. Close this terminal, open it again, and run setup-env.cmd once more."
  }
  $version = (& pnpm -v).Trim()
  Write-Host "pnpm OK: v$version"
}

try {
  Ensure-Node
  Ensure-Pnpm
  Write-Host ""
  Write-Host "Environment is ready."
  Wait-IfNeeded
  exit 0
} catch {
  Write-Host ""
  Write-Host "Environment setup needs attention:"
  Write-Host $_.Exception.Message
  Wait-IfNeeded
  exit 1
}
