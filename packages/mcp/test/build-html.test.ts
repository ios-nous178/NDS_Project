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

  it("clean workspace (.tsx only, no css token redef) → 0 violations", () => {
    fs.writeFileSync(
      path.join(tmp, "src", "App.tsx"),
      `import { Button } from "@nudge-eap/react";\nexport default () => <Button>ok</Button>;`,
    );
    fs.writeFileSync(path.join(tmp, "index.html"), `<!doctype html><div id="root"></div>`);
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

  it("detects no .tsx in src/", () => {
    fs.writeFileSync(path.join(tmp, "src", "App.jsx"), `export default () => null;`);
    fs.writeFileSync(path.join(tmp, "index.html"), `<!doctype html>`);
    const violations = auditMockupWorkspace(tmp);
    const v = violations.find((x) => x.rule === "no-tsx-found");
    expect(v).toBeTruthy();
  });

  it("reports multiple violations simultaneously", () => {
    fs.writeFileSync(path.join(tmp, "src", "fake.html"), `<div>x</div>`);
    fs.writeFileSync(path.join(tmp, "src", "tokens.css"), `:root { --nds-color-primary: #000; }`);
    fs.writeFileSync(path.join(tmp, "preview.html"), `<div>x</div>`);
    const rules = auditMockupWorkspace(tmp).map((v) => v.rule);
    expect(rules).toContain("raw-html-in-src");
    expect(rules).toContain("raw-html-in-root");
    expect(rules).toContain("inline-root-tokens");
    expect(rules).toContain("no-tsx-found");
  });

  it("ignores node_modules / dist / dot directories", () => {
    fs.writeFileSync(path.join(tmp, "src", "App.tsx"), `export default () => null;`);
    fs.mkdirSync(path.join(tmp, "src", "node_modules", "x"), { recursive: true });
    fs.writeFileSync(path.join(tmp, "src", "node_modules", "x", "y.html"), `<div></div>`);
    fs.mkdirSync(path.join(tmp, "dist"), { recursive: true });
    fs.writeFileSync(path.join(tmp, "dist", "index.html"), `<!doctype html>`);
    const violations = auditMockupWorkspace(tmp);
    expect(violations).toEqual([]);
  });
});
