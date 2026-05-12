import React, { useEffect, useId, useRef, useState } from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  shadow,
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
const PI_FIELD_WRAP_CLASS = `${PI_CLASS}__field-wrap`;
const PI_DIAL_CLASS = `${PI_CLASS}__dial`;
const PI_CHEVRON_CLASS = `${PI_CLASS}__chevron`;
const PI_FLAG_CLASS = `${PI_CLASS}__flag`;
const PI_DIVIDER_CLASS = `${PI_CLASS}__divider`;
const PI_INPUT_CLASS = `${PI_CLASS}__input`;
const PI_HELPER_CLASS = `${PI_CLASS}__helper`;
const PI_MENU_CLASS = `${PI_CLASS}__menu`;
const PI_MENU_ITEM_CLASS = `${PI_CLASS}__menu-item`;
const PI_MENU_NAME_CLASS = `${PI_CLASS}__menu-name`;
const PI_MENU_DIAL_CLASS = `${PI_CLASS}__menu-dial`;

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

  :where(.${PI_FIELD_WRAP_CLASS}) {
    position: relative;
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
    gap: ${spacing[6]}px;
    padding: 0 ${spacing[12]}px;
    border: none;
    background: transparent;
    color: ${cv.text.default};
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.medium};
    cursor: pointer;
    flex-shrink: 0;
    transition: background-color ${transition.default};
  }

  :where(.${PI_DIAL_CLASS}:hover:not(:disabled)) {
    background: ${cv.bg.coolGrayLighter};
  }

  :where(.${PI_DIAL_CLASS}:focus-visible) {
    outline: 2px solid ${cv.primary.main};
    outline-offset: -2px;
  }

  :where(.${PI_DIAL_CLASS}:disabled) { cursor: not-allowed; opacity: 0.6; }

  :where(.${PI_FLAG_CLASS}) {
    font-size: 18px;
    line-height: 1;
  }

  :where(.${PI_CHEVRON_CLASS}) {
    color: ${cv.text.subtle};
    transition: transform ${transition.default};
    display: inline-flex;
  }

  :where(.${PI_DIAL_CLASS}[aria-expanded="true"]) .${PI_CHEVRON_CLASS} {
    transform: rotate(180deg);
  }

  :where(.${PI_MENU_CLASS}) {
    position: absolute;
    top: calc(100% + ${spacing[4]}px);
    left: 0;
    z-index: 10;
    min-width: 240px;
    max-height: 280px;
    overflow-y: auto;
    padding: ${spacing[4]}px;
    background: ${cv.bg.white};
    border: 1px solid ${cv.border.light};
    border-radius: ${radius.md}px;
    box-shadow: ${shadow.md};
    list-style: none;
    margin: 0;
  }

  :where(.${PI_MENU_ITEM_CLASS}) {
    display: flex;
    align-items: center;
    gap: ${spacing[8]}px;
    width: 100%;
    padding: ${spacing[8]}px ${spacing[10]}px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: ${radius.sm}px;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    color: ${cv.text.default};
    text-align: left;
    transition: background-color ${transition.default};
  }

  :where(.${PI_MENU_ITEM_CLASS}:hover),
  :where(.${PI_MENU_ITEM_CLASS}[data-selected="true"]) {
    background: ${cv.bg.coolGrayLighter};
  }

  :where(.${PI_MENU_NAME_CLASS}) {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${PI_MENU_DIAL_CLASS}) {
    color: ${cv.text.subtle};
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
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
    const menuId = useId();
    const country = countries.find((c) => c.code === countryCode) ?? countries[0];
    const wrapRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
      if (!open) return;
      const onDocClick = (e: MouseEvent) => {
        if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("mousedown", onDocClick);
        document.removeEventListener("keydown", onKey);
      };
    }, [open]);

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
        <div ref={wrapRef} className={PI_FIELD_WRAP_CLASS}>
          <div className={PI_FIELD_CLASS} data-error={error ? "true" : "false"}>
            <button
              type="button"
              className={PI_DIAL_CLASS}
              disabled={disabled}
              onClick={() => setOpen((v) => !v)}
              aria-label={`국가 코드: ${country.name} ${country.dialCode}`}
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-controls={menuId}
            >
              <span className={PI_FLAG_CLASS} aria-hidden>
                {country.flag}
              </span>
              <span>{country.dialCode}</span>
              <span className={PI_CHEVRON_CLASS} aria-hidden>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
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
          {open && (
            <ul id={menuId} role="listbox" className={PI_MENU_CLASS}>
              {countries.map((c) => (
                <li key={c.code} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={c.code === countryCode}
                    data-selected={c.code === countryCode ? "true" : "false"}
                    className={PI_MENU_ITEM_CLASS}
                    onClick={() => {
                      onCountryChange(c.code);
                      setOpen(false);
                    }}
                  >
                    <span className={PI_FLAG_CLASS} aria-hidden>
                      {c.flag}
                    </span>
                    <span className={PI_MENU_NAME_CLASS}>{c.name}</span>
                    <span className={PI_MENU_DIAL_CLASS}>{c.dialCode}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
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
