import React from "react";
import { fontFamily, fontWeight, semantic, spacing, typeScale } from "@nudge-eap/tokens";

/* ─── Class names ─── */

const EMPTY_CLASS = "nds-empty-state";
const EMPTY_ROOT_CLASS = `${EMPTY_CLASS}__root`;
const EMPTY_ICON_CLASS = `${EMPTY_CLASS}__icon`;
const EMPTY_TITLE_CLASS = `${EMPTY_CLASS}__title`;
const EMPTY_DESC_CLASS = `${EMPTY_CLASS}__description`;
const EMPTY_ACTION_CLASS = `${EMPTY_CLASS}__action`;

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const emptyStateStyles = `
  :where(.${EMPTY_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: var(--nds-empty-state-min-height, 200px);
    padding: ${spacing[48]}px ${spacing[20]}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${EMPTY_ICON_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${spacing[16]}px;
    color: ${semantic.icon.subtle};
  }

  :where(.${EMPTY_ICON_CLASS} svg) {
    width: 64px;
    height: 64px;
  }

  :where(.${EMPTY_ICON_CLASS} img) {
    width: 64px;
    height: 64px;
    object-fit: contain;
  }

  :where(.${EMPTY_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.body1.fontSize}px;
    font-weight: ${fontWeight.medium};
    line-height: ${typeScale.body1.lineHeight}px;
    color: ${semantic.text.default};
  }

  :where(.${EMPTY_DESC_CLASS}) {
    margin: ${spacing[8]}px 0 0;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: 1.5;
    color: ${semantic.text.subtle};
    white-space: pre-line;
    word-break: keep-all;
  }

  :where(.${EMPTY_ACTION_CLASS}) {
    margin-top: ${spacing[20]}px;
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Compound: Root ─── */

export interface EmptyStateRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 최소 높이 (number: px, string: CSS 값) */
  minHeight?: number | string;
  /** 빈 상태 내부 콘텐츠 (Icon, Title, Description, Action 등) */
  children: React.ReactNode;
}

export const EmptyStateRoot: React.FC<EmptyStateRootProps> = React.memo(
  ({ minHeight, children, className, style, ...rest }) => (
    <div
      data-slot="root"
      className={cx(EMPTY_ROOT_CLASS, className)}
      style={{
        ...(minHeight !== undefined &&
          ({
            "--nds-empty-state-min-height":
              typeof minHeight === "number" ? `${minHeight}px` : minHeight,
          } as React.CSSProperties)),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  ),
);
EmptyStateRoot.displayName = "EmptyStateRoot";

/* ─── Compound: Icon ─── */

export interface EmptyStateIconProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 아이콘 또는 일러스트 (aria-hidden 자동 적용) */
  children: React.ReactNode;
}

export const EmptyStateIcon: React.FC<EmptyStateIconProps> = React.memo(
  ({ children, className, ...rest }) => (
    <div data-slot="icon" className={cx(EMPTY_ICON_CLASS, className)} aria-hidden="true" {...rest}>
      {children}
    </div>
  ),
);
EmptyStateIcon.displayName = "EmptyStateIcon";

/* ─── Compound: Title ─── */

export interface EmptyStateTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** 빈 상태 제목 텍스트 (`<h3>`으로 렌더링) */
  children: React.ReactNode;
}

export const EmptyStateTitle: React.FC<EmptyStateTitleProps> = React.memo(
  ({ children, className, ...rest }) => (
    <h3 data-slot="title" className={cx(EMPTY_TITLE_CLASS, className)} {...rest}>
      {children}
    </h3>
  ),
);
EmptyStateTitle.displayName = "EmptyStateTitle";

/* ─── Compound: Description ─── */

export interface EmptyStateDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** 빈 상태 설명 문구 */
  children: React.ReactNode;
}

export const EmptyStateDescription: React.FC<EmptyStateDescriptionProps> = React.memo(
  ({ children, className, ...rest }) => (
    <p data-slot="description" className={cx(EMPTY_DESC_CLASS, className)} {...rest}>
      {children}
    </p>
  ),
);
EmptyStateDescription.displayName = "EmptyStateDescription";

/* ─── Compound: Action ─── */

export interface EmptyStateActionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 하단 액션 영역 (버튼 등) */
  children: React.ReactNode;
}

export const EmptyStateAction: React.FC<EmptyStateActionProps> = React.memo(
  ({ children, className, ...rest }) => (
    <div data-slot="action" className={cx(EMPTY_ACTION_CLASS, className)} {...rest}>
      {children}
    </div>
  ),
);
EmptyStateAction.displayName = "EmptyStateAction";

/* ─── Flat API ─── */

export interface EmptyStateSlotProps {
  /** 루트 `<div>`에 전달할 추가 props */
  root?: Omit<EmptyStateRootProps, "children" | "minHeight">;
  /** 아이콘 `<div>`에 전달할 추가 props */
  icon?: Omit<EmptyStateIconProps, "children">;
  /** 제목 `<h3>`에 전달할 추가 props */
  title?: Omit<EmptyStateTitleProps, "children">;
  /** 설명 `<p>`에 전달할 추가 props */
  description?: Omit<EmptyStateDescriptionProps, "children">;
  /** 액션 `<div>`에 전달할 추가 props */
  action?: Omit<EmptyStateActionProps, "children">;
}

export interface EmptyStateProps {
  /** 아이콘 또는 이미지 */
  icon?: React.ReactNode;
  /** 제목 */
  title?: string;
  /** 설명 문구 */
  description?: string;
  /** 하단 액션 (버튼 등) */
  action?: React.ReactNode;
  /** 최소 높이 */
  minHeight?: number | string;
  /** 루트 className */
  className?: string;
  /** 루트 style */
  style?: React.CSSProperties;
  /** 슬롯 프롭 */
  slotProps?: EmptyStateSlotProps;
}

const renderMultiline = (text: string): React.ReactNode =>
  text.split("\n").reduce<React.ReactNode[]>((acc, line, i) => {
    if (i > 0) acc.push(<br key={`br-${i}`} />);
    acc.push(line);
    return acc;
  }, []);

const DefaultEmptyIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M22 32H42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M32 22V42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const EmptyStateComponent: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  minHeight,
  className,
  style,
  slotProps,
}) => (
  <EmptyStateRoot
    minHeight={minHeight}
    className={cx(slotProps?.root?.className, className)}
    style={{ ...slotProps?.root?.style, ...style }}
  >
    <EmptyStateIcon className={slotProps?.icon?.className} style={slotProps?.icon?.style}>
      {icon ?? <DefaultEmptyIcon />}
    </EmptyStateIcon>
    {title && (
      <EmptyStateTitle className={slotProps?.title?.className} style={slotProps?.title?.style}>
        {title}
      </EmptyStateTitle>
    )}
    {description && (
      <EmptyStateDescription
        className={slotProps?.description?.className}
        style={slotProps?.description?.style}
      >
        {renderMultiline(description)}
      </EmptyStateDescription>
    )}
    {action && (
      <EmptyStateAction className={slotProps?.action?.className} style={slotProps?.action?.style}>
        {action}
      </EmptyStateAction>
    )}
  </EmptyStateRoot>
);

EmptyStateComponent.displayName = "EmptyState";

/* ─── Export: Flat + Compound ─── */

export const EmptyState = Object.assign(EmptyStateComponent, {
  Root: EmptyStateRoot,
  Icon: EmptyStateIcon,
  Title: EmptyStateTitle,
  Description: EmptyStateDescription,
  Action: EmptyStateAction,
});
