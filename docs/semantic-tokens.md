---
title: 시멘틱 토큰
sidebar_position: 4
---

# 시멘틱 토큰 카탈로그

NudgeEAP 디자인 시스템에서 컴포넌트가 사용하는 시멘틱 토큰 전체 목록. 모든 변수는 단일 `--semantic-*` namespace 로 통합됨.

- **CSS 변수**: 컴포넌트 스타일에서 `var(--semantic-...)` 로 사용
- **JS 참조**: `@nudge-eap/tokens` 에서 `cv.{group}.{key}` 로 import (예: `cv.primary.main`)
- **가이드**: 🟦 core = Figma 가이드에 정식 등재 / ⬜ experimental = 합의 전 (Figma 노드 표기는 `MqR7O3uvBvH5tVngwzbqGH` 파일 기준)
- **값**: NudgeEAP 기본값. Trost 칸은 해당 브랜드에서 override 한 값 (빈 칸 = 기본값 상속)

자동 생성: `node scripts/generate-semantic-tokens-doc.mjs`

## Palette · Primary

| CSS 변수                       | JS 참조                | NudgeEAP  | Trost     | 가이드          |
| ------------------------------ | ---------------------- | --------- | --------- | --------------- |
| `--semantic-primary-main`      | `cv.primary.main`      | `#2B96ED` | `#FFF42E` | 🟦 core (222:2) |
| `--semantic-primary-hover`     | `cv.primary.hover`     | `#017EE4` | `#FFE600` | 🟦 core (222:2) |
| `--semantic-primary-pressed`   | `cv.primary.pressed`   | `#1B65BA` | `#E6D200` | 🟦 core (222:2) |
| `--semantic-primary-lighter`   | `cv.primary.lighter`   | `#91CAF6` | `#FFF8B8` |                 |
| `--semantic-primary-bg`        | `cv.primary.bg`        | `#E3F2FC` | `#FFF8B8` | 🟦 core (222:2) |
| `--semantic-primary-bgLighter` | `cv.primary.bgLighter` | `#F1F8FD` | `#FFFCE6` | 🟦 core (222:2) |
| `--semantic-primary-fg`        | `cv.primary.fg`        | `#FFFFFF` | `#000000` |                 |

## Palette · Secondary

| CSS 변수                         | JS 참조                  | NudgeEAP  | Trost     | 가이드          |
| -------------------------------- | ------------------------ | --------- | --------- | --------------- |
| `--semantic-secondary-sub`       | `cv.secondary.sub`       | `#ED2E77` | `#4968FF` | 🟦 core (222:2) |
| `--semantic-secondary-lighter`   | `cv.secondary.lighter`   | `#F8B8CF` | `#A3B3FF` |                 |
| `--semantic-secondary-bg`        | `cv.secondary.bg`        | `#FCE3EC` | `#EDF0FF` |                 |
| `--semantic-secondary-bgLighter` | `cv.secondary.bgLighter` | `#FDF1F5` | `#F6F7FF` |                 |

## Palette · Error

| CSS 변수                | JS 참조         | NudgeEAP  | Trost     | 가이드          |
| ----------------------- | --------------- | --------- | --------- | --------------- |
| `--semantic-error-main` | `cv.error.main` | `#F13F00` | `#FF4111` | 🟦 core (222:2) |
| `--semantic-error-bg`   | `cv.error.bg`   | `#FEE9E6` | `#FEE9E6` | 🟦 core (222:2) |

## Palette · Caution

| CSS 변수                  | JS 참조           | NudgeEAP  | Trost     | 가이드          |
| ------------------------- | ----------------- | --------- | --------- | --------------- |
| `--semantic-caution-main` | `cv.caution.main` | `#FFC303` | `#FF9D00` | 🟦 core (222:2) |
| `--semantic-caution-text` | `cv.caution.text` | `#FFA100` | `#FF9D00` |                 |
| `--semantic-caution-bg`   | `cv.caution.bg`   | `#FFFAE8` | `#FFF8E6` | 🟦 core (222:2) |

## Palette · Success

| CSS 변수                  | JS 참조           | NudgeEAP  | Trost     | 가이드          |
| ------------------------- | ----------------- | --------- | --------- | --------------- |
| `--semantic-success-main` | `cv.success.main` | `#13BFA2` | `#00BC78` | 🟦 core (222:2) |
| `--semantic-success-bg`   | `cv.success.bg`   | `#E5F7F4` | `#E6F9F2` | 🟦 core (222:2) |

## Palette · Text

| CSS 변수                      | JS 참조               | NudgeEAP  | Trost     | 가이드 |
| ----------------------------- | --------------------- | --------- | --------- | ------ |
| `--semantic-text-strong`      | `cv.text.strong`      | `#000000` | `#000000` |        |
| `--semantic-text-normal`      | `cv.text.normal`      | `#111111` | `#333333` |        |
| `--semantic-text-default`     | `cv.text.default`     | `#383838` | `#333333` |        |
| `--semantic-text-subtle`      | `cv.text.subtle`      | `#666666` | `#606060` |        |
| `--semantic-text-disabled`    | `cv.text.disabled`    | `#999999` | `#979797` |        |
| `--semantic-text-placeholder` | `cv.text.placeholder` | `#999999` | `#979797` |        |
| `--semantic-text-inverse`     | `cv.text.inverse`     | `#FFFFFF` | `#FFFFFF` |        |

## Palette · Background

| CSS 변수                        | JS 참조                 | NudgeEAP          | Trost                | 가이드 |
| ------------------------------- | ----------------------- | ----------------- | -------------------- | ------ |
| `--semantic-bg-white`           | `cv.bg.white`           | `#FFFFFF`         | `#FFFFFF`            |        |
| `--semantic-bg-light`           | `cv.bg.light`           | `#FAFAFA`         | `#F6F6F6`            |        |
| `--semantic-bg-coolGray`        | `cv.bg.coolGray`        | `#F3F4F6`         | `#F4F5F7`            |        |
| `--semantic-bg-coolGrayLighter` | `cv.bg.coolGrayLighter` | `#F8F9FB`         | `#F2F2F2`            |        |
| `--semantic-bg-disabled`        | `cv.bg.disabled`        | `#ECECEC`         | `#E5E5E5`            |        |
| `--semantic-bg-overlay`         | `cv.bg.overlay`         | `rgba(0,0,0,0.5)` | `rgba(0, 0, 0, 0.7)` |        |

## Palette · Border

| CSS 변수                     | JS 참조              | NudgeEAP  | Trost     | 가이드 |
| ---------------------------- | -------------------- | --------- | --------- | ------ |
| `--semantic-border-default`  | `cv.border.default`  | `#D8D8D8` | `#E5E5E5` |        |
| `--semantic-border-light`    | `cv.border.light`    | `#ECECEC` | `#F2F2F2` |        |
| `--semantic-border-focus`    | `cv.border.focus`    | `#2B96ED` | `#4968FF` |        |
| `--semantic-border-disabled` | `cv.border.disabled` | `#ECECEC` | `#E5E5E5` |        |

## Palette · Icon

| CSS 변수                  | JS 참조           | NudgeEAP  | Trost     | 가이드 |
| ------------------------- | ----------------- | --------- | --------- | ------ |
| `--semantic-icon-default` | `cv.icon.default` | `#383838` | `#333333` |        |
| `--semantic-icon-subtle`  | `cv.icon.subtle`  | `#999999` | `#979797` |        |
| `--semantic-icon-inverse` | `cv.icon.inverse` | `#FFFFFF` | `#FFFFFF` |        |

## Palette · Status

| CSS 변수                    | JS 참조             | NudgeEAP  | Trost | 가이드 |
| --------------------------- | ------------------- | --------- | ----- | ------ |
| `--semantic-status-default` | `cv.status.default` | `#999999` |       |        |
| `--semantic-status-success` | `cv.status.success` | `#2B96ED` |       |        |
| `--semantic-status-error`   | `cv.status.error`   | `#F13F00` |       |        |

## Role · Surface (배경)

| CSS 변수                        | JS 참조                    | NudgeEAP  | Trost | 가이드          |
| ------------------------------- | -------------------------- | --------- | ----- | --------------- |
| `--semantic-bg-page-default`    | `cv.surface.page`          | `#F8F9FB` |       | 🟦 core (222:2) |
| `--semantic-bg-surface-default` | `cv.surface.default`       | `#FFFFFF` |       | 🟦 core (222:2) |
| `--semantic-bg-surface-subtle`  | `cv.surface.subtle`        | `#FAFAFA` |       |                 |
| `--semantic-bg-section-default` | `cv.surface.section`       | `#F3F4F6` |       |                 |
| `--semantic-bg-brand-default`   | `cv.surface.brand`         | `#2B96ED` |       | 🟦 core (222:2) |
| `--semantic-bg-brand-subtle`    | `cv.surface.brandSubtle`   | `#F1F8FD` |       | 🟦 core (222:2) |
| `--semantic-bg-inverse-default` | `cv.surface.inverse`       | `#111111` |       |                 |
| `--semantic-bg-status-error`    | `cv.surface.statusError`   | `#FEE9E6` |       |                 |
| `--semantic-bg-status-success`  | `cv.surface.statusSuccess` | `#E5F7F4` |       |                 |
| `--semantic-bg-status-info`     | `cv.surface.statusInfo`    | `#E3F2FC` |       |                 |
| `--semantic-bg-status-caution`  | `cv.surface.statusCaution` | `#FFFAE8` |       |                 |

## Role · Text

| CSS 변수                           | JS 참조                     | NudgeEAP  | Trost | 가이드          |
| ---------------------------------- | --------------------------- | --------- | ----- | --------------- |
| `--semantic-text-strong-default`   | `cv.textRole.strong`        | `#111111` |       | 🟦 core (222:2) |
| `--semantic-text-normal-default`   | `cv.textRole.normal`        | `#383838` |       | 🟦 core (222:2) |
| `--semantic-text-subtle-default`   | `cv.textRole.subtle`        | `#666666` |       | 🟦 core (222:2) |
| `--semantic-text-muted-default`    | `cv.textRole.muted`         | `#999999` |       | 🟦 core (222:2) |
| `--semantic-text-disabled-default` | `cv.textRole.disabled`      | `#C7C7C7` |       |                 |
| `--semantic-text-inverse-default`  | `cv.textRole.inverse`       | `#FFFFFF` |       |                 |
| `--semantic-text-brand-default`    | `cv.textRole.brand`         | `#2B96ED` |       | 🟦 core (222:2) |
| `--semantic-text-brand-strong`     | `cv.textRole.brandStrong`   | `#1B65BA` |       |                 |
| `--semantic-text-status-success`   | `cv.textRole.statusSuccess` | `#00A07C` |       |                 |
| `--semantic-text-status-error`     | `cv.textRole.statusError`   | `#F13F00` |       |                 |
| `--semantic-text-status-caution`   | `cv.textRole.statusCaution` | `#FFA100` |       |                 |
| `--semantic-text-status-info`      | `cv.textRole.statusInfo`    | `#017EE4` |       |                 |

## Role · Icon

| CSS 변수                           | JS 참조                     | NudgeEAP  | Trost | 가이드          |
| ---------------------------------- | --------------------------- | --------- | ----- | --------------- |
| `--semantic-icon-strong-default`   | `cv.iconRole.strong`        | `#383838` |       | 🟦 core (227:2) |
| `--semantic-icon-normal-default`   | `cv.iconRole.normal`        | `#666666` |       | 🟦 core (227:2) |
| `--semantic-icon-disabled-default` | `cv.iconRole.disabled`      | `#C7C7C7` |       | 🟦 core (227:2) |
| `--semantic-icon-inverse-default`  | `cv.iconRole.inverse`       | `#FFFFFF` |       | 🟦 core (227:2) |
| `--semantic-icon-brand-default`    | `cv.iconRole.brand`         | `#2B96ED` |       | 🟦 core (227:2) |
| `--semantic-icon-status-success`   | `cv.iconRole.statusSuccess` | `#13BFA2` |       |                 |
| `--semantic-icon-status-error`     | `cv.iconRole.statusError`   | `#F13F00` |       |                 |
| `--semantic-icon-status-caution`   | `cv.iconRole.statusCaution` | `#FFC303` |       |                 |

## Role · Border

| CSS 변수                             | JS 참조                       | NudgeEAP  | Trost | 가이드          |
| ------------------------------------ | ----------------------------- | --------- | ----- | --------------- |
| `--semantic-border-normal-default`   | `cv.borderRole.normal`        | `#D8D8D8` |       | 🟦 core (222:2) |
| `--semantic-border-strong-default`   | `cv.borderRole.strong`        | `#999999` |       |                 |
| `--semantic-border-subtle-default`   | `cv.borderRole.subtle`        | `#ECECEC` |       |                 |
| `--semantic-border-focus-default`    | `cv.borderRole.focus`         | `#2B96ED` |       | 🟦 core (222:2) |
| `--semantic-border-brand-default`    | `cv.borderRole.brand`         | `#2B96ED` |       |                 |
| `--semantic-border-brand-disabled`   | `cv.borderRole.brandDisabled` | `#9CA2AE` |       |                 |
| `--semantic-border-disabled-default` | `cv.borderRole.disabled`      | `#ECECEC` |       |                 |
| `--semantic-border-status-error`     | `cv.borderRole.statusError`   | `#F13F00` |       |                 |
| `--semantic-border-status-caution`   | `cv.borderRole.statusCaution` | `#FFC303` |       |                 |

## Role · Button

| CSS 변수                                      | JS 참조                             | NudgeEAP  | Trost | 가이드 |
| --------------------------------------------- | ----------------------------------- | --------- | ----- | ------ |
| `--semantic-button-bg-default`                | `cv.button.bgDefault`               | `#2B96ED` |       |        |
| `--semantic-button-bg-hover`                  | `cv.button.bgHover`                 | `#017EE4` |       |        |
| `--semantic-button-bg-pressed`                | `cv.button.bgPressed`               | `#0E71CF` |       |        |
| `--semantic-button-bg-disabled`               | `cv.button.bgDisabled`              | `#D8D8D8` |       |        |
| `--semantic-button-bg-secondary-default`      | `cv.button.bgSecondary`             | `#F1F8FD` |       |        |
| `--semantic-button-bg-secondary-hover`        | `cv.button.bgSecondaryHover`        | `#E3F2FC` |       |        |
| `--semantic-button-bg-secondary-disabled`     | `cv.button.bgSecondaryDisabled`     | `#E6E7EB` |       |        |
| `--semantic-button-bg-outlined-default`       | `cv.button.bgOutlined`              | `#FFFFFF` |       |        |
| `--semantic-button-bg-outlined-hover`         | `cv.button.bgOutlinedHover`         | `#F1F8FD` |       |        |
| `--semantic-button-bg-outlined-disabled`      | `cv.button.bgOutlinedDisabled`      | `#FFFFFF` |       |        |
| `--semantic-button-text-default`              | `cv.button.textDefault`             | `#FFFFFF` |       |        |
| `--semantic-button-text-brand`                | `cv.button.textBrand`               | `#2B96ED` |       |        |
| `--semantic-button-text-disabled`             | `cv.button.textDisabled`            | `#999999` |       |        |
| `--semantic-button-border-outlined-default`   | `cv.button.borderOutlined`          | `#2B96ED` |       |        |
| `--semantic-button-border-outlined-hover`     | `cv.button.borderOutlinedHover`     | `#2B96ED` |       |        |
| `--semantic-button-border-outlined-disabled`  | `cv.button.borderOutlinedDisabled`  | `#9CA2AE` |       |        |
| `--semantic-button-border-assistive-default`  | `cv.button.borderAssistive`         | `#D8D8D8` |       |        |
| `--semantic-button-border-assistive-disabled` | `cv.button.borderAssistiveDisabled` | `#ECECEC` |       |        |

## Role · Fill

| CSS 변수                          | JS 참조                 | NudgeEAP  | Trost | 가이드 |
| --------------------------------- | ----------------------- | --------- | ----- | ------ |
| `--semantic-fill-brand-default`   | `cv.fill.brand`         | `#2B96ED` |       |        |
| `--semantic-fill-brand-hover`     | `cv.fill.brandHover`    | `#017EE4` |       |        |
| `--semantic-fill-brand-pressed`   | `cv.fill.brandPressed`  | `#0E71CF` |       |        |
| `--semantic-fill-brand-disabled`  | `cv.fill.brandDisabled` | `#D8D8D8` |       |        |
| `--semantic-fill-neutral-default` | `cv.fill.neutral`       | `#383838` |       |        |
| `--semantic-fill-neutral-subtle`  | `cv.fill.neutralSubtle` | `#F5F5F5` |       |        |
| `--semantic-fill-inverse-default` | `cv.fill.inverse`       | `#FFFFFF` |       |        |
| `--semantic-fill-status-error`    | `cv.fill.statusError`   | `#F13F00` |       |        |
| `--semantic-fill-status-caution`  | `cv.fill.statusCaution` | `#FFC303` |       |        |

## Role · Input

| CSS 변수                               | JS 참조                       | NudgeEAP  | Trost | 가이드           |
| -------------------------------------- | ----------------------------- | --------- | ----- | ---------------- |
| `--semantic-input-bg`                  | `cv.input.bg`                 | `#FFFFFF` |       | 🟦 core (294:12) |
| `--semantic-input-bg-disabled`         | `cv.input.bgDisabled`         | `#FAFAFA` |       |                  |
| `--semantic-input-border-default`      | `cv.input.borderDefault`      | `#D8D8D8` |       |                  |
| `--semantic-input-border-hover`        | `cv.input.borderHover`        | `#C7C7C7` |       |                  |
| `--semantic-input-border-focus`        | `cv.input.borderFocus`        | `#2B96ED` |       | 🟦 core (294:12) |
| `--semantic-input-border-error`        | `cv.input.borderError`        | `#F13F00` |       | 🟦 core (294:12) |
| `--semantic-input-border-disabled`     | `cv.input.borderDisabled`     | `#D8D8D8` |       |                  |
| `--semantic-input-placeholder`         | `cv.input.placeholder`        | `#999999` |       | 🟦 core (294:12) |
| `--semantic-input-helpertext-default`  | `cv.input.helpertextDefault`  | `#999999` |       | 🟦 core (294:12) |
| `--semantic-input-helpertext-success`  | `cv.input.helpertextSuccess`  | `#2B96ED` |       | 🟦 core (294:12) |
| `--semantic-input-helpertext-error`    | `cv.input.helpertextError`    | `#F13F00` |       | 🟦 core (294:12) |
| `--semantic-input-helpertext-disabled` | `cv.input.helpertextDisabled` | `#C7C7C7` |       | 🟦 core (294:12) |

---

총 120 개 시멘틱 토큰.
