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
      "Look up brand metadata. No args lists brands; `{ brand }` returns imports, colors, fonts, and icons. Mockup/screen work must start by asking the user for visual references before this lookup.",
    inputSchema: {
      type: "object",
      properties: {
        brand: {
          type: "string",
          description:
            "Optional brand slug (e.g. 'trost', 'nudge-eap', 'geniet', 'cashwalk-biz'). Omit to list all.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "find_component",
    description:
      "Look up DS components. For mockup/screen work, do not call this until the user has answered the visual-reference question and references.md is ready. No args lists names; `{ query }` searches; `{ name }` returns slim prop metadata (names only). Pass `verbose:true` to get full prop signatures (type/allowedValues) — the slim default keeps batched lookups cheap.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Optional fuzzy search query." },
        name: {
          type: "string",
          description: "Optional exact component name (case-sensitive).",
        },
        verbose: {
          type: "boolean",
          description:
            "[name-lookup only] If true, response includes full prop signatures (type, allowedValues, optional flags). Default false — slim shape with prop names only.",
        },
        limit: { type: "number", description: "Max results for list/search calls." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "find_icon",
    description:
      "Search @nudge-design/icons. For mockup/screen work, do not call this until visual references are collected. " +
      "Flow: `{ query }` to find a name → `{ name }` to get the paste-ready inline SVG (`svg` field) " +
      "for vanilla HTML mockups (no npm install needed). No args returns the icon index.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description:
            "Exact icon name (e.g. 'CalendarIcon'). Returns paste-ready inline `svg` + `viewBox`/`body`.",
        },
        query: { type: "string", description: "Optional natural-language search query." },
        category: {
          type: "string",
          description: "Optional icon category from the no-arg summary.",
        },
        limit: { type: "number", description: "Max icons returned for query/category calls." },
        size: {
          type: "number",
          description: "Optional width/height(px) for the returned inline svg. Default 24.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "find_token",
    description:
      "Look up design tokens. For mockup/screen work, do not call this until visual references are collected. No args returns group counts; `{ group }` lists a group; `{ query }` searches.",
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
    name: "recommend_page_pattern",
    description:
      "Recommend a Cashwalk-Biz admin Page Pattern (onboarding/dashboard/list/detail/form) from a PRD. " +
      "Returns a keyword-scored ranking of all 5 patterns plus a confidence flag — a FIRST-PASS suggestion only. " +
      "Read the PRD yourself to confirm (or pick a different candidate), then declare it as screen.pagePattern in save_design_spec.",
    inputSchema: {
      type: "object",
      properties: {
        prd: {
          type: "string",
          description: "PRD / 기획 설명 텍스트 (자연어). 화면이 무엇을 하는지.",
        },
        brand: {
          type: "string",
          description:
            "Optional brand slug. Page Pattern 시스템은 cashwalk-biz 어드민 전용 — 다른 브랜드면 advisory 로만 동작.",
        },
        surface: {
          type: "string",
          description: "Optional 'admin' | 'service'. 강제는 admin 에서만.",
        },
      },
      required: ["prd"],
      additionalProperties: false,
    },
  },
  {
    name: "dev_server",
    description:
      "Start or stop a local mockup dev server (Vite) and return the preview URL/session id. " +
      "For react/admin-cms (.tsx) workspaces only. For html (vanilla <nds-*>) mockups it is not needed — " +
      "build_singlefile_html produces a self-contained dist/index.html you open directly; calling start on an " +
      "html workspace returns guidance instead of spawning.",
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
    name: "build_singlefile_html",
    description:
      "Build a Vite mockup into one shareable dist/index.html. Runs workspace audit unless skipAudit is true. **For html intent (vanilla <nds-*>), the build automatically runs validate_html_mockup + usage report (Sheets webhook) on the built artifact** — no separate call needed; results are in `validation` and `report` fields.",
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
      "Validate HTML/<nds-*> mockups for token, spacing, native element, icon, and pattern violations. Validates static source — pass `source` (HTML string) or `filePath` (.html file). `withStats:true` adds DS adoption stats. **Usage report (Sheets webhook + JSONL) is auto-enabled** — pass `report:false` only to suppress (e.g. noisy iteration cycles).",
    inputSchema: {
      type: "object",
      properties: {
        source: {
          type: "string",
          description: "HTML source string. One of `source` / `filePath` is required.",
        },
        filePath: {
          type: "string",
          description:
            "Absolute path to an .html file (the file IS the rendered output). For React/Vite workspaces where <nds-*> are injected at runtime, build a single-file artifact first via build_singlefile_html, or pass the rendered HTML through `source`.",
        },
        withStats: {
          type: "boolean",
          description:
            "If true, response also includes DS adoption stats, grouped violations, and recommendations (legacy analyze_html_mockup output). Default false.",
        },
        report: {
          type: "boolean",
          description:
            "Write DS usage report (JSONL + Sheets webhook) — replaces legacy report_html_mockup_usage. **Default true** (auto-sends every call). **Prefer omitting this argument.** Passing `false` triggers a session warning that requires you to send the final iteration with `report:true` (or omitted); if the final report is skipped, the sheet stays stale and reviewers see no data. Combine with `url`/`sessionId` so the rendered (not static-shell) stats reach the sheet.",
        },
        mockupName: {
          type: "string",
          description:
            "[report:true] Optional friendly name. Defaults to file basename or a timestamp.",
        },
        cwd: {
          type: "string",
          description:
            "[report:true] Working directory where .ds-html-usage-log.jsonl is appended (when not dryRun).",
        },
        dryRun: {
          type: "boolean",
          description:
            "[report:true] If true, inspect only — skip JSONL/webhook write. Default false.",
        },
        autoReport: {
          type: "boolean",
          description:
            "If true, run pending usage-guard auto-report after validation. Default false.",
        },
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
    name: "score_mockup_quality",
    description:
      "Grade a built HTML mockup's quality (Eval D3). Returns BOTH D1 (deterministic code score — color/typography/spacing/layout/component/icon, from static validation) AND D2 (independent qualitative LLM score — ux/interaction/flow/form, scored by a separate `claude -p` session with no tools), then a combined `verdict` (통과/주의/미달, ≥80/≥60/<60) graded on the WEAKER group, plus a ready-to-show text `card`. This mirrors exactly what the Nudge Studio desktop harness shows after a clean build (same SSOT). Pass `html` (string) or `filePath` (.html). If no `claude` binary is found (CLAUDE_BIN/PATH), it gracefully returns code-score-only (D1). Call after build_singlefile_html / a clean validate.",
    inputSchema: {
      type: "object",
      properties: {
        html: {
          type: "string",
          description: "Rendered HTML string to score. One of `html` / `filePath` is required.",
        },
        filePath: {
          type: "string",
          description: "Absolute path to a built .html file (read as the rendered output).",
        },
        brand: {
          type: "string",
          description: "Optional brand slug for scoring context (e.g. 'geniet', 'cashwalk-biz').",
        },
        surface: {
          type: "string",
          description: "Optional surface for context ('admin' / 'service').",
        },
        cwd: {
          type: "string",
          description:
            "Optional workspace root (lets D1 detect surface-mismatch via nudge.surface).",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "save_design_spec",
    description:
      "Save a lightweight DesignSpec (the prompt→**DesignSpec**→code intermediate representation) to `<cwd>/design-spec.json`, validating it against the DS catalog first. The DesignSpec captures INTENT only — component tree (semantic names), semantic token names (no hex), brand/surface, and design rationale — NOT pixel geometry (that belongs to the code→Figma scene.json). Call this BEFORE build_singlefile_html: show the saved spec to the user, get agreement, then build from it (soft approval gate). If `ok:false`, fix the reported violations and re-save before building. `component` accepts either PascalCase DS names ('Button') or nds-tags ('nds-button') — they share the scene.ts vocabulary. SIDE EFFECT: when the spec carries decisions/rationale, one row is also appended to `<cwd>/designDecisions.jsonl` (append-only decision history, deduped per screen, capped to recent rows) — design-spec.json itself is overwritten each save, so this jsonl is the cumulative provenance/memory log. Consumers may want to gitignore it.",
    inputSchema: {
      type: "object",
      properties: {
        spec: {
          type: "object",
          description:
            "DesignSpec object: { screen: { brand, surface: 'web'|'app', intent }, tree: [{ component, role?, props?, tokens?, rationale?, children? }], decisions?: string[] }. May also be passed as a JSON string.",
        },
        cwd: {
          type: "string",
          description:
            "Workspace dir to write design-spec.json (and append designDecisions.jsonl) into. Defaults to process cwd.",
        },
        fileName: {
          type: "string",
          description: "Output file name. Default 'design-spec.json'.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "validate_design_spec",
    description:
      "Validate a DesignSpec against the DS catalog WITHOUT writing a file — semantic-token-only (no raw hex), known tokens, resolvable brand slug (guards the silent base-blue fallback), known components, and prop enum legality. Returns violations grouped by severity (error/warn/info) plus ok=(no errors). Use during self-correction before save_design_spec.",
    inputSchema: {
      type: "object",
      properties: {
        spec: {
          type: "object",
          description:
            "DesignSpec object (or JSON string) to validate. See save_design_spec for shape.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_guide",
    description:
      "Fetch DS guidance by topic. Pass `topics: [...]` to batch multiple guides in one call. **First-response gate for mockups/screens/pages: before any guide/component/token lookup or code work, ask the user for Figma/screenshots and write the answer to references.md.** Use `target: 'html'` for <nds-*> component examples. Component guides include a short `_principlesDigest`; still call `get_guide({ topic: 'principles' })` once per session. For large guides (principles, admin-cms), pass `sections: ['dos', 'donts']` to receive only those top-level keys. For `principles`, prefer `aspects: ['spacing','radius','typography']` to load only the slices a screen actually needs (friendly names: radius→shapes, color→colors, tone→brandTone). **When batching many guides (`topics`), pass `view: 'examples'` (or `'rules'`) to avoid pulling full metrics/matrixOverrides for every topic — a 5-guide batch shrinks ~35KB → ~5KB.**",
    inputSchema: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description:
            "Single fixed topic, `component:<Name>`, or `pattern:<name>`. Omit when using `topics`.",
        },
        topics: {
          type: "array",
          items: { type: "string" },
          description:
            "Batch mode. Multiple fixed/component/pattern topics returned as `{ topics: { [topic]: result } }`. Use this to avoid 5-10 repeated get_guide calls.",
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
        view: {
          type: "string",
          enum: ["examples", "rules", "full"],
          description:
            "Optional response size control (biggest token saver for batched component/pattern guides). 'examples' → only summary + examples (the usage snippet you usually want); 'rules' → summary + pitfalls/recommended (component) or rules/avoid (pattern); 'full' (default) → the whole guide incl. metrics/matrixOverrides/references. Explicit `sections` overrides `view`. A 5-guide batch drops from ~35KB to ~5KB with view='examples'.",
        },
        sections: {
          type: "array",
          items: { type: "string" },
          description:
            "Optional. Pick only these top-level keys from the response (e.g. ['dos', 'donts'] on `principles`, or ['colorMatrix', 'sizeMatrix'] on a component guide). Meta keys (_advisory, _htmlAdvisory) are always preserved. If none match, response is an error with availableSections listed.",
        },
        aspects: {
          type: "array",
          items: { type: "string" },
          description:
            "Optional, principles-focused. Friendly names for the principle slices a screen actually needs — e.g. ['spacing','radius','typography','color'] returns only those blocks of `principles` instead of the whole guide. Sugar over `sections` with aliases (radius→shapes, color→colors, tone→brandTone, font→typography, shadow→elevation, dos-donts→dos+donts+bannedPatterns). Merged with `sections` when both are given. If no aspect resolves, the response is an error with validAspects listed.",
        },
        brand: {
          type: "string",
          enum: ["trost", "geniet", "cashwalk-biz", "nudge-eap", "runmile"],
          description:
            "Optional brand slug. When set, the base guide is merged with the brand's service overlay (allowedVariants/disallowed/preferred/forbiddenPatterns, servicePitfalls, iconSet, copyTone). When omitted, a `_brandVariants` slim summary is attached so the caller can see which brands have an overlay for this topic. For `principles`, also scopes the learned-principles promotion.",
        },
        cwd: {
          type: "string",
          description:
            "Optional, `principles`-focused. Workspace root to read `designDecisions.jsonl` from — recurring decisions for this brand (≥ threshold distinct screens) are promoted into a `_learnedPrinciples` block (Decision Log → Principles). Defaults to the MCP process cwd (= where save_design_spec writes).",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_setup",
    description:
      "Setup router for install/import/update/CLAUDE.md/AGENTS.md/full instructions. Defaults to HTML/<nds-*>. Generated mockup instructions enforce a first-response visual-reference question before code or DS lookups.",
    inputSchema: {
      type: "object",
      properties: {
        step: {
          type: "string",
          enum: ["install", "imports", "update", "claude-md", "agents-md", "inspector", "full"],
          description: "install | imports | update | claude-md | agents-md | inspector | full.",
        },
        tgzDir: {
          type: "string",
          description:
            "[step=install|full] Directory containing the .tgz files. Default: <DS_repo>/local-packages",
        },
        brand: {
          type: "string",
          description:
            "[step=imports|full|claude-md|agents-md] Brand slug (see get_brand). If omitted, the first 'ready' brand is used as default. " +
            "Also affects admin routing: brand='cashwalk-biz' + intent='admin-cms' routes to the Nudge DS (html workflow), NOT antd — 캐포비는 DS 안에 자체 admin 디자인 시스템을 가진 유일한 브랜드.",
        },
        withRouter: {
          type: "boolean",
          description: "[step=full] Include the react-router-dom install step (default: true).",
        },
        includeTailwind: {
          type: "boolean",
          description:
            "[step=install|full] Include @nudge-design/tailwind-preset install (default: false).",
        },
        intent: {
          type: "string",
          enum: ["admin-cms", "html"],
          description:
            "Workspace intent. Default/html uses vanilla <nds-*>; admin-cms uses antd conventions. " +
            "Exception: admin-cms + brand='cashwalk-biz' is routed to the DS (html) workflow, not antd.",
        },
        template: {
          type: "string",
          enum: ["slim", "default"],
          description: "[step=claude-md|agents-md] Instruction template size. Default: slim.",
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
            "[step=claude-md|agents-md|inspector] Project root. For claude-md/agents-md, where the instruction file will be created. For inspector, where src/main.tsx will be patched. Defaults to the MCP process cwd.",
        },
        projectName: {
          type: "string",
          description:
            "[step=claude-md|agents-md] Optional title for the generated instruction file.",
        },
        overwrite: {
          type: "boolean",
          description:
            "[step=claude-md|agents-md] Replace an existing instruction file. Default: false.",
        },
      },
      required: ["step"],
      additionalProperties: false,
    },
  },
];

const SETUP_STEP_VALUES = [
  "install",
  "imports",
  "update",
  "claude-md",
  "agents-md",
  "inspector",
  "full",
] as const;
const DEV_SERVER_ACTION_VALUES = ["start", "stop"] as const;
const GUIDE_TARGET_VALUES = ["react", "html"] as const;
const GUIDE_VIEW_VALUES = ["examples", "rules", "full"] as const;
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
        name: optionalString(args, "name", toolName),
        query: optionalString(args, "query", toolName),
        category: optionalString(args, "category", toolName),
        limit: optionalNumber(args, "limit", toolName, { min: 1 }),
        size: optionalNumber(args, "size", toolName, { min: 1 }),
      };
    case "find_token":
      return {
        group: optionalString(args, "group", toolName),
        query: optionalString(args, "query", toolName),
      };
    case "suggest_replacement":
      return {
        snippet: requireString(args, "snippet", toolName),
        rule: optionalString(args, "rule", toolName),
      };
    case "get_guide":
      return {
        topic: optionalString(args, "topic", toolName),
        topics: optionalStringArray(args, "topics", toolName),
        intent: optionalString(args, "intent", toolName),
        target: optionalEnum(args, "target", GUIDE_TARGET_VALUES, toolName),
        view: optionalEnum(args, "view", GUIDE_VIEW_VALUES, toolName),
        sections: optionalStringArray(args, "sections", toolName),
        aspects: optionalStringArray(args, "aspects", toolName),
        brand: optionalEnum(
          args,
          "brand",
          ["trost", "geniet", "cashwalk-biz", "nudge-eap", "runmile"] as const,
          toolName,
        ),
        cwd: optionalString(args, "cwd", toolName),
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
    case "build_singlefile_html":
      return {
        cwd: optionalString(args, "cwd", toolName),
        skipAudit: optionalBoolean(args, "skipAudit", toolName),
        intent: optionalEnum(args, "intent", BUILD_INTENT_VALUES, toolName),
      };
    case "validate_html_mockup":
      return {
        source: optionalString(args, "source", toolName),
        filePath: optionalString(args, "filePath", toolName),
        withStats: optionalBoolean(args, "withStats", toolName),
        report: optionalBoolean(args, "report", toolName),
        mockupName: optionalString(args, "mockupName", toolName),
        cwd: optionalString(args, "cwd", toolName),
        dryRun: optionalBoolean(args, "dryRun", toolName),
        autoReport: optionalBoolean(args, "autoReport", toolName),
      };
    case "convert_html_to_ds_html":
      return {
        source: optionalString(args, "source", toolName),
        filePath: optionalString(args, "filePath", toolName),
        rewriteInlineColors: optionalBoolean(args, "rewriteInlineColors", toolName),
      };
    case "score_mockup_quality":
      return {
        html: optionalString(args, "html", toolName),
        filePath: optionalString(args, "filePath", toolName),
        brand: optionalString(args, "brand", toolName),
        surface: optionalString(args, "surface", toolName),
        cwd: optionalString(args, "cwd", toolName),
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
