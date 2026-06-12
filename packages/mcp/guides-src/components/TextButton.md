---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=171-8522
sizeMatrix:
  large: 16·24 regular / icon 16 / gap 2 / padding 4
  medium: 14·20 regular / icon 16 / gap 2 / padding 4
stateMatrix:
  default: "color #777 (neutral/600)"
  disabled: "color #999 (neutral/500)"
  hover: color primary/main (DS), Figma는 opacity-50 — 가이드 차이 항목
---

## summary

텍스트만으로 된 액션 — '전체보기' 같은 인라인 링크에 적합 (Figma Library node 171:8522).

## pitfalls

- 단순 <span>/<a>로 만들지 말 것 — DS TextButton 에 호버/포커스/접근성 처리가 들어 있음.
- Figma 호버 명세가 opacity-50 으로 잡혀 있음 (대비비 위험) — 코드에서는 primary 컬러로 대체. 의도적 차이.

## examplesHtml.do

```html
<nds-text-button size="md" label="더보기" right-icon="arrow-next"></nds-text-button>
```

## examplesHtml.dont

```html
<!-- 파괴 액션을 text-button 으로 — 위계/색이 부족. nds-button color="error" 권장 -->
<nds-text-button label="계정 삭제하기" right-icon="arrow-next"></nds-text-button>
```
