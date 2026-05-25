import { describe, expect, it } from "vitest";
import { configureHtmlValidator, validateHtmlSource } from "../src/tools/html-validator";

// 테스트 환경에서는 token set / nds tag set 을 직접 박는다 (server.ts 의 manifest 로딩 우회).
configureHtmlValidator({
  tokenSet: new Set([
    "--color-blue-500",
    "--color-semantic-primary-bg",
    "--color-blue-50",
    "--semantic-bg-brand-default",
    "--semantic-bg-brand-subtle",
    "--gap-default",
    "--inset-card",
    "--spacing-16",
    "--shadow-card",
  ]),
  ndsTagSet: new Set([
    "nds-button",
    "nds-input",
    "nds-select",
    "nds-select-option",
    "nds-card",
    "nds-card-header",
    "nds-card-body",
    "nds-card-footer",
    "nds-chip",
    "nds-badge",
    "nds-modal",
    "nds-bottom-sheet",
    "nds-sidebar",
    "nds-footer-info",
    "nds-header",
  ]),
  ndsClassPrefixSet: new Set(["nds-button", "nds-input", "nds-card", "nds-chip", "nds-badge"]),
  ndsAttrEnums: new Map([
    [
      "nds-button",
      new Map([
        ["color", ["primary", "secondary", "assistive"]],
        ["variant", ["solid", "outlined", "soft", "outlined-sub"]],
      ]),
    ],
  ]),
});

function rulesFor(html: string): string[] {
  return validateHtmlSource(html).map((v) => v.rule);
}

describe("validateHtmlSource", () => {
  it("flags inline color (hex)", () => {
    expect(rulesFor(`<div style="color: #ff0000">x</div>`)).toContain("inline-color");
  });

  it("flags inline color (rgb)", () => {
    expect(rulesFor(`<div style="background: rgba(0,0,0,0.5)">x</div>`)).toContain("inline-color");
  });

  it("does not flag color inside var() fallback", () => {
    const r = rulesFor(`<div style="color: var(--semantic-bg-brand-default, #ff0000)">x</div>`);
    expect(r).not.toContain("inline-color");
  });

  it("flags inline-spacing (px) but not transform", () => {
    expect(rulesFor(`<div style="padding: 16px">x</div>`)).toContain("inline-spacing");
    expect(rulesFor(`<div style="transform: translateY(8px)">x</div>`)).not.toContain(
      "inline-spacing",
    );
  });

  it("flags non-4pt-spacing", () => {
    expect(rulesFor(`<div style="margin: 13px">x</div>`)).toContain("non-4pt-spacing");
  });

  it("flags non-semantic-spacing (--spacing-* in padding/margin/gap)", () => {
    expect(rulesFor(`<div style="padding: var(--spacing-16)">x</div>`)).toContain(
      "non-semantic-spacing",
    );
  });

  it("flags gradient-banned", () => {
    expect(rulesFor(`<div style="background: linear-gradient(0deg, red, blue)">x</div>`)).toContain(
      "gradient-banned",
    );
  });

  it("flags emoji in text content", () => {
    expect(rulesFor(`<p>안녕 🎉</p>`)).toContain("emoji-banned");
  });

  it("flags decorative arrow / check symbols", () => {
    expect(rulesFor(`<button>다음 →</button>`)).toContain("text-symbol-banned");
  });

  it("flags inline svg", () => {
    expect(rulesFor(`<div><svg viewBox="0 0 10 10"></svg></div>`)).toContain("inline-svg");
  });

  it("flags native button without nds class or wrapper", () => {
    expect(rulesFor(`<button>Click</button>`)).toContain("native-interactive");
  });

  it("does NOT flag native button inside nds-button wrapper", () => {
    const r = rulesFor(`<nds-button><button class="nds-button">go</button></nds-button>`);
    expect(r).not.toContain("native-interactive");
  });

  it("does NOT flag native button when it has nds-button class", () => {
    const r = rulesFor(`<button class="nds-button">go</button>`);
    expect(r).not.toContain("native-interactive");
  });

  it("flags unknown var(--xxx) token", () => {
    expect(rulesFor(`<div style="color: var(--made-up-token)">x</div>`)).toContain("unknown-token");
  });

  it("does NOT flag known tokens", () => {
    const r = rulesFor(`<div style="background: var(--semantic-bg-brand-default)">x</div>`);
    expect(r).not.toContain("unknown-token");
  });

  it("flags unknown nds-* custom element tag", () => {
    expect(rulesFor(`<nds-bogus>x</nds-bogus>`)).toContain("unknown-nds-tag");
  });

  it("does NOT flag known nds-* tag", () => {
    expect(rulesFor(`<nds-button>OK</nds-button>`)).not.toContain("unknown-nds-tag");
  });

  it("does NOT flag nds-select-option as unknown", () => {
    expect(
      rulesFor(`<nds-select><nds-select-option value="a">A</nds-select-option></nds-select>`),
    ).not.toContain("unknown-nds-tag");
  });

  it("flags unknown nds-* class prefix", () => {
    expect(rulesFor(`<div class="nds-bogus__root">x</div>`)).toContain("unknown-nds-class");
  });

  it("flags raw landmarks when DS web components exist", () => {
    expect(rulesFor(`<aside>menu</aside>`)).toContain("raw-landmark");
    expect(rulesFor(`<footer>company</footer>`)).toContain("raw-landmark");
    expect(rulesFor(`<header>title</header>`)).toContain("raw-landmark");
  });

  it("flags x text used as an icon substitute", () => {
    expect(rulesFor(`<button class="delete-button">x</button>`)).toContain("text-icon-substitute");
  });

  it("does NOT flag known nds-* class with __sub or --modifier", () => {
    const r = rulesFor(`<div class="nds-button__label">x</div>`);
    expect(r).not.toContain("unknown-nds-class");
  });

  it("flags invalid attribute value on nds-* tag", () => {
    expect(rulesFor(`<nds-button color="weird">x</nds-button>`)).toContain(
      "invalid-nds-attr-value",
    );
    expect(rulesFor(`<nds-button variant="huge">x</nds-button>`)).toContain(
      "invalid-nds-attr-value",
    );
  });

  it("does NOT flag valid enum values", () => {
    const r = rulesFor(`<nds-button color="primary" variant="solid">x</nds-button>`);
    expect(r).not.toContain("invalid-nds-attr-value");
  });

  it("missing attribute (= default) does NOT trigger invalid-nds-attr-value", () => {
    const r = rulesFor(`<nds-button>no color attr</nds-button>`);
    expect(r).not.toContain("invalid-nds-attr-value");
  });
});

// ─── JSX 에서 포팅한 컨테이너 / 카운팅 룰 ───
describe("validateHtmlSource — ported JSX patterns", () => {
  it("flags card-slot-double-padding when nds-card-header has inline padding", () => {
    const r = rulesFor(`<nds-card-header style="padding: 16px">제목</nds-card-header>`);
    expect(r).toContain("card-slot-double-padding");
  });

  it("does NOT flag card slot without padding style", () => {
    const r = rulesFor(`<nds-card-header>제목</nds-card-header>`);
    expect(r).not.toContain("card-slot-double-padding");
  });

  it("flags assistive-solid-cta when nds-button color=assistive without variant", () => {
    const r = rulesFor(`<nds-button color="assistive">취소</nds-button>`);
    expect(r).toContain("assistive-solid-cta");
  });

  it("does NOT flag assistive button when variant=outlined", () => {
    const r = rulesFor(`<nds-button color="assistive" variant="outlined">취소</nds-button>`);
    expect(r).not.toContain("assistive-solid-cta");
  });

  it("flags nested-card when nds-card is inside nds-card", () => {
    const html = `<nds-card><nds-card-body><nds-card>inner</nds-card></nds-card-body></nds-card>`;
    expect(rulesFor(html)).toContain("nested-card");
  });

  it("flags card-badge-overuse when 3+ chip/badge in one card", () => {
    const html = `<nds-card><nds-chip>A</nds-chip><nds-chip>B</nds-chip><nds-badge>C</nds-badge></nds-card>`;
    expect(rulesFor(html)).toContain("card-badge-overuse");
  });

  it("flags card-footer-button-overuse when 3+ buttons in footer", () => {
    const html = `<nds-card-footer>
      <nds-button>1</nds-button><nds-button>2</nds-button><nds-button>3</nds-button>
    </nds-card-footer>`;
    expect(rulesFor(html)).toContain("card-footer-button-overuse");
  });

  it("flags primary-cta-per-container when 2 primary solid buttons in one card", () => {
    const html = `<nds-card>
      <nds-button>A</nds-button>
      <nds-button color="primary">B</nds-button>
    </nds-card>`;
    expect(rulesFor(html)).toContain("primary-cta-per-container");
  });

  it("flags primary-cta-overuse when total primary solid > 1", () => {
    const html = `<nds-button>A</nds-button><nds-button color="primary">B</nds-button>`;
    expect(rulesFor(html)).toContain("primary-cta-overuse");
  });

  it("does NOT flag primary-cta-overuse when secondary buttons are non-solid", () => {
    const html = `<nds-button>A</nds-button><nds-button variant="outlined">B</nds-button>`;
    expect(rulesFor(html)).not.toContain("primary-cta-overuse");
  });

  it("flags chip-overuse when > 8 chips", () => {
    const chips = Array.from({ length: 9 }, (_, i) => `<nds-chip>${i}</nds-chip>`).join("");
    expect(rulesFor(chips)).toContain("chip-overuse");
  });

  it("flags card-everything when 5+ nds-card", () => {
    const cards = Array.from({ length: 5 }, () => `<nds-card>x</nds-card>`).join("");
    expect(rulesFor(cards)).toContain("card-everything");
  });

  it("flags repeated-h1 when 2+ h1", () => {
    expect(rulesFor(`<h1>A</h1><h1>B</h1>`)).toContain("repeated-h1");
  });

  it("flags repeated-h2 when 4+ h2", () => {
    const html = `<h2>A</h2><h2>B</h2><h2>C</h2><h2>D</h2>`;
    expect(rulesFor(html)).toContain("repeated-h2");
  });

  it("flags bold-overuse when 5+ inline font-weight bold", () => {
    const html = Array.from({ length: 5 }, () => `<span style="font-weight: bold">x</span>`).join(
      "",
    );
    expect(rulesFor(html)).toContain("bold-overuse");
  });

  it("flags brand-bg-overuse when --semantic-bg-brand-* used 2+ times", () => {
    const html = `<div style="background: var(--semantic-bg-brand-default)">a</div>
                  <div style="background: var(--semantic-bg-brand-subtle)">b</div>`;
    expect(rulesFor(html)).toContain("brand-bg-overuse");
  });

  it("does NOT flag brand-bg-overuse when used once", () => {
    const html = `<div style="background: var(--semantic-bg-brand-default)">a</div>`;
    expect(rulesFor(html)).not.toContain("brand-bg-overuse");
  });

  it("flags decorative-shadow when 4+ inline box-shadow", () => {
    const html = Array.from(
      { length: 4 },
      () => `<div style="box-shadow: 0 2px 8px rgba(0,0,0,0.1)">x</div>`,
    ).join("");
    expect(rulesFor(html)).toContain("decorative-shadow");
  });

  it("does NOT flag focus ring shadows as decorative", () => {
    const html = Array.from(
      { length: 5 },
      () => `<div style="box-shadow: 0 0 0 2px var(--color-blue-500)">x</div>`,
    ).join("");
    expect(rulesFor(html)).not.toContain("decorative-shadow");
  });

  it("flags heading-decorative-icon when <h3> contains <svg>", () => {
    const html = `<h3><svg viewBox="0 0 10 10"></svg> 제목</h3>`;
    expect(rulesFor(html)).toContain("heading-decorative-icon");
  });

  it("does NOT flag heading without icon", () => {
    expect(rulesFor(`<h3>제목</h3>`)).not.toContain("heading-decorative-icon");
  });
});
