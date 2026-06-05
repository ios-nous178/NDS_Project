import React from "react";

/* ─── Class names ─── */

const AB_CLASS = "nds-add-button";
const AB_ICON_CLASS = `${AB_CLASS}__icon`;
const AB_LABEL_CLASS = `${AB_CLASS}__label`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const DefaultPlusIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path
      d="M9 3.75v10.5M3.75 9h10.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/* ─── Component ─── */

export interface AddButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 라벨 (예: "지역 추가") */
  children: React.ReactNode;
  /**
   * 에러 상태 — 점선 회색 보더가 빨간 실선 보더(Border/Status/Error)로 바뀐다.
   * Figma 캐포비 타겟팅 "지역 추가" 미선택 에러(3001:19017) 정합.
   */
  error?: boolean;
  /** 부모 너비에 맞춤 @default true */
  fullWidth?: boolean;
  /** 좌측 아이콘 — 미지정 시 기본 plus 아이콘 */
  leftIcon?: React.ReactNode;
}

/**
 * AddButton — 폼 안에서 "항목 추가"(지역/옵션/행)를 유도하는 점선 affordance 버튼.
 *
 * 일반 Button(solid/outlined CTA)과 의도가 다르다: 반복 추가 슬롯이라 점선 보더로
 * "여기에 더할 수 있다"를 표현하고, 필수 항목 미선택 시 `error` 로 빨간 실선 강조한다.
 * 인라인 에러 메시지는 FormField/필드 그룹 쪽에서 별도로 노출한다.
 */
export const AddButton = React.forwardRef<HTMLButtonElement, AddButtonProps>(
  (
    {
      children,
      error = false,
      fullWidth = true,
      leftIcon,
      disabled,
      className,
      type = "button",
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        data-slot="root"
        data-error={error ? "true" : "false"}
        data-fullwidth={fullWidth ? "true" : "false"}
        aria-invalid={error || undefined}
        className={cx(AB_CLASS, className)}
        {...rest}
      >
        <span className={AB_ICON_CLASS} aria-hidden>
          {leftIcon ?? DefaultPlusIcon}
        </span>
        <span className={AB_LABEL_CLASS}>{children}</span>
      </button>
    );
  },
);

AddButton.displayName = "AddButton";
