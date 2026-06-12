---
{}
---

## summary

짧은 투표 카드. 옵션 + 결과 바, 투표 후 자동 결과 노출. 본격 설문은 LikertScale.

## pitfalls

- count는 외부 state — 컴포넌트가 자체로 카운트 추적 안 함. 서버 응답으로 갱신.
- votedKey가 있으면 자동 결과 노출. 마감만 보여주려면 showResults + disabled.
- 임상 척도(PHQ-9 등)는 LikertScale을 쓸 것. VotePoll은 가벼운 의견 수렴용.

## recommended

- 커뮤니티: votedKey + onVote에서 서버 호출
- 마감 결과: showResults disabled

## examplesHtml.do

```html
<nds-vote-poll question="어느 시간대가 좋으세요?"
  options='[
    {"key":"am","label":"오전","count":24},
    {"key":"pm","label":"오후","count":48}
  ]'
  voted-key=""></nds-vote-poll>
<script>el.addEventListener("nds-vote", e => castVote(e.detail.key));</script>
```

## examplesHtml.dont

```html
<!-- voted-key 미사용 — 사용자가 매번 다시 투표 가능 -->
<nds-vote-poll question="?" options='[...]'></nds-vote-poll>
```
