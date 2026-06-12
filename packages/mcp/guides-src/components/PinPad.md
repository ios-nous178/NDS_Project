---
{}
---

## summary

PIN 키패드. 점 인디케이터 + 숫자 그리드. SMS 인증은 VerificationCodeInput, 일반 입력은 Input.

## pitfalls

- shuffleSeed를 매 렌더 새로 계산하면 키 배치 흔들림 — useMemo로 진입 시점에 고정.
- onComplete는 길이 도달 시 1회. 실패 시 value=''로 리셋해야 다시 입력 가능.
- VerificationCodeInput과 혼동 금지 — PIN은 사용자 비밀, OTP는 외부에서 받는 인증번호.

## recommended

- 앱 진입 PIN: length=6 (기본)
- 간편 결제: length=4
- 보안 키패드: shuffle + 진입 시점 시드

## examplesHtml.do

```html
<nds-pin-pad pin-length="6" label="인증 번호 입력" shuffle></nds-pin-pad>
<script>el.addEventListener("nds-pin-complete", e => verify(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- OTP / SMS 인증을 PinPad 로 — VerificationCodeInput 가 맞음 (자동 채움 / 붙여넣기) -->
<nds-pin-pad pin-length="6" label="SMS 인증"></nds-pin-pad>
```
