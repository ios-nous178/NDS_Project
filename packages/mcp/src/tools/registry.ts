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
    name: "get_brand",
    description:
      "Look up brand metadata. No args lists brands; `{ brand }` returns imports, colors, fonts, and icons.",
    inputSchema: {
      type: "object",
      properties: {
        brand: {
          type: "string",
          description:
            "Optional brand slug (e.g. 'trost', 'nudge-eap', 'geniet', 'cashpobi'). Omit to list all.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "find_component",
    description:
      "Look up DS components. No args lists names; `{ query }` searches; `{ name }` returns full prop metadata.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Optional fuzzy search query." },
        name: {
          type: "string",
          description: "Optional exact component name (case-sensitive). Returns full props.",
        },
        limit: { type: "number", description: "Max results for list/search calls." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "find_icon",
    description: "Search @nudge-eap/icons. Prefer `{ query }`; no args returns the icon index.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Optional natural-language search query." },
        category: {
          type: "string",
          description: "Optional icon category from the no-arg summary.",
        },
        limit: { type: "number", description: "Max icons returned for query/category calls." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "find_token",
    description:
      "Look up design tokens. No args returns group counts; `{ group }` lists a group; `{ query }` searches.",
    inputSchema: {
      type: "object",
      properties: {
        group: { type: "string", description: "Optional token group filter." },
        query: { type: "string", description: "Optional name/value query (e.g. '#FF5722')." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "validate_mockup",
    description:
      "Legacy React/.tsx validator for existing mockups. Prefer validate_html_mockup for new HTML workspaces.",
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
    description: "Suggest token replacements for inline color/spacing snippets.",
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
    description: "List DS packages, versions, dependencies, and CSS exports.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "check_mcp_update",
    description: "Check GitHub Releases for a newer .mcpb and return update instructions.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "report_mockup_usage",
    description:
      "Legacy React/.tsx usage reporter. New HTML workspaces should use report_html_mockup_usage.",
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
          enum: ["trost", "geniet", "nudge-eap", "cashpobi"],
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
    name: "dev_server",
    description: "Start or stop a local mockup dev server and return the preview URL/session id.",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["start", "stop"],
          description: "'start' to launch dev server, 'stop' to terminate.",
        },
        cwd: {
          type: "string",
          description: "[start] Project root. Defaults to the MCP process cwd.",
        },
        command: {
          type: "string",
          description: "[start] Executable to run. Default: npm.",
        },
        args: {
          type: "array",
          items: { type: "string" },
          description:
            "[start] Command args. Default: ['run', 'dev', '--', '--host', '127.0.0.1'].",
        },
        url: {
          type: "string",
          description:
            "[start] Expected dev server URL. If omitted, parsed from logs or falls back to http://127.0.0.1:5173.",
        },
        port: {
          type: "number",
          description: "[start] Convenience fallback for url, e.g. 5173.",
        },
        timeoutMs: {
          type: "number",
          description: "[start] Wait timeout. Default: 20000.",
        },
        autoReport: {
          type: "boolean",
          description: "If true, run pending usage auto-report after this call. Default false.",
        },
        sessionId: {
          type: "string",
          description: "[stop] Session id returned by start. Omit to stop all sessions.",
        },
      },
      required: ["action"],
      additionalProperties: false,
    },
  },
  {
    name: "check_preview",
    description:
      "Use Playwright to detect runtime errors, Vite overlays, failed requests, and blank screens.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description:
            "Base URL to check. Defaults to dev_server session URL or http://127.0.0.1:5173.",
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
          description: "Session id returned by dev_server({ action: 'start' }).",
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
        autoReport: {
          type: "boolean",
          description: "If true, run pending usage auto-report after this call. Default false.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "build_singlefile_html",
    description:
      "Build a Vite mockup into one shareable dist/index.html. Runs workspace audit unless skipAudit is true.",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description:
            "Project root that contains package.json + vite.config. Defaults to the MCP process cwd.",
        },
        skipAudit: {
          type: "boolean",
          description: "Skip workspace audit only after explicit user approval. Defaults to false.",
        },
        intent: {
          type: "string",
          enum: ["react", "html"],
          description: "Force workspace intent. Defaults to auto-detect.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "validate_html_mockup",
    description:
      "Validate HTML/<nds-*> mockups for token, spacing, native element, icon, and pattern violations.",
    inputSchema: {
      type: "object",
      properties: {
        source: {
          type: "string",
          description: "HTML source string. Either this or `filePath` is required.",
        },
        filePath: {
          type: "string",
          description: "Absolute path to an .html file. Either this or `source` is required.",
        },
        autoReport: {
          type: "boolean",
          description: "If true, run pending usage auto-report after validation. Default false.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "analyze_html_mockup",
    description:
      "Validate HTML and return DS adoption stats, grouped violations, and next-action recommendations.",
    inputSchema: {
      type: "object",
      properties: {
        source: { type: "string", description: "HTML source string." },
        filePath: { type: "string", description: "Absolute path to an .html file." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "convert_html_to_ds_html",
    description:
      "Rewrite common native HTML controls to <nds-*> elements and optionally replace known colors.",
    inputSchema: {
      type: "object",
      properties: {
        source: { type: "string", description: "HTML source string." },
        filePath: { type: "string", description: "Absolute path to an .html file." },
        rewriteInlineColors: {
          type: "boolean",
          description: "Default true. Set false to leave inline hex colors alone.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "report_html_mockup_usage",
    description:
      "Report HTML mockup DS usage stats. Writes/posts by default; pass dryRun:true to skip.",
    inputSchema: {
      type: "object",
      properties: {
        source: { type: "string", description: "HTML source string." },
        filePath: { type: "string", description: "Absolute path to an .html file." },
        mockupName: {
          type: "string",
          description: "Optional friendly name. Defaults to file basename or a timestamp.",
        },
        cwd: {
          type: "string",
          description:
            "Working directory where .ds-html-usage-log.jsonl is appended (when not dryRun).",
        },
        dryRun: {
          type: "boolean",
          description: "Default false — log/write and try webhook. Set true to inspect only.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "list_figma_sync_status",
    description: "List curated component guides and their Figma sync status.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: "get_guide",
    description: "Fetch DS guidance by topic. Use `target: 'html'` for <nds-*> component examples.",
    inputSchema: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description: "Fixed topic, `component:<Name>`, or `pattern:<name>`.",
        },
        intent: {
          type: "string",
          description:
            "Optional free-text intent passed through to topic='admin-cms' for confirmation. Ignored for other topics.",
        },
        target: {
          type: "string",
          enum: ["react", "html"],
          description: "Component example format. Use 'html' for new <nds-*> mockups.",
        },
      },
      required: ["topic"],
      additionalProperties: false,
    },
  },
  {
    name: "get_setup",
    description:
      "Setup router for install/import/update/CLAUDE.md/full instructions. Defaults to HTML/<nds-*>.",
    inputSchema: {
      type: "object",
      properties: {
        step: {
          type: "string",
          enum: ["install", "imports", "update", "claude-md", "inspector", "full"],
          description: "install | imports | update | claude-md | inspector | full.",
        },
        tgzDir: {
          type: "string",
          description:
            "[step=install|full] Directory containing the .tgz files. Default: <DS_repo>/local-packages",
        },
        brand: {
          type: "string",
          description:
            "[step=imports|full] Brand slug (see get_brand). If omitted, the first 'ready' brand is used as default.",
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
          enum: ["admin-cms", "html"],
          description:
            "Workspace intent. Default/html uses vanilla <nds-*>; admin-cms uses antd conventions.",
        },
        template: {
          type: "string",
          enum: ["slim", "default"],
          description: "[step=claude-md] CLAUDE.md template size. Default: slim.",
        },
        mode: {
          type: "string",
          enum: ["summary", "full"],
          description:
            "[step=full] Response size. Default: summary; use full for all setup details.",
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
const BRAND_VALUES = ["trost", "geniet", "nudge-eap", "cashpobi"] as const;
const SETUP_STEP_VALUES = [
  "install",
  "imports",
  "update",
  "claude-md",
  "inspector",
  "full",
] as const;
const DEV_SERVER_ACTION_VALUES = ["start", "stop"] as const;
const GUIDE_TARGET_VALUES = ["react", "html"] as const;
const BUILD_INTENT_VALUES = ["react", "html"] as const;
const CLAUDE_MD_TEMPLATE_VALUES = ["slim", "default"] as const;

// 옛 도구 이름은 즉시 제거되어 Unknown tool 에러로 떨어진다. hint 는 유지하지 않는다.

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
    case "get_brand":
      return { brand: optionalString(args, "brand", toolName) };
    case "find_component":
      return {
        query: optionalString(args, "query", toolName),
        name: optionalString(args, "name", toolName),
        limit: optionalNumber(args, "limit", toolName, { min: 1 }),
      };
    case "find_icon":
      return {
        query: optionalString(args, "query", toolName),
        category: optionalString(args, "category", toolName),
        limit: optionalNumber(args, "limit", toolName, { min: 1 }),
      };
    case "find_token":
      return {
        group: optionalString(args, "group", toolName),
        query: optionalString(args, "query", toolName),
      };
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
        target: optionalEnum(args, "target", GUIDE_TARGET_VALUES, toolName),
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
        template: optionalEnum(args, "template", CLAUDE_MD_TEMPLATE_VALUES, toolName),
        mode: optionalEnum(args, "mode", ["summary", "full"] as const, toolName),
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
    case "dev_server":
      return {
        action:
          optionalEnum(args, "action", DEV_SERVER_ACTION_VALUES, toolName) ??
          (() => {
            throw new Error(`${toolName}: 'action' is required.`);
          })(),
        cwd: optionalString(args, "cwd", toolName),
        command: optionalString(args, "command", toolName),
        args: optionalStringArray(args, "args", toolName),
        url: optionalString(args, "url", toolName),
        port: optionalNumber(args, "port", toolName, { min: 1 }),
        timeoutMs: optionalNumber(args, "timeoutMs", toolName, { min: 1 }),
        autoReport: optionalBoolean(args, "autoReport", toolName),
        sessionId: optionalString(args, "sessionId", toolName),
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
        autoReport: optionalBoolean(args, "autoReport", toolName),
      };
    case "build_singlefile_html":
      return {
        cwd: optionalString(args, "cwd", toolName),
        skipAudit: optionalBoolean(args, "skipAudit", toolName),
        intent: optionalEnum(args, "intent", BUILD_INTENT_VALUES, toolName),
      };
    case "validate_html_mockup":
    case "analyze_html_mockup":
      return {
        source: optionalString(args, "source", toolName),
        filePath: optionalString(args, "filePath", toolName),
        autoReport: optionalBoolean(args, "autoReport", toolName),
      };
    case "convert_html_to_ds_html":
      return {
        source: optionalString(args, "source", toolName),
        filePath: optionalString(args, "filePath", toolName),
        rewriteInlineColors: optionalBoolean(args, "rewriteInlineColors", toolName),
      };
    case "report_html_mockup_usage":
      return {
        source: optionalString(args, "source", toolName),
        filePath: optionalString(args, "filePath", toolName),
        mockupName: optionalString(args, "mockupName", toolName),
        cwd: optionalString(args, "cwd", toolName),
        dryRun: optionalBoolean(args, "dryRun", toolName),
      };
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
        throw new Error(`Unknown tool: ${name}`);
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
