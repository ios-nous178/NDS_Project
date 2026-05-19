---
"@nudge-eap/icons": patch
---

Trost 브랜드 전용 아이콘 17종을 `@nudge-eap/icons` 에 편입.

### TrostAstroHomepage 운영 SVG 정제

- `TrostAstroHomepage` 레포 `public/images` 하위 SVG 중 UI 의미가 명확한 17개만 DS 표준(viewBox 24×24, currentColor) 으로 정제해서 svg/ 에 `trost-*.svg` prefix 로 추가. 일러스트(`img-test-*`, `img-banner-*`) 와 비정사각형 rank 4종(26×18) 은 비율 왜곡 우려로 제외.
- 컴포넌트: TrostMentalDepression/Emotion/Event/Mbti/Medicine/Routine/Selfesteem/Sound/LocationHospitalIcon (9 — 멘탈 카테고리), TrostTestresultSafe/Warning/DangerIcon (3 — 검사 결과 상태), TrostLinkCircleIcon · TrostPlusCircleIcon (2 — SNS 공유/추가), TrostEnergyCoinIcon (1 — Trost 화폐), TrostPsychTestIcon (1 — 심리검사 카테고리), TrostMindkeySymbolIcon (1 — 마인드키 심볼).
- 변환 일회성 헬퍼: `packages/icons/scripts/import-trost.mjs` — 원본 viewBox(18/20/24/28/32/60) 를 24 컨테이너로 transform-scale 한 뒤 fill/stroke hex 를 currentColor 로 일괄 치환. 마스크 안 흰색(`#fff`, `#FEFEFE`) 과 `none`·`url(...)` 참조는 보존. `<path d="M0 0hNvNH0z"/>` 류 placeholder bbox 는 제거.

### 카탈로그

- 신규 `Brands/Trost/Icons` 스토리(`Icons.Trost.stories.tsx`) — Trost prefix 아이콘만 필터한 카탈로그. 전체 / Brand 색(cobalt) / Size 32(mental 칩) / Size 20 / 다크 배경 5 variant. Geniet 카탈로그와 동일 패턴.
- 기존 공용 카탈로그(`Icons.stories.tsx`) 는 `Object.entries(Icons)` 자동 인덱싱이라 신규 17개가 자동 노출.
