/* Auto-generated from packages/react/src/OnlineIndicator.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, fontWeight, typeScale } from "@nudge-eap/tokens";

const OI_CLASS = "nds-online-indicator";
const OI_DOT_CLASS = `${OI_CLASS}__dot`;
const OI_LABEL_CLASS = `${OI_CLASS}__label`;

export const oiStyles = `
  :where(.${OI_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-tight);
    font-family: ${fontFamily.web};
  }

  :where(.${OI_DOT_CLASS}) {
    width: var(--nds-presence-size, 8px);
    height: var(--nds-presence-size, 8px);
    border-radius: 9999px;
    background: var(--nds-presence-color, #A0A4AC);
    box-shadow: 0 0 0 2px var(--nds-presence-ring, transparent);
    flex-shrink: 0;
  }

  :where(.${OI_DOT_CLASS}[data-status="online"]) {
    animation: nds-presence-pulse 1.6s ease-in-out infinite;
  }

  @keyframes nds-presence-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(43, 170, 72, 0.45); }
    50% { box-shadow: 0 0 0 4px rgba(43, 170, 72, 0); }
  }

  :where(.${OI_LABEL_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.subtle};
  }
`;
