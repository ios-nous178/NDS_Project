# @nudge-design/icons

Nudge Design System 의 **아이콘** — Figma 기준 SVG 를 React 컴포넌트 + 바닐라 export 로 생성. `currentColor` 기반이라 `size`/`color` prop 으로 제어합니다.

## 의존 / 소비

- 의존: 없음 (기반 패키지)
- 외부 앱이 직접 소비. `react`·`mcp`·`catalog` 도 의존.

```tsx
import { HomeIcon } from "@nudge-design/icons";
<HomeIcon size={24} />   // color 는 currentColor → 부모 text color 상속
```

## 구조 & 파이프라인

```
svg/{mono,multicolor}/*.svg      ← 원본 SVG (Figma 에서)
scripts/figma-icons.json         ← Figma asset URL 목록
scripts/fetch-figma.cjs          ← Figma 에서 SVG 다운로드
scripts/normalize-figma.cjs      ← 정규화(currentColor 치환 등)
scripts/generate.cjs             ← SVG → React/vanilla 컴포넌트 + src 배럴 생성
src/                             ← 생성물 (직접 수정 금지)
```

- **mono**: 단색(currentColor) 아이콘. **multicolor**: 고정 색 일러스트성 아이콘.
- `src/` 배럴은 `generate.cjs` 가 만들므로, import specifier 규칙을 바꾸면 생성기도 같이 수정.

## 아이콘 추가

현재 Figma → SVG 는 일부 자동(`fetch-figma`), 브랜드별은 반자동(import 스크립트)입니다. `find_icon` (MCP)으로 기존 아이콘을 먼저 조회해 중복을 피하세요. 자동화 개선 여지는 거버넌스/Figma 자동화 트랙에서 다룹니다.
