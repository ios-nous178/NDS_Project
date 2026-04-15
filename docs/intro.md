---
sidebar_position: 1
title: 소개
---

# NudgeEAP Design System

NudgeEAP Design System은 토큰, 컴포넌트, 아이콘, Storybook, 운영 워크플로우를 하나의 모노레포 안에서 관리하기 위한 기반입니다.

이 문서 사이트는 다음을 빠르게 탐색할 수 있도록 구성합니다.

- 디자인 시스템 구축 방향
- 디자인 토큰 정의
- Figma와 코드의 동기화 워크플로우
- Storybook 기반 시각 QA 흐름

## 핵심 운영 원칙

1. `tokens` 를 Figma 값의 공식 번역 레이어로 둡니다.
2. 각 컴포넌트마다 `component spec` 과 `figma node id` 를 남깁니다.
3. Storybook을 시각 계약서처럼 운영합니다.
4. PR 템플릿에 Figma 링크, token 변경 여부, Storybook 반영 여부를 필수로 둡니다.

## 문서 둘러보기

- [디자인 시스템 구축 계획](./DESIGN_SYSTEM_PLAN.md)
- [토큰 문서](./TOKENS.md)
- [AI 프롬프트](./AI_PROMPTS.md)
- [Figma to React 워크플로우](./FIGMA_TO_REACT_WORKFLOW.md)
