# Nudge Mockup Import (canary)

데스크탑 하네스(`apps/desktop`)에서 만든 목업을 **Figma 평면 레이어**로 가져오는 짝 플러그인입니다.

> ⚠️ **canary** — 실험 기능. 평면 레이어(absolute 배치 + 진짜 텍스트/이미지)로 가져옵니다.
> DS 컴포넌트 인스턴스가 아니라 일반 레이어이며, Auto Layout 은 아직 적용하지 않습니다.

## 왜 플러그인이 필요한가

Figma REST API 로는 캔버스에 디자인 노드(프레임/텍스트/인스턴스)를 **만들 수 없습니다**(읽기·댓글·변수만). 캔버스에 레이어를 생성하는 건 Figma 내부에서 도는 **플러그인**만 가능합니다. 그래서 파이프라인은 2단입니다:

1. **데스크탑 앱**: 목업을 self-contained HTML 로 빌드 → 화면 밖 창에 렌더 → DOM 을 평면 `scene.json` 으로 추출 → 저장 + 클립보드 복사. (전부 로컬, 네트워크 없음)
2. **이 플러그인**: `scene.json` 을 읽어 `frame/text/image/svg` 로 캔버스에 짓는다.

scene 스키마 SSOT: `packages/mockup-core/src/tools/figma/scene.ts` 의 `FigmaScene`.

## 설치 (개발 플러그인 등록)

1. Figma 데스크탑 앱 실행 (브라우저판은 로컬 플러그인 등록 불가).
2. 메뉴 → **Plugins → Development → Import plugin from manifest…**
3. 이 폴더의 `manifest.json` 선택.

## 사용

1. 데스크탑 하네스에서 목업을 연 뒤 상단 **Figma (canary)** 버튼 클릭
   → `<목업>/dist/.figma/scene.json` 저장 + scene 이 **클립보드에 복사**됩니다.
2. Figma 에서 **Plugins → Development → Nudge Mockup Import (canary)** 실행.
3. 텍스트 영역에 **붙여넣기(⌘V)** → **가져오기**.
4. 현재 페이지에 `Mockup 가져오기 (canary)` 프레임이 생성되고 그 위로 줌됩니다.

## 가져오는 것

- **아이콘(SVG)** — 인라인 `<svg>` 를 `createNodeFromSvg` 로 **진짜 편집 가능한 벡터 레이어**로 복원합니다.
  `currentColor` 는 추출 시점의 실제 색으로 치환되어 들어옵니다.
- **이미지** — `data:` URL(인라인 base64)만. 외부 URL 은 건너뜁니다(무유출 단일 산출물 기조).
- **텍스트/폰트** — family + weight 로 사용 가능한 폰트를 매칭합니다(스타일명 공백·하이픈 무시 →
  `Semi Bold` == `SemiBold`). **브랜드 폰트를 로컬에 설치하거나 Figma 조직에 공유**해 두면
  그대로 사용하고, 어디에도 없을 때만 `Inter` 로 폴백합니다.

## 한계 (v1)

- **평면 absolute 배치** — Auto Layout/제약 없음. flex 구조 유래 Auto Layout 은 후속(Phase 2).
- **일반 레이어** — DS 컴포넌트 인스턴스가 아님. 레이어 이름만 DS 컴포넌트명(`Button` 등)으로 표기.
  Figma DS 라이브러리가 publish 되면 `scene.json` 의 `dsComponent`/`props` 메타로 인스턴스 승격 예정(Phase 3).
- **폰트 부재 시 폴백** — 브랜드 폰트가 로컬·조직 어디에도 없으면 `Inter` 로 대체됩니다(설치하면 해결).
