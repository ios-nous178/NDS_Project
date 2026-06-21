---
"@nudge-design/tokens": major
"@nudge-design/tailwind-preset": minor
"@nudge-design/styles": patch
"@nudge-design/html": patch
---

Stroke 토큰 통일 — Border Width 전용 primitive 폐지, 모든 Border 가 Stroke 토큰 참조

선(Border·Divider·Outline) 두께를 단일 **Stroke** 토큰으로 통일했습니다. 브랜드 공통(radius·spacing 과 동일하게 프로젝트 override 없음).

- **Stroke 스케일 재정의**: `stroke.none`(0) · `stroke.thin`(1px) · `stroke.medium`(1.5px) · `stroke.bold`(2px). 기존 `stroke.default`(1px)→`thin`, `stroke.focus`(2px)→`bold` 로 리네임, `medium`(1.5px) 신설.
- **Border Width 전용 primitive 폐지**: `borderWidth` 토큰 export 와 `--border-none/default/focus` CSS 변수 제거(소비 0). 모든 Border 는 Stroke 토큰을 참조합니다.
- **프로젝트 stroke/borderWidth override 제거**: cashwalk-biz·runmile·trost 가 각자 다른 슬롯명(thin/icon/hairline/strong/bold)으로 두던 override 를 제거 — 전부 소비 0 인 죽은 설정이었습니다. 이제 Stroke 는 브랜드 공통.
- **컴포넌트 rewire**: react(styles)·html 미러의 모든 `Npx solid` border(약 145곳)를 `var(--stroke-thin|medium|bold)` 참조로 교체. **값은 그대로(시각 변화 없음)**.
- **tailwind-preset**: cashwalk-biz 전용 `border-*` 유틸(borderWidth 스케일)을 제거. Border 두께는 `var(--stroke-*)` 또는 Tailwind 기본 border 유틸을 사용하세요.

외부 소비처가 `var(--stroke-default)` / `var(--stroke-focus)` / `var(--border-default)` 또는 `borderWidth` import 를 썼다면 `var(--stroke-thin)` / `var(--stroke-bold)` / `stroke` 로 교체하세요.

> 참고: 토큰에 매핑되지 않는 3px 강조선(Article 좌측 brand 바, Header 활성 메뉴 인디케이터, 일부 액티브 underline)은 컴포넌트 슬롯 리터럴로 유지했습니다.
