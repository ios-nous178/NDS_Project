/**
 * SelectedItemsPanel 룰 그룹 — html-validator.ts(오케스트레이터)에서 순수 이동(pure-move).
 * 패널 옆 helper 텍스트 sibling 배치(selected-items-helper-outside-form-field) 검사.
 */
import * as cheerio from "cheerio";
import { type DomElement, type HtmlViolation, describeElement, lineNumberAt } from "./types.js";

export function collectSelectedItemsPanelViolations(
  source: string,
  $: cheerio.CheerioAPI,
  out: HtmlViolation[],
): void {
  $("nds-selected-items-panel").each((_i, el) => {
    if (el.type !== "tag") return;
    const $panel = $(el);
    if ($panel.closest("nds-form-field, .nds-form-field__root").length > 0) return;

    const next = $panel.next().get(0) as DomElement | undefined;
    if (!next || next.type !== "tag") return;
    if (!isSelectedItemsExternalHelper(next)) return;

    const line = lineNumberAt(source, (next as unknown as { startIndex?: number }).startIndex ?? 0);
    out.push({
      rule: "selected-items-helper-outside-form-field",
      line,
      selector: describeElement(next),
      detail:
        "SelectedItemsPanel 바로 아래에 helper 텍스트가 sibling 으로 배치되어 패널과 설명이 붙어 보입니다.",
      suggestion:
        '선택 결과 패널의 안내문은 별도 <p>/<div> sibling 이 아니라 <nds-form-field density="admin" helper="시/도, 시/군/구를 검색해 노출할 지역을 추가하세요."> 안에 넣으세요. React 는 <FormField density="admin" helper="..."><SelectedItemsPanel ... /></FormField>.',
    });
  });
}

function isSelectedItemsExternalHelper(el: DomElement): boolean {
  const tag = el.tagName?.toLowerCase();
  if (!tag || !["p", "small", "span", "div"].includes(tag)) return false;

  const attrs = el.attribs ?? {};
  const marker = `${attrs.class ?? ""} ${attrs.id ?? ""} ${attrs["data-slot"] ?? ""}`.toLowerCase();
  const text = nodeText(el).replace(/\s+/g, " ").trim();
  if (text.length < 4 || text.length > 120) return false;

  if (/\b(helper|help|hint|description|desc|caption|guide)\b/.test(marker)) return true;
  return /(검색|추가|선택|입력|도움|안내|시\/도|시\/군\/구|노출할|지역)/.test(text);
}

function nodeText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { type?: string; data?: string; children?: unknown[] };
  if (n.type === "text") return n.data ?? "";
  return (n.children ?? []).map(nodeText).join("");
}
