---
{}
---

## summary

Floating Action Button. 화면 하단에 떠 있는 가장 중요한 단일 액션. position 기본 bottom-right (fixed).

## pitfalls

- 한 화면에 FAB는 1개만. 2개 이상 두면 위계 붕괴.
- StickyBottom CTA가 있는 화면에는 FAB를 두지 말 것 — 두 요소가 겹쳐서 안전 영역이 무너짐.
- position='bottom-right' 등은 position: fixed로 동작. Storybook/테스트에서는 static + 부모에서 fixed 처리.
- label 없이 아이콘만 쓰면 aria-label 필수. 누락 시 스크린리더 접근성 깨짐.
- offset 기본 16px — 모바일 하단바(56px)와 겹치면 offset={80} 등으로 보정.

## recommended

- 일기 화면 새 글 작성: <FAB icon={<EditIcon/>} label='새 글' position='bottom-right' />
- 감정 캘린더 빠른 기록: <FAB icon={<PlusIcon/>} aria-label='기록 추가' />
- 하단바 있는 화면: offset={72}

## examplesHtml.do

```html
<nds-fab icon="plus" label="기록 추가" color="primary" position="bottom-right"></nds-fab>
```

## examplesHtml.dont

```html
<!-- 화면에 FAB 와 primary nds-button 양쪽 — 대표 액션이 둘이 됨 -->
<nds-button color="primary">기록 추가</nds-button>
<nds-fab icon="plus" label="기록 추가"></nds-fab>
```
