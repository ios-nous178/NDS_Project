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

  it("renders a web header from brand defaults", async () => {
    const el = document.createElement("nds-brand-header");
    el.setAttribute("brand", "cashpobi");
    el.setAttribute("active-key", "campaign");
    document.body.appendChild(el);
    await flush();

    const header = el.querySelector(".nds-header") as HTMLElement;
    const logo = el.querySelector('nds-header-logo img[alt="Cashwalk for Business"]');
    expect(header).toBeTruthy();
    expect(header.dataset.variant).toBe("web");
    expect(logo?.getAttribute("src")).toBe(
      "/brand-logos/cashpobi/cashwalk-for-business-horizontal.svg",
    );
    expect(el.textContent).toContain("캠페인");
    expect(el.querySelector("nds-header-menu-item[active]")?.textContent).toContain("캠페인");
  });

  it("renders a mobile header surface", async () => {
    const el = document.createElement("nds-brand-header");
    el.setAttribute("brand", "geniet");
    el.setAttribute("surface", "mobile");
    document.body.appendChild(el);
    await flush();

    const header = el.querySelector(".nds-header") as HTMLElement;
    const logo = el.querySelector('nds-header-logo img[alt="Geniet"]');
    expect(header.dataset.variant).toBe("compact");
    expect(logo?.getAttribute("src")).toBe("/brand-logos/geniet-logo-pc.webp");
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
    expect(companyInfo?.getAttribute("logo-src")).toBe("/brand-logos/trost-logo.svg");
  });

  it("brand aliases use their fixed brand fallback", async () => {
    const el = document.createElement("nds-geniet-footer");
    document.body.appendChild(el);
    await flush();

    expect(el.getAttribute("data-brand")).toBe("geniet");
    expect(el.querySelector("nds-footer-company-info")?.getAttribute("logo-src")).toBe(
      "/brand-logos/geniet-logo-footer.webp",
    );
    expect(el.textContent).toContain("넛지모바일");
  });

  it("allows overriding the asset base url for shared html mockups", async () => {
    const el = document.createElement("nds-brand-header");
    el.setAttribute("brand", "nudge-eap");
    el.setAttribute("asset-base-url", "https://cdn.example.com/nds/brand-logos/");
    document.body.appendChild(el);
    await flush();

    expect(el.querySelector("img")?.getAttribute("src")).toBe(
      "https://cdn.example.com/nds/brand-logos/nudge-eap-logo.png",
    );
  });
});
