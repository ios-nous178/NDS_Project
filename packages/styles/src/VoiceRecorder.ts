/* Auto-generated from packages/react/src/VoiceRecorder.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, fontWeight, radius, transition, typeScale } from "@nudge-eap/tokens";

const VR_CLASS = "nds-voice-recorder";
const VR_BTN_CLASS = `${VR_CLASS}__btn`;
const VR_TIMER_CLASS = `${VR_CLASS}__timer`;
const VR_INDICATOR_CLASS = `${VR_CLASS}__indicator`;
const VR_LABEL_CLASS = `${VR_CLASS}__label`;
const VR_INFO_CLASS = `${VR_CLASS}__info`;

export const vrStyles = `
  :where(.${VR_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-comfortable);
    padding: var(--inset-card-large);
    background: ${cv.surface.section};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    min-width: 220px;
  }

  :where(.${VR_BTN_CLASS}) {
    width: 80px;
    height: 80px;
    border-radius: 9999px;
    border: none;
    background: var(--semantic-fill-status-error);
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform ${transition.default}, box-shadow ${transition.default};
    /* red-tinted glow — recording 강조용 의도된 brand-error shadow, raw 사용 */
    box-shadow: 0 4px 12px rgba(224, 77, 77, 0.32);
  }

  :where(.${VR_BTN_CLASS}:hover) { transform: scale(1.04); }

  :where(.${VR_BTN_CLASS}:focus-visible) {
    outline: 3px solid ${cv.borderRole.brand};
    outline-offset: 4px;
  }

  :where(.${VR_BTN_CLASS}[data-state="recording"]) {
    animation: nds-voice-recorder-pulse 1.4s ease-in-out infinite;
  }

  @keyframes nds-voice-recorder-pulse {
    0%, 100% { box-shadow: 0 4px 12px rgba(224, 77, 77, 0.32); }
    50% { box-shadow: 0 4px 24px rgba(224, 77, 77, 0.6), 0 0 0 8px rgba(224, 77, 77, 0.18); }
  }

  :where(.${VR_TIMER_CLASS}) {
    font-size: 28px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    font-variant-numeric: tabular-nums;
  }

  :where(.${VR_INDICATOR_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-tight);
    color: var(--semantic-text-status-error);
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
  }

  :where(.${VR_INDICATOR_CLASS})::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 9999px;
    background: currentColor;
    animation: nds-voice-recorder-blink 1s ease-in-out infinite;
  }

  @keyframes nds-voice-recorder-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  :where(.${VR_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${VR_INFO_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-tight);
  }
`;
