---
metrics:
  maxBrandBgPerScreen: 1
  maxEmphasisDevicesPerNotice: 2
  layers: L0 surface-default / L1 page-default / L2 surface-subtle | section-default / L3 brand-subtle | status-*
  decisionRule: 의미 전달 + 화면 내 brand bg 없음 + decoration 아님 — 셋 모두 YES
---

## summary

Surface / Background 의 4단계 레이어 정의와 Brand background 사용 원칙. Brand background 는 시각 장식이 아니라 '의미 전달'(주의·안내·강조) 목적으로만 사용한다. notice 패턴과 짝.

## rules

- Layer 정의 (낮은 → 높은 위계):
    · L0 기본 surface → `--semantic-bg-surface-default` (#FFFFFF) — 기본 카드/박스 (Card, Info Box)
    · L1 페이지 배경 → `--semantic-bg-page-default` (≈#F8F9FB) — body, 페이지 전체 배경
    · L2 Subtle BG → `--semantic-bg-surface-subtle` / `--semantic-bg-section-default` — 비활성 영역, 표 헤더, 섹션 분리
    · L3 Notice (의미 전달) → `--semantic-bg-brand-subtle` 또는 `--semantic-bg-status-*` — 핵심 Notice, 상태성 안내
- Brand background (`--semantic-bg-brand-*`) 는 다음 모두를 만족할 때만 사용:
    1) 사용자에게 주의 / 안내 / 하이라이트 의미 전달이 필요한가?
    2) 현재 화면에 이미 사용 중인 brand background 가 없는가?
    3) 단순 decoration 목적이 아닌가?
    → 셋 모두 YES 일 때만. 하나라도 NO 면 `--semantic-bg-surface-default` 로 처리.
- 한 화면당 brand background 최대 1개. 같은 영역에 brand bg + brand chip + brand icon 을 동시에 쌓지 않는다 (tone-on-tone).
- 상태 의미가 명확할 때만 status 배경(`--semantic-bg-status-error|success|caution|info`) 사용. 일반 안내문은 neutral 우선.
- 섹션 구분은 spacing / border / text 위계로 먼저 해결. 색 배경으로만 영역을 구분하지 않는다.

## avoid

- KPI 카드 / summary 카드 / 일반 정보 카드에 brand background 사용
- section 구분을 색상으로만 해결 (spacing 없이 색만)
- 한 화면에서 카드마다 다른 pastel background 를 깔아 모든 영역이 강조되어 보이는 구성
- decorative 목적의 색 배경 (의미 전달 없는 단순 시각 분리)
- Brand bg 위에 다시 brand chip / brand icon / brand button 을 중첩 (tone-on-tone)
- 안내문에 gradient + icon + badge + bold headline 을 동시에 적용
