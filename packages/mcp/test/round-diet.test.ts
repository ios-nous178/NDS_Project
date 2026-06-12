import { describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { findIcon, toolHandlers } from "../src/server";
import { createClaudeMd } from "../src/tools/guides";

// 목업 라운드/토큰 다이어트 회귀 가드:
//  - validate 위반 0 통과 시 stats 자동 동봉 → "0 위반 확인 후 withStats 별도 1회" 라운드 제거.
//  - find_icon({ category }) offset 페이징 — limit 증폭 대신 nextOffset 으로 순회.
//  - 구버전 장문 CLAUDE.md 감지 → overwrite 갱신 힌트 1회 노출.

const CLEAN_HTML = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>t</title></head>
<body data-nds-brand="trost"><main><nds-button data-action="go">확인</nds-button></main>
<script>document.querySelector('[data-action="go"]').addEventListener('click',()=>{});</script>
</body></html>`;

describe("validate_html_mockup — 통과 시 stats 자동 동봉", () => {
  it("위반 0건 통과 응답에 withStats 없이도 stats 가 들어 있다", async () => {
    const result = (await toolHandlers.validate_html_mockup({
      source: CLEAN_HTML,
      report: false,
      dryRun: true,
    })) as { ok: boolean; violations: unknown[]; stats?: { counts?: Record<string, unknown> } };
    expect(result.ok).toBe(true);
    expect(result.stats).toBeDefined();
    expect(result.stats?.counts).toBeDefined();
  });

  it("위반이 남아 있으면 (withStats 미지정 시) stats 를 붙이지 않는다 — 반복 루프 응답 슬림 유지", async () => {
    const result = (await toolHandlers.validate_html_mockup({
      source: `<button onclick="x()">raw</button>`,
      report: false,
      dryRun: true,
    })) as { ok: boolean; stats?: unknown };
    expect(result.ok).toBe(false);
    expect(result.stats).toBeUndefined();
  });
});

describe("find_icon({ category }) — offset 페이징", () => {
  it("offset 으로 다음 페이지를 받고, 남으면 nextOffset 을 안내한다", async () => {
    const index = (await findIcon({})) as { categories: Record<string, { count: number }> };
    const [category, info] = Object.entries(index.categories).sort(
      (a, b) => b[1].count - a[1].count,
    )[0];
    expect(info.count).toBeGreaterThan(4); // 페이징 검증이 의미 있는 카테고리

    const page1 = (await findIcon({ category, limit: 2 })) as {
      icons: { name: string }[];
      offset: number;
      nextOffset?: number;
    };
    expect(page1.icons.length).toBe(2);
    expect(page1.offset).toBe(0);
    expect(page1.nextOffset).toBe(2);

    const page2 = (await findIcon({ category, limit: 2, offset: 2 })) as {
      icons: { name: string }[];
      offset: number;
    };
    expect(page2.offset).toBe(2);
    expect(page2.icons.map((i) => i.name)).not.toEqual(page1.icons.map((i) => i.name));
  });
});

describe("구버전 장문 CLAUDE.md 감지", () => {
  it("legacy 마커가 있으면 overwrite 갱신 힌트를 띄운다", () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "legacy-claude-md-"));
    try {
      fs.writeFileSync(
        path.join(cwd, "CLAUDE.md"),
        "# Old\n다음 단계별 호출만 허용:\n6-bis. 2회 self-check 강제\n",
      );
      const res = createClaudeMd({ cwd }) as Record<string, unknown>;
      expect(res.ok).toBe(false);
      expect(res._legacyTemplate).toBe(true);
      expect(String(res._hint)).toContain("overwrite: true");
    } finally {
      fs.rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("slim 템플릿이면 legacy 힌트를 띄우지 않는다", () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "slim-claude-md-"));
    try {
      const created = createClaudeMd({ cwd }) as Record<string, unknown>;
      expect(created.ok).toBe(true);
      const res = createClaudeMd({ cwd }) as Record<string, unknown>; // 재호출 → exists 분기
      expect(res.ok).toBe(false);
      expect(res._legacyTemplate).toBeUndefined();
    } finally {
      fs.rmSync(cwd, { recursive: true, force: true });
    }
  });
});
