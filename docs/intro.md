---
sidebar_position: 1
title: 소개
---

# NudgeEAP Design System

NudgeEAP Design System(NDS)은 Button, Modal, Input 등 **15개 React 컴포넌트**와 디자인 토큰, 아이콘을 제공하는 공용 UI 라이브러리입니다. Figma 디자인과 1:1로 동기화되어 있으며, 기획·디자인·개발 모두가 같은 용어와 기준으로 소통할 수 있도록 설계되었습니다.

---

## 역할별 시작 가이드

### 기획자라면

컴포넌트를 직접 코딩할 필요는 없지만, **어떤 컴포넌트가 있고 언제 쓰는지** 알면 기획 문서의 정확도가 올라갑니다.

1. [컴포넌트 한눈에 보기](/docs/components/overview) — 전체 컴포넌트 목록 + **선택 가이드** (어떤 상황에 어떤 컴포넌트?)
2. [디자인 원칙](/docs/guide/design-principles) — NDS의 핵심 설계 기준
3. 각 컴포넌트 문서의 **"사용 가이드"** 섹션 — 이럴 때 사용 / 이럴 때 사용하지 마세요 / 자주 하는 실수

### 디자이너라면

Figma 컴포넌트와 코드 컴포넌트가 어떻게 연결되는지 파악하세요.

1. [컴포넌트 한눈에 보기](/docs/components/overview) — 전체 목록 + 유사 컴포넌트 비교표
2. [컴포넌트 인벤토리](/docs/components/inventory) — Figma 링크, Storybook 링크, 구현 상태 한눈에
3. [디자인 토큰 — 색상](/docs/tokens/colors) — 토큰 팔레트 확인
4. [Figma to React 워크플로우](/docs/FIGMA_TO_REACT_WORKFLOW) — Figma↔코드 동기화 방식

### 개발자라면

설치부터 시작하세요.

1. [시작하기](/docs/getting-started) — 설치, import, 기본 사용법
2. [컴포넌트 한눈에 보기](/docs/components/overview) — 전체 목록 + 선택 가이드
3. 각 컴포넌트 문서 — Props, CSS 변수, SlotProps, data-slot, 접근성
4. [스타일링 가이드](/docs/STYLING_STRUCTURE_GUIDE) — CSS 변수 우선순위, 커스터마이징 전략

---

## 패키지 구성

| 패키지                       | 설명                                                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `@nudge-eap/react`           | React 컴포넌트 (Button, Modal, Input 등)                                                                           |
| `@nudge-eap/tokens`          | 디자인 토큰 (색상, 타이포그래피, 간격)                                                                             |
| `@nudge-eap/icons`           | SVG 아이콘 React 컴포넌트 84종 — [Icons 카탈로그](/docs/components/icons)                                          |
| `@nudge-eap/tailwind-preset` | Tailwind CSS 프리셋                                                                                                |
| `@nudge-eap/mcp`             | Claude용 MCP 서버 — [사용 가이드](/docs/NUDGE_EAP_DS_MCP_USAGE) · [도구 레퍼런스](/docs/guide/mcp-tools-reference) |

---

## 핵심 운영 원칙

1. **토큰** — Figma 값의 공식 번역 레이어. 코드에서는 항상 토큰을 참조합니다.
2. **컴포넌트 스펙** — 각 컴포넌트마다 Figma node ID와 스펙을 기록합니다.
3. **Storybook** — 시각적 계약서. 컴포넌트의 모든 상태를 스토리로 검증합니다.
4. **문서** — 사람과 AI 모두 읽을 수 있는 MD 기반 구조화 문서로 관리합니다.
