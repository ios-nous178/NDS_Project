import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { addDismissableLayerListeners } from "./internal/web";

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
const MS_OPTION_CHECK_CLASS = `${MS_CLASS}__option-check`;
const MS_OPTION_LABEL_CLASS = `${MS_CLASS}__option-label`;
const MS_EMPTY_CLASS = `${MS_CLASS}__empty`;
const MS_FOOTER_CLASS = `${MS_CLASS}__footer`;
const MS_FOOTER_BTN_CLASS = `${MS_CLASS}__footer-button`;

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
 * 일반 `Select`(단일 선택, 즉시 반영)와 다르다: 초안(draft)을 패널 안에서 편집하고
 * **적용** 을 눌러야 `onValueChange` 가 발화한다(취소는 초안 폐기). 리포트 상단의
 * "광고 다중 선택" 같은 필터에 쓴다. Figma 캐포비 광고별 리포트(3001:28554) 정합.
 *
 * @example
 * <MultiSelect
 *   options={ads}
 *   value={selectedAds}
 *   onValueChange={setSelectedAds}
 *   placeholder="모든 광고"
 *   searchPlaceholder="광고명으로 검색"
 * />
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
  const allFilteredSelected =
    filteredEnabled.length > 0 && filteredEnabled.every((o) => draft.has(o.value));

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
          role="listbox"
          aria-multiselectable="true"
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
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M13 13l-2.5-2.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                value={query}
                placeholder={searchPlaceholder}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
          )}

          <button
            type="button"
            data-slot="select-all"
            className={MS_SELECT_ALL_CLASS}
            onClick={toggleSelectAll}
            disabled={filteredEnabled.length === 0}
          >
            <span
              data-checked={allFilteredSelected ? "true" : "false"}
              className={MS_OPTION_CHECK_CLASS}
              aria-hidden
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6.5l2.5 2.5L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>{selectAllLabel}</span>
            <span className={MS_COUNT_CLASS}>{draft.size}개 선택</span>
          </button>

          <div data-slot="list" className={MS_LIST_CLASS}>
            {filtered.length === 0 ? (
              <div data-slot="empty" className={MS_EMPTY_CLASS}>
                {emptyMessage}
              </div>
            ) : (
              filtered.map((opt) => {
                const checked = draft.has(opt.value);
                return (
                  <label
                    key={opt.value}
                    role="option"
                    aria-selected={checked}
                    data-checked={checked ? "true" : "false"}
                    data-disabled={opt.disabled ? "true" : "false"}
                    className={MS_OPTION_CLASS}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={opt.disabled}
                      onChange={() => toggleOption(opt.value)}
                    />
                    <span
                      data-checked={checked ? "true" : "false"}
                      className={MS_OPTION_CHECK_CLASS}
                      aria-hidden
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2.5 6.5l2.5 2.5L9.5 3.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className={MS_OPTION_LABEL_CLASS}>{opt.label}</span>
                  </label>
                );
              })
            )}
          </div>

          <div data-slot="footer" className={MS_FOOTER_CLASS}>
            <button
              type="button"
              data-variant="cancel"
              className={MS_FOOTER_BTN_CLASS}
              onClick={close}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              data-variant="apply"
              className={MS_FOOTER_BTN_CLASS}
              onClick={apply}
            >
              {applyLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

MultiSelect.displayName = "MultiSelect";
