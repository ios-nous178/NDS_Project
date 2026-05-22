import React from "react";
import { AppFooter } from "../AppFooter";
import type { FooterLinkItem, CompanyInfoData } from "../AppFooter";

/**
 * Cashpobi 웹 푸터.
 *
 * Figma:
 *   - PC: 380:2208
 *   - Mobile: 98:1267
 *
 * 캐포비는 admin/백오피스 위주이지만, 캐시워크 한국 웹 푸터 가이드(노란 시그니처 +
 * 검정 톤)를 따라 light 배경 + neutral 텍스트 패턴.
 */

export type CashpobiWebFooterVariant = "desktop" | "mobile";

export interface CashpobiWebFooterProps {
  variant?: CashpobiWebFooterVariant;
  /** 약관/정책 링크. */
  links?: FooterLinkItem[];
  /** 회사 정보 (캐시워크). */
  company: CompanyInfoData;
  /** 추가 안내 (긴급 / 위기 / 면책 등). */
  extra?: React.ReactNode;
  /** 콘텐츠 max-width. 기본 1600. */
  maxWidth?: number;
}

export const CashpobiWebFooter = React.forwardRef<HTMLElement, CashpobiWebFooterProps>(
  ({ variant = "desktop", links, company, extra, maxWidth = 1600 }, ref) => {
    if (variant === "mobile") {
      return (
        <AppFooter.Info ref={ref}>
          {links && links.length > 0 && <AppFooter.Links links={links} />}
          {extra && <AppFooter.Extra>{extra}</AppFooter.Extra>}
          <AppFooter.CompanyInfo data={company} />
        </AppFooter.Info>
      );
    }

    /* desktop */
    return (
      <AppFooter.Info ref={ref}>
        <div style={{ maxWidth, margin: "0 auto" }}>
          {links && links.length > 0 && <AppFooter.Links links={links} />}
          {extra && <AppFooter.Extra>{extra}</AppFooter.Extra>}
          <AppFooter.CompanyInfo data={company} />
        </div>
      </AppFooter.Info>
    );
  },
);

CashpobiWebFooter.displayName = "CashpobiWebFooter";
