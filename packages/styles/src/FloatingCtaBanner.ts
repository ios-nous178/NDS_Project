/* Auto-generated from packages/react/src/FloatingCtaBanner.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  shadow,
  spacing,
  transition,
  typeScale,
  zIndex,
} from "@nudge-design/tokens";

const FCB_ROOT_CLASS = "nds-floating-cta-banner";
const FCB_ICON_CLASS = `${FCB_ROOT_CLASS}__icon`;
const FCB_TEXT_CLASS = `${FCB_ROOT_CLASS}__text`;
const FCB_CAPTION_CLASS = `${FCB_ROOT_CLASS}__caption`;
const FCB_CTA_ROW_CLASS = `${FCB_ROOT_CLASS}__cta-row`;
const FCB_CTA_TEXT_CLASS = `${FCB_ROOT_CLASS}__cta-text`;
const FCB_ARROW_CLASS = `${FCB_ROOT_CLASS}__arrow`;

export const floatingCtaBannerStyles = `
  :where(.${FCB_ROOT_CLASS}) {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.brand};
    border-radius: ${radius.full}px;
    box-shadow: ${shadow["2"]};
    cursor: pointer;
    font-family: ${fontFamily.web};
    text-align: left;
    text-decoration: none;
    color: inherit;
    transition:
      transform ${transition.default},
      box-shadow ${transition.default};
  }

  :where(.${FCB_ROOT_CLASS}:hover) {
    transform: translateY(-1px);
    box-shadow: ${shadow["3"]};
  }

  :where(.${FCB_ROOT_CLASS}:active) {
    transform: translateY(0);
    box-shadow: ${shadow["1"]};
  }

  :where(.${FCB_ROOT_CLASS}[data-size="pc"]) {
    height: 68px;
    padding: 14px 24px 14px 16px;
    gap: ${spacing[12]}px;
    min-width: 440px;
  }

  :where(.${FCB_ROOT_CLASS}[data-size="mobile"]) {
    height: 60px;
    padding: ${spacing[12]}px ${spacing[16]}px ${spacing[12]}px ${spacing[12]}px;
    gap: ${spacing[8]}px;
    min-width: 288px;
  }

  /* 아이콘 없을 때 — 좌측 패딩이 아이콘 기준(작게)으로 남아 pill 모서리에 텍스트가 붙으므로
     좌우를 대칭으로 넓혀 균형을 맞춘다(pc 28 / mobile 20). */
  :where(.${FCB_ROOT_CLASS}[data-size="pc"][data-has-icon="false"]) {
    padding: 14px ${spacing[28]}px;
  }

  :where(.${FCB_ROOT_CLASS}[data-size="mobile"][data-has-icon="false"]) {
    padding: ${spacing[12]}px ${spacing[20]}px;
  }

  :where(.${FCB_ROOT_CLASS}[data-floating="true"]) {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    z-index: ${zIndex.sticky};
  }

  :where(.${FCB_ROOT_CLASS}[data-floating="true"]:hover) {
    transform: translateX(-50%) translateY(-1px);
  }

  :where(.${FCB_ROOT_CLASS}[data-floating="true"]:active) {
    transform: translateX(-50%);
  }

  :where(.${FCB_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  :where(.${FCB_ROOT_CLASS}[data-size="pc"] .${FCB_ICON_CLASS}) {
    width: 48px;
    height: 48px;
  }

  :where(.${FCB_ROOT_CLASS}[data-size="mobile"] .${FCB_ICON_CLASS}) {
    width: 32px;
    height: 32px;
  }

  :where(.${FCB_ICON_CLASS} > *) {
    width: 100%;
    height: 100%;
  }

  :where(.${FCB_TEXT_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    flex: 1 1 auto;
    min-width: 0;
    text-align: left;
  }

  :where(.${FCB_CAPTION_CLASS}) {
    margin: 0;
    color: ${cv.textRole.subtle};
    font-weight: ${fontWeight.regular};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :where(.${FCB_ROOT_CLASS}[data-size="pc"] .${FCB_CAPTION_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
  }

  :where(.${FCB_ROOT_CLASS}[data-size="mobile"] .${FCB_CAPTION_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
  }

  :where(.${FCB_CTA_ROW_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[4]}px;
    color: ${cv.textRole.brand};
  }

  :where(.${FCB_CTA_TEXT_CLASS}) {
    margin: 0;
    font-weight: ${fontWeight.bold};
    color: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :where(.${FCB_ROOT_CLASS}[data-size="pc"] .${FCB_CTA_TEXT_CLASS}) {
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
  }

  :where(.${FCB_ROOT_CLASS}[data-size="mobile"] .${FCB_CTA_TEXT_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
  }

  :where(.${FCB_ARROW_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: currentColor;
    flex-shrink: 0;
  }

  :where(.${FCB_ROOT_CLASS}[data-size="pc"] .${FCB_ARROW_CLASS}) {
    width: 20px;
    height: 20px;
  }

  :where(.${FCB_ROOT_CLASS}[data-size="mobile"] .${FCB_ARROW_CLASS}) {
    width: 16px;
    height: 16px;
  }
`;
