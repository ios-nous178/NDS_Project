import React, { useCallback, useId } from "react";

/* ─── Class names ─── */

const CB_CLASS = "nds-checkbox";
const CB_ROOT_CLASS = `${CB_CLASS}__root`;
const CB_INPUT_CLASS = `${CB_CLASS}__input`;
const CB_INDICATOR_CLASS = `${CB_CLASS}__indicator`;
const CB_CHECK_ICON_CLASS = `${CB_CLASS}__check`;
const CB_LABEL_CLASS = `${CB_CLASS}__label`;
const CB_HELPER_CLASS = `${CB_CLASS}__helper`;
const CB_GROUP_CLASS = `${CB_CLASS}-group`;
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ────────────────────────────────────
   Checkbox
   ──────────────────────────────────── */

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** 체크 상태 */
  checked?: boolean;
  /** 변경 콜백 */
  onCheckedChange?: (checked: boolean) => void;
  /** 라벨 */
  label?: React.ReactNode;
  /** 비활성화 */
  disabled?: boolean;
  /** 루트 className */
  className?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked = false,
      onCheckedChange,
      label,
      disabled = false,
      className,
      onChange,
      id: idProp,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = idProp ?? generatedId;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onCheckedChange?.(e.target.checked);
        onChange?.(e);
      },
      [onCheckedChange, onChange],
    );

    const state = checked ? "checked" : "unchecked";

    return (
      <label
        data-slot="root"
        data-disabled={disabled ? "true" : "false"}
        className={cx(CB_ROOT_CLASS, className)}
        htmlFor={inputId}
      >
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className={CB_INPUT_CLASS}
          {...rest}
        />
        <span
          data-slot="indicator"
          data-state={state}
          data-checked={checked ? "true" : "false"}
          className={CB_INDICATOR_CLASS}
          aria-hidden="true"
        >
          <svg
            className={CB_CHECK_ICON_CLASS}
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 7L6 10L11 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {label && (
          <span data-slot="label" className={CB_LABEL_CLASS}>
            {label}
          </span>
        )}
      </label>
    );
  },
);
Checkbox.displayName = "Checkbox";

/* ────────────────────────────────────
   CheckboxGroup
   ──────────────────────────────────── */

export type CheckboxGroupLayout = "vertical" | "horizontal";

export interface CheckboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 방향 */
  layout?: CheckboxGroupLayout;
  /** 간격 */
  gap?: number;
  /** 체크박스 아이템들 */
  children: React.ReactNode;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = React.memo(
  ({ layout = "vertical", gap, children, className, style, ...rest }) => (
    <div
      data-slot="group"
      data-layout={layout}
      role="group"
      className={cx(CB_GROUP_CLASS, className)}
      style={{
        ...(gap !== undefined &&
          ({
            "--nds-checkbox-group-gap": `${gap}px`,
            "--nds-choice-group-gap": `${gap}px`,
          } as React.CSSProperties)),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  ),
);
CheckboxGroup.displayName = "CheckboxGroup";
