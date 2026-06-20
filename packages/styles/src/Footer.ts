/* Auto-generated from packages/react/src/Footer.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  sizing,
  spacing,
  transition,
  typeScale,
  zIndex,
} from "@nudge-design/tokens";

const FOOTER_CLASS = "nds-footer";
const FOOTER_NAV_CLASS = `${FOOTER_CLASS}__nav`;
const FOOTER_LINKS_CLASS = `${FOOTER_CLASS}__links`;
const FOOTER_LINK_CLASS = `${FOOTER_CLASS}__link`;
const FOOTER_INFO_CLASS = `${FOOTER_CLASS}__info`;
const FOOTER_NAV_ITEM_CLASS = `${FOOTER_NAV_CLASS}-item`;
const FOOTER_COMPANY_CLASS = `${FOOTER_CLASS}__company`;
const FOOTER_EXTRA_CLASS = `${FOOTER_CLASS}__extra`;

export const footerStyles = `
  /* ─── Info footer (홈페이지 하단) ─── */
  :where(.${FOOTER_CLASS}[data-variant="info"]) {
    width: 100%;
    padding: var(--nds-footer-padding, var(--semantic-inset-card));
    background: var(--nds-footer-background, ${cv.surface.subtle});
    font-family: var(--nds-footer-font-family, ${fontFamily.web});
    box-sizing: border-box;
  }

  :where(.${FOOTER_CLASS}[data-variant="info"]) .${FOOTER_LINKS_CLASS} {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--semantic-gap-tight);
    margin-bottom: ${spacing[16]}px;
  }

  :where(.${FOOTER_CLASS}[data-variant="info"]) .${FOOTER_LINK_CLASS} {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.subtle};
    text-decoration: none;
    cursor: pointer;
    transition: color ${transition.default};
  }

  :where(.${FOOTER_CLASS}[data-variant="info"]) .${FOOTER_LINK_CLASS}:hover {
    text-decoration: underline;
  }

  :where(.${FOOTER_CLASS}[data-variant="info"]) .${FOOTER_LINK_CLASS}[data-bold="true"] {
    font-weight: ${fontWeight.bold};
  }

  :where(.${FOOTER_CLASS}[data-variant="info"]) .${FOOTER_INFO_CLASS} {
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.subtle};
  }

  /* ─── Tab-bar footer (앱 하단 네비게이션) ─── */
  :where(.${FOOTER_CLASS}[data-variant="tab-bar"]) {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-evenly;
    align-items: stretch;
    width: 100%;
    height: var(--nds-footer-height, ${sizing.bottomBar.height}px);
    background: var(--nds-footer-background, ${cv.surface.default});
    border-top: 1px solid var(--nds-footer-border-color, ${cv.borderRole.subtle});
    /* 프로젝트 chrome 색 격리 — 외부 페이지 color(예: body{color:#333})가 currentColor SVG 로
       새어 비활성 아이콘이 검게 나오던 버그 방지. 아이템이 active/inactive 로 다시 덮는다. */
    color: var(--nds-footer-nav-inactive-color, ${cv.textRole.subtle});
    font-family: var(--nds-footer-font-family, ${fontFamily.web});
    box-sizing: border-box;
    z-index: var(--nds-footer-z-index, ${zIndex.sticky});
  }

  :where(.${FOOTER_NAV_ITEM_CLASS}) {
    flex: 0 1 20%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: ${spacing[2]}px;
    padding: ${spacing[6]}px 0;
    text-decoration: none;
    cursor: pointer;
    opacity: 0.9;
    color: var(--nds-footer-nav-inactive-color, ${cv.textRole.subtle});
    transition:
      opacity ${transition.default},
      color ${transition.default};
  }

  :where(.${FOOTER_NAV_ITEM_CLASS}[data-active="true"]) {
    opacity: 1;
    color: var(--nds-footer-nav-active-color, ${cv.textRole.normal});
  }

  :where(.${FOOTER_NAV_ITEM_CLASS}[aria-disabled="true"]) {
    pointer-events: none;
  }

  :where(.${FOOTER_NAV_ITEM_CLASS}) .${FOOTER_CLASS}__nav-icon {
    width: ${sizing.icon.default}px;
    height: ${sizing.icon.default}px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :where(.${FOOTER_NAV_ITEM_CLASS}) .${FOOTER_CLASS}__nav-label {
    font-size: var(--nds-footer-nav-label-font-size, ${typeScale.label.fontSize}px);
    line-height: var(--nds-footer-nav-label-line-height, ${typeScale.label.lineHeight}px);
    font-weight: var(--nds-footer-nav-label-weight, ${fontWeight.regular});
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :where(.${FOOTER_NAV_ITEM_CLASS}[data-active="true"]) .${FOOTER_CLASS}__nav-label {
    color: var(--nds-footer-nav-active-color, ${cv.textRole.normal});
    font-weight: var(--nds-footer-nav-active-label-weight, var(--nds-footer-nav-label-weight, ${fontWeight.regular}));
  }

  /* ─── CompanyInfo ─── */

  :where(.${FOOTER_COMPANY_CLASS}) {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--semantic-gap-wide);
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: 1.6;
    color: var(--nds-footer-company-color, ${cv.textRole.subtle});
  }

  :where(.${FOOTER_COMPANY_CLASS}) .${FOOTER_CLASS}__company-name {
    font-weight: ${fontWeight.medium};
    margin-bottom: ${spacing[4]}px;
  }

  :where(.${FOOTER_COMPANY_CLASS}) .${FOOTER_CLASS}__company-copyright {
    margin-top: ${spacing[12]}px;
    color: var(--nds-footer-muted-color, ${cv.textRole.muted});
  }

  :where(.${FOOTER_COMPANY_CLASS}) .${FOOTER_CLASS}__company-logo {
    object-fit: contain;
    flex-shrink: 0;
  }

  :where(.${FOOTER_COMPANY_CLASS}) .${FOOTER_CLASS}__company-sep {
    display: inline-block;
    width: 1px;
    height: 10px;
    background: var(--nds-footer-muted-color, ${cv.textRole.muted});
    margin: 0 ${spacing[8]}px;
    vertical-align: middle;
  }

  /* ─── Extra ─── */

  :where(.${FOOTER_EXTRA_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: 1.6;
    color: var(--nds-footer-extra-color, ${cv.textRole.subtle});
    margin-bottom: ${spacing[12]}px;
  }

  /* ─── Web variant (rich PC footer skeleton — base 는 골격만 제공) ─── */
  :where(.${FOOTER_CLASS}[data-variant="web"]) {
    width: 100%;
    font-family: ${fontFamily.web};
    background: var(--nds-footer-background, ${cv.surface.subtle});
    color: var(--nds-footer-color, ${cv.textRole.normal});
    box-sizing: border-box;
  }
  :where(.${FOOTER_CLASS}[data-variant="web"][data-tone="dark"]) {
    --nds-footer-background: ${cv.textRole.normal};
    --nds-footer-color: ${cv.textRole.inverse};
    --nds-footer-divider-color: rgba(255, 255, 255, 0.16);
  }
  :where(.${FOOTER_CLASS}[data-variant="web"]) .${FOOTER_CLASS}__web-inner {
    max-width: var(--nds-footer-web-max-width, 1200px);
    margin: 0 auto;
    padding: 0 ${spacing[16]}px;
    box-sizing: border-box;
  }
  :where(.${FOOTER_CLASS}__web-row) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--semantic-gap-wide);
    padding: ${spacing[24]}px 0;
  }
  :where(.${FOOTER_CLASS}__web-row[data-align="start"]) { justify-content: flex-start; }
  :where(.${FOOTER_CLASS}__web-row[data-align="end"]) { justify-content: flex-end; }
  :where(.${FOOTER_CLASS}__web-row[data-align="center"]) { justify-content: center; }
  :where(.${FOOTER_CLASS}__web-row[data-align="top"]) { align-items: flex-start; }
  :where(.${FOOTER_CLASS}__web-divider) {
    height: 1px;
    background: var(--nds-footer-divider-color, ${cv.borderRole.subtle});
  }
  :where(.${FOOTER_CLASS}__web-section) {
    display: block;
  }
`;
