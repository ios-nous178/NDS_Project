/**
 * input.ts — jscodeshift transform: 네이티브 `<input>`(텍스트형) → `<Input>`.
 *
 * Input 은 native input 속성을 그대로 통과시킨다(Omit<…,"size"|"prefix">)라 attr 보존이 안전.
 * 보수적:
 *   - type 이 text/email/tel/url/search/password/number 이거나 없을 때만(텍스트형).
 *     checkbox/radio/file/range/date/submit/button 등은 다른 컴포넌트(Checkbox/Radio/…) → skip.
 *   - 네이티브 `size` 속성이 있으면 skip(Input.size 는 enum 으로 의미가 다름 — 오변환 방지).
 */
import type { API, FileInfo, JSXAttribute, Options } from "jscodeshift";
import { DS_SOURCE, ensureNamedImport } from "./_shared.js";

export const parser = "tsx";

const TEXTLIKE = new Set(["text", "email", "tel", "url", "search", "password", "number"]);

export default function transform(file: FileInfo, api: API, _options: Options): string | undefined {
  const j = api.jscodeshift;
  const root = j(file.source);
  let changed = false;

  root.findJSXElements("input").forEach((path) => {
    const opening = path.node.openingElement;
    const attrs = (opening.attributes ?? []) as JSXAttribute[];

    // 네이티브 size 속성 → 의미 충돌, skip
    const hasSize = attrs.some((a) => a.type === "JSXAttribute" && a.name.name === "size");
    if (hasSize) return;

    // type 검사 (문자열 리터럴만 신뢰; 표현식 type 은 skip)
    const typeAttr = attrs.find((a) => a.type === "JSXAttribute" && a.name.name === "type") as
      | JSXAttribute
      | undefined;
    if (typeAttr) {
      if (!typeAttr.value || typeAttr.value.type !== "StringLiteral") return; // 표현식 type → skip
      if (!TEXTLIKE.has(String(typeAttr.value.value))) return; // 비텍스트형 → skip
    }
    // type 없으면 text 로 간주 → 통과

    opening.name = j.jsxIdentifier("Input");
    if (path.node.closingElement) path.node.closingElement.name = j.jsxIdentifier("Input");
    changed = true;
  });

  if (!changed) return undefined;
  ensureNamedImport(j, root, DS_SOURCE, "Input");
  return root.toSource({ quote: "double" });
}
