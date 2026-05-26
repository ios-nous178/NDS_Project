import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  auditMockupWorkspace,
  detectWorkspaceIntent,
  injectHtmlUsageSummary,
  patchViteConfig,
} from "../src/tools/build-html.js";

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
    expect(out).toContain("build: { cssMinify: false }");
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

  it("adds cssMinify false to an existing build block", () => {
    const input = `import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  build: {
    sourcemap: true,
  },
});
`;
    const out = patchViteConfig(input);
    expect(out).not.toBeNull();
    expect(out).toMatch(/build:\s*\{\s*cssMinify:\s*false,\s*sourcemap:\s*true,/);
  });
});

describe("injectHtmlUsageSummary", () => {
  it("uses built dist/index.html counts and replaces stale visible DS badge text", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ds-summary-"));
    try {
      fs.writeFileSync(
        path.join(tmp, "package.json"),
        JSON.stringify({
          dependencies: {
            "@nudge-eap/tokens": "0.1.10",
          },
        }),
      );
      fs.mkdirSync(path.join(tmp, "dist"), { recursive: true });
      const outputPath = path.join(tmp, "dist", "index.html");
      fs.writeFileSync(
        outputPath,
        `<html><body>
          <main>
            <nds-brand-header></nds-brand-header>
            <nds-button>구매</nds-button>
            <nds-card><nds-chip>혜택</nds-chip></nds-card>
          </main>
          <footer><span data-ds-badge>DS@0.1.10 · DS 14 (94%)</span></footer>
        </body></html>`,
      );

      const summary = injectHtmlUsageSummary(tmp, outputPath);
      const html = fs.readFileSync(outputPath, "utf-8");

      expect(summary).toBe("DS@0.1.10 · DS 4 (100%)");
      expect(html).toContain(`<span data-ds-badge>DS@0.1.10 · DS 4 (100%)</span>`);
      expect(html).toContain("NudgeEAP DS usage: DS@0.1.10 · DS 4 (100%)");
      expect(html).not.toContain("DS 14 (94%)");
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
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

  it("detects no .tsx/.astro/.html in src/ (react intent)", () => {
    fs.writeFileSync(path.join(tmp, "src", "App.jsx"), `export default () => null;`);
    fs.writeFileSync(path.join(tmp, "index.html"), `<!doctype html>`);
    // no-tsx-found 는 react 워크플로우 전용 룰. 정책 변경 후 detectWorkspaceIntent 의 default 가
    // html 이라 intent 명시 없이는 fire 되지 않는다 — 의도된 react 룰 검증을 위해 intent='react' 지정.
    const violations = auditMockupWorkspace(tmp, "react");
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

  it("react intent: passes no-tsx-found when src/ has only .html (.html is a valid input), but raw-html-in-src still fires", () => {
    fs.writeFileSync(path.join(tmp, "src", "page.html"), `<nds-button>x</nds-button>`);
    fs.writeFileSync(path.join(tmp, "index.html"), `<!doctype html>`);
    fs.writeFileSync(
      path.join(tmp, "references.md"),
      `[good] source=figma caption=clean primary CTA only`,
    );
    // raw-html-in-src / no-tsx-found 는 react 워크플로우 룰. intent='react' 명시.
    const violations = auditMockupWorkspace(tmp, "react");
    // no-tsx-found 는 더 이상 안 뜬다 — .html 도 인식 가능한 입력 형식.
    expect(violations.find((x) => x.rule === "no-tsx-found")).toBeUndefined();
    // raw-html-in-src 는 별개 룰로 여전히 작동 (손글씨 HTML 가드는 그대로 유지).
    expect(violations.find((x) => x.rule === "raw-html-in-src")).toBeTruthy();
  });

  it("react intent: reports multiple violations simultaneously", () => {
    // react 룰셋 검증: raw-html-in-root (preview.html), inline-root-tokens (tokens.css),
    // no-tsx-found (src/ 에 .tsx/.astro/.html 모두 없음). intent='react' 로 명시한다.
    fs.writeFileSync(path.join(tmp, "src", "tokens.css"), `:root { --nds-color-primary: #000; }`);
    fs.writeFileSync(path.join(tmp, "preview.html"), `<div>x</div>`);
    const rules = auditMockupWorkspace(tmp, "react").map((v) => v.rule);
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

describe("detectWorkspaceIntent", () => {
  let tmp: string;

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "intent-ws-"));
  });

  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("returns 'html' when package.json has @nudge-eap/html without @nudge-eap/react", () => {
    fs.writeFileSync(
      path.join(tmp, "package.json"),
      JSON.stringify({ dependencies: { "@nudge-eap/html": "1.0.0" } }),
    );
    expect(detectWorkspaceIntent(tmp)).toBe("html");
  });

  it("returns 'react' when package.json has @nudge-eap/react (even if html is also present)", () => {
    fs.writeFileSync(
      path.join(tmp, "package.json"),
      JSON.stringify({
        dependencies: { "@nudge-eap/react": "1.0.0", "@nudge-eap/html": "1.0.0" },
      }),
    );
    expect(detectWorkspaceIntent(tmp)).toBe("react");
  });

  it("falls back to src/main.tsx → react", () => {
    fs.writeFileSync(path.join(tmp, "package.json"), JSON.stringify({}));
    fs.mkdirSync(path.join(tmp, "src"));
    fs.writeFileSync(path.join(tmp, "src", "main.tsx"), `export default null;`);
    expect(detectWorkspaceIntent(tmp)).toBe("react");
  });

  it("falls back to src/main.ts (no .tsx anywhere) → html", () => {
    fs.writeFileSync(path.join(tmp, "package.json"), JSON.stringify({}));
    fs.mkdirSync(path.join(tmp, "src"));
    fs.writeFileSync(path.join(tmp, "src", "main.ts"), `import "@nudge-eap/html/runtime";`);
    expect(detectWorkspaceIntent(tmp)).toBe("html");
  });

  it("defaults to 'html' for empty / brand-new workspaces (policy: html-first)", () => {
    // 2026-05-25 정책: React 신호 (package.json deps 의 @nudge-eap/react,
    // src/main.tsx, src/ 안의 .tsx) 가 없으면 모두 html. 빈 디렉터리도 html 로 분류.
    expect(detectWorkspaceIntent(tmp)).toBe("html");
  });

  it("returns 'react' when src/ has any .tsx file (legacy React mockup back-compat)", () => {
    fs.mkdirSync(path.join(tmp, "src"));
    fs.writeFileSync(path.join(tmp, "src", "Demo.tsx"), `export default () => null;`);
    expect(detectWorkspaceIntent(tmp)).toBe("react");
  });
});

describe("auditMockupWorkspace — html intent", () => {
  let tmp: string;

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "audit-html-"));
    fs.mkdirSync(path.join(tmp, "src"));
    fs.writeFileSync(
      path.join(tmp, "references.md"),
      `[good] source=figma caption=clean hero with single CTA`,
    );
  });

  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("clean html workspace (root index.html with <nds-*>, main.ts) → 0 violations", () => {
    fs.writeFileSync(
      path.join(tmp, "index.html"),
      `<!doctype html><body><nds-button color="primary">상담 신청</nds-button><script type="module" src="/src/main.ts"></script></body>`,
    );
    fs.writeFileSync(path.join(tmp, "src", "main.ts"), `import "@nudge-eap/html/runtime";`);
    expect(auditMockupWorkspace(tmp, "html")).toEqual([]);
  });

  it("flags missing root index.html (no-html-entry-found)", () => {
    fs.writeFileSync(path.join(tmp, "src", "main.ts"), `import "@nudge-eap/html/runtime";`);
    const v = auditMockupWorkspace(tmp, "html").find((x) => x.rule === "no-html-entry-found");
    expect(v).toBeTruthy();
    expect(v?.detail).toContain("index.html");
  });

  it("flags index.html with no <nds-*> tags (html-entry-has-no-nds-tag)", () => {
    fs.writeFileSync(
      path.join(tmp, "index.html"),
      `<!doctype html><body><button class="nds-button">fake</button></body>`,
    );
    fs.writeFileSync(path.join(tmp, "src", "main.ts"), `import "@nudge-eap/html/runtime";`);
    const v = auditMockupWorkspace(tmp, "html").find((x) => x.rule === "html-entry-has-no-nds-tag");
    expect(v).toBeTruthy();
    expect(v?.files).toContain("index.html");
  });

  it("does NOT fire raw-html-in-src for html intent (vanilla can have multi-page demos)", () => {
    fs.writeFileSync(
      path.join(tmp, "index.html"),
      `<!doctype html><body><nds-button>x</nds-button></body>`,
    );
    fs.writeFileSync(path.join(tmp, "src", "main.ts"), `// entry`);
    fs.writeFileSync(
      path.join(tmp, "src", "screen2.html"),
      `<nds-button>second screen</nds-button>`,
    );
    const violations = auditMockupWorkspace(tmp, "html");
    expect(violations.find((x) => x.rule === "raw-html-in-src")).toBeUndefined();
  });

  it("does NOT fire raw-html-in-root for html intent (multi-page entry points OK)", () => {
    fs.writeFileSync(
      path.join(tmp, "index.html"),
      `<!doctype html><body><nds-button>x</nds-button></body>`,
    );
    fs.writeFileSync(
      path.join(tmp, "about.html"),
      `<!doctype html><body><nds-button>about</nds-button></body>`,
    );
    fs.writeFileSync(path.join(tmp, "src", "main.ts"), `// entry`);
    const violations = auditMockupWorkspace(tmp, "html");
    expect(violations.find((x) => x.rule === "raw-html-in-root")).toBeUndefined();
  });

  it("does NOT fire no-tsx-found for html intent (html workspace has only .ts in src/)", () => {
    fs.writeFileSync(
      path.join(tmp, "index.html"),
      `<!doctype html><body><nds-button>x</nds-button></body>`,
    );
    fs.writeFileSync(path.join(tmp, "src", "main.ts"), `// entry`);
    const violations = auditMockupWorkspace(tmp, "html");
    expect(violations.find((x) => x.rule === "no-tsx-found")).toBeUndefined();
  });

  it("STILL fires inline-root-tokens for html intent (token SSOT is intent-agnostic)", () => {
    fs.writeFileSync(
      path.join(tmp, "index.html"),
      `<!doctype html><body><nds-button>x</nds-button></body>`,
    );
    fs.writeFileSync(path.join(tmp, "src", "main.ts"), `// entry`);
    fs.writeFileSync(
      path.join(tmp, "src", "index.css"),
      `:root { --color-semantic-bg-primary: #fff; }`,
    );
    const v = auditMockupWorkspace(tmp, "html").find((x) => x.rule === "inline-root-tokens");
    expect(v).toBeTruthy();
    expect(v?.detail).toContain("main.ts");
  });

  it("auto-detects html intent from package.json when not passed explicitly", () => {
    fs.writeFileSync(
      path.join(tmp, "package.json"),
      JSON.stringify({ dependencies: { "@nudge-eap/html": "1.0.0" } }),
    );
    fs.writeFileSync(
      path.join(tmp, "index.html"),
      `<!doctype html><body><nds-button>x</nds-button></body>`,
    );
    fs.writeFileSync(path.join(tmp, "src", "main.ts"), `// entry`);
    // src/foo.html 은 react 라면 raw-html-in-src 위반이지만, html 자동감지로 통과해야 한다.
    fs.writeFileSync(path.join(tmp, "src", "foo.html"), `<nds-button>x</nds-button>`);
    const violations = auditMockupWorkspace(tmp);
    expect(violations.find((x) => x.rule === "raw-html-in-src")).toBeUndefined();
    expect(violations.find((x) => x.rule === "no-tsx-found")).toBeUndefined();
  });
});
