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
    name: "list_components",
    description:
      "Return all available DS React components (user-app: Trost / Geniet / NudgeEAP). For admin / CMS screens, do NOT use these — call get_guide({ topic: 'admin-cms' }) instead.",
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
      "Return all icons in @nudge-eap/icons with Figma Iconography(379:490) category and Line/Filled/Color style metadata. Response also includes `byCategory` index. Always pair with get_guide({ topic: 'pattern:iconography' }) for size/touch/style rules and get_guide({ topic: 'pattern:icon-color' }) for token mapping.",
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
    description:
      "List design tokens for one group. Without `group`, returns a summary (counts per group) only — pass `group` ('color' | 'spacing' | 'semantic' | 'font' | 'radius' | 'size' | 'line' | 'gap' | 'padding' | 'border' | 'grid' | 'shadow' | 'shape' | 'stroke' | 'z') for actual tokens. Prefer `lookup_token` for search.",
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
      'Validate a mockup .tsx against DS rules — inline color/spacing, native elements, inline SVG, emoji, gradient, invalid-prop-value (wrong union literal e.g. IconButton size="md"), and pattern-level anti-patterns (CTA/Chip/Card/icon overuse, antd leftover, etc.). Provide `source` or `filePath`. Returns `{ ok, violationCount, summary: { humanReadable }, violations }`. Always surface `violationCount` + `humanReadable` to the user.',
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
    name: "check_mcp_update",
    description:
      "Check whether a newer version of this MCP (.mcpb) is available on GitHub Releases. Compares installed manifest.json version with the latest release. Use this when the user asks: '최신 버전 있어?', 'MCP 업데이트 있어?', 'check for updates'. Returns installed/latest version, download URL, and step-by-step update instructions if outdated.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "report_mockup_usage",
    description:
      "REQUIRED final step after generating/modifying a mockup .tsx (or HTML export). Parses with AST and classifies each JSX element as ds / adminCms / customNative / external, appends to `.ds-usage-log.jsonl`, and posts to a shared usage webhook (no auth/setup needed). Skipping leaves central usage stats empty for this mockup. Returns the aggregated usage + webhook status.",
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
    name: "build_singlefile_html",
    description:
      "Build the current Vite mockup as a single self-contained .html (interactivity + nds-* classes + onClick preserved). Auto-installs vite-plugin-singlefile, patches vite.config, runs `vite build`, returns dist/index.html path + size. **MANDATORY final step of the mockup workflow** — single-file HTML is the standard deliverable of this workspace. Call this WITHOUT asking the user ('만들어 드릴까요' 금지) unless they explicitly refused. Forbidden alternatives: hand-writing .html, running `vite build` directly, using esbuild/parcel/webpack, leaving only .tsx — all lose nds-* tokens and React interactivity. Warns if BrowserRouter is used (file:// needs HashRouter).",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description:
            "Project root that contains package.json + vite.config. Defaults to the MCP process cwd.",
        },
      },
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
    name: "get_guide",
    description:
      "Consolidated guide router. Pass a 'topic' string to fetch one of: design principles, dos/donts, admin-cms conventions, scope advisory, runtime DS inspector setup, or per-component / per-pattern guides. Use this for every guidance lookup — it replaces the old get_design_principles / get_dos_and_donts / get_admin_cms_guide / get_scope_advisory / get_inspector_setup / get_component_guide / get_pattern_guide tools. (Note: single-file HTML export is now an action tool — call build_singlefile_html directly instead of asking for instructions.)",
    inputSchema: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description:
            "Guide topic. Fixed values: 'principles' | 'dos-donts' | 'admin-cms' | 'scope-advisory' | 'inspector-setup'. Component guides use 'component:<Name>' (e.g. 'component:Button'). Pattern guides use 'pattern:<name>' (cta-group, icon-color, iconography, visual-antipatterns, notice, dropdown, dense-list). For HTML export, call build_singlefile_html instead — that's an action tool, not a guide.",
        },
        intent: {
          type: "string",
          description:
            "Optional free-text intent passed through to topic='admin-cms' for confirmation. Ignored for other topics.",
        },
      },
      required: ["topic"],
      additionalProperties: false,
    },
  },
  {
    name: "get_setup",
    description:
      "Consolidated external-project setup router. Pass a 'step' to run one of: install command, main.tsx CSS imports, DS update instructions, CLAUDE.md generation, or the full step-by-step setup guide. Replaces the old get_install_command / get_main_tsx_imports / get_update_instructions / create_claude_md / get_setup_instructions tools.",
    inputSchema: {
      type: "object",
      properties: {
        step: {
          type: "string",
          enum: ["install", "imports", "update", "claude-md", "inspector", "full"],
          description:
            "Which setup sub-action to run. 'install' → ready-to-run 'npm install ./*.tgz' command. 'imports' → main.tsx CSS import lines. 'update' → DS update instructions. 'claude-md' → write CLAUDE.md to cwd. 'inspector' → **directly patch src/main.tsx to mount the dev-only DsInspector overlay** (idempotent — safe to re-run). 'full' → comprehensive setup guide for a fresh project.",
        },
        tgzDir: {
          type: "string",
          description:
            "[step=install|full] Directory containing the .tgz files. Default: <DS_repo>/local-packages",
        },
        brand: {
          type: "string",
          description:
            "[step=imports|full] Brand slug (see list_brands). If omitted, the first 'ready' brand is used as default.",
        },
        withRouter: {
          type: "boolean",
          description: "[step=full] Include the react-router-dom install step (default: true).",
        },
        includeTailwind: {
          type: "boolean",
          description:
            "[step=install|full] Include @nudge-eap/tailwind-preset install (default: false).",
        },
        intent: {
          type: "string",
          description:
            "[step=claude-md|full] Workspace intent. 'admin-cms' generates an antd-based admin guide; 'user-app' (default) generates the DS-based user-app guide. Free-text strings are scanned for admin keywords (어드민/CMS/운영툴/백오피스/admin/cms/backoffice).",
        },
        source: {
          type: "string",
          description: "[step=update] Where the repo came from. Default: 'github'.",
        },
        includeLocalPackages: {
          type: "boolean",
          description:
            "[step=update] Also include pnpm release:local for .tgz package refresh. Default: false.",
        },
        cwd: {
          type: "string",
          description:
            "[step=claude-md|inspector] Project root. For claude-md, where CLAUDE.md will be created. For inspector, where src/main.tsx will be patched. Defaults to the MCP process cwd.",
        },
        projectName: {
          type: "string",
          description: "[step=claude-md] Optional title for the generated CLAUDE.md.",
        },
        overwrite: {
          type: "boolean",
          description: "[step=claude-md] Replace an existing CLAUDE.md. Default: false.",
        },
      },
      required: ["step"],
      additionalProperties: false,
    },
  },
];

const CONTEXT_VALUES = ["user-app", "admin-cms", "unknown"] as const;
const MOCKUP_INTENT_VALUES = ["user-app", "admin-cms"] as const;
const BRAND_VALUES = ["trost", "geniet", "nudge-eap"] as const;
const SETUP_STEP_VALUES = [
  "install",
  "imports",
  "update",
  "claude-md",
  "inspector",
  "full",
] as const;

const DEPRECATED_TOOL_HINTS: Record<string, string> = {
  get_design_principles: "get_guide({ topic: 'principles' })",
  get_dos_and_donts: "get_guide({ topic: 'dos-donts' })",
  get_admin_cms_guide: "get_guide({ topic: 'admin-cms' })",
  get_scope_advisory: "get_guide({ topic: 'scope-advisory' })",
  get_inspector_setup: "get_guide({ topic: 'inspector-setup' })",
  get_component_guide: "get_guide({ topic: 'component:<Name>' })",
  get_pattern_guide: "get_guide({ topic: 'pattern:<name>' })",
  get_install_command: "get_setup({ step: 'install' })",
  get_main_tsx_imports: "get_setup({ step: 'imports' })",
  get_update_instructions: "get_setup({ step: 'update' })",
  create_claude_md: "get_setup({ step: 'claude-md' })",
  get_setup_instructions: "get_setup({ step: 'full' })",
};

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
    case "get_component":
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
    case "get_guide":
      return {
        topic: requireString(args, "topic", toolName),
        intent: optionalString(args, "intent", toolName),
      };
    case "get_setup":
      return {
        step:
          optionalEnum(args, "step", SETUP_STEP_VALUES, toolName) ??
          (() => {
            throw new Error(`${toolName}: 'step' is required.`);
          })(),
        tgzDir: optionalString(args, "tgzDir", toolName),
        brand: optionalString(args, "brand", toolName),
        withRouter: optionalBoolean(args, "withRouter", toolName),
        includeTailwind: optionalBoolean(args, "includeTailwind", toolName),
        intent: optionalString(args, "intent", toolName),
        source: optionalString(args, "source", toolName),
        includeLocalPackages: optionalBoolean(args, "includeLocalPackages", toolName),
        cwd: optionalString(args, "cwd", toolName),
        projectName: optionalString(args, "projectName", toolName),
        overwrite: optionalBoolean(args, "overwrite", toolName),
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
    case "build_singlefile_html":
      return { cwd: optionalString(args, "cwd", toolName) };
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
      if (!handler) {
        const hint = DEPRECATED_TOOL_HINTS[name];
        throw new Error(
          hint
            ? `Tool '${name}' has been consolidated. Use ${hint} instead.`
            : `Unknown tool: ${name}`,
        );
      }
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
