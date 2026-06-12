/**
 * 브랜드별 헤더/푸터 콘텐츠 데이터
 *
 * AppBar / AppFooter 컴파운드 서브 컴포넌트 props와 1:1 매핑.
 * 로고 이미지는 Vite asset import로 가져와 빌드 시 base path가 자동 반영됩니다.
 */

import type {
  FooterLinkItem,
  HeaderMenuItemData,
  HeaderAuthMenuItem,
  CompanyInfoData,
  TrendingKeywordItem,
} from "@nudge-design/react";
import { getBrandLogo } from "@nudge-design/assets";

/* ─── Logo asset URLs ─── */
/**
 * 브랜드 로고는 `@nudge-design/assets` 가 SSOT 이며, Storybook 은 `src/files` 를
 * `/assets/*` 로 정적 마운트해서 서빙한다 (.storybook/main.ts staticDirs).
 * 따라서 모듈 import 가 아니라 마운트 URL 로 참조한다.
 * `BASE_URL` prefix 로 프로덕션 base("/storybook/") 까지 자동 반영.
 */
const ASSET_BASE = `${import.meta.env.BASE_URL}assets/`;
const assetUrl = (filename: string | undefined): string => `${ASSET_BASE}${filename ?? ""}`;

/**
 * Figma 698:87 (NudgeEAP Library) Logo Guide 의 Symbol + KO+EN horizontal (대표 로고).
 * @nudge-design/assets 의 scalable SVG (getBrandLogo("nudge-eap", "koEnHorizontal")).
 * NudgeEAP 헤더는 내장 vector 로고를 기본 사용하고, 이 fixture 는 목업/푸터 fallback 용.
 */
const nudgeEapHeaderLogo = assetUrl(getBrandLogo("nudge-eap", "koEnHorizontal")?.filename);
const trostLogo = assetUrl(getBrandLogo("trost")?.filename);
const trostLogoMobile = assetUrl(getBrandLogo("trost", "mobile")?.filename);
const genietLogoPc = assetUrl(getBrandLogo("geniet", "pc")?.filename);
const genietLogoMobile = assetUrl(getBrandLogo("geniet", "mobile")?.filename);
const genietLogoFooter = assetUrl(getBrandLogo("geniet", "footer")?.filename);
const cashwalkVertical = assetUrl(getBrandLogo("cashwalk-biz", "vertical")?.filename);
/**
 * Figma 9lJ9XCwVYFSoZGcmRuJtI4 / 98:1082 — 캐포비 admin GNB 의 logo_cfb_horizontal.
 * cashwalk wordmark + 'for business' 텍스트 + 신발 마스코트가 합쳐진 헤더 전용 lockup (106.667 × 32).
 * 라이브러리 horizontal(cashwalk only) 과는 별개 — 헤더용 lockup 으로 신규 등록.
 */
const cashwalkForBusinessHorizontal = assetUrl(
  getBrandLogo("cashwalk-biz", "horizontalSvg")?.filename,
);

/* ─── Types ─── */

export interface BrandFixture {
  logo: {
    headerPc: { src: string; width: number; height: number };
    headerMobile: { src: string; width: number; height: number };
    footer: { src: string; width: number; height: number };
  };
  header: {
    pcMaxWidth: number;
    mainBarPaddingY: string; // CSS value e.g. "20px 0"
    mobileHeight: number;
    webviewTitle: string;
    /** 1-tier (NudgeEAP) vs 2-tier (Trost/Geniet) */
    layout: "single" | "double";
    searchBar?: {
      width: number;
      height: number;
      placeholder: string;
    };
    gnb: {
      items: HeaderMenuItemData[];
      navHeight: number;
    };
    /** 인기검색어 (NavBar 우측에 표시) */
    trending?: TrendingKeywordItem[];
    auth: {
      items: HeaderAuthMenuItem[];
      separator: "divider" | "none";
      hasAppDownload?: boolean;
    };
  };
  footer: {
    links: FooterLinkItem[];
    company: CompanyInfoData;
    extra?: string;
    darkBg?: boolean;
  };
  tabBar: {
    tabLabels: string[];
    defaultActive: number;
    useShadow?: boolean;
  };
}

/* ─── NudgeEAP ─── */

const nudgeEap: BrandFixture = {
  logo: {
    /* Figma 698:87 — KO+EN horizontal 대표 로고 (Symbol + 한글 + 영문, 124×28 자체 비율). */
    headerPc: { src: nudgeEapHeaderLogo, width: 124, height: 28 },
    headerMobile: { src: nudgeEapHeaderLogo, width: 124, height: 28 },
    footer: { src: nudgeEapHeaderLogo, width: 100, height: 23 },
  },
  header: {
    pcMaxWidth: 1200,
    mainBarPaddingY: "0",
    mobileHeight: 52,
    webviewTitle: "심리검사 결과",
    layout: "single",
    /**
     * Figma 39:5751 (NudgeEAP Dev — PC 헤더): 좌측 로고 + 중앙 6탭 GNB + 우측 앱다운로드/로그인.
     */
    gnb: {
      items: [
        { key: "counsel", label: "상담하기", href: "/counsel" },
        { key: "test", label: "심리검사", href: "/test" },
        { key: "therapy", label: "심리치료", href: "/therapy" },
        { key: "letter", label: "주간레터", href: "/letter" },
        { key: "news", label: "소식", href: "/news" },
        { key: "my", label: "마이페이지", href: "/my" },
      ],
      navHeight: 79,
    },
    auth: {
      items: [{ key: "login", label: "로그인" }],
      separator: "none",
      hasAppDownload: true,
    },
  },
  footer: {
    links: [
      { label: "고객센터", href: "#" },
      { label: "개인정보 처리방침", href: "#", bold: true },
      { label: "서비스 이용약관", href: "#" },
      { label: "위치기반 서비스 이용약관", href: "#" },
    ],
    company: {
      name: "(주)다인",
      address: "서울특별시 강남구 역삼로1길 8, 5층 (역삼동, 넛지캠퍼스빌딩)",
      bizNumber: "101-86-16191",
      phone: "02-2268-5980",
      email: "dain@nudgeeap.io",
      copyright: "© 2023 Dain Co.Ltd., All Rights Reserved",
    },
  },
  /**
   * Figma 20:3331 (NudgeEAP Dev — 앱 BottomNav): 5탭 (홈/챌린지/상담/멘탈케어/내 공간).
   * 기존 3탭 (홈/심리샵/마이) 가이드는 deprecated.
   */
  tabBar: {
    tabLabels: ["홈", "챌린지", "상담", "멘탈케어", "내 공간"],
    defaultActive: 0,
  },
};

/* ─── Trost ─── */

const trost: BrandFixture = {
  logo: {
    headerPc: { src: trostLogo, width: 90, height: 36 },
    headerMobile: { src: trostLogoMobile, width: 80, height: 28 },
    footer: { src: trostLogo, width: 72, height: 28 },
  },
  header: {
    pcMaxWidth: 1080,
    mainBarPaddingY: "20px",
    mobileHeight: 56,
    webviewTitle: "마음건강 검사",
    layout: "double",
    searchBar: {
      width: 530,
      height: 48,
      placeholder: "전문가, 상황, 증상 등을 검색해 보세요",
    },
    gnb: {
      items: [
        { key: "home", label: "홈", href: "/" },
        { key: "community", label: "커뮤니티", href: "/community" },
        { key: "quotes", label: "오늘의 명언/성경", href: "/quotes" },
        { key: "counsel", label: "전문 심리상담", href: "/counsel" },
        { key: "test", label: "심리검사", href: "/test" },
        { key: "medicine", label: "약물치료", href: "/medicine" },
      ],
      navHeight: 70,
    },
    auth: {
      items: [
        { key: "login", label: "로그인" },
        { key: "signup", label: "상담사 회원가입" },
      ],
      separator: "none",
      hasAppDownload: true,
    },
    trending: [
      { rank: 1, trend: "new", keyword: "불면증 극복" },
      { rank: 2, trend: "up", keyword: "마음챙김 명상" },
      { rank: 3, trend: "same", keyword: "자존감 높이기" },
      { rank: 4, trend: "up", keyword: "분노조절" },
      { rank: 5, trend: "down", keyword: "커플상담" },
    ],
  },
  footer: {
    links: [
      { label: "이용약관 & 개인정보처리방침", href: "#", bold: true },
      { label: "위치기반 서비스 이용약관", href: "#" },
    ],
    company: {
      name: "(주)다인",
      address: "서울특별시 강남구 역삼로1길 8, 5층",
      bizNumber: "101-86-16191",
      phone: "02-2268-5980",
      email: "dain@nudgeeap.io",
      copyright: "© 2024 Dain Co.Ltd., All Rights Reserved",
    },
    extra: "긴급 위기상담 전화: 자살예방 상담전화 1393 / 정신건강 위기상담 전화 1577-0199",
    darkBg: true,
  },
  tabBar: {
    // 트로스트는 앱이 두 종류 → BottomNav 도 두 variant.
    //  · variant="trost" (기본, 아래 tabLabels): 신규 트로스트 앱 — Figma 5:1169.
    //  · variant="cashwalk-trost": (캐시워크)트로스트 앱 (홈/사운드/내음악/커뮤니티/마이페이지)
    //    — Figma 5:1249·5:1306. (캐시워크) 탭은 BottomNav.Trost 스토리에서 직접 렌더.
    tabLabels: ["홈", "심리상담", "커뮤니티", "멘탈케어", "내공간"],
    defaultActive: 0,
  },
};

/* ─── Geniet ─── */

const geniet: BrandFixture = {
  logo: {
    headerPc: { src: genietLogoPc, width: 165, height: 54 },
    headerMobile: { src: genietLogoMobile, width: 97, height: 32 },
    footer: { src: genietLogoFooter, width: 166, height: 48 },
  },
  header: {
    /* Figma 77:2 — Geniet_TopHeader_Guide
     *   Desktop 1920 × 172 (pad-top 40 + Search 54 + gap 20 + Menu 58)
     *   Mobile  360  × 102 (Row1 50 + Row2 52)
     */
    pcMaxWidth: 1280,
    mainBarPaddingY: "40px 0 0",
    mobileHeight: 102,
    webviewTitle: "건강 기록",
    layout: "double",
    searchBar: {
      width: 500,
      height: 54,
      placeholder: "궁금한 음식 칼로리, 다이어트 후기 등을 검색해 보세요",
    },
    gnb: {
      items: [
        { key: "home", label: "홈", href: "/" },
        { key: "community", label: "커뮤니티", href: "/community" },
        { key: "deal", label: "헬시딜", href: "/cashdeal" },
        { key: "review", label: "음식 리뷰", href: "/reviews" },
        { key: "record", label: "기록", href: "/record" },
      ],
      navHeight: 58,
    },
    auth: {
      items: [
        { key: "coupon", label: "쿠폰상점" },
        { key: "mypage", label: "마이페이지" },
        { key: "login", label: "로그인" },
      ],
      separator: "divider",
    },
    trending: [
      { rank: 1, trend: "new", keyword: "고단백 식단" },
      { rank: 2, trend: "up", keyword: "다이어트 레시피" },
      { rank: 3, trend: "same", keyword: "운동 후 식사" },
      { rank: 4, trend: "down", keyword: "저탄수화물" },
      { rank: 5, trend: "up", keyword: "혈당 관리" },
    ],
  },
  footer: {
    links: [
      { label: "이용약관", href: "#" },
      { label: "개인정보처리방침", href: "#", bold: true },
      { label: "고객 문의", href: "mailto:geniet_app@geniet.co.kr" },
    ],
    company: {
      name: "넛지모바일 주식회사",
      ceo: "한상범",
      address: "서울시 강남구 테헤란로20길 18, 6층(역삼동, 부봉빌딩)",
      bizNumber: "897-87-02757",
      email: "geniet_app@geniet.co.kr",
      copyright: "Copyright 2024 by Geniet, Inc. ALL Rights Reserved",
    },
    extra:
      "지니어트는 통신판매중개자이며 통신판매의 당사자가 아닙니다. 따라서 지니어트는 상품 거래정보 및 거래에 대하여 책임을 지지 않습니다.",
  },
  tabBar: {
    // Figma 207:3204 (platform=app(geniet)) — 5탭 구성. "기록" 은 Geniet 만의 핵심 탭.
    tabLabels: ["홈", "기록", "혜택", "리뷰", "커뮤니티"],
    defaultActive: 0,
    useShadow: true,
  },
};

/**
 * CashwalkBiz (캐포비 · 캐시워크 for Business)
 *
 * 로고 가이드: 캐포비 Library 3154:550 — 2 lockups (Vertical / Horizontal) · Brown #5E5050.
 * - Horizontal: GNB / 컴팩트 헤더 / 이메일 / 문서·인쇄용 헤더
 * - Vertical: 로그인·스플래시 / 운영 페이지 푸터
 *
 * Admin 데스크톱 위주이지만 BrandFixture 의 모바일 슬롯도 horizontal lockup 으로 통일.
 */
const cashwalkBiz: BrandFixture = {
  logo: {
    /* Figma 9lJ9XCwVYFSoZGcmRuJtI4: PC GNB 98:1082 의 logo_cfb_horizontal = 107 × 32,
     * Mobile GNB 380:1121 의 logo_cfb_horizontal = 80 × 24 (정확 실측). */
    headerPc: { src: cashwalkForBusinessHorizontal, width: 107, height: 32 },
    headerMobile: { src: cashwalkForBusinessHorizontal, width: 80, height: 24 },
    footer: { src: cashwalkVertical, width: 117, height: 60 },
  },
  header: {
    pcMaxWidth: 1600, // Layout/MaxContent (캐포비 admin 콘텐츠 max-width)
    mainBarPaddingY: "16px 0",
    /* Figma 380:1119 — Mobile GNB 360 × 54 (status bar 24 제외, padding-x 16). */
    mobileHeight: 54,
    webviewTitle: "캐시워크 for Business",
    layout: "single",
    gnb: { items: [], navHeight: 54 },
    auth: { items: [], separator: "divider" },
  },
  footer: {
    links: [{ label: "이용약관", href: "#" }],
    company: {
      name: "캐시워크 주식회사",
      ceo: "",
      address: "",
      bizNumber: "",
      email: "",
      copyright: "Copyright Cashwalk Inc. ALL Rights Reserved",
    },
  },
  tabBar: {
    tabLabels: ["홈"],
    defaultActive: 0,
    useShadow: false,
  },
};

/**
 * Runmile (런마일 · 러닝 대회 정보/커뮤니티)
 *
 * Figma SSOT: udH9ME1HnHk4kbxR17Neig (런마일 library)
 *   - Colors    60:1245
 *   - Typography 63:447
 *   - BottomNav  83:887  — 4탭 (홈/대회정보/커뮤니티/마이페이지)
 *
 * Header/Footer 가이드는 아직 없음 — 추후 추가.
 */
const runmile: BrandFixture = {
  logo: {
    headerPc: { src: "", width: 0, height: 0 },
    headerMobile: { src: "", width: 0, height: 0 },
    footer: { src: "", width: 0, height: 0 },
  },
  header: {
    pcMaxWidth: 1200,
    mainBarPaddingY: "0",
    mobileHeight: 52,
    webviewTitle: "런마일",
    layout: "single",
    gnb: { items: [], navHeight: 52 },
    auth: { items: [], separator: "none" },
  },
  footer: {
    links: [],
    company: {
      name: "런마일",
      address: "",
      bizNumber: "",
      email: "",
      copyright: "",
    },
  },
  tabBar: {
    // Figma 1221:64046 bottomnavi5 — 5탭 (채팅 신설, 커뮤니티/마이페이지 아이콘 교체).
    tabLabels: ["홈", "대회정보", "커뮤니티", "채팅", "마이페이지"],
    defaultActive: 0,
    useShadow: true,
  },
};

/* ─── Export ─── */

export const brandFixtures: Record<string, BrandFixture> = {
  "nudge-eap": nudgeEap,
  trost,
  geniet,
  "cashwalk-biz": cashwalkBiz,
  runmile,
};

export function getBrandFixture(brandKey: string): BrandFixture {
  return brandFixtures[brandKey] || brandFixtures["nudge-eap"];
}
