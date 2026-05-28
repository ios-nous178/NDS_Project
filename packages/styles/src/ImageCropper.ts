/* Auto-generated from packages/react/src/ImageCropper.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, typeScale } from "@nudge-design/tokens";

const IC_CLASS = "nds-image-cropper";
const IC_VIEWPORT_CLASS = `${IC_CLASS}__viewport`;
const IC_IMG_CLASS = `${IC_CLASS}__img`;
const IC_OVERLAY_CLASS = `${IC_CLASS}__overlay`;
const IC_CIRCLE_CLASS = `${IC_CLASS}__circle`;
const IC_HINT_CLASS = `${IC_CLASS}__hint`;
const IC_CONTROLS_CLASS = `${IC_CLASS}__controls`;
const IC_LABEL_CLASS = `${IC_CLASS}__label`;
const IC_ZOOM_BTN_CLASS = `${IC_CLASS}__zoom-btn`;
const IC_ZOOM_VALUE_CLASS = `${IC_CLASS}__zoom-value`;
const IC_SLIDER_CLASS = `${IC_CLASS}__slider`;

export const icStyles = `
  :where(.${IC_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--semantic-gap-comfortable);
    font-family: ${fontFamily.web};
  }

  :where(.${IC_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
  }

  :where(.${IC_VIEWPORT_CLASS}) {
    position: relative;
    width: var(--nds-cropper-size, 240px);
    height: var(--nds-cropper-size, 240px);
    background: ${cv.textRole.strong};
    border-radius: ${radius.md}px;
    overflow: hidden;
    user-select: none;
    touch-action: none;
    cursor: grab;
  }

  :where(.${IC_VIEWPORT_CLASS}[data-grabbing="true"]) {
    cursor: grabbing;
  }

  :where(.${IC_IMG_CLASS}) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) translate(var(--nds-cropper-x, 0px), var(--nds-cropper-y, 0px)) scale(var(--nds-cropper-zoom, 1));
    transform-origin: center;
    pointer-events: none;
    user-select: none;
  }

  :where(.${IC_OVERLAY_CLASS}) {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  :where(.${IC_CIRCLE_CLASS}) {
    position: absolute;
    inset: 0;
    /* backdrop vignette 트릭 — 그림자가 아니라 4-방향 fill 용도라 raw 사용 */
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55);
    border: 1.5px solid rgba(255, 255, 255, 0.9);
  }

  :where(.${IC_OVERLAY_CLASS}[data-shape="circle"]) .${IC_CIRCLE_CLASS} {
    border-radius: 9999px;
  }

  :where(.${IC_OVERLAY_CLASS}[data-shape="square"]) .${IC_CIRCLE_CLASS} {
    border-radius: ${radius.md}px;
  }

  :where(.${IC_HINT_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${IC_CONTROLS_CLASS}) {
    width: 100%;
    max-width: 320px;
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-comfortable);
  }

  :where(.${IC_ZOOM_BTN_CLASS}) {
    width: 28px;
    height: 28px;
    border-radius: 9999px;
    border: 1px solid ${cv.borderRole.normal};
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background-color 0.15s ease, border-color 0.15s ease;
  }

  :where(.${IC_ZOOM_BTN_CLASS}:hover:not(:disabled)) {
    background: ${cv.surface.page};
    border-color: ${cv.borderRole.focus};
  }

  :where(.${IC_ZOOM_BTN_CLASS}:disabled) {
    color: ${cv.textRole.muted};
    cursor: not-allowed;
  }

  :where(.${IC_ZOOM_VALUE_CLASS}) {
    min-width: 40px;
    text-align: center;
    font-size: ${typeScale.caption1.fontSize}px;
    font-variant-numeric: tabular-nums;
    color: ${cv.textRole.subtle};
    font-weight: ${fontWeight.medium};
  }

  :where(.${IC_SLIDER_CLASS}) {
    flex: 1;
    accent-color: ${cv.textRole.brand};
    cursor: pointer;
  }
`;
