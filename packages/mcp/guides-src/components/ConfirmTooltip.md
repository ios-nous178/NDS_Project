---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=4018-1226
stateMatrix:
  actions=dual: 취소(흰 배경·검정 border·검정 텍스트) + 확인(검정 fill·흰 텍스트). 우측 정렬.
  actions=single: 확인 버튼 1개만 (검정 fill·흰 텍스트). 우측 정렬.
  placement: top(기본)/bottom/left/right — tail 이 트리거를 가리키도록 anchor 반대편에 배치.
---

## summary

캐포비 어드민 **popconfirm** — 트리거(버튼/링크) 옆에서 가볍게 확인받는 **흰 말풍선**. 제목 + 보조 본문 + 1~2 액션 버튼(검정 secondary CTA) + 방향 tail. `open` controlled, 트리거 클릭 핸들러에서 토글. 확인/취소는 React `onConfirm`/`onCancel`, HTML `nds-confirm-tooltip-confirm`/`nds-confirm-tooltip-cancel` 이벤트. **Tooltip(다크 hover 안내)과 분리** — 이건 사용자의 응답/결정이 필요한 경우. 색은 전부 semantic 토큰이라 brand cascade 로 해석(캐포비 = 검정 CTA).

## pitfalls

- 차단형 결정·되돌리기 어려운 작업·한 화면을 채울 만큼 긴 본문은 ConfirmTooltip 이 아니라 Modal/Popup. ConfirmTooltip 은 인라인 가벼운 확인용.
- 단순 hover 보조 설명에 쓰지 말 것 — 그건 component:Tooltip(다크 말풍선). ConfirmTooltip 은 액션 버튼이 있는 확인 팝업.
- `open` 은 controlled — 트리거 클릭에서 직접 토글하고, onConfirm/onCancel 에서 닫아야(open=false) 한다. (HTML 은 `open` 속성 토글 + 이벤트 리슨.)
- actions="single" 이면 확인 버튼만 — 이때 cancelLabel 은 무시된다. 취소가 필요하면 actions="dual".
- 트리거는 React children / HTML light-DOM child (실제 버튼). trigger-label 같은 평문 속성 없음 — Tooltip 과 다르다.

## examplesHtml.do

```html
<!-- 인라인 확인 (취소+해제) — open 토글 + 이벤트 리슨 -->
<nds-confirm-tooltip
  title="연결을 해제하시겠습니까?"
  description="연결을 해제하면 광고에 해당 소재는 더이상 노출되지 않습니다."
  confirm-label="해제" cancel-label="취소" placement="top" open>
  <nds-button color="secondary" variant="outlined" size="sm">연결 해제</nds-button>
</nds-confirm-tooltip>
<script>
  el.addEventListener("nds-confirm-tooltip-confirm", () => el.removeAttribute("open"));
  el.addEventListener("nds-confirm-tooltip-cancel", () => el.removeAttribute("open"));
</script>
<!-- 확인만 -->
<nds-confirm-tooltip title="저장되었습니다" actions="single" confirm-label="확인" open>
  <nds-button color="secondary" variant="outlined" size="sm">안내</nds-button>
</nds-confirm-tooltip>
```

## examplesHtml.dont

```html
<!-- 되돌리기 어려운 차단형 결정을 popconfirm 으로 — Modal/Popup 이 맞음 -->
<nds-confirm-tooltip title="계정을 영구 삭제할까요?" open>...</nds-confirm-tooltip>
<!-- hover 보조 설명에 ConfirmTooltip (액션 없는 안내는 Tooltip) -->
<nds-confirm-tooltip title="CTR = 클릭률" actions="single"></nds-confirm-tooltip>
```
