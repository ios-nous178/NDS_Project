import React from "react";

/* ─── Class names ─── */

const FAR_CLASS = "nds-field-action-row";
const FAR_ROOT_CLASS = `${FAR_CLASS}__root`;
const FAR_FIELD_CLASS = `${FAR_CLASS}__field`;
const FAR_ACTION_CLASS = `${FAR_CLASS}__action`;
const FAR_HELPER_CLASS = `${FAR_CLASS}__helper`;
const FAR_TIMER_CLASS = `${FAR_CLASS}__timer`;
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Internal building blocks ───
 * FieldActionRow 는 "전화·코드 인증 폼" 전용 helper 라 공개 API 는 flat 하나로 고정한다.
 * 아래 조각들은 flat 컴포넌트의 내부 구현일 뿐 — export 하지 않는다 (구 Compound API 제거).
 */

interface FieldActionRowRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const FieldActionRowRoot: React.FC<FieldActionRowRootProps> = React.memo(
  ({ children, className, ...rest }) => (
    <div data-slot="root" className={cx(FAR_ROOT_CLASS, className)} {...rest}>
      {children}
    </div>
  ),
);
FieldActionRowRoot.displayName = "FieldActionRowRoot";

interface FieldActionRowRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const FieldActionRowRow: React.FC<FieldActionRowRowProps> = React.memo(
  ({ children, className, ...rest }) => (
    <div data-slot="row" className={className} {...rest}>
      {children}
    </div>
  ),
);
FieldActionRowRow.displayName = "FieldActionRowRow";

interface FieldActionRowFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: boolean;
  success?: boolean;
  /** 타이머 슬롯 존재 — true 면 우측 타이머 공간을 예약(겹침 방지) */
  hasTimer?: boolean;
  children: React.ReactNode;
}

const FieldActionRowField: React.FC<FieldActionRowFieldProps> = React.memo(
  ({ error = false, success = false, hasTimer = false, children, className, ...rest }) => (
    <div
      data-slot="field"
      data-error={error ? "true" : "false"}
      data-success={success ? "true" : "false"}
      data-has-timer={hasTimer ? "true" : "false"}
      className={cx(FAR_FIELD_CLASS, className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
FieldActionRowField.displayName = "FieldActionRowField";

interface FieldActionRowTimerProps extends React.HTMLAttributes<HTMLSpanElement> {
  expired?: boolean;
  children: React.ReactNode;
}

const FieldActionRowTimer: React.FC<FieldActionRowTimerProps> = React.memo(
  ({ expired = false, children, className, ...rest }) => (
    <span
      data-slot="timer"
      data-expired={expired ? "true" : "false"}
      className={cx(FAR_TIMER_CLASS, className)}
      {...rest}
    >
      {children}
    </span>
  ),
);
FieldActionRowTimer.displayName = "FieldActionRowTimer";

interface FieldActionRowActionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 액션 버튼 스타일 톤 @default "outline" */
  tone?: "outline" | "solid";
  children: React.ReactNode;
}

const FieldActionRowAction: React.FC<FieldActionRowActionProps> = React.memo(
  ({ tone = "outline", children, className, ...rest }) => (
    <div data-slot="action" data-tone={tone} className={cx(FAR_ACTION_CLASS, className)} {...rest}>
      {children}
    </div>
  ),
);
FieldActionRowAction.displayName = "FieldActionRowAction";

interface FieldActionRowHelperProps extends React.HTMLAttributes<HTMLSpanElement> {
  error?: boolean;
  success?: boolean;
  children: React.ReactNode;
}

const FieldActionRowHelper: React.FC<FieldActionRowHelperProps> = React.memo(
  ({ error = false, success = false, children, className, ...rest }) => (
    <span
      data-slot="helper"
      data-error={error ? "true" : "false"}
      data-success={success ? "true" : "false"}
      className={cx(FAR_HELPER_CLASS, className)}
      {...rest}
    >
      {children}
    </span>
  ),
);
FieldActionRowHelper.displayName = "FieldActionRowHelper";

/* ─── Flat API (공개 surface) ─── */

export interface FieldActionRowSlotProps {
  /** 루트 `<div>`에 전달할 추가 props */
  root?: Omit<React.HTMLAttributes<HTMLDivElement>, "children">;
  /** 필드 `<div>`에 전달할 추가 props */
  field?: Omit<React.HTMLAttributes<HTMLDivElement>, "children">;
  /** 액션 `<div>`에 전달할 추가 props */
  action?: Omit<React.HTMLAttributes<HTMLDivElement>, "children">;
  /** 헬퍼 `<span>`에 전달할 추가 props */
  helper?: Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;
}

export interface FieldActionRowProps {
  /** 입력 필드 (Input 또는 native input) */
  field: React.ReactNode;
  /**
   * 액션 버튼 (옵션). 생략하면 "필드(+타이머)만" 한 줄 — 인라인 버튼 없이 코드 입력 + 우측 타이머만
   * 두는 레이아웃(예: 캐포비 본인인증의 별도 full-width 재전송 버튼 + 타이머만 있는 코드 입력).
   */
  action?: React.ReactNode;
  /** 버튼 톤 */
  actionTone?: "outline" | "solid";
  /** 타이머 표시 */
  timer?: React.ReactNode;
  /** 타이머 만료 상태 */
  timerExpired?: boolean;
  /** 에러 상태 */
  error?: boolean;
  /** 도움/에러/성공 텍스트 */
  helperText?: string;
  /** 성공 상태 */
  success?: boolean;
  /** 루트 className */
  className?: string;
  /** 루트 style */
  style?: React.CSSProperties;
  /** 슬롯 프롭 */
  slotProps?: FieldActionRowSlotProps;
}

/**
 * 전화번호 인증 / 인증코드 입력처럼 "입력 1개 (+ 액션 버튼) (+타이머)" 한 줄 패턴 전용 helper.
 * action 은 옵션 — 생략하면 코드 입력 + 우측 타이머만(인라인 버튼 없는 캐포비 본인인증 레이아웃).
 * 일반 폼 레이아웃(여러 필드/버튼)에는 쓰지 않는다 — Input + Button 직접 조합을 사용.
 */
const FieldActionRowComponent: React.FC<FieldActionRowProps> = ({
  field,
  action,
  actionTone = "outline",
  timer,
  timerExpired = false,
  error = false,
  helperText,
  success = false,
  className,
  style,
  slotProps,
}) => (
  <FieldActionRowRoot
    className={cx(slotProps?.root?.className, className)}
    style={{ ...slotProps?.root?.style, ...style }}
  >
    <FieldActionRowRow>
      <FieldActionRowField
        error={error}
        success={success}
        hasTimer={timer !== undefined}
        className={slotProps?.field?.className}
      >
        {field}
        {timer !== undefined && (
          <FieldActionRowTimer expired={timerExpired}>{timer}</FieldActionRowTimer>
        )}
      </FieldActionRowField>
      {action != null && (
        <FieldActionRowAction tone={actionTone} className={slotProps?.action?.className}>
          {action}
        </FieldActionRowAction>
      )}
    </FieldActionRowRow>
    {helperText && (
      <FieldActionRowHelper
        error={error}
        success={success}
        className={slotProps?.helper?.className}
      >
        {helperText}
      </FieldActionRowHelper>
    )}
  </FieldActionRowRoot>
);

FieldActionRowComponent.displayName = "FieldActionRow";

export const FieldActionRow = FieldActionRowComponent;
