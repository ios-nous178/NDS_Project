#!/usr/bin/env node
/**
 * learning-report.mjs — Learning 루프 주간 리포트 생성기 (GOVERNANCE.md Track B3).
 *
 * supabase/migrations/0002_learning_views.sql 의 분석 뷰를 service_role 로 읽어
 * "측정 → 개선" 라우팅 리포트를 마크다운으로 만든다. mcp_events 에 이미 쌓이는 신호
 * (검증 룰 위반 · 조회 미스=환각 · 가이드 수요 · 피드백 · 품질 추세)를 한 장으로 묶는다.
 *
 * 읽기는 RLS 때문에 service_role 키가 필요하다(anon 은 0행 — supabase/README.md 보안 모델).
 *
 * 환경변수:
 *   SUPABASE_URL          https://<ref>.supabase.co   (필수)
 *   SUPABASE_SERVICE_KEY  service_role 키             (필수 — 비공개. CI secret)
 *   LEARNING_REPORT_WEEKS 최근 N주만 (기본 2)
 *   LEARNING_REPORT_OUT   출력 파일 경로 (기본 ./learning-report.md)
 *
 * 자격증명이 없으면(로컬·시크릿 미설정) 안내만 찍고 exit 0 — CI 를 깨지 않는다.
 *
 * 실행: node scripts/learning-report.mjs   (또는 .github/workflows/learning-report.yml 가 주간 호출)
 */
import { writeFileSync } from "node:fs";

const URL_BASE = process.env.SUPABASE_URL?.replace(/\/$/, "");
const KEY = process.env.SUPABASE_SERVICE_KEY;
const WEEKS = Number(process.env.LEARNING_REPORT_WEEKS ?? 2);
const OUT = process.env.LEARNING_REPORT_OUT ?? "learning-report.md";

if (!URL_BASE || !KEY) {
  console.log(
    "[learning-report] SUPABASE_URL / SUPABASE_SERVICE_KEY 미설정 — 리포트를 건너뜁니다.\n" +
      "  텔레메트리 프로젝트 생성 후 CI secret 에 service_role 키를 넣으세요(supabase/README.md).",
  );
  process.exit(0);
}

/** 최근 N주 컷오프(월요일 기준 date_trunc('week')) ISO 날짜. */
function weekCutoff(weeks) {
  const d = new Date();
  const day = (d.getUTCDay() + 6) % 7; // 월=0
  d.setUTCDate(d.getUTCDate() - day - 7 * (weeks - 1));
  return d.toISOString().slice(0, 10);
}

async function view(name, { limit = 100, extra = "" } = {}) {
  const url = `${URL_BASE}/rest/v1/${name}?select=*${extra}&limit=${limit}`;
  const res = await fetch(url, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!res.ok) throw new Error(`${name}: ${res.status} ${await res.text().catch(() => "")}`);
  return res.json();
}

const md = [];
const p = (s = "") => md.push(s);
const since = weekCutoff(WEEKS);
const fence = "```";

function table(headers, rows) {
  if (!rows.length) return "_데이터 없음_";
  const head = `| ${headers.join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((r) => `| ${r.join(" | ")} |`).join("\n");
  return [head, sep, body].join("\n");
}

try {
  const weekFilter = `&week=gte.${since}`;

  const rules = await view("learning_validation_rules_weekly", { extra: weekFilter, limit: 200 });
  const misses = await view("learning_lookup_misses_weekly", { extra: weekFilter, limit: 200 });
  const guide = await view("learning_guide_demand_weekly", { extra: weekFilter, limit: 100 });
  const feedback = await view("learning_feedback_recent", { limit: 30 });
  const quality = await view("learning_quality_weekly", { extra: weekFilter, limit: 50 });

  p(`# DS Learning 리포트 (최근 ${WEEKS}주, since ${since})`);
  p();
  p("> mcp_events 텔레메트리 → 분석 뷰(0002) 집계. 각 섹션 끝의 **→ 액션** 대로 트리아지하세요.");
  p();

  p("## ① 자주 깨지는 검증 룰");
  p(
    table(
      ["week", "rule", "kind", "sev", "mockups", "hits", "weighted"],
      rules
        .slice(0, 15)
        .map((r) => [r.week, r.rule, r.rule_kind ?? "-", r.severity, r.mockups_hit, r.total_hits, r.weighted]),
    ),
  );
  p();
  const zeroGuard = rules.filter((r) => r.rule_kind === "model-guard" && (r.total_hits ?? 0) === 0);
  p(
    `→ **액션**: 상위 weighted(error) 룰 = 게이트 강화 or 가이드 보강(/ds-fix). ` +
      `model-guard 중 hits 0 = 폐기 후보(${zeroGuard.length}건) → changeset.`,
  );
  p();

  p("## ② 조회 미스 (환각 / 공백)");
  p(
    table(
      ["week", "tool", "catalog", "term", "brand", "misses", "원 요청"],
      misses
        .slice(0, 15)
        .map((r) => [r.week, r.tool ?? "-", r.catalog, r.term, r.brand, r.misses, trunc(r.sample_request)]),
    ),
  );
  p();
  p("→ **액션**: 반복 term = 가이드/별칭 추가 or 신규 편입 신호(/ds-component). 환각이면 가이드에 '없음' 명시.");
  p();

  p("## ③ 가이드 수요 미스");
  p(
    table(
      ["week", "topic", "misses", "total"],
      guide.filter((r) => (r.misses ?? 0) > 0).slice(0, 12).map((r) => [r.week, r.topic, r.misses, r.total]),
    ),
  );
  p();
  p("→ **액션**: misses 상위 토픽 = 작성/보강할 가이드(guides-src/**).");
  p();

  p("## ④ 최근 피드백");
  p(
    table(
      ["when", "brand", "category", "target", "feedback"],
      feedback
        .slice(0, 15)
        .map((r) => [day(r.created_at), r.brand, r.category ?? "-", r.target ?? "-", trunc(r.feedback, 80)]),
    ),
  );
  p();
  p("→ **액션**: category 로 라우팅 — bug→이슈, component/token→/ds-fix, guide→가이드, pattern→패턴.");
  p();

  p("## ⑤ 품질 추세");
  p(
    table(
      ["week", "brand", "코드점수", "LLM점수", "검증", "품질"],
      quality
        .slice(0, 20)
        .map((r) => [r.week, r.brand, r.avg_code_score ?? "-", r.avg_llm_score ?? "-", r.validations, r.quality_runs]),
    ),
  );
  p();
  p("→ **액션**: 점수 하락 주 = 회귀. 직전 주 대비 떨어진 브랜드를 우선 점검.");
  p();
  p("---");
  p(`_생성: scripts/learning-report.mjs · 뷰: supabase/migrations/0002_learning_views.sql_`);

  const out = md.join("\n");
  writeFileSync(OUT, out);
  console.log(out);
  console.log(`\n[learning-report] → ${OUT}`);
} catch (err) {
  console.error("[learning-report] 실패:", err.message);
  process.exit(1);
}

function trunc(s, n = 50) {
  if (!s) return "-";
  const one = String(s).replace(/\s+/g, " ").trim();
  return one.length > n ? one.slice(0, n) + "…" : one;
}
function day(ts) {
  return ts ? String(ts).slice(0, 10) : "-";
}
