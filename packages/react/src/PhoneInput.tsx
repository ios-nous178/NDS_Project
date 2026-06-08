import React, { useEffect, useId, useRef, useState } from "react";

/* ─── Constants ─── */

const PI_CLASS = "nds-phone-input";
const PI_ROOT_CLASS = `${PI_CLASS}__root`;
const PI_LABEL_CLASS = `${PI_CLASS}__label`;
const PI_FIELD_CLASS = `${PI_CLASS}__field`;
const PI_FIELD_WRAP_CLASS = `${PI_CLASS}__field-wrap`;
const PI_DIAL_CLASS = `${PI_CLASS}__dial`;
const PI_DIAL_CODE_CLASS = `${PI_CLASS}__dial-code`;
const PI_CHEVRON_CLASS = `${PI_CLASS}__chevron`;
const PI_INPUT_CLASS = `${PI_CLASS}__input`;
const PI_HELPER_CLASS = `${PI_CLASS}__helper`;
const PI_MENU_CLASS = `${PI_CLASS}__menu`;
const PI_MENU_ITEM_CLASS = `${PI_CLASS}__menu-item`;
const PI_MENU_CODE_CLASS = `${PI_CLASS}__menu-code`;
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
}

const DEFAULT_COUNTRIES: PhoneCountry[] = [
  { code: "KR", name: "대한민국", dialCode: "+82" },
  { code: "US", name: "United States", dialCode: "+1" },
  { code: "JP", name: "日本", dialCode: "+81" },
  { code: "CN", name: "中国", dialCode: "+86" },
  { code: "GB", name: "United Kingdom", dialCode: "+44" },
];

export interface PhoneInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "size"
> {
  /** 국가 코드 */
  countryCode: string;
  /** 국가 코드 변경 콜백 */
  onCountryChange: (code: string) => void;
  /**
   * 번호 (숫자만, 국가코드 제외). autoFormat 켜져 있으면 화면에는 하이픈이 자동으로 붙고
   * 이 값/콜백은 항상 숫자만 다룹니다 (예: "01012345678").
   */
  value: string;
  /** 번호 변경 콜백 — autoFormat 시 숫자만 전달 */
  onValueChange: (value: string) => void;
  /**
   * 입력 시 하이픈 자동 삽입 (KR/+82 모바일 3-4-4). @default true
   * 끄면 입력값을 그대로 emit (포맷 미적용).
   */
  autoFormat?: boolean;
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
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── 번호 포맷 ─── */

/** 다이얼 코드별 최대 자릿수 (KR=11, 그 외 E.164 최대 15) */
const maxDigitsFor = (dialCode: string) => (dialCode === "+82" ? 11 : 15);

const onlyDigits = (s: string) => s.replace(/\D/g, "");

/**
 * 숫자열을 다이얼 코드에 맞춰 하이픈 포맷. KR(+82) 모바일은 3-4-4(점진적),
 * 그 외 국가는 하이픈 없이 숫자 그대로 (국가별 규칙 미정의 — 안전한 패스스루).
 */
const formatPhone = (digits: string, dialCode: string): string => {
  const d = onlyDigits(digits).slice(0, maxDigitsFor(dialCode));
  if (dialCode !== "+82") return d;
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
};

/* ─── Component ─── */

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      countryCode,
      onCountryChange,
      value,
      onValueChange,
      autoFormat = true,
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
              <span className={PI_DIAL_CODE_CLASS}>{country.dialCode}</span>
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
            <input
              ref={ref}
              id={inputId}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              className={PI_INPUT_CLASS}
              value={autoFormat ? formatPhone(value, country.dialCode) : value}
              disabled={disabled}
              placeholder={
                placeholder ??
                (autoFormat && country.dialCode === "+82" ? "010-1234-5678" : "01012345678")
              }
              onChange={(e) =>
                onValueChange(
                  autoFormat
                    ? onlyDigits(e.target.value).slice(0, maxDigitsFor(country.dialCode))
                    : e.target.value,
                )
              }
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
                    <span className={PI_MENU_CODE_CLASS} aria-hidden>
                      {c.code}
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
