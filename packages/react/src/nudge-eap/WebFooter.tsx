import React from "react";

/**
 * NudgeEAP 웹 푸터 (데스크톱) — Figma 20:13799 (NudgeEAP Dev) 풀 정합.
 *
 * 레이아웃 (1920 viewport, content max-width 1200, 좌우 360 margin):
 *   - bg #FAFAFA (neutral/50), height 320
 *   - Row 1 (top 20–60): 약관 링크 4개 (좌) + 앱다운로드 원형 3개 (우)
 *   - Divider 1px (top 84, full viewport width)
 *   - Row 2 (top 117–162): 회사정보 (주소·사업자·전화 / 팩스·이메일) (좌) + ISO 27001 인증 (우)
 *   - Row 3 (top 187–260): © 카피라이트 · powered by Cashwalk · DAIN 로고 · (주)다인 (좌) + ISO 인증 캡션 (우)
 *
 * Typography:
 *   - 약관 (16/24): bold 강조 1개 + medium 3개
 *   - 회사정보 (14/20 regular #666)
 *   - 카피라이트 (14/20 regular #999)
 */

const ROOT_CLASS = "nds-nudge-eap-web-footer";

// eslint-disable-next-line unused-imports/no-unused-vars
const webFooterStyles = `
  :where(.${ROOT_CLASS}) {
    width: 100%;
    background: var(--semantic-fill-bg-default, #fafafa);
    font-family: Pretendard, -apple-system, sans-serif;
    color: var(--semantic-text-normal-default, #383838);
    box-sizing: border-box;
  }
  :where(.${ROOT_CLASS}__inner) {
    position: relative;
    max-width: var(--nds-nudge-eap-web-footer-max-width, 1200px);
    margin: 0 auto;
    padding: 0 16px;
    box-sizing: border-box;
  }
  :where(.${ROOT_CLASS}__row-1) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 0;
  }
  :where(.${ROOT_CLASS}__links) {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  :where(.${ROOT_CLASS}__links a) {
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
    color: var(--semantic-text-subtle-default, #666);
    text-decoration: none;
  }
  :where(.${ROOT_CLASS}__links a[data-bold="true"]) {
    font-weight: 700;
    color: var(--semantic-text-normal-default, #383838);
  }
  :where(.${ROOT_CLASS}__link-sep) {
    width: 1px;
    height: 10px;
    background: var(--semantic-text-subtle-default, #666);
    opacity: 0.4;
  }
  :where(.${ROOT_CLASS}__app-downloads) {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  :where(.${ROOT_CLASS}__app-badge) {
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
  :where(.${ROOT_CLASS}__app-badge:hover) {
    opacity: 0.85;
  }
  :where(.${ROOT_CLASS}__divider) {
    height: 1px;
    background: var(--semantic-border-subtle-default, #ececec);
  }
  :where(.${ROOT_CLASS}__row-2) {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 32px 0 24px;
  }
  :where(.${ROOT_CLASS}__company-info) {
    font-size: 14px;
    line-height: 20px;
    color: var(--semantic-text-subtle-default, #666);
  }
  :where(.${ROOT_CLASS}__company-line) {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }
  :where(.${ROOT_CLASS}__company-line + .${ROOT_CLASS}__company-line) {
    margin-top: 4px;
  }
  :where(.${ROOT_CLASS}__company-sep) {
    width: 1px;
    height: 10px;
    background: var(--semantic-text-subtle-default, #666);
    opacity: 0.4;
  }
  :where(.${ROOT_CLASS}__iso) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  :where(.${ROOT_CLASS}__iso-img) {
    width: 78px;
    height: 111px;
    object-fit: contain;
  }
  :where(.${ROOT_CLASS}__iso-caption) {
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    color: var(--semantic-text-subtle-default, #666);
    text-align: center;
    margin: 0;
  }
  :where(.${ROOT_CLASS}__row-3) {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-bottom: 28px;
    font-size: 14px;
    line-height: 20px;
    color: var(--semantic-text-muted-default, #999);
  }
  :where(.${ROOT_CLASS}__row-3-bottom) {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
  }
  :where(.${ROOT_CLASS}__dain-logo) {
    height: 30px;
    width: auto;
    object-fit: contain;
  }
  :where(.${ROOT_CLASS}__dain-label) {
    font-size: 14px;
    color: var(--semantic-text-normal-default, #383838);
  }
`;

/* ─── Types ─── */

export interface NudgeEAPWebFooterLink {
  label: string;
  href: string;
  /** 강조 (개인정보 처리방침 등). */
  bold?: boolean;
  external?: boolean;
}

export interface NudgeEAPWebFooterCompany {
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

export interface NudgeEAPWebFooterAppDownload {
  key: string;
  href: string;
  ariaLabel: string;
  /** 아이콘 (24×24). */
  icon: React.ReactNode;
}

export interface NudgeEAPWebFooterDainBlock {
  /** 다인 로고 src (자회사 로고). 미지정 시 DAIN 블록 미노출. */
  logoSrc?: string;
  /** 표시 라벨. 기본 "(주)다인". */
  label?: string;
}

export interface NudgeEAPWebFooterIsoBlock {
  /** ISO 인증 이미지 src. 미지정 시 ISO 블록 미노출. */
  imgSrc?: string;
  /** 캡션 2줄. 기본 ["ISO/IEC 27001 인증", "국제 표준 정보보안경영시스템"]. */
  captionLines?: [string, string];
}

export interface NudgeEAPWebFooterProps {
  /** 약관 / 정책 링크 (기본 강조 1개 + 일반 3개). */
  links?: NudgeEAPWebFooterLink[];
  /** 회사 정보 ((주)다인). */
  company: NudgeEAPWebFooterCompany;
  /** 우상단 앱 다운로드 원형 (Google / Apple / OneStore). */
  appDownloads?: NudgeEAPWebFooterAppDownload[];
  /** 우측 ISO/IEC 27001 인증 블록. */
  iso?: NudgeEAPWebFooterIsoBlock;
  /** 하단 DAIN 자회사 로고 + 라벨. */
  dain?: NudgeEAPWebFooterDainBlock;
  /** 카피라이트 아래 라인 (예: "powered by Cashwalk"). */
  poweredBy?: string;
  /** 콘텐츠 max-width. 기본 1200. */
  maxWidth?: number;
}

/* ─── Component ─── */

export const NudgeEAPWebFooter = React.forwardRef<HTMLElement, NudgeEAPWebFooterProps>(
  (props, ref) => {
    const { links, company, appDownloads, iso, dain, poweredBy, maxWidth = 1200 } = props;

    return (
      <footer
        ref={ref}
        className={ROOT_CLASS}
        style={
          {
            "--nds-nudge-eap-web-footer-max-width": `${maxWidth}px`,
          } as React.CSSProperties
        }
      >
        <div className={`${ROOT_CLASS}__inner`}>
          {/* Row 1: 약관 + 앱 다운로드 */}
          <div className={`${ROOT_CLASS}__row-1`}>
            {links && links.length > 0 ? (
              <nav className={`${ROOT_CLASS}__links`} aria-label="푸터 정책 링크">
                {links.map((link, i) => (
                  <React.Fragment key={link.label}>
                    {i > 0 && <span className={`${ROOT_CLASS}__link-sep`} aria-hidden="true" />}
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
              <div className={`${ROOT_CLASS}__app-downloads`}>
                {appDownloads.map((a) => (
                  <a
                    key={a.key}
                    href={a.href}
                    className={`${ROOT_CLASS}__app-badge`}
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
          <div className={`${ROOT_CLASS}__divider`} aria-hidden="true" />

          {/* Row 2: 회사정보 + ISO */}
          <div className={`${ROOT_CLASS}__row-2`}>
            <div className={`${ROOT_CLASS}__company-info`}>
              <p className={`${ROOT_CLASS}__company-line`}>
                <span>{company.address}</span>
                <span className={`${ROOT_CLASS}__company-sep`} aria-hidden="true" />
                <span>사업자 번호 : {company.bizNumber}</span>
                {company.phone && (
                  <>
                    <span className={`${ROOT_CLASS}__company-sep`} aria-hidden="true" />
                    <span>전화번호 : {company.phone}</span>
                  </>
                )}
              </p>
              {(company.fax || company.email) && (
                <p className={`${ROOT_CLASS}__company-line`}>
                  {company.fax && <span>팩스 : {company.fax}</span>}
                  {company.fax && company.email && (
                    <span className={`${ROOT_CLASS}__company-sep`} aria-hidden="true" />
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
              <div className={`${ROOT_CLASS}__iso`}>
                <img
                  className={`${ROOT_CLASS}__iso-img`}
                  src={iso.imgSrc}
                  alt="ISO/IEC 27001"
                  width={78}
                  height={111}
                />
                <p className={`${ROOT_CLASS}__iso-caption`}>
                  {(iso.captionLines ?? ["ISO/IEC 27001 인증", "국제 표준 정보보안경영시스템"])[0]}
                  <br />
                  {(iso.captionLines ?? ["ISO/IEC 27001 인증", "국제 표준 정보보안경영시스템"])[1]}
                </p>
              </div>
            )}
          </div>

          {/* Row 3: 카피라이트 + DAIN */}
          <div className={`${ROOT_CLASS}__row-3`}>
            {company.copyright && <span>{company.copyright}</span>}
            {poweredBy && <span>{poweredBy}</span>}
            {dain?.logoSrc && (
              <div className={`${ROOT_CLASS}__row-3-bottom`}>
                <img
                  className={`${ROOT_CLASS}__dain-logo`}
                  src={dain.logoSrc}
                  alt={dain.label ?? "DAIN"}
                />
                <span className={`${ROOT_CLASS}__dain-label`}>{dain.label ?? "(주)다인"}</span>
              </div>
            )}
          </div>
        </div>
      </footer>
    );
  },
);

NudgeEAPWebFooter.displayName = "NudgeEAPWebFooter";
