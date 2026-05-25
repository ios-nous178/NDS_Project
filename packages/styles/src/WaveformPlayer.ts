/* Auto-generated from packages/react/src/WaveformPlayer.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, fontWeight, transition, typeScale } from "@nudge-eap/tokens";

const WP_CLASS = "nds-waveform-player";
const WP_BTN_CLASS = `${WP_CLASS}__btn`;
const WP_BARS_CLASS = `${WP_CLASS}__bars`;
const WP_BAR_CLASS = `${WP_CLASS}__bar`;
const WP_TIME_CLASS = `${WP_CLASS}__time`;

export const wpStyles = `
  :where(.${WP_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-comfortable);
    padding: var(--inset-chip) var(--inset-input);
    background: ${cv.surface.section};
    border-radius: 9999px;
    font-family: ${fontFamily.web};
    color: ${cv.textRole.normal};
    box-sizing: border-box;
  }

  :where(.${WP_BTN_CLASS}) {
    width: 32px;
    height: 32px;
    border-radius: 9999px;
    border: none;
    background: var(--nds-waveform-color, ${cv.surface.brand});
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: opacity ${transition.default};
  }

  :where(.${WP_BTN_CLASS}:hover) { opacity: 0.85; }

  :where(.${WP_BARS_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    height: 32px;
    cursor: pointer;
    flex: 1;
  }

  :where(.${WP_BAR_CLASS}) {
    flex: 1;
    height: var(--bar-h, 50%);
    min-width: 2px;
    max-width: 4px;
    background: ${cv.borderRole.normal};
    border-radius: 2px;
    transition: background-color ${transition.default};
  }

  :where(.${WP_BAR_CLASS}[data-played="true"]) {
    background: var(--nds-waveform-color, ${cv.surface.brand});
  }

  :where(.${WP_TIME_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.subtle};
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
  }
`;
