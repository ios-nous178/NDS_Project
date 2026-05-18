import React, { useCallback, useRef, useState } from "react";
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

const FU_CLASS = "nds-file-upload";
const FU_ROOT_CLASS = `${FU_CLASS}__root`;
const FU_DROP_CLASS = `${FU_CLASS}__drop`;
const FU_HIDDEN_INPUT_CLASS = `${FU_CLASS}__input`;
const FU_ICON_CLASS = `${FU_CLASS}__icon`;
const FU_TEXT_CLASS = `${FU_CLASS}__text`;
const FU_HINT_CLASS = `${FU_CLASS}__hint`;
const FU_LIST_CLASS = `${FU_CLASS}__list`;
const FU_ITEM_CLASS = `${FU_CLASS}__item`;
const FU_ITEM_NAME_CLASS = `${FU_CLASS}__item-name`;
const FU_ITEM_SIZE_CLASS = `${FU_CLASS}__item-size`;
const FU_REMOVE_CLASS = `${FU_CLASS}__remove`;
const FU_ERROR_CLASS = `${FU_CLASS}__error`;

// eslint-disable-next-line unused-imports/no-unused-vars
const fileUploadStyles = `
  :where(.${FU_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-comfortable);
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${FU_DROP_CLASS}) {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--gap-default);
    padding: var(--inset-modal) var(--inset-card-large);
    background: ${cv.surface.page};
    border: 1.5px dashed ${cv.borderRole.normal};
    border-radius: ${radius.lg}px;
    cursor: pointer;
    transition: background-color ${transition.default}, border-color ${transition.default};
    text-align: center;
  }

  :where(.${FU_DROP_CLASS}:hover) {
    background: ${cv.surface.brandSubtle};
    border-color: ${"#91CAF6"};
  }

  :where(.${FU_DROP_CLASS}[data-dragover="true"]) {
    background: ${cv.surface.brandSubtle};
    border-color: ${cv.borderRole.brand};
  }

  :where(.${FU_DROP_CLASS}[data-disabled="true"]) {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  :where(.${FU_HIDDEN_INPUT_CLASS}) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  :where(.${FU_ICON_CLASS}) {
    color: ${cv.iconRole.normal};
  }

  :where(.${FU_TEXT_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
    margin: 0;
  }

  :where(.${FU_TEXT_CLASS}) strong {
    color: ${cv.textRole.brand};
  }

  :where(.${FU_HINT_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${FU_LIST_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[6]}px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  :where(.${FU_ITEM_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--gap-default);
    padding: var(--inset-chip) var(--inset-input);
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
  }

  :where(.${FU_ITEM_NAME_CLASS}) {
    flex: 1;
    min-width: 0;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${FU_ITEM_SIZE_CLASS}) {
    flex-shrink: 0;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
    font-variant-numeric: tabular-nums;
  }

  :where(.${FU_REMOVE_CLASS}) {
    all: unset;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: ${radius.pill}px;
    color: ${cv.iconRole.normal};
    cursor: pointer;
    transition: background-color ${transition.default};
  }

  :where(.${FU_REMOVE_CLASS}:hover) {
    background: ${cv.surface.page};
    color: ${cv.textRole.normal};
  }

  :where(.${FU_ERROR_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.statusError};
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const fmtSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

const UploadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path
      d="M16 22V8M16 8L10 14M16 8L22 14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 22V25C6 26.1046 6.89543 27 8 27H24C25.1046 27 26 26.1046 26 25V22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const RemoveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ─── Component ─── */

export interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 현재 파일 목록 (제어 컴포넌트) */
  value: File[];
  /** 변경 콜백 */
  onValueChange: (files: File[]) => void;
  /** accept (예: "image/*", ".pdf,.png") */
  accept?: string;
  /** 다중 선택 */
  multiple?: boolean;
  /** 파일당 최대 크기 (bytes) — 초과 시 거부 + onError */
  maxSize?: number;
  /** 거부 콜백 (maxSize/accept 미일치) */
  onReject?: (files: File[], reason: "size" | "accept") => void;
  /** 비활성화 */
  disabled?: boolean;
  /** 본문 텍스트 (기본: "파일을 끌어다 놓거나 클릭해서 선택하세요") */
  hint?: React.ReactNode;
  /** 보조 텍스트 (예: "PDF, JPG, PNG · 최대 10MB") */
  description?: React.ReactNode;
  /** 에러 메시지 (지속 표시) */
  errorMessage?: React.ReactNode;
}

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      value,
      onValueChange,
      accept,
      multiple = false,
      maxSize,
      onReject,
      disabled = false,
      hint,
      description,
      errorMessage,
      className,
      ...rest
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragover, setDragover] = useState(false);

    const acceptFiles = useCallback(
      (incoming: File[]) => {
        const accepted: File[] = [];
        const rejectedSize: File[] = [];
        for (const f of incoming) {
          if (maxSize !== undefined && f.size > maxSize) {
            rejectedSize.push(f);
            continue;
          }
          accepted.push(f);
        }
        if (rejectedSize.length > 0) onReject?.(rejectedSize, "size");
        const next = multiple ? [...value, ...accepted] : accepted.slice(0, 1);
        onValueChange(next);
      },
      [maxSize, multiple, value, onValueChange, onReject],
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      acceptFiles(Array.from(e.target.files));
      e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragover(false);
      if (disabled) return;
      acceptFiles(Array.from(e.dataTransfer.files));
    };

    const removeAt = (idx: number) => {
      onValueChange(value.filter((_, i) => i !== idx));
    };

    return (
      <div ref={ref} data-slot="root" className={cx(FU_ROOT_CLASS, className)} {...rest}>
        <div
          data-slot="drop"
          data-dragover={dragover ? "true" : "false"}
          data-disabled={disabled ? "true" : "false"}
          className={FU_DROP_CLASS}
          onDragOver={(e) => {
            e.preventDefault();
            setDragover(true);
          }}
          onDragLeave={() => setDragover(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <span data-slot="icon" className={FU_ICON_CLASS}>
            <UploadIcon />
          </span>
          <p data-slot="text" className={FU_TEXT_CLASS}>
            {hint ?? (
              <>
                <strong>클릭</strong>하거나 끌어다 놓아 파일을 추가하세요
              </>
            )}
          </p>
          {description && (
            <span data-slot="hint" className={FU_HINT_CLASS}>
              {description}
            </span>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={handleInputChange}
            className={FU_HIDDEN_INPUT_CLASS}
            aria-label="파일 선택"
          />
        </div>
        {errorMessage && (
          <span data-slot="error" className={FU_ERROR_CLASS}>
            {errorMessage}
          </span>
        )}
        {value.length > 0 && (
          <ul data-slot="list" className={FU_LIST_CLASS}>
            {value.map((file, idx) => (
              <li key={`${file.name}-${idx}`} data-slot="item" className={FU_ITEM_CLASS}>
                <span data-slot="item-name" className={FU_ITEM_NAME_CLASS}>
                  {file.name}
                </span>
                <span data-slot="item-size" className={FU_ITEM_SIZE_CLASS}>
                  {fmtSize(file.size)}
                </span>
                <button
                  type="button"
                  data-slot="remove"
                  className={FU_REMOVE_CLASS}
                  onClick={() => removeAt(idx)}
                  aria-label={`${file.name} 제거`}
                >
                  <RemoveIcon />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);

FileUpload.displayName = "FileUpload";
