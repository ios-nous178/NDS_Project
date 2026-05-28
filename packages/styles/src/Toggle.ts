/* Auto-generated from packages/react/src/Toggle.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, typeScale } from "@nudge-design/tokens";

const TG_CLASS = "nds-toggle";
const TG_TRACK_CLASS = `${TG_CLASS}__track`;
const TG_THUMB_CLASS = `${TG_CLASS}__thumb`;
const TG_LABEL_CLASS = `${TG_CLASS}__label`;

export const toggleStyles = `
  :where(.${TG_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    cursor: pointer;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${TG_CLASS}[data-disabled="true"]) {
    cursor: not-allowed;
  }

  :where(.${TG_CLASS}) input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  :where(.${TG_CLASS}) input:focus-visible + .${TG_TRACK_CLASS} {
    box-shadow: 0 0 0 2px ${cv.surface.default}, 0 0 0 4px ${cv.borderRole.focus};
  }

  :where(.${TG_TRACK_CLASS}) {
    position: relative;
    width: var(--nds-toggle-track-w, 44px);
    height: var(--nds-toggle-track-h, 24px);
    border-radius: ${radius.pill}px;
    background: var(--nds-toggle-track-bg, ${cv.borderRole.normal});
    transition: background-color 0.2s ease;
    flex-shrink: 0;
  }

  :where(.${TG_TRACK_CLASS}[data-checked="true"]) {
    background: var(--nds-toggle-track-active-bg, ${cv.fill.brand});
  }

  :where(.${TG_CLASS}[data-disabled="true"] .${TG_TRACK_CLASS}) {
    background: ${cv.borderRole.disabled};
  }

  :where(.${TG_CLASS}[data-disabled="true"] .${TG_TRACK_CLASS}[data-checked="true"]) {
    background: ${cv.borderRole.disabled};
  }

  :where(.${TG_THUMB_CLASS}) {
    position: absolute;
    top: var(--nds-toggle-thumb-offset, 3px);
    left: var(--nds-toggle-thumb-offset, 3px);
    width: var(--nds-toggle-thumb-size, 18px);
    height: var(--nds-toggle-thumb-size, 18px);
    border-radius: ${radius.pill}px;
    background: ${cv.surface.default};
    box-shadow: var(--nds-toggle-thumb-shadow, 0 1px 3px rgba(0, 0, 0, 0.15));
    transition: transform 0.2s ease;
  }

  :where(.${TG_TRACK_CLASS}[data-checked="true"]) .${TG_THUMB_CLASS} {
    transform: translateX(var(--nds-toggle-thumb-travel, 20px));
  }

  :where(.${TG_CLASS}[data-disabled="true"] .${TG_THUMB_CLASS}) {
    background: ${cv.surface.subtle};
  }

  :where(.${TG_LABEL_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
    user-select: none;
  }

  :where(.${TG_CLASS}[data-disabled="true"] .${TG_LABEL_CLASS}) {
    color: ${cv.textRole.disabled};
  }
`;
