---
{}
---

## summary

축하 이펙트 (canvas 기반). active=true가 되는 순간 한 번 발사, onComplete에서 false로 리셋.

## pitfalls

- active를 항상 true로 두지 말 것 — onComplete에서 false 리셋 필수.
- 진지한 결과(부정/주의)에 사용 금지 — 톤이 어울리지 않음.
- z-index=9999 — 모달 위에도 그려짐. 의도된 동작.
- prefers-reduced-motion 사용자 배려: 외부에서 매체 쿼리 체크 후 active를 막을 것.

## recommended

- 챌린지 완료: 결과 화면 마운트 시 1회
- 첫 가입 환영: 가입 완료 모달 위에 발사

## examplesHtml.do

```html
<nds-confetti active count="50" duration="2000"
  colors='["#FF5722","#FFC107","#4CAF50"]'></nds-confetti>
```

## examplesHtml.dont

```html
<!-- 자해/위기 톤 화면 / 부정적 액션 후에 confetti — 시그널 충돌 -->
<nds-confetti active></nds-confetti>  <!-- after "계정 삭제 완료" -->
```
