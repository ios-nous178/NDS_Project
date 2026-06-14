/**
 * generate-component-docs.mjs — 컴포넌트 문서의 **코드 파생 섹션**을 생성/주입한다.
 *
 * 배경(docs/drafts/component-docs-automation.md):
 *   같은 컴포넌트를 guides-src(AI용 판단 SSOT) · docs/components/*.mdx(사람용 문서) 두 곳에서
 *   수기로 설명한다. 이 중 **Props 표는 100% 코드에서 도출 가능**한데 손으로 유지돼 react 소스와
 *   드리프트한다(타입·기본값·prop 누락). 게이트는 '생성물 stale' 만 막지 이 수기↔코드 불일치는 못 막는다.
 *
 * 설계(전면 재생성 대신 마커 주입):
 *   - 각 mdx 의 사람이 쓴 prose·Playground·예제는 **그대로 보존**한다.
 *   - 오직 Props 표만 `packages/react/src/<Title>.tsx` 의 Props 인터페이스(타입 + JSDoc + @default)에서
 *     생성해 `<!-- AUTO-GEN:props:START -->` … `:END` 마커 사이에 주입한다.
 *   - 이렇게 하면 진실의 출처가 제자리에 머문다: 코드→Props, guides-src→판단(AI), mdx→사람 prose.
 *     guides-src(외부 MCP 소비자가 받는 SSOT)에 문서용 prose 를 역이식해 오염시키지 않는다.
 *
 * react 소스가 SSOT 이므로 Props 설명은 **JSDoc 이 정본**이다(현 커버리지 92%). JSDoc 없는 prop 은
 * --check 에서 경고로 드러나 100% 로 수렴시킨다.
 *
 * 사용:
 *   node scripts/generate-component-docs.mjs           # mdx 에 Props 표 주입(쓰기)
 *   node scripts/generate-component-docs.mjs --check    # 생성물 stale 검사 (CI/lint, non-mutating)
 *   node scripts/generate-component-docs.mjs --report    # 생성 vs 기존 표 비교 리포트 (롤아웃 판단용)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const DOCS_DIR = path.join(rootDir, "docs/components");
const REACT_SRC = path.join(rootDir, "packages/react/src");
const BASELINE_PATH = path.join(rootDir, "scripts/component-docs-baseline.json");

const MODE = process.argv.includes("--check")
  ? "check"
  : process.argv.includes("--report")
    ? "report"
    : "write";

const MARK_START = "<!-- AUTO-GEN:props:START -->";
const MARK_END = "<!-- AUTO-GEN:props:END -->";
const AUTO_NOTE =
  "<!-- 이 표는 packages/react/src 의 Props 인터페이스에서 자동 생성됩니다. " +
  "직접 고치지 말고 소스의 타입/JSDoc 을 고친 뒤 `pnpm generate:component-docs` 를 실행하세요. -->";

/* ─── baseline (의도적으로 자동화 제외하는 mdx) ─────────────────────────── */

function loadBaseline() {
  try {
    return JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"));
  } catch {
    return { skip: {} };
  }
}
const baseline = loadBaseline();

/* ─── frontmatter title 추출 ──────────────────────────────────────────── */

function frontmatterTitle(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const tm = m[1].match(/^title:\s*(.+)$/m);
  return tm ? tm[1].trim() : null;
}

/* ─── TS 소스에서 Props 인터페이스 추출 ──────────────────────────────────── */

/** JSDoc comment(string | NodeArray) 를 평문 한 줄로 정규화. */
function jsDocText(comment) {
  if (!comment) return "";
  const raw = typeof comment === "string" ? comment : comment.map((c) => c.text).join("");
  return raw.replace(/\s*\n\s*/g, " ").trim();
}

/** 타입 텍스트를 표에 맞게 정리 (React. 접두 제거, 공백 정규화). */
function cleanType(typeText) {
  return typeText
    .replace(/\bReact\./g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 컴포넌트 구현부의 파라미터 구조분해(destructuring)에서 기본값을 수집.
 * 기본값은 보통 JSDoc `@default` 가 아니라 `({ variant = "solid" }) => …` 처럼 코드에 산다.
 * Props 타입(<Title>Props 류)을 받는 파라미터의 ObjectBindingPattern 만 골라 name→기본값을 맵핑.
 */
function collectDefaults(sourceFile, propsTypeNames) {
  const defaults = new Map();
  const visit = (node) => {
    if (
      (ts.isArrowFunction(node) ||
        ts.isFunctionDeclaration(node) ||
        ts.isFunctionExpression(node)) &&
      node.parameters.length
    ) {
      const param = node.parameters[0];
      const typeName = param.type ? param.type.getText(sourceFile).replace(/<.*>$/, "") : "";
      const isPropsParam = propsTypeNames.some((n) => typeName.includes(n));
      if (param.name && ts.isObjectBindingPattern(param.name) && (isPropsParam || !param.type)) {
        for (const el of param.name.elements) {
          if (el.initializer && el.name && ts.isIdentifier(el.name)) {
            const key = (el.propertyName ?? el.name).getText(sourceFile);
            // 객체/배열/함수 기본값은 표에 길어서 생략, 원시 리터럴만 노출
            const init = el.initializer;
            if (
              ts.isStringLiteral(init) ||
              ts.isNumericLiteral(init) ||
              init.kind === ts.SyntaxKind.TrueKeyword ||
              init.kind === ts.SyntaxKind.FalseKeyword
            ) {
              if (!defaults.has(key)) defaults.set(key, init.getText(sourceFile));
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return defaults;
}

/**
 * 파일에서 컴포넌트의 "대표" Props 인터페이스 멤버를 추출.
 * 우선순위: <Title>Props → <Title>RootProps → 첫 `${Title}*Props`.
 * 상속(extends)된 HTML 속성은 제외하고 인터페이스에 **직접 선언된 prop** 만 — 기존 mdx 관례와 동일.
 * 기본값은 JSDoc `@default` 우선, 없으면 구현부 구조분해 기본값으로 폴백.
 */
function extractProps(sourceFile, title) {
  const interfaces = new Map();
  sourceFile.forEachChild((node) => {
    if (ts.isInterfaceDeclaration(node) && node.name) interfaces.set(node.name.text, node);
  });

  const preferred = [`${title}Props`, `${title}RootProps`];
  let target = preferred.map((n) => interfaces.get(n)).find(Boolean);
  if (!target) {
    for (const [name, node] of interfaces) {
      if (name.startsWith(title) && name.endsWith("Props")) {
        target = node;
        break;
      }
    }
  }
  if (!target) return null;

  const defaults = collectDefaults(sourceFile, [target.name.text]);

  const props = [];
  for (const member of target.members) {
    if (!ts.isPropertySignature(member) || !member.name) continue;
    const name = member.name.getText(sourceFile).replace(/^["']|["']$/g, "");
    const optional = !!member.questionToken;
    const typeText = member.type ? cleanType(member.type.getText(sourceFile)) : "unknown";

    let description = "";
    let defaultValue = "";
    const jsDocs = member.jsDoc ?? [];
    for (const doc of jsDocs) {
      if (doc.comment) description = jsDocText(doc.comment);
      for (const tag of doc.tags ?? []) {
        if (tag.tagName.text === "default") defaultValue = jsDocText(tag.comment);
        if (tag.tagName.text === "deprecated") {
          const dep = jsDocText(tag.comment);
          description = `**(deprecated)** ${dep || description}`.trim();
        }
      }
    }
    if (!defaultValue && defaults.has(name)) defaultValue = defaults.get(name);
    props.push({ name, optional, type: typeText, description, default: defaultValue });
  }
  return { interfaceName: target.name.text, props };
}

/* ─── Props 표 렌더 ──────────────────────────────────────────────────── */

function escapeCell(text) {
  return String(text).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

/**
 * 설명 셀은 백틱(인라인 코드) 밖에 있다 → MDX 가 `<Checkbox>`·`{x}` 를 JSX 로 파싱해 빌드가 깨진다.
 * generate-guide-docs.mjs 의 esc() 와 같은 전략: 백틱 span 은 건드리지 않고, 그 바깥의
 * `<` `{` `}` 만 HTML 엔티티로 치환한다(의도된 `` `<button>` `` 은 백틱 안이라 보존).
 */
function escapeDescription(text) {
  return escapeCell(text)
    .split(/(`[^`]*`)/)
    .map((part, i) =>
      i % 2 === 1
        ? part
        : part.replace(/</g, "&lt;").replace(/\{/g, "&#123;").replace(/\}/g, "&#125;"),
    )
    .join("");
}

/**
 * 인라인 코드 셀. 백틱 span 안은 MDX 가 `{}` `<>` 를 raw 로 두므로 안전하다 — 단,
 * 값에 백틱이 들어가면(예: 기본값이 템플릿 리터럴 `(n) => `${n}개``) span 이 깨져
 * `{n}` 이 JSX 표현식으로 새 버린다. 내부 백틱을 작은따옴표로 치환해 span 을 보존한다.
 */
function codeCell(text) {
  return `\`${escapeCell(text).replace(/`/g, "'")}\``;
}

function renderPropsTable(props) {
  const lines = ["| Prop | 타입 | 기본값 | 설명 |", "| --- | --- | --- | --- |"];
  for (const p of props) {
    const name = `\`${p.name}\`${p.optional ? "" : " *(필수)*"}`;
    const type = codeCell(p.type);
    const def = p.default ? codeCell(p.default) : "—";
    const desc = escapeDescription(p.description) || "—";
    lines.push(`| ${name} | ${type} | ${def} | ${desc} |`);
  }
  return lines.join("\n");
}

function renderBlock(props) {
  return `${MARK_START}\n${AUTO_NOTE}\n\n${renderPropsTable(props)}\n\n${MARK_END}`;
}

/* ─── mdx 주입 ──────────────────────────────────────────────────────── */

/** 기존 `## Props` 섹션의 표 블록을 마커+생성표로 교체. 이미 마커가 있으면 사이만 교체. */
function injectPropsBlock(text, block) {
  if (text.includes(MARK_START) && text.includes(MARK_END)) {
    const re = new RegExp(`${escapeRe(MARK_START)}[\\s\\S]*?${escapeRe(MARK_END)}`);
    return { text: text.replace(re, block), injected: true };
  }
  const lines = text.split("\n");
  const headingIdx = lines.findIndex((l) => /^#{2,3}\s+Props\s*$/.test(l.trim()));
  if (headingIdx === -1) return { text, injected: false };

  // 헤딩 다음의 첫 표(| 로 시작) 블록을 찾아 교체. 표가 없으면 헤딩 바로 뒤에 삽입.
  let i = headingIdx + 1;
  while (i < lines.length && !/^\s*\|/.test(lines[i]) && !/^#{1,3}\s/.test(lines[i])) i++;
  if (i < lines.length && /^\s*\|/.test(lines[i])) {
    const tableStart = i;
    while (i < lines.length && /^\s*\|/.test(lines[i])) i++;
    const before = lines.slice(0, tableStart).join("\n");
    const after = lines.slice(i).join("\n");
    return { text: `${before}\n${block}\n${after}`, injected: true };
  }
  // 표가 없는 경우: 헤딩 직후 삽입
  const before = lines.slice(0, headingIdx + 1).join("\n");
  const after = lines.slice(headingIdx + 1).join("\n");
  return { text: `${before}\n\n${block}\n${after}`, injected: true };
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 기존 mdx 의 `## Props` 표(마커 밖)를 텍스트로 추출 — --report 비교용. */
function extractExistingTable(text) {
  if (text.includes(MARK_START)) {
    const m = text.match(new RegExp(`${escapeRe(MARK_START)}([\\s\\S]*?)${escapeRe(MARK_END)}`));
    return m ? m[1] : "";
  }
  const lines = text.split("\n");
  const h = lines.findIndex((l) => /^#{2,3}\s+Props\s*$/.test(l.trim()));
  if (h === -1) return "";
  let i = h + 1;
  while (i < lines.length && !/^\s*\|/.test(lines[i]) && !/^#{1,3}\s/.test(lines[i])) i++;
  const start = i;
  while (i < lines.length && /^\s*\|/.test(lines[i])) i++;
  return lines.slice(start, i).join("\n");
}

/* ─── 메인 ──────────────────────────────────────────────────────────── */

const files = fs
  .readdirSync(DOCS_DIR)
  .filter((f) => f.endsWith(".mdx"))
  .sort();

const results = {
  written: [],
  fresh: [],
  stale: [],
  skipped: [],
  orphan: [],
  noProps: [],
  missingJsDoc: [],
};

for (const file of files) {
  const mdxPath = path.join(DOCS_DIR, file);
  const text = fs.readFileSync(mdxPath, "utf8");
  const title = frontmatterTitle(text);

  if (!title || baseline.skip?.[file]) {
    results.skipped.push({ file, reason: baseline.skip?.[file] ?? "title 없음" });
    continue;
  }
  const srcPath = path.join(REACT_SRC, `${title}.tsx`);
  if (!fs.existsSync(srcPath)) {
    // baseline.skip 에 없는데 react 소스가 없는 mdx = orphan (제거/리네임된 컴포넌트 페이지가 잔존).
    // 의도적 비-컴포넌트 페이지(overview·gallery·icons·brand-coverage 등)나 html 전용 컴포넌트는
    // scripts/component-docs-baseline.json 의 skip 에 등재한다(위 286 줄에서 먼저 걸러짐).
    results.orphan.push({ file, title });
    continue;
  }

  const sourceFile = ts.createSourceFile(
    srcPath,
    fs.readFileSync(srcPath, "utf8"),
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
  );
  const extracted = extractProps(sourceFile, title);
  if (!extracted || extracted.props.length === 0) {
    results.noProps.push({ file, title });
    continue;
  }

  const missing = extracted.props.filter((p) => !p.description);
  if (missing.length) {
    results.missingJsDoc.push({ file, title, props: missing.map((p) => p.name) });
  }

  const block = renderBlock(extracted.props);

  if (MODE === "report") {
    const existing = extractExistingTable(text).trim();
    const generated = renderPropsTable(extracted.props).trim();
    const existingRows = (existing.match(/^\s*\|/gm) || []).length;
    results.fresh.push({
      file,
      title,
      props: extracted.props.length,
      missingJsDoc: missing.length,
      existingRows: Math.max(0, existingRows - 2),
      hasMarkers: text.includes(MARK_START),
      identical: existing === generated,
    });
    continue;
  }

  let injected = injectPropsBlock(text, block);
  if (!injected.injected) {
    // `## Props` 헤딩이 없는 compound 문서(Modal/Select/Input 등 — 가장 API 가 큰 컴포넌트들).
    // 파일 끝에 Props 참조 섹션을 덧붙인다(사람이 쓴 prose 는 보존, 표만 추가).
    injected = { text: `${text.trimEnd()}\n\n---\n\n## Props\n\n${block}\n`, injected: true };
  }

  if (MODE === "check") {
    if (injected.text !== text) results.stale.push({ file, title });
    else results.fresh.push({ file, title });
  } else {
    if (injected.text !== text) {
      fs.writeFileSync(mdxPath, injected.text, "utf8");
      results.written.push({ file, title });
    } else {
      results.fresh.push({ file, title });
    }
  }
}

/* ─── 출력 ──────────────────────────────────────────────────────────── */

if (MODE === "report") {
  const rows = results.fresh;
  const identical = rows.filter((r) => r.identical).length;
  const withMarkers = rows.filter((r) => r.hasMarkers).length;
  console.log(`\n[component-docs] 리포트 — Props 추출 가능 ${rows.length}개\n`);
  console.log(
    `  이미 마커 적용: ${withMarkers} · 생성=기존 동일: ${identical} · 새로 정규화될 표: ${rows.length - identical}`,
  );
  const totalMissing = results.missingJsDoc.reduce((a, r) => a + r.props.length, 0);
  console.log(`  JSDoc 누락 prop: ${totalMissing}개 (${results.missingJsDoc.length}개 컴포넌트)\n`);
  console.log("  컴포넌트 | props | JSDoc누락 | 기존표행 | 동일");
  for (const r of rows) {
    console.log(
      `   ${r.title.padEnd(22)} ${String(r.props).padStart(3)}     ${String(r.missingJsDoc).padStart(3)}      ${String(r.existingRows).padStart(3)}     ${r.identical ? "✓" : "·"}`,
    );
  }
  console.log(`\n  스킵 ${results.skipped.length} · Props 섹션 없음 ${results.noProps.length}`);
  process.exit(0);
}

if (MODE === "check") {
  if (results.orphan.length) {
    console.error(
      `[component-docs] ✗ ${results.orphan.length}개 orphan mdx — react 소스가 없습니다(제거/리네임된 컴포넌트 페이지가 잔존). ` +
        `삭제하거나, 의도적 비-컴포넌트 페이지면 scripts/component-docs-baseline.json 의 skip 에 등재하세요:`,
    );
    for (const o of results.orphan)
      console.error(`    - docs/components/${o.file} (title: ${o.title})`);
    process.exit(1);
  }
  if (results.stale.length) {
    console.error(
      `[component-docs] ✗ ${results.stale.length}개 mdx 의 Props 표가 stale — ` +
        `\`pnpm generate:component-docs\` 로 재생성해 커밋하세요:`,
    );
    for (const s of results.stale) console.error(`    - docs/components/${s.file} (${s.title})`);
    process.exit(1);
  }
  console.log(
    `[component-docs] ✓ Props 표 fresh (${results.fresh.length}개 · 스킵 ${results.skipped.length} · orphan 0 · 미적용 ${results.noProps.length})`,
  );
} else {
  console.log(
    `[component-docs] 주입 ${results.written.length} · 이미최신 ${results.fresh.length} · ` +
      `스킵 ${results.skipped.length} · Props섹션없음 ${results.noProps.length}`,
  );
  if (results.written.length) {
    for (const w of results.written) console.log(`    ✎ docs/components/${w.file}`);
  }
  if (results.orphan.length) {
    console.warn(
      `\n[component-docs] ⚠ orphan mdx ${results.orphan.length}개 — react 소스 없음(제거/리네임된 페이지). 삭제 또는 scripts/component-docs-baseline.json 의 skip 등재 필요:`,
    );
    for (const o of results.orphan) console.warn(`    - docs/components/${o.file} (${o.title})`);
  }
}

if (results.missingJsDoc.length && MODE !== "check") {
  const total = results.missingJsDoc.reduce((a, r) => a + r.props.length, 0);
  console.warn(
    `\n[component-docs] ⚠ JSDoc 설명 없는 prop ${total}개 — 소스에 /** … */ 를 채우면 표 설명이 채워집니다:`,
  );
  for (const m of results.missingJsDoc.slice(0, 12)) {
    console.warn(`    ${m.title}: ${m.props.join(", ")}`);
  }
  if (results.missingJsDoc.length > 12) {
    console.warn(`    … 외 ${results.missingJsDoc.length - 12}개 컴포넌트`);
  }
}
