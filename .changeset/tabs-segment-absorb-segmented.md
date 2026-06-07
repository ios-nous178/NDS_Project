---
"@nudge-design/react": minor
"@nudge-design/styles": minor
"@nudge-design/html": minor
"@nudge-design/mcp": minor
---

Tabs 에 `variant="segment"` 추가하고 SegmentedControl 컴포넌트 폐기(흡수).

- **Tabs variant='segment'**: 연결된 회색 트랙 위 균등 분할 단일선택(iOS 세그먼트). active = 흰색 떠오름(surface.default + shadow), tone='color' 면 브랜드 채움. mobile(36) / pc(40, 아이콘 동반). react/styles/html 3면 미러.
- **SegmentedControl 제거**: 컴포넌트(`SegmentedControl` / `nds-segmented`) · 스타일 · export · 스토리 · 카탈로그 · 인벤토리 · MCP 가이드 전부 삭제. 기존 SegmentedControl 사용처는 `Tabs variant="segment"` 로 마이그레이션(SegmentedControl 의 default/solid 중 default(흰 raised)만 흡수, solid 는 폐지).
- AllComponents · Tabs 스토리에 segment(mobile/pc) 노출. MCP 가이드·인벤토리·검증룰 cross-ref 를 Tabs variant=segment 로 갱신.
