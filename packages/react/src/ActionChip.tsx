import React from "react";

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
