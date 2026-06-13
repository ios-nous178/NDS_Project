# 거버넌스 (Governance)

이 디자인 시스템을 **어떻게 운영·확장·개선할지**의 규칙을 한곳에 모읍니다. 두 갈래로 나눕니다:

- **Track A — 무엇을 시스템에 포함시킬지** (Brand / Component / Token / Asset / Documentation)
- **Track B — 어떻게 더 잘 생성할지** (Learning / Validation / AI / Quality / Telemetry)

> **운영 철학**: 거버넌스의 상당 부분은 이미 **게이트·스킬·baseline**으로 코드에 강제돼 있습니다. 이 문서는 그 결정들을 *명문화하고 SSOT로 링크*하는 인덱스이며, 아직 비어 있는 정책(🔴)은 **제안**으로 적고 [결정 필요](#결정-필요-open-decisions) 절에 모았습니다.

**상태 범례**: ✅ 구현됨(강제) · 🟡 부분(기술만/문서 없음) · 🔴 공백(정책 제안 단계)

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

### A3. Brand (신규 브랜드 편입) — 🟡 기술만 있음, 절차 없음

| | |
|---|---|
| **현황** | `brand-completeness` 게이트 + `packages/tokens/src/brands/<brand>.ts` 템플릿은 있으나, **"브랜드를 받을지" 의사결정 절차가 문서화돼 있지 않음** |
| **SSOT(기술)** | `scripts/check-brand-completeness.mjs` · `scripts/brand-completeness-baseline.json` |

**제안 절차** (→ [결정 필요](#결정-필요-open-decisions)):
1. **요청** — 실제 제품 필요 근거(2+ 화면) + 브랜드 오너 지정
2. **팔레트** — `brands/<brand>.palette.ts` 원시 색 정의
3. **시멘틱 매핑** — `brands/<brand>.ts` 가 base 시멘틱 leaf 를 **전부 명시 정의 or waiver**
4. **게이트 통과** — `pnpm lint:brand-completeness` green (silent base-fallback 0)
5. **승인 → 등재** — `BRANDS` 목록·tailwind preset·문서에 반영
> 원칙: 브랜드 차이는 **토큰 값으로만**. 브랜드 전용 컴포넌트는 예외이며 명시 사유 필요([ARCHITECTURE.md](ARCHITECTURE.md) "브랜드는 토큰으로만").

### A4. Asset (아이콘/로고/이미지) — ✅ 기술 / 🟡 추가기준

| | |
|---|---|
| **현황** | 아이콘: Figma→SVG→컴포넌트 파이프라인(일부 자동). 로고/자산: `@nudge-design/assets` SSOT |
| **SSOT** | `packages/icons/`(README) · `packages/assets/`(README) |
| **공백** | "어느 브랜드까지·언제 새 로고/일러스트를 받나"의 기준 미문서화. 중복 방지는 `find_icon`(MCP) 선조회 |

### A5. Deprecated / Breaking Change — 🔴 정책 없음 (가장 큰 Track A 공백)

| | |
|---|---|
| **현황** | `@deprecated` JSDoc 이 일부 prop 에 산발(예: `Card.tsx` description/metadata/footer), 폐기 토큰 alias(`--gap-*`→`--semantic-gap-*`) 정도. **유예 기간·제거 시점·승인 절차·마이그레이션 규칙이 전무** |

**제안 정책** (→ [결정 필요](#결정-필요-open-decisions)):

변경을 3단계로 분류:
| 단계 | 의미 | 버전 | 의무 |
|---|---|---|---|
| **additive** | 기존 사용 안 깨는 추가 | minor (changeset) | — |
| **deprecation** | 대체 있음, 아직 동작 | minor | `@deprecated <대체> — <사유>` JSDoc + changeset 명시 |
| **breaking** | 제거/시그니처 변경 | **major** | changeset major + **마이그레이션 노트**(release notes) + MCP 가이드 갱신 |

라이프사이클: **`@deprecated` 표기(대체 명시) → 최소 1 minor 릴리즈 유예(동작 유지) → 다음 major 에서 제거.** 컴포넌트·prop·토큰·아이콘 동일.
- SSOT = `@deprecated` JSDoc(이미 사용 중) + changeset.
- (후속 옵션) `@deprecated` 항목을 모아 보여주는 게이트/생성물 — 현재 없음, 필요 시 추가.

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
- → [결정 필요](#결정-필요-open-decisions): 주기·오너·리포트 도착지.

### B4. Quality (좋은 목업의 정의) — 🟡 점수만, rubric 없음

| | |
|---|---|
| **현황** | MCP `score_mockup_quality` 가 overall(0~100) 반환(검증 위반을 차원별 가중 → `computeScores`, 순수함수). **"좋은 목업"의 명시 rubric/해석 가이드는 없음** |
| **SSOT** | `packages/mcp` mockup validator · `score_mockup_quality` |
| **제안** | 점수 차원(토큰 정합·컴포넌트 적합·접근성·UX라이팅·밀도/강조)별 합격선과 해석을 rubric 문서로. 피드백 0건 즉시채택 vs 다회 재생성의 임계도 여기서 정의 |

### B5. AI (AI 자동 판단 범위) — 🟡 휴리스틱만

| | |
|---|---|
| **현황** | `find_*`(조회+환각 추적)·`suggest_replacement`·`recommend_page_pattern`. 판단은 스킬 본문 휴리스틱("토큰 부재면 flag") 수준 |
| **제안 경계** | 3단계로 명문화 — **추천만**(대체 컴포넌트·패턴 제안) / **자동 수정**(검증 가능한 토큰·prop 위반) / **생성 차단**(admission·figma 노드 없음·brand drift 등 하드 게이트). 어디까지 자동인지 = [결정 필요](#결정-필요-open-decisions) |

---

## 결정 필요 (Open Decisions)

아래는 정책을 확정하려면 팀/오너 판단이 필요한 지점입니다. 각 항목에 **제안 기본값**을 적어 뒀습니다.

| # | 결정 | 제안 기본값 |
|---|---|---|
| D1 | **Deprecation 유예 기간** | 최소 1 minor 릴리즈 유예 후 다음 major 에서 제거 |
| D2 | **Breaking change 승인권자** | DS 오너 1인 리뷰 + major changeset 필수 |
| D3 | **Brand 편입 승인권자** | 디자인 리드 + DS 오너 공동 |
| D4 | **브랜드 전용 컴포넌트 허용?** | 원칙 금지, 명시 사유 시 예외(현 정책 유지) |
| D5 | **Learning 리포트 주기·오너·도착지** | 주 1회 · DS 오너 트리아지 · 슬랙 + GitHub 이슈 |
| D6 | **AI 자동 수정 범위** | 토큰/prop 위반까지 자동, admission·brand drift 는 차단(사람 확인) |
| D7 | **Quality 합격선** | rubric 차원별 임계 — 초안 후 합의 |

---

## 우선순위 제안

거버넌스 *고도화*의 ROI 순서:

1. **Learning 루프 기동(B3)** — ✅ 분석 뷰·리포트·워크플로 구현 완료. 남은 건 Supabase 프로젝트 연결(secret) + 리포트 트리아지 오너 확정(D5). 연결되면 "측정→개선" 루프가 처음으로 닫힘.
2. **Deprecation/Breaking 정책(A5)** — 외부 소비자가 생기면 곧 필요. 정책 확정 + `@deprecated` 컨벤션 통일.
3. **Quality rubric(B4) + AI 경계(B5)** — score 해석과 자동화 한계를 명문화해 일관성↑.
4. **Brand admission(A3) 문서화** — 신규 브랜드 들어올 때 절차 확정.
