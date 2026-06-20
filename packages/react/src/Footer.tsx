import React from "react";
import { cv, sizing, spacing } from "@nudge-design/tokens";

/* ─── Constants ─── */

const FOOTER_CLASS = "nds-footer";
const FOOTER_LINKS_CLASS = `${FOOTER_CLASS}__links`;
const FOOTER_LINK_CLASS = `${FOOTER_CLASS}__link`;
const FOOTER_INFO_CLASS = `${FOOTER_CLASS}__info`;
const FOOTER_NAV_CLASS = `${FOOTER_CLASS}__nav`;
const FOOTER_NAV_ITEM_CLASS = `${FOOTER_NAV_CLASS}-item`;
const FOOTER_COMPANY_CLASS = `${FOOTER_CLASS}__company`;
const FOOTER_EXTRA_CLASS = `${FOOTER_CLASS}__extra`;

/* ─── Variant ─── */

export type FooterVariant = "info" | "tab-bar" | "web";
export type FooterWebTone = "light" | "dark";
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Divider (info variant 내부 구분자) ─── */

const InfoDivider = () => (
  <span
    style={{
      width: 1,
      height: 10,
      background: cv.borderRole.normal,
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

export interface FooterInfoProps extends React.HTMLAttributes<HTMLElement> {
  /** 약관 등 링크 목록 */
  links?: FooterLinkItem[];
  /** 회사 정보 (주소, 사업자번호 등) */
  companyInfo?: React.ReactNode;
  /** 링크 클릭 핸들러 (SPA 라우터 연동 시) */
  onLinkClick?: (link: FooterLinkItem, e: React.MouseEvent) => void;
}

export const FooterInfo = React.forwardRef<HTMLElement, FooterInfoProps>(
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
            "--nds-footer-background": cv.surface.subtle,
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
                    {i > 0 && <InfoDivider />}
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

FooterInfo.displayName = "Footer.Info";

/* ─── Tab Bar Footer ─── */

export interface FooterTabBarProps extends React.HTMLAttributes<HTMLElement> {
  /** 탭 목록 */
  tabs: FooterTabItem[];
  /** 현재 활성 탭 key */
  activeTab?: string;
  /** 탭 클릭 핸들러 */
  onTabClick?: (tab: FooterTabItem, e: React.MouseEvent) => void;
  /** 탭을 감싸는 커스텀 렌더러 (Link 컴포넌트 등) */
  renderTab?: (tab: FooterTabItem, isActive: boolean, children: React.ReactNode) => React.ReactNode;
}

export const FooterTabBar = React.forwardRef<HTMLElement, FooterTabBarProps>(
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
            "--nds-footer-background": cv.surface.default,
            "--nds-footer-border-color": cv.borderRole.subtle,
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
                <span className={`${FOOTER_CLASS}__nav-icon`}>
                  {isActive ? tab.activeIcon : tab.icon}
                </span>
                <span className={`${FOOTER_CLASS}__nav-label`}>{tab.label}</span>
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

FooterTabBar.displayName = "Footer.TabBar";

/* ────────────────────────────────────
   Sub-components (Compound pattern)
   ──────────────────────────────────── */

/* ─── Links (extracted from Info internal) ─── */

export interface FooterLinksProps extends React.HTMLAttributes<HTMLElement> {
  links: FooterLinkItem[];
  onLinkClick?: (link: FooterLinkItem, e: React.MouseEvent) => void;
}

export const FooterLinks = React.memo(
  React.forwardRef<HTMLElement, FooterLinksProps>(
    ({ links, onLinkClick, className, ...rest }, ref) => (
      <nav ref={ref} data-slot="links" className={cx(FOOTER_LINKS_CLASS, className)} {...rest}>
        {links.map((link, i) => (
          <React.Fragment key={link.label}>
            {i > 0 && <InfoDivider />}
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
FooterLinks.displayName = "Footer.Links";

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

export interface FooterCompanyInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  data: CompanyInfoData;
  /** 푸터 로고 src */
  logoSrc?: string;
  logoWidth?: number;
  logoHeight?: number;
}

const Separator = () => <span className={`${FOOTER_CLASS}__company-sep`} />;

export const FooterCompanyInfo = React.memo(
  React.forwardRef<HTMLDivElement, FooterCompanyInfoProps>(
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
FooterCompanyInfo.displayName = "Footer.CompanyInfo";

/* ─── Extra (고지사항/긴급연락처) ─── */

export type FooterExtraProps = React.HTMLAttributes<HTMLDivElement>;

export const FooterExtra = React.memo(
  React.forwardRef<HTMLDivElement, FooterExtraProps>(({ className, children, ...rest }, ref) => (
    <div ref={ref} data-slot="extra" className={cx(FOOTER_EXTRA_CLASS, className)} {...rest}>
      {children}
    </div>
  )),
);
FooterExtra.displayName = "Footer.Extra";

/* ─── Web variant (rich PC footer skeleton — compound) ─── */

export interface FooterWebProps extends React.HTMLAttributes<HTMLElement> {
  /** 콘텐츠 max-width (px). 기본 1200. */
  maxWidth?: number;
  /** 톤 — 토큰 swap. 기본 'light'. dark 는 흰 텍스트 + 어두운 배경. */
  tone?: FooterWebTone;
}

export const FooterWeb = React.forwardRef<HTMLElement, FooterWebProps>(
  ({ maxWidth, tone = "light", className, style, children, ...rest }, ref) => {
    return (
      <footer
        ref={ref}
        data-slot="root"
        data-variant="web"
        data-tone={tone}
        className={cx(FOOTER_CLASS, className)}
        style={
          {
            ...(maxWidth ? { "--nds-footer-web-max-width": `${maxWidth}px` } : {}),
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        <div className={`${FOOTER_CLASS}__web-inner`}>{children}</div>
      </footer>
    );
  },
);
FooterWeb.displayName = "Footer.Web";

export interface FooterWebRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** flex 정렬. 기본 between. */
  align?: "between" | "start" | "end" | "center" | "top";
}

export const FooterWebRow = React.forwardRef<HTMLDivElement, FooterWebRowProps>(
  ({ align = "between", className, ...rest }, ref) => (
    <div
      ref={ref}
      data-slot="web-row"
      data-align={align}
      className={cx(`${FOOTER_CLASS}__web-row`, className)}
      {...rest}
    />
  ),
);
FooterWebRow.displayName = "Footer.Web.Row";

export const FooterWebDivider = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...rest }, ref) => (
      <div
        ref={ref}
        aria-hidden="true"
        data-slot="web-divider"
        className={cx(`${FOOTER_CLASS}__web-divider`, className)}
        {...rest}
      />
    ),
  ),
);
FooterWebDivider.displayName = "Footer.Web.Divider";

export type FooterWebSectionProps = React.HTMLAttributes<HTMLElement>;

export const FooterWebSection = React.forwardRef<HTMLElement, FooterWebSectionProps>(
  ({ className, ...rest }, ref) => (
    <section
      ref={ref}
      data-slot="web-section"
      className={cx(`${FOOTER_CLASS}__web-section`, className)}
      {...rest}
    />
  ),
);
FooterWebSection.displayName = "Footer.Web.Section";

/* ─── Compound export ─── */

const FooterWebCompound = Object.assign(FooterWeb, {
  Row: FooterWebRow,
  Divider: FooterWebDivider,
  Section: FooterWebSection,
});

/**
 * Base `Footer` compound — `{Project}Footer` (`NudgeEAPFooter` / `TrostFooter` /
 * `CashwalkBizFooter` / `GenietFooter`) 의 빌딩 블록.
 *
 *   - `.Info` — 회사 정보 푸터 (홈페이지 하단)
 *   - `.TabBar` — 하단 탭 네비게이션 (앱)
 *   - `.Web` — 데스크톱 PC 푸터 골격 (`.Web.Row` / `.Web.Divider` / `.Web.Section`)
 *   - `.Links` / `.CompanyInfo` / `.Extra` — 컴포지션 슬롯
 *
 * 프로젝트 화면에서는 `{Project}Footer` 를 사용하고, 베이스는 커스텀 푸터 구성 시에만 직접
 * 호출.
 */
export const Footer = Object.assign(
  {} as {
    Info: typeof FooterInfo;
    TabBar: typeof FooterTabBar;
    Web: typeof FooterWebCompound;
    Links: typeof FooterLinks;
    CompanyInfo: typeof FooterCompanyInfo;
    Extra: typeof FooterExtra;
  },
  {
    Info: FooterInfo,
    TabBar: FooterTabBar,
    Web: FooterWebCompound,
    Links: FooterLinks,
    CompanyInfo: FooterCompanyInfo,
    Extra: FooterExtra,
  },
);
