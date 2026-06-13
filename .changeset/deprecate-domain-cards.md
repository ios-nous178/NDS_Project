---
"@nudge-design/react": patch
"@nudge-design/mcp": patch
---

도메인 카드 4종 정리 — Card 합성 철학 정렬 (비파괴, deprecate→migrate)

- **UserCard · CounselorCard**: `@deprecated` — 순수 슬롯 배치라 `Card` 합성(프로필 카드 조합)으로 대체됩니다. 가이드에 마이그레이션 매핑 추가. export 는 1 minor 유지(신규 사용만 차단).
- **AppointmentCard**: `@deprecated` — 날짜 파생·status/mode 상태머신 같은 앱 로직 포함(DS 편입 기준 위반). 앱 레이어 컴포넌트로 이관 권장, 시각 표현은 Card 합성.
- **OrderSummaryCard**: de-domain — 도메인 무관 범용 요약 카드(라벨:값+합계)로 재분류. 코드/API 무변경, 카탈로그 category 만 `도메인 → 데이터`.

기존 사용처가 깨지지 않도록 제거가 아닌 deprecate. 실제 제거는 다음 major.
