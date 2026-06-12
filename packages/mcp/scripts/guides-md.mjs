/**
 * guides-md.mjs — 가이드 .md ↔ 가이드 객체 직렬화/파서 (공용 라이브러리).
 *
 * 포맷: frontmatter(YAML) = 구조 필드 / 본문 = prose·리스트·코드 섹션.
 *   - prose (`## summary` 등)        : 섹션 내용 그대로(trim 불변 — serialize 가 assert).
 *   - 리스트 (`## pitfalls` 등)       : `- ` 불릿. 항목 내 개행 = 2칸 들여쓰기 연속행(markdown 표준).
 *   - 코드 (`## examples.do` 등)      : 백틱 펜스(내용의 백틱 run 보다 긴 펜스 자동 선택).
 *   - name 은 파일명이 SSOT — frontmatter 에 두지 않는다.
 *
 * 무손실 왕복(serialize → parse → deep-equal)이 계약 — 마이그레이션 시 가이드마다 검증.
 * 소비자: build-guides.mjs(md → src/guides.generated.ts).
 */
import YAML from "yaml";

/** 본문 섹션 정의 — id(`## id` 헤더) ↔ 가이드 객체 경로. 여기 없는 필드는 전부 frontmatter. */
export const SECTION_DEFS = [
  { id: "summary", kind: "prose", path: ["summary"] },
  { id: "pitfalls", kind: "list", path: ["pitfalls"] },
  { id: "recommended", kind: "list", path: ["recommended"] },
  { id: "accessibility", kind: "list", path: ["accessibility"] },
  { id: "rules", kind: "list", path: ["rules"] },
  { id: "avoid", kind: "list", path: ["avoid"] },
  { id: "interactivePattern", kind: "prose", path: ["interactivePattern"] },
  { id: "examples.do", kind: "code", lang: "tsx", path: ["examples", "do"] },
  { id: "examples.dont", kind: "code", lang: "tsx", path: ["examples", "dont"] },
  { id: "examplesHtml.do", kind: "code", lang: "html", path: ["examplesHtml", "do"] },
  { id: "examplesHtml.dont", kind: "code", lang: "html", path: ["examplesHtml", "dont"] },
  { id: "readyMade.note", kind: "prose", path: ["_readyMade", "note"] },
  { id: "readyMade.html", kind: "code", lang: "html", path: ["_readyMade", "html"] },
  { id: "readyMade.react", kind: "code", lang: "tsx", path: ["_readyMade", "react"] },
  { id: "readyMade.shellHtml", kind: "code", lang: "html", path: ["_readyMade", "shellHtml"] },
];
const SECTION_BY_ID = new Map(SECTION_DEFS.map((s) => [s.id, s]));
const SECTION_RE = /^## ([A-Za-z][A-Za-z.]*)$/;
const SECTION_LINE_RE = /^## [A-Za-z][A-Za-z.]*$/m;

function getPath(obj, path) {
  let v = obj;
  for (const k of path) {
    if (v == null || typeof v !== "object") return undefined;
    v = v[k];
  }
  return v;
}

function setPath(obj, path, value) {
  let v = obj;
  for (const k of path.slice(0, -1)) {
    v[k] = v[k] ?? {};
    v = v[k];
  }
  v[path.at(-1)] = value;
}

/** 이 def 가 본문 섹션으로 직렬화되는가 (값 존재 + 형 일치 — PatternGuide.examples 배열은 제외). */
function isBodyValue(def, value) {
  if (def.kind === "list") return Array.isArray(value) && value.length > 0;
  return typeof value === "string";
}

/** 본문 섹션으로 빠질 경로를 제거한 frontmatter 사본. 비게 된 컨테이너는 drop. */
function frontmatterOf(guide) {
  const fm = structuredClone(guide);
  for (const def of SECTION_DEFS) {
    if (!isBodyValue(def, getPath(guide, def.path))) continue;
    let parent = fm;
    for (const k of def.path.slice(0, -1)) parent = parent?.[k];
    if (parent) delete parent[def.path.at(-1)];
  }
  for (const head of new Set(SECTION_DEFS.filter((d) => d.path.length > 1).map((d) => d.path[0]))) {
    if (fm[head] && typeof fm[head] === "object" && Object.keys(fm[head]).length === 0) {
      delete fm[head];
    }
  }
  delete fm.name; // name 은 파일명/키가 SSOT
  return fm;
}

function assertSafeProse(name, id, text) {
  if (text !== text.trim()) throw new Error(`${name} ${id}: 앞뒤 공백은 무손실 왕복 불가`);
  if (SECTION_LINE_RE.test(text)) {
    throw new Error(`${name} ${id}: 본문에 섹션 헤더와 충돌하는 줄("## x")이 있음`);
  }
}

function serializeList(name, id, items) {
  const out = [];
  for (const item of items) {
    if (typeof item !== "string") throw new Error(`${name} ${id}: 문자열 아닌 리스트 항목`);
    assertSafeProse(name, id, item);
    if (item.includes("\n\n")) throw new Error(`${name} ${id}: 항목 내 빈 줄은 표현 불가`);
    if (/(^|\n)- /.test(item)) throw new Error(`${name} ${id}: 항목 내 "- " 줄 시작은 표현 불가`);
    out.push(`- ${item.replace(/\n/g, "\n  ")}`);
  }
  return out.join("\n");
}

function serializeCode(code, lang) {
  const maxRun = Math.max(0, ...[...code.matchAll(/`+/g)].map((m) => m[0].length));
  const fence = "`".repeat(Math.max(3, maxRun + 1));
  return `${fence}${lang}\n${code}\n${fence}`;
}

/** 가이드 객체 → .md 문서. */
export function serializeGuide(key, guide) {
  if (guide.name !== key) throw new Error(`${key}: name(${guide.name})과 키 불일치`);
  const out = [`---\n${YAML.stringify(frontmatterOf(guide), { lineWidth: 0 }).trimEnd()}\n---`];
  for (const def of SECTION_DEFS) {
    const v = getPath(guide, def.path);
    if (!isBodyValue(def, v)) continue;
    let body;
    if (def.kind === "prose") {
      assertSafeProse(key, def.id, v);
      body = v;
    } else if (def.kind === "list") {
      body = serializeList(key, def.id, v);
    } else {
      body = serializeCode(v, def.lang);
    }
    out.push(`## ${def.id}\n\n${body}`);
  }
  return `${out.join("\n\n")}\n`;
}

function parseList(file, id, lines) {
  const items = [];
  for (const line of lines) {
    if (line.startsWith("- ")) items.push(line.slice(2));
    else if (line.startsWith("  ") && items.length > 0) {
      items[items.length - 1] += `\n${line.slice(2)}`;
    } else if (line.trim() === "") {
      continue;
    } else {
      throw new Error(`${file} ${id}: 리스트 줄 파싱 실패 — ${JSON.stringify(line.slice(0, 60))}`);
    }
  }
  return items;
}

function parseCode(file, id, lines) {
  const start = lines.findIndex((l) => l.trim() !== "");
  const m = /^(`{3,})([a-z]*)$/.exec(lines[start] ?? "");
  if (!m) throw new Error(`${file} ${id}: 코드 섹션은 펜스로 시작해야 함`);
  const fence = m[1];
  const close = lines.findIndex((l, i) => i > start && l === fence);
  if (close < 0) throw new Error(`${file} ${id}: 닫는 펜스 없음`);
  if (lines.slice(close + 1).some((l) => l.trim() !== "")) {
    throw new Error(`${file} ${id}: 펜스 뒤 잉여 내용`);
  }
  return lines.slice(start + 1, close).join("\n");
}

/** .md 문서 → 가이드 객체. key = 파일명(확장자 제외) = name. */
export function parseGuide(file, key, source) {
  const norm = source.replace(/\r\n/g, "\n");
  if (!norm.startsWith("---\n")) throw new Error(`${file}: frontmatter(---)로 시작해야 함`);
  const fmEnd = norm.indexOf("\n---\n", 4);
  if (fmEnd < 0) throw new Error(`${file}: frontmatter 종료(---) 없음`);
  const fm = YAML.parse(norm.slice(4, fmEnd + 1)) ?? {};
  if ("name" in fm) throw new Error(`${file}: name 은 파일명이 SSOT — frontmatter 에서 제거하세요`);

  const guide = { name: key, ...fm };
  const lines = norm.slice(fmEnd + 5).split("\n");

  // 섹션 분할 — 코드 섹션의 펜스 안 "## " 줄은 헤더로 보지 않는다.
  const found = [];
  let current = null;
  let inFence = null;
  for (const line of lines) {
    if (inFence) {
      current.lines.push(line);
      if (line === inFence) inFence = null;
      continue;
    }
    const header = SECTION_RE.exec(line);
    if (header) {
      const def = SECTION_BY_ID.get(header[1]);
      if (!def) throw new Error(`${file}: 알 수 없는 섹션 "## ${header[1]}"`);
      if (found.some((s) => s.def.id === def.id)) {
        throw new Error(`${file}: 섹션 중복 "## ${def.id}"`);
      }
      current = { def, lines: [] };
      found.push(current);
      continue;
    }
    if (!current) {
      if (line.trim() !== "") {
        throw new Error(`${file}: 섹션 밖 내용 — ${JSON.stringify(line.slice(0, 60))}`);
      }
      continue;
    }
    const fenceMatch = /^(`{3,})/.exec(line);
    if (fenceMatch && current.def.kind === "code") inFence = fenceMatch[1];
    current.lines.push(line);
  }
  if (inFence) throw new Error(`${file}: 닫히지 않은 코드 펜스`);

  for (const { def, lines: sectionLines } of found) {
    let value;
    if (def.kind === "prose") value = sectionLines.join("\n").trim();
    else if (def.kind === "list") value = parseList(file, def.id, sectionLines);
    else value = parseCode(file, def.id, sectionLines);
    setPath(guide, def.path, value);
  }
  return guide;
}

/** 깊은 동등성(객체 키 순서 무시) — 무손실 왕복 검증용. */
export function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (a && b && typeof a === "object") {
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    return ka.every((k) => deepEqual(a[k], b[k]));
  }
  return false;
}
