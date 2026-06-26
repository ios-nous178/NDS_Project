#!/usr/bin/env node
// 검증 룰 레지스트리 리포트 — warn/info 룰을 공통 UX 원칙별로 묶어 "차단 승격 검토" 한 장으로 출력.
//
//   node scripts/validator-rule-report.mjs            → docs/validator-rule-report.md 생성 + 요약 stdout
//   node scripts/validator-rule-report.mjs --stdout   → 마크다운을 stdout 으로만
//   node scripts/validator-rule-report.mjs --json      → 구조화 JSON 으로
//   node scripts/validator-rule-report.mjs --all       → error 룰까지 포함(기본은 warn/info 만)
//   node scripts/validator-rule-report.mjs --check      → 맵↔레지스트리 드리프트 + 승격 거버넌스 검사(쓰기 없음, 위반이면 exit 1)
//
// 데이터 출처:
//   RULE_META          = packages/mockup-core/dist/tools/html-validator.js (빌드본; 없으면 안내)
//   PRINCIPLE_MAP      = scripts/validator-principle-map.mjs (원칙 매핑 SSOT, 1차 패스)
//   EXCEPTION_REGISTRY = scripts/validator-exception-registry.mjs (예외 케이스 데이터 SSOT)
// RULE_META 가 진리, 맵은 메타만 얹는다. 맵에 없는 warn/info 룰은 "미분류" 로 표면화한다.

import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const INCLUDE_ALL = args.has("--all");
const CHECK = args.has("--check");

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
  promoted: "✅ 승격완료",
  candidate: "🟢 승격후보",
  context: "🟡 예외선행", // 예외 데이터화가 선행돼야 승격 가능
  hold: "⚪ 현행유지",
};

// 차단 안전성 — 예외 evaluation 종류가 "차단 승격이 안전한가" 를 결정한다.
const SAFE_EVAL = new Set(["auto", "structural", "policy"]); // validator/프로필이 자동 면제 → 차단 안전
function readinessOf(exceptionId, EXCEPTION_REGISTRY) {
  if (!exceptionId) return { label: "차단 가능(예외없음)", safe: true };
  const e = EXCEPTION_REGISTRY[exceptionId];
  if (!e) return { label: "⚠ 미정의 예외", safe: false };
  if (SAFE_EVAL.has(e.evaluation))
    return { label: `차단 안전(${e.evaluation} 자동면제)`, safe: true };
  return { label: "waiver 필요(explicit)", safe: false };
}

function buildRows(RULE_META, PRINCIPLE_MAP, EXCEPTION_REGISTRY) {
  const rows = [];
  for (const [rule, meta] of Object.entries(RULE_META)) {
    const m = PRINCIPLE_MAP[rule];
    // warn/info 가 기본 대상. error 는 --all 이거나 PRINCIPLE_MAP 에서 promoted(승격 완료) 인 경우만 포함.
    if (!INCLUDE_ALL && meta.severity === "error" && m?.promotion !== "promoted") continue;
    const exception = m?.exception ?? null;
    const ready = readinessOf(exception, EXCEPTION_REGISTRY);
    rows.push({
      rule,
      severity: meta.severity,
      kind: meta.kind,
      principle: m?.principle ?? "?",
      uxImpact: m?.uxImpact ?? "-",
      promotion: m?.promotion ?? "-",
      exception,
      evaluation: exception ? (EXCEPTION_REGISTRY[exception]?.evaluation ?? "?") : null,
      readiness: ready.label,
      note: m?.note ?? "",
    });
  }
  return rows;
}

// 맵↔레지스트리 정합 — 맵이 참조하는 예외 id 는 모두 레지스트리에 있어야 하고,
// 레지스트리의 모든 예외는 ≥1 룰이 참조해야 하며, appliesTo 가 실제 참조와 일치해야 한다.
function checkConsistency(PRINCIPLE_MAP, EXCEPTION_REGISTRY) {
  const refs = new Map(); // exceptionId -> [ruleId...]
  for (const [rule, m] of Object.entries(PRINCIPLE_MAP)) {
    if (!m.exception) continue;
    if (!refs.has(m.exception)) refs.set(m.exception, []);
    refs.get(m.exception).push(rule);
  }
  const problems = [];
  for (const [id, rules] of refs) {
    if (!EXCEPTION_REGISTRY[id])
      problems.push(`맵이 참조하는 예외 '${id}' 가 레지스트리에 없음 (${rules.join(", ")})`);
  }
  for (const [id, e] of Object.entries(EXCEPTION_REGISTRY)) {
    const actual = (refs.get(id) ?? []).sort();
    if (!actual.length) {
      problems.push(`레지스트리 예외 '${id}' 를 참조하는 룰이 없음 (미사용)`);
      continue;
    }
    const declared = [...(e.appliesTo ?? [])].sort();
    if (JSON.stringify(actual) !== JSON.stringify(declared))
      problems.push(
        `'${id}' appliesTo 불일치 — 선언[${declared.join(", ")}] ≠ 실제[${actual.join(", ")}]`,
      );
  }
  return problems;
}

// 승격 거버넌스 — warn→error 승격이 적격(검수·기록·정합)인지 강제한다.
//   1) PRINCIPLE_MAP.promotion="promoted" ⟺ RULE_META.severity="error" (선언↔enforcement 정합)
//   2) RULE_META 가 error 인데 PRINCIPLE_MAP 에 있고 promoted 아님 → 무단 승격(로그 없는 침묵 차단)
//   3) promoted ⟹ 승격 로그에 항목 존재(누가·왜·근거)
//   4) promoted 인데 예외(exception) 가 있으면 → detect/waiver 배선(WIRED) 전엔 승격 불가(오탐 방지)
// ③-b/c 에서 detect/waiver 가 런타임 validator 에 배선된 예외만 등록 — promoted 룰이 이 예외를
// 가지면 거버넌스 통과(오탐 방지 보장). 미등록 예외를 가진 채 승격하면 게이트가 차단.
const WIRED_EXCEPTIONS = new Set([
  "ux:p2-multi-judgment-unit", // container.ts — 가장 가까운 컨테이너 귀속 카운트(③-b)
  "ux:p2-card-justified", // container.ts·document-level.ts — data-nudge-allow waiver(③-c)
  "ux:p5-brand-cta-policy", // container.ts — getProjectProfile cta.blackCta/deniedButtonColors(③-b 잔여, policy 내재)
  "ux:p5-modal-policy", // container.ts — getProjectProfile().modal.singleButtonLayout(③-b 잔여, policy 내재)
]);
function checkGovernance(RULE_META, PRINCIPLE_MAP, PROMOTION_LOG) {
  const problems = [];
  const logged = new Set((PROMOTION_LOG.promotions ?? []).map((p) => p.rule));
  for (const [rule, m] of Object.entries(PRINCIPLE_MAP)) {
    const sev = RULE_META[rule]?.severity;
    if (m.promotion === "promoted") {
      if (sev !== "error")
        problems.push(
          `'${rule}' promoted 선언인데 RULE_META severity=${sev} (error 여야 함 — enforcement 미반영)`,
        );
      if (!logged.has(rule))
        problems.push(`'${rule}' promoted 인데 승격 로그(validator-promotion-log.json) 항목 없음`);
      if (m.exception && !WIRED_EXCEPTIONS.has(m.exception))
        problems.push(
          `'${rule}' promoted 인데 예외 '${m.exception}' detect/waiver 미배선 — 승격하면 오탐(③-b/c 선행 필요)`,
        );
    } else if (sev === "error") {
      problems.push(
        `'${rule}' severity=error 인데 promotion≠promoted — 무단 승격(승격 로그·promoted 표기 필요)`,
      );
    }
  }
  for (const p of PROMOTION_LOG.promotions ?? []) {
    if (PRINCIPLE_MAP[p.rule]?.promotion !== "promoted")
      problems.push(
        `승격 로그의 '${p.rule}' 가 PRINCIPLE_MAP 에서 promoted 아님(로그↔선언 불일치)`,
      );
    if (RULE_META[p.rule]?.severity !== "error")
      problems.push(`승격 로그의 '${p.rule}' RULE_META severity 가 error 아님`);
  }
  return problems;
}

const IMPACT_RANK = { high: 0, med: 1, low: 2, "-": 3 };

function renderMarkdown(rows, EXCEPTION_REGISTRY) {
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
  const promoted = rows.filter((r) => r.promotion === "promoted");
  lines.push(
    `- 대상 룰: **${total}개** ${INCLUDE_ALL ? "(error 포함)" : "(warn/info + 승격완료)"}`,
  );
  lines.push(
    `- ✅ 승격완료(promoted, 차단 중): **${promoted.length}개** — ${promoted.map((r) => "`" + r.rule + "`").join(", ") || "없음"}`,
  );
  lines.push(
    `- 🟢 승격후보(candidate): **${candidates.length}개** — 예외 없거나 정의됨, 바로 검토 가능`,
  );
  lines.push(`- 🟡 예외선행(context): **${contextDep.length}개** — 예외 케이스 데이터화 후 승격`);
  lines.push(`- ⚪ 현행유지(hold): **${rows.filter((r) => r.promotion === "hold").length}개**`);
  if (untagged.length) lines.push(`- ⚠ 미분류: **${untagged.length}개** — PRINCIPLE_MAP 매핑 필요`);
  lines.push("");
  const promotable = rows.filter((r) => r.promotion === "candidate" || r.promotion === "context");
  const safeNow = promotable.filter((r) => !r.exception || SAFE_EVAL.has(r.evaluation));
  const needWaiver = promotable.filter((r) => r.exception && r.evaluation === "explicit-waiver");
  lines.push("### 차단 안전성 (승격후보+예외선행 기준)");
  lines.push("");
  lines.push(
    `- ✅ 차단 안전: **${safeNow.length}개** — 예외 없거나 auto/structural/policy 자동 면제. detect 배선만 하면 바로 error 승격 가능.`,
  );
  lines.push(
    `- ⚠ waiver 필요: **${needWaiver.length}개** — explicit-waiver 예외라 차단 시 \`data-nudge-allow\` 사유 태그 운영 필요.`,
  );
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
    const PROMO_RANK = { promoted: 0, candidate: 1, context: 2, hold: 3 };
    rs.sort(
      (a, b) =>
        (PROMO_RANK[a.promotion] ?? 9) - (PROMO_RANK[b.promotion] ?? 9) ||
        IMPACT_RANK[a.uxImpact] - IMPACT_RANK[b.uxImpact] ||
        a.rule.localeCompare(b.rule),
    );
    lines.push(`## ${PRINCIPLE_TITLES[p]}`);
    lines.push("");
    lines.push("| 룰 | 현재 | 승격 | UX영향 | 예외 케이스 | 차단안전성 | 근거 |");
    lines.push("| --- | --- | --- | --- | --- | --- | --- |");
    for (const r of rs) {
      lines.push(
        `| \`${r.rule}\` | ${r.severity} · ${r.kind} | ${PROMO_LABEL[r.promotion] ?? "-"} | ${r.uxImpact} | ${r.exception ? "`" + r.exception + "`" : "—"} | ${r.readiness} | ${r.note} |`,
      );
    }
    lines.push("");
  }

  lines.push("## 예외 레지스트리 (차단 승격의 전제)");
  lines.push("");
  lines.push(
    "> SSOT: `scripts/validator-exception-registry.mjs`. `evaluation` 이 차단 안전성을 결정 — auto/structural/policy=validator·프로필 자동 면제(차단 안전), explicit-waiver=`data-nudge-allow` 사유 태그 필요(마찰).",
  );
  lines.push("");
  lines.push("| 예외 id | 원칙 | evaluation | 면제 룰 | 허용 조건 |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const [id, e] of Object.entries(EXCEPTION_REGISTRY)) {
    lines.push(
      `| \`${id}\` | ${e.principle} | ${e.evaluation} | ${e.appliesTo.map((r) => "`" + r + "`").join(" ")} | ${e.policy} |`,
    );
  }
  lines.push("");

  lines.push("## 다음 단계");
  lines.push("");
  lines.push(
    "1. **차단 안전(✅)** 룰: 예외의 `detect`(auto/structural/policy 면제 로직)를 validator 에 배선한 뒤 RULE_META severity 를 warn→error 로 승격. 예외 없는 것은 detect 불필요 → 바로 승격.",
  );
  lines.push(
    '2. **waiver 필요(⚠)** 룰: `data-nudge-allow="<예외id> — <사유>"` 토큰 파싱을 validator 에 배선(// allow-native 일반화)한 뒤 승격. 운영 마찰 있으니 신중.',
  );
  lines.push(
    "3. 승격은 RULE_META severity 변경 + 승격 사유 기록. 예외 detect/waiver 배선 = 다음 단계 ③(승격 게이트).",
  );
  return lines.join("\n");
}

const RULE_META = await loadRuleMeta();
const { PRINCIPLE_MAP } = await import(path.join(ROOT, "scripts/validator-principle-map.mjs"));
const { EXCEPTION_REGISTRY } = await import(
  path.join(ROOT, "scripts/validator-exception-registry.mjs")
);
const PROMOTION_LOG = JSON.parse(
  readFileSync(path.join(ROOT, "scripts/validator-promotion-log.json"), "utf8"),
);

// 맵↔레지스트리 드리프트 + 승격 거버넌스 검사 (모든 모드에서 먼저)
const problems = [
  ...checkConsistency(PRINCIPLE_MAP, EXCEPTION_REGISTRY),
  ...checkGovernance(RULE_META, PRINCIPLE_MAP, PROMOTION_LOG),
];
if (problems.length) {
  console.error("[validator-rule-report] ⚠ 정합/거버넌스 위반:");
  for (const p of problems) console.error(`  - ${p}`);
  if (CHECK) process.exit(1);
} else if (CHECK) {
  console.log("[validator-rule-report] ✓ 맵↔레지스트리 정합 + 승격 거버넌스 통과");
}
if (CHECK) process.exit(problems.length ? 1 : 0);

const rows = buildRows(RULE_META, PRINCIPLE_MAP, EXCEPTION_REGISTRY);

if (args.has("--json")) {
  process.stdout.write(
    JSON.stringify({ generatedFrom: "RULE_META×PRINCIPLE_MAP×EXCEPTION_REGISTRY", rows }, null, 2) +
      "\n",
  );
} else {
  const md = renderMarkdown(rows, EXCEPTION_REGISTRY);
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
