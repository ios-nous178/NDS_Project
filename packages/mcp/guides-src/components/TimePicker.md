---
{}
---

## summary

시간만 선택 (HH:mm). 네이티브 시간 입력이 아니라 DS 팝오버 패널(시/분 스크롤 컬럼, DatePicker 와 동일 surface)로 선택. step(초 단위)/min/max 지원. 날짜+시간은 DatePicker와 조합.

## pitfalls

- 트리거(시계아이콘 포함)를 누르면 시/분 컬럼 팝오버가 열린다 — OS 기본 시간 UI(showPicker)는 쓰지 않는다. 선택값은 브랜드 fill 로 강조.
- step은 초 단위 — 5분이면 300, 15분이면 900. 분 컬럼 간격으로 환산된다.
- min/max도 HH:mm 문자열 — Date 객체 X. 범위 밖 시/분 옵션은 자동 비활성.
- **(캐포비 어드민) 시간 인풋의 '빠른설정' 프리셋은 `nds-time-picker` 의 `presets` 속성으로 — 손조립·노란 brand Chip 금지.** 광고 노출 스케줄 등에서 시간 필드 트레일링(`00:00` + 시계아이콘 우측)에 `자정까지`(= 시간을 즉시 세팅) 같은 빠른설정 칩이 붙는다. 이건 컴포넌트 내장 기능이다: `presets='[{"label":"자정까지","value":"23:59"}]'`(React `presets={[{label,value}]}`) — 클릭하면 value 가 세팅되는 **회색 중립 칩**으로 자동 렌더(시계 아이콘 ic_time_picker 포함). raw `<div>`/`<nds-chip>` 으로 손조립하지 말 것. **노란 outlined Chip / SelectionButton 으로 그리면 회귀**(SelectionButton 과 혼동되는 '지역=노란칩'과 동일 함정 — region-as-chip 참조). Figma 3001:19122.

## recommended

- 알림: step=300, min='07:00' max='23:00'
- 복약: step=900
- 캐포비 광고 스케줄: nds-time-picker presets='[{"label":"자정까지","value":"23:59"}]' — 시계아이콘 + 회색 중립 빠른설정 칩이 내장 렌더(노란 brand 아님). Figma 3001:19122.

## examplesHtml.do

```html
<nds-time-picker value="18:00" step="600"
  label="노출 종료 시간"
  presets='[{"label":"자정까지","value":"23:59"}]'></nds-time-picker>
<script>el.addEventListener("nds-time-change", e => setTime(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- step 0 — 분/초 단위 무제한 — 예약 정확도 깨짐 -->
<nds-time-picker value="14:30" step="0"></nds-time-picker>
```
