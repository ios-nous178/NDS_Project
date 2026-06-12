---
name: ds-audit
description: >-
  Nudge DS 의 정합성·완전성을 감사한다 — 컴포넌트 하나(또는 DS 전체)에 대해 react/styles/html 3면 미러
  drift, 외부 전파 누락(export·스토리·AllComponents·MCP 가이드·changeset), 토큰 위반(raw hex·폐기 alias),
  Figma sync 누락(figmaNodeUrl), 브랜드×컴포넌트 커버리지, 빌드/타입 정합을 점검해 리포트한다. 고치진 않고
  **드리프트/공백을 찾아 보고**(수정은 /ds-fix·/ds-component 로 위임). 트리거: "DS 정합성 점검", "이 컴포넌트
  미러/외부전파 다 됐나 감사", "DS 감사 돌려줘", "스타일 시안이랑 맞는지 점검", "/ds-audit [Component|all]".
---

# ds-audit — DS 정합성·완전성 감사 (read-mostly)

컴포넌트 하나, 또는 DS 전체를 훑어 **어긋난 곳·빠진 곳**을 찾는다. 이번 레포에서 손으로 반복하던 점검("스타일 다 맞아?", "미러 됐나?", "외부 전파 빠졌나?")을 체계화한 것. **기본은 읽기 전용** — 발견을 리포트하고, 수정은 `/ds-fix`(다면 이슈)·`/ds-component`(컴포넌트)로 넘긴다.

## 범위

- `Component` 1개 — 그 컴포넌트의 모든 표면을 교차 점검.
- `all` / 전체 — 빠른 스윕으로 카테고리별 위반 목록(상위 N + 전체 카운트). 침묵 truncation 금지(잘랐으면 명시).
- (옵션) Figma URL 동봉 시 **시안 정합 게이트**까지.

## 점검 카테고리

### 1. 3면 미러 parity (react ↔ styles ↔ html)

- `packages/react/src/{C}.tsx` · `packages/styles/src/{C}.ts` · `packages/html/src/components/nds-{c}.ts` 가 같은 **클래스명·`data-slot`·치수·상태(data-\*)·동작**을 공유하는가.
- 한쪽에만 있는 slot/variant/size, 어긋난 치수(예: 한쪽 height 48 / 다른 쪽 40) → drift.

### 2. 외부 전파 완전성 (★ 가장 잦은 누락)

- React export(`react/src/index.ts`) · HTML export(`html/src/index.ts`) · Storybook 스토리 · **AllComponents 카탈로그 엔트리** · **MCP `COMPONENT_GUIDES` 엔트리(+`figmaNodeUrl`)** · changeset 이 다 있는가.
- 하나라도 빠지면 "고쳤는데 외부엔 안 나감" → flag.

### 3. 토큰 정합 (raw hex/폐기 alias)

- 컴포넌트/스타일에 **raw hex**(`#[0-9a-f]{3,6}`)가 박혀 있는가 → 금지(시스템 워터마크 등 의도적 예외는 화이트리스트).
- 폐기 prefix 사용: `--eap-*` / `--color-semantic-*` / `--gap-*` / `--inset-*`(→ `--semantic-gap-*`/`--semantic-inset-*` 로). `--semantic-*`(Figma 정합) vs `--nds-*`(DS 슬롯) 오용.
- `cv.*` 대신 직접 `var(--semantic-*)` 하드코딩 남발.

### 4. Figma sync

- `COMPONENT_GUIDES.{C}.figmaNodeUrl` 누락/깨짐. `list_figma_sync_status`(MCP)로 sync 안 된 컴포넌트 목록.

### 5. 브랜드 × 컴포넌트 커버리지

- 어떤 브랜드(Trost/Geniet/NudgeEAP/CashwalkBiz/Runmile)가 어떤 컴포넌트를 지원하는지 SSOT 대조. 브랜드 분기(`data-brand`)가 있어야 할 곳에 없는지/raw 하드코딩인지.

### 6. 빌드·타입 정합

- 건드린/대상 패키지 `tsc --noEmit` 클린(종료코드 파이프 없이 직접 확인).
- 관련 테스트(react/html vitest, mockup-core node --test) green.
- (stale `.tsbuildinfo` 오탐 주의 — 의심되면 클린 재실행.)

### 7. (옵션) 시안 정합 게이트 — Figma URL 동봉 시

- `get_metadata`/`get_design_context` 로 시안 실측(height/padding/radius/color) 추출.
- 빌드된 브랜드 CSS(`packages/html/dist/standalone/brand.*.css`)의 `--nds-*`/resolved 값과 1:1 대조. 어긋나면 컴포넌트가 아니라 **토큰/브랜드 cascade** 를 의심하라고 보고.

### 8. 패턴 잎(leaf) 커버리지 — **추천 패턴의 모든 조각은 실제 nds-\* 컴포넌트로 존재해야 한다**

- **원칙**: `pattern:*`(특히 `cashwalk-biz-*` 페이지/모달 패턴)이 "이렇게 조립하라"고 지시하는 **각 잎 요소가 전부 실재하는 `nds-*` 컴포넌트(또는 `nds-*` class)** 인가. 셀렉션/피커 모달처럼 단일 컴포넌트로 안 빼고 **패턴(조립)으로 두는 건 정상** — 단 그 전제는 잎이 다 nds 라는 것.
- **왜 중요**: 목업 점수 `dsRatio`(NDS%)는 "패턴이 한 개의 nds 태그인가"가 아니라 **잎 nds 컴포넌트를 센다**(`html-analyzer.ts` — layout div/p/span 은 분모 제외, 조립 ≠ 감점). 진짜 감점은 **재발명**(`avoidableReinvention`: `<div role=…>`·`<div onclick>`·raw landmark) 뿐. 따라서 패턴의 어떤 잎에 대응 `nds-*` 가 **없으면** → 목업 에이전트가 그 자리를 raw div+role/onclick 으로 재발명 → **점수 깎임 + 에이전트가 억지 수정 시도(thrash)**. 패턴을 컴포넌트로 감싸는 게 아니라 **빠진 잎 컴포넌트를 채우는 것**이 해법(→ `/ds-component`).
- **점검**: 각 `PATTERN_GUIDES.{p}.rules`/validator 힌트가 언급하는 `<nds-*>` 마크업을 훑어, 거기 등장하는 모든 태그가 `html/src/index.ts` export + runtime 등록에 실재하는지 대조. 패턴이 묘사하는데 DS 에 없는 조각(예: 과거 FormSection·SelectionButton 부재)이 곧 갭. `recommend_page_pattern`/validator 힌트가 가리키는 컴포넌트도 같이 확인.
- **출력**: 패턴 → 빠진 잎 컴포넌트 → 재발명 위험(어떤 raw 마크업으로 흘러갈지) → 권장(`/ds-component`로 잎 신설). "패턴을 단일 컴포넌트로 추출하라"는 권고가 **아니다** — 잎만 채우면 됨.

### 9. validator 룰 수명 (model-guard 폐기 후보 + 미분류 부채)

- **룰 분류 SSOT**: `packages/mockup-core/src/tools/html-validator.ts` 의 `RULE_META` — `invariant`(DS 계약, 폐기 대상 아님) / `model-guard`(AI 실수 패턴 가드 — 모델 세대 바뀌면 죽은 룰로 쌓임) / `brand-policy`(브랜드 분기 — 프로필 일반화 대상).
- **폐기 후보 리포트**: 텔레메트리 서버(nudge-telemetry-api, `:8091`)가 살아 있으면 validation 이벤트의 룰별 히트(`ruleKind` 포함)를 조회해, **`model-guard` 중 최근 30일 히트 0 인 `warn`/`info` 룰**을 폐기 후보로 나열. `error` 룰은 제외 — "룰이 효과적이라 위반이 사라진" 경우와 구분 불가. 서버 미가용이면 이 항목은 skip 하고 명시.
- **분류 부채**: `RULE_META` 에 없는 신규 룰(분류 누락) → flag. `brand-policy` 룰 중 브랜드 slug 가 코드에 하드코딩된 것의 수 = 프로필 일반화 잔여 지표로 보고.
- **자동 삭제 금지** — 후보 나열 + 사유까지만. 삭제 결정은 사람.

### 10. 미러 baseline 분류 부채 (TRIAGE-PENDING)

- `scripts/mirror-parity-baseline.json` 의 `reason: "TRIAGE-PENDING…"` 엔트리(주로 slot 누락 분)를 컴포넌트별로 열어 **의도(children 합성)인지 구현 누락인지 판정** → reason 을 실제 사유로 교체하거나 "미러 수정 필요" 로 보고. `reason: "TODO"` 잔존은 그 자체로 위반(check 게이트가 차단).

## 출력 (리포트, 수정 X)

- **카테고리별 표**: 위반/드리프트 → 위치(파일·라인) → 심각도 → 권장 조치(어느 스킬로 고칠지).
- 전체 스윕이면: 카테고리별 카운트 + 상위 항목. 잘린 게 있으면 명시.
- 마지막: "이거 고쳐줘" 하면 `/ds-fix`(다면)·`/ds-component`(컴포넌트)로 넘길 수 있음을 안내.

## 안 하는 것

- 직접 수정/커밋. (감사는 발견까지 — 수정은 별도 스킬.) 단, 사용자가 "고쳐줘"까지 한 번에 원하면 그때 위임.
- 침묵 truncation — 스윕에서 일부만 봤으면 무엇을 안 봤는지 보고.
