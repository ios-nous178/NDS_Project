---
{}
---

## summary

다단계 폼 컨테이너. 단계별 검증/진행/제출을 한 컴포넌트에서 관리. Stepper(인디케이터만)와 분리.

## pitfalls

- canProceed는 동기 boolean — 비동기 검증 결과는 외부 state로 보관 후 boolean으로 전달.
- 마지막 단계의 '다음' 버튼은 자동으로 submitLabel + onSubmit으로 동작.
- 단계 안에서 `useMultiStepForm()` 훅으로 next/prev 직접 호출 가능 (커스텀 액션 추가 시).
- 단순 진행 표시만 필요하면 Stepper를 쓸 것 — MultiStepForm은 폼 흐름 컨테이너.

## recommended

- 회원가입: indicator='progress', steps에 입력→인증→약관 동의 순서
- 검사: indicator='steps' (TODO 단계 표시 강조)
- 비동기 제출: submitting prop으로 버튼 비활성, onSubmit async

## examplesHtml.do

```html
<nds-multi-step-form
  steps='[{"key":"info","title":"기본 정보"},{"key":"confirm","title":"확인"}]'
  current="0">
  <div data-step="info">기본 정보 form…</div>
  <div data-step="confirm">최종 확인…</div>
</nds-multi-step-form>
<script>el.addEventListener("step-submit", e => save(e.detail.current));</script>
```

## examplesHtml.dont

```html
<!-- 자식 element 가 data-step 없음 — 어느 step 인지 매칭 불가 -->
<nds-multi-step-form steps='...'><div>step 1</div><div>step 2</div></nds-multi-step-form>
```
