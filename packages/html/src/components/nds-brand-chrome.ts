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
 * React 패키지의 brand chrome (Trost/Geniet/NudgeEAP/CashwalkBiz WebHeader / AppBar)
 * 과 시각적으로 동등한 HTML 을 직접 렌더한다. 단순 wrapper 가 아니라 brand 별
 * 풍부한 데이터를 들고 있으며, brand-specific 마크업/스타일을 inline 으로 inject.
 */

import { NdsElement, define } from "../base/nds-element.js";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
  zIndex,
} from "@nudge-design/tokens";
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
  CASHWALK_BIZ_LOGO_DATA_URI,
  RUNMILE_LOGO_DATA_URI,
  RUNMILE_LOGO_GRAY700_DATA_URI,
} from "./brand-logo-defaults.js";

/* ──────────────── Types ──────────────── */

type BrandKey = "nudge-eap" | "trost" | "geniet" | "cashwalk-biz" | "runmile";
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

interface BottomNavTab {
  key: string;
  label: string;
  href: string;
  /** BOTTOM_NAV_ICONS 키 (inactive). */
  icon: string;
  /** BOTTOM_NAV_ICONS 키 (active). Geniet 처럼 단일 그래픽 정책이면 icon 과 동일. */
  activeIcon: string;
}

interface BottomNavData {
  /**
   * split  = active/inactive 그래픽이 분리 (Trost/NudgeEAP/Runmile)
   * single = 단일 그래픽 + color cascade 로 active 표현 (Geniet)
   */
  iconPolicy: "split" | "single";
  /** nav-item active 색 — --nds-footer-nav-active-color 로 주입 (var() 포함 문자열). */
  activeColor: string;
  /** nav-item inactive 색 — --nds-footer-nav-inactive-color 로 주입. */
  inactiveColor: string;
  /** Runmile 은 12/16 라벨. 생략하면 토큰 default (11/14). */
  labelFontSize?: number;
  labelLineHeight?: number;
  tabs: BottomNavTab[];
}

/**
 * 브랜드 프로모/크로스셀 띠 배너 (desktop 헤더 상단). 브랜드 무관 — 내용은 데이터로
 * 주입하고 색은 `--nds-brand-banner-*` 슬롯으로 override (구 react TrostEAPBanner 의 후신).
 */
interface BannerData {
  /** 굵게 강조되는 도입부. */
  strong: string;
  /** strong 뒤 일반 텍스트. */
  text: string;
  /** CTA pill 라벨: prefix + accent(강조색) + suffix. 셋 다 없으면 CTA 생략. */
  ctaPrefix?: string;
  ctaAccent?: string;
  ctaSuffix?: string;
  /** 클릭 이동 (외부 링크 새 탭). */
  href: string;
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
    /** 모바일 rich 2단 헤더 (Storybook TrostWebviewHome) — 포인트 칩 금액 / row2 검색 placeholder. */
    mobilePointAmount: string;
    mobileSearchPlaceholder: string;
    /** webview surface 기본 타이틀 (sub level). */
    webviewTitle: string;
  };

  /** NudgeEAP 전용 — appDownload 버튼 옵션 */
  nudgeEap?: {
    appDownloadLabel: string;
    appDownloadHref: string;
  };

  /** CashwalkBiz 전용 — yellow primary CTA pill */
  "cashwalk-biz"?: {
    primaryCta: { label: string; href: string };
    mobileHeight: number;
  };

  /** Runmile 전용 — 중앙 coral 검색바 + 우측 채팅/로그인 액션 */
  runmile?: {
    searchPlaceholder: string;
    chatLabel: string;
    loginLabel: string;
  };

  /** 앱 하단 BottomNav 5탭. web 전용 brand (cashwalk-biz) 는 미설정. */
  bottomNav?: BottomNavData;

  /** 데스크탑 헤더 상단 프로모/크로스셀 띠 배너. 브랜드 무관, 토큰 override 가능. */
  banner?: BannerData;
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
      { key: "test", label: "심리검사", href: "/test" },
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
      { label: "고객센터", href: "/support" },
      { label: "개인정보 처리방침", href: "/privacy", bold: true },
      { label: "서비스 이용약관", href: "/terms" },
      { label: "위치기반 서비스 이용약관", href: "/location-terms" },
    ],
    company: {
      name: "주식회사 다인",
      ceo: "한상범",
      bizNumber: "101-86-16191",
      address: "서울특별시 강남구 역삼로1길 8, 5층 (역삼동, 넛지캠퍼스빌딩)",
      phone: "02-2268-5980",
      email: "support@nudgeeap.com",
      copyright: "Copyright 2024 Dain Co.Ltd. All Rights Reserved.",
    },
    extra: "powered by Cashwalk",
    nudgeEap: {
      appDownloadLabel: "앱 다운로드",
      appDownloadHref: "/download",
    },
    /* React NudgeEAPBottomNav (홈/챌린지/상담/멘탈케어/내 공간) — active/inactive 그래픽 분리. */
    bottomNav: {
      iconPolicy: "split",
      activeColor: "var(--semantic-text-strong-default, #383838)",
      inactiveColor: "var(--semantic-text-normal-default, #666666)",
      tabs: [
        { key: "home", label: "홈", href: "/", icon: "home", activeIcon: "home-active" },
        {
          key: "challenge",
          label: "챌린지",
          href: "/challenge",
          icon: "challenge",
          activeIcon: "challenge-active",
        },
        {
          key: "counsel",
          label: "상담",
          href: "/counsel",
          icon: "counsel",
          activeIcon: "counsel-active",
        },
        {
          key: "care",
          label: "멘탈케어",
          href: "/care",
          icon: "mentalcare",
          activeIcon: "mentalcare-active",
        },
        { key: "my", label: "내 공간", href: "/my", icon: "mypage", activeIcon: "mypage-active" },
      ],
    },
  },
  trost: {
    label: "Trost",
    /* 로고 self-contained data URI (geniet/nudge-eap 와 동일 정책). */
    logo: { src: TROST_LOGO_DATA_URI, alt: "Trost", width: 90, height: 36 },
    mobileLogo: { src: TROST_LOGO_MOBILE_DATA_URI, alt: "Trost", width: 80, height: 28 },
    maxWidth: 1080,
    /* renderTrostHeader 는 t.tabs 를 렌더 — webMenu 는 직접 안 읽지만 다른 소비자/일관성용으로
     * 실제 탭(Storybook SSOT)과 동기화해 stale 트랩 제거. */
    webMenu: [
      { key: "home", label: "홈", href: "/" },
      { key: "community", label: "커뮤니티", href: "/community" },
      { key: "quotes", label: "오늘의 명언/성경", href: "/quotes" },
      { key: "counsel", label: "전문 심리상담", href: "/counsel" },
      { key: "test", label: "심리검사", href: "/test" },
      { key: "medicine", label: "약물치료", href: "/medicine" },
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
    banner: {
      strong: "기업 전용 멘탈케어 프로그램",
      text: "을 도입하고 싶다면?",
      ctaPrefix: "지금 ",
      ctaAccent: "넛지EAP",
      ctaSuffix: " 이용해보기",
      href: "https://eapkorea.co.kr/",
    },
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
      mobilePointAmount: "123,990",
      mobileSearchPlaceholder: "심리검사, 상담, 마음챙김을 검색해보세요.",
      webviewTitle: "타이틀",
    },
    /* React TrostBottomNav (홈/심리상담/커뮤니티/멘탈케어/내공간) — active 색은 브랜드
     * 옐로가 아니라 icon-strong (#333). active/inactive 그래픽 분리. */
    bottomNav: {
      iconPolicy: "split",
      activeColor: "var(--semantic-icon-strong-default, #333333)",
      inactiveColor: "var(--semantic-icon-normal-default, #606060)",
      tabs: [
        { key: "home", label: "홈", href: "/", icon: "home", activeIcon: "home-active" },
        {
          key: "counsel",
          label: "심리상담",
          href: "/counsel",
          icon: "trost-counsel",
          activeIcon: "trost-counsel-active",
        },
        {
          key: "community",
          label: "커뮤니티",
          href: "/community",
          icon: "trost-community",
          activeIcon: "trost-community-active",
        },
        {
          key: "care",
          label: "멘탈케어",
          href: "/care",
          icon: "mentalcare",
          activeIcon: "mentalcare-active",
        },
        { key: "my", label: "내공간", href: "/my", icon: "mypage", activeIcon: "mypage-active" },
      ],
    },
  },
  geniet: {
    label: "Geniet",
    /* 로고 src 는 base64 data URI 로 self-contained — 외부 소비자가 별도 asset
     * hosting 을 안 해도 어떤 환경에서든 깨지지 않고 렌더된다. asset-base-url 을
     * 주면 resolveAssetUrl 이 data: 는 그대로 통과시키므로 override 도 안전. */
    logo: { src: GENIET_LOGO_PC_DATA_URI, alt: "Geniet", width: 165, height: 54 },
    mobileLogo: { src: GENIET_LOGO_MOBILE_DATA_URI, alt: "Geniet", width: 97, height: 32 },
    footerLogo: { src: GENIET_LOGO_FOOTER_DATA_URI, alt: "Geniet", width: 166, height: 48 },
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
      address: "서울시 강남구 테헤란로20길 18, 6층(역삼동, 부봉빌딩)",
      email: "geniet_app@geniet.co.kr",
      copyright: "Copyright 2024 by Geniet, Inc. ALL Rights Reserved",
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
    /* React GenietBottomNav (홈/기록/혜택/리뷰/커뮤니티) — 단일 그래픽 + color cascade.
     * active = mint600, inactive = gray500. icon == activeIcon. */
    bottomNav: {
      iconPolicy: "single",
      activeColor: "var(--semantic-text-brand-default, #00A8AC)",
      inactiveColor: "var(--semantic-text-muted-default, #999999)",
      tabs: [
        { key: "home", label: "홈", href: "/", icon: "geniet-home", activeIcon: "geniet-home" },
        {
          key: "record",
          label: "기록",
          href: "/record",
          icon: "geniet-record",
          activeIcon: "geniet-record",
        },
        {
          key: "benefit",
          label: "혜택",
          href: "/benefit",
          icon: "geniet-benefit",
          activeIcon: "geniet-benefit",
        },
        {
          key: "review",
          label: "리뷰",
          href: "/reviews",
          icon: "geniet-review",
          activeIcon: "geniet-review",
        },
        {
          key: "community",
          label: "커뮤니티",
          href: "/community",
          icon: "geniet-community",
          activeIcon: "geniet-community",
        },
      ],
    },
  },
  "cashwalk-biz": {
    label: "CashwalkBiz",
    /* 로고 self-contained data URI (geniet/trost/nudge-eap 와 동일 정책).
     * 데스크탑/모바일 동일 로고 — 크기만 다르게. */
    logo: {
      src: CASHWALK_BIZ_LOGO_DATA_URI,
      alt: "Cashwalk for Business",
      width: 107,
      height: 32,
    },
    /* React CashwalkBizWebHeader mobile 은 로고를 ≤74×22 로 clamp — Storybook 렌더와 맞춤. */
    mobileLogo: {
      src: CASHWALK_BIZ_LOGO_DATA_URI,
      alt: "Cashwalk for Business",
      width: 74,
      height: 22,
    },
    maxWidth: 1600,
    /* Figma 98:1082 (한국 캐시워크 WEB Dev) — 마케팅 GNB 5탭, 광고 활성. Storybook SSOT. */
    webMenu: [
      { key: "channel", label: "채널", href: "/channel" },
      { key: "ad", label: "광고", href: "/ad" },
      { key: "case", label: "성공사례", href: "/case" },
      { key: "notice", label: "공지사항", href: "/notice" },
      { key: "guide", label: "이용방법", href: "/guide" },
    ],
    mobileTitle: "CashwalkBiz",
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
    "cashwalk-biz": {
      primaryCta: { label: "광고 시작하기", href: "/start" },
      mobileHeight: 56,
    },
  },
  runmile: {
    label: "Runmile",
    /* Runmile 로고 = @nudge-design/assets base64 data URI (Storybook 과 동일, self-contained).
     * 헤더/모바일 = coral default(BRAND_LOGOS.runmile.default), footer = muted gray700
     * (BRAND_LOGOS.runmile.muted). 외부 호스팅 없이도 깨지지 않게 inline. */
    logo: { src: RUNMILE_LOGO_DATA_URI, alt: "Runmile", width: 142, height: 32 },
    mobileLogo: { src: RUNMILE_LOGO_DATA_URI, alt: "Runmile", width: 100, height: 23 },
    footerLogo: { src: RUNMILE_LOGO_GRAY700_DATA_URI, alt: "Runmile", width: 142, height: 32 },
    maxWidth: 1440,
    webMenu: [
      { key: "race", label: "대회 정보", href: "/race" },
      { key: "community", label: "커뮤니티", href: "/community" },
    ],
    mobileTitle: "Runmile",
    authLabel: "로그인",
    footerTone: "light",
    footerSurface: "app",
    footerLinks: [
      { label: "이용약관", href: "#" },
      { label: "개인정보처리방침", href: "#", bold: true },
    ],
    company: {
      name: "㈜넛지헬스케어주식회사",
      ceo: "송승근, 박정신",
      bizNumber: "849-88-00418",
      address: "서울특별시 강남구 역삼로1길8 넛지캠퍼스 빌딩",
      copyright: "Copyright Runmile. All Rights Reserved.",
    },
    runmile: {
      searchPlaceholder: "궁금한 대회정보를 검색해 보세요",
      chatLabel: "채팅",
      loginLabel: "로그인",
    },
    /* React RunmileBottomNav (홈/대회정보/커뮤니티/채팅/마이페이지 — Figma 1221:64046).
     * active/inactive 그래픽 분리, 라벨은 12/16 (Figma 실측). */
    bottomNav: {
      iconPolicy: "split",
      activeColor: "var(--semantic-icon-strong-default, #221E1F)",
      inactiveColor: "var(--semantic-text-muted-default, #919CAA)",
      labelFontSize: 12,
      labelLineHeight: 16,
      tabs: [
        {
          key: "home",
          label: "홈",
          href: "/",
          icon: "runmile-home",
          activeIcon: "runmile-home-active",
        },
        {
          key: "race",
          label: "대회정보",
          href: "/race",
          icon: "runmile-challenge",
          activeIcon: "runmile-challenge-active",
        },
        {
          key: "community",
          label: "커뮤니티",
          href: "/community",
          icon: "runmile-people",
          activeIcon: "runmile-people-active",
        },
        {
          key: "chat",
          label: "채팅",
          href: "/chat",
          icon: "runmile-chats",
          activeIcon: "runmile-chats-active",
        },
        {
          key: "my",
          label: "마이페이지",
          href: "/my",
          icon: "runmile-account",
          activeIcon: "runmile-account-active",
        },
      ],
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

/* 브랜드 무관 프로모/크로스셀 띠 배너 (desktop 헤더 상단).
 * 색은 `--nds-brand-banner-*` 슬롯 — default 는 현행 EAP 크로스셀 띠 값. 다른 브랜드는
 * 데이터(banner)만 주입하고 필요 시 슬롯만 override (컴포넌트에 브랜드 분기 없음). */
const BRAND_BANNER_CSS = `
    .nds-brand-banner {
      width: 100%;
      height: var(--nds-brand-banner-height, 50px);
      background: var(--nds-brand-banner-bg, #d5eafb);
      display: flex;
      justify-content: center;
      align-items: center;
      text-decoration: none;
      color: inherit;
    }
    .nds-brand-banner__text {
      margin-right: 20px;
      font-size: 16px;
      line-height: 1.5;
      color: var(--nds-brand-banner-text-color, #333);
      font-weight: 400;
    }
    .nds-brand-banner__text > strong { font-weight: 700; }
    .nds-brand-banner__cta {
      display: inline-flex;
      align-items: center;
      height: 34px;
      background: var(--nds-brand-banner-cta-bg, #eaf5fd);
      border-radius: 8px;
      padding: 0 11px;
      text-decoration: none;
      box-sizing: border-box;
    }
    .nds-brand-banner__cta-label {
      font-size: 14px;
      font-weight: 700;
      line-height: 1.43;
      color: var(--nds-brand-banner-cta-color, #333);
    }
    .nds-brand-banner__cta-label > span {
      color: var(--nds-brand-banner-accent, #ff7a00);
    }
`;

/** 브랜드 데이터의 banner 를 띠 배너 HTML 로 렌더 — desktop 헤더 첫 자식으로 삽입. */
function renderBrandBanner(banner: BannerData): string {
  const hasCta = !!(banner.ctaPrefix || banner.ctaAccent || banner.ctaSuffix);
  const cta = hasCta
    ? `<span class="nds-brand-banner__cta"><p class="nds-brand-banner__cta-label">${escapeHtml(banner.ctaPrefix ?? "")}${banner.ctaAccent ? `<span>${escapeHtml(banner.ctaAccent)}</span>` : ""}${escapeHtml(banner.ctaSuffix ?? "")}</p></span>`
    : "";
  return `${ensureStyle("nds-brand-banner", BRAND_BANNER_CSS)}<a class="nds-brand-banner" href="${escapeAttr(banner.href)}" target="_blank" rel="noreferrer"><p class="nds-brand-banner__text"><strong>${escapeHtml(banner.strong)}</strong>${escapeHtml(banner.text)}</p>${cta}</a>`;
}

/** Shared webview header — 좌측 < 버튼 + 중앙 title.
 *   styles.css 의 `.nds-header[data-variant="webview"] .nds-header__title` 은
 *   position: absolute · left:50% · translateX(-50%) 만 잡고 vertical center 가 빠져
 *   글자가 위 baseline 에 붙는다. brand-chrome 안에서 한 번만 vertical center override. */
const WEBVIEW_FIX_ID = "nds-brand-chrome-webview-fix";
const WEBVIEW_FIX_CSS = `
  /* base styles.css 의 .nds-header[data-variant="webview"] .nds-header__title (특정성 0,3,0)가
   * transform: translateX(-50%) 를 박아, :where(특정성 0) override 의 세로 translate(-50%) 가
   * 무력화돼 타이틀이 top:50% 에만 걸려 아래로 떨어진다. nds-brand-header 엘리먼트 셀렉터로
   * 특정성(0,3,1)을 올려 vertical center 가 이기게 한다. */
  nds-brand-header .nds-header[data-variant="webview"] .nds-header__title {
    top: 50%;
    transform: translate(-50%, -50%);
  }
  nds-brand-header .nds-header[data-variant="webview"] {
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

/* Trost mobile/webview chrome 아이콘 — packages/icons/src/{mono,multicolor}/Trost*.tsx 1:1 복제.
 * coin 은 multicolor (고정색 #333 disc / #FFF42E bolt), 나머지는 currentColor. React AppBar 와 동일 그래픽. */
const TROST_CHROME_ICONS = {
  coin: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="scale(1.2 1.2)"><circle cx="10" cy="10" r="9.167" fill="#333"/><path d="M9.27 4.543c.523-1.014 2.063-.495 1.866.629L10.63 8.06h2.28c.745 0 1.226.789.884 1.452l-3.063 5.945c-.523 1.014-2.063.495-1.866-.629l.506-2.888H7.09a.996.996 0 0 1-.885-1.452L9.27 4.543z" fill="#FFF42E"/></g></svg>`,
  bell: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(3 1.75)"><path d="M9 1.33955C13.4586 1.33955 17.0967 4.61117 17.0967 8.67647V13.904C17.6492 14.2799 18 14.8988 18 15.5837L17.9893 15.7937C17.8873 16.7605 17.0893 17.5293 16.0859 17.6276L15.8672 17.6384H12.6436C12.2445 19.2806 10.7649 20.4997 9 20.4997C7.23506 20.4997 5.75545 19.2806 5.35645 17.6384H2.13281L1.91406 17.6276C0.910673 17.5293 0.112746 16.7605 0.0107422 15.7937L0 15.5837C0 14.8988 0.350759 14.2799 0.90332 13.904V8.67647C0.90332 4.61117 4.54135 1.33955 9 1.33955ZM6.93262 17.6384C7.27718 18.4392 8.07293 18.9997 9 18.9997C9.92707 18.9997 10.7228 18.4392 11.0674 17.6384H6.93262ZM9 2.83955C5.22381 2.83955 2.40332 5.57839 2.40332 8.67647V14.698L1.74707 15.1442C1.58085 15.2573 1.5 15.424 1.5 15.5837C1.50022 15.8379 1.73063 16.1384 2.13281 16.1384H15.8672C16.2694 16.1384 16.4998 15.8379 16.5 15.5837C16.5 15.4239 16.4191 15.2573 16.2529 15.1442L15.5967 14.698V8.67647C15.5967 5.57839 12.7762 2.83955 9 2.83955Z" fill="currentColor"/><path d="M9 0.75L9 1.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></g></svg>`,
  search: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(2.64 2.29)"><path d="M2.91998 2.91992C5.81366 0.0262501 10.5057 0.0264718 13.3995 2.91992C16.2933 5.81371 16.2933 10.5056 13.3995 13.3994C10.5057 16.2932 5.81377 16.2932 2.91998 13.3994C0.0265265 10.5056 0.0263055 5.8136 2.91998 2.91992Z" stroke="currentColor" stroke-width="1.5"/><path d="M13.4612 14.16L17.9612 18.66" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></g></svg>`,
  back: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 5.25L7.5 12L15 18.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

/* Runmile icons — currentColor stroke glyphs (chat / login / search).
 * React WebHeader 는 @nudge-design/icons 의 RunmileChatting/Login/Search 를 쓰지만,
 * HTML 패키지는 다른 brand (TROST/GENIET) 와 동일하게 inline SVG 로 self-contained
 * 하게 들고 간다. 구조 / 사이즈 (28 액션, 24 검색) / currentColor 만 정확하면 됨. */
const RUNMILE_ICONS = {
  chat: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5.5h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 14.5h6a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2v2l-3-2h-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  login: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3.5H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 12h8M19 9l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  search: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
};

/* BottomNav 아이콘 — packages/icons/svg/mono/*.svg 1:1 복제 (currentColor / 24×24).
 * React 의 brand BottomNav (TrostBottomNav/GenietBottomNav/NudgeEAPBottomNav/RunmileBottomNav)
 * 이 @nudge-design/icons 로 쓰는 것과 동일한 그래픽을, HTML 패키지는 다른 brand chrome 과
 * 동일하게 inline SVG 로 self-contained 하게 들고 간다. nav-item 의 color 를 currentColor 로
 * 따라가므로 active/inactive 색은 cascade 변수 (--nds-footer-nav-*-color) 가 결정한다.
 * ⚠️ url(#…) 참조가 있는 SVG (counsel mask / geniet-review clipPath) 는 다중 인라인 시
 *    id 충돌을 피하려고 id 를 유니크 prefix (nds-bn-*) 로 바꿔 박았다. */
const BOTTOM_NAV_ICONS: Record<string, string> = {
  // ── 공용 (Trost / NudgeEAP) ──
  home: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(2 0.5)"><g><path d="M7.93359 3.3418C9.09145 2.24197 10.9085 2.24197 12.0664 3.3418L18.3779 9.33789C18.7753 9.71546 19 10.24 19 10.7881V18.5C19 19.6046 18.1046 20.5 17 20.5H3C1.89543 20.5 1 19.6046 1 18.5V10.7881C1 10.24 1.22474 9.71546 1.62207 9.33789L7.93359 3.3418Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10 13.5C11.6569 13.5 13 14.8431 13 16.5V20.5H7V16.5C7 14.8431 8.34315 13.5 10 13.5Z" stroke="currentColor" stroke-width="2"/></g></g></svg>`,
  "home-active": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(2 2.02)"><g><path d="M7.24512 1.09976C8.78891 -0.366587 11.2111 -0.366586 12.7549 1.09976L19.0664 7.09585C19.6625 7.66219 20 8.44843 20 9.27066V16.9826C20 18.6394 18.6569 19.9826 17 19.9826H14V14.9826C13.9998 12.7736 12.209 10.9826 10 10.9826C7.79097 10.9826 6.00018 12.7736 6 14.9826V19.9826H3C1.34315 19.9826 0 18.6394 0 16.9826V9.27066C4.95478e-05 8.44843 0.337502 7.66219 0.933594 7.09585L7.24512 1.09976ZM10.1494 12.9884C11.1841 13.0649 11.9998 13.9284 12 14.9826V19.9826H8V14.9826C8.00018 13.8782 8.89554 12.9826 10 12.9826L10.1494 12.9884Z" fill="currentColor"/></g></g></svg>`,
  mentalcare: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M2 9.50001C2.00002 8.38721 2.33759 7.30059 2.96813 6.38367C3.59867 5.46675 4.49252 4.76267 5.53161 4.36441C6.5707 3.96615 7.70616 3.89245 8.78801 4.15305C9.86987 4.41365 10.8472 4.99629 11.591 5.82401C11.6434 5.88002 11.7067 5.92468 11.7771 5.95521C11.8474 5.98574 11.9233 6.00149 12 6.00149C12.0767 6.00149 12.1526 5.98574 12.2229 5.95521C12.2933 5.92468 12.3566 5.88002 12.409 5.82401C13.1504 4.99091 14.128 4.40338 15.2116 4.13961C16.2952 3.87585 17.4335 3.94836 18.4749 4.34749C19.5163 4.74663 20.4114 5.45346 21.0411 6.37391C21.6708 7.29436 22.0053 8.38477 22 9.50001C22 11.79 20.7 14 19.2 15.5C17.7 17 13.7062 20.1463 13.508 20.313C13.3098 20.4797 13.0919 20.6989 12.834 20.8173C12.5762 20.9357 12.296 20.9979 12.0123 20.9997C11.7285 21.0015 11.4476 20.9428 11.1883 20.8277C10.9289 20.7126 10.7526 20.5247 10.508 20.332C10.2634 20.1393 6.3 17 4.8 15.5C3.3 14 2 11.8 2 9.50001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 11.7795H17.199C16.369 11.7795 15.954 11.7795 15.61 11.9745C15.266 12.1685 15.053 12.5245 14.626 13.2355L14.596 13.2875C14.198 13.9505 13.999 14.2815 13.71 14.2765C13.421 14.2715 13.234 13.9325 12.861 13.2545L11.174 10.1875C10.827 9.55548 10.654 9.23948 10.376 9.22448C10.099 9.20948 9.892 9.50448 9.479 10.0945L9.196 10.4995C8.756 11.1265 8.537 11.4395 8.212 11.6095C7.886 11.7795 7.503 11.7795 6.738 11.7795H6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></g></svg>`,
  "mentalcare-active": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M14.9756 3.16812C16.2564 2.85644 17.6021 2.94149 18.833 3.41323C20.0638 3.88501 21.1218 4.72093 21.8662 5.80874C22.6097 6.89555 23.0053 8.18342 23 9.50015L22.9961 9.74722C22.9076 12.2999 21.4664 14.6479 19.9072 16.2072C19.1172 16.9972 17.7059 18.1887 16.501 19.1789C15.8919 19.6793 15.3238 20.1375 14.8965 20.4806C14.683 20.6521 14.5039 20.7959 14.373 20.9005C14.3075 20.953 14.2543 20.9958 14.2148 21.0275C14.1955 21.0431 14.1796 21.0552 14.168 21.0646C14.1575 21.0731 14.1523 21.0774 14.1514 21.0783C14.056 21.1585 13.6709 21.5329 13.251 21.7257C12.8642 21.9032 12.4441 21.9965 12.0186 21.9992C11.593 22.0019 11.1712 21.914 10.7822 21.7414C10.5429 21.6351 10.3582 21.5011 10.2188 21.3898C10.1517 21.3362 10.0858 21.2803 10.0352 21.2375C9.98067 21.1914 9.93552 21.1535 9.88965 21.1173C9.66295 20.9388 5.64435 17.7587 4.09277 16.2072C2.53412 14.6485 1.09245 12.3099 1.00391 9.7482L1 9.50015C1.0001 8.18517 1.39944 6.90007 2.14453 5.81656C2.88968 4.73322 3.94606 3.90141 5.17383 3.43081C6.40178 2.9602 7.74397 2.87287 9.02246 3.18081C10.1435 3.45092 11.1697 4.01376 11.998 4.80777C12.8248 4.00834 13.8525 3.44148 14.9756 3.16812ZM10.3242 8.22378C9.8056 8.2347 9.45141 8.53494 9.25293 8.74429C9.0517 8.95664 8.84759 9.25289 8.66016 9.52066L8.65918 9.52163L8.37598 9.92691C8.1465 10.2539 8.01174 10.445 7.89746 10.5802C7.79624 10.7 7.75648 10.7184 7.74805 10.7228C7.7377 10.7282 7.6972 10.7483 7.54883 10.7619C7.37274 10.778 7.1385 10.7794 6.73828 10.7794H6C5.44776 10.7794 5.00008 11.2272 5 11.7794C5.00006 12.3317 5.44775 12.7794 6 12.7794H6.73828C7.10264 12.7794 7.44249 12.7804 7.73047 12.7541C8.0388 12.7258 8.35676 12.6621 8.6748 12.4962L8.67578 12.4953C8.9923 12.3296 9.2256 12.1069 9.4248 11.8712C9.61095 11.651 9.80515 11.3719 10.0146 11.0734L10.0156 11.0724L10.2979 10.6691L11.9844 13.7365C12.1547 14.0461 12.3362 14.3798 12.5215 14.6232C12.7115 14.8728 13.0825 15.2658 13.6924 15.2765C14.3005 15.287 14.6854 14.9097 14.8848 14.6671C15.0787 14.4312 15.2715 14.1045 15.4531 13.8019L15.458 13.7941L15.4619 13.7873L15.4834 13.7501C15.7069 13.3779 15.839 13.1602 15.9531 13.006C16.0543 12.8694 16.0948 12.8487 16.1016 12.8449L16.1035 12.8439C16.1124 12.8388 16.1534 12.8151 16.3193 12.799C16.5103 12.7804 16.7652 12.7794 17.1992 12.7794H18C18.5522 12.7794 18.9999 12.3317 19 11.7794C18.9999 11.2272 18.5522 10.7794 18 10.7794H17.1992C16.8034 10.7794 16.435 10.7786 16.125 10.8087C15.7942 10.841 15.4545 10.9141 15.1191 11.1037C14.7822 11.2937 14.5436 11.5483 14.3457 11.8156C14.1607 12.0655 13.9719 12.3822 13.7686 12.7209L13.7646 12.7277L13.7598 12.7355L13.7373 12.7726L12.0498 9.70523C11.8929 9.41935 11.7225 9.10302 11.5459 8.87027C11.3709 8.63976 11.0505 8.30228 10.5352 8.2355L10.4297 8.22573L10.3242 8.22378Z" fill="currentColor"/></g></svg>`,
  mypage: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.5 20.9994C20.5 16.5811 16.6944 12.9994 12 12.9994C7.30558 12.9994 3.5 16.5811 3.5 20.9994H20.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="6.5" r="3.5" stroke="currentColor" stroke-width="2"/></svg>`,
  "mypage-active": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.5 20.9994C20.5 16.5811 16.6944 12.9994 12 12.9994C7.30558 12.9994 3.5 16.5811 3.5 20.9994H20.5Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="6.5" r="4.5" fill="currentColor"/></svg>`,
  // ── Trost 전용 ──
  "trost-counsel": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1.46 1.86)"><path d="M15.9258 15.9514C15.5507 15.5763 15.34 15.0676 15.34 14.5372C15.34 14.0067 15.5507 13.498 15.9258 13.1229C16.3009 12.7479 16.8096 12.5372 17.34 12.5372C17.8704 12.5372 18.3792 12.7479 18.7542 13.1229C19.1293 13.498 19.34 14.0067 19.34 14.5372C19.34 15.0676 19.1293 15.5763 18.7542 15.9514C18.3792 16.3264 17.8704 16.5372 17.34 16.5372C16.8096 16.5372 16.3009 16.3264 15.9258 15.9514Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.34 19.5372C14.34 18.4372 15.24 17.5372 16.34 17.5372H18.34C19.44 17.5372 20.34 18.4372 20.34 19.5372" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"/><path d="M20.2608 9.41C20.2108 4.63 15.8508 0.75 10.5108 0.75C5.17077 0.75 0.750766 4.68 0.750766 9.5C0.750766 10.9005 1.11679 12.2611 1.82043 13.4898C1.98149 13.771 2.02066 14.1093 1.90267 14.4112L0.800766 17.23C0.700766 17.49 0.750766 17.78 0.930766 17.99C1.11077 18.2 1.39077 18.29 1.66077 18.23L5.65621 17.3349C5.87305 17.2864 6.09928 17.3129 6.30323 17.4011C7.59283 17.9591 8.95963 18.25 10.3008 18.25C10.3708 18.25 10.4408 18.25 10.5108 18.25C10.6408 18.25 10.7708 18.24 10.9008 18.23" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></g></svg>`,
  "trost-counsel-active": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1.46 1.86)"><path d="M15.9258 15.9514C15.5507 15.5763 15.34 15.0676 15.34 14.5372C15.34 14.0067 15.5507 13.498 15.9258 13.1229C16.3009 12.7479 16.8096 12.5372 17.34 12.5372C17.8704 12.5372 18.3792 12.7479 18.7542 13.1229C19.1293 13.498 19.34 14.0067 19.34 14.5372C19.34 15.0676 19.1293 15.5763 18.7542 15.9514C18.3792 16.3264 17.8704 16.5372 17.34 16.5372C16.8096 16.5372 16.3009 16.3264 15.9258 15.9514Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.34 19.5372C14.34 18.4372 15.24 17.5372 16.34 17.5372H18.34C19.44 17.5372 20.34 18.4372 20.34 19.5372" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"/><path d="M11.6652 16.3742C11.8336 16.1116 11.8985 15.794 11.8424 15.4871C11.7823 15.1581 11.7508 14.829 11.7508 14.5C11.7508 12.95 12.3808 11.46 13.4808 10.4C14.5408 9.34 15.7552 8.95967 17.2852 8.95967C18.2552 8.95967 18.9998 9.07711 19.8398 9.53711C19.8398 9.53711 20.0185 9.62755 20.1517 9.5506C20.2557 9.4905 20.2608 9.34786 20.2568 9.22781C20.0995 4.5318 15.7828 0.75 10.5108 0.75C5.17077 0.75 0.750766 4.68 0.750766 9.5C0.750766 10.9005 1.11679 12.2611 1.82043 13.4898C1.98149 13.771 2.02066 14.1093 1.90267 14.4112L0.800766 17.23C0.700766 17.49 0.750766 17.78 0.930766 17.99C1.11077 18.2 1.39077 18.29 1.66077 18.23L5.65621 17.3349C5.87305 17.2864 6.09928 17.3129 6.30323 17.4011C7.59283 17.9591 8.95963 18.25 10.3008 18.25C10.3708 18.25 10.4408 18.25 10.5108 18.25C10.7427 18.25 10.9324 18.0742 10.997 17.8515C11.1481 17.3302 11.3709 16.8332 11.6652 16.3742Z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/></g></svg>`,
  "trost-community": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="2" width="18" height="20" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M8 8H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 12H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 16H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  "trost-community-active": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 2C19.6569 2 21 3.34315 21 5V19C21 20.6569 19.6569 22 18 22H6C4.34315 22 3 20.6569 3 19V5C3 3.34315 4.34315 2 6 2H18ZM8 15.25C7.58579 15.25 7.25 15.5858 7.25 16C7.25 16.4142 7.58579 16.75 8 16.75H16C16.4142 16.75 16.75 16.4142 16.75 16C16.75 15.5858 16.4142 15.25 16 15.25H8ZM8 11.25C7.58579 11.25 7.25 11.5858 7.25 12C7.25 12.4142 7.58579 12.75 8 12.75H16C16.4142 12.75 16.75 12.4142 16.75 12C16.75 11.5858 16.4142 11.25 16 11.25H8ZM8 7.25C7.58579 7.25 7.25 7.58579 7.25 8C7.25 8.41421 7.58579 8.75 8 8.75H16C16.4142 8.75 16.75 8.41421 16.75 8C16.75 7.58579 16.4142 7.25 16 7.25H8Z" fill="currentColor"/></svg>`,
  // ── NudgeEAP 전용 ──
  challenge: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M7 3C7 2.44772 6.55228 2 6 2C5.44772 2 5 2.44772 5 3V21C5 21.5523 5.44772 22 6 22C6.55228 22 7 21.5523 7 21V3Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M6 4H18.0586C18.9435 4 19.6608 4.71734 19.6608 5.60222C19.6608 6.03448 19.4861 6.4484 19.1765 6.75L17.0885 8.78363C16.6928 9.16897 16.6845 9.80208 17.0698 10.1977C17.0759 10.204 17.0822 10.2102 17.0885 10.2164L19.1765 12.25C19.8104 12.8674 19.8238 13.8818 19.2064 14.5157C18.9048 14.8253 18.4908 15 18.0586 15H6V4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></g></svg>`,
  "challenge-active": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M7 3C7 2.44772 6.55228 2 6 2C5.44772 2 5 2.44772 5 3V21C5 21.5523 5.44772 22 6 22C6.55228 22 7 21.5523 7 21V3Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M6 4H18.0586C18.9435 4 19.6608 4.71734 19.6608 5.60222C19.6608 6.03448 19.4861 6.4484 19.1765 6.75L17.0885 8.78363C16.6928 9.16897 16.6845 9.80208 17.0698 10.1977C17.0759 10.204 17.0822 10.2102 17.0885 10.2164L19.1765 12.25C19.8104 12.8674 19.8238 13.8818 19.2064 14.5157C18.9048 14.8253 18.4908 15 18.0586 15H6V4Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></g></svg>`,
  counsel: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1.5 2.5)"><g><g><mask id="nds-bn-counsel-mask" fill="white"><path d="M10.5 0C16.299 0 21 3.80558 21 8.5C21 13.1944 16.299 17 10.5 17C9.68157 17 8.88566 16.9207 8.12109 16.7773L4.65332 18.457C3.65727 18.9391 2.50011 18.214 2.5 17.1074V14.002C0.941964 12.519 0 10.5993 0 8.5C0 3.80558 4.70101 0 10.5 0Z"/></mask><path d="M8.12109 16.7773L8.48979 14.8116C8.06919 14.7327 7.63438 14.7908 7.24924 14.9774L8.12109 16.7773ZM4.65332 18.457L5.52468 20.2572L5.52517 20.257L4.65332 18.457ZM2.5 17.1074H0.5V17.1076L2.5 17.1074ZM2.5 14.002H4.5C4.5 13.4544 4.2755 12.9308 3.87888 12.5533L2.5 14.002ZM10.5 0V2C15.6099 2 19 5.28422 19 8.5H21H23C23 2.32694 16.988 -2 10.5 -2V0ZM21 8.5H19C19 11.7158 15.6099 15 10.5 15V17V19C16.988 19 23 14.6731 23 8.5H21ZM10.5 17V15C9.81084 15 9.13838 14.9333 8.48979 14.8116L8.12109 16.7773L7.75239 18.7431C8.63293 18.9082 9.5523 19 10.5 19V17ZM8.12109 16.7773L7.24924 14.9774L3.78147 16.6571L4.65332 18.457L5.52517 20.257L8.99294 18.5773L8.12109 16.7773ZM4.65332 18.457L3.78196 16.6568C4.11345 16.4964 4.49996 16.7378 4.5 17.1072L2.5 17.1074L0.5 17.1076C0.500247 19.6903 3.2011 21.3819 5.52468 20.2572L4.65332 18.457ZM2.5 17.1074H4.5V14.002H2.5H0.5V17.1074H2.5ZM2.5 14.002L3.87888 12.5533C2.65399 11.3874 2 9.96992 2 8.5H0H-2C-2 11.2287 -0.770064 13.6506 1.12112 15.4506L2.5 14.002ZM0 8.5H2C2 5.28422 5.39007 2 10.5 2V0V-2C4.01195 -2 -2 2.32694 -2 8.5H0Z" fill="currentColor" mask="url(#nds-bn-counsel-mask)"/></g><g><path d="M7.7 8.71997C7.7 9.27127 7.25263 9.71756 6.7 9.71756C6.14737 9.71756 5.7 9.27127 5.7 8.71997C5.7 8.16867 6.14737 7.72238 6.7 7.72238C7.25263 7.72238 7.7 8.16867 7.7 8.71997Z" fill="currentColor"/><path d="M11.5 8.71997C11.5 9.27127 11.0526 9.71756 10.5 9.71756C9.94738 9.71756 9.5 9.27127 9.5 8.71997C9.5 8.16867 9.94738 7.72238 10.5 7.72238C11.0526 7.72238 11.5 8.16867 11.5 8.71997Z" fill="currentColor"/><path d="M15.3 8.71997C15.3 9.27127 14.8522 9.71756 14.3009 9.71756C13.7495 9.71756 13.3 9.27127 13.3 8.71997C13.3 8.16867 13.7478 7.72238 14.3009 7.72238C14.854 7.72238 15.3 8.16867 15.3 8.71997Z" fill="currentColor"/></g></g></g></svg>`,
  "counsel-active": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1.5 2.5)"><g><path d="M10.5 0C16.299 0 21 3.80558 21 8.5C21 13.1944 16.299 17 10.5 17C9.68157 17 8.88566 16.9207 8.12109 16.7773L4.65332 18.457C3.65727 18.9391 2.50011 18.214 2.5 17.1074V14.002C0.941964 12.519 0 10.5993 0 8.5C0 3.80558 4.70101 0 10.5 0ZM6.7002 7.72266C6.14764 7.72266 5.70033 8.16854 5.7002 8.71973C5.7002 9.27103 6.14756 9.71777 6.7002 9.71777C7.25274 9.71767 7.7002 9.27096 7.7002 8.71973C7.70006 8.1686 7.25266 7.72276 6.7002 7.72266ZM10.5 7.72266C9.94745 7.72267 9.50013 8.16855 9.5 8.71973C9.5 9.27102 9.94736 9.71776 10.5 9.71777C11.0526 9.71777 11.5 9.27103 11.5 8.71973C11.4999 8.16854 11.0525 7.72266 10.5 7.72266ZM14.3008 7.72266C13.7478 7.72271 13.2999 8.16857 13.2998 8.71973C13.2998 9.27099 13.7494 9.71772 14.3008 9.71777C14.8521 9.71777 15.2998 9.27103 15.2998 8.71973C15.2997 8.16854 14.8538 7.72266 14.3008 7.72266Z" fill="currentColor"/></g></g></svg>`,
  // ── Geniet 전용 (단일 그래픽 — color cascade 로 active 구분) ──
  "geniet-home": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="scale(1.274021 1.24998)"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.658 16.9552H7.18C6.719 16.9552 6.346 16.5822 6.346 16.1222C6.346 15.6612 6.719 15.2882 7.18 15.2882H11.658C12.119 15.2882 12.492 15.6612 12.492 16.1222C12.492 16.5822 12.119 16.9552 11.658 16.9552ZM17.743 6.10625L10.569 0.40125C9.896 -0.13375 8.943 -0.13375 8.27 0.40125L1.095 6.10625C0.403 6.65625 0 7.49225 0 8.37625V16.5182C0 17.9992 1.201 19.2003 2.682 19.2003H16.156C17.637 19.2003 18.838 17.9993 18.838 16.5173V8.37625C18.838 7.49225 18.435 6.65625 17.743 6.10625Z" fill="currentColor"/></g></svg>`,
  "geniet-record": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.11968 19.8064L5.12868 20.4564C4.9636 20.4923 4.79209 20.4856 4.63034 20.4368C4.46859 20.388 4.32194 20.2988 4.20425 20.1776C4.08655 20.0564 4.00169 19.9072 3.95767 19.7441C3.91365 19.581 3.91194 19.4094 3.95268 19.2454L4.67068 16.3454C4.76396 15.9695 4.9575 15.626 5.23068 15.3514L15.8907 4.63042C16.0887 4.4313 16.324 4.27314 16.5831 4.16497C16.8423 4.05681 17.1202 4.00075 17.401 4.00001C17.6818 3.99926 17.9601 4.05385 18.2198 4.16064C18.4795 4.26744 18.7156 4.42435 18.9147 4.62242L19.8047 5.50842C20.6437 6.34142 20.6467 7.69542 19.8147 8.53242L9.18168 19.2244C8.89148 19.5171 8.52256 19.7193 8.11968 19.8064Z" fill="currentColor"/><path d="M19.6186 18.738C19.8629 18.738 20.0971 18.835 20.2699 19.0077C20.4426 19.1805 20.5396 19.4147 20.5396 19.659C20.5396 19.9032 20.4426 20.1375 20.2699 20.3102C20.0971 20.4829 19.8629 20.58 19.6186 20.58H11.6036C11.3594 20.58 11.1251 20.4829 10.9524 20.3102C10.7797 20.1375 10.6826 19.9032 10.6826 19.659C10.6826 19.4147 10.7797 19.1805 10.9524 19.0077C11.1251 18.835 11.3594 18.738 11.6036 18.738H19.6186Z" fill="currentColor"/></svg>`,
  "geniet-benefit": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM16.001 7.92969C13.9212 6.00985 10.8516 6.04927 9.10156 7.20898C7.60156 8.18898 6.73117 9.86934 6.70117 11.8193C6.68119 12.8293 6.91124 15.3489 9.34082 16.8389C10.4008 17.4889 11.2815 17.5296 12.0215 17.5596H12.2314L12.251 17.5889C13.7509 17.5889 15.5612 16.8894 16.2812 15.4795C16.5712 14.9196 16.7013 14.3096 16.6914 13.7197V12.4492C16.6914 11.7992 16.1607 11.2695 15.5107 11.2695H12.541C11.8911 11.2696 11.3613 11.7993 11.3613 12.4492C11.3613 13.0992 11.8911 13.6289 12.541 13.6289H14.3311V13.749C14.3411 13.979 14.2907 14.1894 14.1807 14.3994C13.9404 14.8593 12.9608 15.2697 12.041 15.2197C11.5211 15.1997 11.111 15.1795 10.5811 14.8496C9.23113 14.0097 9.05154 12.6194 9.06152 11.8594C9.08152 10.6894 9.55138 9.73969 10.4014 9.17969C11.3914 8.52969 13.2311 8.56919 14.4111 9.65918C14.8811 10.0992 15.6313 10.0689 16.0713 9.58887C16.511 9.10891 16.4807 8.36961 16.001 7.92969Z" fill="currentColor"/></g></svg>`,
  "geniet-review": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#nds-bn-geniet-review-clip)"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 2C19.6569 2 21 3.34315 21 5V19C21 20.6569 19.6569 22 18 22H6C4.34315 22 3 20.6569 3 19V5C3 3.34315 4.34315 2 6 2H18ZM16.6179 16.5863H6.15641C5.70229 16.5863 5.33415 16.9544 5.33415 17.4086C5.33415 17.8627 5.70229 18.2308 6.15641 18.2308H16.6179C17.072 18.2308 17.4401 17.8627 17.4401 17.4086C17.4401 16.9544 17.072 16.5863 16.6179 16.5863ZM14.6444 13.383H6.15641C5.70229 13.383 5.33415 13.7511 5.33415 14.2052C5.33415 14.6594 5.70229 15.0275 6.15641 15.0275H14.6444C15.0985 15.0275 15.4667 14.6594 15.4667 14.2052C15.4667 13.7511 15.0985 13.383 14.6444 13.383ZM10.2659 5.42548C9.59821 5.42548 9.01824 5.78509 8.69591 6.31792C8.37358 5.78509 7.7947 5.42548 7.12702 5.42548C6.1107 5.42548 5.33009 6.21377 5.34653 7.47787C5.36956 9.29453 8.10607 11.2767 8.62574 11.2767C9.10923 11.2767 11.9521 9.29453 11.9992 7.47787C12.0288 6.34642 11.2822 5.42548 10.2659 5.42548Z" fill="currentColor"/></g><defs><clipPath id="nds-bn-geniet-review-clip"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>`,
  "geniet-community": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M16.736 3.2C19.426 3.2 21.607 5.38 21.607 8.07V13.664C21.607 16.354 19.426 18.535 16.736 18.535H13.685L13.4716 18.9052L12.5256 20.5432C12.3246 20.8912 11.8216 20.8912 11.6206 20.5432L10.6746 18.9052L10.46 18.535H7.27C4.58 18.535 2.4 16.354 2.4 13.664V8.07C2.4 5.38 4.58 3.2 7.27 3.2H16.736ZM14.6596 11.8494H9.4376C9.02339 11.8494 8.6876 12.1852 8.6876 12.5994C8.6876 13.0136 9.02339 13.3494 9.4376 13.3494H14.6596C15.0738 13.3494 15.4096 13.0136 15.4096 12.5994C15.4096 12.1852 15.0738 11.8494 14.6596 11.8494ZM15.7488 8.6709H8.3478C7.93359 8.6709 7.5978 9.00669 7.5978 9.4209C7.5978 9.83511 7.93359 10.1709 8.3478 10.1709H15.7488C16.163 10.1709 16.4988 9.83511 16.4988 9.4209C16.4988 9.00669 16.163 8.6709 15.7488 8.6709Z" fill="currentColor"/></g></svg>`,
  // ── Runmile 전용 ──
  "runmile-home": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(2 1)"><g><path d="M8.37598 2.45312C9.28447 1.58437 10.7155 1.58437 11.624 2.45312L18.624 9.14844C19.0874 9.59167 19.3495 10.2055 19.3496 10.8467V19C19.3496 20.2979 18.2979 21.3496 17 21.3496H3C1.70213 21.3496 0.650391 20.2979 0.650391 19V10.8467C0.650501 10.2055 0.912592 9.59167 1.37598 9.14844L8.37598 2.45312Z" stroke="currentColor" stroke-width="1.3"/><path d="M10 14.6504C11.2979 14.6504 12.3496 15.7021 12.3496 17V21.3496H7.65039V17C7.65039 15.7021 8.70213 14.6504 10 14.6504Z" stroke="currentColor" stroke-width="1.3"/></g></g></svg>`,
  "runmile-home-active": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(2 2.1504)"><g><path d="M8.1 15.75C8.1 14.7006 8.95066 13.85 10 13.85C11.0493 13.85 11.9 14.7006 11.9 15.75V20.85H8.1V15.75Z" fill="currentColor"/><path d="M7.92676 0.831915C9.08657 -0.277304 10.9134 -0.277305 12.0732 0.831915L19.0732 7.52723C19.6649 8.09314 19.9999 8.87649 20 9.6952V17.8485C19.9999 19.5053 18.6568 20.8485 17 20.8485H13V15.6962C12.9998 14.0395 11.6567 12.6962 10 12.6962C8.34327 12.6962 7.0002 14.0395 7 15.6962V20.8485H3C1.34322 20.8485 0.000120324 19.5053 0 17.8485V9.6952C5.02428e-05 8.87649 0.335123 8.09314 0.926758 7.52723L7.92676 0.831915Z" fill="currentColor"/></g></g></svg>`,
  "runmile-challenge": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(4.6392 2.1288)"><g><path d="M11.1738 0.0316169C12.5062 -0.10437 13.8591 0.178614 15.1826 1.26599C15.3328 1.38944 15.4199 1.57353 15.4199 1.76794V10.9779C15.4198 11.3368 15.1294 11.6282 14.7705 11.6283C14.5848 11.6283 14.4182 11.549 14.2998 11.4242C13.2889 10.6161 12.3072 10.4228 11.3057 10.5258C10.2403 10.6353 9.15405 11.0768 7.95801 11.5687C6.80191 12.0442 5.53549 12.5711 4.24805 12.7035C3.27016 12.804 2.28138 12.6769 1.30078 12.1732V19.3578C1.30055 19.7166 1.00923 20.0072 0.650391 20.0072C0.291549 20.0072 0.000231685 19.7166 0 19.3578V0.917359C0.000228136 0.558568 0.291546 0.266968 0.650391 0.266968C1.00924 0.266968 1.30055 0.558568 1.30078 0.917359V1.44666C2.24838 2.13709 3.17189 2.30262 4.11426 2.20544C5.18011 2.09546 6.2675 1.65484 7.46387 1.16345C8.62012 0.688541 9.88634 0.163106 11.1738 0.0316169ZM11.3057 1.32459C10.2401 1.43341 9.15321 1.87429 7.95703 2.3656C6.80103 2.84041 5.53515 3.36559 4.24805 3.49841C3.27011 3.59932 2.28156 3.47353 1.30078 2.97107V10.6488C2.24861 11.3412 3.17316 11.5064 4.11523 11.4095C5.18063 11.3 6.26679 10.8585 7.46289 10.3666C8.61903 9.8911 9.88536 9.36516 11.1729 9.23279C12.1508 9.13227 13.1397 9.25851 14.1201 9.76209V2.0863C13.1723 1.39386 12.2477 1.22842 11.3057 1.32459Z" fill="currentColor"/></g></g></svg>`,
  "runmile-challenge-active": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(4.6392 2.1288)"><path d="M15.18 1.26004C12.52 -0.919959 9.84 0.190041 7.46 1.16004C5.22 2.08004 3.27 2.88004 1.3 1.44004V0.920041C1.3 0.560041 1.01 0.270041 0.65 0.270041C0.29 0.270041 0 0.560041 0 0.920041V19.36C0 19.72 0.29 20.01 0.65 20.01C1.01 20.01 1.3 19.72 1.3 19.36V12.16C2.08 12.56 2.85 12.73 3.62 12.73C5.12 12.73 6.59 12.13 7.95 11.57C10.28 10.61 12.3 9.79004 14.35 11.47C14.54 11.63 14.81 11.66 15.04 11.56C15.27 11.45 15.41 11.22 15.41 10.97V1.77004C15.41 1.58004 15.32 1.39004 15.17 1.27004L15.18 1.26004Z" fill="currentColor"/></g></svg>`,
  "runmile-people": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(2 4.4112)"><g><path d="M5.68913 4.23355C6.4031 4.23355 6.98634 4.81679 6.98634 5.53076C6.98634 6.24473 6.4031 6.82798 5.68913 6.82798C4.97516 6.82798 4.39191 6.24473 4.39191 5.53076C4.39191 4.81679 4.97516 4.23355 5.68913 4.23355ZM5.68913 2.52404C4.0299 2.52404 2.6824 3.87153 2.6824 5.53076C2.6824 7.18999 4.0299 8.53749 5.68913 8.53749C7.34836 8.53749 8.69585 7.18999 8.69585 5.53076C8.69585 3.87153 7.34836 2.52404 5.68913 2.52404Z" fill="currentColor"/><path d="M7.02657 14.0079C6.87573 13.7062 6.80534 13.3744 6.84556 13.0124C6.80534 13.3643 6.87573 13.7062 7.02657 14.0079Z" fill="currentColor"/><path d="M7.30823 14.4303C7.75069 14.9532 8.46467 15.285 9.22892 15.285C8.45461 15.285 7.75069 14.9532 7.30823 14.4303Z" fill="currentColor"/><path d="M19.8581 12.4794C18.8022 9.89504 16.3184 8.07492 13.4223 8.07492C11.6525 8.07492 10.0435 8.75872 8.81669 9.87493C7.91166 9.32186 6.86584 8.99001 5.73957 8.99001C4.16079 8.99001 2.72279 9.61348 1.64681 10.6291C0.99317 11.2425 0.480317 11.9867 0.128359 12.8414C0.0579674 13.0023 0.0277997 13.1632 0.00768778 13.3141C-0.02248 13.6258 0.0378557 13.9174 0.158527 14.1789C0.218863 14.3096 0.309366 14.4303 0.39987 14.5509C0.781995 15.0035 1.40546 15.2951 2.07921 15.2951H17.6056C18.3799 15.2951 19.0838 14.9632 19.5263 14.4403C19.6369 14.3096 19.7274 14.1688 19.8078 14.018C19.9587 13.7163 20.0291 13.3845 19.9888 13.0224C19.9687 12.8414 19.9285 12.6604 19.8481 12.4794H19.8581ZM2.13955 13.5755H2.08927C1.93843 13.5755 1.8077 13.5152 1.72725 13.4448C1.97865 12.8515 2.35072 12.3085 2.82335 11.866C3.62783 11.1118 4.66359 10.6895 5.74963 10.6895C6.44349 10.6895 7.09713 10.8604 7.69043 11.1721C7.41892 11.5744 7.18763 12.0068 6.99657 12.4694C6.92617 12.6504 6.87589 12.8314 6.85578 13.0124C6.83567 13.2034 6.85578 13.3945 6.88595 13.5755H2.13955ZM18.2894 13.2537C18.2894 13.2537 18.2592 13.294 18.2391 13.3241C18.1385 13.4448 17.9173 13.5755 17.6156 13.5755H9.23904C8.93736 13.5755 8.71613 13.4347 8.61557 13.3241C8.59546 13.304 8.5854 13.2738 8.57535 13.2537C8.56529 13.2236 8.56529 13.2135 8.56529 13.2034C8.56529 13.1934 8.56529 13.1632 8.58541 13.123C8.70608 12.8213 8.86697 12.5297 9.03792 12.2582C9.28932 11.866 9.57089 11.504 9.91279 11.1923C9.99324 11.1118 10.0938 11.0515 10.1843 10.9811C11.1094 10.2168 12.2458 9.78443 13.4424 9.78443C15.5542 9.78443 17.4648 11.1018 18.2894 13.123C18.3095 13.1632 18.3095 13.1833 18.3095 13.2034C18.3095 13.2135 18.3095 13.2236 18.2994 13.2537H18.2894Z" fill="currentColor"/><path d="M13.4224 1.70951C14.4078 1.70951 15.2023 2.50393 15.2023 3.48941C15.2023 4.47489 14.4078 5.26931 13.4224 5.26931C12.4369 5.26931 11.6425 4.47489 11.6425 3.48941C11.6425 2.50393 12.4369 1.70951 13.4224 1.70951ZM13.4224 0C11.4916 0 9.93294 1.55867 9.93294 3.48941C9.93294 5.42015 11.4916 6.97882 13.4224 6.97882C15.3531 6.97882 16.9118 5.42015 16.9118 3.48941C16.9118 1.55867 15.3531 0 13.4224 0Z" fill="currentColor"/></g></g></svg>`,
  "runmile-people-active": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(2 4.4112)"><g><path d="M5.67405 8.54658C7.33639 8.54658 8.68398 7.19899 8.68398 5.53665C8.68398 3.87431 7.33639 2.52672 5.67405 2.52672C4.01171 2.52672 2.66412 3.87431 2.66412 5.53665C2.66412 7.19899 4.01171 8.54658 5.67405 8.54658Z" fill="currentColor"/><path d="M7.01292 14.0228C6.86192 13.7208 6.79145 13.3886 6.83172 13.0262C6.79145 13.3786 6.86192 13.7208 7.01292 14.0228Z" fill="currentColor"/><path d="M7.29488 14.4456C7.73781 14.9691 8.45254 15.3013 9.21761 15.3013C8.44248 15.3013 7.73781 14.9691 7.29488 14.4456Z" fill="currentColor"/><path d="M5.90567 12.0498C6.31841 11.0431 6.91234 10.1774 7.62707 9.43245C7.013 9.21098 6.35867 9.08011 5.67414 9.08011C3.17761 9.08011 1.04348 10.6505 0.127417 12.8752C-0.385982 14.1436 0.731416 15.3013 2.06021 15.3013H6.53987C6.41907 15.1704 6.28821 15.0496 6.18754 14.8986C5.61374 14.043 5.51307 13.0061 5.90567 12.0498Z" fill="currentColor"/><path d="M19.858 12.4927C18.801 9.90558 16.3145 8.08352 13.4153 8.08352C11.6033 8.08352 9.96245 8.79825 8.71418 9.95592C7.96925 10.6505 7.37532 11.5162 6.97265 12.4927C6.90219 12.6739 6.85185 12.8551 6.83172 13.0363C6.79145 13.3886 6.86192 13.7309 7.01292 14.0329C7.08338 14.1839 7.18405 14.3248 7.29478 14.4557C7.73772 14.9792 8.45245 15.3114 9.21751 15.3114H17.603C18.3782 15.3114 19.0828 14.9792 19.5258 14.4557C19.6365 14.3248 19.7271 14.1839 19.8076 14.0329C19.9586 13.7309 20.0291 13.3987 19.9888 13.0363C19.9687 12.8551 19.9284 12.6739 19.8479 12.4927H19.858Z" fill="currentColor"/><path d="M13.4155 6.98626C15.3447 6.98626 16.9086 5.42233 16.9086 3.49313C16.9086 1.56393 15.3447 0 13.4155 0C11.4863 0 9.92238 1.56393 9.92238 3.49313C9.92238 5.42233 11.4863 6.98626 13.4155 6.98626Z" fill="currentColor"/></g></g></svg>`,
  "runmile-chats": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1.7208 1.7496)"><g><path d="M8.26074 0C12.2306 0.000159042 15.5887 2.69244 16.3555 6.30859C16.4545 6.34149 16.5453 6.37477 16.625 6.40723C16.759 6.46186 16.8711 6.51457 16.9502 6.55469C16.9895 6.57462 17.0218 6.59184 17.0449 6.60449C17.0562 6.61067 17.0662 6.61614 17.0732 6.62012C19.3596 7.73357 20.95 10.0098 20.9502 12.6504C20.9501 14.6158 20.0743 16.3827 18.6826 17.6133L18.8477 19.3896L18.8496 19.4199V19.4502C18.8495 20.2181 18.0558 20.811 17.2979 20.4453L17.2764 20.4355L17.2559 20.4238L15.3867 19.3467C14.8388 19.4464 14.3172 19.4199 13.8496 19.4199C11.4981 19.4197 9.40876 18.3262 8.11621 16.6279L8.11426 16.626C8.11329 16.6246 8.11199 16.6222 8.11035 16.6201C8.1065 16.6151 8.10051 16.6075 8.09375 16.5986C8.07968 16.5802 8.05909 16.5528 8.03418 16.5195C7.9841 16.4527 7.91323 16.3578 7.83203 16.2441C7.73432 16.1073 7.61968 15.9395 7.50195 15.7588C7.1548 15.7534 6.79817 15.735 6.42773 15.665L4.18457 16.9541L4.16113 16.9668L4.13672 16.9785C3.33002 17.3578 2.48047 16.7267 2.48047 15.9004V15.8711L2.4834 15.8418L2.67871 13.6826C1.04119 12.2519 0.000140889 10.1823 0 7.88086C0 3.50092 3.73352 0 8.26074 0ZM16.5205 7.88086C16.5203 11.9993 13.2195 15.3387 9.06152 15.7227C9.066 15.7287 9.07005 15.7347 9.07422 15.7402C9.09661 15.7701 9.11505 15.794 9.12695 15.8096C9.13264 15.817 9.13682 15.8234 9.13965 15.8271C9.14081 15.8287 9.14197 15.8302 9.14258 15.8311L9.14355 15.832L9.14746 15.8369C10.1949 17.2156 11.9039 18.1199 13.8496 18.1201C14.4013 18.1201 14.7635 18.1385 15.1348 18.0723L15.2949 18.0391C15.4712 17.9949 15.6195 18.0316 15.6475 18.0381C15.6804 18.0457 15.7084 18.0542 15.7275 18.0605C15.7371 18.0637 15.7459 18.0667 15.7529 18.0693C15.7564 18.0706 15.7607 18.0721 15.7637 18.0732L15.7695 18.0762H15.7715L15.8145 18.0938L15.8545 18.1172L17.5117 19.0703L17.3633 17.46V17.459C17.332 17.1822 17.4613 16.9392 17.6406 16.7959V16.7949C18.8789 15.7898 19.6503 14.301 19.6504 12.6504C19.6502 10.5581 18.3923 8.71462 16.5176 7.7959C16.5179 7.82419 16.5205 7.85249 16.5205 7.88086ZM8.26074 1.30078C4.38797 1.30078 1.30078 4.2808 1.30078 7.88086C1.30093 9.86083 2.23104 11.6506 3.71094 12.8564L3.70996 12.8574C3.88694 13.0002 4.02947 13.2492 3.99707 13.5381L3.99805 13.5391L3.80273 15.6738L5.95703 14.4365L6.0127 14.4043L6.0752 14.3838L6.07617 14.3828H6.07812C6.07923 14.3825 6.08078 14.3822 6.08203 14.3818C6.08454 14.381 6.0877 14.3799 6.09082 14.3789C6.09719 14.3769 6.10535 14.3746 6.11426 14.3721C6.13164 14.3672 6.15669 14.3605 6.18652 14.3545C6.21474 14.3488 6.25938 14.3414 6.3125 14.3389C6.34935 14.3371 6.42647 14.3359 6.51953 14.3584H6.52051C7.05639 14.486 7.5275 14.46 8.26074 14.46C12.1332 14.4598 15.2204 11.4806 15.2207 7.88086C15.2207 4.28091 12.1334 1.30096 8.26074 1.30078ZM2.91016 13.8809L2.90039 13.8721L2.89746 13.8701L2.91016 13.8809ZM5.63086 7.20996C6.0606 7.21021 6.41007 7.56046 6.41016 7.99023C6.41016 8.42008 6.06065 8.77026 5.63086 8.77051C5.20086 8.77051 4.85059 8.42023 4.85059 7.99023C4.85067 7.5603 5.20091 7.20996 5.63086 7.20996ZM8.29004 7.20996C8.71999 7.20996 9.07023 7.5603 9.07031 7.99023C9.07031 8.42023 8.72004 8.77051 8.29004 8.77051C7.86019 8.77032 7.51074 8.42012 7.51074 7.99023C7.51083 7.56042 7.86024 7.21014 8.29004 7.20996ZM10.9502 7.20996C11.3801 7.20996 11.7304 7.5603 11.7305 7.99023C11.7305 8.42023 11.3802 8.77051 10.9502 8.77051C10.5203 8.77041 10.1699 8.42017 10.1699 7.99023C10.17 7.56037 10.5203 7.21006 10.9502 7.20996Z" fill="currentColor"/></g></g></svg>`,
  "runmile-chats-active": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(2.2008 2.4)"><g><g><path d="M19.65 12C19.65 9.61 18.21 7.55 16.11 6.54C16.14 6.83 16.16 7.13 16.16 7.44C16.16 11.84 12.51 15.44 7.97 15.6C9.14 17.13 11.04 18.14 13.19 18.14C13.77 18.14 14.26 18.17 14.79 18.04C14.82 18.04 14.84 18.04 14.87 18.05L16.92 19.23C17.21 19.37 17.53 19.15 17.54 18.82L17.35 16.77C17.35 16.77 17.36 16.69 17.39 16.67C18.77 15.55 19.64 13.88 19.64 12.02L19.65 12Z" fill="currentColor"/></g><path d="M7.61035 0C11.8102 0.000180978 15.2197 3.24058 15.2197 7.23047C15.2195 11.2201 11.81 14.4598 7.61035 14.46C6.92035 14.46 6.34973 14.4898 5.71973 14.3398C5.68987 14.3301 5.63082 14.3493 5.62988 14.3496L3.20996 15.7402C2.86999 15.9001 2.48047 15.64 2.48047 15.25L2.7002 12.8301C2.71018 12.7902 2.69024 12.74 2.65039 12.71C1.03051 11.3901 0.000146808 9.42028 0 7.23047C0 3.24047 3.41035 0 7.61035 0ZM4.98047 6.55957C4.54974 6.55957 4.20028 6.90913 4.2002 7.33984C4.2002 7.77063 4.54969 8.12012 4.98047 8.12012C5.41104 8.11987 5.75977 7.77047 5.75977 7.33984C5.75968 6.90928 5.41099 6.55982 4.98047 6.55957ZM7.63965 6.55957C7.20907 6.55975 6.86043 6.90924 6.86035 7.33984C6.86035 7.77051 7.20902 8.11993 7.63965 8.12012C8.07043 8.12012 8.41992 7.77063 8.41992 7.33984C8.41984 6.90913 8.07038 6.55957 7.63965 6.55957ZM10.2998 6.55957C9.86917 6.55969 9.52059 6.9092 9.52051 7.33984C9.52051 7.77055 9.86912 8.12 10.2998 8.12012C10.7306 8.12012 11.0801 7.77063 11.0801 7.33984C11.08 6.90913 10.7305 6.55957 10.2998 6.55957Z" fill="currentColor"/></g></g></svg>`,
  "runmile-account": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(2 2)"><g><path d="M10 1.3C14.8 1.3 18.7 5.2 18.7 10C18.7 14.8 14.8 18.7 10 18.7C5.2 18.7 1.3 14.8 1.3 10C1.3 5.2 5.2 1.3 10 1.3ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0Z" fill="currentColor"/><path d="M9.99001 11.37C11.6 11.37 13.05 12.33 13.69 13.84C13.67 13.9 13.48 14.07 13.17 14.07H6.81001C6.50001 14.07 6.31001 13.89 6.30001 13.81C6.93001 12.33 8.37001 11.37 9.99001 11.37ZM9.99001 10.07C7.80001 10.07 5.91001 11.4 5.11001 13.31C4.65001 14.39 5.64001 15.37 6.81001 15.37H13.17C14.34 15.37 15.33 14.38 14.87 13.31C14.07 11.41 12.18 10.07 9.99001 10.07Z" fill="currentColor"/><path d="M9.99003 5.24C10.73 5.24 11.34 5.85 11.34 6.59C11.34 7.33 10.73 7.94 9.99003 7.94C9.25003 7.94 8.64003 7.33 8.64003 6.59C8.64003 5.85 9.25003 5.24 9.99003 5.24ZM9.99003 3.94C8.53003 3.94 7.34003 5.13 7.34003 6.59C7.34003 8.05 8.53003 9.24 9.99003 9.24C11.45 9.24 12.64 8.05 12.64 6.59C12.64 5.13 11.45 3.94 9.99003 3.94Z" fill="currentColor"/></g></g></svg>`,
  "runmile-account-active": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(2 2)"><g><path d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM9.99023 10.3496C7.80023 10.3496 5.91035 11.6102 5.11035 13.4102C4.65043 14.43 5.63977 15.3601 6.80957 15.3604H13.1699C14.3398 15.3604 15.3299 14.4301 14.8701 13.4102C14.0701 11.6102 12.1801 10.3497 9.99023 10.3496ZM9.99023 4.19043C8.66029 4.19043 7.58993 5.25992 7.58984 6.58984C7.58984 7.91984 8.66023 8.99023 9.99023 8.99023C11.3201 8.99012 12.3896 7.91977 12.3896 6.58984C12.3896 5.25999 11.3201 4.19054 9.99023 4.19043Z" fill="currentColor"/></g></g></svg>`,
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
        `<a class="nds-brand-nudge-eap-web__menu-item" href="${escapeAttr(item.href)}" data-key="${escapeAttr(item.key)}" ${item.key === activeKey ? 'data-active="true"' : ""}>${escapeHtml(item.label)}</a>`,
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
        `<a class="nds-brand-geniet__gnb-item" href="${escapeAttr(item.href)}" data-key="${escapeAttr(item.key)}" ${item.key === activeKey ? 'data-active="true"' : ""}>${escapeHtml(item.label)}</a>`,
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
/* Trost web 데스크탑 헤더 — sticky 3단 구성:
 *   1) 띠 배너 (50h) — 브랜드 무관 `banner` 데이터 → renderBrandBanner (다른 브랜드도 재사용)
 *   2) Utility Header (logo + search form + login + app download button)
 *   3) Tab Navigation (70h, tabs with active underline)
 *
 * 모두 BRAND_DATA[trost] 데이터로 구동 (목업 셸이라 호스트 앱 주입 없이 1벌로 렌더). */

function renderTrostHeader(
  brand: BrandChrome,
  surface: HeaderSurface,
  _activeKey: string,
  assetBaseUrl: string,
): string {
  const t = brand.trost;
  if (!t) return "";

  /* Trost mobile/webview 공용 시멘틱 토큰 (data-brand="trost" cascade + hex fallback). */
  const TC_BG = "var(--semantic-bg-surface-default, #FFFFFF)";
  const TC_TEXT_STRONG = "var(--semantic-text-strong-default, #000000)";
  const TC_TEXT_NORMAL = "var(--semantic-text-normal-default, #333333)";
  const TC_TEXT_MUTED = "var(--semantic-text-muted-default, #979797)";
  const TC_ICON_STRONG = "var(--semantic-icon-strong-default, #333333)";
  const TC_BORDER_SUBTLE = "var(--semantic-border-subtle-default, #F2F2F2)";
  const TC_BORDER_NORMAL = "var(--semantic-border-normal-default, #E5E5E5)";
  const TC_FONT = "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif";

  if (surface === "webview") {
    /* React TrostAppBar variant="webview" 의 기본 케이스 (sub / app=trost):
     * 뒤로 chevron + 중앙 타이틀 + 우측 알림 벨, 44h. (Storybook "sub — 뒤로+타이틀+알림") */
    const styleId = "nds-brand-chrome-trost-webview";
    const css = `
      .nds-brand-trost-webview {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        height: 44px;
        padding: 0 16px;
        box-sizing: border-box;
        background: ${TC_BG};
        border-bottom: 1px solid ${TC_BORDER_SUBTLE};
        font-family: ${TC_FONT};
      }
      .nds-brand-trost-webview__back {
        all: unset;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        margin-right: 8px;
        color: ${TC_ICON_STRONG};
        cursor: pointer;
        flex-shrink: 0;
      }
      .nds-brand-trost-webview__title {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        max-width: 56%;
        margin: 0;
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
        color: ${TC_TEXT_STRONG};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
        font-family: inherit;
      }
      .nds-brand-trost-webview__right {
        margin-left: auto;
        display: inline-flex;
        align-items: center;
        gap: 16px;
        flex-shrink: 0;
      }
      .nds-brand-trost-webview__action {
        all: unset;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        color: ${TC_ICON_STRONG};
        cursor: pointer;
        flex-shrink: 0;
      }
    `;
    const wvTitle = t.webviewTitle || brand.mobileTitle;
    return `
      ${ensureStyle(styleId, css)}
      <header class="nds-brand-trost-webview" data-slot="root" data-level="sub" data-app="trost">
        <button type="button" class="nds-brand-trost-webview__back" aria-label="뒤로">${TROST_CHROME_ICONS.back}</button>
        <h1 class="nds-brand-trost-webview__title">${escapeHtml(wvTitle)}</h1>
        <div class="nds-brand-trost-webview__right">
          <button type="button" class="nds-brand-trost-webview__action" aria-label="알림">${TROST_CHROME_ICONS.bell}</button>
        </div>
      </header>
    `;
  }

  if (surface === "mobile") {
    /* React TrostAppBar variant="mobile" rich 2단 홈 (Storybook TrostWebviewHome):
     * row1 = 로고 + 포인트 칩 + 알림 벨, row2 = 풀폭 검색바. */
    const styleId = "nds-brand-chrome-trost-mobile";
    const logoImg = brand.mobileLogo ?? brand.logo;
    const css = `
      .nds-brand-trost-mobile {
        display: flex;
        flex-direction: column;
        width: 100%;
        box-sizing: border-box;
        background: ${TC_BG};
        border-bottom: 1px solid ${TC_BORDER_SUBTLE};
        font-family: ${TC_FONT};
      }
      .nds-brand-trost-mobile__row1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 56px;
        flex-shrink: 0;
        padding: 0 16px;
      }
      .nds-brand-trost-mobile__logo {
        display: inline-flex;
        flex-shrink: 0;
        line-height: 0;
        text-decoration: none;
      }
      .nds-brand-trost-mobile__right {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
      }
      .nds-brand-trost-mobile__point {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        color: ${TC_TEXT_STRONG};
        font-size: 15px;
        line-height: 22px;
        font-weight: 700;
        text-decoration: none;
        cursor: pointer;
      }
      .nds-brand-trost-mobile__coin { display: inline-flex; line-height: 0; }
      .nds-brand-trost-mobile__bell {
        all: unset;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        color: ${TC_ICON_STRONG};
        cursor: pointer;
        flex-shrink: 0;
      }
      .nds-brand-trost-mobile__row2 {
        display: flex;
        align-items: center;
        height: 52px;
        flex-shrink: 0;
        padding: 0 16px 8px;
      }
      .nds-brand-trost-mobile__search {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        height: 44px;
        border: 1px solid ${TC_BORDER_SUBTLE};
        border-radius: 12px;
        padding: 0 40px 0 16px;
        background: ${TC_BG};
        box-sizing: border-box;
        transition: border-color 200ms ease;
      }
      .nds-brand-trost-mobile__search:focus-within { border-color: ${TC_BORDER_NORMAL}; }
      .nds-brand-trost-mobile__search input {
        width: 100%;
        border: none;
        outline: none;
        background: transparent;
        font-family: inherit;
        font-size: 15px;
        line-height: 22px;
        color: ${TC_TEXT_NORMAL};
      }
      .nds-brand-trost-mobile__search input::placeholder { color: ${TC_TEXT_MUTED}; }
      .nds-brand-trost-mobile__search-icon {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        line-height: 0;
        color: ${TC_ICON_STRONG};
        cursor: pointer;
      }
    `;
    return `
      ${ensureStyle(styleId, css)}
      <header class="nds-brand-trost-mobile" data-slot="root">
        <div class="nds-brand-trost-mobile__row1">
          <a class="nds-brand-trost-mobile__logo" href="/">${renderLogoImg(logoImg, assetBaseUrl, { height: 28 })}</a>
          <div class="nds-brand-trost-mobile__right">
            <a class="nds-brand-trost-mobile__point" href="/point" aria-label="포인트 ${escapeAttr(t.mobilePointAmount)}P">
              <span class="nds-brand-trost-mobile__coin">${TROST_CHROME_ICONS.coin}</span>
              <span>${escapeHtml(t.mobilePointAmount)} P</span>
            </a>
            <button type="button" class="nds-brand-trost-mobile__bell" aria-label="알림">${TROST_CHROME_ICONS.bell}</button>
          </div>
        </div>
        <div class="nds-brand-trost-mobile__row2">
          <div class="nds-brand-trost-mobile__search">
            <input type="text" placeholder="${escapeAttr(t.mobileSearchPlaceholder)}" autocomplete="off" />
            <span class="nds-brand-trost-mobile__search-icon" role="button" aria-label="검색">${TROST_CHROME_ICONS.search}</span>
          </div>
        </div>
      </header>
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
      ${brand.banner ? renderBrandBanner(brand.banner) : ""}
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

/* ──────────────── Brand: CashwalkBiz ──────────────── */
/* React: CashwalkBizWebHeader — 1단 헤더 + yellow primary CTA pill. */

function renderCashwalkBizHeader(
  brand: BrandChrome,
  surface: HeaderSurface,
  activeKey: string,
  assetBaseUrl: string,
): string {
  const c = brand["cashwalk-biz"];

  if (surface === "webview") {
    return renderWebviewHeader(brand.mobileTitle);
  }

  const styleId = "nds-brand-chrome-cashwalk-biz";
  const css = `
    .nds-brand-cashwalk-biz {
      display: block;
      width: 100%;
      background: ${cv.surface.default};
      border-bottom: 1px solid ${cv.borderRole.subtle};
      box-sizing: border-box;
    }
    .nds-brand-cashwalk-biz__inner {
      max-width: ${brand.maxWidth}px;
      margin: 0 auto;
      height: 68px;
      display: flex;
      align-items: center;
      gap: ${spacing[16]}px;
      padding: 0 60px;
      box-sizing: border-box;
    }
    .nds-brand-cashwalk-biz__inner--mobile {
      height: ${c?.mobileHeight ?? 56}px;
      padding: 0 ${spacing[20]}px;
      justify-content: space-between;
    }
    .nds-brand-cashwalk-biz__logo {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      text-decoration: none;
    }
    .nds-brand-cashwalk-biz__menu {
      display: flex;
      align-items: center;
      gap: ${spacing[8]}px;
      flex: 1;
      margin-left: ${spacing[24]}px;
    }
    .nds-brand-cashwalk-biz__menu-item,
    .nds-brand-cashwalk-biz__menu-item:visited,
    .nds-brand-cashwalk-biz__menu-item:hover {
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
    .nds-brand-cashwalk-biz__menu-item[data-active="true"] {
      color: ${cv.textRole.strong};
      font-weight: ${fontWeight.bold};
    }
    .nds-brand-cashwalk-biz__actions {
      display: inline-flex;
      align-items: center;
      gap: ${spacing[16]}px;
      flex-shrink: 0;
    }
    .nds-brand-cashwalk-biz__auth {
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
    .nds-brand-cashwalk-biz__primary-cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 36px;
      padding: 0 12px;
      background: var(--semantic-primary-default, #ffd200);
      color: var(--semantic-text-strong-default, #333333);
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
    .nds-brand-cashwalk-biz__hamburger {
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
      <header class="nds-brand-cashwalk-biz" data-slot="root">
        <div class="nds-brand-cashwalk-biz__inner nds-brand-cashwalk-biz__inner--mobile">
          <a class="nds-brand-cashwalk-biz__logo" href="/">${renderLogoImg(logoImg, assetBaseUrl)}</a>
          <button type="button" class="nds-brand-cashwalk-biz__hamburger" aria-label="메뉴">${TROST_ICONS.hamburger}</button>
        </div>
      </header>
    `;
  }

  const menuHtml = brand.webMenu
    .map(
      (item) =>
        `<a class="nds-brand-cashwalk-biz__menu-item" href="${escapeAttr(item.href)}" data-key="${escapeAttr(item.key)}" ${item.key === activeKey ? 'data-active="true"' : ""}>${escapeHtml(item.label)}</a>`,
    )
    .join("");

  const ctaHtml = c?.primaryCta
    ? `<a class="nds-brand-cashwalk-biz__primary-cta" href="${escapeAttr(c.primaryCta.href)}">${escapeHtml(c.primaryCta.label)}</a>`
    : "";

  return `
    ${ensureStyle(styleId, css)}
    <header class="nds-brand-cashwalk-biz" data-slot="root">
      <div class="nds-brand-cashwalk-biz__inner">
        <a class="nds-brand-cashwalk-biz__logo" href="/">${renderLogoImg(brand.logo, assetBaseUrl)}</a>
        <nav class="nds-brand-cashwalk-biz__menu">${menuHtml}</nav>
        <div class="nds-brand-cashwalk-biz__actions">
          <a class="nds-brand-cashwalk-biz__auth" href="#">${escapeHtml(brand.authLabel ?? "로그인")}</a>
          ${ctaHtml}
        </div>
      </div>
    </header>
  `;
}

/* ──────────────── Brand: Runmile ──────────────── */
/* React: RunmileWebHeader (Figma 1058:13271) — 1단 80h 헤더.
 *   좌측 coral 워드마크 + GNB(대회 정보 / 커뮤니티) / 중앙 absolute coral 검색바 /
 *   우측 액션(채팅 + 로그인, 아이콘 28 위 + 라벨 14 아래).
 * 색은 React 와 동일하게 --semantic-* var() + hex fallback 으로 못박는다. */

function renderRunmileHeader(
  brand: BrandChrome,
  surface: HeaderSurface,
  activeKey: string,
  assetBaseUrl: string,
): string {
  const r = brand.runmile;
  if (!r) return "";

  if (surface === "webview") {
    return renderWebviewHeader(brand.mobileTitle);
  }

  /* React constants (WebHeader.tsx) — 시멘틱 토큰 + hex fallback. */
  const C_BLACK = "var(--semantic-icon-strong-default, #221E1F)";
  const C_CORAL_FILL = "var(--semantic-fill-brand-default, #FF5B37)";
  const C_CORAL_TEXT = "var(--semantic-text-brand-default, #FF5B37)";
  const C_CORAL_ICON = "var(--semantic-icon-brand-default, #FF5B37)";
  const C_LABEL = "var(--semantic-text-normal-default, #333D4B)";
  const C_ICON_GRAY = "var(--semantic-icon-normal-default, #4E5968)";
  const C_PLACEHOLDER = "var(--semantic-text-muted-default, #919CAA)";
  const C_BORDER = "var(--semantic-border-subtle-default, #E5E8EB)";
  const C_WHITE = "var(--semantic-bg-surface-default, #FFFFFF)";

  if (surface === "mobile") {
    /* 모바일은 52h white bar + 중앙 coral 워드마크 (AppBar variant="logo" 톤). */
    const styleId = "nds-brand-chrome-runmile-mobile";
    const css = `
      .nds-brand-runmile-mobile {
        position: relative;
        width: 100%;
        height: 52px;
        background: ${C_WHITE};
        box-sizing: border-box;
      }
      .nds-brand-runmile-mobile__logo {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 20px;
        font-weight: 800;
        color: ${C_CORAL_TEXT};
        text-decoration: none;
        line-height: 1;
      }
    `;
    return `
      ${ensureStyle(styleId, css)}
      <header class="nds-brand-runmile-mobile" data-slot="root">
        <a class="nds-brand-runmile-mobile__logo" href="/">${renderLogoImg(brand.mobileLogo ?? brand.logo, assetBaseUrl)}</a>
      </header>
    `;
  }

  /* desktop — 1단 80h */
  const styleId = "nds-brand-chrome-runmile-web";
  const css = `
    .nds-brand-runmile-web {
      display: block;
      width: 100%;
      height: 80px;
      background: ${C_WHITE};
      border-bottom: 1px solid ${C_BORDER};
      box-sizing: border-box;
    }
    .nds-brand-runmile-web__inner {
      position: relative;
      display: flex;
      align-items: center;
      gap: 36px;
      width: 100%;
      max-width: ${brand.maxWidth}px;
      height: 100%;
      margin: 0 auto;
      padding: 0 80px;
      box-sizing: border-box;
    }
    .nds-brand-runmile-web__logo {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      line-height: 0;
      text-decoration: none;
    }
    .nds-brand-runmile-web__logo span {
      font-size: 22px;
      font-weight: 800;
      color: ${C_CORAL_TEXT};
      line-height: 1;
    }
    .nds-brand-runmile-web__nav {
      display: flex;
      align-items: center;
      gap: 36px;
      flex-shrink: 0;
    }
    .nds-brand-runmile-web__nav-item {
      font-size: 18px;
      line-height: 24px;
      font-weight: 700;
      color: ${C_BLACK};
      text-decoration: none;
      white-space: nowrap;
    }
    .nds-brand-runmile-web__nav-item[data-active="true"] {
      color: ${C_CORAL_TEXT};
    }
    .nds-brand-runmile-web__search {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      width: 430px;
      height: 48px;
      border: 2px solid ${C_CORAL_FILL};
      border-radius: 100px;
      box-sizing: border-box;
      padding: 0 14px 0 18px;
      background: ${C_WHITE};
    }
    .nds-brand-runmile-web__search input {
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      font-family: inherit;
      font-size: 15px;
      line-height: 22px;
      color: ${C_BLACK};
    }
    .nds-brand-runmile-web__search input::placeholder {
      color: ${C_PLACEHOLDER};
    }
    .nds-brand-runmile-web__search-btn {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      padding: 0;
      border: none;
      background: transparent;
      cursor: pointer;
      color: ${C_CORAL_ICON};
      line-height: 0;
      margin-left: 8px;
    }
    .nds-brand-runmile-web__actions {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .nds-brand-runmile-web__action {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      min-width: 61px;
      padding: 0;
      border: none;
      background: transparent;
      cursor: pointer;
      text-decoration: none;
      font-family: inherit;
    }
    .nds-brand-runmile-web__action-icon {
      width: 28px;
      height: 28px;
      line-height: 0;
      color: ${C_ICON_GRAY};
    }
    .nds-brand-runmile-web__action-label {
      font-size: 14px;
      line-height: 20px;
      font-weight: 500;
      color: ${C_LABEL};
    }
  `;

  const navHtml = brand.webMenu
    .map(
      (item) =>
        `<a class="nds-brand-runmile-web__nav-item" href="${escapeAttr(item.href)}" data-key="${escapeAttr(item.key)}" ${item.key === activeKey ? 'data-active="true"' : ""}>${escapeHtml(item.label)}</a>`,
    )
    .join("");

  return `
    ${ensureStyle(styleId, css)}
    <header class="nds-brand-runmile-web" data-slot="root">
      <div class="nds-brand-runmile-web__inner">
        <a class="nds-brand-runmile-web__logo" href="/">${renderLogoImg(brand.logo, assetBaseUrl)}</a>
        <nav class="nds-brand-runmile-web__nav">${navHtml}</nav>
        <div class="nds-brand-runmile-web__search">
          <input type="text" placeholder="${escapeAttr(r.searchPlaceholder)}" autocomplete="off" />
          <button type="button" class="nds-brand-runmile-web__search-btn" aria-label="검색">${RUNMILE_ICONS.search}</button>
        </div>
        <div class="nds-brand-runmile-web__actions">
          <a class="nds-brand-runmile-web__action" href="#" aria-label="${escapeAttr(r.chatLabel)}">
            <span class="nds-brand-runmile-web__action-icon">${RUNMILE_ICONS.chat}</span>
            <span class="nds-brand-runmile-web__action-label">${escapeHtml(r.chatLabel)}</span>
          </a>
          <a class="nds-brand-runmile-web__action" href="#" aria-label="${escapeAttr(r.loginLabel)}">
            <span class="nds-brand-runmile-web__action-icon">${RUNMILE_ICONS.login}</span>
            <span class="nds-brand-runmile-web__action-label">${escapeHtml(r.loginLabel)}</span>
          </a>
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
    case "cashwalk-biz":
      return renderCashwalkBizHeader(brand, surface, activeKey, assetBaseUrl);
    case "runmile":
      return renderRunmileHeader(brand, surface, activeKey, assetBaseUrl);
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
  /* runmile 처럼 로고 자산 없이 워드마크만 쓰는 brand 는 footerLogo.src 가 "" —
   * 빈 src 로 <img> 를 만들면 깨진 이미지가 뜨므로 src 있을 때만 렌더한다. */
  const footerLogoSrc = footerLogo.src ? resolveAssetUrl(assetBaseUrl, footerLogo.src) : "";
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
            ${footerLogo.src ? renderLogoImg(footerLogo, assetBaseUrl) : ""}
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

/* ──────────────── BottomNav (앱 하단 5탭) ──────────────── */
/* React 의 brand BottomNav 와 동등 — 제네릭 <nds-footer-tab-bar>/<nds-footer-tab-item>
 * 마크업을 그대로 emit 해 styles 패키지의 tab-bar CSS 를 재사용한다. active/inactive 색은
 * nav-item 의 cascade 변수 (--nds-footer-nav-*-color) 로만 제어 — 아이콘 SVG 가 currentColor
 * 라 single-graphic 정책 (Geniet) 도 색만으로 active 가 구분된다. */

function renderBottomNav(brandKey: BrandKey, activeKey: string, _assetBaseUrl: string): string {
  const data = BRAND_DATA[brandKey].bottomNav;
  // web 전용 brand (cashwalk-biz) 는 BottomNav 가 없음 → 빈 렌더.
  if (!data) return "";

  const vars = [
    `--nds-footer-nav-active-color:${data.activeColor}`,
    `--nds-footer-nav-inactive-color:${data.inactiveColor}`,
    data.labelFontSize != null ? `--nds-footer-nav-label-font-size:${data.labelFontSize}px` : "",
    data.labelLineHeight != null
      ? `--nds-footer-nav-label-line-height:${data.labelLineHeight}px`
      : "",
  ]
    .filter(Boolean)
    .join(";");

  const items = data.tabs
    .map(
      (t) => `
      <nds-footer-tab-item key="${escapeAttr(t.key)}" label="${escapeAttr(t.label)}" href="${escapeAttr(t.href)}">
        <span slot="icon">${BOTTOM_NAV_ICONS[t.icon] ?? ""}</span>
        <span slot="active-icon">${BOTTOM_NAV_ICONS[t.activeIcon] ?? ""}</span>
      </nds-footer-tab-item>`,
    )
    .join("");

  return `
    <nds-footer-tab-bar active-tab="${escapeAttr(activeKey)}" style="${vars}">
      ${items}
    </nds-footer-tab-bar>
  `;
}

/* ──────────────── Elements ──────────────── */

export class NdsBrandHeader extends NdsElement {
  static elementName = "nds-brand-header";
  static brandFallback: BrandKey = "nudge-eap";

  static get observedAttributes(): readonly string[] {
    return ["brand", "surface", "active-key", "asset-base-url"];
  }

  /** 마지막 full-render 의 brand|surface|assetBaseUrl 키 — 같으면 in-place 패치만. */
  private _renderedKey: string | null = null;

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
    const assetBaseUrl = this.getAttribute("asset-base-url") ?? "/assets";
    this.setAttribute("data-brand", brand);

    /* active-key 만 바뀐 경우 innerHTML 재빌드 금지 — 검색 input 등 내부 노드가
     * 통째로 재생성돼 포커스가 유실된다 (mount-once 계약,
     * packages/html/test/nds-brand-chrome.test.ts 가 잠근다).
     * 메뉴 활성 표시(data-active)만 data-key 앵커에 in-place 패치한다. */
    const renderedKey = `${brand}|${surface}|${assetBaseUrl}`;
    if (this._renderedKey === renderedKey) {
      this.querySelectorAll<HTMLElement>("[data-key]").forEach((el) => {
        if (el.dataset.key === activeKey) el.dataset.active = "true";
        else el.removeAttribute("data-active");
      });
      return;
    }
    this._renderedKey = renderedKey;
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
    const assetBaseUrl = this.getAttribute("asset-base-url") ?? "/assets";
    this.setAttribute("data-brand", brand);
    this.innerHTML = renderFooter(brand, surface, layout, assetBaseUrl);
  }
}

export class NdsBrandBottomNav extends NdsElement {
  static elementName = "nds-brand-bottom-nav";
  static brandFallback: BrandKey = "nudge-eap";

  static get observedAttributes(): readonly string[] {
    return ["brand", "active-key", "asset-base-url"];
  }

  protected update(): void {
    const brand = normalizeBrand(
      this.getAttribute("brand"),
      (this.constructor as typeof NdsBrandBottomNav).brandFallback,
    );
    const activeKey = this.getAttribute("active-key") ?? "home";
    const assetBaseUrl = this.getAttribute("asset-base-url") ?? "/assets";
    this.setAttribute("data-brand", brand);
    this.innerHTML = renderBottomNav(brand, activeKey, assetBaseUrl);
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
  /* cashwalk-biz 는 BottomNav 데이터가 없어 빈 렌더 — header/footer 와 대칭을 위해
   * alias 자체는 등록하되 renderBottomNav 가 "" 를 반환한다 (web-only 일관). */
  class BrandBottomNavAlias extends NdsBrandBottomNav {
    static override elementName = `nds-${brand}-bottom-nav`;
    static override brandFallback = brand;
  }
  define(BrandHeaderAlias);
  define(BrandFooterAlias);
  define(BrandBottomNavAlias);
}

/* ============================================================================
 * nds-sidebar (흡수) — 옛 standalone packages/html/src/components/nds-sidebar.ts 를
 * 이 파일로 병합(chrome 정리 Phase 3). admin/사이드바도 브랜드 chrome 의 한 형태.
 * element 명은 호환을 위해 <nds-sidebar> 유지(코드 위치만 nds-brand-chrome 로 이전).
 * UI + 여닫기(collapse/서브메뉴 토글) 동작은 그대로 보존.
 * ========================================================================== */
const SB_CLASS = "nds-sidebar";
const SB_ROOT_CLASS = `${SB_CLASS}__root`;
const SB_HEADER_CLASS = `${SB_CLASS}__header`;
const SB_LOGO_CLASS = `${SB_CLASS}__logo`;
const SB_TITLE_CLASS = `${SB_CLASS}__title`;
const SB_SUBTITLE_CLASS = `${SB_CLASS}__subtitle`;
const SB_TOGGLE_CLASS = `${SB_CLASS}__toggle`;
const SB_BODY_CLASS = `${SB_CLASS}__body`;
const SB_SECTION_CLASS = `${SB_CLASS}__section`;
const SB_SECTION_LABEL_CLASS = `${SB_CLASS}__section-label`;
const SB_ITEM_LIST_CLASS = `${SB_CLASS}__item-list`;
const SB_ITEM_CLASS = `${SB_CLASS}__item`;
const SB_ITEM_INNER_CLASS = `${SB_CLASS}__item-inner`;
const SB_ITEM_ICON_CLASS = `${SB_CLASS}__item-icon`;
const SB_ITEM_LABEL_CLASS = `${SB_CLASS}__item-label`;
const SB_ITEM_BADGE_CLASS = `${SB_CLASS}__item-badge`;
const SB_ITEM_CARET_CLASS = `${SB_CLASS}__item-caret`;
const SB_CHILDREN_CLASS = `${SB_CLASS}__children`;
const SB_FOOTER_CLASS = `${SB_CLASS}__footer`;
const SB_USER_CLASS = `${SB_CLASS}__user`;
const SB_USER_AVATAR_CLASS = `${SB_CLASS}__user-avatar`;
const SB_USER_META_CLASS = `${SB_CLASS}__user-meta`;
const SB_USER_NAME_CLASS = `${SB_CLASS}__user-name`;
const SB_USER_ROLE_CLASS = `${SB_CLASS}__user-role`;
// 고정 계정 블록(로고 아래) + 푸터 액션 — 캐포비 어드민의 로고→이메일→잔액→CTA쌍, 로그아웃.
const SB_ACCOUNT_CLASS = `${SB_CLASS}__account`;
const SB_ACCOUNT_EMAIL_CLASS = `${SB_CLASS}__account-email`;
const SB_ACCOUNT_BALANCE_CLASS = `${SB_CLASS}__account-balance`;
const SB_ACCOUNT_BALANCE_LABEL_CLASS = `${SB_CLASS}__account-balance-label`;
const SB_ACCOUNT_BALANCE_AMOUNT_CLASS = `${SB_CLASS}__account-balance-amount`;
const SB_ACCOUNT_ACTIONS_CLASS = `${SB_CLASS}__account-actions`;
const SB_ACTION_CLASS = `${SB_CLASS}__action`;
const SB_FOOTER_ACTIONS_CLASS = `${SB_CLASS}__footer-actions`;

const STYLE_ID = "nds-sidebar-style";

interface SidebarItem {
  key: string;
  label: string;
  icon?: string;
  href?: string;
  badge?: string | number;
  disabled?: boolean;
  children?: SidebarItem[];
}

interface SidebarSection {
  key: string;
  label?: string;
  items: SidebarItem[];
}

interface SidebarUser {
  name: string;
  role?: string;
  avatar?: string;
  avatarAlt?: string;
}

interface SidebarAction {
  key?: string;
  label: string;
  /** solid = 강조(충전하기), outlined = 보조(내역보기 / 로그아웃). 기본 outlined. */
  variant?: "solid" | "outlined";
  href?: string;
}

/**
 * 로고 아래 고정 계정 블록 — 캐포비 어드민의 "로고→계정 이메일→잔액(충전 금액)→CTA 쌍".
 * 메뉴(스크롤 영역)와 분리된 상단 고정 블록으로 렌더된다.
 */
interface SidebarAccount {
  /** 계정 이메일 등 식별 정보. */
  email?: string;
  /** 잔액 라벨(예: "충전 잔액"). */
  balanceLabel?: string;
  /** 잔액 금액 텍스트(예: "₩1,250,000"). */
  balance?: string;
  /** 하단 CTA 쌍 — 보통 [충전하기(solid), 내역보기(outlined)]. */
  actions?: SidebarAction[];
}

/**
 * `brand` 속성 → 로고 자동 주입 맵. `<nds-brand-header>` 와 동일 SSOT(brand-logo-defaults).
 *
 * 사이드바 `logo-src` 에 35KB 짜리 base64 data URI 를 손으로 붙이지 않게 하기 위함이다.
 * 거대 블롭을 LLM 이 그대로 재현/추출하다 깨뜨리는 회귀(가이드 마크업을 unicode_escape 로
 * 추출 → 한글 모지바케 + 로고 유실)를 원천 차단한다. 명시적 `logo-src` 가 있으면 그쪽이 우선.
 */
interface SidebarBrandLogo {
  src: string;
  alt: string;
  width: number;
  height: number;
}
const SIDEBAR_BRAND_LOGOS: Record<string, SidebarBrandLogo> = {
  "cashwalk-biz": {
    src: CASHWALK_BIZ_LOGO_DATA_URI,
    alt: "Cashwalk for Business",
    // Storybook(Brands/CashwalkBiz/Sidebar = SSOT) · 시안(Figma 3304:617) 정합:
    // for-business 가로 로고(106.667×32, ~3.33:1)를 높이 56 로 가운데 정렬(폭 ~187).
    width: 187,
    height: 56,
  },
  "nudge-eap": { src: NUDGE_EAP_LOGO_DATA_URI, alt: "NudgeEAP", width: 124, height: 28 },
  trost: { src: TROST_LOGO_DATA_URI, alt: "Trost", width: 90, height: 36 },
  geniet: { src: GENIET_LOGO_PC_DATA_URI, alt: "Geniet", width: 165, height: 54 },
  runmile: { src: RUNMILE_LOGO_DATA_URI, alt: "Runmile", width: 142, height: 32 },
};

const isSectionList = (input: SidebarItem[] | SidebarSection[]): input is SidebarSection[] => {
  if (!Array.isArray(input) || input.length === 0) return false;
  const first = input[0] as { items?: unknown };
  return Array.isArray(first.items);
};

const normalizeSections = (input: SidebarItem[] | SidebarSection[]): SidebarSection[] => {
  if (isSectionList(input)) return input;
  return [{ key: "__default", items: input }];
};

const containsKey = (items: SidebarItem[] | undefined, key: string | undefined): boolean => {
  if (!items || !key) return false;
  for (const it of items) {
    if (it.key === key) return true;
    if (it.children && containsKey(it.children, key)) return true;
  }
  return false;
};

const sidebarStyles = `
  :where(.${SB_ROOT_CLASS}) {
    --nds-sidebar-width: 300px;
    --nds-sidebar-collapsed-width: 72px;
    --nds-sidebar-bg: ${cv.surface.default};
    --nds-sidebar-border-color: ${cv.borderRole.subtle};
    --nds-sidebar-text: ${cv.textRole.normal};
    --nds-sidebar-text-subtle: ${cv.textRole.subtle};
    --nds-sidebar-icon: ${cv.iconRole.normal};
    --nds-sidebar-icon-active: ${cv.iconRole.strong};
    --nds-sidebar-text-active: ${cv.textRole.strong};
    --nds-sidebar-item-radius: 16px;
    --nds-sidebar-item-active-radius: 12px;
    --nds-sidebar-item-hover-bg: ${cv.surface.section};
    --nds-sidebar-item-active-bg: ${cv.surface.brandSubtle};
    --nds-sidebar-item-active-accent: ${cv.fill.brand};

    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: var(--nds-sidebar-width);
    background: var(--nds-sidebar-bg);
    border-right: 1px solid var(--nds-sidebar-border-color);
    font-family: ${fontFamily.web};
    color: var(--nds-sidebar-text);
    box-sizing: border-box;
    transition: width 0.18s ease;
  }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"]) { width: var(--nds-sidebar-collapsed-width); }
  :where(.${SB_ROOT_CLASS}[data-full-height="true"]) { height: 100vh; position: sticky; top: 0; }

  :where(.${SB_HEADER_CLASS}) {
    display: flex; align-items: center; gap: ${spacing[12]}px;
    padding: ${spacing[32]}px ${spacing[24]}px ${spacing[16]}px ${spacing[24]}px;
    box-sizing: border-box;
  }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_HEADER_CLASS}) {
    padding: ${spacing[24]}px ${spacing[12]}px; justify-content: center;
  }
  :where(.${SB_LOGO_CLASS}) { display: inline-flex; align-items: center; flex-shrink: 0; color: inherit; text-decoration: none; }
  :where(.${SB_LOGO_CLASS} img) { display: block; max-height: 28px; width: auto; }
  /* 캐포비(cashwalk-biz): Storybook/시안 정합 — 로고 가운데 정렬 + 높이 56(28px 캡 해제). 폭은 viewBox 비율로 auto. */
  :where([data-brand="cashwalk-biz"] .${SB_HEADER_CLASS}) { justify-content: center; }
  :where([data-brand="cashwalk-biz"] .${SB_LOGO_CLASS} img) { max-height: none; height: 56px; width: auto; }

  :where(.${SB_TITLE_CLASS}) {
    margin: 0; font-size: ${typeScale.body1.fontSize}px; line-height: 20px;
    font-weight: ${fontWeight.bold}; color: var(--nds-sidebar-text-active);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  :where(.${SB_SUBTITLE_CLASS}) {
    margin: 4px 0 0; font-size: ${typeScale.caption1.fontSize}px; line-height: 18px;
    color: var(--nds-sidebar-text-subtle);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  :where(.${SB_TOGGLE_CLASS}) {
    flex-shrink: 0; width: 28px; height: 28px; border: none; background: transparent;
    border-radius: 6px; color: var(--nds-sidebar-icon); cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
  }
  :where(.${SB_TOGGLE_CLASS}:hover) { background: var(--nds-sidebar-item-hover-bg); color: var(--nds-sidebar-icon-active); }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_TITLE_CLASS}),
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_SUBTITLE_CLASS}),
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_TOGGLE_CLASS}) { display: none; }

  :where(.${SB_BODY_CLASS}) {
    flex: 1; overflow-y: auto; overflow-x: hidden;
    padding: 0 ${spacing[24]}px ${spacing[24]}px;
    -webkit-overflow-scrolling: touch;
  }
  :where(.${SB_SECTION_CLASS}) {
    padding: ${spacing[28]}px 0; display: flex; flex-direction: column; gap: ${spacing[8]}px;
  }
  :where(.${SB_SECTION_CLASS} + .${SB_SECTION_CLASS}) { border-top: 1px solid var(--nds-sidebar-border-color); }
  :where(.${SB_SECTION_LABEL_CLASS}) {
    padding: 0 ${spacing[10]}px 0 ${spacing[20]}px; margin: 0;
    font-size: 14px; line-height: 20px; font-weight: ${fontWeight.medium};
    color: var(--nds-sidebar-text-subtle); text-transform: uppercase; letter-spacing: 0.4px;
  }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_SECTION_LABEL_CLASS}) { display: none; }
  :where(.${SB_ITEM_LIST_CLASS}) {
    list-style: none; margin: 0; padding: 0;
    display: flex; flex-direction: column; gap: ${spacing[2]}px;
  }

  :where(.${SB_ITEM_CLASS}) { position: relative; }
  :where(.${SB_ITEM_INNER_CLASS}) {
    display: flex; align-items: center; gap: ${spacing[10]}px;
    width: 100%; height: 42px;
    padding: ${spacing[12]}px ${spacing[20]}px;
    border: none; background: transparent;
    border-radius: var(--nds-sidebar-item-radius);
    color: var(--nds-sidebar-text); text-decoration: none; text-align: left;
    cursor: pointer; font-family: inherit;
    font-size: ${typeScale.body1.fontSize}px; line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.medium};
    box-sizing: border-box;
    transition: background 0.12s ease, color 0.12s ease, border-radius 0.12s ease;
  }
  :where(.${SB_ITEM_INNER_CLASS}:hover) { background: var(--nds-sidebar-item-hover-bg); color: var(--nds-sidebar-text-active); }
  :where(.${SB_ITEM_INNER_CLASS}:focus-visible) { outline: 2px solid ${cv.borderRole.focus}; outline-offset: -2px; }
  :where(.${SB_ITEM_INNER_CLASS}[aria-current="page"]) {
    background: var(--nds-sidebar-item-active-bg);
    color: var(--nds-sidebar-text-active);
    border-radius: var(--nds-sidebar-item-active-radius);
    font-weight: ${fontWeight.medium};
  }
  :where(.${SB_ITEM_INNER_CLASS}[aria-disabled="true"]) { color: ${cv.textRole.disabled}; cursor: not-allowed; pointer-events: none; }
  :where(.${SB_ITEM_ICON_CLASS}) {
    display: inline-flex; align-items: center; justify-content: center;
    width: 24px; height: 24px; flex-shrink: 0; color: var(--nds-sidebar-icon);
  }
  :where(.${SB_ITEM_INNER_CLASS}:hover .${SB_ITEM_ICON_CLASS}),
  :where(.${SB_ITEM_INNER_CLASS}[aria-current="page"] .${SB_ITEM_ICON_CLASS}) { color: var(--nds-sidebar-icon-active); }
  :where(.${SB_ITEM_LABEL_CLASS}) { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_ITEM_LABEL_CLASS}) { display: none; }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_ITEM_INNER_CLASS}) { position: relative; justify-content: center; padding: 0; gap: 0; }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_ITEM_INNER_CLASS}[aria-current="page"]::before) { display: none; }
  :where(.${SB_ITEM_BADGE_CLASS}) {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 18px; height: 18px; padding: 0 6px; border-radius: 9px;
    background: ${cv.fill.statusError}; color: ${cv.textRole.inverse};
    font-size: ${typeScale.label.fontSize}px; line-height: 1; font-weight: ${fontWeight.bold};
    box-sizing: border-box;
  }
  :where(.${SB_ITEM_CARET_CLASS}) {
    display: inline-flex; align-items: center; justify-content: center;
    width: 16px; height: 16px; color: var(--nds-sidebar-text-subtle);
    transition: transform 0.18s ease;
  }
  :where(.${SB_ITEM_CARET_CLASS}[data-expanded="true"]) { transform: rotate(90deg); }
  /* Collapsed: caret hidden; a numeric badge collapses to an 8px dot on the icon's top-right.
     Declared AFTER the badge/caret base rules so the :where() (0-specificity) cascade resolves
     to these — otherwise the later base display:inline-flex would win and the count would render
     full-size in the 72px rail, breaking the layout. (react Sidebar.tsx 와 미러.) */
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_ITEM_CARET_CLASS}) { display: none; }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_ITEM_BADGE_CLASS}) {
    position: absolute; top: 6px; left: calc(50% + 3px);
    min-width: 0; width: 8px; height: 8px; padding: 0;
    border-radius: 50%; font-size: 0; line-height: 0; color: transparent;
  }

  :where(.${SB_CHILDREN_CLASS}) {
    list-style: none; margin: ${spacing[2]}px 0 0; padding: 0;
    display: flex; flex-direction: column; gap: ${spacing[2]}px;
  }
  :where(.${SB_CHILDREN_CLASS} .${SB_ITEM_INNER_CLASS}) {
    height: 36px; padding-left: ${spacing[40]}px;
    font-weight: ${fontWeight.regular}; font-size: ${typeScale.body3.fontSize}px;
  }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_CHILDREN_CLASS}) { display: none; }

  :where(.${SB_FOOTER_CLASS}) {
    padding: ${spacing[12]}px ${spacing[24]}px ${spacing[24]}px;
    box-sizing: border-box;
  }
  :where(.${SB_USER_CLASS}) {
    display: flex; align-items: center; gap: ${spacing[12]}px;
    padding: ${spacing[8]}px; border-radius: 8px;
  }
  :where(.${SB_USER_AVATAR_CLASS}) {
    width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
    background: ${cv.borderRole.strong}; color: ${cv.textRole.inverse};
    display: inline-flex; align-items: center; justify-content: center;
    font-size: ${typeScale.body1.fontSize}px; line-height: 1.5;
    font-weight: ${fontWeight.semibold}; overflow: hidden;
  }
  :where(.${SB_USER_AVATAR_CLASS} img) { width: 100%; height: 100%; object-fit: cover; }
  :where(.${SB_USER_META_CLASS}) {
    flex: 1; min-width: 0; display: flex; flex-direction: column; gap: ${spacing[4]}px;
  }
  :where(.${SB_USER_NAME_CLASS}) {
    margin: 0; font-size: ${typeScale.body1.fontSize}px; line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.bold}; color: var(--nds-sidebar-text-active);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  :where(.${SB_USER_ROLE_CLASS}) {
    margin: 0; font-size: ${typeScale.caption1.fontSize}px; line-height: 18px;
    color: var(--nds-sidebar-text-subtle);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_USER_META_CLASS}) { display: none; }
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_USER_CLASS}) { justify-content: center; padding: ${spacing[4]}px; }

  /* ── 고정 계정 블록 (로고 아래) + 액션 버튼 (CTA 쌍 / 로그아웃) ───── */
  :where(.${SB_ACCOUNT_CLASS}) {
    display: flex; flex-direction: column; gap: ${spacing[12]}px;
    padding: 0 ${spacing[24]}px ${spacing[16]}px;
    box-sizing: border-box;
  }
  :where(.${SB_ACCOUNT_EMAIL_CLASS}) {
    margin: 0; font-size: ${typeScale.caption1.fontSize}px; line-height: 18px;
    color: var(--nds-sidebar-text-subtle);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  :where(.${SB_ACCOUNT_BALANCE_CLASS}) {
    display: flex; flex-direction: column; gap: ${spacing[4]}px;
    padding: ${spacing[12]}px ${spacing[16]}px; border-radius: 12px;
    background: ${cv.surface.section};
  }
  :where(.${SB_ACCOUNT_BALANCE_LABEL_CLASS}) {
    margin: 0; font-size: ${typeScale.caption1.fontSize}px; line-height: 16px;
    color: var(--nds-sidebar-text-subtle);
  }
  :where(.${SB_ACCOUNT_BALANCE_AMOUNT_CLASS}) {
    margin: 0; font-size: 20px; line-height: 26px; font-weight: ${fontWeight.bold};
    color: var(--nds-sidebar-text-active);
  }
  :where(.${SB_ACCOUNT_ACTIONS_CLASS}) { display: flex; gap: ${spacing[8]}px; }
  :where(.${SB_ACCOUNT_ACTIONS_CLASS} .${SB_ACTION_CLASS}) { flex: 1; }

  :where(.${SB_ACTION_CLASS}) {
    display: inline-flex; align-items: center; justify-content: center;
    height: 40px; padding: 0 ${spacing[16]}px; border-radius: 10px;
    border: 1px solid transparent; box-sizing: border-box;
    font-family: inherit; font-size: 14px; font-weight: ${fontWeight.semibold}; line-height: 1;
    text-decoration: none; cursor: pointer;
    transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease;
  }
  :where(.${SB_ACTION_CLASS}[data-variant="solid"]) {
    background: ${cv.button.bgDefault}; color: ${cv.button.textDefault};
  }
  :where(.${SB_ACTION_CLASS}[data-variant="solid"]:hover) { background: ${cv.button.bgHover}; }
  :where(.${SB_ACTION_CLASS}[data-variant="outlined"]) {
    background: ${cv.surface.default}; color: ${cv.textRole.brand}; border-color: ${cv.borderRole.brand};
  }
  :where(.${SB_ACTION_CLASS}[data-variant="outlined"]:hover) { background: ${cv.surface.brandSubtle}; }
  :where(.${SB_ACTION_CLASS}:focus-visible) { outline: 2px solid ${cv.borderRole.focus}; outline-offset: 1px; }

  :where(.${SB_FOOTER_ACTIONS_CLASS}) { display: flex; flex-direction: column; gap: ${spacing[8]}px; }
  :where(.${SB_FOOTER_ACTIONS_CLASS} .${SB_ACTION_CLASS}) { width: 100%; }

  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_ACCOUNT_CLASS}),
  :where(.${SB_ROOT_CLASS}[data-collapsed="true"] .${SB_FOOTER_ACTIONS_CLASS}) { display: none; }

  /*
   * CashwalkBiz 튜닝 (캐포비 Library MenuItem 3302:641 실측). react Sidebar.tsx 와 미러.
   * 색은 --semantic-* 토큰 cascade 가 SSOT — hex 로 박지 않는다:
   *   · active bg = var(--semantic-bg-brand-subtle) → cashwalk = Yellow/100 #FFFAE5 (cashwalk-biz.semantic.ts bg.brand.subtle)
   *   · accent    = var(--semantic-fill-brand)       → cashwalk = #FFD200 (미사용 dormant 슬롯)
   * 캐포비만 갈라지는 것은 시멘틱 색 토큰으로 표현 불가능한 둘뿐:
   *   1) active radius — base 는 idle 16 → active 12, 캐포비는 idle 과 동일 16 유지 (geometry).
   *   2) active 라벨 색 — base 는 strong(#111) darkening, 캐포비는 선택 시에도 normal(#333) 유지 (text role 선택).
   *   3) CTA / footer 액션 — base 는 solid=primary(노랑) · outlined=brand(노랑 보더 + 주황 텍스트).
   *      캐포비 어드민(Figma 3304:617 / Storybook SSOT)은 "시그니처 검정" 톤이고, account CTA 와 footer 가
   *      서로 다른 outlined 를 쓴다 → 새 토큰 슬롯 없이 account-actions / footer-actions 를 분리 타겟해
   *      기존 cv 토큰 + geometry(r8 · footer pill r28/h48)로 직접 정렬한다:
   *        · solid           = button secondary (bgSecondary #000 + textSecondary 흰), radius 8
   *        · account outlined = 검정 보더+텍스트 (textRole.strong #111), radius 8
   *        · footer outlined  = 회색 보더(borderRole.normal #EEE) + 텍스트 #111, pill radius 28 · height 48
   */
  :where([data-brand="cashwalk-biz"] .${SB_ROOT_CLASS}) {
    --nds-sidebar-item-active-radius: 16px;
    --nds-sidebar-text-active: ${cv.textRole.normal};
  }
  :where([data-brand="cashwalk-biz"] .${SB_ACTION_CLASS}) { border-radius: 8px; }
  :where([data-brand="cashwalk-biz"] .${SB_ACTION_CLASS}[data-variant="solid"]) {
    background: ${cv.button.bgSecondary}; color: ${cv.button.textSecondary};
  }
  :where([data-brand="cashwalk-biz"] .${SB_ACTION_CLASS}[data-variant="solid"]:hover) { background: ${cv.button.bgSecondaryHover}; }
  :where([data-brand="cashwalk-biz"] .${SB_ACCOUNT_ACTIONS_CLASS} .${SB_ACTION_CLASS}[data-variant="outlined"]) {
    color: ${cv.textRole.strong}; border-color: ${cv.textRole.strong};
  }
  :where([data-brand="cashwalk-biz"] .${SB_ACCOUNT_ACTIONS_CLASS} .${SB_ACTION_CLASS}[data-variant="outlined"]:hover) { background: ${cv.surface.subtle}; }
  :where([data-brand="cashwalk-biz"] .${SB_FOOTER_ACTIONS_CLASS} .${SB_ACTION_CLASS}[data-variant="outlined"]) {
    color: ${cv.textRole.strong}; border-color: ${cv.borderRole.normal}; border-radius: 28px; height: 48px;
  }
  :where([data-brand="cashwalk-biz"] .${SB_FOOTER_ACTIONS_CLASS} .${SB_ACTION_CLASS}[data-variant="outlined"]:hover) { background: ${cv.surface.subtle}; }
`;

const injectStyleOnce = (): void => {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = sidebarStyles;
  document.head.appendChild(style);
};

const CARET_SVG = `<svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const COLLAPSE_SVG = (collapsed: boolean): string =>
  `<svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true" style="${collapsed ? "transform: rotate(180deg);" : ""} transition: transform 0.18s;"><path d="M12 5l-5 5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 5v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;

export class NdsSidebar extends NdsElement {
  static elementName = "nds-sidebar";

  static get observedAttributes(): readonly string[] {
    return [
      "items",
      "active-key",
      "collapsed",
      "show-toggle",
      "width",
      "collapsed-width",
      "brand",
      "logo-src",
      "logo-alt",
      "logo-width",
      "logo-height",
      "logo-href",
      "title",
      "subtitle",
      "user",
      "account",
      "footer-actions",
      "full-height",
    ];
  }

  private _root: HTMLElement | null = null;
  /** key → expanded? for nested items. */
  private _expanded = new Map<string, boolean>();

  override connectedCallback(): void {
    injectStyleOnce();
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("aside");
    root.dataset.slot = "root";
    root.className = SB_ROOT_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  private _parseItems(): SidebarSection[] {
    // 1순위: 자식 <script type="application/json" slot="items"> — 속성이 아니라 텍스트
    //   노드라 따옴표/이스케이프 함정이 구조적으로 없다(권장 패턴, 단일파일 빌드에도 안전).
    // 2순위: items 속성(하위 호환).
    const script = this.querySelector<HTMLScriptElement>(
      'script[type="application/json"][slot="items"]',
    );
    const raw = script ? script.textContent : this.getAttribute("items");
    if (!raw || !raw.trim()) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return normalizeSections(parsed);
      console.warn("[nds-sidebar] items 가 JSON 배열이 아닙니다 — 메뉴를 비웁니다.", {
        rawHead: raw.slice(0, 80),
      });
    } catch (err) {
      // 조용히 [] 를 반환하면 "로고만 뜨고 메뉴가 통째로 사라지는" 디버깅 불가 증상이 된다.
      // 가장 흔한 원인: 단일따옴표 items 속성에서 JSON 구조용 따옴표까지 \" 로 과이스케이프
      //   (예: items='[{\"key\"...]'). 구조 따옴표는 bare 여야 하고 SVG 내부 따옴표만 \" 가 맞다.
      //   더 안전: <nds-sidebar><script type="application/json" slot="items">[...]</script>.
      console.warn(
        "[nds-sidebar] items 가 유효한 JSON 이 아닙니다 — 메뉴를 비웁니다. " +
          'JSON 구조용 따옴표를 \\" 로 이스케이프하지 마세요. ' +
          '가능하면 <script type="application/json" slot="items"> 자식을 쓰세요.',
        { error: err, rawHead: raw.slice(0, 80) },
      );
    }
    return [];
  }

  private _parseUser(): SidebarUser | null {
    const raw = this.getAttribute("user");
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && typeof parsed.name === "string") {
        return parsed as SidebarUser;
      }
    } catch {
      /* ignore */
    }
    return null;
  }

  private _parseAccount(): SidebarAccount | null {
    // items 와 동일 규약: 1순위 <script type="application/json" slot="account"> 텍스트 노드
    //   (한글 JSON 을 속성 이스케이프·인코딩 사고 없이 그대로 둘 수 있다), 2순위 account 속성.
    const script = this.querySelector<HTMLScriptElement>(
      'script[type="application/json"][slot="account"]',
    );
    const raw = script ? script.textContent : this.getAttribute("account");
    if (!raw || !raw.trim()) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as SidebarAccount;
      }
    } catch {
      console.warn(
        "[nds-sidebar] account 가 유효한 JSON 객체가 아닙니다 — 계정 블록을 생략합니다.",
        {
          rawHead: raw.slice(0, 80),
        },
      );
    }
    return null;
  }

  private _parseActions(slot: string): SidebarAction[] {
    // 1순위 <script type="application/json" slot="footer-actions"> 텍스트 노드, 2순위 동명 속성.
    const script = this.querySelector<HTMLScriptElement>(
      `script[type="application/json"][slot="${slot}"]`,
    );
    const raw = script ? script.textContent : this.getAttribute(slot);
    if (!raw || !raw.trim()) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (a): a is SidebarAction => !!a && typeof a === "object" && typeof a.label === "string",
        );
      }
    } catch {
      console.warn(`[nds-sidebar] ${slot} 가 유효한 JSON 배열이 아닙니다 — 액션을 생략합니다.`, {
        rawHead: raw.slice(0, 80),
      });
    }
    return [];
  }

  private _buildAction(action: SidebarAction): HTMLElement {
    const variant = action.variant === "solid" ? "solid" : "outlined";
    const el = action.href ? document.createElement("a") : document.createElement("button");
    el.className = SB_ACTION_CLASS;
    el.dataset.variant = variant;
    if (el instanceof HTMLButtonElement) el.type = "button";
    if (el instanceof HTMLAnchorElement && action.href) el.href = action.href;
    el.textContent = action.label;
    el.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("action-click", {
          detail: { key: action.key, action },
          bubbles: true,
          composed: true,
        }),
      );
    });
    return el;
  }

  private _renderItem(item: SidebarItem, activeKey: string | null, depth: number): HTMLLIElement {
    const li = document.createElement("li");
    li.className = SB_ITEM_CLASS;

    const hasChildren = !!item.children?.length;
    const isActive = activeKey === item.key;
    const expanded =
      this._expanded.get(item.key) ?? containsKey(item.children, activeKey ?? undefined);
    this._expanded.set(item.key, expanded);

    const inner =
      item.href && !hasChildren && !item.disabled
        ? document.createElement("a")
        : document.createElement("button");
    inner.className = SB_ITEM_INNER_CLASS;
    if (inner instanceof HTMLButtonElement) {
      inner.type = "button";
      inner.disabled = !!item.disabled;
    }
    if (inner instanceof HTMLAnchorElement && item.href) {
      inner.href = item.href;
    }
    if (isActive) inner.setAttribute("aria-current", "page");
    if (item.disabled) inner.setAttribute("aria-disabled", "true");
    if (hasChildren) inner.setAttribute("aria-expanded", String(expanded));
    inner.dataset.depth = String(depth);
    inner.title = item.label;

    if (item.icon) {
      const iconSpan = document.createElement("span");
      iconSpan.className = SB_ITEM_ICON_CLASS;
      iconSpan.setAttribute("aria-hidden", "true");
      iconSpan.innerHTML = item.icon;
      inner.appendChild(iconSpan);
    }

    const labelSpan = document.createElement("span");
    labelSpan.className = SB_ITEM_LABEL_CLASS;
    labelSpan.textContent = item.label;
    inner.appendChild(labelSpan);

    if (item.badge !== undefined && item.badge !== null) {
      const badge = document.createElement("span");
      badge.className = SB_ITEM_BADGE_CLASS;
      badge.textContent = String(item.badge);
      inner.appendChild(badge);
    }

    if (hasChildren) {
      const caret = document.createElement("span");
      caret.className = SB_ITEM_CARET_CLASS;
      caret.dataset.expanded = expanded ? "true" : "false";
      caret.innerHTML = CARET_SVG;
      inner.appendChild(caret);
    }

    inner.addEventListener("click", (e) => {
      if (item.disabled) return;
      if (hasChildren) {
        e.preventDefault();
        const cur = this._expanded.get(item.key) ?? false;
        this._expanded.set(item.key, !cur);
        this.scheduleUpdate();
        return;
      }
      this.dispatchEvent(
        new CustomEvent("item-click", {
          detail: { item },
          bubbles: true,
          composed: true,
        }),
      );
    });

    li.appendChild(inner);

    if (hasChildren && expanded) {
      const childUl = document.createElement("ul");
      childUl.className = SB_CHILDREN_CLASS;
      item.children!.forEach((c) => childUl.appendChild(this._renderItem(c, activeKey, depth + 1)));
      li.appendChild(childUl);
    }

    return li;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const collapsed = this.boolAttr("collapsed");
    const fullHeight = this.attr("full-height", "true") !== "false";
    const showToggle = this.boolAttr("show-toggle");
    const widthAttr = this.getAttribute("width");
    const collapsedWidthAttr = this.getAttribute("collapsed-width");
    const activeKey = this.getAttribute("active-key");
    const title = this.getAttribute("title");
    const subtitle = this.getAttribute("subtitle");
    // 로고: 명시 logo-src 가 1순위, 없으면 brand 속성으로 brand-logo-defaults 에서 자동 주입.
    //   → 35KB base64 를 손으로 붙일 필요가 사라져 "거대 블롭 추출 중 한글 깨짐 + 로고 유실" 회귀를 차단.
    const brand = this.getAttribute("brand");
    const brandLogo = brand ? SIDEBAR_BRAND_LOGOS[brand] : undefined;
    const logoSrc = this.getAttribute("logo-src") ?? brandLogo?.src ?? null;
    const logoAlt = this.getAttribute("logo-alt") ?? brandLogo?.alt ?? "";
    const logoWidth =
      this.getAttribute("logo-width") ?? (brandLogo ? String(brandLogo.width) : null);
    const logoHeight =
      this.getAttribute("logo-height") ?? (brandLogo ? String(brandLogo.height) : null);
    const logoHref = this.getAttribute("logo-href");
    const user = this._parseUser();
    const account = this._parseAccount();
    const footerActions = this._parseActions("footer-actions");
    const sections = this._parseItems();

    this._root.dataset.collapsed = collapsed ? "true" : "false";
    this._root.dataset.fullHeight = fullHeight ? "true" : "false";
    // brand 를 root 에 미러 → [data-brand="..."] 스코프 CSS(로고 사이즈 등)가
    // shell 래퍼 없이 standalone <nds-sidebar brand="..."> 에서도 적용된다.
    if (brand) this._root.dataset.brand = brand;
    if (widthAttr) this._root.style.setProperty("--nds-sidebar-width", `${widthAttr}px`);
    if (collapsedWidthAttr) {
      this._root.style.setProperty("--nds-sidebar-collapsed-width", `${collapsedWidthAttr}px`);
    }

    const children: Node[] = [];

    const hasHeader = !!(logoSrc || title || subtitle || showToggle);
    if (hasHeader) {
      const header = document.createElement("div");
      header.dataset.slot = "header";
      header.className = SB_HEADER_CLASS;

      if (logoSrc) {
        const logoWrap = logoHref ? document.createElement("a") : document.createElement("span");
        logoWrap.className = SB_LOGO_CLASS;
        if (logoWrap instanceof HTMLAnchorElement && logoHref) logoWrap.href = logoHref;
        if (logoAlt) logoWrap.setAttribute("aria-label", logoAlt);
        const img = document.createElement("img");
        img.src = logoSrc;
        img.alt = logoAlt;
        if (logoWidth) img.width = parseInt(logoWidth, 10);
        if (logoHeight) img.height = parseInt(logoHeight, 10);
        logoWrap.appendChild(img);
        header.appendChild(logoWrap);
      }

      if (title || subtitle) {
        const meta = document.createElement("div");
        meta.style.flex = "1";
        meta.style.minWidth = "0";
        if (title) {
          const p = document.createElement("p");
          p.className = SB_TITLE_CLASS;
          p.textContent = title;
          meta.appendChild(p);
        }
        if (subtitle) {
          const p = document.createElement("p");
          p.className = SB_SUBTITLE_CLASS;
          p.textContent = subtitle;
          meta.appendChild(p);
        }
        header.appendChild(meta);
      }

      if (showToggle) {
        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = SB_TOGGLE_CLASS;
        toggle.setAttribute("aria-label", collapsed ? "사이드바 펼치기" : "사이드바 접기");
        toggle.innerHTML = COLLAPSE_SVG(collapsed);
        toggle.addEventListener("click", () => {
          this.dispatchEvent(new CustomEvent("toggle-collapse", { bubbles: true, composed: true }));
        });
        header.appendChild(toggle);
      }

      children.push(header);
    }

    // 고정 계정 블록 (로고 아래, 메뉴 위) — 이메일 → 잔액 → CTA 쌍.
    if (account && (account.email || account.balance || account.actions?.length)) {
      const accountEl = document.createElement("div");
      accountEl.dataset.slot = "account";
      accountEl.className = SB_ACCOUNT_CLASS;

      if (account.email) {
        const email = document.createElement("p");
        email.className = SB_ACCOUNT_EMAIL_CLASS;
        email.textContent = account.email;
        accountEl.appendChild(email);
      }

      if (account.balance || account.balanceLabel) {
        const balance = document.createElement("div");
        balance.className = SB_ACCOUNT_BALANCE_CLASS;
        if (account.balanceLabel) {
          const label = document.createElement("p");
          label.className = SB_ACCOUNT_BALANCE_LABEL_CLASS;
          label.textContent = account.balanceLabel;
          balance.appendChild(label);
        }
        if (account.balance) {
          const amount = document.createElement("p");
          amount.className = SB_ACCOUNT_BALANCE_AMOUNT_CLASS;
          amount.textContent = account.balance;
          balance.appendChild(amount);
        }
        accountEl.appendChild(balance);
      }

      if (account.actions?.length) {
        const actions = document.createElement("div");
        actions.className = SB_ACCOUNT_ACTIONS_CLASS;
        account.actions.forEach((a) => actions.appendChild(this._buildAction(a)));
        accountEl.appendChild(actions);
      }

      children.push(accountEl);
    }

    const nav = document.createElement("nav");
    nav.dataset.slot = "body";
    nav.className = SB_BODY_CLASS;
    nav.setAttribute("aria-label", "사이드바 메뉴");
    sections.forEach((section) => {
      const sectionEl = document.createElement("div");
      sectionEl.className = SB_SECTION_CLASS;
      if (section.label) {
        const p = document.createElement("p");
        p.className = SB_SECTION_LABEL_CLASS;
        p.textContent = section.label;
        sectionEl.appendChild(p);
      }
      const ul = document.createElement("ul");
      ul.className = SB_ITEM_LIST_CLASS;
      section.items.forEach((it) => ul.appendChild(this._renderItem(it, activeKey, 0)));
      sectionEl.appendChild(ul);
      nav.appendChild(sectionEl);
    });
    children.push(nav);

    if (user || footerActions.length) {
      const footer = document.createElement("div");
      footer.dataset.slot = "footer";
      footer.className = SB_FOOTER_CLASS;

      if (user) {
        const userBlock = document.createElement("div");
        userBlock.className = SB_USER_CLASS;
        const avatar = document.createElement("span");
        avatar.className = SB_USER_AVATAR_CLASS;
        if (user.avatar) {
          const img = document.createElement("img");
          img.src = user.avatar;
          img.alt = user.avatarAlt ?? "";
          avatar.appendChild(img);
        } else {
          avatar.textContent = (user.name || "").slice(0, 1).toUpperCase();
        }
        const meta = document.createElement("div");
        meta.className = SB_USER_META_CLASS;
        const name = document.createElement("p");
        name.className = SB_USER_NAME_CLASS;
        name.textContent = user.name;
        meta.appendChild(name);
        if (user.role) {
          const role = document.createElement("p");
          role.className = SB_USER_ROLE_CLASS;
          role.textContent = user.role;
          meta.appendChild(role);
        }
        userBlock.append(avatar, meta);
        footer.appendChild(userBlock);
      }

      // 푸터 액션 (로그아웃 등) — 메뉴 스크롤과 분리된 하단 고정.
      if (footerActions.length) {
        const actions = document.createElement("div");
        actions.className = SB_FOOTER_ACTIONS_CLASS;
        footerActions.forEach((a) => actions.appendChild(this._buildAction(a)));
        footer.appendChild(actions);
      }

      children.push(footer);
    }

    this._root.replaceChildren(...children);
  }
}

define(NdsBrandHeader);
define(NdsBrandFooter);
define(NdsBrandBottomNav);
BRAND_KEYS.forEach(defineBrandAliases);
define(NdsSidebar);
