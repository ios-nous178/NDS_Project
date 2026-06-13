import React, { useEffect, useRef, useState } from "react";
import { InfoIcon, InputdeleteIcon } from "@nudge-design/icons";

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
  /**
   * 선택한 파일을 컴포넌트가 직접 미리보기로 띄운다 (uncontrolled).
   * true 면 `imageUrl`/`state` 를 넘기지 않아도 파일 선택 시 첫 이미지를
   * `URL.createObjectURL` 로 즉시 preview 에 렌더하고, X 버튼으로 해제한다.
   * objectURL revoke·언마운트 정리도 내부에서 처리. `imageUrl` 을 직접
   * 넘기면(controlled) 그 값이 우선하고 자동 미리보기는 비활성된다. (기본 false)
   */
  autoPreview?: boolean;
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
  /** 루트 className */
  className?: string;
  /** 루트 인라인 스타일 */
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
/* ─── Component ─── */

export function ImageUpload({
  state = "empty",
  imageUrl,
  imageAlt = "",
  accept = "image/*",
  multiple = false,
  autoPreview = false,
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

  // imageUrl 을 직접 넘기면 controlled — 그 값이 우선하고 자동 미리보기는 비활성.
  const isControlled = imageUrl !== undefined;
  const autoManaged = autoPreview && !isControlled;
  const [autoUrl, setAutoUrl] = useState<string | undefined>(undefined);

  // objectURL 정리: autoUrl 이 바뀌거나 언마운트될 때 직전 URL revoke.
  useEffect(() => {
    if (!autoUrl) return;
    return () => URL.revokeObjectURL(autoUrl);
  }, [autoUrl]);

  // 표시에 쓰는 실효 url/state — controlled 면 props, 아니면 내부 자동 미리보기.
  const effectiveUrl = isControlled ? imageUrl : autoManaged ? autoUrl : undefined;
  const effectiveState: ImageUploadState = isControlled
    ? state
    : autoManaged && autoUrl
      ? "uploaded"
      : state;

  const triggerPicker = () => {
    onUploadClick?.();
    inputRef.current?.click();
  };

  const handleFiles = (files: FileList) => {
    if (autoManaged) {
      const file = files[0];
      if (file) setAutoUrl(URL.createObjectURL(file));
    }
    onFileSelect?.(files);
  };

  const handleRemove = () => {
    if (autoManaged) setAutoUrl(undefined);
    onRemove?.();
  };

  const showPlaceholder = effectiveState === "empty" || effectiveState === "error";
  const showImage = effectiveState === "uploaded" && !!effectiveUrl;
  // 자동 미리보기 모드에선 onRemove 가 없어도 내부 해제를 위해 X 노출.
  const showRemove = effectiveState === "uploaded" && (!!onRemove || autoManaged);

  const rootClass = className ? `${IU_ROOT_CLASS} ${className}` : IU_ROOT_CLASS;

  return (
    <div className={rootClass} style={style} data-state={effectiveState}>
      <div className={IU_PREVIEW_COL_CLASS}>
        <div className={IU_PREVIEW_BOX_CLASS} data-state={effectiveState}>
          {showImage && <img className={IU_PREVIEW_IMG_CLASS} src={effectiveUrl} alt={imageAlt} />}
          {showPlaceholder && <span className={IU_PLACEHOLDER_CLASS}>No Image</span>}
          {showRemove && (
            <button
              type="button"
              className={IU_REMOVE_BTN_CLASS}
              onClick={handleRemove}
              aria-label="이미지 제거"
            >
              <InputdeleteIcon width={14} height={14} />
            </button>
          )}
        </div>
        <div className={IU_HELPER_CLASS} data-state={effectiveState}>
          {effectiveState === "error" ? (
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
              handleFiles(e.target.files);
            }
            // 같은 파일 재선택 가능하도록 reset
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
