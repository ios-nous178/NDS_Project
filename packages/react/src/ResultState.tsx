import React from "react";

/* ─── Class names ─── */

const EMPTY_CLASS = "nds-result-state";
const EMPTY_ROOT_CLASS = `${EMPTY_CLASS}__root`;
const EMPTY_ICON_CLASS = `${EMPTY_CLASS}__icon`;
const EMPTY_TITLE_CLASS = `${EMPTY_CLASS}__title`;
const EMPTY_DESC_CLASS = `${EMPTY_CLASS}__description`;
const EMPTY_ACTION_CLASS = `${EMPTY_CLASS}__action`;
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Status (시멘틱) ─── */

/**
 * 화면 상태 시멘틱. 기본 아이콘 글리프와 아이콘 색을 구동한다.
 * - `empty` — 빈 리스트/테이블 placeholder (중립색, 기본값)
 * - `success` / `error` / `info` — 결과 화면(결제 성공·404·권한 없음 등)
 *
 * 인라인 placeholder ↔ 풀페이지 결과 화면의 차이는 `status` 가 아니라 `minHeight` 로
 * 조절한다(인라인은 작게, 결과 화면은 `"60vh"` 등 크게). 같은 anatomy 를 altitude 만 달리 쓴다.
 */
export type ResultStateStatus = "empty" | "success" | "error" | "info";

/* ─── Compound: Root ─── */

export interface ResultStateRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 최소 높이 (number: px, string: CSS 값) */
  minHeight?: number | string;
  /** 화면 상태 시멘틱 — 아이콘 색을 구동 @default "empty" */
  status?: ResultStateStatus;
  /** 빈 상태 내부 콘텐츠 (Icon, Title, Description, Action 등) */
  children: React.ReactNode;
}

export const ResultStateRoot: React.FC<ResultStateRootProps> = React.memo(
  ({ minHeight, status = "empty", children, className, style, ...rest }) => (
    <div
      data-slot="root"
      data-status={status}
      className={cx(EMPTY_ROOT_CLASS, className)}
      style={{
        ...(minHeight !== undefined &&
          ({
            "--nds-result-state-min-height":
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
ResultStateRoot.displayName = "ResultStateRoot";

/* ─── Compound: Icon ─── */

export interface ResultStateIconProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 아이콘 또는 일러스트 (aria-hidden 자동 적용) */
  children: React.ReactNode;
}

export const ResultStateIcon: React.FC<ResultStateIconProps> = React.memo(
  ({ children, className, ...rest }) => (
    <div data-slot="icon" className={cx(EMPTY_ICON_CLASS, className)} aria-hidden="true" {...rest}>
      {children}
    </div>
  ),
);
ResultStateIcon.displayName = "ResultStateIcon";

/* ─── Compound: Title ─── */

export interface ResultStateTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** 빈 상태 제목 텍스트 (`<h3>`으로 렌더링) */
  children: React.ReactNode;
}

export const ResultStateTitle: React.FC<ResultStateTitleProps> = React.memo(
  ({ children, className, ...rest }) => (
    <h3 data-slot="title" className={cx(EMPTY_TITLE_CLASS, className)} {...rest}>
      {children}
    </h3>
  ),
);
ResultStateTitle.displayName = "ResultStateTitle";

/* ─── Compound: Description ─── */

export interface ResultStateDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** 빈 상태 설명 문구 */
  children: React.ReactNode;
}

export const ResultStateDescription: React.FC<ResultStateDescriptionProps> = React.memo(
  ({ children, className, ...rest }) => (
    <p data-slot="description" className={cx(EMPTY_DESC_CLASS, className)} {...rest}>
      {children}
    </p>
  ),
);
ResultStateDescription.displayName = "ResultStateDescription";

/* ─── Compound: Action ─── */

export interface ResultStateActionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 하단 액션 영역 (버튼 등) */
  children: React.ReactNode;
}

export const ResultStateAction: React.FC<ResultStateActionProps> = React.memo(
  ({ children, className, ...rest }) => (
    <div data-slot="action" className={cx(EMPTY_ACTION_CLASS, className)} {...rest}>
      {children}
    </div>
  ),
);
ResultStateAction.displayName = "ResultStateAction";

/* ─── Flat API ─── */

export interface ResultStateSlotProps {
  /** 루트 `<div>`에 전달할 추가 props */
  root?: Omit<ResultStateRootProps, "children" | "minHeight">;
  /** 아이콘 `<div>`에 전달할 추가 props */
  icon?: Omit<ResultStateIconProps, "children">;
  /** 제목 `<h3>`에 전달할 추가 props */
  title?: Omit<ResultStateTitleProps, "children">;
  /** 설명 `<p>`에 전달할 추가 props */
  description?: Omit<ResultStateDescriptionProps, "children">;
  /** 액션 `<div>`에 전달할 추가 props */
  action?: Omit<ResultStateActionProps, "children">;
}

export interface ResultStateProps {
  /** 아이콘 또는 이미지 (생략 시 `status` 기본 글리프) */
  icon?: React.ReactNode;
  /** 화면 상태 시멘틱 — 기본 아이콘 글리프 + 아이콘 색 @default "empty" */
  status?: ResultStateStatus;
  /** 제목 */
  title?: string;
  /** 설명 문구 */
  description?: string;
  /** 하단 액션 (버튼 등) */
  action?: React.ReactNode;
  /** 최소 높이 (인라인 placeholder 는 작게, 결과 화면은 `"60vh"` 등 크게) */
  minHeight?: number | string;
  /** 루트 className */
  className?: string;
  /** 루트 style */
  style?: React.CSSProperties;
  /** 슬롯 프롭 */
  slotProps?: ResultStateSlotProps;
}

const renderMultiline = (text: string): React.ReactNode =>
  text.split("\n").reduce<React.ReactNode[]>((acc, line, i) => {
    if (i > 0) acc.push(<br key={`br-${i}`} />);
    acc.push(line);
    return acc;
  }, []);

/* status 별 기본 글리프 — 모두 currentColor (색은 data-status 가 CSS 로 구동) */
const STATUS_ICONS: Record<ResultStateStatus, React.ReactNode> = {
  empty: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
      <path d="M22 32H42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 22V42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" />
      <path
        d="M21 33l8 8 14-16"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" />
      <path d="M24 24l16 16M40 24L24 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" />
      <circle cx="32" cy="21" r="2.4" fill="currentColor" />
      <path d="M32 29v16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
};

const ResultStateComponent: React.FC<ResultStateProps> = ({
  icon,
  status = "empty",
  title,
  description,
  action,
  minHeight,
  className,
  style,
  slotProps,
}) => (
  <ResultStateRoot
    minHeight={minHeight}
    status={status}
    className={cx(slotProps?.root?.className, className)}
    style={{ ...slotProps?.root?.style, ...style }}
  >
    <ResultStateIcon className={slotProps?.icon?.className} style={slotProps?.icon?.style}>
      {icon ?? STATUS_ICONS[status]}
    </ResultStateIcon>
    {title && (
      <ResultStateTitle className={slotProps?.title?.className} style={slotProps?.title?.style}>
        {title}
      </ResultStateTitle>
    )}
    {description && (
      <ResultStateDescription
        className={slotProps?.description?.className}
        style={slotProps?.description?.style}
      >
        {renderMultiline(description)}
      </ResultStateDescription>
    )}
    {action && (
      <ResultStateAction className={slotProps?.action?.className} style={slotProps?.action?.style}>
        {action}
      </ResultStateAction>
    )}
  </ResultStateRoot>
);

ResultStateComponent.displayName = "ResultState";

/* ─── Export: Flat + Compound ─── */

export const ResultState = Object.assign(ResultStateComponent, {
  Root: ResultStateRoot,
  Icon: ResultStateIcon,
  Title: ResultStateTitle,
  Description: ResultStateDescription,
  Action: ResultStateAction,
});
