import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { reportMockupUsage } from "../src/tools/usage";

const tmpDirs: string[] = [];

afterEach(() => {
  for (const dir of tmpDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe("reportMockupUsage", () => {
  it("parses a mockup in dry-run mode without writing log files or posting webhooks", async () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nudge-eap-mcp-usage-"));
    tmpDirs.push(cwd);
    const filePath = path.join(cwd, "Demo.tsx");
    fs.writeFileSync(
      filePath,
      `import { Button } from "@nudge-eap/react";

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
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nudge-eap-mcp-usage-version-"));
    tmpDirs.push(cwd);

    // Simulate an installed DS package in node_modules so detectDsVersions resolves a version.
    const pkgDir = path.join(cwd, "node_modules", "@nudge-eap", "react");
    fs.mkdirSync(pkgDir, { recursive: true });
    fs.writeFileSync(
      path.join(pkgDir, "package.json"),
      JSON.stringify({ name: "@nudge-eap/react", version: "9.8.7" }),
      "utf8",
    );

    const filePath = path.join(cwd, "Demo.tsx");
    fs.writeFileSync(
      filePath,
      `import { Button } from "@nudge-eap/react";

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

  it("falls back to declared dependency range when node_modules is missing", async () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nudge-eap-mcp-usage-declared-"));
    tmpDirs.push(cwd);

    fs.writeFileSync(
      path.join(cwd, "package.json"),
      JSON.stringify({
        name: "mockup-project",
        dependencies: { "@nudge-eap/react": "^1.2.3" },
      }),
      "utf8",
    );

    const filePath = path.join(cwd, "Demo.tsx");
    fs.writeFileSync(
      filePath,
      `import { Button } from "@nudge-eap/react";

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
