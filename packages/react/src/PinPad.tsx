import React, { useMemo } from "react";
import { cv, fontFamily, fontWeight, spacing, transition, typeScale } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const PP_CLASS = "nds-pin-pad";
const PP_DOTS_CLASS = `${PP_CLASS}__dots`;
const PP_DOT_CLASS = `${PP_CLASS}__dot`;
const PP_GRID_CLASS = `${PP_CLASS}__grid`;
const PP_KEY_CLASS = `${PP_CLASS}__key`;
const PP_LABEL_CLASS = `${PP_CLASS}__label`;

/* ─── Types ─── */

export interface PinPadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 입력값 (숫자 문자열) */
  value: string;
  /** 변경 콜백 */
  onValueChange: (value: string) => void;
  /** PIN 길이 (기본 6) */
  length?: number;
  /** 모두 입력됐을 때 콜백 */
  onComplete?: (value: string) => void;
  /** 라벨 */
  label?: React.ReactNode;
  /** 키 배치 셔플 (보안 향상) */
  shuffle?: boolean;
  /** 키 배치 시드 (shuffle 활성 시 동일 시드면 동일 배치) */
  shuffleSeed?: number;
  /** 에러 상태 (점이 흔들리는 효과) */
  error?: boolean;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const ppStyles = `
  :where(.${PP_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${spacing[24]}px;
    padding: ${spacing[20]}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${PP_LABEL_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    color: ${cv.text.default};
    font-weight: ${fontWeight.medium};
  }

  :where(.${PP_DOTS_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[12]}px;
  }

  :where(.${PP_DOTS_CLASS}[data-error="true"]) {
    animation: nds-pin-pad-shake 0.4s ease-in-out;
  }

  @keyframes nds-pin-pad-shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }

  :where(.${PP_DOT_CLASS}) {
    width: 12px;
    height: 12px;
    border-radius: 9999px;
    border: 2px solid ${cv.border.default};
    background: transparent;
    transition: background-color ${transition.default}, border-color ${transition.default};
  }

  :where(.${PP_DOT_CLASS}[data-filled="true"]) {
    background: ${cv.text.default};
    border-color: ${cv.text.default};
  }

  :where(.${PP_DOTS_CLASS}[data-error="true"]) .${PP_DOT_CLASS}[data-filled="true"] {
    background: var(--color-semantic-error-main, #E04D4D);
    border-color: var(--color-semantic-error-main, #E04D4D);
  }

  :where(.${PP_GRID_CLASS}) {
    display: grid;
    grid-template-columns: repeat(3, 72px);
    gap: ${spacing[12]}px;
  }

  :where(.${PP_KEY_CLASS}) {
    width: 72px;
    height: 72px;
    border-radius: 9999px;
    border: none;
    background: ${cv.bg.coolGray};
    color: ${cv.text.default};
    font-family: inherit;
    font-size: 28px;
    font-weight: ${fontWeight.semibold};
    cursor: pointer;
    transition: background-color ${transition.default}, transform ${transition.default};
  }

  :where(.${PP_KEY_CLASS}:hover) { background: ${cv.border.light}; }
  :where(.${PP_KEY_CLASS}:active) { transform: scale(0.96); }

  :where(.${PP_KEY_CLASS}:focus-visible) {
    outline: 2px solid ${cv.primary.main};
    outline-offset: 2px;
  }

  :where(.${PP_KEY_CLASS}[data-action="true"]) {
    background: transparent;
    color: ${cv.text.subtle};
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :where(.${PP_KEY_CLASS}[data-action="true"]:hover) { background: ${cv.bg.coolGray}; }

  :where(.${PP_KEY_CLASS}[data-action="true"]:disabled) {
    color: ${cv.text.disabled};
    cursor: not-allowed;
  }
  :where(.${PP_KEY_CLASS}[data-action="true"]:disabled:hover) { background: transparent; }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Utils ─── */

const seededShuffle = (arr: number[], seed: number): number[] => {
  let s = seed;
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/* ─── Component ─── */

export const PinPad = React.forwardRef<HTMLDivElement, PinPadProps>(
  (
    {
      value,
      onValueChange,
      length = 6,
      onComplete,
      label,
      shuffle = false,
      shuffleSeed = 1,
      error = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const keys = useMemo(() => {
      const base = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
      return shuffle ? seededShuffle(base, shuffleSeed) : base;
    }, [shuffle, shuffleSeed]);

    const press = (digit: number) => {
      if (value.length >= length) return;
      const next = value + String(digit);
      onValueChange(next);
      if (next.length === length) onComplete?.(next);
    };

    const back = () => {
      if (value.length === 0) return;
      onValueChange(value.slice(0, -1));
    };

    const dots = Array.from({ length }, (_, i) => i < value.length);

    return (
      <div ref={ref} data-slot="root" className={cx(PP_CLASS, className)} {...rest}>
        {label && <span className={PP_LABEL_CLASS}>{label}</span>}
        <div className={PP_DOTS_CLASS} data-error={error ? "true" : "false"}>
          {dots.map((filled, i) => (
            <span key={i} className={PP_DOT_CLASS} data-filled={filled ? "true" : "false"} />
          ))}
        </div>
        <div className={PP_GRID_CLASS}>
          {keys.slice(0, 9).map((d) => (
            <button key={d} type="button" className={PP_KEY_CLASS} onClick={() => press(d)}>
              {d}
            </button>
          ))}
          <span aria-hidden />
          <button type="button" className={PP_KEY_CLASS} onClick={() => press(keys[9])}>
            {keys[9]}
          </button>
          <button
            type="button"
            className={PP_KEY_CLASS}
            data-action="true"
            aria-label="지우기"
            onClick={back}
            disabled={value.length === 0}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M8 5h12a2 2 0 012 2v10a2 2 0 01-2 2H8l-6-7 6-7z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M13 9l4 6M17 9l-4 6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  },
);

PinPad.displayName = "PinPad";
