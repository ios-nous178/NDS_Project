import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  configureSetup,
  getBrand,
  getHtmlEntryImports,
  getSetup,
  getSetupInstructions,
} from "../src/tools/setup.js";
import { getClaudeMdTemplate } from "../src/tools/guides.js";
import type { Manifest } from "../src/types/manifest.js";

function configureWithManifest(manifest: Partial<Manifest>) {
  configureSetup({
    manifest: {
      generatedAt: "test",
      repoRoot: "/tmp/repo",
      packages: [],
      components: [],
      icons: [],
      tokens: [],
      brands: [],
      ...manifest,
    },
    installMode: "dev",
    mcpbManifest: null,
    tgzDirDefault: "/tmp/repo/packages/mcp/local-packages",
  });
}

function htmlSetupPackages(): Manifest["packages"] {
  return [
    {
      name: "@nudge-eap/html",
      version: "0.1.10",
      dependencies: {},
      peerDependencies: {},
      cssExports: ["@nudge-eap/html/styles.css"],
    },
    {
      name: "@nudge-eap/tokens",
      version: "0.1.10",
      dependencies: {},
      peerDependencies: {},
      cssExports: ["@nudge-eap/tokens/css"],
    },
    {
      name: "@nudge-eap/icons",
      version: "0.1.10",
      dependencies: {},
      peerDependencies: {},
    },
  ];
}

describe("setup brand registry", () => {
  it("exposes cashpobi when tokens css export exists even without a brand DESIGN.md entry", () => {
    configureWithManifest({
      packages: [
        {
          name: "@nudge-eap/tokens",
          version: "0.1.10",
          dependencies: {},
          peerDependencies: {},
          cssExports: ["@nudge-eap/tokens/css", "@nudge-eap/tokens/css/cashpobi"],
        },
        {
          name: "@nudge-eap/html",
          version: "0.1.10",
          dependencies: {},
          peerDependencies: {},
          cssExports: ["@nudge-eap/html/styles.css"],
        },
      ],
    });

    const result = getBrand({ brand: "cashpobi" });
    expect("detail" in result ? result.detail.ok : false).toBe(true);
    expect("detail" in result ? result.detail.cssImport : null).toBe(
      "@nudge-eap/tokens/css/cashpobi",
    );
    expect("detail" in result ? result.detail.ready : false).toBe(true);

    const imports = getHtmlEntryImports({ brand: "cashpobi" });
    expect(imports.code).toContain(`import "@nudge-eap/tokens/css/cashpobi";`);
  });
});

describe("html setup visual reference guardrail", () => {
  it("keeps repeated completion reporting gates in generated slim CLAUDE.md", () => {
    const template = getClaudeMdTemplate({ intent: "html" });

    expect(template).toContain("DS MCP/package version");
    expect(template).toContain("DS component usage/adoption status");
    expect(template).toContain("Google Sheets usage POST");
    expect(template).toContain("webhook ok");
    expect(template).toContain("webhook queued");
    expect(template).toContain("webhook skipped");
    expect(template).toContain("text-symbol-as-icon");
  });

  it("keeps repeated completion reporting gates in generated default CLAUDE.md", () => {
    const htmlTemplate = getClaudeMdTemplate({ intent: "html", template: "default" });
    const reactTemplate = getClaudeMdTemplate({ intent: "user-app", template: "default" });

    expect(htmlTemplate).toContain("DS MCP/Package 버전");
    expect(htmlTemplate).toContain("Google Sheets POST 상태");
    expect(htmlTemplate).toContain("텍스트 기호 아이콘 잔존 여부");
    expect(reactTemplate).toContain("DS MCP/Package 버전");
    expect(reactTemplate).toContain("Google Sheets POST 상태");
    expect(reactTemplate).toContain("텍스트 기호를 아이콘처럼 사용한 곳");
  });

  it("surfaces visual reference collection in summary flow", () => {
    configureWithManifest({
      packages: htmlSetupPackages(),
    });

    const result = getSetup({ step: "full", intent: "html" });
    expect("steps" in result ? result.steps : []).toContain(
      "Collect visual references first and save them in references.md.",
    );
    expect("steps" in result ? result.steps : []).toContain(
      "Create both CLAUDE.md and AGENTS.md so Claude/Codex receive the same mockup gates.",
    );
    expect("nextTools" in result ? result.nextTools : []).toContain(
      "get_setup({ step: 'agents-md', cwd: '<project>' })",
    );
    expect("nextTools" in result ? result.nextTools : []).toContain(
      "get_guide({ topic: 'pattern:visual-reference' })",
    );
  });

  it("creates AGENTS.md with the same completion gates", () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nudge-eap-agents-md-"));

    const result = getSetup({ step: "agents-md", cwd });

    expect("ok" in result ? result.ok : false).toBe(true);
    expect(fs.existsSync(path.join(cwd, "AGENTS.md"))).toBe(true);
    const content = fs.readFileSync(path.join(cwd, "AGENTS.md"), "utf-8");
    expect(content).toContain("Completion Gate");
    expect(content).toContain("DS MCP/package version");
    expect(content).toContain("Google Sheets usage POST");
  });

  it("includes an explicit references.md step in full html setup", () => {
    configureWithManifest({
      packages: htmlSetupPackages(),
    });

    const result = getSetupInstructions({ intent: "html", mode: "full" });
    const steps = "steps" in result ? result.steps : [];
    const referenceStep = steps.find((step) => step.title.includes("시각 레퍼런스"));

    expect(referenceStep?.code).toContain("# references.md");
    expect(referenceStep?.note).toContain("코드 작성 전에 항상 사용자에게 확인 질문");
    expect(referenceStep?.note).toContain("이미 있어도");
    expect(referenceStep?.note).toContain("missing-visual-references");

    const instructionStep = steps.find((step) => step.title.includes("AGENTS.md"));
    expect(instructionStep?.commands).toContain(
      "get_setup({ step: 'agents-md', cwd: '<프로젝트 루트>' })",
    );
  });
});
