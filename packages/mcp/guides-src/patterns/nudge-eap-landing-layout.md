---
examples:
  - verdict: good
    source: Figma 323:939 NudgeEAP 랜딩 (PC_법정의무교육)
    caption: 1920/1400 rail + 80h header + 1920×480 split hero (no CTA) + 8 stacked sections gap=0 + 80h pill CTA + 510h dark footer + lead form 섹션.
metrics:
  viewport: desktop 1920px
  contentRailOuter: 1400px (gutter 260)
  contentRailInner: 1264px (gutter 328)
  webHeaderHeight: 80px
  heroSize: "1920×480 (split: text 520w + visual 800×400)"
  heroHeadline: ~60-62 Bold (Display)
  heroCta: none
  sectionGap: 0 (butt against, bg alternation)
  sectionTitleSymbol: 타이틀_pc 1400×74 (~40-44 Bold)
  cmsGrid: 2×2 card 620×455 col-gap 24
  eduGrid: 4-col card 300×350 icon 110 gap 16
  compareGrid: 3-col card 270×302 icon 120 gap 24
  stepGrid: 2×2 card 612×405 step-badge 72×44 col-gap 40 row-gap 64
  ctaPillHeight: 80px
  ctaPillRadius: rounded-full
  ctaLabel: ~20-22 Bold (emoji prefix allowed)
  footerHeight: 1920×510 (dark corporate)
  tone: corporate B2B HR SaaS
  leadFormReusesPattern: nudge-eap-form-layout
  maxPrimarySolidPerScreen: 여러 (섹션별 반복 OK, 의도 통일)
  relatedPatterns: nudge-eap-home-layout, nudge-eap-form-layout, cta-group
figmaNodeUrl: https://www.figma.com/design/mvecozaRQoGRePffskRgmh/%F0%9F%8C%88-%EB%84%9B%EC%A7%80EAP---Dev?node-id=323-939
references:
  - label: NudgeEAP 랜딩 SSOT — PC_법정의무교육 (Figma 323:939)
    image: references/nudge-eap-landing-323-939.png
    caption: NudgeEAP 홍보/랜딩 페이지 SSOT 스크린샷 (B2B 도입 유치, 1920/1400 rail, 80h pill CTA, 8 stacked sections).
    project: nudge-eap
---

## summary

NudgeEAP 홍보용 (B2B 도입 유치) 랜딩 페이지 레이아웃 — 'WebHeader 80 + 1400 rail → 1920×480 split 히어로 (CTA 없음) → 8 섹션 (gap 0, bg 교차) → 80h pill CTA → 510h dark footer + lead form' 표준. Figma 323:939 (PC_법정의무교육) 실측. 데스크탑 전용, 코퍼레이트 B2B HR SaaS 톤.

## rules

- **뷰포트**: 데스크탑 1920px. outer rail **1400 (gutter 260)**, inner **1264 (gutter 328)**.
- **WebHeader**: 80h 풀폭 pinned. 디테일은 nudge-eap-home-layout 헤더 컨벤션 재사용.
- **히어로**: 1920×**480** 풀폭. **Split layout** — 텍스트 좌 (`left-260 top-216 w-520 h-208`) + 비주얼 우 (`left-920 800×400`). 헤드라인 ~60-62 Bold + 서브 ~28-32. **히어로 내 CTA 없음**.
- **섹션 블럭 패턴**: 8 섹션 모두 풀폭 stack. **gap 0** (butt against), 구분은 bg color 교차. 안 패딩: top 100 → 타이틀 74h → 122-138 gap → body → 100 bottom.
- **섹션 타이틀 심볼**: 1400×74 (`타이틀_pc`), 디스플레이 ~40-44 Bold.
- **카드 그리드**:
    · CMS 기능 (2×2): 620×455 (image 620×303 + 텍스트 620×152, padding 25×24) col-gap 24
    · 법정의무교육 4종 (4-col): 300×350, 아이콘 110×110 center top, gap 16
    · EAP/웰니스 비교 (3-col): 270×302, 아이콘 120×120, gap 24
    · 4단계 진행 (2×2): 612×405 + step badge `1단계` 72×44 pill, col-gap 40 row-gap 64
- **CTA 패턴**: 모든 CTA 는 **80h pill** (rounded-full), label hug + 54 horizontal padding. emoji prefix 허용 (⬇️ 👉) + 라벨 ~20-22 Bold. **히어로엔 없고 섹션 끝에만**.
- **중복 CTA OK**: 코퍼레이트 랜딩이라 같은 의도 CTA 가 섹션별로 반복 가능. 단, primary action 한 종류로 통일.
- **비교 표 (기존 vs 넛지EAP)**: 가로 비교 컬럼 + 체크/X 아이콘.
- **Lead form (도입 문의)**: 8번째 섹션 — 회사명/담당자/연락처/EAP 도입 여부 라디오. nudge-eap-form-layout 인풋 컨벤션 재사용 (label-above + #FAFAFA fill).
- **Footer**: 1920×**510** (dark corporate). 회사 정보/링크/문의/언어. home-layout 의 198h 라이트 footer 보다 키워 코퍼레이트 톤.
- **타이포 패밀리**: hero ~60-62, section title ~40-44, sub ~24-28, card title ~24, body ~16/1.6, CTA ~20-22 Bold.
- **톤**: 코퍼레이트 B2B HR SaaS — 정보 밀도 높음, 비교/스크린샷/단계별 중심. 'cream + soft' 톤은 아이콘/일러스트 한정.

## avoid

- 히어로 안에 primary CTA — NudgeEAP 랜딩은 hero CTA 없음.
- 섹션 간 gap 24/32/40 px — gap 0 butting + bg 교차가 표준.
- CTA 를 8h rounded-8 사각형 — 모든 CTA 가 80h pill.
- 랜딩에 멘탈케어 soft 톤 (cream #FFEDD0) 을 헤드라인 배경으로 — soft 톤은 카드/아이콘 한정.
- 단일 contact form 만 두고 섹션 CTA 누락 — 랜딩은 결과별 CTA 다회 노출.
- Lead form 을 별도 페이지로 분리 — 동일 페이지 마지막 섹션에 inline.
- Footer 를 200h 미만 라이트로 — 코퍼레이트 랜딩은 dark/dense.
