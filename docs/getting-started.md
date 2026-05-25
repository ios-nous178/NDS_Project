---
sidebar_position: 1
title: 시작하기
---

# 시작하기

NudgeEAP Design System(NDS)을 프로젝트에 설치하고 사용하는 방법을 안내합니다.

## 설치

```bash
# pnpm (권장)
pnpm add @nudge-eap/react @nudge-eap/tokens

# npm
npm install @nudge-eap/react @nudge-eap/tokens
```

### Tailwind CSS 사용자

Tailwind CSS를 사용하는 프로젝트라면 프리셋도 함께 설치하세요.

```bash
pnpm add @nudge-eap/tailwind-preset
```

`tailwind.config.ts`에 프리셋을 추가합니다.

```ts
import { nudgeEapPreset } from "@nudge-eap/tailwind-preset";

export default {
  presets: [nudgeEapPreset],
  // ...
};
```

### 아이콘

```bash
pnpm add @nudge-eap/icons
```

```tsx
import { SearchIcon, CloseIcon, ChevronRightIcon } from "@nudge-eap/icons";

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
import { Button, Badge } from "@nudge-eap/react";

function App() {
  return (
    <div>
      <Badge variant="fill" color="brand">
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
import { colors, spacing, typography } from "@nudge-eap/tokens";

const style = {
  color: colors.blue[500],
  padding: spacing[16],
  fontSize: typography.typeScale.body1.fontSize,
};
```

### CSS 변수로 사용

```tsx
import "@nudge-eap/tokens/css";
```

```css
.my-element {
  color: var(--nds-color-blue-500);
  padding: var(--nds-spacing-16);
}
```

---

## 패키지 구성

| 패키지                       | 설명                                   | 상태    |
| ---------------------------- | -------------------------------------- | ------- |
| `@nudge-eap/tokens`          | 디자인 토큰 (색상, 타이포, 간격)       | ✅ 안정 |
| `@nudge-eap/styles`          | 공통 CSS 번들                          | ✅ 안정 |
| `@nudge-eap/html`            | Web Components / HTML 목업 기준 런타임 | ✅ 안정 |
| `@nudge-eap/react`           | React 앱용 선택 어댑터                 | ✅ 안정 |
| `@nudge-eap/icons`           | SVG 아이콘 컴포넌트                    | ✅ 안정 |
| `@nudge-eap/tailwind-preset` | Tailwind CSS 프리셋                    | ✅ 안정 |

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
- [컴포넌트 인벤토리](/components/inventory) — Figma, Storybook, Docs 연결표
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

### 2. 자동 생성 실행

```bash
pnpm generate:component-inventory
```

이 명령은 `docs/components/inventory.md`를 자동 생성합니다.

### 3. 반영 위치 확인

- Storybook Docs: 각 컴포넌트 문서 상단 설명 영역
- Docusaurus Docs: `/components/inventory`
- 메타데이터 원본: `metadata/componentInventory.json`

### 4. 운영 팁

- 실제 Figma 링크가 없을 때는 `figmaUrl`, `figmaNodeId`를 비워둘 수 있습니다.
- Storybook title은 실제 스토리의 `title`과 동일해야 합니다.
- Story 이름은 `State/...`, `Recipe/...`, `Interaction/...`, `QA/...`, `Reference/...` prefix를 기준으로 통일합니다. `Playground`는 예외로 유지합니다.
- `status`는 `implemented`, `planned`, `draft` 중 하나로 맞추는 것을 권장합니다.
