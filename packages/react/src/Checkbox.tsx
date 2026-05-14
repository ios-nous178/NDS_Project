import React, { useCallback, useId } from "react";
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

const CB_CLASS = "nds-checkbox";
const CB_ROOT_CLASS = `${CB_CLASS}__root`;
const CB_INPUT_CLASS = `${CB_CLASS}__input`;
const CB_INDICATOR_CLASS = `${CB_CLASS}__indicator`;
const CB_CHECK_ICON_CLASS = `${CB_CLASS}__check`;
const CB_LABEL_CLASS = `${CB_CLASS}__label`;
const CB_HELPER_CLASS = `${CB_CLASS}__helper`;
const CB_GROUP_CLASS = `${CB_CLASS}-group`;

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const checkboxStyles = `
  :where(.${CB_ROOT_CLASS}) {
    position: relative;
    display: inline-flex;
    align-items: flex-start;
    gap: ${spacing[12]}px;
    cursor: pointer;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${CB_ROOT_CLASS}[data-disabled="true"]) {
    cursor: not-allowed;
  }

  :where(.${CB_INPUT_CLASS}) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  :where(.${CB_INPUT_CLASS}:focus-visible + .${CB_INDICATOR_CLASS}) {
    box-shadow: 0 0 0 2px ${cv.bg.white}, 0 0 0 4px ${cv.borderRole.focus};
  }

  :where(.${CB_INDICATOR_CLASS}) {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    margin-top: 2px;
    border: 1.5px solid ${cv.borderRole.normal};
    border-radius: ${radius.sm}px;
    background: ${cv.bg.white};
    transition: border-color ${transition.default}, background-color ${transition.default};
  }

  :where(.${CB_INDICATOR_CLASS}[data-state="checked"]) {
    border-color: ${cv.fill.brand};
    background: ${cv.fill.brand};
  }

  :where(.${CB_ROOT_CLASS}[data-disabled="true"] .${CB_INDICATOR_CLASS}) {
    border-color: ${cv.borderRole.disabled};
    background: ${cv.bg.disabled};
  }

  :where(.${CB_ROOT_CLASS}[data-disabled="true"] .${CB_INDICATOR_CLASS}[data-state="checked"]) {
    background: ${cv.bg.disabled};
    border-color: ${cv.borderRole.disabled};
  }

  :where(.${CB_CHECK_ICON_CLASS}) {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 14px;
    height: 14px;
    opacity: 0;
    transition: opacity ${transition.default};
    color: ${cv.bg.white};
  }

  :where(.${CB_ROOT_CLASS}[data-disabled="true"] .${CB_CHECK_ICON_CLASS}) {
    color: ${cv.iconRole.disabled};
  }

  :where(.${CB_INDICATOR_CLASS}[data-state="checked"] .${CB_CHECK_ICON_CLASS}) {
    opacity: 1;
  }

  :where(.${CB_LABEL_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.text.default};
    user-select: none;
  }

  :where(.${CB_ROOT_CLASS}[data-disabled="true"] .${CB_LABEL_CLASS}) {
    color: ${cv.textRole.disabled};
  }

  :where(.${CB_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.text.disabled};
    margin-left: 32px;
  }

  :where(.${CB_HELPER_CLASS}[data-error="true"]) {
    color: ${cv.error.main};
  }

  :where(.${CB_GROUP_CLASS}) {
    display: flex;
    flex-direction: var(--nds-checkbox-group-direction, column);
    gap: var(--nds-checkbox-group-gap, var(--nds-choice-group-gap, ${spacing[12]}px));
    font-family: ${fontFamily.web};
  }

  :where(.${CB_GROUP_CLASS}[data-layout="horizontal"]) {
    --nds-checkbox-group-direction: row;
  }
`;

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
