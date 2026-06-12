---
{}
---

## summary

현재 화면이 정보 계층 어디에 있는지 보여주는 경로. 3 depth 이상의 카탈로그 / 설정 / CMS 페이지에서 의미 있음.

## pitfalls

- 1-2 depth 페이지에 Breadcrumb 강제 표기 — 화면 위에 차지하는 노이즈 대비 정보가 적음.
- 마지막 segment 를 링크로 만들지 말 것 (현재 위치). active=true 표시.
- separator 를 이모지나 텍스트 기호(→ / >)로 인라인 입력 금지 — separator attribute 또는 토큰 사용.

## examplesHtml.do

```html
<nds-breadcrumb items='[{"label":"홈","href":"/"},{"label":"상담","href":"/counseling"},{"label":"신청 내역","active":true}]'></nds-breadcrumb>
```

## examplesHtml.dont

```html
<!-- 마지막 segment 가 링크로 — 사용자가 자기 자신을 다시 클릭 -->
<nds-breadcrumb items='[{"label":"홈","href":"/"},{"label":"현재 화면","href":"/now"}]'></nds-breadcrumb>
```
