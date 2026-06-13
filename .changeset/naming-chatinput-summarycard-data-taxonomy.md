---
"@nudge-design/react": minor
"@nudge-design/html": minor
"@nudge-design/styles": minor
"@nudge-design/mcp": patch
---

네이밍 정합 + 데이터 카테고리 재구성 + MultiStepForm 패턴 강등

- **ChatComposer → ChatInput 리네임 (BREAKING)** — Inputs 컴포넌트 중 유일하게 `<Thing>Input` 규칙을 벗어난 동사-명사(`Composer`) outlier 를 정렬. 가장 큰 채팅 SDK(Stream Chat·Sendbird)의 실제 입력바 컴포넌트명과 일치하고, 도메인('Chat')을 범용 입력 프리미티브 이름에서 분리. react `ChatInput`, html `<nds-chat-input>`, CSS `.nds-chat-input`. 짝 컴포넌트 `ChatBubble` 은 그대로 유지(Chat\* family). **소비자가 `ChatComposer` / `<nds-chat-composer>` 를 쓰고 있으면 `ChatInput` / `<nds-chat-input>` 으로 변경하세요.**
- **OrderSummaryCard → SummaryCard 리네임 + de-domain (BREAKING)** — '주문(Order)' 도메인 색을 뺀 범용 요약 카드(라벨:값 + 합계). react `SummaryCard`, html `<nds-summary-card>`, CSS `.nds-summary-card`. **`OrderSummaryCard` / `<nds-order-summary-card>` import 를 `SummaryCard` / `<nds-summary-card>` 로 변경하세요.**
- **MultiStepForm 제거 → 다단계 폼 패턴으로 강등 (BREAKING)** — 진행 표시·단계 헤더·이전/다음 풋터만 그리고 단계별 검증·데이터 보관 같은 어려운 상태머신은 `canProceed` boolean 으로 떠넘기던 얇은 셸. 실사용 0·Figma 가이드 노드 없음으로 DS 편입 기준 미충족. react `MultiStepForm`·`useMultiStepForm`, html `<nds-multi-step-form>`, styles 제거. 다단계 흐름은 **Stepper + Heading + FormSection + cta-group** 조립으로 — `get_guide({ topic: 'pattern:multi-step-form' })` 의 하드 패턴(상태 소유·게이팅·값 보존·제출 계약 MUST 규칙)을 따르세요.
- **데이터 카테고리 재구성 (카탈로그/스토리북 그룹 라벨만 — 코드/API 무변경)** — 카드·테이블 2종·차트·랭킹 리스트가 섞여 모호하던 단일 `데이터` 그룹을 업계 표준(Carbon/MUI/Ant)대로 분리: **데이터 표시**(DataTable·StatsTable·SummaryCard) · **데이터 시각화**(Chart + Sparkline — Sparkline 을 Display 에서 이동) · `TrendingKeywords` 는 쌍둥이 `PopularPosts` 옆 **도메인** 으로. 스토리북도 `Components/Data Display` · `Components/Data Visualization` 로 재그룹.
- **갤러리 보강 (비파괴)** — AllComponents 의 Button 미리보기에 color×variant 전체 매트릭스 추가(`soft × neutral` 처럼 조합마다 색이 달라지는 케이스까지 노출), Badge 의 `default` / `pill` shape 대비 스토리를 gallery 태그로 승격해 모서리 모양 차이가 카탈로그에 보이도록.
