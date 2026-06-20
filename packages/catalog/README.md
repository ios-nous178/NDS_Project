# @nudge-design/catalog

**Docusaurus 문서 사이트와 Storybook 이 공유하는 카탈로그 UI** (아이콘 그리드 · 갤러리 · 프로젝트 커버리지 표). **비공개(`private`)** — 내부 도구일 뿐 npm 배포되지 않습니다.

## 의존 / 소비

- 의존: `tokens` · `icons`
- 소비: `apps/docs`, `apps/storybook`

## 역할

예전엔 docs 와 storybook 이 각자 카탈로그 화면(프로젝트 커버리지 표 등)을 따로 구현해 drift 가 났습니다. 이 패키지가 **단일 공유 컴포넌트**가 되어 양쪽이 같은 렌더러를 씁니다.

대표 컴포넌트:

- `ProjectCoverageTable` — 목표 컴포넌트 × 5프로젝트 × react/html 구현 현황 보드. 데이터/판정은 `scripts/coverage-logic.mjs`(node-free SSOT)를 공유.
- 아이콘 그리드 / 갤러리 뷰 등 카탈로그 표면.

토큰 셀프 스타일(`nds-cov-*` prefix)로 docs(라이트)·storybook 어디서든 동일하게 렌더됩니다.

> 외부 소비 대상이 아니며, 카탈로그 화면을 고칠 때만 손댑니다. 데이터 SSOT 는 `metadata/*` + `scripts/coverage-logic.mjs`.
