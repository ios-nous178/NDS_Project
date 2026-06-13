import React, { useId, useRef, useState } from "react";

import { RemoveIcon } from "./internal/RemoveIcon.js";

/* ─── Constants ─── */

const TI_CLASS = "nds-tag-input";
const TI_ROOT_CLASS = `${TI_CLASS}__root`;
const TI_LABEL_CLASS = `${TI_CLASS}__label`;
const TI_FIELD_CLASS = `${TI_CLASS}__field`;
const TI_ROW_CLASS = `${TI_CLASS}__row`;
const TI_ADD_CLASS = `${TI_CLASS}__add`;
const TI_CHIPS_CLASS = `${TI_CLASS}__chips`;
const TI_TAG_CLASS = `${TI_CLASS}__tag`;
const TI_REMOVE_CLASS = `${TI_CLASS}__remove`;
const TI_INPUT_CLASS = `${TI_CLASS}__input`;
const TI_HELPER_CLASS = `${TI_CLASS}__helper`;

/* ─── Types ─── */

/**
 * - `stacked` (기본) — 입력칸 + 우측 추가 버튼, 칩은 **아래** wrap. 이메일 초대/수신자 등.
 * - `inline`        — 칩이 입력칸 **안쪽**에 인라인(tokenfield). 해시태그 등 (구 기본 동작).
 */
export type TagInputVariant = "stacked" | "inline";

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const AddIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <path d="M10 4.5v11M4.5 10h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/* ─── Component ─── */

export interface TagInputProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "onInvalid" | "prefix"
> {
  /** 태그 배열 (controlled) */
  value: string[];
  /** 변경 콜백 */
  onValueChange: (tags: string[]) => void;
  /** 레이아웃 변형. 기본 stacked(입력+추가버튼, 칩 아래). 해시태그식 인라인은 inline. */
  variant?: TagInputVariant;
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
  /**
   * 태그 접두 문자. 기본 "" (없음 — 이메일/자유 토큰). 해시태그식이면 "#".
   * 표시 시 prefix 를 붙이고, 입력값에 prefix 가 있으면 저장 전 제거한다.
   */
  prefix?: string;
  /** 유효성 검사 (정규식 문자열). 통과 못 하면 추가 안 됨 + onInvalid 호출. */
  pattern?: string;
  /** 유효성 검사 함수 (pattern 보다 우선). 통과 못 하면 추가 안 됨 + onInvalid 호출. */
  validate?: (value: string) => boolean;
  /** 유효성 실패 시 호출 (입력값 유지) */
  onInvalid?: (value: string) => void;
  /** 추가 버튼 aria-label (variant="stacked") */
  addButtonLabel?: string;
  /** 가로 가득 */
  fullWidth?: boolean;
  /** 비활성화 */
  disabled?: boolean;
}

export const TagInput = React.forwardRef<HTMLDivElement, TagInputProps>(
  (
    {
      value,
      onValueChange,
      variant = "stacked",
      label,
      placeholder = "입력 후 Enter",
      helperText,
      error = false,
      maxTags,
      onMaxReached,
      allowDuplicates = false,
      prefix = "",
      pattern,
      validate,
      onInvalid,
      addButtonLabel = "추가",
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

    const isValid = (val: string): boolean => {
      if (validate) return validate(val);
      if (pattern) {
        try {
          return new RegExp(pattern).test(val);
        } catch {
          return true;
        }
      }
      return true;
    };

    const atMax = maxTags !== undefined && value.length >= maxTags;
    const canAdd = draft.trim() !== "" && !disabled && !atMax;

    const addTag = (raw: string) => {
      let tag = raw.trim();
      if (prefix && tag.startsWith(prefix)) tag = tag.slice(prefix.length);
      if (!tag) return;
      if (!isValid(tag)) {
        onInvalid?.(tag);
        return;
      }
      if (!allowDuplicates && value.includes(tag)) {
        setDraft("");
        return;
      }
      if (atMax) {
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
      // 한글 IME 조합 중 Enter 는 무시 — 조합 확정 전에 처리하면 마지막 글자가 중복 입력됨.
      if (e.nativeEvent.isComposing) return;
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addTag(draft);
      } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
        removeAt(value.length - 1);
      }
    };

    const chips = value.map((tag, i) => (
      <span key={`${tag}-${i}`} className={TI_TAG_CLASS}>
        {prefix}
        {tag}
        {!disabled && (
          <button
            type="button"
            className={TI_REMOVE_CLASS}
            aria-label={`${tag} 제거`}
            onClick={() => removeAt(i)}
          >
            <RemoveIcon />
          </button>
        )}
      </span>
    ));

    return (
      <div
        ref={ref}
        data-slot="root"
        data-variant={variant}
        data-full-width={fullWidth ? "true" : "false"}
        className={cx(TI_ROOT_CLASS, className)}
        {...rest}
      >
        {label && (
          <label htmlFor={inputId} className={TI_LABEL_CLASS}>
            {label}
          </label>
        )}

        {variant === "inline" ? (
          <div
            className={TI_FIELD_CLASS}
            data-error={error ? "true" : "false"}
            data-disabled={disabled ? "true" : "false"}
            onClick={() => inputRef.current?.focus()}
          >
            {chips}
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
        ) : (
          <>
            <div className={TI_ROW_CLASS}>
              <input
                ref={inputRef}
                id={inputId}
                className={TI_INPUT_CLASS}
                data-error={error ? "true" : "false"}
                value={draft}
                placeholder={placeholder}
                disabled={disabled}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKey}
              />
              <button
                type="button"
                className={TI_ADD_CLASS}
                aria-label={addButtonLabel}
                disabled={!canAdd}
                onClick={() => addTag(draft)}
              >
                <AddIcon />
              </button>
            </div>
            {value.length > 0 && (
              <div data-slot="chips" className={TI_CHIPS_CLASS}>
                {chips}
              </div>
            )}
          </>
        )}

        {helperText && (
          <p className={TI_HELPER_CLASS + " nds-helper-text"} data-error={error ? "true" : "false"}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

TagInput.displayName = "TagInput";
