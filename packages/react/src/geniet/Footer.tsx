import React from "react";
import { Footer as BaseFooter } from "../Footer";
import type { FooterLinkItem, CompanyInfoData } from "../Footer";
import { GENIET_LOGO_FOOTER_DATA_URI } from "../brand-logo-defaults";

export interface GenietFooterLogo {
  src: string;
  width?: number;
  height?: number;
}

export interface GenietFooterProps {
  /**
   * Geniet 은 앱 환경 전용이라 surface 는 항상 'app'. brand 간 호출 표면 통일을 위해 prop
   * 만 노출 (타입 단에서 다른 값 차단).
   */
  surface?: "app";
  /** 약관/이용 링크. */
  links?: FooterLinkItem[];
  /** 회사 정보 (Geniet: 넛지모바일). */
  company: CompanyInfoData;
  /** 통신판매중개자 안내 등 부가 고지. */
  extra?: React.ReactNode;
  /** 푸터 로고. 미지정 시 base64 내장 로고 (geniet-logo-footer) 사용 — 파일 호스팅 불필요. */
  logo?: GenietFooterLogo;
}

/**
 * Geniet 통합 푸터. Footer.Info 위 얇은 wrapper — 인기검색어/탭바 아이콘 매핑 같은
 * 인라인 로직 없이, 콘텐츠만 받아 표준 형태로 렌더.
 */
export const GenietFooter = React.forwardRef<HTMLElement, GenietFooterProps>(
  ({ links, company, extra, logo }, ref) => {
    return (
      <BaseFooter.Info ref={ref}>
        {links && links.length > 0 && <BaseFooter.Links links={links} />}
        {extra && <BaseFooter.Extra>{extra}</BaseFooter.Extra>}
        <BaseFooter.CompanyInfo
          data={company}
          logoSrc={logo?.src ?? GENIET_LOGO_FOOTER_DATA_URI}
          logoWidth={logo?.width ?? 166}
          logoHeight={logo?.height ?? 48}
        />
      </BaseFooter.Info>
    );
  },
);
GenietFooter.displayName = "GenietFooter";
