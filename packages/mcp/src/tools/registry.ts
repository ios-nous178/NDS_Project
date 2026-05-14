import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

export type ToolArgs = Record<string, unknown>;
export type ToolHandler = (args: ToolArgs) => unknown | Promise<unknown>;
export type ToolHandlers = Record<string, ToolHandler>;

export interface ToolAfterCallContext {
  name: string;
  args: ToolArgs;
  result: unknown;
}

export interface RegisterToolHandlersOptions {
  afterCall?: (context: ToolAfterCallContext) => unknown | Promise<unknown>;
}

const TOOLS = [
  {
    name: "get_scope_advisory",
    description:
      "Return the role of this MCP (external mockup project builder + mockup generator — NOT a DS repo editor and NOT a GitHub pusher) and the user-app vs admin-cms branching rule. Call this first if there's any ambiguity about scope or which design system to use. Cheap one-shot rule of thumb without loading full component data.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "list_brands",
    description:
      "List all sub-brands available in this design system (auto-discovered from brands/ folder + tokens dist). Each brand has slug, name, primary color, css import path, and 'ready' flag (false = token CSS export not yet wired up). Use this whenever the user picks or references a brand.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_brand_info",
    description:
      "Return full info for one brand: name, version, description, key semantic colors (primary/secondary/error/caution/success/surface/onSurface), font families, css/js import paths, and main.tsx import order. Use after list_brands to drill into a specific brand.",
    inputSchema: {
      type: "object",
      properties: {
        brand: {
          type: "string",
          description: "Brand slug (e.g. 'trost', 'nudge-eap', 'geniet'). See list_brands.",
        },
      },
      required: ["brand"],
      additionalProperties: false,
    },
  },
  {
    name: "get_admin_cms_guide",
    description:
      "Return the visual / structural conventions for admin / CMS / 운영툴 / 백오피스 mockups (sider, page header, search form, table, status tags, modal, color tokens). Source: NudgeEAPCMS (antd 5.5.1) actual operating code. Use this INSTEAD of get_design_principles when building admin screens — admin uses antd v5, not @nudge-eap/react.",
    inputSchema: {
      type: "object",
      properties: {
        intent: {
          type: "string",
          description:
            "Optional natural-language intent string (e.g. user prompt) to confirm admin-cms detection. Not required.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "list_components",
    description:
      "Return all available DS React components (user-app: Trost / Geniet / NudgeEAP). For admin / CMS screens, do NOT use these — call get_admin_cms_guide instead.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_component",
    description: "Get props detail of a specific DS component by exact name.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Component name (case-sensitive, e.g. 'Button')" },
      },
      required: ["name"],
      additionalProperties: false,
    },
  },
  {
    name: "search_component",
    description: "Search components by natural language query (e.g. 'tab', 'avatar').",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
      additionalProperties: false,
    },
  },
  {
    name: "list_icons",
    description:
      "Return all icons in @nudge-eap/icons with Figma Iconography(379:490) category and Line/Filled/Color style metadata. Response also includes `byCategory` index. Always pair with get_pattern_guide('iconography') for size/touch/style rules and get_pattern_guide('icon-color') for token mapping.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "find_icon",
    description:
      "Find icons by natural language query (e.g. 'search', 'arrow back'). Result entries include category/style/pair fields so callers can pick the right Line vs Filled variant.",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
      additionalProperties: false,
    },
  },
  {
    name: "list_tokens",
    description: "List design tokens, optionally filtered by group ('color', 'spacing', etc.).",
    inputSchema: {
      type: "object",
      properties: { group: { type: "string" } },
      additionalProperties: false,
    },
  },
  {
    name: "lookup_token",
    description:
      "Find tokens by query (matches against name and value, e.g. '#FF5722' or 'primary').",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
      additionalProperties: false,
    },
  },
  {
    name: "validate_mockup",
    description:
      "Validate a mockup .tsx source against DS rules. Catches inline color/spacing/native elements/inline SVG/emoji-as-icon/gradient + pattern-level anti-patterns (primary CTA overuse, arrow-icon repeat, Chip overuse/missing-label, nested Card, Card 당 Badge·Chip 3+ 과다, Card.Footer 버튼 3+, primary 컬러 역할 과적, tone-on-tone, default icon color, 강조 장치 4+ 동시 사용 등) + user-app 목업에 antd import 잔존 검출. Provide either 'source' (string) or 'filePath' (absolute). Returns { ok, violationCount, summary: { byRule, topRules, humanReadable }, violations }. **사용자에게 violationCount + humanReadable 을 항상 보여주세요 — 안 보여주면 사용자가 위반이 얼마나 남았는지 모름.**",
    inputSchema: {
      type: "object",
      properties: {
        source: { type: "string" },
        filePath: { type: "string" },
        intent: {
          type: "string",
          enum: ["user-app", "admin-cms"],
          description:
            "Workspace intent. 'admin-cms' 일 때만 antd 임포트가 정상으로 간주됩니다 (admin-cms 룰은 향후 추가). 기본 'user-app'.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "suggest_replacement",
    description:
      "Given a code snippet containing inline color/spacing, suggest token replacements.",
    inputSchema: {
      type: "object",
      properties: {
        snippet: { type: "string" },
        rule: { type: "string" },
      },
      required: ["snippet"],
      additionalProperties: false,
    },
  },
  {
    name: "list_packages",
    description:
      "List DS packages with version, required/optional, inter-package dependencies, peer deps, and CSS exports. Use this to understand what to install in an external project.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_install_command",
    description:
      "Return a ready-to-run 'npm install ./...tgz' command for the external project. Verifies that all required .tgz files exist in tgzDir (default: <DS_repo>/local-packages).",
    inputSchema: {
      type: "object",
      properties: {
        tgzDir: {
          type: "string",
          description: "Directory containing the .tgz files. Default: <DS_repo>/local-packages",
        },
        includeTailwind: {
          type: "boolean",
          description: "Include @nudge-eap/tailwind-preset (default: false).",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "check_mcp_update",
    description:
      "Check whether a newer version of this MCP (.mcpb) is available on GitHub Releases. Compares installed manifest.json version with the latest release. Use this when the user asks: '최신 버전 있어?', 'MCP 업데이트 있어?', 'check for updates'. Returns installed/latest version, download URL, and step-by-step update instructions if outdated.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_update_instructions",
    description:
      "Return commands for planners/non-developers to update this NudgeEAPDesignSystem repository from GitHub and rebuild the MCP server. Typical request: 'git pull origin main 후 pnpm build --filter @nudge-eap/mcp 해줘'.",
    inputSchema: {
      type: "object",
      properties: {
        source: {
          type: "string",
          description: "Where the repo came from. Default: 'github'.",
        },
        includeLocalPackages: {
          type: "boolean",
          description: "Also include pnpm release:local for .tgz package refresh. Default: false.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_main_tsx_imports",
    description:
      "Return the CSS import lines that must be added to src/main.tsx. Pass an optional 'brand' slug — validated against the dynamic brand list (list_brands). If a brand has no CSS export yet, the response notes that and falls back gracefully.",
    inputSchema: {
      type: "object",
      properties: {
        brand: {
          type: "string",
          description:
            "Brand slug (see list_brands). If omitted, the first 'ready' brand is used as default.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "create_claude_md",
    description:
      "Create a CLAUDE.md file in an external mockup project with usage rules, validation loop, and preview-check workflow. Pass intent='admin-cms' for admin/CMS projects (antd-based) or intent='user-app' for user app projects (default).",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description:
            "Project root where CLAUDE.md will be created. Defaults to the MCP process cwd.",
        },
        projectName: {
          type: "string",
          description: "Optional title for the generated CLAUDE.md.",
        },
        overwrite: {
          type: "boolean",
          description: "Replace an existing CLAUDE.md. Default: false.",
        },
        intent: {
          type: "string",
          description:
            "Workspace intent. 'admin-cms' generates an antd-based admin guide; 'user-app' (default) generates the DS-based user-app guide. Free-text strings are scanned for admin keywords (어드민/CMS/운영툴/백오피스/admin/cms/backoffice).",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_design_principles",
    description:
      "Return DESIGN.md-derived principles: brand tone, color semantics, typography rules, spacing scale, elevation rules, shape scale, do's/don'ts, banned patterns. Call this at the start of any mockup task.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_dos_and_donts",
    description:
      "Return short Do/Don't rules (subset of get_design_principles). Useful as a final sanity check before finishing a mockup.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_export_html_instructions",
    description:
      "Return instructions to export a mockup as a dependency-free, fully interactive single HTML file (Vite + vite-plugin-singlefile). Interactions, hover transitions, hash routing all preserved. Use this whenever the user (or you, as a follow-up) wants a shareable single .html artifact.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_inspector_setup",
    description:
      "Return setup instructions for the DsInspector runtime overlay (@nudge-eap/react/inspector). Adds a floating button in the dev preview that toggles outline + counts for DS / antd / native elements (Ctrl/Cmd+Shift+D). Use during initial workspace setup or when the user wants to visually verify DS adoption. Pairs with validate_mockup (static) — Inspector is runtime DOM-based.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "report_mockup_usage",
    description:
      "REQUIRED final step after generating or modifying a mockup .tsx (and also after exporting HTML). Parse a mockup TSX file with AST and aggregate Design System usage; classifies each JSX element as ds (@nudge-eap/react), adminCms (antd), customNative (raw HTML primitives like <button>/<input>), or external. Always appends to .ds-usage-log.jsonl at the project root AND POSTs to the shared Google Sheets usage webhook (URL hardcoded in the MCP — no auth, no env var, works in any external project without setup). The webhook POST uses timeout/retry and queues failed payloads in .ds-usage-webhook-queue.jsonl for retry on later calls. Skipping this leaves the central usage sheet empty for this mockup. Returns the aggregated usage object plus webhook ok/status/queue info.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "Absolute or repo-relative path to the mockup .tsx file to analyze.",
        },
        mockupName: {
          type: "string",
          description: "Optional display name. Defaults to the filename without extension.",
        },
        context: {
          type: "string",
          enum: ["user-app", "admin-cms", "unknown"],
          description: "Override context detection. Default: auto-detected from imports.",
        },
        brand: {
          type: "string",
          enum: ["trost", "geniet", "nudge-eap"],
          description: "Override brand detection. Default: auto-detected from filename/path.",
        },
        cwd: {
          type: "string",
          description:
            "Project root used to relativize file paths and place the log file. Defaults to MCP process cwd.",
        },
        dryRun: {
          type: "boolean",
          description:
            "If true, return usage but do NOT write to JSONL or POST to the Sheets webhook. Default: false.",
        },
      },
      required: ["filePath"],
      additionalProperties: false,
    },
  },
  {
    name: "start_dev_server",
    description:
      "Start a local mockup development server from the project root and wait until its URL responds. Use before visual/runtime preview checks.",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description: "Project root. Defaults to the MCP process cwd.",
        },
        command: {
          type: "string",
          description: "Executable to run. Default: npm.",
        },
        args: {
          type: "array",
          items: { type: "string" },
          description: "Command args. Default: ['run', 'dev', '--', '--host', '127.0.0.1'].",
        },
        url: {
          type: "string",
          description:
            "Expected dev server URL. If omitted, parsed from logs or falls back to http://127.0.0.1:5173.",
        },
        port: {
          type: "number",
          description: "Convenience fallback for url, e.g. 5173.",
        },
        timeoutMs: {
          type: "number",
          description: "Wait timeout. Default: 20000.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "check_preview",
    description:
      "Open a dev-server URL in Playwright and detect runtime errors, Vite error overlays, failed requests, and likely blank screens. Requires playwright installed in the mockup project.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description:
            "Base URL to check. Defaults to start_dev_server session URL or http://127.0.0.1:5173.",
        },
        routePath: {
          type: "string",
          description:
            "Optional route path or hash path to append, e.g. '/trost/list' or '#/trost/list'.",
        },
        cwd: {
          type: "string",
          description:
            "Project root used to resolve playwright. Defaults to session cwd or MCP cwd.",
        },
        sessionId: {
          type: "string",
          description: "Session id returned by start_dev_server.",
        },
        timeoutMs: {
          type: "number",
          description: "Navigation/check timeout. Default: 15000.",
        },
        minTextLength: {
          type: "number",
          description:
            "Minimum body text length before the page is suspicious if few visible elements exist. Default: 8.",
        },
        viewport: {
          type: "object",
          properties: {
            width: { type: "number" },
            height: { type: "number" },
          },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "stop_dev_server",
    description:
      "Stop a dev server started by start_dev_server. If sessionId is omitted, stops all dev server sessions owned by this MCP process.",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: { type: "string" },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_component_guide",
    description:
      "Return curated usage guide for a specific component (pitfalls, color/size/state matrix, accessibility, interactive pattern, figmaNodeUrl). Always call this before using Button/Card/Chip/IconButton/Tabs/Select for the first time in a mockup.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Component name, e.g. 'Button'" },
      },
      required: ["name"],
      additionalProperties: false,
    },
  },
  {
    name: "get_pattern_guide",
    description:
      "Return UX pattern guidance for mockup layout decisions: CTA groups, icon color, full iconography spec (size/touch/style), visual antipatterns, notice/callout emphasis, dropdown option density, and dense lists. Use whenever visual hierarchy, icon usage, or information density is ambiguous.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description:
            "Pattern name: 'cta-group', 'icon-color', 'iconography', 'visual-antipatterns', 'notice', 'dropdown', or 'dense-list'.",
        },
      },
      required: ["name"],
      additionalProperties: false,
    },
  },
  {
    name: "list_figma_sync_status",
    description:
      "List all curated component guides and whether each is synced with a Figma node (figmaNodeUrl/sizeMatrix/stateMatrix). Useful for design QA — see which components still need a Figma-spec audit.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: "get_setup_instructions",
    description:
      "Return a step-by-step setup guide for a fresh external mockup project. Pass intent='admin-cms' for admin/CMS projects (antd-based setup with NudgeEAPCMS conventions) or omit / pass 'user-app' for the default user-app DS setup (Vite + .tgz install + CSS imports + MCP registration).",
    inputSchema: {
      type: "object",
      properties: {
        intent: {
          type: "string",
          description:
            "Workspace intent. 'admin-cms' returns antd-based setup steps; 'user-app' (default) returns DS-based setup. Free-text strings are scanned for admin keywords (어드민/CMS/운영툴/백오피스/admin/cms/backoffice).",
        },
        tgzDir: {
          type: "string",
          description:
            "[user-app only] Where the .tgz files live. Default: <DS_repo>/local-packages",
        },
        brand: {
          type: "string",
          description:
            "[user-app only] Brand slug (see list_brands). If omitted, the first 'ready' brand is used as default.",
        },
        withRouter: {
          type: "boolean",
          description: "Include the react-router-dom install step (default: true).",
        },
        includeTailwind: {
          type: "boolean",
          description:
            "[user-app only] Include @nudge-eap/tailwind-preset install (default: false).",
        },
      },
      additionalProperties: false,
    },
  },
];

const CONTEXT_VALUES = ["user-app", "admin-cms", "unknown"] as const;
const MOCKUP_INTENT_VALUES = ["user-app", "admin-cms"] as const;
const BRAND_VALUES = ["trost", "geniet", "nudge-eap"] as const;

function readArgs(toolName: string, args: unknown): ToolArgs {
  if (args === undefined || args === null) return {};
  if (typeof args === "object" && !Array.isArray(args)) return args as ToolArgs;
  throw new Error(`${toolName}: arguments must be an object.`);
}

function requireString(args: ToolArgs, key: string, toolName: string): string {
  const value = args[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${toolName}: '${key}' must be a non-empty string.`);
  }
  return value;
}

function optionalString(args: ToolArgs, key: string, toolName: string): string | undefined {
  const value = args[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string") throw new Error(`${toolName}: '${key}' must be a string.`);
  return value;
}

function optionalBoolean(args: ToolArgs, key: string, toolName: string): boolean | undefined {
  const value = args[key];
  if (value === undefined) return undefined;
  if (typeof value !== "boolean") throw new Error(`${toolName}: '${key}' must be a boolean.`);
  return value;
}

function optionalNumber(
  args: ToolArgs,
  key: string,
  toolName: string,
  opts: { min?: number } = {},
): number | undefined {
  const value = args[key];
  if (value === undefined) return undefined;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${toolName}: '${key}' must be a finite number.`);
  }
  if (opts.min !== undefined && value < opts.min) {
    throw new Error(`${toolName}: '${key}' must be >= ${opts.min}.`);
  }
  return value;
}

function optionalStringArray(args: ToolArgs, key: string, toolName: string): string[] | undefined {
  const value = args[key];
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${toolName}: '${key}' must be an array of strings.`);
  }
  return value;
}

function optionalEnum<T extends readonly string[]>(
  args: ToolArgs,
  key: string,
  values: T,
  toolName: string,
): T[number] | undefined {
  const value = args[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string" || !values.includes(value)) {
    throw new Error(`${toolName}: '${key}' must be one of: ${values.join(", ")}.`);
  }
  return value;
}

function optionalViewport(
  args: ToolArgs,
  key: string,
  toolName: string,
): { width?: number; height?: number } | undefined {
  const value = args[key];
  if (value === undefined) return undefined;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${toolName}: '${key}' must be an object.`);
  }
  const viewport = value as ToolArgs;
  return {
    width: optionalNumber(viewport, "width", `${toolName}.${key}`, { min: 1 }),
    height: optionalNumber(viewport, "height", `${toolName}.${key}`, { min: 1 }),
  };
}

function validateToolArgs(toolName: string, rawArgs: unknown): ToolArgs {
  const args = readArgs(toolName, rawArgs);
  switch (toolName) {
    case "get_brand_info":
      return { brand: requireString(args, "brand", toolName) };
    case "get_admin_cms_guide":
      return { intent: optionalString(args, "intent", toolName) };
    case "get_component":
    case "get_component_guide":
    case "get_pattern_guide":
      return { name: requireString(args, "name", toolName) };
    case "search_component":
    case "find_icon":
    case "lookup_token":
      return { query: requireString(args, "query", toolName) };
    case "list_tokens":
      return { group: optionalString(args, "group", toolName) };
    case "validate_mockup":
      return {
        source: optionalString(args, "source", toolName),
        filePath: optionalString(args, "filePath", toolName),
        intent: optionalEnum(args, "intent", MOCKUP_INTENT_VALUES, toolName),
      };
    case "suggest_replacement":
      return {
        snippet: requireString(args, "snippet", toolName),
        rule: optionalString(args, "rule", toolName),
      };
    case "get_install_command":
      return {
        tgzDir: optionalString(args, "tgzDir", toolName),
        includeTailwind: optionalBoolean(args, "includeTailwind", toolName),
      };
    case "get_update_instructions":
      return {
        source: optionalString(args, "source", toolName),
        includeLocalPackages: optionalBoolean(args, "includeLocalPackages", toolName),
      };
    case "get_main_tsx_imports":
      return { brand: optionalEnum(args, "brand", BRAND_VALUES, toolName) };
    case "create_claude_md":
      return {
        cwd: optionalString(args, "cwd", toolName),
        projectName: optionalString(args, "projectName", toolName),
        overwrite: optionalBoolean(args, "overwrite", toolName),
        intent: optionalString(args, "intent", toolName),
      };
    case "get_setup_instructions":
      return {
        tgzDir: optionalString(args, "tgzDir", toolName),
        brand: optionalString(args, "brand", toolName),
        withRouter: optionalBoolean(args, "withRouter", toolName),
        includeTailwind: optionalBoolean(args, "includeTailwind", toolName),
        intent: optionalString(args, "intent", toolName),
      };
    case "report_mockup_usage":
      return {
        filePath: requireString(args, "filePath", toolName),
        mockupName: optionalString(args, "mockupName", toolName),
        context: optionalEnum(args, "context", CONTEXT_VALUES, toolName),
        brand: optionalEnum(args, "brand", BRAND_VALUES, toolName),
        cwd: optionalString(args, "cwd", toolName),
        dryRun: optionalBoolean(args, "dryRun", toolName),
      };
    case "start_dev_server":
      return {
        cwd: optionalString(args, "cwd", toolName),
        command: optionalString(args, "command", toolName),
        args: optionalStringArray(args, "args", toolName),
        url: optionalString(args, "url", toolName),
        port: optionalNumber(args, "port", toolName, { min: 1 }),
        timeoutMs: optionalNumber(args, "timeoutMs", toolName, { min: 1 }),
      };
    case "check_preview":
      return {
        url: optionalString(args, "url", toolName),
        routePath: optionalString(args, "routePath", toolName),
        cwd: optionalString(args, "cwd", toolName),
        sessionId: optionalString(args, "sessionId", toolName),
        timeoutMs: optionalNumber(args, "timeoutMs", toolName, { min: 1 }),
        minTextLength: optionalNumber(args, "minTextLength", toolName, { min: 0 }),
        viewport: optionalViewport(args, "viewport", toolName),
      };
    case "stop_dev_server":
      return { sessionId: optionalString(args, "sessionId", toolName) };
    default:
      return args;
  }
}

export function registerToolHandlers(
  server: Server,
  handlers: ToolHandlers,
  options: RegisterToolHandlersOptions = {},
) {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
      const validatedArgs = validateToolArgs(name, args);
      const handler = handlers[name];
      if (!handler) throw new Error(`Unknown tool: ${name}`);
      let result = await handler(validatedArgs);
      const afterResult = await options.afterCall?.({ name, args: validatedArgs, result });
      if (afterResult !== undefined) result = afterResult;
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    } catch (e) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: (e as Error).message }, null, 2),
          },
        ],
        isError: true,
      };
    }
  });
}
