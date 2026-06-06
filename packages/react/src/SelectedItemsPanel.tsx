import React from "react";

/* ─── Class names ─── */

const SIP_CLASS = "nds-selected-items-panel";
const SIP_HEADER_CLASS = `${SIP_CLASS}__header`;
const SIP_TITLE_GROUP_CLASS = `${SIP_CLASS}__title-group`;
const SIP_TITLE_CLASS = `${SIP_CLASS}__title`;
const SIP_COUNT_CLASS = `${SIP_CLASS}__count`;
const SIP_ACTIONS_CLASS = `${SIP_CLASS}__actions`;
const SIP_ACTION_CLASS = `${SIP_CLASS}__action`;
const SIP_ACTION_ICON_CLASS = `${SIP_CLASS}__action-icon`;
const SIP_BODY_CLASS = `${SIP_CLASS}__body`;

const ROW_CLASS = "nds-selected-item-row";
const LEGACY_ROW_CLASS = "nds-region-row";
const ROW_LABEL_CLASS = `${ROW_CLASS}__label`;
const LEGACY_ROW_LABEL_CLASS = `${LEGACY_ROW_CLASS}__label`;
const ROW_REMOVE_CLASS = `${ROW_CLASS}__remove`;
const LEGACY_ROW_REMOVE_CLASS = `${LEGACY_ROW_CLASS}__remove`;

/* ─── Inline icons (브랜드 무관 · 16/20px, currentColor) ─── */

const PlusIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M12.9 8a4.9 4.9 0 1 1-1.43-3.47M12.9 2.2v2.6h-2.6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RemoveIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="10" fill="currentColor" fillOpacity="0.4" />
    <path
      d="M13.33361 5.555582C13.64043 5.248757 14.13789 5.248758 14.44472 5.555583C14.75154 5.862408 14.75154 6.35987 14.44472 6.66669L6.66694 14.44447C6.36011 14.7513 5.862651 14.7513 5.555827 14.44447C5.249002 14.13765 5.249002 13.64019 5.555827 13.33336L13.33361 5.555582Z"
      fill="currentColor"
    />
    <path
      d="M5.555555 6.66683C5.24873 6.36 5.248731 5.862543 5.555556 5.555718C5.862381 5.248893 6.35984 5.248894 6.66667 5.555719L14.44445 13.3335C14.75127 13.64032 14.75127 14.13778 14.44444 14.44461C14.13762 14.75143 13.64016 14.75143 13.33333 14.44461L5.555555 6.66683Z"
      fill="currentColor"
    />
  </svg>
);

/* ─── SelectedItemRow ─── */

export interface SelectedItemRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** 행 라벨 (예: "카테고리 > 멤버") */
  children: React.ReactNode;
  /** 우측 삭제 버튼 클릭 — 미지정 시 삭제 버튼 숨김 */
  onRemove?: () => void;
  /** 삭제 버튼 aria-label */
  removeLabel?: string;
}

export function SelectedItemRow({
  children,
  onRemove,
  removeLabel = "삭제",
  className,
  ...rest
}: SelectedItemRowProps) {
  const rootClass = className
    ? `${ROW_CLASS} ${LEGACY_ROW_CLASS} ${className}`
    : `${ROW_CLASS} ${LEGACY_ROW_CLASS}`;
  return (
    <div className={rootClass} {...rest}>
      <span className={`${ROW_LABEL_CLASS} ${LEGACY_ROW_LABEL_CLASS}`}>{children}</span>
      {onRemove && (
        <button
          type="button"
          className={`${ROW_REMOVE_CLASS} ${LEGACY_ROW_REMOVE_CLASS}`}
          aria-label={removeLabel}
          onClick={onRemove}
        >
          <RemoveIcon />
        </button>
      )}
    </div>
  );
}

export type RegionRowProps = SelectedItemRowProps;
export const RegionRow = SelectedItemRow;
SelectedItemRow.displayName = "SelectedItemRow";

/* ─── SelectedItemsPanel ─── */

export interface SelectedItemsPanelProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  /** 패널 타이틀 (예: "선택한 지역") */
  title: React.ReactNode;
  /** 타이틀 옆 강조 개수 — 숫자면 `{count}{countSuffix}` 로 브랜드색 표시 */
  count?: number;
  /** 개수 접미사 (기본 "개") */
  countSuffix?: string;
  /** 헤더 액션 노출 (기본 true) */
  showActions?: boolean;
  /** "추가 선택" 클릭 */
  onAdd?: () => void;
  /** "선택 해제" 클릭 */
  onClear?: () => void;
  /** 추가 액션 라벨 (기본 "추가 선택") */
  addLabel?: React.ReactNode;
  /** 해제 액션 라벨 (기본 "선택 해제") */
  clearLabel?: React.ReactNode;
  /** 본문 슬롯 — 선택 항목 리스트(SelectedItemRow) / 폼 / 테이블 등 */
  children?: React.ReactNode;
}

export function SelectedItemsPanel({
  title,
  count,
  countSuffix = "개",
  showActions = true,
  onAdd,
  onClear,
  addLabel = "추가 선택",
  clearLabel = "선택 해제",
  className,
  children,
  ...rest
}: SelectedItemsPanelProps) {
  const rootClass = className ? `${SIP_CLASS} ${className}` : SIP_CLASS;
  return (
    <div className={rootClass} {...rest}>
      <div className={SIP_HEADER_CLASS}>
        <div className={SIP_TITLE_GROUP_CLASS}>
          <span className={SIP_TITLE_CLASS}>{title}</span>
          {count !== undefined && (
            <span className={SIP_COUNT_CLASS}>
              {count}
              {countSuffix}
            </span>
          )}
        </div>
        {showActions && (onAdd || onClear) && (
          <div className={SIP_ACTIONS_CLASS}>
            {onAdd && (
              <button
                type="button"
                className={SIP_ACTION_CLASS}
                data-variant="primary"
                onClick={onAdd}
              >
                <span className={SIP_ACTION_ICON_CLASS}>
                  <PlusIcon />
                </span>
                {addLabel}
              </button>
            )}
            {onClear && (
              <button
                type="button"
                className={SIP_ACTION_CLASS}
                data-variant="ghost"
                onClick={onClear}
              >
                <span className={SIP_ACTION_ICON_CLASS}>
                  <RefreshIcon />
                </span>
                {clearLabel}
              </button>
            )}
          </div>
        )}
      </div>
      <div className={SIP_BODY_CLASS}>{children}</div>
    </div>
  );
}
