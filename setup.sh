#!/usr/bin/env bash
# ──────────────────────────────────────────────
# NudgeEAP Design System — 원커맨드 환경 세팅
# macOS / Linux / Windows (Git Bash, WSL)
#
# 사용법:
#   Mac/Linux:  ./setup.sh
#   Windows:    bash setup.sh  (Git Bash 또는 WSL에서)
#
# 이미 설치된 것이 있으면 건너뜁니다.
# ──────────────────────────────────────────────

set -e

# 색상 (터미널 지원 시)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
fail()  { echo -e "${RED}[FAIL]${NC} $1"; exit 1; }

REQUIRED_NODE_MAJOR=20
REQUIRED_PNPM_MAJOR=9

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  NudgeEAP Design System — 환경 세팅"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ──────────────────────────────────────────
# 1. Node.js 확인
# ──────────────────────────────────────────
info "Node.js 확인 중..."

if command -v node &>/dev/null; then
  NODE_VERSION=$(node -v | sed 's/v//')
  NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)

  if [ "$NODE_MAJOR" -ge "$REQUIRED_NODE_MAJOR" ]; then
    ok "Node.js v${NODE_VERSION} 설치됨"
  else
    warn "Node.js v${NODE_VERSION} 감지 — v${REQUIRED_NODE_MAJOR}.x 이상이 필요합니다"

    # nvm이 있으면 자동 전환 시도
    if command -v nvm &>/dev/null; then
      info "nvm으로 Node ${REQUIRED_NODE_MAJOR} 설치/전환 중..."
      nvm install "$REQUIRED_NODE_MAJOR" && nvm use "$REQUIRED_NODE_MAJOR"
      ok "Node.js $(node -v) 전환 완료"
    elif command -v volta &>/dev/null; then
      info "volta로 Node ${REQUIRED_NODE_MAJOR} 설치 중..."
      volta install "node@${REQUIRED_NODE_MAJOR}"
      ok "Node.js $(node -v) 설치 완료"
    elif command -v fnm &>/dev/null; then
      info "fnm으로 Node ${REQUIRED_NODE_MAJOR} 설치 중..."
      fnm install "$REQUIRED_NODE_MAJOR" && fnm use "$REQUIRED_NODE_MAJOR"
      ok "Node.js $(node -v) 전환 완료"
    else
      fail "Node.js v${REQUIRED_NODE_MAJOR}.x 이상이 필요합니다.
  설치 방법:
    - https://nodejs.org 에서 LTS 다운로드
    - 또는: brew install node@${REQUIRED_NODE_MAJOR}  (Mac)
    - 또는: nvm install ${REQUIRED_NODE_MAJOR}
    - 또는: volta install node@${REQUIRED_NODE_MAJOR}"
    fi
  fi
else
  # Node 자체가 없음
  # volta가 있으면 자동 설치
  if command -v volta &>/dev/null; then
    info "volta로 Node ${REQUIRED_NODE_MAJOR} 설치 중..."
    volta install "node@${REQUIRED_NODE_MAJOR}"
    ok "Node.js $(node -v) 설치 완료"
  elif command -v nvm &>/dev/null; then
    info "nvm으로 Node ${REQUIRED_NODE_MAJOR} 설치 중..."
    nvm install "$REQUIRED_NODE_MAJOR" && nvm use "$REQUIRED_NODE_MAJOR"
    ok "Node.js $(node -v) 설치 완료"
  elif command -v fnm &>/dev/null; then
    info "fnm으로 Node ${REQUIRED_NODE_MAJOR} 설치 중..."
    fnm install "$REQUIRED_NODE_MAJOR" && fnm use "$REQUIRED_NODE_MAJOR"
    ok "Node.js $(node -v) 전환 완료"
  else
    fail "Node.js가 설치되어 있지 않습니다.
  설치 방법:
    - https://nodejs.org 에서 v${REQUIRED_NODE_MAJOR} LTS 다운로드
    - 또는: brew install node@${REQUIRED_NODE_MAJOR}  (Mac)
    - 또는: winget install OpenJS.NodeJS.LTS  (Windows)"
  fi
fi

# ──────────────────────────────────────────
# 2. pnpm 확인/설치
# ──────────────────────────────────────────
info "pnpm 확인 중..."

if command -v pnpm &>/dev/null; then
  PNPM_VERSION=$(pnpm -v)
  PNPM_MAJOR=$(echo "$PNPM_VERSION" | cut -d. -f1)

  if [ "$PNPM_MAJOR" -ge "$REQUIRED_PNPM_MAJOR" ]; then
    ok "pnpm v${PNPM_VERSION} 설치됨"
  else
    info "pnpm v${PNPM_VERSION} → v${REQUIRED_PNPM_MAJOR}.x 로 업그레이드 중..."
    npm install -g "pnpm@${REQUIRED_PNPM_MAJOR}"
    ok "pnpm v$(pnpm -v) 설치 완료"
  fi
else
  info "pnpm 설치 중..."

  # corepack이 있으면 사용 (Node 16.9+ 내장)
  if command -v corepack &>/dev/null; then
    corepack enable
    corepack prepare "pnpm@${REQUIRED_PNPM_MAJOR}" --activate 2>/dev/null || npm install -g "pnpm@${REQUIRED_PNPM_MAJOR}"
  else
    npm install -g "pnpm@${REQUIRED_PNPM_MAJOR}"
  fi

  ok "pnpm v$(pnpm -v) 설치 완료"
fi

# ──────────────────────────────────────────
# 3. 의존성 설치
# ──────────────────────────────────────────
info "의존성 설치 중... (처음에는 시간이 좀 걸립니다)"
pnpm install --frozen-lockfile 2>/dev/null || pnpm install
ok "의존성 설치 완료"

# ──────────────────────────────────────────
# 4. 토큰 빌드
# ──────────────────────────────────────────
info "디자인 토큰 빌드 중..."
pnpm build --filter @nudge-eap/tokens
ok "토큰 빌드 완료"

# ──────────────────────────────────────────
# 5. 스토리북 실행
# ──────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "  ${GREEN}세팅 완료!${NC} 스토리북을 실행합니다."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  브라우저에서 열리는 URL을 확인하세요."
echo "  종료하려면 Ctrl+C"
echo ""

pnpm --filter storybook dev
