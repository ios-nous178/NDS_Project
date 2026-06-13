import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/* ─── Class names ─── */

const AG_CLASS = "nds-agreement";
const AG_ALL_CLASS = `${AG_CLASS}__all`;
const AG_DIVIDER_CLASS = `${AG_CLASS}__divider`;
const AG_LIST_CLASS = `${AG_CLASS}__list`;
const AG_ROW_CLASS = `${AG_CLASS}__row`;
const AG_OPTION_CLASS = `${AG_CLASS}__option`;
const AG_INPUT_CLASS = `${AG_CLASS}__input`;
const AG_CHECK_CLASS = `${AG_CLASS}__check`;
const AG_LABEL_CLASS = `${AG_CLASS}__label`;
const AG_BADGE_CLASS = `${AG_CLASS}__badge`;
const AG_VIEW_CLASS = `${AG_CLASS}__view`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

type CheckState = "checked" | "indeterminate" | "unchecked";

/* ─── Icons (브랜드 무관 · currentColor) ─── */

const CheckIcon = () => (
  <svg className={`${AG_CHECK_CLASS}-icon`} viewBox="0 0 14 14" fill="none" aria-hidden="true">
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
  <svg className={`${AG_CHECK_CLASS}-minus`} viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3.5 7H10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

function CheckIndicator({ state }: { state: CheckState }) {
  return (
    <span className={AG_CHECK_CLASS} data-state={state} aria-hidden="true">
      <CheckIcon />
      <MinusIcon />
    </span>
  );
}

/* ─── Context (compound 내부 cascade SSOT) ─── */

interface AgreementContextValue {
  selected: Set<string>;
  toggle: (value: string) => void;
  toggleAll: () => void;
  allState: CheckState;
  register: (value: string, disabled: boolean) => void;
  unregister: (value: string) => void;
}

const AgreementContext = createContext<AgreementContextValue | null>(null);

function useAgreement(part: string): AgreementContextValue {
  const ctx = useContext(AgreementContext);
  if (!ctx) {
    throw new Error(`Agreement.${part} 는 <Agreement.Root> (또는 <Agreement>) 안에서만 쓸 수 있습니다.`);
  }
  return ctx;
}

/* ─── Compound: Root ─── */

export interface AgreementRootProps {
  /** 동의된 항목 value 목록 (controlled) */
  value?: string[];
  /** 초기 동의 항목 (uncontrolled) */
  defaultValue?: string[];
  /** 동의 변경 콜백 — 등록 순서로 정렬된 value 배열 */
  onValueChange?: (value: string[]) => void;
  /** 전체동의 + 항목들 (Agreement.All / Agreement.Item) */
  children: React.ReactNode;
  /** 루트 className */
  className?: string;
  /** 루트 style */
  style?: React.CSSProperties;
}

export const AgreementRoot: React.FC<AgreementRootProps> = ({
  value,
  defaultValue,
  onValueChange,
  children,
  className,
  style,
}) => {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(defaultValue ?? []);
  // 등록된 항목(선언 순서) — All 의 상태/전체토글 대상. value/disabled 추적.
  const [registry, setRegistry] = useState<Array<{ value: string; disabled: boolean }>>([]);

  const selectedList = isControlled ? value : internal;
  const selected = useMemo(() => new Set(selectedList), [selectedList]);

  const order = useMemo(() => registry.map((r) => r.value), [registry]);
  const commit = useCallback(
    (nextSet: Set<string>) => {
      // 등록 순서로 정렬, 등록 안 된 잔여 value 는 뒤에 보존
      const ordered = [
        ...order.filter((v) => nextSet.has(v)),
        ...selectedList.filter((v) => nextSet.has(v) && !order.includes(v)),
      ];
      if (!isControlled) setInternal(ordered);
      onValueChange?.(ordered);
    },
    [order, selectedList, isControlled, onValueChange],
  );

  const toggle = useCallback(
    (val: string) => {
      const next = new Set(selected);
      if (next.has(val)) next.delete(val);
      else next.add(val);
      commit(next);
    },
    [selected, commit],
  );

  const toggleable = useMemo(() => registry.filter((r) => !r.disabled).map((r) => r.value), [registry]);
  const allState: CheckState = useMemo(() => {
    if (toggleable.length === 0) return "unchecked";
    const hit = toggleable.filter((v) => selected.has(v)).length;
    if (hit === 0) return "unchecked";
    if (hit === toggleable.length) return "checked";
    return "indeterminate";
  }, [toggleable, selected]);

  const toggleAll = useCallback(() => {
    const next = new Set(selected);
    if (allState === "checked") toggleable.forEach((v) => next.delete(v));
    else toggleable.forEach((v) => next.add(v));
    commit(next);
  }, [selected, allState, toggleable, commit]);

  const register = useCallback((val: string, disabled: boolean) => {
    setRegistry((prev) => {
      const idx = prev.findIndex((r) => r.value === val);
      if (idx >= 0) {
        if (prev[idx].disabled === disabled) return prev;
        const next = [...prev];
        next[idx] = { value: val, disabled };
        return next;
      }
      return [...prev, { value: val, disabled }];
    });
  }, []);

  const unregister = useCallback((val: string) => {
    setRegistry((prev) => prev.filter((r) => r.value !== val));
  }, []);

  const ctx = useMemo<AgreementContextValue>(
    () => ({ selected, toggle, toggleAll, allState, register, unregister }),
    [selected, toggle, toggleAll, allState, register, unregister],
  );

  return (
    <AgreementContext.Provider value={ctx}>
      <div data-slot="root" className={cx(AG_CLASS, className)} style={style}>
        {children}
      </div>
    </AgreementContext.Provider>
  );
};
AgreementRoot.displayName = "AgreementRoot";

/* ─── Compound: All (전체동의) ─── */

export interface AgreementAllProps {
  /** 전체동의 라벨 @default "전체 동의" */
  children?: React.ReactNode;
  /** 하단 구분선 노출 @default true */
  divider?: boolean;
  className?: string;
}

export const AgreementAll: React.FC<AgreementAllProps> = ({
  children = "전체 동의",
  divider = true,
  className,
}) => {
  const { allState, toggleAll } = useAgreement("All");
  return (
    <>
      <div className={cx(AG_ROW_CLASS, AG_ALL_CLASS, className)} data-state={allState} data-all="true">
        <label className={AG_OPTION_CLASS}>
          <input
            type="checkbox"
            className={AG_INPUT_CLASS}
            checked={allState === "checked"}
            aria-checked={allState === "indeterminate" ? "mixed" : undefined}
            ref={(el) => {
              if (el) el.indeterminate = allState === "indeterminate";
            }}
            onChange={toggleAll}
          />
          <CheckIndicator state={allState} />
          <span className={AG_LABEL_CLASS}>{children}</span>
        </label>
      </div>
      {divider && <div className={AG_DIVIDER_CLASS} role="separator" />}
    </>
  );
};
AgreementAll.displayName = "AgreementAll";

/* ─── Compound: Item (개별 약관) ─── */

export interface AgreementItemProps {
  /** 항목 value (동의 보고 기준) */
  value: string;
  /** 필수 약관 여부 — "필수" 배지 노출 @default false */
  required?: boolean;
  /** "보기" 링크 href (외부 약관 페이지) */
  viewHref?: string;
  /** "보기" 클릭 핸들러 (href 없을 때 버튼) */
  onView?: () => void;
  /** "보기" 링크 라벨 @default "보기" */
  viewLabel?: string;
  /** 비활성화 */
  disabled?: boolean;
  /** 약관 라벨 */
  children: React.ReactNode;
  className?: string;
}

export const AgreementItem: React.FC<AgreementItemProps> = ({
  value,
  required = false,
  viewHref,
  onView,
  viewLabel = "보기",
  disabled = false,
  children,
  className,
}) => {
  const { selected, toggle, register, unregister } = useAgreement("Item");

  useEffect(() => {
    register(value, disabled);
    return () => unregister(value);
  }, [value, disabled, register, unregister]);

  const checked = selected.has(value);
  const hasView = Boolean(viewHref || onView);

  return (
    <div
      className={cx(AG_ROW_CLASS, className)}
      data-state={checked ? "checked" : "unchecked"}
      data-disabled={disabled ? "true" : "false"}
    >
      <label className={AG_OPTION_CLASS}>
        <input
          type="checkbox"
          className={AG_INPUT_CLASS}
          checked={checked}
          disabled={disabled}
          onChange={() => toggle(value)}
        />
        <CheckIndicator state={checked ? "checked" : "unchecked"} />
        <span className={AG_BADGE_CLASS} data-required={required ? "true" : "false"}>
          {required ? "필수" : "선택"}
        </span>
        <span className={AG_LABEL_CLASS}>{children}</span>
      </label>
      {hasView &&
        (viewHref ? (
          <a className={AG_VIEW_CLASS} href={viewHref} target="_blank" rel="noreferrer">
            {viewLabel}
          </a>
        ) : (
          <button type="button" className={AG_VIEW_CLASS} onClick={onView}>
            {viewLabel}
          </button>
        ))}
    </div>
  );
};
AgreementItem.displayName = "AgreementItem";

/* ─── Flat (데이터 주도) API ─── */

export interface AgreementItemData {
  value: string;
  label: React.ReactNode;
  required?: boolean;
  viewHref?: string;
  onView?: () => void;
  disabled?: boolean;
}

export interface AgreementProps {
  /** 약관 항목 목록 */
  items: AgreementItemData[];
  /** 동의된 항목 value 목록 (controlled) */
  value?: string[];
  /** 초기 동의 항목 (uncontrolled) */
  defaultValue?: string[];
  /** 동의 변경 콜백 — 등록 순서로 정렬된 value 배열 */
  onValueChange?: (value: string[]) => void;
  /** 전체동의 라벨 @default "전체 동의" · null 이면 전체동의 행 숨김 */
  allLabel?: string | null;
  /** 항목 "보기" 라벨 @default "보기" */
  viewLabel?: string;
  /** 루트 className */
  className?: string;
  /** 루트 style */
  style?: React.CSSProperties;
}

const AgreementComponent: React.FC<AgreementProps> = ({
  items,
  allLabel = "전체 동의",
  viewLabel,
  ...rootProps
}) => (
  <AgreementRoot {...rootProps}>
    {allLabel !== null && <AgreementAll>{allLabel}</AgreementAll>}
    <div data-slot="list" className={AG_LIST_CLASS}>
      {items.map((item) => (
        <AgreementItem
          key={item.value}
          value={item.value}
          required={item.required}
          viewHref={item.viewHref}
          onView={item.onView}
          viewLabel={viewLabel}
          disabled={item.disabled}
        >
          {item.label}
        </AgreementItem>
      ))}
    </div>
  </AgreementRoot>
);
AgreementComponent.displayName = "Agreement";

/* ─── Export: Flat + Compound ─── */

export const Agreement = Object.assign(AgreementComponent, {
  Root: AgreementRoot,
  All: AgreementAll,
  Item: AgreementItem,
});
