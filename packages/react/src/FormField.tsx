import React, { useId } from "react";

/* ─── Class names ─── */

const FF_CLASS = "nds-form-field";
const FF_ROOT_CLASS = `${FF_CLASS}__root`;
const FF_LABEL_ROW_CLASS = `${FF_CLASS}__label-row`;
const FF_LABEL_CLASS = `${FF_CLASS}__label`;
const FF_REQUIRED_CLASS = `${FF_CLASS}__required`;
const FF_OPTIONAL_CLASS = `${FF_CLASS}__optional`;
const FF_DESC_CLASS = `${FF_CLASS}__description`;
const FF_CONTROL_CLASS = `${FF_CLASS}__control`;
const FF_FOOTER_CLASS = `${FF_CLASS}__footer`;
const FF_HELPER_CLASS = `${FF_CLASS}__helper`;
const FF_ERROR_CLASS = `${FF_CLASS}__error`;
const FF_COUNTER_CLASS = `${FF_CLASS}__counter`;

/* ─── Types ─── */

export type FormFieldLabelPosition = "top" | "left";
export type FormFieldDensity = "default" | "admin";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 필드 라벨 */
  label?: React.ReactNode;
  /** 라벨 위 세부 설명 (예: 검사 문항) */
  description?: React.ReactNode;
  /** 도움말 (에러가 없을 때) */
  helper?: React.ReactNode;
  /** 에러 메시지 (있으면 helper 대신 표시) */
  error?: React.ReactNode;
  /** 필수 표시 (* 빨간 별) */
  required?: boolean;
  /** 선택 표시 ("(선택)" 회색 텍스트) */
  optional?: boolean;
  /** 글자 수 카운터 (예: "12 / 200") */
  counter?: React.ReactNode;
  /** 라벨이 가리킬 컨트롤 id (없으면 자동 생성) */
  htmlFor?: string;
  /**
   * 라벨 위치. `"top"` 이 모바일/일반 폼 기본. `"left"` 는 캐포비 admin 표준
   * (라벨 좌측 고정 + 컴팩트 인풋과 짝). description 이 있으면 자동으로 top 으로 폴백된다.
   * @default "top"
   */
  labelPosition?: FormFieldLabelPosition;
  /**
   * `labelPosition="left"` 일 때 라벨 컬럼 너비 (px). Figma admin 표준 180.
   * 좁은 라벨에서는 120, 긴 라벨에서는 200~240 사용.
   * @default 180
   */
  labelWidth?: number;
  /**
   * 폼 밀도. 캐포비 admin / Cashwalk for Business 어드민 폼은 `"admin"` 표준.
   * - `"default"`: label body3 13/18, helper caption 12/16, row 간 별도 gap 없음 (부모 stack 이 결정).
   * - `"admin"`: label Subtitle1 16/24, helper Body2 14/20, **FormField 자체 py-24** —
   *   stack 시 자동으로 시각 48px 간격 형성 (Figma FormSection 3387:871 표준).
   * @default "default"
   */
  density?: FormFieldDensity;
  /** 폼 컨트롤 (Input/Textarea/Select/Radio 등) */
  children: React.ReactNode;
}
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const FormField: React.FC<FormFieldProps> = ({
  label,
  description,
  helper,
  error,
  required = false,
  optional = false,
  counter,
  htmlFor: htmlForProp,
  labelPosition = "top",
  labelWidth = 180,
  density = "default",
  children,
  className,
  style,
  ...rest
}) => {
  const generatedId = useId();
  const fieldId = htmlForProp ?? generatedId;
  const helperId = `${fieldId}-helper`;
  const errorId = `${fieldId}-error`;

  const showFooter = helper !== undefined || error !== undefined || counter !== undefined;
  // description 은 라벨 아래 줄(top) 에서만 의미가 있음 — left 모드에서는 자동으로 top 으로 폴백.
  const resolvedPosition: FormFieldLabelPosition =
    labelPosition === "left" && description === undefined ? "left" : "top";

  return (
    <div
      data-slot="root"
      data-label-position={resolvedPosition}
      data-density={density}
      className={cx(FF_ROOT_CLASS, className)}
      style={
        resolvedPosition === "left"
          ? ({ "--nds-form-field-label-width": `${labelWidth}px`, ...style } as React.CSSProperties)
          : style
      }
      {...rest}
    >
      {(label !== undefined || description !== undefined) && (
        <div data-slot="label-row" className={FF_LABEL_ROW_CLASS}>
          {label !== undefined && (
            <label data-slot="label" className={FF_LABEL_CLASS} htmlFor={fieldId}>
              <span>{label}</span>
              {required && (
                <span aria-hidden="true" className={FF_REQUIRED_CLASS}>
                  *
                </span>
              )}
              {optional && !required && (
                <span aria-hidden="true" className={FF_OPTIONAL_CLASS}>
                  (선택)
                </span>
              )}
            </label>
          )}
          {description !== undefined && (
            <div data-slot="description" className={FF_DESC_CLASS}>
              {description}
            </div>
          )}
        </div>
      )}
      <div data-slot="control" className={FF_CONTROL_CLASS}>
        {children}
        {showFooter && (
          <div data-slot="footer" className={FF_FOOTER_CLASS}>
            {error !== undefined ? (
              <span data-slot="error" id={errorId} role="alert" className={FF_ERROR_CLASS}>
                {error}
              </span>
            ) : helper !== undefined ? (
              <span data-slot="helper" id={helperId} className={FF_HELPER_CLASS}>
                {helper}
              </span>
            ) : (
              <span aria-hidden="true" />
            )}
            {counter !== undefined && (
              <span data-slot="counter" className={FF_COUNTER_CLASS}>
                {counter}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

FormField.displayName = "FormField";
