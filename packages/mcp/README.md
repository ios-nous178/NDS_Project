# @nudge-eap/mcp

NudgeEAP Design System용 MCP(Model Context Protocol) 서버.
외부 목업 프로젝트에서 Claude가 DS의 컴포넌트/아이콘/토큰을 조회하고,
작성한 mockup `.tsx` 파일을 검증할 수 있도록 도구를 제공합니다.

---

## 설치 방법 두 가지

### A. Claude Desktop 에 `.mcpb` 더블클릭 설치 (권장)

비개발자에게 가장 쉬운 방법입니다. **Node.js 설치 필요 없습니다.**
Claude Desktop 이 자체 Node 런타임을 내장하고, GitHub Release 의 새 버전이 나오면 자동으로
업데이트 알림을 띄워줍니다.

1. GitHub Releases 에서 `nudge-eap-ds.mcpb` 를 받습니다
   → https://github.com/cashwalk/NudgeEAPDesignSystem/releases/latest
2. 파일을 더블클릭하거나, Claude Desktop → Settings → Extensions → "Install from file" 로
   불러옵니다.
3. 이후 모든 워크스페이스에서 `nudge-eap-ds` MCP 가 자동 활성화됩니다.

이 모드에서는 `get_update_instructions` 가 "Settings → Extensions 에서 Update 버튼을 누르세요"
안내를 반환합니다.

### B. 개발 모드 (DS 레포를 클론해 직접 빌드)

DS 자체를 수정/개발할 때 사용합니다.

```bash
# DS 모노레포 루트에서
pnpm install
pnpm build --filter @nudge-eap/mcp   # tokens/react/icons 빌드까지 자동 트리거됨
```

빌드하면 `packages/mcp/dist/server.js` 와 `packages/mcp/catalog.json` 이 생성됩니다.

외부 목업 프로젝트의 `.mcp.json` 에 등록:

```json
{
  "mcpServers": {
    "nudge-eap-ds": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/NudgeEAPDesignSystem/packages/mcp/dist/server.js"]
    }
  }
}
```

> 절대 경로를 써야 합니다. `claude mcp add nudge-eap-ds --scope project -- node <abs>` 명령으로도
> 동일한 `.mcp.json` 이 생성됩니다.

---

## .mcpb 번들 직접 만들기

릴리즈 전 로컬 검증이나 사내 배포용으로 직접 패킹할 때:

```bash
pnpm pack:mcpb              # release:local + mcp build + pack
pnpm pack:mcpb:no-build     # 이미 빌드된 상태라면 패킹만
```

산출물: `dist-mcpb/nudge-eap-ds.mcpb` (zip 파일). 더블클릭해 Claude Desktop 에 설치 가능.
`mcpb` CLI 가 설치되어 있으면 그쪽을 우선 사용하고, 없으면 시스템 `zip` 으로 폴백합니다.

---

## 빠른 시작 (개발 모드 상세)

### 1) DS 패키지 빌드 (의존)

```bash
# DS 모노레포 루트에서
pnpm install
pnpm build --filter @nudge-eap/tokens
pnpm build --filter @nudge-eap/react
pnpm build --filter @nudge-eap/icons
```

### 2) MCP 서버 빌드

```bash
pnpm install --filter @nudge-eap/mcp
pnpm build --filter @nudge-eap/mcp
```

이 과정에서 `packages/mcp/catalog.json`이 자동 생성됩니다 (DS의 빌드 산출물에서 추출).
`packages/mcp/manifest.json` 의 version 은 **Changesets 로 자동 관리**됩니다 — 자세한 흐름은
아래 [버전 / 외부 배포 흐름](#버전--외부-배포-흐름) 참조.

### 3) Claude Code에 등록

외부 목업 프로젝트의 `.claude/settings.json` (또는 `~/.claude/settings.json`)에 추가:

```json
{
  "mcpServers": {
    "nudge-eap-ds": {
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

대화 중 `/mcp`로 등록된 서버를 확인할 수 있고, Claude는 `nudge-eap-ds` 도구들을 자동으로 사용합니다.

---

## 제공 도구

### 카탈로그 / 검색

| Tool               | 설명                                    |
| ------------------ | --------------------------------------- |
| `list_components`  | 모든 DS React 컴포넌트 목록             |
| `get_component`    | 특정 컴포넌트의 props 상세              |
| `search_component` | 자연어 쿼리로 컴포넌트 검색 (예: "tab") |
| `list_icons`       | 모든 아이콘 이름                        |
| `find_icon`        | 자연어로 아이콘 검색 (예: "search")     |
| `list_tokens`      | 모든 디자인 토큰 (group 필터 지원)      |
| `lookup_token`     | 토큰 검색 (이름/값 모두)                |

### 검증 / 자동 수정

| Tool                  | 설명                                               |
| --------------------- | -------------------------------------------------- |
| `validate_mockup`     | mockup `.tsx` 검증 — `source` 또는 `filePath` 입력 |
| `suggest_replacement` | 인라인 hex/px → 토큰 자동 매핑 제안                |

### 실행 / 화면 체크

| Tool               | 설명                                                                                            |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| `start_dev_server` | 외부 목업 프로젝트 루트에서 dev 서버를 직접 실행하고 URL 응답 대기                              |
| `check_preview`    | Playwright로 실제 브라우저 렌더링을 열어 console error, pageerror, Vite overlay, 빈 화면을 검사 |
| `stop_dev_server`  | `start_dev_server`가 띄운 dev 서버 종료                                                         |

### 외부 프로젝트 세팅

| Tool                      | 설명                                                                                                  |
| ------------------------- | ----------------------------------------------------------------------------------------------------- |
| `list_packages`           | DS 패키지 목록 + 버전 + 의존성 그래프 + peer deps + CSS exports                                       |
| `get_install_command`     | `.tgz` 파일 검증 후 즉시 실행 가능한 `npm install` 명령 반환                                          |
| `get_update_instructions` | GitHub에서 받은 DS 레포의 MCP 업데이트 명령 반환 (`git pull origin main` → MCP build)                 |
| `get_main_tsx_imports`    | `src/main.tsx`에 추가할 토큰/컴포넌트 CSS import 코드 반환 (브랜드 선택)                              |
| `create_claude_md`        | 외부 목업 프로젝트 루트에 DS MCP 사용 규칙과 화면 검증 루프가 담긴 `CLAUDE.md` 생성                   |
| `get_setup_instructions`  | 신규 외부 프로젝트의 풀 세팅 가이드 (Vite 생성 → 설치 → CSS import → 폴더 구조 → MCP 등록 → dev 실행) |

### 디자인 가이드 / 큐레이션 (DESIGN.md 기반)

| Tool                    | 설명                                                                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `get_design_principles` | DESIGN.md에서 추출한 브랜드 톤 / 컬러 의미 / 타이포 규칙 / 8px 그리드 / elevation / shapes / Do's & Don'ts / banned patterns       |
| `get_dos_and_donts`     | Do/Don't 룰만 짧게 — 마무리 sanity check용                                                                                         |
| `get_component_guide`   | 컴포넌트별 큐레이션 가이드: 함정(pitfalls), 색상 매트릭스, 추천 패턴, 인터랙션 패턴. **처음 사용하는 컴포넌트는 무조건 호출 권장** |
| `get_pattern_guide`     | CTA 그룹, 아이콘 컬러, 시각 안티패턴, 안내문 강조, 드롭다운 옵션 밀도, 고밀도 리스트 등 UX 패턴별 배치/위계 가이드                 |

### 단일 HTML 추출

| Tool                           | 설명                                                                                                                                         |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `get_export_html_instructions` | 의존성 없는 단일 `.html` 파일로 목업 추출 가이드. `mode: "singlefile"`(기본, 인터랙션 보존) 또는 `"snapshot"`(JS 없이 정적, Playwright 사용) |

---

## 검증 룰 (validate_mockup)

| Rule                                 | 의미                                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------------------------ |
| `inline-color`                       | hex/rgb 색상 직접 사용 (토큰 변수 미사용)                                                  |
| `inline-spacing`                     | 인라인 px/rem (transform 류 제외)                                                          |
| `native-element`                     | `<button>`, `<input>`, `<select>`, `<textarea>` 직접 사용                                  |
| `inline-svg`                         | `<svg>` 인라인 정의                                                                        |
| `unknown-token`                      | 정의되지 않은 `var(--xxx)` 사용                                                            |
| `unknown-react-export`               | DS에 없는 컴포넌트 import                                                                  |
| `unknown-icons-export`               | DS에 없는 아이콘 import                                                                    |
| `gradient-banned`                    | linear/radial/conic-gradient 사용 (DESIGN.md 금지)                                         |
| `assistive-solid-cta`                | `<Button color="assistive" variant="solid">` 활성 CTA 사용 (회색 배경이라 비활성처럼 보임) |
| `card-slot-double-padding`           | `Card.Header/Body/Footer`에 외곽 padding 추가 (자체 padding과 충돌)                        |
| `button-arrow-overuse`               | 화살표/chevron CTA가 한 화면에 여러 개 반복됨                                              |
| `button-arrow-secondary-or-repeated` | 보조 variant 또는 반복 리스트 CTA에 화살표 아이콘 사용                                     |
| `primary-cta-overuse`                | primary solid로 보이는 Button이 한 화면에 여러 개 있음                                     |
| `chip-overuse`                       | Chip이 과도하게 많이 사용됨                                                                |
| `chip-decorative-use`                | Chip이 상태/분류가 아닌 장식성 라벨처럼 사용됨                                             |
| `icon-default-color`                 | 단독 아이콘이 주변 UI에 맞는 토큰 컬러 없이 기본 currentColor에 의존함                     |
| `primary-color-role-overload`        | primary 계열 색상이 배경/CTA/태그/카드/아이콘 등 여러 역할에 과다 사용됨                   |
| `tone-on-tone-filled`                | 연한 primary 배경 위에 같은 계열 filled/soft 라벨이나 박스가 반복됨                        |
| `logo-color-as-ui-accent`            | 로고용 gradient/accent 컬러가 UI surface나 강조 요소처럼 사용됨                            |
| `visual-emphasis-overload`           | 색 배경, 아이콘, Chip/Badge, 그라데이션 등 강조 장치가 동시에 과다 사용됨                  |

`// allow-native` 주석이 같은 줄에 있으면 `native-element` 룰을 통과시킵니다.

---

## 셀프 체크 루프와의 연동 (외부 프로젝트 `CLAUDE.md` 권장 문구)

```markdown
## 초기 세팅 (한 번)

- 새 워크스페이스라면 가장 먼저 `get_setup_instructions` 도구를 호출해 단계별 가이드를 받는다.
- 새 워크스페이스 루트에 `create_claude_md`를 호출해 이 규칙을 프로젝트 지침으로 저장한다.
- 7단계(Vite 생성 → DS 설치 → react-router → CSS import → 폴더 → MCP 등록 → dev)를 그대로 수행.

## 모든 목업 작업의 시작 (매번)

- 작업 시작 시 한 번 `get_design_principles` 호출 — 브랜드 톤/컬러 의미/8px 그리드/금지 패턴 숙지
- 처음 쓰는 컴포넌트마다 `get_component_guide(name)` 호출 — 색상 매트릭스, 함정, 인터랙션 패턴 확인
- CTA가 많은 화면, 단독 아이콘, primary 컬러가 많은 화면, 안내문/강조 박스, 옵션 많은 Select, 정보 과밀 리스트는 `get_pattern_guide(name)` 호출
- 특히 Button / Card / Chip / IconButton / Tabs / Select / Banner / Modal은 함정이 알려져 있으니 항상 가이드 먼저 확인

## 도구 사용 규칙

- 컴포넌트/아이콘/토큰이 필요하면 먼저 search_component / find_icon / lookup_token 호출
- 목업 .tsx 작성 직후 반드시 validate_mockup 호출
- 위반 있으면 suggest_replacement 활용해 수정 → 다시 validate_mockup
- 최대 3회까지 자동 수정. 그래도 위반이 남으면 사용자에게 보고.
- 구현 후 `start_dev_server` 호출 → URL이 뜨면 `check_preview` 호출
- `check_preview.ok === false`이면 consoleErrors/pageErrors/viteOverlayText/devServerLogs를 보고 수정 → 다시 `check_preview`
- 화면 검증이 끝나면 장시간 세션 방지를 위해 `stop_dev_server` 호출
- 모든 인터랙티브 요소(Button, IconButton, TextButton, Card.Root clickable)에 onClick 핸들러 부착 — 목업이라도 토스트/console.log 시뮬레이션
- 표준 variant에 없는 톤이 필요하면 raw 요소로 대체 금지 — 컴포넌트의 style/icon 같은 확장 슬롯 활용
- 마무리 직전 `get_dos_and_donts` 호출해 sanity check
- DS를 업그레이드한 직후엔 list_packages / get_install_command로 .tgz 갱신 여부 확인.
```

---

## 개발

```bash
# catalog 재생성 (DS 빌드 후)
pnpm --filter @nudge-eap/mcp build:manifest

# watch 모드
pnpm --filter @nudge-eap/mcp dev

# 수동 실행 (디버그용 — 실제로는 Claude가 stdio로 띄움)
node packages/mcp/dist/server.js

# mcpb 모드로 강제 실행 (설치 안내/업데이트 안내가 mcpb 흐름으로 바뀌는지 확인)
NUDGE_EAP_DS_INSTALL_MODE=mcpb node packages/mcp/dist/server.js
```

`check_preview`는 외부 목업 프로젝트에 Playwright가 설치되어 있어야 런타임 렌더링을 검사할 수 있습니다.

```bash
npm install --save-dev playwright
npx playwright install chromium
```

DS를 수정한 뒤 로컬 검증:

1. `pnpm build --filter @nudge-eap/{tokens,react,icons}` (DS 재빌드)
2. `pnpm build --filter @nudge-eap/mcp` (catalog 재생성 + MCP 재빌드)
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
#    → @nudge-eap/{react,tokens,icons,tailwind-preset} 의 package.json version bump
#    → CHANGELOG.md 갱신
#    → 후속 스크립트가 자동 실행:
#       · sync-mcpb-version.mjs  : packages/mcp/manifest.json 도 최대 DS 버전으로 맞춤
#       · sync-version-docs.mjs  : docs 의 버전 표 동기화

# 3. 커밋 + main push
#    → release-mcpb.yml 가 빌드/태그/.mcpb 첨부/Slack 알림까지 자동
#    → Claude Desktop 사용자는 며칠 안에 업데이트 알림 받음
```

`pnpm lint` 가 `sync-mcpb-version --check` 로 drift 를 검출하므로, 손으로 어긋나게 만들면
CI 가 빨갛게 뜹니다. `@nudge-eap/mcp` 패키지 자체는 의도적으로 분리 — 함께 bump 하고 싶으면
`pnpm changeset` 에서 직접 선택하세요.

---

## 사용량 추적 가드레일

`report_mockup_usage` 는 mockup `.tsx` 수정/생성 직후 호출돼야 하는데, LLM 이 호출을 빠뜨리는
사고가 반복돼서 MCP dispatch 레벨에 다층 방어를 깔아 두었습니다. 외부 프로젝트에서도 동일하게
동작합니다.

작동 방식:

1. 매 도구 호출 끝에 `cwd` 의 `**/*Mockup.tsx` 를 스캔, `.ds-usage-log.jsonl` 의 `loggedAt`
   타임스탬프와 mtime 을 비교해 펜딩 파일 추출.
2. **post-creation 도구** (`validate_mockup` / `check_preview` / `stop_dev_server` /
   `get_export_html_instructions`): 펜딩 파일 최대 5건에 대해 `report_mockup_usage` 를
   자동 실행 → 결과를 응답의 `_autoReportedUsage` 필드에 노출.
3. **그 외 도구**: 응답에 `_pendingMockupReports` 경고를 인젝션 → LLM 이 무시하기 어렵게.

관련 코드:

- `packages/mcp/src/usage-tracker.ts` — `scanPendingMockupReports`, `loggedAt` 직렬화
- `packages/mcp/src/server.ts` — `POST_CREATION_TOOLS`, `runUsageGuards`, dispatch wrapper
