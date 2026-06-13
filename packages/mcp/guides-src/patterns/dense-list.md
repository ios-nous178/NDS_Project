---
metrics:
  maxPrimaryFactsPerCard: 3
  maxSecondaryFactsPerCard: 5
  maxCtaPerRepeatedCard: 1
---

## summary

정보가 과밀한 리스트/카드 영역의 배치 원칙.

## rules

- 반복 아이템의 상태, 날짜, 금액, 진행률 위치를 고정해 스캔 경로를 만든다.
- 카드 하나에 주요 정보 3개, 보조 정보 5개를 넘기지 않는다.
- 상세 설명은 기본 노출보다 Accordion/상세 페이지/Text(expandable)로 분리.
- 모바일에서는 표보다 카드형, 필터는 가로 스크롤 또는 접힘 영역을 우선.
- 반복 카드마다 CTA를 2개 이상 두지 않는다.

## avoid

- 카드마다 Chip, 색 배경, 아이콘 CTA를 모두 반복
- 상태/날짜/CTA 위치가 카드마다 달라지는 배치
- 모든 정보를 첫 화면에 펼쳐 설명하는 구성
