import React, { useEffect } from "react";
import { cv, fontWeight } from "@nudge-design/tokens";

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
              <span
                style={{
                  fontSize: 14,
                  color: cv.textRole.subtle,
                  marginLeft: 6,
                  fontWeight: fontWeight.medium,
                }}
              >
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
