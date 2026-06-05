import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

interface DomElement {
  type: string;
  tagName: string;
  attribs: Record<string, string>;
  startIndex?: number | null;
}

export interface PrdCoverageViolation {
  rule: "prd-coverage-incomplete";
  line: number;
  selector?: string;
  detail: string;
  suggestion: string;
}

export interface ValidatePrdCoverageResult {
  ok: boolean;
  violations: PrdCoverageViolation[];
  violationsByRule: Array<{ rule: "prd-coverage-incomplete"; count: number; lines: number[] }>;
  summary: {
    requirements: number;
    implemented: number;
    missing: number;
    hasManifest: boolean;
  };
  note: string;
}

interface PrdCoverageItem {
  id?: unknown;
  requirement?: unknown;
  text?: unknown;
  status?: unknown;
  evidence?: unknown;
  selector?: unknown;
}

export interface ValidatePrdCoverageArgs {
  source?: string;
  filePath?: string;
}

function lineNumberAt(source: string, index: number): number {
  return source.slice(0, index).split("\n").length;
}

function describeElement(el: DomElement): string {
  const tag = el.tagName;
  const id = el.attribs?.id;
  let s = `<${tag}`;
  if (id) s += `#${id}`;
  s += ">";
  return s;
}

function readSource(args: ValidatePrdCoverageArgs): string {
  if (args.source) return args.source;
  if (args.filePath) {
    const p = path.resolve(args.filePath);
    if (!fs.existsSync(p)) throw new Error(`File not found: ${p}`);
    return fs.readFileSync(p, "utf-8");
  }
  throw new Error("Provide either `source` (HTML string) or `filePath`.");
}

export function validatePrdCoverage(args: ValidatePrdCoverageArgs): ValidatePrdCoverageResult {
  const source = readSource(args);
  const $ = cheerio.load(source, { xmlMode: false });
  const violations: PrdCoverageViolation[] = [];
  let requirementsTotal = 0;
  let implementedTotal = 0;
  const nodes = $('script[type="application/json"][data-prd-coverage]');

  if (nodes.length === 0) {
    violations.push({
      rule: "prd-coverage-incomplete",
      line: 1,
      selector: "(document)",
      detail: "PRD/brief 요구사항 커버리지 매니페스트가 없습니다.",
      suggestion:
        '코드 작성 전에 명시 요구사항을 전부 분해해 <script type="application/json" data-prd-coverage>{"requirements":[{"id":"R1","requirement":"...","status":"implemented","evidence":"#selector"}]}</script> 형식으로 남기세요.',
    });
  }

  nodes.each((_i, el) => {
    if (el.type !== "tag" && el.type !== "script") return;
    const line = lineNumberAt(source, (el as unknown as { startIndex?: number }).startIndex ?? 0);
    const selector = describeElement(el as unknown as DomElement);
    let parsed: unknown;
    try {
      parsed = JSON.parse($(el).text());
    } catch {
      violations.push({
        rule: "prd-coverage-incomplete",
        line,
        selector,
        detail: "data-prd-coverage JSON 파싱 실패.",
        suggestion:
          'PRD/brief 요구사항을 {"requirements":[{"id":"R1","requirement":"...","status":"implemented","evidence":"#selector"}]} 형식의 valid JSON 으로 남기세요.',
      });
      return;
    }

    const requirements = Array.isArray(parsed)
      ? parsed
      : parsed &&
          typeof parsed === "object" &&
          Array.isArray((parsed as { requirements?: unknown }).requirements)
        ? (parsed as { requirements: unknown[] }).requirements
        : null;
    if (!requirements || requirements.length === 0) {
      violations.push({
        rule: "prd-coverage-incomplete",
        line,
        selector,
        detail: "PRD/brief 요구사항 목록이 비어 있습니다.",
        suggestion:
          "사용자 PRD/brief 의 명시 요구사항을 빠짐없이 requirements[] 로 분해하고, 각 항목에 implemented 상태와 실제 DOM evidence selector 를 연결하세요.",
      });
      return;
    }

    requirementsTotal += requirements.length;
    requirements.forEach((item, index) => {
      const req = item as PrdCoverageItem;
      const id = typeof req.id === "string" && req.id.trim() ? req.id.trim() : `#${index + 1}`;
      const status = typeof req.status === "string" ? req.status.trim().toLowerCase() : "";
      const okStatus = ["implemented", "done", "complete", "covered"].includes(status);
      const evidenceRaw = req.evidence ?? req.selector;
      const evidences =
        typeof evidenceRaw === "string"
          ? [evidenceRaw]
          : Array.isArray(evidenceRaw)
            ? evidenceRaw.filter((x): x is string => typeof x === "string")
            : [];
      const evidence = evidences.map((x) => x.trim()).filter(Boolean);
      const missingEvidence =
        evidence.length === 0 ||
        evidence.some((sel) => {
          try {
            return $(sel).length === 0;
          } catch {
            return true;
          }
        });
      if (okStatus && !missingEvidence) {
        implementedTotal++;
        return;
      }
      violations.push({
        rule: "prd-coverage-incomplete",
        line,
        selector,
        detail: `${id} 요구사항이 완료 증거를 갖지 못했습니다(status="${status || "missing"}", evidence="${evidence.join(", ") || "missing"}").`,
        suggestion:
          "PRD 일부만 구현한 채 종료하지 마세요. 해당 요구사항을 실제 UI/인터랙션으로 구현하고 evidence selector 가 존재하게 하거나, 사용자 승인 없이 omitted/todo 로 남기지 마세요.",
      });
    });
  });

  const lines = violations.map((v) => v.line);
  return {
    ok: violations.length === 0,
    violations,
    violationsByRule:
      violations.length > 0
        ? [{ rule: "prd-coverage-incomplete", count: violations.length, lines }]
        : [],
    summary: {
      requirements: requirementsTotal,
      implemented: implementedTotal,
      missing: Math.max(0, requirementsTotal - implementedTotal),
      hasManifest: nodes.length > 0,
    },
    note: "PRD/brief 커버리지 전용 검증입니다. DS 토큰/컴포넌트 품질 점수는 validate_html_mockup 결과를 따로 보세요.",
  };
}
