import { describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  configureHtmlValidator,
  validateHtmlSource,
} from "@nudge-design/mockup-core/tools/html-validator";
import {
  analyzeHtmlMockup,
  convertHtmlToDsHtml,
  countHtmlUsage,
  reportHtmlMockupUsage,
} from "@nudge-design/mockup-core/tools/html-analyzer";

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

describe("countHtmlUsage — 회피가능 재발명(avoidableReinvention)", () => {
  it("raw landmark(header/footer/aside)를 회피가능 미스로 집계", () => {
    const c = countHtmlUsage(`<header>h</header><footer>f</footer><aside>a</aside>`);
    expect(c.avoidableReinvention.total).toBe(3);
    expect(c.avoidableReinvention.byKind.landmark).toBe(3);
  });

  it("role/onclick 위젯(div/span)을 컨트롤 재발명으로 집계", () => {
    const c = countHtmlUsage(
      `<div role="button">go</div><span onclick="x()">click</span><div role="tab">t</div>`,
    );
    expect(c.avoidableReinvention.total).toBe(3);
    expect(c.avoidableReinvention.byKind["role-widget"]).toBe(3);
  });

  it("admin-shell 처방 chrome(nds-shell__*)과 일반 레이아웃 div 는 제외", () => {
    const c = countHtmlUsage(
      `<header class="nds-shell__topbar">bar</header><div>layout</div><div class="row">x</div>`,
    );
    expect(c.avoidableReinvention.total).toBe(0);
  });

  it("nds-* 래퍼 내부의 landmark/위젯은 제외(우리 WC inner 마크업)", () => {
    const c = countHtmlUsage(`<nds-card><div role="button">x</div></nds-card>`);
    expect(c.avoidableReinvention.total).toBe(0);
  });

  it("재발명이 dsRatio 분모에 들어가 비율을 낮춘다(사각지대 차단)", () => {
    // 2 nds-tag 채택 + raw header/footer 2개 재발명 = 2/4 = 50%
    const c = countHtmlUsage(
      `<nds-button>a</nds-button><nds-button>b</nds-button><header>h</header><footer>f</footer>`,
    );
    expect(c.avoidableReinvention.total).toBe(2);
    expect(c.dsRatio).toBe(50);
  });
});

describe("low-ds-ratio 게이트 — 재발명 반영", () => {
  it("nds 채택은 적고 raw landmark 다수 → 게이트가 잡는다", () => {
    // 1 nds + raw header/footer/aside/(div role=button) 4개 = 1/5 = 20% (<50)
    const src = `<html><body><nds-button>x</nds-button><header>h</header><footer>f</footer><aside>a</aside><div role="button">go</div></body></html>`;
    const v = validateHtmlSource(src);
    const hit = v.find((x) => x.rule === "low-ds-ratio");
    expect(hit).toBeTruthy();
    expect(hit?.severity).toBe("error");
  });

  it("admin-shell chrome(nds-shell__*)은 재발명으로 카운트되지 않아 억울하게 막지 않는다", () => {
    // shell chrome 3개는 제외 → eligible 1개(nds) → MIN_ELIGIBLE 미만 면제
    const src = `<html><body><header class="nds-shell__topbar">t</header><aside class="nds-shell__sidebar">s</aside><nds-button>x</nds-button></body></html>`;
    const v = validateHtmlSource(src);
    expect(v.find((x) => x.rule === "low-ds-ratio")).toBeUndefined();
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
      source: `
        <nds-button color="primary" data-action="go">go</nds-button>
        <p id="status"></p>
        <script>
          document.querySelector('[data-action="go"]').addEventListener('click', () => {
            document.querySelector('#status').textContent = 'done';
          });
        </script>
      `,
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
  it("dryRun=true skips log + webhook + returns counts + builds MockupUsage payload", async () => {
    const r = await reportHtmlMockupUsage({
      source: `<nds-button>a</nds-button><button>plain</button>`,
      mockupName: "test",
      dryRun: true,
    });
    expect(r.logPath).toBeNull();
    expect(r.webhook.attempted).toBe(false);
    expect(r.counts.ndsTags.total).toBe(1);
    expect(r.counts.nativeUnwrapped.total).toBe(1);
    // MockupUsage payload — same schema as reportMockupUsage (so the webhook can ingest it).
    expect(r.usage.ds.find((d) => d.component === "Button")?.count).toBe(1);
    expect(r.usage.customNative.find((c) => c.tag === "button")?.count).toBe(1);
    expect(r.usage.meta.dsRatio).toBe(r.counts.dsRatio);
    expect(r.humanReadable).toContain("webhook skipped");
    expect(r.usage.usageId).toBeTruthy();
  });

  it("maps nds-* tags to React component names (PascalCase + alias)", async () => {
    const r = await reportHtmlMockupUsage({
      source: `<nds-icon-button>a</nds-icon-button><nds-fab>b</nds-fab>`,
      mockupName: "alias-test",
      dryRun: true,
    });
    const names = r.usage.ds.map((d) => d.component).sort();
    expect(names).toEqual(["FAB", "IconButton"]);
  });

  it("classifies nds-* className imitations as customNative with nds-imitation: prefix", async () => {
    const r = await reportHtmlMockupUsage({
      source: `<button class="nds-button">fake</button>`,
      mockupName: "imitation-test",
      dryRun: true,
    });
    // Real DS usage = 0 because <button class="nds-button"> is NOT a custom element.
    expect(r.usage.ds.length).toBe(0);
    expect(r.usage.customNative.find((c) => c.tag === "nds-imitation:nds-button")?.count).toBe(1);
  });

  describe("DS version for HTML mockups (no node_modules/package.json)", () => {
    // HTML 목업은 node_modules/package.json 이 없어 detectDsVersions 가 항상 unknown → 버전이
    // 시트에 null 로 박히던 버그. 빈 temp dir 을 cwd 로 줘 그 상태를 결정론적으로 재현한다.
    const emptyCwd = fs.mkdtempSync(path.join(os.tmpdir(), "ds-ver-"));

    it("without a fallback, version is null (documents the bug surface)", async () => {
      const r = await reportHtmlMockupUsage({
        source: `<nds-button>a</nds-button>`,
        cwd: emptyCwd,
        dryRun: true,
      });
      expect(r.usage.dsVersions?.source).toBe("unknown");
      expect(r.usage.dsVersions?.primary).toBeNull();
    });

    it("uses dsVersionFallback (MCP bundle version) when fs detection is unknown", async () => {
      const r = await reportHtmlMockupUsage({
        source: `<nds-button>a</nds-button>`,
        cwd: emptyCwd,
        dryRun: true,
        dsVersionFallback: "9.9.9",
        assetVersionFallback: "1.2.3",
        iconVersionFallback: "4.5.6",
      });
      expect(r.usage.dsVersions?.source).toBe("mcp-bundle");
      expect(r.usage.dsVersions?.primary).toBe("9.9.9");
      // primary mirror 도 채워져 시트의 @nudge-design/react 컬럼이 비지 않는다
      expect(r.usage.dsVersions?.packages["@nudge-design/react"]).toBe("9.9.9");
      expect(r.usage.dsVersions?.assetVersion).toBe("1.2.3");
      expect(r.usage.dsVersions?.iconVersion).toBe("4.5.6");
      expect(r.usage.dsVersions?.packages["@nudge-design/assets"]).toBe("1.2.3");
      expect(r.usage.dsVersions?.packages["@nudge-design/icons"]).toBe("4.5.6");
    });
  });
});
