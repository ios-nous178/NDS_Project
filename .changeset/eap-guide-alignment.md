---
"@nudge-design/tokens": minor
"@nudge-design/styles": minor
"@nudge-design/react": major
"@nudge-design/html": major
"@nudge-design/mcp": patch
---

넛지 EAP 라이브러리 가이드 정합 — BottomSheet · Accordion · Divider · Result States

Figma 넛지EAP 라이브러리 가이드 4종에 맞춰 컴포넌트·토큰·MCP 가이드를 정합했습니다. 4개 가이드 모두 `figmaNodeUrl` 연결 + 내용(summary·pitfalls·DO/DONT·spec matrix) 동기화.

**⚠ BREAKING — Accordion `type` 의미 변경**

- `type="single|multiple"`(펼침 모드)가 **`expandMode`** 로 이름이 바뀌었습니다. `type` 은 이제 **시각 타입 `"line" | "card"`** 입니다(기본 `card`).
- 마이그레이션: `<Accordion type="single">` → `<Accordion expandMode="single">` (html `<nds-accordion expand-mode="single">`). `type="multiple"` 도 `expandMode="multiple"` 로.
- 신규: `type="line"`(구분선 기반·FAQ/약관) / `type="card"`(배경+라운드·심리검사/상품). 제목은 Body1 Bold·Text/Strong 로 강화.

**Divider** — `type="line"`(1px Border) / `type="block"`(8px BG/Section, 섹션 사이 청크) + `tone="subtle|normal|strong"` 신규(token-matched). **기본 톤이 `subtle`→`normal`(Border/Normal)로 바뀌어 라인이 한 단계 진해집니다.** 기존 `thickness`/`color` 는 escape hatch 로 유지.

**BottomSheet** — EAP 가이드(1746:800) 정합: 상단 radius **24**(base; 프로젝트 토큰이 덮음), 진입 모션 **280ms cubic-bezier(.4,0,.2,1)**, 제목 **Text/Strong·가운데 정렬·divider 제거**, 닫기(✕) **우상단 24×24 Icon/Strong**. `figmaNodeUrl` 을 EAP 노드로 교체(트로스트는 references 로 이동).

**Result States** — 제목 **Bold·Text/Strong**, 텍스트→버튼 간격 20→12. `status` API 는 유지(Figma `show*`/PC·MO 는 가이드 prose 로 정합, PC device variant 는 후속).

**토큰** — motion 에 `duration.moderate`(240) · `duration.emphasized`(280) · `easing.standard`(cubic-bezier .4 0 .2 1) 추가.
