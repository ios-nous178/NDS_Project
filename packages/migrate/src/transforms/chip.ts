/**
 * chip.ts — jscodeshift transform: `<span className="chip">Tag</span>` → `<Chip label="Tag" />`.
 *
 * Chip 은 children 이 아니라 **label: string** prop 을 쓴다(흔한 함정). 그래서 단일 텍스트 자식을
 * label 로 끌어올린다.
 * 보수적: className 문자열 리터럴 + "chip" 베이스 + **자식이 단일 텍스트 노드**일 때만.
 *   자식이 표현식({name})·요소·복수면 skip(라벨을 안전하게 못 만듦).
 */
import type { API, FileInfo, JSXAttribute, Options } from "jscodeshift";
import { DS_SOURCE, ensureNamedImport, stringClassList } from "./_shared.js";

export const parser = "tsx";

export default function transform(file: FileInfo, api: API, _options: Options): string | undefined {
  const j = api.jscodeshift;
  const root = j(file.source);
  let changed = false;

  root.findJSXElements("span").forEach((path) => {
    const opening = path.node.openingElement;
    const attrs = (opening.attributes ?? []) as JSXAttribute[];

    const cls = stringClassList(attrs);
    if (!cls || !cls.classes.includes("chip")) return;

    // 자식: 공백 제거 후 정확히 하나의 텍스트 노드여야 함
    const kids = (path.node.children ?? []).filter((c) => {
      if (c.type === "JSXText") return c.value.trim().length > 0;
      return true;
    });
    if (kids.length !== 1 || kids[0].type !== "JSXText") return;
    const label = String(kids[0].value).trim();
    if (!label) return;

    const remaining = cls.classes.filter((c) => c !== "chip");
    const others = attrs.filter((a) => a !== cls.attr);

    opening.name = j.jsxIdentifier("Chip");
    opening.selfClosing = true;
    path.node.children = [];
    path.node.closingElement = null;

    const next: JSXAttribute[] = [
      j.jsxAttribute(j.jsxIdentifier("label"), j.stringLiteral(label)),
      ...others,
    ];
    if (remaining.length) {
      next.push(j.jsxAttribute(j.jsxIdentifier("className"), j.stringLiteral(remaining.join(" "))));
    }
    opening.attributes = next;
    changed = true;
  });

  if (!changed) return undefined;
  ensureNamedImport(j, root, DS_SOURCE, "Chip");
  return root.toSource({ quote: "double" });
}
