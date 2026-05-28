/* Auto-generated from packages/react/src/PinPad.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, transition, typeScale } from "@nudge-design/tokens";

const PP_CLASS = "nds-pin-pad";
const PP_DOTS_CLASS = `${PP_CLASS}__dots`;
const PP_DOT_CLASS = `${PP_CLASS}__dot`;
const PP_GRID_CLASS = `${PP_CLASS}__grid`;
const PP_KEY_CLASS = `${PP_CLASS}__key`;
const PP_LABEL_CLASS = `${PP_CLASS}__label`;

export const ppStyles = `
  :where(.${PP_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-wide);
    padding: var(--inset-card-large);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${PP_LABEL_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    color: ${cv.textRole.normal};
    font-weight: ${fontWeight.medium};
  }

  :where(.${PP_DOTS_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-comfortable);
  }

  :where(.${PP_DOTS_CLASS}[data-error="true"]) {
    animation: nds-pin-pad-shake 0.4s ease-in-out;
  }

  @keyframes nds-pin-pad-shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }

  :where(.${PP_DOT_CLASS}) {
    width: 12px;
    height: 12px;
    border-radius: 9999px;
    border: 2px solid ${cv.borderRole.normal};
    background: transparent;
    transition: background-color ${transition.default}, border-color ${transition.default};
  }

  :where(.${PP_DOT_CLASS}[data-filled="true"]) {
    background: ${cv.iconRole.strong};
    border-color: ${cv.iconRole.strong};
  }

  :where(.${PP_DOTS_CLASS}[data-error="true"]) .${PP_DOT_CLASS}[data-filled="true"] {
    background: var(--semantic-fill-status-error);
    border-color: var(--semantic-border-status-error);
  }

  :where(.${PP_GRID_CLASS}) {
    display: grid;
    grid-template-columns: repeat(3, 72px);
    gap: var(--gap-comfortable);
  }

  :where(.${PP_KEY_CLASS}) {
    width: 72px;
    height: 72px;
    border-radius: 9999px;
    border: none;
    background: ${cv.surface.section};
    color: ${cv.textRole.normal};
    font-family: inherit;
    font-size: 28px;
    font-weight: ${fontWeight.semibold};
    cursor: pointer;
    transition: background-color ${transition.default}, transform ${transition.default};
  }

  :where(.${PP_KEY_CLASS}:hover) { background: ${cv.borderRole.subtle}; }
  :where(.${PP_KEY_CLASS}:active) { transform: scale(0.96); }

  :where(.${PP_KEY_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${PP_KEY_CLASS}[data-action="true"]) {
    background: transparent;
    color: ${cv.textRole.subtle};
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :where(.${PP_KEY_CLASS}[data-action="true"]:hover) { background: ${cv.surface.section}; }

  :where(.${PP_KEY_CLASS}[data-action="true"]:disabled) {
    color: ${cv.textRole.muted};
    cursor: not-allowed;
  }
  :where(.${PP_KEY_CLASS}[data-action="true"]:disabled:hover) { background: transparent; }
`;
