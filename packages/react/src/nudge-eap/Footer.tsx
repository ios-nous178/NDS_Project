import React from "react";
import { Footer as BaseFooter } from "../Footer.js";
import type { FooterLinkItem, CompanyInfoData } from "../Footer.js";
import { NUDGE_EAP_LOGO_FOOTER_DATA_URI } from "../brand-logo-defaults.js";

/* ─────────────────────────────────────────────────────
   App surface — 회사 정보 푸터 (base Footer.Info wrapper)
   ───────────────────────────────────────────────────── */

export interface NudgeEAPFooterLogo {
  src: string;
  width?: number;
  height?: number;
}

export interface NudgeEAPFooterAppProps {
  surface?: "app";
  links?: FooterLinkItem[];
  company: CompanyInfoData;
  extra?: React.ReactNode;
  /** 미지정 시 base64 내장 로고 (nudge-eap-logo-footer) 사용 — 파일 호스팅 불필요. */
  logo?: NudgeEAPFooterLogo;
}

const NudgeEAPFooterApp = React.forwardRef<HTMLElement, NudgeEAPFooterAppProps>(
  ({ links, company, extra, logo }, ref) => {
    return (
      <BaseFooter.Info ref={ref}>
        {links && links.length > 0 && <BaseFooter.Links links={links} />}
        {extra && <BaseFooter.Extra>{extra}</BaseFooter.Extra>}
        <BaseFooter.CompanyInfo
          data={company}
          logoSrc={logo?.src ?? NUDGE_EAP_LOGO_FOOTER_DATA_URI}
          logoWidth={logo?.width ?? 100}
          logoHeight={logo?.height ?? 23}
        />
      </BaseFooter.Info>
    );
  },
);
NudgeEAPFooterApp.displayName = "NudgeEAPFooter.App";

/* ─────────────────────────────────────────────────────
   Web surface — Figma 20:13799 정합
   ─────────────────────────────────────────────────────
   레이아웃 (1920 viewport, content max-width 1200, 좌우 360 margin):
     - bg #FAFAFA (neutral/50), height 320
     - Row 1 (top 20–60): 약관 링크 4개 (좌) + 앱다운로드 원형 3개 (우)
     - Divider 1px (top 84, full viewport width)
     - Row 2 (top 117–162): 회사정보 (좌) + ISO 27001 인증 (우)
     - Row 3 (top 187–260): © 카피라이트 · powered by · DAIN 로고
   ───────────────────────────────────────────────────── */

const WEB_ROOT_CLASS = "nds-nudge-eap-web-footer";

const webFooterStyles = `
  :where(.${WEB_ROOT_CLASS}) {
    width: 100%;
    background: var(--semantic-fill-bg-default, #fafafa);
    font-family: Pretendard, -apple-system, sans-serif;
    color: var(--semantic-text-normal-default, #383838);
    box-sizing: border-box;
  }
  :where(.${WEB_ROOT_CLASS}__inner) {
    position: relative;
    max-width: var(--nds-nudge-eap-web-footer-max-width, 1200px);
    margin: 0 auto;
    padding: 0 16px;
    box-sizing: border-box;
  }
  :where(.${WEB_ROOT_CLASS}__row-1) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 0;
  }
  :where(.${WEB_ROOT_CLASS}__links) {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  :where(.${WEB_ROOT_CLASS}__links a) {
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
    color: var(--semantic-text-subtle-default, #666);
    text-decoration: none;
  }
  :where(.${WEB_ROOT_CLASS}__links a[data-bold="true"]) {
    font-weight: 700;
    color: var(--semantic-text-normal-default, #383838);
  }
  :where(.${WEB_ROOT_CLASS}__link-sep) {
    width: 1px;
    height: 10px;
    background: var(--semantic-text-subtle-default, #666);
    opacity: 0.4;
  }
  :where(.${WEB_ROOT_CLASS}__app-downloads) {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  :where(.${WEB_ROOT_CLASS}__app-badge) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 22px;
    background: var(--semantic-text-muted-default, #999);
    color: #fff;
    text-decoration: none;
    transition: opacity 0.15s ease;
  }
  :where(.${WEB_ROOT_CLASS}__app-badge:hover) {
    opacity: 0.85;
  }
  :where(.${WEB_ROOT_CLASS}__divider) {
    height: 1px;
    background: var(--semantic-border-subtle-default, #ececec);
  }
  :where(.${WEB_ROOT_CLASS}__row-2) {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 32px 0 24px;
  }
  :where(.${WEB_ROOT_CLASS}__company-info) {
    font-size: 14px;
    line-height: 20px;
    color: var(--semantic-text-subtle-default, #666);
  }
  :where(.${WEB_ROOT_CLASS}__company-line) {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }
  :where(.${WEB_ROOT_CLASS}__company-line + .${WEB_ROOT_CLASS}__company-line) {
    margin-top: 4px;
  }
  :where(.${WEB_ROOT_CLASS}__company-sep) {
    width: 1px;
    height: 10px;
    background: var(--semantic-text-subtle-default, #666);
    opacity: 0.4;
  }
  :where(.${WEB_ROOT_CLASS}__iso) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  :where(.${WEB_ROOT_CLASS}__iso-img) {
    width: 78px;
    height: 111px;
    object-fit: contain;
  }
  :where(.${WEB_ROOT_CLASS}__iso-caption) {
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    color: var(--semantic-text-subtle-default, #666);
    text-align: center;
    margin: 0;
  }
  :where(.${WEB_ROOT_CLASS}__row-3) {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-bottom: 28px;
    font-size: 14px;
    line-height: 20px;
    color: var(--semantic-text-muted-default, #999);
  }
  :where(.${WEB_ROOT_CLASS}__row-3-bottom) {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
  }
  :where(.${WEB_ROOT_CLASS}__dain-logo) {
    height: 30px;
    width: auto;
    object-fit: contain;
  }
  :where(.${WEB_ROOT_CLASS}__dain-label) {
    font-size: 14px;
    color: var(--semantic-text-normal-default, #383838);
  }
`;

export interface NudgeEAPFooterWebLink {
  label: string;
  href: string;
  /** 강조 (개인정보 처리방침 등). */
  bold?: boolean;
  external?: boolean;
}

export interface NudgeEAPFooterWebCompany {
  /** "서울특별시 강남구 ..." */
  address: string;
  /** "101-86-16191" */
  bizNumber: string;
  /** "02-2268-5980" */
  phone?: string;
  /** "02-2268-5955" */
  fax?: string;
  /** "dain@nudgeeap.io" */
  email?: string;
  /** "© 2023 Dain Co.Ltd., All Rights Reserved" */
  copyright?: string;
}

export interface NudgeEAPFooterWebAppDownload {
  key: string;
  href: string;
  ariaLabel: string;
  /** 아이콘 (24×24). */
  icon: React.ReactNode;
}

export interface NudgeEAPFooterWebDainBlock {
  /** 다인 로고 src. 미지정 시 DAIN 블록 미노출. */
  logoSrc?: string;
  /** 표시 라벨. 기본 "(주)다인". */
  label?: string;
}

export interface NudgeEAPFooterWebIsoBlock {
  /** ISO 인증 이미지 src. 미지정 시 ISO 블록 미노출. */
  imgSrc?: string;
  /** 캡션 2줄. 기본 ["ISO/IEC 27001 인증", "국제 표준 정보보안경영시스템"]. */
  captionLines?: [string, string];
}

export interface NudgeEAPFooterWebProps {
  surface: "web";
  /** 약관 / 정책 링크 (기본 강조 1개 + 일반 3개). */
  links?: NudgeEAPFooterWebLink[];
  /** 회사 정보 ((주)다인). */
  company: NudgeEAPFooterWebCompany;
  /** 우상단 앱 다운로드 원형 (Google / Apple / OneStore). */
  appDownloads?: NudgeEAPFooterWebAppDownload[];
  /** 우측 ISO/IEC 27001 인증 블록. */
  iso?: NudgeEAPFooterWebIsoBlock;
  /** 하단 DAIN 자회사 로고 + 라벨. */
  dain?: NudgeEAPFooterWebDainBlock;
  /** 카피라이트 아래 라인 (예: "powered by Cashwalk"). */
  poweredBy?: string;
  /** 콘텐츠 max-width. 기본 1200. */
  maxWidth?: number;
}

const NudgeEAPFooterWeb = React.forwardRef<HTMLElement, Omit<NudgeEAPFooterWebProps, "surface">>(
  (props, ref) => {
    const { links, company, appDownloads, iso, dain, poweredBy, maxWidth = 1200 } = props;

    return (
      <>
        <style>{webFooterStyles}</style>
        <footer
          ref={ref}
          className={WEB_ROOT_CLASS}
          style={
            {
              "--nds-nudge-eap-web-footer-max-width": `${maxWidth}px`,
            } as React.CSSProperties
          }
        >
          <div className={`${WEB_ROOT_CLASS}__inner`}>
            {/* Row 1: 약관 + 앱 다운로드 */}
            <div className={`${WEB_ROOT_CLASS}__row-1`}>
              {links && links.length > 0 ? (
                <nav className={`${WEB_ROOT_CLASS}__links`} aria-label="푸터 정책 링크">
                  {links.map((link, i) => (
                    <React.Fragment key={link.label}>
                      {i > 0 && (
                        <span className={`${WEB_ROOT_CLASS}__link-sep`} aria-hidden="true" />
                      )}
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        data-bold={link.bold || undefined}
                      >
                        {link.label}
                      </a>
                    </React.Fragment>
                  ))}
                </nav>
              ) : (
                <span />
              )}
              {appDownloads && appDownloads.length > 0 && (
                <div className={`${WEB_ROOT_CLASS}__app-downloads`}>
                  {appDownloads.map((a) => (
                    <a
                      key={a.key}
                      href={a.href}
                      className={`${WEB_ROOT_CLASS}__app-badge`}
                      aria-label={a.ariaLabel}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {a.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className={`${WEB_ROOT_CLASS}__divider`} aria-hidden="true" />

            {/* Row 2: 회사정보 + ISO */}
            <div className={`${WEB_ROOT_CLASS}__row-2`}>
              <div className={`${WEB_ROOT_CLASS}__company-info`}>
                <p className={`${WEB_ROOT_CLASS}__company-line`}>
                  <span>{company.address}</span>
                  <span className={`${WEB_ROOT_CLASS}__company-sep`} aria-hidden="true" />
                  <span>사업자 번호 : {company.bizNumber}</span>
                  {company.phone && (
                    <>
                      <span className={`${WEB_ROOT_CLASS}__company-sep`} aria-hidden="true" />
                      <span>전화번호 : {company.phone}</span>
                    </>
                  )}
                </p>
                {(company.fax || company.email) && (
                  <p className={`${WEB_ROOT_CLASS}__company-line`}>
                    {company.fax && <span>팩스 : {company.fax}</span>}
                    {company.fax && company.email && (
                      <span className={`${WEB_ROOT_CLASS}__company-sep`} aria-hidden="true" />
                    )}
                    {company.email && (
                      <span>
                        대표 이메일 :{" "}
                        <a href={`mailto:${company.email}`} style={{ color: "inherit" }}>
                          {company.email}
                        </a>
                      </span>
                    )}
                  </p>
                )}
              </div>
              {iso?.imgSrc && (
                <div className={`${WEB_ROOT_CLASS}__iso`}>
                  <img
                    className={`${WEB_ROOT_CLASS}__iso-img`}
                    src={iso.imgSrc}
                    alt="ISO/IEC 27001"
                    width={78}
                    height={111}
                  />
                  <p className={`${WEB_ROOT_CLASS}__iso-caption`}>
                    {
                      (iso.captionLines ?? [
                        "ISO/IEC 27001 인증",
                        "국제 표준 정보보안경영시스템",
                      ])[0]
                    }
                    <br />
                    {
                      (iso.captionLines ?? [
                        "ISO/IEC 27001 인증",
                        "국제 표준 정보보안경영시스템",
                      ])[1]
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Row 3: 카피라이트 + DAIN */}
            <div className={`${WEB_ROOT_CLASS}__row-3`}>
              {company.copyright && <span>{company.copyright}</span>}
              {poweredBy && <span>{poweredBy}</span>}
              {dain?.logoSrc && (
                <div className={`${WEB_ROOT_CLASS}__row-3-bottom`}>
                  <img
                    className={`${WEB_ROOT_CLASS}__dain-logo`}
                    src={dain.logoSrc}
                    alt={dain.label ?? "DAIN"}
                  />
                  <span className={`${WEB_ROOT_CLASS}__dain-label`}>
                    {dain.label ?? "(주)다인"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </footer>
      </>
    );
  },
);
NudgeEAPFooterWeb.displayName = "NudgeEAPFooter.Web";

/* ─────────────────────────────────────────────────────
   Discriminated union — public surface
   ───────────────────────────────────────────────────── */

export type NudgeEAPFooterProps = NudgeEAPFooterAppProps | NudgeEAPFooterWebProps;

/**
 * NudgeEAP 통합 푸터.
 *   - `surface='web'` → 풍부한 PC 푸터 (약관 + 앱다운로드 + ISO + DAIN + powered by).
 *     Figma 20:13799 정합.
 *   - `surface='app'` (default) → 회사 정보 표준 푸터 (base Footer.Info 위 wrapper).
 */
export const NudgeEAPFooter = React.forwardRef<HTMLElement, NudgeEAPFooterProps>((props, ref) => {
  if (props.surface === "web") {
    const { surface: _s, ...webRest } = props;
    return <NudgeEAPFooterWeb {...webRest} ref={ref} />;
  }
  return <NudgeEAPFooterApp {...props} ref={ref} />;
});
NudgeEAPFooter.displayName = "NudgeEAPFooter";
