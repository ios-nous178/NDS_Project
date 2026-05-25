import React, { useCallback, useEffect, useRef, useState } from "react";

/* ─── Constants ─── */

const VP_CLASS = "nds-video-player";
const VP_VIDEO_CLASS = `${VP_CLASS}__video`;
const VP_POSTER_CLASS = `${VP_CLASS}__poster`;
const VP_OVERLAY_CLASS = `${VP_CLASS}__overlay`;
const VP_PLAY_BTN_CLASS = `${VP_CLASS}__play-btn`;
const VP_TITLE_CLASS = `${VP_CLASS}__title`;
const VP_DURATION_CLASS = `${VP_CLASS}__duration`;
const VP_CONTROLS_CLASS = `${VP_CLASS}__controls`;
const VP_TRACK_CLASS = `${VP_CLASS}__track`;
const VP_FILL_CLASS = `${VP_CLASS}__fill`;
const VP_INPUT_CLASS = `${VP_CLASS}__input`;
const VP_BTN_CLASS = `${VP_CLASS}__btn`;

/* ─── Types ─── */

export interface VideoPlayerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 비디오 src */
  src: string;
  /** 포스터 이미지 src */
  poster?: string;
  /** 좌측 상단 라벨 (재생 전 표시) */
  title?: React.ReactNode;
  /** 우측 상단 길이 표시 (`mm:ss`). 비디오가 로드되면 자동 계산 */
  durationLabel?: string;
  /** 자동 재생 (음소거 필수) */
  autoPlay?: boolean;
  /** 음소거 */
  muted?: boolean;
  /** 루프 */
  loop?: boolean;
  /** 네이티브 컨트롤 사용 (기본 false: 커스텀 UI) */
  nativeControls?: boolean;
  /** 가로:세로 비율. 기본 16:9 */
  aspectRatio?: string;
  /** 종료 콜백 */
  onEnded?: () => void;
}
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const formatTime = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

/* ─── Component ─── */

export const VideoPlayer = React.forwardRef<HTMLDivElement, VideoPlayerProps>(
  (
    {
      src,
      poster,
      title,
      durationLabel,
      autoPlay = false,
      muted = false,
      loop = false,
      nativeControls = false,
      aspectRatio = "16 / 9",
      onEnded,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(autoPlay);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [interacted, setInteracted] = useState(autoPlay);

    const togglePlay = useCallback(() => {
      const v = videoRef.current;
      if (!v) return;
      if (v.paused) v.play().catch(() => undefined);
      else v.pause();
      setInteracted(true);
    }, []);

    useEffect(() => {
      const v = videoRef.current;
      if (!v) return;
      const onPlay = () => setPlaying(true);
      const onPause = () => setPlaying(false);
      const onTime = () => {
        if (v.duration) setProgress((v.currentTime / v.duration) * 100);
      };
      const onLoaded = () => setDuration(v.duration || 0);
      const handleEnded = () => {
        setPlaying(false);
        onEnded?.();
      };
      v.addEventListener("play", onPlay);
      v.addEventListener("pause", onPause);
      v.addEventListener("timeupdate", onTime);
      v.addEventListener("loadedmetadata", onLoaded);
      v.addEventListener("ended", handleEnded);
      return () => {
        v.removeEventListener("play", onPlay);
        v.removeEventListener("pause", onPause);
        v.removeEventListener("timeupdate", onTime);
        v.removeEventListener("loadedmetadata", onLoaded);
        v.removeEventListener("ended", handleEnded);
      };
    }, [onEnded]);

    const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = videoRef.current;
      if (!v || !v.duration) return;
      const pct = Number(e.target.value);
      v.currentTime = (pct / 100) * v.duration;
      setProgress(pct);
    };

    const computedDuration = durationLabel ?? formatTime(duration);
    const showOverlay = !interacted || !playing;

    return (
      <div
        ref={ref}
        data-slot="root"
        className={cx(VP_CLASS, className)}
        style={{
          ...(aspectRatio && ({ "--nds-video-player-aspect": aspectRatio } as React.CSSProperties)),
          ...style,
        }}
        {...rest}
      >
        <video
          ref={videoRef}
          className={VP_VIDEO_CLASS}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          controls={nativeControls}
          playsInline
          preload="metadata"
        />

        {!nativeControls && (
          <div
            className={VP_OVERLAY_CLASS}
            data-slot="overlay"
            data-hide={interacted && playing ? "true" : "false"}
          >
            {(title || computedDuration) && (
              <>
                {title && <p className={VP_TITLE_CLASS}>{title}</p>}
                {computedDuration && <span className={VP_DURATION_CLASS}>{computedDuration}</span>}
              </>
            )}
            {!playing && (
              <button
                type="button"
                className={VP_PLAY_BTN_CLASS}
                aria-label="재생"
                onClick={togglePlay}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            )}
            {interacted && playing && (
              <div className={VP_CONTROLS_CLASS}>
                <button
                  type="button"
                  className={VP_BTN_CLASS}
                  aria-label="일시정지"
                  onClick={togglePlay}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                  </svg>
                </button>
                <div className={VP_TRACK_CLASS}>
                  <div
                    className={VP_FILL_CLASS}
                    style={{ "--nds-video-fill": `${progress}%` } as React.CSSProperties}
                  />
                  <input
                    className={VP_INPUT_CLASS}
                    type="range"
                    min={0}
                    max={100}
                    step={0.1}
                    value={progress}
                    onChange={onSeek}
                    aria-label="재생 위치"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

VideoPlayer.displayName = "VideoPlayer";
