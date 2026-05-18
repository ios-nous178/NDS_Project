import React, { useEffect, useMemo, useRef, useState } from "react";
import { cv, fontFamily, fontWeight, spacing, transition, typeScale } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const WP_CLASS = "nds-waveform-player";
const WP_BTN_CLASS = `${WP_CLASS}__btn`;
const WP_BARS_CLASS = `${WP_CLASS}__bars`;
const WP_BAR_CLASS = `${WP_CLASS}__bar`;
const WP_TIME_CLASS = `${WP_CLASS}__time`;

/* ─── Types ─── */

export interface WaveformPlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 오디오 src */
  src: string;
  /** 미리 계산된 파형 진폭 (0~1, 보통 32~64개). 미지정 시 의사 랜덤 */
  peaks?: number[];
  /** 막대 개수 (peaks 미지정 시) */
  bars?: number;
  /** 사용자 보이스 컬러 */
  color?: string;
  /** 재생 시간 길이(초). 미지정 시 metadata에서 자동 */
  duration?: number;
  /** 시작 자동 재생 */
  autoPlay?: boolean;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const wpStyles = `
  :where(.${WP_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[12]}px;
    padding: ${spacing[8]}px ${spacing[12]}px;
    background: ${cv.surface.section};
    border-radius: 9999px;
    font-family: ${fontFamily.web};
    color: ${cv.textRole.normal};
    box-sizing: border-box;
  }

  :where(.${WP_BTN_CLASS}) {
    width: 32px;
    height: 32px;
    border-radius: 9999px;
    border: none;
    background: var(--nds-waveform-color, ${cv.surface.brand});
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: opacity ${transition.default};
  }

  :where(.${WP_BTN_CLASS}:hover) { opacity: 0.85; }

  :where(.${WP_BARS_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    height: 32px;
    cursor: pointer;
    flex: 1;
  }

  :where(.${WP_BAR_CLASS}) {
    flex: 1;
    height: var(--bar-h, 50%);
    min-width: 2px;
    max-width: 4px;
    background: ${cv.borderRole.normal};
    border-radius: 2px;
    transition: background-color ${transition.default};
  }

  :where(.${WP_BAR_CLASS}[data-played="true"]) {
    background: var(--nds-waveform-color, ${cv.surface.brand});
  }

  :where(.${WP_TIME_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.subtle};
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const formatTime = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

const pseudoPeaks = (n: number, src: string): number[] => {
  // src 기반 결정적 의사 랜덤 (동일 src면 동일 파형)
  let h = 0;
  for (let i = 0; i < src.length; i++) h = (h * 31 + src.charCodeAt(i)) | 0;
  return Array.from({ length: n }, (_, i) => {
    h = (h * 1664525 + 1013904223) | 0;
    return 0.25 + Math.abs(h % 1000) / 1500; // 0.25 ~ 0.91
  });
};

/* ─── Component ─── */

export const WaveformPlayer = React.forwardRef<HTMLDivElement, WaveformPlayerProps>(
  (
    {
      src,
      peaks: peaksProp,
      bars = 36,
      color,
      duration: durationProp,
      autoPlay = false,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const barsRef = useRef<HTMLDivElement>(null);
    const [playing, setPlaying] = useState(autoPlay);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(durationProp ?? 0);

    const peaks = useMemo(() => peaksProp ?? pseudoPeaks(bars, src), [peaksProp, bars, src]);

    useEffect(() => {
      const a = audioRef.current;
      if (!a) return;
      const onPlay = () => setPlaying(true);
      const onPause = () => setPlaying(false);
      const onTime = () => {
        if (a.duration) setProgress((a.currentTime / a.duration) * 100);
      };
      const onLoaded = () => {
        if (!durationProp) setDuration(a.duration || 0);
      };
      a.addEventListener("play", onPlay);
      a.addEventListener("pause", onPause);
      a.addEventListener("timeupdate", onTime);
      a.addEventListener("loadedmetadata", onLoaded);
      return () => {
        a.removeEventListener("play", onPlay);
        a.removeEventListener("pause", onPause);
        a.removeEventListener("timeupdate", onTime);
        a.removeEventListener("loadedmetadata", onLoaded);
      };
    }, [durationProp]);

    const togglePlay = () => {
      const a = audioRef.current;
      if (!a) return;
      if (a.paused) a.play().catch(() => undefined);
      else a.pause();
    };

    const onSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const el = barsRef.current;
      const a = audioRef.current;
      if (!el || !a || !a.duration) return;
      const rect = el.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      a.currentTime = a.duration * Math.max(0, Math.min(1, ratio));
    };

    return (
      <div
        ref={ref}
        data-slot="root"
        className={cx(WP_CLASS, className)}
        style={
          {
            ...(color && { "--nds-waveform-color": color }),
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        <audio ref={audioRef} src={src} preload="metadata" autoPlay={autoPlay} />
        <button
          type="button"
          className={WP_BTN_CLASS}
          aria-label={playing ? "일시정지" : "재생"}
          onClick={togglePlay}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
              <rect x="3" y="3" width="3" height="8" rx="1" />
              <rect x="8" y="3" width="3" height="8" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
              <path d="M4 3v8l7-4z" />
            </svg>
          )}
        </button>
        <div ref={barsRef} className={WP_BARS_CLASS} onClick={onSeekClick}>
          {peaks.map((p, i) => {
            const playedRatio = i / peaks.length;
            const isPlayed = playedRatio * 100 < progress;
            return (
              <div
                key={i}
                className={WP_BAR_CLASS}
                data-played={isPlayed ? "true" : "false"}
                style={{ "--bar-h": `${Math.max(20, p * 100)}%` } as React.CSSProperties}
              />
            );
          })}
        </div>
        <span className={WP_TIME_CLASS}>{formatTime(duration)}</span>
      </div>
    );
  },
);

WaveformPlayer.displayName = "WaveformPlayer";
