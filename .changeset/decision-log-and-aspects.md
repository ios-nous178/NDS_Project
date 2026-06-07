---
"@nudge-design/mcp": minor
---

Decision Log 누적 + get_guide 선택적 로딩(aspects) — "학습하는 DS" 파이프라인의 결정/스킬 단계 보강.

- **Decision Log (`designDecisions.jsonl`)** — `save_design_spec` 이 `design-spec.json`(매번 덮어씀) 옆에 화면의 `decisions[]` + 노드별 `rationale` 을 한 줄씩 누적한다. 결정의 시간순 이력/메모리 소스(다음 단계 Memory Read 의 입력).
  - MCP 안(`saveDesignSpec`)에서 추출하므로 PTY·stream·외부 소비 프로젝트 모두 동일하게 적용.
  - 화면 정체성(brand·surface·intent·name) 기준 dedup — 재저장/auto-fix 루프 중복 방지, 화면을 번갈아 저장해도 각 화면 기준 비교.
  - `ok` 를 dedup 해시에 포함 — 결정은 그대로인데 validation 이 false→true 로 바뀌면 새 행으로 남겨 '최종 승인 상태'를 기록(검증 전이 추적).
  - 최근 N행 상한(기본 200)으로 무한 증가/풀파일 비용 방지. 소비 프로젝트는 gitignore 권장.
  - 순수 코어(`buildDesignDecisionRow`) + IO(`appendDesignDecisionRow`/`readDesignDecisions`) 분리, best-effort(never throws).
- **`get_guide({ aspects })`** — principles 가이드를 화면이 실제 필요한 측면(slice)만 골라 슬림하게 받는 친화적 파라미터. `DESIGN_PRINCIPLES` 가 이미 aspect별 top-level 키(brandTone/colors/typography/spacing/elevation/shapes/dos/donts/bannedPatterns)로 쪼개져 있어 데이터 재구조화 없이 `pickSections` 경로 재사용.
  - 별칭: `radius`→shapes, `color`→colors, `tone`→brandTone, `font`→typography, `shadow`→elevation, `dos-donts`→dos+donts+bannedPatterns 등. `sections` 와 병합 가능.
  - principles 토픽에만 적용(컴포넌트/패턴은 키 체계가 달라 무시 — 배치 누수·오인 에러 없음). 일부 aspect 만 오타면 `_unknownAspects` 마커로 알림, 전부 미지면 `validAspects` 동반 에러.
- **`get_guide({ topic: 'principles' })` 학습된 원칙 승격(Decision Log → Principles)** — `<cwd>/designDecisions.jsonl` 에서 같은 브랜드의 서로 다른 화면 N개(기본 3) 이상에서 반복된 결정/근거를 `_learnedPrinciples` 블록으로 끌어올려 principles 응답에 머지한다. "반복된 결정 → 브랜드 관습" 을 자동 원칙화하는 단계.
  - brand = 명시 인자 → `cwd` 의 `nudge.brand` 마커 순으로 해석. cwd = 명시 인자 → MCP 프로세스 cwd(= `save_design_spec` 의 기본 기록 위치). 둘 다 best-effort — 파일 없음/임계 미만이면 응답 불변.
  - 화면별 최신 행으로 접어 재저장이 카운트를 부풀리지 않게 하고, ok=true 결정만 집계. count 내림차순 상한(기본 8). `aspects`/`sections` 슬라이스 뒤에 마커를 붙여 슬림 호출에도 항상 노출.
  - 순수 집계(`promoteDesignDecisions`)는 공용 코어(mockup-core)에 위치 — MCP·데스크탑·외부 소비 프로젝트가 동일 규칙 공유. `NUDGE_LEARNED_PRINCIPLES=0` opt-out, `NUDGE_PROMOTE_THRESHOLD` 로 임계 조정.
- 결정 로그 read-side(타입·상수·`readDesignDecisions`·`promoteDesignDecisions`)를 공용 코어 `@nudge-design/mockup-core/tools/design-decisions` 로 단일화(데스크탑 Memory Read 와 SSOT 공유). mcp 는 re-export 로 API 호환 유지.
- `save_design_spec` / `pattern:design-spec` 문서에 `designDecisions.jsonl` 부작용 명시. vitest 단위/통합 테스트 추가(design-spec 40 + guides 18).
