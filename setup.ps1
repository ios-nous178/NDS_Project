# ──────────────────────────────────────────────
# NudgeEAP Design System — 원커맨드 환경 세팅
# Windows PowerShell 전용
#
# 사용법:
#   PowerShell에서:  .\setup.ps1
#
# 실행 정책 에러 시:
#   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
# ──────────────────────────────────────────────

$ErrorActionPreference = "Stop"
$REQUIRED_NODE_MAJOR = 20
$REQUIRED_PNPM_MAJOR = 9

function Info($msg)  { Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Ok($msg)    { Write-Host "[OK] $msg" -ForegroundColor Green }
function Warn($msg)  { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Fail($msg)  { Write-Host "[FAIL] $msg" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host "  NudgeEAP Design System - 환경 세팅" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host ""

# ──────────────────────────────────────────
# 1. Node.js 확인
# ──────────────────────────────────────────
Info "Node.js 확인 중..."

$nodeExists = Get-Command node -ErrorAction SilentlyContinue

if ($nodeExists) {
    $nodeVersion = (node -v) -replace 'v', ''
    $nodeMajor = [int]($nodeVersion.Split('.')[0])

    if ($nodeMajor -ge $REQUIRED_NODE_MAJOR) {
        Ok "Node.js v$nodeVersion 설치됨"
    } else {
        Warn "Node.js v$nodeVersion 감지 - v${REQUIRED_NODE_MAJOR}.x 이상이 필요합니다"

        # volta 시도
        $voltaExists = Get-Command volta -ErrorAction SilentlyContinue
        if ($voltaExists) {
            Info "volta로 Node $REQUIRED_NODE_MAJOR 설치 중..."
            volta install "node@$REQUIRED_NODE_MAJOR"
            Ok "Node.js $(node -v) 설치 완료"
        }
        # fnm 시도
        elseif (Get-Command fnm -ErrorAction SilentlyContinue) {
            Info "fnm으로 Node $REQUIRED_NODE_MAJOR 설치 중..."
            fnm install $REQUIRED_NODE_MAJOR
            fnm use $REQUIRED_NODE_MAJOR
            Ok "Node.js $(node -v) 전환 완료"
        }
        # nvm-windows 시도
        elseif (Get-Command nvm -ErrorAction SilentlyContinue) {
            Info "nvm으로 Node $REQUIRED_NODE_MAJOR 설치 중..."
            nvm install $REQUIRED_NODE_MAJOR
            nvm use $REQUIRED_NODE_MAJOR
            Ok "Node.js $(node -v) 전환 완료"
        }
        else {
            Fail @"
Node.js v${REQUIRED_NODE_MAJOR}.x 이상이 필요합니다.
설치 방법:
  - https://nodejs.org 에서 LTS 다운로드
  - 또는: winget install OpenJS.NodeJS.LTS
  - 또는: volta install node@$REQUIRED_NODE_MAJOR
"@
        }
    }
} else {
    # Node 없음 — volta/fnm/nvm 시도
    $voltaExists = Get-Command volta -ErrorAction SilentlyContinue
    if ($voltaExists) {
        Info "volta로 Node $REQUIRED_NODE_MAJOR 설치 중..."
        volta install "node@$REQUIRED_NODE_MAJOR"
        Ok "Node.js $(node -v) 설치 완료"
    }
    elseif (Get-Command fnm -ErrorAction SilentlyContinue) {
        Info "fnm으로 Node $REQUIRED_NODE_MAJOR 설치 중..."
        fnm install $REQUIRED_NODE_MAJOR; fnm use $REQUIRED_NODE_MAJOR
        Ok "Node.js $(node -v) 전환 완료"
    }
    elseif (Get-Command winget -ErrorAction SilentlyContinue) {
        Info "winget으로 Node.js 설치 중..."
        winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
        # PATH 갱신 필요
        $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
        Ok "Node.js 설치 완료 — 터미널을 재시작해야 할 수 있습니다"
    }
    else {
        Fail @"
Node.js가 설치되어 있지 않습니다.
설치 방법:
  - https://nodejs.org 에서 v${REQUIRED_NODE_MAJOR} LTS 다운로드
  - 또는: winget install OpenJS.NodeJS.LTS
"@
    }
}

# ──────────────────────────────────────────
# 2. pnpm 확인/설치
# ──────────────────────────────────────────
Info "pnpm 확인 중..."

$pnpmExists = Get-Command pnpm -ErrorAction SilentlyContinue

if ($pnpmExists) {
    $pnpmVersion = pnpm -v
    $pnpmMajor = [int]($pnpmVersion.Split('.')[0])

    if ($pnpmMajor -ge $REQUIRED_PNPM_MAJOR) {
        Ok "pnpm v$pnpmVersion 설치됨"
    } else {
        Info "pnpm 업그레이드 중..."
        npm install -g "pnpm@$REQUIRED_PNPM_MAJOR"
        Ok "pnpm v$(pnpm -v) 설치 완료"
    }
} else {
    Info "pnpm 설치 중..."
    # corepack 시도
    $corepackExists = Get-Command corepack -ErrorAction SilentlyContinue
    if ($corepackExists) {
        corepack enable
        try { corepack prepare "pnpm@$REQUIRED_PNPM_MAJOR" --activate } catch { npm install -g "pnpm@$REQUIRED_PNPM_MAJOR" }
    } else {
        npm install -g "pnpm@$REQUIRED_PNPM_MAJOR"
    }
    Ok "pnpm v$(pnpm -v) 설치 완료"
}

# ──────────────────────────────────────────
# 3. 의존성 설치
# ──────────────────────────────────────────
Info "의존성 설치 중... (처음에는 시간이 좀 걸립니다)"
try { pnpm install --frozen-lockfile } catch { pnpm install }
Ok "의존성 설치 완료"

# ──────────────────────────────────────────
# 4. 토큰 빌드
# ──────────────────────────────────────────
Info "디자인 토큰 빌드 중..."
pnpm build --filter @nudge-eap/tokens
Ok "토큰 빌드 완료"

# ──────────────────────────────────────────
# 5. 스토리북 실행
# ──────────────────────────────────────────
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host "  세팅 완료! 스토리북을 실행합니다." -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host ""
Write-Host "  브라우저에서 열리는 URL을 확인하세요."
Write-Host "  종료하려면 Ctrl+C"
Write-Host ""

pnpm --filter storybook dev
