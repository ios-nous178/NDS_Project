import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import jscodeshift from "jscodeshift";
import type { Transform } from "jscodeshift";
import buttonT, { parser } from "./button.js";
import inputT from "./input.js";
import badgeT from "./badge.js";
import chipT from "./chip.js";
import textareaT from "./textarea.js";

const dir = dirname(fileURLToPath(import.meta.url));
const fx = (f: string) => readFileSync(join(dir, "__testfixtures__", f), "utf8");

function run(t: Transform, src: string): string | undefined {
  const j = jscodeshift.withParser(parser);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const api = { jscodeshift: j, j, stats: () => {}, report: () => {} } as any;
  return t({ path: "t.tsx", source: src }, api, {}) as string | undefined;
}

const CASES: Array<{ name: string; t: Transform }> = [
  { name: "button", t: buttonT },
  { name: "input", t: inputT },
  { name: "badge", t: badgeT },
  { name: "chip", t: chipT },
  { name: "textarea", t: textareaT },
];

describe("transforms — fixture 회귀(input→output)", () => {
  for (const { name, t } of CASES) {
    it(`${name}`, () => {
      expect(run(t, fx(`${name}.input.tsx`))?.trim()).toBe(fx(`${name}.output.tsx`).trim());
    });
  }
});

describe("보수성 — 애매하면 건드리지 않음(undefined)", () => {
  it("button: 표현식 className skip", () =>
    expect(run(buttonT, `const X = () => <button className={cx("btn-primary")}>x</button>;`)).toBeUndefined());
  it("input: 비텍스트형(checkbox) skip", () =>
    expect(run(inputT, `const X = () => <input type="checkbox" />;`)).toBeUndefined());
  it("input: 네이티브 size 속성 skip", () =>
    expect(run(inputT, `const X = () => <input type="text" size={20} />;`)).toBeUndefined());
  it("badge: badge 베이스 없으면 skip", () =>
    expect(run(badgeT, `const X = () => <span className="label">x</span>;`)).toBeUndefined());
  it("chip: 표현식 자식 skip", () =>
    expect(run(chipT, `const X = () => <span className="chip">{name}</span>;`)).toBeUndefined());
  it("textarea: 자식(텍스트) 있으면 skip", () =>
    expect(run(textareaT, `const X = () => <textarea>hi</textarea>;`)).toBeUndefined());
});
