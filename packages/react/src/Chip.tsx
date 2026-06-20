import React from "react";
import { fontFamily, fontWeight, radius } from "@nudge-design/tokens";

import { RemoveIcon } from "./internal/RemoveIcon.js";

/* ─── Class names ─── */

const CHIP_CLASS = "nds-chip";
const CHIP_ROOT_CLASS = `${CHIP_CLASS}__root`;
const CHIP_LABEL_CLASS = `${CHIP_CLASS}__label`;
const CHIP_REMOVE_CLASS = `${CHIP_CLASS}__remove`;
const CHIP_ICON_CLASS = `${CHIP_CLASS}__icon`;

/* ─── Types ─── */

export type ChipVariant = "fill" | "outlined" | "ghost";
export type ChipColor = "project" | "neutral" | "success" | "error" | "caution";
export type ChipSize = "sm" | "md";

/* ─── Color tokens ─── */
/* variant×color / selected 별 색은 styles/src/Chip.ts 의 [data-variant][data-color] /
   [data-selected="true"][data-color] CSS 룰이 --nds-chip-bg/fg/border 슬롯에 주입한다.
   여기(JS)에서는 색을 더 이상 박지 않는다 — data-variant/data-color/data-selected 만 set. */

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
  color = "project",
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
  const sizeTokens = SIZE_TOKENS[size];

  const hasRemove = !!onRemove && !disabled;
  const paddingRight = hasRemove ? Math.max(sizeTokens.paddingX - 4, 6) : sizeTokens.paddingX;

  // 치수는 --nds-chip-* 슬롯로 합성 — 프로젝트(지니어트: h32·padding6/14·Medium 13)가 토큰 맵에서
  // override. 미설정 프로젝트는 size(sm/md) 토큰값 fallback 유지.
  const chipPadY = `var(--nds-chip-padding-y, ${sizeTokens.paddingY}px)`;
  const chipPadX = `var(--nds-chip-padding-x, ${sizeTokens.paddingX}px)`;
  const chipPadRight = hasRemove ? `${paddingRight}px` : chipPadX;

  const rootStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--semantic-gap-tight)",
    height: `var(--nds-chip-height, ${sizeTokens.height}px)`,
    padding: `${chipPadY} ${chipPadRight} ${chipPadY} ${chipPadX}`,
    borderRadius: radius.pill,
    // 색(background/color/border)은 styles/src/Chip.ts 의 [data-variant][data-color] /
    // [data-selected] CSS 룰이 슬롯에 주입 — 여기서 인라인으로 박지 않는다.
    fontFamily: fontFamily.web,
    fontSize: `var(--nds-chip-font-size, ${sizeTokens.fontSize}px)`,
    lineHeight: `var(--nds-chip-line-height, ${sizeTokens.lineHeight}px)`,
    fontWeight: `var(--nds-chip-font-weight, ${fontWeight.bold})`,
    boxSizing: "border-box",
    userSelect: "none",
    whiteSpace: "nowrap",
    ...style,
  };

  return (
    <>
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
