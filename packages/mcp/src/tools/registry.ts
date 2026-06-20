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
    name: "get_project",
    description:
      "Project metadata: no args lists projects, `{ project }` returns summary/imports/colors/counts, `{ project, assetKind }` returns one detailed asset list. (Mockup work: collect visual refs first.)",
    inputSchema: {
      type: "object",
      properties: {
        project: {
          type: "string",
          description:
            "Optional project slug (e.g. 'trost', 'nudge-eap', 'geniet', 'cashwalk-biz'). Omit to list all.",
        },
        assetKind: {
          type: "string",
          enum: ["logos", "snsLogos", "profileImages", "illustrations", "stateImages", "marathonEvents"],
          description:
            "[project lookup only] Fetch one detailed asset list. Omit for summary-only project metadata.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "find_component",
    description:
      "Look up DS components. No args lists names; `{ query }` searches; `{ name }` returns slim prop metadata (names only), `verbose:true` for full signatures (type/allowedValues). For usage examples prefer get_guide({ topic: `component:<Name>` }). (Mockup work: collect visual refs first.) Always pass `userRequest` with the user's original request so lookups can be traced back to intent.",
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
        userRequest: {
          type: "string",
          description:
            "The user's original request/intent that prompted this lookup (verbatim or a faithful paraphrase). Pass it whenever this lookup is part of fulfilling a user request — it links the lookup to why it happened.",
        },
        project: {
          type: "string",
          description:
            "Optional project slug in context (e.g. 'cashwalk-biz', 'trost'). Pass it so lookups/misses can be grouped by project.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "find_icon",
    description:
      "Search @nudge-design/icons. `{ query }`→find a name, `{ name }`→paste-ready inline `svg` (no npm install needed), no args→icon index. (Mockup work: collect visual refs first.) Always pass `userRequest` with the user's original request so lookups can be traced back to intent.",
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
        offset: {
          type: "number",
          description:
            "[category] Pagination start index. Response includes `nextOffset` when more icons remain — prefer paging over a large `limit`.",
        },
        size: {
          type: "number",
          description: "Optional width/height(px) for the returned inline svg. Default 24.",
        },
        userRequest: {
          type: "string",
          description:
            "The user's original request/intent that prompted this lookup (verbatim or a faithful paraphrase). Pass it whenever this lookup is part of fulfilling a user request — it links the lookup to why it happened.",
        },
        project: {
          type: "string",
          description:
            "Optional project slug in context (e.g. 'cashwalk-biz', 'trost'). Pass it so lookups/misses can be grouped by project.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "find_asset",
    description:
      "Search @nudge-design/assets **project images** (food, illustrations, profiles, posters, logos — NOT icons; for icons use find_icon). Returns a paste-ready `inlineRef` to drop into `<img src>` (build_singlefile_html base64-inlines it). Need a mockup image? Call this FIRST. On miss: grey/empty-state placeholder + '에셋 없음' note — never AI-generate project imagery. Pass `userRequest` (the original intent).",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Natural-language search (e.g. 'salad', '음식', 'marathon poster', 'profile'). Matched against project/category/id tokens.",
        },
        project: {
          type: "string",
          description:
            "Optional project slug to scope (e.g. 'geniet', 'runmile', 'nudge-eap', 'cashwalk-biz'/'cashpobi', 'trost'). Aliases resolved. Shared assets (sns-logos) are always included.",
        },
        category: {
          type: "string",
          description:
            "Optional category filter (substring) — e.g. 'food-types', 'profiles', 'logos', 'marathon-events', 'category-heroes'. See the no-arg index.",
        },
        id: {
          type: "string",
          description: "Optional exact/near asset id (filename stem, e.g. 'bibimbap').",
        },
        limit: { type: "number", description: "Max assets returned." },
        userRequest: {
          type: "string",
          description:
            "The user's original request/intent that prompted this lookup (verbatim or a faithful paraphrase). Links the lookup to why it happened.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "find_token",
    description:
      "Look up design tokens. No args→group counts; `{ group }`→list a group; `{ query }`→search. Add `{ project }` for multi-project work to scope to that project's tokens and resolve shared semantic tokens to the project's actual values. (Mockup work: collect visual refs first.) Always pass `userRequest` with the user's original request so lookups can be traced back to intent.",
    inputSchema: {
      type: "object",
      properties: {
        group: { type: "string", description: "Optional token group filter." },
        query: { type: "string", description: "Optional name/value query (e.g. '#FF5722')." },
        project: {
          type: "string",
          description:
            "Optional project slug (e.g. 'geniet', 'cashpobi', 'cashwalk-biz', 'trost', 'runmile', 'moneple'). Restricts results to shared + project-specific tokens and shows project-specific values for shared semantic tokens. Omit for NudgeEAP/base.",
        },
        userRequest: {
          type: "string",
          description:
            "The user's original request/intent that prompted this lookup (verbatim or a faithful paraphrase). Pass it whenever this lookup is part of fulfilling a user request — it links the lookup to why it happened.",
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
    name: "recommend_page_pattern",
    description:
      "First-pass suggestion of a Cashwalk-Biz admin Page Pattern (onboarding/dashboard/list/detail/form) from a PRD — keyword-scored ranking of all 5 + confidence flag. Read the PRD to confirm, then set screen.pagePattern in save_design_spec.",
    inputSchema: {
      type: "object",
      properties: {
        prd: {
          type: "string",
          description: "PRD / 기획 설명 텍스트 (자연어). 화면이 무엇을 하는지.",
        },
        project: {
          type: "string",
          description:
            "Optional project slug. Page Pattern 시스템은 cashwalk-biz 어드민 전용 — 다른 프로젝트면 advisory 로만 동작.",
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
      "Start/stop a local mockup dev server (Vite) → preview URL/session id. React/backoffice (.tsx) only — for html (<nds-*>) use build_singlefile_html instead (start on an html workspace returns guidance, no spawn).",
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
      "Build a Vite mockup into one shareable dist/index.html. Auto-runs DS validation (`validation`), PRD coverage (`prdValidation`), and usage report on the artifact — no separate calls for final build. Runs workspace audit unless skipAudit. **html intent requires a PRD coverage manifest (`script[type=application/json][data-prd-coverage]`) and real click behavior on every active button.**",
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
        allowIncomplete: {
          type: "boolean",
          description:
            "DS 검증 에러가 있어도 강제로 빌드(사용자 판단). 기본 false — 에러는 빌드를 막음. true 면 산출물은 만들어지지만 위반은 validation.violations[] 에 그대로 보고되고 '미해결 DS 에러 N건으로 강제 빌드' 경고가 붙는다.",
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
      "Validate HTML/<nds-*> mockups for DS/static quality (token, spacing, native element, icon, pattern, active-button interaction). Pass `source` (HTML string) or `filePath` (.html). On a clean pass (0 violations) the response automatically includes DS adoption stats — no separate `withStats` call needed; `withStats:true` forces stats even with violations. Not PRD coverage — use validate_prd_coverage. Usage report auto-on; `report:false` only to suppress noisy iterations (final must report).",
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
            "Force-include DS adoption stats, grouped violations, and recommendations even when violations remain. Stats are included automatically on a clean pass (0 violations), so this is rarely needed.",
        },
        report: {
          type: "boolean",
          description:
            "Write DS usage report (JSONL + Sheets webhook). Default true — prefer omitting. `false` triggers a session warning: the final iteration must report (or the sheet stays stale). Combine with `url`/`sessionId` so rendered (not static-shell) stats reach the sheet.",
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
        project: {
          type: "string",
          description:
            "Optional project slug. Overrides the nudge.project marker for project-specific rules and telemetry grouping.",
        },
        surface: {
          type: "string",
          description: "Optional surface (admin/service/…). Overrides the nudge.surface marker.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "validate_prd_coverage",
    description:
      "Validate PRD/brief coverage (separate from DS quality): checks the `script[type=application/json][data-prd-coverage]` manifest — every requirement implemented and every evidence selector present in the DOM. Pass `source` or `filePath`. Use alongside validate_html_mockup or read build_singlefile_html.prdValidation.",
    inputSchema: {
      type: "object",
      properties: {
        source: {
          type: "string",
          description: "HTML source string. One of `source` / `filePath` is required.",
        },
        filePath: {
          type: "string",
          description: "Absolute path to an .html file.",
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
      "Grade a built mockup (Eval D3): D1 deterministic code score (color/typography/spacing/layout/component/icon) + D2 qualitative LLM score (ux/interaction/flow/form, from a separate tool-less `claude -p`), combined `verdict` (통과/주의/미달 = ≥80/≥60/<60) on the WEAKER group, plus a display `card` — mirrors the desktop harness post-build SSOT. Pass `html` or `filePath`. No `claude` binary (CLAUDE_BIN/PATH) → D1 only. Call after a clean build/validate.",
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
        project: {
          type: "string",
          description: "Optional project slug for scoring context (e.g. 'geniet', 'cashwalk-biz').",
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
      "Save a DesignSpec (prompt→DesignSpec→code IR) to `<cwd>/design-spec.json`, validating against the DS catalog first. Captures INTENT only — component tree, semantic token names (no hex), project/surface, rationale — not pixel geometry. Call BEFORE build_singlefile_html (show spec → get agreement → build, soft gate); if `ok:false`, fix violations and re-save. `component` accepts PascalCase or nds-tag. Side effect: appends a row to `<cwd>/designDecisions.jsonl` (append-only decision history; consider gitignoring).",
    inputSchema: {
      type: "object",
      properties: {
        spec: {
          type: "object",
          description:
            "DesignSpec object: { screen: { project, surface: 'web'|'app', intent }, tree: [{ component, role?, props?, tokens?, rationale?, children? }], decisions?: string[] }. May also be passed as a JSON string.",
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
      "Validate a DesignSpec against the DS catalog WITHOUT writing a file — semantic-token-only (no raw hex), known tokens, resolvable project slug, known components, prop enum legality. Returns violations by severity (error/warn/info) + ok. Use during self-correction before save_design_spec.",
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
      "Fetch DS guidance by topic (`component:<Name>`, `pattern:<name>`, or fixed like 'principles'/'dos-donts'/'backoffice' — 'admin-cms' is a permanent alias of 'backoffice'); batch with `topics:[...]`. Size control: `view:'examples'|'rules'` (biggest saver for batches), `sections`/`aspects` (principles slices), `target:'html'` for <nds-*> examples, `project` for the service overlay. Call principles once per session. **Mockup first-response gate: ask for Figma/screenshots and write references.md before any guide/component/token lookup or code work.**",
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
            "Optional intent passed through to topic='backoffice'/'admin-cms'. Pass 'admin' to get the DS redirect for hard-gated b2b admin projects (cashwalk-biz/nudge-eap). Ignored for other topics.",
        },
        serviceName: {
          type: "string",
          description:
            "[topic=backoffice] Service display name injected into service-specific copy (e.g. footer 'Copyright © <serviceName>'). Example: 'Runmile'.",
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
            "Response size control (biggest saver for batched guides). 'examples'→summary + usage examples; 'rules'→summary + pitfalls/recommended (component) or rules/avoid (pattern); 'full' (default)→whole guide incl. metrics/matrixOverrides. `sections` overrides `view`. 5-guide batch: ~35KB→~5KB with 'examples'.",
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
            "Principles-focused. Friendly names for the slices a screen needs — e.g. ['spacing','radius','typography','color'] returns only those blocks. Sugar over `sections` with aliases (radius→shapes, color→colors, tone→projectTone, font→typography, shadow→elevation, dos-donts→dos+donts+bannedPatterns). Merged with `sections`. No aspect resolves → error lists validAspects.",
        },
        project: {
          type: "string",
          enum: ["trost", "geniet", "cashwalk-biz", "nudge-eap", "runmile"],
          description:
            "Optional project slug. Set → base guide merged with the project's service overlay (allowedVariants/disallowed/preferred/forbiddenPatterns, servicePitfalls, iconSet, copyTone). Omitted → a `_projectVariants` slim summary lists which projects have an overlay. For `principles`, also scopes learned-principles promotion.",
        },
        cwd: {
          type: "string",
          description:
            "`principles`-focused. Workspace root to read `designDecisions.jsonl` — recurring decisions (≥ threshold distinct screens) are promoted into a `_learnedPrinciples` block. Defaults to MCP process cwd (= where save_design_spec writes).",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_setup",
    description:
      "Setup router: install/imports/update/claude-md/agents-md/inspector/external-starter/full. Defaults to HTML/<nds-*>. external-starter onboards external projects in one call (writes CLAUDE.md + AGENTS.md, returns a shared .mcp.json for Claude Code/Cursor/Codex, the validate→build→score loop, and 'NDS 써서' prompt templates). Generated mockup instructions enforce the visual-reference-first gate.",
    inputSchema: {
      type: "object",
      properties: {
        step: {
          type: "string",
          enum: [
            "install",
            "imports",
            "update",
            "claude-md",
            "agents-md",
            "inspector",
            "external-starter",
            "full",
          ],
          description:
            "install | imports | update | claude-md | agents-md | inspector | external-starter | full.",
        },
        tgzDir: {
          type: "string",
          description:
            "[step=install|full] Directory containing the .tgz files. Default: <DS_repo>/local-packages",
        },
        project: {
          type: "string",
          description:
            "[step=imports|full|claude-md|agents-md] Project slug (see get_project). Omitted → first 'ready' project. Admin routing: intent='admin' is hard-gated to cashwalk-biz/nudge-eap and routes to the Nudge DS (html), NOT antd — other projects are blocked. 캐포비는 자체 admin 디자인 시스템 보유라 백오피스/CMS 발화도 DS 로 우회.",
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
          enum: ["admin", "backoffice", "admin-cms", "html"],
          description:
            "Workspace intent. Default/html → vanilla <nds-*>; backoffice → 사내 어드민/CMS, neutral antd conventions ('admin-cms' is a deprecated alias of backoffice); admin → 외부 제공(b2b) 어드민, hard-gated to cashwalk-biz/nudge-eap and built with the DS (html) — other projects are blocked, and admin without project returns a clarification question instead of proceeding.",
        },
        serviceName: {
          type: "string",
          description:
            "[intent=backoffice] Service display name injected into service-specific copy (e.g. footer 'Copyright © <serviceName>'). Example: 'Runmile'.",
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
  {
    name: "log_feedback",
    description:
      "Log a user's design-system correction into DS telemetry so recurring DS gaps get fixed automatically. " +
      "═══ HARD SEQUENCING RULE (not optional) ═══ " +
      "If the user objects to a DS choice and you are ABOUT TO CHANGE IT, call log_feedback FIRST, then make the change — the correction itself is the trigger, and logging-after-the-fix gets forgotten (you get absorbed in fixing). Don't ask permission; just call it (fire-and-forget, one call per distinct correction). " +
      "═══ WHEN ═══ " +
      "The DS itself is wrong: a wrong component/variant/token/color/spacing, a guide that misled you, or a component that doesn't exist ('이거 틀렸어 / 아니야 / 이거 말고 / 시안이랑 달라'). ALSO when the user merely QUESTIONS a choice ('이게 맞나?') and you then CONCLUDE you were wrong — log the conclusion. " +
      "═══ NOT ═══ " +
      "Plain task instructions ('다음 화면 만들어줘', '버튼 추가해') or your own stylistic preference. Only genuine 'the DS got it wrong' signals. " +
      "═══ ARGS ═══ " +
      "text = the correction in one line (wrong → right). category = component|token|guide|pattern|bug|satisfaction|other. target = component/token/screen. project = slug. " +
      "═══ SATISFACTION (👍/👎) ═══ " +
      "목업 만족도도 이 도구로 기록 — category:'satisfaction' + sentiment(up|down)(+scoreOverall). 단 사용자가 **명시적으로** 평가할 때만, 먼저 묻지 말 것(추측·감정분석 금지). 전체 흐름·prompt_satisfaction 연계는 워크플로우 가이드 참조.",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The user's feedback/correction, summarized (or quoted).",
        },
        category: {
          type: "string",
          enum: ["component", "token", "guide", "pattern", "bug", "satisfaction", "other"],
          description:
            "What kind: component(없거나 잘못된 컴포넌트) / token(색·간격 등 토큰) / guide(가이드 혼동·오류) / pattern(화면 패턴) / bug / satisfaction(목업 결과 만족도 👍/👎) / other.",
        },
        sentiment: {
          type: "string",
          enum: ["up", "down"],
          description:
            "목업 결과에 대한 사용자 만족도 — 👍=up / 👎=down. **사용자가 명시적으로 평가했을 때만** 채운다(category='satisfaction' 와 함께). 추측·자동질문 금지.",
        },
        scoreOverall: {
          type: "number",
          description:
            "만족도 평가 시점의 객관 품질 점수(직전 score_mockup_quality/build 의 overall). 주관↔객관을 한 레코드에 페어링.",
        },
        target: {
          type: "string",
          description:
            "Related component/token/screen name if any (e.g. 'Modal', 'cv.input.border').",
        },
        project: {
          type: "string",
          description: "Related project slug if any (e.g. 'cashwalk-biz', 'trost').",
        },
      },
      required: ["text"],
      additionalProperties: false,
    },
  },
  {
    name: "prompt_satisfaction",
    description:
      "목업 결과 만족도(👍/👎)를 사용자에게 클릭 다이얼로그로 물어 기록한다(elicitation). " +
      "═══ WHEN ═══ " +
      "build_singlefile_html 결과(점수·파일위치)를 사용자에게 **보여준 직후**, 깨끗한 빌드(DS 에러 0)일 때 호출한다. " +
      "**화면당 세션 1회만** — 같은 화면을 재빌드해도 다시 호출하지 말 것(서버도 중복을 막지만 호출 자체를 아끼는 게 맞다). " +
      "에러가 있는 중간(수정 루프) 빌드에는 호출하지 않는다. " +
      "═══ HOW ═══ " +
      "빌드 도구를 막지 않으려고 분리된 도구다 — 결과를 먼저 렌더한 뒤 이 도구를 호출하면 다이얼로그가 그 다음에 뜬다. " +
      "👍/👎 클릭 시 객관 점수와 함께 자동 기록되고, 사용자가 닫으면(decline/cancel) 스킵된다. " +
      "호스트가 elicitation 미지원이면 결과에 supported:false 가 와서 텍스트 안내(satisfactionOffer)로 폴백하면 된다. " +
      "═══ ARGS ═══ scoreOverall = 방금 빌드/검증의 overall 점수. screen = 목업 파일/화면명. project = 프로젝트 슬러그.",
    inputSchema: {
      type: "object",
      properties: {
        screen: { type: "string", description: "평가 대상 목업 파일/화면명 (예: dist/index.html)." },
        scoreOverall: { type: "number", description: "직전 빌드/검증의 객관 품질 점수(overall)." },
        project: { type: "string", description: "프로젝트 슬러그 (예: 'cashwalk-biz')." },
      },
      required: [],
      additionalProperties: false,
    },
  },
];

export const TOOL_DEFINITIONS = TOOLS;

const SETUP_STEP_VALUES = [
  "install",
  "imports",
  "update",
  "claude-md",
  "agents-md",
  "inspector",
  "external-starter",
  "full",
] as const;
const PROJECT_ASSET_KIND_VALUES = [
  "logos",
  "snsLogos",
  "profileImages",
  "illustrations",
  "stateImages",
  "marathonEvents",
] as const;
const FEEDBACK_CATEGORY_VALUES = [
  "component",
  "token",
  "guide",
  "pattern",
  "bug",
  "satisfaction",
  "other",
] as const;
const SENTIMENT_VALUES = ["up", "down"] as const;
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
    case "get_project":
      return {
        project: optionalString(args, "project", toolName),
        assetKind: optionalEnum(args, "assetKind", PROJECT_ASSET_KIND_VALUES, toolName),
      };
    case "find_component":
      return {
        query: optionalString(args, "query", toolName),
        name: optionalString(args, "name", toolName),
        verbose: optionalBoolean(args, "verbose", toolName),
        limit: optionalNumber(args, "limit", toolName, { min: 1 }),
        userRequest: optionalString(args, "userRequest", toolName),
        project: optionalString(args, "project", toolName),
      };
    case "find_icon":
      return {
        name: optionalString(args, "name", toolName),
        query: optionalString(args, "query", toolName),
        category: optionalString(args, "category", toolName),
        limit: optionalNumber(args, "limit", toolName, { min: 1 }),
        offset: optionalNumber(args, "offset", toolName, { min: 0 }),
        size: optionalNumber(args, "size", toolName, { min: 1 }),
        userRequest: optionalString(args, "userRequest", toolName),
        project: optionalString(args, "project", toolName),
      };
    case "find_asset":
      return {
        query: optionalString(args, "query", toolName),
        project: optionalString(args, "project", toolName),
        category: optionalString(args, "category", toolName),
        id: optionalString(args, "id", toolName),
        limit: optionalNumber(args, "limit", toolName, { min: 1 }),
        userRequest: optionalString(args, "userRequest", toolName),
      };
    case "find_token":
      return {
        group: optionalString(args, "group", toolName),
        query: optionalString(args, "query", toolName),
        project: optionalString(args, "project", toolName),
        userRequest: optionalString(args, "userRequest", toolName),
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
        project: optionalEnum(
          args,
          "project",
          ["trost", "geniet", "cashwalk-biz", "nudge-eap", "runmile"] as const,
          toolName,
        ),
        serviceName: optionalString(args, "serviceName", toolName),
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
        project: optionalString(args, "project", toolName),
        withRouter: optionalBoolean(args, "withRouter", toolName),
        includeTailwind: optionalBoolean(args, "includeTailwind", toolName),
        intent: optionalString(args, "intent", toolName),
        serviceName: optionalString(args, "serviceName", toolName),
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
        allowIncomplete: optionalBoolean(args, "allowIncomplete", toolName),
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
        project: optionalString(args, "project", toolName),
        surface: optionalString(args, "surface", toolName),
      };
    case "validate_prd_coverage":
      return {
        source: optionalString(args, "source", toolName),
        filePath: optionalString(args, "filePath", toolName),
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
        project: optionalString(args, "project", toolName),
        surface: optionalString(args, "surface", toolName),
        cwd: optionalString(args, "cwd", toolName),
      };
    case "log_feedback":
      return {
        text: optionalString(args, "text", toolName),
        category: optionalEnum(args, "category", FEEDBACK_CATEGORY_VALUES, toolName),
        sentiment: optionalEnum(args, "sentiment", SENTIMENT_VALUES, toolName),
        scoreOverall: optionalNumber(args, "scoreOverall", toolName),
        target: optionalString(args, "target", toolName),
        project: optionalString(args, "project", toolName),
      };
    case "prompt_satisfaction":
      return {
        screen: optionalString(args, "screen", toolName),
        scoreOverall: optionalNumber(args, "scoreOverall", toolName),
        project: optionalString(args, "project", toolName),
      };
    default:
      return args;
  }
}

export function validateToolArgsForTest(toolName: string, rawArgs: unknown): ToolArgs {
  return validateToolArgs(toolName, rawArgs);
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
      // 성공 응답은 compact 직렬화 — 들여쓰기는 LLM 파싱에 불필요하고 응답당 ~20% 가
      // 공백이다. 사람이 읽는 카드/노티스는 문자열 값 내부 \n 으로 자체 포맷팅돼 영향 없음.
      // (에러 경로는 빈도 낮고 디버깅 가독성이 중요해 pretty 유지)
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
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
