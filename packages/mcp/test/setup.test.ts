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
      name: "@nudge-design/html",
      version: "0.1.10",
      dependencies: {},
      peerDependencies: {},
      cssExports: ["@nudge-design/html/styles.css"],
    },
    {
      name: "@nudge-design/tokens",
      version: "0.1.10",
      dependencies: {},
      peerDependencies: {},
      cssExports: ["@nudge-design/tokens/css"],
    },
    {
      name: "@nudge-design/icons",
      version: "0.1.10",
      dependencies: {},
      peerDependencies: {},
    },
  ];
}

describe("setup brand registry", () => {
  it("exposes cashwalk-biz when tokens css export exists even without a brand DESIGN.md entry", () => {
    configureWithManifest({
      packages: [
        {
          name: "@nudge-design/tokens",
          version: "0.1.10",
          dependencies: {},
          peerDependencies: {},
          cssExports: ["@nudge-design/tokens/css", "@nudge-design/tokens/css/cashwalk-biz"],
        },
        {
          name: "@nudge-design/html",
          version: "0.1.10",
          dependencies: {},
          peerDependencies: {},
          cssExports: ["@nudge-design/html/styles.css"],
        },
      ],
    });

    const result = getBrand({ brand: "cashwalk-biz" });
    expect("detail" in result ? result.detail.ok : false).toBe(true);
    expect("detail" in result ? result.detail.cssImport : null).toBe(
      "@nudge-design/tokens/css/cashwalk-biz",
    );
    expect("detail" in result ? result.detail.ready : false).toBe(true);

    const imports = getHtmlEntryImports({ brand: "cashwalk-biz" });
    expect(imports.code).toContain(`import "@nudge-design/tokens/css/cashwalk-biz";`);
  });

  it("slims the bundled brand roster on a detail call (keeps detail, drops heavy per-brand meta)", () => {
    configureWithManifest({
      packages: [
        {
          name: "@nudge-design/tokens",
          version: "0.1.10",
          dependencies: {},
          peerDependencies: {},
          cssExports: ["@nudge-design/tokens/css", "@nudge-design/tokens/css/cashwalk-biz"],
        },
      ],
    });

    const result = getBrand({ brand: "cashwalk-biz" }) as {
      brands: Array<Record<string, unknown>>;
      detail: Record<string, unknown>;
    };
    // detail 은 보존
    expect(result.detail.ok).toBe(true);
    // 로스터는 slug/name/ready 만 — description/cssImport/version/primaryColor 는 제거(중복)
    expect(result.brands.length).toBeGreaterThan(0);
    for (const b of result.brands) {
      expect(Object.keys(b).sort()).toEqual(["name", "ready", "slug"]);
    }
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

  it("brand 와 함께 claude-md 셋업 시 nudge.brand 마커를 canonical slug 로 박는다", () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nudge-eap-brand-marker-"));

    // 별칭(cashpobi)으로 호출해도 정식 slug 로 정규화돼 마커에 기록돼야 한다.
    const result = getSetup({ step: "claude-md", cwd, brand: "cashpobi", intent: "html" });

    expect("ok" in result ? result.ok : false).toBe(true);
    expect("brandMarker" in result ? result.brandMarker : undefined).toBe("cashwalk-biz");
    const markerPath = path.join(cwd, "nudge.brand");
    expect(fs.existsSync(markerPath)).toBe(true);
    expect(fs.readFileSync(markerPath, "utf-8").trim()).toBe("cashwalk-biz");
  });

  it("brand 없이 셋업하면 nudge.brand 마커를 만들지 않는다", () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nudge-eap-no-marker-"));

    const result = getSetup({ step: "agents-md", cwd });

    expect("ok" in result ? result.ok : false).toBe(true);
    expect(fs.existsSync(path.join(cwd, "nudge.brand"))).toBe(false);
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

type ExternalStarterResult = {
  ok: boolean;
  brand: string | null;
  files: {
    claudeMd: { ok: boolean; filePath?: string; error?: string };
    agentsMd: { ok: boolean; filePath?: string; error?: string };
  };
  mcpConfig: { mcpJson: string; claudeCodeCommand: string; serverPath: string };
  validationLoop: { step: number; tool: string; why: string }[];
  promptTemplates: { title: string; prompt: string }[];
};

describe("get_setup external-starter (도구 중립 온보딩)", () => {
  it("한 호출로 CLAUDE.md + AGENTS.md + mcpConfig + 검증루프 + 프롬프트템플릿을 낸다", () => {
    configureWithManifest({ packages: htmlSetupPackages() });
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nudge-eap-starter-"));

    const result = getSetup({ step: "external-starter", cwd, intent: "html" }) as ExternalStarterResult;

    expect(result.ok).toBe(true);
    expect(fs.existsSync(path.join(cwd, "CLAUDE.md"))).toBe(true);
    expect(fs.existsSync(path.join(cwd, "AGENTS.md"))).toBe(true);
    expect(result.files.claudeMd.ok).toBe(true);
    expect(result.files.agentsMd.ok).toBe(true);
    // .mcp.json 스니펫 — repoRoot 의 server.js 경로(Claude Code/Cursor/Codex 공용)
    expect(result.mcpConfig.serverPath).toBe("/tmp/repo/packages/mcp/dist/server.js");
    expect(result.mcpConfig.mcpJson).toContain("/tmp/repo/packages/mcp/dist/server.js");
    expect(result.mcpConfig.mcpJson).toContain("mcpServers");
    expect(result.mcpConfig.claudeCodeCommand).toContain("claude mcp add nudge-ds");
    // 검증 루프 3단계
    expect(result.validationLoop.map((s) => s.step)).toEqual([1, 2, 3]);
    expect(result.validationLoop[1].tool).toContain("build_singlefile_html");
    // 프롬프트 템플릿
    expect(result.promptTemplates.length).toBeGreaterThanOrEqual(3);
    expect(result.promptTemplates[0].prompt).toContain("NDS");
  });

  it("캐포비 브랜드면 어드민 Page-Pattern 프롬프트를 덧붙이고 nudge.brand 마커를 박는다", () => {
    configureWithManifest({ packages: htmlSetupPackages() });
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nudge-eap-starter-cpb-"));

    const result = getSetup({
      step: "external-starter",
      cwd,
      brand: "cashpobi",
      intent: "html",
    }) as ExternalStarterResult;

    expect(result.brand).toBe("cashwalk-biz");
    expect(fs.readFileSync(path.join(cwd, "nudge.brand"), "utf-8").trim()).toBe("cashwalk-biz");
    const titles = result.promptTemplates.map((t) => t.title);
    expect(titles.some((t) => t.includes("캐포비"))).toBe(true);
  });

  it("CLAUDE.md 가 이미 있고 overwrite 미지정이면 ok:false 로 보고한다(files[].error)", () => {
    configureWithManifest({ packages: htmlSetupPackages() });
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nudge-eap-starter-exists-"));
    fs.writeFileSync(path.join(cwd, "CLAUDE.md"), "기존 내용", "utf-8");

    const result = getSetup({ step: "external-starter", cwd, intent: "html" }) as ExternalStarterResult;

    expect(result.ok).toBe(false);
    expect(result.files.claudeMd.ok).toBe(false);
    expect(result.files.claudeMd.error).toContain("already exists");
  });
});
