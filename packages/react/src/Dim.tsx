import React from "react";

/* ─── Constants ─── */

const DIM_CLASS = "nds-dim";

export type DimType = "subtle" | "default" | "strong";

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export interface DimProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 백드롭 강도. `subtle`=α0.2(가벼운 분리) · `default`=α0.4(BG/Overlay 토큰·표준) ·
   * `strong`=α0.7(완전 차단). @default "default"
   */
  type?: DimType;
  /** 등장 시 페이드 인(180ms ease-out) 애니메이션 @default true */
  animated?: boolean;
  /**
   * 백드롭(영역 밖) 클릭 시 호출 — 오버레이 닫기 배선용. `onClick` 도 함께 동작한다.
   * 강제 결정 화면(Modal=필수 결정·BottomSheet Upclose)에서는 전달하지 않아 닫기를 막는다.
   */
  onClose?: () => void;
}

/**
 * Dim — 오버레이(Modal·BottomSheet·BottomPopup 등) 뒤를 덮는 백드롭(배경 차단) 레이어.
 *
 * 화면 전체(`position: fixed; inset: 0`)를 검정 alpha 로 덮어 뒤쪽 콘텐츠와의 위계를 만들고
 * 포커스를 오버레이로 모은다. **표현(배경 차단)만 책임지는 primitive** — 스크롤 잠금·포커스
 * 트랩·ESC·z-index 스택은 오버레이 컨테이너가 담당한다(Modal/BottomSheet 는 자체 백드롭 포함).
 */
export const Dim = React.forwardRef<HTMLDivElement, DimProps>(
  ({ type = "default", animated = true, onClose, className, onClick, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="root"
        data-type={type}
        data-animated={animated ? "true" : undefined}
        aria-hidden="true"
        className={cx(DIM_CLASS, className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) onClose?.();
        }}
        {...rest}
      />
    );
  },
);

Dim.displayName = "Dim";
