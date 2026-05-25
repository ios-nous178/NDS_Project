/* Auto-generated from packages/react/src/VotePoll.tsx during the @nudge-eap/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

const VP_CLASS = "nds-vote-poll";
const VP_QUESTION_CLASS = `${VP_CLASS}__question`;
const VP_OPTIONS_CLASS = `${VP_CLASS}__options`;
const VP_OPTION_CLASS = `${VP_CLASS}__option`;
const VP_BAR_CLASS = `${VP_CLASS}__bar`;
const VP_LABEL_CLASS = `${VP_CLASS}__label`;
const VP_PCT_CLASS = `${VP_CLASS}__pct`;
const VP_FOOTER_CLASS = `${VP_CLASS}__footer`;

export const vpStyles = `
  :where(.${VP_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-comfortable);
    padding: var(--inset-card) var(--inset-card-large);
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${VP_QUESTION_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    margin: 0;
  }

  :where(.${VP_OPTIONS_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-default);
  }

  :where(.${VP_OPTION_CLASS}) {
    position: relative;
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 var(--inset-input);
    border: 1px solid ${cv.borderRole.normal};
    border-radius: ${radius.md}px;
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    cursor: pointer;
    overflow: hidden;
    text-align: left;
    transition: background-color ${transition.default}, border-color ${transition.default};
  }

  :where(.${VP_OPTION_CLASS}:hover:not([disabled])) {
    background: ${cv.surface.section};
  }

  :where(.${VP_OPTION_CLASS}[data-voted="true"]) {
    border-color: ${cv.borderRole.brand};
    color: ${cv.textRole.brand};
    font-weight: ${fontWeight.semibold};
  }

  :where(.${VP_OPTION_CLASS}[disabled]) {
    cursor: not-allowed;
    opacity: 0.6;
  }

  :where(.${VP_BAR_CLASS}) {
    position: absolute;
    inset: 0;
    background: var(--semantic-bg-status-info);
    width: var(--nds-vote-pct, 0%);
    transition: width 480ms ease;
    z-index: 0;
  }

  :where(.${VP_OPTION_CLASS}[data-voted="true"]) .${VP_BAR_CLASS} {
    background: var(--semantic-bg-brand-subtle);
  }

  :where(.${VP_LABEL_CLASS}),
  :where(.${VP_PCT_CLASS}) {
    position: relative;
    z-index: 1;
  }

  :where(.${VP_LABEL_CLASS}) { flex: 1; }

  :where(.${VP_PCT_CLASS}) {
    margin-left: ${spacing[8]}px;
    color: ${cv.textRole.subtle};
    font-variant-numeric: tabular-nums;
  }

  :where(.${VP_OPTION_CLASS}[data-voted="true"]) .${VP_PCT_CLASS} {
    color: ${cv.textRole.brand};
    font-weight: ${fontWeight.semibold};
  }

  :where(.${VP_FOOTER_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    color: ${cv.textRole.subtle};
  }
`;
