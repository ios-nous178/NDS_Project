/**
 * textarea.ts — jscodeshift transform: 네이티브 `<textarea>` → `<Textarea>`.
 *
 * Textarea 는 native textarea 속성을 통과시킨다(Omit<…,"children">)라 attr·onChange 시그니처 보존이 안전.
 * 보수적: **자식(텍스트/요소)이 있으면 skip** — Textarea 는 children 을 받지 않음(value/defaultValue 사용).
 */
import type { API, FileInfo, Options } from "jscodeshift";
import { DS_SOURCE, ensureNamedImport } from "./_shared.js";

export const parser = "tsx";

export default function transform(file: FileInfo, api: API, _options: Options): string | undefined {
  const j = api.jscodeshift;
  const root = j(file.source);
  let changed = false;

  root.findJSXElements("textarea").forEach((path) => {
    // 비어있지 않은 자식이 있으면 skip (Textarea 는 children 미지원)
    const hasContent = (path.node.children ?? []).some((c) => {
      if (c.type === "JSXText") return c.value.trim().length > 0;
      return c.type === "JSXElement" || c.type === "JSXExpressionContainer" || c.type === "JSXFragment";
    });
    if (hasContent) return;

    const opening = path.node.openingElement;
    opening.name = j.jsxIdentifier("Textarea");
    if (path.node.closingElement) path.node.closingElement.name = j.jsxIdentifier("Textarea");
    changed = true;
  });

  if (!changed) return undefined;
  ensureNamedImport(j, root, DS_SOURCE, "Textarea");
  return root.toSource({ quote: "double" });
}
