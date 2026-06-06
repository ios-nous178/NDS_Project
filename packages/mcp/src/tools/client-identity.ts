/**
 * MCP 클라이언트 식별 SSOT — "이 호출이 어디서 왔나"를 observability 레코드에 붙인다.
 *
 * 두 출처를 합친다(명시 env 가 자동 추론을 항상 덮어쓴다):
 *   1. 자동: MCP initialize 의 clientInfo (server.getClientVersion() = { name, version, title? }).
 *      클라이언트가 보내주는 이름으로 codex/claude/cursor 정도는 추론 가능.
 *   2. 명시: NUDGE_AGENT / NUDGE_AGENT_SURFACE env — .mcp.json 의 mcpServers.*.env 로 주입.
 *      stdio 에는 HTTP 헤더 같은 게 없어 "code/cli/chat" 같은 실행 표면은 클라이언트가
 *      안 보내면 서버가 알 수 없다 → env 로 보강하는 게 가장 확실하다.
 *
 * 자동(누락 가능) + 명시(설정 누락 가능) 둘 다 저장해 로그에서 교차 검증할 수 있게 한다.
 */
import type { Server } from "@modelcontextprotocol/sdk/server/index.js";

export type AgentKind = "claude" | "codex" | "cursor" | "windsurf" | "unknown" | string;
export type AgentSurface = "code" | "cli" | "chat" | "desktop" | "ide" | "unknown" | string;

export interface ClientIdentity {
  /** codex / claude / cursor … (env NUDGE_AGENT 우선, 없으면 clientInfo.name 추론). */
  agent: AgentKind;
  /** code / cli / chat / desktop … (env NUDGE_AGENT_SURFACE 우선, 없으면 추론). 미상이면 'unknown'. */
  surface: AgentSurface;
  /** initialize 가 준 raw clientInfo.name (예: 'claude-code', 'Cursor'). */
  clientName: string | null;
  /** raw clientInfo.version. */
  clientVersion: string | null;
  /** raw clientInfo.title (있으면). */
  clientTitle: string | null;
  /** dev(모노레포 직접) vs mcpb(Desktop 번들). */
  installMode: "dev" | "mcpb" | null;
  /** 전송 방식 — 현재 항상 stdio. */
  transport: "stdio";
  /** nudge-ds MCP 서버 버전(manifest). */
  mcpVersion: string | null;
  /** env 로 명시 override 가 실제로 적용됐는지 — 자동추론과의 차이를 로그에서 구분. */
  agentSource: "env" | "clientInfo" | "unknown";
  surfaceSource: "env" | "clientInfo" | "unknown";
}

interface ConfigureArgs {
  server: Server;
  installMode?: "dev" | "mcpb" | null;
  mcpVersion?: string | null;
}

let configured: ConfigureArgs | null = null;

export function configureClientIdentity(args: ConfigureArgs): void {
  configured = args;
}

/** clientInfo.name → agent 종류 추론. 못 맞추면 raw 이름(소문자) 또는 'unknown'. */
function inferAgent(clientName: string | null): AgentKind {
  if (!clientName) return "unknown";
  const n = clientName.toLowerCase();
  if (n.includes("codex")) return "codex";
  if (n.includes("claude")) return "claude";
  if (n.includes("cursor")) return "cursor";
  if (n.includes("windsurf")) return "windsurf";
  if (n.includes("cline")) return "cline";
  return n;
}

/** clientInfo.name → 실행 표면 추론. 확실치 않으면 'unknown'(= env 로 보강 권장). */
function inferSurface(clientName: string | null): AgentSurface {
  if (!clientName) return "unknown";
  const n = clientName.toLowerCase();
  // 'codex' 는 'code' 를 substring 으로 포함하므로 먼저 배제 — codex 표면은 보통 cli(미상이면 env 보강).
  if (n.includes("codex")) return n.includes("cli") ? "cli" : "unknown";
  if (n.includes("code")) return "code"; // claude-code, vscode
  if (n.includes("desktop")) return "desktop"; // claude desktop
  if (n.includes("cli")) return "cli";
  if (n.includes("cursor") || n.includes("windsurf") || n.includes("cline")) return "ide";
  // 'claude-ai' / 'claude' 단독은 보통 데스크톱 채팅 표면이지만 확정 불가 → unknown.
  return "unknown";
}

/**
 * 현재 호출의 클라이언트 식별을 best-effort 로 해석한다. initialize 이후엔 clientInfo 가
 * 채워지므로 매 레코드마다 호출해도 안전(throw 안 함). 미설정/초기화 전이면 env+null 로 폴백.
 */
export function getClientIdentity(): ClientIdentity {
  let clientName: string | null = null;
  let clientVersion: string | null = null;
  let clientTitle: string | null = null;
  try {
    const info = configured?.server.getClientVersion();
    if (info) {
      clientName = info.name ?? null;
      clientVersion = info.version ?? null;
      clientTitle = (info as { title?: string }).title ?? null;
    }
  } catch {
    /* initialize 전이거나 SDK 가 안 주면 null 폴백 */
  }

  const envAgent = process.env.NUDGE_AGENT?.trim().toLowerCase() || null;
  const envSurface = process.env.NUDGE_AGENT_SURFACE?.trim().toLowerCase() || null;

  const inferredAgent = inferAgent(clientName);
  const inferredSurface = inferSurface(clientName);

  const agent = envAgent ?? inferredAgent;
  const surface = envSurface ?? inferredSurface;

  return {
    agent,
    surface,
    clientName,
    clientVersion,
    clientTitle,
    installMode: configured?.installMode ?? null,
    transport: "stdio",
    mcpVersion: configured?.mcpVersion ?? null,
    agentSource: envAgent ? "env" : clientName ? "clientInfo" : "unknown",
    surfaceSource: envSurface ? "env" : inferredSurface !== "unknown" ? "clientInfo" : "unknown",
  };
}
