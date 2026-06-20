import { describe, expect, it } from "vitest";
import { NdsProjectFooter, NdsProjectHeader } from "../src/index.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-project-header / nds-project-footer", () => {
  it("registers generic project chrome elements", () => {
    expect(customElements.get("nds-project-header")).toBe(NdsProjectHeader);
    expect(customElements.get("nds-project-footer")).toBe(NdsProjectFooter);
  });

  it("registers project-specific aliases", () => {
    expect(customElements.get("nds-nudge-eap-header")).toBeTruthy();
    expect(customElements.get("nds-nudge-eap-footer")).toBeTruthy();
    expect(customElements.get("nds-trost-header")).toBeTruthy();
    expect(customElements.get("nds-trost-footer")).toBeTruthy();
    expect(customElements.get("nds-geniet-header")).toBeTruthy();
    expect(customElements.get("nds-geniet-footer")).toBeTruthy();
    expect(customElements.get("nds-cashwalk-biz-header")).toBeTruthy();
    expect(customElements.get("nds-cashwalk-biz-footer")).toBeTruthy();
  });

  it("renders a CashwalkBiz web header with project-specific yellow primary CTA", async () => {
    const el = document.createElement("nds-project-header");
    el.setAttribute("project", "cashwalk-biz");
    el.setAttribute("active-key", "ad");
    document.body.appendChild(el);
    await flush();

    const header = el.querySelector(".nds-project-cashwalk-biz") as HTMLElement;
    const logo = el.querySelector('img[alt="Cashwalk for Business"]');
    expect(header).toBeTruthy();
    /* 로고는 self-contained data URI (cashwalk-biz 는 svg 원본). */
    expect(logo?.getAttribute("src")).toMatch(/^data:image\/svg\+xml;base64,/);
    // Figma 98:1082 마케팅 GNB — 활성 탭은 '광고'(key 'ad').
    expect(el.textContent).toContain("광고");
    const activeMenu = el.querySelector(
      '.nds-project-cashwalk-biz__menu-item[data-active="true"]',
    ) as HTMLElement | null;
    expect(activeMenu?.textContent).toContain("광고");
    const cta = el.querySelector(
      ".nds-project-cashwalk-biz__primary-cta",
    ) as HTMLAnchorElement | null;
    expect(cta?.textContent).toContain("광고 시작하기");
  });

  it("renders Geniet 2-tier desktop web header (search header + menu header)", async () => {
    const el = document.createElement("nds-project-header");
    el.setAttribute("project", "geniet");
    el.setAttribute("active-key", "home");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-project-geniet--desktop") as HTMLElement;
    expect(root).toBeTruthy();
    expect(el.querySelector(".nds-project-geniet__search-header")).toBeTruthy();
    expect(el.querySelector(".nds-project-geniet__menu-header")).toBeTruthy();
    expect(
      el.querySelector(".nds-project-geniet__search-input input")?.getAttribute("placeholder"),
    ).toContain("음식 칼로리");
    /* action buttons (쿠폰상점 / 마이페이지 / 로그인) */
    expect(el.querySelectorAll(".nds-project-geniet__action-btn").length).toBe(3);
    /* divider 가 마이페이지 앞에만 (1개) */
    expect(el.querySelectorAll(".nds-project-geniet__action-divider").length).toBe(1);
    /* CTA pills (캐시리뷰 outline + 친구초대 tinted) */
    expect(el.querySelectorAll(".nds-project-geniet__cta-pill").length).toBe(2);
    expect(
      el.querySelector('.nds-project-geniet__cta-pill[data-tone="outline"]')?.textContent,
    ).toContain("캐시리뷰");
    /* 음식 카테고리 박스 */
    expect(el.querySelector(".nds-project-geniet__category")?.textContent).toContain("음식 카테고리");
    /* 활성 GNB 강조 */
    const activeGnb = el.querySelector(
      '.nds-project-geniet__gnb-item[data-active="true"]',
    ) as HTMLElement | null;
    expect(activeGnb?.textContent).toContain("홈");
  });

  it("renders Geniet 2-tier mobile header (logo+chip+user / hamburger+search)", async () => {
    const el = document.createElement("nds-project-header");
    el.setAttribute("project", "geniet");
    el.setAttribute("surface", "mobile");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-project-geniet--mobile") as HTMLElement;
    expect(root).toBeTruthy();
    /* mobile 전용 로고로 떨어져야 함 (PC 로고가 아니라). src 는 외부 hosting 없이도
     * 깨지지 않게 base64 data URI 로 self-contained. */
    expect(el.querySelector('img[alt="Geniet"]')?.getAttribute("src")).toMatch(
      /^data:image\/webp;base64,/,
    );
    expect(el.querySelector(".nds-project-geniet__mo-row1")).toBeTruthy();
    expect(el.querySelector(".nds-project-geniet__mo-row2")).toBeTruthy();
    expect(el.querySelector(".nds-project-geniet__point-chip")?.textContent).toContain("34,300");
    expect(
      el.querySelector(".nds-project-geniet__mo-search input")?.getAttribute("placeholder"),
    ).toContain("음식명");
  });

  it("renders Trost desktop web header compound (EAP banner + utility + tab navigation)", async () => {
    const el = document.createElement("nds-project-header");
    el.setAttribute("project", "trost");
    document.body.appendChild(el);
    await flush();

    expect(el.querySelector(".nds-project-banner")).toBeTruthy();
    expect(el.querySelector(".nds-project-banner__text")?.textContent).toContain(
      "기업 전용 멘탈케어",
    );
    expect(el.querySelector(".nds-project-trost-web__utility")).toBeTruthy();
    expect(
      el.querySelector(".nds-project-trost-web__search input")?.getAttribute("placeholder"),
    ).toContain("전문가");
    expect(el.querySelector(".nds-project-trost-web__app-dl")?.textContent).toContain("앱 다운로드");
    /* tab navigation — 6 tabs */
    expect(el.querySelectorAll(".nds-project-trost-web__tabnav-link").length).toBe(6);
    /* 활성 탭 = "/" → "홈" */
    const activeTab = el.querySelector(
      '.nds-project-trost-web__tabnav-link[data-active="true"]',
    ) as HTMLElement | null;
    expect(activeTab?.textContent).toContain("홈");
  });

  it("renders NudgeEAP desktop web header with centered menu + app-download + auth", async () => {
    const el = document.createElement("nds-project-header");
    el.setAttribute("project", "nudge-eap");
    el.setAttribute("active-key", "counsel");
    document.body.appendChild(el);
    await flush();

    expect(el.querySelector(".nds-project-nudge-eap-web")).toBeTruthy();
    expect(el.querySelectorAll(".nds-project-nudge-eap-web__menu-item").length).toBe(6);
    const active = el.querySelector(
      '.nds-project-nudge-eap-web__menu-item[data-active="true"]',
    ) as HTMLElement | null;
    expect(active?.textContent).toContain("상담하기");
    expect(el.querySelector(".nds-project-nudge-eap-web__app-dl")?.textContent).toContain(
      "앱 다운로드",
    );
    expect(el.querySelector(".nds-project-nudge-eap-web__auth")?.textContent).toContain("로그인");
  });

  it("renders a footer from project defaults", async () => {
    const el = document.createElement("nds-project-footer");
    el.setAttribute("project", "trost");
    document.body.appendChild(el);
    await flush();

    const footer = el.querySelector(".nds-footer") as HTMLElement;
    const companyInfo = el.querySelector("nds-footer-company-info");
    expect(footer).toBeTruthy();
    expect(el.textContent).toContain("개인정보처리방침");
    expect(el.textContent).toContain("휴마트컴퍼니");
    expect(companyInfo?.getAttribute("logo-src")).toMatch(/^data:image\/svg\+xml;base64,/);
  });

  it("project aliases use their fixed project fallback", async () => {
    const el = document.createElement("nds-geniet-footer");
    document.body.appendChild(el);
    await flush();

    expect(el.getAttribute("data-project")).toBe("geniet");
    expect(el.querySelector("nds-footer-company-info")?.getAttribute("logo-src")).toMatch(
      /^data:image\/webp;base64,/,
    );
    expect(el.textContent).toContain("넛지모바일");
  });

  it("PROJECT_DATA 로고는 data URI 라 asset-base-url 이 와도 그대로 통과", async () => {
    /* resolveAssetUrl 은 data: 시작 src 를 prefix 적용 없이 통과시킨다. 즉
     * asset-base-url 을 줘도 기본 로고(data URI) 는 영향을 받지 않고 그대로 렌더된다.
     * PROJECT_DATA 외 별도 자산을 쓸 때만 asset-base-url 이 prefix 로 적용. */
    const el = document.createElement("nds-project-header");
    el.setAttribute("project", "nudge-eap");
    el.setAttribute("asset-base-url", "https://cdn.example.com/nds/assets/");
    document.body.appendChild(el);
    await flush();

    expect(el.querySelector("img")?.getAttribute("src")).toMatch(/^data:image\/png;base64,/);
  });
});

describe("nds-project-header — focus preservation (active-key in-place patch)", () => {
  /* active-key 만 바뀌면 innerHTML 재빌드 대신 data-key 앵커의 data-active 만
   * 패치한다 — 검색 input(geniet/trost/runmile 헤더)이 재생성되면 포커스가
   * 유실되는 mount-once 계약. focus-preservation 헬퍼 계열 게이트 커버. */

  it("active-key 갱신이 검색 input 을 재생성하지 않고 메뉴 활성만 옮긴다", async () => {
    const el = document.createElement("nds-project-header");
    el.setAttribute("project", "geniet");
    el.setAttribute("active-key", "home");
    document.body.appendChild(el);
    await flush();

    const input = el.querySelector<HTMLInputElement>(".nds-project-geniet__search-input input")!;
    expect(input).toBeTruthy();
    input.focus();

    el.setAttribute("active-key", "review");
    await flush();

    // 노드 동일성 + 포커스 보존 (innerHTML 재빌드면 둘 다 깨진다)
    expect(el.querySelector(".nds-project-geniet__search-input input")).toBe(input);
    expect(document.activeElement).toBe(input);

    // 활성 표시는 in-place 로 옮겨져야 한다
    const active = el.querySelectorAll('.nds-project-geniet__gnb-item[data-active="true"]');
    expect(active).toHaveLength(1);
    expect(active[0].textContent).toContain("음식 리뷰");
  });

  it("project/surface 가 바뀌면 full re-render 로 새 chrome 을 그린다", async () => {
    const el = document.createElement("nds-project-header");
    el.setAttribute("project", "geniet");
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-project-geniet--desktop")).toBeTruthy();

    el.setAttribute("project", "cashwalk-biz");
    await flush();
    expect(el.querySelector(".nds-project-geniet--desktop")).toBeNull();
    expect(el.querySelector(".nds-project-cashwalk-biz")).toBeTruthy();
  });
});
