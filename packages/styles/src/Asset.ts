/* Auto-extracted from packages/react/src/Asset.tsx. Keep selectors in sync. */
import { cv, fontFamily, fontWeight, radius, typeScale } from "@nudge-design/tokens";

const AS_CLASS = "nds-asset";
const AS_FRAME_CLASS = `${AS_CLASS}__frame`;
const AS_CONTENT_CLASS = `${AS_CLASS}__content`;
const AS_ACC_CLASS = `${AS_CLASS}__acc`;
const AS_INITIAL_CLASS = `${AS_CLASS}__initial`;

export const assetStyles = `
  :where(.${AS_CLASS}) {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--nds-asset-size, 40px);
    height: var(--nds-asset-size, 40px);
    margin-right: var(--nds-asset-overlap, 0);
    box-sizing: border-box;
    font-family: ${fontFamily.web};
  }

  :where(.${AS_FRAME_CLASS}) {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: var(--nds-asset-bg, ${cv.surface.section});
    border-radius: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :where(.${AS_CLASS}[data-shape="rounded"] .${AS_FRAME_CLASS}) {
    border-radius: var(--nds-asset-radius, ${radius[8]}px);
  }

  :where(.${AS_CLASS}[data-shape="circle"] .${AS_FRAME_CLASS}) {
    border-radius: ${radius.full}px;
  }

  :where(.${AS_CONTENT_CLASS}) {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :where(img.${AS_CONTENT_CLASS}) {
    object-fit: cover;
  }

  :where(.${AS_CLASS}[data-content="icon"] .${AS_CONTENT_CLASS} > *) {
    width: 60%;
    height: 60%;
    color: ${cv.textRole.subtle};
  }

  :where(.${AS_INITIAL_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: calc(var(--nds-asset-size, 40px) * 0.36);
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.subtle};
    line-height: 1;
    user-select: none;
  }

  :where(.${AS_ACC_CLASS}) {
    position: absolute;
    right: 0;
    bottom: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transform: translate(15%, 15%);
    pointer-events: none;
    font-size: ${typeScale.caption1.fontSize}px;
  }
`;
