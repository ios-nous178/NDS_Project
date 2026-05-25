/* Auto-generated from packages/react/src/MediaThumbnail.tsx during the @nudge-eap/styles split. */
import { cv, transition } from "@nudge-eap/tokens";

const MT_CLASS = "nds-media-thumbnail";
const MT_IMG_CLASS = `${MT_CLASS}__img`;
const MT_PLACEHOLDER_CLASS = `${MT_CLASS}__placeholder`;

export const mediaThumbnailStyles = `
  :where(.${MT_CLASS}) {
    position: relative;
    display: block;
    overflow: hidden;
    background: ${cv.surface.page};
    box-sizing: border-box;
    line-height: 0;
  }

  :where(.${MT_IMG_CLASS}) {
    width: 100%;
    height: 100%;
    display: block;
    transition: opacity ${transition.default};
  }
  :where(.${MT_IMG_CLASS}[data-loaded="false"]) {
    opacity: 0;
  }
  :where(.${MT_IMG_CLASS}[data-loaded="true"]) {
    opacity: 1;
  }

  :where(.${MT_PLACEHOLDER_CLASS}) {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${cv.iconRole.normal};
    pointer-events: none;
    background: ${cv.surface.page};
  }
`;
