---
{}
---

## summary

긴 텍스트 줄 수 클램프 + '더보기/접기' 자동. 짧은 텍스트면 토글 자동 숨김.

## pitfalls

- 본문 안에 폰트 사이즈가 섞이면 line-height 측정 정확도 떨어짐 — 단일 톤 텍스트에만 사용.
- 자체 본문 클램프(maxLines)를 가진 카드 안에서 ExpandableText 중첩하지 말 것.
- hideCollapse=true는 약관 같이 한 번 펼치면 끝나는 케이스용. 일기/콘텐츠는 접기도 가능해야 함.

## recommended

- 콘텐츠 설명: lines={3}로 미리보기 + 더보기
- 약관: hideCollapse + expandLabel='이용약관 전문 보기'
- 리뷰: 기본 3줄, 자연스러운 토글

## examplesHtml.do

```html
<nds-expandable-text lines="3" expand-label="더보기" collapse-label="접기">
  긴 설명 텍스트… (스크롤 없이 너무 길어질 때만)
</nds-expandable-text>
```

## examplesHtml.dont

```html
<!-- 한 줄짜리 짧은 텍스트에 expandable 사용 — 더보기 버튼이 더 큼 -->
<nds-expandable-text lines="3">간단한 안내</nds-expandable-text>
```
