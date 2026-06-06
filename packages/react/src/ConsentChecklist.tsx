import React, { useCallback, useRef, useState } from "react";

/* ─── Constants ─── */

const CL_CLASS = "nds-consent";
const CL_ALL_CLASS = `${CL_CLASS}__all`;
const CL_DIVIDER_CLASS = `${CL_CLASS}__divider`;
const CL_LIST_CLASS = `${CL_CLASS}__list`;
const CL_ITEM_CLASS = `${CL_CLASS}__item`;
const CL_ITEM_HEAD_CLASS = `${CL_CLASS}__item-head`;
const CL_LABEL_CLASS = `${CL_CLASS}__label`;
const CL_LABEL_TEXT_CLASS = `${CL_CLASS}__label-text`;
const CL_REQUIRED_CLASS = `${CL_CLASS}__required`;
const CL_OPTIONAL_CLASS = `${CL_CLASS}__optional`;
const CL_TOGGLE_CLASS = `${CL_CLASS}__toggle`;
const CL_DETAIL_CLASS = `${CL_CLASS}__detail`;
const CL_BOX_CLASS = `${CL_CLASS}__box`;
const CL_MINUS_CLASS = `${CL_CLASS}__minus`;
const CL_INPUT_CLASS = `${CL_CLASS}__input`;
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const CheckIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
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
  <svg className={CL_MINUS_CLASS} viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3.5 7H10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M4 6L8 10L12 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ─── Types ─── */

export interface ConsentItem {
  /** 식별자 */
  key: string;
  /** 표시 라벨 */
  label: React.ReactNode;
  /** 필수 여부 */
  required?: boolean;
  /** 펼쳐서 보여줄 약관 본문 */
  detail?: React.ReactNode;
}

export interface ConsentChecklistProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 항목 목록 */
  items: ConsentItem[];
  /** 선택된 키들 */
  value: string[];
  /** 변경 콜백 */
  onValueChange: (value: string[]) => void;
  /** 전체동의 라벨 (기본 "전체 동의") */
  allLabel?: React.ReactNode;
  /** 펼치기 가능 (detail이 있는 항목에 한해) */
  expandable?: boolean;
}

/* ─── Component ─── */

export const ConsentChecklist: React.FC<ConsentChecklistProps> = ({
  items,
  value,
  onValueChange,
  allLabel = "전체 동의",
  expandable = true,
  className,
  ...rest
}) => {
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());
  const allInputRef = useRef<HTMLInputElement | null>(null);
  const allKeys = items.map((i) => i.key);
  const allChecked = items.length > 0 && allKeys.every((k) => value.includes(k));
  const someChecked = allKeys.some((k) => value.includes(k));
  // 전체동의는 자식 선택 비율로 파생 — CheckboxTree 전체선택과 동일 패턴.
  const allState = allChecked ? "checked" : someChecked ? "indeterminate" : "unchecked";

  // 네이티브 indeterminate 는 프로퍼티로만 설정 가능(속성 X) → ref 동기화.
  React.useEffect(() => {
    if (allInputRef.current) allInputRef.current.indeterminate = allState === "indeterminate";
  }, [allState]);

  const toggleAll = useCallback(() => {
    onValueChange(allChecked ? [] : allKeys);
  }, [allChecked, allKeys, onValueChange]);

  const toggleItem = useCallback(
    (key: string) => {
      onValueChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key]);
    },
    [value, onValueChange],
  );

  const toggleOpen = useCallback((key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  return (
    <div data-slot="root" className={cx(CL_CLASS, className)} {...rest}>
      <label data-slot="all" className={CL_ALL_CLASS}>
        <input
          ref={allInputRef}
          type="checkbox"
          checked={allChecked}
          onChange={toggleAll}
          className={CL_INPUT_CLASS}
          aria-checked={allState === "indeterminate" ? "mixed" : undefined}
        />
        <span
          data-slot="box"
          data-state={allState}
          data-checked={allChecked ? "true" : "false"}
          className={CL_BOX_CLASS}
          aria-hidden="true"
        >
          <CheckIcon />
          <MinusIcon />
        </span>
        <span data-slot="label-text" className={CL_LABEL_TEXT_CLASS}>
          {allLabel}
        </span>
      </label>
      <div data-slot="divider" className={CL_DIVIDER_CLASS} aria-hidden="true" />
      <div data-slot="list" className={CL_LIST_CLASS}>
        {items.map((item) => {
          const checked = value.includes(item.key);
          const open = openKeys.has(item.key);
          const canExpand = expandable && !!item.detail;
          return (
            <div key={item.key} data-slot="item" className={CL_ITEM_CLASS}>
              <div data-slot="item-head" className={CL_ITEM_HEAD_CLASS}>
                <label data-slot="label" className={CL_LABEL_CLASS}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleItem(item.key)}
                    className={CL_INPUT_CLASS}
                  />
                  <span
                    data-slot="box"
                    data-checked={checked ? "true" : "false"}
                    className={CL_BOX_CLASS}
                    aria-hidden="true"
                  >
                    <CheckIcon />
                  </span>
                  <span data-slot="label-text" className={CL_LABEL_TEXT_CLASS}>
                    {item.label}
                  </span>
                  {item.required ? (
                    <span data-slot="required" className={CL_REQUIRED_CLASS}>
                      [필수]
                    </span>
                  ) : (
                    <span data-slot="optional" className={CL_OPTIONAL_CLASS}>
                      [선택]
                    </span>
                  )}
                </label>
                {canExpand && (
                  <button
                    type="button"
                    data-slot="toggle"
                    data-open={open ? "true" : "false"}
                    className={CL_TOGGLE_CLASS}
                    onClick={() => toggleOpen(item.key)}
                    aria-label={open ? "접기" : "펼치기"}
                    aria-expanded={open}
                  >
                    <ChevronDown />
                  </button>
                )}
              </div>
              {canExpand && open && (
                <div data-slot="detail" className={CL_DETAIL_CLASS}>
                  {item.detail}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

ConsentChecklist.displayName = "ConsentChecklist";
