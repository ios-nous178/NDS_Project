---
figmaNodeUrl: https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=171-9903
standalone: false
composeWith: [Input, FormField]
stateMatrix:
  incomplete: "muted — icon/text var(--semantic-text-muted-default) (#999) · 체크 글리프 · 아직 미충족(기본값)"
  complete: "brand — icon/text var(--semantic-text-brand-default) (#2b96ed) · 체크 글리프 · 규칙 충족"
  error: "error — icon/text var(--semantic-text-status-error) (#f13f00) · X 글리프 · 형식 위반"
---

## summary

입력 형식 요구사항 1개의 **실시간 충족 신호**. 16px 체크 아이콘 + 12px 라벨, gap 4px 의 읽기 전용 인라인 인디케이터(클릭 동작 없음). 회원가입 비밀번호/이메일처럼 규칙이 여러 개일 때 Input 아래 한 줄에 여러 개를 나열하고(pattern:form-validation), 입력값이 규칙을 충족할 때마다 `incomplete → complete` 로 전환한다. 상태색은 semantic 토큰 — incomplete=`--semantic-text-muted-default`(회색), complete=`--semantic-text-brand-default`(Brand Blue), error=`--semantic-text-status-error`. 아이콘·텍스트가 같은 색이라 root `color` 하나만 두고 SVG 는 `currentColor` 로 상속(브랜드 cascade 자동 대응).

## pitfalls

- **합성 전용 — 단독 사용 금지.** ValidationChip 은 항상 Input/FormField **아래 검증 체크리스트**(여러 개 동시 노출)로만 쓴다. 입력과 분리된 단독 상태 인디케이터·배지로 쓰지 말 것(그건 Badge). 부모 필드 없이는 의미가 없는 필드 서브 컴포넌트다.
- Chip / Badge 와 혼동 — Chip 은 **선택·필터용 인터랙티브 태그**(`<nds-chip selected interactive>`), Badge 는 **상태 라벨**, ValidationChip 은 **검증 규칙 1개의 충족 신호**다. 선택 UI 에 ValidationChip 을 쓰지 말 것.
- 단독으로 에러 메시지를 대체하지 말 것 — ValidationChip 은 규칙 체크리스트(여러 개 동시 노출)용. 폼 필드의 **단일 에러 1줄**은 FormField 의 helper/error 슬롯이 담당(pattern:form-validation 의 Helper/Error 규칙).
- 색을 raw hex(#2b96ed·#f13f00·#999)로 박지 말 것 — state prop 만 바꾸면 semantic 토큰이 5 브랜드 자동 대응. 컴포넌트에 hex 를 넣으면 브랜드 cascade 가 끊긴다.
- complete 전환은 입력값이 실제로 규칙을 충족할 때만 — 빈 입력에서 미리 complete(파랑)로 보이면 충족 신호가 거짓이 된다. 초기값은 incomplete.

## examplesHtml.do

```html
<!-- 비밀번호 규칙 체크리스트 — Input 아래 한 줄에 나열 -->
<nds-input type="password" placeholder="비밀번호"></nds-input>
<div style="display:flex; gap:12px; margin-top:8px">
  <nds-validation-chip state="complete">6자 이상</nds-validation-chip>
  <nds-validation-chip state="incomplete">영문+숫자</nds-validation-chip>
</div>
```

## examplesHtml.dont

```html
<!-- 선택 UI 를 ValidationChip 으로 (→ nds-chip selected interactive 가 맞음) -->
<nds-validation-chip state="complete">관심사: 운동</nds-validation-chip>

<!-- 색을 hex 로 박아 브랜드 cascade 차단 -->
<nds-validation-chip style="color:#2b96ed">6자 이상</nds-validation-chip>
```
