# 레포 냉철 분석 — 2026-06-14

> 8개 관점 병렬 감사(29 에이전트, critical/high 21건 적대적 검증)의 정리본.
> **스코프**: push / release 로 풀리는 항목은 제외했다 — 미푸시 커밋·release-notes·changelog 범위·태그 단조성(버전 0.0.3 은 리프로젝트 시 **의도적 초기화**라 문제 아님)·"npm 미배포" 자체. 여기 남은 것은 **push 와 무관하게 워킹트리/시스템 자체에 존재하는 문제**다.
> 검증 과정에서 초기 가설 일부가 반증됐고, 그 정정도 각 항목에 반영했다(severity 는 검증 후 값).

---

## 한 줄 결론

거버넌스 머신은 **"파일 A 가 파일 B 를 베꼈는가(drift)"** 를 정밀하게 검사하지만, 정작 **진짜 결함을 잡을 게이트 — 접근성·시각 회귀·커버리지·동작 — 은 전부 꺼져 있거나 비차단(`|| true` / `--exit-zero-on-changes` / env 미설정)** 이다. 그리고 출하되는 표면(react 컴포넌트)의 회귀 안전망이 가장 얇다.

**의례(ceremony)는 무겁고, 실제 보호는 가볍다.** 23개 게이트·6,788줄 스크립트·6겹 SSOT 미러 체인의 무게 상당 부분이 "컴포넌트 1개 = 5패키지 11+ 터치포인트" 라는 높은 진입장벽 때문에 사람이 실수하는 것을 검사로 덮는 데 쓰인다 — 근본 비용(미러 면 수)을 줄이지 않고.

---

## 테마별 정리

### 1. 품질 게이트가 "동작/접근성"을 안 막는다 — 가장 시급

| 문제                                                                                                                                                      | severity | 근거                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| **Storybook 테스트가 `\|\| true` 로 실패를 삼킴** — 83개 interaction `play` + a11y(`test:"error"`, color-contrast 등 7룰)가 전부 exit 0. CI 초록이 무의미 | **high** | `apps/storybook/package.json:9`, `ci.yml:74-75`(주석이 "추후 수정 추적"이라 자인, 날짜·이슈 없음) |
| **coverage 80% threshold 가 절대 발화 안 함** — `COVERAGE=true` 를 어디서도 안 줌                                                                         | medium   | `packages/react/vitest.config.ts:10`. 레포 전체에 `COVERAGE` 문자열은 이 파일 하나뿐              |
| **Chromatic 시각 회귀가 비차단** — 토큰 부재 시 전체 skip + PR `--exit-zero-on-changes` + main 자동수락                                                   | medium   | "시각 회귀 게이트"가 아니라 "시각 변경 로그" 수준                                                 |
| `lint:design`(DESIGN.md 검증)이 **어디서도 호출 안 되는 죽은 게이트**                                                                                     | low      | DESIGN.md↔tokens 정합 무방비                                                                      |

> 핵심: 게이트 23개 중 16개가 미러/카탈로그/문서 **동기화** 검증이다. drift 게이트는 **양쪽 다 틀려도 통과**시킨다 — "올바로 동작/접근가능한가"는 거의 안 본다.

**액션**: Storybook `|| true` 제거(실패 스토리 allowlist 로 신규만 차단) → a11y·interaction 차단성 복구. coverage ratchet 도입(`COVERAGE=true` + 현재 실측치 baseline, 하향만 차단). Chromatic PR `--exit-zero-on-changes` 를 핵심 스토리에 한해 제거.

### 2. 미러-parity 게이트 자체가 허약

| 문제                                                                                                       | severity | 근거                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **prop-name drift 전부 무조건 advisory(비차단)** — react 에 prop 추가하고 html 에 안 넣어도 CI 초록        | medium   | `check-mirror-parity.mjs:181` `ADVISORY_KINDS=Set(["prop-name"])`. 스크립트 헤더는 "이 회귀가 최대 사각지대라 막는다" 자칭 — 정면 모순 |
| baseline 194건 중 **149건(77%)이 단일 보일러플레이트 사유**("camelCase↔kebab 패러다임 차이 — 일괄 흡수분") | medium   | 그 안에 BottomSheet 처럼 **진짜 다른 API**(`mask`/`close-on-esc` 한쪽만 존재)가 "표현 차이"로 은폐됨                                   |
| **Badge·ValidationChip 이 공유 styles 를 우회** — react/html 양쪽에 토큰 색맵 손복제, drift 무방비         | medium   | `Badge.tsx:18-121` ↔ `nds-badge.ts:36-153` 색맵 byte-identical. styles 에 `Badge.ts` 없음. 어떤 게이트도 둘의 값 drift 를 비교 안 함   |

**액션**: 신규 prop-name drift 중 "상대편에 대응 0개"인 진짜 누락만 blocking 으로 분리. 보일러플레이트 149건 재트리아지. Badge/ValidationChip 색맵을 styles 로 추출(다른 100개 컴포넌트 패턴).

### 3. 테스트 무게중심 역전

| 문제                                                                                                                                    | severity | 근거                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| **react 103개 중 17개만 테스트**(83% 무테스트) — DataTable·MultiSelect·Autocomplete·Slider·Carousel 등 상호작용 복잡 위젯이 회귀 가드 0 | medium   | `packages/react/test/component/` 18파일. _완화: html 미러 438케이스 + Chromatic + 117스토리가 일부 보완_ |
| **tokens·styles 패키지 테스트 0** — 프로젝트 cascade·`var()` 합성·project-completeness 로직이 정적 `--check` 게이트에만 의존                | medium   | silent base-fallback 같은 버그 클래스를 단위 수준에서 못 잡음                                            |

**액션**: react 폼/오버레이/데이터 계열 동작·a11y 테스트 보강. `check-input-tests.mjs`("신규만 차단" 게이트)를 입력류→상호작용 컴포넌트 전반으로 확장. coverage ratchet 과 묶으면 자연 증가.

### 4. 토큰 / 프로젝트 부채

| 문제                                                                                                                                  | severity | 근거                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **프로젝트 토큰 값 검증 게이트 부재** — 프로젝트 색이 100% 사는 `tokens/src/projects/`(16파일)는 전부 수기 + Figma/DESIGN.md 정합 강제 없음 | medium   | `sync-tokens.mjs` 는 primitive 5파일만 커버(`project` 문자열 0건). project-completeness 게이트는 leaf **존재**만 검사, 값 비교 안 함 |
| **raw hex 차단 lint 부재** — `cv.textRole.inverse` 토큰이 있는데 `#fff/#000` 직박이 6개 컴포넌트에 산재                               | medium   | project-completeness 도 raw hex 는 못 잡음                                                                                         |
| CLAUDE.md 가 명시한 마이그레이션 숙제 미완 — Modal/Popup 취소버튼 순수 색, DatePicker 캘린더 글리프 mask 토큰                         | medium   | 신규 프로젝트 추가 시 컴포넌트 CSS 를 뒤져야 함(원칙 위반)                                                                         |

**액션**: `check-raw-hex` 게이트 추가(주석 hex 허용). 프로젝트 토큰 leaf 형식/값 검증 게이트(Figma 자동화 로드맵과 묶기). 취소버튼 색을 `--nds-{c}-cancel-*` 슬롯으로, 캘린더 글리프를 `--nds-{c}-icon` mask 슬롯으로 추출.

### 5. 문서 / SSOT 드리프트

| 문제                                                                                                           | severity   | 근거                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **퍼블릭 docs 사이트에 제거/리네임된 컴포넌트 페이지가 라이브** — 죽은 `import { Tabs }` 를 라이브 JSX 로 렌더 | medium     | 실제 orphan **18개**(tabs·empty-state·confetti·content-viewer·expandable-text·circular-progress·number-stepper·countdown-timer·app-bar·web-header·segmented-control 등) |
| **component-docs 게이트가 orphan mdx 를 skip 만 하고 차단 안 함**                                              | medium     | `generate-component-docs.mjs:291`, baseline `{"skip":{}}`. 소스 없는 mdx 가 영구 누적돼도 CI 통과                                                                       |
| **SSOT 인 CLAUDE.md 가 파생물보다 stale** — "게이트 16개"(실제 **23**)                                         | (교정완료) | `gates.mjs` 에 23개 id                                                                                                                                                  |
| "EAP 멘탈케어 플랫폼" 프레이밍 — 회사는 EAP 전문이 아니라 캐시워크 계열 멀티프로젝트                             | (교정완료) | EAP 는 첫 DS 적용 영역일 뿐                                                                                                                                             |
| **컴포넌트 문서/메타가 4중 SSOT** — guides-src(AI) + docs mdx(사람) + storybook + 코드 props                   | medium     | 카운트 불일치(react 103/styles 100/html 108/가이드 124/mdx 99)가 이 다중 동기화 실패의 증상. drift 차단을 게이트로 떠받치는 게 경계 설계의 보상기제                     |

**액션**: orphan 18개 정리(삭제/리네임/allowlist) + component-docs 게이트에 orphan **차단** 추가(이 커밋에서 시작). docs(Docusaurus)와 storybook 의 갤러리 역할 중복을 `@nudge-design/catalog` 단일 inventory 로 강제 동기화.

### 6. 패키징 부채 (잠재 — 출하 시점에 터지지만 설정은 지금 이미 틀림)

| 문제                                                                                                                   | severity | 근거                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| **tailwind-preset 이 5프로젝트 중 2개(trost·cashwalk-biz)만 import** — geniet/runmile 의 atomic palette·전용 radius 누락 | medium   | `tailwind-preset/src/index.ts:14-31`. _시멘틱 var 는 공유돼 색 자체는 렌더됨 — 누락은 alias·non-color 토큰_ |
| **icons 에 per-icon 서브패스 export 부재** — 비번들 ESM(Jest/SSR)에서 단일 아이콘 import 가 4076-export 배럴을 거침    | medium   | `"./mono/*"` 와일드카드 서브패스 추가로 해소                                                                |
| **assets 6.3MB 래스터(png 163)가 tgz 에 통째로** — react 소비자가 transitive 로 전부 끌어옴                            | medium   | S3 remote-url + base64 fallback 결정과 부분 충돌                                                            |
| `styles` 패키지 `sideEffects` 미설정 — 일부 번들러가 CSS 를 트리쉐이크해 날릴 위험                                     | low      | `"sideEffects":["**/*.css"]` 명시                                                                           |

### 7. 거버넌스 머신 무게 / bus-factor

| 문제                                                                                                                    | severity | 근거                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------- |
| **컴포넌트 1개 = 5패키지 11+ 터치포인트 + 풀빌드 50~75초**                                                              | medium   | 게이트 무게의 상당수가 "진입장벽이 높아 실수하는 것"을 검사로 보정                             |
| **bus-factor 1** — 최근 200커밋 중 199개가 1명. fix-all 의 turbo 2단 우회·generatedAt churn 복원 등 암묵지가 1인에 집중 | medium   | 이 사람이 빠지면 머신이 멈춤. memory/ 의 방대한 세션 기록 자체가 단일 운용자의 작업기억 외부화 |
| **6겹 SSOT→생성물 미러 체인** + ~45k줄 생성물 커밋 → PR diff 신호대잡음 악화                                            | medium   | agents-md·skills-sync·build-guides·component-docs·tokens-sync·mcpb-version                     |
| TS project references 부재 → turbo 전량 재빌드 의존(증분성 없음)                                                        | low      | composite 도입으로 빌드 순서 자동 도출                                                         |

---

## 우선순위 (push 무관)

### 즉시 (quick, 이 커밋에서)

1. CLAUDE.md "16개"→"23개" + "EAP 멘탈케어 플랫폼"→"캐시워크 계열 멀티프로젝트" + `sync:agents-md` ✅
2. orphan docs 18개 정리(삭제 9·리네임 3·allowlist 6) + component-docs 게이트 orphan 차단 ✅
3. `mcp` 에 `private:true`, icons/assets 버전 정렬

### 게이트 실효화 (moderate, ROI 최상)

1. Storybook `|| true` 제거 → a11y·interaction 차단성 복구
2. coverage ratchet(`COVERAGE=true` + 실측 baseline)
3. raw-hex 차단 게이트 + 프로젝트 토큰 값 검증 게이트
4. mirror-parity: 진짜 누락만 blocking 으로 분리, 보일러플레이트 149건 재트리아지

### 점진 (large, 근본)

1. react 폼/오버레이 동작·a11y 테스트 보강(검증 무게중심을 공개 표면으로 재배분)
2. Badge/ValidationChip 색맵 styles 추출, 미러 면 수 재평가(저사용 컴포넌트 단면 강등)
3. **신규 게이트 추가는 신중히** — drift 게이트는 이미 과포화. 다음 투자는 behavior/a11y 축에 집중

---

## 잘 되어 있는 것 (균형)

- 의존 그래프 무순환, 레이어(tokens→styles→react/html→mcp) 깨끗
- 폐기 alias(`--eap-*`·`--gap-*` 등) styles 에서 완전 제거 — 토큰 위생 양호
- 패키지 메타데이터(exports/NodeNext/sideEffects) 형식적으로 거의 흠 없음
- GOVERNANCE.md 가 🟡/🔴 로 미구현을 정직 표기

## 검증이 교정한 초기 오진 (정직 기록)

- ❌ "a11y 설정이 죽은 config" → `preview.ts:975` 에 살아있음(`test:"error"`). 진짜 문제는 `|| true` 가 그 결과를 삼키는 것
- ❌ "테스트 66%가 내부도구" → 케이스 기준 22%. html 공개미러 438케이스를 무시한 오집계
- ❌ "부가 제품군이 DS 릴리즈에 묶임" → desktop/web-server 는 별도 워크플로우로 분리됨
- ❌ "버전 단조성 파괴" → 0.0.3 은 리프로젝트 시 **의도적 초기화**, 문제 아님(이번 스코프에서 제외)
