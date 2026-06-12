---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=171-8560
sizeMatrix:
  x-large: box 36 / icon 28 (padding 4)
  large: box 32 / icon 24 (padding 4)
  medium: box 28 / icon 20 (padding 4)
  small: box 24 / icon 16 (padding 4)
stateMatrix:
  hover: "bg #F5F5F5 (neutral/100), radius 4"
  disabled: icon color = text/disabled (Figma에는 미정의)
---

## summary

아이콘만 있는 버튼 (Figma Library node 171:8560 기준). 접근성을 위해 aria-label 필수.

## pitfalls

- aria-label 누락 시 스크린리더가 읽지 못함 (prop 강제됨).
- AppBar 우측 빈 영역에 ChevronRight 같은 장식만 두지 말 것 — 인터랙션 없이 시각적 잡음.
- Figma 명세에 disabled 상태가 없음 — disabled 가 필요한 흐름이면 Button(icon-only 처리) 또는 Tooltip 으로 우회.

## recommended

- AppBar 우측엔 알림/설정 같은 실제 기능 IconButton을 두기.
- <IconButton icon={<PushIcon/>} aria-label='알림' onClick={...}>

## examplesHtml.do

```html
<nds-icon-button size="md" aria-label="알림">
  <svg viewBox="0 0 24 24" fill="currentColor">…</svg>
</nds-icon-button>
```

## examplesHtml.dont

```html
<!-- aria-label 없는 아이콘 단독 버튼: 스크린리더가 "button" 만 읽음 -->
<nds-icon-button size="md"><svg>…</svg></nds-icon-button>
<!-- raw <button> 으로 아이콘 버튼 흉내. 토큰/사이즈 룰 적용 안 됨 -->
<button class="icon-btn"><svg>…</svg></button>
```
