/* Auto-generated from packages/react/src/Checkbox.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, transition, typeScale } from "@nudge-design/tokens";

const CB_CLASS = "nds-checkbox";
const CB_ROOT_CLASS = `${CB_CLASS}__root`;
const CB_INPUT_CLASS = `${CB_CLASS}__input`;
const CB_INDICATOR_CLASS = `${CB_CLASS}__indicator`;
const CB_CHECK_ICON_CLASS = `${CB_CLASS}__check`;
const CB_MINUS_ICON_CLASS = `${CB_CLASS}__minus`;
const CB_LABEL_CLASS = `${CB_CLASS}__label`;
const CB_HELPER_CLASS = `${CB_CLASS}__helper`;
const CB_GROUP_CLASS = `${CB_CLASS}-group`;

export const checkboxStyles = `
  :where(.${CB_ROOT_CLASS}) {
    position: relative;
    display: inline-flex;
    align-items: flex-start;
    gap: var(--semantic-gap-comfortable);
    cursor: pointer;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${CB_ROOT_CLASS}[data-disabled="true"]) {
    cursor: not-allowed;
  }

  :where(.${CB_INPUT_CLASS}) {
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

  :where(.${CB_INPUT_CLASS}:focus-visible + .${CB_INDICATOR_CLASS}) {
    box-shadow: 0 0 0 2px ${cv.surface.default}, 0 0 0 4px ${cv.borderRole.focus};
  }

  :where(.${CB_INDICATOR_CLASS}) {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--nds-checkbox-size, 18px);
    height: var(--nds-checkbox-size, 18px);
    margin-top: 2px;
    border: var(--nds-checkbox-border-width, 1.5px) solid var(--nds-checkbox-border-color, ${cv.borderRole.normal});
    border-radius: var(--nds-checkbox-radius, ${radius.sm}px);
    background: ${cv.surface.default};
    transition: border-color ${transition.default}, background-color ${transition.default};
  }

  :where(.${CB_INDICATOR_CLASS}[data-state="checked"]),
  :where(.${CB_INDICATOR_CLASS}[data-state="indeterminate"]) {
    border-color: ${cv.fill.brand};
    background: ${cv.fill.brand};
  }

  :where(.${CB_ROOT_CLASS}[data-disabled="true"]) {
    opacity: var(--nds-checkbox-disabled-opacity, 1);
  }

  :where(.${CB_ROOT_CLASS}[data-disabled="true"] .${CB_INDICATOR_CLASS}) {
    border-color: var(--nds-checkbox-disabled-border-color, ${cv.borderRole.disabled});
    background: var(--nds-checkbox-disabled-bg, ${cv.surface.disabled});
  }

  :where(.${CB_ROOT_CLASS}[data-disabled="true"] .${CB_INDICATOR_CLASS}[data-state="checked"]) {
    background: var(--nds-checkbox-disabled-checked-bg, ${cv.surface.disabled});
    border-color: var(--nds-checkbox-disabled-checked-border-color, var(--nds-checkbox-disabled-border-color, ${cv.borderRole.disabled}));
  }

  :where(.${CB_CHECK_ICON_CLASS}),
  :where(.${CB_MINUS_ICON_CLASS}) {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 14px;
    height: 14px;
    opacity: 0;
    transition: opacity ${transition.default};
    color: ${cv.surface.default};
  }

  :where(.${CB_ROOT_CLASS}[data-disabled="true"] .${CB_CHECK_ICON_CLASS}),
  :where(.${CB_ROOT_CLASS}[data-disabled="true"] .${CB_MINUS_ICON_CLASS}) {
    color: ${cv.iconRole.disabled};
  }

  :where(.${CB_INDICATOR_CLASS}[data-state="checked"] .${CB_CHECK_ICON_CLASS}) {
    opacity: 1;
  }

  :where(.${CB_INDICATOR_CLASS}[data-state="indeterminate"] .${CB_MINUS_ICON_CLASS}) {
    opacity: 1;
  }

  :where(.${CB_LABEL_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
    user-select: none;
  }

  :where(.${CB_ROOT_CLASS}[data-disabled="true"] .${CB_LABEL_CLASS}) {
    color: ${cv.textRole.disabled};
  }

  :where(.${CB_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.muted};
    margin-left: 32px;
  }

  :where(.${CB_HELPER_CLASS}[data-error="true"]) {
    color: ${cv.textRole.statusError};
  }

  :where(.${CB_GROUP_CLASS}) {
    display: flex;
    flex-direction: var(--nds-checkbox-group-direction, column);
    gap: var(--nds-checkbox-group-gap, var(--nds-choice-group-gap, var(--semantic-gap-comfortable)));
    font-family: ${fontFamily.web};
  }

  :where(.${CB_GROUP_CLASS}[data-layout="horizontal"]) {
    --nds-checkbox-group-direction: row;
  }
`;
