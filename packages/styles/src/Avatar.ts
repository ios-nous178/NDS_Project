/* Auto-generated from packages/react/src/Avatar.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, typeScale } from "@nudge-design/tokens";

const AV_CLASS = "nds-avatar";
const AV_IMAGE_CLASS = `${AV_CLASS}__image`;
const AV_FALLBACK_CLASS = `${AV_CLASS}__fallback`;

export const avatarStyles = `
  :where(.${AV_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--nds-avatar-size, 48px);
    height: var(--nds-avatar-size, 48px);
    border-radius: var(--nds-avatar-radius, 9999px);
    background: var(--nds-avatar-bg, ${cv.surface.section});
    overflow: hidden;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${AV_IMAGE_CLASS}) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  :where(.${AV_FALLBACK_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: var(--nds-avatar-font-size, ${typeScale.body3.fontSize}px);
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.subtle};
    user-select: none;
  }

  :where(.${AV_FALLBACK_CLASS} svg) {
    width: 60%;
    height: 60%;
  }
`;
