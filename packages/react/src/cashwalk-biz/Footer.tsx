import React from "react";
import { Footer as BaseFooter } from "../Footer.js";
import type { FooterLinkItem, CompanyInfoData } from "../Footer.js";

/**
 * CashwalkBiz 웹 푸터.
 *
 * Figma:
 *   - PC: 380:2208
 *   - Mobile: 98:1267
 *
 * 캐포비는 admin/백오피스 위주이지만, 캐시워크 한국 웹 푸터 가이드(노란 시그니처 +
 * 검정 톤)를 따라 light 배경 + neutral 텍스트 패턴.
 */

export type CashwalkBizFooterLayout = "desktop" | "mobile";

export interface CashwalkBizFooterProps {
  /**
   * CashwalkBiz 는 web 푸터만 제공 (app 환경 없음). surface 는 항상 'web'. brand 간 호출
   * 표면 통일을 위해 prop 만 노출 (타입 단에서 다른 값 차단).
   */
  surface?: "web";
  /** 반응형 레이아웃. */
  layout?: CashwalkBizFooterLayout;
  /** 약관/정책 링크. */
  links?: FooterLinkItem[];
  /** 회사 정보 (캐시워크). */
  company: CompanyInfoData;
  /** 추가 안내 (긴급 / 위기 / 면책 등). */
  extra?: React.ReactNode;
  /** 콘텐츠 max-width. 기본 1600. */
  maxWidth?: number;
}

export const CashwalkBizFooter = React.forwardRef<HTMLElement, CashwalkBizFooterProps>(
  ({ layout = "desktop", links, company, extra, maxWidth = 1600 }, ref) => {
    if (layout === "mobile") {
      return (
        <BaseFooter.Info ref={ref}>
          {links && links.length > 0 && <BaseFooter.Links links={links} />}
          {extra && <BaseFooter.Extra>{extra}</BaseFooter.Extra>}
          <BaseFooter.CompanyInfo data={company} />
        </BaseFooter.Info>
      );
    }

    /* desktop */
    return (
      <BaseFooter.Info ref={ref}>
        <div style={{ maxWidth, margin: "0 auto" }}>
          {links && links.length > 0 && <BaseFooter.Links links={links} />}
          {extra && <BaseFooter.Extra>{extra}</BaseFooter.Extra>}
          <BaseFooter.CompanyInfo data={company} />
        </div>
      </BaseFooter.Info>
    );
  },
);
CashwalkBizFooter.displayName = "CashwalkBizFooter";
