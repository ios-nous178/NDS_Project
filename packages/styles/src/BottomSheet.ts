/* Auto-generated from packages/react/src/BottomSheet.tsx during the @nudge-design/styles split. */
import { cv, duration, easing, fontFamily, radius, spacing, typeScale } from "@nudge-design/tokens";

const BS_CLASS = "nds-bottom-sheet";
const BS_ROOT_CLASS = `${BS_CLASS}__root`;
const BS_OVERLAY_CLASS = `${BS_CLASS}__overlay`;
const BS_CONTENT_CLASS = `${BS_CLASS}__content`;
const BS_HANDLE_CLASS = `${BS_CLASS}__handle`;
const BS_HEADER_CLASS = `${BS_CLASS}__header`;
const BS_HEADER_TITLE_CLASS = `${BS_CLASS}__header-title`;
const BS_CLOSE_CLASS = `${BS_CLASS}__close`;
const BS_BODY_CLASS = `${BS_CLASS}__body`;
const BS_FOOTER_CLASS = `${BS_CLASS}__footer`;

export const bottomSheetStyles = `
  :where(.${BS_ROOT_CLASS}) {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 1000;
  }

  :where(.${BS_OVERLAY_CLASS}) {
    position: fixed;
    inset: 0;
    background-color: var(--nds-bottom-sheet-backdrop, rgba(0, 0, 0, 0.5));
    animation: nds-bs-fade-in 0.2s ease-out;
  }

  :where(.${BS_ROOT_CLASS}[data-closing="true"] .${BS_OVERLAY_CLASS}) {
    animation: nds-bs-fade-out 0.2s ease-out forwards;
  }

  :where(.${BS_CONTENT_CLASS}) {
    position: relative;
    width: 100%;
    max-width: var(--nds-bottom-sheet-max-width, 664px);
    max-height: var(--nds-bottom-sheet-max-height, 85vh);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: var(--nds-bottom-sheet-radius, ${radius[24]}px) var(--nds-bottom-sheet-radius, ${radius[24]}px) 0 0;
    background-color: ${cv.surface.default};
    /* upward shadow — DS shadow 토큰은 모두 아래 방향이라 의도적으로 raw default 사용.
       슬롯으로 노출해 프로젝트가 덮을 수 있게 (Trost 등), default 는 불변. */
    box-shadow: var(--nds-bottom-sheet-shadow, 0 -4px 12px rgba(0, 0, 0, 0.1));
    /* Figma 가이드(1746:800): 진입 280ms standard easing. 닫기는 200ms ease-out 유지. */
    animation: nds-bs-slide-up ${duration.emphasized}ms ${easing.standard};
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${BS_ROOT_CLASS}[data-closing="true"] .${BS_CONTENT_CLASS}) {
    animation: nds-bs-slide-down 0.2s ease-out forwards;
  }

  :where(.${BS_HANDLE_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--semantic-inset-input) 0 ${spacing[4]}px;
    cursor: grab;
  }

  :where(.${BS_HANDLE_CLASS}::after) {
    content: "";
    width: var(--nds-bottom-sheet-handle-width, 36px);
    height: var(--nds-bottom-sheet-handle-height, 4px);
    border-radius: ${radius.full}px;
    background: var(--nds-bottom-sheet-handle-color, ${cv.borderRole.normal});
  }

  /* Figma 가이드(1746:800): 제목 가운데 정렬 · divider 없음 · Text/Strong. */
  :where(.${BS_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--semantic-gap-comfortable);
    padding: var(--semantic-inset-card) var(--semantic-inset-card-large);
  }

  :where(.${BS_HEADER_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.headline5.fontSize}px;
    font-weight: 700;
    line-height: ${typeScale.headline5.lineHeight}px;
    color: ${cv.textRole.strong};
    text-align: center;
  }

  /* Upclose 닫기 — Figma: 우상단 24×24 Icon/Strong. topbar 영역에 absolute 배치(가운데 제목과 무관). */
  :where(.${BS_CLOSE_CLASS}) {
    position: absolute;
    top: var(--semantic-inset-card);
    right: var(--semantic-inset-card-large);
    z-index: 1;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    line-height: 1;
    color: ${cv.iconRole.strong};
  }

  :where(.${BS_CLOSE_CLASS} svg) {
    width: 24px;
    height: 24px;
  }

  :where(.${BS_BODY_CLASS}) {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: var(--semantic-inset-card-large);
    font-size: ${typeScale.body2.fontSize}px;
    line-height: 1.5;
    color: ${cv.textRole.subtle};
  }

  /* 푸터가 없어 body 가 시트 최하단이면 iOS safe-area 인셋만큼 추가 (footer 와 중복 방지). */
  :where(.${BS_CONTENT_CLASS} > .${BS_BODY_CLASS}:last-child) {
    padding-bottom: calc(var(--semantic-inset-card-large) + env(safe-area-inset-bottom, 0px));
  }

  :where(.${BS_FOOTER_CLASS}) {
    display: flex;
    gap: var(--semantic-gap-default);
    padding: var(--semantic-inset-input) var(--semantic-inset-card-large);
    /* iOS 홈 인디케이터 safe-area — 푸터가 시트 최하단이면 인셋만큼 추가 (없으면 0). */
    padding-bottom: calc(var(--semantic-inset-input) + env(safe-area-inset-bottom, 0px));
    border-top: 1px solid ${cv.borderRole.subtle};
  }

  :where(.${BS_FOOTER_CLASS} > *) {
    flex: 1;
    min-width: 0;
  }

  @keyframes nds-bs-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes nds-bs-fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes nds-bs-slide-up {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  @keyframes nds-bs-slide-down {
    from { transform: translateY(0); }
    to { transform: translateY(100%); }
  }
`;
