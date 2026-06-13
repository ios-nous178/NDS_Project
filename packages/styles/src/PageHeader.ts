/* Auto-generated from packages/react/src/PageHeader.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, spacing, transition } from "@nudge-design/tokens";

const PH_CLASS = "nds-page-header";
const PH_TOP_CLASS = `${PH_CLASS}__top`;
const PH_BREADCRUMB_CLASS = `${PH_CLASS}__breadcrumb`;
const PH_BACK_CLASS = `${PH_CLASS}__back`;
const PH_MAIN_CLASS = `${PH_CLASS}__main`;
const PH_TITLE_AREA_CLASS = `${PH_CLASS}__title-area`;
const PH_ACTIONS_CLASS = `${PH_CLASS}__actions`;
const PH_TABS_CLASS = `${PH_CLASS}__tabs`;

export const phStyles = `
  :where(.${PH_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-comfortable);
    padding: var(--semantic-inset-card-large) var(--semantic-inset-modal);
    /* 기본 투명 — 페이지 타이틀 영역은 놓인 surface(page/section)를 그대로 비춘다.
       흰 헤더 카드가 필요하면 --nds-page-header-bg 슬롯으로 opt-in. 본문 분리는 bordered. */
    background: var(--nds-page-header-bg, transparent);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${PH_CLASS}[data-bordered="true"]) {
    border-bottom: 1px solid ${cv.borderRole.subtle};
  }

  :where(.${PH_TOP_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-default);
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
    gap: var(--semantic-gap-loose);
  }

  /* 제목/부제 자체는 Heading(level=h2 as=h1) 합성 — 폰트·gap·색은 Heading SSOT.
     여기서는 __main 안에서의 폭(flex)만 책임진다. */
  :where(.${PH_TITLE_AREA_CLASS}) {
    flex: 1;
    min-width: 0;
  }

  :where(.${PH_ACTIONS_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    flex-shrink: 0;
  }

  :where(.${PH_TABS_CLASS}) {
    margin: 0 -${spacing[24]}px -${spacing[20]}px;
  }
`;
