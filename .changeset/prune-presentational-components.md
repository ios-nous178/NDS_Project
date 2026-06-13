---
"@nudge-design/react": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

선젬 컴포넌트 3종 제거 — CallControlBar · TimeSlotPicker · OnlineIndicator (BREAKING)

디자인 근거(Figma 가이드 노드)도 소비처도 없이 미리 만들어둔("선젬") 컴포넌트 3종을 정리했습니다. react/html export·styles·스토리·가이드·docs·카탈로그·baseline 전부 삭제.

- **CallControlBar** (`nds-call-control-bar`): 통화 컨트롤 바 — 도메인 고정. 다시 필요하면 `IconButton` 합성으로 앱 레이어 레시피.
- **TimeSlotPicker** (`nds-time-slot-picker`): 슬롯 선택 그리드 — 소비처 0. 자유 시각 입력은 `TimePicker` 사용.
- **OnlineIndicator** (`nds-online-indicator`): presence 점 — 소비처 0. 진짜 Figma 노드가 생기면 그때 재편입(재현 5분, low-regret).

**외부 소비자가 import 중이면 빌드가 깨집니다.**
