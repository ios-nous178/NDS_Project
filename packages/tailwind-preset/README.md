# @nudge-design/tailwind-preset

Nudge Design System 토큰 기반 **Tailwind CSS preset**. 토큰(색·spacing·radius·typography)을 Tailwind theme 로 매핑해, Tailwind 프로젝트가 DS 토큰을 클래스로 쓸 수 있게 합니다.

## 의존 / 소비

- 의존: `tokens`
- 외부 Tailwind 프로젝트가 직접 소비.

```js
// tailwind.config.js
import { nudgeEapPreset } from "@nudge-design/tailwind-preset";
// 프로젝트별 5종: nudgeEapPreset · trostPreset · cashwalkBizPreset · genietPreset · runmilePreset
// (default export = nudgeEapPreset)

export default {
  presets: [nudgeEapPreset],
  content: ["./src/**/*.{ts,tsx,html}"],
};
```

## 무엇을 매핑하나

- 색: DS 시멘틱 토큰 → Tailwind color scale
- spacing / radius / typography: DS 토큰 값
- 프로젝트별 매핑: 5 프로젝트 모두 preset 제공. 시멘틱 색(`bg-brand` 등)은 같은 CSS var 라 프로젝트
  `.css` 가 자동 redefine, 프로젝트 고유 atomic palette(`mint`·`orange`·`cobalt`·`brown` 등)·
  radius·typography·shadow 는 각 preset 이 별도 매핑(소스 주석 참고)

> React/HTML 컴포넌트를 쓸 거면 보통 이 preset 이 아니라 `@nudge-design/react`/`html` + `styles.css` 를 씁니다. 이 preset 은 **컴포넌트 없이 토큰만 Tailwind 로 쓰는** 프로젝트용입니다.
