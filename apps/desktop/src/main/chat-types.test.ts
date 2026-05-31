import { test } from "node:test";
import assert from "node:assert/strict";
import { NdjsonBuffer, mapClaudeEvent, encodeUserTurn, type ChatMessage } from "./chat-types.ts";

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
