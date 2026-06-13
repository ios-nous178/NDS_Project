/**
 * _shared.ts — transform 공용 헬퍼 (import 주입 · className 파싱).
 */
import type { API, JSXAttribute } from "jscodeshift";

type J = API["jscodeshift"];
type Root = ReturnType<API["jscodeshift"]>;

export const DS_SOURCE = "@nudge-design/react";

/** className 속성이 **문자열 리터럴**이면 클래스 배열, 아니면 null(표현식 등은 보수적 skip). */
export function stringClassList(attrs: JSXAttribute[]): { attr: JSXAttribute; classes: string[] } | null {
  const attr = attrs.find(
    (a) => a.type === "JSXAttribute" && a.name.name === "className",
  ) as JSXAttribute | undefined;
  if (!attr || !attr.value || attr.value.type !== "StringLiteral") return null;
  return { attr, classes: String(attr.value.value).split(/\s+/).filter(Boolean) };
}

/** `import { name } from source` 보장 — 기존 import 에 추가하거나 새 import 를 맨 위에 삽입. */
export function ensureNamedImport(j: J, root: Root, source: string, name: string): void {
  const existing = root.find(j.ImportDeclaration, { source: { value: source } });
  if (existing.size() > 0) {
    const decl = existing.paths()[0].node;
    const specs = decl.specifiers ?? [];
    const has = specs.some((s) => s.type === "ImportSpecifier" && s.imported.name === name);
    if (!has) {
      specs.push(j.importSpecifier(j.identifier(name)));
      decl.specifiers = specs;
    }
    return;
  }
  const decl = j.importDeclaration([j.importSpecifier(j.identifier(name))], j.stringLiteral(source));
  root.get().node.program.body.unshift(decl);
}
