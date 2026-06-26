#!/usr/bin/env node
// 검증 룰 레지스트리 리포트 — warn/info 룰을 공통 UX 원칙별로 묶어 "차단 승격 검토" 한 장으로 출력.
//
//   node scripts/validator-rule-report.mjs            → docs/validator-rule-report.md 생성 + 요약 stdout
//   node scripts/validator-rule-report.mjs --stdout   → 마크다운을 stdout 으로만
//   node scripts/validator-rule-report.mjs --json      → 구조화 JSON 으로
//   node scripts/validator-rule-report.mjs --all       → error 룰까지 포함(기본은 warn/info 만)
//
// 데이터 출처:
//   RULE_META          = packages/mockup-core/dist/tools/html-validator.js (빌드본; 없으면 안내)
//   PRINCIPLE_MAP      = scripts/validator-principle-map.mjs (원칙 매핑 SSOT, 1차 패스)
// RULE_META 가 진리, 맵은 메타만 얹는다. 맵에 없는 warn/info 룰은 "미분류" 로 표면화한다.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const INCLUDE_ALL = args.has("--all");

const PRINCIPLE_TITLES = {
  1: "원칙 1 · 사용자는 목표를 쉽게 달성할 수 있어야 한다",
  2: "원칙 2 · 사용자는 다음 행동을 쉽게 이해할 수 있어야 한다 (위계·강조)",
  3: "원칙 3 · 사용자는 현재 상태를 쉽게 이해할 수 있어야 한다",
  4: "원칙 4 · 사용자는 실수하기 전에 예방받아야 한다",
  5: "원칙 5 · 사용자는 예측 가능한 경험을 제공받아야 한다 (일관성)",
  DS: "DS 위생 · 토큰·모델 가드 (UX 위계와 직접 무관 — 승격 별 트랙)",
  "?": "미분류 · PRINCIPLE_MAP 에 매핑 없음 (검토 필요)",
};
const PRINCIPLE_ORDER = ["1", "2", "3", "4", "5", "DS", "?"];

async function loadRuleMeta() {
  const distUrl = path.join(ROOT, "packages/mockup-core/dist/tools/html-validator.js");
  try {
    const mod = await import(distUrl);
    if (!mod.RULE_META) throw new Error("RULE_META export 없음");
    return mod.RULE_META;
  } catch (err) {
    console.error(
      `\n[validator-rule-report] RULE_META 를 못 읽었습니다 (${err.message}).\n` +
        `  먼저 빌드: pnpm --filter @nudge-design/mockup-core build\n`,
    );
    process.exit(1);
  }
}

const PROMO_LABEL = {
  candidate: "🟢 승격후보",
  context: "🟡 예외선행", // 예외 데이터화가 선행돼야 승격 가능
  hold: "⚪ 현행유지",
};

function buildRows(RULE_META, PRINCIPLE_MAP) {
  const rows = [];
  for (const [rule, meta] of Object.entries(RULE_META)) {
    if (!INCLUDE_ALL && meta.severity === "error") continue;
    const m = PRINCIPLE_MAP[rule];
    rows.push({
      rule,
      severity: meta.severity,
      kind: meta.kind,
      principle: m?.principle ?? "?",
      uxImpact: m?.uxImpact ?? "-",
      promotion: m?.promotion ?? "-",
      exception: m?.exception ?? null,
      note: m?.note ?? "",
    });
  }
  return rows;
}

const IMPACT_RANK = { high: 0, med: 1, low: 2, "-": 3 };

function renderMarkdown(rows) {
  const byPrinciple = new Map(PRINCIPLE_ORDER.map((p) => [p, []]));
  for (const r of rows) (byPrinciple.get(r.principle) ?? byPrinciple.get("?")).push(r);

  const total = rows.length;
  const candidates = rows.filter((r) => r.promotion === "candidate");
  const contextDep = rows.filter((r) => r.promotion === "context");
  const untagged = rows.filter((r) => r.principle === "?");

  const lines = [];
  lines.push("# 검증 룰 레지스트리 리포트 — 차단 승격 검토용");
  lines.push("");
  lines.push("> 자동 생성: `node scripts/validator-rule-report.mjs` — 손으로 고치지 말 것.");
  lines.push(
    "> 출처: RULE_META(`packages/mockup-core/src/tools/html-validator.ts`) × PRINCIPLE_MAP(`scripts/validator-principle-map.mjs`).",
  );
  lines.push("> 원칙 매핑은 1차 패스 — 팀 검토로 교정 전제.");
  lines.push("");
  lines.push("## 요약");
  lines.push("");
  lines.push(`- 대상 룰: **${total}개** ${INCLUDE_ALL ? "(error 포함)" : "(warn/info 만)"}`);
  lines.push(
    `- 🟢 승격후보(candidate): **${candidates.length}개** — 예외 없거나 정의됨, 바로 검토 가능`,
  );
  lines.push(`- 🟡 예외선행(context): **${contextDep.length}개** — 예외 케이스 데이터화 후 승격`);
  lines.push(`- ⚪ 현행유지(hold): **${rows.filter((r) => r.promotion === "hold").length}개**`);
  if (untagged.length) lines.push(`- ⚠ 미분류: **${untagged.length}개** — PRINCIPLE_MAP 매핑 필요`);
  lines.push("");
  lines.push("### 원칙별 분포");
  lines.push("");
  lines.push("| 원칙 | 룰 수 | 승격후보 | 예외선행 |");
  lines.push("| --- | ---: | ---: | ---: |");
  for (const p of PRINCIPLE_ORDER) {
    const rs = byPrinciple.get(p);
    if (!rs?.length) continue;
    const c = rs.filter((r) => r.promotion === "candidate").length;
    const x = rs.filter((r) => r.promotion === "context").length;
    lines.push(
      `| ${p === "?" ? "미분류" : p === "DS" ? "DS" : "원칙 " + p} | ${rs.length} | ${c} | ${x} |`,
    );
  }
  lines.push("");

  for (const p of PRINCIPLE_ORDER) {
    const rs = byPrinciple.get(p);
    if (!rs?.length) continue;
    rs.sort(
      (a, b) =>
        (a.promotion === "candidate" ? 0 : a.promotion === "context" ? 1 : 2) -
          (b.promotion === "candidate" ? 0 : b.promotion === "context" ? 1 : 2) ||
        IMPACT_RANK[a.uxImpact] - IMPACT_RANK[b.uxImpact] ||
        a.rule.localeCompare(b.rule),
    );
    lines.push(`## ${PRINCIPLE_TITLES[p]}`);
    lines.push("");
    lines.push("| 룰 | 현재 | 승격 | UX영향 | 예외 케이스 | 근거 |");
    lines.push("| --- | --- | --- | --- | --- | --- |");
    for (const r of rs) {
      lines.push(
        `| \`${r.rule}\` | ${r.severity} · ${r.kind} | ${PROMO_LABEL[r.promotion] ?? "-"} | ${r.uxImpact} | ${r.exception ? "`" + r.exception + "`" : "—"} | ${r.note} |`,
      );
    }
    lines.push("");
  }

  lines.push("## 다음 단계");
  lines.push("");
  lines.push(
    "1. 🟢 승격후보 중 UX영향 high 부터 차단(error) 승격 검토 — 예외 없는 것은 바로, 있는 것은 예외 정의 확인.",
  );
  lines.push(
    "2. 🟡 예외선행은 `exception` id 의 예외 케이스를 공통 UX 문서 + waiver 레지스트리에 데이터로 정의한 뒤 승격.",
  );
  lines.push("3. 승격 결정은 RULE_META 의 severity 를 warn→error 로 바꾸고, 승격 사유를 기록.");
  return lines.join("\n");
}

const RULE_META = await loadRuleMeta();
const { PRINCIPLE_MAP } = await import(path.join(ROOT, "scripts/validator-principle-map.mjs"));
const rows = buildRows(RULE_META, PRINCIPLE_MAP);

if (args.has("--json")) {
  process.stdout.write(
    JSON.stringify({ generatedFrom: "RULE_META×PRINCIPLE_MAP", rows }, null, 2) + "\n",
  );
} else {
  const md = renderMarkdown(rows);
  if (args.has("--stdout")) {
    process.stdout.write(md + "\n");
  } else {
    const out = path.join(ROOT, "docs/validator-rule-report.md");
    writeFileSync(out, md + "\n", "utf8");
    const cand = rows.filter((r) => r.promotion === "candidate").length;
    const ctx = rows.filter((r) => r.promotion === "context").length;
    const untag = rows.filter((r) => r.principle === "?").length;
    console.log(`[validator-rule-report] ${rows.length}개 룰 → ${path.relative(ROOT, out)}`);
    console.log(`  🟢 승격후보 ${cand} · 🟡 예외선행 ${ctx} · ⚠ 미분류 ${untag}`);
  }
}
