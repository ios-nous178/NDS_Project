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

/* ─── Constants ─── */

const CC_CLASS = "nds-crisis-callout";
const CC_ICON_CLASS = `${CC_CLASS}__icon`;
const CC_CONTENT_CLASS = `${CC_CLASS}__content`;
const CC_TITLE_CLASS = `${CC_CLASS}__title`;
const CC_DESC_CLASS = `${CC_CLASS}__description`;
const CC_ACTIONS_CLASS = `${CC_CLASS}__actions`;
const CC_ACTION_CLASS = `${CC_CLASS}__action`;

// eslint-disable-next-line unused-imports/no-unused-vars
const crisisCalloutStyles = `
  :where(.${CC_CLASS}) {
    display: flex;
    align-items: flex-start;
    gap: ${spacing[12]}px;
    width: 100%;
    padding: ${spacing[16]}px ${spacing[20]}px;
    background: ${cv.surface.statusError};
    border: 1px solid ${cv.borderRole.statusError};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${CC_CLASS}[data-tone="caution"]) {
    background: ${cv.surface.statusCaution};
    border-color: ${cv.borderRole.statusCaution};
  }

  :where(.${CC_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    color: ${cv.textRole.statusError};
  }

  :where(.${CC_CLASS}[data-tone="caution"]) .${CC_ICON_CLASS} {
    color: ${cv.textRole.statusCaution};
  }

  :where(.${CC_CONTENT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[6]}px;
    flex: 1;
    min-width: 0;
  }

  :where(.${CC_TITLE_CLASS}) {
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.statusError};
    margin: 0;
  }

  :where(.${CC_CLASS}[data-tone="caution"]) .${CC_TITLE_CLASS} {
    color: ${cv.textRole.statusCaution};
  }

  :where(.${CC_DESC_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.strong};
    margin: 0;
  }

  :where(.${CC_ACTIONS_CLASS}) {
    display: flex;
    gap: ${spacing[8]}px;
    margin-top: ${spacing[8]}px;
    flex-wrap: wrap;
  }

  :where(.${CC_ACTION_CLASS}) {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: ${spacing[6]}px;
    padding: ${spacing[8]}px ${spacing[12]}px;
    background: ${cv.fill.statusError};
    color: ${cv.textRole.inverse};
    border-radius: ${radius.md}px;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.bold};
    line-height: ${typeScale.body3.lineHeight}px;
    cursor: pointer;
    transition: opacity ${transition.default};
    box-sizing: border-box;
  }

  :where(.${CC_CLASS}[data-tone="caution"]) .${CC_ACTION_CLASS} {
    background: ${cv.fill.statusCaution};
  }

  :where(.${CC_ACTION_CLASS}:hover) {
    opacity: 0.9;
  }

  :where(.${CC_ACTION_CLASS}[data-variant="outlined"]) {
    background: transparent;
    color: ${cv.textRole.statusError};
    border: 1px solid ${cv.borderRole.statusError};
  }

  :where(.${CC_CLASS}[data-tone="caution"]) .${CC_ACTION_CLASS}[data-variant="outlined"] {
    color: ${cv.textRole.statusCaution};
    border-color: ${cv.borderRole.statusCaution};
  }
`;

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
