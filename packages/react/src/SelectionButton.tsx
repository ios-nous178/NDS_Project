import React from "react";

/* ─── Class names (그룹과 동일 비주얼 SSOT 공유) ─── */

const SBG_CLASS = "nds-selection-button-group";
const SBG_ITEM_CLASS = `${SBG_CLASS}__item`;
const SBG_LABEL_CLASS = `${SBG_CLASS}__label`;

/* ─── Types ─── */

export interface SelectionButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> {
  /** 선택 상태 (브랜드색 아웃라인 + subtle 채움) */
  selected?: boolean;
  /** 비활성화 */
  disabled?: boolean;
  /** 버튼 라벨 */
  children: React.ReactNode;
}

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

/**
 * SelectionButton — 단일 선택 버튼 한 개.
 *
 * 보통 `SelectionButtonGroup` 으로 묶어 쓰지만, 토글 한 개·커스텀 레이아웃이 필요할 때
 * 단독으로 쓴다. 그룹과 동일한 `nds-selection-button-group__item` 비주얼(브랜드색
 * 아웃라인 + `selected` 시 `--semantic-bg-brand-subtle` 채움)을 공유한다 — 5개 프로젝트
 * 시멘틱 cascade 자동 대응. 그룹 안에서는 등폭(100%), 단독일 때는 콘텐츠 hug.
 *
 * 선택은 외부 제어 — `selected` 로 상태를 받고 `onClick` 으로 변경을 처리한다.
 */
export const SelectionButton: React.FC<SelectionButtonProps> = ({
  selected = false,
  children,
  className,
  disabled,
  ...rest
}) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    data-slot="item"
    data-selected={selected ? "true" : "false"}
    disabled={disabled}
    className={cx(SBG_ITEM_CLASS, className)}
    {...rest}
  >
    <span className={SBG_LABEL_CLASS}>{children}</span>
  </button>
);

SelectionButton.displayName = "SelectionButton";
