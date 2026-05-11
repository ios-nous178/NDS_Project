# AI Prompts for Design System

이 문서는 디자인 시스템 구축 과정에서 AI를 활용하기 위한 프롬프트 모음입니다.

목표

- Figma → 컴포넌트 자동 생성
- 컴포넌트 → Storybook 생성
- 컴포넌트 → 문서 생성
- 마이그레이션 → UI QA

AI는 **최종 결정권자가 아니라 생산성을 높이는 보조 도구**로 사용합니다.

---

# 1. 기존 코드 분석

목적

- 중복 UI 패턴 탐지
- 디자인 토큰 후보 추출
- 컴포넌트 후보 정리

Prompt

Analyze this repository and extract reusable UI patterns.

Focus on:

- repeated components
- color usage
- spacing patterns
- border radius usage
- typography patterns

Return:

1. reusable component candidates
2. token candidates
3. duplicated UI patterns

---

# 2. Design Tokens 생성

목적

기존 코드 기반으로 디자인 토큰 후보 생성

Prompt

Analyze the following UI styles and generate a design token structure.

Focus on:

- color tokens
- spacing tokens
- radius tokens
- typography tokens

Return a normalized token structure.

Example output format:

```json
{
  "color": {},
  "spacing": {},
  "radius": {},
  "typography": {}
}
```

---

# 3. Figma → React Component

목적

Figma 디자인을 React 컴포넌트로 변환

Prompt

Convert this Figma component specification into a React component.

Requirements:

- use design tokens
- support variants
- support sizes
- support accessibility
- support responsive layout

Follow this API style:

Flat API example:

```tsx
<Button variant="primary">Confirm</Button>
```

Compound API example:

```tsx
<Card>
  <Card.Header />
  <Card.Body />
</Card>
```

---

# 4. Component API 설계

목적

컴포넌트 props 설계

Prompt

Design a component API for the following UI component.

Include:

- variants
- sizes
- states
- accessibility considerations

Return:

- props interface
- usage examples
- edge cases

---

# 5. Storybook 생성

목적

컴포넌트 QA 및 개발 환경 구축

Prompt

Generate Storybook stories for this component.

Include:

- variants
- states
- responsive layout
- edge cases

Example states:

- hover
- active
- disabled
- loading

---

# 6. Documentation 생성

목적

Docusaurus 문서 생성

Prompt

Generate documentation for this component.

Include:

- usage
- props
- variants
- accessibility
- do and don't examples

---

# 7. UI Migration QA

목적

마이그레이션 과정에서 UI 차이 검증

Prompt

Compare the migrated UI implementation with the original implementation.

Check:

- layout
- spacing
- typography
- border radius
- button style
- responsive behavior

Return a visual diff checklist.

---

# 8. UI Consistency Check

목적

디자인 시스템 적용 이후 일관성 검증

Prompt

Analyze this UI and verify if it follows the design system rules.

Check:

- spacing tokens
- typography tokens
- color tokens
- component usage
- CTA hierarchy
- visual emphasis overuse
- dropdown/list density

Return violations if found.

---

# 9. Mockup UX Guardrails

목적

목업 생성 시 AI가 모든 새 영역을 강조하거나 CTA마다 화살표를 붙이는 문제를 줄입니다.

Prompt

Review this mockup against NudgeEAP DS UX guardrails.

Check:

- primary solid Button is used for only one most important action
- ArrowNext/ChevronRight icon appears only on the representative forward CTA
- repeated card/list CTAs do not repeat arrow icons
- Chip/Badge is used for status, category, or short attributes, not decoration
- notice/callout areas do not combine too many emphasis devices
- Select/dropdown option count matches the recommended pattern
- dense lists keep fixed scan positions for status, date, amount, progress, and CTA

Return:

1. issues ordered by severity
2. suggested replacement pattern
3. whether `get_pattern_guide("cta-group" | "notice" | "dropdown" | "dense-list")` should be consulted

---

# AI 사용 원칙

AI는 다음 작업에 활용합니다.

가능한 작업

- 코드 분석
- 컴포넌트 초안 생성
- Storybook 생성
- 문서 생성
- QA 체크리스트 생성

AI가 결정하면 안 되는 작업

- 디자인 토큰 최종 확정
- spacing / radius 임의 결정
- UX 의도 해석
