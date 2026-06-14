/**
 * Brand header 출력 구조 잠금.
 *
 * 이 파일의 단일 목적: `<nds-brand-header brand="...">` 출력이 각 브랜드 데스크톱 헤더의
 * 시각 요소(로고/메뉴/검색/CTA 등)를 항목별로 빠짐없이 들고 있는지 단단히 잠그는 것.
 *
 * 과거엔 공개 react 브랜드 chrome(GenietAppBar/TrostWebHeader 등)과의 1:1 정합 테스트였으나,
 * chrome 통합으로 react 브랜드 chrome 은 제거됐고 이제 `nds-brand-chrome` 의 BRAND_DATA 가
 * 브랜드 chrome 디자인 SSOT 다. nds-brand-chrome.test.ts 가 "기본 동작"이면 여기는 "브랜드별
 * 완성형 요소" — BRAND_DATA 가 의도한 요소를 빠뜨리면 여기 한 군데가 빨갛게 떠야 한다.
 *
 * 디자인 근거(Figma): 각 describe 블록 주석의 노드 id 참조.
 */

import { beforeEach, describe, expect, it } from "vitest";
import "../src/index.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

async function mount(attrs: Record<string, string>): Promise<HTMLElement> {
  const el = document.createElement("nds-brand-header");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  await flush();
  return el;
}

beforeEach(() => {
  document.body.innerHTML = "";
});

/* ──────────────────────────────────────────────────────────────────────────
 * Geniet — GenietDesktop (Figma 77:2)
 *   React: packages/react/src/geniet/AppBar.tsx (desktop variant)
 *   Story: AppBar.Geniet.stories.tsx → GenietDesktop
 *   Layout: Search Header(54h) + Menu Header(58h)
 *     Row1 = logo + search pill(500w) + trending + action 3종(쿠폰상점/마이페이지/로그인) + divider before mypage
 *     Row2 = category(음식 카테고리, 160w) + GNB(홈/커뮤니티/헬시딜/음식 리뷰/기록) + CTA(캐시리뷰 outline · 친구초대 tinted)
 * ────────────────────────────────────────────────────────────────────────── */

describe("Geniet desktop ↔ React GenietAppBar variant='desktop'", () => {
  it("renders the 2-tier shell (search header + menu header)", async () => {
    const el = await mount({ brand: "geniet", "active-key": "home" });
    expect(el.querySelector(".nds-brand-geniet--desktop")).toBeTruthy();
    expect(el.querySelector(".nds-brand-geniet__search-header")).toBeTruthy();
    expect(el.querySelector(".nds-brand-geniet__menu-header")).toBeTruthy();
  });

  it("search row: logo + search input(placeholder) + trending top + 3 action buttons + 1 divider", async () => {
    const el = await mount({ brand: "geniet", "active-key": "home" });
    /* logo — PC 로고 (165×54). src 는 외부 소비처가 별도 hosting 안 해도 깨지지
     * 않도록 base64 data URI 로 self-contained. */
    const logo = el.querySelector('.nds-brand-geniet__logo img[alt="Geniet"]') as HTMLImageElement;
    expect(logo?.getAttribute("src")).toMatch(/^data:image\/webp;base64,/);
    expect(logo?.getAttribute("width")).toBe("165");
    /* search input — fixture placeholder */
    const input = el.querySelector(".nds-brand-geniet__search-input input") as HTMLInputElement;
    expect(input?.placeholder).toBe("궁금한 음식 칼로리, 다이어트 후기 등을 검색해 보세요");
    /* trending top keyword */
    const trendingKeyword = el.querySelector(".nds-brand-geniet__trending-keyword");
    expect(trendingKeyword?.textContent).toBe("고단백 식단");
    expect(el.querySelector(".nds-brand-geniet__trending-stamp")?.textContent).toBe("09:00 기준");
    /* login_area — 3 action buttons */
    const actions = el.querySelectorAll(".nds-brand-geniet__action-btn");
    expect(actions.length).toBe(3);
    expect(Array.from(actions).map((a) => a.textContent?.trim())).toEqual([
      "쿠폰상점",
      "마이페이지",
      "로그인",
    ]);
    /* divider 는 마이페이지 앞에만 1개 (쿠폰상점 ↔ 마이페이지 그룹 구분) */
    expect(el.querySelectorAll(".nds-brand-geniet__action-divider").length).toBe(1);
  });

  it("menu row: category box + 5-item GNB (active='home') + CTA pills (outline + tinted)", async () => {
    const el = await mount({ brand: "geniet", "active-key": "home" });
    /* 음식 카테고리 박스 */
    const category = el.querySelector(".nds-brand-geniet__category");
    expect(category?.textContent).toContain("음식 카테고리");
    /* GNB 5탭 */
    const gnb = el.querySelectorAll(".nds-brand-geniet__gnb-item");
    expect(Array.from(gnb).map((g) => g.textContent?.trim())).toEqual([
      "홈",
      "커뮤니티",
      "헬시딜",
      "음식 리뷰",
      "기록",
    ]);
    /* 활성 GNB 강조 */
    const active = el.querySelector('.nds-brand-geniet__gnb-item[data-active="true"]');
    expect(active?.textContent?.trim()).toBe("홈");
    /* CTA pills */
    const ctas = el.querySelectorAll(".nds-brand-geniet__cta-pill");
    expect(ctas.length).toBe(2);
    expect(ctas[0].getAttribute("data-tone")).toBe("outline");
    expect(ctas[0].textContent).toContain("캐시리뷰");
    expect(ctas[1].getAttribute("data-tone")).toBe("tinted");
    expect(ctas[1].textContent).toContain("친구초대 이벤트");
  });
});

/* ──────────────────────────────────────────────────────────────────────────
 * Geniet — GenietMobile (Figma 77:2 · 360 × 102)
 *   React: packages/react/src/geniet/AppBar.tsx (mobile variant)
 *   Story: AppBar.Geniet.stories.tsx → GenietMobile
 *   Row1 = mobile logo + point chip + user / Row2 = hamburger + search input
 * ────────────────────────────────────────────────────────────────────────── */

describe("Geniet mobile ↔ React GenietAppBar variant='mobile'", () => {
  it("renders 2-tier mobile shell (row1 + row2) with mobile-specific logo asset", async () => {
    const el = await mount({ brand: "geniet", surface: "mobile" });
    expect(el.querySelector(".nds-brand-geniet--mobile")).toBeTruthy();
    expect(el.querySelector(".nds-brand-geniet__mo-row1")).toBeTruthy();
    expect(el.querySelector(".nds-brand-geniet__mo-row2")).toBeTruthy();
    /* mobile logo (97×32) — PC 로고와 다름. self-contained data URI. */
    const logo = el.querySelector(".nds-brand-geniet__mo-row1 img") as HTMLImageElement;
    expect(logo?.getAttribute("src")).toMatch(/^data:image\/webp;base64,/);
    expect(logo?.getAttribute("width")).toBe("97");
  });

  it("row1: point chip (34,300 + gpoint icon) + user button", async () => {
    const el = await mount({ brand: "geniet", surface: "mobile" });
    const chip = el.querySelector(".nds-brand-geniet__point-chip") as HTMLAnchorElement;
    expect(chip?.textContent).toContain("34,300");
    expect(chip?.querySelector("svg")).toBeTruthy(); // gpoint icon inline
    expect(el.querySelector('.nds-brand-geniet__mo-user[aria-label="사용자"]')).toBeTruthy();
  });

  it("row2: hamburger + search input (음식명/칼로리 placeholder)", async () => {
    const el = await mount({ brand: "geniet", surface: "mobile" });
    expect(
      el.querySelector('.nds-brand-geniet__mo-hamburger[aria-label="음식 카테고리"]'),
    ).toBeTruthy();
    const input = el.querySelector(".nds-brand-geniet__mo-search input") as HTMLInputElement;
    expect(input?.placeholder).toBe("음식명, 칼로리, 영양성분, 음식 리뷰 검색");
  });
});

/* ──────────────────────────────────────────────────────────────────────────
 * Trost — TrostWebHeaderDesktop (Zeplin Dp775xl)
 *   React: packages/react/src/trost/DesktopHeader.tsx (compound 3슬롯)
 *     · TrostEAPBanner (50h light blue, "기업 전용 멘탈케어" + 넛지EAP CTA)
 *     · TrostUtilityHeader (logo + yellow-border search 530w + login + app-dl)
 *     · TrostTabNavigation (70h, 6탭 중 "커뮤니티" isNew)
 *   Story: WebHeader.Trost.stories.tsx → TrostWebHeaderDesktop
 * ────────────────────────────────────────────────────────────────────────── */

describe("Trost web ↔ React TrostWebHeader (compound)", () => {
  it("EAP banner: strong + body text + CTA accent '넛지EAP'", async () => {
    const el = await mount({ brand: "trost" });
    const banner = el.querySelector(".nds-brand-trost-web__banner");
    expect(banner).toBeTruthy();
    expect(banner?.getAttribute("href")).toBe("https://eapkorea.co.kr/");
    const bannerText = el.querySelector(".nds-brand-trost-web__banner-text");
    expect(bannerText?.querySelector("strong")?.textContent).toBe("기업 전용 멘탈케어 프로그램");
    expect(bannerText?.textContent).toContain("도입하고 싶다면?");
    /* CTA accent 단어 '넛지EAP' 가 별도 span 으로 강조 */
    const ctaAccent = el.querySelector(".nds-brand-trost-web__banner-cta-label span");
    expect(ctaAccent?.textContent).toBe("넛지EAP");
  });

  it("utility header: logo + yellow-border search input (530w) + login(+상담사회원가입) + app-dl", async () => {
    const el = await mount({ brand: "trost" });
    /* logo — self-contained data URI (SVG base64). */
    const logo = el.querySelector(
      '.nds-brand-trost-web__utility-logo img[alt="Trost"]',
    ) as HTMLImageElement;
    expect(logo?.getAttribute("src")).toMatch(/^data:image\/svg\+xml;base64,/);
    /* search input */
    const search = el.querySelector(".nds-brand-trost-web__search input") as HTMLInputElement;
    expect(search?.placeholder).toBe("전문가, 상황, 증상 등을 검색해 보세요");
    /* React 정합: width 530 — inline style 아닌 css rule (computed 측정 대신 css 텍스트 확인) */
    const styleTag = document.querySelector(
      'style[data-nds-style="nds-brand-chrome-trost-web"]',
    ) as HTMLStyleElement | null;
    expect(styleTag?.textContent).toContain("width: 530px");
    /* login 2 buttons (로그인 + 상담사 회원가입) */
    const loginBtns = el.querySelectorAll(".nds-brand-trost-web__login-btn");
    expect(Array.from(loginBtns).map((b) => b.textContent?.trim())).toEqual([
      "로그인",
      "상담사 회원가입",
    ]);
    /* app download button */
    expect(el.querySelector(".nds-brand-trost-web__app-dl")?.textContent?.trim()).toBe(
      "앱 다운로드",
    );
  });

  it("tab navigation: 6 tabs, 'N' badge on 커뮤니티, active='/' → 홈", async () => {
    const el = await mount({ brand: "trost" });
    const tabs = el.querySelectorAll(".nds-brand-trost-web__tabnav-link");
    expect(tabs.length).toBe(6);
    expect(Array.from(tabs).map((t) => t.textContent?.replace("N", "").trim())).toEqual([
      "홈",
      "커뮤니티",
      "오늘의 명언/성경",
      "전문 심리상담",
      "심리검사",
      "약물치료",
    ]);
    /* "커뮤니티" 만 isNew badge */
    const newBadges = el.querySelectorAll(".nds-brand-trost-web__tabnav-new");
    expect(newBadges.length).toBe(1);
    expect(newBadges[0].closest(".nds-brand-trost-web__tabnav-link")?.textContent).toContain(
      "커뮤니티",
    );
    /* active = "/" */
    const active = el.querySelector('.nds-brand-trost-web__tabnav-link[data-active="true"]');
    expect(active?.textContent?.trim()).toBe("홈");
  });
});

/* ──────────────────────────────────────────────────────────────────────────
 * NudgeEAP — NudgeEAPWebHeaderDesktop (Figma 39:5751)
 *   React: packages/react/src/nudge-eap/WebHeader.tsx
 *     · 1-tier 80h, 메뉴 absolute 중앙정렬, appDownload(F5F5F5) + auth(brand border)
 *   Story: WebHeader.NudgeEAP.stories.tsx → NudgeEAPWebHeaderDesktop
 * ────────────────────────────────────────────────────────────────────────── */

describe("NudgeEAP web ↔ React NudgeEAPWebHeader", () => {
  it("renders 1-tier shell with 6 menu items + absolute-centered nav", async () => {
    const el = await mount({ brand: "nudge-eap", "active-key": "counsel" });
    expect(el.querySelector(".nds-brand-nudge-eap-web")).toBeTruthy();
    const menu = el.querySelectorAll(".nds-brand-nudge-eap-web__menu-item");
    expect(menu.length).toBe(6);
    expect(Array.from(menu).map((m) => m.textContent?.trim())).toEqual([
      "상담하기",
      "심리검사",
      "심리치료",
      "주간레터",
      "소식",
      "마이페이지",
    ]);
    /* active strong + brand color */
    const active = el.querySelector('.nds-brand-nudge-eap-web__menu-item[data-active="true"]');
    expect(active?.textContent?.trim()).toBe("상담하기");
    /* 메뉴 absolute centering 은 css rule 로 보장 */
    const styleTag = document.querySelector(
      'style[data-nds-style="nds-brand-chrome-nudge-eap-web"]',
    ) as HTMLStyleElement | null;
    expect(styleTag?.textContent).toContain("position: absolute");
    expect(styleTag?.textContent).toContain("translateX(-50%)");
  });

  it("right actions: app download (앱 다운로드) + login auth pill", async () => {
    const el = await mount({ brand: "nudge-eap" });
    const appDl = el.querySelector(".nds-brand-nudge-eap-web__app-dl") as HTMLAnchorElement;
    expect(appDl?.textContent).toBe("앱 다운로드");
    expect(appDl?.getAttribute("href")).toBe("/download");
    expect(el.querySelector(".nds-brand-nudge-eap-web__auth")?.textContent).toBe("로그인");
  });
});

/* ──────────────────────────────────────────────────────────────────────────
 * CashwalkBiz — CashwalkBizWebHeaderDesktop (Figma 380:1739 / 98:1082)
 *   React: packages/react/src/cashwalk-biz/WebHeader.tsx
 *     · 1-tier desktop (max 1600), yellow primary CTA pill (#FFD200, 36h, 8r)
 *     · mobile: logo + hamburger flex
 *   Story: AppBar.CashwalkBiz.stories.tsx → CashwalkBizWebHeaderDesktop / Mobile
 * ────────────────────────────────────────────────────────────────────────── */

describe("CashwalkBiz web ↔ React CashwalkBizWebHeader variant='desktop'", () => {
  it("renders 5-tab menu + login + yellow primary CTA pill (#FFD200)", async () => {
    const el = await mount({ brand: "cashwalk-biz", "active-key": "ad" });
    const menu = el.querySelectorAll(".nds-brand-cashwalk-biz__menu-item");
    expect(menu.length).toBe(5);
    // Figma 98:1082 마케팅 GNB 5탭 (Storybook SSOT). nds-brand-chrome.ts webMenu 와 일치.
    expect(Array.from(menu).map((m) => m.textContent?.trim())).toEqual([
      "채널",
      "광고",
      "성공사례",
      "공지사항",
      "이용방법",
    ]);
    /* primary CTA — yellow pill */
    const cta = el.querySelector(".nds-brand-cashwalk-biz__primary-cta") as HTMLAnchorElement;
    expect(cta?.textContent).toBe("광고 시작하기");
    expect(cta?.getAttribute("href")).toBe("/start");
    /* yellow #FFD200 is the brand signature — css rule 에 박혀 있어야 함 */
    const styleTag = document.querySelector(
      'style[data-nds-style="nds-brand-chrome-cashwalk-biz"]',
    ) as HTMLStyleElement | null;
    expect(styleTag?.textContent).toContain("#ffd200");
  });
});

describe("CashwalkBiz mobile ↔ React CashwalkBizWebHeader variant='mobile'", () => {
  it("renders compact bar: logo (74×24) + hamburger", async () => {
    const el = await mount({ brand: "cashwalk-biz", surface: "mobile" });
    expect(el.querySelector(".nds-brand-cashwalk-biz__inner--mobile")).toBeTruthy();
    const logo = el.querySelector('img[alt="Cashwalk for Business"]') as HTMLImageElement;
    expect(logo?.getAttribute("width")).toBe("74");
    expect(el.querySelector('.nds-brand-cashwalk-biz__hamburger[aria-label="메뉴"]')).toBeTruthy();
    /* 메뉴/CTA 는 모바일에서 미노출 */
    expect(el.querySelector(".nds-brand-cashwalk-biz__menu")).toBeNull();
    expect(el.querySelector(".nds-brand-cashwalk-biz__primary-cta")).toBeNull();
  });
});
