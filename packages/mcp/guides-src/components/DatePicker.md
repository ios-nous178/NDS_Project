---
figmaNodeUrl: https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=171-9903
---

## summary

단일 날짜 선택. 캘린더 팝업 + 키보드 grid 이동(Arrow/Home/End/PageUp/PageDown) + clear/open/status 제어. 시간까지 필요하면 별도 TimePicker 또는 DateTimePicker 조합. (폼에서 날짜 고르기는 항상 DatePicker — Calendar 는 마커가 있는 독립 인라인 월 뷰로 용도가 다르다.)

## pitfalls

- min/max 누락 — 사용자가 과거/먼 미래 날짜를 선택해 데이터 검증 실패.
- 주말/휴일/마감일 같은 업무 제약은 React disabledDate, HTML disabled-dates(JSON 배열 또는 comma-separated ISO)로 막는다.
- 값 초기화가 필요한 필터는 allowClear + onClear/nds-date-clear 를 연결한다.
- 한국어 로케일 누락 — '월/일/연도' 영문 형식 노출.
- Calendar 컴포넌트로 month/year 보기 + 직접 select 흉내내지 말 것 — 컨트롤 일관성 깨짐.

## examplesHtml.do

```html
<nds-date-picker value="2026-05-25" min-date="2026-05-01" max-date="2026-12-31"
  placeholder="날짜 선택" allow-clear></nds-date-picker>
<script>el.addEventListener("nds-date-change", e => setDate(e.detail.value));
el.addEventListener("nds-date-clear", () => setDate(null));</script>
```

## examplesHtml.dont

```html
<!-- min-date / max-date 누락 — 사용자가 과거/먼 미래 선택 가능 -->
<nds-date-picker placeholder="날짜"></nds-date-picker>
```
