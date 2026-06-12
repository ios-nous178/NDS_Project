---
examples:
  - verdict: good
    source: Figma 39:6004 PC_상담신청서
    caption: "WebHeader 80 → 28 Bold 타이틀 → 800px rail → 라벨-위 + soft #FAFAFA 필드 h-48 rounded-8 → 비밀유지 타일 → 센터 inline CTA w-328 h-48 rounded-8 #2b96ed."
metrics:
  viewport: desktop 1920px, content rail 800px center
  webHeaderHeight: 80px
  pageTitle: "Pretendard Bold 28/38 #111"
  labelLayout: label-above (single column 800px)
  labelTypography: "Pretendard Medium 16/24 #383838"
  requiredMarker: "라벨 옆 ' *' #F13F00"
  fieldHeight: 48px
  fieldRadius: 8px
  fieldBorder: "1px #D8D8D8"
  fieldBg: "#FAFAFA (soft off-white)"
  fieldPadding: 16×14
  interFieldGap: 36px
  labelToFieldGap: 12px
  helperToLabelGap: 4px
  helperTypography: "Pretendard Regular 13/18 #383838 or 14/20 #666"
  ctaPosition: inline at page-end, center
  ctaSize: w-328 h-48 rounded-8
  ctaPrimary: "#2b96ed + white Bold 16/24"
  ctaDisabled: "#9CA2AE + white"
  confidentialityTile: "bg #FAFAFA rounded-8 p-16 w-800 + InfoIcon + Medium 14/20 #666"
  moodSliderColors: "selected #2b96ed, unselected #13BFA2, gap 2px"
  maxPrimarySolidPerScreen: 1
  validationTiming: onBlur or submit
  relatedPatterns: cta-group, nudge-eap-home-layout
figmaNodeUrl: https://www.figma.com/design/mvecozaRQoGRePffskRgmh/%F0%9F%8C%88-%EB%84%9B%EC%A7%80EAP---Dev?node-id=39-6004
references:
  - label: NudgeEAP 고객 폼 SSOT — PC_상담신청서 (Figma 39:6004)
    image: references/nudge-eap-form-39-6004.png
    caption: NudgeEAP 고객사용 폼 페이지 SSOT 스크린샷 (desktop 1920, rail 800). 본 가이드 metrics 는 이 노드 실측 기준.
    brand: nudge-eap
---

## summary

NudgeEAP 고객사용(B2B EAP customer) 폼 페이지 레이아웃 — 'WebHeader 80 + 800px rail → 28 Bold PageTitle → 라벨-위 단일 컬럼 → soft #FAFAFA 필드 h-48 rounded-8 → 비밀유지 안내 타일 → inline 센터 CTA w-328 rounded-8 #2b96ed' 표준. Figma 39:6004 (PC_상담신청서) 실측. **데스크탑 전용** — 모바일은 별도.

## rules

- **뷰포트**: 데스크탑 1920px, 본문 rail **800px** 센터. 모바일 폼은 이 가이드 적용 X (별도 시안 필요).
- **WebHeader**: 80h 풀폭 white + bottom border `#ECECEC`. 좌측 로고 + 센터 6 nav (`Bold 18/26 #111`) + 우측 [로그인 #2b96ed]/[앱 다운로드 #F5F5F5 + blue 텍스트].
- **페이지 헤더**: 타이틀 Pretendard **Bold 28/38** (Headline 2) #111. step/progress indicator 없음.
- **필드 레이아웃 = 라벨-위 (label-above) 단일 컬럼** — 캐시워크 포 비즈니스 admin (인라인-좌측) 과 정반대. 800px rail 안 세로 흐름.
- **라벨 타이포**: Pretendard **Medium 16/24 #383838**. 필수 마커: 별표 `*` **`#F13F00`** (Coral Red) 라벨 뒤 인라인.
- **필드 컴포넌트**: 높이 **48px**, `radius 8px`, border 1px `#D8D8D8`, **bg `#FAFAFA`** (soft off-white — 멘탈케어 톤. 캐시워크 포 비즈니스 pure white 와 차이). padding 16×14.
- **그룹 간격**: 그룹↔그룹 **36px**, 라벨↔필드 **12px**, helper↔라벨 **4px**.
- **Helper 텍스트**: Pretendard Regular **13/18 #383838** 또는 14/20 #666.
- **CTA**: 페이지 끝 inline + 센터. 단일 primary 버튼 (`신청서 제출하기`) **w-328 h-48 rounded-8 padding 12**, Bold 16/24 white. 활성 `#2b96ed`, disabled `#9CA2AE` + 흰.
- **비밀유지 안내 타일**: CTA 위 형제로 — bg `#FAFAFA`, `rounded-8 p-16 w-800`, InfoIcon + Medium 14/20 #666. 멘탈케어 폼의 시그니처 (e.g. '기관에서 연락드린 후 상담사가 최종 확정됩니다. 상담 신청 내용은 비밀이 보장되며, 회사에는 전달되지 않습니다.').
- **Mood slider (마음체크)**: 5점 horizontal color bar — 선택 `#2b96ed`, 미선택 `#13BFA2` (green/300), 셀 gap 2px, 양끝 라벨 Medium 14.
- **시간대/옵션 chip**: 동일 폭 inline 라디오 — white + border #D8D8D8 + rounded-8 + padding 16×12 + gap 12 + Medium 16 #666. RadioGroup 아닌 segmented selector 패턴.
- **약관 동의 타일**: 폼 끝 직전 full-width rounded-8 row, 라운드 체크박스 + Regular **14/20 #111** (다른 라벨 16 스케일과 차별).
- **플로팅 UI**: 우측 하단 scroll-to-top 56×56 circle shadow `0 1px 10px rgba(0,0,0,0.1)` + 채널톡 (`left-calc(100%-320px)`).
- **유효성 검사**: onBlur/submit (실시간 빨간 메시지 금지 — 멘탈케어 컨텍스트 거부감).

## avoid

- 라벨을 인라인-좌측 컬럼으로 정렬 — NudgeEAP 고객 폼은 label-above. (캐시워크 포 비즈니스 admin 패턴 혼동 적용 X).
- 필드 bg pure white — 멘탈케어 컨텍스트는 soft off-white(`#FAFAFA`) 시그니처.
- 필수 마커를 `#FF4141` 로 — NudgeEAP 는 `#F13F00` Coral Red.
- 비밀유지 안내 누락 — 검사/상담 폼은 신뢰 확보 타일이 거의 필수.
- CTA 알약 (rounded-28+) — NudgeEAP 폼 CTA 는 rounded-8 정사각형.
- Brand 블루 #2b96ed 를 disabled 톤으로 — disabled 는 cool-gray #9CA2AE.
- Mood slider 를 라디오 5개로 — NudgeEAP 는 horizontal color-bar.
- 모바일 변형에 800px rail 적용 — 모바일 시안 확보 후 별도.
