---
figmaNodeUrl: https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=5158-108
---

## summary

즉시 적용되는 on/off 스위치. 설정 페이지 / 알림 토글에 사용. 폼 제출 후 적용되는 binary 는 Checkbox 가 맞음. **라벨 내장 status 변형** — onLabel/offLabel(HTML on-label/off-label)을 주면 트랙 **안**에 텍스트(예: 노출/미노출)가 들어가고 폭이 auto 로 넓어진다. tone='success' 면 켜짐 트랙이 초록(노출/활성 status). 어드민 리스트의 노출 토글에 사용.

## pitfalls

- label 없는 단독 Toggle — 무엇을 켜고 끄는지 시각만으론 불명확. (라벨 내장 status 변형이면 on-label/off-label 자체가 안내 역할.)
- Toggle 변경 후 별도 '저장' 버튼이 필요한 UI 라면 Checkbox 가 맞음 — Toggle 은 즉시 반영 시그널.
- size='sm' 을 본문 안 inline 텍스트와 함께 — 시각 위계 부족, baseline 어색.
- 노출/활성 status 토글의 켜짐 초록을 raw hex(#60be34 등)로 박지 말 것 — tone='success' 가 semantic status-success 토큰으로 5 브랜드 자동 대응. 라벨 내장 status 토글은 size 무시(고정 30 / thumb 25).
- **트로스트(Controls 가이드 5158:108)**: 트랙 50×30, on=다크(#333). 즉시 적용 설정에만(저장 버튼 필요한 곳 금지). 라벨은 명사·상태형("푸시 알림" ⭕, "받기"/"활성화" ❌ — 동사 금지). 라벨 좌측·컨트롤 우측.

## examplesHtml.do

```html
<nds-toggle name="push-notification" label="푸시 알림 받기" checked></nds-toggle>
<!-- 어드민 리스트 노출 토글: 라벨 내장 + 초록 status -->
<nds-toggle on-label="노출" off-label="미노출" tone="success" checked></nds-toggle>
<script>el.addEventListener("change", e => savePref(e.target.checked));</script>
```

## examplesHtml.dont

```html
<!-- 라벨 없는 단독 토글 -->
<nds-toggle></nds-toggle>
<!-- 즉시 반영 안 되는 form -->
<form>
  <nds-toggle name="x" label="설정 A"></nds-toggle>
  <nds-button color="primary" type="submit">저장</nds-button> <!-- Checkbox 가 맞음 -->
</form>
```
