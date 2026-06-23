/* Auto-generated from packages/react/src/ImageUpload.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, radius, spacing, typeScale } from "@nudge-design/tokens";

const IU_ROOT_CLASS = "nds-image-upload";
const IU_PREVIEW_COL_CLASS = `${IU_ROOT_CLASS}__preview-col`;
const IU_PREVIEW_BOX_CLASS = `${IU_ROOT_CLASS}__preview-box`;
const IU_PREVIEW_IMG_CLASS = `${IU_ROOT_CLASS}__preview-img`;
const IU_REMOVE_BTN_CLASS = `${IU_ROOT_CLASS}__remove-btn`;
const IU_PLACEHOLDER_CLASS = `${IU_ROOT_CLASS}__placeholder`;
const IU_HELPER_CLASS = `${IU_ROOT_CLASS}__helper`;
const IU_ERROR_ICON_CLASS = `${IU_ROOT_CLASS}__error-icon`;
const IU_RIGHT_COL_CLASS = `${IU_ROOT_CLASS}__right-col`;
const IU_UPLOAD_BTN_CLASS = `${IU_ROOT_CLASS}__upload-btn`;
const IU_SIZE_HINT_CLASS = `${IU_ROOT_CLASS}__size-hint`;

export const imageUploadStyles = `
  :where(.${IU_ROOT_CLASS}) {
    display: inline-flex;
    align-items: flex-start;
    gap: ${spacing[24]}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${IU_PREVIEW_COL_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
  }

  :where(.${IU_PREVIEW_BOX_CLASS}) {
    position: relative;
    width: 150px;
    height: 150px;
    box-sizing: border-box;
    border-radius: ${radius[8]}px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Empty: dashed border, neutral subtle bg */
  :where(.${IU_PREVIEW_BOX_CLASS}[data-state="empty"]) {
    background: ${cv.surface.subtle};
    border: var(--stroke-default) dashed ${cv.borderRole.normal};
  }

  /* Uploaded: solid border, image fills */
  :where(.${IU_PREVIEW_BOX_CLASS}[data-state="uploaded"]) {
    background: ${cv.surface.subtle};
    border: var(--stroke-default) solid ${cv.borderRole.normal};
  }

  /* Error: dashed red border + soft red bg */
  :where(.${IU_PREVIEW_BOX_CLASS}[data-state="error"]) {
    background: ${cv.surface.statusError};
    border: var(--stroke-default) dashed ${cv.fill.statusError};
  }

  :where(.${IU_PREVIEW_IMG_CLASS}) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  :where(.${IU_REMOVE_BTN_CLASS}) {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 24px;
    height: 24px;
    padding: 0;
    border: 0;
    border-radius: 9999px;
    background: ${cv.fill.statusError};
    color: ${cv.textRole.inverse};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  :where(.${IU_PLACEHOLDER_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: 500;
    color: ${cv.textRole.muted};
  }

  :where(.${IU_PREVIEW_BOX_CLASS}[data-state="error"] .${IU_PLACEHOLDER_CLASS}) {
    color: ${cv.textRole.statusError};
  }

  :where(.${IU_HELPER_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[4]}px;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.input.helpertextDefault};
  }

  :where(.${IU_HELPER_CLASS}[data-state="error"]) {
    color: ${cv.textRole.statusError};
  }

  :where(.${IU_ERROR_ICON_CLASS}) {
    width: 14px;
    height: 14px;
    display: inline-flex;
    color: ${cv.textRole.statusError};
  }

  :where(.${IU_RIGHT_COL_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[12]}px;
    align-items: flex-start;
  }

  :where(.${IU_UPLOAD_BTN_CLASS}) {
    appearance: none;
    border: 0;
    width: 135px;
    height: 44px;
    border-radius: ${radius[8]}px;
    background: ${cv.fill.neutralSubtle};
    color: ${cv.textRole.normal};
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :where(.${IU_UPLOAD_BTN_CLASS}:disabled) {
    cursor: not-allowed;
    opacity: 0.6;
  }

  :where(.${IU_SIZE_HINT_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
  }
`;
