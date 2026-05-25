import React, { useId, useRef, useState } from "react";

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
