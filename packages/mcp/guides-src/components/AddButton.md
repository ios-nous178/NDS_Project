---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3001-18966
---

## summary

폼 안에서 "항목 추가"(지역/옵션/행)를 유도하는 점선 affordance 버튼. 일반 Button(solid/outlined CTA)과 의도가 다름 — 반복 추가 슬롯이라 점선 보더. 필수 미선택 시 error 로 빨간 실선 강조. Figma 캐포비 타겟팅 "지역 추가"(3001:18966).

## pitfalls

- 일반 제출/확정 CTA 에 쓰지 말 것 — 그건 Button. AddButton 은 '리스트에 한 줄 더 추가' affordance.
- error 는 보더만 빨갛게 한다 — **인라인 에러 메시지("…를 선택해 주세요")는 FormField/필드그룹 쪽에서 별도로** 노출(AddButton 내부엔 메시지 없음).
- 보더/배경/에러색은 토큰 자동(점선=border strong, 에러=border status-error #FC3500). raw hex 금지.
- 기본 full-width. 좁게 두려면 full-width 끄기.

## examplesHtml.do

```html
<nds-add-button label="지역 추가"></nds-add-button>
<!-- 필수 미선택 에러 — 빨간 실선. 메시지는 아래 FormField 등에서 별도 -->
<nds-add-button label="지역 추가" error></nds-add-button>
```

## examplesHtml.dont

```html
<!-- 폼 제출 CTA 에 AddButton — Button(solid)이 맞음 -->
<nds-add-button label="저장하기"></nds-add-button>
```
