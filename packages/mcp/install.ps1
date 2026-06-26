# Nudge DS MCP — 터미널(Claude Code) 원클릭 설치 (Windows / PowerShell).
#
#   irm https://nudge-design-assets.s3.ap-northeast-2.amazonaws.com/nds-assets/mcp/install.ps1 | iex
#
# 하는 일: 자기갱신 부트스트랩(bootstrap.mjs)을 ~/.nudge-ds 에 받아두고,
#          Claude Code 에 stdio MCP 서버로 등록(user scope)한다.
#          등록 전에 과거 이름으로 깔린 중복(레거시) 서버를 정리한다.
#          실제 본체는 부트스트랩이 첫 실행 때 S3 에서 받아오고, 이후 자동 갱신된다.
#
# install.sh(mac/linux)의 윈도우 미러. 동작·환경변수 동일.

$ErrorActionPreference = 'Stop'
# Windows PowerShell 5.1 은 기본 TLS 가 1.0/1.1 이라 S3(TLS1.2 전용) 다운로드가 실패한다 → 강제.
[Net.ServicePointManager]::SecurityProtocol = `
  [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

$Origin = if ($env:NUDGE_DS_ASSET_CDN_ORIGIN) { $env:NUDGE_DS_ASSET_CDN_ORIGIN } `
          else { 'https://nudge-design-assets.s3.ap-northeast-2.amazonaws.com' }
$Origin = $Origin.TrimEnd('/')
$Prefix = 'nds-assets/mcp'
$HomeDir = if ($env:NUDGE_DS_HOME) { $env:NUDGE_DS_HOME } else { Join-Path $HOME '.nudge-ds' }
$Bootstrap = Join-Path $HomeDir 'bootstrap.mjs'
$Name = 'nudge-ds'
# 과거 이름으로 등록돼 남아있을 수 있는 중복 서버(레거시). 새 이름이 더 생기면 여기만 추가.
#   nudge-eap-ds        — 옛 외부 프로젝트 CLAUDE.md 템플릿이 안내하던 서버명
#   nudge-design-system — 구 서버 id / enabledMcpjsonServers 잔재
$LegacyNames = @('nudge-eap-ds', 'nudge-design-system')

Write-Host "[nudge-ds] 부트스트랩 다운로드 -> $Bootstrap"
New-Item -ItemType Directory -Force -Path $HomeDir | Out-Null
Invoke-WebRequest -Uri "$Origin/$Prefix/bootstrap.mjs" -OutFile $Bootstrap -UseBasicParsing

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Warning "[nudge-ds] node 가 필요합니다 (Node 20+). 설치 후 다시 실행하세요."
  exit 1
}

if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
  Write-Warning "[nudge-ds] claude CLI 가 없어 자동 등록을 건너뜁니다."
  Write-Host "  수동 등록:"
  Write-Host "  claude mcp add $Name --scope user -- node `"$Bootstrap`""
  exit 0
}

# 정리 — 레거시 이름은 물론 현행 nudge-ds 도 제거한다.
# 현행이 다른 경로(옛 dist/server.js 직접 등록·구 부트스트랩 경로)나 다른 scope 로
# 깔려 있으면 user scope 재등록만으론 낡은 게 계속 이기므로(local>user), 전부 지운 뒤
# 아래에서 단일 user scope 로 깨끗이 재등록한다. scope 를 몰라 local·user 둘 다 시도.
# (project scope=.mcp.json 은 레포 커밋 설정이라 의도적으로 건드리지 않는다.)
foreach ($n in ($LegacyNames + $Name)) {
  foreach ($scope in @('local', 'user')) {
    & claude mcp remove $n --scope $scope *> $null
  }
}
if (Get-Command codex -ErrorAction SilentlyContinue) {
  foreach ($n in ($LegacyNames + $Name)) {
    & codex mcp remove $n *> $null
  }
  # claude 와 동일하게 codex 에도 단일 재등록 (codex 는 env 를 --env 로 받는 점만 다름).
  & codex mcp add $Name `
    --env NUDGE_DS_INSTALL_MODE=mcpb `
    --env "NUDGE_DS_UPDATE_URL=$Origin/$Prefix/version.json" `
    -- node "$Bootstrap" *> $null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "[nudge-ds] OK codex 에도 등록했습니다. codex 재시작 후 반영됩니다."
  } else {
    Write-Warning "[nudge-ds] codex 등록은 건너뜀 (수동: codex mcp add $Name -- node `"$Bootstrap`")."
  }
}

# 깨끗한 단일 재등록 (user scope · 현재 부트스트랩 경로/옵션으로).
& claude mcp add $Name --scope user `
  -e NUDGE_DS_INSTALL_MODE=mcpb `
  -e "NUDGE_DS_UPDATE_URL=$Origin/$Prefix/version.json" `
  -- node "$Bootstrap"

Write-Host "[nudge-ds] OK 설치 완료. Claude Code 를 재시작하면 nudge-ds MCP 가 뜹니다."
Write-Host "[nudge-ds]   업데이트는 자동 — S3 가 갱신되면 다음 실행부터 반영됩니다."
