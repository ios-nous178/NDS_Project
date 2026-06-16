# @nudge-design/mockup-core

## 0.0.4

### Patch Changes

- 1c52a0e: 수집/로깅을 Supabase 단일 ingest 로 이전 + 목업 라운드·토큰 다이어트.
  - 텔레메트리(Tier2)·옵저버빌리티(Tier3)·사용량(usage) 전송이 전부 Supabase Edge Function `ingest` 한 곳으로 모입니다 (이전: 로컬 127.0.0.1 수집 서버 + Google Sheets webhook — 외부 머신에서 무증상 유실되던 경로 폐기). 원격 적재는 메타데이터만 — PRD/HTML 원문은 로컬에만 남고, 서버가 2차로 원문 필드를 drop 합니다.
  - `validate_html_mockup` 이 위반 0건 통과 시 DS 채택률 stats 를 자동 동봉합니다 — 별도 `withStats` 호출 라운드가 사라집니다.
  - `find_icon({ category })` 에 `offset` 페이징 추가.
  - 구버전 장문 CLAUDE.md 를 감지하면 슬림 템플릿 갱신을 안내합니다.

  (react 는 코드 변경 없음 — MCPB 외부 전파 트리거용 patch bump)

- Updated dependencies [f4b8b47]
- Updated dependencies [82113f1]
- Updated dependencies [936ff60]
- Updated dependencies [154ab29]
- Updated dependencies [3e8ac4c]
- Updated dependencies [6cf1c11]
- Updated dependencies [b192881]
- Updated dependencies [ee19f9a]
- Updated dependencies [eb0ea32]
- Updated dependencies [869e02a]
- Updated dependencies [1fba74b]
- Updated dependencies [4b74d9c]
- Updated dependencies [71111ac]
- Updated dependencies [001e5e8]
- Updated dependencies [9bdf86f]
- Updated dependencies [88807ea]
- Updated dependencies [9e3a6ad]
- Updated dependencies [27351df]
- Updated dependencies [7f8c3d0]
- Updated dependencies [9fd3a10]
- Updated dependencies [45f4f23]
- Updated dependencies [41bdf61]
- Updated dependencies [665ca93]
- Updated dependencies [912e3ce]
- Updated dependencies [135c86a]
- Updated dependencies [942bf66]
- Updated dependencies [051a2b4]
- Updated dependencies [375be74]
- Updated dependencies [e23b5d1]
- Updated dependencies [37cdb34]
- Updated dependencies [3b73446]
- Updated dependencies [f29c898]
- Updated dependencies [c941e74]
- Updated dependencies [36b178c]
- Updated dependencies [9e3a6ad]
- Updated dependencies [268ebe4]
- Updated dependencies [eab0abc]
- Updated dependencies [6cf1c11]
- Updated dependencies [60db43c]
- Updated dependencies [f09304a]
- Updated dependencies [f91ad95]
- Updated dependencies [2b51ea7]
- Updated dependencies [8e3c764]
- Updated dependencies [bdfea38]
- Updated dependencies [71111ac]
- Updated dependencies [1a8ada6]
- Updated dependencies [31e9245]
- Updated dependencies [206ed62]
- Updated dependencies [2b51ea7]
- Updated dependencies [4ee00ac]
- Updated dependencies [6cf02a3]
- Updated dependencies [f4b75e1]
- Updated dependencies [46d4d87]
- Updated dependencies [2d6463a]
- Updated dependencies [6cf1c11]
- Updated dependencies [1c52a0e]
- Updated dependencies [c995f79]
- Updated dependencies [479bc02]
- Updated dependencies [a5f7eda]
- Updated dependencies [27a44be]
- Updated dependencies [7405016]
- Updated dependencies [2effb30]
- Updated dependencies [1578e14]
- Updated dependencies [e94bac4]
  - @nudge-design/react@0.0.4
  - @nudge-design/html@0.0.4
  - @nudge-design/assets@0.0.2
  - @nudge-design/tokens@0.0.4

## 0.0.3

### Patch Changes

- Updated dependencies [8429b13]
- Updated dependencies [5771516]
- Updated dependencies [b68ed61]
- Updated dependencies [e69fcf9]
- Updated dependencies [a2ff1a0]
- Updated dependencies [73eca2e]
- Updated dependencies [e7a2978]
- Updated dependencies [07ce830]
- Updated dependencies [5771516]
- Updated dependencies [7a04a69]
- Updated dependencies [7a04a69]
- Updated dependencies [5771516]
- Updated dependencies [e7a2978]
- Updated dependencies [5771516]
- Updated dependencies [5771516]
- Updated dependencies [d6e2deb]
- Updated dependencies [9530a80]
- Updated dependencies [67741ea]
- Updated dependencies [72d2018]
- Updated dependencies [c0efbfa]
- Updated dependencies [d6e2deb]
  - @nudge-design/html@0.0.3
  - @nudge-design/react@0.0.3
  - @nudge-design/tokens@0.0.3
  - @nudge-design/assets@0.0.3

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
