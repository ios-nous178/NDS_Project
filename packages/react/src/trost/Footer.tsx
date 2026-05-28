import React from "react";
import { trostNeutral } from "@nudge-design/tokens";
import { Footer as BaseFooter } from "../Footer";
import type { FooterLinkItem, CompanyInfoData } from "../Footer";
import type { TrostSnsLink } from "./types";

/* ─── Trost 표준 에셋 (CDN). prop 으로 override 가능. ─── */

const TROST_CDN = "https://assets.trost.co.kr/images/service/partner";

export interface TrostFooterStoreLink {
  href: string;
  img: string;
  alt: string;
}

export interface TrostFooterSnsLink {
  href: string;
  img: string;
  alt: string;
}

export interface TrostFooterLogo {
  src: string;
  width?: number;
  height?: number;
}

const DEFAULT_APP_STORE_LINKS: TrostFooterStoreLink[] = [
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

const DEFAULT_SNS_LINKS: TrostFooterSnsLink[] = [
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

/* ─── Sub renderers (app surface) ─── */

function AppStoreButtons({ links }: { links: TrostFooterStoreLink[] }) {
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

function SnsIcons({ links }: { links: TrostFooterSnsLink[] }) {
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

/* ─── App surface props + render ─── */

export type TrostFooterLayout = "desktop" | "mobile";

export interface TrostFooterAppProps {
  surface?: "app";
  layout?: TrostFooterLayout;
  links?: FooterLinkItem[];
  company: CompanyInfoData;
  extra?: React.ReactNode;
  logo?: TrostFooterLogo;
  /** 앱 다운로드 배지 (override). */
  appStoreLinks?: TrostFooterStoreLink[];
  /** SNS 링크 (override). */
  snsLinks?: TrostFooterSnsLink[];
  /** desktop 콘텐츠 max-width. 기본 1080. */
  maxWidth?: number;
}

const TrostFooterApp = React.forwardRef<HTMLElement, TrostFooterAppProps>((props, ref) => {
  const {
    layout = "desktop",
    links,
    company,
    extra,
    logo,
    appStoreLinks = DEFAULT_APP_STORE_LINKS,
    snsLinks = DEFAULT_SNS_LINKS,
    maxWidth = 1080,
  } = props;

  if (layout === "mobile") {
    return (
      <BaseFooter.Info
        ref={ref}
        style={{ "--nds-footer-background": "#464646", color: "#ccc" } as React.CSSProperties}
      >
        {links && links.length > 0 && <BaseFooter.Links links={links} />}
        <div style={{ margin: "16px 0" }}>
          <AppStoreButtons links={appStoreLinks} />
        </div>
        {extra && <BaseFooter.Extra>{extra}</BaseFooter.Extra>}
        <BaseFooter.CompanyInfo data={company} />
        <div style={{ marginTop: 20 }}>
          <SnsIcons links={snsLinks} />
        </div>
      </BaseFooter.Info>
    );
  }

  /* desktop */
  return (
    <BaseFooter.Info
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
          {links && links.length > 0 && <BaseFooter.Links links={links} />}
          <AppStoreButtons links={appStoreLinks} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            {extra && <BaseFooter.Extra>{extra}</BaseFooter.Extra>}
            <BaseFooter.CompanyInfo
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
    </BaseFooter.Info>
  );
});
TrostFooterApp.displayName = "TrostFooter.App";

/* ─── Web surface (≥1024 데스크톱 다크 PC 푸터) ─── */

export interface TrostFooterWebProps {
  surface: "web";
  /** 약관/개인정보처리방침 링크 */
  termsHref?: string;
  /** 위치기반 서비스 이용약관 링크 */
  locationTermsHref?: string;
  /** 구글 플레이 앱 링크 */
  playStoreHref?: string;
  /** App Store 앱 링크 */
  appStoreHref?: string;
  /** 구글 플레이 배지 이미지 */
  playStoreImgSrc?: string;
  /** App Store 배지 이미지 */
  appStoreImgSrc?: string;
  /** SNS 링크 목록 */
  snsLinks?: TrostSnsLink[];
  /** 회사 정보 오버라이드 (기본: (주)다인 정보) */
  companyInfo?: {
    lines: string[];
  };
  className?: string;
}

const DEFAULT_COMPANY_LINES = [
  "상호명: (주)다인 | 대표 : 송민경, 나승균",
  "사업장소재지: 서울특별시 강남구 역삼로3길 17, 8층 (역삼동)",
  "사업자등록번호: 101-86-16191 | 통신판매업신고번호: 제 2025-서울강남-03821 | 개인정보책임자: 한상범",
  "대표 메일: trost@hu-mart.com |",
  "고객문의: 카카오톡 플러스친구 '트로스트'",
];

const TROST_WEB_FOOTER_STYLE = `
  .nds-trost-web-footer {
    display: none;
    width: 100%;
    height: 480px;
    background: ${trostNeutral[800]};
    z-index: 50;
    font-family: inherit;
  }
  @media (min-width: 1024px) {
    .nds-trost-web-footer { display: block; }
  }
  .nds-trost-web-footer__inner {
    max-width: 1080px;
    padding: 24px 0;
    margin: 0 auto;
    height: 100%;
    color: #fff;
    font-size: 14px;
    line-height: 23.94px;
    font-weight: 300;
    position: relative;
    box-sizing: border-box;
  }
  .nds-trost-web-footer__terms {
    margin-bottom: 18px;
  }
  .nds-trost-web-footer__terms a {
    color: #fff;
    text-decoration: none;
  }
  .nds-trost-web-footer__terms a:first-child {
    margin-right: 14px;
  }
  .nds-trost-web-footer__dl-title {
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 8px;
  }
  .nds-trost-web-footer__stores {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }
  .nds-trost-web-footer__store-badge {
    width: 145px;
    height: 48px;
    cursor: pointer;
    display: inline-block;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
  .nds-trost-web-footer__muted { opacity: 0.6; }
  .nds-trost-web-footer__mt-2 { margin-top: 8px; }
  .nds-trost-web-footer__mt-4 { margin-top: 16px; }
  .nds-trost-web-footer__copy {
    font-size: 12px;
    line-height: 1.67;
    opacity: 0.6;
    margin-top: 16px;
  }
  .nds-trost-web-footer__sns {
    position: absolute;
    right: 0;
    top: 20px;
    color: #fff;
    display: flex;
    gap: 12px;
  }
  .nds-trost-web-footer__sns-link {
    width: 40px;
    height: 40px;
    background-size: cover;
    background-position: center;
    display: inline-block;
  }
`;

function TrostFooterWeb({
  termsHref = "https://trost.co.kr/about/terms/new/",
  locationTermsHref = "https://humartcompany.notion.site/203861718dfd805cad99d5fbeb8256e5?source=copy_link",
  playStoreHref = "https://play.google.com/store/apps/details?id=com.humart.trost2&hl=ko",
  appStoreHref = "https://apps.apple.com/kr/app/%ED%8A%B8%EB%A1%9C%EC%8A%A4%ED%8A%B8-%EA%B5%AD%EB%82%B4-1%EC%9C%84-%EC%8B%AC%EB%A6%AC%EC%83%81%EB%8B%B4-%EB%AA%85%EC%83%81-asmr/id1034957818",
  playStoreImgSrc = "https://assets.trost.co.kr/images/service/partner/footer_store_and_pc.png",
  appStoreImgSrc = "https://assets.trost.co.kr/images/service/partner/footer_store_ios_pc.png",
  snsLinks,
  companyInfo,
  className,
}: Omit<TrostFooterWebProps, "surface">) {
  const defaultSnsLinks: TrostSnsLink[] = [
    {
      href: "https://www.facebook.com/trostU/",
      label: "트로스트 페이스북",
      iconSrc: "https://assets.trost.co.kr/images/service/partner/footer_sns_facebook_pc.png",
    },
    {
      href: "https://www.instagram.com/trost.official/",
      label: "트로스트 인스타그램",
      iconSrc: "https://assets.trost.co.kr/images/service/partner/footer_sns_insta_pc.png",
    },
    {
      href: "https://brunch.co.kr/@trost#articles",
      label: "트로스트 브런치",
      iconSrc: "https://assets.trost.co.kr/images/service/partner/footer_sns_brunch_pc.png",
    },
    {
      href: "https://pf.kakao.com/_mywEM",
      label: "트로스트 카카오톡",
      iconSrc: "https://assets.trost.co.kr/images/service/partner/footer_sns_kakao_pc.png",
    },
  ];

  const sns = snsLinks ?? defaultSnsLinks;
  const companyLines = companyInfo?.lines ?? DEFAULT_COMPANY_LINES;

  return (
    <>
      <style>{TROST_WEB_FOOTER_STYLE}</style>
      <footer className={["nds-trost-web-footer", className].filter(Boolean).join(" ")}>
        <section className="nds-trost-web-footer__inner">
          <p className="nds-trost-web-footer__terms">
            <a href={termsHref}>이용약관 &amp; 개인정보처리방침</a>
            <a href={locationTermsHref}>위치기반 서비스 이용약관</a>
          </p>
          <p className="nds-trost-web-footer__dl-title">트로스트 앱 다운로드</p>
          <div className="nds-trost-web-footer__stores">
            <a
              href={playStoreHref}
              target="_blank"
              rel="noreferrer"
              className="nds-trost-web-footer__store-badge"
              style={{ backgroundImage: `url(${playStoreImgSrc})` }}
              aria-label="Google Play 다운로드"
            />
            <a
              href={appStoreHref}
              target="_blank"
              rel="noreferrer"
              className="nds-trost-web-footer__store-badge"
              style={{ backgroundImage: `url(${appStoreImgSrc})` }}
              aria-label="App Store 다운로드"
            />
          </div>

          {companyLines.map((line, i) => (
            <p key={i} className="nds-trost-web-footer__muted">
              {line}
            </p>
          ))}

          <p className="nds-trost-web-footer__mt-2">
            (주)다인은 통신판매중개자이며, 통신판매의 당사자가 아닙니다.
          </p>
          <p>
            다만, 상담 서비스 이용 및 결제/환불 등의 민원 처리, 고객 응대 등 서비스 운영에 관한
            책임은 (주)다인에 있습니다.
          </p>
          <p className="nds-trost-web-footer__mt-2">
            본인 또는 타인의 생명이 위급한 상황일 경우에는 24시간 상담 가능한 정신건강 위기상담전화
            1577-0199 혹은 보건복지콜센터 129에 도움을 요청하십시오.
          </p>
          <p>긴급 신고는 119 안전신고센터를 이용하시기 바랍니다.</p>

          <p className="nds-trost-web-footer__copy">
            Humart Company Co., Ltd. All rights reserved.
          </p>

          <div className="nds-trost-web-footer__sns">
            {sns.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="nds-trost-web-footer__sns-link"
                style={{ backgroundImage: `url(${item.iconSrc})` }}
                aria-label={item.label}
                target="_blank"
                rel="noreferrer"
              />
            ))}
          </div>
        </section>
      </footer>
    </>
  );
}

/* ─── Discriminated union — public surface ─── */

export type TrostFooterProps = TrostFooterAppProps | TrostFooterWebProps;

/**
 * Trost 통합 푸터.
 *   - `surface='web'` → 데스크톱 다크 PC 푸터 (≥1024 viewport 에서 노출).
 *   - `surface='app'` (default) → Footer.Info 베이스 위 dark 앱 푸터.
 *     `layout='desktop'|'mobile'` 로 컴포지션 분기.
 */
export const TrostFooter = React.forwardRef<HTMLElement, TrostFooterProps>((props, ref) => {
  if (props.surface === "web") {
    const { surface: _s, ...webRest } = props;
    return <TrostFooterWeb {...webRest} />;
  }
  return <TrostFooterApp {...props} ref={ref} />;
});
TrostFooter.displayName = "TrostFooter";
