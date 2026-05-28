/* Auto-generated from packages/react/src/PhoneInput.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  shadow,
  sizing,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const PI_CLASS = "nds-phone-input";
const PI_ROOT_CLASS = `${PI_CLASS}__root`;
const PI_LABEL_CLASS = `${PI_CLASS}__label`;
const PI_FIELD_CLASS = `${PI_CLASS}__field`;
const PI_FIELD_WRAP_CLASS = `${PI_CLASS}__field-wrap`;
const PI_DIAL_CLASS = `${PI_CLASS}__dial`;
const PI_CHEVRON_CLASS = `${PI_CLASS}__chevron`;
const PI_FLAG_CLASS = `${PI_CLASS}__flag`;
const PI_DIVIDER_CLASS = `${PI_CLASS}__divider`;
const PI_INPUT_CLASS = `${PI_CLASS}__input`;
const PI_HELPER_CLASS = `${PI_CLASS}__helper`;
const PI_MENU_CLASS = `${PI_CLASS}__menu`;
const PI_MENU_ITEM_CLASS = `${PI_CLASS}__menu-item`;
const PI_MENU_NAME_CLASS = `${PI_CLASS}__menu-name`;
const PI_MENU_DIAL_CLASS = `${PI_CLASS}__menu-dial`;

export const phoneInputStyles = `
  :where(.${PI_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-default);
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${PI_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
  }

  :where(.${PI_FIELD_WRAP_CLASS}) {
    position: relative;
  }

  :where(.${PI_FIELD_CLASS}) {
    display: flex;
    align-items: stretch;
    height: ${sizing.input.default}px;
    border: 1px solid ${cv.borderRole.normal};
    border-radius: ${radius.md}px;
    background: ${cv.surface.default};
    overflow: hidden;
    transition: border-color ${transition.default};
  }

  :where(.${PI_FIELD_CLASS}:focus-within) { border-color: ${cv.borderRole.brand}; }

  :where(.${PI_FIELD_CLASS}[data-error="true"]) { border-color: var(--semantic-border-status-error); }

  :where(.${PI_DIAL_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[6]}px;
    padding: 0 var(--inset-input);
    border: none;
    background: transparent;
    color: ${cv.textRole.normal};
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.medium};
    cursor: pointer;
    flex-shrink: 0;
    transition: background-color ${transition.default};
  }

  :where(.${PI_DIAL_CLASS}:hover:not(:disabled)) {
    background: ${cv.surface.page};
  }

  :where(.${PI_DIAL_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: -2px;
  }

  :where(.${PI_DIAL_CLASS}:disabled) { cursor: not-allowed; opacity: 0.6; }

  :where(.${PI_FLAG_CLASS}) {
    font-size: 18px;
    line-height: 1;
  }

  :where(.${PI_CHEVRON_CLASS}) {
    color: ${cv.textRole.subtle};
    transition: transform ${transition.default};
    display: inline-flex;
  }

  :where(.${PI_DIAL_CLASS}[aria-expanded="true"]) .${PI_CHEVRON_CLASS} {
    transform: rotate(180deg);
  }

  :where(.${PI_MENU_CLASS}) {
    position: absolute;
    top: calc(100% + ${spacing[4]}px);
    left: 0;
    z-index: 10;
    min-width: 240px;
    max-height: 280px;
    overflow-y: auto;
    padding: ${spacing[4]}px;
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    box-shadow: ${shadow["2"]};
    list-style: none;
    margin: 0;
  }

  :where(.${PI_MENU_ITEM_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--gap-default);
    width: 100%;
    padding: var(--inset-chip) ${spacing[10]}px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: ${radius.sm}px;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    color: ${cv.textRole.normal};
    text-align: left;
    transition: background-color ${transition.default};
  }

  :where(.${PI_MENU_ITEM_CLASS}:hover),
  :where(.${PI_MENU_ITEM_CLASS}[data-selected="true"]) {
    background: ${cv.surface.page};
  }

  :where(.${PI_MENU_NAME_CLASS}) {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${PI_MENU_DIAL_CLASS}) {
    color: ${cv.textRole.subtle};
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
  }

  :where(.${PI_DIVIDER_CLASS}) {
    width: 1px;
    background: ${cv.borderRole.normal};
    flex-shrink: 0;
  }

  :where(.${PI_INPUT_CLASS}) {
    flex: 1;
    min-width: 0;
    padding: 0 var(--inset-input);
    border: none;
    background: transparent;
    outline: none;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  :where(.${PI_INPUT_CLASS}::placeholder) { color: ${cv.textRole.muted}; }

  :where(.${PI_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${PI_HELPER_CLASS}[data-error="true"]) { color: var(--semantic-text-status-error); }
`;
