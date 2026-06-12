---
{}
---

## summary

점수 시각화 (반원 게이지). 4단계(normal/mild/moderate/severe) 색 자동 매핑. CircularProgress 와 함께 radial progress family 를 이룬다.

## pitfalls

- 단계 경계는 검사마다 다름. segments prop으로 직접 넘겨 결과 해석을 통일.
- needle은 transform: rotate로 회전. CSS transform 충돌 환경(예: 부모 transform)에선 어긋날 수 있어 wrapper 별도 권장.
- showLegend는 4개라 모바일 가로폭 부족하면 줄 바뀜 — 카드 안에선 false 권장.
- max를 점수 합과 동일하게 — "100 만점"으로 정규화하지 말 것 (해석 매트릭스가 어긋남).

## recommended

- PHQ-9: <ScoreGauge value={score} max={27} segments={[{level:"normal",label:"정상",from:0,to:5}, {level:"mild",label:"경증",from:5,to:10}, ...]} />

## examplesHtml.do

```html
<nds-score-gauge value="22" max="27"
  segments='[
    {"level":"normal","label":"정상","from":0,"to":9},
    {"level":"mild","label":"경미","from":10,"to":18},
    {"level":"moderate","label":"중간","from":19,"to":27}
  ]'
  show-label show-legend value-suffix="점"></nds-score-gauge>
```

## examplesHtml.dont

```html
<!-- segments 의 level 이 정의된 enum 외 값 — 색이 fallback -->
<nds-score-gauge value="5" segments='[{"level":"good","from":0,"to":10}]'></nds-score-gauge>
```
