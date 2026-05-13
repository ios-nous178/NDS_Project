import React, { useEffect } from "react";
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

const VR_CLASS = "nds-voice-recorder";
const VR_BTN_CLASS = `${VR_CLASS}__btn`;
const VR_TIMER_CLASS = `${VR_CLASS}__timer`;
const VR_INDICATOR_CLASS = `${VR_CLASS}__indicator`;
const VR_LABEL_CLASS = `${VR_CLASS}__label`;
const VR_INFO_CLASS = `${VR_CLASS}__info`;

/* ─── Types ─── */

export type VoiceRecorderState = "idle" | "recording" | "paused";

export interface VoiceRecorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 현재 상태 (controlled) */
  state: VoiceRecorderState;
  /** 상태 변경 콜백 */
  onStateChange: (state: VoiceRecorderState) => void;
  /** 진행 시간 (초) — 외부 timer로 갱신 */
  seconds: number;
  /** 최대 녹음 시간 (초) */
  maxSeconds?: number;
  /** 녹음 완료 시 (사용자 stop 직후) */
  onComplete?: (seconds: number) => void;
  /** 라벨 (idle 상태에서 표시) */
  idleLabel?: string;
  /** 녹음 중 라벨 */
  recordingLabel?: string;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const vrStyles = `
  :where(.${VR_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${spacing[12]}px;
    padding: ${spacing[20]}px;
    background: ${cv.bg.coolGray};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    min-width: 220px;
  }

  :where(.${VR_BTN_CLASS}) {
    width: 80px;
    height: 80px;
    border-radius: 9999px;
    border: none;
    background: var(--semantic-error-main, #E04D4D);
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform ${transition.default}, box-shadow ${transition.default};
    box-shadow: 0 4px 12px rgba(224, 77, 77, 0.32);
  }

  :where(.${VR_BTN_CLASS}:hover) { transform: scale(1.04); }

  :where(.${VR_BTN_CLASS}:focus-visible) {
    outline: 3px solid ${cv.primary.main};
    outline-offset: 4px;
  }

  :where(.${VR_BTN_CLASS}[data-state="recording"]) {
    animation: nds-voice-recorder-pulse 1.4s ease-in-out infinite;
  }

  @keyframes nds-voice-recorder-pulse {
    0%, 100% { box-shadow: 0 4px 12px rgba(224, 77, 77, 0.32); }
    50% { box-shadow: 0 4px 24px rgba(224, 77, 77, 0.6), 0 0 0 8px rgba(224, 77, 77, 0.18); }
  }

  :where(.${VR_TIMER_CLASS}) {
    font-size: 28px;
    font-weight: ${fontWeight.bold};
    color: ${cv.text.default};
    font-variant-numeric: tabular-nums;
  }

  :where(.${VR_INDICATOR_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[4]}px;
    color: var(--semantic-error-main, #E04D4D);
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
  }

  :where(.${VR_INDICATOR_CLASS})::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 9999px;
    background: currentColor;
    animation: nds-voice-recorder-blink 1s ease-in-out infinite;
  }

  @keyframes nds-voice-recorder-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  :where(.${VR_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    color: ${cv.text.subtle};
  }

  :where(.${VR_INFO_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

/* ─── Component ─── */

export const VoiceRecorder = React.forwardRef<HTMLDivElement, VoiceRecorderProps>(
  (
    {
      state,
      onStateChange,
      seconds,
      maxSeconds,
      onComplete,
      idleLabel = "버튼을 눌러 녹음을 시작하세요",
      recordingLabel = "녹음 중",
      className,
      ...rest
    },
    ref,
  ) => {
    useEffect(() => {
      if (maxSeconds && state === "recording" && seconds >= maxSeconds) {
        onStateChange("idle");
        onComplete?.(seconds);
      }
    }, [state, seconds, maxSeconds, onStateChange, onComplete]);

    const handleClick = () => {
      if (state === "idle") {
        onStateChange("recording");
      } else {
        onStateChange("idle");
        onComplete?.(seconds);
      }
    };

    const isRecording = state !== "idle";

    return (
      <div
        ref={ref}
        data-slot="root"
        data-state={state}
        className={cx(VR_CLASS, className)}
        {...rest}
      >
        <button
          type="button"
          className={VR_BTN_CLASS}
          data-state={state}
          aria-label={isRecording ? "녹음 중지" : "녹음 시작"}
          onClick={handleClick}
        >
          {isRecording ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="9" y="3" width="6" height="12" rx="3" fill="currentColor" />
              <path
                d="M5 11c0 4 3 7 7 7s7-3 7-7M12 18v3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        <div className={VR_INFO_CLASS}>
          <span className={VR_TIMER_CLASS}>
            {formatTime(seconds)}
            {maxSeconds ? (
              <span style={{ fontSize: 14, color: cv.text.subtle, marginLeft: 6, fontWeight: 500 }}>
                / {formatTime(maxSeconds)}
              </span>
            ) : null}
          </span>
          {isRecording ? (
            <span className={VR_INDICATOR_CLASS}>{recordingLabel}</span>
          ) : (
            <span className={VR_LABEL_CLASS}>{idleLabel}</span>
          )}
        </div>
      </div>
    );
  },
);

VoiceRecorder.displayName = "VoiceRecorder";
