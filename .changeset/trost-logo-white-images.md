---
"@nudge-design/assets": minor
"@nudge-design/react": patch
"@nudge-design/html": patch
---

트로스트 로고 화이트 변종 + 심리검사 이미지 자산 추가 (Figma 로고 가이드 동기화)

- **로고 화이트 변종** — 어두운 배경용 흰색 "Trost." 워드마크(`trost-logo-white.svg`)를 추가했습니다. 기본 검정 로고(90×36)에서 색만 반전한 정확한 매칭 페어라 검정/흰색을 배경 밝기에 따라 바꿔 써도 비율·크기가 동일합니다. `getBrandLogo("trost", "white")` 로 사용하고, `TROST_LOGO_WHITE_DATA_URI` 는 react·html 에서도 재노출됩니다.
- **심리검사 썸네일 18종** — 트로스트 심리검사 카테고리 이미지(우울·공황·MBTI·자존감·번아웃 등 16종) + 기본 프로필 이미지 + 검사완료 뱃지를 `@nudge-design/assets/files/brand/trost/images/` 에 추가했습니다(1x + @3x).
- 로고 사용 가이드(최소 16px·클리어스페이스 50%·배경 밝기별 검정/흰색·DO/Don't)를 `get_brand({ brand: 'trost', assetKind: 'logos' })` 의 `usageGuide` 로 노출합니다.
