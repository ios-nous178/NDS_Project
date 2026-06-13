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
| 사용 정책("이럴 때 쓰지 마세요") · props 함정 · 브랜드 오버라이드 prose | ❌     | 사람 판단 — guides-src 에만 1회 작성           |

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

- 기존 mdx 의 손맛(브랜드별 스크린샷 멘트, 정합 검증 콜아웃)이 템플릿화되며 평준화됨 —
  partial 메커니즘으로 완화.
- 가이드가 없는 컴포넌트(현재 FormSection·SelectionButton 2건)는 생성 자체가 불가 →
  가이드 작성이 선행 조건이 되며, 이는 오히려 가이드 공백을 막는 순기능.
- 이행 라운드(역이식)가 119파일 분량의 일회성 비용 — 자동 diff 로 "가이드에 없는 문단"만 추리면
  실제 검토량은 크지 않다.
