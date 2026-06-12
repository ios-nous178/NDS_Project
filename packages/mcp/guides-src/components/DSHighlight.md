---
{}
---

## summary

DS 적용 영역을 시각적으로 강조하는 dev-only 디버깅 컴포넌트. production 빌드에서 자동 제거.

## pitfalls

- DSHighlight 를 일반 화면 강조에 재활용 — 그 용도는 Banner / Card 가 맞음.
- production 환경에서 import 가 남아 있으면 번들 크기 증가 — import.meta.env.DEV 게이트로 감쌀 것.

## examplesHtml.do

```html
<nds-ds-highlight mode="component"></nds-ds-highlight>
<!-- 강조 대상에 data-ds-mark="<영역>" 부여 -->
```

## examplesHtml.dont

```html
<!-- production 빌드에 그대로 두면 안 됨. import.meta.env.DEV 게이트 적용 -->
<nds-ds-highlight mode="all"></nds-ds-highlight>
```
