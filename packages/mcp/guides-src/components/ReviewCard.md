---
{}
---

## summary

별점 후기 카드 (0.5 단위). 작성자/별점/본문/태그/푸터 슬롯, verified 인증 마크.

## pitfalls

- rating은 0-5, 0.5 단위. 범위 밖이면 시각적으로 깨짐.
- 본문 줄바꿈은 white-space: pre-wrap 자동 — body에 \n 그대로 사용.
- **'도움돼요'·좋아요·신고 같은 리뷰 액션은 반드시 `footer` 슬롯(html `slot="footer"`)에 넣어 카드 안에 둔다.** 카드 밖 형제로 두면 흰 배경 밖으로 떨어져 어느 리뷰의 액션인지 연결이 끊긴다 — 실제 목업에서 자주 나오는 오용. footer는 자유 슬롯이라 LikeButton/도움됨 버튼/텍스트 모두 가능.
- 리뷰를 여러 개 나열할 땐 ReviewCard 를 직접 쌓지 말고 `pattern:review-list` 를 따른다 (List 컨테이너 + footer 에 더보기/Pagination).

## recommended

- 상담 후기: verified + tags=['편안함','전문성']
- 상품 리뷰: meta='구매 인증' + verified
- 도움돼요/좋아요: `footer` 슬롯에 LikeButton 또는 TextButton

## examplesHtml.do

```html
<!-- 도움돼요 는 footer 슬롯 → 카드 안에 들어간다 -->
<nds-review-card author="건강맘4**" meta="2026.03.15 · 구매인증"
  rating="5" body="3개월 정도 먹고 눈 피로가 줄었어요. 재구매 의향 있어요." verified>
  <button slot="footer" class="nds-text-button" type="button">도움돼요 34</button>
</nds-review-card>
```

## examplesHtml.dont

```html
<!-- ① rating="6" — max(5) 초과로 표시가 깨짐 -->
<nds-review-card author="…" rating="6"></nds-review-card>

<!-- ② 도움돼요 를 카드 밖 형제로 — 카드 경계(흰 배경) 밖으로 떨어져 리뷰와 끊긴다.
     → slot="footer" 로 카드 안에 넣을 것 -->
<nds-review-card author="…" rating="5" body="…"></nds-review-card>
<button>도움돼요 34</button>
```
