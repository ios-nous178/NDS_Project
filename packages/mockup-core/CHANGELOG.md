# @nudge-design/mockup-core

## 0.0.2

### Patch Changes

- 501ff41: 캐포비 Figma "Neutral" tone 을 DS `neutral` 로 재매핑 + Weak/Outlined Neutral 색 정합 (Figma ButtonGuide 3098:1032).
  - **재매핑**: 기존엔 Figma "Neutral"(검정 #111 CTA)을 DS `secondary` 에 욱여넣었음(hack). 이제 **`color="neutral"` 이 캐포비 Neutral tone** — Figma 와 이름 일치.
    - Solid/Neutral = `neutral`+`solid` → bg #111/#333/#DDD · 흰 텍스트
    - Weak/Neutral = `neutral`+`soft` → bg #F5F5F5/#EEE/#FAFAFA · 텍스트 #111/#BBB
    - Outlined/Neutral = `neutral`+`outlined` → border #E7E7E7 · 텍스트 #111 · disabled #BBB
  - 캐포비 semantic 에 `buttonBg.neutral`·`buttonText.neutral`/`neutralDisabled` 추가(buttonBorder.neutral 은 기존 #E7E7E7).
  - **styleMap `neutral.soft`** 를 "연한 회색 fill + 진한 텍스트"(surface.section + textRole.strong)로 변경 — 전 브랜드 weak/neutral 에 적용(Weak/Neutral 패턴 정합). **react↔html `neutral.solid` drift 도 reconcile**(html 을 react 의 `cv.button.bgNeutral` 로 통일).
  - `secondary` tone 은 캐포비에서 옵션(Figma 미정의) — 하위호환용 검정값만 유지. 신규는 `color="neutral"`.
  - validator `neutral-solid-cta` 룰에 **캐포비 예외** 추가 — cashwalk-biz 는 neutral solid 가 #111 검정 CTA 라 정당(다른 브랜드는 cool-gray 라 경고 유지).
  - **버그 수정 — neutral solid 글자색**: 기존엔 solid neutral 텍스트가 brand 별 fill 명도와 안 맞아 밝은 fill 브랜드(geniet #ECECEC / runmile #F2F4F6)에서 흰 글자가 안 보였음. 전용 `--semantic-button-text-neutral-solid` 토큰 신설(fill 명도 대비: 어두운 fill=흰 / 밝은 fill=어두운 글자) + styleMap neutral.solid 텍스트를 이걸로 전환. cashpobi #111→흰, geniet→#666, runmile→#4E5968.
  - **"캐포비 secondary 없음" 가드 3중**: (1) React Button `BRAND_TONE_DENYLIST` dev console.warn, (2) validator 하드게이트 룰 `cashwalk-biz-no-secondary`, (3) MCP Button 가이드 pitfall. 캐포비 검정/회색 CTA 는 `color="neutral"`.

- Updated dependencies [b887f41]
- Updated dependencies [d10a40f]
- Updated dependencies [b887f41]
- Updated dependencies [501ff41]
- Updated dependencies [eb9e899]
- Updated dependencies [b887f41]
- Updated dependencies [501ff41]
- Updated dependencies [26df7ba]
- Updated dependencies [6cd3190]
- Updated dependencies [26ba4d9]
- Updated dependencies [501ff41]
- Updated dependencies [5973f82]
- Updated dependencies [da7e96c]
- Updated dependencies [da1de6a]
- Updated dependencies [8077540]
- Updated dependencies [26df7ba]
- Updated dependencies [501ff41]
- Updated dependencies [25007ae]
- Updated dependencies [b887f41]
- Updated dependencies [4263d5a]
- Updated dependencies [b887f41]
- Updated dependencies [2a4e6de]
- Updated dependencies [d77e956]
- Updated dependencies [fe39b07]
- Updated dependencies [8974351]
- Updated dependencies [2a4e6de]
- Updated dependencies [26df7ba]
- Updated dependencies [fe39b07]
- Updated dependencies [b887f41]
- Updated dependencies [d86906c]
- Updated dependencies [2a4e6de]
- Updated dependencies [6834bfd]
- Updated dependencies [b887f41]
- Updated dependencies [501ff41]
  - @nudge-design/react@0.0.2
  - @nudge-design/html@0.0.2
  - @nudge-design/tokens@0.0.2
