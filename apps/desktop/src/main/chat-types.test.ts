import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DesignSpecTracker,
  NdjsonBuffer,
  SelfCorrectionTracker,
  mapClaudeEvent,
  encodeUserTurn,
  type ChatMessage,
} from "./chat-types.ts";

// claude 2.1.158 `--output-format stream-json` 스모크에서 채취한 실제 라인 샘플.
const ASSISTANT_TEXT = {
  type: "assistant",
  message: {
    role: "assistant",
    content: [{ type: "text", text: "I'll run that command for you." }],
  },
};
const ASSISTANT_TOOL = {
  type: "assistant",
  message: {
    content: [
      {
        type: "tool_use",
        id: "toolu_013",
        name: "Bash",
        input: { command: "echo hello-from-tool" },
      },
    ],
  },
};
const USER_TOOL_RESULT = {
  type: "user",
  message: {
    content: [
      {
        tool_use_id: "toolu_013",
        type: "tool_result",
        content: "hello-from-tool",
        is_error: false,
      },
    ],
  },
};
const RESULT = {
  type: "result",
  subtype: "success",
  is_error: false,
  duration_ms: 5023,
  total_cost_usd: 0.128,
  usage: { input_tokens: 3141, output_tokens: 108 },
};

test("assistant text → assistant-text", () => {
  const msgs = mapClaudeEvent(ASSISTANT_TEXT);
  assert.deepEqual(msgs, [{ kind: "assistant-text", text: "I'll run that command for you." }]);
});

test("assistant tool_use → tool-use (요약 = 핵심 인자)", () => {
  const msgs = mapClaudeEvent(ASSISTANT_TOOL);
  assert.equal(msgs.length, 1);
  const m = msgs[0] as Extract<ChatMessage, { kind: "tool-use" }>;
  assert.equal(m.kind, "tool-use");
  assert.equal(m.tool, "Bash");
  assert.equal(m.id, "toolu_013");
  assert.equal(m.summary, "echo hello-from-tool");
});

test("mcp__ 도구명은 짧은 이름으로", () => {
  const msgs = mapClaudeEvent({
    type: "assistant",
    message: {
      content: [
        {
          type: "tool_use",
          id: "t1",
          name: "mcp__nudge-ds__find_component",
          input: { query: "Button" },
        },
      ],
    },
  });
  const m = msgs[0] as Extract<ChatMessage, { kind: "tool-use" }>;
  assert.equal(m.tool, "find_component");
  assert.equal(m.summary, "Button");
});

test("Edit/Read 요약은 파일 basename", () => {
  const [edit] = mapClaudeEvent({
    type: "assistant",
    message: {
      content: [
        { type: "tool_use", id: "t", name: "Edit", input: { file_path: "/a/b/login.html" } },
      ],
    },
  }) as Extract<ChatMessage, { kind: "tool-use" }>[];
  assert.equal(edit.summary, "login.html");
});

test("user tool_result → tool-result (ok 플래그)", () => {
  const msgs = mapClaudeEvent(USER_TOOL_RESULT);
  assert.deepEqual(msgs, [
    { kind: "tool-result", id: "toolu_013", ok: true, summary: "hello-from-tool" },
  ]);
});

test("tool_result is_error → ok:false", () => {
  const [m] = mapClaudeEvent({
    type: "user",
    message: {
      content: [{ type: "tool_result", tool_use_id: "x", content: "boom", is_error: true }],
    },
  }) as Extract<ChatMessage, { kind: "tool-result" }>[];
  assert.equal(m.ok, false);
});

test("result → 토큰/시간/비용 푸터", () => {
  const [m] = mapClaudeEvent(RESULT) as Extract<ChatMessage, { kind: "result" }>[];
  assert.equal(m.kind, "result");
  assert.equal(m.ok, true);
  assert.equal(m.durationMs, 5023);
  assert.equal(m.costUsd, 0.128);
  assert.deepEqual(m.usage, { input: 3141, output: 108 });
});

test("system(hook/init) · rate_limit_event 는 무시(빈 배열)", () => {
  assert.deepEqual(mapClaudeEvent({ type: "system", subtype: "init" }), []);
  assert.deepEqual(mapClaudeEvent({ type: "system", subtype: "hook_started" }), []);
  assert.deepEqual(mapClaudeEvent({ type: "rate_limit_event" }), []);
  assert.deepEqual(mapClaudeEvent(null), []);
  assert.deepEqual(mapClaudeEvent("nonsense"), []);
});

test("NdjsonBuffer: 부분 청크를 줄 경계로 재조립", () => {
  const buf = new NdjsonBuffer();
  // 첫 청크: 한 줄 완성 + 둘째 줄 절반.
  const a = buf.push('{"type":"result","is_error":false}\n{"type":"ass');
  assert.equal(a.length, 1);
  assert.equal((a[0] as { type: string }).type, "result");
  // 둘째 청크: 절반 + 나머지 + 개행.
  const b = buf.push('istant","message":{"content":[{"type":"text","text":"hi"}]}}\n');
  assert.equal(b.length, 1);
  assert.equal((b[0] as { type: string }).type, "assistant");
});

test("NdjsonBuffer: 깨진 줄은 건너뛰고 정상 줄은 통과", () => {
  const buf = new NdjsonBuffer();
  const out = buf.push("not-json\n{}\n");
  assert.deepEqual(out, [{}]);
});

test("NdjsonBuffer.flush: 개행 없이 끝난 마지막 줄", () => {
  const buf = new NdjsonBuffer();
  assert.deepEqual(buf.push('{"type":"resu'), []); // 미완 — 아직 안 나옴
  const out = buf.flush(); // 나머지가 와서 완성됐다고 가정하는 대신, 완성된 줄을 직접 flush
  assert.deepEqual(out, []); // 미완 JSON 은 flush 에서도 버려짐
  const buf2 = new NdjsonBuffer();
  buf2.push('{"type":"result","is_error":false}'); // 개행 없는 완성된 줄
  assert.equal(buf2.flush().length, 1);
});

test("encodeUserTurn: input-format stream-json 라인 형식", () => {
  const line = encodeUserTurn("로그인 화면 만들어줘");
  assert.ok(line.endsWith("\n"));
  const parsed = JSON.parse(line);
  assert.equal(parsed.type, "user");
  assert.equal(parsed.message.role, "user");
  assert.deepEqual(parsed.message.content, [{ type: "text", text: "로그인 화면 만들어줘" }]);
});

// ── DesignSpecTracker (save_design_spec tool_use ↔ tool_result 상관) ──

const specToolUse = (id: string, spec: unknown) => ({
  type: "assistant",
  message: {
    content: [
      {
        type: "tool_use",
        id,
        name: "mcp__nudge-ds__save_design_spec",
        input: { spec, cwd: "/tmp/x" },
      },
    ],
  },
});
const specToolResult = (id: string, result: unknown) => ({
  type: "user",
  message: {
    content: [
      {
        type: "tool_result",
        tool_use_id: id,
        is_error: false,
        content: [{ type: "text", text: JSON.stringify(result) }],
      },
    ],
  },
});
const OK_SPEC = {
  screen: { brand: "geniet", surface: "app", intent: "리뷰 상세" },
  tree: [{ component: "Card", role: "본문", children: [{ component: "Button", role: "cta" }] }],
  decisions: ["primary CTA 1개만"],
};
const OK_RESULT = {
  ok: true,
  brand: "geniet",
  violations: [],
  summary: { error: 0, warn: 0, info: 1, hasErrors: false },
  componentsUsed: ["Button", "Card"],
  tokensUsed: ["--semantic-bg-default"],
  path: "/tmp/x/design-spec.json",
};

test("DesignSpecTracker: tool_use→tool_result 를 묶어 design-spec 카드 메시지를 만든다", () => {
  const t = new DesignSpecTracker();
  assert.deepEqual(t.observe(specToolUse("toolu_s1", OK_SPEC)), []); // tool_use 만으론 아직 카드 없음
  const out = t.observe(specToolResult("toolu_s1", OK_RESULT));
  assert.equal(out.length, 1);
  const m = out[0];
  assert.equal(m.kind, "design-spec");
  if (m.kind !== "design-spec") return;
  assert.equal(m.ok, true);
  assert.equal(m.brand, "geniet");
  assert.equal(m.spec.screen?.intent, "리뷰 상세");
  assert.equal(m.spec.tree?.[0].component, "Card");
  assert.equal(m.spec.tree?.[0].children?.[0].component, "Button");
  assert.deepEqual(m.componentsUsed, ["Button", "Card"]);
  assert.equal(m.summary.error, 0);
});

test("DesignSpecTracker: ok:false 결과면 violations 가 담긴 카드(ok:false)", () => {
  const t = new DesignSpecTracker();
  t.observe(specToolUse("toolu_s2", { screen: { brand: "nope" }, tree: [] }));
  const out = t.observe(
    specToolResult("toolu_s2", {
      ok: false,
      brand: null,
      violations: [
        { rule: "unknown-brand", severity: "error", path: "screen.brand", message: "x" },
      ],
      summary: { error: 1, warn: 0, info: 0, hasErrors: true },
      componentsUsed: [],
      tokensUsed: [],
      path: "/tmp/x/design-spec.json",
    }),
  );
  assert.equal(out.length, 1);
  const m = out[0];
  if (m.kind !== "design-spec") return assert.fail("expected design-spec");
  assert.equal(m.ok, false);
  assert.equal(m.summary.error, 1);
  assert.equal(m.violations[0].rule, "unknown-brand");
});

test("DesignSpecTracker: spec 이 JSON 문자열로 와도 트리를 파싱한다", () => {
  const t = new DesignSpecTracker();
  t.observe(specToolUse("toolu_s3", JSON.stringify(OK_SPEC)));
  const out = t.observe(specToolResult("toolu_s3", OK_RESULT));
  const m = out[0];
  if (m.kind !== "design-spec") return assert.fail("expected design-spec");
  assert.equal(m.spec.tree?.[0].component, "Card");
});

test("DesignSpecTracker: save_design_spec 이 아닌 도구는 무시", () => {
  const t = new DesignSpecTracker();
  const toolUse = {
    type: "assistant",
    message: {
      content: [{ type: "tool_use", id: "toolu_b", name: "Bash", input: { command: "ls" } }],
    },
  };
  const toolResult = {
    type: "user",
    message: { content: [{ type: "tool_result", tool_use_id: "toolu_b", content: "ok" }] },
  };
  assert.deepEqual(t.observe(toolUse), []);
  assert.deepEqual(t.observe(toolResult), []);
});

// ── SelfCorrectionTracker (validate/build error 잔존 감지 → 턴 종료 시 결론) ──

const validateUse = (id: string, tool = "mcp__nudge-ds__validate_html_mockup") => ({
  type: "assistant",
  message: { content: [{ type: "tool_use", id, name: tool, input: { filePath: "index.html" } }] },
});
const validateResult = (id: string, payload: unknown) => ({
  type: "user",
  message: {
    content: [
      {
        type: "tool_result",
        tool_use_id: id,
        content: [{ type: "text", text: JSON.stringify(payload) }],
      },
    ],
  },
});
const RESULT_EVT = { type: "result", is_error: false };

test("SelfCorrectionTracker: validate error 잔존 → 턴 종료 시 hasErrors + errorRules", () => {
  const t = new SelfCorrectionTracker();
  assert.equal(t.observe(validateUse("v1")), null);
  assert.equal(
    t.observe(
      validateResult("v1", {
        violations: [],
        violationsByRule: [
          { rule: "inline-color", count: 2, severity: "error", lines: [3, 5] },
          { rule: "chip-overuse", count: 1, severity: "warn", lines: [9] },
        ],
        severitySummary: { error: 2, warn: 1, info: 0, hasErrors: true },
      }),
    ),
    null,
  );
  const end = t.observe(RESULT_EVT);
  assert.ok(end && end.turnEnded);
  assert.equal(end.validation?.hasErrors, true);
  assert.equal(end.validation?.errorCount, 2);
  assert.deepEqual(end.validation?.errorRules, [{ rule: "inline-color", count: 2 }]); // warn 은 제외
});

test("SelfCorrectionTracker: clean validate → hasErrors:false", () => {
  const t = new SelfCorrectionTracker();
  t.observe(validateUse("v2"));
  t.observe(
    validateResult("v2", {
      violations: [],
      violationsByRule: [],
      severitySummary: { error: 0, warn: 0, info: 0, hasErrors: false },
    }),
  );
  const end = t.observe(RESULT_EVT);
  assert.equal(end?.validation?.hasErrors, false);
});

test("SelfCorrectionTracker[D3]: build 결과의 scores(D1) + outputPath 를 추출", () => {
  const t = new SelfCorrectionTracker();
  t.observe(validateUse("b1", "mcp__nudge-ds__build_singlefile_html"));
  t.observe(
    validateResult("b1", {
      ok: true,
      outputPath: "/proj/x/dist/index.html",
      validation: {
        violationsByRule: [],
        severitySummary: { error: 0, warn: 1, info: 0, hasErrors: false },
        scores: {
          overall: 88,
          dimensions: {
            color: 100,
            typography: 100,
            spacing: 92,
            layout: 80,
            component: 100,
            icon: 100,
          },
        },
      },
    }),
  );
  const end = t.observe(RESULT_EVT);
  assert.equal(end?.validation?.hasErrors, false);
  assert.equal(end?.validation?.buildOutputPath, "/proj/x/dist/index.html");
  assert.equal(end?.validation?.codeScores?.overall, 88);
  assert.equal(end?.validation?.codeScores?.dimensions.layout, 80);
});

test("SelfCorrectionTracker: build_singlefile_html 의 중첩 .validation 도 읽는다", () => {
  const t = new SelfCorrectionTracker();
  t.observe(validateUse("b1", "mcp__nudge-ds__build_singlefile_html"));
  t.observe(
    validateResult("b1", {
      ok: true,
      humanReadable: "[OK build / FAIL validate]",
      validation: {
        violationsByRule: [{ rule: "raw-landmark", count: 1, severity: "error", lines: [2] }],
        severitySummary: { error: 1, warn: 0, info: 0, hasErrors: true },
      },
    }),
  );
  const end = t.observe(RESULT_EVT);
  assert.equal(end?.validation?.hasErrors, true);
  assert.deepEqual(end?.validation?.errorRules, [{ rule: "raw-landmark", count: 1 }]);
});

test("SelfCorrectionTracker: 검증 없는 턴 → validation:null (교정 안 함)", () => {
  const t = new SelfCorrectionTracker();
  t.observe({
    type: "assistant",
    message: { content: [{ type: "text", text: "방향 제안만 함" }] },
  });
  const end = t.observe(RESULT_EVT);
  assert.ok(end && end.turnEnded);
  assert.equal(end.validation, null);
});

test("SelfCorrectionTracker: 비-validate 도구(Bash)는 무시", () => {
  const t = new SelfCorrectionTracker();
  t.observe({
    type: "assistant",
    message: { content: [{ type: "tool_use", id: "x", name: "Bash", input: {} }] },
  });
  t.observe({
    type: "user",
    message: { content: [{ type: "tool_result", tool_use_id: "x", content: "done" }] },
  });
  const end = t.observe(RESULT_EVT);
  assert.equal(end?.validation, null);
});
