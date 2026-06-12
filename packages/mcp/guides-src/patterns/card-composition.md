---
metrics:
  maxSlotsPerCard: 4
  maxNutritionTagChipsInSlot4: 3
  maxLikeOverlayPerCard: 1
  maxAuthorMetaPerCard: 1
  maxPricePairPerCard: 1
  promotionBadgePosition: top-right absolute (Card.Root)
  likeOverlayPosition: top-right absolute (Media slot, image overlay)
  rankingLeadingMedalRange: 1-3 (gold/silver/bronze) · 4+ (number + neutral subtle bg)
  macroBarColors: 탄=info · 단=success · 지=caution
  figmaNodeUrl: https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=131-1769
---

## summary

Card 의 List/Thumb/Cover 3 base variant 위에 얹는 도메인 Composition 슬롯 카탈로그. 도메인 카드(헬시딜·식품 검색·식단 추천·랭킹·리뷰·커뮤니티 등)는 새 variant 를 만들지 말고 base variant + Composition 슬롯 조합으로 표현한다. Figma 출처: Zenirit Card 가이드 옆 도메인 예시 — 헬시딜 랭킹 / 음식 리뷰 / 다이어트·혈당 추천 / 지금 뜨는 한식 / 커뮤니티 게시글 / Product Panel. Card 본문 룰은 get_guide({ topic: 'component:Card' }) 와 함께 본다.

## rules

- **Slot 1 — kcal chip**: 식품 칼로리 표시 (예: 109 kcal). Chip tinted brand xs · Body 4. base variant 의 padding 안쪽, Title 직후 또는 Metadata 라인 인라인.
- **Slot 2 — star rating + review count**: ★ + 평점 + (리뷰 N개). Metadata 라인 좌측. 리뷰 없는 카드는 '리뷰 없음' 으로 fallback (mute color).
- **Slot 3 — promotion badge**: top-right absolute (Card.Root 기준). 리뷰가 없는 카드에만 노출. 같은 그리드 안에서 promotion + review 동시 노출 금지.
- **Slot 4 — nutrition tag chip row**: 0-3개 chip (고단백/저탄수/저지방/고나트륨/고식이섬유/저당 등). chip/nutrition/* 토큰 (success/info/warning/critical 톤). 위치는 Title 위 또는 Description 직후. 4개 이상 노출 금지.
- **Slot 5 — like overlay**: top-right absolute, Media 슬롯 위 (이미지 over). 'heart 아이콘 + 999+' 형태. Cover variant 의 Media 위에만, Thumb/List 사용 X.
- **Slot 6 — author meta**: avatar(xs 20-24) + 작성자 이름 + 작성일. Metadata 라인 또는 Description 하단. 한 카드 최대 1개.
- **Slot 7 — discount badge**: 큰 색 강조 칩(30% / 100% / 22%). promotion badge 와 다름 — 가격 정보와 묶여 Metadata 라인에 위치. 색은 sale brand (CashwalkBiz 빨강 / Geniet mint600). 1줄에 1개.
- **Slot 8 — strikethrough price + sale price**: 정가(취소선 + mute) + 할인가(Bold + Strong). discount badge 와 같은 라인에 정렬. 가격 표시는 카드당 1쌍.
- **Slot 9 — shipping chip**: '무료배송' 같은 정책 라벨. ghost/line variant · neutral color. Metadata 라인 우측 또는 가격 라인 하단.
- **Slot 10 — certification chip**: '식약처 인증 제품' 같은 신뢰성 라벨. success/info color · ghost variant · check icon prefix. Status 슬롯 또는 Metadata 라인 하단.
- **Slot 11 — ranking leading**: 1/2/3 등은 gold/silver/bronze medal 아이콘, 4+ 는 큰 숫자 + neutral subtle bg. Leading 슬롯 (List variant 의 좌측). 트렌딩/랭킹 카드 전용.
- **Slot 12 — macro nutrition bar**: 탄/단/지 비율 가로 progress bar (3색 분할: 탄=brand info, 단=brand success, 지=brand caution). 라벨은 % 와 함께. Cover/Thumb 의 Description 하단 또는 Footer.
- **Slot 13 — category banner header**: Card 상단 4px 색 라인 + 카테고리 라벨 (다이어트/혈당/저당 등). 같은 그리드 안에서 카테고리별로 색이 다름 (info/caution/critical). Cover/Thumb 의 Media 위 또는 별도 헤더 라인.
- **Slot 14 — friend social proof**: avatar(xs) + 'N명이 먹어봤어요' 같은 카운트 라벨. Footer 슬롯 또는 Description 하단. 신뢰감/추천 의도 카드에만.
- **Slot 15 — trending count**: '최근 7일간 100만+' 같은 시계열 활동 카운트. Caption · Strong. Metadata 라인 하단. 랭킹 카드의 핵심 정보로 사용.
- **Slot 16 — forum meta row**: 조회 N · 댓글 N · 시간 (' · ' 구분자). Caption · Mute. 커뮤니티/게시글 카드의 Metadata 라인 전용.
- **조합 규칙**: 한 카드의 Composition slot 총합 최대 4개. 5개 이상은 위계 무너짐 → base variant 자체를 바꾸거나 정보 우선순위 재고.
- **한 그리드 룰**: 한 그리드(예: 4-up Cover) 안의 모든 카드는 같은 Composition 슬롯 조합을 사용. 일부만 슬롯이 다른 카드는 위반 (정보 누락처럼 보임). 슬롯이 비면 visually hidden 으로 자리만 유지.

## avoid

- Composition 슬롯 추가를 이유로 새 variant 생성 — variant 는 항상 3종(List/Thumb/Cover) 유지, 도메인 차이는 슬롯 조합으로
- Slot 5(like) + Slot 3(promotion) 동시 노출 — 둘 다 top-right absolute 라 겹침
- Slot 4(nutrition tag) 4개 이상 — 위계 붕괴
- Slot 8(price) strikethrough 없이 sale price 만 — 할인 컨텍스트 누락
- Slot 11(ranking leading) 을 1-3 medal 없이 number 로만 표시 — 시각 위계가 안 잡힘
- 한 그리드에서 카드마다 다른 Composition 조합 사용 — 정보 누락처럼 보이는 안티패턴
- Composition 슬롯 안에 별도 CTA 버튼 두기 — Card.Root clickable 만 사용
- promotion badge 위치를 top-right 외에 두기 — 절대 위치 규칙 위반
- Slot 13(category banner)을 같은 카테고리 카드에 다른 색으로 적용 — 의미 매핑이 일관되지 않음
