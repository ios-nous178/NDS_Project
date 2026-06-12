---
{}
---

## summary

온보딩 dim 툴팁. 특정 DOM 영역을 강조 + 단계별 안내. Tooltip과 분리(가벼운 hover용).

## pitfalls

- 단순 hover 설명용은 Tooltip을 쓸 것. CoachMark는 화면 전체 dim + 강제 가이드.
- target은 selector(string) 또는 element-getter 함수. 마운트 시점에 DOM에 존재해야 함.
- 스크롤 필요한 위치를 가리키면 사전에 scrollIntoView 직접 호출 — CoachMark가 자동 스크롤 안 함.
- 한 화면에 매번 띄우지 말 것 — 첫 진입/새 기능 출시 등 명시적 트리거에만.

## recommended

- 첫 진입: steps 3-5개, 마지막 단계 후 onClose에서 localStorage 플래그 저장
- 단일 안내: hideSkip + steps 1개
- 도움말 재생: ref로 외부에서 step 제어

## examplesHtml.do

```html
<nds-coach-mark open step="0"
  steps='[{"title":"여기서 시작","description":"홈 탭에서 검사를 시작하세요"}]'
  finish-label="완료" skip-label="건너뛰기"></nds-coach-mark>
```

## examplesHtml.dont

```html
<!-- steps 가 1개인데 skip 노출 + finish-label 누락 — UX 가 어색 -->
<nds-coach-mark open steps='[{"title":"…"}]'></nds-coach-mark>
```
