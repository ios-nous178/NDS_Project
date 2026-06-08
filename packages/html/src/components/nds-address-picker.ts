/**
 * <nds-address-picker> — DS AddressPicker 의 vanilla Web Component 버전.
 *
 * Attributes:
 *   query          현재 검색어
 *   results        JSON [{ roadAddress, jibunAddress?, postalCode?, meta? }]
 *   value          JSON { address: {...}, detail: "동/호수" } — 선택된 결과
 *   label          상단 라벨
 *   search-label   버튼 텍스트 (기본 "검색")
 *   empty-message  결과 0 일 때 메시지 (기본 "검색 결과가 없어요")
 *   loading        boolean
 *   helper-text    헬퍼 텍스트
 *   error          boolean
 *
 * 이벤트:
 *   address-query   (detail: { query })  — 입력 변경
 *   address-search  (detail: { query })  — 검색 트리거 (버튼/Enter)
 *   address-change  (detail: { value })  — 결과 선택 / 상세 주소 입력
 */

import { NdsElement, define } from "../base/nds-element.js";
import "./nds-button.js";

const AS_CLASS = "nds-address-picker";
const AS_LABEL_CLASS = `${AS_CLASS}__label`;
const AS_FIELD_ROW_CLASS = `${AS_CLASS}__field-row`;
const AS_INPUT_CLASS = `${AS_CLASS}__input`;
const AS_RESULT_CLASS = `${AS_CLASS}__result`;
const AS_RESULT_LIST_CLASS = `${AS_CLASS}__result-list`;
const AS_RESULT_ITEM_CLASS = `${AS_CLASS}__result-item`;
const AS_DETAIL_CLASS = `${AS_CLASS}__detail`;
const AS_HELPER_CLASS = `${AS_CLASS}__helper`;

let nextAddressId = 0;

interface AddressResult {
  roadAddress: string;
  jibunAddress?: string;
  postalCode?: string;
  meta?: string;
}

interface AddressValue {
  address: AddressResult;
  detail: string;
}

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby"] as const;

export class NdsAddressPicker extends NdsElement {
  static elementName = "nds-address-picker";

  static get observedAttributes(): readonly string[] {
    return [
      "query",
      "results",
      "value",
      "label",
      "search-label",
      "empty-message",
      "loading",
      "helper-text",
      "error",
      ...FORWARDED_ATTRS,
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _inputId = "";
  private _hasSearched = false;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (name === "results" && newValue !== oldValue) {
      this._hasSearched = true;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  private _mount(): void {
    this._inputId = `nds-address-${++nextAddressId}`;
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = AS_CLASS;
    this.replaceChildren(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    const error = this.boolAttr("error");
    const loading = this.boolAttr("loading");
    const results = this._readResults();
    const value = this._readValue();

    const children: Node[] = [];
    const label = this.getAttribute("label");
    if (label) children.push(this._createLabel(label));
    children.push(this._createFieldRow(error, loading));
    if (this._hasSearched) children.push(this._createResultBlock(results, loading));
    if (value) children.push(this._createDetail(value));
    const helper = this.getAttribute("helper-text");
    if (helper) children.push(this._createHelper(helper, error));

    this._root.replaceChildren(...children);
  }

  private _createLabel(text: string): HTMLLabelElement {
    const label = document.createElement("label");
    label.htmlFor = this._inputId;
    label.className = AS_LABEL_CLASS;
    label.textContent = text;
    return label;
  }

  private _createFieldRow(error: boolean, loading: boolean): HTMLDivElement {
    const row = document.createElement("div");
    row.className = AS_FIELD_ROW_CLASS;

    const input = document.createElement("input");
    input.id = this._inputId;
    input.className = AS_INPUT_CLASS;
    input.placeholder = "도로명 또는 지번 주소";
    input.value = this.attr("query", "");
    input.dataset.error = error ? "true" : "false";
    input.addEventListener("input", (e) => this._onQueryInput(e));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this._triggerSearch();
      }
    });

    // 검색 버튼은 DS Button 을 합성 (react 의 <Button color="secondary" size="field"> 미러).
    const button = document.createElement("nds-button");
    button.setAttribute("type", "button");
    button.setAttribute("color", "secondary");
    button.setAttribute("size", "field");
    button.textContent = loading ? "검색 중..." : this.attr("search-label", "검색");
    if (loading) button.setAttribute("disabled", "");
    button.addEventListener("click", () => this._triggerSearch());

    row.append(input, button);
    return row;
  }

  private _createResultBlock(results: AddressResult[], loading: boolean): HTMLDivElement {
    const wrap = document.createElement("div");
    wrap.className = AS_RESULT_CLASS;
    wrap.dataset.empty = results.length === 0 ? "true" : "false";

    if (results.length === 0 && !loading) {
      const div = document.createElement("div");
      div.textContent = this.attr("empty-message", "검색 결과가 없어요");
      wrap.appendChild(div);
      return wrap;
    }

    const ul = document.createElement("ul");
    ul.className = AS_RESULT_LIST_CLASS;
    for (const result of results) {
      const li = document.createElement("li");
      li.className = AS_RESULT_ITEM_CLASS;
      li.addEventListener("click", () => this._selectResult(result));

      const strong = document.createElement("strong");
      strong.textContent = result.roadAddress;
      li.appendChild(strong);

      if (result.jibunAddress) {
        const span = document.createElement("span");
        span.textContent = `지번: ${result.jibunAddress}`;
        li.appendChild(span);
      }
      if (result.postalCode) {
        const span = document.createElement("span");
        span.textContent = `우편번호: ${result.postalCode}`;
        li.appendChild(span);
      }
      ul.appendChild(li);
    }
    wrap.appendChild(ul);
    return wrap;
  }

  private _createDetail(value: AddressValue): HTMLDivElement {
    const wrap = document.createElement("div");
    wrap.className = AS_DETAIL_CLASS;
    wrap.dataset.slot = "detail";

    const strong = document.createElement("strong");
    strong.textContent = value.address.roadAddress;
    wrap.appendChild(strong);

    if (value.address.postalCode) {
      const span = document.createElement("span");
      span.textContent = `우편번호 ${value.address.postalCode}`;
      wrap.appendChild(span);
    }

    const input = document.createElement("input");
    input.placeholder = "상세 주소 (동/호수)";
    input.value = value.detail;
    input.addEventListener("input", (e) => {
      const next: AddressValue = {
        address: value.address,
        detail: (e.target as HTMLInputElement).value,
      };
      this._writeValue(next);
    });
    wrap.appendChild(input);
    return wrap;
  }

  private _createHelper(text: string, error: boolean): HTMLParagraphElement {
    const p = document.createElement("p");
    p.className = AS_HELPER_CLASS;
    p.dataset.error = error ? "true" : "false";
    p.textContent = text;
    return p;
  }

  private _onQueryInput(e: Event): void {
    const next = (e.target as HTMLInputElement).value;
    this.setAttribute("query", next);
    this.dispatchEvent(
      new CustomEvent("address-query", {
        detail: { query: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _triggerSearch(): void {
    this._hasSearched = true;
    this.scheduleUpdate();
    this.dispatchEvent(
      new CustomEvent("address-search", {
        detail: { query: this.attr("query", "") },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _selectResult(result: AddressResult): void {
    const previous = this._readValue();
    const next: AddressValue = { address: result, detail: previous?.detail ?? "" };
    this._writeValue(next);
  }

  private _writeValue(value: AddressValue): void {
    this.setAttribute("value", JSON.stringify(value));
    this.dispatchEvent(
      new CustomEvent("address-change", {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _readResults(): AddressResult[] {
    const attr = this.getAttribute("results");
    if (!attr || !attr.trim()) return [];
    try {
      const parsed = JSON.parse(attr) as Array<Record<string, unknown>>;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((raw) => ({
          roadAddress: typeof raw.roadAddress === "string" ? raw.roadAddress : "",
          jibunAddress: typeof raw.jibunAddress === "string" ? raw.jibunAddress : undefined,
          postalCode: typeof raw.postalCode === "string" ? raw.postalCode : undefined,
          meta: typeof raw.meta === "string" ? raw.meta : undefined,
        }))
        .filter((r) => r.roadAddress);
    } catch {
      return [];
    }
  }

  private _readValue(): AddressValue | null {
    const attr = this.getAttribute("value");
    if (!attr || !attr.trim()) return null;
    try {
      const parsed = JSON.parse(attr) as Record<string, unknown>;
      const address = parsed.address as Record<string, unknown> | undefined;
      if (!address || typeof address.roadAddress !== "string") return null;
      return {
        address: {
          roadAddress: address.roadAddress,
          jibunAddress: typeof address.jibunAddress === "string" ? address.jibunAddress : undefined,
          postalCode: typeof address.postalCode === "string" ? address.postalCode : undefined,
          meta: typeof address.meta === "string" ? address.meta : undefined,
        },
        detail: typeof parsed.detail === "string" ? parsed.detail : "",
      };
    } catch {
      return null;
    }
  }
}

define(NdsAddressPicker);
