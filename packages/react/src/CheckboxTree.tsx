import React, { useCallback, useMemo, useState } from "react";

/* ─── Class names ─── */

const CT_CLASS = "nds-checkbox-tree";
const CT_SEARCH_CLASS = `${CT_CLASS}__search`;
const CT_SELECT_ALL_CLASS = `${CT_CLASS}__select-all`;
const CT_LIST_CLASS = `${CT_CLASS}__list`;
const CT_GROUP_CLASS = `${CT_CLASS}__group`;
const CT_ROW_CLASS = `${CT_CLASS}__row`;
const CT_OPTION_CLASS = `${CT_CLASS}__option`;
const CT_INPUT_CLASS = `${CT_CLASS}__input`;
const CT_CHECK_CLASS = `${CT_CLASS}__check`;
const CT_LABEL_CLASS = `${CT_CLASS}__label`;
const CT_CHEVRON_CLASS = `${CT_CLASS}__chevron`;
const CT_EMPTY_CLASS = `${CT_CLASS}__empty`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Types ─── */

export interface CheckboxTreeNode {
  /** 노드 값 (선택은 leaf 값 기준으로 보고됨) */
  value: string;
  /** 표시 라벨 (검색 대상) */
  label: string;
  /** 하위 노드 — 있으면 부모(접기/펼치기 + 부분선택), 없으면 leaf */
  children?: CheckboxTreeNode[];
  /** 비활성화 (해당 노드/하위 leaf 선택 불가) */
  disabled?: boolean;
}

export interface CheckboxTreeProps {
  /** 트리 노드 (시/도 ▸ 시/군/구 등 계층) */
  nodes: CheckboxTreeNode[];
  /** 선택된 leaf 값 목록 (controlled) */
  value: string[];
  /** 선택 변경 콜백 — 트리 순서로 정렬된 leaf 값 배열 */
  onValueChange: (value: string[]) => void;
  /** 검색창 노출 @default true */
  searchable?: boolean;
  /** 검색 placeholder @default "검색" */
  searchPlaceholder?: string;
  /** 전체선택 행 노출 @default true */
  showSelectAll?: boolean;
  /** 전체선택 라벨 @default "전체 선택" */
  selectAllLabel?: string;
  /** 초기 펼침 부모 값 (uncontrolled) */
  defaultExpanded?: string[];
  /** 검색 결과 없음 메시지 @default "검색 결과가 없습니다." */
  emptyMessage?: string;
  /** 루트 className */
  className?: string;
  /** 루트 style */
  style?: React.CSSProperties;
}

/* ─── Tree helpers ─── */

/** 노드의 선택 가능한(활성) leaf 값들 — 트리 순서 보존 */
function leafValues(node: CheckboxTreeNode): string[] {
  if (!node.children || node.children.length === 0) {
    return node.disabled ? [] : [node.value];
  }
  return node.children.flatMap(leafValues);
}

function allLeafValues(nodes: CheckboxTreeNode[]): string[] {
  return nodes.flatMap(leafValues);
}

type NodeState = "checked" | "indeterminate" | "unchecked";

function nodeState(node: CheckboxTreeNode, selected: Set<string>): NodeState {
  const leaves = leafValues(node);
  if (leaves.length === 0) {
    // 자식 없는(또는 모두 disabled) 노드 — 자기 자신 기준
    return selected.has(node.value) ? "checked" : "unchecked";
  }
  const hit = leaves.filter((v) => selected.has(v)).length;
  if (hit === 0) return "unchecked";
  if (hit === leaves.length) return "checked";
  return "indeterminate";
}

/** 노드 토글 — 하위 leaf 전체를 on/off (이미 전부 선택이면 해제) */
function toggleNode(node: CheckboxTreeNode, selected: Set<string>): Set<string> {
  const leaves = leafValues(node);
  const targets = leaves.length ? leaves : node.disabled ? [] : [node.value];
  if (targets.length === 0) return selected;
  const allOn = targets.every((v) => selected.has(v));
  const next = new Set(selected);
  if (allOn) targets.forEach((v) => next.delete(v));
  else targets.forEach((v) => next.add(v));
  return next;
}

/** 검색 필터 — 노드 라벨 매치 시 서브트리 유지, 아니면 매치되는 자식만 보존 */
function filterNodes(nodes: CheckboxTreeNode[], q: string): CheckboxTreeNode[] {
  if (!q) return nodes;
  const out: CheckboxTreeNode[] = [];
  for (const node of nodes) {
    const selfMatch = node.label.toLowerCase().includes(q);
    if (selfMatch) {
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

/** 자식 가진 노드 값 전체 (검색 시 자동 펼침용) */
function parentValues(nodes: CheckboxTreeNode[]): string[] {
  return nodes.flatMap((n) =>
    n.children && n.children.length ? [n.value, ...parentValues(n.children)] : [],
  );
}

/* ─── Icons (브랜드 무관 · currentColor) ─── */

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.5" />
    <path d="M20 20l-4.2-4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg className={`${CT_CHECK_CLASS}-icon`} viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M3 7L6 10L11 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MinusIcon = () => (
  <svg className={`${CT_CHECK_CLASS}-minus`} viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3.5 7H10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M7 10l5 5 5-5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ─── Check indicator ─── */

function CheckIndicator({ state }: { state: NodeState }) {
  return (
    <span className={CT_CHECK_CLASS} data-state={state} aria-hidden="true">
      <CheckIcon />
      <MinusIcon />
    </span>
  );
}

/* ─── Component ─── */

/**
 * CheckboxTree — 검색 + 전체선택 + 계층(시/도 ▸ 시/군/구) 체크박스 트리.
 *
 * 부모 노드는 하위 leaf 의 선택 비율에 따라 자동으로 checked / indeterminate / unchecked
 * 를 표시하고, 부모 클릭은 하위 leaf 전체를 on/off 한다. `value` 는 **선택된 leaf 값**만
 * 담는다(부모 값은 파생). "선택한 지역" 같은 요약 패널은 `SelectedItemsPanel` 로 따로 조립.
 *
 * 단일 계층 평면 다중선택이면 `MultiSelect` 를, 즉시 반영 단일 선택이면 `Select` 를 쓴다.
 *
 * @example
 * <CheckboxTree
 *   nodes={regions}            // [{ value:"gangwon", label:"강원도", children:[{value:"gangneung",label:"강릉시"}, …] }]
 *   value={selected}
 *   onValueChange={setSelected}
 *   searchPlaceholder="소재명으로 검색하기"
 * />
 */
export const CheckboxTree: React.FC<CheckboxTreeProps> = ({
  nodes,
  value,
  onValueChange,
  searchable = true,
  searchPlaceholder = "검색",
  showSelectAll = true,
  selectAllLabel = "전체 선택",
  defaultExpanded,
  emptyMessage = "검색 결과가 없습니다.",
  className,
  style,
}) => {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(defaultExpanded ?? []));

  const selected = useMemo(() => new Set(value), [value]);
  const q = query.trim().toLowerCase();

  const visibleNodes = useMemo(() => filterNodes(nodes, q), [nodes, q]);

  // 검색 중에는 매치된 모든 부모를 강제 펼침, 아니면 사용자 펼침 상태
  const searchExpanded = useMemo(
    () => (q ? new Set(parentValues(visibleNodes)) : null),
    [q, visibleNodes],
  );
  const isExpanded = useCallback(
    (val: string) => (searchExpanded ? searchExpanded.has(val) : expanded.has(val)),
    [searchExpanded, expanded],
  );

  const orderedLeaves = useMemo(() => allLeafValues(nodes), [nodes]);

  const commit = useCallback(
    (next: Set<string>) => {
      onValueChange(orderedLeaves.filter((v) => next.has(v)));
    },
    [onValueChange, orderedLeaves],
  );

  const toggleExpand = useCallback((val: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(val)) next.delete(val);
      else next.add(val);
      return next;
    });
  }, []);

  /* select-all 상태 — 보이는 노드의 leaf 기준 */
  const visibleLeaves = useMemo(() => allLeafValues(visibleNodes), [visibleNodes]);
  const selectAllState: NodeState = useMemo(() => {
    if (visibleLeaves.length === 0) return "unchecked";
    const hit = visibleLeaves.filter((v) => selected.has(v)).length;
    if (hit === 0) return "unchecked";
    if (hit === visibleLeaves.length) return "checked";
    return "indeterminate";
  }, [visibleLeaves, selected]);

  const toggleSelectAll = useCallback(() => {
    const next = new Set(selected);
    if (selectAllState === "checked") visibleLeaves.forEach((v) => next.delete(v));
    else visibleLeaves.forEach((v) => next.add(v));
    commit(next);
  }, [selected, selectAllState, visibleLeaves, commit]);

  const renderNode = useCallback(
    (node: CheckboxTreeNode, depth: number): React.ReactNode => {
      const state = nodeState(node, selected);
      const hasChildren = !!node.children?.length;
      const open = hasChildren && isExpanded(node.value);

      return (
        <div
          key={node.value}
          role="treeitem"
          aria-expanded={hasChildren ? open : undefined}
          aria-selected={state === "checked"}
        >
          <div
            className={CT_ROW_CLASS}
            data-state={state}
            data-disabled={node.disabled ? "true" : "false"}
            style={{ ["--nds-checkbox-tree-depth" as string]: depth }}
          >
            <label className={CT_OPTION_CLASS}>
              <input
                type="checkbox"
                className={CT_INPUT_CLASS}
                checked={state === "checked"}
                disabled={node.disabled}
                aria-checked={state === "indeterminate" ? "mixed" : undefined}
                ref={(el) => {
                  if (el) el.indeterminate = state === "indeterminate";
                }}
                onChange={() => commit(toggleNode(node, selected))}
              />
              <CheckIndicator state={state} />
              <span className={CT_LABEL_CLASS}>{node.label}</span>
            </label>
            {hasChildren && (
              <button
                type="button"
                className={CT_CHEVRON_CLASS}
                data-expanded={open ? "true" : "false"}
                aria-label={open ? "접기" : "펼치기"}
                onClick={() => toggleExpand(node.value)}
              >
                <ChevronIcon />
              </button>
            )}
          </div>
          {open && (
            <div role="group" className={CT_GROUP_CLASS}>
              {node.children!.map((child) => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    },
    [selected, isExpanded, commit, toggleExpand],
  );

  const baseDepth = showSelectAll ? 1 : 0;

  return (
    <div data-slot="root" className={cx(CT_CLASS, className)} style={style}>
      {searchable && (
        <div data-slot="search" className={CT_SEARCH_CLASS}>
          <input
            type="text"
            value={query}
            placeholder={searchPlaceholder}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={searchPlaceholder}
          />
          <span className={`${CT_SEARCH_CLASS}-icon`} aria-hidden="true">
            <SearchIcon />
          </span>
        </div>
      )}

      <div data-slot="tree" role="tree" className={CT_LIST_CLASS}>
        {showSelectAll && visibleNodes.length > 0 && (
          <div className={CT_ROW_CLASS} data-state={selectAllState} data-select-all="true">
            <label className={CT_OPTION_CLASS}>
              <input
                type="checkbox"
                className={CT_INPUT_CLASS}
                checked={selectAllState === "checked"}
                aria-checked={selectAllState === "indeterminate" ? "mixed" : undefined}
                ref={(el) => {
                  if (el) el.indeterminate = selectAllState === "indeterminate";
                }}
                onChange={toggleSelectAll}
              />
              <CheckIndicator state={selectAllState} />
              <span className={CT_LABEL_CLASS}>{selectAllLabel}</span>
            </label>
          </div>
        )}

        {visibleNodes.length === 0 ? (
          <div data-slot="empty" className={CT_EMPTY_CLASS}>
            {emptyMessage}
          </div>
        ) : (
          visibleNodes.map((node) => renderNode(node, baseDepth))
        )}
      </div>
    </div>
  );
};

CheckboxTree.displayName = "CheckboxTree";
