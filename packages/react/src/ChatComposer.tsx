import React, { useCallback, useLayoutEffect, useRef } from "react";
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

const CC_CLASS = "nds-chat-composer";
const CC_QUICK_CLASS = `${CC_CLASS}__quick`;
const CC_QUICK_ITEM_CLASS = `${CC_CLASS}__quick-item`;
const CC_INPUT_AREA_CLASS = `${CC_CLASS}__input-area`;
const CC_LEFT_CLASS = `${CC_CLASS}__left`;
const CC_TEXTAREA_CLASS = `${CC_CLASS}__textarea`;
const CC_BTN_CLASS = `${CC_CLASS}__btn`;
const CC_SEND_CLASS = `${CC_CLASS}__send`;
const CC_COUNT_CLASS = `${CC_CLASS}__count`;

/* ─── Types ─── */

export interface QuickReply {
  /** 라벨 */
  label: string;
  /** 클릭 콜백 */
  onClick: () => void;
}

export interface ChatComposerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "onSubmit"
> {
  /** 입력값 (controlled) */
  value: string;
  /** 변경 콜백 */
  onValueChange: (value: string) => void;
  /** 전송 콜백 (Enter 또는 전송 버튼) */
  onSubmit: (value: string) => void;
  /** 자리표시자 */
  placeholder?: string;
  /** 최대 글자 수 (지정 시 카운터 표시) */
  maxLength?: number;
  /** 첨부 클릭 콜백 (지정 시 첨부 버튼 노출) */
  onAttach?: () => void;
  /** 음성 클릭 콜백 (지정 시 마이크 버튼 노출) */
  onMic?: () => void;
  /** 빠른 응답 칩 (입력 영역 위에 노출) */
  quickReplies?: QuickReply[];
  /** 비활성화 (전송 중 등) */
  disabled?: boolean;
  /** Shift+Enter로 줄바꿈 / Enter로 전송 (기본 true). false면 모든 Enter가 줄바꿈 */
  submitOnEnter?: boolean;
  /** 최대 높이 px (자동 확장 제한) */
  maxHeight?: number;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const composerStyles = `
  :where(.${CC_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-default);
    padding: var(--inset-input);
    background: ${cv.surface.default};
    border-top: 1px solid ${cv.borderRole.subtle};
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${CC_QUICK_CLASS}) {
    display: flex;
    gap: var(--gap-default);
    overflow-x: auto;
    padding-bottom: ${spacing[4]}px;
    scrollbar-width: none;
  }
  :where(.${CC_QUICK_CLASS})::-webkit-scrollbar { display: none; }

  :where(.${CC_QUICK_ITEM_CLASS}) {
    flex-shrink: 0;
    height: 32px;
    padding: 0 var(--inset-input);
    border-radius: 9999px;
    border: 1px solid ${cv.borderRole.normal};
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.medium};
    white-space: nowrap;
    transition: background-color ${transition.default};
  }

  :where(.${CC_QUICK_ITEM_CLASS}:hover) { background: ${cv.surface.section}; }

  :where(.${CC_INPUT_AREA_CLASS}) {
    display: flex;
    align-items: flex-end;
    gap: var(--gap-default);
    background: ${cv.surface.section};
    border-radius: ${radius.lg}px;
    padding: var(--inset-chip);
  }

  :where(.${CC_LEFT_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-tight);
  }

  :where(.${CC_BTN_CLASS}) {
    width: 36px;
    height: 36px;
    border-radius: 9999px;
    border: none;
    background: transparent;
    color: ${cv.textRole.normal};
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background-color ${transition.default};
  }

  :where(.${CC_BTN_CLASS}:hover:not([disabled])) { background: ${cv.surface.default}; }

  :where(.${CC_BTN_CLASS}[disabled]) {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :where(.${CC_TEXTAREA_CLASS}) {
    flex: 1;
    min-width: 0;
    border: none;
    background: transparent;
    resize: none;
    outline: none;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
    padding: var(--inset-chip) 4px;
    max-height: var(--nds-chat-composer-max, 120px);
    overflow-y: auto;
    box-sizing: border-box;
  }

  :where(.${CC_TEXTAREA_CLASS}::placeholder) { color: ${cv.textRole.muted}; }

  :where(.${CC_SEND_CLASS}) {
    width: 36px;
    height: 36px;
    border-radius: 9999px;
    background: ${cv.surface.brand};
    color: #fff;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: opacity ${transition.default};
  }

  :where(.${CC_SEND_CLASS}[disabled]) {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :where(.${CC_COUNT_CLASS}) {
    text-align: right;
    font-size: ${typeScale.caption2.fontSize}px;
    color: ${cv.textRole.subtle};
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const ChatComposer = React.forwardRef<HTMLDivElement, ChatComposerProps>(
  (
    {
      value,
      onValueChange,
      onSubmit,
      placeholder = "메시지를 입력하세요",
      maxLength,
      onAttach,
      onMic,
      quickReplies,
      disabled = false,
      submitOnEnter = true,
      maxHeight = 120,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const taRef = useRef<HTMLTextAreaElement>(null);

    useLayoutEffect(() => {
      const ta = taRef.current;
      if (!ta) return;
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, maxHeight)}px`;
    }, [value, maxHeight]);

    const canSubmit = !disabled && value.trim().length > 0;

    const handleSubmit = useCallback(() => {
      if (!canSubmit) return;
      onSubmit(value);
    }, [canSubmit, onSubmit, value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (submitOnEnter && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    return (
      <div
        ref={ref}
        data-slot="root"
        className={cx(CC_CLASS, className)}
        style={{ "--nds-chat-composer-max": `${maxHeight}px`, ...style } as React.CSSProperties}
        {...rest}
      >
        {quickReplies && quickReplies.length > 0 && (
          <div className={CC_QUICK_CLASS} role="toolbar" aria-label="빠른 응답">
            {quickReplies.map((q, i) => (
              <button key={i} type="button" className={CC_QUICK_ITEM_CLASS} onClick={q.onClick}>
                {q.label}
              </button>
            ))}
          </div>
        )}
        <div className={CC_INPUT_AREA_CLASS}>
          {(onAttach || onMic) && (
            <div className={CC_LEFT_CLASS}>
              {onAttach && (
                <button
                  type="button"
                  className={CC_BTN_CLASS}
                  aria-label="첨부"
                  onClick={onAttach}
                  disabled={disabled}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                    <path
                      d="M14 6L8 12c-1 1-1 3 0 4s3 1 4 0l7-7c-2-2-5-2-7 0L5 16c-2 2-2 6 0 8s6 2 8 0l7-7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
              {onMic && (
                <button
                  type="button"
                  className={CC_BTN_CLASS}
                  aria-label="음성"
                  onClick={onMic}
                  disabled={disabled}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                    <rect
                      x="7"
                      y="2"
                      width="6"
                      height="10"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M4 9c0 3 3 6 6 6s6-3 6-6M10 15v3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
          <textarea
            ref={taRef}
            className={CC_TEXTAREA_CLASS}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            maxLength={maxLength}
            onChange={(e) => onValueChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className={CC_SEND_CLASS}
            aria-label="전송"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M2 9l14-6-3 6 3 6-14-6z" fill="currentColor" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        {maxLength && (
          <div className={CC_COUNT_CLASS} aria-live="polite">
            {value.length} / {maxLength}
          </div>
        )}
      </div>
    );
  },
);

ChatComposer.displayName = "ChatComposer";
