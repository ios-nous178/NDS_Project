---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3782-20558
metrics:
  badgeRoundedRadius: 5
  badgePillRadius: full
  badgeFont: Caption 12/16 Medium
  tones: brand · info · success · neutral · error
  relatedPatterns: cashwalk-biz-tab, cashwalk-biz-input, cashwalk-biz-page-list
---

## summary

캐시워크 포 비즈니스 admin 의 Label & Chip 카탈로그 — Badge(Rounded Square / Pill) + SelectChip + ActionChip. 톤은 semantic 색으로 cascade.

## rules

- **Badge — Rounded Square (radius 5)** = 거래/처리 동적 상태·카테고리(충전·사용·적립·만료·취소…). 데이터 테이블·리스트 셀에서 가장 빈번. 마크업: `<nds-badge variant="ghost" color="...">충전</nds-badge>`. 톤=의미별 semantic 색: 충전/강조=brand, 사용/안내=info, 적립/완료=success, 만료/중립=neutral, 취소/실패=error.
- **Badge — Pill (radius full)** = 계정 유형·식별 정적 태그(일반 계정·프리미엄·신규…). 헤더/타이틀 옆 식별 표식. 마크업: `<nds-badge variant="ghost" color="..." style="--nds-badge-radius:999px">프리미엄</nds-badge>`. 동적 상태값에는 Pill 쓰지 말 것(Rounded Square 사용).
- Badge 치수(radius 5 · padding 4/10 · Caption 12/16 · Medium 500)는 캐포비 브랜드 토큰(`--nds-badge-*`)으로 cascade. `variant="ghost"` + semantic `color` 만 지정하면 연한 bg + 컬러 텍스트(soft 톤)가 자동 적용된다.
- **SelectChip** = 선택형 칩(다중 선택 그룹, 예: 연령대 선택). DS `Chip` 의 `selected` 상태로 구현 — HTML: `<nds-chip selected>30대</nds-chip>` / `<nds-chip>30대</nds-chip>`. **출시 기본**: Selected=브랜드 채움(solid fill, FILL_COLORS) + Bold, Default=#FAFAFA bg + #EEE border + Medium. 캐포비(cashwalk-biz)는 노랑 채움 위 가독성을 위해 selected 텍스트·체크를 **검정**으로 override 함(`--nds-chip-selected-text`). 좌측 ✓ 체크는 React `icon` prop / HTML `slot="icon"`(`<nds-chip selected><svg slot="icon">…</svg>30대</nds-chip>`). 'brand-subtle bg' 룩이 필요하면 hex 박지 말고 `--nds-chip-selected-background/text/border` override. 채움만으로도 선택 표시는 충분.
- **ActionChip** = TextField helper text 영역 옆 보조 액션(예시 이미지·수정·다운로드). radius 6 / bg #ECECEC / icon 14 + 12 Medium. inline 배치(별도 row 아님). 상세는 `pattern:cashwalk-biz-input`.

## avoid

- Badge 에 hex 인라인(예: background:#FFD400) 금지 — semantic color 토큰을 잃는다. `color` prop 으로 의미 톤 지정.
- 동적 상태(충전·사용 등)에 Pill, 정적 식별(프리미엄·신규)에 Rounded Square — 혼용 주의(가이드 명시).
- Badge(비액션 상태/속성)와 Chip(선택/필터 액션) 혼용 금지.
- Badge 라벨은 8자 안팎 — 긴 문장·CTA 금지.
