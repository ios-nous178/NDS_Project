import React from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

/* ─── Class names ─── */

const LIST_CLASS = "nds-list";
const LIST_ROOT_CLASS = `${LIST_CLASS}__root`;
const LIST_ITEM_CLASS = `${LIST_CLASS}-item`;
const LIST_ITEM_LEADING_CLASS = `${LIST_ITEM_CLASS}__leading`;
const LIST_ITEM_BODY_CLASS = `${LIST_ITEM_CLASS}__body`;
const LIST_ITEM_TITLE_CLASS = `${LIST_ITEM_CLASS}__title`;
const LIST_ITEM_DESC_CLASS = `${LIST_ITEM_CLASS}__description`;
const LIST_ITEM_TRAILING_CLASS = `${LIST_ITEM_CLASS}__trailing`;

/* ─── Types ─── */

export type ListVariant = "plain" | "card" | "divided";
export type ListItemSize = "sm" | "md" | "lg";

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  /** 표시 변형 */
  variant?: ListVariant;
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
  /** 우측 슬롯 (chevron, badge, switch, 액션 버튼 등) */
  trailing?: React.ReactNode;
  /** 클릭 시 호출 (있으면 button 역할) */
  onSelect?: () => void;
  /** 비활성화 */
  disabled?: boolean;
  /** 활성/선택 상태 */
  active?: boolean;
  /** 패딩 크기 */
  size?: ListItemSize;
  /** custom body 렌더 (title/description 대신) */
  children?: React.ReactNode;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const listStyles = `
  :where(.${LIST_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${LIST_ROOT_CLASS}[data-variant="card"]) {
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    overflow: hidden;
  }

  :where(.${LIST_ROOT_CLASS}[data-variant="card"] .${LIST_ITEM_CLASS} + .${LIST_ITEM_CLASS}),
  :where(.${LIST_ROOT_CLASS}[data-variant="divided"] .${LIST_ITEM_CLASS} + .${LIST_ITEM_CLASS}) {
    border-top: 1px solid ${cv.borderRole.subtle};
  }

  :where(.${LIST_ITEM_CLASS}) {
    display: flex;
    align-items: center;
    gap: ${spacing[12]}px;
    padding: ${spacing[12]}px ${spacing[16]}px;
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    box-sizing: border-box;
    transition: background-color ${transition.default};
  }

  :where(.${LIST_ITEM_CLASS}[data-size="sm"]) {
    padding: ${spacing[8]}px ${spacing[12]}px;
    gap: ${spacing[8]}px;
  }

  :where(.${LIST_ITEM_CLASS}[data-size="lg"]) {
    padding: ${spacing[16]}px ${spacing[16]}px;
    gap: ${spacing[16]}px;
  }

  :where(.${LIST_ITEM_CLASS}[data-interactive="true"]) {
    cursor: pointer;
    font-family: inherit;
  }

  :where(.${LIST_ITEM_CLASS}[data-interactive="true"]:hover),
  :where(.${LIST_ITEM_CLASS}[data-active="true"]) {
    background: ${cv.surface.subtle};
  }

  :where(.${LIST_ITEM_CLASS}[data-disabled="true"]) {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  :where(.${LIST_ITEM_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: -2px;
  }

  :where(.${LIST_ITEM_LEADING_CLASS}),
  :where(.${LIST_ITEM_TRAILING_CLASS}) {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }

  :where(.${LIST_ITEM_LEADING_CLASS}) {
    color: ${cv.iconRole.strong};
  }

  :where(.${LIST_ITEM_TRAILING_CLASS}) {
    color: ${cv.iconRole.normal};
    margin-left: auto;
  }

  :where(.${LIST_ITEM_BODY_CLASS}) {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: ${spacing[2]}px;
  }

  :where(.${LIST_ITEM_TITLE_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${LIST_ITEM_DESC_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.subtle};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Components ─── */

export const List: React.FC<ListProps> = ({ variant = "plain", children, className, ...rest }) => (
  <ul
    data-slot="root"
    data-variant={variant}
    role="list"
    className={cx(LIST_ROOT_CLASS, className)}
    {...rest}
  >
    {children}
  </ul>
);

List.displayName = "List";

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  (
    {
      leading,
      title,
      description,
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
          (title !== undefined || description !== undefined) && (
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
