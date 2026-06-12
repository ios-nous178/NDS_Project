---
{}
---

## summary

상담사 프로필 카드. 이름/자격/평점/태그/소개/예약 CTA. 1-2열 그리드에 잘 어울림.

## pitfalls

- imageSrc 없을 때 자동으로 이름 이니셜 표기. 빈 div를 imageSrc로 우회하지 말 것.
- tags는 5개 이하 권장 (그 이상은 시각 잡음). 정말 많이 보여줘야 하면 "+3" 더보기 패턴.
- ctaLabel 누르면 stopPropagation 자동 — onCardClick과 별개로 동작. 둘 다 부착해도 안전.
- bio는 -webkit-line-clamp 2로 자동 잘림. 더 긴 본문은 상세 페이지로.

## interactivePattern

리스트 화면에서는 카드 전체 클릭 → 상세, CTA(예약)는 상세 안에서. 두 액션을 한 화면에서 동시에 두면 사용자가 헷갈림.

## examplesHtml.do

```html
<nds-counselor-card name="이정민 상담사" job-title="심리 상담사"
  image-src="/dr.jpg" rating="4.8" review-count="124"
  tags='["불안","번아웃"]' cta-label="상담 신청"></nds-counselor-card>
<script>el.addEventListener("nds-counselor-cta", () => navigate("/apply"));</script>
```

## examplesHtml.dont

```html
<!-- rating 6 (max 5 초과) — 표시 깨짐 -->
<nds-counselor-card name="A" rating="6"></nds-counselor-card>
```
