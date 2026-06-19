---
"@nudge-design/assets": minor
---

런마일 — 로고 white variant 추가 + 이미지 에셋 가이드 5분류 재정비

- **로고**: 런마일 로고에 `white` variant 추가 (어두운/컬러 배경용). 이제 red(default)·black(mono)·gray700(muted)·white 4색 — 로고 가이드(Figma 5089:16)와 일치. `getBrandLogo("runmile", "white")` / `<nds-brand-logo>` 에서 사용.
- **이미지 5분류 재정비**: 이미지 네이밍 가이드(Figma 5030:979)의 용도중심 5분류에 맞춰 런마일 에셋 폴더를 재구성 — `profiles → avatar`, `illustrations → illust`(콘텐츠) + `state`(빈상태·에러·알람), `marathon-events → illust`(`event-*` 흡수). 디자이너 신규/업그레이드 이미지(@2x/@3x 포함) 임포트, 기본 아바타(`profile-default`) 추가.
- **신규 API**: 상태 이미지용 `getStateImage` / `StateImageId` (`@nudge-design/assets/state-images`). `getProfileImage` 에 `"default"` id 추가.

> ⚠ **Breaking (런마일 한정, alpha)**: 런마일 raw 자산 경로가 바뀝니다 — `brand/runmile/{illustrations,profiles,marathon-events}/*` → `brand/runmile/{illust,avatar,state}/*`. 일부 id 교정(`qa → qna`, `alram → alarm-empty`, 마라톤 `dangdangi-race/gaenari-run/pokemon-run → event-dog-race/forsythia/pokemon`, 그 외 행사 `event-*` prefix). 프로필 1·2 는 jpg → png. `getIllustration` 은 이제 콘텐츠 일러스트만 반환(상태 이미지는 `getStateImage` 로 이동). find_asset 카탈로그 category 도 `avatar/illust/state` 로 갱신(MCP 가이드·한글 태그 lockstep).
