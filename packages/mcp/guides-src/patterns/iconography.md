---
metrics:
  sizeScale: 12 / 16 / 20 / 24 / 32 / 48 px
  defaultSize: 24px
  minSize: 12px
  fillThreshold: ≤15px 권장 스타일 = Filled
  minTouchArea: 40px
  touchAreaIcon20: 40px
  touchAreaIcon24: 44px
  selectionPriority: brand-specific icon → NudgeEAP default icon → mockup default icon package(MockupLinear*/MockupBold*) → generated custom SVG
  figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=379-490
  categories: basic, navigation, action, media, state-reaction, location, eap-service, color
  tracks: mono (1925, currentColor) | multicolor (17, style-locked brand signature)
  importPaths: "@nudge-design/icons (flat, backward-compat) | @nudge-design/icons/mono | @nudge-design/icons/multicolor | @nudge-design/icons (MonoIcons / MultiIcons namespace)"
---

## summary

Figma Iconography(379:490) 라이브러리 기준 아이콘 사이즈·터치 영역·Line/Filled 스타일·카테고리 전반 가이드. 컬러 토큰은 get_guide({ topic: 'pattern:icon-color' })와 함께 본다.

## rules

- **아이콘 선택 필수 우선순위**: 브랜드 전용 아이콘(Geniet*/Trost* 등) → NudgeEAP 기본 브랜드 아이콘 → 목업용 기본 아이콘 패키지(MockupLinear*/MockupBold*) → 자체 생성 SVG. 앞 단계에서 의미가 맞는 아이콘을 찾을 수 있으면 뒤 단계로 내려가지 않는다.
- 목업용 기본 아이콘은 Figma 5000+ Icon Set 의 linear/bold 계열을 `MockupLinear*Icon`, `MockupBold*Icon` 으로 등록한 fallback 패키지다. 기본 액션/내비게이션은 MockupLinear, 활성/강조/작은 크기에는 MockupBold 를 우선 검토한다.
- 기본 사이즈는 24px. 인터페이스 용도에 맞춰 12 / 16 / 20 / 24 / 32 / 48 px의 6단계만 사용한다. 최소 사이즈는 12px.
- 15px 이하의 작은 사이즈에서는 시각 복잡도를 낮추기 위해 Fill(Filled) 스타일을 우선 사용한다. (Line은 얇은 선이 손상되어 보임)
- 기본 액션·내비게이션 아이콘은 Line(Stroke) 스타일을 우선한다. 현재 활성 상태(GNB 활성 탭, 좋아요 ON 등)와 강조용 단일 아이콘은 Filled를 사용한다.
- 한 화면에서 Line 과 Filled 를 같은 의미 그룹 안에서 섞지 않는다. 같은 GNB · 같은 카드 리스트 · 같은 툴바 안에서는 한쪽으로 통일한다.
- 단독 아이콘 버튼(IconButton 포함)의 터치 영역은 최소 40px. 사이즈별 권장: 20px 아이콘 → 40px touch, 24px 아이콘 → 44px touch. 40px 미만은 접근성 위반.
- 아이콘 자체에 padding 을 직접 주지 말고 IconButton 의 size prop 또는 부모 컨테이너 padding/min-width 로 터치 영역을 확보한다.
- 네이밍 컨벤션: 기본 Line = `XIcon`, Filled 짝 = `XActiveIcon` 또는 `XOnIcon` (예: HomeIcon ↔ HomeActiveIcon, SleepmodeOffIcon ↔ SleepmodeOnIcon). 짝 정보는 ICON_METADATA[name].pair 로 확인.
- 카테고리 8종(basic / navigation / action / media / state-reaction / location / eap-service / color)은 의미 분류일 뿐 강제 import 경로 분리가 아니다. find_icon 결과의 카테고리는 유사 의미 후보를 찾는 힌트로 사용.
- 컬러(다색) 카테고리 아이콘은 결과 일러스트(TestresultSafe/Warning/Danger, Siren) 전용이다. 일반 UI 강조에 색 아이콘을 끼워 넣지 않는다.
- **Mono vs Multicolor 트랙 분리** (SEED 스타일) — `@nudge-design/icons` 는 두 트랙으로 나뉜다. Mono(1925개, `currentColor` 만 사용해서 `color` prop 으로 자유 변경) 와 Multicolor(17개, 브랜드 시그니처 — Trost mental 일러스트·Geniet 브랜드 아이콘·CashwalkBiz GNB chat/member 등 — 내부 accent 색 잠금). UI chrome(navigation/action/state)은 mono, 서비스 시그니처/주요 진입점은 multicolor.
- **Import 경로 선택**: 기본은 root flat `import { CalendarIcon } from '@nudge-design/icons'` (백워드 호환). 자동완성 범위를 좁히고 카테고리를 분명히 하려면 subpath `import { CalendarIcon } from '@nudge-design/icons/mono'` 또는 `import { GenietSaladIcon } from '@nudge-design/icons/multicolor'` 사용. namespace 형 `import { MonoIcons, MultiIcons } from '@nudge-design/icons'` 도 가능.
- **Multicolor 컬러 override 금지** — multicolor 아이콘의 `color` prop 은 base(`currentColor` 사용 영역)만 바꾼다. 내부 accent(`#FFF` 등)는 SVG 에 고정되어 있으니 SVG 를 직접 편집하지 말 것.
- 필요한 아이콘이 브랜드/NudgeEAP/Mockup 패키지 어디에도 없을 때만 인라인 `<svg>` 또는 신규 SVG 추가를 검토한다. 신규 추가 시 mono 아이콘은 `packages/icons/svg/mono/`, multicolor 아이콘은 `packages/icons/svg/multicolor/` 에 kebab-case 로 저장한 뒤 `pnpm --filter @nudge-design/icons build` 로 컴포넌트를 재생성한다. viewBox 는 0 0 24 24, mono 의 stroke/fill 은 `currentColor` 로 유지.

## avoid

- 브랜드 전용 아이콘이 있는데 NudgeEAP/Mockup 아이콘으로 대체
- NudgeEAP 기본 아이콘이 있는데 Mockup 아이콘으로 대체
- MockupLinear*/MockupBold* 검색 없이 자체 생성 SVG 사용
- 12 / 16 / 20 / 24 / 32 / 48 외의 임의 사이즈 (예: 18px, 22px) 사용
- 12px 미만 아이콘
- 15px 이하에서 가는 Line 스타일을 그대로 사용 — Filled 로 교체
- 동일 화면 / 동일 그룹에서 Line + Filled 스타일 혼용
- 단독 IconButton 의 터치 영역을 40px 미만으로 두기
- 아이콘 컴포넌트를 인라인 `<svg>` 로 직접 작성하기 — `@nudge-design/icons` 사용
- 컬러(다색) 아이콘에 color prop 강제 적용 — 다색 표현이 어긋남
- multicolor 아이콘 SVG 내부 accent 색을 임의로 편집하기 — 스타일이 잠겨있음. 브랜드 변경이 필요하면 디자인팀과 협의해 새 SVG 등록.
- mono 아이콘을 `packages/icons/svg/multicolor/` 에, multicolor 아이콘을 `packages/icons/svg/mono/` 에 잘못 배치하기 — generate.js 가 카테고리별 export 를 만들기 때문에 위치가 곧 카테고리.
