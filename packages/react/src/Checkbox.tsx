import React, { createContext, useCallback, useContext, useId } from "react";
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
const CB_LABEL_CLASS = `${CB_CLASS}__label`;
const CB_HELPER_CLASS = `${CB_CLASS}__helper`;
const CB_GROUP_CLASS = `${CB_CLASS}-group`;

const RADIO_CLASS = "nds-radio";
const RADIO_ROOT_CLASS = `${RADIO_CLASS}__root`;
const RADIO_INPUT_CLASS = `${RADIO_CLASS}__input`;
const RADIO_INDICATOR_CLASS = `${RADIO_CLASS}__indicator`;
const RADIO_LABEL_CLASS = `${RADIO_CLASS}__label`;
const RADIO_HELPER_CLASS = `${RADIO_CLASS}__helper`;
const RADIO_GROUP_CLASS = `${RADIO_CLASS}-group`;

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const choiceStyles = `
  /* ─── Checkbox ─── */

  :where(.${CB_ROOT_CLASS}) {
    display: inline-flex;
    align-items: flex-start;
    gap: ${spacing[8]}px;
    cursor: pointer;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${CB_ROOT_CLASS}[data-disabled="true"]) {
    cursor: not-allowed;
    opacity: 0.5;
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

  :where(.${CB_INDICATOR_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-top: 1px;
    border: 1.5px solid ${cv.border.default};
    border-radius: ${radius.sm}px;
    background: ${cv.bg.white};
    transition: border-color ${transition.default}, background-color ${transition.default};
  }

  :where(.${CB_INDICATOR_CLASS}[data-checked="true"]) {
    border-color: ${cv.primary.main};
    background: ${cv.primary.main};
  }

  :where(.${CB_INDICATOR_CLASS} svg) {
    width: 14px;
    height: 14px;
    opacity: 0;
    transition: opacity ${transition.default};
  }

  :where(.${CB_INDICATOR_CLASS}[data-checked="true"] svg) {
    opacity: 1;
  }

  :where(.${CB_LABEL_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.text.default};
    user-select: none;
  }

  :where(.${CB_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.text.disabled};
    margin-left: 28px;
  }

  :where(.${CB_HELPER_CLASS}[data-error="true"]) {
    color: ${cv.error.main};
  }

  /* ─── Radio ─── */

  :where(.${RADIO_ROOT_CLASS}) {
    display: inline-flex;
    align-items: flex-start;
    gap: ${spacing[8]}px;
    cursor: pointer;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${RADIO_ROOT_CLASS}[data-disabled="true"]) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  :where(.${RADIO_INPUT_CLASS}) {
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

  :where(.${RADIO_INDICATOR_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-top: 1px;
    border: 1.5px solid ${cv.border.default};
    border-radius: ${radius.pill}px;
    background: ${cv.bg.white};
    transition: border-color ${transition.default};
  }

  :where(.${RADIO_INDICATOR_CLASS}[data-checked="true"]) {
    border-color: ${cv.primary.main};
  }

  :where(.${RADIO_CLASS}__dot) {
    display: block;
    width: 10px;
    height: 10px;
    border-radius: ${radius.pill}px;
    background: ${cv.primary.main};
    opacity: 0;
    transform: scale(0);
    transition: opacity ${transition.default}, transform ${transition.default};
  }

  :where(.${RADIO_INDICATOR_CLASS}[data-checked="true"] .${RADIO_CLASS}__dot) {
    opacity: 1;
    transform: scale(1);
  }

  :where(.${RADIO_LABEL_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.text.default};
    user-select: none;
  }

  :where(.${RADIO_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.text.disabled};
    margin-left: 28px;
  }

  :where(.${RADIO_HELPER_CLASS}[data-error="true"]) {
    color: ${cv.error.main};
  }

  /* ─── Groups ─── */

  :where(.${CB_GROUP_CLASS}),
  :where(.${RADIO_GROUP_CLASS}) {
    display: flex;
    flex-direction: var(--nds-choice-group-direction, column);
    gap: var(--nds-choice-group-gap, ${spacing[12]}px);
    font-family: ${fontFamily.web};
  }

  :where(.${CB_GROUP_CLASS}[data-layout="horizontal"]),
  :where(.${RADIO_GROUP_CLASS}[data-layout="horizontal"]) {
    --nds-choice-group-direction: row;
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

    return (
      <>
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
            data-checked={checked ? "true" : "false"}
            className={CB_INDICATOR_CLASS}
            aria-hidden="true"
          >
            <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 7L6 10L11 4"
                stroke="white"
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
      </>
    );
  },
);
Checkbox.displayName = "Checkbox";

/* ────────────────────────────────────
   Radio
   ──────────────────────────────────── */

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** 선택 상태 */
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

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
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

    return (
      <>
        <label
          data-slot="root"
          data-disabled={disabled ? "true" : "false"}
          className={cx(RADIO_ROOT_CLASS, className)}
          htmlFor={inputId}
        >
          <input
            ref={ref}
            type="radio"
            id={inputId}
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            className={RADIO_INPUT_CLASS}
            {...rest}
          />
          <span
            data-slot="indicator"
            data-checked={checked ? "true" : "false"}
            className={RADIO_INDICATOR_CLASS}
            aria-hidden="true"
          >
            <span className={`${RADIO_CLASS}__dot`} />
          </span>
          {label && (
            <span data-slot="label" className={RADIO_LABEL_CLASS}>
              {label}
            </span>
          )}
        </label>
      </>
    );
  },
);
Radio.displayName = "Radio";

/* ────────────────────────────────────
   CheckboxGroup
   ──────────────────────────────────── */

export type ChoiceGroupLayout = "vertical" | "horizontal";

export interface CheckboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 방향 */
  layout?: ChoiceGroupLayout;
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
        ...(gap !== undefined && ({ "--nds-choice-group-gap": `${gap}px` } as React.CSSProperties)),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  ),
);
CheckboxGroup.displayName = "CheckboxGroup";

/* ────────────────────────────────────
   RadioGroup
   ──────────────────────────────────── */

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  onValueChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(undefined);

export const useRadioGroupContext = () => useContext(RadioGroupContext);

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 그룹 name */
  name: string;
  /** 선택된 값 */
  value?: string;
  /** 값 변경 콜백 */
  onValueChange: (value: string) => void;
  /** 방향 */
  layout?: ChoiceGroupLayout;
  /** 간격 */
  gap?: number;
  /** 라디오 아이템들 (RadioGroupItem) */
  children: React.ReactNode;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onValueChange,
  layout = "vertical",
  gap,
  children,
  className,
  style,
  ...rest
}) => (
  <RadioGroupContext.Provider value={{ name, value, onValueChange }}>
    <div
      data-slot="group"
      data-layout={layout}
      role="radiogroup"
      className={cx(RADIO_GROUP_CLASS, className)}
      style={{
        ...(gap !== undefined && ({ "--nds-choice-group-gap": `${gap}px` } as React.CSSProperties)),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  </RadioGroupContext.Provider>
);

/* ────────────────────────────────────
   RadioGroupItem — RadioGroup 전용
   ──────────────────────────────────── */

export interface RadioGroupItemProps extends Omit<
  RadioProps,
  "checked" | "name" | "onCheckedChange" | "onChange"
> {
  /** 이 아이템의 값 */
  value: string;
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ value: itemValue, ...rest }, ref) => {
    const group = useRadioGroupContext();
    if (!group) throw new Error("RadioGroupItem must be used within RadioGroup");

    return (
      <Radio
        ref={ref}
        name={group.name}
        checked={group.value === itemValue}
        value={itemValue}
        onCheckedChange={(checked) => {
          if (checked) group.onValueChange(itemValue);
        }}
        {...rest}
      />
    );
  },
);
RadioGroupItem.displayName = "RadioGroupItem";
