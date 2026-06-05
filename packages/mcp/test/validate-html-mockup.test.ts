import { describe, expect, it } from "vitest";
import {
  configureHtmlValidator,
  validateHtmlMockup,
  validateHtmlSource,
} from "@nudge-design/mockup-core/tools/html-validator";

// 테스트 환경에서는 token set / nds tag set 을 직접 박는다 (server.ts 의 manifest 로딩 우회).
configureHtmlValidator({
  tokenSet: new Set([
    "--color-blue-500",
    "--color-blue-50",
    "--semantic-bg-brand-default",
    "--semantic-bg-brand-subtle",
    "--semantic-gap-default",
    "--semantic-inset-card",
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
    "nds-brand-header",
    "nds-brand-footer",
    "nds-footer-info",
    "nds-header",
    "nds-form-field",
    "nds-selected-items-panel",
    "nds-region-row",
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

  it("flags emoji in attribute value (placeholder)", () => {
    expect(rulesFor(`<nds-input placeholder="검색 🔍"></nds-input>`)).toContain("emoji-banned");
  });

  it("flags emoji in attribute value (aria-label)", () => {
    expect(rulesFor(`<button aria-label="닫기 ❌">x</button>`)).toContain("emoji-banned");
  });

  it("flags emoji in <style> content property", () => {
    expect(rulesFor(`<style>.icon::before { content: '📊'; }</style>`)).toContain("emoji-banned");
  });

  it("flags ds-badge-missing when footer has no DS badge", () => {
    expect(rulesFor(`<footer><p>회사 정보</p></footer>`)).toContain("ds-badge-missing");
  });

  it("accepts data-ds-badge attribute as DS badge", () => {
    const r = rulesFor(`<footer><span data-ds-badge>DS@0.1.10 · DS 12 (45%)</span></footer>`);
    expect(r).not.toContain("ds-badge-missing");
  });

  it("accepts 'DS@<version>' text as DS badge", () => {
    const r = rulesFor(`<footer><small>Built with DS@0.1.10</small></footer>`);
    expect(r).not.toContain("ds-badge-missing");
  });

  it("does not flag ds-badge-missing when document has no footer", () => {
    const r = rulesFor(`<main><h1>홈</h1></main>`);
    expect(r).not.toContain("ds-badge-missing");
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

  it("directs raw brand header/footer to BrandHeader and BrandFooter", () => {
    const result = validateHtmlMockup({
      source: `<header>직접 만든 GNB</header><footer>직접 만든 푸터</footer>`,
    });
    const raw = result.violations.filter((v) => v.rule === "raw-landmark");

    expect(raw.some((v) => v.suggestion.includes("component:BrandHeader"))).toBe(true);
    expect(raw.some((v) => v.suggestion.includes("component:BrandFooter"))).toBe(true);
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

  it("flags active nds-button without a click interaction", () => {
    expect(rulesFor(`<nds-button color="primary">저장</nds-button>`)).toContain(
      "button-without-interaction",
    );
  });

  it("does NOT flag button when data-action is wired through addEventListener", () => {
    const html = `
      <nds-button color="primary" data-action="save">저장</nds-button>
      <p id="status"></p>
      <script>
        document.querySelector('[data-action="save"]').addEventListener('click', () => {
          document.querySelector('#status').textContent = '저장됨';
        });
      </script>
    `;
    expect(rulesFor(html)).not.toContain("button-without-interaction");
  });

  it("flags incomplete PRD coverage manifest", () => {
    const html = `
      <main id="screen"></main>
      <script type="application/json" data-prd-coverage>
        {"requirements":[{"id":"R1","requirement":"지역 추가 모달","status":"todo","evidence":"#missing"}]}
      </script>
    `;
    expect(rulesFor(html)).toContain("prd-coverage-incomplete");
  });

  it("accepts PRD coverage entries with implemented status and existing evidence", () => {
    const html = `
      <main id="screen"></main>
      <script type="application/json" data-prd-coverage>
        {"requirements":[{"id":"R1","requirement":"화면 본문","status":"implemented","evidence":"#screen"}]}
      </script>
    `;
    expect(rulesFor(html)).not.toContain("prd-coverage-incomplete");
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

  it("does NOT flag primary-cta-overuse for one page primary plus one modal primary", () => {
    const html = `<nds-button>Save</nds-button>
      <nds-modal><nds-button>Apply</nds-button></nds-modal>`;
    expect(rulesFor(html)).not.toContain("primary-cta-overuse");
  });

  it("still flags primary-cta-per-container for duplicate modal primary actions", () => {
    const html = `<nds-button>Save</nds-button>
      <nds-modal><nds-button>Apply</nds-button><nds-button>Confirm</nds-button></nds-modal>`;
    expect(rulesFor(html)).toContain("primary-cta-per-container");
    expect(rulesFor(html)).not.toContain("primary-cta-overuse");
  });

  it("flags cashwalk-biz modal single full-width button (hug 우측정렬이어야 함)", () => {
    const html = `<html data-brand="cashwalk-biz"><body>
      <nds-modal open title="검수를 승인할까요?">
        <p>승인하면 즉시 노출됩니다.</p>
        <div slot="footer"><nds-button color="secondary" variant="solid" full-width>승인</nds-button></div>
      </nds-modal>
    </body></html>`;
    expect(rulesFor(html)).toContain("cashwalk-biz-modal-single-button-fullwidth");
  });

  it("flags SelectedItemsPanel helper text placed as an adjacent sibling", () => {
    const html = `<html data-brand="cashwalk-biz"><body>
      <nds-selected-items-panel panel-title="선택한 지역" count="3">
        <nds-region-row>서울특별시 &gt; 전체</nds-region-row>
      </nds-selected-items-panel>
      <p>시/도, 시/군/구를 검색해 노출할 지역을 추가하세요.</p>
    </body></html>`;
    expect(rulesFor(html)).toContain("selected-items-helper-outside-form-field");
  });

  it("does NOT flag SelectedItemsPanel helper when it is owned by FormField", () => {
    const html = `<html data-brand="cashwalk-biz"><body>
      <nds-form-field label="지역" density="admin" helper="시/도, 시/군/구를 검색해 노출할 지역을 추가하세요.">
        <nds-selected-items-panel panel-title="선택한 지역" count="3">
          <nds-region-row>서울특별시 &gt; 전체</nds-region-row>
        </nds-selected-items-panel>
      </nds-form-field>
    </body></html>`;
    expect(rulesFor(html)).not.toContain("selected-items-helper-outside-form-field");
  });

  it("does NOT flag cashwalk-biz single modal button when hug (no full-width)", () => {
    const html = `<html data-brand="cashwalk-biz"><body>
      <nds-modal open title="검수를 승인할까요?">
        <div slot="footer"><nds-button color="secondary" variant="solid" shape="pill">승인</nds-button></div>
      </nds-modal>
    </body></html>`;
    expect(rulesFor(html)).not.toContain("cashwalk-biz-modal-single-button-fullwidth");
  });

  it("does NOT flag full-width single modal button outside cashwalk-biz brand", () => {
    const html = `<nds-modal><div slot="footer"><nds-button full-width>확인</nds-button></div></nds-modal>`;
    expect(rulesFor(html)).not.toContain("cashwalk-biz-modal-single-button-fullwidth");
  });

  it("does NOT flag cashwalk-biz dual-button modal (가로 분할은 정상)", () => {
    const html = `<html data-brand="cashwalk-biz"><body>
      <nds-modal>
        <div slot="footer">
          <nds-button color="assistive" variant="outlined">닫기</nds-button>
          <nds-button color="secondary" variant="solid" full-width>확정</nds-button>
        </div>
      </nds-modal>
    </body></html>`;
    expect(rulesFor(html)).not.toContain("cashwalk-biz-modal-single-button-fullwidth");
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

describe("violation severity", () => {
  it("populates severity from rule defaults", () => {
    const raw = validateHtmlSource(`<div style="color: #ff0000">x</div>`);
    const v = raw.find((x) => x.rule === "inline-color");
    expect(v?.severity).toBe("error");
  });

  it("raw <header>/<footer> with brand variant available is error", () => {
    const result = validateHtmlMockup({
      source: `<header>직접 만든 GNB</header><footer>직접 만든 푸터</footer>`,
    });
    const raw = result.violations.filter((v) => v.rule === "raw-landmark");
    expect(raw.every((v) => v.severity === "error")).toBe(true);
  });

  it("raw <aside> falls back to warn (no brand variant)", () => {
    const result = validateHtmlMockup({ source: `<aside>menu</aside>` });
    const aside = result.violations.find(
      (v) => v.rule === "raw-landmark" && v.selector?.includes("aside"),
    );
    expect(aside?.severity).toBe("warn");
  });

  it("severitySummary aggregates counts", () => {
    const result = validateHtmlMockup({
      source: `
        <header>raw</header>
        <div style="color: #f00">inline color</div>
        <div style="padding: 13px">non-4pt</div>
      `,
    });
    expect(result.severitySummary.error).toBeGreaterThan(0);
    expect(result.severitySummary.hasErrors).toBe(true);
    expect(result.severitySummary.warn).toBeGreaterThan(0);
  });

  it("violationsByRule entries include severity, errors sort first", () => {
    const result = validateHtmlMockup({
      source: `
        <header>raw</header>
        <p>가벼운 warn 만 — chip 8개 넘김</p>
        ${Array.from({ length: 9 }, () => `<nds-chip>x</nds-chip>`).join("")}
      `,
    });
    const errorEntry = result.violationsByRule.find((r) => r.severity === "error");
    const warnEntry = result.violationsByRule.find((r) => r.severity === "warn");
    expect(errorEntry).toBeDefined();
    expect(warnEntry).toBeDefined();
    // error 가 warn 보다 앞에 정렬되어야 함
    const errorIdx = result.violationsByRule.findIndex((r) => r.severity === "error");
    const warnIdx = result.violationsByRule.findIndex((r) => r.severity === "warn");
    expect(errorIdx).toBeLessThan(warnIdx);
  });
});
