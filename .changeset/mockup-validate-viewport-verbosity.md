---
"@nudge-design/mcp": patch
---

목업 워크플로우 개선 3종 (목업 세션 피드백 반영)

- **검증 응답 토큰 절감** — `validate_html_mockup` 이 같은 룰(인라인 스타일 등)을 다수 보고할 때, 룰별 첫 5건 뒤(꼬리)는 `selector` 를 생략해 응답·컨텍스트 비대화를 막음(회고: inline-color 240건이 단일 응답을 점거하고 이후 턴마다 따라다님). 룰별 전체 카운트·line 은 `violationsByRule` 에 그대로 보존돼 정보 손실이 없고, 위반당 1행을 적재하는 telemetry(rule-stats) 카운트도 유지된다.
- **모바일 viewport 보장** — `build_singlefile_html` 이 산출물 `<head>` 에 `<meta name="viewport">` 를 자동 주입(멱등 — 원본에 있으면 건드리지 않음). 누락 시 모바일이 데스크탑 폭으로 렌더돼 카드/다열 그리드가 짓눌리던 문제를 차단. 원본에 누락된 경우 `validate_html_mockup` 이 `missing-viewport-meta`(warn)로 환기.
- **반응형 작성 가이드 보강** — 설계 원칙과 `pattern:container-section` 에 (1) 다열 그리드의 모바일 1열 fallback (2) "DOM 순서 = 시각 순서" — 랭킹을 위해 DOM 을 열 우선(1,6,2,7…)으로 깔지 말고 `grid-auto-flow:column` 사용 (3) viewport meta 필수 규칙을 추가. 목업 CLAUDE.md 템플릿에 "인라인 스타일 지양·클래스 우선" 하드룰 추가.
