import React from "react";
import { cv, fontFamily, radius, spacing, typeScale } from "@nudge-eap/tokens";

/* ─── Types ─── */

export interface ActionChipProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children"
> {
  /** 좌측 아이콘 (14px box 권장) */
  icon?: React.ReactNode;
  /** 라벨 텍스트 */
  label: React.ReactNode;
}

/* ─── Class names ─── */

const AC_ROOT_CLASS = "nds-action-chip";
const AC_ICON_CLASS = `${AC_ROOT_CLASS}__icon`;
const AC_LABEL_CLASS = `${AC_ROOT_CLASS}__label`;

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const actionChipStyles = `
  :where(.${AC_ROOT_CLASS}) {
    appearance: none;
    border: 0;
    display: inline-flex;
    align-items: center;
    gap: ${spacing[2]}px;
    padding: ${spacing[2]}px ${spacing[6]}px;
    border-radius: ${radius.sm}px;
    background: ${cv.fill.neutralSubtle};
    color: ${cv.textRole.subtle};
    font-family: ${fontFamily.web};
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.12s ease;
    white-space: nowrap;
  }

  :where(.${AC_ROOT_CLASS}:hover) {
    background: ${cv.surface.section};
  }

  :where(.${AC_ROOT_CLASS}:disabled) {
    cursor: not-allowed;
    opacity: 0.6;
  }

  :where(.${AC_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    color: ${cv.iconRole.normal};
  }

  :where(.${AC_LABEL_CLASS}) {
    display: inline-block;
  }
`;

/* ─── Component ─── */

export function ActionChip({ icon, label, className, ...rest }: ActionChipProps) {
  const rootClass = className ? `${AC_ROOT_CLASS} ${className}` : AC_ROOT_CLASS;
  return (
    <button type="button" className={rootClass} {...rest}>
      {icon && <span className={AC_ICON_CLASS}>{icon}</span>}
      <span className={AC_LABEL_CLASS}>{label}</span>
    </button>
  );
}
