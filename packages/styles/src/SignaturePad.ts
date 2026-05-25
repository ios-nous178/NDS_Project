/* Auto-generated from packages/react/src/SignaturePad.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, fontWeight, radius, transition, typeScale } from "@nudge-eap/tokens";

const SP_CLASS = "nds-signature-pad";
const SP_LABEL_CLASS = `${SP_CLASS}__label`;
const SP_CANVAS_WRAP_CLASS = `${SP_CLASS}__canvas-wrap`;
const SP_CANVAS_CLASS = `${SP_CLASS}__canvas`;
const SP_PLACEHOLDER_CLASS = `${SP_CLASS}__placeholder`;
const SP_CONTROLS_CLASS = `${SP_CLASS}__controls`;
const SP_BTN_CLASS = `${SP_CLASS}__btn`;

export const sigStyles = `
  :where(.${SP_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-default);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${SP_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
  }

  :where(.${SP_CANVAS_WRAP_CLASS}) {
    position: relative;
    width: 100%;
    background: ${cv.surface.section};
    border: 1px dashed ${cv.borderRole.normal};
    border-radius: ${radius.md}px;
    overflow: hidden;
    touch-action: none;
  }

  :where(.${SP_CANVAS_WRAP_CLASS}[data-disabled="true"]) {
    opacity: 0.5;
    pointer-events: none;
  }

  :where(.${SP_CANVAS_CLASS}) {
    display: block;
    width: 100%;
    height: 100%;
    cursor: crosshair;
  }

  :where(.${SP_PLACEHOLDER_CLASS}) {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${cv.textRole.muted};
    font-size: ${typeScale.body3.fontSize}px;
    pointer-events: none;
  }

  :where(.${SP_CONTROLS_CLASS}) {
    display: flex;
    justify-content: flex-end;
    gap: var(--gap-default);
  }

  :where(.${SP_BTN_CLASS}) {
    height: 32px;
    padding: 0 var(--inset-input);
    border-radius: ${radius.md}px;
    border: 1px solid ${cv.borderRole.normal};
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
    transition: background-color ${transition.default};
  }

  :where(.${SP_BTN_CLASS}:hover) { background: ${cv.surface.section}; }
`;
