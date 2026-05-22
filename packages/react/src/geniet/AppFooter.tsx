import React from "react";
import { AppFooter } from "../AppFooter";
import type { FooterLinkItem, CompanyInfoData } from "../AppFooter";

export interface GenietAppFooterLogo {
  src: string;
  width?: number;
  height?: number;
}

export interface GenietAppFooterProps {
  /** 약관/이용 링크. */
  links?: FooterLinkItem[];
  /** 회사 정보 (Geniet: 넛지모바일). */
  company: CompanyInfoData;
  /** 통신판매중개자 안내 등 부가 고지. */
  extra?: React.ReactNode;
  /** 푸터 로고. */
  logo?: GenietAppFooterLogo;
}

/**
 * Geniet 커머스 고지 푸터 (Info variant 래퍼).
 * 인기검색어/탭바 아이콘 매핑 같은 인라인 로직 없이, 콘텐츠만 받아 표준 형태로 렌더.
 */
export const GenietAppFooter = React.forwardRef<HTMLElement, GenietAppFooterProps>(
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

GenietAppFooter.displayName = "GenietAppFooter";
