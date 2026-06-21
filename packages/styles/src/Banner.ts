/* Auto-generated from packages/react/src/Banner.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const BN_CLASS = "nds-banner";
const BN_CONTENT_CLASS = `${BN_CLASS}__content`;
const BN_TITLE_CLASS = `${BN_CLASS}__title`;
const BN_DESC_CLASS = `${BN_CLASS}__description`;
const BN_ACTION_CLASS = `${BN_CLASS}__action`;
const BN_IMAGE_CLASS = `${BN_CLASS}__image`;
const BN_CLOSE_CLASS = `${BN_CLASS}__close`;

export const bannerStyles = `
  :where(.${BN_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: var(--nds-banner-padding, var(--semantic-inset-card-large) var(--semantic-inset-modal));
    background: var(--nds-banner-background, ${cv.surface.section});
    border-radius: var(--nds-banner-radius, ${radius[12]}px);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    transition: background-color ${transition.default};
  }

  :where(.${BN_CLASS}[data-variant="outlined"]) {
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
  }

  :where(.${BN_CLASS}[data-variant="image"]) {
    padding: 0;
    background: none;
    border-radius: 0;
  }

  :where(.${BN_CLASS}[data-clickable="true"]) {
    cursor: pointer;
  }

  :where(.${BN_CLASS}[data-clickable="true"]:hover) {
    opacity: 0.95;
  }

  :where(.${BN_CONTENT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-tight);
    min-width: 0;
    flex: 1;
  }

  :where(.${BN_TITLE_CLASS}) {
    font-size: var(--nds-banner-title-font-size, ${typeScale.headline5.fontSize}px);
    font-weight: var(--nds-banner-title-font-weight, ${fontWeight.bold});
    line-height: var(--nds-banner-title-line-height, 1.36);
    color: var(--nds-banner-title-color, ${cv.textRole.normal});
  }

  :where(.${BN_DESC_CLASS}) {
    font-size: var(--nds-banner-desc-font-size, ${typeScale.body2.fontSize}px);
    line-height: 1.47;
    color: var(--nds-banner-desc-color, ${cv.textRole.subtle});
  }

  :where(.${BN_ACTION_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-tight);
    margin-top: ${spacing[8]}px;
    font-size: var(--nds-banner-action-font-size, ${typeScale.body1.fontSize}px);
    font-weight: ${fontWeight.bold};
    color: var(--nds-banner-action-color, ${cv.textRole.brand});
    cursor: pointer;
    text-decoration: none;
    background: none;
    border: none;
    padding: 0;
    font-family: inherit;
  }

  :where(.${BN_ACTION_CLASS}:hover) {
    text-decoration: underline;
  }

  :where(.${BN_IMAGE_CLASS}) {
    flex-shrink: 0;
    object-fit: contain;
  }

  :where(.${BN_CLASS}[data-variant="image"]) .${BN_IMAGE_CLASS} {
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  :where(.${BN_CLOSE_CLASS}) {
    all: unset;
    position: absolute;
    top: ${spacing[12]}px;
    right: ${spacing[12]}px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    cursor: pointer;
    color: ${cv.iconRole.normal};
    border-radius: ${radius.full}px;
    transition: background-color ${transition.default};
  }

  :where(.${BN_CLOSE_CLASS}:hover) {
    background: ${cv.surface.subtle};
  }
`;
