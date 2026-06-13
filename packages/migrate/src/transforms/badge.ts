/**
 * badge.ts — jscodeshift transform: `<span className="badge badge-success">` → `<Badge color="success">`.
 *
 * 보수적: className 문자열 리터럴 + "badge" 베이스 클래스를 포함할 때만. 인식된 color 토큰을
 * color prop 으로, "badge"/color 토큰은 제거, 나머지 클래스는 className 보존. 미인식 색은 color 생략.
 */
import type { API, FileInfo, JSXAttribute, Options } from "jscodeshift";
import { DS_SOURCE, ensureNamedImport, stringClassList } from "./_shared.js";

export const parser = "tsx";

const BADGE_COLOR: Record<string, string> = {
  "badge-success": "success",
  "badge-error": "error",
  "badge-danger": "error",
  "badge-warning": "caution",
  "badge-caution": "caution",
  "badge-info": "info",
  "badge-primary": "brand",
  "badge-brand": "brand",
  "badge-neutral": "neutral",
  "badge-secondary": "neutral",
};

export default function transform(file: FileInfo, api: API, _options: Options): string | undefined {
  const j = api.jscodeshift;
  const root = j(file.source);
  let changed = false;

  root.findJSXElements("span").forEach((path) => {
    const opening = path.node.openingElement;
    const attrs = (opening.attributes ?? []) as JSXAttribute[];

    const cls = stringClassList(attrs);
    if (!cls || !cls.classes.includes("badge")) return; // "badge" 베이스 없으면 skip

    const colorClass = cls.classes.find((c) => c in BADGE_COLOR);
    const color = colorClass ? BADGE_COLOR[colorClass] : undefined;
    const remaining = cls.classes.filter((c) => c !== "badge" && c !== colorClass);

    opening.name = j.jsxIdentifier("Badge");
    if (path.node.closingElement) path.node.closingElement.name = j.jsxIdentifier("Badge");

    const others = attrs.filter((a) => a !== cls.attr);
    const next: JSXAttribute[] = [];
    if (color) next.push(j.jsxAttribute(j.jsxIdentifier("color"), j.stringLiteral(color)));
    next.push(...others);
    if (remaining.length) {
      next.push(j.jsxAttribute(j.jsxIdentifier("className"), j.stringLiteral(remaining.join(" "))));
    }
    opening.attributes = next;
    changed = true;
  });

  if (!changed) return undefined;
  ensureNamedImport(j, root, DS_SOURCE, "Badge");
  return root.toSource({ quote: "double" });
}
