---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3001-47404
---

## summary

캐포비 어드민 통계 차트 — line / grouped-bar. 런타임 라이브러리 없이 정적 inline-SVG 로 렌더(무번들러 목업 정합). 데이터는 자식 <script type="application/json"> 또는 data 속성. Figma 퀴즈 통계(3001:47404).

## pitfalls

- **캐포비(cashwalk-biz) 어드민 통계 전용** — 소비자(모바일) 화면용 차트 아님. 대시보드/통계 페이지에서만 사용.
- **데이터는 JSON** — 큰 데이터는 `data="..."` 속성보다 자식 `<script type="application/json">` 권장(과이스케이프 방지, cf. nds-sidebar). values 는 **숫자**(따옴표 X).
- **type** 은 `line` | `bar`. bar 에 시리즈를 2개 이상 주면 그룹(나란히) 막대. line 도 다중 시리즈 가능.
- **시리즈 색은 토큰 슬롯** — 기본값이 캐포비 팔레트(line=#FFD200, bar1=#007AFF 남성, bar2=#FF8437 여성)라 보통 `color` 생략. 바꾸려면 `--nds-chart-line` / `--nds-chart-1` / `--nds-chart-2` CSS 변수 오버라이드(raw hex 하드코딩 금지).
- **y축 상한**: 미지정 시 데이터 기준 자동(눈금에 나눠떨어지게). 캐포비 시안처럼 헤드룸을 두려면 `y-max`(웹컴포넌트) / `yMax`(React) 명시.
- 범례는 시리즈 `name` 이 있을 때만 자동 표시. 숨기려면 `no-legend`(웹컴포넌트) / `showLegend={false}`(React).
- 차트 카드(흰 라운드 박스 + 타이틀)는 차트 외부 컨테이너로 직접 구성 — nds-chart 는 plot+범례만 그림.

## recommended

- 연령대별/시간대별 추세 = line (필요 시 tooltip 으로 특정 포인트 강조)
- 성별/카테고리 비교 = bar (그룹 막대, 시리즈 2개)
- React: <Chart type="bar" labels={ages} series={[{name:'남성',values:[...]},{name:'여성',values:[...]}]} />

## examplesHtml.do

```html
<!-- 라인: 데이터는 자식 <script type="application/json"> 로 -->
<nds-chart type="line">
  <script type="application/json">
    { "labels": ["10","20","30","40","50","60"],
      "series": [{ "name": "지급된 캐시", "values": [11000000,28000000,33000000,40000000,42000000,47000000] }],
      "tooltip": { "index": 3, "text": "123,456,789 w/s" } }
  </script>
</nds-chart>

<!-- 그룹 막대: 다중 시리즈 = 남/여 그룹 -->
<nds-chart type="bar">
  <script type="application/json">
    { "labels": ["10","20","30","40","50","60"],
      "series": [
        { "name": "남성", "values": [14000000,15500000,22000000,25000000,26000000,16000000] },
        { "name": "여성", "values": [14000000,18500000,20500000,28000000,26000000,14500000] } ] }
  </script>
</nds-chart>
```

## examplesHtml.dont

```html
<!-- 외부 차트 라이브러리(canvas/Chart.js)·이미지로 차트를 박지 말 것 — 목업은 무번들러. nds-chart 정적 SVG 사용 -->
<canvas id="chart"></canvas><script src="chart.js"></script>
<!-- series 색을 raw hex 로 하드코딩하지 말 것. 기본 팔레트(캐포비)면 color 생략, 바꾸려면 --nds-chart-* 오버라이드 -->
<nds-chart type="bar" data='{"labels":["a"],"series":[{"color":"#ff0000","values":[1]}]}'></nds-chart>
```
