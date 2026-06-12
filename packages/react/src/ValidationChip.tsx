import React from "react";
import { fontFamily, fontWeight } from "@nudge-design/tokens";

/* ─── Class names ─── */

const VC_CLASS = "nds-validation-chip";
const VC_ICON_CLASS = `${VC_CLASS}__icon`;
const VC_LABEL_CLASS = `${VC_CLASS}__label`;

/* ─── Types ─── */

export type ValidationChipState = "incomplete" | "complete" | "error";

/* ─── State → semantic color ─── */
/**
 * 아이콘·텍스트가 같은 색을 쓰므로 root 에 `color` 한 번만 박고 SVG 는 `currentColor`.
 * incomplete = 아직 미충족(muted), complete = 충족(brand), error = 형식 위반(status-error).
 */
const STATE_COLOR: Record<ValidationChipState, string> = {
  incomplete: "var(--semantic-text-muted-default, #999999)",
  complete: "var(--semantic-text-brand-default, #2b96ed)",
  error: "var(--semantic-text-status-error, #f13f00)",
};

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Icons (currentColor — state 색 상속) ─── */

const CheckGlyph: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    style={{ display: "block" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.5 8.25L6.5 11L12.5 4.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

const ErrorGlyph: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    style={{ display: "block" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

/* ─── Props ─── */

export interface ValidationChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 검증 상태 (Figma "state"): incomplete(미충족·muted) · complete(충족·brand) · error(위반·status-error) */
  state?: ValidationChipState;
  /** 라벨 래퍼에 추가할 클래스 */
  labelClassName?: string;
}

/**
 * ValidationChip — 입력 형식 요구사항의 실시간 충족 여부를 보여주는 인라인 표시.
 *
 * 16px 아이콘 + 12px 라벨, gap 4px. 읽기 전용 status 인디케이터 — 클릭 동작 없음.
 * 회원가입 비밀번호/이메일 규칙처럼 Input 아래 한 줄에 여러 개를 나열해(pattern:form-validation)
 * 입력값이 규칙을 충족할 때마다 incomplete → complete(Brand Blue) 로 전환한다.
 *
 * Chip/Badge 와 혼동 금지 — Chip 은 선택·필터용 인터랙티브 태그, Badge 는 상태 라벨,
 * ValidationChip 은 검증 규칙 1개의 충족 신호다.
 */
export const ValidationChip = React.forwardRef<HTMLSpanElement, ValidationChipProps>(
  ({ state = "incomplete", className, style, labelClassName, children, ...rest }, ref) => {
    const rootStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--semantic-gap-tight, 4px)",
      color: STATE_COLOR[state],
      fontFamily: fontFamily.web,
      fontSize: "12px",
      lineHeight: "normal",
      fontWeight: fontWeight.regular,
      whiteSpace: "nowrap",
      ...style,
    };

    return (
      <span
        ref={ref}
        data-slot="root"
        data-state={state}
        className={cx(VC_CLASS, className)}
        style={rootStyle}
        {...rest}
      >
        <span
          data-slot="icon"
          aria-hidden="true"
          className={VC_ICON_CLASS}
          style={{
            display: "inline-flex",
            flexShrink: 0,
            width: "16px",
            height: "16px",
          }}
        >
          {state === "error" ? <ErrorGlyph /> : <CheckGlyph />}
        </span>
        <span data-slot="label" className={cx(VC_LABEL_CLASS, labelClassName)}>
          {children}
        </span>
      </span>
    );
  },
);

ValidationChip.displayName = "ValidationChip";
