/**
 * <nds-sidebar> — DS Sidebar 의 vanilla Web Component 버전.
 *
 * 사용 패턴:
 *   <nds-sidebar
 *     active-key="home"
 *     items='[
 *       {"key":"home","label":"홈","icon":"<svg ...></svg>","href":"/"},
 *       {"key":"sub","label":"리포트","children":[{"key":"daily","label":"일간"}]}
 *     ]'
 *     title="회사명"
 *     subtitle="기본 플랜"
 *     logo-src="/logo.svg" logo-alt="브랜드"
 *     user='{"name":"홍길동","role":"매니저","avatar":"/me.jpg"}'>
 *   </nds-sidebar>
 *
 * 또는 sections 형태:
 *   items='[
 *     {"key":"main","label":"메인","items":[{"key":"home","label":"홈"}]},
 *     {"key":"settings","items":[{"key":"profile","label":"프로필"}]}
 *   ]'
 *
 * 이벤트:
 *   item-click (detail: { item }) — 아이템 선택
 *   toggle-collapse — 접기/펼치기 버튼 클릭
 *
 * 속성:
 *   items: JSON 배열 (flat items 또는 sections)
 *   active-key: 활성 아이템 키
 *   collapsed: 접힘 상태
 *   show-toggle: 토글 버튼 노출 (있으면 사이드바 헤더에 표시)
 *   width / collapsed-width
 *   logo-src / logo-alt / logo-width / logo-height / logo-href
 *   title / subtitle
 *   user: JSON { name, role?, avatar?, avatarAlt? }
 *   account: JSON { email?, balanceLabel?, balance?, actions?: [{ label, variant?: 'solid'|'outlined', href?, key? }] }
 *            — 로고 아래 고정 계정 블록(캐포비: 이메일 → 잔액 → 충전하기/내역보기 CTA 쌍). 메뉴와 분리.
 *   footer-actions: JSON [{ label, variant?, href?, key? }] — 푸터 고정 액션(예: 로그아웃 outlined).
 *   full-height (기본 true → 100vh sticky)
 *
 * 이벤트(추가): action-click (detail: { key, action }) — 계정/푸터 액션 버튼 클릭
 */

import { cv, fontFamily, fontWeight, spacing, typeScale } from "@nudge-design/tokens";
import { NdsElement, define } from "../base/nds-element.js";

const SB_CLASS = "nds-sidebar";
const SB_ROOT_CLASS = `${SB_CLASS}__root`;
const SB_HEADER_CLASS = `${SB_CLASS}__header`;
const SB_LOGO_CLASS = `${SB_CLASS}__logo`;
const SB_TITLE_CLASS = `${SB_CLASS}__title`;
const SB_SUBTITLE_CLASS = `${SB_CLASS}__subtitle`;
const SB_TOGGLE_CLASS = `${SB_CLASS}__toggle`;
const SB_BODY_CLASS = `${SB_CLASS}__body`;
const SB_SECTION_CLASS = `${SB_CLASS}__section`;
const SB_SECTION_LABEL_CLASS = `${SB_CLASS}__section-label`;
const SB_ITEM_LIST_CLASS = `${SB_CLASS}__item-list`;
const SB_ITEM_CLASS = `${SB_CLASS}__item`;
const SB_ITEM_INNER_CLASS = `${SB_CLASS}__item-inner`;
const SB_ITEM_ICON_CLASS = `${SB_CLASS}__item-icon`;
const SB_ITEM_LABEL_CLASS = `${SB_CLASS}__item-label`;
const SB_ITEM_BADGE_CLASS = `${SB_CLASS}__item-badge`;
const SB_ITEM_CARET_CLASS = `${SB_CLASS}__item-caret`;
const SB_CHILDREN_CLASS = `${SB_CLASS}__children`;
const SB_FOOTER_CLASS = `${SB_CLASS}__footer`;
const SB_USER_CLASS = `${SB_CLASS}__user`;
const SB_USER_AVATAR_CLASS = `${SB_CLASS}__user-avatar`;
const SB_USER_META_CLASS = `${SB_CLASS}__user-meta`;
const SB_USER_NAME_CLASS = `${SB_CLASS}__user-name`;
const SB_USER_ROLE_CLASS = `${SB_CLASS}__user-role`;
// 고정 계정 블록(로고 아래) + 푸터 액션 — 캐포비 어드민의 로고→이메일→잔액→CTA쌍, 로그아웃.
const SB_ACCOUNT_CLASS = `${SB_CLASS}__account`;
const SB_ACCOUNT_EMAIL_CLASS = `${SB_CLASS}__account-email`;
const SB_ACCOUNT_BALANCE_CLASS = `${SB_CLASS}__account-balance`;
const SB_ACCOUNT_BALANCE_LABEL_CLASS = `${SB_CLASS}__account-balance-label`;
const SB_ACCOUNT_BALANCE_AMOUNT_CLASS = `${SB_CLASS}__account-balance-amount`;
const SB_ACCOUNT_ACTIONS_CLASS = `${SB_CLASS}__account-actions`;
const SB_ACTION_CLASS = `${SB_CLASS}__action`;
const SB_FOOTER_ACTIONS_CLASS = `${SB_CLASS}__footer-actions`;

const STYLE_ID = "nds-sidebar-style";

interface SidebarItem {
  key: string;
  label: string;
  icon?: string;
  href?: string;
  badge?: string | number;
  disabled?: boolean;
  children?: SidebarItem[];
}

interface SidebarSection {
  key: string;
  label?: string;
  items: SidebarItem[];
}

interface SidebarUser {
  name: string;
  role?: string;
  avatar?: string;
  avatarAlt?: string;
}

interface SidebarAction {
  key?: string;
  label: string;
  /** solid = 강조(충전하기), outlined = 보조(내역보기 / 로그아웃). 기본 outlined. */
  variant?: "solid" | "outlined";
  href?: string;
}

/**
 * 로고 아래 고정 계정 블록 — 캐포비 어드민의 "로고→계정 이메일→잔액(충전 금액)→CTA 쌍".
 * 메뉴(스크롤 영역)와 분리된 상단 고정 블록으로 렌더된다.
 */
interface SidebarAccount {
  /** 계정 이메일 등 식별 정보. */
  email?: string;
  /** 잔액 라벨(예: "충전 잔액"). */
  balanceLabel?: string;
  /** 잔액 금액 텍스트(예: "₩1,250,000"). */
  balance?: string;
  /** 하단 CTA 쌍 — 보통 [충전하기(solid), 내역보기(outlined)]. */
  actions?: SidebarAction[];
}

const isSectionList = (input: SidebarItem[] | SidebarSection[]): input is SidebarSection[] => {
  if (!Array.isArray(input) || input.length === 0) return false;
  const first = input[0] as { items?: unknown };
  return Array.isArray(first.items);
};

const normalizeSections = (input: SidebarItem[] | SidebarSection[]): SidebarSection[] => {
  if (isSectionList(input)) return input;
  return [{ key: "__default", items: input }];
};

const containsKey = (items: SidebarItem[] | undefined, key: string | undefined): boolean => {
  if (!items || !key) return false;
  for (const it of items) {
    if (it.key === key) return true;
    if (it.children && containsKey(it.children, key)) return true;
  }
  return false;
};

const sidebarStyles = `
  :where(.${SB_ROOT_CLASS}) {
    --nds-sidebar-width: 300px;
    --nds-sidebar-collapsed-width: 72px;
    --nds-sidebar-bg: ${cv.surface.default};
    --nds-sidebar-border-color: ${cv.borderRole.subtle};
    --nds-sidebar-text: ${cv.textRole.normal};
    --nds-sidebar-text-subtle: ${cv.textRole.subtle};
    --nds-sidebar-icon: ${cv.iconRole.normal};
    --nds-sidebar-icon-active: ${cv.iconRole.strong};
    --nds-sidebar-text-active: ${cv.textRole.strong};
    --nds-sidebar-item-radius: 16px;
    --nds-sidebar-item-active-radius: 12px;
    --nds-sidebar-item-hover-bg: ${cv.surface.section};
    --nds-sidebar-item-active-bg: ${cv.surface.brandSubtle};
    --nds-sidebar-item-active-accent: ${cv.fill.brand};

    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: var(--nds-sidebar-width);
    background: var(--nds-sidebar-bg);
    border-right: 1px solid var(--nds-sidebar-border-color);
    font-family: ${fontFamily.web};
    color: var(--nds-sidebar-text);
    box-sizing: border-box;
    transition: width 0.18s ease;
  }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"]) { width: var(--nds-sidebar-collapsed-width); }
  :where(.${SB_ROOT_CLASS}[data-full-height="true"]) { height: 100vh; position: sticky; top: 0; }

  :where(.${SB_HEADER_CLASS}) {
    display: flex; align-items: center; gap: ${spacing[12]}px;
    padding: ${spacing[32]}px ${spacing[24]}px ${spacing[16]}px ${spacing[24]}px;
    box-sizing: border-box;
  }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_HEADER_CLASS}) {
    padding: ${spacing[24]}px ${spacing[12]}px; justify-content: center;
  }
  :where(.${SB_LOGO_CLASS}) { display: inline-flex; align-items: center; flex-shrink: 0; color: inherit; text-decoration: none; }
  :where(.${SB_LOGO_CLASS} img) { display: block; max-height: 28px; width: auto; }

  :where(.${SB_TITLE_CLASS}) {
    margin: 0; font-size: ${typeScale.body1.fontSize}px; line-height: 20px;
    font-weight: ${fontWeight.bold}; color: var(--nds-sidebar-text-active);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  :where(.${SB_SUBTITLE_CLASS}) {
    margin: 4px 0 0; font-size: ${typeScale.caption1.fontSize}px; line-height: 18px;
    color: var(--nds-sidebar-text-subtle);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  :where(.${SB_TOGGLE_CLASS}) {
    flex-shrink: 0; width: 28px; height: 28px; border: none; background: transparent;
    border-radius: 6px; color: var(--nds-sidebar-icon); cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
  }
  :where(.${SB_TOGGLE_CLASS}:hover) { background: var(--nds-sidebar-item-hover-bg); color: var(--nds-sidebar-icon-active); }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_TITLE_CLASS}),
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_SUBTITLE_CLASS}),
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_TOGGLE_CLASS}) { display: none; }

  :where(.${SB_BODY_CLASS}) {
    flex: 1; overflow-y: auto; overflow-x: hidden;
    padding: 0 ${spacing[24]}px ${spacing[24]}px;
    -webkit-overflow-scrolling: touch;
  }
  :where(.${SB_SECTION_CLASS}) {
    padding: ${spacing[28]}px 0; display: flex; flex-direction: column; gap: ${spacing[8]}px;
  }
  :where(.${SB_SECTION_CLASS} + .${SB_SECTION_CLASS}) { border-top: 1px solid var(--nds-sidebar-border-color); }
  :where(.${SB_SECTION_LABEL_CLASS}) {
    padding: 0 ${spacing[10]}px 0 ${spacing[20]}px; margin: 0;
    font-size: 14px; line-height: 20px; font-weight: ${fontWeight.medium};
    color: var(--nds-sidebar-text-subtle); text-transform: uppercase; letter-spacing: 0.4px;
  }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_SECTION_LABEL_CLASS}) { display: none; }
  :where(.${SB_ITEM_LIST_CLASS}) {
    list-style: none; margin: 0; padding: 0;
    display: flex; flex-direction: column; gap: ${spacing[2]}px;
  }

  :where(.${SB_ITEM_CLASS}) { position: relative; }
  :where(.${SB_ITEM_INNER_CLASS}) {
    display: flex; align-items: center; gap: ${spacing[10]}px;
    width: 100%; height: 42px;
    padding: ${spacing[12]}px ${spacing[20]}px;
    border: none; background: transparent;
    border-radius: var(--nds-sidebar-item-radius);
    color: var(--nds-sidebar-text); text-decoration: none; text-align: left;
    cursor: pointer; font-family: inherit;
    font-size: ${typeScale.body1.fontSize}px; line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.medium};
    box-sizing: border-box;
    transition: background 0.12s ease, color 0.12s ease, border-radius 0.12s ease;
  }
  :where(.${SB_ITEM_INNER_CLASS}:hover) { background: var(--nds-sidebar-item-hover-bg); color: var(--nds-sidebar-text-active); }
  :where(.${SB_ITEM_INNER_CLASS}:focus-visible) { outline: 2px solid ${cv.borderRole.focus}; outline-offset: -2px; }
  :where(.${SB_ITEM_INNER_CLASS}[aria-current="page"]) {
    background: var(--nds-sidebar-item-active-bg);
    color: var(--nds-sidebar-text-active);
    border-radius: var(--nds-sidebar-item-active-radius);
    font-weight: ${fontWeight.medium};
  }
  :where(.${SB_ITEM_INNER_CLASS}[aria-disabled="true"]) { color: ${cv.textRole.disabled}; cursor: not-allowed; pointer-events: none; }
  :where(.${SB_ITEM_ICON_CLASS}) {
    display: inline-flex; align-items: center; justify-content: center;
    width: 24px; height: 24px; flex-shrink: 0; color: var(--nds-sidebar-icon);
  }
  :where(.${SB_ITEM_INNER_CLASS}:hover .${SB_ITEM_ICON_CLASS}),
  :where(.${SB_ITEM_INNER_CLASS}[aria-current="page"] .${SB_ITEM_ICON_CLASS}) { color: var(--nds-sidebar-icon-active); }
  :where(.${SB_ITEM_LABEL_CLASS}) { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_ITEM_LABEL_CLASS}) { display: none; }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_ITEM_INNER_CLASS}) { position: relative; justify-content: center; padding: 0; gap: 0; }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_ITEM_INNER_CLASS}[aria-current="page"]::before) { display: none; }
  :where(.${SB_ITEM_BADGE_CLASS}) {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 18px; height: 18px; padding: 0 6px; border-radius: 9px;
    background: ${cv.fill.statusError}; color: ${cv.textRole.inverse};
    font-size: ${typeScale.label.fontSize}px; line-height: 1; font-weight: ${fontWeight.bold};
    box-sizing: border-box;
  }
  :where(.${SB_ITEM_CARET_CLASS}) {
    display: inline-flex; align-items: center; justify-content: center;
    width: 16px; height: 16px; color: var(--nds-sidebar-text-subtle);
    transition: transform 0.18s ease;
  }
  :where(.${SB_ITEM_CARET_CLASS}[data-expanded="true"]) { transform: rotate(90deg); }
  /* Collapsed: caret hidden; a numeric badge collapses to an 8px dot on the icon's top-right.
     Declared AFTER the badge/caret base rules so the :where() (0-specificity) cascade resolves
     to these — otherwise the later base display:inline-flex would win and the count would render
     full-size in the 72px rail, breaking the layout. (react Sidebar.tsx 와 미러.) */
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_ITEM_CARET_CLASS}) { display: none; }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_ITEM_BADGE_CLASS}) {
    position: absolute; top: 6px; left: calc(50% + 3px);
    min-width: 0; width: 8px; height: 8px; padding: 0;
    border-radius: 50%; font-size: 0; line-height: 0; color: transparent;
  }

  :where(.${SB_CHILDREN_CLASS}) {
    list-style: none; margin: ${spacing[2]}px 0 0; padding: 0;
    display: flex; flex-direction: column; gap: ${spacing[2]}px;
  }
  :where(.${SB_CHILDREN_CLASS} .${SB_ITEM_INNER_CLASS}) {
    height: 36px; padding-left: ${spacing[40]}px;
    font-weight: ${fontWeight.regular}; font-size: ${typeScale.body3.fontSize}px;
  }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_CHILDREN_CLASS}) { display: none; }

  :where(.${SB_FOOTER_CLASS}) {
    padding: ${spacing[12]}px ${spacing[24]}px ${spacing[24]}px;
    box-sizing: border-box;
  }
  :where(.${SB_USER_CLASS}) {
    display: flex; align-items: center; gap: ${spacing[12]}px;
    padding: ${spacing[8]}px; border-radius: 8px;
  }
  :where(.${SB_USER_AVATAR_CLASS}) {
    width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
    background: ${cv.borderRole.strong}; color: ${cv.textRole.inverse};
    display: inline-flex; align-items: center; justify-content: center;
    font-size: ${typeScale.body1.fontSize}px; line-height: 1.5;
    font-weight: ${fontWeight.semibold}; overflow: hidden;
  }
  :where(.${SB_USER_AVATAR_CLASS} img) { width: 100%; height: 100%; object-fit: cover; }
  :where(.${SB_USER_META_CLASS}) {
    flex: 1; min-width: 0; display: flex; flex-direction: column; gap: ${spacing[4]}px;
  }
  :where(.${SB_USER_NAME_CLASS}) {
    margin: 0; font-size: ${typeScale.body1.fontSize}px; line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.bold}; color: var(--nds-sidebar-text-active);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  :where(.${SB_USER_ROLE_CLASS}) {
    margin: 0; font-size: ${typeScale.caption1.fontSize}px; line-height: 18px;
    color: var(--nds-sidebar-text-subtle);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_USER_META_CLASS}) { display: none; }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_USER_CLASS}) { justify-content: center; padding: ${spacing[4]}px; }

  /* ── 고정 계정 블록 (로고 아래) + 액션 버튼 (CTA 쌍 / 로그아웃) ───── */
  :where(.${SB_ACCOUNT_CLASS}) {
    display: flex; flex-direction: column; gap: ${spacing[12]}px;
    padding: 0 ${spacing[24]}px ${spacing[16]}px;
    box-sizing: border-box;
  }
  :where(.${SB_ACCOUNT_EMAIL_CLASS}) {
    margin: 0; font-size: ${typeScale.caption1.fontSize}px; line-height: 18px;
    color: var(--nds-sidebar-text-subtle);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  :where(.${SB_ACCOUNT_BALANCE_CLASS}) {
    display: flex; flex-direction: column; gap: ${spacing[4]}px;
    padding: ${spacing[12]}px ${spacing[16]}px; border-radius: 12px;
    background: ${cv.surface.section};
  }
  :where(.${SB_ACCOUNT_BALANCE_LABEL_CLASS}) {
    margin: 0; font-size: ${typeScale.caption1.fontSize}px; line-height: 16px;
    color: var(--nds-sidebar-text-subtle);
  }
  :where(.${SB_ACCOUNT_BALANCE_AMOUNT_CLASS}) {
    margin: 0; font-size: 20px; line-height: 26px; font-weight: ${fontWeight.bold};
    color: var(--nds-sidebar-text-active);
  }
  :where(.${SB_ACCOUNT_ACTIONS_CLASS}) { display: flex; gap: ${spacing[8]}px; }
  :where(.${SB_ACCOUNT_ACTIONS_CLASS} .${SB_ACTION_CLASS}) { flex: 1; }

  :where(.${SB_ACTION_CLASS}) {
    display: inline-flex; align-items: center; justify-content: center;
    height: 40px; padding: 0 ${spacing[16]}px; border-radius: 10px;
    border: 1px solid transparent; box-sizing: border-box;
    font-family: inherit; font-size: 14px; font-weight: ${fontWeight.semibold}; line-height: 1;
    text-decoration: none; cursor: pointer;
    transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease;
  }
  :where(.${SB_ACTION_CLASS}[data-variant="solid"]) {
    background: ${cv.button.bgDefault}; color: ${cv.button.textDefault};
  }
  :where(.${SB_ACTION_CLASS}[data-variant="solid"]:hover) { background: ${cv.button.bgHover}; }
  :where(.${SB_ACTION_CLASS}[data-variant="outlined"]) {
    background: ${cv.surface.default}; color: ${cv.textRole.brand}; border-color: ${cv.borderRole.brand};
  }
  :where(.${SB_ACTION_CLASS}[data-variant="outlined"]:hover) { background: ${cv.surface.brandSubtle}; }
  :where(.${SB_ACTION_CLASS}:focus-visible) { outline: 2px solid ${cv.borderRole.focus}; outline-offset: 1px; }

  :where(.${SB_FOOTER_ACTIONS_CLASS}) { display: flex; flex-direction: column; gap: ${spacing[8]}px; }
  :where(.${SB_FOOTER_ACTIONS_CLASS} .${SB_ACTION_CLASS}) { width: 100%; }

  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_ACCOUNT_CLASS}),
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_FOOTER_ACTIONS_CLASS}) { display: none; }

  /*
   * CashwalkBiz 튜닝 (캐포비 Library MenuItem 3302:641 실측). react Sidebar.tsx 와 미러.
   * 색은 --semantic-* 토큰 cascade 가 SSOT — hex 로 박지 않는다:
   *   · active bg = var(--semantic-bg-brand-subtle) → cashwalk = Yellow/100 #FFFAE5 (cashwalk-biz.semantic.ts bg.brand.subtle)
   *   · accent    = var(--semantic-fill-brand)       → cashwalk = #FFD200 (미사용 dormant 슬롯)
   * 캐포비만 갈라지는 것은 시멘틱 색 토큰으로 표현 불가능한 둘뿐:
   *   1) active radius — base 는 idle 16 → active 12, 캐포비는 idle 과 동일 16 유지 (geometry).
   *   2) active 라벨 색 — base 는 strong(#111) darkening, 캐포비는 선택 시에도 normal(#333) 유지 (text role 선택).
   */
  :where([data-brand="cashwalk-biz"] .${SB_ROOT_CLASS}) {
    --nds-sidebar-item-active-radius: 16px;
    --nds-sidebar-text-active: ${cv.textRole.normal};
  }
`;

const injectStyleOnce = (): void => {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = sidebarStyles;
  document.head.appendChild(style);
};

const CARET_SVG = `<svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const COLLAPSE_SVG = (collapsed: boolean): string =>
  `<svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true" style="${collapsed ? "transform: rotate(180deg);" : ""} transition: transform 0.18s;"><path d="M12 5l-5 5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 5v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;

export class NdsSidebar extends NdsElement {
  static elementName = "nds-sidebar";

  static get observedAttributes(): readonly string[] {
    return [
      "items",
      "active-key",
      "collapsed",
      "show-toggle",
      "width",
      "collapsed-width",
      "logo-src",
      "logo-alt",
      "logo-width",
      "logo-height",
      "logo-href",
      "title",
      "subtitle",
      "user",
      "account",
      "footer-actions",
      "full-height",
    ];
  }

  private _root: HTMLElement | null = null;
  /** key → expanded? for nested items. */
  private _expanded = new Map<string, boolean>();

  override connectedCallback(): void {
    injectStyleOnce();
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("aside");
    root.dataset.slot = "root";
    root.className = SB_ROOT_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  private _parseItems(): SidebarSection[] {
    // 1순위: 자식 <script type="application/json" slot="items"> — 속성이 아니라 텍스트
    //   노드라 따옴표/이스케이프 함정이 구조적으로 없다(권장 패턴, 단일파일 빌드에도 안전).
    // 2순위: items 속성(하위 호환).
    const script = this.querySelector<HTMLScriptElement>(
      'script[type="application/json"][slot="items"]',
    );
    const raw = script ? script.textContent : this.getAttribute("items");
    if (!raw || !raw.trim()) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return normalizeSections(parsed);
      console.warn("[nds-sidebar] items 가 JSON 배열이 아닙니다 — 메뉴를 비웁니다.", {
        rawHead: raw.slice(0, 80),
      });
    } catch (err) {
      // 조용히 [] 를 반환하면 "로고만 뜨고 메뉴가 통째로 사라지는" 디버깅 불가 증상이 된다.
      // 가장 흔한 원인: 단일따옴표 items 속성에서 JSON 구조용 따옴표까지 \" 로 과이스케이프
      //   (예: items='[{\"key\"...]'). 구조 따옴표는 bare 여야 하고 SVG 내부 따옴표만 \" 가 맞다.
      //   더 안전: <nds-sidebar><script type="application/json" slot="items">[...]</script>.
      console.warn(
        "[nds-sidebar] items 가 유효한 JSON 이 아닙니다 — 메뉴를 비웁니다. " +
          'JSON 구조용 따옴표를 \\" 로 이스케이프하지 마세요. ' +
          '가능하면 <script type="application/json" slot="items"> 자식을 쓰세요.',
        { error: err, rawHead: raw.slice(0, 80) },
      );
    }
    return [];
  }

  private _parseUser(): SidebarUser | null {
    const raw = this.getAttribute("user");
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && typeof parsed.name === "string") {
        return parsed as SidebarUser;
      }
    } catch {
      /* ignore */
    }
    return null;
  }

  private _parseAccount(): SidebarAccount | null {
    const raw = this.getAttribute("account");
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as SidebarAccount;
      }
    } catch {
      console.warn(
        "[nds-sidebar] account 가 유효한 JSON 객체가 아닙니다 — 계정 블록을 생략합니다.",
        {
          rawHead: raw.slice(0, 80),
        },
      );
    }
    return null;
  }

  private _parseActions(attr: string): SidebarAction[] {
    const raw = this.getAttribute(attr);
    if (!raw || !raw.trim()) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (a): a is SidebarAction => !!a && typeof a === "object" && typeof a.label === "string",
        );
      }
    } catch {
      console.warn(`[nds-sidebar] ${attr} 가 유효한 JSON 배열이 아닙니다 — 액션을 생략합니다.`, {
        rawHead: raw.slice(0, 80),
      });
    }
    return [];
  }

  private _buildAction(action: SidebarAction): HTMLElement {
    const variant = action.variant === "solid" ? "solid" : "outlined";
    const el = action.href ? document.createElement("a") : document.createElement("button");
    el.className = SB_ACTION_CLASS;
    el.dataset.variant = variant;
    if (el instanceof HTMLButtonElement) el.type = "button";
    if (el instanceof HTMLAnchorElement && action.href) el.href = action.href;
    el.textContent = action.label;
    el.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("action-click", {
          detail: { key: action.key, action },
          bubbles: true,
          composed: true,
        }),
      );
    });
    return el;
  }

  private _renderItem(item: SidebarItem, activeKey: string | null, depth: number): HTMLLIElement {
    const li = document.createElement("li");
    li.className = SB_ITEM_CLASS;

    const hasChildren = !!item.children?.length;
    const isActive = activeKey === item.key;
    const expanded =
      this._expanded.get(item.key) ?? containsKey(item.children, activeKey ?? undefined);
    this._expanded.set(item.key, expanded);

    const inner =
      item.href && !hasChildren && !item.disabled
        ? document.createElement("a")
        : document.createElement("button");
    inner.className = SB_ITEM_INNER_CLASS;
    if (inner instanceof HTMLButtonElement) {
      inner.type = "button";
      inner.disabled = !!item.disabled;
    }
    if (inner instanceof HTMLAnchorElement && item.href) {
      inner.href = item.href;
    }
    if (isActive) inner.setAttribute("aria-current", "page");
    if (item.disabled) inner.setAttribute("aria-disabled", "true");
    if (hasChildren) inner.setAttribute("aria-expanded", String(expanded));
    inner.dataset.depth = String(depth);
    inner.title = item.label;

    if (item.icon) {
      const iconSpan = document.createElement("span");
      iconSpan.className = SB_ITEM_ICON_CLASS;
      iconSpan.setAttribute("aria-hidden", "true");
      iconSpan.innerHTML = item.icon;
      inner.appendChild(iconSpan);
    }

    const labelSpan = document.createElement("span");
    labelSpan.className = SB_ITEM_LABEL_CLASS;
    labelSpan.textContent = item.label;
    inner.appendChild(labelSpan);

    if (item.badge !== undefined && item.badge !== null) {
      const badge = document.createElement("span");
      badge.className = SB_ITEM_BADGE_CLASS;
      badge.textContent = String(item.badge);
      inner.appendChild(badge);
    }

    if (hasChildren) {
      const caret = document.createElement("span");
      caret.className = SB_ITEM_CARET_CLASS;
      caret.dataset.expanded = expanded ? "true" : "false";
      caret.innerHTML = CARET_SVG;
      inner.appendChild(caret);
    }

    inner.addEventListener("click", (e) => {
      if (item.disabled) return;
      if (hasChildren) {
        e.preventDefault();
        const cur = this._expanded.get(item.key) ?? false;
        this._expanded.set(item.key, !cur);
        this.scheduleUpdate();
        return;
      }
      this.dispatchEvent(
        new CustomEvent("item-click", {
          detail: { item },
          bubbles: true,
          composed: true,
        }),
      );
    });

    li.appendChild(inner);

    if (hasChildren && expanded) {
      const childUl = document.createElement("ul");
      childUl.className = SB_CHILDREN_CLASS;
      item.children!.forEach((c) => childUl.appendChild(this._renderItem(c, activeKey, depth + 1)));
      li.appendChild(childUl);
    }

    return li;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const collapsed = this.boolAttr("collapsed");
    const fullHeight = this.attr("full-height", "true") !== "false";
    const showToggle = this.boolAttr("show-toggle");
    const widthAttr = this.getAttribute("width");
    const collapsedWidthAttr = this.getAttribute("collapsed-width");
    const activeKey = this.getAttribute("active-key");
    const title = this.getAttribute("title");
    const subtitle = this.getAttribute("subtitle");
    const logoSrc = this.getAttribute("logo-src");
    const logoAlt = this.attr("logo-alt", "");
    const logoWidth = this.getAttribute("logo-width");
    const logoHeight = this.getAttribute("logo-height");
    const logoHref = this.getAttribute("logo-href");
    const user = this._parseUser();
    const account = this._parseAccount();
    const footerActions = this._parseActions("footer-actions");
    const sections = this._parseItems();

    this._root.dataset.collapsed = collapsed ? "true" : "false";
    this._root.dataset.fullHeight = fullHeight ? "true" : "false";
    if (widthAttr) this._root.style.setProperty("--nds-sidebar-width", `${widthAttr}px`);
    if (collapsedWidthAttr) {
      this._root.style.setProperty("--nds-sidebar-collapsed-width", `${collapsedWidthAttr}px`);
    }

    const children: Node[] = [];

    const hasHeader = !!(logoSrc || title || subtitle || showToggle);
    if (hasHeader) {
      const header = document.createElement("div");
      header.dataset.slot = "header";
      header.className = SB_HEADER_CLASS;

      if (logoSrc) {
        const logoWrap = logoHref ? document.createElement("a") : document.createElement("span");
        logoWrap.className = SB_LOGO_CLASS;
        if (logoWrap instanceof HTMLAnchorElement && logoHref) logoWrap.href = logoHref;
        if (logoAlt) logoWrap.setAttribute("aria-label", logoAlt);
        const img = document.createElement("img");
        img.src = logoSrc;
        img.alt = logoAlt;
        if (logoWidth) img.width = parseInt(logoWidth, 10);
        if (logoHeight) img.height = parseInt(logoHeight, 10);
        logoWrap.appendChild(img);
        header.appendChild(logoWrap);
      }

      if (title || subtitle) {
        const meta = document.createElement("div");
        meta.style.flex = "1";
        meta.style.minWidth = "0";
        if (title) {
          const p = document.createElement("p");
          p.className = SB_TITLE_CLASS;
          p.textContent = title;
          meta.appendChild(p);
        }
        if (subtitle) {
          const p = document.createElement("p");
          p.className = SB_SUBTITLE_CLASS;
          p.textContent = subtitle;
          meta.appendChild(p);
        }
        header.appendChild(meta);
      }

      if (showToggle) {
        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = SB_TOGGLE_CLASS;
        toggle.setAttribute("aria-label", collapsed ? "사이드바 펼치기" : "사이드바 접기");
        toggle.innerHTML = COLLAPSE_SVG(collapsed);
        toggle.addEventListener("click", () => {
          this.dispatchEvent(new CustomEvent("toggle-collapse", { bubbles: true, composed: true }));
        });
        header.appendChild(toggle);
      }

      children.push(header);
    }

    // 고정 계정 블록 (로고 아래, 메뉴 위) — 이메일 → 잔액 → CTA 쌍.
    if (account && (account.email || account.balance || account.actions?.length)) {
      const accountEl = document.createElement("div");
      accountEl.dataset.slot = "account";
      accountEl.className = SB_ACCOUNT_CLASS;

      if (account.email) {
        const email = document.createElement("p");
        email.className = SB_ACCOUNT_EMAIL_CLASS;
        email.textContent = account.email;
        accountEl.appendChild(email);
      }

      if (account.balance || account.balanceLabel) {
        const balance = document.createElement("div");
        balance.className = SB_ACCOUNT_BALANCE_CLASS;
        if (account.balanceLabel) {
          const label = document.createElement("p");
          label.className = SB_ACCOUNT_BALANCE_LABEL_CLASS;
          label.textContent = account.balanceLabel;
          balance.appendChild(label);
        }
        if (account.balance) {
          const amount = document.createElement("p");
          amount.className = SB_ACCOUNT_BALANCE_AMOUNT_CLASS;
          amount.textContent = account.balance;
          balance.appendChild(amount);
        }
        accountEl.appendChild(balance);
      }

      if (account.actions?.length) {
        const actions = document.createElement("div");
        actions.className = SB_ACCOUNT_ACTIONS_CLASS;
        account.actions.forEach((a) => actions.appendChild(this._buildAction(a)));
        accountEl.appendChild(actions);
      }

      children.push(accountEl);
    }

    const nav = document.createElement("nav");
    nav.dataset.slot = "body";
    nav.className = SB_BODY_CLASS;
    nav.setAttribute("aria-label", "사이드바 메뉴");
    sections.forEach((section) => {
      const sectionEl = document.createElement("div");
      sectionEl.className = SB_SECTION_CLASS;
      if (section.label) {
        const p = document.createElement("p");
        p.className = SB_SECTION_LABEL_CLASS;
        p.textContent = section.label;
        sectionEl.appendChild(p);
      }
      const ul = document.createElement("ul");
      ul.className = SB_ITEM_LIST_CLASS;
      section.items.forEach((it) => ul.appendChild(this._renderItem(it, activeKey, 0)));
      sectionEl.appendChild(ul);
      nav.appendChild(sectionEl);
    });
    children.push(nav);

    if (user || footerActions.length) {
      const footer = document.createElement("div");
      footer.dataset.slot = "footer";
      footer.className = SB_FOOTER_CLASS;

      if (user) {
        const userBlock = document.createElement("div");
        userBlock.className = SB_USER_CLASS;
        const avatar = document.createElement("span");
        avatar.className = SB_USER_AVATAR_CLASS;
        if (user.avatar) {
          const img = document.createElement("img");
          img.src = user.avatar;
          img.alt = user.avatarAlt ?? "";
          avatar.appendChild(img);
        } else {
          avatar.textContent = (user.name || "").slice(0, 1).toUpperCase();
        }
        const meta = document.createElement("div");
        meta.className = SB_USER_META_CLASS;
        const name = document.createElement("p");
        name.className = SB_USER_NAME_CLASS;
        name.textContent = user.name;
        meta.appendChild(name);
        if (user.role) {
          const role = document.createElement("p");
          role.className = SB_USER_ROLE_CLASS;
          role.textContent = user.role;
          meta.appendChild(role);
        }
        userBlock.append(avatar, meta);
        footer.appendChild(userBlock);
      }

      // 푸터 액션 (로그아웃 등) — 메뉴 스크롤과 분리된 하단 고정.
      if (footerActions.length) {
        const actions = document.createElement("div");
        actions.className = SB_FOOTER_ACTIONS_CLASS;
        footerActions.forEach((a) => actions.appendChild(this._buildAction(a)));
        footer.appendChild(actions);
      }

      children.push(footer);
    }

    this._root.replaceChildren(...children);
  }
}

define(NdsSidebar);
