import React from "react";
import { FooterInfo } from "../Footer";

/**
 * Runmile Footer (Figma 22:80 PC · 43:846 Mobile).
 *
 * 한 컴포넌트가 `layout='desktop'|'mobile'` 로 PC(1440 기준) / 모바일(360 기준) 둘 다 처리.
 * 콘텐츠 구조는 동일 — 약관 링크, 회사 정보, 문의처, copyright, Runmile 로고.
 *
 * 모든 색 / 폰트 / 간격은 시멘틱 토큰 cascade.
 *   - 배경: `--semantic-bg-section-default` (#F2F4F6, gray200)
 *   - 약관 라벨: `--semantic-text-subtle-default` (#4E5968, gray800)
 *   - 회사 정보 / 문의 / copyright: `--semantic-text-muted-default` (#6B7684, gray700)
 *   - 세로 구분선: `--semantic-border-normal-default` (실측 #D1D6DB)
 *
 * 로고는 prop 으로 받음 — fixture 에서 `@nudge-design/assets` 의 `runmile-logo-gray700.svg`
 * dataUri 를 그대로 박아 넣는 패턴 (다른 brand 와 동일).
 */

export interface RunmileFooterTermLink {
  label: string;
  href: string;
  /** Bold 강조 (Figma 가이드: 개인정보처리방침). */
  bold?: boolean;
}

export interface RunmileFooterCompany {
  /** 예: "송승근, 박정신" */
  representatives: string;
  /** 예: "㈜넛지헬스케어주식회사" */
  name: string;
  /** 예: "849-88-00418" */
  bizNumber: string;
  /** 예: "서울특별시 강남구 역삼로1길8 넛지캠퍼스 빌딩" */
  address: string;
}

export interface RunmileFooterLogo {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface RunmileFooterProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  layout?: "desktop" | "mobile";
  termsLinks?: RunmileFooterTermLink[];
  company: RunmileFooterCompany;
  contactEmail?: string;
  copyright?: string;
  logo?: RunmileFooterLogo;
  /** Desktop content max-width (Figma 기준 1280, 좌우 padding 80). */
  maxWidth?: number;
}

const DEFAULT_TERMS: RunmileFooterTermLink[] = [
  { label: "이용약관", href: "#" },
  { label: "개인정보처리방침", href: "#", bold: true },
];

const SEPARATOR_COLOR = "var(--semantic-border-normal-default, #D1D6DB)";
const TERMS_COLOR = "var(--semantic-text-subtle-default, #4E5968)";
const MUTED_COLOR = "var(--semantic-text-muted-default, #6B7684)";

function VSeparator({ height }: { height: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 1,
        height,
        background: SEPARATOR_COLOR,
        flexShrink: 0,
      }}
    />
  );
}

function Terms({ links, size }: { links: RunmileFooterTermLink[]; size: "desktop" | "mobile" }) {
  const fontSize = size === "desktop" ? 14 : 13;
  const lineHeight = size === "desktop" ? "20px" : "18px";
  return (
    <nav
      aria-label="이용약관"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "inherit",
        color: TERMS_COLOR,
      }}
    >
      {links.map((t, i) => (
        <React.Fragment key={t.label}>
          {i > 0 && <VSeparator height={11.5} />}
          <a
            href={t.href}
            style={{
              fontSize,
              lineHeight,
              fontWeight: t.bold ? 700 : 500,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {t.label}
          </a>
        </React.Fragment>
      ))}
    </nav>
  );
}

function CompanyMeta({
  company,
  size,
}: {
  company: RunmileFooterCompany;
  size: "desktop" | "mobile";
}) {
  const fontSize = size === "desktop" ? 13 : 12;
  const lineHeight = size === "desktop" ? "18px" : "16px";
  const items = [
    `대표자 : ${company.representatives}`,
    company.name,
    `사업자등록번호 : ${company.bizNumber}`,
    company.address,
  ];
  return (
    <div
      style={{
        display: "flex",
        flexWrap: size === "mobile" ? "wrap" : "nowrap",
        alignItems: "center",
        gap: 6,
        color: MUTED_COLOR,
        fontSize,
        lineHeight,
        fontWeight: 400,
      }}
    >
      {items.map((text, i) => (
        <React.Fragment key={text}>
          {i > 0 && size === "desktop" && <VSeparator height={11.5} />}
          <span style={{ whiteSpace: "nowrap" }}>{text}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

function Contact({
  email,
  copyright,
  size,
}: {
  email?: string;
  copyright?: string;
  size: "desktop" | "mobile";
}) {
  const fontSize = size === "desktop" ? 13 : 12;
  const lineHeight = size === "desktop" ? "18px" : "16px";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: size === "desktop" ? 8 : 6,
        color: MUTED_COLOR,
        fontSize,
        lineHeight,
        fontWeight: 400,
      }}
    >
      {email && (
        <div>
          문의사항 :{" "}
          <a href={`mailto:${email}`} style={{ color: "inherit", textDecoration: "underline" }}>
            {email}
          </a>
        </div>
      )}
      {copyright && <div>{copyright}</div>}
    </div>
  );
}

function BrandLogo({ logo }: { logo?: RunmileFooterLogo }) {
  if (!logo) return null;
  return (
    <img
      src={logo.src}
      alt={logo.alt ?? "Runmile"}
      width={logo.width}
      height={logo.height}
      style={{ display: "block" }}
    />
  );
}

export const RunmileFooter = React.forwardRef<HTMLElement, RunmileFooterProps>(
  (
    {
      layout = "desktop",
      termsLinks = DEFAULT_TERMS,
      company,
      contactEmail,
      copyright,
      logo,
      maxWidth = 1280,
      style,
      ...rest
    },
    ref,
  ) => {
    const isMobile = layout === "mobile";
    return (
      <FooterInfo
        ref={ref}
        style={
          {
            "--nds-footer-background": "var(--semantic-bg-section-default, #F2F4F6)",
            "--nds-footer-padding": "0",
            color: MUTED_COLOR,
            fontFamily:
              "var(--font-web, 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, sans-serif)",
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        {isMobile ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              padding: "30px 20px 30px",
              minHeight: 265,
              boxSizing: "border-box",
            }}
          >
            <Terms links={termsLinks} size="mobile" />
            <CompanyMeta company={company} size="mobile" />
            <Contact email={contactEmail} copyright={copyright} size="mobile" />
            <div style={{ marginTop: 8 }}>
              <BrandLogo logo={logo} />
            </div>
          </div>
        ) : (
          <div
            style={{
              maxWidth,
              margin: "0 auto",
              padding: "40px 80px 32px",
              boxSizing: "border-box",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              minHeight: 180,
            }}
          >
            <Terms links={termsLinks} size="desktop" />
            <CompanyMeta company={company} size="desktop" />
            <Contact email={contactEmail} copyright={copyright} size="desktop" />
            {logo && (
              <div
                style={{
                  position: "absolute",
                  right: 80,
                  bottom: 32,
                }}
              >
                <BrandLogo logo={logo} />
              </div>
            )}
          </div>
        )}
      </FooterInfo>
    );
  },
);

RunmileFooter.displayName = "RunmileFooter";
