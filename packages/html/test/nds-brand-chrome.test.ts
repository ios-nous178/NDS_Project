import { describe, expect, it } from "vitest";
import { NdsBrandFooter, NdsBrandHeader } from "../src/index.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-brand-header / nds-brand-footer", () => {
  it("registers generic brand chrome elements", () => {
    expect(customElements.get("nds-brand-header")).toBe(NdsBrandHeader);
    expect(customElements.get("nds-brand-footer")).toBe(NdsBrandFooter);
  });

  it("registers brand-specific aliases", () => {
    expect(customElements.get("nds-nudge-eap-header")).toBeTruthy();
    expect(customElements.get("nds-nudge-eap-footer")).toBeTruthy();
    expect(customElements.get("nds-trost-header")).toBeTruthy();
    expect(customElements.get("nds-trost-footer")).toBeTruthy();
    expect(customElements.get("nds-geniet-header")).toBeTruthy();
    expect(customElements.get("nds-geniet-footer")).toBeTruthy();
    expect(customElements.get("nds-cashpobi-header")).toBeTruthy();
    expect(customElements.get("nds-cashpobi-footer")).toBeTruthy();
  });

  it("renders a Cashpobi web header with brand-specific yellow primary CTA", async () => {
    const el = document.createElement("nds-brand-header");
    el.setAttribute("brand", "cashpobi");
    el.setAttribute("active-key", "campaign");
    document.body.appendChild(el);
    await flush();

    const header = el.querySelector(".nds-brand-cashpobi") as HTMLElement;
    const logo = el.querySelector('img[alt="Cashwalk for Business"]');
    expect(header).toBeTruthy();
    /* 로고는 self-contained data URI (cashpobi 는 svg 원본). */
    expect(logo?.getAttribute("src")).toMatch(/^data:image\/svg\+xml;base64,/);
    expect(el.textContent).toContain("캠페인");
    const activeMenu = el.querySelector(
      '.nds-brand-cashpobi__menu-item[data-active="true"]',
    ) as HTMLElement | null;
    expect(activeMenu?.textContent).toContain("캠페인");
    const cta = el.querySelector(".nds-brand-cashpobi__primary-cta") as HTMLAnchorElement | null;
    expect(cta?.textContent).toContain("광고 시작하기");
  });

  it("renders Geniet 2-tier desktop web header (search header + menu header)", async () => {
    const el = document.createElement("nds-brand-header");
    el.setAttribute("brand", "geniet");
    el.setAttribute("active-key", "home");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-brand-geniet--desktop") as HTMLElement;
    expect(root).toBeTruthy();
    expect(el.querySelector(".nds-brand-geniet__search-header")).toBeTruthy();
    expect(el.querySelector(".nds-brand-geniet__menu-header")).toBeTruthy();
    expect(
      el.querySelector(".nds-brand-geniet__search-input input")?.getAttribute("placeholder"),
    ).toContain("음식 칼로리");
    /* action buttons (쿠폰상점 / 마이페이지 / 로그인) */
    expect(el.querySelectorAll(".nds-brand-geniet__action-btn").length).toBe(3);
    /* divider 가 마이페이지 앞에만 (1개) */
    expect(el.querySelectorAll(".nds-brand-geniet__action-divider").length).toBe(1);
    /* CTA pills (캐시리뷰 outline + 친구초대 tinted) */
    expect(el.querySelectorAll(".nds-brand-geniet__cta-pill").length).toBe(2);
    expect(
      el.querySelector('.nds-brand-geniet__cta-pill[data-tone="outline"]')?.textContent,
    ).toContain("캐시리뷰");
    /* 음식 카테고리 박스 */
    expect(el.querySelector(".nds-brand-geniet__category")?.textContent).toContain("음식 카테고리");
    /* 활성 GNB 강조 */
    const activeGnb = el.querySelector(
      '.nds-brand-geniet__gnb-item[data-active="true"]',
    ) as HTMLElement | null;
    expect(activeGnb?.textContent).toContain("홈");
  });

  it("renders Geniet 2-tier mobile header (logo+chip+user / hamburger+search)", async () => {
    const el = document.createElement("nds-brand-header");
    el.setAttribute("brand", "geniet");
    el.setAttribute("surface", "mobile");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-brand-geniet--mobile") as HTMLElement;
    expect(root).toBeTruthy();
    /* mobile 전용 로고로 떨어져야 함 (PC 로고가 아니라). src 는 외부 hosting 없이도
     * 깨지지 않게 base64 data URI 로 self-contained. */
    expect(el.querySelector('img[alt="Geniet"]')?.getAttribute("src")).toMatch(
      /^data:image\/webp;base64,/,
    );
    expect(el.querySelector(".nds-brand-geniet__mo-row1")).toBeTruthy();
    expect(el.querySelector(".nds-brand-geniet__mo-row2")).toBeTruthy();
    expect(el.querySelector(".nds-brand-geniet__point-chip")?.textContent).toContain("34,300");
    expect(
      el.querySelector(".nds-brand-geniet__mo-search input")?.getAttribute("placeholder"),
    ).toContain("음식명");
  });

  it("renders Trost desktop web header compound (EAP banner + utility + tab navigation)", async () => {
    const el = document.createElement("nds-brand-header");
    el.setAttribute("brand", "trost");
    document.body.appendChild(el);
    await flush();

    expect(el.querySelector(".nds-brand-trost-web__banner")).toBeTruthy();
    expect(el.querySelector(".nds-brand-trost-web__banner-text")?.textContent).toContain(
      "기업 전용 멘탈케어",
    );
    expect(el.querySelector(".nds-brand-trost-web__utility")).toBeTruthy();
    expect(
      el.querySelector(".nds-brand-trost-web__search input")?.getAttribute("placeholder"),
    ).toContain("전문가");
    expect(el.querySelector(".nds-brand-trost-web__app-dl")?.textContent).toContain("앱 다운로드");
    /* tab navigation — 6 tabs */
    expect(el.querySelectorAll(".nds-brand-trost-web__tabnav-link").length).toBe(6);
    /* 활성 탭 = "/" → "홈" */
    const activeTab = el.querySelector(
      '.nds-brand-trost-web__tabnav-link[data-active="true"]',
    ) as HTMLElement | null;
    expect(activeTab?.textContent).toContain("홈");
  });

  it("renders NudgeEAP desktop web header with centered menu + app-download + auth", async () => {
    const el = document.createElement("nds-brand-header");
    el.setAttribute("brand", "nudge-eap");
    el.setAttribute("active-key", "counsel");
    document.body.appendChild(el);
    await flush();

    expect(el.querySelector(".nds-brand-nudge-eap-web")).toBeTruthy();
    expect(el.querySelectorAll(".nds-brand-nudge-eap-web__menu-item").length).toBe(6);
    const active = el.querySelector(
      '.nds-brand-nudge-eap-web__menu-item[data-active="true"]',
    ) as HTMLElement | null;
    expect(active?.textContent).toContain("상담하기");
    expect(el.querySelector(".nds-brand-nudge-eap-web__app-dl")?.textContent).toContain(
      "앱 다운로드",
    );
    expect(el.querySelector(".nds-brand-nudge-eap-web__auth")?.textContent).toContain("로그인");
  });

  it("renders a footer from brand defaults", async () => {
    const el = document.createElement("nds-brand-footer");
    el.setAttribute("brand", "trost");
    document.body.appendChild(el);
    await flush();

    const footer = el.querySelector(".nds-footer") as HTMLElement;
    const companyInfo = el.querySelector("nds-footer-company-info");
    expect(footer).toBeTruthy();
    expect(el.textContent).toContain("개인정보처리방침");
    expect(el.textContent).toContain("휴마트컴퍼니");
    expect(companyInfo?.getAttribute("logo-src")).toMatch(/^data:image\/svg\+xml;base64,/);
  });

  it("brand aliases use their fixed brand fallback", async () => {
    const el = document.createElement("nds-geniet-footer");
    document.body.appendChild(el);
    await flush();

    expect(el.getAttribute("data-brand")).toBe("geniet");
    expect(el.querySelector("nds-footer-company-info")?.getAttribute("logo-src")).toMatch(
      /^data:image\/webp;base64,/,
    );
    expect(el.textContent).toContain("넛지모바일");
  });

  it("BRAND_DATA 로고는 data URI 라 asset-base-url 이 와도 그대로 통과", async () => {
    /* resolveAssetUrl 은 data: 시작 src 를 prefix 적용 없이 통과시킨다. 즉
     * asset-base-url 을 줘도 기본 로고(data URI) 는 영향을 받지 않고 그대로 렌더된다.
     * BRAND_DATA 외 별도 자산을 쓸 때만 asset-base-url 이 prefix 로 적용. */
    const el = document.createElement("nds-brand-header");
    el.setAttribute("brand", "nudge-eap");
    el.setAttribute("asset-base-url", "https://cdn.example.com/nds/brand-logos/");
    document.body.appendChild(el);
    await flush();

    expect(el.querySelector("img")?.getAttribute("src")).toMatch(/^data:image\/png;base64,/);
  });
});
