---
name: ds-quality-review
description: >-
  빌드된 HTML 목업을 D1(정적 코드 점수)·D2(정성 LLM 점수)로 채점하고, verdict(pass/warn/fail)와 차원별
  약점 → 수정 우선순위 리스트를 만든다. validate_html_mockup(D1) + score_mockup_quality(D2)를 돌려 두 축의
  가장 약한 그룹 기준으로 게이트 판정하고, 무엇을 먼저 고칠지 정렬해 보고한다. 트리거: "이 목업 품질 점수
  매겨줘", "D1/D2 채점해줘", "목업 점수랑 고칠 우선순위 뽑아줘", "이 화면 DS 품질 게이트 통과해?",
  "/ds-quality-review <html|경로>", "$ds-quality-review <html|경로>". DS 컴포넌트 감사는 ds-audit.
---

# ds-quality-review — 목업 품질 점수화 & 수정 우선순위

> Codex skill. 명시 호출은 `/skills` → `ds-quality-review` 또는 `$ds-quality-review <html|filePath>`.
> Nudge DS MCP 의 `validate_html_mockup`(D1 코드 점수)·`score_mockup_quality`(D2 정성 점수)를 호출한다.
> 대상은 **빌드된/작성된 HTML 목업 산출물**(단일 파일 또는 경로) — 컴포넌트 소스 감사가 아니다(→ ds-audit).

목업 하나를 두 축으로 채점하고, 점수만 던지는 게 아니라 **어디를 먼저 고쳐야 통과하는지** 정렬해 준다. D1·D2 의 임계값·verdict 는 데스크탑 렌더러·MCP 응답과 같은 SSOT(`quality-score-core`)를 쓴다.

## 두 축 (무엇을 보는가)

- **D1 — 정적 코드 점수** (`validate_html_mockup`): 마크업이 DS 규칙(시멘틱 `<nds-*>` 채택, 토큰 사용, 금지 패턴 부재, 구조)에 맞는지 정적으로 채점. `withStats:true` 로 DS / native 채택 비율까지. 빠르고 결정적.
- **D2 — 정성 LLM 점수** (`score_mockup_quality`): 정적 validator 가 못 보는 **인터랙션·흐름·폼 상태·UX 라이팅** 품질을 독립 LLM scorer 가 채점(ux/interaction/flow/form 차원). HTML 은 stdin 으로 파이프. 느리지만 D1 의 사각지대를 본다.

## 임계값 / verdict (게이팅 SSOT)

- 점수 0~100. **≥80 pass · ≥60 warn · <60 fail** (`SCORE_THRESHOLDS = { pass:80, warn:60 }`).
- 종합 verdict 는 **가장 약한 그룹 기준** — D1 overall·D2 overall 중 하나라도 미달이면 전체 미달(`gradeQuality` 가 `min` 으로 게이트). "코드 점수는 높은데 통과로 보고" 하지 말 것.
- 차원 라벨은 한국어(`scoreLabel`) 사용 — 카드/칩과 동일.

## 플로우

### Phase 0 — 인테이크

- 대상 확보: 인라인 HTML 문자열, 또는 `filePath`(빌드 산출물 — 보통 `build_singlefile_html` 결과 단일 파일). 브랜드/surface 가 있으면 채점 컨텍스트로 전달.
- 아직 안 빌드됐으면 `build_singlefile_html` 로 먼저 산출물을 만든 뒤 채점(빌드 응답에는 D1 score 게이트가 이미 붙어 옴).

### Phase 1 — D1 (빠른 정적)

- `validate_html_mockup({ filePath|source, withStats:true, report:false })` → 위반 목록 + 코드 차원 점수 + DS 채택 비율.
- 위반이 0 이 아니면 그 자체가 1순위 수정거리(정적 룰은 결정적이라 먼저 친다).

### Phase 2 — D2 (정성)

- `score_mockup_quality({ filePath|source, brand?, surface? })` → ux/interaction/flow/form 차원 점수 + overall.
- 실패/타임아웃이면 그대로 보고(미채점이라고 통과로 간주하지 않음 — verdict 는 D1 기준으로만, 단 "D2 미채점" 명시).

### Phase 3 — 종합 & 우선순위

- `gradeQuality(D1, D2)` 관점으로 종합 verdict 산출(약한 그룹 기준).
- **수정 우선순위 리스트** 생성 — 정렬 기준:
  1. D1 **위반**(룰 위반·금지 패턴) — 결정적, 무조건 최상위.
  2. fail(<60) 차원 — D1/D2 불문, 점수 낮은 순.
  3. warn(60~79) 차원 — pass 문턱(80)까지 끌어올릴 항목.
  4. DS 채택 비율이 낮으면(native/antd 잔존) 시멘틱 컴포넌트 치환 제안.
- 각 항목에 **무엇을·왜·어떻게**(어느 컴포넌트/토큰/패턴으로 고칠지) + 가능하면 `get_guide`/`find_component` 로 근거 링크.

### Phase 4 — 보고

- 점수 카드(차원별 점수 + verdict) → 종합 verdict(약한 그룹 명시) → 우선순위 리스트.
- 게이트 통과 여부와 "통과까지 남은 것" 한 줄.
- 수정 실행은 위임: 목업 자체 수정은 목업 플로우, DS 쪽 문제(토큰/컴포넌트 부재로 native 를 쓸 수밖에 없던 경우)는 `ds-component`/DS 수정 루프로 라우팅.

## 흔한 함정

- D1 만 보고 pass 선언 → D2 가 fail 이면 전체 fail. **약한 그룹 기준**을 잊지 말 것.
- D2 미채점(타임아웃/취소)을 통과로 둔갑 — "미채점"으로 명시하고 D1 기준만 게이트.
- 점수만 던지고 우선순위를 안 줌 — 이 스킬의 핵심은 **고칠 순서**다.
- 채점 대상이 소스 컴포넌트인 경우 — 그건 `ds-audit`. 이 스킬은 **빌드된 목업 산출물**만.

## 안 하는 것

- 목업/컴포넌트 직접 수정 — 점수화 + 우선순위까지. (사용자가 "고쳐줘" 하면 해당 수정 스킬로 위임.)
- 임계값/verdict 를 임의로 바꿔 판정 — SSOT(`quality-score-core`)를 따른다.
