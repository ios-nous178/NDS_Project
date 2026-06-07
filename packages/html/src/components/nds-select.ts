/**
 * <nds-select> + <nds-select-option> — DS Select 의 vanilla Web Component 버전 (MVP).
 *
 * 사용 예:
 *   <nds-select value="kr" placeholder="선택" label="국가" helper-text="필수">
 *     <nds-select-option value="kr">대한민국</nds-select-option>
 *     <nds-select-option value="jp">일본</nds-select-option>
 *     <nds-select-option value="us" disabled>미국 (off)</nds-select-option>
 *   </nds-select>
 *
 * 폭:
 *   기본 full-width=true(트리거 100% — 폼/캐포비 기본, React fullWidth 기본과 일치).
 *   좁게 쓰려면 full-width="false"(어드민 검색 필터 등). 드롭다운 메뉴 폭은 전체너비면
 *   트리거 폭으로 고정, auto 면 가장 넓은 옵션까지 grow 후 캡(넘으면 옵션 말줄임).
 *
 * 이벤트:
 *   option 선택 → host 에 `value` attribute 설정 + "select-change" CustomEvent
 *   (detail: { value }, bubbles: true).
 *
 * 키보드:
 *   trigger focus: ArrowDown / ArrowUp / Enter / Space → open + active 이동
 *   open 상태: ArrowDown/Up = active 이동, Enter/Space = 선택, Escape = close
 *
 * MVP 제약:
 *   · Portal 없음 — dropdown 은 host 안 absolute positioning + z-index. 컨테이너 overflow:hidden
 *     안에 들어가면 잘릴 수 있음. v0.1 에서 Portal 추가.
 *   · placeholder = attribute. label/helper-text 도 attribute (자식 markup 으로 가지 않음)
 */

import { NdsElement, define } from "../base/nds-element.js";

const SELECT_CLASS = "nds-select";
const ROOT_CLASS = `${SELECT_CLASS}__root`;
const LABEL_CLASS = `${SELECT_CLASS}__label`;
const TRIGGER_CLASS = `${SELECT_CLASS}__trigger`;
const TRIGGER_TEXT_CLASS = `${SELECT_CLASS}__trigger-text`;
const CHEVRON_CLASS = `${SELECT_CLASS}__chevron`;
const DROPDOWN_CLASS = `${SELECT_CLASS}__dropdown`;
const OPTION_CLASS = `${SELECT_CLASS}__option`;
const OPTION_LABEL_CLASS = `${SELECT_CLASS}__option-label`;
const OPTION_CHECK_CLASS = `${SELECT_CLASS}__option-check`;
const SEARCH_CLASS = `${SELECT_CLASS}__search`;
const EMPTY_CLASS = `${SELECT_CLASS}__empty`;

const SEARCH_ICON_SVG =
  '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
  '<circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5"/>' +
  '<path d="M13 13l-2.5-2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
  "</svg>";

/** auto(좁은) 셀렉트에서 드롭다운이 가장 넓은 옵션까지 grow 할 때의 상한(px). React 와 동일. */
const SELECT_AUTO_MENU_MAX_WIDTH = 360;
const HELPER_CLASS = `${SELECT_CLASS}__helper`;

const OPTION_CHECK_SVG =
  '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
  '<path d="M3.5 8.5L6.5 11.5L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
  "</svg>";

let nextSelectId = 0;

export class NdsSelect extends NdsElement {
  static elementName = "nds-select";

  static get observedAttributes(): readonly string[] {
    return [
      "value",
      "placeholder",
      "label",
      "helper-text",
      "disabled",
      "error",
      "full-width",
      "open",
      "select-id",
      "searchable",
      "search-placeholder",
      "empty-message",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _label: HTMLLabelElement | null = null;
  private _trigger: HTMLButtonElement | null = null;
  private _triggerText: HTMLSpanElement | null = null;
  private _chevron: HTMLSpanElement | null = null;
  private _dropdown: HTMLDivElement | null = null;
  private _helper: HTMLSpanElement | null = null;
  // searchable(검색형, React Select.searchable / Ant showSearch 모델) 전용 노드
  private _search: HTMLDivElement | null = null;
  private _searchInput: HTMLInputElement | null = null;
  private _empty: HTMLDivElement | null = null;
  private _query = "";
  private _focusSearchOnOpen = false;
  private _childObserver: MutationObserver | null = null;
  private _selectId = "";
  private _activeValue: string | null = null;
  private _outsideClick = (e: MouseEvent) => {
    if (!this._root) return;
    // trigger 또는 dropdown 내부 클릭은 무시. dropdown 은 portal 되어 _root 밖에 있음.
    const target = e.target as Node;
    if (this._root.contains(target)) return;
    if (this._dropdown && this._dropdown.contains(target)) return;
    this._setOpen(false);
  };
  private _onKey = (e: KeyboardEvent) => this._handleKey(e);
  private _onReposition = () => this._positionDropdown();

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    this._childObserver?.disconnect();
    document.removeEventListener("click", this._outsideClick, true);
    document.removeEventListener("keydown", this._onKey, true);
    window.removeEventListener("scroll", this._onReposition, true);
    window.removeEventListener("resize", this._onReposition);
    // portal 된 dropdown 도 정리.
    if (this._dropdown && this._dropdown.parentElement === document.body) {
      this._dropdown.remove();
    }
  }

  private _mount(): void {
    this._selectId = this.attr("select-id", `nds-select-${++nextSelectId}`);

    // 자식 <nds-select-option> 들을 임시 분리 — dropdown 안으로 옮김
    const options = Array.from(this.children).filter(
      (el) => el.tagName.toLowerCase() === "nds-select-option",
    );

    const root = document.createElement("div");
    const trigger = document.createElement("button");
    const triggerText = document.createElement("span");
    const chevron = document.createElement("span");
    const dropdown = document.createElement("div");

    root.className = ROOT_CLASS;
    root.dataset.slot = "root";
    root.style.position = "relative";

    trigger.type = "button";
    trigger.className = TRIGGER_CLASS;
    trigger.dataset.slot = "trigger";
    trigger.id = this._selectId;
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.addEventListener("click", () => {
      if (this.boolAttr("disabled")) return;
      this._setOpen(!this.boolAttr("open"));
    });
    trigger.addEventListener("keydown", (e) => this._handleTriggerKey(e));

    triggerText.id = `${this._selectId}-value`;
    triggerText.className = TRIGGER_TEXT_CLASS;

    chevron.className = CHEVRON_CLASS;
    chevron.setAttribute("aria-hidden", "true");
    chevron.innerHTML =
      '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>";

    trigger.append(triggerText, chevron);

    dropdown.className = DROPDOWN_CLASS;
    dropdown.dataset.slot = "dropdown";
    dropdown.setAttribute("role", "listbox");
    // Portal: document.body 로 옮길 때 fixed positioning 으로 동작.
    // 닫혀있을 땐 display:none — 위치 계산 자체를 안 함.
    dropdown.style.position = "fixed";
    dropdown.style.zIndex = "1000";
    dropdown.style.display = "none";
    // Click delegation — 옵션 자체에 listener 박지 않고 dropdown 에서 위임.
    // portal 후 옵션의 listener 가 안 잡히는 jsdom 케이스를 피하고,
    // 동적으로 옵션을 추가하는 경우에도 자동 대응.
    dropdown.addEventListener("click", (e) => {
      const target = e.target as HTMLElement | null;
      const opt = target?.closest("nds-select-option") as HTMLElement | null;
      if (!opt || !dropdown.contains(opt)) return;
      if (opt.hasAttribute("disabled")) return;
      const value = opt.getAttribute("value") ?? "";
      this.pickValue(value);
    });
    root.append(trigger, dropdown);
    this.appendChild(root);

    this._root = root;
    this._trigger = trigger;
    this._triggerText = triggerText;
    this._chevron = chevron;
    this._dropdown = dropdown;

    // mount 시점에 이미 존재하는 옵션 입양.
    for (const opt of options) this._adoptOption(opt as HTMLElement);

    // 스트리밍 HTML 파서(목업 단일 HTML 파일)에서는 부모 <nds-select> 의 connectedCallback 이
    // 자식 <nds-select-option> 보다 먼저 실행돼 위 초기 수집이 0개일 수 있다 → 드롭다운이 빈 채로
    // 열리거나 옵션이 host 직속에 raw 로 남는다(이 때문에 목업에서 Select 대신 Segmented 로 우회함).
    // 늦게 파싱되어 host 직속으로 들어오는 옵션을 dropdown 으로 입양한다.
    this._childObserver = new MutationObserver((mutations) => {
      let adopted = false;
      for (const m of mutations) {
        for (const node of Array.from(m.addedNodes)) {
          if (
            node instanceof HTMLElement &&
            node.tagName.toLowerCase() === "nds-select-option" &&
            node.parentElement === this
          ) {
            this._adoptOption(node);
            adopted = true;
          }
        }
      }
      if (adopted) this.scheduleUpdate();
    });
    this._childObserver.observe(this, { childList: true });
  }

  /**
   * host 직속 <nds-select-option> 을 dropdown 안으로 옮겨 메뉴에 편입.
   * option 은 portal 후 closest("nds-select") 로 부모를 못 찾으므로 upgrade + setOwner 보장.
   */
  private _adoptOption(opt: HTMLElement): void {
    if (!this._dropdown || opt.parentElement === this._dropdown) return;
    this._dropdown.appendChild(opt);
    customElements.upgrade(opt);
    (opt as NdsSelectOption).setOwner?.(this);
  }

  protected update(): void {
    if (!this._root || !this._trigger || !this._dropdown) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = this.getAttribute("value");
    const placeholder = this.getAttribute("placeholder") ?? "";
    const labelText = this.getAttribute("label");
    const helperText = this.getAttribute("helper-text");
    const disabled = this.boolAttr("disabled");
    const error = this.boolAttr("error");
    // 기본 full-width=true (React fullWidth 기본과 일치 — 폼/캐포비는 전체너비가 기본).
    // 좁게 쓰려면 full-width="false" 명시(예: 어드민 검색 필터).
    const fullWidth = this.attr("full-width", "true") !== "false";
    const open = this.boolAttr("open");
    const searchable = this.boolAttr("searchable");
    const hasValue = value !== null && value !== "";

    this._root.style.width = fullWidth ? "100%" : "auto";
    this._root.style.setProperty("--nds-select-width", fullWidth ? "100%" : "auto");

    this._trigger.disabled = disabled;
    this._trigger.dataset.open = String(open);
    this._trigger.dataset.hasValue = String(hasValue);
    this._trigger.dataset.error = String(error);
    this._trigger.dataset.disabled = String(disabled);
    this._trigger.setAttribute("aria-expanded", String(open));
    if (open) this._trigger.setAttribute("aria-controls", `${this._selectId}-listbox`);
    else this._trigger.removeAttribute("aria-controls");
    if (error) this._trigger.setAttribute("aria-invalid", "true");
    else this._trigger.removeAttribute("aria-invalid");

    this._chevron!.dataset.open = String(open);

    this._dropdown.id = `${this._selectId}-listbox`;
    // Portal: open 이면 body 로, close 면 root 안으로 복귀. dropdown DOM 자체는 유지.
    if (open) {
      if (this._dropdown.parentElement !== document.body) {
        document.body.appendChild(this._dropdown);
      }
      this._dropdown.style.display = "";
      this._positionDropdown();
    } else {
      this._dropdown.style.display = "none";
      if (this._dropdown.parentElement === document.body && this._root) {
        this._root.appendChild(this._dropdown);
      }
    }

    // trigger 텍스트 — 선택값 있으면 해당 option label, 없으면 placeholder
    if (this._triggerText) {
      if (hasValue) {
        const opt = this._findOption(value);
        this._triggerText.textContent = opt?.textContent?.trim() ?? value!;
        this._triggerText.dataset.placeholder = "false";
      } else {
        this._triggerText.textContent = placeholder;
        this._triggerText.dataset.placeholder = "true";
      }
    }

    // option 별 selected/active dataset
    const options = this._dropdown.querySelectorAll<NdsSelectOption>("nds-select-option");
    options.forEach((opt) => {
      const v = opt.getAttribute("value") ?? "";
      opt.setSelected(v === value);
      opt.setActive(v === this._activeValue);
    });

    // searchable(검색형): 검색 인풋 + 빈 상태 보장/제거 후 옵션 필터 적용
    if (searchable) {
      this._ensureSearchUI();
      this._applyFilter(options);
    } else {
      this._removeSearchUI();
      options.forEach((opt) => {
        opt.style.display = "";
      });
    }

    this._syncLabel(labelText);
    this._syncHelper(helperText, error);

    if (open) {
      document.addEventListener("click", this._outsideClick, true);
      document.addEventListener("keydown", this._onKey, true);
      // scroll/resize 시 trigger 위치가 바뀌므로 reposition. capture: true 로
      // overflow:auto 안 부모 스크롤까지 잡는다 (capture phase 만 bubble 됨).
      window.addEventListener("scroll", this._onReposition, true);
      window.addEventListener("resize", this._onReposition);
    } else {
      document.removeEventListener("click", this._outsideClick, true);
      document.removeEventListener("keydown", this._onKey, true);
      window.removeEventListener("scroll", this._onReposition, true);
      window.removeEventListener("resize", this._onReposition);
    }

    // 검색형: 열린 직후 한 번 검색 인풋으로 포커스 (이후 update 에선 포커스 가로채지 않음)
    if (open && searchable && this._focusSearchOnOpen && this._searchInput) {
      this._focusSearchOnOpen = false;
      this._searchInput.focus();
    }
  }

  /**
   * trigger 위치 기준으로 dropdown fixed position 설정.
   * 화면 하단 공간이 부족하면 trigger 위로 띄운다.
   */
  private _positionDropdown(): void {
    if (!this._dropdown || !this._trigger) return;
    if (!this.boolAttr("open")) return;
    const rect = this._trigger.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const dropdownH = this._dropdown.offsetHeight || 240;
    const spaceBelow = viewportH - rect.bottom;
    const spaceAbove = rect.top;
    const placeAbove = spaceBelow < dropdownH && spaceAbove > spaceBelow;

    this._dropdown.style.left = `${rect.left}px`;
    // 메뉴 폭(React 와 동일 전략): 항상 트리거 폭 이상. fullWidth 면 트리거 폭으로 고정,
    // auto 면 가장 넓은 옵션까지 grow 후 캡(넘으면 옵션 말줄임).
    const fullWidth = this.attr("full-width", "true") !== "false";
    this._dropdown.style.minWidth = `${rect.width}px`;
    this._dropdown.style.width = "max-content";
    this._dropdown.style.maxWidth = fullWidth
      ? `${rect.width}px`
      : `${SELECT_AUTO_MENU_MAX_WIDTH}px`;
    if (placeAbove) {
      this._dropdown.style.top = "";
      this._dropdown.style.bottom = `${viewportH - rect.top}px`;
    } else {
      this._dropdown.style.bottom = "";
      this._dropdown.style.top = `${rect.bottom}px`;
    }
  }

  private _syncLabel(text: string | null): void {
    if (!this._root || !this._trigger) return;
    if (text === null) {
      this._label?.remove();
      this._label = null;
      return;
    }
    if (!this._label) {
      this._label = document.createElement("label");
      this._label.className = LABEL_CLASS;
      this._label.dataset.slot = "label";
      this._root.insertBefore(this._label, this._trigger);
    }
    this._label.htmlFor = this._selectId;
    this._label.textContent = text;
  }

  private _syncHelper(text: string | null, error: boolean): void {
    if (!this._root || !this._trigger) return;
    if (text === null) {
      this._helper?.remove();
      this._helper = null;
      this._trigger.removeAttribute("aria-describedby");
      return;
    }
    if (!this._helper) {
      this._helper = document.createElement("span");
      this._helper.className = HELPER_CLASS;
      this._helper.dataset.slot = "helper";
      this._root.appendChild(this._helper);
    }
    const helperId = `${this._selectId}-helper`;
    this._helper.id = helperId;
    this._helper.dataset.error = String(error);
    this._helper.textContent = text;
    this._trigger.setAttribute("aria-describedby", helperId);
  }

  private _findOption(value: string | null): NdsSelectOption | null {
    if (!this._dropdown || value === null) return null;
    return this._dropdown.querySelector<NdsSelectOption>(`nds-select-option[value="${value}"]`);
  }

  /** searchable: 드롭다운 상단 검색 인풋 + 빈 상태 노드를 보장(없으면 생성). */
  private _ensureSearchUI(): void {
    if (!this._dropdown) return;
    if (!this._search) {
      const search = document.createElement("div");
      search.className = SEARCH_CLASS;
      search.dataset.slot = "search";
      search.innerHTML = SEARCH_ICON_SVG;

      const input = document.createElement("input");
      input.type = "text";
      input.dataset.slot = "search-input";
      input.addEventListener("input", () => {
        this._query = input.value;
        this.scheduleUpdate();
      });
      search.appendChild(input);
      // 항상 드롭다운 최상단
      this._dropdown.insertBefore(search, this._dropdown.firstChild);
      this._search = search;
      this._searchInput = input;
    }
    if (!this._empty) {
      const empty = document.createElement("div");
      empty.className = EMPTY_CLASS;
      empty.dataset.slot = "empty";
      this._dropdown.appendChild(empty);
      this._empty = empty;
    }
    this._searchInput!.placeholder = this.attr("search-placeholder", "검색");
    this._empty!.textContent = this.attr("empty-message", "검색 결과가 없어요");
  }

  /** searchable 해제 시 검색 UI 제거 + 검색어 리셋. */
  private _removeSearchUI(): void {
    this._search?.remove();
    this._empty?.remove();
    this._search = null;
    this._searchInput = null;
    this._empty = null;
    this._query = "";
  }

  /** 현재 검색어로 옵션 표시/숨김 + 빈 상태 토글. */
  private _applyFilter(options: NodeListOf<NdsSelectOption>): void {
    const q = this._query.trim().toLowerCase();
    let visible = 0;
    options.forEach((opt) => {
      const label = (opt.textContent ?? "").trim().toLowerCase();
      const match = q === "" || label.includes(q);
      opt.style.display = match ? "" : "none";
      if (match) visible += 1;
    });
    if (this._empty) this._empty.style.display = visible === 0 ? "" : "none";
  }

  private _setOpen(next: boolean): void {
    if (next && !this.hasAttribute("open")) {
      this.setAttribute("open", "");
      this._activeValue = this.getAttribute("value");
      // 검색형: 열 때마다 검색어 초기화 + 검색 인풋으로 포커스 예약
      if (this.boolAttr("searchable")) {
        this._query = "";
        if (this._searchInput) this._searchInput.value = "";
        this._focusSearchOnOpen = true;
      }
    } else if (!next && this.hasAttribute("open")) {
      this.removeAttribute("open");
      this._activeValue = null;
      this._query = "";
    }
  }

  /** option 이 호출. */
  pickValue(value: string): void {
    this.setAttribute("value", value);
    this._setOpen(false);
    this._trigger?.focus();
    this.dispatchEvent(
      new CustomEvent("select-change", { detail: { value }, bubbles: true, composed: true }),
    );
  }

  private _handleTriggerKey(e: KeyboardEvent): void {
    if (this.boolAttr("disabled")) return;
    const open = this.boolAttr("open");
    if (
      !open &&
      (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ")
    ) {
      e.preventDefault();
      this._setOpen(true);
      this._activeValue = this.getAttribute("value");
      this.scheduleUpdate();
    }
  }

  private _handleKey(e: KeyboardEvent): void {
    if (!this.boolAttr("open") || !this._dropdown) return;
    if (e.key === "Escape") {
      e.preventDefault();
      this._setOpen(false);
      this._trigger?.focus();
      return;
    }
    // 검색형: 활성/필터로 숨겨진(display:none) 옵션은 탐색 대상에서 제외.
    const options = Array.from(
      this._dropdown.querySelectorAll<NdsSelectOption>("nds-select-option"),
    ).filter((o) => !o.hasAttribute("disabled") && o.style.display !== "none");
    const typingInSearch = e.target === this._searchInput;

    // 검색어에 공백 입력 — 선택으로 가로채지 않는다.
    if (e.key === " " && typingInSearch) return;
    if (options.length === 0) return;
    const values = options.map((o) => o.getAttribute("value") ?? "");
    const currentIdx = values.indexOf(this._activeValue ?? "");

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const nextIdx =
        e.key === "ArrowDown"
          ? (currentIdx + 1 + options.length) % options.length
          : (currentIdx - 1 + options.length) % options.length;
      this._activeValue = values[nextIdx];
      this.scheduleUpdate();
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      // active 가 없거나 필터로 사라졌으면 첫 번째 보이는 옵션을 선택(검색형 UX).
      const target = currentIdx >= 0 ? values[currentIdx] : (values[0] ?? null);
      if (target !== null) this.pickValue(target);
    }
  }
}

/* ──────────────── <nds-select-option> ──────────────── */

export class NdsSelectOption extends NdsElement {
  static elementName = "nds-select-option";

  static get observedAttributes(): readonly string[] {
    return ["value", "disabled"];
  }

  private _wrapped = false;

  setOwner(_owner: NdsSelect): void {
    // 옵션은 dropdown 에서 click delegation 으로 처리하므로 owner ref 필요 없음.
    // setOwner 는 backward-compat 차원에서 노출만 — 호출돼도 안전.
    if (!this._wrapped) this._mount();
  }

  override connectedCallback(): void {
    if (!this._wrapped) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    if (this._wrapped) return;
    // host element 자체에 option 클래스/role 박는다 (자식 wrapping 없음 — 단순 leaf)
    this.classList.add(OPTION_CLASS);
    this.dataset.slot = "option";
    this.setAttribute("role", "option");
    // 라벨 콘텐츠(텍스트)를 label span 으로 감싼다 — 메뉴 폭이 캡/트리거폭에 닿으면 줄바꿈
    // 대신 말줄임(text-overflow). host.textContent 는 그대로라 trigger 라벨 추출에 영향 없음.
    const label = document.createElement("span");
    label.className = OPTION_LABEL_CLASS;
    while (this.firstChild) label.appendChild(this.firstChild);
    this.appendChild(label);
    // 선택 표시용 trailing 체크 — 평소엔 CSS 로 숨김, data-selected 일 때만 노출.
    // svg 는 텍스트가 없으므로 host.textContent(= trigger 라벨)에 영향 없음.
    const check = document.createElement("span");
    check.className = OPTION_CHECK_CLASS;
    check.setAttribute("aria-hidden", "true");
    check.innerHTML = OPTION_CHECK_SVG;
    this.appendChild(check);
    // 클릭 처리는 dropdown delegation 으로 옮김 — portal 후 jsdom 에서
    // 옵션 자체의 listener 가 안 잡히는 케이스를 피한다.
    this._wrapped = true;
  }

  protected update(): void {
    const value = this.getAttribute("value") ?? "";
    this.dataset.value = value;
    const disabled = this.hasAttribute("disabled");
    if (disabled) {
      this.setAttribute("aria-disabled", "true");
      this.dataset.disabled = "true";
    } else {
      this.removeAttribute("aria-disabled");
      this.dataset.disabled = "false";
    }
  }

  setSelected(selected: boolean): void {
    this.dataset.selected = String(selected);
    this.setAttribute("aria-selected", String(selected));
  }

  setActive(active: boolean): void {
    this.dataset.active = String(active);
  }
}

// ⚠️ 등록 순서 — leaf(option) 를 부모(select) 보다 먼저 define 해야 한다.
// customElements.define 은 문서에 이미 있는 매칭 요소를 동기 upgrade 하므로, 정적 HTML
// 목업에서 NdsSelect 를 먼저 define 하면 <nds-select> 가 즉시 upgrade → _mount 가
// 아직 미정의인 <nds-select-option> 에 setOwner 를 호출 → throw → 옵션이 raw 텍스트로
// 새어 나온다(드롭다운 안 만들어짐). option 을 먼저 등록하면 부모 upgrade 시점에
// customElements.upgrade(opt) 가 실제로 동작하고 setOwner 가 존재한다.
define(NdsSelectOption);
define(NdsSelect);
