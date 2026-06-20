# 컴포넌트 문서 자동화 타당성 보고서 (2026-06-13)

"컴포넌트 설명 문서를 아예 자동화할 수 있는가"에 대한 조사 결과. **결론: 구조 데이터(props 표 ·
variant 값 · figma 링크 · 코드 예제)는 전부 자동화 가능하고, 그 토대(JSDoc 92%)도 이미 깔려 있다.
완전 자동화가 안 되는 건 사용 정책·함정 같은 판단 영역뿐이며, 이는 guides-src 에 한 번만 쓰고
나머지 표면을 전부 생성물로 돌리는 구조로 해결된다.**

## 1. 현황 — 같은 컴포넌트를 세 곳에서 설명하고 있다

| 표면                                                  | 수량     | 성격                                                            | 유지 방식          |
| ----------------------------------------------------- | -------- | --------------------------------------------------------------- | ------------------ |
| `packages/mcp/guides-src/components/*.md`             | 144      | 외부 전파 SSOT (frontmatter 13필드 + prose)                     | **수기**           |
| `docs/components/*.mdx` (Docusaurus, CI build 게이트) | 119      | 사람용 문서 사이트. Button 기준 357줄로 MCP 가이드(120줄)의 3배 | **수기**           |
| `apps/storybook/src/stories/*`                        | 149 파일 | 데모 + 인터랙션 테스트                                          | 수기 (성격상 적절) |

수기 표면이 둘(guides-src + docs/components)이라 같은 사실을 두 번 쓰고, 둘 다 react 소스와
드리프트할 수 있다. 게이트는 "생성물 stale" 만 막지 "수기 문서 ↔ 코드 불일치"는 못 막는다.

## 2. 자동 도출 가능성 실측

react 125개 컴포넌트의 Props JSDoc 커버리지: **92% (1,280 / 1,392 props)** — `@default` 표기까지
관례화되어 있다 (예: `/** 카드 스타일 변형 @default "outlined" */`). 즉 props 표는 지금 당장
타입+JSDoc 추출로 만들 수 있다.

| 문서 구성 요소                                                          | 자동화 | 소스                                           |
| ----------------------------------------------------------------------- | ------ | ---------------------------------------------- |
| props 이름·타입·기본값·설명 표                                          | ✅     | react 소스 타입 + JSDoc (92%)                  |
| variant/size/color enum 값                                              | ✅     | 타입 정의 union                                |
| import 구문 · 컴포넌트 존재 여부                                        | ✅     | `packages/react/src/index.ts`                  |
| figmaNodeUrl · validPropValues · 매트릭스 값                            | ✅     | guides-src frontmatter (이미 구조화됨)         |
| 코드 예제                                                               | ✅(준) | 스토리 render 추출 또는 가이드 코드블록 재사용 |
| 사용 정책("이럴 때 쓰지 마세요") · props 함정 · 프로젝트 오버라이드 prose | ❌     | 사람 판단 — guides-src 에만 1회 작성           |

기존 파이프라인이 이미 절반을 증명한다: `generate-guide-docs.mjs` 가 MCP 소스에서
`docs/guide/*.md` 를 생성하고 gates 가 stale 을 차단하는 구조가 **컴포넌트 문서에만 아직 없을 뿐**이다.

## 3. 제안 — docs/components 를 수기에서 생성물로 전환

guides-src(판단 영역의 SSOT) + react 소스(구조 영역의 SSOT) 를 합쳐 mdx 를 생성:

```
packages/react/src/*.tsx ──(타입+JSDoc 추출)──┐
                                              ├─→ generate-component-docs.mjs ─→ docs/components/*.mdx
packages/mcp/guides-src/components/*.md ──────┘        (gates.mjs 게이트 추가, pnpm fix 편입)
```

단계:

1. **추출기**: ts-morph(이미 devDep 인지 확인 필요)로 Props 인터페이스 → JSON. JSDoc 없는 112개
   prop 은 게이트 경고로 드러내 커버리지를 100%로 수렴시킨다.
2. **생성기**: 가이드 frontmatter/본문 + props JSON → mdx 템플릿. Playground/ComponentPreview
   같은 docusaurus 전용 인터랙티브 블록은 컴포넌트별 `*.custom.mdx` partial 로 보존(생성물에 include).
3. **게이트**: `scripts/gates.mjs` 에 check 1줄 추가 → check-ssot·fix-all·precommit 에 자동 편입.
4. **이행**: 기존 119개 mdx 의 수기 prose 중 가이드에 없는 내용은 guides-src 로 역이식 후 mdx 삭제.
   이 시점부터 컴포넌트 설명의 수기 표면은 guides-src 하나.

## 4. 리스크

- 기존 mdx 의 손맛(프로젝트별 스크린샷 멘트, 정합 검증 콜아웃)이 템플릿화되며 평준화됨 —
  partial 메커니즘으로 완화.
- 가이드가 없는 컴포넌트(현재 FormSection·SelectionButton 2건)는 생성 자체가 불가 →
  가이드 작성이 선행 조건이 되며, 이는 오히려 가이드 공백을 막는 순기능.
- 이행 라운드(역이식)가 119파일 분량의 일회성 비용 — 자동 diff 로 "가이드에 없는 문단"만 추리면
  실제 검토량은 크지 않다.

---

## 5. 구현 완료 (2026-06-13) — `scripts/generate-component-docs.mjs`

제안을 구현하면서 **전면 재생성 대신 마커 주입**으로 설계를 정제했다. 이유: 기존 mdx 의 손으로 쓴
prose·Playground·예제(특히 8개 인터랙티브 문서)를 guides-src 로 역이식하면 **guides-src(외부 MCP
소비자가 받는 AI용 SSOT)가 사람용 문서 prose 로 오염**된다. 대신 진실의 출처를 제자리에 둔다:

- **코드 → Props 표** (타입·기본값·JSDoc 설명) — 유일한 드리프트 클래스. 자동 생성.
- **guides-src → 판단**(사용 정책·함정) — AI 가 MCP 로 받는 그대로.
- **mdx → 사람 prose·예제** — 중복이 없으니 드리프트도 없다. 손대지 않고 보존.

생성기는 각 mdx 의 `## Props` 표만 `<!-- AUTO-GEN:props:START/END -->` 마커 사이에 주입한다.
표 바깥(가이드·예제·타입 별칭 노트·접근성)은 전부 그대로 남는다.

**결과:**

| 지표                                       | 값                                             |
| ------------------------------------------ | ---------------------------------------------- |
| Props 표 자동 생성 컴포넌트                | **107** (mappable 전부)                        |
| 자동 생성된 prop 행                        | **1,561**                                      |
| JSDoc 설명 누락 prop                       | **0** (구현 전 7건 → 소스 JSDoc 보강으로 해소) |
| 자동화 제외(카탈로그·프로젝트셸·별칭 페이지) | 11 (react 단일 컴포넌트 아님)                  |

**추출 방식:** `typescript`(5.9.3, 이미 설치됨) 컴파일러 API 로 `<Title>Props` 인터페이스의 직접
선언 prop 을 파싱(상속된 HTML 속성 제외 — 기존 mdx 관례와 동일). 기본값은 JSDoc `@default` 우선,
없으면 구현부 구조분해(`({ variant = "solid" })`)에서 원시 리터럴을 수집. ts-morph 불필요.

**게이트:** `scripts/gates.mjs` 에 `component-docs`(buildFree·ssot) 1건 추가 → check-ssot(CI)·
`pnpm fix`·precommit 에 자동 편입. 소스 타입/JSDoc 을 고치고 표를 재생성 안 하면 CI 가 차단한다.
`pnpm generate:component-docs`(쓰기) / `pnpm lint:component-docs`(검사) / `pnpm report:component-docs`(현황).

**남은 일(후속 라운드):**

- 11개 compound 문서(Modal/Select/Input 등)에는 파일 끝에 Props 참조 섹션을 새로 덧붙였다 —
  배치를 본문 흐름에 맞게 다듬을 여지.
- CSS 변수 표·`data-slot` 트리도 같은 마커 방식으로 코드에서 생성 가능(현재 Button 등 일부만 수기).
- 인터랙티브 Playground(8건)는 의도적으로 수기 유지 — 자동화 대상 아님.
