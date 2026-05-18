import React, { useEffect, useRef, useState } from "react";
import { cv, fontFamily, fontWeight, radius, spacing, typeScale } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const BG_CLASS = "nds-breathing-guide";
const BG_STAGE_CLASS = `${BG_CLASS}__stage`;
const BG_CIRCLE_CLASS = `${BG_CLASS}__circle`;
const BG_LABEL_CLASS = `${BG_CLASS}__label`;
const BG_COUNT_CLASS = `${BG_CLASS}__count`;
const BG_INFO_CLASS = `${BG_CLASS}__info`;
const BG_CONTROLS_CLASS = `${BG_CLASS}__controls`;
const BG_BTN_CLASS = `${BG_CLASS}__btn`;

/* ─── Types ─── */

export type BreathingPhaseKind = "inhale" | "hold" | "exhale" | "rest";

export interface BreathingPhase {
  /** 단계 종류 (라벨 자동 매핑) */
  kind: BreathingPhaseKind;
  /** 지속 시간 (초) */
  seconds: number;
  /** 라벨 오버라이드 */
  label?: string;
}

export interface BreathingGuideProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 호흡 사이클 (기본: 4-4-4 박스 호흡) */
  phases?: BreathingPhase[];
  /** 자동 시작 */
  autoStart?: boolean;
  /** 사이클 수 (기본 무한) */
  cycles?: number;
  /** 모든 사이클 끝났을 때 콜백 */
  onComplete?: () => void;
  /** 외부에서 재생/일시정지 제어 */
  playing?: boolean;
  /** 재생 상태 변경 콜백 */
  onPlayingChange?: (playing: boolean) => void;
  /** 카운트다운 표시 */
  showCount?: boolean;
  /** 컨트롤 버튼 숨김 */
  hideControls?: boolean;
}

const DEFAULT_PHASES: BreathingPhase[] = [
  { kind: "inhale", seconds: 4 },
  { kind: "hold", seconds: 4 },
  { kind: "exhale", seconds: 4 },
  { kind: "rest", seconds: 4 },
];

const DEFAULT_LABELS: Record<BreathingPhaseKind, string> = {
  inhale: "들이마시기",
  hold: "잠시 멈춤",
  exhale: "내쉬기",
  rest: "쉬기",
};

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const breathingStyles = `
  :where(.${BG_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${spacing[20]}px;
    padding: var(--inset-modal);
    background: var(--nds-breathing-bg, ${cv.surface.section});
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${BG_STAGE_CLASS}) {
    position: relative;
    width: var(--nds-breathing-stage, 220px);
    height: var(--nds-breathing-stage, 220px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :where(.${BG_CIRCLE_CLASS}) {
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background: var(--nds-breathing-color, ${cv.surface.brand});
    opacity: 0.3;
    transform: scale(var(--nds-breathing-scale, 0.5));
    transition: transform var(--nds-breathing-duration, 4s) ease-in-out,
      opacity var(--nds-breathing-duration, 4s) ease-in-out;
  }

  :where(.${BG_CIRCLE_CLASS}[data-kind="inhale"]) { transform: scale(1); opacity: 0.5; }
  :where(.${BG_CIRCLE_CLASS}[data-kind="hold"]) { transform: scale(1); opacity: 0.5; }
  :where(.${BG_CIRCLE_CLASS}[data-kind="exhale"]) { transform: scale(0.45); opacity: 0.3; }
  :where(.${BG_CIRCLE_CLASS}[data-kind="rest"]) { transform: scale(0.45); opacity: 0.25; }

  :where(.${BG_INFO_CLASS}) {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-tight);
  }

  :where(.${BG_LABEL_CLASS}) {
    font-size: ${typeScale.headline4.fontSize}px;
    line-height: ${typeScale.headline4.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    margin: 0;
    text-align: center;
  }

  :where(.${BG_COUNT_CLASS}) {
    font-size: 36px;
    line-height: 1;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.brand};
    margin: 0;
    font-variant-numeric: tabular-nums;
  }

  :where(.${BG_CONTROLS_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-comfortable);
  }

  :where(.${BG_BTN_CLASS}) {
    height: 40px;
    padding: 0 var(--inset-card);
    border-radius: 9999px;
    border: 1px solid ${cv.borderRole.normal};
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
  }

  :where(.${BG_BTN_CLASS}[data-primary="true"]) {
    background: ${cv.surface.brand};
    color: #fff;
    border-color: transparent;
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const BreathingGuide = React.forwardRef<HTMLDivElement, BreathingGuideProps>(
  (
    {
      phases = DEFAULT_PHASES,
      autoStart = false,
      cycles,
      onComplete,
      playing: playingProp,
      onPlayingChange,
      showCount = true,
      hideControls = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const isControlled = playingProp !== undefined;
    const [internalPlaying, setInternalPlaying] = useState(autoStart);
    const playing = isControlled ? playingProp! : internalPlaying;

    const [phaseIdx, setPhaseIdx] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(phases[0].seconds);
    const [cycleCount, setCycleCount] = useState(0);
    const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const setPlaying = (next: boolean) => {
      if (!isControlled) setInternalPlaying(next);
      onPlayingChange?.(next);
    };

    const reset = () => {
      setPhaseIdx(0);
      setSecondsLeft(phases[0].seconds);
      setCycleCount(0);
    };

    useEffect(() => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      if (!playing) return;

      tickRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s > 1) return s - 1;
          // 다음 단계로 이동
          setPhaseIdx((idx) => {
            const next = (idx + 1) % phases.length;
            if (next === 0) {
              // 사이클 완료
              setCycleCount((c) => {
                const newCount = c + 1;
                if (cycles && newCount >= cycles) {
                  setPlaying(false);
                  onComplete?.();
                }
                return newCount;
              });
            }
            return next;
          });
          // 다음 단계의 초기 시간
          return phases[(phaseIdx + 1) % phases.length].seconds;
        });
      }, 1000);

      return () => {
        if (tickRef.current) clearInterval(tickRef.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playing, phaseIdx]);

    const phase = phases[phaseIdx];
    const label = phase.label ?? DEFAULT_LABELS[phase.kind];

    return (
      <div
        ref={ref}
        data-slot="root"
        data-playing={playing ? "true" : "false"}
        className={cx(BG_CLASS, className)}
        {...rest}
      >
        <div className={BG_STAGE_CLASS}>
          <div
            className={BG_CIRCLE_CLASS}
            data-kind={playing ? phase.kind : "rest"}
            style={{ "--nds-breathing-duration": `${phase.seconds}s` } as React.CSSProperties}
          />
          <div className={BG_INFO_CLASS}>
            <p className={BG_LABEL_CLASS}>{label}</p>
            {showCount && playing && <p className={BG_COUNT_CLASS}>{secondsLeft}</p>}
            {!playing && cycles ? (
              <small style={{ color: "var(--semantic-text-subtle-default)" }}>
                {cycleCount} / {cycles} 사이클
              </small>
            ) : null}
          </div>
        </div>

        {!hideControls && (
          <div className={BG_CONTROLS_CLASS}>
            <button
              type="button"
              className={BG_BTN_CLASS}
              data-primary="true"
              onClick={() => setPlaying(!playing)}
            >
              {playing ? "일시정지" : cycleCount > 0 ? "재개" : "시작"}
            </button>
            <button type="button" className={BG_BTN_CLASS} onClick={reset}>
              처음부터
            </button>
          </div>
        )}
      </div>
    );
  },
);

BreathingGuide.displayName = "BreathingGuide";
