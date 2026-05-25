import { describe, expect, it } from "vitest";
import { configureSetup, getBrand, getHtmlEntryImports } from "../src/tools/setup.js";
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
