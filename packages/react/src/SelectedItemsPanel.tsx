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

const RR_CLASS = "nds-region-row";
const RR_LABEL_CLASS = `${RR_CLASS}__label`;
const RR_REMOVE_CLASS = `${RR_CLASS}__remove`;

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
    <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M7.75 7.75l4.5 4.5M12.25 7.75l-4.5 4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/* ─── RegionRow ─── */

export interface RegionRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** 행 라벨 (예: "강원특별자치도 > 강릉시") */
  children: React.ReactNode;
  /** 우측 삭제 버튼 클릭 — 미지정 시 삭제 버튼 숨김 */
  onRemove?: () => void;
  /** 삭제 버튼 aria-label */
  removeLabel?: string;
}

export function RegionRow({
  children,
  onRemove,
  removeLabel = "삭제",
  className,
  ...rest
}: RegionRowProps) {
  const rootClass = className ? `${RR_CLASS} ${className}` : RR_CLASS;
  return (
    <div className={rootClass} {...rest}>
      <span className={RR_LABEL_CLASS}>{children}</span>
      {onRemove && (
        <button
          type="button"
          className={RR_REMOVE_CLASS}
          aria-label={removeLabel}
          onClick={onRemove}
        >
          <RemoveIcon />
        </button>
      )}
    </div>
  );
}

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
  /** 본문 슬롯 — 선택 항목 리스트(RegionRow) / 폼 / 테이블 등 */
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
