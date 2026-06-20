# @nudge-design/icons

Nudge Design System 의 **아이콘** — Figma 기준 SVG 를 React 컴포넌트 + 바닐라 export 로 생성. `currentColor` 기반이라 `size`/`color` prop 으로 제어합니다.

## 의존 / 소비

- 의존: 없음 (기반 패키지)
- 외부 앱이 직접 소비. `react`·`mcp`·`catalog` 도 의존.

```tsx
import { HomeIcon } from "@nudge-design/icons";
<HomeIcon size={24} />; // color 는 currentColor → 부모 text color 상속
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

## 명명 규칙 (Naming) — SSOT

파일명(`svg/{mono,multicolor}/<name>.svg`)이 곧 export 이름입니다. `generate.cjs` 가 kebab → PascalCase + `Icon` 접미사로 컴포넌트를 만듭니다 (`geniet-heart-solid` → `GenietHeartSolidIcon`). **이름을 바꾸면 외부 export 가 바뀌는 breaking 변경** — changeset(보통 minor) 필수.

### 1. 형식

- **kebab-case**, 소문자, 영문/숫자/하이픈만. `.svg`.
- 새 아이콘은 추가 전 `find_icon`(MCP)으로 중복 조회.

### 2. 프로젝트 prefix

- 프로젝트 전용 아이콘은 **프로젝트 슬러그를 prefix**: `geniet-` · `trost-` · `runmile-` · `cashwalk-biz-` · `nudge-eap-`.
- 범용(공유) 아이콘은 prefix 없음(`home`, `calendar`, `search` …). `mockup-` 은 iconsax 일괄 import 셋(별도 계열).

### 3. mono vs multicolor

- **mono** (`svg/mono/`) — 단색. `currentColor` 로 그려져 `color` prop 으로 제어. UI chrome 의 기본.
- **multicolor** (`svg/multicolor/`) — 색을 **잠그는** 아이콘: 그라데이션·고정 색·흰색+섀도우·프로젝트 시그니처 일러스트. `currentColor` 정규화 대상 아님. (예: `geniet-heart-white-shadow` — 흰 하트+드롭섀도우를 보존해야 하므로 multicolor.)

### 4. 어순 — `명사-수식어` (수식어/도형은 **접미사**)

- ✅ `check-circle`, `plus-circle`, `warning-circle` · ❌ `circle-check`, `circle-plus` (Material 관례).

### 5. 도형 이름 — 화살표 ≠ 셰브론

- 꽉 찬 화살표(→): `arrow-left` · `arrow-right` · `arrow-up` · `arrow-down`.
- 셰브론/꺾쇠(›): `chevron-left` · `chevron-right` · `chevron-up` · `chevron-down`.
- 셰브론을 `arrow-*` 로 부르지 않는다. `back`/`next`/`top` 같은 시맨틱명 대신 도형명을 쓴다.

### 6. 채움(fill) 스타일 변형

- 기본 이름 = **아웃라인(line)**. 채움 변형은 **`-solid`** 접미사. (`heart` 라인 / `heart-solid` 채움.)
- `-fill` 금지(= `-solid` 로 통일). 모호하면 라인 쪽에 명시적 `-line` 허용.

### 7. 상태 접미사 — **의미축을 섞지 않는다**

같은 "켜진/선택된" 처럼 보여도 축이 다르면 접미사도 다르다:

| 축                       | 접미사             | 예                                |
| ------------------------ | ------------------ | --------------------------------- |
| 폼 컨트롤 체크 상태      | `-on` / `-off`     | `checkbox-on/off`, `radio-on/off` |
| 네비/탭 선택 상태        | `-active`          | `home-active`, `bookmark-active`  |
| 아이콘 채움 스타일(시각) | `-solid` / `-line` | `heart-solid`                     |
| 표시/숨김 토글           | `-on` / `-off`     | `eye-on`, `eye-off`               |

→ 이 셋을 하나의 단어로 강제 통합하지 않는다.

### 8. 색/스타일 변형 접미사

- mono 아이콘의 multicolor 변형 → **`-color`** (`runmile-check-circle` mono / `runmile-check-circle-color` multicolor).
- 외곽선 강조 변형 → **`-stroke`** (`runmile-warning-circle-stroke`).

### 9. 철자

- **올바른 영어 단어**. `alarm`(❌`alram`), `image`(❌`img`), `delete`(검색 클리어는 `search-delete` 로 통일).
- **예외 = 의도된 제품/기능명**: 글리프와 무관하게 앱 기능명을 쓰는 경우는 허용하되 **반드시 주석/가이드에 사유 기록**. (예: `geniet-cashhomt` = "캐시홈트(home-training)" 운동 기능 — 아령 글리프지만 기능명 보존.)

> 프로젝트 간 정합 이력: alram→alarm · shoe-fill→shoe-solid · img→image · circle-_→_-circle · 방향 도형명 정합 · runmile-questionmark→runmile-question-mark (복합어 하이픈) (`.changeset/icon-naming-consistency.md`). 에셋 id 규칙은 `@nudge-design/assets` README 참조.

## 아이콘 추가

현재 Figma → SVG 는 일부 자동(`fetch-figma`), 프로젝트별은 반자동(import 스크립트)입니다. `find_icon` (MCP)으로 기존 아이콘을 먼저 조회해 중복을 피하세요. 자동화 개선 여지는 거버넌스/Figma 자동화 트랙에서 다룹니다.
