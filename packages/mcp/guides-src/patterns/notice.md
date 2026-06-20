---
metrics:
  maxColoredNoticePerScreen: 1
  maxEmphasisDevicesPerNotice: 2
  variantCount: 5
  maxDistinctVariantsPerScreen: 3
  maxSameVariantPerScreen: 2
  sizeOneLinePx: 52
  sizeTwoLinePx: 72
  containerPaddingPx: 16
  containerGapPx: 8
  containerRadiusPx: 8
  maxWidthPx: 800
  iconSizePx: 20
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=984-6787
references:
  - label: Cashpobi Alert 디자인 가이드
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=984-6787
    caption: 캐포비 라이브러리의 인라인 알림 박스 가이드 — 5 variant(info/Notice/Caution/Success/Error)·2 size(52/72)·anatomy·Usage 경계·DO/Don't. 이 DS에서는 notice 패턴으로 흡수.
    project: cashwalk-biz
---

## summary

안내문/콜아웃/인라인 알림 박스의 강조 예산 + variant·size·구성 규칙. 컨텐츠 영역에 인라인으로 놓여 명시적으로 닫을 때까지 유지되는 메시지(정보·공지·주의·완료·오류). 페이지 상단 전역 띠는 Banner, 자동 사라지는 피드백은 Toast/Snackbar, 즉각 판단 요구는 Modal — 인라인 지속 메시지만 이 패턴. **구현체 = NoticeAlert 컴포넌트** (`<NoticeAlert>` / `<nds-notice-alert>`, get_guide({ topic:'component:NoticeAlert' })).

## rules

- 안내문은 기본적으로 neutral surface와 본문 텍스트로 처리.
- 주의/성공/오류처럼 의미가 명확한 경우에만 semantic color 사용.
- 한 안내 영역에는 색 배경, 아이콘, Chip/Badge, 굵은 제목 중 최대 2개만 사용.
- 그라데이션은 금지. 캠페인/히어로가 아닌 안내문에는 단색 토큰만 사용.
- 새로 생긴 섹션이라는 이유만으로 배경색/아이콘/배지를 추가하지 않음.
- variant 5종 중 의미에 맞게 1개 선택 — info(중립 회색·기본 톤) / Notice(블루·차분한 공지) / Caution(옐로우·강조 주의) / Success(그린·완료·성공) / Error(레드·오류·조치 필요).
- 구성요소 3개 — ① Container: padding 16 · gap 8 · radius 8 · 가로 max 800 ② Icon 20×20: variant별 의미 강화 ③ Body: Body3 Medium · Text/Subtitle/Default.
- size 2종 — 1줄 52px / 2줄 72px. 텍스트 길이에 따라 박스 높이 자동 조정. 성공·오류는 1줄(52), 정보·주의는 2줄(72) 권장.
- 본문은 1-2줄로 짧고 명확하게. 색은 임의 hex 금지 — semantic token(semantic-info-bg / semantic-info-text 등)으로 binding.
- 색 배경 강조 박스는 화면당 1개 권장(DS 원칙). 부득이 혼용하더라도 서로 다른 variant 3종·같은 variant 2개를 넘기지 않는다.

## avoid

- gradient + icon + badge + bold headline 동시 사용
- 일반 안내문에 Chip으로 '안내', '추천', '확인' 라벨 반복
- 안내 박스 안에 다시 강조 카드/강조 배지를 중첩
- 한 화면에 4종 이상 variant 동시 표시
- Error variant를 단순 정보 안내에 사용
- 본문 3줄 이상을 인라인 메시지에 담기 — Modal로 분리
- 임의 색상 직접 지정 — semantic token 미사용
