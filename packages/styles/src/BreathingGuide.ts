/* Auto-generated from packages/react/src/BreathingGuide.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, spacing, typeScale } from "@nudge-design/tokens";

const BG_CLASS = "nds-breathing-guide";
const BG_STAGE_CLASS = `${BG_CLASS}__stage`;
const BG_CIRCLE_CLASS = `${BG_CLASS}__circle`;
const BG_LABEL_CLASS = `${BG_CLASS}__label`;
const BG_COUNT_CLASS = `${BG_CLASS}__count`;
const BG_INFO_CLASS = `${BG_CLASS}__info`;
const BG_CONTROLS_CLASS = `${BG_CLASS}__controls`;
const BG_BTN_CLASS = `${BG_CLASS}__btn`;

export const breathingStyles = `
  :where(.${BG_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${spacing[20]}px;
    padding: var(--semantic-inset-modal);
    background: var(--nds-breathing-bg, ${cv.surface.section});
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${BG_STAGE_CLASS}) {
    position: relative;
    width: var(--nds-breathing-stage, 220px);
    height: var(--nds-breathing-stage, 220px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :where(.${BG_CIRCLE_CLASS}) {
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background: var(--nds-breathing-color, ${cv.surface.brand});
    opacity: 0.3;
    transform: scale(var(--nds-breathing-scale, 0.5));
    transition: transform var(--nds-breathing-duration, 4s) ease-in-out,
      opacity var(--nds-breathing-duration, 4s) ease-in-out;
  }

  :where(.${BG_CIRCLE_CLASS}[data-kind="inhale"]) { transform: scale(1); opacity: 0.5; }
  :where(.${BG_CIRCLE_CLASS}[data-kind="hold"]) { transform: scale(1); opacity: 0.5; }
  :where(.${BG_CIRCLE_CLASS}[data-kind="exhale"]) { transform: scale(0.45); opacity: 0.3; }
  :where(.${BG_CIRCLE_CLASS}[data-kind="rest"]) { transform: scale(0.45); opacity: 0.25; }

  :where(.${BG_INFO_CLASS}) {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--semantic-gap-tight);
  }

  :where(.${BG_LABEL_CLASS}) {
    font-size: ${typeScale.headline4.fontSize}px;
    line-height: ${typeScale.headline4.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    margin: 0;
    text-align: center;
  }

  :where(.${BG_COUNT_CLASS}) {
    font-size: 36px;
    line-height: 1;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.brand};
    margin: 0;
    font-variant-numeric: tabular-nums;
  }

  :where(.${BG_CONTROLS_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-comfortable);
  }

  :where(.${BG_BTN_CLASS}) {
    height: 40px;
    padding: 0 var(--semantic-inset-card);
    border-radius: 9999px;
    border: 1px solid ${cv.borderRole.normal};
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
  }

  :where(.${BG_BTN_CLASS}[data-primary="true"]) {
    background: ${cv.surface.brand};
    color: #fff;
    border-color: transparent;
  }
`;
