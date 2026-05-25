import React, { useId } from "react";

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
