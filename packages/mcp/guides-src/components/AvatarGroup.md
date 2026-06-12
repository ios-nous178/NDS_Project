---
{}
---

## summary

여러 아바타를 겹쳐 표시 + 초과 +N. 단체 상담/챌린지 참가자 같은 시각 신호용.

## pitfalls

- 정확한 명단이 목적이면 List가 더 적절. AvatarGroup은 'N명이 함께'라는 시각 신호.
- 단일 아바타는 Avatar 그대로. AvatarGroup은 N명 ≥ 2 케이스용.
- max를 너무 크게 두면(7+) 가로 폭이 늘어남 — 모바일은 4 권장.

## recommended

- 단체 상담 참여자: max=4 size='md'
- 챌린지: max=5 size='sm'
- 이미지 + 이니셜 혼합: src 없으면 자동 이니셜 fallback

## examplesHtml.do

```html
<nds-avatar-group max="3" size="md"
  items='[{"src":"/a.jpg","alt":"A"},{"src":"/b.jpg","alt":"B"},{"src":"/c.jpg","alt":"C"},{"src":"/d.jpg","alt":"D"}]'></nds-avatar-group>
```

## examplesHtml.dont

```html
<!-- max 누락 — 5명 이상이면 가로로 무한히 늘어남 -->
<nds-avatar-group items='[…아주 많음…]'></nds-avatar-group>
```
