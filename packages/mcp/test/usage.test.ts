import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { attachUsageGuardOutcome, reportMockupUsage } from "../src/tools/usage";
import { parseMockupSource } from "../src/tools/usage/parser";
import { scanMockupsForBuildEvent, scanPendingMockupReports } from "../src/tools/usage/tracker";

const tmpDirs: string[] = [];

afterEach(() => {
  for (const dir of tmpDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe("reportMockupUsage", () => {
  it("parses a mockup in dry-run mode without writing log files or posting webhooks", async () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nudge-mcp-usage-"));
    tmpDirs.push(cwd);
    const filePath = path.join(cwd, "Demo.tsx");
    fs.writeFileSync(
      filePath,
      `import { Button } from "@nudge-design/react";

export function Demo() {
  return <Button color="primary">Start</Button>;
}
`,
      "utf8",
    );

    const result = await reportMockupUsage({ filePath, cwd, dryRun: true });

    expect(result.logPath).toBeNull();
    expect(result.webhook.attempted).toBe(false);
    expect(result.usage.meta.totalDs).toBeGreaterThan(0);
    expect(result.usage.meta.dsRatio).toBeGreaterThan(0);
    expect(fs.existsSync(path.join(cwd, ".ds-usage-log.jsonl"))).toBe(false);
  });

  it("reports DS ratio and DS version together in humanReadable (MUST)", async () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nudge-mcp-usage-version-"));
    tmpDirs.push(cwd);

    // Simulate an installed DS package in node_modules so detectDsVersions resolves a version.
    const pkgDir = path.join(cwd, "node_modules", "@nudge-design", "react");
    fs.mkdirSync(pkgDir, { recursive: true });
    fs.writeFileSync(
      path.join(pkgDir, "package.json"),
      JSON.stringify({ name: "@nudge-design/react", version: "9.8.7" }),
      "utf8",
    );

    const filePath = path.join(cwd, "Demo.tsx");
    fs.writeFileSync(
      filePath,
      `import { Button } from "@nudge-design/react";

export function Demo() {
  return <Button color="primary">Start</Button>;
}
`,
      "utf8",
    );

    const result = await reportMockupUsage({ filePath, cwd, dryRun: true });

    expect(result.usage.dsVersions?.primary).toBe("9.8.7");
    expect(result.usage.dsVersions?.source).toBe("node_modules");
    // MUST: humanReadable carries both ratio and version.
    expect(result.humanReadable).toContain("DS@9.8.7");
    expect(result.humanReadable).toMatch(/DS \d+ \(\d+%\)/);
    expect(result._nextSuggestion).toContain("DS 사용 비율");
    expect(result._nextSuggestion).toContain("DS 버전");
  });

  it("counts @nudge-design/html imports as DS (same bucket as react)", async () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nudge-mcp-usage-html-import-"));
    tmpDirs.push(cwd);
    const filePath = path.join(cwd, "Demo.tsx");
    fs.writeFileSync(
      filePath,
      `import { NdsButton } from "@nudge-design/html";

export function Demo() {
  return <NdsButton color="primary">Start</NdsButton>;
}
`,
      "utf8",
    );
    const result = await reportMockupUsage({ filePath, cwd, dryRun: true });
    expect(result.usage.context).toBe("user-app");
    expect(result.usage.meta.totalDs).toBeGreaterThan(0);
    expect(result.usage.ds.some((d) => d.component === "NdsButton")).toBe(true);
  });

  it("falls back to declared dependency range when node_modules is missing", async () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nudge-mcp-usage-declared-"));
    tmpDirs.push(cwd);

    fs.writeFileSync(
      path.join(cwd, "package.json"),
      JSON.stringify({
        name: "mockup-project",
        dependencies: { "@nudge-design/react": "^1.2.3" },
      }),
      "utf8",
    );

    const filePath = path.join(cwd, "Demo.tsx");
    fs.writeFileSync(
      filePath,
      `import { Button } from "@nudge-design/react";

export function Demo() {
  return <Button>Start</Button>;
}
`,
      "utf8",
    );

    const result = await reportMockupUsage({ filePath, cwd, dryRun: true });

    expect(result.usage.dsVersions?.source).toBe("package.json");
    expect(result.usage.dsVersions?.primary).toBe("^1.2.3");
    expect(result.humanReadable).toContain("DS@^1.2.3 (declared)");
  });
});

describe("attachUsageGuardOutcome", () => {
  it("attaches summarized auto-report outcomes instead of full file-level arrays", () => {
    const result = attachUsageGuardOutcome({ ok: true }, {
      autoReported: [
        {
          filePath: "index.html",
          ok: true,
          queued: false,
          totalDs: 4,
          dsRatio: 80,
          adoptionRatio: 80,
          overallRatio: 80,
          dsVersion: "1.2.3",
          reason: "build-event",
        },
        {
          filePath: "other.html",
          ok: false,
          queued: true,
          reason: "build-event",
        },
      ],
      pendingNotReported: [
        { filePath: "left.html", reason: "build-event", mtimeMs: 1, lastLoggedAtMs: null },
      ],
      notice: "reported",
    } as Parameters<typeof attachUsageGuardOutcome>[1]) as Record<string, unknown>;

    expect(result._autoReportedUsage).toEqual(
      expect.objectContaining({ count: 2, ok: 1, failed: 1, queued: 1 }),
    );
    expect(Array.isArray(result._autoReportedUsage)).toBe(false);
    expect(result._pendingMockupReports).toEqual({ count: 1 });
    expect(result._usageGuardNotice).toBe("reported");
  });
});

describe("parseMockupSource — <nds-*> Web Component tags", () => {
  const fakePath = "/tmp/Demo.tsx";

  it("maps <nds-button> JSX tag to DS Button entry (no import required)", () => {
    const source = `
export function Demo() {
  return (
    <div>
      <nds-button color="primary" variant="solid" size="lg">Start</nds-button>
      <nds-button color="secondary" variant="outlined">Cancel</nds-button>
    </div>
  );
}
`;
    const usage = parseMockupSource(source, fakePath);
    expect(usage.meta.totalDs).toBe(2);
    const components = usage.ds.map((d) => d.component);
    expect(components).toContain("Button");
    expect(usage.customNative.find((c) => c.tag === "nds-button")).toBeUndefined();
  });

  it("maps multi-word kebab tags to PascalCase (nds-icon-button → IconButton)", () => {
    const source = `<nds-icon-button aria-label="more"/>`;
    const usage = parseMockupSource(source, fakePath);
    expect(usage.ds.some((d) => d.component === "IconButton")).toBe(true);
  });

  it("captures variant/size/color attribute values for <nds-button> like JSX props", () => {
    const source = `<nds-button variant="soft" size="md" color="assistive">x</nds-button>`;
    const usage = parseMockupSource(source, fakePath);
    const entry = usage.ds.find((d) => d.component === "Button");
    expect(entry?.variant).toBe("soft");
    expect(entry?.size).toBe("md");
    expect(entry?.color).toBe("assistive");
  });

  it("non-nds lowercase custom elements are ignored (not DS, not native)", () => {
    const source = `<my-thing color="primary"></my-thing>`;
    const usage = parseMockupSource(source, fakePath);
    expect(usage.meta.totalDs).toBe(0);
    expect(usage.customNative.length).toBe(0);
  });

  it("html-only mockup (just nds-* tags, no DS import) still detected as user-app context via tag presence", () => {
    // 현재 detectContext 는 import 기반 — html-only 면 'unknown' 으로 떨어진다.
    // 이 케이스는 명세를 고정해 두기 위해 둠. 차후 tag presence 기반 추론을 넣게 되면 이 expect 를 갱신.
    const source = `<nds-button>x</nds-button>`;
    const usage = parseMockupSource(source, fakePath);
    expect(usage.context).toBe("unknown");
    expect(usage.meta.totalDs).toBe(1);
  });
});

describe("scanner — intent='html'", () => {
  it("finds root index.html when it uses <nds-*>", () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "scan-html-root-"));
    tmpDirs.push(cwd);
    fs.writeFileSync(
      path.join(cwd, "index.html"),
      `<!doctype html><body><nds-button>x</nds-button></body>`,
    );
    const pending = scanPendingMockupReports(cwd, "html");
    expect(pending.map((p) => p.filePath)).toContain("index.html");
  });

  it("skips index.html with no <nds-*> tags (Vite stub for React workflow)", () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "scan-html-stub-"));
    tmpDirs.push(cwd);
    fs.writeFileSync(
      path.join(cwd, "index.html"),
      `<!doctype html><body><div id="root"></div></body>`,
    );
    const pending = scanPendingMockupReports(cwd, "html");
    expect(pending).toEqual([]);
  });

  it("finds nested .html files in src/ that use <nds-*>", () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "scan-html-nested-"));
    tmpDirs.push(cwd);
    fs.mkdirSync(path.join(cwd, "src", "mockups"), { recursive: true });
    fs.writeFileSync(path.join(cwd, "src", "mockups", "page-a.html"), `<nds-button>x</nds-button>`);
    const pending = scanPendingMockupReports(cwd, "html");
    expect(pending.map((p) => p.filePath)).toContain(path.join("src", "mockups", "page-a.html"));
  });

  it("default intent='react' still finds only *Mockup.tsx (back-compat)", () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "scan-react-default-"));
    tmpDirs.push(cwd);
    fs.writeFileSync(path.join(cwd, "FooMockup.tsx"), `export default () => null;`);
    fs.writeFileSync(
      path.join(cwd, "index.html"),
      `<!doctype html><body><nds-button>x</nds-button></body>`,
    );
    // react intent → finds .tsx, ignores .html
    const reactPending = scanPendingMockupReports(cwd, "react");
    expect(reactPending.map((p) => p.filePath)).toContain("FooMockup.tsx");
    expect(reactPending.map((p) => p.filePath)).not.toContain("index.html");
    // html intent → finds .html, ignores .tsx
    const htmlPending = scanPendingMockupReports(cwd, "html");
    expect(htmlPending.map((p) => p.filePath)).toContain("index.html");
    expect(htmlPending.map((p) => p.filePath)).not.toContain("FooMockup.tsx");
  });

  it("scanMockupsForBuildEvent (html) returns most-recent .html as ship moment", () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "scan-html-build-"));
    tmpDirs.push(cwd);
    fs.writeFileSync(
      path.join(cwd, "index.html"),
      `<!doctype html><body><nds-button>x</nds-button></body>`,
    );
    const forced = scanMockupsForBuildEvent(cwd, "html");
    expect(forced.length).toBe(1);
    expect(forced[0].filePath).toBe("index.html");
    expect(forced[0].reason).toBe("build-event");
  });
});
