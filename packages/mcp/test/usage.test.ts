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
    expect(fs.existsSync(path.join(cwd, ".ds-usage-log.jsonl"))).toBe(false);
  });
});
