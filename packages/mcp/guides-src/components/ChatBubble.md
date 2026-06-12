---
{}
---

## summary

1:1 상담/챗봇 말풍선. role=me|them, group으로 코너 정리.

## pitfalls

- group prop을 안 넘기면 매 메시지가 둥근 모서리로 떠서 그룹감이 없음. 같은 발신자 연속 메시지면 first/middle/last 명시.
- them 측 avatar는 group="single"|"last" 일 때만 보이고, first/middle은 visibility:hidden으로 자리만 차지 — 정렬 어긋나지 않음. 직접 avatar를 끄지 말 것.
- time과 read는 메시지 끝(single/last)에만 노출. 모든 메시지에 시간 박지 말 것.
- 텍스트 외 이미지/카드 첨부는 children에 직접 ReactNode 넘김. 별도 prop 없음.

## recommended

- group: 단독 single, 첫 메시지 first, 중간 middle, 마지막 last
- 긴 대화 화면은 list virtualization 권장 (DS는 단순 렌더만 제공)

## examplesHtml.do

```html
<nds-chat-bubble role="assistant" name="상담사" time="오후 2:31"
  message="요즘 잠은 어떠세요?"></nds-chat-bubble>
<nds-chat-bubble role="user" group time="오후 2:32" message="잘 못 자고 있어요"></nds-chat-bubble>
```

## examplesHtml.dont

```html
<!-- raw <div class="bubble"> 로 시각만 흉내 — 좌/우 정렬/꼬리/그룹 룰이 사라짐 -->
<div class="bubble user">잘 못 자고 있어요</div>
```
