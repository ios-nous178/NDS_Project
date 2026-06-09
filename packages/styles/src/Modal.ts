/* Auto-generated from packages/react/src/Modal.tsx during the @nudge-design/styles split. */
import { cv, radius, shadow, spacing, typeScale, zIndex } from "@nudge-design/tokens";

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
    padding: var(--semantic-inset-card-large);
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
    gap: var(--semantic-gap-default);
    padding: ${spacing[28]}px var(--semantic-inset-card) var(--semantic-inset-card);
    overflow: hidden;
    border-radius: var(--nds-modal-radius, ${radius.md}px);
    background-color: ${cv.surface.default};
    box-shadow: ${shadow["3"]};
    animation: nds-modal-slide-up 0.2s ease-out;
    box-sizing: border-box;
  }

  /* Header: 좌측 28px 고스트 스페이서 + flex:1 타이틀 + 우측 28px 닫기 버튼.
     스페이서가 X 버튼 폭을 좌측에 미러링해서 타이틀이 모달 박스 기준 정중앙에 정렬됨.
     타이틀이 없으면 스페이서도 안 그려지므로(닫기만 남음) 닫기 버튼은 margin-left:auto 로
     항상 우측에 붙인다 — 없으면 space-between 에서 단독 자식이 좌측으로 떨어진다(회귀). */
  :where(.${HEADER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--semantic-gap-comfortable);
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
    /* 타이틀 유무와 무관하게 항상 우측. 타이틀 있을 땐 flex:1 타이틀이 공간을 다 먹어
       margin-left:auto 가 no-op 이고, 타이틀 없을 땐(닫기 단독) 우측으로 밀어낸다. */
    margin-left: auto;
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

  /* 본문은 세로 스택 — 설명 텍스트 + (옵션) 콘텐츠 슬롯(NoticeAlert / Input / Select / DatePicker)을
     일정 간격으로 쌓는다(Figma ④ Confirm + Slot 3418-471). 단일 텍스트만 있으면 gap 은 무영향.
     슬롯은 full-width 로 늘어남(align-items:stretch 기본). */
  :where(.${BODY_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-default);
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
    gap: var(--semantic-gap-default);
    box-sizing: border-box;
  }

  :where(.${FOOTER_CLASS}[data-layout="custom"]) {
    padding: 0;
    gap: var(--semantic-gap-default);
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
    padding: ${spacing[11]}px var(--semantic-inset-modal);
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

  /* ─── actionsLayout="end" — 우측 정렬 hug (브랜드 무관; 캐포비 admin 기본).
     split(기본)은 위 .footer-action{flex:1} 가로 균등. end 는 1버튼 120px 고정,
     2버튼 우측 hug. data-layout 은 resolveActionsLayout(브랜드 기본 + prop override)이 설정.
     pill 모양/색은 별도(브랜드 토큰/cascade) — 배치만 여기서. ─── */
  :where(.${FOOTER_CLASS}[data-layout="end"]) {
    justify-content: flex-end;
  }

  :where(.${FOOTER_CLASS}[data-layout="end"] .${FOOTER_ACTION_CLASS}) {
    flex: 0 0 auto;
  }

  :where(.${FOOTER_CLASS}[data-layout="end"]:not([data-has-both-actions="true"]) .${FOOTER_ACTION_CLASS}) {
    flex: 0 0 120px;
  }

  @keyframes nds-modal-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes nds-modal-slide-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  /* ============================================================
     CashwalkBiz (admin) brand cascade — Figma "Cashwalk for Business
     ModalGuide" 3418:471. 일반 EAP 모바일 모달(332/294)과 다른
     admin desktop 다이얼로그 스펙:
       · 너비 480 / radius 16 / padding 32 균등 / gap 20
       · 헤더: 타이틀 좌측 정렬(Title2 18/26) + (옵션) 우측 X
       · 본문: Body2 14/20 좌측 정렬, color text/normal
       · 푸터(44px, pill r9999, Body2 medium):
           ① Single (onConfirm 만)         → 우측 정렬 · 120px 고정
           ② Dual   (onConfirm + onClose)  → 가로 양분 (기존 동작)
       · confirm = 검정 CTA (button.bgNeutral — 캐포비 tone=Primary+Neutral, Secondary 없음)
       · cancel  = white + neutral 회색 보더
     기존 props 만으로 4가지 admin 패턴 모두 표현 가능 — Modal API
     변경 없이 CSS cascade 만 추가. <html data-brand="cashwalk-biz"> 가
     박혀 있을 때만 자동 적용.
  ============================================================ */
  :where([data-brand="cashwalk-biz"] .${CONTENT_CLASS}) {
    max-width: var(--nds-modal-max-width, 480px);
    gap: ${spacing[20]}px;
    padding: ${spacing[32]}px;
    border-radius: var(--nds-modal-radius, 16px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.12);
  }

  :where([data-brand="cashwalk-biz"] .${HEADER_CLASS}) {
    gap: 0;
  }

  /* 캐포비는 타이틀 좌측 정렬 — 중앙 정렬용 좌측 ghost spacer 제거 */
  :where([data-brand="cashwalk-biz"] .${HEADER_SPACER_CLASS}) {
    display: none;
  }

  /* CashwalkBiz Title2 = DS headline5 (18/26). 캐포비 typeScale 가
     별도 변수로 노출되지 않아 동일 픽셀 매핑인 headline5 사용. */
  :where([data-brand="cashwalk-biz"] .${HEADER_TITLE_CLASS}) {
    flex: 1;
    text-align: left;
    font-size: ${typeScale.headline5.fontSize}px;
    line-height: ${typeScale.headline5.lineHeight}px;
    font-weight: 700;
    color: ${cv.textRole.strong};
  }

  :where([data-brand="cashwalk-biz"] .${CLOSE_CLASS}) {
    flex: 0 0 24px;
    width: 24px;
    height: 24px;
    padding: 0;
    font-size: 22px;
    color: ${cv.iconRole.normal};
  }

  /* CashwalkBiz Body2 = DS body3 (14/20) — 픽셀 매핑. 본문은 좌측 정렬 + 콘텐츠 슬롯과 20px gap
     (Figma ④ Confirm+Slot 은 헤더·설명·슬롯·푸터가 모두 형제인 평면 gap-20 — 설명↔슬롯도 20). */
  :where([data-brand="cashwalk-biz"] .${BODY_CLASS}) {
    gap: ${spacing[20]}px;
    text-align: left;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  /* gap:20 으로 통일했으므로 body→footer 추가 margin 제거 */
  :where([data-brand="cashwalk-biz"] .${BODY_CLASS}:has(+ .${FOOTER_CLASS})) {
    margin-bottom: 0;
  }

  :where([data-brand="cashwalk-biz"] .${FOOTER_CLASS}) {
    gap: ${spacing[8]}px;
  }

  /* 캐포비 버튼 배치(우측 hug)는 이제 actionsLayout="end"(data-layout) 가 담당 —
     resolveActionsLayout 가 cashwalk-biz 기본을 "end" 로 잡는다. 여기서는 색/pill 모양만. */

  /* CashwalkBiz 버튼: pill / 44px / Body2(14/20) Medium */
  :where([data-brand="cashwalk-biz"] .${FOOTER_ACTION_CLASS}) {
    height: 44px;
    padding: ${spacing[12]}px ${spacing[18]}px;
    border-radius: 9999px;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: 500;
  }

  :where([data-brand="cashwalk-biz"] .${FOOTER_CANCEL_CLASS}) {
    background-color: ${cv.surface.default};
    border-color: ${cv.button.borderNeutral};
    color: ${cv.textRole.strong};
  }

  :where([data-brand="cashwalk-biz"] .${FOOTER_CANCEL_CLASS}:hover) {
    background-color: ${cv.surface.subtle};
    border-color: ${cv.button.borderNeutral};
  }

  /* confirm = 캐포비 시그니처 검정 CTA. 캐포비 ButtonGuide(3098:1032) tone 은 Primary + Neutral
     뿐 — Secondary 없음. 그래서 button.bgNeutral(검정 #111)/textNeutralSolid(흰) 로 통일한다.
     (과거엔 bgSecondary 를 썼으나 cashwalk-biz-no-secondary 검증룰과 모순돼 작성자 오용을 유발했음.) */
  :where([data-brand="cashwalk-biz"] .${FOOTER_CONFIRM_CLASS}) {
    background-color: ${cv.button.bgNeutral};
    border-color: ${cv.button.bgNeutral};
    color: ${cv.button.textNeutralSolid};
  }

  :where([data-brand="cashwalk-biz"] .${FOOTER_CONFIRM_CLASS}:hover) {
    background-color: ${cv.button.bgNeutralHover};
    border-color: ${cv.button.bgNeutralHover};
  }

  :where([data-brand="cashwalk-biz"] .${FOOTER_CONFIRM_CLASS}:active) {
    background-color: ${cv.button.bgNeutralHover};
    border-color: ${cv.button.bgNeutralHover};
  }
`;
