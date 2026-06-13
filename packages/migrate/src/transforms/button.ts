/**
 * button.ts — jscodeshift transform: 네이티브 `<button>` → `<Button>`.
 *
 * 보수적: className 이 문자열 리터럴이고 인식된 DS 클래스를 포함할 때만 변환.
 * 표현식({cx(...)})·미인식은 건드리지 않음(사람/LLM 몫). 변경 있으면 import 주입.
 */
import type { API, FileInfo, JSXAttribute, Options } from "jscodeshift";
import { DS_SOURCE, ensureNamedImport, stringClassList } from "./_shared.js";

export const parser = "tsx";

const CLASS_TO_VARIANT: Record<string, string> = {
  "btn-primary": "solid",
  "btn-secondary": "soft",
  "btn-outline": "outlined",
  "btn-outlined": "outlined",
  "btn-ghost": "outlined",
};

export default function transform(file: FileInfo, api: API, _options: Options): string | undefined {
  const j = api.jscodeshift;
  const root = j(file.source);
  let changed = false;

  root.findJSXElements("button").forEach((path) => {
    const opening = path.node.openingElement;
    const attrs = (opening.attributes ?? []) as JSXAttribute[];

    const cls = stringClassList(attrs);
    if (!cls) return;
    const hit = cls.classes.find((c) => c in CLASS_TO_VARIANT);
    if (!hit) return;

    const variant = CLASS_TO_VARIANT[hit];
    const remaining = cls.classes.filter((c) => c !== hit);

    opening.name = j.jsxIdentifier("Button");
    if (path.node.closingElement) path.node.closingElement.name = j.jsxIdentifier("Button");

    const others = attrs.filter((a) => a !== cls.attr);
    const next: JSXAttribute[] = [
      j.jsxAttribute(j.jsxIdentifier("variant"), j.stringLiteral(variant)),
      ...others,
    ];
    if (remaining.length) {
      next.push(j.jsxAttribute(j.jsxIdentifier("className"), j.stringLiteral(remaining.join(" "))));
    }
    opening.attributes = next;
    changed = true;
  });

  if (!changed) return undefined;
  ensureNamedImport(j, root, DS_SOURCE, "Button");
  return root.toSource({ quote: "double" });
}
