/**
 * Brand chrome wrappers for mockup-first HTML usage.
 *
 * 사용 패턴:
 *   <nds-brand-header brand="trost"  surface="web"></nds-brand-header>
 *   <nds-brand-header brand="geniet" surface="web"></nds-brand-header>
 *   <nds-brand-footer brand="geniet" surface="web"></nds-brand-footer>
 *
 * Alias (brand 분기 없이 바로 호출):
 *   <nds-trost-header></nds-trost-header>
 *   <nds-geniet-header surface="mobile"></nds-geniet-header>
 *
 * React 패키지의 brand chrome (Trost/Geniet/NudgeEAP/Cashpobi WebHeader / AppBar)
 * 과 시각적으로 동등한 HTML 을 직접 렌더한다. 단순 wrapper 가 아니라 brand 별
 * 풍부한 데이터를 들고 있으며, brand-specific 마크업/스타일을 inline 으로 inject.
 */

import { NdsElement, define } from "../base/nds-element.js";
import { cv, fontWeight, radius, spacing, transition, typeScale, zIndex } from "@nudge-eap/tokens";
import "./nds-header.js";
import "./nds-footer.js";
import {
  GENIET_LOGO_PC_DATA_URI,
  GENIET_LOGO_MOBILE_DATA_URI,
  GENIET_LOGO_FOOTER_DATA_URI,
  NUDGE_EAP_LOGO_DATA_URI,
  NUDGE_EAP_LOGO_FOOTER_DATA_URI,
  TROST_LOGO_DATA_URI,
  TROST_LOGO_MOBILE_DATA_URI,
  CASHPOBI_LOGO_DATA_URI,
} from "./brand-logo-defaults.js";

/* ──────────────── Types ──────────────── */

type BrandKey = "nudge-eap" | "trost" | "geniet" | "cashpobi";
type HeaderSurface = "web" | "mobile" | "webview";
type FooterSurface = "web" | "app";

interface MenuItem {
  key: string;
  label: string;
  href: string;
}

interface CompanyData {
  name: string;
  ceo?: string;
  bizNumber: string;
  address: string;
  phone?: string;
  email?: string;
  copyright: string;
}

interface FooterLink {
  label: string;
  href: string;
  bold?: boolean;
}

interface BrandLogo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface GenietActionButton {
  key: string;
  label: string;
  iconKey: "coupon" | "mypage" | "login";
  href?: string;
  dividerBefore?: boolean;
}

interface GenietCtaPill {
  key: string;
  label: string;
  iconKey?: "cashreview" | "confetti";
  tone: "outline" | "tinted" | "filled";
  href?: string;
}

interface TrendingItem {
  rank: number;
  trend: "new" | "up" | "down" | "same";
  keyword: string;
}

interface BrandChrome {
  label: string;
  logo: BrandLogo;
  mobileLogo?: BrandLogo;
  footerLogo?: BrandLogo;
  maxWidth: number;
  webMenu: MenuItem[];
  mobileTitle: string;
  primaryAction?: { label: string; href: string };
  authLabel?: string;
  footerTone: "light" | "dark";
  footerSurface: FooterSurface;
  footerLinks: FooterLink[];
  company: CompanyData;
  extra?: string;

  /** Geniet 전용 — 2단 데스크탑 + 2단 모바일 헤더 데이터 */
  geniet?: {
    pcTopPadding: number;
    pcSearchHeight: number;
    pcMenuHeight: number;
    pcGap: number;
    pcSearchInputWidth: number;
    searchPlaceholder: string;
    trendingTimestamp: string;
    trendingKeywords: TrendingItem[];
    actionButtons: GenietActionButton[];
    categoryLabel: string;
    categoryHref: string;
    ctaButtons: GenietCtaPill[];
    mobileHeight: number;
    mobileSearchPlaceholder: string;
    mobilePointAmount: string;
    mobilePointHref: string;
  };

  /** Trost 전용 — Web 헤더는 EAP 배너 + 유틸리티 헤더 + 탭 네비게이션 3슬롯 compound */
  trost?: {
    pcMaxWidth: number;
    searchInputWidth: number;
    searchPlaceholder: string;
    appDownloadLabel: string;
    partnerSignupLabel?: string;
    tabs: { name: string; href: string; isNew?: boolean }[];
    activeTab: string;
    bannerStrong: string;
    bannerText: string;
    bannerCtaPrefix: string;
    bannerCtaAccent: string;
    bannerCtaSuffix: string;
    bannerHref: string;
  };

  /** NudgeEAP 전용 — appDownload 버튼 옵션 */
  nudgeEap?: {
    appDownloadLabel: string;
    appDownloadHref: string;
  };

  /** Cashpobi 전용 — yellow primary CTA pill */
  cashpobi?: {
    primaryCta: { label: string; href: string };
    mobileHeight: number;
  };
}

/* ──────────────── Data ──────────────── */

const BRAND_DATA: Record<BrandKey, BrandChrome> = {
  "nudge-eap": {
    label: "NudgeEAP",
    /* 로고 src 는 base64 data URI 로 self-contained — 외부 소비자가 자산 hosting
     * 없이도 어떤 환경에서든 깨지지 않고 렌더된다. asset-base-url 로 override 도 가능. */
    logo: { src: NUDGE_EAP_LOGO_DATA_URI, alt: "NudgeEAP", width: 124, height: 28 },
    footerLogo: { src: NUDGE_EAP_LOGO_FOOTER_DATA_URI, alt: "NudgeEAP", width: 100, height: 23 },
    maxWidth: 1200,
    webMenu: [
      { key: "counsel", label: "상담하기", href: "/counsel" },
      { key: "test", label: "심리검사", href: "/tests" },
      { key: "therapy", label: "심리치료", href: "/therapy" },
      { key: "letter", label: "주간레터", href: "/letter" },
      { key: "news", label: "소식", href: "/news" },
      { key: "my", label: "마이페이지", href: "/my" },
    ],
    mobileTitle: "NudgeEAP",
    authLabel: "로그인",
    footerTone: "light",
    footerSurface: "web",
    footerLinks: [
      { label: "개인정보 처리방침", href: "/privacy", bold: true },
      { label: "서비스 이용약관", href: "/terms" },
      { label: "위치기반 서비스 이용약관", href: "/location-terms" },
    ],
    company: {
      name: "주식회사 다인",
      ceo: "한상범",
      bizNumber: "101-86-16191",
      address: "서울특별시 강남구 역삼로1길 8, 5층",
      phone: "02-2268-5980",
      email: "support@nudgeeap.com",
      copyright: "Copyright 2024 Dain Co.Ltd. All Rights Reserved.",
    },
    extra: "powered by Cashwalk",
    nudgeEap: {
      appDownloadLabel: "앱 다운로드",
      appDownloadHref: "/download",
    },
  },
  trost: {
    label: "Trost",
    /* 로고 self-contained data URI (geniet/nudge-eap 와 동일 정책). */
    logo: { src: TROST_LOGO_DATA_URI, alt: "Trost", width: 90, height: 36 },
    mobileLogo: { src: TROST_LOGO_MOBILE_DATA_URI, alt: "Trost", width: 80, height: 28 },
    maxWidth: 1080,
    webMenu: [
      { key: "home", label: "홈", href: "/" },
      { key: "counsel", label: "상담", href: "/counsel" },
      { key: "test", label: "심리검사", href: "/tests" },
      { key: "care", label: "마음케어", href: "/care" },
      { key: "center", label: "상담센터", href: "/center" },
    ],
    mobileTitle: "Trost",
    authLabel: "로그인",
    footerTone: "dark",
    footerSurface: "app",
    footerLinks: [
      { label: "이용약관 & 개인정보처리방침", href: "/terms", bold: true },
      { label: "위치기반 서비스 이용약관", href: "/location-terms" },
    ],
    company: {
      name: "휴마트컴퍼니 주식회사",
      ceo: "김동현",
      bizNumber: "220-88-80365",
      address: "서울특별시 강남구 테헤란로 427",
      phone: "02-2055-1380",
      email: "help@trost.co.kr",
      copyright: "Copyright Humart Company. All Rights Reserved.",
    },
    extra: "긴급 위기상담 전화: 자살예방 상담전화 1393 / 정신건강 위기상담 전화 1577-0199",
    trost: {
      pcMaxWidth: 1080,
      searchInputWidth: 530,
      searchPlaceholder: "전문가, 상황, 증상 등을 검색해 보세요",
      appDownloadLabel: "앱 다운로드",
      partnerSignupLabel: "상담사 회원가입",
      tabs: [
        { name: "홈", href: "/" },
        { name: "커뮤니티", href: "/community", isNew: true },
        { name: "오늘의 명언/성경", href: "/quotes" },
        { name: "전문 심리상담", href: "/counsel" },
        { name: "심리검사", href: "/test" },
        { name: "약물치료", href: "/medicine" },
      ],
      activeTab: "/",
      bannerStrong: "기업 전용 멘탈케어 프로그램",
      bannerText: "을 도입하고 싶다면?",
      bannerCtaPrefix: "지금 ",
      bannerCtaAccent: "넛지EAP",
      bannerCtaSuffix: " 이용해보기",
      bannerHref: "https://eapkorea.co.kr/",
    },
  },
  geniet: {
    label: "Geniet",
    /* 로고 src 는 base64 data URI 로 self-contained — 외부 소비자가 별도 asset
     * hosting 을 안 해도 어떤 환경에서든 깨지지 않고 렌더된다. asset-base-url 을
     * 주면 resolveAssetUrl 이 data: 는 그대로 통과시키므로 override 도 안전. */
    logo: { src: GENIET_LOGO_PC_DATA_URI, alt: "Geniet", width: 165, height: 54 },
    mobileLogo: { src: GENIET_LOGO_MOBILE_DATA_URI, alt: "Geniet", width: 97, height: 32 },
    footerLogo: { src: GENIET_LOGO_FOOTER_DATA_URI, alt: "Geniet", width: 110, height: 32 },
    maxWidth: 1280,
    webMenu: [
      { key: "home", label: "홈", href: "/" },
      { key: "community", label: "커뮤니티", href: "/community" },
      { key: "deal", label: "헬시딜", href: "/cashdeal" },
      { key: "review", label: "음식 리뷰", href: "/reviews" },
      { key: "record", label: "기록", href: "/record" },
    ],
    mobileTitle: "Geniet",
    authLabel: "로그인",
    footerTone: "light",
    footerSurface: "app",
    footerLinks: [
      { label: "이용약관", href: "/rules/service" },
      { label: "개인정보처리방침", href: "/rules/privacy", bold: true },
      { label: "고객 문의", href: "mailto:geniet_app@geniet.co.kr" },
    ],
    company: {
      name: "넛지모바일 주식회사",
      ceo: "한상범",
      bizNumber: "897-87-02757",
      address: "서울시 강남구 테헤란로20길 18, 6층",
      email: "geniet_app@geniet.co.kr",
      copyright: "Copyright 2024 by Geniet, Inc. All Rights Reserved.",
    },
    extra:
      "지니어트는 통신판매중개자이며 통신판매의 당사자가 아닙니다. 따라서 지니어트는 상품 거래정보 및 거래에 대하여 책임을 지지 않습니다.",
    geniet: {
      pcTopPadding: 40,
      pcSearchHeight: 54,
      pcMenuHeight: 58,
      pcGap: 20,
      pcSearchInputWidth: 500,
      searchPlaceholder: "궁금한 음식 칼로리, 다이어트 후기 등을 검색해 보세요",
      trendingTimestamp: "09:00 기준",
      trendingKeywords: [
        { rank: 1, trend: "new", keyword: "고단백 식단" },
        { rank: 2, trend: "up", keyword: "다이어트 레시피" },
        { rank: 3, trend: "same", keyword: "운동 후 식사" },
        { rank: 4, trend: "down", keyword: "저탄수화물" },
        { rank: 5, trend: "up", keyword: "혈당 관리" },
      ],
      actionButtons: [
        { key: "coupon", label: "쿠폰상점", iconKey: "coupon", href: "#" },
        {
          key: "mypage",
          label: "마이페이지",
          iconKey: "mypage",
          href: "#",
          dividerBefore: true,
        },
        { key: "login", label: "로그인", iconKey: "login", href: "#" },
      ],
      categoryLabel: "음식 카테고리",
      categoryHref: "/category",
      ctaButtons: [
        { key: "cashreview", label: "캐시리뷰", iconKey: "cashreview", tone: "outline", href: "#" },
        { key: "invite", label: "친구초대 이벤트", iconKey: "confetti", tone: "tinted", href: "#" },
      ],
      mobileHeight: 102,
      mobileSearchPlaceholder: "음식명, 칼로리, 영양성분, 음식 리뷰 검색",
      mobilePointAmount: "34,300",
      mobilePointHref: "#",
    },
  },
  cashpobi: {
    label: "Cashpobi",
    /* 로고 self-contained data URI (geniet/trost/nudge-eap 와 동일 정책).
     * 데스크탑/모바일 동일 로고 — 크기만 다르게. */
    logo: {
      src: CASHPOBI_LOGO_DATA_URI,
      alt: "Cashwalk for Business",
      width: 107,
      height: 32,
    },
    mobileLogo: {
      src: CASHPOBI_LOGO_DATA_URI,
      alt: "Cashwalk for Business",
      width: 80,
      height: 24,
    },
    maxWidth: 1600,
    webMenu: [
      { key: "home", label: "홈", href: "/" },
      { key: "campaign", label: "캠페인", href: "/campaigns" },
      { key: "member", label: "회원", href: "/members" },
      { key: "channel", label: "채널", href: "/channels" },
      { key: "setting", label: "설정", href: "/settings" },
    ],
    mobileTitle: "Cashpobi",
    authLabel: "로그인",
    footerTone: "light",
    footerSurface: "web",
    footerLinks: [
      { label: "서비스 이용약관", href: "/terms" },
      { label: "개인정보처리방침", href: "/privacy", bold: true },
      { label: "광고 문의", href: "/contact" },
    ],
    company: {
      name: "넛지헬스케어 주식회사",
      ceo: "나승균",
      bizNumber: "220-88-98131",
      address: "서울특별시 강남구 테헤란로 427",
      phone: "02-6956-1111",
      email: "contact@cashwalk.io",
      copyright: "Copyright Cashwalk. All Rights Reserved.",
    },
    extra: "Cashwalk for Business",
    cashpobi: {
      primaryCta: { label: "광고 시작하기", href: "/start" },
      mobileHeight: 56,
    },
  },
};

const BRAND_KEYS = Object.keys(BRAND_DATA) as BrandKey[];

/* ──────────────── Utils ──────────────── */

function normalizeBrand(value: string | null, fallback: BrandKey): BrandKey {
  return BRAND_KEYS.includes(value as BrandKey) ? (value as BrandKey) : fallback;
}

function normalizeSurface<T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function resolveAssetUrl(assetBaseUrl: string, src: string): string {
  if (/^(?:https?:)?\/\//.test(src) || src.startsWith("data:") || src.startsWith("/")) {
    return src;
  }
  return `${assetBaseUrl.replace(/\/$/, "")}/${src}`;
}

function renderLogoImg(
  logo: BrandLogo,
  assetBaseUrl: string,
  override?: { height?: number },
): string {
  const src = resolveAssetUrl(assetBaseUrl, logo.src);
  const h = override?.height ?? logo.height;
  return `<img src="${escapeAttr(src)}" alt="${escapeAttr(logo.alt)}" width="${logo.width}" height="${h}" style="display:block;width:auto;height:${h}px;object-fit:contain;" />`;
}

/** Once-per-document style injection guard. */
function ensureStyle(id: string, css: string): string {
  return `<style data-nds-style="${id}">${css}</style>`;
}

/** Shared webview header — 좌측 < 버튼 + 중앙 title.
 *   styles.css 의 `.nds-header[data-variant="webview"] .nds-header__title` 은
 *   position: absolute · left:50% · translateX(-50%) 만 잡고 vertical center 가 빠져
 *   글자가 위 baseline 에 붙는다. brand-chrome 안에서 한 번만 vertical center override. */
const WEBVIEW_FIX_ID = "nds-brand-chrome-webview-fix";
const WEBVIEW_FIX_CSS = `
  :where(nds-brand-header) .nds-header[data-variant="webview"] .nds-header__title {
    top: 50%;
    transform: translate(-50%, -50%);
  }
  :where(nds-brand-header) .nds-header[data-variant="webview"] {
    position: relative;
  }
`;

function renderWebviewHeader(title: string): string {
  return `
    ${ensureStyle(WEBVIEW_FIX_ID, WEBVIEW_FIX_CSS)}
    <nds-header variant="webview" header-title="${escapeAttr(title)}">
      <nds-icon-button slot="left" aria-label="뒤로가기">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18L9 12L15 6"/></svg>
      </nds-icon-button>
    </nds-header>
  `;
}

/* ──────────────── Inline SVG icons ──────────────── */
/* Geniet icons — packages/icons/svg/geniet-*.svg 1:1 복제 (currentColor 유지). */

const GENIET_ICONS: Record<string, string> = {
  coupon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="scale(0.857143 0.857143)"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0847 2.04199C16.5008 2.0421 18.4597 4.00083 18.4597 6.41699H19.0827L19.4108 6.43164C21.0342 6.58328 22.3588 7.84841 22.5583 9.49609L24.111 22.3301C24.355 24.3493 22.8348 26.1346 20.8307 26.2441L20.6354 26.25H7.41668C5.35912 26.2497 3.74552 24.4828 3.93133 22.4336L5.09539 9.59961C5.24909 7.90964 6.58763 6.59091 8.24578 6.43262L8.58172 6.41699H9.70965C9.70965 4.00085 11.6685 2.04215 14.0847 2.04199ZM8.58172 8.16699C7.6766 8.16701 6.92046 8.8574 6.83856 9.75879L5.67449 22.5918C5.58159 23.6163 6.38801 24.4997 7.41668 24.5H20.6354C21.6852 24.4999 22.4998 23.5812 22.3737 22.5391L20.82 9.70605C20.7135 8.82762 19.9676 8.16713 19.0827 8.16699H18.4597V9.91699C18.4595 10.4 18.0677 10.7919 17.5847 10.792C17.1016 10.7918 16.7098 10.4 16.7097 9.91699V8.16699H11.4597V9.91699C11.4595 10.4 11.0677 10.7919 10.5847 10.792C10.1016 10.7918 9.70983 10.4 9.70965 9.91699V8.16699H8.58172ZM14.0847 3.79199C12.635 3.79215 11.4597 4.96735 11.4597 6.41699H16.7097C16.7097 4.96732 15.5343 3.7921 14.0847 3.79199Z" fill="currentColor"/></g></svg>`,
  mypage: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="scale(0.857143 0.857143)"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0004 14.8951C18.1069 14.8952 21.6301 17.392 23.1361 20.9498C23.9896 22.9671 22.1402 24.8121 19.9496 24.8121H8.05016L7.84508 24.8062C5.81354 24.6993 4.1476 23.017 4.79235 21.1373L4.86364 20.9498C6.36966 17.3919 9.8937 14.8951 14.0004 14.8951ZM14.0004 16.6451C10.6213 16.6451 7.71679 18.6981 6.47497 21.6314C6.34027 21.9501 6.39111 22.2112 6.62731 22.4791C6.90444 22.793 7.42593 23.062 8.05016 23.0621H19.9496C20.5739 23.0621 21.0952 22.7931 21.3724 22.4791C21.6087 22.2112 21.6595 21.9502 21.5248 21.6314C20.283 18.6983 17.3792 16.6452 14.0004 16.6451ZM14.0004 3.42929C16.7386 3.42947 18.9584 5.649 18.9584 8.3873C18.9583 11.1256 16.7386 13.3451 14.0004 13.3453C11.262 13.3453 9.04141 11.1257 9.04137 8.3873C9.04137 5.64889 11.2619 3.42929 14.0004 3.42929ZM14.0004 5.17929C12.2284 5.17929 10.7914 6.61539 10.7914 8.3873C10.7914 10.1592 12.2285 11.5953 14.0004 11.5953C15.7721 11.5951 17.2083 10.1591 17.2084 8.3873C17.2084 6.6155 15.7721 5.17947 14.0004 5.17929Z" fill="currentColor"/></g></svg>`,
  login: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="scale(0.857143 0.857143)"><path d="M15.75 2.625C17.5218 2.625 18.9578 4.06124 18.958 5.83301V6.41699C18.9578 6.90009 18.5661 7.29199 18.083 7.29199C17.6 7.29182 17.2082 6.89998 17.208 6.41699V5.83301C17.2078 5.02774 16.5553 4.375 15.75 4.375H7.58301C6.77785 4.37518 6.12518 5.02785 6.125 5.83301V22.167C6.12518 22.9721 6.77785 23.6248 7.58301 23.625H15.75C16.5553 23.625 17.2078 22.9723 17.208 22.167V21.583C17.2082 21.1 17.6 20.7082 18.083 20.708C18.5661 20.708 18.9578 21.0999 18.958 21.583V22.167C18.9578 23.9388 17.5218 25.375 15.75 25.375H7.58301C5.81135 25.3748 4.37518 23.9386 4.375 22.167V5.83301C4.37518 4.06135 5.81135 2.62518 7.58301 2.625H15.75ZM13.9639 9.88281C14.3047 9.54068 14.8587 9.5392 15.2012 9.87988C15.5433 10.2207 15.5436 10.7747 15.2031 11.1172L13.2061 13.125H22.75C23.2332 13.125 23.625 13.5168 23.625 14C23.625 14.4832 23.2332 14.875 22.75 14.875H13.1875L15.2012 16.8799C15.5433 17.2207 15.5436 17.7747 15.2031 18.1172C14.8623 18.4593 14.3083 18.4606 13.9658 18.1201L10.4658 14.6377C10.3017 14.4741 10.2087 14.2522 10.208 14.0205V14C10.208 13.7061 10.353 13.4458 10.5752 13.2871L13.9639 9.88281Z" fill="currentColor"/></g></svg>`,
  search: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="scale(1.395373 1.395373)"><path d="M12.4443 7.07227C12.4443 4.10541 10.0391 1.69945 7.07227 1.69922C4.10527 1.69922 1.69922 4.10527 1.69922 7.07227C1.69945 10.0391 4.10541 12.4443 7.07227 12.4443C10.0389 12.4441 12.4441 10.0389 12.4443 7.07227ZM14.1445 7.07227C14.1443 10.9778 10.9778 14.1443 7.07227 14.1445C3.16653 14.1445 0.000234511 10.9779 0 7.07227C0 3.16638 3.16638 0 7.07227 0C10.9779 0.000234514 14.1445 3.16653 14.1445 7.07227Z" fill="currentColor"/><path d="M10.9098 10.9098C11.2417 10.5778 11.779 10.5778 12.1109 10.9098L16.9508 15.7486C17.2826 16.0806 17.2827 16.6189 16.9508 16.9508C16.6189 17.2827 16.0806 17.2826 15.7486 16.9508L10.9098 12.1109C10.5778 11.779 10.5778 11.2417 10.9098 10.9098Z" fill="currentColor"/></g></svg>`,
  menu: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" fill-rule="evenodd"><path d="M3 19h9v-2H3zM3 13h18v-2H3zM3 5v2h18V5z"/></g></svg>`,
  cashreview: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="scale(1.2 1.2)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.25 2C6.57433 2 3.49851 4.5599 2.70235 7.99354C2.7008 8.00036 2.69925 8.00734 2.6977 8.01423C2.67383 8.11808 2.65198 8.22255 2.63245 8.32788C2.63105 8.33617 2.62958 8.34431 2.62819 8.3526C2.54549 8.80605 2.5 9.2726 2.5 9.75C2.5 9.75512 2.50047 9.76 2.50047 9.76511C2.50031 9.77015 2.5 9.77511 2.5 9.78023C2.5 9.80735 2.50186 9.83424 2.50217 9.86129C2.5024 9.88191 2.50155 9.90198 2.50202 9.92259C2.50271 9.95367 2.50488 9.98436 2.50597 10.0154C2.50628 10.0257 2.50713 10.0359 2.5076 10.0463C2.51 10.1122 2.51325 10.178 2.51728 10.2437C2.52209 10.3237 2.52837 10.4034 2.53557 10.4829C2.53798 10.5096 2.53999 10.5364 2.5427 10.5631C2.68755 12.0028 3.22571 13.3262 4.05171 14.422L2.81357 15.6602C2.39553 16.0782 2.39553 16.7557 2.81357 17.1737C3.23145 17.5916 3.90911 17.5916 4.32699 17.1737L5.56373 15.9371C6.85821 16.9175 8.47068 17.5 10.2199 17.5C10.2243 17.5 10.2288 17.4995 10.2333 17.4995C10.239 17.4995 10.2444 17.5 10.25 17.5C14.5302 17.5 18 14.0302 18 9.75C18 5.46975 14.5302 2 10.25 2Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10.3471 8.51219H6.97228C6.59849 8.51219 6.29541 8.2091 6.29541 7.83515C6.29541 7.46127 6.59849 7.15836 6.97228 7.15836H10.3471C10.721 7.15836 11.0242 7.46127 11.0242 7.83515C11.0242 8.2091 10.721 8.51219 10.3471 8.51219Z" fill="#fff"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14.1618 11.0433H7.0274C6.62301 11.0433 6.29517 10.7402 6.29517 10.3662C6.29517 9.99254 6.62301 9.68945 7.0274 9.68945H14.1618C14.5661 9.68945 14.894 9.99254 14.894 10.3662C14.894 10.7402 14.5661 11.0433 14.1618 11.0433Z" fill="#fff"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.8811 13.5744H6.9722C6.59833 13.5744 6.29541 13.2713 6.29541 12.8974C6.29541 12.5235 6.59833 12.2206 6.9722 12.2206H11.8811C12.2549 12.2206 12.5581 12.5235 12.5581 12.8974C12.5581 13.2713 12.2549 13.5744 11.8811 13.5744Z" fill="#fff"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16.1115 5.71378L15.1623 5.57595C15.0803 5.56386 15.0094 5.51241 14.9727 5.43804L14.5483 4.57798C14.4558 4.39071 14.1888 4.39071 14.0964 4.57798L13.6719 5.43804C13.6352 5.51241 13.5643 5.56386 13.4823 5.57595L12.5331 5.71378C12.3265 5.74379 12.244 5.99777 12.3935 6.14343L13.0803 6.81305C13.1397 6.87083 13.1668 6.95421 13.1527 7.03592L12.9906 7.98128C12.9553 8.18706 13.1713 8.34398 13.3561 8.24684L14.205 7.80051C14.2785 7.76191 14.3661 7.76191 14.4395 7.80051L15.2884 8.24684C15.4733 8.34398 15.6893 8.18706 15.654 7.98128L15.4919 7.03592C15.4778 6.95421 15.505 6.87083 15.5643 6.81305L16.2511 6.14343C16.4006 5.99777 16.3181 5.74379 16.1115 5.71378Z" fill="currentColor"/></g></svg>`,
  confetti: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="scale(1.2 1.2)"><path d="M8.62969 4.27705C8.48462 4.13271 8.30558 4.02717 8.10903 3.97017C7.91248 3.91316 7.70476 3.90651 7.50497 3.95083C7.30518 3.99515 7.11975 4.08902 6.96574 4.22379C6.81174 4.35856 6.69411 4.5299 6.62369 4.72205L2.57269 15.862C2.50589 16.0459 2.48422 16.2431 2.50953 16.437C2.53483 16.631 2.60636 16.816 2.71809 16.9766C2.82982 17.1371 2.97849 17.2684 3.15158 17.3595C3.32466 17.4507 3.5171 17.4988 3.71269 17.5C3.85569 17.499 3.99869 17.473 4.13269 17.423L15.2757 13.372C15.4681 13.3018 15.6397 13.1842 15.7748 13.0302C15.9098 12.8762 16.0038 12.6906 16.0483 12.4907C16.0927 12.2907 16.0861 12.0828 16.029 11.8861C15.9719 11.6894 15.8662 11.5102 15.7217 11.365L8.63069 4.27705H8.62969Z" fill="currentColor"/><path d="M12.375 5.771C12.386 5.354 12.487 4.944 12.671 4.569C13.081 3.752 13.851 3.302 14.844 3.302C15.362 3.302 15.694 3.125 15.898 2.746C16.006 2.533 16.068 2.301 16.079 2.063C16.0797 1.89923 16.1454 1.74243 16.2616 1.6271C16.3779 1.51176 16.5352 1.44734 16.699 1.448C16.8628 1.44867 17.0196 1.51436 17.1349 1.63063C17.2502 1.74691 17.3147 1.90423 17.314 2.068C17.314 3.06 16.657 4.537 14.844 4.537C14.327 4.537 13.995 4.713 13.791 5.093C13.683 5.305 13.621 5.538 13.61 5.776C13.6093 5.93977 13.5436 6.09657 13.4274 6.21191C13.3111 6.32724 13.1538 6.39167 12.99 6.391C12.8262 6.39034 12.6694 6.32465 12.5541 6.20837C12.4388 6.0921 12.3743 5.93477 12.375 5.771Z" fill="currentColor"/><path d="M10.5217 3.30304V1.44904C10.5217 1.28527 10.5868 1.12821 10.7026 1.0124C10.8184 0.896601 10.9755 0.831543 11.1392 0.831543C11.303 0.831543 11.4601 0.896601 11.5759 1.0124C11.6917 1.12821 11.7567 1.28527 11.7567 1.44904V3.30304C11.7567 3.46681 11.6917 3.62388 11.5759 3.73968C11.4601 3.85548 11.303 3.92054 11.1392 3.92054C10.9755 3.92054 10.8184 3.85548 10.7026 3.73968C10.5868 3.62388 10.5217 3.46681 10.5217 3.30304Z" fill="currentColor"/><path d="M18.3681 9.65615C18.4266 9.7132 18.4731 9.7813 18.505 9.85648C18.537 9.93166 18.5536 10.0124 18.5541 10.0941C18.5546 10.1758 18.5388 10.2568 18.5078 10.3323C18.4767 10.4078 18.4309 10.4765 18.3732 10.5342C18.3154 10.5919 18.2467 10.6376 18.1711 10.6686C18.0955 10.6995 18.0145 10.7152 17.9329 10.7146C17.8512 10.7141 17.7704 10.6973 17.6953 10.6653C17.6201 10.6333 17.5521 10.5867 17.4951 10.5281L16.2601 9.29415C16.2027 9.23676 16.1572 9.16863 16.1261 9.09365C16.0951 9.01867 16.0791 8.93831 16.0791 8.85715C16.0791 8.77599 16.0951 8.69563 16.1261 8.62064C16.1572 8.54566 16.2027 8.47753 16.2601 8.42015C16.3175 8.36276 16.3856 8.31724 16.4606 8.28618C16.5356 8.25512 16.616 8.23914 16.6971 8.23914C16.7783 8.23914 16.8586 8.25512 16.9336 8.28618C17.0086 8.31724 17.0767 8.36276 17.1341 8.42015L18.3681 9.65615Z" fill="currentColor"/><path d="M18.744 6.35708L16.892 6.97408C16.7395 7.01598 16.5767 6.99779 16.4372 6.92325C16.2976 6.84872 16.192 6.72352 16.142 6.57343C16.092 6.42334 16.1015 6.2598 16.1685 6.11649C16.2355 5.97318 16.3548 5.86101 16.502 5.80308L18.354 5.18608C18.5058 5.14645 18.6669 5.16598 18.8048 5.24072C18.9426 5.31546 19.0469 5.43981 19.0965 5.58859C19.1461 5.73736 19.1373 5.89942 19.0718 6.04194C19.0064 6.18445 18.8892 6.29675 18.744 6.35708Z" fill="currentColor"/></g></svg>`,
  gpoint: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="scale(1.2 1.2)"><g fill="none" fill-rule="evenodd"><path d="M10 18.333a8.333 8.333 0 1 1 0-16.666 8.333 8.333 0 1 1 0 16.666z" fill="currentColor"/><path d="M10.228 14.654c-.06 0-.119 0-.177-.003-.614-.027-1.353-.06-2.233-.6-2.025-1.245-2.214-3.343-2.201-4.187.024-1.624.751-3.025 1.997-3.844 1.463-.964 4.014-1.002 5.749.6a.98.98 0 1 1-1.331 1.44c-.984-.907-2.52-.942-3.339-.402-.705.464-1.101 1.257-1.116 2.235-.009.632.143 1.795 1.269 2.488.446.274.785.288 1.215.307.763.039 1.583-.3 1.782-.686.088-.173.13-.351.125-.543v-.099h-1.494a.982.982 0 1 1 0-1.96h2.474a.98.98 0 0 1 .981.98v1.054c.013.495-.102.996-.341 1.463-.604 1.173-2.112 1.757-3.36 1.757" fill="#FEFEFE"/></g></g></svg>`,
  user: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="currentColor"/></svg>`,
};

const TROST_ICONS = {
  search: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="6.5" fill="none" stroke="currentColor" stroke-width="1.6" /><line x1="13.5" y1="13.5" x2="17" y2="17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>`,
  bell: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.5a6 6 0 0 0-6 6v3.4l-1.6 2.6a.8.8 0 0 0 .68 1.2h13.84a.8.8 0 0 0 .68-1.2L18 12.9V9.5a6 6 0 0 0-6-6Zm0 17a2.5 2.5 0 0 1-2.45-2h4.9A2.5 2.5 0 0 1 12 20.5Z" fill="currentColor"/></svg>`,
  hamburger: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>`,
};

/* ──────────────── Brand: NudgeEAP ──────────────── */
/* React: NudgeEAPWebHeader / NudgeEAPAppBar — 1단 헤더, 메뉴 absolute 중앙정렬.
 * appDownload 버튼은 gray-100 bg + brand text + brand border 의 secondary 스타일. */

function renderNudgeEAPHeader(
  brand: BrandChrome,
  surface: HeaderSurface,
  activeKey: string,
  assetBaseUrl: string,
): string {
  if (surface === "webview") {
    return renderWebviewHeader(brand.mobileTitle);
  }

  if (surface === "mobile") {
    /* logo 가 좌측에 떨어지므로 별도 header-title 은 제거 (둘 다 노출되면 중복). */
    return `
      <nds-header variant="compact">
        <nds-header-logo slot="left" href="/">${renderLogoImg(brand.logo, assetBaseUrl, { height: 28 })}</nds-header-logo>
        <nds-header-actions slot="right">
          <nds-header-auth-button label="${escapeAttr(brand.authLabel ?? "로그인")}"></nds-header-auth-button>
        </nds-header-actions>
      </nds-header>
    `;
  }

  /* desktop — 1단. 메뉴 absolute 중앙정렬 + AppDownload 별도 스타일 + Auth (primary border) */
  const styleId = "nds-brand-chrome-nudge-eap-web";
  const css = `
    .nds-brand-nudge-eap-web {
      display: block;
      width: 100%;
      background: ${cv.surface.default};
      border-bottom: 1px solid ${cv.borderRole.subtle};
      box-sizing: border-box;
      position: relative;
    }
    .nds-brand-nudge-eap-web__inner {
      max-width: var(--nds-nudge-eap-max-width, ${brand.maxWidth}px);
      margin: 0 auto;
      height: 80px;
      display: flex;
      align-items: center;
      padding: 0 ${spacing[16]}px;
      box-sizing: border-box;
      position: relative;
    }
    .nds-brand-nudge-eap-web__logo {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      text-decoration: none;
    }
    .nds-brand-nudge-eap-web__menu {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: ${spacing[8]}px;
      height: 100%;
    }
    .nds-brand-nudge-eap-web__menu-item {
      display: inline-flex;
      align-items: center;
      height: 100%;
      padding: 0 ${spacing[20]}px;
      font-size: ${typeScale.headline5.fontSize}px;
      line-height: ${typeScale.headline5.lineHeight}px;
      font-weight: ${fontWeight.bold};
      color: ${cv.textRole.strong};
      text-decoration: none;
      border-bottom: 3px solid transparent;
      box-sizing: border-box;
      white-space: nowrap;
    }
    .nds-brand-nudge-eap-web__menu-item[data-active="true"] {
      color: ${cv.textRole.brand};
      border-bottom-color: ${cv.borderRole.brand};
    }
    .nds-brand-nudge-eap-web__actions {
      margin-left: auto;
      display: inline-flex;
      align-items: center;
      gap: ${spacing[8]}px;
      flex-shrink: 0;
    }
    .nds-brand-nudge-eap-web__app-dl {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      padding: 0 ${spacing[16]}px;
      background: ${cv.surface.subtle};
      color: ${cv.textRole.brand};
      font-size: ${typeScale.body1.fontSize}px;
      line-height: ${typeScale.body1.lineHeight}px;
      font-weight: ${fontWeight.bold};
      border-radius: ${radius.md}px;
      text-decoration: none;
      border: 0;
      cursor: pointer;
      font-family: inherit;
    }
    .nds-brand-nudge-eap-web__auth {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      padding: 0 ${spacing[16]}px;
      background: ${cv.surface.default};
      color: ${cv.textRole.brand};
      font-size: ${typeScale.body1.fontSize}px;
      line-height: ${typeScale.body1.lineHeight}px;
      font-weight: ${fontWeight.bold};
      border: 1px solid ${cv.borderRole.brand};
      border-radius: ${radius.md}px;
      text-decoration: none;
      cursor: pointer;
      font-family: inherit;
    }
  `;

  const logoHref = "/";
  const logo = renderLogoImg(brand.logo, assetBaseUrl, { height: 32 });
  const menu = brand.webMenu
    .map(
      (item) =>
        `<a class="nds-brand-nudge-eap-web__menu-item" href="${escapeAttr(item.href)}" ${item.key === activeKey ? 'data-active="true"' : ""}>${escapeHtml(item.label)}</a>`,
    )
    .join("");
  const appDl = brand.nudgeEap
    ? `<a class="nds-brand-nudge-eap-web__app-dl" href="${escapeAttr(brand.nudgeEap.appDownloadHref)}">${escapeHtml(brand.nudgeEap.appDownloadLabel)}</a>`
    : "";

  return `
    ${ensureStyle(styleId, css)}
    <header class="nds-brand-nudge-eap-web" data-slot="root">
      <div class="nds-brand-nudge-eap-web__inner">
        <a class="nds-brand-nudge-eap-web__logo" href="${escapeAttr(logoHref)}">${logo}</a>
        <nav class="nds-brand-nudge-eap-web__menu">${menu}</nav>
        <div class="nds-brand-nudge-eap-web__actions">
          ${appDl}
          <a class="nds-brand-nudge-eap-web__auth" href="#">${escapeHtml(brand.authLabel ?? "로그인")}</a>
        </div>
      </div>
    </header>
  `;
}

/* ──────────────── Brand: Geniet ──────────────── */
/* React: GenietAppBar.tsx — 2단 데스크탑 (Search Header 54h + Menu Header 58h),
 * 2단 모바일 (Row1 logo+chip+user / Row2 menu+search). */

function renderGenietHeader(
  brand: BrandChrome,
  surface: HeaderSurface,
  activeKey: string,
  assetBaseUrl: string,
): string {
  const g = brand.geniet;
  if (!g) return "";

  if (surface === "webview") {
    return renderWebviewHeader(brand.mobileTitle);
  }

  const styleId = "nds-brand-chrome-geniet";
  const css = `
    /* ── Geniet root ── */
    .nds-brand-geniet {
      display: block;
      width: 100%;
      background: ${cv.surface.default};
      box-sizing: border-box;
      z-index: ${zIndex.appBar};
    }

    /* ── Desktop ── */
    .nds-brand-geniet--desktop {
      padding-top: ${g.pcTopPadding}px;
    }
    .nds-brand-geniet__search-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: ${brand.maxWidth}px;
      height: ${g.pcSearchHeight}px;
      margin: 0 auto;
      padding: 0 ${spacing[16]}px;
      gap: ${spacing[24]}px;
      box-sizing: border-box;
    }
    /* Rail: viewport 전체 폭 — 위/아래 border 가 화면 끝까지 그어진다.
     * 콘텐츠는 max-width 안쪽 nav 가 잡고, rail 은 border 만 담당. */
    .nds-brand-geniet__menu-header-rail {
      width: 100%;
      margin-top: ${g.pcGap}px;
      border-top: 1px solid ${cv.borderRole.subtle};
      border-bottom: 1px solid ${cv.borderRole.subtle};
      background: ${cv.surface.default};
      box-sizing: border-box;
    }
    .nds-brand-geniet__menu-header {
      display: flex;
      align-items: stretch;
      width: 100%;
      max-width: ${brand.maxWidth}px;
      height: ${g.pcMenuHeight}px;
      margin: 0 auto;
      padding: 0 ${spacing[16]}px;
      box-sizing: border-box;
    }
    .nds-brand-geniet__logo {
      display: inline-flex;
      flex-shrink: 0;
      text-decoration: none;
    }
    .nds-brand-geniet__search-frame {
      display: flex;
      align-items: center;
      gap: ${spacing[24]}px;
      flex-shrink: 0;
    }
    .nds-brand-geniet__search-input {
      position: relative;
      display: flex;
      align-items: center;
      width: ${g.pcSearchInputWidth}px;
      height: ${g.pcSearchHeight}px;
      border: 1px solid ${cv.borderRole.subtle};
      border-radius: 999px;
      padding: 0 ${spacing[48]}px 0 ${spacing[20]}px;
      background: ${cv.surface.default};
      box-sizing: border-box;
    }
    .nds-brand-geniet__search-input input {
      all: unset;
      width: 100%;
      font-size: ${typeScale.body2.fontSize}px;
      line-height: ${typeScale.body2.lineHeight}px;
      color: ${cv.textRole.normal};
      font-family: inherit;
    }
    .nds-brand-geniet__search-input input::placeholder {
      color: ${cv.textRole.muted};
    }
    .nds-brand-geniet__search-icon {
      position: absolute;
      right: ${spacing[16]}px;
      top: 50%;
      transform: translateY(-50%);
      color: ${cv.iconRole.strong};
      display: flex;
      cursor: pointer;
    }
    .nds-brand-geniet__trending {
      display: inline-flex;
      align-items: center;
      gap: ${spacing[8]}px;
      flex-shrink: 0;
      font-size: ${typeScale.caption1.fontSize}px;
      line-height: ${typeScale.caption1.lineHeight}px;
      color: ${cv.textRole.normal};
    }
    .nds-brand-geniet__trending-rank {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border-radius: 4px;
      background: ${cv.surface.brandSubtle};
      color: ${cv.textRole.brand};
      font-size: ${typeScale.caption2.fontSize}px;
      font-weight: ${fontWeight.bold};
    }
    .nds-brand-geniet__trending-keyword {
      font-weight: ${fontWeight.bold};
      color: ${cv.textRole.strong};
      white-space: nowrap;
    }
    .nds-brand-geniet__trending-stamp {
      color: ${cv.textRole.muted};
    }
    .nds-brand-geniet__login-area {
      display: flex;
      align-items: center;
      gap: ${spacing[12]}px;
      flex-shrink: 0;
    }
    .nds-brand-geniet__action-btn {
      all: unset;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: ${spacing[2]}px;
      width: 52px;
      height: 46px;
      cursor: pointer;
      color: ${cv.textRole.subtle};
      text-align: center;
      transition: color ${transition.default};
      text-decoration: none;
      font-family: inherit;
    }
    .nds-brand-geniet__action-btn:hover {
      color: ${cv.textRole.normal};
    }
    .nds-brand-geniet__action-btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
    }
    .nds-brand-geniet__action-btn-label {
      font-size: 11px;
      line-height: 14px;
      font-weight: ${fontWeight.medium};
      white-space: nowrap;
    }
    .nds-brand-geniet__action-divider {
      width: 1px;
      height: 24px;
      background: ${cv.borderRole.subtle};
      flex-shrink: 0;
    }
    .nds-brand-geniet__category {
      display: inline-flex;
      align-items: center;
      gap: ${spacing[10]}px;
      height: 100%;
      min-width: 160px;
      padding: 0 15px;
      border-right: 1px solid ${cv.borderRole.subtle};
      box-sizing: border-box;
      color: ${cv.textRole.strong};
      text-decoration: none;
      font-size: ${typeScale.headline5.fontSize}px;
      line-height: ${typeScale.headline5.lineHeight}px;
      font-weight: ${fontWeight.bold};
      cursor: pointer;
    }
    .nds-brand-geniet__gnb {
      display: flex;
      align-items: center;
      gap: ${spacing[20]}px;
      height: 100%;
      margin-left: ${spacing[20]}px;
      flex: 1;
      min-width: 0;
    }
    .nds-brand-geniet__gnb-item {
      display: inline-flex;
      align-items: center;
      height: 100%;
      padding: 0 ${spacing[10]}px;
      font-size: ${typeScale.headline5.fontSize}px;
      line-height: ${typeScale.headline5.lineHeight}px;
      font-weight: ${fontWeight.bold};
      color: ${cv.textRole.strong};
      text-decoration: none;
      white-space: nowrap;
      border-bottom: 3px solid transparent;
      box-sizing: border-box;
      transition: color ${transition.default}, border-color ${transition.default};
    }
    .nds-brand-geniet__gnb-item:hover {
      color: ${cv.textRole.brand};
    }
    .nds-brand-geniet__gnb-item[data-active="true"] {
      color: ${cv.textRole.brand};
      border-bottom-color: ${cv.borderRole.brand};
    }
    .nds-brand-geniet__cta-group {
      display: flex;
      align-items: center;
      gap: ${spacing[8]}px;
      margin-left: auto;
      flex-shrink: 0;
      align-self: center;
    }
    .nds-brand-geniet__cta-pill {
      all: unset;
      display: inline-flex;
      align-items: center;
      gap: ${spacing[4]}px;
      height: 36px;
      padding: 0 ${spacing[13]}px;
      border-radius: 999px;
      font-size: ${typeScale.caption1.fontSize}px;
      line-height: ${typeScale.caption1.lineHeight}px;
      font-weight: ${fontWeight.bold};
      white-space: nowrap;
      cursor: pointer;
      box-sizing: border-box;
      text-decoration: none;
      font-family: inherit;
      transition: background-color ${transition.default};
    }
    /* 캐시리뷰 — 흰 배경 + 연한 파란 보더 + 토스 블루 텍스트/아이콘. brand mint 와
     * 구분되는 accent 컬러라 시멘틱 토큰 대신 hex 로 못박는다 (React AppBar 와 동일). */
    .nds-brand-geniet__cta-pill[data-tone="outline"] {
      background: ${cv.surface.default};
      border: 1px solid #dce9ff;
      color: #1677ff;
    }
    /* 친구초대 이벤트 — 연한 하늘 배경 + 파란 텍스트. */
    .nds-brand-geniet__cta-pill[data-tone="tinted"] {
      background: #e9f7ff;
      color: #0093f1;
    }
    .nds-brand-geniet__cta-pill[data-tone="filled"] {
      background: ${cv.fill.brand};
      color: ${cv.textRole.inverse};
    }

    /* ── Mobile ── */
    .nds-brand-geniet--mobile {
      height: ${g.mobileHeight}px;
      display: flex;
      flex-direction: column;
      border-bottom: 1px solid ${cv.borderRole.subtle};
    }
    .nds-brand-geniet__mo-row1 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      padding: 0 ${spacing[16]}px;
      flex-shrink: 0;
    }
    .nds-brand-geniet__mo-row2 {
      display: flex;
      align-items: center;
      gap: ${spacing[12]}px;
      height: 52px;
      padding: 0 ${spacing[16]}px;
      flex-shrink: 0;
    }
    .nds-brand-geniet__mo-right {
      display: inline-flex;
      align-items: center;
      gap: ${spacing[14]}px;
    }
    .nds-brand-geniet__point-chip {
      display: inline-flex;
      align-items: center;
      gap: ${spacing[2]}px;
      height: 30px;
      padding: 5px ${spacing[8]}px;
      border: 1px solid ${cv.borderRole.subtle};
      border-radius: 20px;
      background: ${cv.surface.default};
      color: ${cv.textRole.normal};
      font-size: ${typeScale.body2.fontSize}px;
      line-height: ${typeScale.body2.lineHeight}px;
      font-weight: ${fontWeight.medium};
      text-decoration: none;
      cursor: pointer;
      box-sizing: border-box;
      font-family: inherit;
    }
    .nds-brand-geniet__mo-user {
      all: unset;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      color: ${cv.iconRole.normal};
      cursor: pointer;
    }
    .nds-brand-geniet__mo-hamburger {
      all: unset;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      color: ${cv.iconRole.strong};
      cursor: pointer;
    }
    .nds-brand-geniet__mo-search {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1;
      height: 38px;
      border-radius: ${radius.md}px;
      background: ${cv.surface.subtle};
      padding: 0 ${spacing[40]}px 0 ${spacing[12]}px;
      box-sizing: border-box;
    }
    .nds-brand-geniet__mo-search input {
      all: unset;
      width: 100%;
      font-size: ${typeScale.body2.fontSize}px;
      line-height: ${typeScale.body2.lineHeight}px;
      color: ${cv.textRole.normal};
      font-family: inherit;
    }
    .nds-brand-geniet__mo-search input::placeholder {
      color: ${cv.textRole.muted};
    }
    .nds-brand-geniet__mo-search-icon {
      position: absolute;
      right: ${spacing[12]}px;
      top: 50%;
      transform: translateY(-50%);
      color: ${cv.iconRole.strong};
      display: flex;
      cursor: pointer;
    }
  `;

  if (surface === "mobile") {
    const logoImg = brand.mobileLogo ?? brand.logo;
    return `
      ${ensureStyle(styleId, css)}
      <header class="nds-brand-geniet nds-brand-geniet--mobile" data-slot="root">
        <div class="nds-brand-geniet__mo-row1">
          <a class="nds-brand-geniet__logo" href="/">${renderLogoImg(logoImg, assetBaseUrl)}</a>
          <div class="nds-brand-geniet__mo-right">
            <a class="nds-brand-geniet__point-chip" href="${escapeAttr(g.mobilePointHref)}" aria-label="포인트 ${escapeAttr(g.mobilePointAmount)}">
              <span style="display:inline-flex">${GENIET_ICONS.gpoint}</span>
              <span>${escapeHtml(g.mobilePointAmount)}</span>
            </a>
            <button type="button" class="nds-brand-geniet__mo-user" aria-label="사용자">${GENIET_ICONS.user}</button>
          </div>
        </div>
        <div class="nds-brand-geniet__mo-row2">
          <button type="button" class="nds-brand-geniet__mo-hamburger" aria-label="음식 카테고리">${GENIET_ICONS.menu}</button>
          <div class="nds-brand-geniet__mo-search">
            <input type="text" placeholder="${escapeAttr(g.mobileSearchPlaceholder)}" autocomplete="off" />
            <span class="nds-brand-geniet__mo-search-icon" role="button" aria-label="검색" style="width:20px;height:20px;">${GENIET_ICONS.search.replace('width="24" height="24"', 'width="20" height="20"')}</span>
          </div>
        </div>
      </header>
    `;
  }

  /* desktop */
  const trendingTop = g.trendingKeywords[0];
  const trendingHtml = trendingTop
    ? `<div class="nds-brand-geniet__trending">
         <span class="nds-brand-geniet__trending-rank">${trendingTop.rank}</span>
         <span class="nds-brand-geniet__trending-keyword">${escapeHtml(trendingTop.keyword)}</span>
         <span class="nds-brand-geniet__trending-stamp">${escapeHtml(g.trendingTimestamp)}</span>
       </div>`
    : "";

  const actionButtonsHtml = g.actionButtons
    .map((action) => {
      const icon = GENIET_ICONS[action.iconKey] ?? "";
      const divider = action.dividerBefore
        ? `<span class="nds-brand-geniet__action-divider" aria-hidden="true"></span>`
        : "";
      return `${divider}<a class="nds-brand-geniet__action-btn" href="${escapeAttr(action.href ?? "#")}">
        <span class="nds-brand-geniet__action-btn-icon">${icon}</span>
        <span class="nds-brand-geniet__action-btn-label">${escapeHtml(action.label)}</span>
      </a>`;
    })
    .join("");

  const gnbHtml = brand.webMenu
    .map(
      (item) =>
        `<a class="nds-brand-geniet__gnb-item" href="${escapeAttr(item.href)}" ${item.key === activeKey ? 'data-active="true"' : ""}>${escapeHtml(item.label)}</a>`,
    )
    .join("");

  const ctaHtml = g.ctaButtons
    .map((cta) => {
      const icon = cta.iconKey ? (GENIET_ICONS[cta.iconKey] ?? "") : "";
      return `<a class="nds-brand-geniet__cta-pill" data-tone="${cta.tone}" href="${escapeAttr(cta.href ?? "#")}">
        ${icon}<span>${escapeHtml(cta.label)}</span>
      </a>`;
    })
    .join("");

  return `
    ${ensureStyle(styleId, css)}
    <header class="nds-brand-geniet nds-brand-geniet--desktop" data-slot="root">
      <div class="nds-brand-geniet__search-header" data-slot="search-header">
        <a class="nds-brand-geniet__logo" href="/">${renderLogoImg(brand.logo, assetBaseUrl)}</a>
        <div class="nds-brand-geniet__search-frame">
          <div class="nds-brand-geniet__search-input">
            <input type="text" placeholder="${escapeAttr(g.searchPlaceholder)}" autocomplete="off" />
            <span class="nds-brand-geniet__search-icon" role="button" aria-label="검색">${GENIET_ICONS.search}</span>
          </div>
          ${trendingHtml}
        </div>
        <div class="nds-brand-geniet__login-area" data-slot="login-area">${actionButtonsHtml}</div>
      </div>
      <div class="nds-brand-geniet__menu-header-rail" data-slot="menu-header-rail">
        <nav class="nds-brand-geniet__menu-header" data-slot="menu-header">
          <a class="nds-brand-geniet__category" href="${escapeAttr(g.categoryHref)}">
            ${GENIET_ICONS.menu}<span>${escapeHtml(g.categoryLabel)}</span>
          </a>
          <div class="nds-brand-geniet__gnb">${gnbHtml}</div>
          <div class="nds-brand-geniet__cta-group">${ctaHtml}</div>
        </nav>
      </div>
    </header>
  `;
}

/* ──────────────── Brand: Trost ──────────────── */
/* React: TrostWebHeader (= TrostDesktopHeader) — sticky compound:
 *   1) EAP Banner (50h, light blue)
 *   2) Utility Header (logo + search form + login + app download button)
 *   3) Tab Navigation (70h, tabs with active underline)
 *
 * 호스트 앱이 슬롯 컴포넌트 (TrostEAPBanner / TrostUtilityHeader / TrostTabNavigation) 를
 * 직접 주입하는 React 패턴을, HTML 에서는 BRAND_DATA 의 trost 필드를 사용해 1:1 재현. */

function renderTrostHeader(
  brand: BrandChrome,
  surface: HeaderSurface,
  _activeKey: string,
  assetBaseUrl: string,
): string {
  const t = brand.trost;
  if (!t) return "";

  if (surface === "webview") {
    return renderWebviewHeader(brand.mobileTitle);
  }

  if (surface === "mobile") {
    const logoImg = brand.mobileLogo ?? brand.logo;
    /* logo 가 좌측에 떨어지므로 별도 header-title 은 제거 (둘 다 노출되면 중복). */
    return `
      <nds-header variant="compact">
        <nds-header-logo slot="left" href="/">${renderLogoImg(logoImg, assetBaseUrl)}</nds-header-logo>
        <nds-header-actions slot="right">
          <nds-header-auth-button label="${escapeAttr(brand.authLabel ?? "로그인")}"></nds-header-auth-button>
        </nds-header-actions>
      </nds-header>
    `;
  }

  /* desktop — EAP Banner + Utility + Tab Navigation */
  const styleId = "nds-brand-chrome-trost-web";
  const css = `
    /* ── Trost Web header (3-tier) ── */
    .nds-brand-trost-web {
      display: block;
      width: 100%;
      background: #fff;
      box-sizing: border-box;
    }

    /* EAP Banner (50h) — light blue strip with CTA */
    .nds-brand-trost-web__banner {
      width: 100%;
      height: 50px;
      background: #d5eafb;
      display: flex;
      justify-content: center;
      align-items: center;
      text-decoration: none;
      color: inherit;
    }
    .nds-brand-trost-web__banner-text {
      margin-right: 20px;
      font-size: 16px;
      line-height: 1.5;
      color: #333;
      font-weight: 400;
    }
    .nds-brand-trost-web__banner-text > strong { font-weight: 700; }
    .nds-brand-trost-web__banner-cta {
      display: inline-flex;
      align-items: center;
      height: 34px;
      background: #eaf5fd;
      border-radius: 8px;
      padding: 0 11px;
      text-decoration: none;
      box-sizing: border-box;
    }
    .nds-brand-trost-web__banner-cta-label {
      font-size: 14px;
      font-weight: 700;
      line-height: 1.43;
      color: #333;
    }
    .nds-brand-trost-web__banner-cta-label > span {
      color: #ff7a00;
    }

    /* Utility Header (logo + search + login + app download) */
    .nds-brand-trost-web__utility {
      width: 100%;
      padding: 20px 0;
      border-bottom: 1px solid #ececec;
      background: #fff;
    }
    .nds-brand-trost-web__utility-inner {
      max-width: ${t.pcMaxWidth}px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 114px;
    }
    .nds-brand-trost-web__utility-left {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .nds-brand-trost-web__utility-logo {
      width: 140px;
      height: 36px;
      padding-right: 50px;
      display: inline-flex;
      align-items: center;
      text-decoration: none;
    }
    .nds-brand-trost-web__utility-right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-grow: 1;
      flex-shrink: 0;
    }

    /* Trost search input — yellow border, pill */
    .nds-brand-trost-web__search {
      position: relative;
    }
    .nds-brand-trost-web__search input {
      width: ${t.searchInputWidth}px;
      height: 48px;
      border: 2px solid #ffcc00;
      outline: none;
      border-radius: 9999px;
      padding: 13px 36px 13px 20px;
      font-size: 15px;
      line-height: 1.47;
      color: #333;
      font-weight: 400;
      box-sizing: border-box;
      font-family: inherit;
    }
    .nds-brand-trost-web__search input::placeholder {
      color: #333;
      font-weight: 400;
    }
    .nds-brand-trost-web__search-submit {
      position: absolute;
      right: 16px;
      top: 14px;
      cursor: pointer;
      background: transparent;
      border: 0;
      padding: 0;
    }

    /* Login section — two text buttons */
    .nds-brand-trost-web__login {
      display: inline-flex;
      align-items: center;
    }
    .nds-brand-trost-web__login-btn {
      margin-right: 20px;
      font-size: 16px;
      line-height: 24px;
      color: #000;
      font-weight: 700;
      cursor: pointer;
      background: transparent;
      border: 0;
      padding: 0;
      font-family: inherit;
    }
    .nds-brand-trost-web__login-btn--partner { margin-right: 32px; }

    /* App download button */
    .nds-brand-trost-web__app-dl {
      height: 44px;
      padding: 11px 16px;
      border-radius: 12px;
      border: 1px solid #d8d8d8;
      background: #fff;
      font-size: 15px;
      line-height: 22px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      font-weight: 400;
      font-family: inherit;
    }

    /* Tab Navigation (70h) */
    .nds-brand-trost-web__tabnav {
      width: 100%;
      height: 70px;
      border-bottom: 1px solid #ececec;
      background: #fff;
    }
    .nds-brand-trost-web__tabnav-inner {
      max-width: ${t.pcMaxWidth}px;
      height: 100%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
    }
    .nds-brand-trost-web__tabnav-list {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 24px;
      margin: 0;
      padding: 0;
      list-style: none;
      height: 100%;
    }
    .nds-brand-trost-web__tabnav-link {
      height: 100%;
      display: flex;
      align-items: center;
      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;
      font-size: 17px;
      font-weight: 700;
      line-height: 1.53;
      color: #777;
      white-space: nowrap;
      text-decoration: none;
    }
    .nds-brand-trost-web__tabnav-link[data-active="true"] {
      color: #000;
      border-bottom-color: #000;
    }
    .nds-brand-trost-web__tabnav-new {
      display: inline-flex;
      margin-left: 4px;
      padding: 0 6px;
      height: 18px;
      background: #ff7a00;
      color: #fff;
      font-size: 11px;
      line-height: 18px;
      font-weight: 700;
      border-radius: 4px;
      align-items: center;
    }
  `;

  const tabsHtml = t.tabs
    .map(
      (tab) =>
        `<li><a class="nds-brand-trost-web__tabnav-link" href="${escapeAttr(tab.href)}" ${tab.href === t.activeTab ? 'data-active="true"' : ""}>${escapeHtml(tab.name)}${tab.isNew ? `<span class="nds-brand-trost-web__tabnav-new">N</span>` : ""}</a></li>`,
    )
    .join("");

  return `
    ${ensureStyle(styleId, css)}
    <header class="nds-brand-trost-web" data-slot="root">
      <a class="nds-brand-trost-web__banner" href="${escapeAttr(t.bannerHref)}" target="_blank" rel="noreferrer">
        <p class="nds-brand-trost-web__banner-text"><strong>${escapeHtml(t.bannerStrong)}</strong>${escapeHtml(t.bannerText)}</p>
        <span class="nds-brand-trost-web__banner-cta">
          <p class="nds-brand-trost-web__banner-cta-label">${escapeHtml(t.bannerCtaPrefix)}<span>${escapeHtml(t.bannerCtaAccent)}</span>${escapeHtml(t.bannerCtaSuffix)}</p>
        </span>
      </a>
      <section class="nds-brand-trost-web__utility">
        <div class="nds-brand-trost-web__utility-inner">
          <div class="nds-brand-trost-web__utility-left">
            <a class="nds-brand-trost-web__utility-logo" href="/" aria-label="Trost">${renderLogoImg(brand.logo, assetBaseUrl)}</a>
            <form class="nds-brand-trost-web__search" onsubmit="return false">
              <input type="text" placeholder="${escapeAttr(t.searchPlaceholder)}" autocomplete="off" />
              <button type="submit" class="nds-brand-trost-web__search-submit" aria-label="검색" style="color:#333">${TROST_ICONS.search}</button>
            </form>
          </div>
          <div class="nds-brand-trost-web__utility-right">
            <div class="nds-brand-trost-web__login">
              <button type="button" class="nds-brand-trost-web__login-btn">${escapeHtml(brand.authLabel ?? "로그인")}</button>
              ${t.partnerSignupLabel ? `<button type="button" class="nds-brand-trost-web__login-btn nds-brand-trost-web__login-btn--partner">${escapeHtml(t.partnerSignupLabel)}</button>` : ""}
            </div>
            <button type="button" class="nds-brand-trost-web__app-dl">${escapeHtml(t.appDownloadLabel)}</button>
          </div>
        </div>
      </section>
      <nav class="nds-brand-trost-web__tabnav">
        <div class="nds-brand-trost-web__tabnav-inner">
          <ul class="nds-brand-trost-web__tabnav-list">${tabsHtml}</ul>
        </div>
      </nav>
    </header>
  `;
}

/* ──────────────── Brand: Cashpobi ──────────────── */
/* React: CashpobiWebHeader — 1단 헤더 + yellow primary CTA pill. */

function renderCashpobiHeader(
  brand: BrandChrome,
  surface: HeaderSurface,
  activeKey: string,
  assetBaseUrl: string,
): string {
  const c = brand.cashpobi;

  if (surface === "webview") {
    return renderWebviewHeader(brand.mobileTitle);
  }

  const styleId = "nds-brand-chrome-cashpobi";
  const css = `
    .nds-brand-cashpobi {
      display: block;
      width: 100%;
      background: ${cv.surface.default};
      border-bottom: 1px solid ${cv.borderRole.subtle};
      box-sizing: border-box;
    }
    .nds-brand-cashpobi__inner {
      max-width: ${brand.maxWidth}px;
      margin: 0 auto;
      height: 64px;
      display: flex;
      align-items: center;
      gap: ${spacing[16]}px;
      padding: 0 60px;
      box-sizing: border-box;
    }
    .nds-brand-cashpobi__inner--mobile {
      height: ${c?.mobileHeight ?? 56}px;
      padding: 0 ${spacing[16]}px;
      justify-content: space-between;
    }
    .nds-brand-cashpobi__logo {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      text-decoration: none;
    }
    .nds-brand-cashpobi__menu {
      display: flex;
      align-items: center;
      gap: ${spacing[8]}px;
      flex: 1;
      margin-left: ${spacing[24]}px;
    }
    .nds-brand-cashpobi__menu-item,
    .nds-brand-cashpobi__menu-item:visited,
    .nds-brand-cashpobi__menu-item:hover {
      display: inline-flex;
      align-items: center;
      height: 44px;
      padding: 0 ${spacing[12]}px;
      font-size: ${typeScale.body1.fontSize}px;
      line-height: ${typeScale.body1.lineHeight}px;
      font-weight: ${fontWeight.medium};
      color: ${cv.textRole.normal};
      text-decoration: none;
      border-radius: ${radius.sm}px;
    }
    .nds-brand-cashpobi__menu-item[data-active="true"] {
      color: ${cv.textRole.strong};
      font-weight: ${fontWeight.bold};
    }
    .nds-brand-cashpobi__actions {
      display: inline-flex;
      align-items: center;
      gap: ${spacing[16]}px;
      flex-shrink: 0;
    }
    .nds-brand-cashpobi__auth {
      display: inline-flex;
      align-items: center;
      height: 36px;
      padding: 0 ${spacing[8]}px;
      background: transparent;
      border: 0;
      color: ${cv.textRole.normal};
      font-size: ${typeScale.body1.fontSize}px;
      line-height: ${typeScale.body1.lineHeight}px;
      font-weight: ${fontWeight.bold};
      cursor: pointer;
      text-decoration: none;
      font-family: inherit;
    }
    .nds-brand-cashpobi__primary-cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 36px;
      padding: 0 12px;
      background: #ffd200;
      color: #333;
      font-family: inherit;
      font-weight: 700;
      font-size: 14px;
      line-height: 20px;
      border-radius: 8px;
      border: 0;
      cursor: pointer;
      text-decoration: none;
      white-space: nowrap;
      box-sizing: border-box;
    }
    .nds-brand-cashpobi__hamburger {
      all: unset;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      color: ${cv.iconRole.strong};
      cursor: pointer;
    }
  `;

  if (surface === "mobile") {
    const logoImg = brand.mobileLogo ?? brand.logo;
    return `
      ${ensureStyle(styleId, css)}
      <header class="nds-brand-cashpobi" data-slot="root">
        <div class="nds-brand-cashpobi__inner nds-brand-cashpobi__inner--mobile">
          <a class="nds-brand-cashpobi__logo" href="/">${renderLogoImg(logoImg, assetBaseUrl)}</a>
          <button type="button" class="nds-brand-cashpobi__hamburger" aria-label="메뉴">${TROST_ICONS.hamburger}</button>
        </div>
      </header>
    `;
  }

  const menuHtml = brand.webMenu
    .map(
      (item) =>
        `<a class="nds-brand-cashpobi__menu-item" href="${escapeAttr(item.href)}" ${item.key === activeKey ? 'data-active="true"' : ""}>${escapeHtml(item.label)}</a>`,
    )
    .join("");

  const ctaHtml = c?.primaryCta
    ? `<a class="nds-brand-cashpobi__primary-cta" href="${escapeAttr(c.primaryCta.href)}">${escapeHtml(c.primaryCta.label)}</a>`
    : "";

  return `
    ${ensureStyle(styleId, css)}
    <header class="nds-brand-cashpobi" data-slot="root">
      <div class="nds-brand-cashpobi__inner">
        <a class="nds-brand-cashpobi__logo" href="/">${renderLogoImg(brand.logo, assetBaseUrl)}</a>
        <nav class="nds-brand-cashpobi__menu">${menuHtml}</nav>
        <div class="nds-brand-cashpobi__actions">
          <a class="nds-brand-cashpobi__auth" href="#">${escapeHtml(brand.authLabel ?? "로그인")}</a>
          ${ctaHtml}
        </div>
      </div>
    </header>
  `;
}

/* ──────────────── Header dispatch ──────────────── */

function renderHeader(
  brandKey: BrandKey,
  surface: HeaderSurface,
  activeKey: string,
  assetBaseUrl: string,
): string {
  const brand = BRAND_DATA[brandKey];
  switch (brandKey) {
    case "geniet":
      return renderGenietHeader(brand, surface, activeKey, assetBaseUrl);
    case "trost":
      return renderTrostHeader(brand, surface, activeKey, assetBaseUrl);
    case "cashpobi":
      return renderCashpobiHeader(brand, surface, activeKey, assetBaseUrl);
    case "nudge-eap":
    default:
      return renderNudgeEAPHeader(brand, surface, activeKey, assetBaseUrl);
  }
}

/* ──────────────── Footer (unchanged baseline) ──────────────── */

function renderFooterLinks(links: FooterLink[]): string {
  return links
    .map(
      (link) =>
        `<a class="nds-footer__link" href="${escapeAttr(link.href)}" ${
          link.bold ? 'data-bold="true"' : ""
        }>${escapeHtml(link.label)}</a>`,
    )
    .join("");
}

/** Footer link / extra 색·밑줄 reset.
 *   styles.css 가 `.nds-footer[data-variant="info"] .nds-footer__link` 에만 색을 박고
 *   `data-variant="web"` 와 `nds-footer-info`(dark tone) 에는 색이 없어 a 가 브라우저
 *   default (파란 밑줄) 로 떨어지는 문제를 brand-chrome 자체 안에서 막는다. */
const FOOTER_LINK_RESET_ID = "nds-brand-chrome-footer-link-reset";
const FOOTER_LINK_RESET_CSS = `
  :where(nds-brand-footer) .nds-footer__link,
  :where(nds-brand-footer) .nds-footer__link:visited,
  :where(nds-brand-footer) .nds-footer__link:hover {
    color: var(--nds-footer-color, inherit);
    text-decoration: none;
  }
  :where(nds-brand-footer) .nds-footer__link[data-bold="true"] {
    font-weight: 700;
  }
  :where(nds-brand-footer) .nds-footer__links {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 16px;
    margin-bottom: 12px;
  }
  :where(nds-brand-footer) .nds-footer__extra {
    color: var(--nds-footer-extra-color, ${cv.textRole.muted});
    font-size: 13px;
    line-height: 1.5;
    margin-bottom: 12px;
  }
  /* nds-footer-company-info 는 logo-src 만 받고 width/height 를 안 박아 native 픽셀로
   * 렌더되는데, brand-logos 원본이 크면 footer 가 망가진다. 모든 brand 동일 톤 (height 32) 로 강제. */
  :where(nds-brand-footer) .nds-footer__company-logo {
    height: 32px;
    width: auto;
    max-height: 32px;
    max-width: 200px;
    object-fit: contain;
  }
`;

function renderFooter(
  brandKey: BrandKey,
  surface: FooterSurface,
  layout: string,
  assetBaseUrl: string,
): string {
  const brand = BRAND_DATA[brandKey];
  const company = escapeAttr(JSON.stringify(brand.company));
  const links = renderFooterLinks(brand.footerLinks);
  const extra = brand.extra
    ? `<div class="nds-footer__extra">${escapeHtml(brand.extra)}</div>`
    : "";
  const footerLogo = brand.footerLogo ?? brand.logo;
  const footerLogoSrc = resolveAssetUrl(assetBaseUrl, footerLogo.src);
  const linkReset = ensureStyle(FOOTER_LINK_RESET_ID, FOOTER_LINK_RESET_CSS);

  if (surface === "web") {
    return `
      ${linkReset}
      <nds-footer-web tone="${brand.footerTone}" max-width="${brand.maxWidth}">
        <nds-footer-web-row align="top">
          <nds-footer-web-section>
            <div class="nds-footer__links">${links}</div>
            ${extra}
            <nds-footer-company-info data="${company}"></nds-footer-company-info>
          </nds-footer-web-section>
          <nds-footer-web-section>
            ${renderLogoImg(footerLogo, assetBaseUrl)}
          </nds-footer-web-section>
        </nds-footer-web-row>
      </nds-footer-web>
    `;
  }

  const maxWrap =
    layout === "desktop"
      ? `style="max-width:${brand.maxWidth}px;margin:0 auto;"`
      : `style="max-width:100%;"`;
  const darkStyle =
    brand.footerTone === "dark"
      ? `style="--nds-footer-background:#464646;--nds-footer-company-color:#d8d8d8;--nds-footer-extra-color:#d8d8d8;--nds-footer-muted-color:#b0b0b0;"`
      : "";

  return `
    ${linkReset}
    <nds-footer-info ${darkStyle}>
      <div ${maxWrap}>
        <div class="nds-footer__links">${links}</div>
        ${extra}
        <nds-footer-company-info data="${company}" logo-src="${escapeAttr(footerLogoSrc)}"></nds-footer-company-info>
      </div>
    </nds-footer-info>
  `;
}

/* ──────────────── Elements ──────────────── */

export class NdsBrandHeader extends NdsElement {
  static elementName = "nds-brand-header";
  static brandFallback: BrandKey = "nudge-eap";

  static get observedAttributes(): readonly string[] {
    return ["brand", "surface", "active-key", "asset-base-url"];
  }

  protected update(): void {
    const brand = normalizeBrand(
      this.getAttribute("brand"),
      (this.constructor as typeof NdsBrandHeader).brandFallback,
    );
    const surface = normalizeSurface<HeaderSurface>(
      this.getAttribute("surface"),
      ["web", "mobile", "webview"],
      "web",
    );
    const activeKey = this.getAttribute("active-key") ?? "home";
    const assetBaseUrl = this.getAttribute("asset-base-url") ?? "/brand-logos";
    this.setAttribute("data-brand", brand);
    this.innerHTML = renderHeader(brand, surface, activeKey, assetBaseUrl);
  }
}

export class NdsBrandFooter extends NdsElement {
  static elementName = "nds-brand-footer";
  static brandFallback: BrandKey = "nudge-eap";

  static get observedAttributes(): readonly string[] {
    return ["brand", "surface", "layout", "asset-base-url"];
  }

  protected update(): void {
    const brand = normalizeBrand(
      this.getAttribute("brand"),
      (this.constructor as typeof NdsBrandFooter).brandFallback,
    );
    const brandDefaults = BRAND_DATA[brand];
    const surface = normalizeSurface<FooterSurface>(
      this.getAttribute("surface"),
      ["web", "app"],
      brandDefaults.footerSurface,
    );
    const layout = this.getAttribute("layout") ?? "desktop";
    const assetBaseUrl = this.getAttribute("asset-base-url") ?? "/brand-logos";
    this.setAttribute("data-brand", brand);
    this.innerHTML = renderFooter(brand, surface, layout, assetBaseUrl);
  }
}

function defineBrandAliases(brand: BrandKey): void {
  class BrandHeaderAlias extends NdsBrandHeader {
    static override elementName = `nds-${brand}-header`;
    static override brandFallback = brand;
  }
  class BrandFooterAlias extends NdsBrandFooter {
    static override elementName = `nds-${brand}-footer`;
    static override brandFallback = brand;
  }
  define(BrandHeaderAlias);
  define(BrandFooterAlias);
}

define(NdsBrandHeader);
define(NdsBrandFooter);
BRAND_KEYS.forEach(defineBrandAliases);
