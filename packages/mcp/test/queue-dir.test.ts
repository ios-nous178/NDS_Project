import { describe, expect, it } from "vitest";
import os from "node:os";
import path from "node:path";
import { resolveQueueDir } from "@nudge-design/mockup-core/tools/usage/log-path";

/**
 * 회귀: webhook 재시도 큐는 cwd-독립 고정 dir 에 있어야 한다. 호출마다 위치가 바뀌면
 * 적재된 큐를 다음 호출이 못 찾아 "고아 큐" (= 보냈는데 시트에 안 옴) 가 된다.
 */
describe("resolveQueueDir — stable webhook queue dir", () => {
  it("is stable across calls (independent of cwd)", () => {
    expect(resolveQueueDir()).toBe(resolveQueueDir());
  });

  it("honors DS_USAGE_LOG_DIR override", () => {
    const prev = process.env.DS_USAGE_LOG_DIR;
    const tmp = path.join(os.tmpdir(), "nudge-queue-dir-test");
    process.env.DS_USAGE_LOG_DIR = tmp;
    try {
      expect(resolveQueueDir()).toBe(path.resolve(tmp));
    } finally {
      if (prev === undefined) delete process.env.DS_USAGE_LOG_DIR;
      else process.env.DS_USAGE_LOG_DIR = prev;
    }
  });
});
