---
"@nudge-design/tokens": patch
"@nudge-design/react": patch
"@nudge-design/html": patch
---

빈 별 색 토큰화 — 별점 컴포넌트의 하드코딩 `#E0E0E0`(팔레트 밖 색) 제거

ReviewCard·StarRating·MediaCard 가 각자 빈 별 색을 raw hex `#E0E0E0` 로 박고 있었음(3중 중복). 팔레트 내 최근접 그레이 `neutral[300]`(#D8D8D8)을 기본값으로 하는 `--nds-rating-star-empty` 슬롯을 신설(채움색 `--nds-rating-star` 와 대칭)하고 세 컴포넌트(react+html)가 이를 `style` 로 참조하도록 통일. 브랜드가 빈 별 색을 override 할 수 있게 됨.
