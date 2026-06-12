---
{}
---

## summary

SMS/이메일 인증코드 입력 — 웹용 단일 필드(한 줄 박스). 코드 **입력 필드만** 책임진다. 자리별 세그먼트(네이티브식)가 아니라 base Input 과 동일한 단일 박스라 붙여넣기·자동완성(one-time-code)이 자연 지원되고 높이/둥근모서리는 Input 토큰(--nds-input-*)을 상속한다. 타이머·재전송·확인 버튼이 함께 있는 인증 폼은 이 필드를 **FieldActionRow** 로 합성한다(타이머는 FieldActionRow 가 필드 안에 렌더, 버튼은 액션 슬롯). (구 이름 OtpInput — 2026-06 VerificationCodeInput 으로 개명, 태그 nds-verification-code-input. 자리별 PIN 은 PinPad.)

## pitfalls

- 이 컴포넌트는 코드 필드만 — 타이머/재전송/확인 버튼은 직접 넣지 말고 FieldActionRow 로 합성한다(내장 타이머 없음).
- value는 숫자 string. length만큼 채워지면 onComplete(react)/code-complete(html) 발화 — 그 안에서 자동 제출하면 UX 좋음.
- 입력은 숫자만 허용(영문/특수문자 자동 필터). 영숫자 OTP가 필요하면 maxLength 늘린 일반 Input 검토.
- autoComplete="one-time-code" 가 단일 input 에 적용 — iOS/Android SMS 자동 추출 동작.
- 자리별 세그먼트 UI(자리당 박스)가 아님 — length 는 maxLength 로만 작동. 점 인디케이터식 PIN 은 PinPad.
- **자리별 박스(6칸 세그먼트) 는 모바일/네이티브 앱 패턴** — 웹/데스크톱에서는 이 단일 필드가 표준이다(붙여넣기·자동완성·접근성이 자연 동작). 네이티브 앱의 6칸 OTP 화면을 웹 목업으로 그대로 옮겨 자리별 박스를 raw <input> 으로 만들지 말 것. 자리별 PIN 점 인디케이터가 필요하면 PinPad.

## recommended

- 회원가입/로그인 SMS 인증: FieldActionRow(field=VerificationCodeInput length=6 autoFocus · timer=CountdownTimer · action=Button '확인') · onComplete 로 자동 검증.
- 재전송: 타이머 만료(timerExpired) 시 FieldActionRow 의 action 버튼을 '재전송'으로 토글 → 클릭에서 재발송.
- 에러 시 error prop + Toast. 자동 clear 는 호출부에서 결정(전체 clear가 보통 안전).

## examplesHtml.do

```html
<!-- 레시피A · 인라인 확인 버튼형: 코드 입력 + 타이머 + 확인 버튼을 nds-field-action-row 한 줄로.
     버튼 색은 nds-button 의 color 가 그대로 — 캐포비 검정 확인은 color="neutral"(secondary 아님). -->
<nds-field-action-row helper-text="문자로 전송된 인증번호를 입력해주세요">
  <nds-verification-code-input slot="field" length="6" auto-focus></nds-verification-code-input>
  <nds-countdown-timer slot="timer" ends-at="2026-06-08T12:03:00Z" format="mm:ss" tone="brand"></nds-countdown-timer>
  <nds-button slot="action" color="neutral" size="field">확인</nds-button>
</nds-field-action-row>

<!-- 레시피B · 캐포비 본인인증형(pattern:cashwalk-biz-verification): 전송/재전송은 별도 full-width 검정 버튼,
     코드 입력엔 인라인 버튼 없이 타이머만(FieldActionRow 의 action 생략), 확정은 하단 [다음](primary full-width). -->
<nds-button color="neutral" full-width>인증번호 재전송</nds-button>
<nds-field-action-row>
  <nds-verification-code-input slot="field" length="6" auto-focus></nds-verification-code-input>
  <nds-countdown-timer slot="timer" ends-at="2026-06-08T12:03:00Z" format="mm:ss" tone="brand"></nds-countdown-timer>
</nds-field-action-row>
<!-- …다른 폼 필드… -->
<nds-button color="primary" full-width>다음</nds-button>
<script>
  document.querySelector("nds-verification-code-input").addEventListener("code-complete", e => verify(e.detail.value));
</script>
```

## examplesHtml.dont

```html
<!-- 자리별 박스를 raw <input> 6개로 흉내 — 붙여넣기/자동완성/접근성 손실. 단일 nds-verification-code-input 사용 -->
<input maxlength="1"/><input maxlength="1"/>…
```
