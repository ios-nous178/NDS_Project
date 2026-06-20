/* Chip 의 CSS SSOT — react Chip.tsx · html nds-chip.ts 둘 다 번들 styles.css 를 쓴다(자체 주입 없음). */
import { cv, transition } from "@nudge-design/tokens";

const CHIP_CLASS = "nds-chip";
const CHIP_ROOT_CLASS = `${CHIP_CLASS}__root`;
const CHIP_REMOVE_CLASS = `${CHIP_CLASS}__remove`;
const CHIP_ICON_CLASS = `${CHIP_CLASS}__icon`;

export const chipStyles = `
  :where(.${CHIP_ROOT_CLASS}) {
    /* variant×color → bg/fg/border 슬롯 합성. react/html 은 data-variant/data-color 만 set,
       색은 여기서만(JS 색맵 우회 금지). 슬롯 폴백은 outlined·project(컴포넌트 기본값)와 동일. */
    background: var(--nds-chip-bg, ${cv.surface.default});
    color: var(--nds-chip-fg, ${cv.textRole.brand});
    border: 1px solid var(--nds-chip-border, ${cv.borderRole.brand});
    transition:
      background-color ${transition.default},
      border-color ${transition.default},
      color ${transition.default};
  }

  /* ─── variant=fill × color (FILL_COLORS) ─── */
  :where(.${CHIP_ROOT_CLASS}[data-variant="fill"][data-color="project"]) {
    --nds-chip-bg: ${cv.fill.brand};
    --nds-chip-fg: ${cv.button.textDefault};
    --nds-chip-border: transparent;
  }
  :where(.${CHIP_ROOT_CLASS}[data-variant="fill"][data-color="neutral"]) {
    --nds-chip-bg: ${cv.fill.neutral};
    --nds-chip-fg: ${cv.textRole.inverse};
    --nds-chip-border: transparent;
  }
  :where(.${CHIP_ROOT_CLASS}[data-variant="fill"][data-color="success"]) {
    --nds-chip-bg: ${cv.surface.statusSuccess};
    --nds-chip-fg: ${cv.textRole.statusSuccess};
    --nds-chip-border: transparent;
  }
  :where(.${CHIP_ROOT_CLASS}[data-variant="fill"][data-color="error"]) {
    --nds-chip-bg: ${cv.fill.statusError};
    --nds-chip-fg: ${cv.textRole.inverse};
    --nds-chip-border: transparent;
  }
  :where(.${CHIP_ROOT_CLASS}[data-variant="fill"][data-color="caution"]) {
    --nds-chip-bg: ${cv.fill.statusCaution};
    --nds-chip-fg: ${cv.textRole.strong};
    --nds-chip-border: transparent;
  }

  /* ─── variant=outlined × color (OUTLINED_COLORS) ─── */
  :where(.${CHIP_ROOT_CLASS}[data-variant="outlined"][data-color="project"]) {
    --nds-chip-bg: ${cv.surface.default};
    --nds-chip-fg: ${cv.textRole.brand};
    --nds-chip-border: ${cv.borderRole.brand};
  }
  :where(.${CHIP_ROOT_CLASS}[data-variant="outlined"][data-color="neutral"]) {
    --nds-chip-bg: ${cv.surface.default};
    --nds-chip-fg: ${cv.textRole.normal};
    --nds-chip-border: ${cv.borderRole.normal};
  }
  :where(.${CHIP_ROOT_CLASS}[data-variant="outlined"][data-color="success"]) {
    --nds-chip-bg: ${cv.surface.default};
    --nds-chip-fg: ${cv.textRole.statusSuccess};
    --nds-chip-border: ${cv.textRole.statusSuccess};
  }
  :where(.${CHIP_ROOT_CLASS}[data-variant="outlined"][data-color="error"]) {
    --nds-chip-bg: ${cv.surface.default};
    --nds-chip-fg: ${cv.textRole.statusError};
    --nds-chip-border: ${cv.borderRole.statusError};
  }
  :where(.${CHIP_ROOT_CLASS}[data-variant="outlined"][data-color="caution"]) {
    --nds-chip-bg: ${cv.surface.default};
    --nds-chip-fg: ${cv.textRole.statusCaution};
    --nds-chip-border: ${cv.borderRole.statusCaution};
  }

  /* ─── variant=ghost × color (GHOST_COLORS) ─── */
  :where(.${CHIP_ROOT_CLASS}[data-variant="ghost"][data-color="project"]) {
    --nds-chip-bg: ${cv.surface.brandSubtle};
    --nds-chip-fg: ${cv.textRole.brand};
    --nds-chip-border: transparent;
  }
  :where(.${CHIP_ROOT_CLASS}[data-variant="ghost"][data-color="neutral"]) {
    --nds-chip-bg: ${cv.surface.subtle};
    --nds-chip-fg: ${cv.textRole.normal};
    --nds-chip-border: transparent;
  }
  :where(.${CHIP_ROOT_CLASS}[data-variant="ghost"][data-color="success"]) {
    --nds-chip-bg: ${cv.surface.statusSuccess};
    --nds-chip-fg: ${cv.textRole.statusSuccess};
    --nds-chip-border: transparent;
  }
  :where(.${CHIP_ROOT_CLASS}[data-variant="ghost"][data-color="error"]) {
    --nds-chip-bg: ${cv.surface.statusError};
    --nds-chip-fg: ${cv.textRole.statusError};
    --nds-chip-border: transparent;
  }
  :where(.${CHIP_ROOT_CLASS}[data-variant="ghost"][data-color="caution"]) {
    --nds-chip-bg: ${cv.surface.statusCaution};
    --nds-chip-fg: ${cv.textRole.statusCaution};
    --nds-chip-border: transparent;
  }

  /* ─── selected=true × color (variant 무시 → FILL_COLORS, 단 --nds-chip-selected-* override 우선) ─── */
  /* selected 룰은 variant 룰 뒤(source order)에 둬 :where() 동일 특정성에서 이긴다. */
  :where(.${CHIP_ROOT_CLASS}[data-selected="true"][data-color="project"]) {
    --nds-chip-bg: var(--nds-chip-selected-background, ${cv.fill.brand});
    --nds-chip-fg: var(--nds-chip-selected-text, ${cv.button.textDefault});
    --nds-chip-border: var(--nds-chip-selected-border, transparent);
  }
  :where(.${CHIP_ROOT_CLASS}[data-selected="true"][data-color="neutral"]) {
    --nds-chip-bg: var(--nds-chip-selected-background, ${cv.fill.neutral});
    --nds-chip-fg: var(--nds-chip-selected-text, ${cv.textRole.inverse});
    --nds-chip-border: var(--nds-chip-selected-border, transparent);
  }
  :where(.${CHIP_ROOT_CLASS}[data-selected="true"][data-color="success"]) {
    --nds-chip-bg: var(--nds-chip-selected-background, ${cv.surface.statusSuccess});
    --nds-chip-fg: var(--nds-chip-selected-text, ${cv.textRole.statusSuccess});
    --nds-chip-border: var(--nds-chip-selected-border, transparent);
  }
  :where(.${CHIP_ROOT_CLASS}[data-selected="true"][data-color="error"]) {
    --nds-chip-bg: var(--nds-chip-selected-background, ${cv.fill.statusError});
    --nds-chip-fg: var(--nds-chip-selected-text, ${cv.textRole.inverse});
    --nds-chip-border: var(--nds-chip-selected-border, transparent);
  }
  :where(.${CHIP_ROOT_CLASS}[data-selected="true"][data-color="caution"]) {
    --nds-chip-bg: var(--nds-chip-selected-background, ${cv.fill.statusCaution});
    --nds-chip-fg: var(--nds-chip-selected-text, ${cv.textRole.strong});
    --nds-chip-border: var(--nds-chip-selected-border, transparent);
  }

  :where(.${CHIP_ROOT_CLASS}[data-interactive="true"]) {
    cursor: pointer;
  }

  :where(.${CHIP_ROOT_CLASS}[data-interactive="true"]:hover) {
    filter: brightness(0.96);
  }

  :where(.${CHIP_ROOT_CLASS}[data-disabled="true"]) {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }

  :where(.${CHIP_REMOVE_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    margin-left: 2px;
    color: inherit;
    opacity: 0.6;
    line-height: 1;
    transition:
      opacity ${transition.default},
      transform ${transition.default};
  }

  :where(.${CHIP_REMOVE_CLASS}:hover) {
    opacity: 1;
    transform: scale(1.1);
  }

  :where(.${CHIP_REMOVE_CLASS} svg) {
    width: 14px;
    height: 14px;
  }

  :where(.${CHIP_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  :where(.${CHIP_ICON_CLASS} svg) {
    width: 16px;
    height: 16px;
  }
`;
