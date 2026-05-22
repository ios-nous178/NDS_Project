import React, { useRef } from "react";
import { cv, fontFamily, radius, spacing, typeScale } from "@nudge-eap/tokens";
import { InfoIcon, InputdeleteIcon } from "@nudge-eap/icons";

/* ─── Types ─── */

export type ImageUploadState = "empty" | "uploaded" | "error";

export interface ImageUploadProps {
  /** 현재 상태. uploaded 일 때 imageUrl 사용 */
  state?: ImageUploadState;
  /** 업로드된 이미지 URL (uploaded 상태) */
  imageUrl?: string;
  /** 이미지 alt 텍스트 */
  imageAlt?: string;
  /** `<input type="file">` 의 accept (기본 "image/*") */
  accept?: string;
  /** 다중 선택 허용 (기본 false) */
  multiple?: boolean;
  /** 파일 선택 콜백 — 사용자가 파일 picker 로 파일을 선택하면 호출 */
  onFileSelect?: (files: FileList) => void;
  /** 업로드 버튼 클릭 콜백 — onFileSelect 와 별개로 추가 작업이 필요할 때 */
  onUploadClick?: () => void;
  /** 우상단 X 버튼 클릭 콜백 (uploaded 상태에서만 표시) */
  onRemove?: () => void;
  /** 업로드 버튼 라벨 (기본: "이미지 업로드") */
  uploadLabel?: React.ReactNode;
  /** 사이즈 안내 (기본: "사이즈 : 200*200 px 권장") */
  sizeHint?: React.ReactNode;
  /** Empty/Uploaded 의 helper 텍스트 (기본: "이미지를 업로드해 주세요.") */
  helperText?: React.ReactNode;
  /** Error 의 helper 텍스트 (기본: "이미지를 등록해 주세요.") */
  errorText?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/* ─── Class names ─── */

const IU_ROOT_CLASS = "nds-image-upload";
const IU_PREVIEW_COL_CLASS = `${IU_ROOT_CLASS}__preview-col`;
const IU_PREVIEW_BOX_CLASS = `${IU_ROOT_CLASS}__preview-box`;
const IU_PREVIEW_IMG_CLASS = `${IU_ROOT_CLASS}__preview-img`;
const IU_REMOVE_BTN_CLASS = `${IU_ROOT_CLASS}__remove-btn`;
const IU_PLACEHOLDER_CLASS = `${IU_ROOT_CLASS}__placeholder`;
const IU_HELPER_CLASS = `${IU_ROOT_CLASS}__helper`;
const IU_ERROR_ICON_CLASS = `${IU_ROOT_CLASS}__error-icon`;
const IU_RIGHT_COL_CLASS = `${IU_ROOT_CLASS}__right-col`;
const IU_UPLOAD_BTN_CLASS = `${IU_ROOT_CLASS}__upload-btn`;
const IU_SIZE_HINT_CLASS = `${IU_ROOT_CLASS}__size-hint`;

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const imageUploadStyles = `
  :where(.${IU_ROOT_CLASS}) {
    display: inline-flex;
    align-items: flex-start;
    gap: ${spacing[24]}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${IU_PREVIEW_COL_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
  }

  :where(.${IU_PREVIEW_BOX_CLASS}) {
    position: relative;
    width: 150px;
    height: 150px;
    box-sizing: border-box;
    border-radius: ${radius.md}px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Empty: dashed border, neutral subtle bg */
  :where(.${IU_PREVIEW_BOX_CLASS}[data-state="empty"]) {
    background: ${cv.surface.subtle};
    border: 1px dashed ${cv.borderRole.normal};
  }

  /* Uploaded: solid border, image fills */
  :where(.${IU_PREVIEW_BOX_CLASS}[data-state="uploaded"]) {
    background: ${cv.surface.subtle};
    border: 1px solid ${cv.borderRole.normal};
  }

  /* Error: dashed red border + soft red bg */
  :where(.${IU_PREVIEW_BOX_CLASS}[data-state="error"]) {
    background: ${cv.surface.statusError};
    border: 1px dashed ${cv.fill.statusError};
  }

  :where(.${IU_PREVIEW_IMG_CLASS}) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  :where(.${IU_REMOVE_BTN_CLASS}) {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 24px;
    height: 24px;
    padding: 0;
    border: 0;
    border-radius: 9999px;
    background: ${cv.fill.statusError};
    color: ${cv.textRole.inverse};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  :where(.${IU_PLACEHOLDER_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: 500;
    color: ${cv.textRole.muted};
  }

  :where(.${IU_PREVIEW_BOX_CLASS}[data-state="error"] .${IU_PLACEHOLDER_CLASS}) {
    color: ${cv.textRole.statusError};
  }

  :where(.${IU_HELPER_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[4]}px;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${IU_HELPER_CLASS}[data-state="error"]) {
    color: ${cv.textRole.statusError};
  }

  :where(.${IU_ERROR_ICON_CLASS}) {
    width: 14px;
    height: 14px;
    display: inline-flex;
    color: ${cv.textRole.statusError};
  }

  :where(.${IU_RIGHT_COL_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[12]}px;
    align-items: flex-start;
  }

  :where(.${IU_UPLOAD_BTN_CLASS}) {
    appearance: none;
    border: 0;
    width: 135px;
    height: 44px;
    border-radius: ${radius.md}px;
    background: ${cv.fill.neutralSubtle};
    color: ${cv.textRole.normal};
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :where(.${IU_UPLOAD_BTN_CLASS}:disabled) {
    cursor: not-allowed;
    opacity: 0.6;
  }

  :where(.${IU_SIZE_HINT_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
  }
`;

/* ─── Component ─── */

export function ImageUpload({
  state = "empty",
  imageUrl,
  imageAlt = "",
  accept = "image/*",
  multiple = false,
  onFileSelect,
  onUploadClick,
  onRemove,
  uploadLabel = "이미지 업로드",
  sizeHint = "사이즈 : 200*200 px 권장",
  helperText = "이미지를 업로드해 주세요.",
  errorText = "이미지를 등록해 주세요.",
  className,
  style,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const triggerPicker = () => {
    onUploadClick?.();
    inputRef.current?.click();
  };

  const showPlaceholder = state === "empty" || state === "error";
  const showImage = state === "uploaded" && !!imageUrl;
  const showRemove = state === "uploaded" && !!onRemove;

  const rootClass = className ? `${IU_ROOT_CLASS} ${className}` : IU_ROOT_CLASS;

  return (
    <div className={rootClass} style={style} data-state={state}>
      <div className={IU_PREVIEW_COL_CLASS}>
        <div className={IU_PREVIEW_BOX_CLASS} data-state={state}>
          {showImage && <img className={IU_PREVIEW_IMG_CLASS} src={imageUrl} alt={imageAlt} />}
          {showPlaceholder && <span className={IU_PLACEHOLDER_CLASS}>No Image</span>}
          {showRemove && (
            <button
              type="button"
              className={IU_REMOVE_BTN_CLASS}
              onClick={onRemove}
              aria-label="이미지 제거"
            >
              <InputdeleteIcon width={14} height={14} />
            </button>
          )}
        </div>
        <div className={IU_HELPER_CLASS} data-state={state}>
          {state === "error" ? (
            <>
              <span className={IU_ERROR_ICON_CLASS}>
                <InfoIcon width={14} height={14} />
              </span>
              <span>{errorText}</span>
            </>
          ) : (
            <span>{helperText}</span>
          )}
        </div>
      </div>
      <div className={IU_RIGHT_COL_CLASS}>
        <button type="button" className={IU_UPLOAD_BTN_CLASS} onClick={triggerPicker}>
          {uploadLabel}
        </button>
        <span className={IU_SIZE_HINT_CLASS}>{sizeHint}</span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onFileSelect?.(e.target.files);
            }
            // 같은 파일 재선택 가능하도록 reset
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
