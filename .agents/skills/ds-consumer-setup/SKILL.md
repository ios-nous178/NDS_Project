---
name: ds-consumer-setup
description: >-
  외부 프로젝트(DS 를 소비하는 목업/어드민 워크스페이스)에 Nudge DS 를 한 번에 셋업한다 — MCP 서버 연결 확인,
  AGENTS.md/CLAUDE.md 가이드 주입, 브랜드 SSOT 마커, 패키지 설치(어드민만), import 배선, DsInspector 주입까지
  `get_setup` 스텝을 순서대로 돌려 워크스페이스를 작업 가능 상태로 만든다. 트리거: "이 프로젝트에 DS 셋업해줘",
  "MCP/AGENTS.md 깔아줘", "DS 소비 프로젝트 초기화", "inspector 붙여줘", "외부 프로젝트에 디자인시스템 연결",
  "/ds-consumer-setup", "$ds-consumer-setup". DS 레포 자체 작업(컴포넌트/릴리즈)은 이 스킬이 아니다.
---

# ds-consumer-setup — 외부 소비 프로젝트 DS 셋업

> Codex skill. 명시 호출은 `/skills` → `ds-consumer-setup` 또는 `$ds-consumer-setup`. **이 DS 모노레포가
> 아니라, DS 를 npm/MCP 로 소비하는 외부 워크스페이스(cwd)** 에서 도는 스킬이다. 거의 모든 실작업은 Nudge DS
> MCP 의 `get_setup` 도구가 수행한다 — 이 스킬은 스텝 순서·intent/brand 판별·검증을 책임진다.

DS 사용 규칙의 SSOT 는 MCP 다. 외부 프로젝트는 가이드를 손으로 베끼지 않고 `get_setup` 으로 받아온다. 이 스킬은 새 워크스페이스(또는 미설정 워크스페이스)를 "DS 로 목업/어드민을 짤 수 있는 상태"까지 데려가는 순서를 고정한다.

## 먼저 판별 — intent & brand (셋업 분기의 축)

`get_setup` 은 두 축으로 갈린다. 잘못 잡으면 엉뚱한 템플릿/설치가 나간다.

- **intent**
  - `html` (기본) — vanilla `<nds-*>` 웹컴포넌트 목업. **패키지 설치·번들러·import 불필요** — `build_singlefile_html` 이 DS runtime/CSS 를 자동 inline. 새 목업 워크스페이스의 권장 트랙.
  - `admin-cms` — antd 기반 어드민/CMS(React). 이때만 npm 설치·`src/main.tsx` import·DsInspector 가 의미 있음. (캐포비 admin 은 내부적으로 `html` 로 우회됨에 유의.)
- **brand** — `trost | geniet | nudge-eap | cashwalk-biz | runmile`. 주면 `get_setup` 이 cwd 에 브랜드 SSOT 마커(`nudge.brand`)를 박아 빌드가 단일 출처에서 읽는다. HTML 은 `<html data-brand="<slug>">` 로도 지정.

먼저 사용자/레포 단서로 intent·brand 를 추정하고, 모호하면 한 번 물어본 뒤 진행한다.

## get_setup 스텝 맵 (SSOT)

| step        | 무엇                                                                                     | 언제                                                    |
| ----------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `full`      | 전체 셋업 절차. `mode:'summary'`(기본)는 요약, `mode:'full'` 은 전 과정                  | 처음 한 번 — 전체 그림 파악                             |
| `install`   | 설치 커맨드. **html intent 면 "설치 불필요" 안내**, admin-cms 만 실제 npm 커맨드         | admin-cms 일 때만 실질 동작                             |
| `imports`   | `src/main.tsx` 토큰/스타일/runtime import. **html 이면 "import 불필요"**                 | admin-cms 일 때만 실질 동작                             |
| `claude-md` | cwd 에 `CLAUDE.md` 생성(가이드 SSOT). `intent`/`brand`/`template:'slim'\|'default'`      | Claude Code 로 작업할 워크스페이스                      |
| `agents-md` | cwd 에 `AGENTS.md` 생성(Codex/에이전트용 동일 가이드). 옵션 동일                         | **Codex/타 에이전트로 작업할 워크스페이스 → 이걸 쓴다** |
| `inspector` | `src/main.tsx` 를 패치해 DsInspector(dev-only 비율 패널) 마운트. **html intent 면 거부** | admin-cms(React) 워크스페이스에서만                     |
| `update`    | MCP/패키지 업데이트 안내 + 최신 `.mcpb` 릴리즈 확인                                      | 기존 워크스페이스 갱신 점검                             |

> 모든 step 은 `cwd`(대상 워크스페이스 경로), 그리고 md 생성 step 은 `projectName`·`overwrite`·`template` 인자를 받는다. 기존 파일이 있으면 `overwrite:true` 없이는 덮지 않고 preview 를 돌려준다 — **함부로 덮지 말 것**.

## 플로우

### Phase 0 — 사전 점검

- 대상이 **이 DS 모노레포가 아닌** 외부 워크스페이스인지 확인(맞으면 이 스킬이 아님 → 안내).
- Nudge DS MCP 서버가 이 세션에 붙어 있는지 확인(`get_setup`/`find_component` 호출 가능 여부). 없으면 MCP 설치(`.mcpb`)·연결부터 안내.
- intent·brand 추정/확인.

### Phase 1 — 전체 그림

- `get_setup({ step:'full', intent, brand })`(요약)으로 절차 개요를 받고 사용자에게 무엇이 일어날지 먼저 알린다. 필요하면 `mode:'full'`.

### Phase 2 — 가이드 주입 (가장 중요)

- **Codex 워크스페이스: `get_setup({ step:'agents-md', cwd, projectName, intent, brand })`** → `AGENTS.md` 생성. (Claude Code 면 `claude-md`.) 둘 다 필요하면 둘 다.
- 기존 파일 있으면 preview 먼저 보여주고 overwrite 여부를 사용자에게 확인.
- 생성 후 안내: **에이전트 세션을 재시작/리로드**해야 새 가이드가 반영됨(도구가 `next` 로 알려줌).

### Phase 3 — 트랙별 배선

- **html intent** — 설치/ import 불필요. `index.html` 에 `<html data-brand="<slug>">` + `<nds-*>` 작성 → `build_singlefile_html` 로 DS runtime/CSS inline 됨을 안내. 비율 점검은 `validate_html_mockup({ filePath, withStats:true })`.
- **admin-cms intent** —
  1. `get_setup({ step:'install', intent:'admin-cms', includeTailwind? })` → npm 설치 커맨드 실행.
  2. `get_setup({ step:'imports', brand })` → `src/main.tsx` 토큰/스타일/runtime import 배선.
  3. `get_setup({ step:'inspector', cwd })` → DsInspector dev-only 마운트(idempotent, MCP 가 직접 패치). dev 서버 재시작 후 우하단 floating 버튼(Ctrl/Cmd+Shift+D)으로 DS / antd / native 비율 실시간 확인.

### Phase 4 — 검증

- 생성된 `AGENTS.md`/`CLAUDE.md` 존재·브랜드 마커(`nudge.brand`) 확인.
- (admin-cms) dev 서버 기동 후 Inspector 패널이 뜨는지. (html) `validate_html_mockup` 으로 첫 마크업 검증 0 위반인지.
- 마지막: **다음 작업**(목업 작성 → ds-component / 품질 점검 → ds-quality-review) 으로의 진입점을 안내.

## 흔한 함정

- intent 를 React(admin-cms)로 오인 → html 워크스페이스에 불필요한 npm 설치·inspector 패치 시도(거부됨). **기본은 html.**
- 기존 `AGENTS.md`/`CLAUDE.md` 를 확인 없이 overwrite — preview 먼저, 사용자 확인 후.
- 가이드 생성 후 세션 리로드를 안 해서 "가이드가 안 먹는다" → `next` 안내대로 재시작.
- 브랜드 마커 누락 → 빌드가 브랜드를 못 잡음. brand 인자를 빼먹지 말 것.

## 안 하는 것

- DS 모노레포 자체 수정(컴포넌트/토큰/릴리즈) — 그건 `ds-component`/`ds-release`.
- 가이드 본문을 손으로 베껴 넣기 — 항상 `get_setup` 산출물을 SSOT 로.
