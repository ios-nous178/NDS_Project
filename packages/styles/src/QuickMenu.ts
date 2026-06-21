/* Auto-generated from packages/react/src/QuickMenu.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  shadow,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const QM_CLASS = "nds-quickmenu";
const QM_HEADER_CLASS = `${QM_CLASS}__header`;
const QM_HEADING_CLASS = `${QM_CLASS}__heading`;
const QM_DIVIDER_CLASS = `${QM_CLASS}__divider`;
const QM_ITEMS_CLASS = `${QM_CLASS}__items`;
const QM_ITEM_CLASS = `${QM_CLASS}__item`;
const QM_CIRCLE_CLASS = `${QM_CLASS}__circle`;
const QM_ICON_CLASS = `${QM_CLASS}__icon`;
const QM_LABEL_CLASS = `${QM_CLASS}__label`;
const QM_TOP_CLASS = `${QM_CLASS}__top`;
const QM_TOP_ICON_CLASS = `${QM_CLASS}__top-icon`;
const QM_TOP_LABEL_CLASS = `${QM_CLASS}__top-label`;

export const quickMenuStyles = `
  :where(.${QM_CLASS}) {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: var(--nds-quickmenu-width, 120px);
    padding-top: ${spacing[20]}px;
    border-radius: ${radius[12]}px;
    background: ${cv.surface.default};
    box-shadow: var(--nds-quickmenu-shadow, ${shadow[2]});
    overflow: hidden;
    font-family: ${fontFamily.web};
  }

  /* PC 우측 고정 (sticky/fixed). 모바일·태블릿(<1024)은 숨김 — 하단 Tab Bar 로 대체. */
  :where(.${QM_CLASS}[data-fixed]) {
    position: fixed;
    top: var(--nds-quickmenu-top, 172px);
    right: var(--nds-quickmenu-right, ${spacing[40]}px);
    z-index: var(--nds-quickmenu-z, 900);
  }

  @media (max-width: 1023px) {
    :where(.${QM_CLASS}[data-fixed]) { display: none; }
  }

  /* ── Header ── */
  :where(.${QM_HEADER_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--semantic-gap-default);
  }

  :where(.${QM_HEADING_CLASS}) {
    white-space: pre-line;
    text-align: center;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.brand};
  }

  :where(.${QM_DIVIDER_CLASS}) {
    width: 26px;
    height: 1px;
    background: var(--nds-quickmenu-divider, ${cv.borderRole.normal});
  }

  /* ── Items ── */
  :where(.${QM_ITEMS_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--semantic-gap-loose);
    width: 100%;
    margin: ${spacing[14]}px 0 0;
    padding: 0;
    list-style: none;
  }

  :where(.${QM_ITEM_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${spacing[6]}px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: inherit;
  }

  :where(.${QM_ITEM_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
    border-radius: ${radius[8]}px;
  }

  :where(.${QM_CIRCLE_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: ${radius.full}px;
    background: ${cv.fill.neutralSubtle};
    color: ${cv.iconRole.normal};
    flex-shrink: 0;
    transition: background-color ${transition.default}, color ${transition.default};
  }

  :where(.${QM_ITEM_CLASS}:hover .${QM_CIRCLE_CLASS}) {
    background: ${cv.surface.section};
    color: ${cv.iconRole.brand};
  }

  :where(.${QM_ICON_CLASS}) {
    display: inline-flex;
    width: 32px;
    height: 32px;
  }

  :where(.${QM_ICON_CLASS} svg) {
    width: 100%;
    height: 100%;
  }

  :where(.${QM_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
    text-align: center;
    word-break: keep-all;
  }

  :where(.${QM_ITEM_CLASS}:hover .${QM_LABEL_CLASS}) {
    color: ${cv.textRole.brand};
  }

  /* ── TOP ── */
  :where(.${QM_TOP_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--semantic-gap-tight);
    width: 100%;
    margin-top: ${spacing[24]}px;
    padding: ${spacing[16]}px 0;
    border: none;
    background: ${cv.surface.subtle};
    cursor: pointer;
    font-family: inherit;
  }

  :where(.${QM_TOP_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: -2px;
  }

  :where(.${QM_TOP_ICON_CLASS}) {
    display: inline-flex;
    width: 24px;
    height: 24px;
    color: ${cv.iconRole.strong};
  }

  :where(.${QM_TOP_ICON_CLASS} svg) {
    width: 100%;
    height: 100%;
  }

  :where(.${QM_TOP_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.strong};
  }
`;
