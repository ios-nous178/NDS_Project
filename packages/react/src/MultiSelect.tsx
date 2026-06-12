import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { addDismissableLayerListeners } from "./internal/web";
import { Checkbox } from "./Checkbox";
import { SearchInput } from "./SearchInput";
import { Button } from "./Button";

/* ─── Class names ─── */

const MS_CLASS = "nds-multi-select";
const MS_TRIGGER_CLASS = `${MS_CLASS}__trigger`;
const MS_TRIGGER_TEXT_CLASS = `${MS_CLASS}__trigger-text`;
const MS_CHEVRON_CLASS = `${MS_CLASS}__chevron`;
const MS_DROPDOWN_CLASS = `${MS_CLASS}__dropdown`;
const MS_SEARCH_CLASS = `${MS_CLASS}__search`;
const MS_SELECT_ALL_CLASS = `${MS_CLASS}__select-all`;
const MS_COUNT_CLASS = `${MS_CLASS}__count`;
const MS_LIST_CLASS = `${MS_CLASS}__list`;
const MS_OPTION_CLASS = `${MS_CLASS}__option`;
const MS_EMPTY_CLASS = `${MS_CLASS}__empty`;
const MS_FOOTER_CLASS = `${MS_CLASS}__footer`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Types ─── */

export interface MultiSelectOption {
  /** 옵션 값 */
  value: string;
  /** 표시 라벨 (검색 대상) */
  label: string;
  /** 비활성화 */
  disabled?: boolean;
}

export interface MultiSelectProps {
  /** 옵션 목록 */
  options: MultiSelectOption[];
  /** 적용(commit)된 선택 값 */
  value: string[];
  /** 적용 시 콜백 (적용 버튼 클릭 시에만 발화) */
  onValueChange: (value: string[]) => void;
  /** 트리거 placeholder (선택 없음일 때) @default "선택" */
  placeholder?: string;
  /** 트리거 요약 텍스트 포맷터 @default (n) => `${n}개 선택` */
  formatSummary?: (count: number, total: number) => string;
  /** 검색창 노출 @default true */
  searchable?: boolean;
  /** 검색 placeholder @default "검색" */
  searchPlaceholder?: string;
  /** 전체선택/해제 버튼 라벨 @default "전체선택 / 해제" */
  selectAllLabel?: string;
  /** 적용 버튼 라벨 @default "적용" */
  applyLabel?: string;
  /** 취소 버튼 라벨 @default "취소" */
  cancelLabel?: string;
  /** 검색 결과 없음 메시지 @default "검색 결과가 없습니다." */
  emptyMessage?: string;
  /** 에러 상태 */
  error?: boolean;
  /** 비활성화 */
  disabled?: boolean;
  /** 트리거 100% 폭 @default true */
  fullWidth?: boolean;
  /** 루트 className */
  className?: string;
  /** 루트 style */
  style?: React.CSSProperties;
}

/* ─── Component ─── */

/**
 * MultiSelect — 검색 + 전체선택 + 체크박스 + 취소/적용 푸터를 가진 다중 선택 필터 드롭다운.
 *
 * 내부는 DS 컴포넌트 조합: 검색=`SearchInput`, 전체선택/옵션=`Checkbox`(indeterminate),
 * 푸터=`Button`. 체크박스/입력/버튼의 토큰·a11y·브랜드 cascade 를 그대로 물려받는다.
 *
 * 일반 `Select`(단일 선택, 즉시 반영)와 다르다: 초안(draft)을 패널 안에서 편집하고
 * **적용** 을 눌러야 `onValueChange` 가 발화한다(취소는 초안 폐기).
 *
 * @example
 * <MultiSelect options={ads} value={selectedAds} onValueChange={setSelectedAds}
 *   placeholder="모든 광고" searchPlaceholder="광고명으로 검색" />
 */
export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder = "선택",
  formatSummary,
  searchable = true,
  searchPlaceholder = "검색",
  selectAllLabel = "전체선택 / 해제",
  applyLabel = "적용",
  cancelLabel = "취소",
  emptyMessage = "검색 결과가 없습니다.",
  error = false,
  disabled = false,
  fullWidth = true,
  className,
  style,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Set<string>>(() => new Set(value));

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  const openPanel = useCallback(() => {
    if (disabled) return;
    setDraft(new Set(value)); // 열 때마다 적용값으로 초안 리셋
    setQuery("");
    setOpen(true);
  }, [disabled, value]);

  // 바깥 클릭 / 스크롤 → 취소(초안 폐기) 후 닫기
  useEffect(() => {
    if (!open) return;
    const cleanup = addDismissableLayerListeners({
      contentEl: dropdownRef.current,
      triggerEl: triggerRef.current,
      onDismiss: close,
    });
    return cleanup;
  }, [open, close]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, query]);

  const filteredEnabled = useMemo(() => filtered.filter((o) => !o.disabled), [filtered]);
  const selectedCount = filteredEnabled.filter((o) => draft.has(o.value)).length;
  const allFilteredSelected =
    filteredEnabled.length > 0 && selectedCount === filteredEnabled.length;
  const someFilteredSelected = selectedCount > 0 && !allFilteredSelected;

  const toggleOption = useCallback((optionValue: string) => {
    setDraft((prev) => {
      const next = new Set(prev);
      if (next.has(optionValue)) next.delete(optionValue);
      else next.add(optionValue);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setDraft((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filteredEnabled.forEach((o) => next.delete(o.value));
      } else {
        filteredEnabled.forEach((o) => next.add(o.value));
      }
      return next;
    });
  }, [allFilteredSelected, filteredEnabled]);

  const apply = useCallback(() => {
    // options 순서를 보존해 commit
    onValueChange(options.filter((o) => draft.has(o.value)).map((o) => o.value));
    setOpen(false);
  }, [draft, onValueChange, options]);

  const summary = useMemo(() => {
    if (value.length === 0) return placeholder;
    return formatSummary ? formatSummary(value.length, options.length) : `${value.length}개 선택`;
  }, [value.length, options.length, placeholder, formatSummary]);

  const hasValue = value.length > 0;

  return (
    <div
      data-slot="root"
      data-open={open ? "true" : "false"}
      data-disabled={disabled ? "true" : "false"}
      data-fullwidth={fullWidth ? "true" : "false"}
      className={cx(MS_CLASS, className)}
      style={style}
    >
      <button
        ref={triggerRef}
        type="button"
        data-slot="trigger"
        data-open={open ? "true" : "false"}
        data-has-value={hasValue ? "true" : "false"}
        data-error={error ? "true" : "false"}
        data-disabled={disabled ? "true" : "false"}
        className={MS_TRIGGER_CLASS}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={error || undefined}
        onClick={() => (open ? close() : openPanel())}
      >
        <span data-placeholder={!hasValue ? "true" : "false"} className={MS_TRIGGER_TEXT_CLASS}>
          {summary}
        </span>
        <span data-open={open ? "true" : "false"} className={MS_CHEVRON_CLASS} aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {open && (
        <div
          ref={dropdownRef}
          data-slot="dropdown"
          role="group"
          aria-label={placeholder}
          className={MS_DROPDOWN_CLASS}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              close();
            }
          }}
        >
          {searchable && (
            <div data-slot="search" className={MS_SEARCH_CLASS}>
              <SearchInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                showSearchButton={false}
                fullWidth
                autoFocus
                aria-label={searchPlaceholder}
              />
            </div>
          )}

          <div data-slot="select-all" className={MS_SELECT_ALL_CLASS}>
            <Checkbox
              checked={allFilteredSelected}
              indeterminate={someFilteredSelected}
              disabled={filteredEnabled.length === 0}
              label={selectAllLabel}
              onCheckedChange={toggleSelectAll}
            />
            <span className={MS_COUNT_CLASS}>{draft.size}개 선택</span>
          </div>

          <div data-slot="list" className={MS_LIST_CLASS}>
            {filtered.length === 0 ? (
              <div data-slot="empty" className={MS_EMPTY_CLASS}>
                {emptyMessage}
              </div>
            ) : (
              filtered.map((opt) => {
                const checked = draft.has(opt.value);
                return (
                  <div
                    key={opt.value}
                    data-slot="option"
                    data-checked={checked ? "true" : "false"}
                    data-disabled={opt.disabled ? "true" : "false"}
                    className={MS_OPTION_CLASS}
                  >
                    <Checkbox
                      checked={checked}
                      disabled={opt.disabled}
                      label={opt.label}
                      onCheckedChange={() => toggleOption(opt.value)}
                    />
                  </div>
                );
              })
            )}
          </div>

          <div data-slot="footer" className={MS_FOOTER_CLASS}>
            <Button
              size="sm"
              color="neutral"
              variant="outlined"
              data-slot="cancel"
              onClick={close}
            >
              {cancelLabel}
            </Button>
            <Button size="sm" color="neutral" variant="solid" data-slot="apply" onClick={apply}>
              {applyLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

MultiSelect.displayName = "MultiSelect";
