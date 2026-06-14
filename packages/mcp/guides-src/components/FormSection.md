---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3466-17405
---

## summary

제목(+옵션 설명) + 보더 카드로 여러 `FormField` 를 묶는 폼 그룹 컨테이너. 캐시워크 for Business 어드민 폼 표준 — 카드 좌우 패딩은 FormSection 이, 행 간 세로 리듬(py-24)은 `FormField density="admin"` 이 만든다.

## pitfalls

- **`FormField density="admin"` 과 짝으로 쓴다** — 카드 좌우 패딩은 FormSection, 행 세로 리듬은 admin FormField 담당. 일반(`density` 미지정) FormField 를 넣으면 어드민 카드의 세로 리듬이 깨진다.
- 캐포비 어드민 전용 톤 — 일반 서비스(Trost/Geniet/NudgeEAP/Runmile) 모바일·웹 폼에 쓰면 보더 카드가 과하다. 그쪽은 FormField 를 바로 쌓는다.
- **색·radius 를 hex 로 박지 말 것** — 흰 배경·1px subtle 보더·radius 는 `data-brand="cashwalk-biz"` cascade 로 자동 매핑된다.
- `title` 은 섹션 머리글(Headline3 24 Bold) — **페이지 제목으로 쓰지 말 것**. 페이지 제목은 `pattern:page-header`(Heading 조합).
- 카드 한 장 = 의미상 한 그룹(기본 정보 / 결제 정보 …). 관련 없는 필드를 한 FormSection 에 몰지 말고 섹션을 나눈다.

## recommended

- 캐포비 어드민 등록/수정 폼: 의미 그룹마다 FormSection 한 장, 안에 admin FormField 행을 쌓기
- 그룹 머리말이 필요하면 `description` 으로 보조 설명 (1줄 권장)

## examplesHtml.do

```html
<nds-form-section title="기본 정보" description="회원에게 표시되는 정보입니다">
  <nds-form-field density="admin" label="이름"><input slot="control" /></nds-form-field>
  <nds-form-field density="admin" label="연락처"><input slot="control" /></nds-form-field>
</nds-form-section>
```

## examplesHtml.dont

```html
<!-- 일반 FormField 를 admin 카드에 — 세로 리듬(py-24)이 안 맞음. density="admin" 사용 -->
<nds-form-section title="기본 정보">
  <nds-form-field label="이름"><input slot="control" /></nds-form-field>
</nds-form-section>
```
