---
"@nudge-design/tokens": minor
"@nudge-design/styles": minor
"@nudge-design/react": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

Dim — 오버레이 백드롭 컴포넌트 신설 (Figma Dim Guide 1751:20)

Modal·BottomSheet·BottomPopup 등 오버레이 뒤를 덮는 백드롭(배경 차단) primitive 를 추가합니다. 화면 전체(`position: fixed; inset: 0`)를 검정 alpha 로 덮어 위계를 만들고 포커스를 오버레이에 모읍니다.

- **강도 3단계**: `type="subtle"`(α0.2·가벼운 분리) · `type="default"`(α0.4·BG/Overlay 토큰·표준) · `type="strong"`(α0.7·완전 차단).
- **토큰**: `overlay` 시멘틱 토큰을 3단계 스케일로 확장 — `--semantic-bg-overlay-subtle`(α0.2) / `--semantic-bg-overlay-strong`(α0.7) 신설. `default` 는 기존 `--semantic-bg-overlay`(프로젝트별 테마·트로스트 α0.6 등) 그대로 바인딩, subtle/strong 은 범용 검정. 색은 `--nds-dim-*` 슬롯으로 합성(프로젝트 override 여지).
- **API**: `type`, `animated`(페이드 인 기본 on), `onClose`(백드롭 클릭 닫기 — react). html `<nds-dim>` 은 백드롭 클릭 시 `nds-dim-close` CustomEvent 디스패치.
- **react + html 3면 미러** + Storybook(강도 갤러리·클릭 닫기 interaction) + MCP 가이드(페어링·DO/DONT) 동반.

> Dim 은 **표현(배경 차단)만 책임지는 primitive** 입니다 — 스크롤 잠금·포커스 트랩·ESC·z-index 스택은 오버레이 컨테이너의 책임. Modal/BottomSheet/Popup 은 이미 자체 백드롭을 포함하므로 그 위에 Dim 을 중복으로 깔지 마세요.
