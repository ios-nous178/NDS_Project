/* Auto-generated from packages/react/src/TimeSlotPicker.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, transition, typeScale } from "@nudge-design/tokens";

const TS_CLASS = "nds-time-slot-picker";
const TS_ROOT_CLASS = `${TS_CLASS}__root`;
const TS_GROUP_CLASS = `${TS_CLASS}__group`;
const TS_GROUP_LABEL_CLASS = `${TS_CLASS}__group-label`;
const TS_GRID_CLASS = `${TS_CLASS}__grid`;
const TS_SLOT_CLASS = `${TS_CLASS}__slot`;
const TS_EMPTY_CLASS = `${TS_CLASS}__empty`;

export const timeSlotPickerStyles = `
  :where(.${TS_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-loose);
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${TS_GROUP_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-default);
  }

  :where(.${TS_GROUP_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.subtle};
  }

  :where(.${TS_GRID_CLASS}) {
    display: grid;
    grid-template-columns: repeat(var(--nds-time-slot-cols, 4), 1fr);
    gap: var(--gap-default);
  }

  :where(.${TS_SLOT_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    padding: 0 var(--inset-chip);
    border: 1px solid ${cv.borderRole.normal};
    border-radius: ${radius.sm}px;
    background: ${cv.surface.default};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.normal};
    transition: background-color ${transition.default}, border-color ${transition.default}, color ${transition.default};
    box-sizing: border-box;
  }

  :where(.${TS_SLOT_CLASS}:hover:not(:disabled):not([data-selected="true"])) {
    border-color: ${"#91CAF6"};
    background: ${cv.surface.brandSubtle};
  }

  :where(.${TS_SLOT_CLASS}[data-selected="true"]) {
    background: ${cv.surface.brand};
    border-color: ${cv.borderRole.brand};
    color: ${cv.textRole.inverse};
    font-weight: ${fontWeight.medium};
  }

  :where(.${TS_SLOT_CLASS}:disabled),
  :where(.${TS_SLOT_CLASS}[data-unavailable="true"]) {
    background: ${cv.surface.disabled};
    color: ${cv.textRole.muted};
    border-color: ${cv.borderRole.subtle};
    cursor: not-allowed;
    text-decoration: line-through;
  }

  :where(.${TS_SLOT_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${TS_EMPTY_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--inset-modal);
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    background: ${cv.surface.subtle};
    border-radius: ${radius.md}px;
  }
`;
