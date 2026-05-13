---
sidebar_position: 4
title: Elevation
---

# Elevation 토큰

> ✅ **Figma 가이드 정합 완료** · 검증일 2026-05-13 · [Figma 556:2](https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=556-2)

요소가 화면 위에 얼마나 떠있는지를 표현하는 레이어 시스템입니다. Shadow는 시각 효과가 아닌 **정보 위계**를 명시하기 위해 사용하며, 최소한으로 적용합니다.

```tsx
import { shadow, elevationLevel } from "@nudge-eap/tokens";
```

---

## 개념 원칙

| #   | 원칙                 | 설명                                                                    |
| --- | -------------------- | ----------------------------------------------------------------------- |
| 01  | 기본은 Border        | 카드·컨테이너 구분은 1px border로 처리. Shadow는 Border의 대안이 아님   |
| 02  | Shadow = 레이어 표현 | 다른 요소 위에 떠있을 때만 사용. 스타일 장식이나 Hover 강조에 사용 금지 |
| 03  | 일관성 유지          | 동일 역할의 컴포넌트는 항상 동일 Elevation Level을 사용                 |

---

## Level별 정의

| Level | Key           | Alias                    | 역할              | CSS Token         | 사용 컴포넌트                          |
| ----- | ------------- | ------------------------ | ----------------- | ----------------- | -------------------------------------- |
| E0    | `shadow["0"]` | `elevationLevel.none`    | 기본 (Base)       | `var(--shadow-0)` | 페이지, Section, 기본 Card             |
| E1    | `shadow["1"]` | `elevationLevel.subtle`  | 부유 (Subtle)     | `var(--shadow-1)` | Card Hover, Sticky Header, Pinned Row  |
| E2    | `shadow["2"]` | `elevationLevel.overlay` | 오버레이(Overlay) | `var(--shadow-2)` | Dropdown, Popover, Tooltip, Datepicker |
| E3    | `shadow["3"]` | `elevationLevel.modal`   | 최상위 (Modal)    | `var(--shadow-3)` | Modal, Dialog, Bottom Sheet, Toast     |

### CSS 값

```css
:root {
  --shadow-0: none;
  --shadow-1: 0px 1px 4px rgba(0, 0, 0, 0.08);
  --shadow-2: 0px 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-3: 0px 8px 24px rgba(0, 0, 0, 0.12);
}
```

> 💡 HTML 목업 생성 시 `box-shadow` 값을 직접 쓰지 않고, 반드시 `var(--shadow-N)` 변수를 사용하세요. 일관성과 유지보수성을 높입니다.

---

## 사용법

```tsx
import { shadow, elevationLevel } from "@nudge-eap/tokens";

// 키 기반 (Figma E1 ~ E3과 동일)
<div style={{ boxShadow: shadow["2"] }} />

// 의미 기반 alias
<div style={{ boxShadow: elevationLevel.overlay }} />

// CSS 변수 직접 참조
<div style={{ boxShadow: "var(--shadow-2)" }} />
```

---

## 운영툴(Admin) 권장 사용 방식

CMS/Admin은 데이터 중심 환경이라 Shadow를 더 보수적으로 적용합니다.

| 컴포넌트               | Elevation | 적용 기준                             |
| ---------------------- | --------- | ------------------------------------- |
| Table / Data Grid      | E0        | border로만 구분. shadow 불필요        |
| Form / Input           | E0        | focus 상태는 border-color 변경으로    |
| Card / Panel           | E0        | border 1px, bg-surface. shadow 미적용 |
| Sticky Table Header    | E1        | 스크롤 시에만 shadow/1 활성화 (JS)    |
| Filter Panel (Popout)  | E1        | 화면 내 고정 패널                     |
| Select Dropdown        | E2        | 반드시 shadow/2. z-index와 함께       |
| Date Picker / Popover  | E2        | shadow/2 + border 조합                |
| Tooltip                | E2        | shadow/2 + border 1px 필수            |
| Confirm Modal / Dialog | E3        | Dimmed Overlay + shadow/3             |
| Alert Dialog           | E3        | 위험 액션 확인용. shadow/3 필수       |

---

## DO / Don&apos;t

### DO

- 기본 카드·컨테이너 구분은 1px border로 처리
- Dropdown·Popover는 반드시 `var(--shadow-2)` (E2)
- Modal·Dialog는 반드시 `var(--shadow-3)` (E3)
- 동일 역할 컴포넌트는 항상 동일 Elevation Level
- Tooltip에 border + `var(--shadow-2)` 조합
- Sticky Header는 스크롤 시에만 `var(--shadow-1)` 활성화

### Don&apos;t

- Hover 시 shadow 레벨을 급변경 (E0 → E2 급등)
- 장식 목적의 과도한 shadow (버튼·텍스트·아이콘)
- 동일 화면에 서로 다른 Elevation Level이 혼재
- Shadow만으로 Border 없이 Card 경계 표현
- E3 초과 레벨 임의 생성 (더 강한 shadow가 필요하면 시스템 검토)
- 모든 컴포넌트에 shadow를 default로 적용

---

## Shadow 남용 안티패턴

- **Shadow 계단식 증가**: Default → Hover → Active → Selected로 shadow를 계속 강하게 적용하는 패턴. Shadow는 상태 표현 수단이 아닙니다. 상태 변화는 background color나 border color로 처리하세요.
- **일반 컨테이너 과도한 레이어화**: 페이지 내 모든 Section, Panel, Widget에 shadow를 적용하면 화면이 무겁고 정보 위계가 모호해집니다. 기본 컨테이너는 border로, shadow는 실제로 떠있는 요소에만.
- **일관성 없는 Elevation 사용**: 같은 Dropdown이 화면마다 다른 shadow를 가지면 디자인 시스템이 아닌 개별 디자인입니다. `shadow["N"]` 토큰 또는 `var(--shadow-N)`을 반드시 사용하고, 직접 값을 입력하지 마세요.

---

## Z-Index

| Token             | 값   | 사용처             |
| ----------------- | ---- | ------------------ |
| `zIndex.base`     | 0    | 기본               |
| `zIndex.dropdown` | 100  | Dropdown / Popover |
| `zIndex.sticky`   | 200  | Sticky Header      |
| `zIndex.appBar`   | 300  | App Bar            |
| `zIndex.modal`    | 1000 | Modal / Dialog     |
| `zIndex.popup`    | 1100 | Popup              |
| `zIndex.toast`    | 1200 | Toast              |
