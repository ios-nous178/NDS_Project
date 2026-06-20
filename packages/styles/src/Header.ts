/* Auto-generated from packages/react/src/Header.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  grid,
  radius,
  shadow,
  sizing,
  spacing,
  transition,
  typeScale,
  zIndex,
} from "@nudge-design/tokens";

const HEADER_CLASS = "nds-header";
const H_LEFT_CLASS = `${HEADER_CLASS}__left`;
const H_TITLE_CLASS = `${HEADER_CLASS}__title`;
const H_RIGHT_CLASS = `${HEADER_CLASS}__right`;
const H_MAIN_CLASS = `${HEADER_CLASS}__main-bar`;
const H_NAV_CLASS = `${HEADER_CLASS}__nav-bar`;
const H_LOGO_CLASS = `${HEADER_CLASS}__logo`;
const H_SEARCH_CLASS = `${HEADER_CLASS}__search`;
const H_MENU_CLASS = `${HEADER_CLASS}__menu`;
const H_MENU_ITEM_CLASS = `${HEADER_CLASS}__menu-item`;
const H_ACTIONS_CLASS = `${HEADER_CLASS}__actions`;
const H_AUTH_MENU_CLASS = `${HEADER_CLASS}__auth-menu`;
const H_AUTH_MENU_ITEM_CLASS = `${HEADER_CLASS}__auth-menu-item`;
const H_AUTH_BTN_CLASS = `${HEADER_CLASS}__auth-btn`;
const H_DOWNLOAD_BTN_CLASS = `${HEADER_CLASS}__download-btn`;
const H_BACK_CLASS = `${HEADER_CLASS}__back`;
const H_DIVIDER_CLASS = `${HEADER_CLASS}__divider`;
const H_INNER_CLASS = `${HEADER_CLASS}__inner`;
const H_SEARCH_ICON_CLASS = `${HEADER_CLASS}__search-icon`;
const H_AUTH_DIVIDER_CLASS = `${HEADER_CLASS}__auth-divider`;

export const headerStyles = `
  /* Root — flex variants (compact / webview / transparent).
     색은 JS 색맵을 우회하지 않는다 — react/html 은 data-variant / data-elevated 만 set,
     배경·하단보더는 [data-variant] 룰이, shadow 는 [data-elevated] 룰이 슬롯에 주입한다.
     ① 슬롯(--nds-header-*) = 프로젝트/인스턴스 override · ② [data-variant] 룰 = variant 차이.
     title font(body1+bold)·shadow none 은 3 variant 공통 상수 → 기본 룰에 직접. */
  :where(.${HEADER_CLASS}[data-variant="compact"]),
  :where(.${HEADER_CLASS}[data-variant="webview"]),
  :where(.${HEADER_CLASS}[data-variant="transparent"]) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: var(--nds-header-height, ${sizing.appBar.height}px);
    padding: 0 var(--nds-header-padding-x, var(--semantic-inset-card));
    background: var(--nds-header-background, var(--nds-header-variant-background, ${cv.surface.default}));
    border-bottom: var(--nds-header-border-bottom, var(--nds-header-variant-border-bottom, none));
    box-shadow: var(--nds-header-shadow, none);
    font-family: var(--nds-header-font-family, ${fontFamily.web});
    box-sizing: border-box;
    z-index: var(--nds-header-z-index, ${zIndex.appBar});
    transition:
      background-color ${transition.default},
      box-shadow ${transition.default};
  }

  /* variant 차이 = background(transparent 만 투명) + border-bottom(compact 만 subtle 1px) */
  :where(.${HEADER_CLASS}[data-variant="compact"]) {
    --nds-header-variant-background: ${cv.surface.default};
    --nds-header-variant-border-bottom: 1px solid ${cv.borderRole.subtle};
  }

  :where(.${HEADER_CLASS}[data-variant="webview"]) {
    --nds-header-variant-background: ${cv.surface.default};
    --nds-header-variant-border-bottom: none;
  }

  :where(.${HEADER_CLASS}[data-variant="transparent"]) {
    --nds-header-variant-background: transparent;
    --nds-header-variant-border-bottom: none;
  }

  /* elevated — shadow 는 3 variant 모두 none 이 기본, elevated 일 때만 그림자 */
  :where(.${HEADER_CLASS}[data-elevated]) {
    --nds-header-shadow: ${shadow["1"]};
  }

  :where(.${H_LEFT_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    flex-shrink: 0;
  }

  /* title — body1 + bold. 3 variant 공통 상수이므로 슬롯 아닌 직접 값. */
  :where(.${H_TITLE_CLASS}) {
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: var(--nds-header-title-color, ${cv.textRole.normal});
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :where(.${HEADER_CLASS}[data-variant="webview"]) .${H_TITLE_CLASS} {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    max-width: 60%;
    text-align: center;
  }

  :where(.${H_RIGHT_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    flex-shrink: 0;
    margin-left: auto;
  }

  /* MainBar / NavBar — flex 2단 컴포지션 */
  :where(.${H_MAIN_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: var(--nds-header-main-max-width, none);
    margin: 0 auto;
    padding: var(--nds-header-main-py, 0) var(--semantic-inset-card);
    box-sizing: border-box;
  }

  :where(.${H_NAV_CLASS}) {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: var(--nds-header-nav-max-width, none);
    height: var(--nds-header-nav-height, 56px);
    margin: 0 auto;
    padding: 0 var(--semantic-inset-card);
    box-sizing: border-box;
  }

  /* SearchBar */
  :where(.${H_SEARCH_CLASS}) {
    position: relative;
    display: flex;
    align-items: center;
    width: var(--nds-header-search-width, 400px);
    height: var(--nds-header-search-height, 48px);
    border: var(--nds-header-search-border-width, 2px) solid var(--nds-header-search-border-color, ${cv.borderRole.normal});
    border-radius: var(--nds-header-search-radius, 24px);
    padding: 0 var(--nds-header-search-pr, 36px) 0 var(--nds-header-search-pl, var(--semantic-inset-card-large));
    font-size: var(--nds-header-search-font-size, ${typeScale.body2.fontSize}px);
    color: ${cv.textRole.muted};
    box-sizing: border-box;
    flex-shrink: 0;
    font-family: inherit;
    background: ${cv.surface.default};
  }

  :where(.${H_SEARCH_CLASS} input) {
    all: unset;
    width: 100%;
    font: inherit;
    color: ${cv.textRole.normal};
  }

  :where(.${H_SEARCH_CLASS} input::placeholder) {
    color: ${cv.input.placeholder};
  }

  :where(.${H_SEARCH_CLASS}) .${H_SEARCH_ICON_CLASS} {
    position: absolute;
    right: ${spacing[16]}px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
  }

  /* AuthMenu (배열형 — 로그인 + 회원가입 동시 노출) */
  :where(.${H_AUTH_MENU_CLASS}) {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  :where(.${H_AUTH_MENU_ITEM_CLASS}) {
    all: unset;
    font-size: var(--nds-header-auth-font-size, ${typeScale.body2.fontSize}px);
    font-weight: var(--nds-header-auth-font-weight, ${fontWeight.bold});
    color: ${cv.textRole.normal};
    cursor: pointer;
    white-space: nowrap;
    font-family: inherit;
  }

  :where(.${H_AUTH_DIVIDER_CLASS}) {
    width: 1px;
    height: 13px;
    background: ${cv.borderRole.subtle};
    flex-shrink: 0;
  }

  /* Divider */
  :where(.${H_DIVIDER_CLASS}) {
    width: 100%;
    height: 1px;
    background: ${cv.borderRole.subtle};
    flex-shrink: 0;
  }

  /* BackButton */
  :where(.${H_BACK_CLASS}) {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${sizing.icon.default}px;
    height: ${sizing.icon.default}px;
    cursor: pointer;
    color: ${cv.iconRole.strong};
    flex-shrink: 0;
  }

  :where(.${H_BACK_CLASS} svg) {
    width: ${sizing.icon.default}px;
    height: ${sizing.icon.default}px;
  }

  /* Root — web variant (grid 3열, 80px, max-width 1200) */
  :where(.${HEADER_CLASS}[data-variant="web"]) {
    display: block;
    width: 100%;
    height: var(--nds-header-height, 80px);
    background: ${cv.surface.default};
    border-bottom: 1px solid ${cv.borderRole.subtle};
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    z-index: var(--nds-header-z-index, ${zIndex.appBar});
  }

  :where(.${H_INNER_CLASS}) {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    width: 100%;
    max-width: var(--nds-header-max-width, ${grid.desktop.contentWidth}px);
    height: 100%;
    margin: 0 auto;
    padding: 0 var(--nds-header-padding-x, 0);
    box-sizing: border-box;
    gap: ${spacing[40]}px;
  }

  @media (max-width: ${grid.desktop.contentWidth - 1}px) {
    :where(.${HEADER_CLASS}[data-variant="web"]) .${H_INNER_CLASS} {
      --nds-header-padding-x: ${grid.desktop.minMargin}px;
    }
  }

  /* Logo — children + src + href + onLogoClick. img 사이즈 cascade 는 web variant 일 때만. */
  :where(.${H_LOGO_CLASS}) {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: 100%;
    justify-self: start;
  }

  :where(.${HEADER_CLASS}[data-variant="web"]) .${H_LOGO_CLASS} > img,
  :where(.${HEADER_CLASS}[data-variant="web"]) .${H_LOGO_CLASS} > a > img {
    display: block;
    height: var(--nds-header-logo-height, 60px);
    width: auto;
    max-width: var(--nds-header-logo-max-width, 200px);
    object-fit: contain;
  }

  :where(.${H_LOGO_CLASS} a) {
    display: flex;
    align-items: center;
  }

  /* Menu */
  :where(.${H_MENU_CLASS}) {
    display: flex;
    align-items: center;
    height: 100%;
    justify-self: center;
    gap: var(--nds-header-menu-gap, 0);
  }

  :where(.${H_MENU_ITEM_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 var(--nds-header-menu-px, var(--semantic-inset-card-large));
    font-size: var(--nds-header-menu-font-size, ${typeScale.headline5.fontSize}px);
    line-height: ${typeScale.headline5.lineHeight}px;
    font-weight: var(--nds-header-menu-font-weight, ${fontWeight.bold});
    color: var(--nds-header-menu-inactive-color, ${cv.textRole.strong});
    text-decoration: none;
    background: transparent;
    border: none;
    border-bottom: var(--nds-header-menu-active-border-width, 3px) solid transparent;
    cursor: pointer;
    box-sizing: border-box;
    white-space: nowrap;
    transition:
      color ${transition.default},
      border-color ${transition.default};
  }

  :where(.${H_MENU_ITEM_CLASS}:hover) {
    color: var(--nds-header-menu-active-color, ${cv.textRole.brand});
  }

  :where(.${H_MENU_ITEM_CLASS}[data-active="true"]) {
    color: var(--nds-header-menu-active-color, ${cv.textRole.brand});
    border-bottom-color: var(--nds-header-menu-active-border-color, ${cv.borderRole.brand});
  }

  /* Actions */
  :where(.${H_ACTIONS_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-loose);
    flex-shrink: 0;
    justify-self: end;
  }

  :where(.${H_DOWNLOAD_BTN_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: ${sizing.button.sm}px;
    padding: 0 ${spacing[14]}px;
    background: ${cv.surface.subtle};
    color: ${cv.textRole.brand};
    font-family: inherit;
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.bold};
    border: 0;
    border-radius: ${radius.md}px;
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
    box-sizing: border-box;
    transition: background-color ${transition.default};
  }

  :where(.${H_DOWNLOAD_BTN_CLASS}:hover) {
    background: ${cv.surface.disabled};
  }

  :where(.${H_AUTH_BTN_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: ${sizing.button.md}px;
    padding: 0 ${spacing[18]}px;
    background: ${cv.surface.default};
    color: ${cv.textRole.brand};
    font-family: inherit;
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.bold};
    border: 1px solid ${cv.borderRole.brand};
    border-radius: ${radius.md}px;
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
    box-sizing: border-box;
    transition:
      background-color ${transition.default},
      color ${transition.default};
  }

  :where(.${H_AUTH_BTN_CLASS}:hover) {
    background: ${cv.surface.brandSubtle};
  }
`;
