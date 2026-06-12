---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3295-547
---

## summary

다중 선택 / on-off / 약관 동의 체크. 라벨이 함께 와야 의미가 전달되고, 단일 선택 그룹은 Radio 가 맞음. `indeterminate` 로 '일부 자식만 선택됨'(부모/전체선택)을 옐로우 마이너스로 표시.

## pitfalls

- 약관/필수 동의에 disabled 로 잠가두면 시각 위계가 모호 — required 또는 별도 안내문으로 명시.
- checked 와 default-checked 동시 사용 — controlled / uncontrolled 가 섞임.
- label 없이 단독으로 던지지 말 것 — 한 줄 안내문이라도 aria-label 로 제공.
- `indeterminate` 는 `checked` 보다 우선 표시되고, 클릭하면 네이티브와 동일하게 `checked=true` 로 전이된다(부분→전체). '부모/전체선택' 행에만 쓰고 leaf 엔 쓰지 말 것.
- 상태 SSOT 는 호스트의 `checked` **프로퍼티** — `el.checked = true` 로 코드에서 바꿔도 `change` 는 발생하지 않는다(네이티브 동일, 사용자 입력에만 발화). 전체선택 헤더는 ①헤더 `change` → 자식 `.checked` 를 일괄 set, ②자식 `change` → 선택 수로 헤더 `checked`/`indeterminate` 3상태 재계산, 두 방향을 직접 잇는다. `onclick` 시점엔 아직 토글 전이라 상태가 안 settled — 반드시 `change` 를 들을 것. (`.click()` 만으론 호스트 토글이 안 됨.)
- **시/도 ▸ 시/군구 같은 계층 트리는 CheckboxTree** 가 부모 indeterminate 를 자동 계산 — 직접 indeterminate 를 손계산해 트리를 손조립하지 말 것. component:CheckboxTree.
- 소규모 고정 옵션 다중선택(예: 연령대 10대~70대)은 **SelectChip**(`<nds-chip selected>`) 우선 — 체크박스 리스트는 약관 동의·긴 가변 리스트·행 단위 선택에. (`pattern:cashwalk-biz-badge-chip`)

## examplesHtml.do

```html
<nds-checkbox name="agree-terms" label="이용약관에 동의합니다" required></nds-checkbox>
<nds-checkbox name="optional-marketing" label="마케팅 정보 수신 (선택)"></nds-checkbox>
```

## examplesHtml.dont

```html
<!-- 라벨 없는 단독 체크박스 — 의미 전달 실패 -->
<nds-checkbox name="x" checked></nds-checkbox>
<!-- 라디오로 충분한 단일 선택을 체크박스로 -->
<nds-checkbox name="payment" value="card">카드</nds-checkbox>
<nds-checkbox name="payment" value="cash">현금</nds-checkbox>
```
