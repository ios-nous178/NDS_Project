import React from "react";
import { AppFooter } from "../AppFooter";
import type { FooterLinkItem, CompanyInfoData } from "../AppFooter";

/* ─── Trost 표준 에셋 (CDN). prop 으로 override 가능. ─── */

const TROST_CDN = "https://assets.trost.co.kr/images/service/partner";

const DEFAULT_APP_STORE_LINKS: TrostAppFooterStoreLink[] = [
  {
    href: "https://play.google.com/store/apps/details?id=com.humartcompany.trost",
    img: `${TROST_CDN}/footer_store_and_pc.png`,
    alt: "Google Play",
  },
  {
    href: "https://apps.apple.com/kr/app/id1036587764",
    img: `${TROST_CDN}/footer_store_ios_pc.png`,
    alt: "App Store",
  },
];

const DEFAULT_SNS_LINKS: TrostAppFooterSnsLink[] = [
  {
    href: "https://www.facebook.com/trostU/",
    img: `${TROST_CDN}/footer_sns_facebook_pc.png`,
    alt: "Facebook",
  },
  {
    href: "https://www.instagram.com/trost.official/",
    img: `${TROST_CDN}/footer_sns_insta_pc.png`,
    alt: "Instagram",
  },
  {
    href: "https://brunch.co.kr/@trost#articles",
    img: `${TROST_CDN}/footer_sns_brunch_pc.png`,
    alt: "Brunch",
  },
  {
    href: "https://pf.kakao.com/_mywEM",
    img: `${TROST_CDN}/footer_sns_kakao_pc.png`,
    alt: "KakaoTalk",
  },
];

/* ─── Types ─── */

export type TrostAppFooterVariant = "desktop" | "mobile";

export interface TrostAppFooterStoreLink {
  href: string;
  img: string;
  alt: string;
}

export interface TrostAppFooterSnsLink {
  href: string;
  img: string;
  alt: string;
}

export interface TrostAppFooterLogo {
  src: string;
  width?: number;
  height?: number;
}

export interface TrostAppFooterProps {
  variant?: TrostAppFooterVariant;
  links?: FooterLinkItem[];
  company: CompanyInfoData;
  extra?: React.ReactNode;
  logo?: TrostAppFooterLogo;
  /** 앱 다운로드 배지 (override). */
  appStoreLinks?: TrostAppFooterStoreLink[];
  /** SNS 링크 (override). */
  snsLinks?: TrostAppFooterSnsLink[];
  /** desktop 콘텐츠 max-width. 기본 1080. */
  maxWidth?: number;
}

/* ─── Sub renderers ─── */

function AppStoreButtons({ links }: { links: TrostAppFooterStoreLink[] }) {
  return (
    <div style={{ display: "flex", gap: "var(--gap-default)", marginBottom: 20 }}>
      {links.map((s) => (
        <a key={s.alt} href={s.href} target="_blank" rel="noopener noreferrer">
          <img src={s.img} alt={s.alt} width={145} height={48} style={{ display: "block" }} />
        </a>
      ))}
    </div>
  );
}

function SnsIcons({ links }: { links: TrostAppFooterSnsLink[] }) {
  return (
    <div style={{ display: "flex", gap: "var(--gap-comfortable)" }}>
      {links.map((s) => (
        <a key={s.alt} href={s.href} target="_blank" rel="noopener noreferrer">
          <img
            src={s.img}
            alt={s.alt}
            width={40}
            height={40}
            style={{ display: "block", borderRadius: "50%" }}
          />
        </a>
      ))}
    </div>
  );
}

/* ─── Component ─── */

export const TrostAppFooter = React.forwardRef<HTMLElement, TrostAppFooterProps>((props, ref) => {
  const {
    variant = "desktop",
    links,
    company,
    extra,
    logo,
    appStoreLinks = DEFAULT_APP_STORE_LINKS,
    snsLinks = DEFAULT_SNS_LINKS,
    maxWidth = 1080,
  } = props;

  if (variant === "mobile") {
    return (
      <AppFooter.Info
        ref={ref}
        style={{ "--nds-footer-background": "#464646", color: "#ccc" } as React.CSSProperties}
      >
        {links && links.length > 0 && <AppFooter.Links links={links} />}
        <div style={{ margin: "16px 0" }}>
          <AppStoreButtons links={appStoreLinks} />
        </div>
        {extra && <AppFooter.Extra>{extra}</AppFooter.Extra>}
        <AppFooter.CompanyInfo data={company} />
        <div style={{ marginTop: 20 }}>
          <SnsIcons links={snsLinks} />
        </div>
      </AppFooter.Info>
    );
  }

  /* desktop */
  return (
    <AppFooter.Info
      ref={ref}
      style={
        {
          "--nds-footer-background": "#333",
          color: "#fff",
          padding: "52px 0 45px",
        } as React.CSSProperties
      }
    >
      <div style={{ maxWidth, margin: "0 auto", padding: "0 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "1px solid #555",
            paddingBottom: 24,
            marginBottom: 20,
          }}
        >
          {links && links.length > 0 && <AppFooter.Links links={links} />}
          <AppStoreButtons links={appStoreLinks} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            {extra && <AppFooter.Extra>{extra}</AppFooter.Extra>}
            <AppFooter.CompanyInfo
              data={company}
              logoSrc={logo?.src}
              logoWidth={logo?.width}
              logoHeight={logo?.height}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "var(--gap-loose)",
              flexShrink: 0,
            }}
          >
            <SnsIcons links={snsLinks} />
          </div>
        </div>
      </div>
    </AppFooter.Info>
  );
});

TrostAppFooter.displayName = "TrostAppFooter";
