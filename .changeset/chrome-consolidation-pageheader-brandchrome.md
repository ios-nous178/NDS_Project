---
"@nudge-design/react": major
"@nudge-design/styles": major
"@nudge-design/html": major
"@nudge-design/mcp": patch
---

chrome 정리 — PageHeader 강등 + 브랜드 chrome 19개 제거 (BREAKING)

공개 면(react/html)은 브랜드를 모르는 primitive 만 두고, 브랜드 조립은 목업 전용
`nds-brand-chrome` 으로 모으는 정리. (chrome 통합 플랜 Phase 2 + Phase 4. Sidebar 흡수는 Phase 3 로 분리 진행 중.)

**제거(BREAKING)**

- **`PageHeader` 컴포넌트 제거** → `pattern:page-header` 로 강등. 페이지 헤더는 단일 컴포넌트가
  아니라 `Heading`(`level="h2" as="h1"`) + Breadcrumb + actions + (선택)Tab 조립이다. (Figma 가이드
  노드 없는 thin wrapper — MultiStepForm 선례와 동일.) react/styles/html 3면 + 스토리 + 문서 제거,
  새 패턴 가이드 `pattern:page-header` 신설.
- **브랜드별 chrome 컴포넌트 19개 제거** — `{Trost,Geniet,NudgeEAP,CashwalkBiz,Runmile}` 의
  AppBar·BottomNav·Footer·WebHeader·DesktopHeader·UtilityHeader·TabNavigation. 이들은 base
  primitive(Header/Footer/BottomNav)를 브랜드 로고·기본값으로 감싼 얇은 래퍼였고, 목업 엔진은
  이미 html `nds-brand-chrome`(`<nds-brand-header brand="...">` 등)만 사용한다.
  - **유지**: `NudgeEAPLogo`, 트로스트 서비스 위젯(EAPBanner·SearchForm·LoginSection·AppDownloadButton),
    그리고 목업 전용 html `nds-brand-chrome` 패밀리(전 브랜드 header/footer/bottomnav 커버).

**대체 경로**

- 브랜드 화면 chrome → 목업: `<nds-brand-header|footer|bottom-nav brand="...">` (MCP `component:BrandHeader` 등).
- 공개 primitive 가 필요하면 `Header` / `BottomNav` / `Footer` + 브랜드 토큰.
- 페이지 헤더 → `pattern:page-header`(Heading 조합).

**알려진 한계(후속)**: (캐시워크)트로스트 앱 BottomNav 변형(`cashwalk-trost`)은 `nds-brand-bottom-nav`
미지원 — 필요 시 BRAND_DATA 에 variant 추가 또는 `BottomNav` primitive 로 직접 조립.
