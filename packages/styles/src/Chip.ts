/* Mirror of packages/react/src/Chip.tsx — keep in sync. */
/* The .tsx still self-injects this literal at runtime; this copy feeds the bundled styles.css. */
import { transition } from "@nudge-eap/tokens";

const CHIP_CLASS = "nds-chip";
const CHIP_ROOT_CLASS = `${CHIP_CLASS}__root`;
const CHIP_REMOVE_CLASS = `${CHIP_CLASS}__remove`;
const CHIP_ICON_CLASS = `${CHIP_CLASS}__icon`;

export const chipStyles = `
  :where(.${CHIP_ROOT_CLASS}) {
    transition:
      background-color ${transition.default},
      border-color ${transition.default},
      color ${transition.default};
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
