import React from "react";
import { cv, fontFamily, fontWeight, radius, transition } from "@nudge-design/tokens";

import { RemoveIcon } from "./internal/RemoveIcon.js";

/* ─── Class names ─── */

const CHIP_CLASS = "nds-chip";
const CHIP_ROOT_CLASS = `${CHIP_CLASS}__root`;
const CHIP_LABEL_CLASS = `${CHIP_CLASS}__label`;
const CHIP_REMOVE_CLASS = `${CHIP_CLASS}__remove`;
const CHIP_ICON_CLASS = `${CHIP_CLASS}__icon`;

/* ─── Types ─── */

export type ChipVariant = "fill" | "outlined" | "ghost";
export type ChipColor = "brand" | "neutral" | "success" | "error" | "caution";
export type ChipSize = "sm" | "md";

/* ─── Color tokens ─── */

type ChipColorTokens = {
  background: string;
  text: string;
  border: string;
};

// cv.* 헬퍼로 통일 (raw var(--semantic-*) + #ffffff fallback 제거 — Button.tsx styleMap 과 동일 규약).
// 값은 기존과 동일(각 cv.* 가 같은 --semantic-* 로 해석). status fill/border 일부는 전용 토큰 부재로
// bg/text 토큰을 쓰며, 그 사유는 인라인 주석으로 박제.
const FILL_COLORS: Record<ChipColor, ChipColorTokens> = {
  brand: {
    background: cv.fill.brand,
    // brand fill 위 텍스트 = 버튼 primary 와 동일 대비 토큰(밝은 brand=어두운 글자).
    // textRole.inverse 직참조 금지 — 캐포비 노랑 fill 위 흰 글자 회귀 방지.
    text: cv.button.textDefault,
    border: "transparent",
  },
  neutral: {
    background: cv.fill.neutral,
    text: cv.textRole.inverse,
    border: "transparent",
  },
  success: {
    // fill-status-success 토큰이 없어 bg-status-success 사용(error/caution 은 fill-status-* 존재).
    background: cv.surface.statusSuccess,
    text: cv.textRole.statusSuccess,
    border: "transparent",
  },
  error: {
    background: cv.fill.statusError,
    text: cv.textRole.inverse,
    border: "transparent",
  },
  caution: {
    background: cv.fill.statusCaution,
    text: cv.textRole.strong,
    border: "transparent",
  },
};

const OUTLINED_COLORS: Record<ChipColor, ChipColorTokens> = {
  brand: {
    background: cv.surface.default,
    text: cv.textRole.brand,
    border: cv.borderRole.brand,
  },
  neutral: {
    background: cv.surface.default,
    text: cv.textRole.normal,
    border: cv.borderRole.normal,
  },
  success: {
    background: cv.surface.default,
    text: cv.textRole.statusSuccess,
    // border-status-success 토큰이 없어 text-status-success 사용.
    border: cv.textRole.statusSuccess,
  },
  error: {
    background: cv.surface.default,
    text: cv.textRole.statusError,
    border: cv.borderRole.statusError,
  },
  caution: {
    background: cv.surface.default,
    text: cv.textRole.statusCaution,
    border: cv.borderRole.statusCaution,
  },
};

const GHOST_COLORS: Record<ChipColor, ChipColorTokens> = {
  brand: {
    background: cv.surface.brandSubtle,
    text: cv.textRole.brand,
    border: "transparent",
  },
  neutral: {
    background: cv.surface.subtle,
    text: cv.textRole.normal,
    border: "transparent",
  },
  success: {
    background: cv.surface.statusSuccess,
    text: cv.textRole.statusSuccess,
    border: "transparent",
  },
  error: {
    background: cv.surface.statusError,
    text: cv.textRole.statusError,
    border: "transparent",
  },
  caution: {
    background: cv.surface.statusCaution,
    text: cv.textRole.statusCaution,
    border: "transparent",
  },
};

const COLORS_BY_VARIANT: Record<ChipVariant, Record<ChipColor, ChipColorTokens>> = {
  fill: FILL_COLORS,
  outlined: OUTLINED_COLORS,
  ghost: GHOST_COLORS,
};

/* ─── Size tokens ─── */

type ChipSizeTokens = {
  height: number;
  paddingY: number;
  paddingX: number;
  fontSize: number;
  lineHeight: number;
};

const SIZE_TOKENS: Record<ChipSize, ChipSizeTokens> = {
  sm: { height: 24, paddingY: 3, paddingX: 10, fontSize: 12, lineHeight: 16 },
  md: { height: 28, paddingY: 4, paddingX: 12, fontSize: 14, lineHeight: 20 },
};

/* ─── Hover/Disabled CSS ─── */

const chipStyles = `
  :where(.${CHIP_ROOT_CLASS}) {
    transition:
      background-color ${transition.default},
      border-color ${transition.default},
      color ${transition.default};
  }

  :where(.${CHIP_ROOT_CLASS}[data-interactive="true"]) {
    cursor: pointer;
  }

  :where(.${CHIP_ROOT_CLASS}[data-interactive="true"]:hover) {
    filter: brightness(0.96);
  }

  :where(.${CHIP_ROOT_CLASS}[data-disabled="true"]) {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
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
    margin-left: 2px;
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
  /** 시각적 스타일 (Figma "Style") */
  variant?: ChipVariant;
  /** 의미 컬러 (Figma "Color") */
  color?: ChipColor;
  /** 크기 */
  size?: ChipSize;
  /** 선택 상태. onClick과 함께 쓰면 aria-pressed로 노출된다. */
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
  color = "brand",
  size = "md",
  selected = false,
  disabled = false,
  onClick,
  onRemove,
  icon,
  className,
  style,
  ...rest
}) => {
  const isInteractive = !!onClick;
  const colorTokens = COLORS_BY_VARIANT[variant][color];
  const selectedColorTokens = FILL_COLORS[color];
  const visualTokens = selected
    ? {
        background: `var(--nds-chip-selected-background, ${selectedColorTokens.background})`,
        text: `var(--nds-chip-selected-text, ${selectedColorTokens.text})`,
        border: `var(--nds-chip-selected-border, ${selectedColorTokens.border})`,
      }
    : colorTokens;
  const sizeTokens = SIZE_TOKENS[size];

  const hasRemove = !!onRemove && !disabled;
  const paddingRight = hasRemove ? Math.max(sizeTokens.paddingX - 4, 6) : sizeTokens.paddingX;

  const rootStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--semantic-gap-tight)",
    height: sizeTokens.height,
    padding: `${sizeTokens.paddingY}px ${paddingRight}px ${sizeTokens.paddingY}px ${sizeTokens.paddingX}px`,
    borderRadius: radius.pill,
    background: visualTokens.background,
    color: visualTokens.text,
    border: `1px solid ${visualTokens.border}`,
    fontFamily: fontFamily.web,
    fontSize: sizeTokens.fontSize,
    lineHeight: `${sizeTokens.lineHeight}px`,
    fontWeight: fontWeight.bold,
    boxSizing: "border-box",
    userSelect: "none",
    whiteSpace: "nowrap",
    ...style,
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: chipStyles }} />
      <div
        data-slot="root"
        data-variant={variant}
        data-color={color}
        data-size={size}
        data-selected={selected ? "true" : "false"}
        data-interactive={isInteractive ? "true" : "false"}
        data-disabled={disabled ? "true" : "false"}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive && !disabled ? 0 : undefined}
        aria-pressed={isInteractive ? selected : undefined}
        aria-disabled={disabled || undefined}
        className={cx(CHIP_ROOT_CLASS, className)}
        style={rootStyle}
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
        {hasRemove && (
          <button
            type="button"
            data-slot="remove"
            aria-label={`${label} 삭제`}
            className={CHIP_REMOVE_CLASS}
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
          >
            <RemoveIcon />
          </button>
        )}
      </div>
    </>
  );
};

Chip.displayName = "Chip";
