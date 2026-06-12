---
"@nudge-design/react": minor
"@nudge-design/styles": minor
"@nudge-design/mcp": patch
---

Asset 사이즈를 Avatar 새 스케일에 정합

Asset 의 size 프리셋을 Avatar(Figma 1337:8)와 동일 스케일로 맞췄다 — **md 40→48 · lg 48→64 · xl 64→96**(xs 24·sm 32 동일), Asset 전용 `2xl` 은 80→120 으로 상향(순서 유지). shape='rounded' 의 cornerRadius 도 고정 8px → **사이즈별 4/6/8/10/12(2xl 14)** 로 Avatar 와 동일하게(`--nds-asset-radius` 슬롯, 임의 px size 는 ~0.16 비율). 이제 같은 size·shape 에서 Asset 과 Avatar 가 시각적으로 일치한다. 프로덕션 소비처 없음(스토리만 사용) — 외부에서 Asset size 를 픽셀 의도로 쓰던 곳만 확인 필요.
