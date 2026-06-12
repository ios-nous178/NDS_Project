---
{}
---

## summary

음성 메모 녹음 UI. 큰 녹음 버튼 + 타이머 + 펄스 인디케이터. 마이크 접근/저장은 외부 처리.

## pitfalls

- seconds는 외부 timer로 갱신 — 컴포넌트는 시간 측정 안 함 (테스트 가능성).
- 녹음 시작 시 navigator.mediaDevices.getUserMedia 등 마이크 권한 처리는 onStateChange 안에서.
- maxSeconds 도달 시 자동 onComplete + state='idle' — 직접 stop 처리할 필요 없음.

## recommended

- 감정 일기 음성: maxSeconds=300 (5분), onComplete에서 파일 업로드
- 챗 음성 메시지: maxSeconds=60

## examplesHtml.do

```html
<nds-voice-recorder state="idle" seconds="0" max-seconds="180"></nds-voice-recorder>
<script>
// host 가 timer 와 state 를 controlled 로 관리:
el.addEventListener("state-change", e => { el.setAttribute("state", e.detail.state); /* setInterval 로 seconds */ });
el.addEventListener("complete", e => save(e.detail.seconds));
</script>
```

## examplesHtml.dont

```html
<!-- seconds 를 자체 증가시키지 않음 — host 가 timer 책임 -->
<nds-voice-recorder state="recording" seconds="0"></nds-voice-recorder>  <!-- 영원히 0 -->
```
