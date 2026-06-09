import React, { useCallback, useMemo, useState } from "react";

import { Checkbox } from "./Checkbox";

/* ─── Class names ─── */

const CG_CLASS = "nds-checkbox-group";
const CG_SELECT_ALL_CLASS = `${CG_CLASS}__select-all`;
const CG_DIVIDER_CLASS = `${CG_CLASS}__divider`;
const CG_LIST_CLASS = `${CG_CLASS}__list`;
const CG_ITEM_CLASS = `${CG_CLASS}__item`;
const CG_ROW_CLASS = `${CG_CLASS}__row`;
const CG_CHECKBOX_CLASS = `${CG_CLASS}__checkbox`;
const CG_BADGE_CLASS = `${CG_CLASS}__badge`;
const CG_TOGGLE_CLASS = `${CG_CLASS}__toggle`;
const CG_DETAIL_CLASS = `${CG_CLASS}__detail`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const ChevronIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

export type CheckboxGroupLayout = "vertical" | "horizontal";

export interface CheckboxGroupItem {
  /** 옵션 값 */
  value: string;
  /** 표시 라벨 */
  label: React.ReactNode;
  /** 비활성화 */
  disabled?: boolean;
  /** 라벨 옆 뱃지 — [필수]/[선택]/NEW 등 (도메인 중립 슬롯) */
  badge?: React.ReactNode;
  /**
   * 필수 항목 — 뱃지를 강조(빨강 + bold)해 선택 항목과 구분. 약관 동의의 [필수] 등.
   * 미지정이면 badge 텍스트에 "필수" 가 들어있을 때 자동으로 강조한다(반복 누락 방지).
   * 자동 강조를 끄려면 `required={false}` 를 명시.
   */
  required?: boolean;
  /** 펼쳐서 보여줄 보조 콘텐츠(약관 전문 등). expandable 과 함께 chevron 노출 */
  detail?: React.ReactNode;
}

/**
 * 뱃지를 필수 강조(빨강+bold)할지 결정한다.
 * required 가 명시되면 그 값을, 미지정이면 badge 가 "필수" 를 포함하는 문자열일 때 자동 강조.
 * (약관 동의의 `badge:"[필수]"` 에 required 를 매번 붙이는 누락을 방지)
 */
function isBadgeRequired(item: CheckboxGroupItem): boolean {
  if (item.required !== undefined) return item.required;
  return typeof item.badge === "string" && item.badge.includes("필수");
}

export interface CheckboxGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "children"
> {
  /** 방향 (레이아웃 모드 / 데이터 모드 공통) */
  layout?: CheckboxGroupLayout;
  /** 아이템 간격(px) */
  gap?: number;

  /* ── 데이터 모드 (items 를 주면 활성) ── */
  /** 옵션 목록 — 주면 value/onValueChange 로 선택 상태를 관리하는 데이터 모드 */
  items?: CheckboxGroupItem[];
  /** 선택된 값 (controlled) */
  value?: string[];
  /** 선택 변경 콜백 — items 순서로 정렬된 값 배열 */
  onValueChange?: (value: string[]) => void;
  /** 전체선택 행 노출 — 자식 선택 비율로 checked/indeterminate/unchecked 자동 파생 */
  selectAll?: boolean;
  /** 전체선택 라벨 @default "전체 선택" */
  selectAllLabel?: React.ReactNode;
  /** detail 펼침 토글 노출 @default true (detail 있는 항목 한정) */
  expandable?: boolean;

  /* ── 레이아웃 모드 (items 없이 children 직접) ── */
  /** 직접 조립한 <Checkbox> 들 (items 미지정 시) */
  children?: React.ReactNode;
}

type MasterState = "checked" | "indeterminate" | "unchecked";

/**
 * CheckboxGroup — 체크박스 묶음. 두 모드.
 *
 * - **데이터 모드** (`items`): value/onValueChange 로 선택을 관리하고, `selectAll` 로 전체선택
 *   체크박스(자식 비율 → indeterminate 자동)를 얹는다. `badge`(필수/선택 등) · `detail`(펼침)
 *   슬롯 지원. 약관 동의·다중 필터·설정 묶음 등 "전체선택 + 체크 리스트"의 단일 컴포넌트.
 *   각 행은 `Checkbox` 를 재사용한다(지표 단일 소스).
 * - **레이아웃 모드** (`children`): 기존처럼 직접 조립한 `<Checkbox>` 들을 vertical/horizontal +
 *   gap 으로 배치만 한다(선택 상태 관리 없음).
 *
 * 계층(시/도 ▸ 시/군구) 선택은 `CheckboxTree`. antd 의 `Checkbox.Group`(평면) ↔ `Tree`(계층) 대응.
 *
 * @example // 데이터 모드 + 전체선택 (약관 동의)
 * <CheckboxGroup
 *   selectAll selectAllLabel="전체 동의" expandable
 *   items={[{ value: "terms", label: "이용약관", badge: "[필수]", detail: "…" }]}
 *   value={agreed} onValueChange={setAgreed}
 * />
 */
export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  layout = "vertical",
  gap,
  items,
  value,
  onValueChange,
  selectAll = false,
  selectAllLabel = "전체 선택",
  expandable = true,
  children,
  className,
  style,
  ...rest
}) => {
  const groupStyle = {
    ...(gap !== undefined &&
      ({
        "--nds-checkbox-group-gap": `${gap}px`,
        "--nds-choice-group-gap": `${gap}px`,
      } as React.CSSProperties)),
    ...style,
  };

  /* ── 레이아웃 모드 ── */
  if (!items) {
    return (
      <div
        data-slot="group"
        data-layout={layout}
        role="group"
        className={cx(CG_CLASS, className)}
        style={groupStyle}
        {...rest}
      >
        {children}
      </div>
    );
  }

  return (
    <DataCheckboxGroup
      items={items}
      value={value}
      onValueChange={onValueChange}
      selectAll={selectAll}
      selectAllLabel={selectAllLabel}
      expandable={expandable}
      layout={layout}
      className={className}
      style={groupStyle}
      rest={rest}
    />
  );
};

CheckboxGroup.displayName = "CheckboxGroup";

/* ─── 데이터 모드 구현(훅을 안전하게 쓰기 위해 분리) ─── */

interface DataProps {
  items: CheckboxGroupItem[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  selectAll: boolean;
  selectAllLabel: React.ReactNode;
  expandable: boolean;
  layout: CheckboxGroupLayout;
  className?: string;
  style?: React.CSSProperties;
  rest: React.HTMLAttributes<HTMLDivElement>;
}

const DataCheckboxGroup: React.FC<DataProps> = ({
  items,
  value,
  onValueChange,
  selectAll,
  selectAllLabel,
  expandable,
  layout,
  className,
  style,
  rest,
}) => {
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

  const selected = useMemo(() => new Set(value ?? []), [value]);
  const enabledValues = useMemo(
    () => items.filter((i) => !i.disabled).map((i) => i.value),
    [items],
  );

  const allChecked = enabledValues.length > 0 && enabledValues.every((v) => selected.has(v));
  const someChecked = enabledValues.some((v) => selected.has(v));
  const masterState: MasterState = allChecked
    ? "checked"
    : someChecked
      ? "indeterminate"
      : "unchecked";

  const commit = useCallback(
    (next: Set<string>) => {
      onValueChange?.(items.filter((i) => next.has(i.value)).map((i) => i.value));
    },
    [items, onValueChange],
  );

  const toggleItem = useCallback(
    (val: string) => {
      const next = new Set(selected);
      if (next.has(val)) next.delete(val);
      else next.add(val);
      commit(next);
    },
    [selected, commit],
  );

  const toggleAll = useCallback(() => {
    const next = new Set(selected);
    if (allChecked) enabledValues.forEach((v) => next.delete(v));
    else enabledValues.forEach((v) => next.add(v));
    commit(next);
  }, [selected, allChecked, enabledValues, commit]);

  const toggleOpen = useCallback((val: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(val)) next.delete(val);
      else next.add(val);
      return next;
    });
  }, []);

  return (
    <div
      data-slot="group"
      data-layout={layout}
      data-mode="data"
      role="group"
      className={cx(CG_CLASS, className)}
      style={style}
      {...rest}
    >
      {selectAll && items.length > 0 && (
        <>
          <div data-slot="select-all" className={CG_SELECT_ALL_CLASS}>
            <Checkbox
              className={CG_CHECKBOX_CLASS}
              checked={masterState === "checked"}
              indeterminate={masterState === "indeterminate"}
              onCheckedChange={toggleAll}
              label={selectAllLabel}
            />
          </div>
          <div data-slot="divider" className={CG_DIVIDER_CLASS} aria-hidden="true" />
        </>
      )}

      <div data-slot="list" className={CG_LIST_CLASS}>
        {items.map((item) => {
          const checked = selected.has(item.value);
          const open = openKeys.has(item.value);
          const canExpand = expandable && item.detail != null;
          return (
            <div key={item.value} data-slot="item" className={CG_ITEM_CLASS}>
              <div className={CG_ROW_CLASS}>
                <Checkbox
                  className={CG_CHECKBOX_CLASS}
                  checked={checked}
                  disabled={item.disabled}
                  onCheckedChange={() => toggleItem(item.value)}
                  label={item.label}
                />
                {item.badge != null && (
                  <span
                    data-slot="badge"
                    className={CG_BADGE_CLASS}
                    data-required={isBadgeRequired(item) ? "true" : undefined}
                  >
                    {item.badge}
                  </span>
                )}
                {canExpand && (
                  <button
                    type="button"
                    data-slot="toggle"
                    data-open={open ? "true" : "false"}
                    className={CG_TOGGLE_CLASS}
                    onClick={() => toggleOpen(item.value)}
                    aria-expanded={open}
                    aria-label={open ? "접기" : "펼치기"}
                  >
                    <ChevronIcon />
                  </button>
                )}
              </div>
              {canExpand && open && (
                <div data-slot="detail" className={CG_DETAIL_CLASS}>
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
