#!/usr/bin/env node
/**
 * nds-button 이 만드는 DOM 이 React Button 의 DOM 과 정확히 같은지 검사.
 *
 *   node test-fixture/check-dom-equality.mjs
 *
 * 외부 의존성 0 — jsdom 없이 packages/react/node_modules/jsdom 을 빌려 쓴다.
 * (devDependency: react 의 vitest 가 이미 jsdom 깔아둠.)
 *
 * 검사 항목:
 *   1. host element (<nds-button>) 안 inner <button> 의 className / dataset
 *   2. 인라인 CSS 변수 키와 값 일치
 *   3. <span class="nds-button__label"> 구조 일치
 */

import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// react 패키지가 의존성으로 갖고 있는 jsdom 재활용
const reactPkgPath = path.resolve(__dirname, "../../react/node_modules/jsdom");
const { JSDOM } = require(reactPkgPath);

const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, {
  runScripts: "dangerously",
  pretendToBeVisual: true,
});
const { window } = dom;

// Web Component 등록 — 빌드 결과를 import
globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLElement = window.HTMLElement;
globalThis.HTMLButtonElement = window.HTMLButtonElement;
globalThis.customElements = window.customElements;
globalThis.queueMicrotask = window.queueMicrotask || queueMicrotask;

await import("../dist/runtime.js");

const TEST_CASES = [
  { color: "primary", variant: "solid", size: "lg", label: "예약하기" },
  { color: "primary", variant: "outlined", size: "md", label: "outlined md" },
  { color: "secondary", variant: "solid", size: "xl", label: "secondary xl" },
  { color: "neutral", variant: "soft", size: "sm", label: "neutral soft sm" },
];

let failures = 0;
const failed = [];

for (const tc of TEST_CASES) {
  const el = document.createElement("nds-button");
  el.setAttribute("color", tc.color);
  el.setAttribute("variant", tc.variant);
  el.setAttribute("size", tc.size);
  el.textContent = tc.label;
  document.body.appendChild(el);

  // microtask flush
  await new Promise((r) => setTimeout(r, 0));

  const inner = el.querySelector("button");
  const label = el.querySelector(".nds-button__label");

  const errors = [];

  if (!inner) {
    errors.push("inner <button> missing");
  } else {
    if (!inner.classList.contains("nds-button")) errors.push("missing class nds-button");
    if (inner.dataset.slot !== "root")
      errors.push(`data-slot expected root, got ${inner.dataset.slot}`);
    if (inner.dataset.variant !== tc.variant)
      errors.push(`data-variant mismatch: ${inner.dataset.variant}`);
    if (inner.dataset.size !== tc.size) errors.push(`data-size mismatch: ${inner.dataset.size}`);
    if (inner.dataset.color !== tc.color)
      errors.push(`data-color mismatch: ${inner.dataset.color}`);

    // 인라인 CSS 변수 14개 모두 있어야 함 (Button.tsx 와 1:1)
    const expectedVars = [
      "--nds-button-height",
      "--nds-button-padding-x",
      "--nds-button-gap",
      "--nds-button-font-size",
      "--nds-button-line-height",
      "--nds-button-icon-size",
      "--nds-button-font-weight",
      "--nds-button-width",
      "--nds-button-background",
      "--nds-button-text-color",
      "--nds-button-border-color",
      "--nds-button-hover-background",
      "--nds-button-hover-text-color",
      "--nds-button-hover-border-color",
    ];
    for (const k of expectedVars) {
      if (!inner.style.getPropertyValue(k)) errors.push(`missing CSS var ${k}`);
    }
  }

  if (!label) {
    errors.push(".nds-button__label missing");
  } else {
    if (label.textContent !== tc.label) errors.push(`label text mismatch: ${label.textContent}`);
    if (label.dataset.slot !== "label")
      errors.push(`label data-slot mismatch: ${label.dataset.slot}`);
  }

  // host element 자체는 display:contents 여야 함 (layout 영향 0)
  if (el.style.display !== "contents")
    errors.push(`host display expected contents, got ${el.style.display}`);

  // host 에는 .nds-button 클래스가 박히면 안 됨 (CSS 룰이 두 번 매칭됨)
  if (el.classList.contains("nds-button")) errors.push("host should NOT carry .nds-button class");

  if (errors.length === 0) {
    console.log(`✓ ${tc.color}/${tc.variant}/${tc.size}`);
  } else {
    failures++;
    failed.push({ tc, errors });
    console.log(`✗ ${tc.color}/${tc.variant}/${tc.size}`);
    for (const err of errors) console.log(`    · ${err}`);
  }

  el.remove();
}

// disabled state 분기 검사
{
  const el = document.createElement("nds-button");
  el.setAttribute("color", "primary");
  el.setAttribute("variant", "solid");
  el.setAttribute("size", "lg");
  el.setAttribute("disabled", "");
  el.textContent = "off";
  document.body.appendChild(el);
  await new Promise((r) => setTimeout(r, 0));
  const inner = el.querySelector("button");
  const errors = [];
  if (!inner.disabled) errors.push("inner.disabled not set");
  // disabled state 가 적용되면 bg 가 enabled 와 달라야 함
  const bg = inner.style.getPropertyValue("--nds-button-background");
  if (bg.includes("project-default")) errors.push(`disabled bg should not be project: ${bg}`);
  if (errors.length === 0) console.log("✓ disabled state");
  else {
    failures++;
    failed.push({ tc: { name: "disabled" }, errors });
    console.log("✗ disabled state");
    for (const err of errors) console.log(`    · ${err}`);
  }
  el.remove();
}

// dynamic attribute 변경 후 re-render 검사
{
  const el = document.createElement("nds-button");
  el.setAttribute("color", "primary");
  el.setAttribute("variant", "solid");
  el.setAttribute("size", "lg");
  el.textContent = "dyn";
  document.body.appendChild(el);
  await new Promise((r) => setTimeout(r, 0));
  el.setAttribute("variant", "outlined");
  el.setAttribute("color", "secondary");
  await new Promise((r) => setTimeout(r, 0));
  const inner = el.querySelector("button");
  const errors = [];
  if (inner.dataset.variant !== "outlined")
    errors.push(`re-render variant: ${inner.dataset.variant}`);
  if (inner.dataset.color !== "secondary") errors.push(`re-render color: ${inner.dataset.color}`);
  if (errors.length === 0) console.log("✓ dynamic attribute reaction");
  else {
    failures++;
    failed.push({ tc: { name: "dynamic" }, errors });
    console.log("✗ dynamic attribute reaction");
    for (const err of errors) console.log(`    · ${err}`);
  }
  el.remove();
}

console.log(
  failures === 0
    ? `\nAll checks passed (${TEST_CASES.length + 2} cases).`
    : `\n${failures} case(s) failed.`,
);
process.exit(failures === 0 ? 0 : 1);
