import React, { createContext, useCallback, useContext, useId } from "react";

/* ─── Class names ─── */

const RADIO_CLASS = "nds-radio";
const RADIO_ROOT_CLASS = `${RADIO_CLASS}__root`;
const RADIO_INPUT_CLASS = `${RADIO_CLASS}__input`;
const RADIO_INDICATOR_CLASS = `${RADIO_CLASS}__indicator`;
const RADIO_LABEL_CLASS = `${RADIO_CLASS}__label`;
const RADIO_HELPER_CLASS = `${RADIO_CLASS}__helper`;
const RADIO_GROUP_CLASS = `${RADIO_CLASS}-group`;
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

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
    );
  },
);
Radio.displayName = "Radio";

/* ────────────────────────────────────
   RadioGroup
   ──────────────────────────────────── */

export type RadioGroupLayout = "vertical" | "horizontal";

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
  layout?: RadioGroupLayout;
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
        ...(gap !== undefined &&
          ({
            "--nds-radio-group-gap": `${gap}px`,
            "--nds-choice-group-gap": `${gap}px`,
          } as React.CSSProperties)),
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
