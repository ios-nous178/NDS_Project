/**
 * button.ts — jscodeshift transform: 네이티브 `<button>` → `@nudge-design/react` `<Button>`.
 *
 * 보수적 규칙(결정적·안전):
 *   - className 이 **문자열 리터럴**이고 인식된 DS 클래스(btn-primary 등)를 포함할 때만 변환.
 *   - className 이 식({cx(...)})·표현식이거나 인식 클래스가 없으면 **건드리지 않음**(사람/LLM 몫).
 *   - 인식 클래스 → variant 로 치환, 나머지 클래스는 className 에 보존, 다른 attr(onClick 등)·children 보존.
 *   - 변경이 1건이라도 있으면 `import { Button } from "@nudge-design/react"` 주입(중복 안 함).
 *
 * parser=tsx (아래 export). 변경 없으면 undefined 반환 → jscodeshift 가 파일을 안 건드림.
 */
import type { API, FileInfo, JSXAttribute, Options } from "jscodeshift";

export const parser = "tsx";

const DS_SOURCE = "@nudge-design/react";

/** 네이티브 버튼 유틸 클래스 → DS Button variant (solid/soft/outlined). */
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

    const classAttr = attrs.find(
      (a) => a.type === "JSXAttribute" && a.name.name === "className",
    ) as JSXAttribute | undefined;
    // 문자열 리터럴 className 만 — 표현식({cx(...)})은 보수적으로 skip
    if (!classAttr || !classAttr.value || classAttr.value.type !== "StringLiteral") return;

    const classes = String(classAttr.value.value).split(/\s+/).filter(Boolean);
    const hit = classes.find((c) => c in CLASS_TO_VARIANT);
    if (!hit) return; // 인식된 DS 클래스 없음 → skip

    const variant = CLASS_TO_VARIANT[hit];
    const remaining = classes.filter((c) => c !== hit);

    // button → Button
    opening.name = j.jsxIdentifier("Button");
    if (path.node.closingElement) path.node.closingElement.name = j.jsxIdentifier("Button");

    // variant 를 맨 앞에, 기존 className 은 제거, 나머지 클래스 있으면 className 으로 보존
    const others = attrs.filter((a) => a !== classAttr);
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

/** `import { name } from source` 보장 — 기존 import 에 추가하거나 새 import 를 맨 위에 삽입. */
function ensureNamedImport(
  j: API["jscodeshift"],
  root: ReturnType<API["jscodeshift"]>,
  source: string,
  name: string,
): void {
  const existing = root.find(j.ImportDeclaration, {
    source: { value: source },
  });

  if (existing.size() > 0) {
    const decl = existing.paths()[0].node;
    const specs = decl.specifiers ?? [];
    const has = specs.some(
      (s) => s.type === "ImportSpecifier" && s.imported.name === name,
    );
    if (!has) {
      specs.push(j.importSpecifier(j.identifier(name)));
      decl.specifiers = specs;
    }
    return;
  }

  const decl = j.importDeclaration(
    [j.importSpecifier(j.identifier(name))],
    j.stringLiteral(source),
  );
  root.get().node.program.body.unshift(decl);
}
