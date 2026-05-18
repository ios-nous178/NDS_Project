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

const FAR_CLASS = "nds-field-action-row";
const FAR_ROOT_CLASS = `${FAR_CLASS}__root`;
const FAR_FIELD_CLASS = `${FAR_CLASS}__field`;
const FAR_ACTION_CLASS = `${FAR_CLASS}__action`;
const FAR_HELPER_CLASS = `${FAR_CLASS}__helper`;
const FAR_TIMER_CLASS = `${FAR_CLASS}__timer`;

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const fieldActionRowStyles = `
  :where(.${FAR_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--nds-far-gap, ${spacing[8]}px);
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${FAR_ROOT_CLASS} > [data-slot="row"]) {
    display: flex;
    gap: ${spacing[8]}px;
    align-items: flex-start;
  }

  :where(.${FAR_FIELD_CLASS}) {
    flex: 1;
    min-width: 0;
    position: relative;
  }

  :where(.${FAR_FIELD_CLASS} input) {
    width: 100%;
    height: 48px;
    padding: 0 ${spacing[16]}px;
    border: 1px solid var(--nds-far-border-color, ${cv.borderRole.normal});
    border-radius: ${radius.md}px;
    background: ${cv.surface.default};
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
    outline: none;
    box-sizing: border-box;
    transition: border-color ${transition.default};
    -moz-appearance: textfield;
  }

  :where(.${FAR_FIELD_CLASS} input::-webkit-outer-spin-button),
  :where(.${FAR_FIELD_CLASS} input::-webkit-inner-spin-button) {
    -webkit-appearance: none;
    margin: 0;
  }

  :where(.${FAR_FIELD_CLASS} input::placeholder) {
    color: ${cv.textRole.muted};
    font-size: ${typeScale.body2.fontSize}px;
  }

  :where(.${FAR_FIELD_CLASS} input:focus) {
    border-color: ${cv.borderRole.focus};
  }

  :where(.${FAR_FIELD_CLASS}[data-error="true"] input) {
    border-color: ${cv.borderRole.statusError};
  }

  :where(.${FAR_FIELD_CLASS}[data-success="true"] input) {
    border-color: ${cv.iconRole.statusSuccess};
  }

  :where(.${FAR_TIMER_CLASS}) {
    position: absolute;
    right: ${spacing[16]}px;
    top: 50%;
    transform: translateY(-50%);
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.brand};
  }

  :where(.${FAR_TIMER_CLASS}[data-expired="true"]) {
    color: ${cv.textRole.statusError};
  }

  :where(.${FAR_ACTION_CLASS}) {
    flex-shrink: 0;
  }

  :where(.${FAR_ACTION_CLASS} button) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    min-width: var(--nds-far-action-min-width, 70px);
    padding: 0 ${spacing[16]}px;
    border-radius: ${radius.md}px;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.bold};
    white-space: nowrap;
    cursor: pointer;
    box-sizing: border-box;
    transition:
      background-color ${transition.default},
      border-color ${transition.default},
      color ${transition.default};
  }

  :where(.${FAR_ACTION_CLASS}[data-tone="outline"] button) {
    border: 1px solid ${cv.borderRole.brand};
    background: ${cv.surface.default};
    color: ${cv.textRole.brand};
  }

  :where(.${FAR_ACTION_CLASS}[data-tone="outline"] button:hover:not(:disabled)) {
    border-color: ${cv.fill.brandHover};
    color: ${cv.fill.brandHover};
  }

  :where(.${FAR_ACTION_CLASS}[data-tone="solid"] button) {
    border: 1px solid ${cv.borderRole.brand};
    background: ${cv.surface.brand};
    color: ${cv.textRole.inverse};
  }

  :where(.${FAR_ACTION_CLASS}[data-tone="solid"] button:hover:not(:disabled)) {
    background: ${cv.fill.brandHover};
    border-color: ${cv.fill.brandHover};
  }

  :where(.${FAR_ACTION_CLASS} button:disabled) {
    border-color: ${cv.borderRole.disabled};
    background: ${cv.surface.disabled};
    color: ${cv.textRole.muted};
    cursor: not-allowed;
  }

  :where(.${FAR_ACTION_CLASS}[data-tone="solid"] button:disabled) {
    border-color: transparent;
    background: ${cv.surface.disabled};
    color: ${cv.textRole.muted};
  }

  :where(.${FAR_HELPER_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: 1.5;
    color: ${cv.textRole.muted};
    transition: color ${transition.default};
  }

  :where(.${FAR_HELPER_CLASS}[data-error="true"]) {
    color: ${cv.textRole.statusError};
  }

  :where(.${FAR_HELPER_CLASS}[data-success="true"]) {
    color: ${cv.textRole.statusError};
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Compound: Root ─── */

export interface FieldActionRowRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Root 내부 콘텐츠 (Row, Helper 등) */
  children: React.ReactNode;
}

export const FieldActionRowRoot: React.FC<FieldActionRowRootProps> = React.memo(
  ({ children, className, ...rest }) => (
    <div data-slot="root" className={cx(FAR_ROOT_CLASS, className)} {...rest}>
      {children}
    </div>
  ),
);
FieldActionRowRoot.displayName = "FieldActionRowRoot";

/* ─── Compound: Row ─── */

export interface FieldActionRowRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 한 행의 콘텐츠 (Field, Timer, Action) */
  children: React.ReactNode;
}

export const FieldActionRowRow: React.FC<FieldActionRowRowProps> = React.memo(
  ({ children, className, ...rest }) => (
    <div data-slot="row" className={className} {...rest}>
      {children}
    </div>
  ),
);
FieldActionRowRow.displayName = "FieldActionRowRow";

/* ─── Compound: Field ─── */

export interface FieldActionRowFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 에러 상태 표시 */
  error?: boolean;
  /** 성공 상태 표시 */
  success?: boolean;
  /** 입력 필드 콘텐츠 */
  children: React.ReactNode;
}

export const FieldActionRowField: React.FC<FieldActionRowFieldProps> = React.memo(
  ({ error = false, success = false, children, className, ...rest }) => (
    <div
      data-slot="field"
      data-error={error ? "true" : "false"}
      data-success={success ? "true" : "false"}
      className={cx(FAR_FIELD_CLASS, className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
FieldActionRowField.displayName = "FieldActionRowField";

/* ─── Compound: Timer ─── */

export interface FieldActionRowTimerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 타이머 만료 상태 (만료 시 경고 스타일) */
  expired?: boolean;
  /** 타이머 텍스트 (예: "02:30") */
  children: React.ReactNode;
}

export const FieldActionRowTimer: React.FC<FieldActionRowTimerProps> = React.memo(
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

/* ─── Compound: Action ─── */

export interface FieldActionRowActionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 액션 버튼 스타일 톤 @default "outline" */
  tone?: "outline" | "solid";
  /** 액션 버튼 콘텐츠 */
  children: React.ReactNode;
}

export const FieldActionRowAction: React.FC<FieldActionRowActionProps> = React.memo(
  ({ tone = "outline", children, className, ...rest }) => (
    <div data-slot="action" data-tone={tone} className={cx(FAR_ACTION_CLASS, className)} {...rest}>
      {children}
    </div>
  ),
);
FieldActionRowAction.displayName = "FieldActionRowAction";

/* ─── Compound: Helper ─── */

export interface FieldActionRowHelperProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 에러 상태 표시 */
  error?: boolean;
  /** 성공 상태 표시 */
  success?: boolean;
  /** 도움/에러/성공 메시지 텍스트 */
  children: React.ReactNode;
}

export const FieldActionRowHelper: React.FC<FieldActionRowHelperProps> = React.memo(
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

/* ─── Flat API ─── */

export interface FieldActionRowSlotProps {
  /** 루트 `<div>`에 전달할 추가 props */
  root?: Omit<FieldActionRowRootProps, "children">;
  /** 필드 `<div>`에 전달할 추가 props */
  field?: Omit<FieldActionRowFieldProps, "children" | "error">;
  /** 액션 `<div>`에 전달할 추가 props */
  action?: Omit<FieldActionRowActionProps, "children" | "tone">;
  /** 헬퍼 `<span>`에 전달할 추가 props */
  helper?: Omit<FieldActionRowHelperProps, "children" | "error" | "success">;
}

export interface FieldActionRowProps {
  /** 입력 필드 (Input 또는 native input) */
  field: React.ReactNode;
  /** 액션 버튼 */
  action: React.ReactNode;
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
      <FieldActionRowField error={error} success={success} className={slotProps?.field?.className}>
        {field}
        {timer !== undefined && (
          <FieldActionRowTimer expired={timerExpired}>{timer}</FieldActionRowTimer>
        )}
      </FieldActionRowField>
      <FieldActionRowAction tone={actionTone} className={slotProps?.action?.className}>
        {action}
      </FieldActionRowAction>
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

/* ─── Export: Flat + Compound ─── */

export const FieldActionRow = Object.assign(FieldActionRowComponent, {
  Root: FieldActionRowRoot,
  Row: FieldActionRowRow,
  Field: FieldActionRowField,
  Timer: FieldActionRowTimer,
  Action: FieldActionRowAction,
  Helper: FieldActionRowHelper,
});
