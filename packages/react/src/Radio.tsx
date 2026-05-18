import React, { createContext, useCallback, useContext, useId } from "react";
import { cv, fontFamily, fontWeight, radius, transition, typeScale } from "@nudge-eap/tokens";

/* ─── Class names ─── */

const RADIO_CLASS = "nds-radio";
const RADIO_ROOT_CLASS = `${RADIO_CLASS}__root`;
const RADIO_INPUT_CLASS = `${RADIO_CLASS}__input`;
const RADIO_INDICATOR_CLASS = `${RADIO_CLASS}__indicator`;
const RADIO_LABEL_CLASS = `${RADIO_CLASS}__label`;
const RADIO_HELPER_CLASS = `${RADIO_CLASS}__helper`;
const RADIO_GROUP_CLASS = `${RADIO_CLASS}-group`;

// eslint-disable-next-line unused-imports/no-unused-vars
const radioStyles = `
  :where(.${RADIO_ROOT_CLASS}) {
    position: relative;
    display: inline-flex;
    align-items: flex-start;
    gap: var(--gap-comfortable);
    cursor: pointer;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${RADIO_ROOT_CLASS}[data-disabled="true"]) {
    cursor: not-allowed;
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

  :where(.${RADIO_INPUT_CLASS}:focus-visible + .${RADIO_INDICATOR_CLASS}) {
    box-shadow: 0 0 0 2px ${cv.surface.default}, 0 0 0 4px ${cv.borderRole.focus};
  }

  :where(.${RADIO_INDICATOR_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-top: 1px;
    border: 2px solid ${cv.borderRole.normal};
    border-radius: ${radius.pill}px;
    background: ${cv.surface.default};
    transition: border-color ${transition.default}, background-color ${transition.default};
  }

  :where(.${RADIO_INDICATOR_CLASS}[data-checked="true"]) {
    border-color: ${cv.fill.brand};
  }

  :where(.${RADIO_ROOT_CLASS}[data-disabled="true"] .${RADIO_INDICATOR_CLASS}) {
    border-color: ${cv.borderRole.disabled};
    background: ${cv.surface.disabled};
  }

  :where(.${RADIO_ROOT_CLASS}[data-disabled="true"] .${RADIO_INDICATOR_CLASS}[data-checked="true"]) {
    border-color: ${cv.borderRole.disabled};
  }

  :where(.${RADIO_CLASS}__dot) {
    display: block;
    width: 10px;
    height: 10px;
    border-radius: ${radius.pill}px;
    background: ${cv.fill.brand};
    opacity: 0;
    transform: scale(0);
    transition: opacity ${transition.default}, transform ${transition.default},
      background-color ${transition.default};
  }

  :where(.${RADIO_INDICATOR_CLASS}[data-checked="true"] .${RADIO_CLASS}__dot) {
    opacity: 1;
    transform: scale(1);
  }

  :where(.${RADIO_ROOT_CLASS}[data-disabled="true"] .${RADIO_CLASS}__dot) {
    background: ${cv.borderRole.disabled};
  }

  :where(.${RADIO_LABEL_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
    user-select: none;
  }

  :where(.${RADIO_ROOT_CLASS}[data-disabled="true"] .${RADIO_LABEL_CLASS}) {
    color: ${cv.textRole.disabled};
  }

  :where(.${RADIO_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.muted};
    margin-left: 32px;
  }

  :where(.${RADIO_HELPER_CLASS}[data-error="true"]) {
    color: ${cv.textRole.statusError};
  }

  :where(.${RADIO_GROUP_CLASS}) {
    display: flex;
    flex-direction: var(--nds-radio-group-direction, column);
    gap: var(--nds-radio-group-gap, var(--nds-choice-group-gap, var(--gap-comfortable)));
    font-family: ${fontFamily.web};
  }

  :where(.${RADIO_GROUP_CLASS}[data-layout="horizontal"]) {
    --nds-radio-group-direction: row;
  }
`;

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
