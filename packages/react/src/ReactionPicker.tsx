import React from "react";
import { cv, fontFamily, fontWeight, spacing, transition, typeScale } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const RP_CLASS = "nds-reaction-picker";
const RP_ITEM_CLASS = `${RP_CLASS}__item`;
const RP_EMOJI_CLASS = `${RP_CLASS}__emoji`;
const RP_COUNT_CLASS = `${RP_CLASS}__count`;

/* ─── Types ─── */

export interface ReactionOption {
  /** 고유 키 */
  key: string;
  /** 이모지/아이콘 */
  emoji: React.ReactNode;
  /** 라벨 (접근성) */
  label?: string;
  /** 카운트 (선택, undefined면 카운트 미표시) */
  count?: number;
}

export interface ReactionPickerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** 가능한 반응 목록 */
  options: ReactionOption[];
  /** 사용자가 선택한 키 (단일 또는 다중) */
  value: string[];
  /** 변경 콜백 */
  onValueChange: (keys: string[]) => void;
  /** 단일 선택 (한 번에 하나만, 다른 거 클릭하면 교체) */
  single?: boolean;
  /** 카운트 숨김 */
  hideCount?: boolean;
  /** 비활성화 */
  disabled?: boolean;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const rpStyles = `
  :where(.${RP_CLASS}) {
    display: inline-flex;
    flex-wrap: wrap;
    gap: ${spacing[4]}px;
    font-family: ${fontFamily.web};
  }

  :where(.${RP_ITEM_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[4]}px;
    height: 32px;
    padding: 0 ${spacing[8]}px;
    border-radius: 9999px;
    border: 1px solid ${cv.border.default};
    background: ${cv.bg.white};
    color: ${cv.text.default};
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.medium};
    cursor: pointer;
    transition: background-color ${transition.default}, border-color ${transition.default};
  }

  :where(.${RP_ITEM_CLASS}:hover:not([disabled])) { background: ${cv.bg.coolGray}; }

  :where(.${RP_ITEM_CLASS}[data-active="true"]) {
    background: var(--semantic-primary-bg, #EBF1FF);
    border-color: ${cv.primary.main};
    color: ${cv.primary.main};
  }

  :where(.${RP_ITEM_CLASS}:focus-visible) {
    outline: 2px solid ${cv.primary.main};
    outline-offset: 2px;
  }

  :where(.${RP_ITEM_CLASS}[disabled]) {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :where(.${RP_EMOJI_CLASS}) {
    font-size: 16px;
    line-height: 1;
  }

  :where(.${RP_COUNT_CLASS}) {
    font-variant-numeric: tabular-nums;
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const ReactionPicker = React.forwardRef<HTMLDivElement, ReactionPickerProps>(
  (
    {
      options,
      value,
      onValueChange,
      single = false,
      hideCount = false,
      disabled = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const toggle = (key: string) => {
      if (disabled) return;
      if (single) {
        onValueChange(value.includes(key) ? [] : [key]);
        return;
      }
      onValueChange(value.includes(key) ? value.filter((v) => v !== key) : [...value, key]);
    };

    return (
      <div ref={ref} data-slot="root" role="group" className={cx(RP_CLASS, className)} {...rest}>
        {options.map((opt) => {
          const active = value.includes(opt.key);
          return (
            <button
              key={opt.key}
              type="button"
              className={RP_ITEM_CLASS}
              data-active={active ? "true" : "false"}
              aria-pressed={active}
              aria-label={opt.label ?? opt.key}
              disabled={disabled}
              onClick={() => toggle(opt.key)}
            >
              <span className={RP_EMOJI_CLASS} aria-hidden>
                {opt.emoji}
              </span>
              {!hideCount && opt.count !== undefined && (
                <span className={RP_COUNT_CLASS}>{opt.count}</span>
              )}
            </button>
          );
        })}
      </div>
    );
  },
);

ReactionPicker.displayName = "ReactionPicker";
