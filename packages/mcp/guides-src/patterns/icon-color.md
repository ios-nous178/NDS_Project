---
metrics:
  standaloneIconColor: required
  preferredColor: var(--semantic-icon-*) — strong/normal/disabled/inverse/brand/status
  maxSemanticIconColorsPerSection: 1
---

## summary

아이콘 컬러 매핑 기준. Figma Iconography(379:490)의 Color Usage 표와 `--semantic-icon-*` 시맨틱 토큰을 단일 진실 소스로 사용. 사이즈/스타일/터치 영역 기준은 get_guide({ topic: 'pattern:iconography' })를 함께 확인.

## rules

- 아이콘 컴포넌트의 기본값은 currentColor다. 단독 배치 시 부모 color가 명시되어 있지 않으면 본문색/검정으로 보여 어색할 수 있다.
- Button, IconButton, Chip, Select 등 DS 컴포넌트 슬롯 안의 아이콘은 컴포넌트가 정한 텍스트 컬러를 상속하게 두는 것이 기본이다.
- 안내/상태/빈 상태/카드 장식처럼 단독으로 배치한 아이콘은 `color` prop 또는 부모 `style.color`를 `var(--semantic-icon-*)` 토큰으로 명시한다.
- 용도별 토큰 매핑(Figma Color Usage 표):
    · 본문 옆 강조 → `--semantic-icon-strong-default`
    · 보조 정보·메타 → `--semantic-icon-normal-default`
    · 비활성 → `--semantic-icon-disabled-default`
    · 어두운 배경 위 → `--semantic-icon-inverse-default`
    · 브랜드 강조 → `--semantic-icon-brand-default`
- 상태 의미가 있을 때만 status 토큰을 사용한다:
    · 성공 → `--semantic-icon-status-success` (Teal/500 · #13BFA2)
    · 오류 → `--semantic-icon-status-error` (Orange Red/500 · #F13F00)
    · 주의 → `--semantic-icon-status-caution` (Golden Yellow/500 · #FFC303)
- TestresultSafe/Warning/Danger, Siren 같은 '컬러 아이콘'(다색 일러스트성)은 시맨틱 토큰을 덧씌우지 않는다. 그대로 사용한다.
- 아이콘만 별도 강한 색으로 튀게 하지 않는다. 강조가 필요하면 텍스트, 배경, 아이콘 중 1-2개만 함께 조합한다.

## avoid

- <InfoIcon />처럼 단독 아이콘을 색 지정 없이 배치
- 안내 박스 안에서 아이콘만 브랜드 primary로 과하게 강조
- 아이콘에 hex/rgb 직접 지정 — `--semantic-icon-*` 토큰만 사용
- 구식 `--semantic-icon-*` 토큰 사용 — `--semantic-icon-*`로 대체
- 한 섹션 안에서 아이콘마다 다른 semantic color를 섞는 구성
- 컬러(다색) 아이콘에 color prop을 강제로 덮어쓰는 사용
