---
{}
---

## summary

좋아요 토글 + 카운트. 클릭 펑 애니메이션, 1000+는 자동 K 변환. 단일 좋아요 전용.

## pitfalls

- liked/count는 controlled — 외부 source of truth + onChange에서 둘 다 갱신.
- LikeButton은 단일 좋아요 토글 전용 — 여러 종류 반응 칩 그룹 용도로 쓰지 말 것.
- 카운트가 음수가 되지 않도록 외부 가드.

## recommended

- 콘텐츠 푸터: size='md' count 자동 K
- CommentItem: likeAction={<LikeButton size='sm' />}
- primary 톤: activeColor=primary로 좋아요/북마크 같은 의미 강조

## examplesHtml.do

```html
<nds-like-button liked count="42" size="md"></nds-like-button>
<script>el.addEventListener("nds-like-change", e => persist(e.detail));</script>
```

## examplesHtml.dont

```html
<!-- count 를 사용자가 변경한 후 서버에 반영하지 않음 — 새로고침 시 사라짐 -->
<nds-like-button count="42"></nds-like-button>  <!-- listener 없음 -->
```
