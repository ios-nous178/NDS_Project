---
"@nudge-eap/icons": patch
"@nudge-eap/mcp": patch
---

Geniet 브랜드 전용 아이콘 27종을 `@nudge-eap/icons` 에 편입.

### 1차: GenietHomePage 운영 SVG 정제 (19개)

- `GenietHomePage` 레포 `public/images` 의 SVG 36개 중 UI 아이콘 19개만 DS 표준(viewBox 24×24, currentColor) 으로 정제해서 svg/ 에 `geniet-*.svg` prefix 로 추가. 일러스트·배너 7개와 mood 캐릭터 10개(condition+emoji)는 별도 패키지 후보로 분리.
- 컴포넌트: GenietAlarmIcon, GenietArrowBack/Down/Up/Right/RightStepperIcon, GenietMenuIcon, GenietMypageIcon, GenietCopyIcon, GenietLoginIcon, GenietLogoutIcon, GenietRecordOn/OffIcon (pair), GenietPlayIcon, GenietCheckcircleIcon, GenietConfettiIcon, GenietCouponIcon, GenietCashreviewIcon, GenietGpointIcon.
- 변환 일회성 헬퍼: `packages/icons/scripts/import-geniet.mjs` — 원본 viewBox(16/18/20/24/28/54/64) 를 24 컨테이너로 transform-scale 한 뒤 fill/stroke hex 를 currentColor 로 일괄 치환. 마스크 안 흰색(`#fff`, `#FEFEFE`) 과 `none`·`url(...)` 참조는 보존.

### 2차: Figma 지니어트-Dev bottom nav + header 추출 (8개 추가)

- Figma 파일 `wDL8a2RbsglC8KjNufn3ks` 의 노드 207:3204 (bottomnavi platform=app(geniet)) 와 207:2483 (header/PC) 에서 누락된 아이콘 추출.
- 컴포넌트: GenietHomeOnIcon, GenietWriteOffIcon, GenietBenefitOn/OffIcon (pair), GenietReviewOn/OffIcon (pair), GenietCommunityIcon, GenietSearchIcon.
- 변환 헬퍼: `packages/icons/scripts/import-figma-geniet.mjs` — Figma 식 `fill="var(--fill-0, #111111)"` 패턴까지 currentColor 로 치환. preserveAspectRatio·width="100%"·style 같은 Figma 전용 속성 strip.

### 공통

- `packages/mcp/src/guides.ts` 의 `ICON_METADATA` 에 27개 카테고리·페어 메타 추가. brand-geniet 별도 카테고리는 만들지 않고 의미 기반 카테고리(navigation/action/media/state-reaction/location/eap-service) 재사용 — 브랜드 분리는 prefix 가 담당.
- `apps/storybook/src/stories/Icons.stories.tsx` 의 카탈로그 description 에 prefix 검색 안내 한 줄 추가. 카탈로그 자체는 `Object.entries(Icons)` 자동 인덱싱이라 신규 27개가 자동 노출.
- 신규 `Brands/Geniet/Icons` 스토리(`Icons.Geniet.stories.tsx`) — Geniet prefix 아이콘만 필터한 카탈로그. 전체 / Brand 색(mint) / Size 20 / 다크 배경 4 variant.
- `Brands/Geniet/AppFooter` 와 `Brands/Geniet/AppBar` 스토리를 Figma 정합으로 업데이트: 5탭(홈/기록/혜택/리뷰/커뮤니티) bottomnavi + PC 헤더의 "음식 카테고리" 메뉴 박스(GenietMenuIcon).

### 브랜드 아이콘 사용 정책 (MCP 가이드 신설)

- `DESIGN_PRINCIPLES.dos/donts` 와 `ICON_METADATA` 상단 주석에 정책 본문 추가 — 브랜드 모드 작업 시 brand prefix 아이콘 우선, 공통 컴포넌트 구현에는 brand 분기 박지 말고 사용처에서 명시적 icon prop 으로.
- `get_brand_info(slug)` 응답에 `brandIcons` 자동 필터링 필드 + `iconPolicy` 안내 문구 추가.
- 외부 프로젝트가 받는 CLAUDE.md template 의 "디자인 룰" 섹션에도 동일 정책 한 줄.
