/* Auto-generated from packages/react/src/MedicationItem.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const MI_CLASS = "nds-medication-item";
const MI_ICON_CLASS = `${MI_CLASS}__icon`;
const MI_BODY_CLASS = `${MI_CLASS}__body`;
const MI_HEAD_CLASS = `${MI_CLASS}__head`;
const MI_NAME_CLASS = `${MI_CLASS}__name`;
const MI_DOSAGE_CLASS = `${MI_CLASS}__dosage`;
const MI_META_CLASS = `${MI_CLASS}__meta`;
const MI_TIMES_CLASS = `${MI_CLASS}__times`;
const MI_TIME_CLASS = `${MI_CLASS}__time`;
const MI_NOTE_CLASS = `${MI_CLASS}__note`;
const MI_CHECK_CLASS = `${MI_CLASS}__check`;
const MI_CHECK_INPUT_CLASS = `${MI_CLASS}__check-input`;
const MI_CHECK_BOX_CLASS = `${MI_CLASS}__check-box`;

export const medicationItemStyles = `
  :where(.${MI_CLASS}) {
    display: flex;
    align-items: flex-start;
    gap: var(--gap-comfortable);
    padding: var(--inset-input) var(--inset-card);
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    transition: background-color ${transition.default}, border-color ${transition.default};
  }

  :where(.${MI_CLASS}[data-taken="true"]) {
    background: ${cv.surface.page};
  }

  :where(.${MI_CLASS}[data-taken="true"]) .${MI_NAME_CLASS} {
    color: ${cv.textRole.subtle};
    text-decoration: line-through;
  }

  :where(.${MI_ICON_CLASS}) {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: ${radius.md}px;
    background: ${cv.surface.brandSubtle};
    color: ${cv.textRole.brand};
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :where(.${MI_BODY_CLASS}) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--gap-tight);
  }

  :where(.${MI_HEAD_CLASS}) {
    display: flex;
    align-items: baseline;
    gap: ${spacing[6]}px;
    flex-wrap: wrap;
  }

  :where(.${MI_NAME_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
  }

  :where(.${MI_DOSAGE_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${MI_META_CLASS}) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gap-default);
  }

  :where(.${MI_TIMES_CLASS}) {
    display: inline-flex;
    flex-wrap: wrap;
    gap: var(--gap-tight);
  }

  :where(.${MI_TIME_CLASS}) {
    display: inline-flex;
    align-items: center;
    padding: ${spacing[2]}px var(--inset-chip);
    background: ${cv.surface.page};
    color: ${cv.textRole.strong};
    border-radius: ${radius.pill}px;
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    font-weight: ${fontWeight.medium};
  }

  :where(.${MI_NOTE_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${MI_CHECK_CLASS}) {
    flex-shrink: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
  }

  :where(.${MI_CHECK_INPUT_CLASS}) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  :where(.${MI_CHECK_BOX_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: 1.5px solid ${cv.borderRole.normal};
    border-radius: ${radius.pill}px;
    background: ${cv.surface.default};
    color: ${cv.surface.default};
    transition: background-color ${transition.default}, border-color ${transition.default};
  }

  :where(.${MI_CHECK_BOX_CLASS}[data-checked="true"]) {
    background: ${cv.surface.brand};
    border-color: ${cv.borderRole.brand};
  }
`;
