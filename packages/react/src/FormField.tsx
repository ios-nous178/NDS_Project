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
  children,
  className,
  ...rest
}) => {
  const generatedId = useId();
  const fieldId = htmlForProp ?? generatedId;
  const helperId = `${fieldId}-helper`;
  const errorId = `${fieldId}-error`;

  const showFooter = helper !== undefined || error !== undefined || counter !== undefined;

  return (
    <div data-slot="root" className={cx(FF_ROOT_CLASS, className)} {...rest}>
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
      </div>
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
  );
};

FormField.displayName = "FormField";
