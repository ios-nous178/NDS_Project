---
"@nudge-design/tokens": patch
---

지니어트 타이포·엘리베이션·스페이싱 갱신 — Figma Library 가이드 정합

- **Typography (3013:2)**: 14-step 스케일(Display 1~3 + Headline 1~5 + Body 1~3 + Caption 1~2 + Label)로 정렬. 구버전 Title/Subtitle best-fit 매핑(headline1=22 등) 폐기 → base 표준 램프와 동일(headline1=36/48). Display 티어(52/48/40) 신규 노출.
- **Elevation (3031:6)**: 4-level E0~E3 — subtle `0 2px 6px rgba(221,221,221,.6)` / default `0 3px 15px rgba(0,0,0,.1)` / overlay `0 12px 32px rgba(0,0,0,.16)`. 토스트는 E1 Subtle.
- **Spacing (3034:2)**: Gap(default 10→8, section 40 신규) · Inset(chip 8→6, button 14·section 32 신규) 시멘틱 토큰을 가이드 값으로 override.
