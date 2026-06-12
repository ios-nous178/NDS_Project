/**
 * <nds-checkbox-tree> — DS CheckboxTree 의 vanilla Web Component 버전.
 *
 * 검색 + 전체선택 + 계층(시/도 ▸ 시/군/구) 체크박스 트리. 부모는 하위 leaf 선택 비율에 따라
 * checked / indeterminate / unchecked 자동 표시. React CheckboxTree.tsx 와 동일한
 * class / data-slot / 치수 구조를 light DOM 에 만들어 같은 stylesheet 를 재사용한다.
 *
 * 사용 패턴:
 *   <nds-checkbox-tree
 *     search-placeholder="소재명으로 검색하기"
 *     value='[]'
 *     nodes='[{"value":"gangwon","label":"강원도","children":[{"value":"gangneung","label":"강릉시"}]}]'>
 *   </nds-checkbox-tree>
 *
 * 이벤트:
 *   선택 변경 → host 의 value attribute(JSON 배열) 갱신 +
 *   "nds-checkbox-tree-change" CustomEvent (detail: { value: string[] }) (bubbles, composed)
 */

import { NdsElement, define } from "../base/nds-element.js";

const CT_CLASS = "nds-checkbox-tree";
const CT_SEARCH_CLASS = `${CT_CLASS}__search`;
const CT_LIST_CLASS = `${CT_CLASS}__list`;
const CT_GROUP_CLASS = `${CT_CLASS}__group`;
const CT_ROW_CLASS = `${CT_CLASS}__row`;
const CT_OPTION_CLASS = `${CT_CLASS}__option`;
const CT_INPUT_CLASS = `${CT_CLASS}__input`;
const CT_CHECK_CLASS = `${CT_CLASS}__check`;
const CT_LABEL_CLASS = `${CT_CLASS}__label`;
const CT_CHEVRON_CLASS = `${CT_CLASS}__chevron`;
const CT_EMPTY_CLASS = `${CT_CLASS}__empty`;

const SEARCH_SVG =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.25" stroke="currentColor" stroke-width="1.5"/><path d="M20 20l-4.2-4.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
const CHECK_SVG =
  '<svg class="' +
  CT_CHECK_CLASS +
  '-icon" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7L6 10L11 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const MINUS_SVG =
  '<svg class="' +
  CT_CHECK_CLASS +
  '-minus" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3.5 7H10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const CHEVRON_SVG =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

interface CtNode {
  value: string;
  label: string;
  children?: CtNode[];
  disabled?: boolean;
}

type NodeState = "checked" | "indeterminate" | "unchecked";

/* ─── Tree helpers (React CheckboxTree 와 동일 로직) ─── */

function leafValues(node: CtNode): string[] {
  if (!node.children || node.children.length === 0) {
    return node.disabled ? [] : [node.value];
  }
  return node.children.flatMap(leafValues);
}

function allLeafValues(nodes: CtNode[]): string[] {
  return nodes.flatMap(leafValues);
}

function nodeState(node: CtNode, selected: Set<string>): NodeState {
  const leaves = leafValues(node);
  if (leaves.length === 0) return selected.has(node.value) ? "checked" : "unchecked";
  const hit = leaves.filter((v) => selected.has(v)).length;
  if (hit === 0) return "unchecked";
  if (hit === leaves.length) return "checked";
  return "indeterminate";
}

function toggleNode(node: CtNode, selected: Set<string>): Set<string> {
  const leaves = leafValues(node);
  const targets = leaves.length ? leaves : node.disabled ? [] : [node.value];
  if (targets.length === 0) return selected;
  const allOn = targets.every((v) => selected.has(v));
  const next = new Set(selected);
  if (allOn) targets.forEach((v) => next.delete(v));
  else targets.forEach((v) => next.add(v));
  return next;
}

function filterNodes(nodes: CtNode[], q: string): CtNode[] {
  if (!q) return nodes;
  const out: CtNode[] = [];
  for (const node of nodes) {
    if (node.label.toLowerCase().includes(q)) {
      out.push(node);
      continue;
    }
    if (node.children) {
      const children = filterNodes(node.children, q);
      if (children.length) out.push({ ...node, children });
    }
  }
  return out;
}

function parentValues(nodes: CtNode[]): string[] {
  return nodes.flatMap((n) =>
    n.children && n.children.length ? [n.value, ...parentValues(n.children)] : [],
  );
}

/** 빌드된 행 한 벌 — _syncTree 가 이 노드들에 선택 상태만 입힌다(재생성 금지). */
interface CtRowRefs {
  row: HTMLElement;
  input: HTMLInputElement;
  check: HTMLElement;
  labelEl: HTMLElement;
}

interface CtNodeRowRefs extends CtRowRefs {
  node: CtNode;
  treeitem: HTMLElement;
}

export class NdsCheckboxTree extends NdsElement {
  static elementName = "nds-checkbox-tree";

  static get observedAttributes(): readonly string[] {
    return [
      "nodes",
      "value",
      "searchable",
      "search-placeholder",
      "show-select-all",
      "select-all-label",
      "empty-message",
      "default-expanded",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _search: HTMLDivElement | null = null;
  private _searchInput: HTMLInputElement | null = null;
  private _list: HTMLDivElement | null = null;

  private _query = "";
  private _expanded = new Set<string>();
  private _expandedInit = false;

  /** 트리 구조 시그니처 — 바뀔 때만 행을 재구성(포커스 보존: input 재생성 금지). */
  private _treeSig: string | null = null;
  private _selectAllRef: CtRowRefs | null = null;
  private _rowRefs: CtNodeRowRefs[] = [];
  private _emptyEl: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  /* ── attribute-derived ── */

  private _getNodes(): CtNode[] {
    return this._parseJsonArray<CtNode>(
      this.getAttribute("nodes"),
      (o) => typeof o.value === "string" && typeof o.label === "string",
    );
  }

  private _getValue(): string[] {
    const raw = this.getAttribute("value");
    if (!raw || !raw.trim()) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }

  private _parseJsonArray<T>(
    raw: string | null,
    valid: (o: Record<string, unknown>) => boolean,
  ): T[] {
    if (!raw || !raw.trim()) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed.filter((o) => o && valid(o)) as T[]) : [];
    } catch {
      return [];
    }
  }

  private _commit(next: Set<string>): void {
    const ordered = allLeafValues(this._getNodes()).filter((v) => next.has(v));
    // value attributeChangedCallback → scheduleUpdate → _syncTree 가 상태를 입힌다.
    this.setAttribute("value", JSON.stringify(ordered));
    this.dispatchEvent(
      new CustomEvent("nds-checkbox-tree-change", {
        detail: { value: ordered },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /* ── mount — 검색 input 은 여기서 1회만 생성(타이핑 중 재생성 = 포커스 유실) ── */

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = CT_CLASS;

    const search = document.createElement("div");
    search.dataset.slot = "search";
    search.className = CT_SEARCH_CLASS;

    const input = document.createElement("input");
    input.type = "text";
    input.addEventListener("input", () => {
      this._query = input.value;
      this._renderNow(); // 리스트만 재구성 — 검색 input 자신은 건드리지 않는다
    });

    const icon = document.createElement("span");
    icon.className = `${CT_SEARCH_CLASS}-icon`;
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = SEARCH_SVG;

    search.append(input, icon);
    root.appendChild(search);

    const list = document.createElement("div");
    list.dataset.slot = "tree";
    list.className = CT_LIST_CLASS;
    list.setAttribute("role", "tree");
    root.appendChild(list);

    this.replaceChildren(root);
    this._root = root;
    this._search = search;
    this._searchInput = input;
    this._list = list;
  }

  protected update(): void {
    if (!this._root || !this._search || !this._searchInput) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    if (!this._expandedInit) {
      this._expandedInit = true;
      const raw = this.getAttribute("default-expanded");
      if (raw && raw.trim()) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) parsed.forEach((v) => this._expanded.add(String(v)));
        } catch {
          /* ignore malformed default-expanded */
        }
      }
    }

    /* 검색 영역 — input 노드는 _mount 의 것 그대로, 표시 속성만 sync */
    const searchable = this.attr("searchable", "true") !== "false";
    this._search.style.display = searchable ? "" : "none";
    const placeholder = this.attr("search-placeholder", "검색");
    if (this._searchInput.placeholder !== placeholder) {
      this._searchInput.placeholder = placeholder;
      this._searchInput.setAttribute("aria-label", placeholder);
    }

    this._renderNow();
  }

  /* ── render ── */

  /**
   * 구조(nodes/검색어/펼침/전체선택 노출)가 바뀔 때만 행을 재구성하고,
   * 그 외(value·라벨 텍스트)는 기존 노드에 상태만 입힌다 — update() 가 input 을
   * 재생성하면 체크/타이핑마다 포커스가 유실되는 회귀 클래스.
   */
  private _renderNow(): void {
    const sig = [
      this.getAttribute("nodes") ?? "",
      this._query.trim().toLowerCase(),
      [...this._expanded].sort().join(","),
      this.attr("show-select-all", "true"),
    ].join(" ");
    if (sig !== this._treeSig) {
      this._treeSig = sig;
      this._buildTree();
    }
    this._syncTree();
  }

  private _visibleNodes(): CtNode[] {
    return filterNodes(this._getNodes(), this._query.trim().toLowerCase());
  }

  /** 트리 행 구조 구성 — 선택 상태는 _syncTree 가 입힌다. */
  private _buildTree(): void {
    if (!this._list) return;
    const q = this._query.trim().toLowerCase();
    const visibleNodes = this._visibleNodes();
    const showSelectAll = this.attr("show-select-all", "true") !== "false";
    const searchExpanded = q ? new Set(parentValues(visibleNodes)) : null;
    const isExpanded = (val: string) =>
      searchExpanded ? searchExpanded.has(val) : this._expanded.has(val);

    this._selectAllRef = null;
    this._rowRefs = [];
    this._emptyEl = null;
    this._list.replaceChildren();

    /* select-all */
    if (showSelectAll && visibleNodes.length > 0) {
      const ref = this._buildRow({
        depth: null,
        selectAll: true,
        onToggle: () => this._toggleAll(),
      });
      this._selectAllRef = ref;
      this._list.appendChild(ref.row);
    }

    /* empty / nodes */
    if (visibleNodes.length === 0) {
      const empty = document.createElement("div");
      empty.dataset.slot = "empty";
      empty.className = CT_EMPTY_CLASS;
      this._emptyEl = empty;
      this._list.appendChild(empty);
      return;
    }

    const baseDepth = showSelectAll ? 1 : 0;
    for (const node of visibleNodes) {
      this._list.appendChild(this._buildNode(node, baseDepth, isExpanded));
    }
  }

  /** 기존 행 노드에 선택 상태/라벨 텍스트만 반영 — input 재생성 금지(포커스 보존). */
  private _syncTree(): void {
    const selected = new Set(this._getValue());

    if (this._selectAllRef) {
      const visibleLeaves = allLeafValues(this._visibleNodes());
      const hit = visibleLeaves.filter((v) => selected.has(v)).length;
      const state: NodeState =
        hit === 0 ? "unchecked" : hit === visibleLeaves.length ? "checked" : "indeterminate";
      this._applyRowState(this._selectAllRef, state);
      this._selectAllRef.labelEl.textContent = this.attr("select-all-label", "전체 선택");
    }

    for (const ref of this._rowRefs) {
      const state = nodeState(ref.node, selected);
      this._applyRowState(ref, state);
      ref.treeitem.setAttribute("aria-selected", state === "checked" ? "true" : "false");
    }

    if (this._emptyEl) {
      this._emptyEl.textContent = this.attr("empty-message", "검색 결과가 없습니다.");
    }
  }

  private _applyRowState(ref: CtRowRefs, state: NodeState): void {
    ref.row.dataset.state = state;
    ref.input.checked = state === "checked";
    ref.input.indeterminate = state === "indeterminate";
    if (state === "indeterminate") ref.input.setAttribute("aria-checked", "mixed");
    else ref.input.removeAttribute("aria-checked");
    ref.check.dataset.state = state;
  }

  /** 전체 선택 토글 — 클릭 시점의 attr/검색 상태로 계산(스테일 클로저 금지). */
  private _toggleAll(): void {
    const selected = new Set(this._getValue());
    const visibleLeaves = allLeafValues(this._visibleNodes());
    const allOn = visibleLeaves.length > 0 && visibleLeaves.every((v) => selected.has(v));
    if (allOn) visibleLeaves.forEach((v) => selected.delete(v));
    else visibleLeaves.forEach((v) => selected.add(v));
    this._commit(selected);
  }

  private _buildNode(
    node: CtNode,
    depth: number,
    isExpanded: (val: string) => boolean,
  ): HTMLElement {
    const hasChildren = !!node.children?.length;
    const open = hasChildren && isExpanded(node.value);

    const treeitem = document.createElement("div");
    treeitem.setAttribute("role", "treeitem");
    if (hasChildren) treeitem.setAttribute("aria-expanded", open ? "true" : "false");

    const ref = this._buildRow({
      label: node.label,
      depth,
      disabled: node.disabled,
      onToggle: () => this._commit(toggleNode(node, new Set(this._getValue()))),
      chevron: hasChildren
        ? {
            open,
            onClick: () => {
              if (this._expanded.has(node.value)) this._expanded.delete(node.value);
              else this._expanded.add(node.value);
              this._renderNow();
            },
          }
        : undefined,
    });
    treeitem.appendChild(ref.row);
    this._rowRefs.push({ ...ref, node, treeitem });

    if (open) {
      const group = document.createElement("div");
      group.setAttribute("role", "group");
      group.className = CT_GROUP_CLASS;
      for (const child of node.children!) {
        group.appendChild(this._buildNode(child, depth + 1, isExpanded));
      }
      treeitem.appendChild(group);
    }

    return treeitem;
  }

  private _buildRow(opts: {
    label?: string;
    depth: number | null;
    selectAll?: boolean;
    disabled?: boolean;
    onToggle: () => void;
    chevron?: { open: boolean; onClick: () => void };
  }): CtRowRefs {
    const row = document.createElement("div");
    row.className = CT_ROW_CLASS;
    if (opts.selectAll) row.dataset.selectAll = "true";
    row.dataset.disabled = opts.disabled ? "true" : "false";
    if (opts.depth !== null) row.style.setProperty("--nds-checkbox-tree-depth", String(opts.depth));

    const label = document.createElement("label");
    label.className = CT_OPTION_CLASS;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = CT_INPUT_CLASS;
    if (opts.disabled) input.disabled = true;
    input.addEventListener("change", () => {
      if (opts.disabled) return;
      opts.onToggle();
    });

    const check = document.createElement("span");
    check.className = CT_CHECK_CLASS;
    check.setAttribute("aria-hidden", "true");
    check.innerHTML = CHECK_SVG + MINUS_SVG;

    const text = document.createElement("span");
    text.className = CT_LABEL_CLASS;
    if (opts.label != null) text.textContent = opts.label;

    label.append(input, check, text);
    row.appendChild(label);

    if (opts.chevron) {
      const chevron = document.createElement("button");
      chevron.type = "button";
      chevron.className = CT_CHEVRON_CLASS;
      chevron.dataset.expanded = opts.chevron.open ? "true" : "false";
      chevron.setAttribute("aria-label", opts.chevron.open ? "접기" : "펼치기");
      chevron.innerHTML = CHEVRON_SVG;
      chevron.addEventListener("click", opts.chevron.onClick);
      row.appendChild(chevron);
    }

    return { row, input, check, labelEl: text };
  }
}

define(NdsCheckboxTree);
