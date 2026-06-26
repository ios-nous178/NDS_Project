#!/bin/sh
# Nudge DS MCP — 터미널(Claude Code) 원클릭 설치.
#
#   curl -fsSL https://nudge-design-assets.s3.ap-northeast-2.amazonaws.com/nds-assets/mcp/install.sh | sh
#
# 하는 일: 자기갱신 부트스트랩(bootstrap.mjs)을 ~/.nudge-ds 에 받아두고,
#          Claude Code 에 stdio MCP 서버로 등록(user scope)한다.
#          실제 본체는 부트스트랩이 첫 실행 때 S3 에서 받아오고, 이후 자동 갱신된다.
set -eu

ORIGIN="${NUDGE_DS_ASSET_CDN_ORIGIN:-https://nudge-design-assets.s3.ap-northeast-2.amazonaws.com}"
PREFIX="nds-assets/mcp"
HOME_DIR="${NUDGE_DS_HOME:-$HOME/.nudge-ds}"
BOOTSTRAP="$HOME_DIR/bootstrap.mjs"
NAME="nudge-ds"
# 과거 이름으로 등록돼 남아있을 수 있는 중복 서버(레거시). 새 이름이 더 생기면 여기만 추가.
#   nudge-eap-ds        — 옛 외부 프로젝트 CLAUDE.md 템플릿이 안내하던 서버명
#   nudge-design-system — 구 서버 id / enabledMcpjsonServers 잔재
LEGACY_NAMES="nudge-eap-ds nudge-design-system"

echo "[nudge-ds] 부트스트랩 다운로드 → $BOOTSTRAP"
mkdir -p "$HOME_DIR"
curl -fsSL "$ORIGIN/$PREFIX/bootstrap.mjs" -o "$BOOTSTRAP"

if ! command -v node >/dev/null 2>&1; then
  echo "[nudge-ds] ⚠ node 가 필요합니다 (Node 20+). 설치 후 다시 실행하세요." >&2
  exit 1
fi

if ! command -v claude >/dev/null 2>&1; then
  echo "[nudge-ds] claude CLI 가 없어 자동 등록을 건너뜁니다." >&2
  echo "  수동 등록:" >&2
  echo "  claude mcp add $NAME --scope user -- node \"$BOOTSTRAP\"" >&2
  exit 0
fi

# 정리 — 레거시 이름은 물론 현행 nudge-ds 도 제거한다.
# 현행이 다른 경로(옛 dist/server.js 직접 등록·구 부트스트랩 경로)나 다른 scope 로
# 깔려 있으면 user scope 재등록만으론 낡은 게 계속 이기므로(local>user), 전부 지운 뒤
# 아래에서 단일 user scope 로 깨끗이 재등록한다. scope 를 몰라 local·user 둘 다 시도.
# (project scope=.mcp.json 은 레포 커밋 설정이라 의도적으로 건드리지 않는다.)
for name in $LEGACY_NAMES "$NAME"; do
  for scope in local user; do
    claude mcp remove "$name" --scope "$scope" >/dev/null 2>&1 || true
  done
done
if command -v codex >/dev/null 2>&1; then
  for name in $LEGACY_NAMES "$NAME"; do
    codex mcp remove "$name" >/dev/null 2>&1 || true
  done
fi

# 깨끗한 단일 재등록 (user scope · 현재 부트스트랩 경로/옵션으로).
claude mcp add "$NAME" --scope user \
  -e NUDGE_DS_INSTALL_MODE=mcpb \
  -e "NUDGE_DS_UPDATE_URL=$ORIGIN/$PREFIX/version.json" \
  -- node "$BOOTSTRAP"

echo "[nudge-ds] ✓ 설치 완료. Claude Code 를 재시작하면 nudge-ds MCP 가 뜹니다."
echo "[nudge-ds]   업데이트는 자동 — S3 가 갱신되면 다음 실행부터 반영됩니다."
