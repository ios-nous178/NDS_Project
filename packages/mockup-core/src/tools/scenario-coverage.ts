/**
 * tools/scenario-coverage.ts — 시나리오 보드 콘텐츠(`data-nds-scenario`) 검증 게이트.
 *
 * prd-coverage.ts 의 자매 게이트. 목업이 "이 목업을 처음 보는 분"을 위한 화면 흐름·조작 가이드를
 * 실제로 담고 있는지 검증한다 — AI 가 셸만 믿고 콘텐츠를 빼먹지 못하게 한다.
 *
 * 검사:
 *  1. `<script type="application/json" data-nds-scenario>` 블록 존재 + valid JSON
 *  2. flow[] 비어있지 않음 + 각 단계에 key/title
 *  3. screens{} 가 flow 의 모든 key 를 커버(화면별 설명 desc 존재)
 *  4. flow 의 각 key 가 실제 DOM `[data-screen="key"]` 로 존재(라이브 싱크 evidence)
 *
 * build-html 이 이 결과를 빌드 차단 게이트로 사용한다(scenario-board-incomplete = error).
 */
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import { parseScenarioFromHtml, type ScenarioFlowStep } from "./scenario-board.js";

export interface ScenarioCoverageViolation {
  rule: "scenario-board-incomplete";
  line: number;
  selector?: string;
  detail: string;
  suggestion: string;
}

export interface ValidateScenarioCoverageResult {
  ok: boolean;
  violations: ScenarioCoverageViolation[];
  violationsByRule: Array<{ rule: "scenario-board-incomplete"; count: number; lines: number[] }>;
  summary: {
    flowSteps: number;
    screensCovered: number;
    screensMissing: number;
    domMatched: number;
    hasManifest: boolean;
  };
  note: string;
}

export interface ValidateScenarioCoverageArgs {
  source?: string;
  filePath?: string;
}

const MANIFEST_HINT =
  '코드 작성 전에 화면 흐름을 분해해 <script type="application/json" data-nds-scenario>' +
  '{"flow":[{"key":"login","title":"로그인","sub":"신규 진입"}],' +
  '"screens":{"login":{"desc":"이 화면이 하는 일","tips":["조작 가이드…"]}},' +
  '"commonTips":["브라우저 뒤로가기로 이전 화면"],' +
  '"edgeCases":[{"screen":"login","label":"빈 상태","note":"…"}]}</script> 형식으로 남기고, ' +
  '각 화면 컨테이너에 data-screen="<key>" 를 달아 라이브 싱크가 동작하게 하세요.';

function readSource(args: ValidateScenarioCoverageArgs): string {
  if (args.source) return args.source;
  if (args.filePath) {
    const p = path.resolve(args.filePath);
    if (!fs.existsSync(p)) throw new Error(`File not found: ${p}`);
    return fs.readFileSync(p, "utf-8");
  }
  throw new Error("Provide either `source` (HTML string) or `filePath`.");
}

function blockLine(source: string): number {
  const idx = source.search(/<script\b[^>]*\bdata-nds-scenario\b/i);
  return idx < 0 ? 1 : source.slice(0, idx).split("\n").length;
}

export function validateScenarioCoverage(
  args: ValidateScenarioCoverageArgs,
): ValidateScenarioCoverageResult {
  const source = readSource(args);
  const violations: ScenarioCoverageViolation[] = [];

  const hasBlock = /<script\b[^>]*\bdata-nds-scenario\b/i.test(source);
  const data = parseScenarioFromHtml(source);

  if (!hasBlock) {
    violations.push({
      rule: "scenario-board-incomplete",
      line: 1,
      selector: "(document)",
      detail: "시나리오 보드 콘텐츠 매니페스트(data-nds-scenario)가 없습니다.",
      suggestion: MANIFEST_HINT,
    });
    return done(violations, { flowSteps: 0, screensCovered: 0, screensMissing: 0, domMatched: 0, hasManifest: false });
  }

  if (!data) {
    violations.push({
      rule: "scenario-board-incomplete",
      line: blockLine(source),
      selector: "script[data-nds-scenario]",
      detail: "data-nds-scenario JSON 파싱 실패 또는 flow/screens 구조가 비어 있습니다.",
      suggestion: MANIFEST_HINT,
    });
    return done(violations, { flowSteps: 0, screensCovered: 0, screensMissing: 0, domMatched: 0, hasManifest: true });
  }

  const line = blockLine(source);
  const $ = cheerio.load(source, { xmlMode: false });
  let screensCovered = 0;
  let domMatched = 0;
  const seenKeys = new Set<string>();

  data.flow.forEach((step: ScenarioFlowStep, i) => {
    const key = typeof step?.key === "string" ? step.key.trim() : "";
    const title = typeof step?.title === "string" ? step.title.trim() : "";
    if (!key || !title) {
      violations.push({
        rule: "scenario-board-incomplete",
        line,
        selector: "script[data-nds-scenario]",
        detail: `flow[${i}] 에 key 또는 title 이 없습니다.`,
        suggestion: "flow 의 각 단계는 { key, title, sub? } 형태여야 합니다. key 는 화면 식별자입니다.",
      });
      return;
    }
    if (seenKeys.has(key)) return;
    seenKeys.add(key);

    // screens{} 가 desc 로 이 화면을 커버하는가
    const screen = data.screens[key];
    if (screen && typeof screen.desc === "string" && screen.desc.trim()) {
      screensCovered++;
    } else {
      violations.push({
        rule: "scenario-board-incomplete",
        line,
        selector: "script[data-nds-scenario]",
        detail: `화면 "${key}" 에 대한 설명(screens["${key}"].desc)이 없습니다.`,
        suggestion: `screens["${key}"] 에 이 화면이 하는 일을 desc 로, 조작 가이드를 tips[] 로 채우세요.`,
      });
    }

    // 라이브 싱크 evidence: 실제 [data-screen="key"] 가 DOM 에 있는가
    let domOk = false;
    try {
      domOk = $(`[data-screen="${key}"]`).length > 0;
    } catch {
      domOk = false;
    }
    if (domOk) {
      domMatched++;
    } else {
      violations.push({
        rule: "scenario-board-incomplete",
        line,
        selector: `[data-screen="${key}"]`,
        detail: `flow 의 화면 "${key}" 에 대응하는 [data-screen="${key}"] 요소가 DOM 에 없습니다.`,
        suggestion: `해당 화면을 그리는 컨테이너에 data-screen="${key}" 를 추가하세요(보드의 "지금 보는 화면" 라이브 싱크 근거).`,
      });
    }
  });

  return done(violations, {
    flowSteps: seenKeys.size,
    screensCovered,
    screensMissing: Math.max(0, seenKeys.size - screensCovered),
    domMatched,
    hasManifest: true,
  });
}

function done(
  violations: ScenarioCoverageViolation[],
  summary: ValidateScenarioCoverageResult["summary"],
): ValidateScenarioCoverageResult {
  const lines = violations.map((v) => v.line);
  return {
    ok: violations.length === 0,
    violations,
    violationsByRule:
      violations.length > 0
        ? [{ rule: "scenario-board-incomplete", count: violations.length, lines }]
        : [],
    summary,
    note:
      "시나리오 보드(처음 보는 분을 위한 화면 흐름·조작 가이드) 전용 검증입니다. " +
      "셸은 빌드가 자동 주입하지만 콘텐츠(flow/screens/tips)는 작성해야 합니다.",
  };
}
