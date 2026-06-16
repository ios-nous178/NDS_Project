# @nudge-design/icons

## 0.0.2

### Patch Changes

- 001e5e8: 외부 프로젝트(npm 소비) 정합 패치 — 3건:
  - **tokens**: 확장자 없는 `./css*` 서브패스에 `types` 조건 + `dist/css-stub.d.ts` 추가. TypeScript 6(새 Vite react-ts 템플릿 기본)에서 `import "@nudge-design/tokens/css"` 가 TS2882 로 깨지던 문제 해결.
  - **tokens/icons/react**: `sideEffects` 선언 추가 (tokens·icons `false`, react `["**/*.css"]`). 트리셰이킹이 살아나 소형 목업 기준 JS 번들 2,605 KB → 245 KB (gzip 625 → 75 KB).
  - **react**: `files: ["dist"]` 추가 — tarball 에 실리던 `src/`·`test/`·`.turbo/` 제거 (825 KB → 513 KB).

- 5549360: Geniet 흰색 하트(섀도우) 아이콘 2종 추가 — 이미지/사진 위 오버레이용
  - `GenietHeartSolidWhiteShadowIcon` (채움) · `GenietHeartWhiteShadowIcon` (아웃라인)
  - multicolor 계열로 추가해 흰색 fill + 드롭섀도우를 잠금 (mono 의 currentColor 정규화 대상이 아님). 흰 배경에서도 섀도우 헤일로로 외곽이 보이고, 사진 위에서 흰 하트가 또렷하게 떠오름.

- a50fb91: Geniet 아이콘 정리 — 글리프 교체 · 메달 크기 정규화 · 미사용 아이콘 제거
  - 하트(`GenietHeartIcon`·`GenietHeartSolidIcon`), 로그인/로그아웃(`GenietLoginIcon`·`GenietLogoutIcon`), 신발 채움(`GenietShoeSolidIcon`) 글리프를 새 디자인으로 교체 (viewBox `0 0 24 24` 정규화).
  - `GenietShoeIcon`(신발 라인)을 multicolor → mono 로 이동 — `currentColor` 로 색 변경 가능. root flat import(`@nudge-design/icons`)는 영향 없음, `/multicolor` subpath 직접 import 만 `/mono` 로 변경 필요.
  - 메달(`GenietGoldmedalIcon`·`GenietSilvermedalIcon`·`GenietBronzemedalIcon`) viewBox 정규화 — 하단 잘림 + 형제 아이콘 대비 ~20% 과대 렌더 수정.
  - 미사용 아이콘 제거: `GenietPlayIcon` · `GenietCheckcircleIcon` · `GenietMealGrayIcon`.

- 91764fe: 지니어트 아이콘 전수 갱신/추가 — Figma 지니어트 Library export

  다색 변형(arrow·calendar·bottomnavi on/off·G배지)은 **블랙/대표 1종만** `currentColor` mono 로, 그라디언트·컬러 일러스트는 색 보존 multicolor 로 임포트.
  - **mono(currentColor)**: `geniet-chevron-left/up/down`·`geniet-arrow-right-line`·`geniet-calendar`·`geniet-coupon`·`geniet-star`·`geniet-heart-solid`·`geniet-shoe-solid`·`geniet-basket`·`geniet-eye-off`·`geniet-gpoint-badge`·`geniet-nav-home/write/review/community/shopping` (흰색 디테일 보존)
  - **multicolor**: `geniet-gpoint`(mint→currentColor)·`geniet-clover`·`geniet-lottomachine`·`geniet-moneypouch`·`geniet-shoe`·`geniet-quiz`·`geniet-invite`·`geniet-ticket`·`geniet-scale`
  - **생성기 수정**: `svgToComponent` 가 소스 viewBox 보존(기존 24×24 하드코딩) — 비-24 아이콘(체중계·쿠폰·바텀네비·invite 등) 잘림 해결. 그라디언트 `stop-color`→`stopColor` 등 React 속성 변환 추가.

- 4ed845d: 아이콘 네이밍 일관성 정리 (브랜드 간 컨벤션 통일) — 일부 이름 변경(breaking)

  기존 import 이름이 바뀌므로 소비처는 새 이름으로 교체 필요. 같은 글리프, 이름만 변경.

  **오타 수정**
  - `RunmileAlramIcon` → `RunmileAlarmIcon` (·`-Active`·`-Off` 포함). geniet·trost 는 이미 `alarm`.

  **채움 표기 통일 (geniet 내부 `-fill` → `-solid`)**
  - `GenietShoeFillIcon` → `GenietShoeSolidIcon` (heart 가 쓰는 `-solid` 로 통일)

  **`img` → `image`**
  - `GenietImgErrorIcon` → `GenietImageErrorIcon`
  - `GenietImgGroupIcon` → `GenietImageGroupIcon`

  **검색 지우기 통일 (`search-clear` → `search-delete`)**
  - `RunmileSearchClearIcon` → `RunmileSearchDeleteIcon` (다른 3브랜드와 통일)

  **circle 어순 통일 (`circle-*` → `*-circle`, Material 관례)**
  - `GenietCirclePlusIcon` → `GenietPlusCircleIcon`
  - `GenietCircleWarningIcon` → `GenietWarningCircleIcon`
  - `GenietCircleDeleteIcon` → `GenietDeleteCircleIcon`
  - `RunmileCircleCheckIcon` → `RunmileCheckCircleIcon`
  - `RunmileCircleCheckColorIcon` → `RunmileCheckCircleColorIcon`
  - `RunmileCircleWarningIcon` → `RunmileWarningCircleIcon`
  - `RunmileCircleWarningStrokeIcon` → `RunmileWarningCircleStrokeIcon`

  **geniet 방향 아이콘 — 모양과 이름 정합**

  이전엔 `arrow-*` 가 실제로는 셰브론(꺾쇠), 꽉 찬 화살표는 `back/next/top` 이라 혼동. 모양 기준으로 정리:
  - 꽉 찬 화살표: `GenietBackIcon` → `GenietArrowLeftIcon` · `GenietNextIcon` → `GenietArrowRightIcon` · `GenietTopIcon` → `GenietArrowUpIcon`
  - 셰브론: `GenietArrowBackIcon` → `GenietChevronLeftIcon` · `GenietArrowRightIcon` → `GenietChevronRightIcon` · `GenietArrowUpIcon` → `GenietChevronUpIcon` · `GenietArrowDownIcon` → `GenietChevronDownIcon`

  **runmile 방향 아이콘 — 모양 정합 + 방향 교정**

  geniet 와 같은 셰브론/화살표 혼동에 더해, `arrow-left`/`arrow-right` 의 **글리프 방향이 이름과 반대**였음(좌우 뒤바뀜). 실제 글리프 기준으로 교정:
  - 꽉 찬 화살표: `RunmileBackIcon` → `RunmileArrowLeftIcon` · `RunmileTopIcon` → `RunmileArrowUpIcon` · `RunmileBottomIcon` → `RunmileArrowDownIcon`
  - 셰브론(방향 교정): `RunmileArrowLeftIcon`(글리프=우향) → `RunmileChevronRightIcon` · `RunmileArrowRightIcon`(글리프=좌향) → `RunmileChevronLeftIcon` · `RunmileArrowUpIcon` → `RunmileChevronUpIcon` · `RunmileArrowDownIcon` → `RunmileChevronDownIcon`

  > 글리프는 그대로(렌더 동일), import 이름만 변경. 만약 셰브론 글리프 자체의 좌우가 디자인 의도와 다르면 별도 글리프 수정 필요.

- f91ad95: 패키지를 Node-로더블 ESM 으로 전환 (번들러 없이도 동작):
  - 전 패키지 `"type": "module"` + tsc `module: NodeNext` 전환, 소스 상대 임포트에 `.js` 확장자 명시 (NodeNext 가 컴파일 타임에 강제).
  - exports 맵에 `default` 조건 추가 — Node ≥22 `require(esm)` 으로 CJS 소비도 동작.
  - 효과: Next.js SSR/RSC 를 `transpilePackages` 없이 사용 가능, Node 스크립트·tsx·vitest(외부화 모드)에서 직접 import 가능. Vite 목업 플로우는 동작·번들 크기 변화 없음 (실측 245 KB 유지).
  - icons 생성기(`scripts/generate.cjs`)가 barrels 에 `.js` specifier 를 emit 하도록 갱신. dist 는 per-file 산출 유지 — catalog/brand-completeness/MCPB 패킹 등 dist 레이아웃 의존 툴링 영향 없음.

- 9cdb78a: 아이콘은 정적 npm 으로만 배포 — S3 런타임 fetch / 버전 surfacing 제거

  SVG 아이콘을 S3 로 옮기던 작업을 되돌렸습니다. 아이콘은 작고(수 KB) 트리셰이킹·타입세이프·오프라인 렌더링 이점이 커서 정적 `@nudge-design/icons` npm 패키지로 유지하는 게 맞습니다(런타임 S3 fetch 는 FOUC 만 생기고 얻는 게 없음). 무거운 raster 자산(로고/일러스트)만 S3 하이브리드를 유지합니다.
  - `@nudge-design/icons`: `./remote-url`·`./manifest.json` 서브패스 export 제거, 빌드에서 S3용 manifest 생성 단계 제거. 아이콘은 자체 npm 버전 트랙(additive → patch/minor bump)을 유지하되 `manifest.json`/S3 에 미러하지 않습니다.
  - MCP/목업 스탬프: 아이콘 버전(`icon_version` / ICON 세그먼트) surfacing 제거. DS·asset 버전 표기는 그대로입니다.
  - 퍼블리시 스크립트(`publish-assets-s3`)·버전 sync(`sync-mcpb-version`)·MCPB 번들에서 아이콘 S3 경로 제거(에셋 S3 는 유지).

- 1d09bb3: 트로스트 브랜드 아이콘 세트 확장 (Figma 아이콘 가이드 동기화)
  - Figma Trost Iconography 라이브러리 기준으로 60여 종의 신규 트로스트 아이콘을 추가했습니다 — 내비게이션(chevron 4방향·arrow-back/forward), 액션(close·share·play·pause·skip·more·download·delete·camera·pencil·reply·coupon), 상태(question·info·caution·check·check-circle), 콘텐츠(heart·star·bookmark·eye·medal·book·people·thumb-up/down), 폼/기타(menu·list·memo·calendar·time·place·location·subway·web·call·headphone·message·consult) 등.
  - 기존 트로스트 아이콘(home·my·mentalcare·counsel-active·search·setting·psych-test·alarm·energy-coin)을 최신 Figma 가이드 도형으로 리프레시했습니다.
  - 결과 아이콘 TestresultSafe/Warning/Danger 를 다색(multicolor) 트랙으로 이동했습니다 — 시그니처 컬러를 보존하는 일러스트성 아이콘이라 `--semantic-icon-*` 토큰 오버라이드 대상이 아니기 때문입니다(icon-color 가이드 정합).
  - 단색(mono) 아이콘은 모두 `currentColor` 로 정규화되어 `color` prop / `--semantic-icon-*` 토큰으로 자유롭게 색을 바꿀 수 있습니다.

## 0.0.3

## 0.0.2

### Patch Changes

- 0.0.2 락스텝 버전 정렬 — DS 4개 패키지를 같은 버전으로 유지 (icons·tailwind-preset 코드 변경 없음, 버전 동기화).

## 0.0.1

Initial release.
