---
{}
---

## summary

주소 수집 전체 플로우(단순 검색창 아님) — 키워드 검색 + 결과 리스트 선택 + 상세주소 입력까지 한 컴포넌트. 검색 자체는 외부 API(카카오/네이버)로 처리, results만 전달. (구 이름 AddressSearch — 2026-06 AddressPicker 로 개명, 태그 nds-address-picker.)

## pitfalls

- 단순 주소 검색창이 아님 — 검색→선택→상세입력까지의 picker. SearchInput 으로 흉내내지 말 것.
- onSearch는 외부 API 호출 트리거 — 컴포넌트가 직접 검색 안 함.
- value는 주소 + 상세 한 묶음 — 폼 state에서 단일 값으로 관리.
- loading 상태 동안 검색 버튼 비활성 — 직접 disabled 처리 X.
- 검색 버튼 검정 CTA — 지니어트는 color="secondary", **캐포비는 color="neutral"**(캐포비 secondary 는 Figma 미정의라 Button/validator 가 경고). 색 hex 박지 말고 프로젝트 cascade.

## recommended

- 회원가입 주소: query/results를 외부 hook으로 관리
- 방문 상담 주소: helperText='출입 가능한 주소를 입력해주세요'

## examplesHtml.do

```html
<nds-address-picker label="주소" search-label="주소 검색"
  empty-message="검색 결과가 없어요" helper-text="도로명/지번 모두 가능"></nds-address-picker>
<script>el.addEventListener("address-query", e => search(e.detail.query));</script>
```

## examplesHtml.dont

```html
<!-- results 를 string 으로 그대로 박음 — JSON 배열이어야 렌더 가능 -->
<nds-address-picker results="결과 없음"></nds-address-picker>
```
