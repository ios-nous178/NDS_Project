import React from "react";

import { ChevronRightIcon } from "@nudge-eap/icons";

/* ─── Types ─── */

export type FloatingCtaBannerSize = "pc" | "mobile";

export interface FloatingCtaBannerProps {
  /** 보조 캡션 ("찾는 음식이 없으신가요?") */
  caption: React.ReactNode;
  /** 강조 CTA 텍스트 ("음식 직접 등록하러 가기") */
  ctaText: React.ReactNode;
  /** 좌측 일러스트/아이콘 노드. PC 48 / Mobile 32 권장 */
  leadingIcon?: React.ReactNode;
  /** 클릭 콜백 (전체 배너가 button 으로 동작) */
  onClick?: () => void;
  /** 사이즈 토큰. 기본 "pc" */
  size?: FloatingCtaBannerSize;
  /**
   * 화면 하단 floating(sticky) 모드.
   * - `true` (기본): `position: fixed` 로 화면 하단 중앙 고정.
   * - `false`: 인라인 배치 — 부모 컨테이너에 맞춰 표시.
   */
  floating?: boolean;
  /** 우측 화살표 표시 여부 (기본 true) */
  showArrow?: boolean;
  /** floating bottom offset (px). 기본: PC 32 / Mobile 16 */
  bottomOffset?: number;
  /** aria-label (기본: ctaText 사용) */
  ariaLabel?: string;
  /** 추가 className */
  className?: string;
  /** 추가 style (floating 모드일 때 position 관련 prop 은 internal 이 우선) */
  style?: React.CSSProperties;
}

/* ─── Class names ─── */

const FCB_ROOT_CLASS = "nds-floating-cta-banner";
const FCB_ICON_CLASS = `${FCB_ROOT_CLASS}__icon`;
const FCB_TEXT_CLASS = `${FCB_ROOT_CLASS}__text`;
const FCB_CAPTION_CLASS = `${FCB_ROOT_CLASS}__caption`;
const FCB_CTA_ROW_CLASS = `${FCB_ROOT_CLASS}__cta-row`;
const FCB_CTA_TEXT_CLASS = `${FCB_ROOT_CLASS}__cta-text`;
const FCB_ARROW_CLASS = `${FCB_ROOT_CLASS}__arrow`;
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export function FloatingCtaBanner({
  caption,
  ctaText,
  leadingIcon,
  onClick,
  size = "pc",
  floating = true,
  showArrow = true,
  bottomOffset,
  ariaLabel,
  className,
  style,
}: FloatingCtaBannerProps) {
  const arrowSize = size === "pc" ? 20 : 16;
  const resolvedBottom = bottomOffset ?? (size === "pc" ? 32 : 16);
  const floatingStyle: React.CSSProperties | undefined = floating
    ? { bottom: resolvedBottom }
    : undefined;

  return (
    <button
      type="button"
      data-slot="root"
      data-size={size}
      data-floating={floating ? "true" : "false"}
      aria-label={ariaLabel ?? (typeof ctaText === "string" ? ctaText : undefined)}
      className={cx(FCB_ROOT_CLASS, className)}
      style={{ ...floatingStyle, ...style }}
      onClick={onClick}
    >
      {leadingIcon && (
        <span data-slot="icon" className={FCB_ICON_CLASS} aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <span data-slot="text" className={FCB_TEXT_CLASS}>
        <p className={FCB_CAPTION_CLASS}>{caption}</p>
        <span className={FCB_CTA_ROW_CLASS}>
          <p className={FCB_CTA_TEXT_CLASS}>{ctaText}</p>
          {showArrow && (
            <span data-slot="arrow" className={FCB_ARROW_CLASS} aria-hidden="true">
              <ChevronRightIcon size={arrowSize} />
            </span>
          )}
        </span>
      </span>
    </button>
  );
}
