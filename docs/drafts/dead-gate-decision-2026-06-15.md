# 죽은/무력화된 게이트 3종 — 결정 보류 메모 (2026-06-15)

이번 "behavior/a11y 게이트" 작업에서 **구현하지 않고 결정만 미뤄둔** 항목 3종. 진단은 사실로 확인됨(아래). 각 항목은 정책/인프라(특히 secret) 결정이 얽혀 사용자 판단이 필요하다. 결정되면 별도 작업으로 처리.

> 컨텍스트: 레포 자체 냉철 감사가 "거버넌스 머신은 무겁고 출하는 0 · 신규 게이트 동결, 있는 걸 진짜로 만들라"고 결론. 이번 라운드는 그 방향대로 ① 꺼진 axe 게이트 활성화 + ② behavior-test ratchet 게이트 1개만 추가했다. 아래 3종은 "있는데 무력" 또는 "죽은 코드" — 노이즈를 줄이거나 진짜로 만들거나의 선택.

---

## 1. `lint:design` — 죽은 코드

**사실**

- `package.json` 에 `"lint:design": "npx @google/design.md lint DESIGN.md"` 정의만 있고 **어디서도 호출 안 됨** — `lint` 스크립트·`scripts/gates.mjs`·CI(`.github/workflows/*`)·husky/lint-staged 어디에도 없음.
- DESIGN.md 정합은 **이미 `tokens-sync` 게이트**(`scripts/sync-tokens.mjs --check`, gates.mjs ssot)가 검증 — DESIGN.md(SSOT) → tokens/src 동기화 drift 를 막는다. `@google/design.md` linter 와는 검증 축이 다르다(이쪽은 토큰 파생 정합).
- `@google/design.md` 의존성 자체는 살아있음 — `export:tailwind`·`export:dtcg` 스크립트가 사용.

**선택지**

- **(A·추천) 삭제** — `lint:design` 한 줄 제거. 죽은 코드 정리, 혼란 제거. DESIGN.md 검증은 tokens-sync 가 이미 함.
- (B) lint 체인에 편입 — `@google/design.md lint` 가 tokens-sync 가 못 잡는 무언가(스키마/포맷)를 잡는다면 `pnpm lint` 에 추가. **단** 그게 뭔지 먼저 확인 필요(중복이면 노이즈).

**미결정 질문**: `@google/design.md lint` 가 tokens-sync 와 겹치지 않는 고유 검증을 하나? → 아니오면 (A).

---

## 2. coverage 80% 임계치 — 절대 발화 안 함

**사실**

- `packages/react/vitest.config.ts:10` — `enabled: process.env.COVERAGE === "true"`. 임계치 `statements:80 / branches:65 / functions:80 / lines:80` (16–21줄)이 정의돼 있으나 `COVERAGE=true` 를 **레포 전체 어디서도 set 안 함**(CI `pnpm test` 도 안 줌). → 커버리지 자체가 안 돌고 임계치도 못 깬다.
- `test:coverage` 같은 스크립트도 없음.
- 현실: react 컴포넌트 ~105개 중 ~16개만 테스트(이번에 8개 추가 → ~24). **지금 80% 하드 게이트를 켜면 CI 즉시 빨개짐** + 노이즈(거버넌스가 경계하는 "무력/노이즈 게이트" 패턴).

**선택지**

- **(A·추천) 정보성 리포트만** — CI 에 `COVERAGE=true pnpm --filter @nudge-design/react test` 단계를 **차단 안 하는**(`continue-on-error` 또는 별도 비-게이트 job) 형태로 추가해 커버리지 추세만 노출. 임계치는 현실에 맞게 낮춰 시작하고, behavior-test 게이트로 위젯이 채워지면 점진 ratchet.
- (B) 임계치 자체 제거 — 발화 안 하는 죽은 설정을 정직하게 삭제(추후 필요 시 재도입).
- (C) 그대로 둠 — 로컬 `COVERAGE=true pnpm test` 로 개발자가 수동 확인하는 용도로만(현행).

**미결정 질문**: 커버리지를 "차단형 게이트"로 키울 의지가 있나, 아니면 추세 가시화로 충분한가? behavior-test 게이트(구조적 ratchet)가 이미 "중요 위젯 무테스트"를 막으므로 line-coverage 하드게이트의 한계효용은 낮음. → (A) 또는 (B) 권장.

---

## 3. Chromatic — "시각 회귀 게이트"가 아니라 "변경 로그"

**사실** (`.github/workflows/chromatic.yml`)

- 토큰 없으면 전체 skip — `if: env.CHROMATIC_PROJECT_TOKEN == ''` (46–47줄).
- main: `--auto-accept-changes`(baseline 자동 갱신).
- **PR: `--exit-zero-on-changes`**(67줄) → 시각 diff 가 있어도 exit 0, PR 차단 안 함.
- `CHROMATIC_PROJECT_TOKEN` 이 repo secret 에 실제 설정돼 있는지는 **코드로 확인 불가**(사용자만 앎). 설정 안 돼 있으면 워크플로우는 항상 skip = 완전 무력.

**선택지**

- **(A·추천, 단 조건부) 차단형 전환** — PR 단계에서 `--exit-zero-on-changes` 제거 → 승인 안 된 시각 변경이 PR 을 막음. **전제**: ① 토큰이 secret 에 설정돼 있을 것, ② main baseline 이 한 번 정상 발행돼 안정적일 것. 안 그러면 모든 PR 이 "리뷰 대기"로 막혀 역효과.
- (B) 정보성 유지 — 현행 유지하되, 이게 "차단 게이트가 아님"을 README/CONTRIBUTING 에 명시(기대치 정렬).
- (C) 토큰 미설정이면 제거 — 영영 skip 될 워크플로우면 정리.

**미결정 질문(사용자만 답 가능)**:

1. `CHROMATIC_PROJECT_TOKEN` 이 GitHub repo secret 에 설정돼 있나?
2. 시각 회귀를 PR 차단 기준으로 삼을 팀 합의가 있나(리뷰 부담 vs 보호)?
   → 둘 다 예 → (A). 토큰 없음 → (C) 또는 설정부터.

---

## 결정 체크리스트 (사용자)

- [ ] **lint:design**: 삭제(A) / 편입(B)
- [ ] **coverage**: 정보성 리포트(A) / 임계치 삭제(B) / 현행 유지(C)
- [ ] **Chromatic**: 차단형(A, 토큰·baseline 전제) / 정보성 명시(B) / 제거(C) — _먼저 토큰 설정 여부 확인_

결정되면 해당 항목만 별도 PR/커밋으로 처리. 이번 behavior/a11y 작업에는 포함하지 않음.
