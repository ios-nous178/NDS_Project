---
"@nudge-design/assets": minor
"@nudge-design/mcp": patch
---

캐시워크 소비자앱 로고 세트 추가 (Figma 로고 가이드 140:56)

캐시워크 로고 가이드의 전체 세트를 DS 에 정본 자산으로 편입했습니다(`@nudge-design/assets` 에 `cashwalk` 프로젝트 신설).

- **13종 SVG** — 4 lockup(가로 긴/가로 짧은/세로/심볼 단독) × 3 color(Full Color `#605151` / Black / White) + 신발 시그니처 아이콘(brown on `#FFD200`). `project/cashwalk/logos/` 아래 벡터 SSOT.
- `getProjectLogo("cashwalk", variant)` 로 조회(default = 메인 가로), `find_asset` 카탈로그에 13종 등록 → 목업에서 바로 inline 가능.
- `LogoVariant` 에 color×layout 키 추가(horizontalCompact·verticalMono·symbolWhite·shoeIcon 등), `ProjectSlug` 에 `cashwalk` 추가.
- 참고: 캐시워크 토큰 테마는 이미 DS **base** 라 별도 토큰 오버레이는 두지 않습니다(=base 가 캐시워크). 헤더/푸터 chrome 은 소비자앱 GNB/푸터 설계가 필요해 후속.
