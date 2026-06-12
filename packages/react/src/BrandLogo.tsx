import React from "react";
import {
  TROST_LOGO_DATA_URI,
  GENIET_LOGO_PC_DATA_URI,
  NUDGE_EAP_LOGO_DATA_URI,
  CASHWALK_BIZ_LOGO_DATA_URI,
  RUNMILE_LOGO_DATA_URI,
} from "./brand-logo-defaults.js";

/* ─── Constants ─── */

const BL_CLASS = "nds-brand-logo";

/* ─── Types ─── */

export type BrandLogoBrand = "trost" | "geniet" | "nudge-eap" | "cashwalk-biz" | "runmile";

interface BrandLogoEntry {
  src: string;
  alt: string;
}

/**
 * 브랜드 대표 로고 — base64 data URI 는 `@nudge-design/assets/brand-logo-defaults`(SSOT).
 * `<nds-sidebar brand>` / `<nds-brand-header brand>` 가 주입하는 것과 **동일한 로고**다.
 */
const BRAND_LOGOS: Record<BrandLogoBrand, BrandLogoEntry> = {
  trost: { src: TROST_LOGO_DATA_URI, alt: "Trost" },
  geniet: { src: GENIET_LOGO_PC_DATA_URI, alt: "Geniet" },
  "nudge-eap": { src: NUDGE_EAP_LOGO_DATA_URI, alt: "NudgeEAP" },
  "cashwalk-biz": { src: CASHWALK_BIZ_LOGO_DATA_URI, alt: "Cashwalk for Business" },
  runmile: { src: RUNMILE_LOGO_DATA_URI, alt: "Runmile" },
};

export interface BrandLogoProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  /** 브랜드 */
  brand: BrandLogoBrand;
  /** 로고 높이 px (기본 40, 폭은 비율 유지 auto) */
  height?: number;
  /** 폭 px 강제 (기본 auto — height 기준 비율) */
  width?: number;
  /** alt 오버라이드 (기본 브랜드명) */
  alt?: string;
  /** 지정 시 <a>로 감싸 링크 */
  href?: string;
}

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

/**
 * BrandLogo — 브랜드 대표 로고를 컴포넌트로 박는다. raw `<img>`/SVG 직접 조립 금지.
 *
 * 어드민 온보딩 카드처럼 brand chrome(헤더/사이드바) 이 없는 화면에서 35KB base64 를
 * 손으로 붙이지 않고 로고를 넣는 표준 진입점. data URI 가 내장돼 단일 HTML/오프라인에서도 안 깨진다.
 */
export const BrandLogo = React.forwardRef<HTMLSpanElement, BrandLogoProps>(
  ({ brand, height = 40, width, alt, href, className, style, ...rest }, ref) => {
    const entry = BRAND_LOGOS[brand];
    if (!entry) return null;

    const img = (
      <img
        className={`${BL_CLASS}__img`}
        src={entry.src}
        alt={alt ?? entry.alt}
        style={{ height: `${height}px`, width: width != null ? `${width}px` : "auto" }}
      />
    );

    return (
      <span
        ref={ref}
        className={cx(BL_CLASS, className)}
        data-brand={brand}
        style={style}
        {...rest}
      >
        {href ? (
          <a className={`${BL_CLASS}__link`} href={href}>
            {img}
          </a>
        ) : (
          img
        )}
      </span>
    );
  },
);

BrandLogo.displayName = "BrandLogo";
