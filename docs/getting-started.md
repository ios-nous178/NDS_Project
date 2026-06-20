---
sidebar_position: 1
title: 시작하기
---

# 시작하기

Nudge Design System(NDS)을 프로젝트에 설치하고 사용하는 방법을 안내합니다.

## 설치

```bash
# pnpm (권장)
pnpm add @nudge-design/react @nudge-design/tokens

# npm
npm install @nudge-design/react @nudge-design/tokens
```

### Tailwind CSS 사용자

Tailwind CSS를 사용하는 프로젝트라면 프리셋도 함께 설치하세요.

```bash
pnpm add @nudge-design/tailwind-preset
```

`tailwind.config.ts`에 프리셋을 추가합니다.

```ts
import { nudgeEapPreset } from "@nudge-design/tailwind-preset";

export default {
  presets: [nudgeEapPreset],
  // ...
};
```

### 아이콘

```bash
pnpm add @nudge-design/icons
```

```tsx
import { SearchIcon, CloseIcon, ChevronRightIcon } from "@nudge-design/icons";

// 기본 (24x24, currentColor)
<SearchIcon />

// 크기 및 색상 변경
<ChevronRightIcon size={16} color="#2B96ED" />

// SVG props 확장
<CloseIcon className="my-icon" aria-hidden="true" />
```

84종의 아이콘을 제공합니다. 전체 목록은 [Icons 문서](/components/icons)를 참고하세요.

---

## 기본 사용법

### 컴포넌트 사용

```tsx
import { Button, Badge } from "@nudge-design/react";

function App() {
  return (
    <div>
      <Badge variant="fill" color="project">
        신규
      </Badge>
      <Button variant="solid" size="lg" onClick={() => alert("클릭!")}>
        시작하기
      </Button>
    </div>
  );
}
```

### 토큰 직접 사용

디자인 토큰을 직접 참조해야 할 때 사용합니다.

```tsx
import { colors, spacing, typography } from "@nudge-design/tokens";

const style = {
  color: colors.blue[500],
  padding: spacing[16],
  fontSize: typography.typeScale.body1.fontSize,
};
```

### CSS 변수로 사용

```tsx
import "@nudge-design/tokens/css";
```

```css
.my-element {
  color: var(--nds-color-blue-500);
  padding: var(--nds-spacing-16);
}
```

---

## 패키지 구성

| 패키지                          | 설명                                   | 상태    |
| ------------------------------- | -------------------------------------- | ------- |
| `@nudge-design/tokens`          | 디자인 토큰 (색상, 타이포, 간격)       | ✅ 안정 |
| `@nudge-design/styles`          | 공통 CSS 번들                          | ✅ 안정 |
| `@nudge-design/html`            | Web Components / HTML 목업 기준 런타임 | ✅ 안정 |
| `@nudge-design/react`           | React 앱용 선택 어댑터                 | ✅ 안정 |
| `@nudge-design/icons`           | SVG 아이콘 컴포넌트                    | ✅ 안정 |
| `@nudge-design/tailwind-preset` | Tailwind CSS 프리셋                    | ✅ 안정 |

---

## 컴포넌트 API 패턴

NDS의 모든 컴포넌트는 **Flat API**와 **Compound API** 두 가지 방식을 지원합니다.

### Flat API — 간단한 사용

props만으로 빠르게 사용할 수 있습니다.

```tsx
<Modal open={open} onClose={handleClose} title="알림" onConfirm={handleConfirm}>
  모달 내용입니다.
</Modal>
```

### Compound API — 세밀한 제어

각 슬롯을 직접 조합하여 레이아웃과 스타일을 자유롭게 커스터마이징할 수 있습니다.

```tsx
<Modal.Root open={open} onClose={handleClose}>
  <Modal.Overlay />
  <Modal.Content>
    <Modal.Header title="알림" closable />
    <Modal.Body>모달 내용입니다.</Modal.Body>
    <Modal.Footer onConfirm={handleConfirm} onClose={handleClose} />
  </Modal.Content>
</Modal.Root>
```

---

## 스타일 커스터마이징

NDS 컴포넌트는 세 가지 방식으로 스타일을 확장할 수 있습니다.

### 1. CSS 변수 오버라이드

```tsx
<Button style={{ "--nds-button-radius": "24px" } as React.CSSProperties}>둥근 버튼</Button>
```

### 2. className 전달

```tsx
<Button className="my-custom-button">커스텀</Button>
```

### 3. slotProps로 내부 슬롯 제어

```tsx
<Button
  slotProps={{
    label: { className: "font-bold" },
    leftIcon: { style: { color: "red" } },
  }}
>
  슬롯 커스텀
</Button>
```

---

## 다음 단계

- [컴포넌트 한눈에 보기](/components/overview) — 전체 컴포넌트 목록
- [프로젝트별 컴포넌트 커버리지](/components/project-coverage) — 프로젝트 × 컴포넌트 Figma 정합 현황
- [디자인 토큰](/tokens/colors) — 색상, 타이포그래피, 간격
- [디자인 원칙](/guide/design-principles) — NDS의 핵심 원칙

---

## Figma 링크 연결 사용법

컴포넌트별 Figma 링크, Storybook 링크, Docs 링크, 구현 상태는 `metadata/componentInventory.json`에서 함께 관리합니다.

### 1. 메타데이터 수정

```json
{
  "name": "Input",
  "storybookTitle": "Components/Input",
  "docsPath": "/components/input",
  "figmaUrl": "https://www.figma.com/design/FILE_KEY/Design-System?node-id=430-4212",
  "figmaNodeId": "430:4212",
  "status": "implemented",
  "usageSummary": "기본 입력, 검색 필드, 인증번호 입력",
  "notes": "화면 패턴별 Figma 링크를 붙이면 협업에 유용합니다."
}
```

### 2. 반영 위치 확인

`metadata/componentInventory.json`의 `figmaSynced` 값은 빌드 시 아래에 자동 반영됩니다 (별도 생성 명령 불필요).

- Docs 사이드바: "Figma 정합 / Figma 미정합" 두 섹션으로 컴포넌트 자동 분류
- 컴포넌트 갤러리: `/components/gallery` 의 "Figma Synced" 태그 / 필터
- Storybook Docs: 각 컴포넌트 문서 상단 정합 배지
- 메타데이터 원본: `metadata/componentInventory.json`

### 3. 운영 팁

- 실제 Figma 링크가 없을 때는 `figmaUrl`, `figmaNodeId`를 비워둘 수 있습니다.
- Storybook title은 실제 스토리의 `title`과 동일해야 합니다.
- Story 이름은 `State/...`, `Recipe/...`, `Interaction/...`, `QA/...`, `Reference/...` prefix를 기준으로 통일합니다. `Playground`는 예외로 유지합니다.
- `status`는 `implemented`, `planned`, `draft` 중 하나로 맞추는 것을 권장합니
다.
