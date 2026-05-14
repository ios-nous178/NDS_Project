import { describe, expect, it } from "vitest";
import { cleanupDevServerSessions, startDevServer, stopDevServer } from "../src/tools/preview";

describe("dev server session cleanup", () => {
  it("terminates tracked child processes and clears the session registry", async () => {
    const started = await startDevServer({
      command: process.execPath,
      args: ["-e", "setInterval(() => {}, 1000);"],
      url: "http://127.0.0.1:9",
      timeoutMs: 1,
    });

    expect(started.sessionId).toMatch(/^dev-/);

    cleanupDevServerSessions();

    expect(stopDevServer({ sessionId: started.sessionId }).stopped).toEqual([
      { sessionId: started.sessionId, ok: false, note: "No such session." },
    ]);
  });
});
