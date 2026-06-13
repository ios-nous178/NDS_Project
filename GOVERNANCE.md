# 거버넌스 (Governance)

이 디자인 시스템을 **어떻게 운영·확장·개선할지**의 규칙을 한곳에 모읍니다. 두 갈래로 나눕니다:

- **Track A — 무엇을 시스템에 포함시킬지** (Brand / Component / Token / Asset / Documentation)
- **Track B — 어떻게 더 잘 생성할지** (Learning / Validation / AI / Quality / Telemetry)

> **운영 철학**: 거버넌스의 상당 부분은 이미 **게이트·스킬·baseline**으로 코드에 강제돼 있습니다. 이 문서는 그 결정들을 *명문화하고 SSOT로 링크*하는 인덱스입니다. 정책 결정은 아래 **결정 (확정)** 표에 모았고, 일부는 정책만 확정·**구현은 후속**(🟡)입니다.

**상태 범례**: ✅ 구현됨(강제) · 🟡 정책 확정·강제 도구 미구현 · 🔴 미정

관련: [ARCHITECTURE.md](ARCHITECTURE.md) (구조) · [CONTRIBUTING.md](CONTRIBUTING.md) (기여 플로우) · [CLAUDE.md](CLAUDE.md)·MCP (규칙 SSOT)

---

## Track A — 무엇을 시스템에 포함시킬지

### A1. Component (컴포넌트/패턴 승격) — ✅

| | |
|---|---|
| **기준** | ① 2+ 브랜드 사용 or 명시 사유 ② Figma 가이드 노드(`figmaNodeUrl`) ③ 앱 비즈니스 로직 없음 ④ react+html 미러 동시 |
| **SSOT** | [CLAUDE.md](CLAUDE.md) "DS 편입 기준(admission)" · `/ds-component` 스킬 |
| **강제** | `guide-figma-links`(노드 누락 차단)·`mirror-parity`(미러 drift)·`storybook-catalog`(스토리/inventory) 게이트 |

신규 컴포넌트의 `figmaNodeUrl` 은 **waiver 로 우회 불가**(신규 가이드 baseline 항목은 `pnpm fix` 가 prune) — 디자인 근거 강제.

### A2. Token (신규 vs 재사용) — ✅

| | |
|---|---|
| **기준** | 토큰-퍼스트: raw hex 신규 금지. 시멘틱 2갈래만 — `--semantic-*`(Figma 정합) / `--nds-*`(컴포넌트 슬롯) |
| **SSOT** | `packages/tokens/src/` · [DESIGN.md](DESIGN.md) · `docs/guide/design-token-principles.mdx` · `token-review-checklist.mdx` |
| **강제** | `tokens-sync`(DESIGN.md↔src)·`brand-completeness`(5브랜드 정의/waiver)·`input-token-binding` 게이트 |

### A3. Brand (신규 브랜드 편입) — ✅ 절차 확정 (승인: DS 오너)

| | |
|---|---|
| **현황** | `brand-completeness` 게이트 + `packages/tokens/src/brands/<brand>.ts` 템플릿은 있으나, **"브랜드를 받을지" 의사결정 절차가 문서화돼 있지 않음** |
| **SSOT(기술)** | `scripts/check-brand-completeness.mjs` · `scripts/brand-completeness-baseline.json` |

**절차 (확정)** — 승인권자: **DS 오너**(D3):
1. **요청** — 실제 제품 필요 근거(2+ 화면) + 브랜드 오너 지정
2. **팔레트** — `brands/<brand>.palette.ts` 원시 색 정의
3. **시멘틱 매핑** — `brands/<brand>.ts` 가 base 시멘틱 leaf 를 **전부 명시 정의 or waiver**
4. **게이트 통과** — `pnpm lint:brand-completeness` green (silent base-fallback 0)
5. **DS 오너 승인 → 등재** — `BRANDS` 목록·tailwind preset·문서에 반영
> 원칙: 브랜드 차이는 **토큰 값으로만**. 브랜드 전용 컴포넌트는 **원칙 금지, 명시 사유 시에만 예외**(D4 — [ARCHITECTURE.md](ARCHITECTURE.md) "브랜드는 토큰으로만").

### A4. Asset (아이콘/로고/이미지) — ✅ 기술 / 🟡 추가기준

| | |
|---|---|
| **현황** | 아이콘: Figma→SVG→컴포넌트 파이프라인(일부 자동). 로고/자산: `@nudge-design/assets` SSOT |
| **SSOT** | `packages/icons/`(README) · `packages/assets/`(README) |
| **공백** | "어느 브랜드까지·언제 새 로고/일러스트를 받나"의 기준 미문서화. 중복 방지는 `find_icon`(MCP) 선조회 |

### A5. Deprecated / Breaking Change — 🟡 정책 확정, 강제 도구 미구현

| | |
|---|---|
| **현황** | `@deprecated` JSDoc 이 일부 prop 에 산발(예: `Card.tsx` description/metadata/footer), 폐기 토큰 alias(`--gap-*`→`--semantic-gap-*`). 아래 정책으로 통일 |
| **승인** | breaking change = **DS 오너** 단독 리뷰 + **major changeset 필수**(D1/D2) |

**정책 (확정)** — 변경을 3단계로 분류:
| 단계 | 의미 | 버전 | 의무 |
|---|---|---|---|
| **additive** | 기존 사용 안 깨는 추가 | minor (changeset) | — |
| **deprecation** | 대체 있음, 아직 동작 | minor | `@deprecated <대체> — <사유>` JSDoc + changeset 명시 |
| **breaking** | 제거/시그니처 변경 | **major** | DS 오너 승인 + major changeset + **마이그레이션 노트**(release notes) + MCP 가이드 갱신 |

**라이프사이클(확정)**: `@deprecated` 표기(대체 명시) → **최소 1 minor 릴리즈 유예**(동작 유지) → **다음 major 에서 제거.** 컴포넌트·prop·토큰·아이콘 동일.
- SSOT = `@deprecated` JSDoc(이미 사용 중) + changeset.
- **컨벤션**: `@deprecated` 1줄은 반드시 `@deprecated <대체 API> — <사유/since>` 형식.
- **후속(미구현)**: `@deprecated` 항목을 모아 "유예 중 / 제거 예정" 을 보여주는 게이트/생성물 — 정책 강제용. 필요 시 추가.

### A6. Documentation (언제 수정·누가 승인) — 🟡

| | |
|---|---|
| **현황** | 컴포넌트/패턴 가이드 SSOT(`packages/mcp/guides-src/**` → `guides.generated.ts`), 게이트가 figma 링크·생성 신선도 강제. **리뷰 승인권자는 미명시** |
| **SSOT** | `guide-docs`·`component-guides`·`guide-figma-links`·`mcp-tools-reference` 게이트 |
| **원칙** | 외부 소비자용 규칙 = MCP, 내부 기여자용 = 루트 문서. 규칙 중복 금지(drift 방지) |

---

## Track B — 어떻게 더 잘 생성할지

### B1. Validation (반복 문제 → 룰 → 자동 차단) — ✅ (가장 성숙)

| | |
|---|---|
| **현황** | **게이트 23개**(`scripts/gates.mjs` SSOT)가 CI/pre-commit/`pnpm fix` 3층에서 강제. 목업 검증은 MCP `validate_html_mockup`(raw hex/px·prop 매칭·brand cascade·primary 과다·장식 남용) |
| **SSOT** | `scripts/gates.mjs` · `scripts/check-*.mjs` · `packages/mockup-core/src`(validator) |
| **분류** | 룰 종류: `invariant`(불변) / `model-guard`(모델 오용) / `brand-policy`(브랜드 규칙) — 텔레메트리에 `ruleKind` 로 기록됨 |

### B2. Telemetry (수집·보관·열람) — ✅ 수집/보관 / 🟡 열람

| | |
|---|---|
| **수집** | MCP 도구 호출 시 Supabase 로 egress. Tier1 로컬 transcript 캡처 + Tier2 원격 이벤트 |
| **스키마** | `supabase/migrations/0001_mcp_telemetry.sql` — `mcp_sessions` · `mcp_events`(event_type + payload jsonb) · `obs_records` · `mcp_usage` + **뷰 `usage_weekly_summary`** |
| **이벤트** | `telemetry-egress.ts`: ValidationEvent(`rules[{rule, severity, ruleKind, count}]` + severitySummary) · 컴포넌트/아이콘/토큰 lookup(미스 포함) · feedback(원문 2k 컷) |
| **공백** | 저장만 됨 — **읽기/분석 UI 없음**(`apps/web-server` 미이관). RLS enable, anon 0 권한 |

### B3. Learning (피드백 → 누적 → 분석 → 개선) — 🟡 분석 레이어 구현, 연결·트리아지 남음

| | |
|---|---|
| **현황** | 수집 완비(B2) + **분석 레이어 추가됨**: 분석 뷰 5종(`supabase/migrations/0002_learning_views.sql`) + 주간 리포트 생성기(`scripts/learning-report.mjs`) + 주간 워크플로(`.github/workflows/learning-report.yml`, 슬랙+artifact) |
| **남은 것** | ① 실제 Supabase 프로젝트 생성 + CI secret(`SUPABASE_URL`/`SUPABASE_SERVICE_KEY`) 연결 ② 리포트 **액션 트리아지 오너/주기 확정**(D5) — 리포트는 신호만 주고, 게이트 강화/가이드 보강/폐기/신규편입 라우팅은 사람이 결정 |

**루프** — 이미 쌓이는 텔레메트리 위에 *분석+라우팅*을 얹음:

```
수집(있음)            분석(신규)                              개선/라우팅(신규)
mcp_events    ─▶  ① Top 위반 룰(severity 가중)        ─▶  게이트 강화 or 가이드 보강 → /ds-fix
 · validation     ② model-guard ruleKind 히트 0       ─▶  룰 폐기 후보 → changeset
 · lookup(miss)   ③ lookup 미스 Top(=환각/공백)        ─▶  가이드·별칭 추가 / 신규 컴포넌트 신호 → /ds-component
 · feedback       ④ feedback 테마                      ─▶  백로그/이슈
usage_weekly_summary(뷰)                                   주간 리포트(마크다운/슬랙)
```

- **②가 핵심 무료 이득**: egress 가 이미 `ruleKind: 'model-guard'` 를 "히트 0 추적(폐기 후보)용" 으로 분류 중 → 안 쓰이는 룰 자동 발견.
- **③ lookup 미스**: `find_component`/`find_token` 이 "찾았는데 없음" = AI 환각 or 진짜 공백 신호 → 가이드 보강 or 신규 편입 트리거.
- **구현**(후속): 주간 스케줄(GitHub Actions cron 또는 routine) → Supabase 집계 쿼리 → 리포트를 슬랙/GitHub 이슈로 → 트리아지해 위 스킬로 라우팅. **설계는 이 문서, 구현은 별도 작업.**
- **주기·오너·도착지(D5 확정)**: 주 1회 · DS 오너 트리아지 · 슬랙 + artifact.

### B4. Quality (좋은 목업의 정의) — 🟡 rubric 확정, 임계·👍/👎 수집 미구현

| | |
|---|---|
| **현황** | MCP `score_mockup_quality` 가 overall(0~100) 반환(검증 위반을 차원별 가중 → `computeScores`, 순수함수). 아래 rubric 으로 해석/합격선 통일 |
| **SSOT** | `packages/mcp` mockup validator · `score_mockup_quality` |

**rubric (확정·D7)** — 차원별 임계 + 사용자 만족도 신호 병행:

| 차원 | 본다 | 임계(초안) |
|---|---|---|
| 토큰 정합 | raw hex/px 0, 시멘틱/슬롯만 | error 0 |
| 컴포넌트 적합 | 용도에 맞는 DS 컴포넌트(추측/raw markup 아님) | 미스 0 |
| 접근성 | role/label/대비/포커스 | error 0 |
| UX 라이팅 | 톤·명사형·금지 패턴 | warn 최소화 |
| 밀도·강조 | primary CTA 과다·장식 chip·화살표 남발 | warn 최소화 |

- **합격선**: 각 차원의 error=0 + overall ≥ 임계(초안, 운영하며 보정).
- **👍/👎 사용자 만족도(D7)**: 점수만으로 못 잡는 "느낌"을 사람 신호로 보완 — 목업/컴포넌트에 **좋아요/별로예요** 반응을 수집해 품질 차원에 합산. **수집 메커니즘(미구현)**: `log_feedback`(MCP)에 `reaction: up|down` 필드 추가 → feedback 이벤트로 egress → 분석 뷰 `learning_satisfaction_weekly`(후속 마이그레이션)로 주간 집계. 점수(객관) + 👍/👎(주관)를 Learning 리포트(B3)에 나란히.

### B5. AI (AI 자동 판단 범위) — ✅ 경계 확정 (D6)

| | |
|---|---|
| **현황** | `find_*`(조회+환각 추적)·`suggest_replacement`·`recommend_page_pattern` |
| **경계(확정)** | 3단계 — ① **추천만**: 대체 컴포넌트·패턴 제안(`suggest_replacement`·`recommend_page_pattern`) ② **자동 수정**: 검증 가능한 **토큰·prop 위반**(raw hex→시멘틱, 잘못된 enum 등) ③ **차단(사람 확인)**: admission(figma 노드 없는 신규 편입)·**brand drift**·breaking — 자동 통과 금지 |

> 요지: 객관적·되돌리기 쉬운 위반(①②)은 AI 가 자동, 정책·디자인 근거가 필요한 판단(③)은 사람이 게이트.

---

## 결정 (확정 — 2026-06-14)

| # | 결정 | 확정값 |
|---|---|---|
| D1 | **Deprecation 유예 기간** | ✅ 최소 1 minor 유예 → 다음 major 제거 |
| D2 | **Breaking change 승인권자** | ✅ DS 오너 단독 리뷰 + major changeset 필수 |
| D3 | **Brand 편입 승인권자** | ✅ DS 오너 단독 |
| D4 | **브랜드 전용 컴포넌트 허용?** | ✅ 원칙 금지, 명시 사유 시에만 예외 |
| D5 | **Learning 리포트 주기·오너·도착지** | ✅ 주 1회 · DS 오너 트리아지 · 슬랙 + artifact (구현됨) |
| D6 | **AI 자동 수정 범위** | ✅ 토큰/prop 위반까지 자동, admission·brand drift 는 차단(사람 확인) |
| D7 | **Quality 합격선** | ✅ rubric 차원별 임계(B4) + 사용자 👍/👎 만족도 병행 |

> 임계 구체값(D7)·`@deprecated` 강제 게이트(A5 후속)·👍/👎 수집(B4 후속)은 운영하며 보정/구현.

---

## 우선순위 제안

정책은 확정됨(위 결정 표). 남은 것은 **구현/연결**:

1. **Learning 연결** — 분석 뷰·리포트·워크플로 ✅. 남은 건 Supabase 프로젝트 + CI secret(`SUPABASE_URL`/`SUPABASE_SERVICE_KEY`) 연결. 연결되면 "측정→개선" 루프가 살아 돌아감.
2. **👍/👎 수집(B4 후속)** — `log_feedback` 에 `reaction` 필드 + `learning_satisfaction_weekly` 뷰. (MCP egress + 마이그레이션)
3. **`@deprecated` 강제 게이트(A5 후속)** — 유예 중/제거 예정 목록 생성물 + 게이트.
4. **Quality 임계 구체값(D7)** — 운영 데이터로 차원별 컷 보정.
