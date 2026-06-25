# @nudge-design/mcp

Nudge Design System용 MCP(Model Context Protocol) 서버.
외부 목업 프로젝트에서 Claude/Codex가 DS의 컴포넌트/아이콘/토큰·가이드를 조회하고,
작성한 목업(HTML/`<nds-*>`)을 검증·빌드·품질채점할 수 있도록 도구를 제공합니다.

---

## 설치 방법

### A. Claude Desktop 에 `.mcpb` 더블클릭 설치 (권장)

Claude Desktop 사용자에게 가장 쉬운 방법입니다. **Node.js 설치 필요 없습니다.**
Claude Desktop 이 자체 Node 런타임을 내장합니다.

1. `nudge-ds.mcpb` 를 받아 더블클릭하거나, Claude Desktop → Settings → Extensions →
   "Install from file" 로 불러옵니다.
2. 이후 모든 워크스페이스에서 `nudge-ds` MCP 가 자동 활성화됩니다.

**업데이트는 자동입니다.** `.mcpb` 안의 부트스트랩이 실행 때마다 S3 의 최신 본체를 확인해
받아두고 다음 실행부터 적용합니다(레포가 프라이빗이라 GitHub 자동 알림은 동작하지 않으므로
이 방식으로 우회). `.mcpb` 자체를 다시 설치할 필요는 거의 없고, 부트스트랩 로직이 바뀌는
드문 경우에만 새 `.mcpb` 를 재설치하면 됩니다.

### B. Claude Code (터미널) 원클릭 설치

터미널의 Claude Code 사용자는 아래 한 줄이면 됩니다(**Node.js 20+ 필요**).
자기갱신 부트스트랩을 `~/.nudge-ds` 에 받아 `claude` 에 stdio MCP 로 등록합니다.

```bash
curl -fsSL https://nudge-design-assets.s3.ap-northeast-2.amazonaws.com/nds-assets/mcp/install.sh | sh
```

이후 Claude Code 를 재시작하면 `nudge-ds` MCP 가 뜹니다. 실제 본체는 첫 실행 때 S3 에서
받아오고, 이후 S3 가 갱신되면 다음 실행부터 자동 반영됩니다(재설치 불필요).

수동으로 등록하려면(이미 부트스트랩을 받아둔 경우):

```bash
claude mcp add nudge-ds --scope user \
  -e NUDGE_DS_INSTALL_MODE=mcpb \
  -- node "$HOME/.nudge-ds/bootstrap.mjs"
```

### C. Codex 에 등록

`.mcpb` 는 Claude Desktop Extension 번들입니다. Codex 앱/CLI/IDE 확장은 Claude Desktop 처럼
`.mcpb` 파일을 더블클릭해서 전역 Extension 으로 설치하는 흐름을 사용하지 않습니다.
Codex 에서는 MCP 서버를 stdio 명령으로 등록해야 하며, 공식 경로는 `codex mcp add` 또는
`~/.codex/config.toml` / 프로젝트 `.codex/config.toml` 설정입니다.

즉 Codex 에서는 `nudge-ds.mcpb` 를 안정적인 로컬 폴더에 압축 해제한 뒤, 그 안의
`bootstrap.mjs` 를 실행하도록 연결합니다. `bootstrap.mjs` 가 실제 엔트리로,
실행 때마다 S3 의 최신 본체를 확인해 받아두므로(동봉된 `embedded/` 본체는 오프라인/첫 실행
폴백) **한 번 등록하면 이후 업데이트는 자동**입니다. 이 방식은 레포 클론 없이 동작하지만,
Claude Desktop 처럼 내장 Node 를 쓰지 않으므로 사용자 PC 에 Node.js 20+ 가 필요합니다.

Codex Desktop 앱을 쓰는 비개발자라면 아래 요청을 그대로 붙여넣는 경로를 권장합니다.
Codex 가 Node 설치 여부를 확인하고, 필요하면 설치 안내를 먼저 한 뒤 `.mcpb` 압축 해제와
MCP 등록을 처리하게 합니다. 이미 등록된 `nudge-ds` 가 있으면 기존 설정 위치와 실행 경로를
확인한 뒤, 같은 이름의 글로벌/프로젝트 설정이 동시에 남지 않도록 정리하게 합니다.

```text
다운로드 폴더의 nudge-ds.mcpb 를 Codex에서 쓸 수 있게 등록해줘.

조건:
- 레포를 클론하지 말고 mcpb 파일만 사용해줘.
- Node.js 20 이상이 설치되어 있는지 먼저 확인해줘. 없으면 설치 방법을 안내하고 멈춰줘.
- 먼저 codex mcp list 와 필요한 경우 codex mcp get nudge-ds --json 으로 기존 등록 여부를 확인해줘.
- 이미 nudge-ds 가 있으면 업데이트로 처리해줘. 기존 mcpb 압축 해제 폴더를 새 파일로 교체하고,
  등록된 server 경로/env가 아래 값과 다르면 갱신해줘.
- 글로벌 설정(~/.codex/config.toml)과 프로젝트 설정(.codex/config.toml)에 nudge-ds가 동시에 있으면
  프로젝트 설정의 중복 nudge-ds 항목을 제거하고 글로벌 설정 하나만 남겨줘. 다른 프로젝트별 MCP 설정은 건드리지 마.
- mcpb는 ~/.nudge-ds/mcpb/nudge-ds 에 압축 해제해줘.
- 압축 해제한 bootstrap.mjs 를 nudge-ds MCP 서버로 Codex에 등록해줘
  (sidecar 경로는 bootstrap 이 알아서 잡으니 env 로 지정하지 마).
- 필요한 env는 NUDGE_AGENT=codex, NUDGE_AGENT_SURFACE=cli,
  NUDGE_DS_INSTALL_MODE=mcpb 로 설정해줘.
- 등록 후 Codex를 재시작해야 하면 알려줘.
```

한 번 등록하면 업데이트는 자동입니다 — bootstrap 이 실행 때마다 S3 최신 본체를 받아
다음 실행부터 적용합니다. `.mcpb` 자체(동봉 폴백 본체)를 갱신하고 싶을 때만 새 파일로
압축 해제 폴더를 교체하세요.

수동으로 등록하거나 업데이트해야 할 때는 같은 작업을 아래처럼 실행합니다.

```bash
# 0. 기존 등록 확인
codex mcp list
codex mcp get nudge-ds --json 2>/dev/null || true

# 1. GitHub Release 에서 받은 nudge-ds.mcpb 를 고정 위치에 압축 해제/교체
BUNDLE_DIR="$HOME/.nudge-ds/mcpb/nudge-ds"
rm -rf "$BUNDLE_DIR"
mkdir -p "$BUNDLE_DIR"
unzip -q "$HOME/Downloads/nudge-ds.mcpb" -d "$BUNDLE_DIR"

# 2. 같은 이름의 사용자 등록이 있으면 제거 후 다시 등록
#    (entry = bootstrap.mjs — sidecar 경로/자기갱신은 bootstrap 이 처리)
codex mcp remove nudge-ds 2>/dev/null || true
codex mcp add nudge-ds \
  --env NUDGE_AGENT=codex \
  --env NUDGE_AGENT_SURFACE=cli \
  --env NUDGE_DS_INSTALL_MODE=mcpb \
  -- node "$BUNDLE_DIR/bootstrap.mjs"
```

프로젝트 단위로 고정하려면 `.codex/config.toml` 에 직접 둡니다. 단, Codex 는 사용자 설정
`~/.codex/config.toml` 과 프로젝트 설정 `.codex/config.toml` 을 함께 읽고, 신뢰된 프로젝트에서는
프로젝트 설정이 더 높은 우선순위를 가집니다. 같은 `nudge-ds` 를 양쪽에 동시에 두면 어떤 경로의
`.mcpb` 를 쓰는지 헷갈릴 수 있으니 설치/업데이트 작업에서는 프로젝트 설정의 중복 `nudge-ds`
항목을 제거하고 **글로벌 설정 하나만** 남깁니다. 프로젝트별 버전을 일부러 고정해야 할 때만
프로젝트 설정을 사용합니다.

```toml
[mcp_servers.nudge-ds]
command = "node"
args = ["/Users/<you>/.nudge-ds/mcpb/nudge-ds/bootstrap.mjs"]

[mcp_servers.nudge-ds.env]
NUDGE_AGENT = "codex"
NUDGE_AGENT_SURFACE = "cli"
NUDGE_DS_INSTALL_MODE = "mcpb"
```

Codex 는 저장소 규칙을 `AGENTS.md` 에서 읽습니다. 외부 목업 프로젝트를 처음 셋업할 때는
`get_setup({ step: "agents-md", cwd: "<프로젝트 루트>" })` 또는
`get_setup({ step: "external-starter", cwd: "<프로젝트 루트>" })` 를 사용하세요.

참고: OpenAI Codex MCP 설정 문서
<https://developers.openai.com/codex/mcp>

### D. 개발 모드 (DS 레포를 클론해 직접 빌드)

DS 자체를 수정/개발할 때 사용합니다.

```bash
# DS 모노레포 루트에서
pnpm install
pnpm build --filter @nudge-design/mcp   # tokens/react/icons 빌드까지 자동 트리거됨
```

빌드하면 `packages/mcp/dist/server.js` 와 `packages/mcp/catalog.json` 이 생성됩니다.

외부 목업 프로젝트의 `.mcp.json` 에 등록:

```json
{
  "mcpServers": {
    "nudge-ds": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/NudgeEAPDesignSystem/packages/mcp/dist/server.js"]
    }
  }
}
```

> 절대 경로를 써야 합니다. `claude mcp add nudge-ds --scope project -- node <abs>` 명령으로도
> 동일한 `.mcp.json` 이 생성됩니다. Codex 는 위 B 섹션처럼 `codex mcp add` 또는
> `.codex/config.toml` 을 사용하세요.

---

## .mcpb 번들 직접 만들기

릴리즈 전 로컬 검증이나 사내 배포용으로 직접 패킹할 때:

```bash
pnpm pack:mcpb              # release:local + mcp build + pack
pnpm pack:mcpb:no-build     # 이미 빌드된 상태라면 패킹만
```

산출물: `dist-mcpb/nudge-ds.mcpb` (zip 파일). 더블클릭해 Claude Desktop 에 설치 가능.
`mcpb` CLI 가 설치되어 있으면 그쪽을 우선 사용하고, 없으면 시스템 `zip` 으로 폴백합니다.

---

## 빠른 시작 (개발 모드 상세)

### 1) DS 패키지 빌드 (의존)

```bash
# DS 모노레포 루트에서
pnpm install
pnpm build --filter @nudge-design/tokens
pnpm build --filter @nudge-design/react
pnpm build --filter @nudge-design/icons
```

### 2) MCP 서버 빌드

```bash
pnpm install --filter @nudge-design/mcp
pnpm build --filter @nudge-design/mcp
```

이 과정에서 `packages/mcp/catalog.json`이 자동 생성됩니다 (DS의 빌드 산출물에서 추출).
`packages/mcp/manifest.json` 의 version 은 **Changesets 로 자동 관리**됩니다 — 자세한 흐름은
아래 [버전 / 외부 배포 흐름](#버전--외부-배포-흐름) 참조.

### 3) Claude Code에 등록

외부 목업 프로젝트의 `.claude/settings.json` (또는 `~/.claude/settings.json`)에 추가:

```json
{
  "mcpServers": {
    "nudge-ds": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/NudgeEAPDesignSystem/packages/mcp/dist/server.js"]
    }
  }
}
```

> 절대 경로를 써야 합니다. 이 레포 위치는 `/Users/eprnf/04_DPLaps/NudgeEAPDesignSystem` 이므로 `args`는
> `["/Users/eprnf/04_DPLaps/NudgeEAPDesignSystem/packages/mcp/dist/server.js"]`.

### 4) 외부 프로젝트에서 Claude 실행

```bash
cd ~/04_DPLaps/NudgeEAPMockups
claude
```

대화 중 `/mcp`로 등록된 서버를 확인할 수 있고, Claude는 `nudge-ds` 도구들을 자동으로 사용합니다.

---

## 제공 도구

<!-- BEGIN: tools (auto-generated by scripts/generate-mcp-tools-reference.mjs — registry.ts SSOT. 손으로 고치지 말고 `pnpm generate:mcp-tools` 실행) -->

현재 **20개 도구**. 각 도구의 인자·호출 시점 전체 레퍼런스는 [docs/guide/mcp-tools-reference.mdx](../../docs/guide/mcp-tools-reference.mdx) 참고 (registry.ts 에서 자동 생성).

| 카테고리                                        | 도구                                                                                                                                                                                   |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 프로젝트 · 컴포넌트 · 아이콘 · 토큰 · 에셋 조회 | `get_project` · `find_component` · `find_icon` · `find_token` · `find_asset`                                                                                                           |
| 가이드 · 패턴 · 원칙                            | `get_guide`                                                                                                                                                                            |
| 설계 보조 (DesignSpec · 페이지 패턴)            | `recommend_page_pattern` · `save_design_spec` · `validate_design_spec`                                                                                                                 |
| 목업 빌드 · 검증 · 변환                         | `build_singlefile_html` · `validate_html_mockup` · `validate_prd_coverage` · `validate_scenario_coverage` · `score_mockup_quality` · `convert_html_to_ds_html` · `suggest_replacement` |
| Dev 서버 / 미리보기                             | `dev_server`                                                                                                                                                                           |
| 외부 프로젝트 셋업                              | `get_setup`                                                                                                                                                                            |
| 피드백 · 텔레메트리                             | `log_feedback` · `prompt_satisfaction`                                                                                                                                                 |

<!-- END: tools -->

> 옛 도구 이름(`list_components` · `validate_mockup` · `report_mockup_usage` · `start_dev_server` · `get_install_command` 등)으로 호출하면 `Unknown tool` 에러가 납니다. 통합 매핑과 각 도구의 인자/호출 시점은 위 레퍼런스를 보세요.

---

## 검증 룰 (validate_html_mockup)

`validate_html_mockup` 이 HTML/`<nds-*>` 목업(`source` 또는 `filePath`)에서 잡는 정적 위반들:

| Rule                                 | 의미                                                                                     |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| `inline-color`                       | hex/rgb 색상 직접 사용 (토큰 변수 미사용)                                                |
| `inline-spacing`                     | 인라인 px/rem (transform 류 제외)                                                        |
| `native-element`                     | `<button>`, `<input>`, `<select>`, `<textarea>` 직접 사용                                |
| `inline-svg`                         | `<svg>` 인라인 정의                                                                      |
| `unknown-token`                      | 정의되지 않은 `var(--xxx)` 사용                                                          |
| `unknown-react-export`               | DS에 없는 컴포넌트 import                                                                |
| `unknown-icons-export`               | DS에 없는 아이콘 import                                                                  |
| `gradient-banned`                    | linear/radial/conic-gradient 사용 (DESIGN.md 금지)                                       |
| `neutral-solid-cta`                  | `<Button color="neutral" variant="solid">` 활성 CTA 사용 (회색 배경이라 비활성처럼 보임) |
| `card-slot-double-padding`           | `Card.Header/Body/Footer`에 외곽 padding 추가 (자체 padding과 충돌)                      |
| `button-arrow-overuse`               | 화살표/chevron CTA가 한 화면에 여러 개 반복됨                                            |
| `button-arrow-secondary-or-repeated` | 보조 variant 또는 반복 리스트 CTA에 화살표 아이콘 사용                                   |
| `primary-cta-overuse`                | primary solid로 보이는 Button이 한 화면에 여러 개 있음                                   |
| `chip-overuse`                       | Chip이 과도하게 많이 사용됨                                                              |
| `chip-decorative-use`                | Chip이 상태/분류가 아닌 장식성 라벨처럼 사용됨                                           |
| `icon-default-color`                 | 단독 아이콘이 주변 UI에 맞는 토큰 컬러 없이 기본 currentColor에 의존함                   |
| `primary-color-role-overload`        | primary 계열 색상이 배경/CTA/태그/카드/아이콘 등 여러 역할에 과다 사용됨                 |
| `tone-on-tone-filled`                | 연한 primary 배경 위에 같은 계열 filled/soft 라벨이나 박스가 반복됨                      |
| `logo-color-as-ui-accent`            | 로고용 gradient/accent 컬러가 UI surface나 강조 요소처럼 사용됨                          |
| `visual-emphasis-overload`           | 색 배경, 아이콘, Chip/Badge, 그라데이션 등 강조 장치가 동시에 과다 사용됨                |

`// allow-native` 주석이 같은 줄에 있으면 `native-element` 룰을 통과시킵니다.

---

## 외부 프로젝트 CLAUDE.md / 작업 루프

외부 목업 프로젝트가 받는 `CLAUDE.md`(작업 규칙·검증 루프)는 `get_setup({ step: "claude-md" })`
(Codex 는 `step: "agents-md"`)가 생성합니다. 본문 SSOT 는 `packages/mcp/src/tools/guides.ts` 의
`getClaudeMdTemplate` — 규칙을 여기 README 에 중복 적지 않습니다.

현재 HTML(`<nds-*>`) 목업 기본 루프:

1. (첫 응답) 사용자에게 Figma/스크린샷 요청 → `references.md` 작성 (코드·조회 전).
2. `get_guide({ topics: ["principles", "pattern:..."] })` · `get_project({ project })` ·
   `find_component` / `find_icon` / `find_token` 로 추측 없이 조회.
3. `save_design_spec`(의도 합의, `validate_design_spec` 으로 사전 검증) →
   `build_singlefile_html`(DS 검증 + PRD 커버리지 + 사용량 리포트 자동).
4. `score_mockup_quality`(코드 D1 + 정성 D2 품질 점수).

react/Vite 목업은 `dev_server({ action: "start" | "stop" })` 로 런타임 프리뷰.
전체 도구 인자/호출 시점은 [docs/guide/mcp-tools-reference.mdx](../../docs/guide/mcp-tools-reference.mdx).

---

## 개발

```bash
# catalog 재생성 (DS 빌드 후)
pnpm --filter @nudge-design/mcp build:manifest

# watch 모드
pnpm --filter @nudge-design/mcp dev

# 수동 실행 (디버그용 — 실제로는 Claude가 stdio로 띄움)
node packages/mcp/dist/server.js

# mcpb 모드로 강제 실행 (설치 안내/업데이트 안내가 mcpb 흐름으로 바뀌는지 확인)
NUDGE_DS_INSTALL_MODE=mcpb node packages/mcp/dist/server.js
```

DS를 수정한 뒤 로컬 검증:

1. `pnpm build --filter @nudge-design/{tokens,react,icons}` (DS 재빌드)
2. `pnpm build --filter @nudge-design/mcp` (catalog 재생성 + MCP 재빌드)
3. Claude Code 재시작 (MCP 서버는 시작 시 catalog 로드)

---

## 버전 / 외부 배포 흐름

DS 패키지는 **Changesets** 로 버저닝합니다. 손으로 `manifest.json` 을 건드릴 일은 없습니다.

```bash
# 1. DS 소스 수정 후 변경 기록 (대화형)
pnpm changeset
#    어떤 패키지가 영향받는지, major/minor/patch, 한 줄 요약 입력
#    → .changeset/{auto-name}.md 생성

# 2. 누적 changeset 일괄 반영
pnpm version-packages
#    → @nudge-design/{react,tokens,icons,tailwind-preset} 의 package.json version bump
#    → CHANGELOG.md 갱신
#    → 후속 스크립트가 자동 실행:
#       · sync-mcpb-version.mjs  : packages/mcp/manifest.json 도 최대 DS 버전으로 맞춤
#       · sync-version-docs.mjs  : docs 의 버전 표 동기화

# 3. 커밋 + main push
#    → release-mcpb.yml 가 빌드/태그/.mcpb 첨부/Slack 알림까지 자동
#    → Claude Desktop 사용자는 며칠 안에 업데이트 알림 받음
```

`pnpm lint` 가 `sync-mcpb-version --check` 로 drift 를 검출하므로, 손으로 어긋나게 만들면
CI 가 빨갛게 뜹니다. `@nudge-design/mcp` 패키지 자체는 의도적으로 분리 — 함께 bump 하고 싶으면
`pnpm changeset` 에서 직접 선택하세요.

---

## 사용량 추적 가드레일

DS 사용량 리포트(JSONL + Google Sheets webhook)는 별도 도구가 아니라 `validate_html_mockup`
(`report` 기본 true) 과 `build_singlefile_html`(html intent 시 자동)에 **흡수**됐습니다 — 옛
`report_mockup_usage` / `report_html_mockup_usage` 단독 도구는 없어졌습니다. LLM 이 리포트를
빠뜨리는 사고를 막기 위해 MCP dispatch 레벨에 가드레일을 둡니다. 외부 프로젝트에서도 동일하게
동작합니다.

작동 방식:

1. 매 도구 호출 끝(dispatch `afterCall`)에서 펜딩 목업을 스캔, 이미 적재된 것과 비교.
2. 빌드/검증 계열 도구 호출 시 펜딩 분을 자동 리포트 → 결과에 가드 결과를 부착.
3. 그 외 도구: 응답에 펜딩 경고를 인젝션 → LLM 이 무시하기 어렵게.

관련 코드:

- `packages/mcp/src/tools/usage.ts` — `runUsageGuards`
- `packages/mcp/src/tools/usage/tracker.ts` — 펜딩 스캔 / 로그 직렬화
- `packages/mcp/src/server.ts` — dispatch `afterCall` wrapper
