# 용어집 (Glossary)

이 레포에서 반복되는 고유 용어를 한곳에 모았습니다. 문서마다 흩어진 개념을 빠르게 찾기 위한 것이며, 각 규칙의 **SSOT 는 [CLAUDE.md](CLAUDE.md) 와 MCP 가이드**입니다.

---

### SSOT (Single Source of Truth)
같은 정보를 **한 곳에서만** 정의하고 나머지는 거기서 파생하는 원칙. 예: 컴포넌트 Props 의 SSOT 는 `packages/react/src`, DS 사용 규칙의 SSOT 는 MCP, 프로젝트 색의 SSOT 는 `tokens/src/projects/`. "이거 어디서 고쳐?" 의 답이 항상 한 곳이어야 합니다.

### 3면 미러 (3-mirror / triple mirror)
한 컴포넌트가 세 패키지에 거울처럼 존재하는 것:
- `packages/react/src/<C>.tsx` — React 구현 + **Props(SSOT)**
- `packages/styles/src/<C>.ts` — CSS (react·html 공용)
- `packages/html/src/components/nds-<c>.ts` — 바닐라 웹컴포넌트(react 미러)

react 만 고치고 html 을 빠뜨리는 drift 를 `pnpm lint:mirror-parity` 게이트가 차단. → [ARCHITECTURE.md](ARCHITECTURE.md)

### 시멘틱 토큰 (semantic token) — `--semantic-*`
"의미" 기준 토큰. Figma 정합 토큰으로 색(bg/text/icon/fill/border/button*/input)과 여백(gap/inset)을 다룹니다. 컴포넌트는 raw hex 대신 이걸 참조합니다. (옛 prefix `--eap-*`·`--color-semantic-*` 는 폐기)

### `--nds-*` 토큰 (컴포넌트 슬롯)
DS 자체 컴포넌트의 전용 슬롯 토큰. 예: `--nds-snackbar-bg`, `--nds-chip-*`. 프로젝트 override 와 variant 색을 **우선순위 var() 체인**으로 합성하는 자리입니다. → CLAUDE.md "색은 슬롯에 넣고 우선순위로 합성"

### project cascade (프로젝트 캐스케이드)
컴포넌트는 프로젝트를 모르고 시멘틱/슬롯 토큰 하나만 참조 → **프로젝트 토큰 파일이 그 값만 덮어써서** 컴포넌트로 흘려보내는 방식. `[data-project="..."]` 색 분기를 컴포넌트에 박지 않는 게 핵심. silent base-fallback 은 `pnpm lint:project-completeness` 가 차단.

### admission (DS 편입 기준)
컴포넌트를 DS 에 받아들일지 판단하는 기준: ① 2+ 프로젝트 사용 or 명시 사유, ② **Figma 가이드 노드(`figmaNodeUrl`) 존재**, ③ 앱 비즈니스 로직 없음, ④ react+html 미러 동시 제공. → CLAUDE.md "DS 편입 기준".

### figmaNodeUrl
컴포넌트/패턴 가이드 frontmatter(`packages/mcp/guides-src/**`)에 박는 **디자인 ↔ 코드 연결점** = 그 컴포넌트의 Figma 디자인 근거. 신규 가이드에 누락되면 `check-guide-figma-links` 게이트가 **차단**(admission ②). 디자인 근거 없는 컴포넌트는 받지 않습니다.

### data-slot
컴포넌트 DOM 의 구조적 위치를 표시하는 속성(`data-slot="root|icon|title|..."`). react/html 미러가 같은 구조·같은 스타일시트를 공유하게 하는 앵커.

### 생성물 (generated artifacts)
직접 고치지 않고 소스에서 **생성되는** 파일. catalog.json·`component-attrs`·`guides.generated.ts`·metadata/*·styles.css·AGENTS.md·`.agents/skills/*` 등. 커밋 전 **`pnpm fix`** 로 일괄 재생성. → [ARCHITECTURE.md](ARCHITECTURE.md) "생성물"

### `pnpm fix`
소스 변경 후 모든 파생 생성물을 올바른 빌드 순서로 일괄 재생성하는 명령. CI 게이트와 동일 기준. **커밋 전 필수** — 출력된 "재생성된 파일" 을 변경분과 같이 커밋.

### 게이트 (gate)
커밋/CI 가 통과해야 하는 검증. `scripts/gates.mjs` 가 SSOT(현재 23개). `check-*` 는 검증만, `pnpm fix` 가 재생성. pre-commit(husky)이 `precommit-gate.mjs`(staged 기반 ~1초)를 자동 실행. → [CONTRIBUTING.md](CONTRIBUTING.md)

### baseline (waiver)
"의도된 예외" 를 사유와 함께 박제하는 JSON. 예: `mirror-parity-baseline.json`(미러 divergence), `project-completeness-baseline.json`(프로젝트 미정의), `guide-figma-baseline.json`(figma 노드 미보유). 게이트는 **baseline 밖 신규** 만 차단합니다.

### MCP (Model Context Protocol) 서버
`@nudge-design/mcp`. 외부 소비자에게 가이드·검증·CLAUDE.md 본문을 발행하는 **DS 사용 규칙의 SSOT**. `get_guide` / `find_component` / `find_icon` / `find_token` / `validate_html_mockup` / `score_mockup_quality` 등의 도구 제공. MCPB 로 배포. → [packages/mcp/README.md](packages/mcp/README.md)

### catalog.json
react dist + html src 에서 생성되는 컴포넌트/아이콘/토큰/프로젝트 **카탈로그**. MCP 도구·mirror-parity·component-attrs 의 입력.

### changeset
패키지 버전 bump 와 변경 이력을 기록하는 도구(`pnpm changeset`). DS 패키지 소스를 고치면 작성 → `/ds-release` 가 version bump + 비개발자 톤 release notes 로 외부 전파.

### AllComponents / gallery
Storybook 의 전체 컴포넌트 카탈로그 스토리. 각 컴포넌트 `*.stories.tsx` 의 `tags: ["gallery"]` 스토리를 자동 수집해 라이브 프리뷰를 모읍니다. 신규 컴포넌트는 `componentInventory.json` 등록 + gallery 태그 필요(`check-storybook-catalog` 게이트).

### compound 컴포넌트
`Root`/`Header`/`Item` 같은 서브파트로 조립하는 컴포넌트(예: `Card.*`, `Agreement.*`, `Article.*`). 부모 없이 의미 없는 서브파트는 가이드에 `standalone: false` + `composeWith` 로 단독 오용을 막습니다.
