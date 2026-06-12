---
{}
---

## summary

미니 추이 차트 (line/area/bar). 축/레이블 없음 — 카드 안 시각 신호용.

## pitfalls

- 정확한 비교가 필요한 본격 차트가 아님. 50개 이상 데이터 포인트는 가독성 저하.
- 음수가 섞인 데이터에는 showBaseline=true로 0 기준선을 노출.
- color는 단색만. 그라데이션은 area variant에서 자동(투명도) — 직접 그라데이션 색을 넘기지 말 것.

## recommended

- 메트릭 카드: '7.4시간' + Sparkline kind='area' color=success
- 리스트: kind='line' + showLastDot으로 마지막 값 강조
- 막대: 일별 카운트 같은 이산형 데이터

## examplesHtml.do

```html
<nds-sparkline kind="line" color="primary" data="[12,15,11,18,22,20,25]" width="200" height="60"></nds-sparkline>
```

## examplesHtml.dont

```html
<!-- 한 점만 -> 라인이 그려지지 않음. 의미 없는 단일값엔 stat-card 사용 -->
<nds-sparkline data="[42]"></nds-sparkline>
```
