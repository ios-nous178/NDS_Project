---
"@nudge-design/assets": minor
---

지니어트(Geniet) 브랜드 자산 편입 — 음식종류·카테고리·프로필·워드마크 146종

디자이너 Figma "🥗 지니어트 - Library" 의 native Export 원본을 brand-first taxonomy 로 정리해 편입.
Figma export 산물의 `종류=` variant prefix·불필요한 중첩 폴더를 걷어내고 한글 파일명을 영문 kebab-case 로 정규화했다.
NudgeEAP 컨벤션과 동일하게 1x(base) + 3x(`@3x`) PNG 만 보관(2x 미보관).

- `brand/geniet/images/food-types` — 음식 종류 아이콘 99종 (kimchi, tteokbokki, bibimbap, jjamppong …)
- `brand/geniet/images/category-heroes` — 카테고리 대표 이미지 16종 (korean/chinese/japanese/western …)
- `brand/geniet/images/empty-states` — 빈 상태 플레이스홀더 7종 (`*-empty`)
- `brand/geniet/images/misc` — 기타 일러스트 3종 (alert/pill/cashlotto)
- `brand/geniet/profiles` — 프로필 이미지 12종 + svg 기본값
- `brand/geniet/logos` — 워드마크/심볼 (ko/en/koen) — 기존 브랜드-크롬 `*.webp` 로고는 별도 시스템이라 유지

타입드 접근자 `@nudge-design/assets/geniet-assets` (`GENIET_ASSET_METADATA` · `genietAsset()` · `genietAssetsByCategory()`) 신설.
래스터는 종전 정책대로 npm tgz 제외 · S3 전달.
