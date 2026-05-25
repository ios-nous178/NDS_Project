import { describe, expect, it } from "vitest";
import { configureHtmlValidator, validateHtmlSource } from "../src/tools/html-validator";

// 테스트 환경에서는 token set / nds tag set 을 직접 박는다 (server.ts 의 manifest 로딩 우회).
configureHtmlValidator({
  tokenSet: new Set([
    "--color-blue-500",
    "--semantic-bg-brand-default",
    "--gap-default",
    "--inset-card",
    "--spacing-16",
  ]),
  ndsTagSet: new Set(["nds-button", "nds-input", "nds-select", "nds-card"]),
  ndsClassPrefixSet: new Set(["nds-button", "nds-input", "nds-card", "nds-chip"]),
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

  it("flags unknown nds-* class prefix", () => {
    expect(rulesFor(`<div class="nds-bogus__root">x</div>`)).toContain("unknown-nds-class");
  });

  it("does NOT flag known nds-* class with __sub or --modifier", () => {
    const r = rulesFor(`<div class="nds-button__label">x</div>`);
    expect(r).not.toContain("unknown-nds-class");
  });
});
