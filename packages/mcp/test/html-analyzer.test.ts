import { describe, expect, it } from "vitest";
import { configureHtmlValidator } from "../src/tools/html-validator";
import {
  analyzeHtmlMockup,
  convertHtmlToDsHtml,
  countHtmlUsage,
  reportHtmlMockupUsage,
} from "../src/tools/html-analyzer";

configureHtmlValidator({
  tokenSet: new Set(["--semantic-bg-brand-default", "--semantic-text-inverse-default"]),
  ndsTagSet: new Set(["nds-button", "nds-input", "nds-select", "nds-textarea", "nds-card"]),
  ndsClassPrefixSet: new Set(["nds-button", "nds-input", "nds-card"]),
});

describe("countHtmlUsage", () => {
  it("counts nds-* tag instances", () => {
    const c = countHtmlUsage(
      `<nds-button>a</nds-button><nds-button>b</nds-button><nds-input></nds-input>`,
    );
    expect(c.ndsTags.total).toBe(3);
    expect(c.ndsTags.byTag["nds-button"]).toBe(2);
    expect(c.ndsTags.byTag["nds-input"]).toBe(1);
  });

  it("counts nds-class elements separately from nds-tag", () => {
    const c = countHtmlUsage(`<button class="nds-button">x</button>`);
    expect(c.ndsClassed.total).toBe(1);
    expect(c.ndsClassed.byClass["nds-button"]).toBe(1);
    expect(c.nativeUnwrapped.total).toBe(0);
  });

  it("counts native interactive without nds-* as unwrapped", () => {
    const c = countHtmlUsage(`<button>plain</button><input /><div>not interactive</div>`);
    expect(c.nativeUnwrapped.total).toBe(2);
    expect(c.nativeUnwrapped.byTag.button).toBe(1);
    expect(c.nativeUnwrapped.byTag.input).toBe(1);
  });

  it("does NOT count inner button inside nds-button as unwrapped", () => {
    const c = countHtmlUsage(`<nds-button><button class="nds-button">x</button></nds-button>`);
    expect(c.nativeUnwrapped.total).toBe(0);
    // wrapper 가 카운트됨, inner button 은 wrapper 가 이미 카운트해서 제외
    expect(c.ndsTags.total).toBe(1);
  });

  it("calculates dsRatio over interactive elements only", () => {
    // 2 nds-tag + 1 native = 67%
    const c = countHtmlUsage(
      `<nds-button>a</nds-button><nds-button>b</nds-button><button>x</button>`,
    );
    expect(c.dsRatio).toBe(67);
  });

  it("dsRatio = 0 when no DS elements", () => {
    const c = countHtmlUsage(`<button>a</button><button>b</button>`);
    expect(c.dsRatio).toBe(0);
  });
});

describe("analyzeHtmlMockup", () => {
  it("combines counts + violations + recommendations", () => {
    const r = analyzeHtmlMockup({
      source: `<button style="color: #ff0000">danger</button><nds-button>ok</nds-button>`,
    });
    expect(r.counts.nativeUnwrapped.total).toBe(1);
    expect(r.counts.ndsTags.total).toBe(1);
    expect(r.violations.length).toBeGreaterThan(0);
    expect(r.violationsByRule["inline-color"]).toBeGreaterThan(0);
    expect(r.violationsByRule["native-interactive"]).toBeGreaterThan(0);
    // recommendation should mention convert + token swap
    const joined = r.recommendations.join(" ");
    expect(joined).toContain("convert_html_to_ds_html");
    expect(joined).toContain("토큰");
  });

  it("clean HTML → 0 violations + healthy recommendation", () => {
    const r = analyzeHtmlMockup({
      source: `<nds-button color="primary">go</nds-button>`,
    });
    expect(r.violations.length).toBe(0);
    expect(r.recommendations.join(" ")).toContain("위반 없음");
  });
});

describe("convertHtmlToDsHtml", () => {
  it("rewrites <button> to <nds-button> preserving children", () => {
    const r = convertHtmlToDsHtml({ source: `<button>Go</button>` });
    expect(r.output).toContain("<nds-button>Go</nds-button>");
    expect(r.changes.find((c) => c.rule === "rewrite-tag:button→nds-button")).toBeTruthy();
  });

  it("drops button.type during rewrite", () => {
    const r = convertHtmlToDsHtml({ source: `<button type="button">x</button>` });
    expect(r.output).toContain("<nds-button>x</nds-button>");
    expect(r.output).not.toContain('type="button"');
  });

  it("preserves non-type attributes on button", () => {
    const r = convertHtmlToDsHtml({ source: `<button id="cta" aria-label="제출">x</button>` });
    expect(r.output).toContain('id="cta"');
    expect(r.output).toContain('aria-label="제출"');
  });

  it("does NOT double-wrap a button already inside nds-button", () => {
    const before = `<nds-button><button class="nds-button">x</button></nds-button>`;
    const r = convertHtmlToDsHtml({ source: before });
    // inner button stays as-is
    expect((r.output.match(/<nds-button/g) ?? []).length).toBe(1);
  });

  it("converts <select> with <option> to <nds-select> with <nds-select-option>", () => {
    const r = convertHtmlToDsHtml({
      source: `<select><option value="kr">한국</option><option value="jp">일본</option></select>`,
    });
    expect(r.output).toContain("<nds-select>");
    expect(r.output).toContain('<nds-select-option value="kr">한국</nds-select-option>');
    expect(r.output).toContain('<nds-select-option value="jp">일본</nds-select-option>');
  });

  it("rewrites known hex to semantic token by default", () => {
    const r = convertHtmlToDsHtml({ source: `<div style="background: #ffffff">x</div>` });
    expect(r.output).toContain("var(--semantic-bg-surface-default)");
    expect(r.changes.find((c) => c.rule === "rewrite-hex-to-token")).toBeTruthy();
  });

  it("leaves hex alone when rewriteInlineColors=false", () => {
    const r = convertHtmlToDsHtml({
      source: `<div style="background: #ffffff">x</div>`,
      rewriteInlineColors: false,
    });
    expect(r.output).toContain("#ffffff");
    expect(r.changes.find((c) => c.rule === "rewrite-hex-to-token")).toBeUndefined();
  });

  it("reports unchanged hex (not in catalog) in unchanged[]", () => {
    const r = convertHtmlToDsHtml({ source: `<div style="color: #1234ab">x</div>` });
    expect(r.unchanged.some((u) => u.includes("hex"))).toBe(true);
  });

  it("rewrites <input> and <textarea>", () => {
    const r = convertHtmlToDsHtml({
      source: `<input placeholder="이름" /><textarea>본문</textarea>`,
    });
    expect(r.output).toContain('<nds-input placeholder="이름">');
    expect(r.output).toContain("<nds-textarea>본문</nds-textarea>");
  });
});

describe("reportHtmlMockupUsage", () => {
  it("returns counts + dryRun by default + does NOT write file", () => {
    const r = reportHtmlMockupUsage({
      source: `<nds-button>a</nds-button><button>plain</button>`,
      mockupName: "test",
    });
    expect(r.logPath).toBeNull();
    expect(r.counts.ndsTags.total).toBe(1);
    expect(r.counts.nativeUnwrapped.total).toBe(1);
    expect(r.humanReadable).toContain("dryRun");
  });
});
