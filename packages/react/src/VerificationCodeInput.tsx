import React, { useId } from "react";

/* ─── Constants ─── */

const VC_CLASS = "nds-verification-code";
const VC_ROOT_CLASS = `${VC_CLASS}__root`;
const VC_INPUT_CLASS = `${VC_CLASS}__input`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const onlyDigits = (s: string) => s.replace(/\D/g, "");

/* ─── Component ─── */

export interface VerificationCodeInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "size"
> {
  /** 자릿수 (기본 6) — 입력 maxLength */
  length?: number;
  /** 현재 값 (숫자 문자열, length 이하) */
  value: string;
  /** 변경 콜백 (숫자만 전달) */
  onValueChange: (value: string) => void;
  /** length 만큼 채워졌을 때 콜백 */
  onComplete?: (value: string) => void;
  /** 비활성화 */
  disabled?: boolean;
  /** 에러 상태 */
  error?: boolean;
  /** 부모 폭 가득 @default true */
  fullWidth?: boolean;
}

/**
 * VerificationCodeInput — SMS/이메일 인증번호 입력 (웹용 단일 필드).
 *
 * 자리별 박스가 아니라 base Input 과 동일한 **단일 박스** 한 줄에 숫자 코드를 입력한다.
 * 붙여넣기·자동완성(`one-time-code`) 지원. (자리별 세그먼트 PIN 은 PinPad 를 쓴다.)
 *
 * 이 컴포넌트는 **코드 입력 필드만** 책임진다. 타이머·재전송·확인 버튼이 함께 있는
 * 인증 폼은 이 필드를 **FormField + InputGroup** 으로 합성한다(타이머는 코드 입력 우측에 겹쳐 배치):
 *
 * @example
 * <FormField helper="문자로 전송된 인증번호를 입력해주세요">
 *   <InputGroup align="start">
 *     <div style={{ position: "relative", flex: 1 }}>
 *       <VerificationCodeInput value={code} onValueChange={setCode} onComplete={verify} />
 *       <CountdownTimer endsAt={endsAt} style={timerInField} />
 *     </div>
 *     <Button color="secondary" size="field">확인</Button>
 *   </InputGroup>
 * </FormField>
 */
export const VerificationCodeInput = React.forwardRef<HTMLInputElement, VerificationCodeInputProps>(
  (
    {
      length = 6,
      value,
      onValueChange,
      onComplete,
      disabled = false,
      error = false,
      fullWidth = true,
      autoFocus = false,
      className,
      placeholder,
      id: idProp,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = idProp ?? generatedId;

    const commit = (raw: string) => {
      const next = onlyDigits(raw).slice(0, length);
      onValueChange(next);
      if (next.length === length) onComplete?.(next);
    };

    return (
      <div
        data-slot="root"
        data-disabled={disabled ? "true" : "false"}
        data-error={error ? "true" : "false"}
        data-full-width={fullWidth ? "true" : "false"}
        className={cx(VC_ROOT_CLASS, className)}
      >
        <input
          ref={ref}
          id={inputId}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          maxLength={length}
          value={value}
          disabled={disabled}
          autoFocus={autoFocus}
          placeholder={placeholder ?? "인증번호 입력"}
          onChange={(e) => commit(e.target.value)}
          onPaste={(e) => {
            e.preventDefault();
            commit(e.clipboardData.getData("text"));
          }}
          className={VC_INPUT_CLASS}
          aria-label="인증번호"
          aria-invalid={error || undefined}
          {...rest}
        />
      </div>
    );
  },
);

VerificationCodeInput.displayName = "VerificationCodeInput";
