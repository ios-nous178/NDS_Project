import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { auditMockupWorkspace, patchViteConfig } from "../src/tools/build-html.js";

describe("patchViteConfig", () => {
  it("inserts import + viteSingleFile() into a typical vite.config", () => {
    const input = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`;
    const out = patchViteConfig(input);
    expect(out).not.toBeNull();
    expect(out).toContain(`import { viteSingleFile } from "vite-plugin-singlefile";`);
    expect(out).toMatch(/plugins:\s*\[react\(\), viteSingleFile\(\)\]/);
  });

  it("handles plugins array with trailing comma", () => {
    const input = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
  ],
});
`;
    const out = patchViteConfig(input);
    expect(out).not.toBeNull();
    // trailing comma should not produce double-comma
    expect(out).not.toMatch(/,\s*,/);
    expect(out).toMatch(/viteSingleFile\(\)/);
  });

  it("handles empty plugins array", () => {
    const input = `import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
});
`;
    const out = patchViteConfig(input);
    expect(out).not.toBeNull();
    expect(out).toMatch(/plugins:\s*\[viteSingleFile\(\)\]/);
  });

  it("handles nested brackets inside plugins array", () => {
    const input = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({ babel: { plugins: ["a", "b"] } })],
});
`;
    const out = patchViteConfig(input);
    expect(out).not.toBeNull();
    // make sure we didn't break the nested array — viteSingleFile() should be
    // inside the outer plugins array, not the nested babel.plugins one
    expect(out).toMatch(
      /babel:\s*\{\s*plugins:\s*\["a",\s*"b"\]\s*\}\s*\}\),\s*viteSingleFile\(\)\]/,
    );
  });

  it("ignores brackets inside strings", () => {
    const input = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({ include: "src/**/*.{[tj]sx,[tj]s}" })],
});
`;
    const out = patchViteConfig(input);
    expect(out).not.toBeNull();
    expect(out).toContain(`viteSingleFile()`);
  });

  it("returns null when plugins array is not a literal", () => {
    const input = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
const myPlugins = [react()];

export default defineConfig({
  plugins: myPlugins,
});
`;
    const out = patchViteConfig(input);
    expect(out).toBeNull();
  });

  it("returns null when there are no import lines", () => {
    const input = `export default { plugins: [] };\n`;
    const out = patchViteConfig(input);
    expect(out).toBeNull();
  });
});

describe("auditMockupWorkspace", () => {
  let tmp: string;

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "audit-ws-"));
    fs.mkdirSync(path.join(tmp, "src"), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("clean workspace (.tsx only, no css token redef, refs present) → 0 violations", () => {
    fs.writeFileSync(
      path.join(tmp, "src", "App.tsx"),
      `import { Button } from "@nudge-eap/react";\nexport default () => <Button>ok</Button>;`,
    );
    fs.writeFileSync(path.join(tmp, "index.html"), `<!doctype html><div id="root"></div>`);
    fs.writeFileSync(
      path.join(tmp, "references.md"),
      `[good] source=figma.com/example caption=clean primary CTA only\n[bad] source=rejected.png caption=too many emphasis colors`,
    );
    const violations = auditMockupWorkspace(tmp);
    expect(violations).toEqual([]);
  });

  it("detects raw .html in src/", () => {
    fs.writeFileSync(path.join(tmp, "src", "App.tsx"), `export default () => null;`);
    fs.writeFileSync(path.join(tmp, "src", "mockup.html"), `<div>fake</div>`);
    const violations = auditMockupWorkspace(tmp);
    const v = violations.find((x) => x.rule === "raw-html-in-src");
    expect(v).toBeTruthy();
    expect(v?.files).toContain(path.join("src", "mockup.html"));
  });

  it("detects extra .html at project root (besides index.html)", () => {
    fs.writeFileSync(path.join(tmp, "src", "App.tsx"), `export default () => null;`);
    fs.writeFileSync(path.join(tmp, "index.html"), `<!doctype html>`);
    fs.writeFileSync(path.join(tmp, "preview.html"), `<div>standalone</div>`);
    const violations = auditMockupWorkspace(tmp);
    const v = violations.find((x) => x.rule === "raw-html-in-root");
    expect(v).toBeTruthy();
    expect(v?.files).toContain("preview.html");
    expect(v?.files).not.toContain("index.html");
  });

  it("detects :root semantic-token redefinition in .css", () => {
    fs.writeFileSync(path.join(tmp, "src", "App.tsx"), `export default () => null;`);
    fs.writeFileSync(
      path.join(tmp, "src", "styles.css"),
      `:root {\n  --color-semantic-bg-primary: #fff;\n  --gap-md: 16px;\n}`,
    );
    const violations = auditMockupWorkspace(tmp);
    const v = violations.find((x) => x.rule === "inline-root-tokens");
    expect(v).toBeTruthy();
    expect(v?.files).toContain(path.join("src", "styles.css"));
  });

  it("does NOT flag :root blocks that only define custom (non-DS) variables", () => {
    fs.writeFileSync(path.join(tmp, "src", "App.tsx"), `export default () => null;`);
    fs.writeFileSync(
      path.join(tmp, "src", "styles.css"),
      `:root {\n  --my-app-header-h: 56px;\n  --my-custom-radius: 8px;\n}`,
    );
    const violations = auditMockupWorkspace(tmp);
    expect(violations.find((x) => x.rule === "inline-root-tokens")).toBeUndefined();
  });

  it("detects no .tsx/.astro/.html in src/", () => {
    fs.writeFileSync(path.join(tmp, "src", "App.jsx"), `export default () => null;`);
    fs.writeFileSync(path.join(tmp, "index.html"), `<!doctype html>`);
    const violations = auditMockupWorkspace(tmp);
    const v = violations.find((x) => x.rule === "no-tsx-found");
    expect(v).toBeTruthy();
    expect(v?.detail).toContain(".tsx / .astro / .html");
  });

  it("passes no-tsx-found when src/ has .astro files (Astro workflow)", () => {
    fs.writeFileSync(
      path.join(tmp, "src", "index.astro"),
      `---\nimport "@nudge-eap/html/runtime";\n---\n<nds-button>x</nds-button>`,
    );
    fs.writeFileSync(path.join(tmp, "index.html"), `<!doctype html>`);
    fs.writeFileSync(
      path.join(tmp, "references.md"),
      `[good] source=figma caption=clean primary CTA only`,
    );
    const violations = auditMockupWorkspace(tmp);
    expect(violations.find((x) => x.rule === "no-tsx-found")).toBeUndefined();
  });

  it("passes no-tsx-found when src/ has only .html (vanilla nds-* workflow), even though raw-html-in-src still fires", () => {
    fs.writeFileSync(path.join(tmp, "src", "page.html"), `<nds-button>x</nds-button>`);
    fs.writeFileSync(path.join(tmp, "index.html"), `<!doctype html>`);
    fs.writeFileSync(
      path.join(tmp, "references.md"),
      `[good] source=figma caption=clean primary CTA only`,
    );
    const violations = auditMockupWorkspace(tmp);
    // no-tsx-found 는 더 이상 안 뜬다 — .html 도 인식 가능한 입력 형식.
    expect(violations.find((x) => x.rule === "no-tsx-found")).toBeUndefined();
    // raw-html-in-src 는 별개 룰로 여전히 작동 (손글씨 HTML 가드는 그대로 유지).
    expect(violations.find((x) => x.rule === "raw-html-in-src")).toBeTruthy();
  });

  it("reports multiple violations simultaneously", () => {
    // src/ 가 비어 있어야 no-tsx-found 가 뜨므로, src/fake.html 같은 .html 은 두지 않는다.
    // 대신 다른 위반들을 한꺼번에 발생시킨다: raw-html-in-root (preview.html),
    // inline-root-tokens (tokens.css), no-tsx-found (src/ 에 .tsx/.astro/.html 모두 없음).
    fs.writeFileSync(path.join(tmp, "src", "tokens.css"), `:root { --nds-color-primary: #000; }`);
    fs.writeFileSync(path.join(tmp, "preview.html"), `<div>x</div>`);
    const rules = auditMockupWorkspace(tmp).map((v) => v.rule);
    expect(rules).toContain("raw-html-in-root");
    expect(rules).toContain("inline-root-tokens");
    expect(rules).toContain("no-tsx-found");
  });

  it("ignores node_modules / dist / dot directories", () => {
    fs.writeFileSync(path.join(tmp, "src", "App.tsx"), `export default () => null;`);
    fs.writeFileSync(
      path.join(tmp, "references.md"),
      `[good] source=figma.com caption=ok\n[bad] source=x.png caption=no`,
    );
    fs.mkdirSync(path.join(tmp, "src", "node_modules", "x"), { recursive: true });
    fs.writeFileSync(path.join(tmp, "src", "node_modules", "x", "y.html"), `<div></div>`);
    fs.mkdirSync(path.join(tmp, "dist"), { recursive: true });
    fs.writeFileSync(path.join(tmp, "dist", "index.html"), `<!doctype html>`);
    const violations = auditMockupWorkspace(tmp);
    expect(violations).toEqual([]);
  });

  describe("missing-visual-references", () => {
    it("flags workspace with no references.md or .references/", () => {
      fs.writeFileSync(path.join(tmp, "src", "App.tsx"), `export default () => null;`);
      fs.writeFileSync(path.join(tmp, "index.html"), `<!doctype html>`);
      const v = auditMockupWorkspace(tmp).find((x) => x.rule === "missing-visual-references");
      expect(v).toBeTruthy();
      expect(v?.detail).toContain("시각 기준으로 쓸 Figma 링크나 스크린샷");
    });

    it("flags references.md that is empty / too short", () => {
      fs.writeFileSync(path.join(tmp, "src", "App.tsx"), `export default () => null;`);
      fs.writeFileSync(path.join(tmp, "references.md"), `   \n`);
      const v = auditMockupWorkspace(tmp).find((x) => x.rule === "missing-visual-references");
      expect(v).toBeTruthy();
      expect(v?.files).toContain("references.md");
    });

    it("flags empty .references/ folder", () => {
      fs.writeFileSync(path.join(tmp, "src", "App.tsx"), `export default () => null;`);
      fs.mkdirSync(path.join(tmp, ".references"));
      const v = auditMockupWorkspace(tmp).find((x) => x.rule === "missing-visual-references");
      expect(v).toBeTruthy();
      expect(v?.files).toContain(".references/");
    });

    it("passes when references.md has real content", () => {
      fs.writeFileSync(path.join(tmp, "src", "App.tsx"), `export default () => null;`);
      fs.writeFileSync(
        path.join(tmp, "references.md"),
        `[good] source=figma.com/x caption=clean hero only\n[bad] source=loud.png caption=too many CTAs`,
      );
      const v = auditMockupWorkspace(tmp).find((x) => x.rule === "missing-visual-references");
      expect(v).toBeUndefined();
    });

    it("passes when .references/ folder has at least one file", () => {
      fs.writeFileSync(path.join(tmp, "src", "App.tsx"), `export default () => null;`);
      fs.mkdirSync(path.join(tmp, ".references"));
      fs.writeFileSync(path.join(tmp, ".references", "good-1.png"), `binary`);
      const v = auditMockupWorkspace(tmp).find((x) => x.rule === "missing-visual-references");
      expect(v).toBeUndefined();
    });

    it("accepts REFERENCES.md (case-insensitive)", () => {
      fs.writeFileSync(path.join(tmp, "src", "App.tsx"), `export default () => null;`);
      fs.writeFileSync(
        path.join(tmp, "REFERENCES.md"),
        `[good] source=figma caption=ok hero with single CTA emphasis`,
      );
      const v = auditMockupWorkspace(tmp).find((x) => x.rule === "missing-visual-references");
      expect(v).toBeUndefined();
    });
  });
});
