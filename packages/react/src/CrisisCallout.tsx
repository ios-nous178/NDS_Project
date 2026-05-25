import React from "react";

/* ─── Constants ─── */

const CC_CLASS = "nds-crisis-callout";
const CC_ICON_CLASS = `${CC_CLASS}__icon`;
const CC_CONTENT_CLASS = `${CC_CLASS}__content`;
const CC_TITLE_CLASS = `${CC_CLASS}__title`;
const CC_DESC_CLASS = `${CC_CLASS}__description`;
const CC_ACTIONS_CLASS = `${CC_CLASS}__actions`;
const CC_ACTION_CLASS = `${CC_CLASS}__action`;
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const AlertIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2L22 20H2L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.15"
    />
    <path d="M12 9V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3.5 2.5C3.5 2.22386 3.72386 2 4 2H6L7 5L5.5 6C6.5 8 8 9.5 10 10.5L11 9L14 10V12C14 12.2761 13.7761 12.5 13.5 12.5C7.97715 12.5 3.5 8.02285 3.5 2.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.2"
    />
  </svg>
);

/* ─── Types ─── */

export type CrisisTone = "danger" | "caution";

export interface CrisisAction {
  /** 버튼 라벨 */
  label: React.ReactNode;
  /** 클릭 콜백 */
  onClick?: () => void;
  /** 전화 번호 (제공 시 자동으로 tel: 링크) */
  phoneNumber?: string;
  /** outlined 형태 */
  variant?: "solid" | "outlined";
  /** 전화 아이콘 표시 */
  withPhoneIcon?: boolean;
}

export interface CrisisCalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 톤 (danger=빨강, caution=주황). 기본 danger */
  tone?: CrisisTone;
  /** 제목 */
  title: React.ReactNode;
  /** 설명 */
  description?: React.ReactNode;
  /** 액션 (전화번호/링크). 보통 1~2개 */
  actions?: CrisisAction[];
  /** 좌측 아이콘 커스터마이즈 */
  icon?: React.ReactNode;
}

/* ─── Component ─── */

export const CrisisCallout = React.forwardRef<HTMLDivElement, CrisisCalloutProps>(
  ({ tone = "danger", title, description, actions, icon, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="root"
        data-tone={tone}
        role="alert"
        className={cx(CC_CLASS, className)}
        {...rest}
      >
        <span data-slot="icon" className={CC_ICON_CLASS}>
          {icon ?? <AlertIcon />}
        </span>
        <div data-slot="content" className={CC_CONTENT_CLASS}>
          <p data-slot="title" className={CC_TITLE_CLASS}>
            {title}
          </p>
          {description && (
            <p data-slot="description" className={CC_DESC_CLASS}>
              {description}
            </p>
          )}
          {actions && actions.length > 0 && (
            <div data-slot="actions" className={CC_ACTIONS_CLASS}>
              {actions.map((action, idx) => {
                const showPhoneIcon = action.withPhoneIcon ?? !!action.phoneNumber;
                if (action.phoneNumber) {
                  return (
                    <a
                      key={idx}
                      data-slot="action"
                      data-variant={action.variant ?? "solid"}
                      className={CC_ACTION_CLASS}
                      href={`tel:${action.phoneNumber}`}
                      onClick={action.onClick}
                    >
                      {showPhoneIcon && <PhoneIcon />}
                      {action.label}
                    </a>
                  );
                }
                return (
                  <button
                    key={idx}
                    data-slot="action"
                    data-variant={action.variant ?? "solid"}
                    className={CC_ACTION_CLASS}
                    onClick={action.onClick}
                  >
                    {showPhoneIcon && <PhoneIcon />}
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  },
);

CrisisCallout.displayName = "CrisisCallout";
