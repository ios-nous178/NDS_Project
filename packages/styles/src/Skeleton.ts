/* Auto-generated from packages/react/src/Skeleton.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, radius } from "@nudge-eap/tokens";

const SK_CLASS = "nds-skeleton";

export const skeletonStyles = `
  @keyframes nds-skeleton-pulse {
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
  }

  :where(.${SK_CLASS}) {
    display: block;
    background: var(--nds-skeleton-bg, ${cv.surface.disabled});
    animation: nds-skeleton-pulse 1.5s ease-in-out infinite;
    border-radius: var(--nds-skeleton-radius, ${radius.md}px);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${SK_CLASS}[data-variant="circular"]) {
    border-radius: ${radius.pill}px;
  }

  :where(.${SK_CLASS}[data-variant="text"]) {
    border-radius: ${radius.sm}px;
    height: 1em;
    transform: scale(1, 0.6);
    transform-origin: 0 60%;
  }

  @media (prefers-reduced-motion: reduce) {
    :where(.${SK_CLASS}) {
      animation: none;
    }
  }
`;
