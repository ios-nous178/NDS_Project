import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import jscodeshift from "jscodeshift";
import transform, { parser } from "./button.js";

const dir = dirname(fileURLToPath(import.meta.url));
const fixture = (f: string) => readFileSync(join(dir, "__testfixtures__", f), "utf8");

function run(src: string): string | undefined {
  const j = jscodeshift.withParser(parser);
  const api = { jscodeshift: j, j, stats: () => {}, report: () => {} };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return transform({ path: "test.tsx", source: src }, api as any, {});
}

describe("button transform", () => {
  it("인식된 className 만 Button 으로 교체 + import 주입 (fixture)", () => {
    const out = run(fixture("button.input.tsx"));
    expect(out?.trim()).toBe(fixture("button.output.tsx").trim());
  });

  it("변경 대상 없으면 undefined — 파일을 건드리지 않는다", () => {
    expect(run(`export const X = () => <button className="plain">x</button>;`)).toBeUndefined();
  });

  it("표현식 className({cx})은 보수적으로 skip", () => {
    expect(run(`export const X = () => <button className={cx("btn-primary")}>x</button>;`)).toBeUndefined();
  });
});
