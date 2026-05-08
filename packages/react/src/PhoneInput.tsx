import React, { useId } from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  sizing,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

/* ─── Constants ─── */

const PI_CLASS = "nds-phone-input";
const PI_ROOT_CLASS = `${PI_CLASS}__root`;
const PI_LABEL_CLASS = `${PI_CLASS}__label`;
const PI_FIELD_CLASS = `${PI_CLASS}__field`;
const PI_DIAL_CLASS = `${PI_CLASS}__dial`;
const PI_FLAG_CLASS = `${PI_CLASS}__flag`;
const PI_DIVIDER_CLASS = `${PI_CLASS}__divider`;
const PI_INPUT_CLASS = `${PI_CLASS}__input`;
const PI_HELPER_CLASS = `${PI_CLASS}__helper`;

/* ─── Types ─── */

export interface PhoneCountry {
  /** ISO 코드 (KR, US 등) */
  code: string;
  /** 국가 명 */
  name: string;
  /** 다이얼 코드 ("+82") */
  dialCode: string;
  /** 이모지 국기 */
  flag: string;
}

const DEFAULT_COUNTRIES: PhoneCountry[] = [
  { code: "KR", name: "대한민국", dialCode: "+82", flag: "🇰🇷" },
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "JP", name: "日本", dialCode: "+81", flag: "🇯🇵" },
  { code: "CN", name: "中国", dialCode: "+86", flag: "🇨🇳" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
];

export interface PhoneInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "size"
> {
  /** 국가 코드 */
  countryCode: string;
  /** 국가 코드 변경 콜백 */
  onCountryChange: (code: string) => void;
  /** 번호 (국가코드 제외) */
  value: string;
  /** 번호 변경 콜백 */
  onValueChange: (value: string) => void;
  /** 라벨 */
  label?: React.ReactNode;
  /** 헬퍼 텍스트 */
  helperText?: React.ReactNode;
  /** 에러 */
  error?: boolean;
  /** 가능한 국가 목록 (기본 KR/US/JP/CN/GB) */
  countries?: PhoneCountry[];
  /** 가로 가득 */
  fullWidth?: boolean;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const phoneInputStyles = `
  :where(.${PI_ROOT_CLASS}) {
    display: inline-flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${PI_ROOT_CLASS}[data-full-width="true"]) { width: 100%; }

  :where(.${PI_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.text.default};
  }

  :where(.${PI_FIELD_CLASS}) {
    display: flex;
    align-items: stretch;
    height: ${sizing.input.default}px;
    border: 1px solid ${cv.border.default};
    border-radius: ${radius.md}px;
    background: ${cv.bg.white};
    overflow: hidden;
    transition: border-color ${transition.default};
  }

  :where(.${PI_FIELD_CLASS}:focus-within) { border-color: ${cv.primary.main}; }

  :where(.${PI_FIELD_CLASS}[data-error="true"]) { border-color: var(--color-semantic-error-main); }

  :where(.${PI_DIAL_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[4]}px;
    padding: 0 ${spacing[12]}px;
    border: none;
    background: transparent;
    color: ${cv.text.default};
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.medium};
    cursor: pointer;
    flex-shrink: 0;
    appearance: none;
  }

  :where(.${PI_DIAL_CLASS}:focus-visible) {
    outline: 2px solid ${cv.primary.main};
    outline-offset: -2px;
  }

  :where(.${PI_FLAG_CLASS}) {
    font-size: 18px;
    line-height: 1;
  }

  :where(.${PI_DIVIDER_CLASS}) {
    width: 1px;
    background: ${cv.border.default};
    flex-shrink: 0;
  }

  :where(.${PI_INPUT_CLASS}) {
    flex: 1;
    min-width: 0;
    padding: 0 ${spacing[12]}px;
    border: none;
    background: transparent;
    outline: none;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.text.default};
  }

  :where(.${PI_INPUT_CLASS}::placeholder) { color: ${cv.text.placeholder}; }

  :where(.${PI_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.text.subtle};
  }

  :where(.${PI_HELPER_CLASS}[data-error="true"]) { color: var(--color-semantic-error-main); }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      countryCode,
      onCountryChange,
      value,
      onValueChange,
      label,
      helperText,
      error = false,
      countries = DEFAULT_COUNTRIES,
      fullWidth = false,
      className,
      placeholder,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const inputId = useId();
    const country = countries.find((c) => c.code === countryCode) ?? countries[0];

    return (
      <div
        data-slot="root"
        data-full-width={fullWidth ? "true" : "false"}
        className={cx(PI_ROOT_CLASS, className)}
      >
        {label && (
          <label htmlFor={inputId} className={PI_LABEL_CLASS}>
            {label}
          </label>
        )}
        <div className={PI_FIELD_CLASS} data-error={error ? "true" : "false"}>
          <select
            className={PI_DIAL_CLASS}
            value={countryCode}
            disabled={disabled}
            onChange={(e) => onCountryChange(e.target.value)}
            aria-label="국가 코드"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.dialCode} ({c.name})
              </option>
            ))}
          </select>
          <span className={PI_DIVIDER_CLASS} aria-hidden />
          <input
            ref={ref}
            id={inputId}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            className={PI_INPUT_CLASS}
            value={value}
            disabled={disabled}
            placeholder={placeholder ?? "01012345678"}
            onChange={(e) => onValueChange(e.target.value)}
            {...rest}
          />
        </div>
        {helperText && (
          <p className={PI_HELPER_CLASS} data-error={error ? "true" : "false"}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";
