import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  sizing,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

/* ─── Constants ─── */

const AC_CLASS = "nds-autocomplete";
const AC_ROOT_CLASS = `${AC_CLASS}__root`;
const AC_INPUT_CLASS = `${AC_CLASS}__input`;
const AC_LIST_CLASS = `${AC_CLASS}__list`;
const AC_OPTION_CLASS = `${AC_CLASS}__option`;
const AC_HIGHLIGHT_CLASS = `${AC_CLASS}__highlight`;
const AC_DESCRIPTION_CLASS = `${AC_CLASS}__description`;
const AC_EMPTY_CLASS = `${AC_CLASS}__empty`;
const AC_LOADING_CLASS = `${AC_CLASS}__loading`;

/* ─── Types ─── */

export interface AutocompleteOption {
  /** 고유 값 */
  value: string;
  /** 표시 라벨 */
  label: string;
  /** 보조 설명 (label 아래에 작은 글씨) */
  description?: string;
  /** 좌측 아이콘 */
  icon?: React.ReactNode;
}

export interface AutocompleteProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "size" | "onSelect"
> {
  /** 입력값 (controlled) */
  value: string;
  /** 입력값 변경 콜백 */
  onValueChange: (value: string) => void;
  /** 추천 옵션 목록. value 입력에 맞춰 외부에서 필터링해 전달 */
  options: AutocompleteOption[];
  /** 옵션 선택 콜백 */
  onSelect?: (option: AutocompleteOption) => void;
  /** 로딩 상태 */
  loading?: boolean;
  /** 결과 없음 메시지 */
  emptyMessage?: React.ReactNode;
  /** 최소 입력 길이 (이 길이 미만일 때는 드롭다운 안 보임) */
  minQueryLength?: number;
  /** 매칭 텍스트 하이라이트 */
  highlight?: boolean;
  /** 라벨 */
  label?: React.ReactNode;
  /** 자리표시자 */
  placeholder?: string;
  /** 비활성화 */
  disabled?: boolean;
  /** 에러 상태 */
  error?: boolean;
  /** 가로 가득 채우기 */
  fullWidth?: boolean;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const autocompleteStyles = `
  :where(.${AC_ROOT_CLASS}) {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
    font-family: ${fontFamily.web};
    width: var(--nds-autocomplete-width, auto);
    box-sizing: border-box;
  }

  :where(.${AC_ROOT_CLASS}[data-full-width="true"]) {
    width: 100%;
  }

  :where(.${AC_ROOT_CLASS}) > label {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.text.default};
  }

  :where(.${AC_INPUT_CLASS}) {
    width: 100%;
    height: ${sizing.input.default}px;
    padding: 0 ${spacing[16]}px;
    border: 1px solid ${cv.border.default};
    border-radius: ${radius.md}px;
    background: ${cv.bg.white};
    color: ${cv.text.default};
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    transition: border-color ${transition.default};
    box-sizing: border-box;
  }

  :where(.${AC_INPUT_CLASS}::placeholder) {
    color: ${cv.text.placeholder};
  }

  :where(.${AC_INPUT_CLASS}:focus-visible) {
    outline: none;
    border-color: ${cv.primary.main};
  }

  :where(.${AC_INPUT_CLASS}[data-error="true"]) {
    border-color: var(--semantic-error-main);
  }

  :where(.${AC_INPUT_CLASS}[disabled]) {
    background: ${cv.bg.coolGray};
    color: ${cv.text.disabled};
    cursor: not-allowed;
  }

  :where(.${AC_LIST_CLASS}) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: ${spacing[4]}px;
    background: ${cv.bg.white};
    border: 1px solid ${cv.border.light};
    border-radius: ${radius.md}px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    max-height: 280px;
    overflow-y: auto;
    z-index: 10;
    list-style: none;
    margin-block: 0;
    padding: ${spacing[4]}px 0;
  }

  :where(.${AC_OPTION_CLASS}) {
    display: flex;
    align-items: center;
    gap: ${spacing[12]}px;
    padding: ${spacing[12]}px ${spacing[16]}px;
    cursor: pointer;
    color: ${cv.text.default};
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    transition: background-color ${transition.default};
  }

  :where(.${AC_OPTION_CLASS}[data-active="true"]),
  :where(.${AC_OPTION_CLASS}:hover) {
    background: ${cv.bg.coolGray};
  }

  :where(.${AC_OPTION_CLASS}[aria-selected="true"]) {
    color: ${cv.primary.main};
    font-weight: ${fontWeight.semibold};
  }

  :where(.${AC_HIGHLIGHT_CLASS}) {
    color: ${cv.primary.main};
    font-weight: ${fontWeight.semibold};
  }

  :where(.${AC_DESCRIPTION_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.text.subtle};
    margin-top: 2px;
  }

  :where(.${AC_EMPTY_CLASS}),
  :where(.${AC_LOADING_CLASS}) {
    padding: ${spacing[16]}px;
    color: ${cv.text.subtle};
    font-size: ${typeScale.body3.fontSize}px;
    text-align: center;
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const HIGHLIGHT_OPEN = "\u{1F6A9}H_OPEN\u{1F6A9}";
const HIGHLIGHT_CLOSE = "\u{1F6A9}H_CLOSE\u{1F6A9}";

const renderHighlight = (text: string, query: string, enabled: boolean): React.ReactNode => {
  if (!enabled || !query) return text;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className={AC_HIGHLIGHT_CLASS}>{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
};

/* ─── Component ─── */

export const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      value,
      onValueChange,
      options,
      onSelect,
      loading = false,
      emptyMessage = "결과가 없어요",
      minQueryLength = 1,
      highlight = true,
      label,
      placeholder,
      disabled = false,
      error = false,
      fullWidth = false,
      className,
      onFocus,
      onBlur,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [activeIdx, setActiveIdx] = useState(-1);
    const listRef = useRef<HTMLUListElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const inputId = useId();
    const listboxId = `${inputId}-listbox`;

    const showList = open && value.length >= minQueryLength;
    const visible = useMemo(() => (loading ? [] : options), [loading, options]);

    const handleSelect = useCallback(
      (opt: AutocompleteOption) => {
        onSelect?.(opt);
        onValueChange(opt.label);
        setOpen(false);
        setActiveIdx(-1);
      },
      [onSelect, onValueChange],
    );

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (!showList) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min((i < 0 ? -1 : i) + 1, visible.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        if (activeIdx >= 0 && visible[activeIdx]) {
          e.preventDefault();
          handleSelect(visible[activeIdx]);
        }
      } else if (e.key === "Escape") {
        setOpen(false);
        setActiveIdx(-1);
      }
    };

    useEffect(() => {
      if (!open) return;
      const onClickOutside = (e: MouseEvent) => {
        if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
          setOpen(false);
          setActiveIdx(-1);
        }
      };
      document.addEventListener("mousedown", onClickOutside);
      return () => document.removeEventListener("mousedown", onClickOutside);
    }, [open]);

    return (
      <div
        ref={wrapRef}
        data-slot="root"
        data-full-width={fullWidth ? "true" : "false"}
        className={cx(AC_ROOT_CLASS, className)}
      >
        {label && <label htmlFor={inputId}>{label}</label>}
        <input
          ref={ref}
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeIdx >= 0 ? `${listboxId}-${activeIdx}` : undefined}
          data-error={error ? "true" : "false"}
          className={AC_INPUT_CLASS}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          onChange={(e) => {
            onValueChange(e.target.value);
            setOpen(true);
            setActiveIdx(-1);
          }}
          onFocus={(e) => {
            setOpen(true);
            onFocus?.(e);
          }}
          onBlur={onBlur}
          onKeyDown={handleKey}
          {...rest}
        />

        {showList && (
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            className={AC_LIST_CLASS}
            data-slot="list"
          >
            {loading ? (
              <li className={AC_LOADING_CLASS}>불러오는 중...</li>
            ) : visible.length === 0 ? (
              <li className={AC_EMPTY_CLASS}>{emptyMessage}</li>
            ) : (
              visible.map((opt, i) => (
                <li
                  key={opt.value}
                  id={`${listboxId}-${i}`}
                  role="option"
                  aria-selected={value === opt.label}
                  data-active={i === activeIdx ? "true" : "false"}
                  className={AC_OPTION_CLASS}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(opt);
                  }}
                  onMouseEnter={() => setActiveIdx(i)}
                >
                  {opt.icon}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div>{renderHighlight(opt.label, value, highlight)}</div>
                    {opt.description && (
                      <div className={AC_DESCRIPTION_CLASS}>{opt.description}</div>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    );
  },
);

Autocomplete.displayName = "Autocomplete";
