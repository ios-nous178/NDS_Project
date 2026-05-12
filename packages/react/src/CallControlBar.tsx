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

const CB_CLASS = "nds-call-control-bar";
const CB_TIMER_CLASS = `${CB_CLASS}__timer`;
const CB_BUTTONS_CLASS = `${CB_CLASS}__buttons`;
const CB_BTN_CLASS = `${CB_CLASS}__btn`;
const CB_END_CLASS = `${CB_CLASS}__end`;
const CB_LABEL_CLASS = `${CB_CLASS}__label`;

/* ─── Types ─── */

export interface CallControlBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 음소거 상태 */
  muted: boolean;
  /** 음소거 토글 */
  onMutedChange: (muted: boolean) => void;
  /** 카메라 사용 여부 (화상 통화 시) */
  cameraOn?: boolean;
  /** 카메라 토글 (지정 시 카메라 버튼 노출) */
  onCameraChange?: (on: boolean) => void;
  /** 스피커 ON */
  speakerOn?: boolean;
  /** 스피커 토글 (지정 시 스피커 버튼 노출) */
  onSpeakerChange?: (on: boolean) => void;
  /** 종료 콜백 */
  onEnd: () => void;
  /** 통화 시간 (mm:ss 또는 ReactNode). 표시 영역 */
  duration?: React.ReactNode;
  /** 추가 컨트롤 버튼 (좌측 끝, 채팅 등) */
  extra?: React.ReactNode;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const cbStyles = `
  :where(.${CB_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${spacing[16]}px;
    padding: ${spacing[20]}px;
    background: var(--nds-call-bar-bg, rgba(0, 0, 0, 0.85));
    color: #fff;
    border-radius: var(--nds-call-bar-radius, ${radius.lg}px);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${CB_TIMER_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    opacity: 0.85;
    font-variant-numeric: tabular-nums;
  }

  :where(.${CB_BUTTONS_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[16]}px;
  }

  :where(.${CB_BTN_CLASS}) {
    width: 56px;
    height: 56px;
    border-radius: 9999px;
    border: none;
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color ${transition.default}, color ${transition.default};
    flex-shrink: 0;
  }

  :where(.${CB_BTN_CLASS}:hover) { background: rgba(255, 255, 255, 0.28); }

  :where(.${CB_BTN_CLASS}[data-active="true"]) {
    background: #fff;
    color: #1A1A1A;
  }

  :where(.${CB_BTN_CLASS}:focus-visible) {
    outline: 3px solid ${cv.primary.main};
    outline-offset: 2px;
  }

  :where(.${CB_END_CLASS}) {
    background: var(--color-semantic-error-main, #E04D4D);
  }

  :where(.${CB_END_CLASS}:hover) { background: var(--color-semantic-error-text, #B83333); }

  :where(.${CB_LABEL_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-size: ${typeScale.caption2.fontSize}px;
    color: rgba(255, 255, 255, 0.7);
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const CallControlBar = React.forwardRef<HTMLDivElement, CallControlBarProps>(
  (
    {
      muted,
      onMutedChange,
      cameraOn,
      onCameraChange,
      speakerOn,
      onSpeakerChange,
      onEnd,
      duration,
      extra,
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div ref={ref} data-slot="root" className={cx(CB_CLASS, className)} {...rest}>
        {duration && <span className={CB_TIMER_CLASS}>{duration}</span>}
        <div className={CB_BUTTONS_CLASS}>
          {extra}
          {/* 음소거 */}
          <button
            type="button"
            className={CB_BTN_CLASS}
            data-active={muted ? "true" : "false"}
            aria-label={muted ? "음소거 해제" : "음소거"}
            aria-pressed={muted}
            onClick={() => onMutedChange(!muted)}
          >
            {muted ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
                <rect
                  x="8"
                  y="3"
                  width="6"
                  height="10"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M5 10c0 3 3 6 6 6s6-3 6-6M11 16v3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path d="M3 3l16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
                <rect
                  x="8"
                  y="3"
                  width="6"
                  height="10"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M5 10c0 3 3 6 6 6s6-3 6-6M11 16v3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          {/* 카메라 */}
          {onCameraChange && (
            <button
              type="button"
              className={CB_BTN_CLASS}
              data-active={cameraOn === false ? "true" : "false"}
              aria-label={cameraOn ? "카메라 끄기" : "카메라 켜기"}
              aria-pressed={!cameraOn}
              onClick={() => onCameraChange(!cameraOn)}
            >
              {cameraOn ? (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
                  <rect
                    x="2"
                    y="6"
                    width="13"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M15 9l5-3v10l-5-3z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
                  <rect
                    x="2"
                    y="6"
                    width="13"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M15 9l5-3v10l-5-3z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 3l16 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          )}

          {/* 스피커 */}
          {onSpeakerChange && (
            <button
              type="button"
              className={CB_BTN_CLASS}
              data-active={speakerOn ? "true" : "false"}
              aria-label={speakerOn ? "스피커 끄기" : "스피커 켜기"}
              aria-pressed={!!speakerOn}
              onClick={() => onSpeakerChange(!speakerOn)}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
                <path d="M3 8h4l5-4v14l-5-4H3z" fill="currentColor" />
                <path
                  d="M16 7c1.5 1.5 1.5 6.5 0 8M19 4c3 3 3 11 0 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}

          {/* 종료 */}
          <button
            type="button"
            className={cx(CB_BTN_CLASS, CB_END_CLASS)}
            aria-label="통화 종료"
            onClick={onEnd}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                fill="currentColor"
                d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.1-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  },
);

CallControlBar.displayName = "CallControlBar";
