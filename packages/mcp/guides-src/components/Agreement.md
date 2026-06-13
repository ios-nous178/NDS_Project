---
{}
---

## summary

약관 동의 — 전체동의(master) + 필수/선택 약관 항목 cascade. 전체동의 클릭은 활성 항목 전체를 on/off, 항목 선택 비율에 따라 전체동의가 checked / indeterminate / unchecked 를 **자동** 표시한다. 온보딩·회원가입의 약관 동의 영역 전용. value 는 **동의된 항목 value 배열**.

## pitfalls

- 약관 본문/링크 URL 은 앱 데이터 — DS 는 셸만 제공한다. 항목 `viewHref` 로 "보기" 링크를 외부 약관 페이지에 연결(없으면 `onView` 핸들러).
- `required` 는 "필수" 배지만 표시 — **제출 가능 여부(필수 전부 체크)는 앱이 value 로 판정**한다. 컴포넌트는 필수 미동의를 막지 않는다.
- cascade 기준은 **활성(비-disabled) 항목** — disabled 항목은 전체동의 토글/상태 계산에서 제외된다.
- 계층(시/도▸시군구)·검색이 필요하면 Agreement 가 아니라 CheckboxTree. Agreement 는 평면 1-depth 약관 전용.
- 일반 다중선택 체크박스 그룹은 CheckboxGroup — Agreement 는 "전체동의 + 필수/선택 배지 + 보기 링크" 약관 시멘틱이 붙은 경우만.
- 전체동의 구분선은 `divider`(기본 노출). 전체동의 행을 숨기려면 flat API 에서 `allLabel={null}`(html `all-label="none"`).

## recommended

- 필수 약관은 `required` → "필수" 배지(brand 색), 선택 약관은 자동 "선택" 배지(subtle)
- 제출 버튼 활성 조건은 앱에서 `items.filter(i=>i.required).every(i=>value.includes(i.value))` 로 계산

## examplesHtml.do

```html
<nds-agreement all-label="전체 동의" value='[]'
  items='[{"value":"tos","label":"(필수) 이용약관 동의","required":true,"viewHref":"/tos"},
          {"value":"privacy","label":"(필수) 개인정보 처리방침 동의","required":true,"viewHref":"/privacy"},
          {"value":"mkt","label":"(선택) 마케팅 정보 수신 동의","required":false}]'></nds-agreement>
<script>el.addEventListener("nds-agreement-change", e => setAgreed(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- 계층/검색이 필요한 지역 선택을 Agreement 로 — CheckboxTree 가 맞음 -->
<nds-agreement items='[{"value":"seoul","label":"서울","children":[]}]'></nds-agreement>
```
