import React from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

/* ─── Class names ─── */

const CHIP_CLASS = "nds-chip";
const CHIP_ROOT_CLASS = `${CHIP_CLASS}__root`;
const CHIP_LABEL_CLASS = `${CHIP_CLASS}__label`;
const CHIP_REMOVE_CLASS = `${CHIP_CLASS}__remove`;
const CHIP_ICON_CLASS = `${CHIP_CLASS}__icon`;

/* ─── Types ─── */

export type ChipVariant = "outlined" | "filled" | "soft" | "strong";
export type ChipSize = "sm" | "md" | "lg";
export type ChipShape = "pill" | "square";

/* ─── Styles ─── */

// :where() 를 사용하여 내부 스타일의 우선순위를 0으로 낮춥니다.
// 이를 통해 외부에서 주입하는 className (Tailwind 등)이 !important 없이도 우선 적용됩니다.

const chipStyles = `
  :where(.${CHIP_ROOT_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[4]}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    cursor: default;
    transition:
      background-color ${transition.default},
      border-color ${transition.default},
      color ${transition.default},
      box-shadow ${transition.default};
    user-select: none;
    padding: 0 ${spacing[16]}px; /* Default padding */
  }

  /* ─── Shape ─── */

  :where(.${CHIP_ROOT_CLASS}[data-shape="pill"]) {
    border-radius: ${radius.pill}px;
  }

  :where(.${CHIP_ROOT_CLASS}[data-shape="square"]) {
    border-radius: ${radius.md}px;
  }

  /* ─── Size ─── */

  :where(.${CHIP_ROOT_CLASS}[data-size="sm"]) {
    height: 32px;
    padding: 0 ${spacing[10]}px;
  }

  :where(.${CHIP_ROOT_CLASS}[data-size="md"]) {
    height: 36px;
    padding: 0 ${spacing[16]}px;
  }

  :where(.${CHIP_ROOT_CLASS}[data-size="lg"]) {
    height: 44px;
    padding: 0 ${spacing[20]}px;
  }

  /* ─── Outlined ─── */

  :where(.${CHIP_ROOT_CLASS}[data-variant="outlined"]) {
    border: 1px solid var(--nds-chip-border, ${cv.border.default});
    background: ${cv.bg.white};
    color: var(--nds-chip-text, ${cv.text.subtle});
    font-size: var(--nds-chip-font-size, inherit);
    font-weight: var(--nds-chip-font-weight, inherit);
  }

  :where(.${CHIP_ROOT_CLASS}[data-variant="outlined"][data-selected="true"]) {
    border-color: var(--nds-chip-selected-border, ${cv.primary.main});
    color: var(--nds-chip-selected-text, ${cv.primary.main});
    background: var(--nds-chip-selected-background, ${cv.bg.white});
  }

  :where(.${CHIP_ROOT_CLASS}[data-variant="outlined"][data-interactive="true"]:hover) {
    border-color: ${cv.primary.main};
    background: ${cv.primary.bgLighter || "#f1f8fd"};
  }

  /* ─── Filled ─── */

  :where(.${CHIP_ROOT_CLASS}[data-variant="filled"]) {
    border: 1px solid transparent;
    background: ${cv.bg.light};
    color: ${cv.text.subtle};
  }

  :where(.${CHIP_ROOT_CLASS}[data-variant="filled"][data-selected="true"]) {
    background: ${cv.primary.main};
    color: ${cv.primary.fg};
  }

  :where(.${CHIP_ROOT_CLASS}[data-variant="filled"][data-interactive="true"]:hover) {
    background: ${cv.border.light};
  }

  /* ─── Soft ─── */

  :where(.${CHIP_ROOT_CLASS}[data-variant="soft"]) {
    border: 1px solid transparent;
    background: ${cv.primary.bgLighter || "#f1f8fd"};
    color: ${cv.primary.main};
  }

  :where(.${CHIP_ROOT_CLASS}[data-variant="soft"][data-interactive="true"]:hover) {
    background: ${cv.primary.bg};
  }

  /* ─── Strong ─── */

  :where(.${CHIP_ROOT_CLASS}[data-variant="strong"]) {
    border: 1px solid ${cv.text.default};
    background: ${cv.bg.white};
    color: ${cv.text.default};
  }

  :where(.${CHIP_ROOT_CLASS}[data-variant="strong"][data-selected="true"]) {
    background: ${cv.text.default};
    color: ${cv.text.inverse};
  }

  :where(.${CHIP_ROOT_CLASS}[data-variant="strong"][data-interactive="true"]:hover) {
    background: ${cv.bg.light};
  }

  /* ─── Remove ─── */

  :where(.${CHIP_ROOT_CLASS}:has(.${CHIP_REMOVE_CLASS})) {
    padding-right: ${spacing[10]}px;
  }

  :where(.${CHIP_REMOVE_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    margin-left: ${spacing[2]}px;
    color: inherit;
    opacity: 0.6;
    line-height: 1;
    transition: 
      opacity ${transition.default},
      transform ${transition.default};
  }

  :where(.${CHIP_REMOVE_CLASS}:hover) {
    opacity: 1;
    transform: scale(1.1);
  }

  :where(.${CHIP_REMOVE_CLASS} svg) {
    width: 14px;
    height: 14px;
  }

  /* ─── Disabled ─── */

  :where(.${CHIP_ROOT_CLASS}[data-disabled="true"]) {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* ─── Label ─── */

  :where(.${CHIP_ROOT_CLASS}[data-size="sm"] .${CHIP_LABEL_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
  }

  :where(.${CHIP_ROOT_CLASS}[data-size="md"] .${CHIP_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
  }

  :where(.${CHIP_ROOT_CLASS}[data-size="lg"] .${CHIP_LABEL_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.bold};
  }

  :where(.${CHIP_LABEL_CLASS}) {
    font-weight: ${fontWeight.medium};
    white-space: nowrap;
  }

  /* ─── Icon ─── */

  :where(.${CHIP_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  :where(.${CHIP_ICON_CLASS} svg) {
    width: 16px;
    height: 16px;
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export interface ChipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** 라벨 텍스트 */
  label: string;
  /** 스타일 변형 */
  variant?: ChipVariant;
  /** 크기 */
  size?: ChipSize;
  /** 모양 (pill: 완전 둥근, square: 8px 라운드) */
  shape?: ChipShape;
  /** 선택 상태 */
  selected?: boolean;
  /** 비활성화 */
  disabled?: boolean;
  /** 클릭 콜백 */
  onClick?: () => void;
  /** 삭제 콜백 */
  onRemove?: () => void;
  /** 좌측 아이콘 */
  icon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = "outlined",
  size = "md",
  shape = "pill",
  selected = false,
  disabled = false,
  onClick,
  onRemove,
  icon,
  className,
  ...rest
}) => {
  const isInteractive = !!onClick;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: chipStyles }} />
      <div
        data-slot="root"
        data-variant={variant}
        data-size={size}
        data-shape={shape}
        data-selected={selected ? "true" : "false"}
        data-interactive={isInteractive ? "true" : "false"}
        data-disabled={disabled ? "true" : "false"}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive && !disabled ? 0 : undefined}
        aria-pressed={isInteractive ? selected : undefined}
        className={cx(CHIP_ROOT_CLASS, className)}
        onClick={!disabled ? onClick : undefined}
        onKeyDown={
          isInteractive && !disabled
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick?.();
                }
              }
            : undefined
        }
        {...rest}
      >
        {icon && (
          <span data-slot="icon" className={CHIP_ICON_CLASS} aria-hidden="true">
            {icon}
          </span>
        )}
        <span data-slot="label" className={CHIP_LABEL_CLASS}>
          {label}
        </span>
        {onRemove && !disabled && (
          <button
            type="button"
            data-slot="remove"
            aria-label={`${label} 삭제`}
            className={CHIP_REMOVE_CLASS}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 3L11 11M11 3L3 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
    </>
  );
};

Chip.displayName = "Chip";
