/* Auto-generated from packages/react/src/AttachmentItem.tsx during the @nudge-eap/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

const AT_CLASS = "nds-attachment-item";
const AT_ICON_CLASS = `${AT_CLASS}__icon`;
const AT_BODY_CLASS = `${AT_CLASS}__body`;
const AT_NAME_CLASS = `${AT_CLASS}__name`;
const AT_META_CLASS = `${AT_CLASS}__meta`;
const AT_STATUS_CLASS = `${AT_CLASS}__status`;
const AT_PROGRESS_CLASS = `${AT_CLASS}__progress`;
const AT_PROGRESS_FILL_CLASS = `${AT_CLASS}__progress-fill`;
const AT_ACTIONS_CLASS = `${AT_CLASS}__actions`;
const AT_BTN_CLASS = `${AT_CLASS}__btn`;
const AT_ERROR_CLASS = `${AT_CLASS}__error`;

export const attachmentItemStyles = `
  :where(.${AT_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--gap-comfortable);
    padding: ${spacing[10]}px var(--inset-input);
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    width: 100%;
    transition: border-color ${transition.default}, background-color ${transition.default};
  }

  :where(.${AT_CLASS}[data-status="error"]) {
    border-color: ${cv.borderRole.statusError};
    background: ${cv.surface.statusError};
  }

  :where(.${AT_ICON_CLASS}) {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: ${radius.sm}px;
    background: ${cv.surface.page};
    color: ${cv.iconRole.normal};
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  :where(.${AT_ICON_CLASS}[data-type="pdf"]) {
    background: ${cv.surface.statusError};
    color: ${cv.textRole.statusError};
  }
  :where(.${AT_ICON_CLASS}[data-type="image"]) {
    background: ${cv.surface.brandSubtle};
    color: ${cv.textRole.brand};
  }
  :where(.${AT_ICON_CLASS}[data-type="video"]),
  :where(.${AT_ICON_CLASS}[data-type="audio"]) {
    background: ${cv.surface.statusCaution};
    color: ${cv.textRole.statusCaution};
  }
  :where(.${AT_ICON_CLASS}[data-type="document"]) {
    background: ${cv.surface.statusSuccess};
    color: ${cv.iconRole.statusSuccess};
  }

  :where(.${AT_BODY_CLASS}) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: ${spacing[2]}px;
  }

  :where(.${AT_NAME_CLASS}) {
    color: ${cv.textRole.normal};
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${AT_META_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[6]}px;
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    color: ${cv.textRole.subtle};
    font-variant-numeric: tabular-nums;
  }

  :where(.${AT_STATUS_CLASS}) {
    color: ${cv.textRole.subtle};
  }
  :where(.${AT_STATUS_CLASS}[data-status="uploading"]) { color: ${cv.textRole.brand}; }
  :where(.${AT_STATUS_CLASS}[data-status="error"])     { color: ${cv.textRole.statusError}; }
  :where(.${AT_STATUS_CLASS}[data-status="done"])      { color: ${cv.iconRole.statusSuccess}; }

  :where(.${AT_PROGRESS_CLASS}) {
    width: 100%;
    height: 3px;
    margin-top: ${spacing[4]}px;
    background: ${cv.surface.disabled};
    border-radius: ${radius.pill}px;
    overflow: hidden;
  }
  :where(.${AT_PROGRESS_FILL_CLASS}) {
    height: 100%;
    background: ${cv.surface.brand};
    border-radius: inherit;
    transition: width ${transition.default};
  }

  :where(.${AT_ACTIONS_CLASS}) {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: var(--gap-tight);
  }

  :where(.${AT_BTN_CLASS}) {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: ${radius.pill}px;
    color: ${cv.iconRole.normal};
    cursor: pointer;
    transition: background-color ${transition.default}, color ${transition.default};
  }
  :where(.${AT_BTN_CLASS}:hover) {
    background: ${cv.surface.page};
    color: ${cv.textRole.normal};
  }

  :where(.${AT_ERROR_CLASS}) {
    color: ${cv.textRole.statusError};
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
  }
`;
