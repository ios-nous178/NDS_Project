# Chrome 정리 플랜 — 공개 primitive vs 목업 전용 brand-chrome (2026-06-15)

> 헤더/바텀네비/푸터/드로어/사이드바를 **공개 패키지에는 브랜드-무관 유연 primitive만** 두고, **브랜드 조립은 목업 전용 `nds-brand-chrome`으로** 모으는 정리 작업의 계획. 7개 라이브러리 조사로 방향을 검증했다.

## 배경 / 목표

현재 `react/src/{brand}/` 아래 24개 브랜드 파일이 base primitive(Header 등)를 브랜드 로고·기본값으로 감싼 **얇은 래퍼**로 공개 react 패키지에 출하된다. 이는 DS 편입기준("브랜드 분기 금지", "앱 비즈니스 로직 없음")과 어긋나고, 어떤 메이저 라이브러리도 안 하는 패턴이다.

목표: 공개 면(react/html)은 **브랜드를 모르는 primitive**만, 브랜드별 chrome 조립(service header/footer/bottomnav + admin sidebar)은 **목업 전용 `nds-brand-chrome`** 한 곳으로.

## 조사 근거 (요약)

라이브러리 7종(MUI·Ant·Mantine·Chakra·shadcn/Radix·Polaris/Carbon·RN Paper/Ionic/Vaul/Base UI) 조사 결론:

- **per-brand chrome를 출하하는 라이브러리는 0개** — 전부 chrome은 브랜드-무관, 브랜드 차이는 theme/token.
- **BottomNav는 모바일우선 시스템이 직접 가져야 함** — 데스크톱 위주 라이브러리는 BottomNav가 없다(드로어로 접음). Nudge는 모바일우선이라 net-new 가치.
- **Footer는 "앱마다 달라 표준화 안 함"이 다수설** → DS primitive로 두지 않는다(앱 소유).
- **API는 compound+슬롯이 react↔web-component 미러에 유리**(config-props 배열은 웹컴포넌트에서 어색).
- **테마 = scoped CSS 변수**(shadcn `--sidebar-*`, Carbon layer token) → Nudge `--nds-*`/`--semantic-*`와 1:1.

레포 실측으로 확인된 사실:

- react 브랜드 chrome = 24개 파일(chrome 19 + `NudgeEAPLogo` 1 + 트로스트 앱위젯 4).
- react 브랜드 chrome은 **목업엔진이 안 씀** — 목업은 html `nds-brand-chrome` 렌더. 실소비처 = 스토리북 + 각자 MCP 가이드.
- `componentInventory`의 `brandChrome:true` = 0개(인벤토리 정리 불필요).
- mirror-parity-baseline엔 `BrandChrome::`만 — 24개 react 브랜드 chrome은 html 짝이 없어 parity에 안 잡힘(제거해도 drift 0). 단 `html/test/brand-header-parity.test.ts` 별도 존재.
- `nds-brand-chrome` 현재 커버 = service chrome(header/footer/bottomnav). admin/sidebar는 아직 없음.
- `nds-page-header`는 목업 경로 미사용·인바운드 링크 0(완전 제거 안전).

## 교정된 타깃 인벤토리

공개 primitive (브랜드-무관):

| primitive             | 역할                                          | 상태                            |
| --------------------- | --------------------------------------------- | ------------------------------- |
| `Header`              | 글로벌 헤더 (variant app/webview/web)         | 유지                            |
| `BottomNav`           | 모바일 하단탭 (compound + 슬롯)               | 신설                            |
| `Drawer`              | 범용 임시 오버레이                            | 유지                            |
| `pattern:page-header` | 페이지 타이틀(Heading+Breadcrumb+actions+Tab) | PageHeader 컴포넌트 제거 → 패턴 |

목업 전용 chrome 패밀리 (`nds-brand-chrome`):

| 영역           | 내용                                       |
| -------------- | ------------------------------------------ |
| service chrome | 브랜드 header/footer/bottomnav (이미 있음) |
| admin chrome   | `nds-sidebar` 흡수 (지금 없음 → 추가)      |
| 공급           | 브랜드 토큰 + 브랜드 데이터(로고/메뉴)     |

공개에서 빠지는 것: `PageHeader`, react `Sidebar`, react 브랜드 chrome 19개.

## 결정사항 (확정)

- 트로스트 앱위젯 4개(EAPBanner·SearchForm·LoginSection·AppDownloadButton) — **제거** (2026-06-15, 보류→제거). 목업 전용이라 공개 react 에서 빼고, `EAPBanner` 는 `nds-brand-chrome` 의 브랜드-무관 `banner` 영역(`renderBrandBanner` + `--nds-brand-banner-*` 슬롯)으로 일반화 흡수 — 다른 브랜드도 `banner` 데이터만 주입하면 재사용. SearchForm/LoginSection/AppDownloadButton 은 소비처 0 이라 단순 제거.
- `NudgeEAPLogo` — **제거** (2026-06-15, 유지→제거). 6변종(koen/ko/en/en-dark/symbol)+DAIN SVG base64 는 `@nudge-design/assets`(brand-logo-defaults/manifest) SSOT 로 이관, 소비는 `BrandLogo`/브랜드 데이터로.
- `nds-sidebar` 물리적 위치 — **`nds-brand-chrome`에 코드 흡수(병합)**. standalone `nds-sidebar` 제거, admin chrome은 `nds-brand-chrome`의 한 형태로. 목업 경로(intake 라우팅·validator·가이드)도 nds-brand-chrome admin 형태로 전환해야 함.

## Phase 1 — `BottomNav` 신설 (additive · 비파괴, 먼저)

`/ds-component` 플로우로 3면 미러 신설:

- react: compound `<BottomNav activeKey onChange><BottomNav.Item icon label badge>`
- styles + html `nds-bottom-nav` + 스토리 + AllComponents 카탈로그 + MCP 가이드 + `figmaNodeUrl` + mirror-parity
- 색·브랜드는 `--nds-bottomnav-*` 슬롯 + 토큰(컴포넌트에 브랜드 박지 않음)

이로써 브랜드 BottomNav들이 감싸던 브랜드-무관 하단탭을 공식 primitive로.

## Phase 2 — `PageHeader` → `pattern:page-header` (BREAKING)

| 분류 | 작업                                                                                                                                                                                                                                                                       |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 제거 | `react/src/PageHeader.tsx` · `styles/src/PageHeader.ts` · `html nds-page-header.ts`(+exports/observedAttrs) · `PageHeader.stories.tsx` · `docs/components/page-header.mdx` · `guides-src/components/PageHeader.md` · inventory PageHeader · mirror-baseline `PageHeader::` |
| 수정 | `Heading.stories.tsx`의 PageHeader 참조 제거                                                                                                                                                                                                                               |
| 신설 | `guides-src/patterns/page-header.md` (Heading + Breadcrumb + actions row + Tab 조합)                                                                                                                                                                                       |

근거 부재(figmaUrl 빈값) + Heading 합성 thin wrapper라 패턴 강등이 정직(MultiStepForm 선례 동일).

## Phase 3 — `Sidebar` → 목업 전용, `nds-brand-chrome` 흡수 (BREAKING)

| 분류      | 작업                                                                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 제거      | `react/src/Sidebar.tsx` + export · standalone `html nds-sidebar` (코드는 nds-brand-chrome으로 이전)                                                     |
| 흡수      | `nds-brand-chrome`에 admin/sidebar 렌더 추가(결정 3=a). 스타일(`Sidebar.ts`)은 nds-brand-chrome이 사용하도록 이전/유지                                  |
| 미러      | nds-brand-chrome html-only waiver는 이미 존재 — admin 추가분 포함                                                                                       |
| 가이드    | `Sidebar.md` → nds-brand-chrome admin 사용으로 재프레이밍 · `cashwalk-biz-sidebar-example.ts` · `services/cashwalk-biz`를 nds-brand-chrome admin 형태로 |
| 목업 경로 | `intake.ts` 라우팅 · mockup-core validator(admin-sidebar/shell/logo)를 nds-sidebar → nds-brand-chrome admin 으로 전환                                   |
| 스토리    | `Sidebar.CashwalkBiz.stories.tsx` · `BrandLogo` 참조 → nds-brand-chrome 목업 데모로                                                                     |

## Phase 4 — 브랜드 chrome 19개 → 목업 전용 (BREAKING, 최대)

| 분류   | 작업                                                                                                                                                             |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 제거   | `react/src/{brand}/`의 AppBar·BottomNav·Footer·WebHeader·DesktopHeader·UtilityHeader·TabNavigation 19개 + 각 brand `index.ts` export (Logo·트로스트 위젯은 유지) |
| 가이드 | per-brand chrome 가이드(`GenietAppBar.md`·`NudgeEAPBottomNav.md`·`TrostWebHeader.md`…) 제거 또는 `pattern:brand-chrome`으로 통합                                 |
| 스토리 | `BrandHeader`·`BrandBottomNav`·`BrandFooter`·`BrandChrome.*.mdx`(5) → nds-brand-chrome 목업 데모로 전환/정리                                                     |
| 테스트 | `html/test/brand-header-parity.test.ts` 갱신/제거                                                                                                                |
| 보강   | nds-brand-chrome이 제거분(브랜드별 header/footer/bottomnav) 전부 커버하는지 확인                                                                                 |
| docs   | `brand-chrome.mdx` 갱신                                                                                                                                          |

## 시퀀싱

- **Phase 1(BottomNav)을 독립으로 먼저** — additive·고가치·de-risk. 별도 커밋/changeset.
- **Phase 2 + 3 + 4를 "chrome 통합" BREAKING 한 묶음** — changeset react/html major 한 벌.
- 각 Phase 소스 다 고치고 **끝에 1회 검증**(레포 규칙 "검증은 마지막에 한 번").

## 검증 (마지막 1회)

1. `pnpm fix` — catalog·attrs·guides.generated·guide-docs·inventory 파생물 재생성
2. `node scripts/generate-component-docs.mjs --check` — orphan 0 (page-header.mdx 제거 반영)
3. `pnpm lint:mirror-parity` — PageHeader 양면 제거 / nds-brand-chrome waiver 통과
4. `pnpm --filter @nudge-design/docs build` — onBrokenLinks 통과
5. `npx tsc --noEmit -p apps/storybook/tsconfig.json` — 스토리 import 깨짐 0
6. `pnpm changeset` — Phase 1: react/html minor(+mcp patch) / Phase 2-4: react·html **major**(+mcp patch)

## release-notes (비개발 톤)

- `BottomNav` 추가 — 모바일 하단 탭 공식 컴포넌트.
- `PageHeader` 제거 → "Heading + Breadcrumb + 액션 조합(pattern:page-header)"로 대체.
- react `Sidebar` 제거 → admin 사이드바는 목업 전용 `nds-brand-chrome`으로(코드 소비 대상 아님).
- 브랜드별 헤더/푸터/바텀네비 컴포넌트 제거 → 공개 primitive(Header/BottomNav/Drawer) + 브랜드 토큰으로, 목업은 nds-brand-chrome.

## 미해결 / 후속

- 트로스트 앱위젯 4개(EAPBanner·SearchForm·LoginSection·AppDownloadButton) 처리 — 별도 작업.
- `nds-brand-chrome` service+admin 통합 후 2538줄 비대 — 모듈 분리 검토.
- BottomNav `figmaNodeUrl` 확보.
