import React from "react";
import * as NDSIcons from "@nudge-eap/icons";

// @nudge-eap/icons는 React 19 타입으로 빌드되어 React 18 타입 시스템과 forwardRef 시그니처가
// 호환되지 않음. 런타임 동작은 동일하므로 컴포넌트 타입을 일치시키기 위해 좁은 타입으로 캐스트.
type IconComp = React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
const MicrophoneIcon = NDSIcons.MicrophoneIcon as unknown as IconComp;
const VideocameraIcon = NDSIcons.VideocameraIcon as unknown as IconComp;
const MymusicIcon = NDSIcons.MymusicIcon as unknown as IconComp;
const TelephoneIcon = NDSIcons.TelephoneIcon as unknown as IconComp;
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
    background: ${cv.surface.default};
    color: ${cv.textRole.strong};
  }

  :where(.${CB_BTN_CLASS}:focus-visible) {
    outline: 3px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${CB_END_CLASS}) {
    background: var(--semantic-fill-status-error);
  }

  :where(.${CB_END_CLASS}:hover) { background: var(--semantic-text-status-error); }

  :where(.${CB_LABEL_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-size: ${typeScale.caption2.fontSize}px;
    color: rgba(255, 255, 255, 0.7);
  }

  :where(.${CB_BTN_CLASS}) [data-icon-wrap] {
    position: relative;
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :where(.${CB_BTN_CLASS}) [data-icon-slash] {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const SlashOverlay: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden data-icon-slash>
    <line
      x1="4"
      y1="4"
      x2="20"
      y2="20"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

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
            <span data-icon-wrap>
              <MicrophoneIcon size={22} />
              {muted && <SlashOverlay />}
            </span>
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
              <span data-icon-wrap>
                <VideocameraIcon size={22} />
                {!cameraOn && <SlashOverlay />}
              </span>
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
              <MymusicIcon size={22} />
            </button>
          )}

          {/* 종료 */}
          <button
            type="button"
            className={cx(CB_BTN_CLASS, CB_END_CLASS)}
            aria-label="통화 종료"
            onClick={onEnd}
          >
            <TelephoneIcon size={22} style={{ transform: "rotate(135deg)" }} />
          </button>
        </div>
      </div>
    );
  },
);

CallControlBar.displayName = "CallControlBar";
