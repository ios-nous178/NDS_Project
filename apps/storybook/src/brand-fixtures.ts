/**
 * 브랜드별 헤더/푸터 콘텐츠 데이터
 *
 * AppBar / AppFooter 컴파운드 서브 컴포넌트 props와 1:1 매핑.
 * 로고 이미지는 Vite asset import로 가져와 빌드 시 base path가 자동 반영됩니다.
 */

import type {
  FooterLinkItem,
  AppBarGNBItem,
  AppBarAuthMenuItem,
  CompanyInfoData,
  TrendingKeywordItem,
} from "@nudge-eap/react";

/* ─── Logo asset imports (Vite resolves base path automatically) ─── */
import nudgeEapLogo from "../public/brand-logos/nudge-eap-logo.png";
import nudgeEapLogoFooter from "../public/brand-logos/nudge-eap-logo-footer.png";
import trostLogo from "../public/brand-logos/trost-logo.svg";
import trostLogoMobile from "../public/brand-logos/trost-logo-mobile.webp";
import genietLogoPc from "../public/brand-logos/geniet-logo-pc.webp";
import genietLogoMobile from "../public/brand-logos/geniet-logo-mobile.webp";
import genietLogoFooter from "../public/brand-logos/geniet-logo-footer.webp";

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
      items: AppBarGNBItem[];
      navHeight: number;
    };
    /** 인기검색어 (NavBar 우측에 표시) */
    trending?: TrendingKeywordItem[];
    auth: {
      items: AppBarAuthMenuItem[];
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
    headerPc: { src: nudgeEapLogo, width: 200, height: 80 },
    headerMobile: { src: nudgeEapLogo, width: 120, height: 24 },
    footer: { src: nudgeEapLogoFooter, width: 99, height: 30 },
  },
  header: {
    pcMaxWidth: 1200,
    mainBarPaddingY: "0",
    mobileHeight: 52,
    webviewTitle: "심리검사 결과",
    layout: "single",
    gnb: {
      items: [
        { key: "home", label: "홈", href: "/" },
        { key: "test", label: "심리검사", href: "/test" },
        { key: "counsel", label: "상담신청", href: "/counsel" },
        { key: "my", label: "마이페이지", href: "/my" },
      ],
      navHeight: 80,
    },
    auth: {
      items: [{ key: "login", label: "로그인" }],
      separator: "none",
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
  tabBar: {
    tabLabels: ["홈", "심리샵", "마이"],
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
      placeholder: "상담사, 상황, 증상 등 지금 내 고민을 검색해 보세요.",
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
    tabLabels: ["홈", "사운드", "내음악", "커뮤니티", "마이페이지"],
    defaultActive: 0,
  },
};

/* ─── Moneple ─── */

const moneple: BrandFixture = {
  logo: {
    headerPc: { src: trostLogo, width: 90, height: 36 },
    headerMobile: { src: trostLogoMobile, width: 80, height: 28 },
    footer: { src: trostLogo, width: 72, height: 28 },
  },
  header: {
    pcMaxWidth: 1080,
    mainBarPaddingY: "16px",
    mobileHeight: 52,
    webviewTitle: "커뮤니티",
    layout: "double",
    searchBar: {
      width: 530,
      height: 44,
      placeholder: "궁금한 내용을 검색해 보세요.",
    },
    gnb: {
      items: [
        { key: "home", label: "홈", href: "/" },
        { key: "community", label: "커뮤니티", href: "/community" },
        { key: "best", label: "인기글", href: "/best" },
        { key: "topic", label: "토픽", href: "/topic" },
      ],
      navHeight: 56,
    },
    auth: {
      items: [
        { key: "login", label: "로그인" },
        { key: "signup", label: "회원가입" },
      ],
      separator: "none",
    },
    trending: [
      { rank: 1, trend: "new", keyword: "오늘의 고민" },
      { rank: 2, trend: "up", keyword: "직장생활" },
      { rank: 3, trend: "same", keyword: "건강관리" },
      { rank: 4, trend: "up", keyword: "재테크" },
      { rank: 5, trend: "down", keyword: "취미생활" },
    ],
  },
  footer: {
    links: [
      { label: "이용약관", href: "#" },
      { label: "개인정보처리방침", href: "#", bold: true },
      { label: "고객센터", href: "#" },
    ],
    company: {
      name: "Moneple",
      address: "서울특별시 강남구",
      bizNumber: "000-00-00000",
      email: "support@moneple.example",
      copyright: "© Moneple. All Rights Reserved",
    },
  },
  tabBar: {
    tabLabels: ["홈", "커뮤니티", "알림", "마이"],
    defaultActive: 1,
  },
};

/* ─── Geniet ─── */

const geniet: BrandFixture = {
  logo: {
    headerPc: { src: genietLogoPc, width: 165, height: 54 },
    headerMobile: { src: genietLogoMobile, width: 97, height: 28 },
    footer: { src: genietLogoFooter, width: 166, height: 48 },
  },
  header: {
    pcMaxWidth: 1280,
    mainBarPaddingY: "40px 0 20px",
    mobileHeight: 50,
    webviewTitle: "건강 기록",
    layout: "double",
    searchBar: {
      width: 540,
      height: 54,
      placeholder: "음식, 식당, 레시피를 검색해 보세요",
    },
    gnb: {
      items: [
        { key: "home", label: "홈", href: "/" },
        { key: "community", label: "커뮤니티", href: "/community" },
        { key: "deal", label: "헬시딜", href: "/cashdeal" },
        { key: "review", label: "음식 리뷰", href: "/reviews" },
        { key: "invite", label: "친구초대", href: "/friend-invite" },
        { key: "coupon", label: "쿠폰상점", href: "/coupon-shop" },
      ],
      navHeight: 56,
    },
    auth: {
      items: [
        { key: "login", label: "로그인" },
        { key: "signup", label: "회원가입" },
        { key: "my", label: "마이페이지" },
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
    tabLabels: ["홈", "커뮤니티", "헬시딜", "음식 리뷰"],
    defaultActive: 0,
    useShadow: true,
  },
};

/* ─── Export ─── */

export const brandFixtures: Record<string, BrandFixture> = {
  "nudge-eap": nudgeEap,
  trost,
  moneple,
  geniet,
};

export function getBrandFixture(brandKey: string): BrandFixture {
  return brandFixtures[brandKey] || brandFixtures["nudge-eap"];
}
