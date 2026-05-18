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

/* ─── Constants ─── */

const MD_CLASS = "nds-mood";
const MD_ROOT_CLASS = `${MD_CLASS}__root`;
const MD_LIST_CLASS = `${MD_CLASS}__list`;
const MD_ITEM_CLASS = `${MD_CLASS}__item`;
const MD_INPUT_CLASS = `${MD_CLASS}__input`;
const MD_FACE_CLASS = `${MD_CLASS}__face`;
const MD_LABEL_CLASS = `${MD_CLASS}__label`;

/* ─── Default options ─── */

// 예외: MoodSelector 는 사용자 감정 표현 자체가 콘텐츠 데이터다 — DS 의 "이모지
// 금지" 룰은 라벨/장식 위치를 대상으로 하며, 감정 선택지의 face glyph 는
// 그 자체가 의미를 가진다. 도메인 아이콘으로 교체하려면 `options` prop 으로
// `face: <Icon />` 를 직접 주입해 ReactNode 로 렌더되도록 한다.
const DEFAULT_OPTIONS: MoodOption[] = [
  { value: "very-bad", face: "😢", label: "매우 나쁨" },
  { value: "bad", face: "😟", label: "나쁨" },
  { value: "neutral", face: "😐", label: "보통" },
  { value: "good", face: "🙂", label: "좋음" },
  { value: "very-good", face: "😀", label: "매우 좋음" },
];

// eslint-disable-next-line unused-imports/no-unused-vars
const moodStyles = `
  :where(.${MD_ROOT_CLASS}) {
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${MD_LIST_CLASS}) {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: var(--gap-default);
    width: 100%;
  }

  :where(.${MD_ITEM_CLASS}) {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: ${spacing[6]}px;
    flex: 1 1 0;
    min-width: 0;
    cursor: pointer;
    padding: var(--inset-chip) ${spacing[4]}px;
    border-radius: ${radius.lg}px;
    transition: background-color ${transition.default};
  }

  :where(.${MD_ITEM_CLASS}:hover) {
    background: ${cv.surface.page};
  }

  :where(.${MD_ITEM_CLASS}[data-checked="true"]) {
    background: ${cv.surface.brandSubtle};
  }

  :where(.${MD_ITEM_CLASS}[data-disabled="true"]) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  :where(.${MD_INPUT_CLASS}) {
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

  :where(.${MD_FACE_CLASS}) {
    font-size: 32px;
    line-height: 1;
    user-select: none;
    transition: transform ${transition.default};
  }

  :where(.${MD_ITEM_CLASS}[data-checked="true"] .${MD_FACE_CLASS}) {
    transform: scale(1.1);
  }

  :where(.${MD_LABEL_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.subtle};
    text-align: center;
    user-select: none;
    word-break: keep-all;
  }

  :where(.${MD_ITEM_CLASS}[data-checked="true"] .${MD_LABEL_CLASS}) {
    color: ${cv.textRole.normal};
    font-weight: ${fontWeight.medium};
  }

  :where(.${MD_INPUT_CLASS}:focus-visible + .${MD_FACE_CLASS}) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 4px;
    border-radius: ${radius.pill}px;
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Types ─── */

export interface MoodOption {
  /** 선택값 */
  value: string;
  /**
   * 감정 표현 콘텐츠. 이모지 문자열이나 React 노드(아이콘 컴포넌트) 둘 다 허용.
   * 도메인이 의료/임상이라 이모지가 부적절하다면 커스텀 SVG/Icon 컴포넌트를 주입.
   */
  face: React.ReactNode;
  /** 라벨 (예: "매우 좋음") */
  label?: React.ReactNode;
}

export interface MoodSelectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 옵션 목록 (기본 5단계) */
  options?: MoodOption[];
  /** 선택된 값 */
  value?: string;
  /** 값 변경 콜백 */
  onValueChange: (value: string) => void;
  /** radio name (없으면 자동 생성) */
  name?: string;
  /** 라벨 표시 여부 */
  showLabels?: boolean;
  /** 비활성화 */
  disabled?: boolean;
}

/* ─── Component ─── */

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  options = DEFAULT_OPTIONS,
  value,
  onValueChange,
  name: nameProp,
  showLabels = true,
  disabled = false,
  className,
  ...rest
}) => {
  const generatedName = useId();
  const name = nameProp ?? generatedName;

  return (
    <div data-slot="root" role="radiogroup" className={cx(MD_ROOT_CLASS, className)} {...rest}>
      <div data-slot="list" className={MD_LIST_CLASS}>
        {options.map((opt) => {
          const isChecked = opt.value === value;
          const inputId = `${name}-${opt.value}`;
          return (
            <label
              key={opt.value}
              data-slot="item"
              data-checked={isChecked ? "true" : "false"}
              data-disabled={disabled ? "true" : "false"}
              htmlFor={inputId}
              className={MD_ITEM_CLASS}
            >
              <input
                type="radio"
                id={inputId}
                name={name}
                value={opt.value}
                checked={isChecked}
                disabled={disabled}
                onChange={() => onValueChange(opt.value)}
                className={MD_INPUT_CLASS}
              />
              <span data-slot="face" className={MD_FACE_CLASS} aria-hidden="true">
                {opt.face}
              </span>
              {showLabels && opt.label !== undefined && (
                <span data-slot="label" className={MD_LABEL_CLASS}>
                  {opt.label}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

MoodSelector.displayName = "MoodSelector";
