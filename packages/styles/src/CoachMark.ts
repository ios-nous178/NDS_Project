/* Auto-generated from packages/react/src/CoachMark.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const CM_CLASS = "nds-coach-mark";
const CM_OVERLAY_CLASS = `${CM_CLASS}__overlay`;
const CM_HOLE_CLASS = `${CM_CLASS}__hole`;
const CM_TOOLTIP_CLASS = `${CM_CLASS}__tooltip`;
const CM_STEP_CLASS = `${CM_CLASS}__step`;
const CM_TITLE_CLASS = `${CM_CLASS}__title`;
const CM_DESC_CLASS = `${CM_CLASS}__desc`;
const CM_FOOTER_CLASS = `${CM_CLASS}__footer`;
const CM_DOTS_CLASS = `${CM_CLASS}__dots`;
const CM_DOT_CLASS = `${CM_CLASS}__dot`;
const CM_ACTIONS_CLASS = `${CM_CLASS}__actions`;
const CM_BTN_CLASS = `${CM_CLASS}__btn`;
const CM_SKIP_CLASS = `${CM_CLASS}__skip`;

export const cmStyles = `
  :where(.${CM_OVERLAY_CLASS}) {
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: auto;
  }

  :where(.${CM_HOLE_CLASS}) {
    position: absolute;
    border-radius: ${radius.md}px;
    box-shadow:
      0 0 0 9999px rgba(0, 0, 0, 0.6),
      0 0 0 2px rgba(255, 255, 255, 0.9) inset;
    transition: all ${transition.default};
    pointer-events: none;
  }

  :where(.${CM_TOOLTIP_CLASS}) {
    position: absolute;
    width: 320px;
    max-width: calc(100vw - ${spacing[32]}px);
    padding: var(--semantic-inset-card-large);
    background: ${cv.surface.default};
    border-radius: ${radius.lg}px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22);
    font-family: ${fontFamily.web};
    color: ${cv.textRole.normal};
    z-index: 1;
  }

  :where(.${CM_STEP_CLASS}) {
    display: inline-flex;
    align-items: center;
    padding: 2px var(--semantic-inset-chip);
    border-radius: 9999px;
    background: ${cv.surface.brandSubtle};
    color: ${cv.textRole.brand};
    font-size: ${typeScale.caption2.fontSize}px;
    font-weight: ${fontWeight.semibold};
    margin-bottom: ${spacing[12]}px;
  }

  :where(.${CM_TITLE_CLASS}) {
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    margin: 0 0 ${spacing[6]}px 0;
  }

  :where(.${CM_DESC_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.subtle};
    margin: 0;
  }

  :where(.${CM_FOOTER_CLASS}) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${spacing[20]}px;
    gap: var(--semantic-gap-comfortable);
  }

  :where(.${CM_DOTS_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[6]}px;
  }

  :where(.${CM_DOT_CLASS}) {
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    background: ${cv.borderRole.normal};
    transition: all ${transition.default};
  }

  :where(.${CM_DOT_CLASS}[data-active="true"]) {
    width: 18px;
    background: ${cv.surface.brand};
  }

  :where(.${CM_ACTIONS_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-tight);
  }

  :where(.${CM_SKIP_CLASS}) {
    height: 36px;
    padding: 0 var(--semantic-inset-input);
    border: none;
    background: transparent;
    color: ${cv.textRole.subtle};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.medium};
    border-radius: ${radius.sm}px;
  }

  :where(.${CM_SKIP_CLASS}:hover) {
    background: ${cv.surface.page};
    color: ${cv.textRole.normal};
  }

  :where(.${CM_BTN_CLASS}) {
    height: 36px;
    padding: 0 var(--semantic-inset-card);
    border-radius: ${radius.md}px;
    border: none;
    background: ${cv.surface.brand};
    color: ${cv.button.textDefault};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.bold};
    transition: background-color ${transition.default};
  }

  :where(.${CM_BTN_CLASS}:hover) {
    background: ${cv.fill.brandHover};
  }
`;
