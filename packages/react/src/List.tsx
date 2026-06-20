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
const LIST_ITEM_ACTION_LINK_CLASS = `${LIST_ITEM_CLASS}__action-link`;

/* ─── Types ─── */

export type ListVariant = "plain" | "card" | "divided";
/** @deprecated size 는 layout 의 별칭 — Trost 가이드는 layout 사용 (md→default · lg→avatar · xl→thumbnail · sm→compact). */
export type ListItemSize = "sm" | "md" | "lg" | "xl";
/** Trost 가이드: 플랫폼 밀도. mobile=터치(48 floor) · pc=마우스(고밀도·table). */
export type ListPlatform = "mobile" | "pc";
/** Trost 가이드 표준 Layout (각 Layout = 밀도 + leading/trailing 조합). */
export type ListItemLayout = "default" | "avatar" | "thumbnail" | "action" | "compact" | "table";

/** 폐기 size → layout 매핑 (backward compat). */
const SIZE_TO_LAYOUT: Record<ListItemSize, ListItemLayout> = {
  md: "default",
  lg: "avatar",
  xl: "thumbnail",
  sm: "compact",
};

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  /** 표시 변형 */
  variant?: ListVariant;
  /**
   * 플랫폼 밀도 (Trost 가이드). "mobile"(기본·터치 48 floor) | "pc"(마우스 고밀도).
   * data-platform 으로 내려가 PC 는 horizontal padding 24 + table/compact 밀도를 연다.
   * 기존 사용은 platform 미지정 = "mobile" 이라 렌더링 불변.
   */
  platform?: ListPlatform;
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
  /**
   * Trost 표준 Layout. data-layout 으로 내려간다.
   * - default — 텍스트 + Chevron (md)
   * - avatar — 48 원형 + 이름 (+ 액션) (mobile lg / pc avatarPc 80)
   * - thumbnail — 사각 썸네일 + 제목/메타 (mobile thumbnailMobile 124 / pc thumbnailPc 106)
   * - action — 텍스트 + Toggle·Checkbox·Button (md)
   * - compact — 고밀도 (pc compactPc 42)
   * - table — 가로 컬럼 행 (date│category│name│spacer│status) (pc tablePc 64). 기본 표 전용 — 풍부한 표는 DataTable.
   * layout 을 지정하면 inset divider 가 적용된다. 미지정이면 size(폐기) 별칭으로 매핑.
   */
  layout?: ListItemLayout;
  /** @deprecated layout 의 별칭 — Trost 가이드는 layout 사용. (sm→compact · md→default · lg→avatar · xl→thumbnail) */
  size?: ListItemSize;
  /**
   * Trost Thumbnail(모바일) 전용 — 3번째 줄 인라인 액션 링크 (예: "주문 다시하기").
   * metadata 아래에 project 색 텍스트 링크로 렌더. onActionLinkSelect 와 함께 사용.
   * 다른 layout 에서는 무시되지 않으나 가이드상 Thumbnail 합성 전용.
   */
  actionLink?: React.ReactNode;
  /** actionLink 클릭 핸들러 (Row onSelect 와 분리 — stopPropagation 처리됨). */
  onActionLinkSelect?: () => void;
  /** custom body 렌더 (title/description 대신) */
  children?: React.ReactNode;
}
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Components ─── */

export const List: React.FC<ListProps> = ({
  variant = "plain",
  platform = "mobile",
  header,
  footer,
  children,
  className,
  ...rest
}) => (
  <ul
    data-slot="root"
    data-variant={variant}
    data-platform={platform}
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
      layout,
      size = "md",
      actionLink,
      onActionLinkSelect,
      children,
      className,
      onClick,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const interactive = !!onSelect;
    // layout 우선, 없으면 폐기 size 별칭. data-size 는 backward-compat 으로 유지.
    const resolvedLayout: ListItemLayout = layout ?? SIZE_TO_LAYOUT[size];
    // layout 을 "명시" 했을 때만 새 [data-platform][data-layout] 밀도/인셋 룰을 연다.
    // (폐기 size 별칭만 쓰는 기존 사용은 data-layout-explicit 없음 → 옛 [data-size] 렌더 그대로 = byte-identical)
    const layoutOptIn = layout !== undefined;

    return (
      <li
        ref={ref}
        data-slot="item"
        data-size={size}
        data-layout={resolvedLayout}
        data-layout-explicit={layoutOptIn ? "true" : undefined}
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
          // table layout: body 가 가로 컬럼 행이 된다 (children spans = 컬럼). 그 외엔 기존처럼 수직.
          <span data-slot="body" data-layout={resolvedLayout} className={LIST_ITEM_BODY_CLASS}>
            {children}
          </span>
        ) : (
          (title !== undefined ||
            description !== undefined ||
            metadata !== undefined ||
            actionLink !== undefined) && (
            <span data-slot="body" data-layout={resolvedLayout} className={LIST_ITEM_BODY_CLASS}>
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
              {actionLink !== undefined && (
                <button
                  type="button"
                  data-slot="action-link"
                  className={LIST_ITEM_ACTION_LINK_CLASS}
                  onClick={(e) => {
                    e.stopPropagation();
                    onActionLinkSelect?.();
                  }}
                >
                  {actionLink}
                </button>
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
