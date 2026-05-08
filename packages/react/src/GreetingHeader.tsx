import React from "react";
import { cv, fontFamily, fontWeight, radius, spacing, typeScale } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const GH_CLASS = "nds-greeting-header";
const GH_TOP_CLASS = `${GH_CLASS}__top`;
const GH_GREETING_CLASS = `${GH_CLASS}__greeting`;
const GH_TITLE_CLASS = `${GH_CLASS}__title`;
const GH_QUESTION_CLASS = `${GH_CLASS}__question`;
const GH_ACTIONS_CLASS = `${GH_CLASS}__actions`;
const GH_TRAILING_CLASS = `${GH_CLASS}__trailing`;

/* ─── Types ─── */

export interface GreetingHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 사용자 이름 / 호칭 */
  name: string;
  /** 인삿말 (시간대 자동 인식 안 함 — 외부에서 결정) */
  greeting?: string;
  /** 메인 질문/메시지 */
  question?: React.ReactNode;
  /** 우측 트레일링 슬롯 (Avatar / IconButton) */
  trailing?: React.ReactNode;
  /** 액션 영역 (MoodSelector 등 진입) */
  actions?: React.ReactNode;
  /** 배경 톤 ("default" 흰 배경 / "primary" 파란 톤) */
  tone?: "default" | "primary";
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const ghStyles = `
  :where(.${GH_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[16]}px;
    padding: ${spacing[24]}px;
    background: ${cv.bg.white};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${GH_CLASS}[data-tone="primary"]) {
    background: var(--color-semantic-primary-bg, #EBF1FF);
  }

  :where(.${GH_TOP_CLASS}) {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${spacing[16]}px;
  }

  :where(.${GH_GREETING_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    color: ${cv.text.subtle};
    margin: 0 0 ${spacing[4]}px 0;
  }

  :where(.${GH_TITLE_CLASS}) {
    font-size: ${typeScale.headline2.fontSize}px;
    line-height: ${typeScale.headline2.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.text.default};
    margin: 0;
  }

  :where(.${GH_QUESTION_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.text.subtle};
    margin: ${spacing[8]}px 0 0 0;
  }

  :where(.${GH_TRAILING_CLASS}) {
    flex-shrink: 0;
  }

  :where(.${GH_ACTIONS_CLASS}) {
    margin-top: ${spacing[8]}px;
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const GreetingHeader = React.forwardRef<HTMLDivElement, GreetingHeaderProps>(
  (
    {
      name,
      greeting = "안녕하세요",
      question,
      trailing,
      actions,
      tone = "default",
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        data-slot="root"
        data-tone={tone}
        className={cx(GH_CLASS, className)}
        {...rest}
      >
        <div className={GH_TOP_CLASS}>
          <div>
            <p className={GH_GREETING_CLASS}>{greeting}</p>
            <h2 className={GH_TITLE_CLASS}>{name}님</h2>
            {question && <p className={GH_QUESTION_CLASS}>{question}</p>}
          </div>
          {trailing && <div className={GH_TRAILING_CLASS}>{trailing}</div>}
        </div>
        {actions && <div className={GH_ACTIONS_CLASS}>{actions}</div>}
      </div>
    );
  },
);

GreetingHeader.displayName = "GreetingHeader";
