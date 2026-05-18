import React from "react";
import { cv, fontFamily, fontWeight, spacing, transition, typeScale } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const FB_CLASS = "nds-fab";
const FB_LABEL_CLASS = `${FB_CLASS}__label`;
const FB_ICON_CLASS = `${FB_CLASS}__icon`;

const sizeConfig = {
  md: 48,
  lg: 56,
} as const;

export type FABSize = keyof typeof sizeConfig;
export type FABColor = "primary" | "neutral" | "secondary";
export type FABPosition = "bottom-right" | "bottom-left" | "bottom-center" | "static";

/* ─── Types ─── */

export interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 좌측 아이콘 (필수) */
  icon: React.ReactNode;
  /** 라벨 (있으면 extended FAB) */
  label?: React.ReactNode;
  /** 색상 */
  color?: FABColor;
  /** 크기 */
  size?: FABSize;
  /** 화면 고정 위치. static이면 부모 흐름 안에 배치 */
  position?: FABPosition;
  /** 화면 안전 영역 보정용 offset (position이 fixed일 때) */
  offset?: number;
  /** aria-label (라벨이 없을 때 필수) */
  "aria-label"?: string;
}

/* ─── Styles ─── */

const colorConfig: Record<FABColor, { bg: string; fg: string }> = {
  primary: {
    bg: "var(--semantic-bg-brand-default)",
    fg: "var(--semantic-text-inverse-default)",
  },
  secondary: {
    bg: "var(--semantic-fill-neutral-default)",
    fg: "var(--semantic-text-inverse-default)",
  },
  neutral: {
    bg: "var(--semantic-bg-surface-default)",
    fg: "var(--semantic-text-normal-default)",
  },
};

// eslint-disable-next-line unused-imports/no-unused-vars
const fabStyles = `
  :where(.${FB_CLASS}) {
    height: var(--nds-fab-size, 48px);
    min-width: var(--nds-fab-size, 48px);
    padding: 0 var(--nds-fab-padding, 0);
    border: none;
    border-radius: 9999px;
    background: var(--nds-fab-bg, ${cv.surface.brand});
    color: var(--nds-fab-fg, #fff);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18), 0 2px 4px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-default);
    font-family: ${fontFamily.web};
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
    line-height: ${typeScale.body3.lineHeight}px;
    transition: transform ${transition.default}, box-shadow ${transition.default};
    z-index: 50;
  }

  :where(.${FB_CLASS}:hover) {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.22), 0 3px 6px rgba(0, 0, 0, 0.1);
  }

  :where(.${FB_CLASS}:active) {
    transform: translateY(0);
  }

  :where(.${FB_CLASS}:focus-visible) {
    outline: 3px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${FB_CLASS}[disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  :where(.${FB_CLASS}[data-position="bottom-right"]) {
    position: fixed;
    right: var(--nds-fab-offset, ${spacing[16]}px);
    bottom: var(--nds-fab-offset, ${spacing[16]}px);
  }

  :where(.${FB_CLASS}[data-position="bottom-left"]) {
    position: fixed;
    left: var(--nds-fab-offset, ${spacing[16]}px);
    bottom: var(--nds-fab-offset, ${spacing[16]}px);
  }

  :where(.${FB_CLASS}[data-position="bottom-center"]) {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: var(--nds-fab-offset, ${spacing[16]}px);
  }

  :where(.${FB_CLASS}[data-position="bottom-center"]:hover) {
    transform: translate(-50%, -1px);
  }

  :where(.${FB_ICON_CLASS}) {
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  :where(.${FB_LABEL_CLASS}) {
    white-space: nowrap;
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const FAB = React.forwardRef<HTMLButtonElement, FABProps>(
  (
    {
      icon,
      label,
      color = "primary",
      size = "md",
      position = "bottom-right",
      offset,
      className,
      style,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const px = sizeConfig[size];
    const c = colorConfig[color];
    const padding = label ? `${spacing[16]}px` : "0";

    return (
      <button
        ref={ref}
        type="button"
        data-slot="root"
        data-position={position}
        data-color={color}
        data-size={size}
        aria-label={!label ? ariaLabel : undefined}
        className={cx(FB_CLASS, className)}
        style={
          {
            "--nds-fab-size": `${px}px`,
            "--nds-fab-padding": padding,
            "--nds-fab-bg": c.bg,
            "--nds-fab-fg": c.fg,
            ...(offset !== undefined && { "--nds-fab-offset": `${offset}px` }),
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        <span className={FB_ICON_CLASS} aria-hidden>
          {icon}
        </span>
        {label && <span className={FB_LABEL_CLASS}>{label}</span>}
      </button>
    );
  },
);

FAB.displayName = "FAB";
