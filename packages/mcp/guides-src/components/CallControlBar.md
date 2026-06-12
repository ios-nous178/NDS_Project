---
{}
---

## summary

통화 컨트롤. 음소거/카메라/스피커/종료 + duration 표시. 화상은 카메라, 음성은 스피커만 노출.

## pitfalls

- 카메라/스피커는 onChange 콜백을 안 주면 버튼 자동 숨김. 둘 다 노출하지 말 것 (화상에 스피커, 음성에 카메라는 어색).
- 종료 버튼 색을 override하지 말 것 — 시맨틱 의미(파괴) 유지를 위해 빨간색 고정.
- duration은 외부 timer state로 갱신 — 컴포넌트가 자체로 시간 계산하지 않음.

## recommended

- 화상 상담: muted + cameraOn + duration
- 음성 상담: muted + speakerOn + duration
- AI 통화: extra slot에 채팅 전환 버튼 추가

## examplesHtml.do

```html
<nds-call-control-bar duration="00:05:30" camera-on></nds-call-control-bar>
<script>
el.addEventListener("nds-call-mute-change", e => setMute(e.detail.muted));
el.addEventListener("nds-call-end", endCall);
</script>
```

## examplesHtml.dont

```html
<!-- duration 포맷이 HH:MM:SS 아님 -->
<nds-call-control-bar duration="5:30"></nds-call-control-bar>
```
