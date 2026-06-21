---
"@nudge-design/tokens": major
---

EAP(NudgeEAP) 아토믹 컬러를 Figma 라이브러리(201:2) 기준으로 업데이트했습니다.

- **Amber 제거** — 사용처 없던 황금톤 램프 삭제.
- **Red / Orange 재정의** — "Orange Red"(#F13F00, 에러색)를 **Red** Family로, 신규 **Peach**(#FB8A3E, 일기·행복)를 **Orange** Family로. (기존 EAP 에러는 값 그대로 #F13F00 유지 — color.orange → color.red 로 rewire)
- **신규 Family 2종** — **Purple**(Lavender #8B5CF6, 명상·수면) · **Teal**(#14B8A6, 안정·휴식) 아토믹 램프 추가.

값 보존: 기존 시멘틱 763개 토큰 동일 hex(value-freeze). 신규 Lavender/Peach/Teal 의 시멘틱 role 연결(meditation/journal/wellness)은 후속.

**마이그레이션** — EAP atomic 을 직접 쓰던 경우: `--color-amber-*` 제거됨(→ `--color-yellow-*`), `--color-orange-*` 값이 Peach(#FB8A3E)로 변경(기존 #F13F00 은 `--color-red-*`).
