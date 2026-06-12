---
{}
---

## summary

댓글 한 건. 작성자/시간/본문 + 좋아요/답글 슬롯 + 답글 트리(replies). 본문 줄바꿈 자동 보존.

## pitfalls

- 답글에는 isReply=true로 들여쓰기 시각 강조. 빠뜨리면 평면적으로 보임.
- likeAction은 슬롯 — LikeButton 컴포넌트를 직접 넘김. 텍스트 버튼만 두지 말 것.
- 본문은 white-space: pre-wrap — text에 줄바꿈 그대로 넣으면 됨.

## recommended

- 콘텐츠 댓글: avatar + author + likeAction + onReply
- 답글 트리: replies={<>... isReply ...</>}
- 상담사 댓글: authorBadge로 역할 표시

## examplesHtml.do

```html
<nds-comment-item author="이정민" time="2시간 전" text="공감해요!" show-reply>
  <img slot="avatar" src="/u.jpg" alt="" />
</nds-comment-item>
<script>el.addEventListener("nds-comment-reply", e => focusReply(e.detail.author));</script>
```

## examplesHtml.dont

```html
<!-- text 를 slot 으로 — text 는 attribute 사용 -->
<nds-comment-item author="A"><p>본문</p></nds-comment-item>
```
