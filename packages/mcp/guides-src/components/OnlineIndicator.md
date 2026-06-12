---
{}
---

## summary

presence 점 (online/away/busy/offline). online은 자동 펄스 애니메이션.

## pitfalls

- online에 별도 강조 효과 추가하지 말 것 — 자동 펄스 있음.
- 아바타 우하단에 올릴 때 부모 position:relative + 점 position:absolute.

## recommended

- 상담사 리스트: showLabel=true로 텍스트 함께
- 아바타 점: 라벨 없이 size=10

## examplesHtml.do

```html
<nds-avatar src="/u.jpg" alt="홍길동" size="md"></nds-avatar>
<nds-online-indicator status="online" show-label aria-label="온라인"></nds-online-indicator>
```

## examplesHtml.dont

```html
<!-- 색 점 하나로 상태 모사 — 4 상태 (online/idle/offline/dnd) 구분 못함 -->
<span style="background:#0a0;width:8px;height:8px"></span>
```
