/* Auto-generated from packages/react/src/PageHeader.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, fontWeight, spacing, transition, typeScale } from "@nudge-eap/tokens";

const PH_CLASS = "nds-page-header";
const PH_TOP_CLASS = `${PH_CLASS}__top`;
const PH_BREADCRUMB_CLASS = `${PH_CLASS}__breadcrumb`;
const PH_BACK_CLASS = `${PH_CLASS}__back`;
const PH_MAIN_CLASS = `${PH_CLASS}__main`;
const PH_TITLE_AREA_CLASS = `${PH_CLASS}__title-area`;
const PH_TITLE_CLASS = `${PH_CLASS}__title`;
const PH_SUBTITLE_CLASS = `${PH_CLASS}__subtitle`;
const PH_ACTIONS_CLASS = `${PH_CLASS}__actions`;
const PH_TABS_CLASS = `${PH_CLASS}__tabs`;

export const phStyles = `
  :where(.${PH_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-comfortable);
    padding: var(--inset-card-large) var(--inset-modal);
    background: var(--nds-page-header-bg, ${cv.surface.default});
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${PH_CLASS}[data-bordered="true"]) {
    border-bottom: 1px solid ${cv.borderRole.subtle};
  }

  :where(.${PH_TOP_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--gap-default);
    min-height: 24px;
  }

  :where(.${PH_BACK_CLASS}) {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: ${cv.textRole.normal};
    border-radius: 9999px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background-color ${transition.default};
    margin-left: -${spacing[8]}px;
  }

  :where(.${PH_BACK_CLASS}:hover) { background: ${cv.surface.section}; }

  :where(.${PH_BACK_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${PH_BREADCRUMB_CLASS}) {
    flex: 1;
    min-width: 0;
  }

  :where(.${PH_MAIN_CLASS}) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--gap-loose);
  }

  :where(.${PH_TITLE_AREA_CLASS}) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--gap-tight);
  }

  :where(.${PH_TITLE_CLASS}) {
    font-size: ${typeScale.headline2.fontSize}px;
    line-height: ${typeScale.headline2.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    margin: 0;
  }

  :where(.${PH_SUBTITLE_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.subtle};
    margin: 0;
  }

  :where(.${PH_ACTIONS_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-default);
    flex-shrink: 0;
  }

  :where(.${PH_TABS_CLASS}) {
    margin: 0 -${spacing[24]}px -${spacing[20]}px;
  }
`;
