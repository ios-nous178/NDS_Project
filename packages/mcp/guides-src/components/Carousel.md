---
{}
---

## summary

가로 스와이프 슬라이더. 홈 배너, 콘텐츠 추천, 온보딩에 사용. drag/dots/autoplay/loop 내장.

## pitfalls

- 정보 위계가 동등한 항목 N개를 보여주는 용도라면 캐러셀 대신 가로 스크롤 리스트가 더 나음 — 캐러셀은 한 번에 1개만 보임.
- autoplay만 켜고 loop를 안 켜면 마지막 슬라이드에서 멈춤. 둘 다 함께 사용.
- 슬라이드 1-2장이면 캐러셀 의미 없음. 그냥 카드/배너로.
- 슬라이드 안에 자체 가로 스크롤(예: 가로 리스트)을 넣으면 드래그 충돌. 세로 스크롤만 허용.

## recommended

- 홈 배너: <Carousel autoplay={3000} loop indicator='dots'>
- 이미지 갤러리: indicator='counter' (현재 N/M 표시)
- 온보딩 3-5장: showArrows=false, indicator='dots'

## interactivePattern

activeIndex/onActiveIndexChange로 외부 동기화 가능. 드래그 임계값은 viewport 폭의 15%.

## examplesHtml.do

```html
<nds-carousel autoplay="3000" indicator="dots" loop>
  <img src="/banner1.jpg" alt="" />
  <img src="/banner2.jpg" alt="" />
</nds-carousel>
```

## examplesHtml.dont

```html
<!-- 슬라이드가 1장인데 loop + autoplay — 같은 이미지가 깜빡임 -->
<nds-carousel autoplay="3000" loop><img src="/only.jpg" /></nds-carousel>
```
