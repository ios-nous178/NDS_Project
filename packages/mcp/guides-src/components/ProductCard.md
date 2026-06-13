---
figmaNodeUrl: https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=337-1122
references:
  - label: 캐시딜 PC 랭킹 리스트 (236w)
    url: https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=337-1122
  - label: 캐시딜 Mobile 풀스펙 (140w)
    url: https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=338-2199
sizeMatrix:
  sm: 140w (모바일) — 썸네일 140×140 · 캐러셀/그리드. 기본값.
  md: 236w (데스크탑) — 썸네일 236×236 · title min-height 44px 로 2줄 정렬. PC 캐시딜 랭킹 리스트용.
  thumbnail: 정사각 1:1 · border subtle 1px · radius md(8) · object-cover
  gapThumbnailToMeta: 8px (spacing[8]) — root flex gap
  gapMeta: 6px (spacing[6]) — title ↔ chips ↔ price ↔ footer
  title: Body3 14/20 Regular · cv.textRole.strong · 2줄 ellipsis
  discount: Lato Medium 18/24 · cv.textRole.statusError · letter-spacing -0.3px
  price: Lato Black 900 18/24 · cv.textRole.strong · letter-spacing -0.3px
  currency: Caption2 12/16 Regular Pretendard · cv.textRole.strong
  originalPrice: Body3 14/16 Regular Lato · cv.textRole.muted · line-through
  rewardChip: label 11/14 Medium · cv.surface.statusError bg · CashdealPointIcon 16 + 금액(Bold) + '적립'(Medium) · radius sm(4)
  shippingChip: label 11/14 Medium · cv.fill.neutralSubtle bg · cv.textRole.subtle · radius sm(4)
  pointDiscountChip: label 11/14 Bold · cv.surface.default + border subtle 1px · CashdealPointIcon 16 + '포인트할인' · radius sm(4)
  rankingBadge: "36×36 · #f16d4d bg · 흰 텍스트 Bold 20 · radius md(8) · 썸네일 좌상단 8/8"
  badge: label 11/14 Bold · cv.fill.statusError bg · cv.textRole.inverse · radius sm(4)
  rating: StarFilledIcon 14 + Lato Bold 14 평점 + Caption Regular muted 리뷰수
  buyers: Lato/Pretendard 14/16 — 명수(Bold) + ' 구매중'(Regular). 10,000+ → '9,999+명'.
  soldOutOverlay: rgba(255,255,255,0.85) · cv.textRole.subtle · Body3 Bold '품절'
  fontStack: 숫자(할인율/가격/구매자수/별점)는 'Lato', Pretendard, sans-serif — Lato 미로드 시 Pretendard Bold 로 graceful fallback (Lato Black 900 → Pretendard 700).
stateMatrix:
  default: 썸네일 + 메타. card border 없음 — 썸네일에만 border-subtle.
  hover: opacity 0.85 (clickable 일 때만, PC only).
  soldOut: 썸네일에 화이트 오버레이 + '품절' 텍스트. rankingNumber/badge 자동 숨김.
  noDiscount: discountPercent 미지정/0 → discount span 자체 렌더 X.
  ranking: rankingNumber 지정 시 좌상단 36×36 오렌지 사각 배지. badge 보다 우선.
  fullCashdeal: originalPrice + discountPercent + price + reward + freeShipping + buyersCount + rating — PC 랭킹 리스트 풀스펙.
usagePolicy:
  useFor:
    - 상품 진열 카드 (가로 스크롤 행, 그리드)
    - 캐시딜 랭킹 리스트 (size='md' + rankingNumber)
    - 할인율 + 원가 + 적립 + 무료배송 등 메타가 풍부한 상품 진열
  doNotUseFor:
    - 장문 설명이 핵심인 콘텐츠 → Card
    - 사용자/상담사 프로필 → Card 합성 (Avatar+Title+Metadata)
    - 임의 width(180/200 등) — sm/md 두 사이즈만 SSOT.
  limits:
    titleLines: 2
    rankingBadgeAndSoldOutMutuallyExclusive: true
    sizes: sm(140) / md(236) — 임의 너비 override 비권장
    priceFontFamily: Lato (숫자 전용)
    buyersCountAutoTruncate: 10,000 이상은 '9,999+명'
---

## summary

상품 카드. `size='sm'`(140w 모바일) / `size='md'`(236w 데스크탑) 두 사이즈. 정사각 썸네일 + 제목(2줄 ellipsis) + 가격 row(할인율% + 가격 + 단위) 가 골격. 선택 슬롯: `rankingNumber` · `originalPrice`(취소선) · `reward`(적립칩) · `freeShipping` · `pointDiscount`(포인트할인 외곽선칩) · `buyersCount` · `rating` · `reviewCount`. 숫자(할인율/가격/구매자수/별점)는 Lato, 한글은 Pretendard 로 폰트 분리. 가격은 Lato Black 18 / 할인율은 Lato Medium 18 + statusError.

## pitfalls

- `price`/`originalPrice`/`reward.amount` 는 모두 number — 자동 천단위 콤마. 외부에서 '13,900' 문자열로 가공해서 넘기지 말 것.
- `discountPercent` 는 number (예: 31). 0 또는 undefined 면 자동 숨김 — '0%' 표시 X.
- 할인율 색은 `cv.textRole.statusError` 시멘틱 — 브랜드별 자동 매핑. raw hex(#ED3E14 등) 로 override 금지.
- 썸네일 좌상단: `rankingNumber` > `badge` > `soldOut` 우선순위. 동시 지정 시 상위 슬롯만 렌더 — 직접 가드 불필요.
- title 은 자동 2줄 ellipsis. size='md' 는 min-height 44px 로 2줄 정렬 보장 — 그 이상 보여주려면 디테일 화면.
- 가격 단위('원')는 절대 Bold 로 키우지 말 것 — 가격 본문(Black)과 시각 무게 같아짐. Pretendard Regular 12 고정.
- `buyersCount` 는 자동 truncate — 10,000 이상은 `9,999+명` 으로 표시. 외부에서 '999,999+' 문자열로 가공해서 넘기지 말 것.
- `rating` 은 0-5 number. 정수면 자동 '5.0' 포맷, 소수면 첫째자리까지 (예: 4.7).
- `reviewCount` 는 `rating` 없으면 무시됨. 단독 노출 불가 — 평점과 묶음 정보라는 가이드.
- `pointDiscount` 외곽선 칩은 모바일(`size='sm'`) 캐시딜 패턴. PC 디자인에는 등장 X — 데스크탑에서 사용 자제.
- `rankingNumber` 는 캐시딜 랭킹 노출용. 일반 상품 진열에 임의로 1~N 박지 말 것 — 사용자가 '순위' 로 인지함.

## recommended

- 기본: <ProductCard thumbnail={url} title="…" discountPercent={31} price={13900} onClick={…} />
- 캐시딜 PC 랭킹: <ProductCard size="md" rankingNumber={1} originalPrice={20250} discountPercent={31} price={13900} reward={{amount:417}} freeShipping buyersCount={329} rating={5} />
- 캐시딜 모바일: <ProductCard pointDiscount originalPrice={…} discountPercent={…} price={…} reward={{amount:…}} freeShipping buyersCount={…} rating={…} reviewCount={…} />
- 가로 스크롤 행: flex container + overflow-x:auto + gap (sm=16, md=25). 캐러셀/랭킹 리스트 패턴.
- 그리드: grid-template-columns:repeat(N, 140px or 236px) + gap.
- 할인이 없으면 `discountPercent` / `originalPrice` 모두 생략 — 가격만 단독 렌더 (정상가 상품).
- 품절: `soldOut` + thumbnail — 자동 오버레이 (badge/rankingNumber 자동 숨김).

## accessibility

- onClick 있으면 role='button' + tabIndex + Enter/Space 핸들링 자동.
- thumbnailAlt 지정 권장 — 장식 이미지면 빈 문자열.
- rankingNumber 는 aria-label='랭킹 N위' 로 자동 노출.
- rating 은 aria-label='별점 5.0점' 자동 노출 — 별 아이콘은 aria-hidden.
- price 숫자는 시각 강조를 위해 Lato 폰트지만 일반 텍스트 — screen reader 가 그대로 읽음.

## examplesHtml.do

```html
<nds-product-card thumbnail="/p.jpg" product-title="명상 콘텐츠 1년 이용권"
  price="120000" original-price="180000" discount-percent="33"
  rating="4.7" review-count="124" clickable></nds-product-card>
```

## examplesHtml.dont

```html
<!-- 가격을 숫자 타입으로 넘김 (attribute 는 string) — 표시 깨짐 -->
<nds-product-card price={120000}></nds-product-card>
```
