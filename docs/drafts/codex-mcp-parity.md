# Codex MCP Parity Notes

## 먼저 정리할 설치 전제

`nudge-ds.mcpb` 는 Claude Desktop Extension 배포 포맷이다. Claude Desktop 은 `.mcpb` 를
더블클릭하거나 Settings > Extensions > Install from file 로 불러오면 자체 Node 런타임으로
MCP 서버를 전역 활성화하고, 이후 Extension 업데이트 흐름을 제공한다.

Codex 앱/CLI/IDE 확장은 같은 방식으로 `.mcpb` 를 설치하지 않는다. Codex 의 MCP 연결은
`codex mcp add` 또는 `~/.codex/config.toml` / 프로젝트 `.codex/config.toml` 에 stdio 서버를
등록하는 방식이다. 따라서 Codex 사용자에게는 `.mcpb` 파일 자체를 설치하라고 안내하는 대신,
`.mcpb` 를 안정적인 폴더에 압축 해제하고 그 안의 `dist/tools/server.mjs` 를 실행하는 명령을
제공해야 한다.

비개발자용 가이드는 명령어보다 Codex Desktop 에 붙여넣을 요청문을 먼저 제공하는 편이 낫다.
Codex 에게 Node 20+ 확인, `.mcpb` unzip, `server.mjs` MCP 등록, 재시작 안내를 맡기고,
실패했을 때만 아래 수동 명령을 fallback 으로 보여준다.

이미 설치된 경우도 같은 요청문에서 처리해야 한다. Codex MCP 는 Claude Desktop Extension 처럼
자동 업데이트되지 않으므로, 새 `nudge-ds.mcpb` 를 받을 때마다 기존 압축 해제 폴더를 교체하고
Codex 세션을 재시작하는 절차가 필요하다. 또한 `~/.codex/config.toml` 과 프로젝트
`.codex/config.toml` 에 같은 `nudge-ds` 서버가 동시에 있으면 프로젝트 설정이 더 높은 우선순위로
동작할 수 있다. 일반 배포는 프로젝트 설정의 중복 `nudge-ds` 항목을 제거하고 글로벌 설정 하나만
남기게 한다. 프로젝트별 버전 고정이 필요할 때만 프로젝트 설정을 쓰게 한다.

```bash
codex mcp list
codex mcp get nudge-ds --json 2>/dev/null || true

BUNDLE_DIR="$HOME/.nudge-ds/mcpb/nudge-ds"
rm -rf "$BUNDLE_DIR"
mkdir -p "$BUNDLE_DIR"
unzip -q "$HOME/Downloads/nudge-ds.mcpb" -d "$BUNDLE_DIR"

codex mcp remove nudge-ds 2>/dev/null || true
codex mcp add nudge-ds \
  --env NUDGE_AGENT=codex \
  --env NUDGE_AGENT_SURFACE=cli \
  --env NUDGE_DS_INSTALL_MODE=mcpb \
  --env NUDGE_DS_STANDALONE_DIR="$BUNDLE_DIR/dist/standalone" \
  --env NUDGE_DS_ASSETS_DIR="$BUNDLE_DIR/dist/assets" \
  --env NUDGE_DS_ICONS_VANILLA="$BUNDLE_DIR/dist/icons/vanilla.js" \
  -- node "$BUNDLE_DIR/dist/tools/server.mjs"
```

프로젝트 고정 설정 예시:

```toml
[mcp_servers.nudge-ds]
command = "node"
args = ["/Users/<you>/.nudge-ds/mcpb/nudge-ds/dist/tools/server.mjs"]

[mcp_servers.nudge-ds.env]
NUDGE_AGENT = "codex"
NUDGE_AGENT_SURFACE = "cli"
NUDGE_DS_INSTALL_MODE = "mcpb"
NUDGE_DS_STANDALONE_DIR = "/Users/<you>/.nudge-ds/mcpb/nudge-ds/dist/standalone"
NUDGE_DS_ASSETS_DIR = "/Users/<you>/.nudge-ds/mcpb/nudge-ds/dist/assets"
NUDGE_DS_ICONS_VANILLA = "/Users/<you>/.nudge-ds/mcpb/nudge-ds/dist/icons/vanilla.js"
```

근거: [OpenAI Codex MCP 문서](https://developers.openai.com/codex/mcp)가 Codex MCP 설정을
`codex mcp` 또는 `config.toml` 로 안내한다. Claude Desktop 의 `.mcpb` 설치 UX 와 동일한
파일 설치 모델로 설명하면 안 된다. 또한 Claude Desktop 은 내장 Node 런타임으로 Extension 을
실행하지만, Codex 에 등록한 압축 해제 서버는 로컬 `node` 명령으로 실행되므로 Node.js 20+ 가
필요하다.

## 현재 레포 상태

- `get_setup` 은 이미 `agents-md` 와 `external-starter` 를 제공한다.
- `packages/mcp/src/tools/client-identity.ts` 는 `clientInfo` 와 `NUDGE_AGENT` /
  `NUDGE_AGENT_SURFACE` 로 Codex 호출을 식별할 수 있다.
- `packages/mcp/src/tools/setup.ts` 의 `external-starter` 는 CLAUDE.md + AGENTS.md 를 함께
  생성하고, 공용 MCP 등록 안내를 반환한다.
- `packages/mcp/README.md` 와 일부 update 안내는 아직 Claude Desktop `.mcpb` 설치 경험을
  기본값처럼 설명한다.
- `score_mockup_quality` 의 D2 정성 평가는 `claude -p` 실행 파일에 의존한다. Codex 환경에서
  Claude binary 가 없으면 D1 코드 점수만 나온다.

## Codex 에서 동일한 성능을 내려면 볼 지점

1. 설치/배포 경로

Codex 문서는 `.mcpb` 더블클릭이 아니라 `.mcpb` 압축 해제 + `codex mcp add` / `config.toml` 등록을
기준으로 안내해야 한다. `get_setup({ step: "external-starter" })` 도 Codex 대상이면 `.mcp.json` 만이
아니라 `.codex/config.toml` 예시를 함께 반환하는 편이 맞다.

2. 지침 파일 parity

Claude 는 `CLAUDE.md`, Codex 는 `AGENTS.md` 를 읽는다. `getClaudeMdTemplate` 를 바꿀 때
`createAgentsMd` 출력이 같은 게이트를 유지하는지 테스트해야 한다. 레포 루트의
`sync-agents-md`, 스킬 미러(`.claude/skills` -> `.agents/skills`)도 같은 관점의 parity 게이트다.

3. Tool description 과 응답 문구

`registry.ts`, `setup.ts`, README, generated docs 에서 "Claude가 반드시"처럼 특정 클라이언트를
가정하는 문구는 Codex 에서 도구 선택 성능을 낮춘다. 동작 설명은 "agent" 또는 "Claude/Codex" 로
중립화하고, 클라이언트별 차이는 설치/업데이트 섹션에만 둔다.

4. Codex smoke test

현재 `smoke-mcpb.mjs` 는 `.mcpb` 번들 모드 검증이다. Codex parity 용 smoke 는 별도로 필요하다.
최소 케이스는 `.mcpb` 를 임시 폴더에 unzip 한 뒤 `dist/tools/server.mjs` 를
`clientInfo.name = "codex-cli"` 와 `NUDGE_AGENT=codex` 로 띄우고 `tools/list`,
`get_setup({ step: "agents-md" })`, `get_setup({ step: "external-starter" })`,
`get_guide({ topic: "principles" })`, `build_singlefile_html` 의 핵심 응답을 확인하는 흐름이다.

5. D2 품질 평가 의존성

Codex 만 설치된 환경에서 `score_mockup_quality` 는 D1 only 로 떨어질 수 있다. "동일한 성능"에
D2 정성 점수까지 포함한다면 `claude -p` 전용 구현을 provider 중립 evaluator 로 분리하거나,
Codex 환경의 D2 미지원 상태를 설치/품질 문서에 명확히 표시해야 한다.

6. 관측/피드백 분리

`client-identity.ts` 의 env override 를 Codex 설치 예시에 반드시 넣어야 한다. 그래야 Google
Sheets/telemetry/usage 로그에서 Claude 성능과 Codex 성능을 나눠 비교할 수 있다. 자동
`clientInfo` 추론은 클라이언트별 구현 차이가 있으므로 보조 신호로 취급한다.

7. cwd 와 파일 생성 위치

Codex 는 프로젝트 trust, sandbox, `.codex/config.toml` 위치의 영향을 받는다. `get_setup` 의
`cwd` 인자를 모든 파일 생성 단계에서 명확히 쓰고, Codex 안내에는 "프로젝트 루트에서 실행"과
"절대 경로 사용"을 반복해서 적어야 한다.

8. 업데이트 안내

Claude Desktop `.mcpb` 모드의 업데이트는 Settings > Extensions 중심이다. Codex 는 새
`nudge-ds.mcpb` 를 다시 받아 같은 폴더에 재압축 해제하고 Codex 세션을 재시작하는 흐름이
기준이다. Codex 설치 안내에서 Claude Desktop 의 `.mcpb update` 버튼을 기대하게 만들면 실제
반영 경로가 끊긴다.

9. 글로벌/프로젝트 설정 충돌

Codex 는 사용자 설정과 프로젝트 설정을 함께 읽고, 신뢰된 프로젝트의 `.codex/config.toml` 이
사용자 설정보다 우선할 수 있다. 같은 이름의 `nudge-ds` 서버가 양쪽에 있으면 오래된 프로젝트
설정이 최신 글로벌 설정을 가려 업데이트가 안 된 것처럼 보일 수 있다. 설치/업데이트 가이드에는
`codex mcp list`, `codex mcp get nudge-ds --json`, 프로젝트 `.codex/config.toml` 확인을 포함하고,
프로젝트 설정의 중복 `nudge-ds` 항목을 제거해 글로벌 설정 하나만 남기도록 지시한다.

## 권장 후속 작업

- `getMcpConfigSetup()` 응답에 `.codex/config.toml` 스니펫과 `codex mcp add` 명령을 추가한다.
- `getUpdateInstructions()` 에 Codex/dev 등록과 Claude Desktop/.mcpb 등록을 분기해서 문구를
  반환한다.
- `scripts/smoke-codex-mcp.mjs` 를 추가해 Codex client identity, `agents-md`, `external-starter`,
  주요 조회 도구를 CI 또는 수동 게이트로 검증한다.
- `score_mockup_quality` 의 D2 provider 의존성을 문서화하거나 evaluator adapter 로 분리한다.
- generated docs(`docs/guide/mcp-tools-reference.mdx`)의 Claude-only 문구를 registry SSOT 에서
  중립화한다.
