import React from "react";

/* ─── Class names ─── */

const LIST_CLASS = "nds-list";
const LIST_ROOT_CLASS = `${LIST_CLASS}__root`;
const LIST_HEADER_CLASS = `${LIST_CLASS}__header`;
const LIST_FOOTER_CLASS = `${LIST_CLASS}__footer`;
const LIST_ITEM_CLASS = `${LIST_CLASS}-item`;
const LIST_ITEM_LEADING_CLASS = `${LIST_ITEM_CLASS}__leading`;
const LIST_ITEM_BODY_CLASS = `${LIST_ITEM_CLASS}__body`;
const LIST_ITEM_TITLE_CLASS = `${LIST_ITEM_CLASS}__title`;
const LIST_ITEM_DESC_CLASS = `${LIST_ITEM_CLASS}__description`;
const LIST_ITEM_META_CLASS = `${LIST_ITEM_CLASS}__metadata`;
const LIST_ITEM_TRAILING_CLASS = `${LIST_ITEM_CLASS}__trailing`;

/* ─── Types ─── */

export type ListVariant = "plain" | "card" | "divided";
export type ListItemSize = "sm" | "md" | "lg" | "xl";

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  /** 표시 변형 */
  variant?: ListVariant;
  /** 리스트 상단 슬롯 (섹션 제목·필터 등). 리스트 아이템이 아닌 presentation 영역 */
  header?: React.ReactNode;
  /** 리스트 하단 슬롯 (더 보기 버튼·Pagination 등). 리스트 아이템이 아닌 presentation 영역 */
  footer?: React.ReactNode;
  /** 자식은 ListItem들 */
  children: React.ReactNode;
}

export interface ListItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "title"> {
  /** 좌측 슬롯 (Avatar, 아이콘, Checkbox 등) */
  leading?: React.ReactNode;
  /** 메인 라벨 */
  title?: React.ReactNode;
  /** 보조 설명 */
  description?: React.ReactNode;
  /** 부가 정보 (날짜·태그·상태 등 — description 아래 작게 표시) */
  metadata?: React.ReactNode;
  /** 우측 슬롯 (chevron, badge, switch, 액션 버튼 등) */
  trailing?: React.ReactNode;
  /** 클릭 시 호출 (있으면 button 역할) */
  onSelect?: () => void;
  /** 비활성화 */
  disabled?: boolean;
  /** 활성/선택 상태 */
  active?: boolean;
  /** 패딩 크기 (sm 40 · md 56 · lg 72 Avatar · xl 96 Thumbnail) */
  size?: ListItemSize;
  /** custom body 렌더 (title/description 대신) */
  children?: React.ReactNode;
}
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Components ─── */

export const List: React.FC<ListProps> = ({
  variant = "plain",
  header,
  footer,
  children,
  className,
  ...rest
}) => (
  <ul
    data-slot="root"
    data-variant={variant}
    role="list"
    className={cx(LIST_ROOT_CLASS, className)}
    {...rest}
  >
    {header !== undefined && (
      <li data-slot="header" role="presentation" className={LIST_HEADER_CLASS}>
        {header}
      </li>
    )}
    {children}
    {footer !== undefined && (
      <li data-slot="footer" role="presentation" className={LIST_FOOTER_CLASS}>
        {footer}
      </li>
    )}
  </ul>
);

List.displayName = "List";

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  (
    {
      leading,
      title,
      description,
      metadata,
      trailing,
      onSelect,
      disabled = false,
      active = false,
      size = "md",
      children,
      className,
      onClick,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const interactive = !!onSelect;

    return (
      <li
        ref={ref}
        data-slot="item"
        data-size={size}
        data-interactive={interactive ? "true" : "false"}
        data-active={active ? "true" : "false"}
        data-disabled={disabled ? "true" : "false"}
        role={interactive ? "button" : undefined}
        tabIndex={interactive && !disabled ? 0 : undefined}
        aria-disabled={disabled || undefined}
        className={cx(LIST_ITEM_CLASS, className)}
        onClick={(e) => {
          onClick?.(e);
          if (!disabled && onSelect) onSelect();
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (!interactive || disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect?.();
          }
        }}
        {...rest}
      >
        {leading !== undefined && (
          <span data-slot="leading" className={LIST_ITEM_LEADING_CLASS}>
            {leading}
          </span>
        )}
        {children !== undefined ? (
          <span data-slot="body" className={LIST_ITEM_BODY_CLASS}>
            {children}
          </span>
        ) : (
          (title !== undefined || description !== undefined || metadata !== undefined) && (
            <span data-slot="body" className={LIST_ITEM_BODY_CLASS}>
              {title !== undefined && (
                <span data-slot="title" className={LIST_ITEM_TITLE_CLASS}>
                  {title}
                </span>
              )}
              {description !== undefined && (
                <span data-slot="description" className={LIST_ITEM_DESC_CLASS}>
                  {description}
                </span>
              )}
              {metadata !== undefined && (
                <span data-slot="metadata" className={LIST_ITEM_META_CLASS}>
                  {metadata}
                </span>
              )}
            </span>
          )
        )}
        {trailing !== undefined && (
          <span data-slot="trailing" className={LIST_ITEM_TRAILING_CLASS}>
            {trailing}
          </span>
        )}
      </li>
    );
  },
);

ListItem.displayName = "ListItem";
