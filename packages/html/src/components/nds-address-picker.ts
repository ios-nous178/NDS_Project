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
 *
 * ⚠️ 렌더 전략(중요): 검색 input·상세 input 은 _mount 에서 **한 번만 생성**하고 update 에서는
 *   값/노출만 패치한다. update 마다 input 을 다시 만들면(replaceChildren) 키 입력 1번마다
 *   input 이 교체돼 **포커스/커서가 유실**된다("한 글자마다 끊김" 회귀). 결과 리스트처럼 포커스를
 *   안 가진 영역만 내부를 다시 그린다.
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";
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
    return [...COMPONENT_ATTRS["nds-address-picker"].observedAttributes, "label", "empty-message", "helper-text", ...FORWARDED_ATTRS];
  }

  /* 영속 노드 — _mount 에서 한 번만 만들고 update 에서 패치만 한다(input 재생성 금지). */
  private _root: HTMLDivElement | null = null;
  private _label: HTMLLabelElement | null = null;
  private _queryInput: HTMLInputElement | null = null;
  private _searchButton: HTMLElement | null = null;
  private _resultWrap: HTMLDivElement | null = null;
  private _detailWrap: HTMLDivElement | null = null;
  private _detailStrong: HTMLElement | null = null;
  private _detailPostal: HTMLSpanElement | null = null;
  private _detailInput: HTMLInputElement | null = null;
  private _helper: HTMLParagraphElement | null = null;

  private _inputId = "";
  private _hasSearched = false;
  /** 상세 input change 핸들러가 현재 선택 주소를 읽기 위한 캐시(영속 핸들러라 매 입력마다 최신값 필요). */
  private _currentValue: AddressValue | null = null;

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

    // 라벨 — 항상 만들고 update 에서 표시/숨김.
    const label = document.createElement("label");
    label.htmlFor = this._inputId;
    label.className = AS_LABEL_CLASS;
    label.hidden = true;

    // 검색 행 — input + 버튼. input 은 영속(재생성 금지).
    const row = document.createElement("div");
    row.className = AS_FIELD_ROW_CLASS;

    const input = document.createElement("input");
    input.id = this._inputId;
    input.className = AS_INPUT_CLASS;
    input.placeholder = "도로명 또는 지번 주소";
    input.addEventListener("input", (e) => this._onQueryInput(e));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this._triggerSearch();
      }
    });

    // 검색 버튼은 DS Button 을 합성 (react 의 <Button color="neutral" size="field"> 미러).
    // neutral = 5개 브랜드 공통 정의(캐포비 Figma 는 secondary tone 없음 → 회색/검정 CTA 는 neutral).
    const button = document.createElement("nds-button");
    button.setAttribute("type", "button");
    button.setAttribute("color", "neutral");
    button.setAttribute("size", "field");
    button.addEventListener("click", () => this._triggerSearch());

    row.append(input, button);

    // 결과 영역 — 컨테이너는 영속, 내부 리스트만 update 에서 다시 그린다(포커스 무관 영역).
    const resultWrap = document.createElement("div");
    resultWrap.className = AS_RESULT_CLASS;
    resultWrap.hidden = true;

    // 상세 영역 — 컨테이너/상세 input 영속(상세 입력도 글자마다 안 끊기게).
    const detailWrap = document.createElement("div");
    detailWrap.className = AS_DETAIL_CLASS;
    detailWrap.dataset.slot = "detail";
    detailWrap.hidden = true;

    const detailStrong = document.createElement("strong");
    const detailPostal = document.createElement("span");
    detailPostal.hidden = true;

    const detailInput = document.createElement("input");
    detailInput.placeholder = "상세 주소 (동/호수)";
    detailInput.addEventListener("input", (e) => {
      if (!this._currentValue) return;
      this._writeValue({
        address: this._currentValue.address,
        detail: (e.target as HTMLInputElement).value,
      });
    });

    detailWrap.append(detailStrong, detailPostal, detailInput);

    const helper = document.createElement("p");
    helper.className = AS_HELPER_CLASS;
    helper.hidden = true;

    root.append(label, row, resultWrap, detailWrap, helper);
    this.replaceChildren(root);

    this._root = root;
    this._label = label;
    this._queryInput = input;
    this._searchButton = button;
    this._resultWrap = resultWrap;
    this._detailWrap = detailWrap;
    this._detailStrong = detailStrong;
    this._detailPostal = detailPostal;
    this._detailInput = detailInput;
    this._helper = helper;
  }

  protected update(): void {
    if (
      !this._root ||
      !this._label ||
      !this._queryInput ||
      !this._searchButton ||
      !this._resultWrap ||
      !this._detailWrap ||
      !this._detailStrong ||
      !this._detailPostal ||
      !this._detailInput ||
      !this._helper
    )
      return;
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
    this._currentValue = value;

    // 라벨
    const labelText = this.getAttribute("label");
    if (labelText) {
      this._label.textContent = labelText;
      this._label.hidden = false;
    } else {
      this._label.hidden = true;
    }

    // 검색 input — 값은 **다를 때만** 세팅해 커서/포커스 보존(타이핑 중 클로버 금지).
    const query = this.attr("query", "");
    if (this._queryInput.value !== query) this._queryInput.value = query;
    this._queryInput.dataset.error = error ? "true" : "false";

    // 검색 버튼
    this._searchButton.textContent = loading ? "검색 중..." : this.attr("search-label", "검색");
    if (loading) this._searchButton.setAttribute("disabled", "");
    else this._searchButton.removeAttribute("disabled");

    // 결과 — 컨테이너 영속, 내부만 다시 그린다.
    if (this._hasSearched) {
      this._resultWrap.hidden = false;
      this._renderResults(results, loading);
    } else {
      this._resultWrap.hidden = true;
    }

    // 상세 — 컨테이너/상세 input 영속, 텍스트와 값만 패치.
    if (value) {
      this._detailWrap.hidden = false;
      this._detailStrong.textContent = value.address.roadAddress;
      if (value.address.postalCode) {
        this._detailPostal.textContent = `우편번호 ${value.address.postalCode}`;
        this._detailPostal.hidden = false;
      } else {
        this._detailPostal.hidden = true;
      }
      if (this._detailInput.value !== value.detail) this._detailInput.value = value.detail;
    } else {
      this._detailWrap.hidden = true;
    }

    // 헬퍼
    const helper = this.getAttribute("helper-text");
    if (helper) {
      this._helper.textContent = helper;
      this._helper.dataset.error = error ? "true" : "false";
      this._helper.hidden = false;
    } else {
      this._helper.hidden = true;
    }
  }

  /** 결과 리스트(또는 빈 메시지)를 영속 resultWrap 안에 다시 그린다 — 포커스 가진 노드가 없는 영역. */
  private _renderResults(results: AddressResult[], loading: boolean): void {
    const wrap = this._resultWrap;
    if (!wrap) return;
    wrap.dataset.empty = results.length === 0 ? "true" : "false";

    if (results.length === 0 && !loading) {
      const div = document.createElement("div");
      div.textContent = this.attr("empty-message", "검색 결과가 없어요");
      wrap.replaceChildren(div);
      return;
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
    wrap.replaceChildren(ul);
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
