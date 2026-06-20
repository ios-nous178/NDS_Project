---
"@nudge-design/react": major
"@nudge-design/tokens": major
"@nudge-design/html": major
"@nudge-design/styles": major
"@nudge-design/tailwind-preset": major
"@nudge-design/assets": major
"@nudge-design/mcp": major
---

브랜드(brand) → 프로젝트(project) 전면 리네임 — 서비스 구분 축 명칭 통일 (BREAKING)

서비스(trost / geniet / nudge-eap / cashwalk-biz / runmile)를 구분하는 축의 명칭을 "brand"에서 "project"로 통일했습니다. **하위호환 별칭은 두지 않았으니 외부 소비처는 아래대로 갱신해야 합니다.**

- **HTML 속성**: `data-brand` → `data-project` (CSS 셀렉터 `[data-brand=…]` 포함)
- **컴포넌트**: `BrandLogo` → `ProjectLogo`, `nds-brand-chrome` → `nds-project-chrome` (커스텀 엘리먼트 `nds-project-header` / `-footer` / `-bottom-nav` / `-logo`), prop `brand` → `project`. `ProjectLogo`의 prop 타입은 중복 유니온(구 `BrandLogoBrand`)을 없애고 `@nudge-design/tokens`의 `ProjectSlug`를 재사용 — 타입이 필요하면 `ProjectSlug` 또는 `ProjectLogoProps["project"]`를 쓰세요.
- **토큰 export**: `@nudge-design/tokens/brands` → `/projects`, `/brand-profiles` → `/project-profiles`; 타입 `BrandSlug` → `ProjectSlug`, 상수 `BRAND_PROFILES`/`BRAND_SLUGS` → `PROJECT_PROFILES`/`PROJECT_SLUGS`, `useBrand` → `useProject`
- **에셋 export**: `@nudge-design/assets/brand-logos` → `/project-logos`, `/brand-logo-metadata` → `/project-logo-metadata`, `/brand-logo-defaults` → `/project-logo-defaults`
- **MCP**: 도구 `get_brand` → `get_project`, 도구 파라미터 `brand` → `project`, 마커 파일 `nudge.brand` → `nudge.project`

**유지(변경 없음)** — "브랜드 컬러" 시멘틱 토큰은 '강조·주색'이라는 색 역할을 뜻하므로 그대로 둡니다: `--semantic-*-brand-*`, Tailwind `bg-brand`/`text-brand`/`fill-brand` 등, `cv.*.brand`, Text `tone="brand"`.
