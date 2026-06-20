# @nudge-design/assets

## 0.0.2

### Patch Changes

- 82113f1: npm tgz 슬림화 — 래스터는 S3 로만 전달 (코드·타입·매니페스트·SVG 만 publish)

  `package.json` `files` 를 `dist` 통째 → 코드/타입/매니페스트 + `dist/files/**/*.svg` 로 좁혀,
  무거운 래스터(PNG/JPG/WEBP, ~6.7MB · 169개)를 npm 패키지에서 뺀다. `@nudge-design/react` 가
  이 패키지를 의존하므로 종전엔 모든 react 소비자가 6.7MB 래스터를 transitive 로 끌어왔다.

  래스터는 이제 S3/CDN 으로만 전달한다 — `scripts/publish-assets-s3.mjs` 가 `dist/files` 를
  버전별 경로로 sync 하고, 호스팅 앱은 `@nudge-design/assets/remote-url` 의
  `assetVersionBaseUrl()`/`joinAssetUrl()` 로 URL 을 조립한다. 빌드(`pnpm build`)는 `dist/files`
  전체(래스터 포함)를 계속 생성한다 — S3 업로드 소스이자 로컬 목업 인라이너·desktop mcpb 번들
  동봉본(디스크엔 그대로, npm tgz 에만 빠짐). SVG 로고와 `getProjectLogo().dataUri` base64 는
  종전대로 tgz 에 포함돼 zero-config 로 동작한다.

- 912e3ce: 지니어트(Geniet) 프로젝트 자산 편입 — 음식종류·카테고리·프로필·워드마크 146종

  디자이너 Figma "🥗 지니어트 - Library" 의 native Export 원본을 project-first taxonomy 로 정리해 편입.
  Figma export 산물의 `종류=` variant prefix·불필요한 중첩 폴더를 걷어내고 한글 파일명을 영문 kebab-case 로 정규화했다.
  NudgeEAP 컨벤션과 동일하게 1x(base) + 3x(`@3x`) PNG 만 보관(2x 미보관).
  - `project/geniet/images/food-types` — 음식 종류 아이콘 99종 (kimchi, tteokbokki, bibimbap, jjamppong …)
  - `project/geniet/images/category-heroes` — 카테고리 대표 이미지 16종 (korean/chinese/japanese/western …)
  - `project/geniet/images/empty-states` — 빈 상태 플레이스홀더 7종 (`*-empty`)
  - `project/geniet/images/misc` — 기타 일러스트 3종 (alert/pill/cashlotto)
  - `project/geniet/profiles` — 프로필 이미지 12종 + svg 기본값
  - `project/geniet/logos` — 워드마크/심볼 (ko/en/koen) — 기존 프로젝트-크롬 `*.webp` 로고는 별도 시스템이라 유지

  타입드 접근자 `@nudge-design/assets/geniet-assets` (`GENIET_ASSET_METADATA` · `genietAsset()` · `genietAssetsByCategory()`) 신설.
  래스터는 종전 정책대로 npm tgz 제외 · S3 전달.

- f91ad95: 패키지를 Node-로더블 ESM 으로 전환 (번들러 없이도 동작):
  - 전 패키지 `"type": "module"` + tsc `module: NodeNext` 전환, 소스 상대 임포트에 `.js` 확장자 명시 (NodeNext 가 컴파일 타임에 강제).
  - exports 맵에 `default` 조건 추가 — Node ≥22 `require(esm)` 으로 CJS 소비도 동작.
  - 효과: Next.js SSR/RSC 를 `transpilePackages` 없이 사용 가능, Node 스크립트·tsx·vitest(외부화 모드)에서 직접 import 가능. Vite 목업 플로우는 동작·번들 크기 변화 없음 (실측 245 KB 유지).
  - icons 생성기(`scripts/generate.cjs`)가 barrels 에 `.js` specifier 를 emit 하도록 갱신. dist 는 per-file 산출 유지 — catalog/project-completeness/MCPB 패킹 등 dist 레이아웃 의존 툴링 영향 없음.

- 2b51ea7: NudgeEAP 로고 변종(koen/ko/en/en-dark/symbol)과 DAIN 마크의 SVG base64 dataURI 를 assets SSOT(`project-logo-defaults` + `project-logo-manifest`)에 추가했습니다.

  이전에는 이 변종들의 base64 가 react `NudgeEAPLogo` 컴포넌트 안에만 있어, assets 매니페스트의 해당 파일명들은 빈 fallback(`""`)을 반환했습니다. 이제 모든 NudgeEAP 로고 변종이 `@nudge-design/assets` 에서 정상 dataURI 로 제공됩니다(`nudge-eap-logo.svg` 도 PNG fallback → 실제 SVG dataURI 로 교정).

- 1578e14: 트로스트 로고 화이트 변종 + 심리검사 이미지 자산 추가 (Figma 로고 가이드 동기화)
  - **로고 화이트 변종** — 어두운 배경용 흰색 "Trost." 워드마크(`trost-logo-white.svg`)를 추가했습니다. 기본 검정 로고(90×36)에서 색만 반전한 정확한 매칭 페어라 검정/흰색을 배경 밝기에 따라 바꿔 써도 비율·크기가 동일합니다. `getProjectLogo("trost", "white")` 로 사용하고, `TROST_LOGO_WHITE_DATA_URI` 는 react·html 에서도 재노출됩니다.
  - **심리검사 썸네일 18종** — 트로스트 심리검사 카테고리 이미지(우울·공황·MBTI·자존감·번아웃 등 16종) + 기본 프로필 이미지 + 검사완료 뱃지를 `@nudge-design/assets/files/project/trost/images/` 에 추가했습니다(1x + @3x).
  - 로고 사용 가이드(최소 16px·클리어스페이스 50%·배경 밝기별 검정/흰색·DO/Don't)를 `get_project({ project: 'trost', assetKind: 'logos' })` 의 `usageGuide` 로 노출합니다.

## 0.0.3

## 0.0.2

### Patch Changes

- DS 번들 패키지 락스텝 정렬 — 함께 배포되는 패키지로서 버전을 0.0.2 로 맞춤(패키지 내용 변경 없음). 이후 릴리즈부터는 changeset `fixed` 그룹이 다른 DS 패키지와 버전을 자동으로 동기화한다.
