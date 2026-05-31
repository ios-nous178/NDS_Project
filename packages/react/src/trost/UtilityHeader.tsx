import React from "react";
import { trostNeutral } from "@nudge-design/tokens";
import { TROST_LOGO_DATA_URI } from "../brand-logo-defaults";

export interface TrostUtilityHeaderProps {
  /** 좌측 로고 링크 href */
  logoHref?: string;
  /** 로고 SVG src. 미지정 시 base64 내장 Trost 로고 사용 — 파일 호스팅 불필요. */
  logoSrc?: string;
  /** 로고 클릭 핸들러 (선택) */
  onLogoClick?: () => void;
  /** 검색 폼 슬롯 (보통 TrostSearchForm) */
  searchSlot?: React.ReactNode;
  /** 로그인 섹션 슬롯 (보통 TrostLoginSection) */
  loginSlot?: React.ReactNode;
  /** 앱 다운로드 섹션 슬롯 (보통 TrostAppDownloadButton) */
  appDownloadSlot?: React.ReactNode;
}

const STYLE = `
  .nds-trost-utility-header {
    width: 100%;
    padding: 20px 0;
    border-bottom: 1px solid ${trostNeutral[200]};
    background: #fff;
    font-family: inherit;
  }
  .nds-trost-utility-header__inner {
    max-width: 1080px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 114px;
  }
  .nds-trost-utility-header__left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .nds-trost-utility-header__logo {
    width: 140px;
    height: 36px;
    padding-right: 50px;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }
  .nds-trost-utility-header__right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-grow: 1;
    flex-shrink: 0;
  }
`;

export function TrostUtilityHeader({
  logoHref = "/",
  logoSrc = TROST_LOGO_DATA_URI,
  onLogoClick,
  searchSlot,
  loginSlot,
  appDownloadSlot,
}: TrostUtilityHeaderProps) {
  return (
    <>
      <style>{STYLE}</style>
      <section className="nds-trost-utility-header">
        <div className="nds-trost-utility-header__inner">
          <div className="nds-trost-utility-header__left">
            <a
              href={logoHref}
              className="nds-trost-utility-header__logo"
              onClick={onLogoClick}
              aria-label="Trost"
            >
              {logoSrc && <img src={logoSrc} width={90} height={36} alt="Trost" />}
            </a>
            {searchSlot}
          </div>
          <div className="nds-trost-utility-header__right">
            {loginSlot}
            {appDownloadSlot}
          </div>
        </div>
      </section>
    </>
  );
}
