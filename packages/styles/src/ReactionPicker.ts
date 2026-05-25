/* Auto-generated from packages/react/src/ReactionPicker.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, fontWeight, transition, typeScale } from "@nudge-eap/tokens";

const RP_CLASS = "nds-reaction-picker";
const RP_ITEM_CLASS = `${RP_CLASS}__item`;
const RP_EMOJI_CLASS = `${RP_CLASS}__emoji`;
const RP_COUNT_CLASS = `${RP_CLASS}__count`;

export const rpStyles = `
  :where(.${RP_CLASS}) {
    display: inline-flex;
    flex-wrap: wrap;
    gap: var(--gap-tight);
    font-family: ${fontFamily.web};
  }

  :where(.${RP_ITEM_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-tight);
    height: 32px;
    padding: 0 var(--inset-chip);
    border-radius: 9999px;
    border: 1px solid ${cv.borderRole.normal};
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.medium};
    cursor: pointer;
    transition: background-color ${transition.default}, border-color ${transition.default};
  }

  :where(.${RP_ITEM_CLASS}:hover:not([disabled])) { background: ${cv.surface.section}; }

  :where(.${RP_ITEM_CLASS}[data-active="true"]) {
    background: var(--semantic-bg-status-info);
    border-color: ${cv.borderRole.brand};
    color: ${cv.textRole.brand};
  }

  :where(.${RP_ITEM_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${RP_ITEM_CLASS}[disabled]) {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :where(.${RP_EMOJI_CLASS}) {
    font-size: 16px;
    line-height: 1;
  }

  :where(.${RP_COUNT_CLASS}) {
    font-variant-numeric: tabular-nums;
  }
`;
