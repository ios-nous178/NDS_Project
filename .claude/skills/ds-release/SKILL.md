---
name: ds-release
description: >-
  Nudge DS 패키지를 MCPB 로 릴리즈한다 — Changesets 로 버전 bump 하고, 디자이너/PM/QA 가 읽을 비개발자 톤
  변경사항(`.release-notes/pending.md`)을 작성해 같은 커밋에 넣고, main push 까지. CI(release-mcpb.yml)가
  빌드/태그/슬랙 알림을 자동 처리한다. 트리거: "릴리즈 하자", "버전 올리자", "DS 배포해줘", "MCPB 올려줘",
  "/ds-release". 단순 커밋/PR 은 이 스킬이 아니다(→ git-pr).
---

# ds-release — DS 패키지 MCPB 릴리즈

DS 패키지는 **Changesets** 로 버저닝한다. 자동화는 `release-mcpb.yml`(CI)이 하지만 **변경 기록(changeset + 슬랙용 release notes)은 사람/Claude 가 남겨야** 한다. 이 스킬은 그 과정을 끝까지 끌고 간다.

## 버전 SSOT (먼저 이해)

- **DS 4개 패키지**(`@nudge-design/{react,tokens,icons,tailwind-preset}`)의 `package.json` version 이 **SSOT**.
- 루트 `package.json` 과 `packages/mcp/manifest.json` 은 둘 다 그 **미러** — `sync-mcpb-version.mjs` 가 둘을 최대 DS 버전으로 끌어올린다.
- 루트 미러는 `pack-local-packages.mjs` 가 tarball 파일명에 박는 값이라, sync 빠지면 `pack` 이 의도치 않은 다운그레이드를 만든다 → 빠뜨리지 말 것.
- `@nudge-design/mcp`(내부)는 의도적으로 분리. 함께 bump 하려면 changeset 에 명시.
- 워크플로우 트리거 경로: `packages/mcp/src/**`, `packages/tokens/src/**`, `packages/react/src/**`, `packages/icons/svg/**`, `packages/mcp/manifest.json`. **단 `manifest.json` version 이 기존 tag 와 같으면 release skip** → step 2 의 자동 동기화가 핵심.
- CI `pnpm lint` 의 `sync-mcpb-version --check` 가 루트/manifest drift 를 막는다(손으로 어긋나면 빨갛게). `pack-local-packages.mjs` 도 root ↔ DS 4개 일치를 assert.

## 절차

```bash
# 1. DS 소스 수정 후 변경 기록 (대화형 또는 .changeset/{name}.md 직접 작성)
pnpm changeset
#    영향 패키지 / major·minor·patch / 한 줄 요약. → .changeset/{auto-name}.md
#    (가이드/원칙만 바꿔도 외부 전파 필요하면 영향 패키지 골라 patch.)

# 2. 누적 changeset 일괄 반영
pnpm version-packages
#    → DS 4개 package.json version bump + CHANGELOG.md 갱신
#    → 후속 자동: sync-mcpb-version.mjs(루트+manifest sync) · sync-version-docs.mjs(docs 버전표)
```

### 3. 슬랙용 비개발자 톤 변경사항 — ★ 릴리즈에 항상 포함

- `.release-notes/pending.md` 에 디자이너/PM/QA 가 읽기 좋은 bullet 로 저장.
- CI 가 이 파일을 발견하면 Slack "이번 업데이트에서 달라진 점" 에 그대로 사용. **CI 는 이 파일을 수정하지 않음**(우리가 commit 한 그대로 나감). 없으면 git log fallback(개발자용 raw — 비개발자가 못 읽음).
- **[Claude 로 릴리즈 = 기본]** Claude 가 직접 `git log` 보고 이 파일을 비개발자 톤으로 작성한다. `pnpm release-notes` 스크립트는 안 돌려도 됨. "릴리즈 하자" 요청 받으면 step 1~2 직후·push 전에 자동으로 만들어 **같은 커밋에 포함**(사람이 한 번 읽고 OK).
- **[사람이 로컬에서]** `pnpm release-notes`(haiku 초안, `ANTHROPIC_API_KEY` 필요) / `pnpm release-notes:dry`(미리보기) / 또는 손으로 작성.

### 4. 커밋 + main push

- changeset·version bump·`.release-notes/pending.md` 를 커밋 → main push → `release-mcpb.yml` 이 빌드/태그/슬랙까지 자동.
- GitHub Release body 는 손대지 않음(개발자용 raw 커밋 로그 = 디버깅용).

## 슬랙 공유용 톤 가이드 (`.release-notes/pending.md`)

읽는 사람이 **디자이너 / PM / 기획자 / QA**. 패키지명·prop명·타입명·리팩토링 단어("SSOT 단일화","리팩터")를 그대로 옮기면 못 읽음 — **효과 / 구조 / 경험으로 번역**.

**1. 항목 종결은 명사형** — `통합/단일화/표준화/강화/정리/합류/도입/전환/추가/개선` 우선. `~했다` 서술형 금지.

**2. 2단 구조** — 1단: 무엇이 바뀌었나(사용자 관점). 2단: 왜 좋아졌나/뭐가 가능해졌나. 숫자("5종 동시 추가")·Before→After 화살표 적극.

**3. 큰 릴리즈는 3단 섹션** — `배경` / `주요 변경사항` / `기대효과`. minor 이상(0.x.0)·신규 브랜드/컴포넌트 다수면 적용. patch 한두 건이면 단순 bullet.

**4. 번역 예시** — 개발자 톤(좌) → 공유용 톤(우):

| Before (커밋/코드 톤)                                                | After (공유용 톤)                                                                      |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `InputGroup 추가, FormField density="admin" 기반 compact admin form` | **어드민 폼 구조 표준화** · 라벨/description/다중입력 정렬 개선 · admin UI 일관성 강화 |
| `AppBar/WebHeader/AppFooter/WebFooter 컴포넌트 unify`                | **브랜드 헤더/푸터 단일화** · `<Header>`/`<Footer>` 하나로 통합 · 로고 6종 DS 내장     |
| `feat(mcp): visual reference gate + 5 retro bypass patterns`         | **MCP 가드레일 강화** · 시각 레퍼런스 확인 단계 추가 · 반복 우회/재작업 대응           |
| `refactor(coverage): brand × component coverage SSOT 단일화`         | **브랜드별 컴포넌트 커버리지 단일 출처화** · 어떤 브랜드가 뭘 지원하는지 한눈에        |

**5. 길이** — 한 릴리즈당 5~8 항목 권장. 10 넘으면 묶거나 빼기.

## 안 하는 것

- main 이 아닌 브랜치에서 릴리즈(먼저 main 으로). 사용자 확인 없이 push.
- `.release-notes/pending.md` 를 개발자 톤(커밋 로그 복붙)으로 — 비개발자가 못 읽음.
