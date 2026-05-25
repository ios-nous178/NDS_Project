import React, { useCallback } from "react";

/* ─── Constants ─── */

const AP_CLASS = "nds-audio-player";
const AP_HEAD_CLASS = `${AP_CLASS}__head`;
const AP_TITLE_CLASS = `${AP_CLASS}__title`;
const AP_SUBTITLE_CLASS = `${AP_CLASS}__subtitle`;
const AP_TRACK_CLASS = `${AP_CLASS}__track`;
const AP_FILL_CLASS = `${AP_CLASS}__fill`;
const AP_INPUT_CLASS = `${AP_CLASS}__input`;
const AP_TIMES_CLASS = `${AP_CLASS}__times`;
const AP_TIME_CLASS = `${AP_CLASS}__time`;
const AP_CONTROLS_CLASS = `${AP_CLASS}__controls`;
const AP_BUTTON_CLASS = `${AP_CLASS}__button`;
const AP_PLAY_CLASS = `${AP_CLASS}__play`;
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const fmtTime = (sec: number): string => {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
};

const PlayIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path d="M7 5L17 11L7 17V5Z" fill="currentColor" />
  </svg>
);

const PauseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <rect x="6" y="5" width="3.5" height="12" rx="1" fill="currentColor" />
    <rect x="12.5" y="5" width="3.5" height="12" rx="1" fill="currentColor" />
  </svg>
);

const SkipBackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M4 5V15M16 5L8 10L16 15V5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.2"
    />
  </svg>
);

const SkipForwardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M16 5V15M4 5L12 10L4 15V5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.2"
    />
  </svg>
);

/* ─── Component ─── */

export interface AudioPlayerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "title"
> {
  /** 제목 (예: "마음을 편안하게 하는 명상") */
  title?: React.ReactNode;
  /** 부제 (예: "10분 가이드") */
  subtitle?: React.ReactNode;
  /** 재생 중 여부 */
  playing: boolean;
  /** 재생/일시정지 토글 */
  onPlayPause: (next: boolean) => void;
  /** 현재 재생 위치 (초) */
  currentTime: number;
  /** 총 길이 (초) */
  duration: number;
  /** 시크 콜백 (초 단위) */
  onSeek?: (time: number) => void;
  /** 이전 트랙 (제공 시 표시) */
  onSkipBack?: () => void;
  /** 다음 트랙 (제공 시 표시) */
  onSkipForward?: () => void;
}

export const AudioPlayer = React.forwardRef<HTMLDivElement, AudioPlayerProps>(
  (
    {
      title,
      subtitle,
      playing,
      onPlayPause,
      currentTime,
      duration,
      onSeek,
      onSkipBack,
      onSkipForward,
      className,
      ...rest
    },
    ref,
  ) => {
    const safeDuration = duration > 0 ? duration : 1;
    const percent = Math.min(100, Math.max(0, (currentTime / safeDuration) * 100));

    const handleSeek = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onSeek?.(Number(e.target.value));
      },
      [onSeek],
    );

    return (
      <div ref={ref} data-slot="root" className={cx(AP_CLASS, className)} {...rest}>
        {(title || subtitle) && (
          <div data-slot="head" className={AP_HEAD_CLASS}>
            {title && (
              <p data-slot="title" className={AP_TITLE_CLASS}>
                {title}
              </p>
            )}
            {subtitle && (
              <span data-slot="subtitle" className={AP_SUBTITLE_CLASS}>
                {subtitle}
              </span>
            )}
          </div>
        )}
        <div data-slot="track" className={AP_TRACK_CLASS}>
          <span aria-hidden="true" className={AP_FILL_CLASS} style={{ width: `${percent}%` }} />
          <input
            type="range"
            min={0}
            max={duration}
            step={1}
            value={Math.min(currentTime, duration)}
            onChange={handleSeek}
            className={AP_INPUT_CLASS}
            aria-label="재생 위치"
            disabled={!onSeek}
          />
        </div>
        <div data-slot="times" className={AP_TIMES_CLASS}>
          <span data-slot="time" className={AP_TIME_CLASS}>
            {fmtTime(currentTime)}
          </span>
          <span data-slot="time" className={AP_TIME_CLASS}>
            {fmtTime(duration)}
          </span>
        </div>
        <div data-slot="controls" className={AP_CONTROLS_CLASS}>
          {onSkipBack && (
            <button
              type="button"
              data-slot="skip-back"
              className={AP_BUTTON_CLASS}
              onClick={onSkipBack}
              aria-label="이전"
            >
              <SkipBackIcon />
            </button>
          )}
          <button
            type="button"
            data-slot="play"
            className={AP_PLAY_CLASS}
            onClick={() => onPlayPause(!playing)}
            aria-label={playing ? "일시정지" : "재생"}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          {onSkipForward && (
            <button
              type="button"
              data-slot="skip-forward"
              className={AP_BUTTON_CLASS}
              onClick={onSkipForward}
              aria-label="다음"
            >
              <SkipForwardIcon />
            </button>
          )}
        </div>
      </div>
    );
  },
);

AudioPlayer.displayName = "AudioPlayer";
