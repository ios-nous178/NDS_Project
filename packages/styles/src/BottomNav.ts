/* BottomNav — 모바일 하단 탭 바. react(BottomNav.tsx) ↔ html(nds-bottom-nav.ts) 공용 CSS.
 *
 * 색·배경·보더·높이는 전부 `--nds-bottomnav-*` 슬롯으로 노출 (기본값은 글로벌 시멘틱).
 * 프로젝트 차이는 프로젝트 토큰 파일이 슬롯 값만 덮어 흘려보낸다 — 컴포넌트는 프로젝트를 모른다. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  sizing,
  spacing,
  transition,
  typeScale,
  zIndex,
} from "@nudge-design/tokens";

const BN_CLASS = "nds-bottom-nav";
const BN_ITEM_CLASS = `${BN_CLASS}__item`;
const BN_ICON_CLASS = `${BN_CLASS}__icon`;
const BN_LABEL_CLASS = `${BN_CLASS}__label`;
const BN_BADGE_CLASS = `${BN_CLASS}__badge`;

export const bottomNavStyles = `
  /* ─── Root ─── */
  :where(.${BN_CLASS}) {
    display: flex;
    justify-content: space-evenly;
    align-items: stretch;
    width: 100%;
    height: var(--nds-bottomnav-height, ${sizing.bottomBar.height}px);
    background: var(--nds-bottomnav-bg, ${cv.surface.default});
    border-top: 1px solid var(--nds-bottomnav-border-color, ${cv.borderRole.subtle});
    /* chrome 색 격리 — 외부 페이지 color(body{color:#333})가 currentColor SVG 로 새어
       비활성 아이콘이 검게 나오던 버그 방지. 아이템이 active/inactive 로 다시 덮는다. */
    color: var(--nds-bottomnav-inactive-color, ${cv.textRole.subtle});
    font-family: var(--nds-bottomnav-font-family, ${fontFamily.web});
    box-sizing: border-box;
    z-index: var(--nds-bottomnav-z-index, ${zIndex.sticky});
  }

  :where(.${BN_CLASS}[data-position="fixed"]) {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
  }

  :where(.${BN_CLASS}[data-position="static"]) {
    position: static;
  }

  :where(.${BN_CLASS}[data-shadow="true"]) {
    box-shadow: var(--nds-bottomnav-shadow, 0 -2px 10px 0 rgba(17, 17, 17, 0.05));
  }

  /* ─── Item ─── */
  :where(.${BN_ITEM_CLASS}) {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: ${spacing[2]}px;
    padding: ${spacing[6]}px 0;
    text-decoration: none;
    cursor: pointer;
    color: var(--nds-bottomnav-inactive-color, ${cv.textRole.subtle});
    transition: color ${transition.default};
  }

  :where(.${BN_ITEM_CLASS}[data-active="true"]) {
    color: var(--nds-bottomnav-active-color, ${cv.textRole.normal});
  }

  :where(.${BN_ITEM_CLASS}) .${BN_ICON_CLASS} {
    position: relative;
    width: ${sizing.icon.default}px;
    height: ${sizing.icon.default}px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :where(.${BN_ITEM_CLASS}) .${BN_LABEL_CLASS} {
    max-width: 100%;
    font-size: var(--nds-bottomnav-label-font-size, ${typeScale.label.fontSize}px);
    line-height: var(--nds-bottomnav-label-line-height, ${typeScale.label.lineHeight}px);
    font-weight: var(--nds-bottomnav-label-weight, ${fontWeight.regular});
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :where(.${BN_ITEM_CLASS}[data-active="true"]) .${BN_LABEL_CLASS} {
    font-weight: var(--nds-bottomnav-active-label-weight, var(--nds-bottomnav-label-weight, ${fontWeight.regular}));
  }

  /* ─── Badge (우상단 카운트 칩) ─── */
  :where(.${BN_BADGE_CLASS}) {
    position: absolute;
    top: -${spacing[4]}px;
    left: 100%;
    transform: translateX(-${spacing[8]}px);
    min-width: ${spacing[16]}px;
    height: ${spacing[16]}px;
    padding: 0 ${spacing[4]}px;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${radius.pill}px;
    background: var(--nds-bottomnav-badge-bg, ${cv.surface.statusError});
    color: var(--nds-bottomnav-badge-color, ${cv.textRole.inverse});
    font-size: ${typeScale.label.fontSize}px;
    line-height: 1;
    font-weight: ${fontWeight.bold};
  }
`;
