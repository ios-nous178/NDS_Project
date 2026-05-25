import { describe, expect, it } from "vitest";
import {
  configureSetup,
  getBrand,
  getHtmlEntryImports,
  getSetup,
  getSetupInstructions,
} from "../src/tools/setup.js";
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
  it("surfaces visual reference collection in summary flow", () => {
    configureWithManifest({
      packages: htmlSetupPackages(),
    });

    const result = getSetup({ step: "full", intent: "html" });
    expect("steps" in result ? result.steps : []).toContain(
      "Collect visual references first and save them in references.md.",
    );
    expect("nextTools" in result ? result.nextTools : []).toContain(
      "get_guide({ topic: 'pattern:visual-reference' })",
    );
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
  });
});
