---
{}
---

## summary

원형 진행도. 단순 value/max 비율 표시. ScoreGauge(단계 분류 결과)와 분리, ProgressBar(가로)와 분리. 둘은 같은 radial family 이지만 해석이 다르다.

## pitfalls

- 심리검사 결과 등 단계 분류가 중요하면 ScoreGauge를 쓸 것 — CircularProgress는 비율만.
- 가로 막대로 충분한 단순 진행은 ProgressBar가 적절. CircularProgress는 강조/포커스 용도.
- label을 커스텀(분/회 등)할 때 caption으로 max를 표시하면 의미가 분명 (예: label='28분' caption='목표 60분').

## recommended

- 일일 목표: <CircularProgress value={done} max={60} label={`${done}분`} caption='목표 60분' />
- 달성: color=success일 때 시각 신호 강함
- 작은 인디케이터: hideLabel + 작은 size

## examplesHtml.do

```html
<nds-circular-progress value="75" max="100" size="lg" label="저장 진행"></nds-circular-progress>
```

## examplesHtml.dont

```html
<!-- max 가 음수/0 — 0으로 나눠 표시 깨짐 -->
<nds-circular-progress value="50" max="0"></nds-circular-progress>
```
