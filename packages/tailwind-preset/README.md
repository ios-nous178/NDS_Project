# @nudge-design/tailwind-preset

Nudge Design System 토큰 기반 **Tailwind CSS preset**. 토큰(색·spacing·radius·typography)을 Tailwind theme 로 매핑해, Tailwind 프로젝트가 DS 토큰을 클래스로 쓸 수 있게 합니다.

## 의존 / 소비

- 의존: `tokens`
- 외부 Tailwind 프로젝트가 직접 소비.

```js
// tailwind.config.js
import { nudgeEapPreset } from "@nudge-design/tailwind-preset";
// 브랜드별: nudgeEapPreset · trostPreset · cashwalkBizPreset (default export = nudgeEapPreset)

export default {
  presets: [nudgeEapPreset],
  content: ["./src/**/*.{ts,tsx,html}"],
};
```

## 무엇을 매핑하나

- 색: DS 시멘틱 토큰 → Tailwind color scale
- spacing / radius / typography: DS 토큰 값
- 브랜드별 매핑: 기본은 NudgeEAP 계열, cashwalk-biz 등은 별도 매핑(소스 주석 참고)

> React/HTML 컴포넌트를 쓸 거면 보통 이 preset 이 아니라 `@nudge-design/react`/`html` + `styles.css` 를 씁니다. 이 preset 은 **컴포넌트 없이 토큰만 Tailwind 로 쓰는** 프로젝트용입니다.
