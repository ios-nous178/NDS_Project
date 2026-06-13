---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=1399-124
---

## summary

폼 입력의 검증·합성 규칙 SSOT(넛지EAP Library · InputFormGuide 1399:124). 단일 필드 레이아웃(라벨-위·필드 치수·여백)은 pattern:nudge-eap-form-layout 이 담당하고, 이 가이드는 그 위에서 **검증 표시(ValidationChip)·합성 컨트롤(인라인 버튼·비밀번호 토글)·Label/Helper/Error 규칙·검증 시점**을 정한다. 회원가입처럼 규칙이 여러 개인 폼에서 어떤 신호를 언제 보여줄지 결정한다.

## rules

- 합성 ① Input + ValidationChip — 형식 규칙이 2개 이상일 때 Input 아래 한 줄에 `<nds-validation-chip>` 를 나열. 입력값이 규칙을 충족할 때마다 해당 chip 을 `state="incomplete" → "complete"`(Brand Blue) 로 전환. 비밀번호/이메일 형식 안내에 사용(component:ValidationChip).
- 합성 ② Input + Inline Button — 인증번호 받기·중복 확인 같은 **단일 액션**은 Input 과 같은 행에 작은 outlined 버튼을 둔다. `FormField` > `InputGroup`(align="start") 로 입력+버튼을 한 줄에 합성한다 — 커스텀 flex 행을 새로 만들지 말 것(component:InputGroup).
- 합성 ③ Input + Eye Icon — 비밀번호 표시/숨김은 `<nds-input type="password">` 의 **내장 password-toggle** 이 자동 제공(우측 눈 버튼, type 토글·포커스 유지까지 처리). 별도 trailing 버튼을 만들지 말 것 — 끄려면 `password-toggle="false"`.
- Label / Placeholder — Label 은 항상 필드 위(Top Label). 필수 항목은 별표(`*`) + `aria-required`. Placeholder 는 형식 힌트만 — **Label 을 대체하지 않는다**.
- Helper / Error — 같은 자리에서 교차한다(동시 노출 X). 여러 검증이 실패해도 Error 는 **1줄만**(우선순위: 필수 → 형식 → 길이 → 도메인 → 서버). Helper/Error 영역은 표시 안 돼도 1줄 높이를 예약해 레이아웃 점프를 막는다.
- Validation 시점 — onBlur(권장, 필드 떠날 때 1회) · onSubmit(제출 시 일괄, 첫 에러 필드로 자동 스크롤·포커스) · onChange(비밀번호 강도 게이지 같은 즉시 피드백 한정).
- Submit / Errors — 제출 중에는 버튼 비활성 + 로딩, 폼 비활성. 서버 오류는 폼 상단 Alert(notice/NoticeAlert) + 입력값 보존. 성공은 Toast("저장되었습니다", 자동 사라짐).
- 컨트롤 선택(Checkbox/Radio/Toggle/Dropdown/SelectionButton)은 pattern:selection-controls 결정 트리를 따른다 — 같은 용도는 화면이 달라도 같은 컴포넌트로 통일.

## avoid

- ValidationChip 으로 폼 필드의 단일 에러 1줄을 대체 — 에러 1줄은 FormField helper/error 슬롯, ValidationChip 은 규칙 체크리스트(여러 개 동시).
- Helper 와 Error 동시 노출 — 한 자리에서 교차해야 한다.
- 검증 실패 메시지를 규칙별로 여러 줄 — Error 는 우선순위 1줄.
- 인라인 액션 버튼을 커스텀 flex 로 새로 — FormField + InputGroup 합성 재사용.
- chip·버튼·헬퍼 색을 raw hex 로 — state/semantic 토큰으로 5 브랜드 자동 대응.

## readyMade.note

넛지EAP 회원가입 합성 3종. 색은 모두 semantic 토큰(ValidationChip state · Button color)으로 브랜드 cascade 자동 대응.

## readyMade.html

```html
<!-- ① Input + ValidationChip (비밀번호 실시간 검증) -->
<div style="display:flex; flex-direction:column; gap:8px; max-width:332px">
  <nds-input type="password" placeholder="비밀번호"></nds-input>
  <div style="display:flex; gap:12px">
    <nds-validation-chip state="complete">6자 이상</nds-validation-chip>
    <nds-validation-chip state="incomplete">영문+숫자</nds-validation-chip>
  </div>
</div>

<!-- ② Input + Inline Button (인증번호 받기) — FormField > InputGroup(align="start") -->
<nds-form-field label="휴대폰 번호">
  <nds-input-group align="start">
    <nds-input placeholder="010-0000-0000"></nds-input>
    <nds-button variant="outlined">인증번호 받기</nds-button>
  </nds-input-group>
</nds-form-field>

<!-- ③ Input + Eye Icon (비밀번호 표시·숨김) — type="password" 면 눈 토글 자동, 별도 마크업 불필요 -->
<nds-input type="password" placeholder="비밀번호"></nds-input>
```
