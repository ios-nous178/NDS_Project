import React from "react";

/* ─── Constants ─── */

const AT_CLASS = "nds-attachment-item";
const AT_ICON_CLASS = `${AT_CLASS}__icon`;
const AT_BODY_CLASS = `${AT_CLASS}__body`;
const AT_NAME_CLASS = `${AT_CLASS}__name`;
const AT_META_CLASS = `${AT_CLASS}__meta`;
const AT_SIZE_CLASS = `${AT_CLASS}__size`;
const AT_STATUS_CLASS = `${AT_CLASS}__status`;
const AT_PROGRESS_CLASS = `${AT_CLASS}__progress`;
const AT_PROGRESS_FILL_CLASS = `${AT_CLASS}__progress-fill`;
const AT_ACTIONS_CLASS = `${AT_CLASS}__actions`;
const AT_BTN_CLASS = `${AT_CLASS}__btn`;
const AT_ERROR_CLASS = `${AT_CLASS}__error`;

/* ─── Types ─── */

export type AttachmentFileType =
  | "pdf"
  | "image"
  | "video"
  | "audio"
  | "document"
  | "archive"
  | "other";
export type AttachmentStatus = "uploading" | "done" | "error";

const inferFileType = (name: string): AttachmentFileType => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["pdf"].includes(ext)) return "pdf";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "heic"].includes(ext)) return "image";
  if (["mp4", "mov", "webm", "avi", "mkv"].includes(ext)) return "video";
  if (["mp3", "wav", "m4a", "aac", "flac"].includes(ext)) return "audio";
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "md", "rtf", "csv"].includes(ext))
    return "document";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
  return "other";
};

const fmtSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const FileIcon = ({ type }: { type: AttachmentFileType }) => {
  if (type === "image") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2.5" y="3" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="7" cy="8" r="1.5" fill="currentColor" />
        <path d="M3 14L7 11L11 14L17 9" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    );
  }
  if (type === "pdf") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M5 2H12L16 6V17C16 17.5523 15.5523 18 15 18H5C4.44772 18 4 17.5523 4 17V3C4 2.44772 4.44772 2 5 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M12 2V6H16" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <text x="10" y="14" fontSize="5" fontWeight="700" textAnchor="middle" fill="currentColor">
          PDF
        </text>
      </svg>
    );
  }
  if (type === "video" || type === "audio") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 7L13 10L8 13V7Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 2H12L16 6V17C16 17.5523 15.5523 18 15 18H5C4.44772 18 4 17.5523 4 17V3C4 2.44772 4.44772 2 5 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M12 2V6H16" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
};

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M8 2V11M8 11L4 7M8 11L12 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M3 13H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const RemoveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const STATUS_LABEL: Record<AttachmentStatus, string> = {
  uploading: "업로드 중",
  done: "완료",
  error: "실패",
};

/* ─── Component ─── */

export interface AttachmentItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 파일 이름 */
  name: string;
  /** 파일 크기 (bytes) */
  size?: number;
  /** 파일 종류 — 미지정 시 name 확장자에서 추론 */
  fileType?: AttachmentFileType;
  /** 상태 */
  status?: AttachmentStatus;
  /** 업로드 진행률 (0~100). status="uploading"에서 사용 */
  progress?: number;
  /** 다운로드 링크 (제공 시 download 버튼) */
  href?: string;
  /** 다운로드 버튼 클릭 (href 대신/추가) */
  onDownload?: () => void;
  /** 제거 버튼 클릭 (제공 시 표시) */
  onRemove?: () => void;
  /** 에러 메시지 (status="error"에서 표시) */
  errorMessage?: React.ReactNode;
  /** 좌측 아이콘 커스터마이즈 */
  icon?: React.ReactNode;
}

export const AttachmentItem = React.forwardRef<HTMLDivElement, AttachmentItemProps>(
  (
    {
      name,
      size,
      fileType,
      status = "done",
      progress,
      href,
      onDownload,
      onRemove,
      errorMessage,
      icon,
      className,
      ...rest
    },
    ref,
  ) => {
    const type = fileType ?? inferFileType(name);
    const isUploading = status === "uploading";
    const showDownload = !isUploading && (href || onDownload);

    return (
      <div
        ref={ref}
        data-slot="root"
        data-status={status}
        className={cx(AT_CLASS, className)}
        {...rest}
      >
        <span data-slot="icon" data-type={type} className={AT_ICON_CLASS}>
          {icon ?? <FileIcon type={type} />}
        </span>
        <div data-slot="body" className={AT_BODY_CLASS}>
          <span data-slot="name" className={AT_NAME_CLASS}>
            {name}
          </span>
          <span data-slot="meta" className={AT_META_CLASS}>
            {size !== undefined && (
              <span data-slot="size" className={AT_SIZE_CLASS}>
                {fmtSize(size)}
              </span>
            )}
            {size !== undefined && status !== "done" && <span aria-hidden="true">·</span>}
            {status !== "done" && (
              <span data-slot="status" data-status={status} className={AT_STATUS_CLASS}>
                {STATUS_LABEL[status]}
                {isUploading && progress !== undefined && ` ${Math.round(progress)}%`}
              </span>
            )}
          </span>
          {isUploading && progress !== undefined && (
            <span data-slot="progress" className={AT_PROGRESS_CLASS} aria-hidden="true">
              <span
                data-slot="progress-fill"
                className={AT_PROGRESS_FILL_CLASS}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </span>
          )}
          {status === "error" && errorMessage && (
            <span data-slot="error" className={AT_ERROR_CLASS}>
              {errorMessage}
            </span>
          )}
        </div>
        {(showDownload || onRemove) && (
          <div data-slot="actions" className={AT_ACTIONS_CLASS}>
            {showDownload &&
              (href ? (
                <a
                  data-slot="download"
                  className={AT_BTN_CLASS}
                  href={href}
                  download
                  onClick={onDownload}
                  aria-label={`${name} 다운로드`}
                >
                  <DownloadIcon />
                </a>
              ) : (
                <button
                  type="button"
                  data-slot="download"
                  className={AT_BTN_CLASS}
                  onClick={onDownload}
                  aria-label={`${name} 다운로드`}
                >
                  <DownloadIcon />
                </button>
              ))}
            {onRemove && (
              <button
                type="button"
                data-slot="remove"
                className={AT_BTN_CLASS}
                onClick={onRemove}
                aria-label={`${name} 제거`}
              >
                <RemoveIcon />
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);

AttachmentItem.displayName = "AttachmentItem";
