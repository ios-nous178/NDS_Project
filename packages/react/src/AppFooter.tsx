import React from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  sizing,
  spacing,
  transition,
  typeScale,
  zIndex,
} from "@nudge-eap/tokens";

/* ─── Constants ─── */

const FOOTER_CLASS = "nds-app-footer";
const FOOTER_LINKS_CLASS = `${FOOTER_CLASS}__links`;
const FOOTER_LINK_CLASS = `${FOOTER_CLASS}__link`;
const FOOTER_INFO_CLASS = `${FOOTER_CLASS}__info`;
const FOOTER_NAV_CLASS = `${FOOTER_CLASS}__nav`;
const FOOTER_NAV_ITEM_CLASS = `${FOOTER_NAV_CLASS}-item`;
const FOOTER_COMPANY_CLASS = `${FOOTER_CLASS}__company`;
const FOOTER_EXTRA_CLASS = `${FOOTER_CLASS}__extra`;

/* ─── Variant ─── */

export type AppFooterVariant = "info" | "tab-bar";

// eslint-disable-next-line unused-imports/no-unused-vars
const appFooterStyles = `
  /* ─── Info footer (홈페이지 하단) ─── */
  :where(.${FOOTER_CLASS}[data-variant="info"]) {
    width: 100%;
    padding: var(--nds-footer-padding, ${spacing[16]}px);
    background: var(--nds-footer-background, ${cv.bg.light});
    font-family: var(--nds-footer-font-family, ${fontFamily.web});
    box-sizing: border-box;
  }

  :where(.${FOOTER_CLASS}[data-variant="info"]) .${FOOTER_LINKS_CLASS} {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${spacing[4]}px;
    margin-bottom: ${spacing[16]}px;
  }

  :where(.${FOOTER_CLASS}[data-variant="info"]) .${FOOTER_LINK_CLASS} {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.text.subtle};
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
    color: ${cv.text.subtle};
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
    background: var(--nds-footer-background, ${cv.bg.white});
    border-top: 1px solid var(--nds-footer-border-color, ${cv.border.light});
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
    color: var(--nds-footer-nav-color, ${cv.text.subtle});
    transition:
      opacity ${transition.default},
      color ${transition.default};
  }

  :where(.${FOOTER_NAV_ITEM_CLASS}[data-active="true"]) {
    opacity: 1;
    color: var(--nds-footer-nav-active-color, ${cv.text.default});
  }

  :where(.${FOOTER_NAV_ITEM_CLASS}[aria-disabled="true"]) {
    pointer-events: none;
  }

  :where(.${FOOTER_NAV_ITEM_CLASS}) .nds-app-footer__nav-icon {
    width: ${sizing.icon.default}px;
    height: ${sizing.icon.default}px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :where(.${FOOTER_NAV_ITEM_CLASS}) .nds-app-footer__nav-label {
    font-size: ${typeScale.label.fontSize}px;
    line-height: ${typeScale.label.lineHeight}px;
    font-weight: ${fontWeight.regular};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :where(.${FOOTER_NAV_ITEM_CLASS}[data-active="true"]) .nds-app-footer__nav-label {
    color: var(--nds-footer-nav-active-color, ${cv.text.default});
  }

  /* ─── CompanyInfo ─── */

  :where(.${FOOTER_COMPANY_CLASS}) {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${spacing[24]}px;
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: 1.6;
    color: var(--nds-footer-company-color, ${cv.text.subtle});
  }

  :where(.${FOOTER_COMPANY_CLASS}) .${FOOTER_CLASS}__company-name {
    font-weight: ${fontWeight.medium};
    margin-bottom: ${spacing[4]}px;
  }

  :where(.${FOOTER_COMPANY_CLASS}) .${FOOTER_CLASS}__company-copyright {
    margin-top: ${spacing[12]}px;
    color: var(--nds-footer-muted-color, ${cv.text.disabled});
  }

  :where(.${FOOTER_COMPANY_CLASS}) .${FOOTER_CLASS}__company-logo {
    object-fit: contain;
    flex-shrink: 0;
  }

  :where(.${FOOTER_COMPANY_CLASS}) .${FOOTER_CLASS}__company-sep {
    display: inline-block;
    width: 1px;
    height: 10px;
    background: var(--nds-footer-muted-color, ${cv.text.disabled});
    margin: 0 ${spacing[8]}px;
    vertical-align: middle;
  }

  /* ─── Extra ─── */

  :where(.${FOOTER_EXTRA_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: 1.6;
    color: var(--nds-footer-extra-color, ${cv.text.subtle});
    margin-bottom: ${spacing[12]}px;
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Divider (info variant 내부 구분자) ─── */

const FooterDivider = () => (
  <span
    style={{
      width: 1,
      height: 10,
      background: cv.border.default,
      margin: `0 ${spacing[8]}px`,
      flexShrink: 0,
    }}
  />
);

/* ─── Link item type ─── */

export interface FooterLinkItem {
  /** 링크 텍스트 */
  label: string;
  /** 링크 URL */
  href: string;
  /** 굵게 표시 여부 (개인정보처리방침 등) */
  bold?: boolean;
  /** 새 탭 열기 */
  external?: boolean;
}

/* ─── Tab item type ─── */

export interface FooterTabItem {
  /** 탭 고유 키 */
  key: string;
  /** 탭 라벨 */
  label: string;
  /** 비활성 아이콘 */
  icon: React.ReactNode;
  /** 활성 아이콘 */
  activeIcon: React.ReactNode;
  /** 링크 경로 */
  href: string;
}

/* ─── Info Footer ─── */

export interface AppFooterInfoProps extends React.HTMLAttributes<HTMLElement> {
  /** 약관 등 링크 목록 */
  links?: FooterLinkItem[];
  /** 회사 정보 (주소, 사업자번호 등) */
  companyInfo?: React.ReactNode;
  /** 링크 클릭 핸들러 (SPA 라우터 연동 시) */
  onLinkClick?: (link: FooterLinkItem, e: React.MouseEvent) => void;
}

export const AppFooterInfo = React.forwardRef<HTMLElement, AppFooterInfoProps>(
  ({ links, companyInfo, onLinkClick, className, style, children, ...rest }, ref) => {
    return (
      <footer
        ref={ref}
        data-slot="root"
        data-variant="info"
        className={cx(FOOTER_CLASS, className)}
        style={
          {
            "--nds-footer-padding": `${spacing[16]}px`,
            "--nds-footer-background": cv.bg.light,
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        {children ?? (
          <>
            {links && links.length > 0 && (
              <nav data-slot="links" className={FOOTER_LINKS_CLASS}>
                {links.map((link, i) => (
                  <React.Fragment key={link.href}>
                    {i > 0 && <FooterDivider />}
                    <a
                      href={link.href}
                      target={link.external !== false ? "_blank" : undefined}
                      rel={link.external !== false ? "noopener noreferrer" : undefined}
                      data-bold={link.bold || undefined}
                      className={FOOTER_LINK_CLASS}
                      onClick={onLinkClick ? (e) => onLinkClick(link, e) : undefined}
                    >
                      {link.label}
                    </a>
                  </React.Fragment>
                ))}
              </nav>
            )}
            {companyInfo && (
              <div data-slot="info" className={FOOTER_INFO_CLASS}>
                {companyInfo}
              </div>
            )}
          </>
        )}
      </footer>
    );
  },
);

AppFooterInfo.displayName = "AppFooterInfo";

/* ─── Tab Bar Footer ─── */

export interface AppFooterTabBarProps extends React.HTMLAttributes<HTMLElement> {
  /** 탭 목록 */
  tabs: FooterTabItem[];
  /** 현재 활성 탭 key */
  activeTab?: string;
  /** 탭 클릭 핸들러 */
  onTabClick?: (tab: FooterTabItem, e: React.MouseEvent) => void;
  /** 탭을 감싸는 커스텀 렌더러 (Link 컴포넌트 등) */
  renderTab?: (tab: FooterTabItem, isActive: boolean, children: React.ReactNode) => React.ReactNode;
}

export const AppFooterTabBar = React.forwardRef<HTMLElement, AppFooterTabBarProps>(
  ({ tabs, activeTab, onTabClick, renderTab, className, style, children, ...rest }, ref) => {
    return (
      <nav
        ref={ref}
        role="tablist"
        data-slot="root"
        data-variant="tab-bar"
        className={cx(FOOTER_CLASS, className)}
        style={
          {
            "--nds-footer-height": `${sizing.bottomBar.height}px`,
            "--nds-footer-background": cv.bg.white,
            "--nds-footer-border-color": cv.border.light,
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        {children ??
          tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const content = (
              <>
                <span className="nds-app-footer__nav-icon">
                  {isActive ? tab.activeIcon : tab.icon}
                </span>
                <span className="nds-app-footer__nav-label">{tab.label}</span>
              </>
            );

            if (renderTab) {
              return (
                <React.Fragment key={tab.key}>{renderTab(tab, isActive, content)}</React.Fragment>
              );
            }

            return (
              <a
                key={tab.key}
                role="tab"
                href={tab.href}
                data-active={isActive || undefined}
                aria-selected={isActive}
                aria-disabled={isActive || undefined}
                className={FOOTER_NAV_ITEM_CLASS}
                onClick={onTabClick ? (e) => onTabClick(tab, e) : undefined}
              >
                {content}
              </a>
            );
          })}
      </nav>
    );
  },
);

AppFooterTabBar.displayName = "AppFooterTabBar";

/* ────────────────────────────────────
   Sub-components (Compound pattern)
   ──────────────────────────────────── */

/* ─── Links (extracted from Info internal) ─── */

export interface AppFooterLinksProps extends React.HTMLAttributes<HTMLElement> {
  links: FooterLinkItem[];
  onLinkClick?: (link: FooterLinkItem, e: React.MouseEvent) => void;
}

export const AppFooterLinks = React.memo(
  React.forwardRef<HTMLElement, AppFooterLinksProps>(
    ({ links, onLinkClick, className, ...rest }, ref) => (
      <nav ref={ref} data-slot="links" className={cx(FOOTER_LINKS_CLASS, className)} {...rest}>
        {links.map((link, i) => (
          <React.Fragment key={link.label}>
            {i > 0 && <FooterDivider />}
            <a
              href={link.href}
              target={link.external !== false ? "_blank" : undefined}
              rel={link.external !== false ? "noopener noreferrer" : undefined}
              data-bold={link.bold || undefined}
              className={FOOTER_LINK_CLASS}
              onClick={onLinkClick ? (e) => onLinkClick(link, e) : undefined}
            >
              {link.label}
            </a>
          </React.Fragment>
        ))}
      </nav>
    ),
  ),
);
AppFooterLinks.displayName = "AppFooter.Links";

/* ─── CompanyInfo ─── */

export interface CompanyInfoData {
  name: string;
  ceo?: string;
  address: string;
  bizNumber: string;
  phone?: string;
  email?: string;
  copyright: string;
}

export interface AppFooterCompanyInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  data: CompanyInfoData;
  /** 푸터 로고 src */
  logoSrc?: string;
  logoWidth?: number;
  logoHeight?: number;
}

const Separator = () => <span className={`${FOOTER_CLASS}__company-sep`} />;

export const AppFooterCompanyInfo = React.memo(
  React.forwardRef<HTMLDivElement, AppFooterCompanyInfoProps>(
    ({ data, logoSrc, logoWidth, logoHeight, className, ...rest }, ref) => (
      <div ref={ref} data-slot="company" className={cx(FOOTER_COMPANY_CLASS, className)} {...rest}>
        <div style={{ minWidth: 0 }}>
          <p className={`${FOOTER_CLASS}__company-name`}>{data.name}</p>
          <p>
            {data.ceo && (
              <>
                <span>대표이사: {data.ceo}</span>
                <Separator />
              </>
            )}
            <span>사업자등록번호: {data.bizNumber}</span>
          </p>
          <p>{data.address}</p>
          <p>
            {data.phone && (
              <>
                <span>전화: {data.phone}</span>
                <Separator />
              </>
            )}
            {data.email && <span>이메일: {data.email}</span>}
          </p>
          <p className={`${FOOTER_CLASS}__company-copyright`}>{data.copyright}</p>
        </div>
        {logoSrc && (
          <img
            className={`${FOOTER_CLASS}__company-logo`}
            src={logoSrc}
            alt="Logo"
            width={logoWidth}
            height={logoHeight}
          />
        )}
      </div>
    ),
  ),
);
AppFooterCompanyInfo.displayName = "AppFooter.CompanyInfo";

/* ─── Extra (고지사항/긴급연락처) ─── */

export type AppFooterExtraProps = React.HTMLAttributes<HTMLDivElement>;

export const AppFooterExtra = React.memo(
  React.forwardRef<HTMLDivElement, AppFooterExtraProps>(({ className, children, ...rest }, ref) => (
    <div ref={ref} data-slot="extra" className={cx(FOOTER_EXTRA_CLASS, className)} {...rest}>
      {children}
    </div>
  )),
);
AppFooterExtra.displayName = "AppFooter.Extra";

/* ─── Compound export ─── */

export const AppFooter = Object.assign(
  {} as {
    Info: typeof AppFooterInfo;
    TabBar: typeof AppFooterTabBar;
    Links: typeof AppFooterLinks;
    CompanyInfo: typeof AppFooterCompanyInfo;
    Extra: typeof AppFooterExtra;
  },
  {
    Info: AppFooterInfo,
    TabBar: AppFooterTabBar,
    Links: AppFooterLinks,
    CompanyInfo: AppFooterCompanyInfo,
    Extra: AppFooterExtra,
  },
);
