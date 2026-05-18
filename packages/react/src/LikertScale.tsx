import React, { useId } from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

/* ─── Class names ─── */

const LK_CLASS = "nds-likert";
const LK_ROOT_CLASS = `${LK_CLASS}__root`;
const LK_TRACK_CLASS = `${LK_CLASS}__track`;
const LK_LINE_CLASS = `${LK_CLASS}__line`;
const LK_ITEM_CLASS = `${LK_CLASS}__item`;
const LK_INPUT_CLASS = `${LK_CLASS}__input`;
const LK_DOT_CLASS = `${LK_CLASS}__dot`;
const LK_DOT_INNER_CLASS = `${LK_CLASS}__dot-inner`;
const LK_ITEM_LABEL_CLASS = `${LK_CLASS}__item-label`;
const LK_ANCHORS_CLASS = `${LK_CLASS}__anchors`;
const LK_ANCHOR_CLASS = `${LK_CLASS}__anchor`;

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const likertStyles = `
  :where(.${LK_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${LK_TRACK_CLASS}) {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: ${spacing[10]}px 0 ${spacing[4]}px;
  }

  :where(.${LK_LINE_CLASS}) {
    position: absolute;
    top: ${spacing[20]}px;
    left: 12px;
    right: 12px;
    height: 2px;
    background: ${cv.borderRole.subtle};
    border-radius: ${radius.pill}px;
    pointer-events: none;
  }

  :where(.${LK_ITEM_CLASS}) {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: ${spacing[8]}px;
    cursor: pointer;
    flex: 1 1 0;
    min-width: 0;
  }

  :where(.${LK_ITEM_CLASS}[data-disabled="true"]) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  :where(.${LK_INPUT_CLASS}) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  :where(.${LK_DOT_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 1.5px solid ${cv.borderRole.normal};
    border-radius: ${radius.pill}px;
    background: ${cv.surface.default};
    transition: border-color ${transition.default}, background-color ${transition.default};
    box-sizing: border-box;
  }

  :where(.${LK_ITEM_CLASS}:hover .${LK_DOT_CLASS}) {
    border-color: ${"#91CAF6"};
  }

  :where(.${LK_DOT_CLASS}[data-checked="true"]) {
    border-color: ${cv.borderRole.brand};
    background: ${cv.surface.brand};
  }

  :where(.${LK_DOT_INNER_CLASS}) {
    display: block;
    width: 8px;
    height: 8px;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.default};
    opacity: 0;
    transform: scale(0.5);
    transition: opacity ${transition.default}, transform ${transition.default};
  }

  :where(.${LK_DOT_CLASS}[data-checked="true"] .${LK_DOT_INNER_CLASS}) {
    opacity: 1;
    transform: scale(1);
  }

  :where(.${LK_INPUT_CLASS}:focus-visible + .${LK_DOT_CLASS}) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${LK_ITEM_LABEL_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.subtle};
    text-align: center;
    user-select: none;
    word-break: keep-all;
  }

  :where(.${LK_ITEM_CLASS}[data-checked="true"] .${LK_ITEM_LABEL_CLASS}) {
    color: ${cv.textRole.normal};
    font-weight: ${fontWeight.medium};
  }

  :where(.${LK_ANCHORS_CLASS}) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 ${spacing[2]}px;
  }

  :where(.${LK_ANCHOR_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.subtle};
    user-select: none;
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Types ─── */

export interface LikertOption {
  /** 옵션 값 */
  value: string | number;
  /** 점 아래에 표시할 라벨 (없으면 점만 표시) */
  label?: React.ReactNode;
}

export interface LikertScaleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 그룹 name (radio name 속성) */
  name?: string;
  /** 옵션 목록 (예: 5점/7점 척도) */
  options: LikertOption[];
  /** 선택된 값 */
  value?: string | number;
  /** 값 변경 콜백 */
  onValueChange: (value: string | number) => void;
  /** 좌측 끝 앵커 라벨 (예: "전혀 그렇지 않다") */
  startLabel?: React.ReactNode;
  /** 우측 끝 앵커 라벨 (예: "매우 그렇다") */
  endLabel?: React.ReactNode;
  /** 비활성화 */
  disabled?: boolean;
}

/* ─── Component ─── */

export const LikertScale: React.FC<LikertScaleProps> = ({
  name: nameProp,
  options,
  value,
  onValueChange,
  startLabel,
  endLabel,
  disabled = false,
  className,
  ...rest
}) => {
  const generatedName = useId();
  const name = nameProp ?? generatedName;
  const showAnchors = startLabel !== undefined || endLabel !== undefined;

  return (
    <div data-slot="root" role="radiogroup" className={cx(LK_ROOT_CLASS, className)} {...rest}>
      <div data-slot="track" className={LK_TRACK_CLASS}>
        <span aria-hidden="true" className={LK_LINE_CLASS} />
        {options.map((opt) => {
          const isChecked = value !== undefined && String(opt.value) === String(value);
          const inputId = `${name}-${opt.value}`;
          return (
            <label
              key={String(opt.value)}
              data-slot="item"
              data-checked={isChecked ? "true" : "false"}
              data-disabled={disabled ? "true" : "false"}
              htmlFor={inputId}
              className={LK_ITEM_CLASS}
            >
              <input
                type="radio"
                id={inputId}
                name={name}
                value={String(opt.value)}
                checked={isChecked}
                disabled={disabled}
                onChange={() => onValueChange(opt.value)}
                className={LK_INPUT_CLASS}
              />
              <span
                data-slot="dot"
                data-checked={isChecked ? "true" : "false"}
                className={LK_DOT_CLASS}
                aria-hidden="true"
              >
                <span className={LK_DOT_INNER_CLASS} />
              </span>
              {opt.label !== undefined && (
                <span data-slot="item-label" className={LK_ITEM_LABEL_CLASS}>
                  {opt.label}
                </span>
              )}
            </label>
          );
        })}
      </div>
      {showAnchors && (
        <div data-slot="anchors" className={LK_ANCHORS_CLASS}>
          <span data-slot="anchor-start" className={LK_ANCHOR_CLASS}>
            {startLabel}
          </span>
          <span data-slot="anchor-end" className={LK_ANCHOR_CLASS}>
            {endLabel}
          </span>
        </div>
      )}
    </div>
  );
};

LikertScale.displayName = "LikertScale";
