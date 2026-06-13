---
"@nudge-design/react": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

도메인 카드 3종 제거 (BREAKING) + 2종 재분류

- **제거**: `UserCard`, `CounselorCard`, `AppointmentCard` — react/html export·styles·가이드·스토리·docs·카탈로그 전부 삭제.
  - UserCard·CounselorCard: 순수 슬롯 배치라 `Card` 합성으로 대체하세요. UserCard = `Card.Avatar`+`Card.Title`+`Card.Subtitle`+`Card.Description`+`Card.Metadata`+`Card.Cta`. CounselorCard = `Card.stories` 의 CompoundCounselorCard 레시피.
  - AppointmentCard: 날짜 파생·status/mode 상태머신은 앱 로직 — 앱 레이어 컴포넌트로 옮기고 시각은 `Card` 합성.
  - **외부 소비자가 import 중이면 빌드가 깨집니다.** 위 Card 합성으로 마이그레이션하세요.
- **재분류**: `MediaCard`, `OrderSummaryCard` 등 범용 프리미티브를 카탈로그상 `도메인` → `일반`/`데이터` 로 이동 (코드/API 무변경).
