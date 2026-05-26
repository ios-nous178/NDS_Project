import React from "react";

const IG_ROOT_CLASS = "nds-input-group";

export type InputGroupGap = "tight" | "default" | "loose";
export type InputGroupAlign = "stretch" | "start";

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 자식 간격. Figma 캐포비 admin (3396:988) 기준 `default` = 12px.
   * - `tight` 8 / `default` 12 / `loose` 16
   * @default "default"
   */
  gap?: InputGroupGap;
  /**
   * 각 자식의 너비 분배.
   * - `stretch` (기본): 모든 자식이 동일 비율로 늘어남 (`flex: 1 0 0`).
   *   Figma 표준 — 3분할 Date(년/월/일), 좌우 2-column 폼 모두 이 모드.
   * - `start`: 자식 본래 너비 유지. 너비가 서로 다른 input + 보조 button 같은 케이스.
   * @default "stretch"
   */
  align?: InputGroupAlign;
  /** 자식 (Input / Select / DatePicker 등) */
  children: React.ReactNode;
}

const GAP_PX: Record<InputGroupGap, number> = {
  tight: 8,
  default: 12,
  loose: 16,
};

const cx = (...c: Array<string | undefined | false>) => c.filter(Boolean).join(" ");

/**
 * 한 줄에 여러 form control 을 묶는 wrapper.
 * FormField 의 단일 child slot 에 InputGroup 을 넣으면 row 다중 input 폼이 된다.
 *
 * Figma 캐포비 admin: `Section_TextField` 의 `InputGroup` (3396:988) — gap 12,
 * 모든 child `flex: 1 0 0`. 사용자가 제공한 3466:17405 가 표준 사용 케이스.
 */
export const InputGroup: React.FC<InputGroupProps> = ({
  gap = "default",
  align = "stretch",
  className,
  style,
  children,
  ...rest
}) => {
  return (
    <div
      data-slot="root"
      data-align={align}
      className={cx(IG_ROOT_CLASS, className)}
      style={{ "--nds-input-group-gap": `${GAP_PX[gap]}px`, ...style } as React.CSSProperties}
      {...rest}
    >
      {children}
    </div>
  );
};

InputGroup.displayName = "InputGroup";
