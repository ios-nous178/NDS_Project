/**
 * Brand chrome wrappers for mockup-first HTML usage.
 *
 * Generic:
 *   <nds-brand-header brand="trost" surface="web"></nds-brand-header>
 *   <nds-brand-footer brand="trost" surface="web"></nds-brand-footer>
 *   <nds-brand-header brand="geniet" asset-base-url="/brand-logos"></nds-brand-header>
 *
 * Aliases:
 *   <nds-trost-header></nds-trost-header>
 *   <nds-trost-footer></nds-trost-footer>
 */

import { NdsElement, define } from "../base/nds-element.js";
import "./nds-header.js";
import "./nds-footer.js";

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

interface BrandChrome {
  label: string;
  logo: BrandLogo;
  footerLogo?: BrandLogo;
  maxWidth: number;
  webMenu: MenuItem[];
  mobileTitle: string;
  searchPlaceholder?: string;
  primaryAction?: { label: string; href: string };
  authLabel?: string;
  footerTone: "light" | "dark";
  footerSurface: FooterSurface;
  footerLinks: FooterLink[];
  company: CompanyData;
  extra?: string;
}

const BRAND_DATA: Record<BrandKey, BrandChrome> = {
  "nudge-eap": {
    label: "NudgeEAP",
    logo: {
      src: "nudge-eap-logo.png",
      alt: "NudgeEAP",
      width: 126,
      height: 40,
    },
    footerLogo: {
      src: "nudge-eap-logo-footer.png",
      alt: "NudgeEAP",
      width: 126,
      height: 40,
    },
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
    primaryAction: { label: "앱 다운로드", href: "/download" },
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
  },
  trost: {
    label: "Trost",
    logo: {
      src: "trost-logo.svg",
      alt: "Trost",
      width: 90,
      height: 36,
    },
    maxWidth: 1080,
    webMenu: [
      { key: "home", label: "홈", href: "/" },
      { key: "counsel", label: "상담", href: "/counsel" },
      { key: "test", label: "심리검사", href: "/tests" },
      { key: "care", label: "마음케어", href: "/care" },
      { key: "center", label: "상담센터", href: "/center" },
    ],
    mobileTitle: "Trost",
    searchPlaceholder: "심리검사, 상담, 마음챙김을 검색해보세요.",
    primaryAction: { label: "앱 다운로드", href: "/download" },
    authLabel: "로그인",
    footerTone: "dark",
    footerSurface: "app",
    footerLinks: [
      { label: "이용약관", href: "/terms" },
      { label: "개인정보처리방침", href: "/privacy", bold: true },
      { label: "고객센터", href: "/support" },
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
    extra: "전문가 상담과 마음관리 콘텐츠를 제공합니다.",
  },
  geniet: {
    label: "Geniet",
    logo: {
      src: "geniet-logo-pc.webp",
      alt: "Geniet",
      width: 110,
      height: 36,
    },
    footerLogo: {
      src: "geniet-logo-footer.webp",
      alt: "Geniet",
      width: 125,
      height: 36,
    },
    maxWidth: 1200,
    webMenu: [
      { key: "home", label: "홈", href: "/" },
      { key: "community", label: "커뮤니티", href: "/community" },
      { key: "deal", label: "헬시딜", href: "/cashdeal" },
      { key: "review", label: "음식 리뷰", href: "/reviews" },
    ],
    mobileTitle: "Geniet",
    searchPlaceholder: "음식명, 칼로리...",
    primaryAction: { label: "캐시리뷰", href: "/reviews" },
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
    extra: "통신판매중개자로서 상품 거래 정보 및 거래에 대한 책임은 판매자에게 있습니다.",
  },
  cashpobi: {
    label: "Cashpobi",
    logo: {
      src: "cashpobi/cashwalk-for-business-horizontal.svg",
      alt: "Cashwalk for Business",
      width: 107,
      height: 32,
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
    primaryAction: { label: "광고 시작하기", href: "/start" },
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
  },
};

const BRAND_KEYS = Object.keys(BRAND_DATA) as BrandKey[];

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

function renderLogo(logo: BrandLogo, assetBaseUrl: string): string {
  const src = resolveAssetUrl(assetBaseUrl, logo.src);
  return `<img src="${escapeAttr(src)}" alt="${escapeAttr(logo.alt)}" width="${logo.width}" height="${logo.height}" style="display:block;width:${logo.width}px;height:${logo.height}px;object-fit:contain;" />`;
}

function renderHeader(
  brandKey: BrandKey,
  surface: HeaderSurface,
  activeKey: string,
  assetBaseUrl: string,
): string {
  const brand = BRAND_DATA[brandKey];

  if (surface === "webview") {
    return `
      <nds-header variant="webview" header-title="${escapeAttr(brand.mobileTitle)}">
        <nds-icon-button slot="left" aria-label="뒤로가기">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18L9 12L15 6"/></svg>
        </nds-icon-button>
      </nds-header>
    `;
  }

  if (surface === "mobile") {
    return `
      <nds-header variant="compact" header-title="${escapeAttr(brand.mobileTitle)}">
        <nds-header-logo slot="left" href="/">${renderLogo(brand.logo, assetBaseUrl)}</nds-header-logo>
        <nds-header-actions slot="right">
          <nds-header-auth-button label="${escapeAttr(brand.authLabel ?? "로그인")}"></nds-header-auth-button>
        </nds-header-actions>
      </nds-header>
    `;
  }

  const menu = brand.webMenu
    .map(
      (item) =>
        `<nds-header-menu-item href="${escapeAttr(item.href)}" ${
          item.key === activeKey ? "active" : ""
        }>${escapeHtml(item.label)}</nds-header-menu-item>`,
    )
    .join("");
  const primaryAction = brand.primaryAction
    ? `<nds-header-auth-button label="${escapeAttr(brand.primaryAction.label)}" href="${escapeAttr(
        brand.primaryAction.href,
      )}"></nds-header-auth-button>`
    : "";

  return `
    <nds-header variant="web" position="static" max-width="${brand.maxWidth}">
      <nds-header-logo href="/">${renderLogo(brand.logo, assetBaseUrl)}</nds-header-logo>
      <nds-header-menu>${menu}</nds-header-menu>
      <nds-header-actions>
        ${primaryAction}
        <nds-header-auth-button label="${escapeAttr(brand.authLabel ?? "로그인")}"></nds-header-auth-button>
      </nds-header-actions>
    </nds-header>
  `;
}

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

  if (surface === "web") {
    return `
      <nds-footer-web tone="${brand.footerTone}" max-width="${brand.maxWidth}">
        <nds-footer-web-row align="top">
          <nds-footer-web-section>
            <div class="nds-footer__links">${links}</div>
            ${extra}
            <nds-footer-company-info data="${company}"></nds-footer-company-info>
          </nds-footer-web-section>
          <nds-footer-web-section>
            ${renderLogo(footerLogo, assetBaseUrl)}
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
    <nds-footer-info ${darkStyle}>
      <div ${maxWrap}>
        <div class="nds-footer__links">${links}</div>
        ${extra}
        <nds-footer-company-info data="${company}" logo-src="${escapeAttr(footerLogoSrc)}"></nds-footer-company-info>
      </div>
    </nds-footer-info>
  `;
}

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
