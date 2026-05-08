import React, { useId, useRef, useState } from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

/* ─── Constants ─── */

const TI_CLASS = "nds-tag-input";
const TI_ROOT_CLASS = `${TI_CLASS}__root`;
const TI_LABEL_CLASS = `${TI_CLASS}__label`;
const TI_FIELD_CLASS = `${TI_CLASS}__field`;
const TI_TAG_CLASS = `${TI_CLASS}__tag`;
const TI_REMOVE_CLASS = `${TI_CLASS}__remove`;
const TI_INPUT_CLASS = `${TI_CLASS}__input`;
const TI_HELPER_CLASS = `${TI_CLASS}__helper`;

/* ─── Types ─── */

export interface TagInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 태그 배열 (controlled) */
  value: string[];
  /** 변경 콜백 */
  onValueChange: (tags: string[]) => void;
  /** 라벨 */
  label?: React.ReactNode;
  /** 자리표시자 */
  placeholder?: string;
  /** 헬퍼 / 에러 텍스트 */
  helperText?: React.ReactNode;
  /** 에러 상태 */
  error?: boolean;
  /** 최대 태그 수 */
  maxTags?: number;
  /** 최대 태그 수 도달 시 호출 (alert 등) */
  onMaxReached?: () => void;
  /** 중복 허용 (기본 false) */
  allowDuplicates?: boolean;
  /** 가로 가득 */
  fullWidth?: boolean;
  /** 비활성화 */
  disabled?: boolean;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const tiStyles = `
  :where(.${TI_ROOT_CLASS}) {
    display: inline-flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${TI_ROOT_CLASS}[data-full-width="true"]) { width: 100%; }

  :where(.${TI_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.text.default};
  }

  :where(.${TI_FIELD_CLASS}) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${spacing[4]}px;
    min-height: 48px;
    padding: ${spacing[8]}px ${spacing[12]}px;
    border: 1px solid ${cv.border.default};
    border-radius: ${radius.md}px;
    background: ${cv.bg.white};
    transition: border-color ${transition.default};
    cursor: text;
  }

  :where(.${TI_FIELD_CLASS}:focus-within) { border-color: ${cv.primary.main}; }
  :where(.${TI_FIELD_CLASS}[data-error="true"]) { border-color: var(--color-semantic-error-main); }
  :where(.${TI_FIELD_CLASS}[data-disabled="true"]) {
    background: ${cv.bg.coolGray};
    cursor: not-allowed;
  }

  :where(.${TI_TAG_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[4]}px;
    height: 28px;
    padding: 0 ${spacing[8]}px;
    border-radius: 9999px;
    background: var(--color-semantic-primary-bg, #EBF1FF);
    color: ${cv.primary.main};
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
  }

  :where(.${TI_REMOVE_CLASS}) {
    width: 16px;
    height: 16px;
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    opacity: 0.7;
    transition: opacity ${transition.default};
  }

  :where(.${TI_REMOVE_CLASS}:hover) { opacity: 1; }

  :where(.${TI_INPUT_CLASS}) {
    flex: 1;
    min-width: 80px;
    border: none;
    background: transparent;
    outline: none;
    padding: 4px 0;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    color: ${cv.text.default};
  }

  :where(.${TI_INPUT_CLASS}::placeholder) { color: ${cv.text.placeholder}; }

  :where(.${TI_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.text.subtle};
  }

  :where(.${TI_HELPER_CLASS}[data-error="true"]) { color: var(--color-semantic-error-main); }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const TagInput = React.forwardRef<HTMLDivElement, TagInputProps>(
  (
    {
      value,
      onValueChange,
      label,
      placeholder = "태그 입력 후 Enter",
      helperText,
      error = false,
      maxTags,
      onMaxReached,
      allowDuplicates = false,
      fullWidth = false,
      disabled = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const [draft, setDraft] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const inputId = useId();

    const addTag = (raw: string) => {
      const tag = raw.trim().replace(/^#/, "");
      if (!tag) return;
      if (!allowDuplicates && value.includes(tag)) {
        setDraft("");
        return;
      }
      if (maxTags !== undefined && value.length >= maxTags) {
        onMaxReached?.();
        return;
      }
      onValueChange([...value, tag]);
      setDraft("");
    };

    const removeAt = (idx: number) => {
      onValueChange(value.filter((_, i) => i !== idx));
    };

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addTag(draft);
      } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
        removeAt(value.length - 1);
      }
    };

    return (
      <div
        ref={ref}
        data-slot="root"
        data-full-width={fullWidth ? "true" : "false"}
        className={cx(TI_ROOT_CLASS, className)}
      >
        {label && (
          <label htmlFor={inputId} className={TI_LABEL_CLASS}>
            {label}
          </label>
        )}
        <div
          className={TI_FIELD_CLASS}
          data-error={error ? "true" : "false"}
          data-disabled={disabled ? "true" : "false"}
          onClick={() => inputRef.current?.focus()}
        >
          {value.map((tag, i) => (
            <span key={`${tag}-${i}`} className={TI_TAG_CLASS}>
              #{tag}
              {!disabled && (
                <button
                  type="button"
                  className={TI_REMOVE_CLASS}
                  aria-label={`${tag} 제거`}
                  onClick={() => removeAt(i)}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                    <path
                      d="M2 2l6 6M8 2l-6 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </span>
          ))}
          <input
            ref={inputRef}
            id={inputId}
            className={TI_INPUT_CLASS}
            value={draft}
            placeholder={value.length === 0 ? placeholder : ""}
            disabled={disabled}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKey}
            onBlur={() => addTag(draft)}
          />
        </div>
        {helperText && (
          <p className={TI_HELPER_CLASS} data-error={error ? "true" : "false"}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

TagInput.displayName = "TagInput";
