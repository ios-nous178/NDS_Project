---
{}
---

## summary

채팅 입력바. ChatBubble의 짝. 자동 확장 textarea + 빠른 응답 + 첨부/마이크 + 글자수.

## pitfalls

- value/onValueChange/onSubmit 모두 controlled — 내부 state 없음.
- submitOnEnter=true(기본)에서 Enter=전송, Shift+Enter=줄바꿈. 모바일에선 키보드의 줄바꿈 키 사용.
- quickReplies는 onClick에서 onValueChange 또는 onSubmit을 직접 호출 — 컴포넌트가 정책을 강제하지 않음.
- onAttach/onMic prop을 안 주면 해당 버튼이 자동 숨김 (UI 요소 안 만들고 깔끔).

## recommended

- 1:1 상담: <ChatInput value, onValueChange, onSubmit, maxLength={1000}>
- 챗봇 + 빠른 응답: quickReplies=[{label, onClick: ()=> onSubmit(...)}]
- 음성 메모: onMic만, onAttach 생략

## examplesHtml.do

```html
<nds-chat-input placeholder="메시지를 입력하세요" max-length="500"
  quick-replies='[{"text":"네"},{"text":"아니요"}]'></nds-chat-input>
<script>el.addEventListener("nds-chat-submit", e => send(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- raw <input> + <button> 으로 채팅 입력 흉내 — 자동 grow / quick-replies / 첨부 등 미적용 -->
<input type="text" /><button>전송</button>
```
