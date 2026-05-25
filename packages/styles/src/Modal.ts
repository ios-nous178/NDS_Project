/* Auto-generated from packages/react/src/Modal.tsx during the @nudge-eap/styles split. */
import { cv, radius, shadow, spacing, typeScale, zIndex } from "@nudge-eap/tokens";

const MODAL_CLASS = "nds-modal";
const ROOT_CLASS = `${MODAL_CLASS}__root`;
const OVERLAY_CLASS = `${MODAL_CLASS}__overlay`;
const CONTENT_CLASS = `${MODAL_CLASS}__content`;
const HEADER_CLASS = `${MODAL_CLASS}__header`;
const HEADER_SPACER_CLASS = `${MODAL_CLASS}__header-spacer`;
const HEADER_TITLE_CLASS = `${MODAL_CLASS}__header-title`;
const CLOSE_CLASS = `${MODAL_CLASS}__close`;
const BODY_CLASS = `${MODAL_CLASS}__body`;
const IMAGE_CLASS = `${MODAL_CLASS}__image`;
const FOOTER_CLASS = `${MODAL_CLASS}__footer`;
const FOOTER_ACTION_CLASS = `${MODAL_CLASS}__footer-action`;
const FOOTER_CANCEL_CLASS = `${MODAL_CLASS}__footer-cancel`;
const FOOTER_CONFIRM_CLASS = `${MODAL_CLASS}__footer-confirm`;

export const modalStyles = `
  :where(.${ROOT_CLASS}) {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: ${zIndex.modal};
    padding: var(--inset-card-large);
  }

  :where(.${OVERLAY_CLASS}) {
    position: fixed;
    inset: 0;
    background-color: ${cv.surface.overlay};
    animation: nds-modal-fade-in 0.2s ease-out;
  }

  /* Figma · Modal · Mobile 294 / PC 332 카드 패딩(비대칭):
     top 28 / x 16 / bottom 16, 본문 그룹과 버튼 그룹 사이 gap 24px.
     image-title-description 그룹 내부는 gap 8px. */
  :where(.${CONTENT_CLASS}) {
    position: relative;
    width: 100%;
    max-width: var(--nds-modal-max-width, 332px);
    display: flex;
    flex-direction: column;
    gap: var(--gap-default);
    padding: ${spacing[28]}px var(--inset-card) var(--inset-card);
    overflow: hidden;
    border-radius: var(--nds-modal-radius, ${radius.md}px);
    background-color: ${cv.surface.default};
    box-shadow: ${shadow["3"]};
    animation: nds-modal-slide-up 0.2s ease-out;
    box-sizing: border-box;
  }

  /* Header: 좌측 28px 고스트 스페이서 + flex:1 타이틀 + 우측 28px 닫기 버튼.
     스페이서가 X 버튼 폭을 좌측에 미러링해서 타이틀이 모달 박스 기준 정중앙에 정렬됨. */
  :where(.${HEADER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-comfortable);
    padding: 0;
  }

  :where(.${HEADER_SPACER_CLASS}) {
    flex: 0 0 28px;
    height: 28px;
    visibility: hidden;
  }

  :where(.${HEADER_TITLE_CLASS}) {
    margin: 0;
    flex: 1;
    text-align: center;
    font-size: ${typeScale.body1.fontSize}px;
    font-weight: 700;
    line-height: ${typeScale.body1.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  :where(.${CLOSE_CLASS}) {
    flex: 0 0 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    cursor: pointer;
    padding: 4px;
    font-size: 20px;
    line-height: 1;
    color: ${cv.textRole.muted};
  }

  :where(.${BODY_CLASS}) {
    padding: 0;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
    text-align: center;
  }

  /* 본문 그룹(image/header/body)과 푸터 사이 24px gap:
     ModalContent 의 gap 8px + 추가 16px margin */
  :where(.${BODY_CLASS}:has(+ .${FOOTER_CLASS})) {
    margin-bottom: ${spacing[16]}px;
  }

  :where(.${IMAGE_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    margin: 0 auto;
  }

  :where(.${IMAGE_CLASS} > *) {
    width: 100%;
    height: 100%;
  }

  /* Figma · Modal · Footer (171:9947 등): Primary 솔리드 + Outlined Cancel 가로 분할.
     버튼 padding 11/24, radius 8, gap 8, font 15/22. */
  :where(.${FOOTER_CLASS}) {
    display: flex;
    width: 100%;
    gap: var(--gap-default);
    box-sizing: border-box;
  }

  :where(.${FOOTER_CLASS}[data-layout="custom"]) {
    padding: 0;
    gap: var(--gap-default);
    justify-content: center;
  }

  :where(.${FOOTER_CLASS}[data-layout="custom"] > *) {
    min-width: 0;
  }

  :where(.${FOOTER_ACTION_CLASS}) {
    flex: 1;
    min-width: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: ${spacing[11]}px var(--inset-modal);
    border-radius: ${radius.md}px;
    border: 1px solid transparent;
    cursor: pointer;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    box-sizing: border-box;
    transition: background-color 0.15s ease, border-color 0.15s ease;
  }

  :where(.${FOOTER_CANCEL_CLASS}) {
    background-color: ${cv.surface.default};
    border-color: ${cv.borderRole.normal};
    color: ${cv.textRole.normal};
    font-weight: 500;
  }

  :where(.${FOOTER_CANCEL_CLASS}:hover) {
    background-color: ${cv.surface.subtle};
  }

  :where(.${FOOTER_CONFIRM_CLASS}) {
    background-color: ${cv.surface.brand};
    border-color: ${cv.borderRole.brand};
    color: ${cv.textRole.inverse};
    font-weight: 700;
  }

  :where(.${FOOTER_CONFIRM_CLASS}:hover) {
    background-color: ${cv.fill.brandHover};
    border-color: ${cv.fill.brandHover};
  }

  :where(.${FOOTER_CONFIRM_CLASS}:active) {
    background-color: ${cv.textRole.brandStrong};
    border-color: ${cv.textRole.brandStrong};
  }

  @keyframes nds-modal-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes nds-modal-slide-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;
