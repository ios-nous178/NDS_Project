/* Auto-generated from packages/react/src/Popup.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, radius, shadow, spacing, typeScale, zIndex } from "@nudge-design/tokens";

const POPUP_CLASS = "nds-popup";
const POPUP_ROOT_CLASS = `${POPUP_CLASS}__root`;
const POPUP_OVERLAY_CLASS = `${POPUP_CLASS}__overlay`;
const POPUP_CONTENT_CLASS = `${POPUP_CLASS}__content`;
const POPUP_TEXT_CLASS = `${POPUP_CLASS}__text`;
const POPUP_TITLE_CLASS = `${POPUP_CLASS}__title`;
const POPUP_DESC_CLASS = `${POPUP_CLASS}__description`;
const POPUP_ACTIONS_CLASS = `${POPUP_CLASS}__actions`;
const POPUP_BTN_CLASS = `${POPUP_CLASS}__btn`;
const POPUP_BTN_CANCEL_CLASS = `${POPUP_CLASS}__btn--cancel`;
const POPUP_BTN_CONFIRM_CLASS = `${POPUP_CLASS}__btn--confirm`;

export const popupStyles = `
  :where(.${POPUP_ROOT_CLASS}) {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: ${zIndex.popup};
    padding: ${spacing[30]}px;
  }

  :where(.${POPUP_OVERLAY_CLASS}) {
    position: fixed;
    inset: 0;
    background-color: ${cv.surface.overlay};
    animation: nds-popup-fade-in 0.2s ease-out;
  }

  :where(.${POPUP_CONTENT_CLASS}) {
    position: relative;
    width: 100%;
    max-width: var(--nds-popup-max-width, 400px);
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-wide);
    padding: ${spacing[28]}px var(--semantic-inset-card) var(--semantic-inset-card);
    border-radius: ${radius.md}px;
    background: ${cv.surface.default};
    box-shadow: ${shadow["3"]};
    animation: nds-popup-scale-in 0.2s ease-out;
  }

  :where(.${POPUP_TEXT_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--semantic-gap-default);
    text-align: center;
    color: ${cv.textRole.normal};
    font-family: ${fontFamily.web};
  }

  :where(.${POPUP_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.body1.fontSize}px;
    font-weight: 700;
    line-height: ${typeScale.body1.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  :where(.${POPUP_DESC_CLASS}) {
    margin: 0;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: 400;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  :where(.${POPUP_ACTIONS_CLASS}) {
    display: flex;
    gap: var(--semantic-gap-default);
    width: 100%;
  }

  :where(.${POPUP_ACTIONS_CLASS}[data-single="true"]) {
    flex-direction: column;
  }

  :where(.${POPUP_BTN_CLASS}) {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: ${spacing[10]}px var(--semantic-inset-card);
    border: none;
    border-radius: ${radius.md}px;
    font-family: ${fontFamily.web};
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: 700;
    line-height: ${typeScale.body2.lineHeight}px;
    cursor: pointer;
    box-sizing: border-box;
    transition: opacity 0.2s ease;
  }

  :where(.${POPUP_BTN_CLASS}:active) {
    opacity: 0.8;
  }

  :where(.${POPUP_BTN_CANCEL_CLASS}) {
    background: ${cv.textRole.muted};
    color: ${cv.surface.default};
  }

  :where(.${POPUP_BTN_CONFIRM_CLASS}) {
    background: ${cv.surface.brand};
    color: ${cv.button.textDefault};
  }

  /* ─── actionsLayout="end" — 우측 정렬 hug (브랜드 무관; 캐포비 admin 기본).
     split(기본)은 위: 2버튼 50/50, 1버튼 세로 스택. end 는 1·2버튼 모두 우측 hug row.
     data-layout 은 resolveActionsLayout(브랜드 기본 + prop override)이 설정. pill/색은 별도. ─── */
  :where(.${POPUP_ACTIONS_CLASS}[data-layout="end"]),
  :where(.${POPUP_ACTIONS_CLASS}[data-layout="end"][data-single="true"]) {
    flex-direction: row;
    justify-content: flex-end;
  }

  :where(.${POPUP_ACTIONS_CLASS}[data-layout="end"] .${POPUP_BTN_CLASS}) {
    flex: 0 0 auto;
  }

  /* ─── CashwalkBiz 확인/결정 팝업 — Figma ModalGuide ①②④ (3418-471) 정합 ───
     base Popup 은 가운데 정렬 + 50/50 회색 버튼이지만, 캐포비는 Modal 확인창과 동일하게
     좌측 정렬 본문 + 우측 hug pill 푸터(검정 confirm · outlined 취소). 텍스트/버튼 토큰은 Modal cashwalk 와 통일. */
  :where([data-brand="cashwalk-biz"] .${POPUP_CONTENT_CLASS}) {
    max-width: var(--nds-popup-max-width, 480px);
    padding: ${spacing[32]}px;
    gap: var(--semantic-gap-wide);
    border-radius: var(--nds-popup-radius, 16px);
  }

  :where([data-brand="cashwalk-biz"] .${POPUP_TEXT_CLASS}) {
    align-items: flex-start;
    text-align: left;
  }

  :where([data-brand="cashwalk-biz"] .${POPUP_TITLE_CLASS}) {
    font-size: ${typeScale.headline5.fontSize}px;
    line-height: ${typeScale.headline5.lineHeight}px;
    color: ${cv.textRole.strong};
  }

  :where([data-brand="cashwalk-biz"] .${POPUP_DESC_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  /* 푸터 배치(우측 hug)는 actionsLayout="end"(data-layout) 가 담당 —
     resolveActionsLayout 가 cashwalk-biz 기본을 "end" 로 잡는다. 여기서는 gap·pill·색만. */
  :where([data-brand="cashwalk-biz"] .${POPUP_ACTIONS_CLASS}),
  :where([data-brand="cashwalk-biz"] .${POPUP_ACTIONS_CLASS}[data-single="true"]) {
    gap: ${spacing[8]}px;
  }

  :where([data-brand="cashwalk-biz"] .${POPUP_BTN_CLASS}) {
    min-height: 44px;
    padding: ${spacing[12]}px ${spacing[18]}px;
    border: 1px solid transparent;
    border-radius: 9999px;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: 500;
  }

  :where([data-brand="cashwalk-biz"] .${POPUP_BTN_CANCEL_CLASS}) {
    background: ${cv.surface.default};
    border-color: ${cv.button.borderNeutral};
    color: ${cv.textRole.strong};
  }

  :where([data-brand="cashwalk-biz"] .${POPUP_BTN_CONFIRM_CLASS}) {
    background: ${cv.button.bgSecondary};
    border-color: ${cv.button.bgSecondary};
    color: ${cv.button.textSecondary};
  }

  @keyframes nds-popup-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes nds-popup-scale-in {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;
