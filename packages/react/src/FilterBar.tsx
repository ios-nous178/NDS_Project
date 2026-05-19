import React from "react";
import { cv, fontFamily, fontWeight, spacing, transition, typeScale } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const FB_CLASS = "nds-filter-bar";
const FB_LIST_CLASS = `${FB_CLASS}__list`;
const FB_CHIP_CLASS = `${FB_CLASS}__chip`;
const FB_RESET_CLASS = `${FB_CLASS}__reset`;

/* ─── Types ─── */

export interface FilterOption {
  /** 고유 키 */
  key: string;
  /** 라벨 */
  label: React.ReactNode;
  /** 카운트 (선택) */
  count?: number;
  /** 비활성화 */
  disabled?: boolean;
}

export interface FilterBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 옵션 목록 */
  options: FilterOption[];
  /** 활성 키 배열 */
  value: string[];
  /** 변경 콜백 */
  onValueChange: (value: string[]) => void;
  /** 단일 선택 (한 번에 하나만, 다시 클릭 시 해제) */
  single?: boolean;
  /** 초기화 버튼 표시 (활성 1개 이상일 때 자동 노출) */
  showReset?: boolean;
  /** 초기화 라벨 */
  resetLabel?: string;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const fbStyles = `
  :where(.${FB_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--gap-default);
    width: 100%;
    font-family: ${fontFamily.web};
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: ${spacing[4]}px;
  }
  :where(.${FB_CLASS})::-webkit-scrollbar { display: none; }

  :where(.${FB_LIST_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-default);
    flex: 1;
  }

  :where(.${FB_CHIP_CLASS}) {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: var(--gap-tight);
    height: 32px;
    padding: 0 var(--inset-input);
    border-radius: 9999px;
    border: 1px solid ${cv.borderRole.normal};
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.medium};
    cursor: pointer;
    white-space: nowrap;
    transition: background-color ${transition.default}, border-color ${transition.default}, color ${transition.default};
  }

  :where(.${FB_CHIP_CLASS}:hover:not([disabled])) {
    background: ${cv.surface.section};
  }

  :where(.${FB_CHIP_CLASS}[data-active="true"]) {
    background: ${cv.surface.inverse};
    border-color: ${cv.surface.inverse};
    color: ${cv.surface.default};
  }

  :where(.${FB_CHIP_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${FB_CHIP_CLASS}[disabled]) {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :where(.${FB_RESET_CLASS}) {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: var(--gap-tight);
    height: 32px;
    padding: 0 var(--inset-input);
    border: none;
    background: transparent;
    color: ${cv.textRole.subtle};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
  }
  :where(.${FB_RESET_CLASS}:hover) { color: ${cv.textRole.normal}; }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  (
    {
      options,
      value,
      onValueChange,
      single = false,
      showReset,
      resetLabel = "초기화",
      className,
      ...rest
    },
    ref,
  ) => {
    const toggle = (key: string) => {
      if (single) {
        onValueChange(value.includes(key) ? [] : [key]);
        return;
      }
      onValueChange(value.includes(key) ? value.filter((v) => v !== key) : [...value, key]);
    };

    const showResetBtn = showReset ?? value.length > 0;

    return (
      <div ref={ref} data-slot="root" className={cx(FB_CLASS, className)} {...rest}>
        <div className={FB_LIST_CLASS} role="group">
          {options.map((opt) => {
            const active = value.includes(opt.key);
            return (
              <button
                key={opt.key}
                type="button"
                className={FB_CHIP_CLASS}
                data-active={active ? "true" : "false"}
                aria-pressed={active}
                disabled={opt.disabled}
                onClick={() => toggle(opt.key)}
              >
                {opt.label}
                {opt.count !== undefined && <span>{opt.count}</span>}
              </button>
            );
          })}
        </div>
        {showResetBtn && (
          <button type="button" className={FB_RESET_CLASS} onClick={() => onValueChange([])}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M12 7A5 5 0 1 1 7 2c1.7 0 3.22.85 4.13 2.15"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 2v3h-3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {resetLabel}
          </button>
        )}
      </div>
    );
  },
);

FilterBar.displayName = "FilterBar";
