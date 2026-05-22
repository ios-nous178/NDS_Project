import React from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  shadow,
  spacing,
  transition,
  typeScale,
  zIndex,
} from "@nudge-eap/tokens";
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

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const floatingCtaBannerStyles = `
  :where(.${FCB_ROOT_CLASS}) {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.brand};
    border-radius: ${radius.pill}px;
    box-shadow: ${shadow["2"]};
    cursor: pointer;
    font-family: ${fontFamily.web};
    text-align: left;
    text-decoration: none;
    color: inherit;
    transition:
      transform ${transition.default},
      box-shadow ${transition.default};
  }

  :where(.${FCB_ROOT_CLASS}:hover) {
    transform: translateY(-1px);
    box-shadow: ${shadow["3"]};
  }

  :where(.${FCB_ROOT_CLASS}:active) {
    transform: translateY(0);
    box-shadow: ${shadow["1"]};
  }

  :where(.${FCB_ROOT_CLASS}[data-size="pc"]) {
    height: 68px;
    padding: 14px 24px 14px 16px;
    gap: ${spacing[12]}px;
    min-width: 440px;
  }

  :where(.${FCB_ROOT_CLASS}[data-size="mobile"]) {
    height: 60px;
    padding: ${spacing[12]}px ${spacing[16]}px ${spacing[12]}px ${spacing[12]}px;
    gap: ${spacing[8]}px;
    min-width: 288px;
  }

  :where(.${FCB_ROOT_CLASS}[data-floating="true"]) {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    z-index: ${zIndex.sticky};
  }

  :where(.${FCB_ROOT_CLASS}[data-floating="true"]:hover) {
    transform: translateX(-50%) translateY(-1px);
  }

  :where(.${FCB_ROOT_CLASS}[data-floating="true"]:active) {
    transform: translateX(-50%);
  }

  :where(.${FCB_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  :where(.${FCB_ROOT_CLASS}[data-size="pc"] .${FCB_ICON_CLASS}) {
    width: 48px;
    height: 48px;
  }

  :where(.${FCB_ROOT_CLASS}[data-size="mobile"] .${FCB_ICON_CLASS}) {
    width: 32px;
    height: 32px;
  }

  :where(.${FCB_ICON_CLASS} > *) {
    width: 100%;
    height: 100%;
  }

  :where(.${FCB_TEXT_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    flex: 1 1 auto;
    min-width: 0;
    text-align: left;
  }

  :where(.${FCB_CAPTION_CLASS}) {
    margin: 0;
    color: ${cv.textRole.subtle};
    font-weight: ${fontWeight.regular};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :where(.${FCB_ROOT_CLASS}[data-size="pc"] .${FCB_CAPTION_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
  }

  :where(.${FCB_ROOT_CLASS}[data-size="mobile"] .${FCB_CAPTION_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
  }

  :where(.${FCB_CTA_ROW_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[4]}px;
    color: ${cv.textRole.brand};
  }

  :where(.${FCB_CTA_TEXT_CLASS}) {
    margin: 0;
    font-weight: ${fontWeight.bold};
    color: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :where(.${FCB_ROOT_CLASS}[data-size="pc"] .${FCB_CTA_TEXT_CLASS}) {
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
  }

  :where(.${FCB_ROOT_CLASS}[data-size="mobile"] .${FCB_CTA_TEXT_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
  }

  :where(.${FCB_ARROW_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: currentColor;
    flex-shrink: 0;
  }

  :where(.${FCB_ROOT_CLASS}[data-size="pc"] .${FCB_ARROW_CLASS}) {
    width: 20px;
    height: 20px;
  }

  :where(.${FCB_ROOT_CLASS}[data-size="mobile"] .${FCB_ARROW_CLASS}) {
    width: 16px;
    height: 16px;
  }
`;

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
