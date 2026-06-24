---
{}
---

## summary

시작/끝 날짜 한 쌍 선택. 단일 트리거 + range 전용 캘린더 패널 + 빠른 프리셋(최근 7일 등).

## pitfalls

- **기간(노출 기간/시작~종료)을 raw text input 2개로 손수 만들지 말 것** — placeholder 'YYYY-MM-DD' 텍스트 입력은 달력 팝오버·범위 검증·간격이 전부 빠진다. 한 컴포넌트 <nds-date-range-picker> 로. (검증룰 date-as-text-input 이 막음. 단일 날짜는 DatePicker.)
- value는 { from?, to? } — 부분 선택 가능 (시작만 있을 수 있음). 폼 검증 시 둘 다 있는지 체크.
- 시작/종료를 한 패널에서 차례로 선택 — 역순으로 고르면 자동 정렬된다.
- 프리셋은 defaultRangePresets로 빠른 것 3개 제공 (7일/30일/이번 달). 검사·리포트마다 다른 기본값이 필요하면 직접 정의.
- presets[].range는 함수 — 호출 시점의 "오늘"을 기준으로 계산하기 위함. 객체 리터럴로 박지 말 것.
- 선택 불가 날짜는 React disabledDate, HTML disabled-dates(JSON 배열 또는 comma-separated ISO)로 막는다.
- **캘린더 패널은 `document.body` 로 portal 된다** — `overflow:hidden` 조상(아코디언·모달 본문·필터 패널) 안에 둬도 패널이 잘리지 않는다. 조상의 overflow 를 풀 필요 없음. 특정 컨테이너로 portal 하려면 React `portalContainer`, HTML `portal-container`(셀렉터 문자열) 사용.

## recommended

- 리포트 기간 필터: defaultRangePresets 그대로 사용
- 검사 이력 검색: maxDate=오늘, presets에 "전체" 추가

## examplesHtml.do

```html
<nds-date-range-picker from="2026-05-01" to="2026-05-31" allow-clear
  presets='[{"key":"7d","label":"최근 7일","from":"2026-05-25","to":"2026-05-31"},{"key":"month","label":"이번 달","from":"2026-05-01","to":"2026-05-31"}]'></nds-date-range-picker>
<script>el.addEventListener("nds-date-range-change", e => apply(e.detail));</script>
```

## examplesHtml.dont

```html
<!-- to < from — 의미 없는 범위. min-date / max-date 로 가드 권장 -->
<nds-date-range-picker from="2026-05-31" to="2026-05-01"></nds-date-range-picker>
```
