import { afterEach, describe, expect, it } from "vitest";
import { configureClientIdentity, getClientIdentity } from "../src/tools/client-identity";

// "이 MCP 호출이 codex 인지 claude 인지, 어떤 표면(code/cli/chat)에서 왔는지"를
// observability 레코드에 붙이기 위한 식별 로직 회귀 가드. 자동(clientInfo) + 명시(env) 합성.

type Info = { name: string; version: string; title?: string } | undefined;

function withClient(info: Info) {
  configureClientIdentity({
    server: { getClientVersion: () => info } as never,
    installMode: "dev",
    mcpVersion: "9.9.9",
  });
}

const ENV_KEYS = ["NUDGE_AGENT", "NUDGE_AGENT_SURFACE"] as const;
const saved: Record<string, string | undefined> = {};
for (const k of ENV_KEYS) saved[k] = process.env[k];

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

function clearEnv() {
  for (const k of ENV_KEYS) delete process.env[k];
}

describe("client-identity — clientInfo 자동 추론", () => {
  it("claude-code → agent=claude, surface=code", () => {
    clearEnv();
    withClient({ name: "claude-code", version: "1.2.3" });
    const c = getClientIdentity();
    expect(c.agent).toBe("claude");
    expect(c.surface).toBe("code");
    expect(c.agentSource).toBe("clientInfo");
    expect(c.clientVersion).toBe("1.2.3");
    expect(c.mcpVersion).toBe("9.9.9");
  });

  it("codex 는 'code' substring 오탐 없이 surface=unknown", () => {
    clearEnv();
    withClient({ name: "codex", version: "0.4" });
    const c = getClientIdentity();
    expect(c.agent).toBe("codex");
    expect(c.surface).toBe("unknown");
  });

  it("codex-cli → surface=cli", () => {
    clearEnv();
    withClient({ name: "codex-cli", version: "0.4" });
    expect(getClientIdentity().surface).toBe("cli");
  });

  it("Cursor → agent=cursor, surface=ide", () => {
    clearEnv();
    withClient({ name: "Cursor", version: "0.42" });
    const c = getClientIdentity();
    expect(c.agent).toBe("cursor");
    expect(c.surface).toBe("ide");
  });

  it("initialize 전(clientInfo 없음)이면 unknown 으로 폴백, throw 안 함", () => {
    clearEnv();
    withClient(undefined);
    const c = getClientIdentity();
    expect(c.agent).toBe("unknown");
    expect(c.surface).toBe("unknown");
    expect(c.clientName).toBeNull();
    expect(c.agentSource).toBe("unknown");
  });
});

describe("client-identity — env 명시 override", () => {
  it("NUDGE_AGENT / NUDGE_AGENT_SURFACE 가 자동추론을 덮어쓴다", () => {
    clearEnv();
    process.env.NUDGE_AGENT = "codex";
    process.env.NUDGE_AGENT_SURFACE = "chat";
    withClient({ name: "claude-code", version: "1.2.3" });
    const c = getClientIdentity();
    expect(c.agent).toBe("codex");
    expect(c.surface).toBe("chat");
    expect(c.agentSource).toBe("env");
    expect(c.surfaceSource).toBe("env");
    // 자동값(raw clientInfo)은 그대로 보존돼 로그에서 교차검증 가능.
    expect(c.clientName).toBe("claude-code");
  });
});
