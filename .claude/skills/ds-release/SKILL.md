---
name: ds-release
description: >-
  Nudge DS 패키지를 MCPB 로 릴리즈한다 — 선택한 패키지에 Changesets 버전 bump 를 만들고, 디자이너/PM/QA 가 읽을
  비개발자 톤 변경사항(`.release-notes/pending.md`)을 작성해 같은 커밋에 넣고, main push 까지. CI(release-mcpb.yml)가
  빌드/태그/슬랙 알림을 자동 처리한다. 트리거: "릴리즈 하자", "버전 올리자", "DS 배포해줘", "MCPB 올려줘",
  "/ds-release", "/ds-release 0.0.4". 단순 커밋/PR 은 이 스킬이 아니다(→ git-pr).
---

# ds-release — DS 패키지 MCPB 릴리즈

DS 패키지는 **Changesets** 로 버저닝한다. 자동화는 `release-mcpb.yml`(CI)이 하지만 **변경 기록(changeset + 슬랙용 release notes)은 사람/Claude 가 남겨야** 한다. 이 스킬은 그 과정을 끝까지 끌고 간다.

## 입력 형태

- `/ds-release` — 변경분을 확인한 뒤 릴리즈 대상 패키지와 bump 레벨을 사용자에게 물어본다.
- `/ds-release 0.0.4` — 목표 MCPB/root 버전을 0.0.4 로 둔다. 현재 버전과 비교해 patch/minor/major 를 계산하고, 어떤 패키지를 그 릴리즈에 포함할지 사용자에게 확인한다.
- `/ds-release 0.0.4 react,tokens,mcp` 처럼 패키지 목록이 같이 오면 그 목록을 초안으로 삼되, 실제 변경 파일과 changeset 누락을 대조해 빠진 패키지가 있으면 push 전에 확인한다.

목표 버전이 주어졌더라도 바로 파일을 고치지 말고, 먼저 `git status`, `.changeset/*`, 각 `package.json`, `packages/mcp/manifest.json` 을 확인한다. 목표 버전이 현재 버전보다 낮거나 같은데 새 릴리즈가 필요하다고 보이면 사용자에게 의도를 확인한다.

## 버전 SSOT (먼저 이해)

- **MCPB/root 릴리즈 버전 anchor** 는 Changesets fixed 그룹과 같은 DS 코드 패키지(`@nudge-design/{react,tokens,styles,tailwind-preset,html}`)의 `package.json` version 이다.
- 루트 `package.json` 과 `packages/mcp/manifest.json` 은 둘 다 그 **미러** — `sync-mcpb-version.mjs` 가 둘을 위 DS 코드 패키지의 최대 버전으로 끌어올린다.
- 루트 미러는 `pack-local-packages.mjs` 가 tarball 파일명에 박는 값이라, sync 빠지면 `pack` 이 의도치 않은 다운그레이드를 만든다 → 빠뜨리지 말 것.
- `@nudge-design/assets` 는 별도 버전 트랙이다. MCPB/root version anchor 에서 제외하고, `packages/mcp/manifest.json` 의 `asset_version` 에 현재 패키지 버전을 기록한다(assets 는 S3 호스팅이라 번들이 버전을 알아야 함). 따라서 assets 버전은 MCPB 버전과 달라도 정상이다.
- `@nudge-design/icons` 도 별도 npm 버전 트랙이지만 **정적 npm 패키지로만 배포**(S3 미사용)라 `manifest.json` 에 미러하지 않는다 — additive 추가 시 자체 changeset 으로 patch/minor bump 만 하면 된다. (아이콘은 트리셰이킹·타입세이프 유지를 위해 런타임 fetch 하지 않는다.)
- `@nudge-design/mcp`(내부)는 버전 SSOT 에선 분리돼 있지만 **MCP 서버 코드/가이드/검증 룰을 고쳤거나 외부 전파 의미가 있으면 함께 bump** 한다. 단순 DS 컴포넌트 변경만이면 사용자 확인 없이 무조건 포함하지 말고, 변경 파일 기준으로 포함 여부를 판단한다.
- 워크플로우 트리거 경로: `packages/mcp/src/**`, `packages/tokens/src/**`, `packages/react/src/**`, `packages/icons/svg/**`, `packages/mcp/manifest.json`. **단 `manifest.json` version 이 기존 tag 와 같으면 release skip** → step 2 의 자동 동기화가 핵심.
- CI `pnpm lint` 의 `sync-mcpb-version --check` 가 루트/manifest drift 와 `asset_version` drift 를 막는다(손으로 어긋나면 빨갛게). `pack-local-packages.mjs` 도 root ↔ DS 코드 패키지 일치를 assert.

## 릴리즈 대상 선택 규칙

1. `git status --short` 와 최근 커밋/changeset 을 보고 변경 파일을 패키지로 매핑한다.
2. 사용자에게 릴리즈 대상 패키지를 짧게 확인한다. 기본 추천은 실제 변경된 패키지 + 외부 전파에 필요한 패키지다.
3. 목표 버전이 주어졌으면 현재 MCPB/root 버전에서 목표 버전까지의 bump 레벨을 계산한다. 예: `0.0.3 -> 0.0.4` 는 patch, `0.0.3 -> 0.1.0` 은 minor.
4. fixed 그룹(`react`, `tokens`, `styles`, `tailwind-preset`, `html`) 중 하나를 올리면 Changesets 가 그룹 전체를 같은 버전으로 맞춘다. 사용자가 "react 만"이라고 해도 fixed 그룹 특성을 설명하고 진행한다.
5. assets/icons 를 포함하면 해당 패키지 changeset 을 따로 둔다. MCPB version 과 맞추지 않아도 된다. assets 는 `pnpm version-packages` 뒤 `sync-mcpb-version.mjs` 가 manifest 의 `asset_version` 을 맞춘다. icons 는 정적 npm 이라 manifest 미러가 없다(changeset 만).

## 절차

```bash
# 1. DS 소스 수정 후 변경 기록 (대화형 또는 .changeset/{name}.md 직접 작성)
pnpm changeset
#    영향 패키지 / major·minor·patch / 한 줄 요약. → .changeset/{auto-name}.md
#    fixed DS 코드 그룹, assets(S3)/icons(정적 npm) 별도 트랙, mcp 포함 여부를 변경 파일 기준으로 결정한다.
#    (가이드/원칙만 바꿔도 외부 전파 필요하면 영향 패키지 골라 patch.)

# 2. 누적 changeset 일괄 반영
pnpm version-packages
#    → 선택 패키지 package.json version bump + CHANGELOG.md 갱신
#    → 후속 자동: sync-mcpb-version.mjs(루트+manifest/asset_version sync) · sync-version-docs.mjs(docs 버전표)
```

### 3. 슬랙용 비개발자 톤 변경사항 — ★ 릴리즈에 항상 포함

- `.release-notes/pending.md` 에 디자이너/PM/QA 가 읽기 좋은 bullet 로 저장.
- CI 가 이 파일을 발견하면 Slack "이번 업데이트에서 달라진 점" 에 그대로 사용. **CI 는 이 파일을 수정하지 않음**(우리가 commit 한 그대로 나감). 없으면 git log fallback(개발자용 raw — 비개발자가 못 읽음).
- **[Claude 로 릴리즈 = 기본]** Claude 가 직접 `git log` 보고 이 파일을 비개발자 톤으로 작성한다. `pnpm release-notes` 스크립트는 안 돌려도 됨. "릴리즈 하자" 요청 받으면 step 1~2 직후·push 전에 자동으로 만들어 **같은 커밋에 포함**(사람이 한 번 읽고 OK).
- **[사람이 로컬에서]** `pnpm release-notes`(haiku 초안, `ANTHROPIC_API_KEY` 필요) / `pnpm release-notes:dry`(미리보기) / 또는 손으로 작성.

### 4. 커밋 + push (★ push 전 사용자 확인 게이트)

- changeset·version bump·`.release-notes/pending.md` 를 **먼저 커밋**.
- ★ **push 하기 전에 반드시 사용자에게 두 가지를 묻고 답을 받는다** — 묻지 않고 push 금지:
  1. **push 할지 여부** (지금 push? 아니면 커밋만 남기고 멈춤?)
  2. **어느 브랜치로 push 할지** (기본 권장: `main`. 사용자가 다른 브랜치를 지정하면 그대로).
- 사용자가 push 승인 + 브랜치 확정하면 그때 push → `release-mcpb.yml` 이 빌드/태그/슬랙까지 자동.
- 단, CI 자동 릴리즈는 **`main` 기준**으로 동작 — 사용자가 다른 브랜치를 고르면 "그 브랜치에선 자동 릴리즈가 안 돈다"는 점을 알리고 진행.
- GitHub Release body 는 손대지 않음(개발자용 raw 커밋 로그 = 디버깅용).

## 슬랙 공유용 톤 가이드 (`.release-notes/pending.md`)

읽는 사람이 **디자이너 / PM / 기획자 / QA**. 패키지명·prop명·타입명·리팩토링 단어("SSOT 단일화","리팩터")를 그대로 옮기면 못 읽음 — **효과 / 구조 / 경험으로 번역**.

**1. 항목 종결은 명사형** — `통합/단일화/표준화/강화/정리/합류/도입/전환/추가/개선` 우선. `~했다` 서술형 금지.

**2. 2단 구조** — 1단: 무엇이 바뀌었나(사용자 관점). 2단: 왜 좋아졌나/뭐가 가능해졌나. 숫자("5종 동시 추가")·Before→After 화살표 적극.

**3. 큰 릴리즈는 3단 섹션** — `배경` / `주요 변경사항` / `기대효과`. minor 이상(0.x.0)·신규 프로젝트/컴포넌트 다수면 적용. patch 한두 건이면 단순 bullet.

**4. 번역 예시** — 개발자 톤(좌) → 공유용 톤(우):

| Before (커밋/코드 톤)                                                | After (공유용 톤)                                                                      |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `InputGroup 추가, FormField density="admin" 기반 compact admin form` | **어드민 폼 구조 표준화** · 라벨/description/다중입력 정렬 개선 · admin UI 일관성 강화 |
| `AppBar/WebHeader/AppFooter/WebFooter 컴포넌트 unify`                | **프로젝트 헤더/푸터 단일화** · `<Header>`/`<Footer>` 하나로 통합 · 로고 6종 DS 내장     |
| `feat(mcp): visual reference gate + 5 retro bypass patterns`         | **MCP 가드레일 강화** · 시각 레퍼런스 확인 단계 추가 · 반복 우회/재작업 대응           |
| `refactor(coverage): project × component coverage SSOT 단일화`         | **프로젝트별 컴포넌트 커버리지 단일 출처화** · 어떤 프로젝트가 뭘 지원하는지 한눈에        |

**5. 길이** — 한 릴리즈당 5~8 항목 권장. 10 넘으면 묶거나 빼기.

## 안 하는 것

- push 여부·push 브랜치를 사용자에게 확인받지 않고 push(step 4 게이트 필수).
- 사용자가 `main` 외 브랜치를 골랐는데 "CI 자동 릴리즈가 안 돈다"는 점을 안 알리고 진행.
- `.release-notes/pending.md` 를 개발자 톤(커밋 로그 복붙)으로 — 비개발자가 못 읽음.
