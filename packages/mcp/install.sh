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

# 이미 등록돼 있으면 제거 후 재등록(경로/옵션 갱신).
claude mcp remove "$NAME" --scope user >/dev/null 2>&1 || true
claude mcp add "$NAME" --scope user \
  -e NUDGE_DS_INSTALL_MODE=mcpb \
  -e "NUDGE_DS_UPDATE_URL=$ORIGIN/$PREFIX/version.json" \
  -- node "$BOOTSTRAP"

echo "[nudge-ds] ✓ 설치 완료. Claude Code 를 재시작하면 nudge-ds MCP 가 뜹니다."
echo "[nudge-ds]   업데이트는 자동 — S3 가 갱신되면 다음 실행부터 반영됩니다."
