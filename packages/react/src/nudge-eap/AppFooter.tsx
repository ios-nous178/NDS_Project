import React from "react";
import { AppFooter } from "../AppFooter";
import type { FooterLinkItem, CompanyInfoData } from "../AppFooter";

export interface NudgeEAPAppFooterLogo {
  src: string;
  width?: number;
  height?: number;
}

export interface NudgeEAPAppFooterProps {
  links?: FooterLinkItem[];
  company: CompanyInfoData;
  extra?: React.ReactNode;
  logo?: NudgeEAPAppFooterLogo;
}

/**
 * NudgeEAP 회사 정보 푸터. AppFooter.Info 표준 형태 — 토큰만 자동 적용.
 */
export const NudgeEAPAppFooter = React.forwardRef<HTMLElement, NudgeEAPAppFooterProps>(
  ({ links, company, extra, logo }, ref) => {
    return (
      <AppFooter.Info ref={ref}>
        {links && links.length > 0 && <AppFooter.Links links={links} />}
        {extra && <AppFooter.Extra>{extra}</AppFooter.Extra>}
        <AppFooter.CompanyInfo
          data={company}
          logoSrc={logo?.src}
          logoWidth={logo?.width}
          logoHeight={logo?.height}
        />
      </AppFooter.Info>
    );
  },
);

NudgeEAPAppFooter.displayName = "NudgeEAPAppFooter";
