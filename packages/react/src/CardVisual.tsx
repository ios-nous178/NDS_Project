import React from "react";
import { fontFamily, fontWeight, radius, spacing, typeScale } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const CV_CLASS = "nds-card-visual";
const CV_BRAND_CLASS = `${CV_CLASS}__brand`;
const CV_NUMBER_CLASS = `${CV_CLASS}__number`;
const CV_BOTTOM_CLASS = `${CV_CLASS}__bottom`;
const CV_HOLDER_CLASS = `${CV_CLASS}__holder`;
const CV_EXPIRY_CLASS = `${CV_CLASS}__expiry`;

/* ─── Types ─── */

export type CardVisualBrand =
  | "visa"
  | "master"
  | "amex"
  | "kakao"
  | "naver"
  | "samsung"
  | "shinhan"
  | "kb"
  | "generic";

export interface CardVisualProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 카드 번호 (보통 마지막 4자리만) */
  number?: string;
  /** 소유자 이름 */
  holder?: string;
  /** 만료일 (MM/YY) */
  expiry?: string;
  /** 브랜드 (배경 색 자동) */
  brand?: CardVisualBrand;
  /** 카드 라벨/별명 */
  label?: React.ReactNode;
  /** 좌상단 chip 표시 (기본 true) */
  showChip?: boolean;
  /** 비활성화 (만료/정지) */
  disabled?: boolean;
}

/* ─── Styles ─── */

const BRAND_BG: Record<CardVisualBrand, string> = {
  visa: "linear-gradient(135deg, #1A1F71 0%, #2D3CB1 100%)",
  master: "linear-gradient(135deg, #2C2C2C 0%, #4A4A4A 100%)",
  amex: "linear-gradient(135deg, #006FCF 0%, #00A6E8 100%)",
  kakao: "linear-gradient(135deg, #FFCC00 0%, #FBE54E 100%)",
  naver: "linear-gradient(135deg, #03C75A 0%, #1AD673 100%)",
  samsung: "linear-gradient(135deg, #1428A0 0%, #5158BB 100%)",
  shinhan: "linear-gradient(135deg, #0046FF 0%, #2E6BFF 100%)",
  kb: "linear-gradient(135deg, #FFB300 0%, #FFD54F 100%)",
  generic: "linear-gradient(135deg, #1A1A1A 0%, #444 100%)",
};

const BRAND_FG: Record<CardVisualBrand, string> = {
  visa: "#fff",
  master: "#fff",
  amex: "#fff",
  kakao: "#1A1A1A",
  naver: "#fff",
  samsung: "#fff",
  shinhan: "#fff",
  kb: "#1A1A1A",
  generic: "#fff",
};

const BRAND_LABEL: Record<CardVisualBrand, string> = {
  visa: "VISA",
  master: "Mastercard",
  amex: "AMEX",
  kakao: "카카오뱅크",
  naver: "네이버페이",
  samsung: "삼성카드",
  shinhan: "신한카드",
  kb: "KB국민카드",
  generic: "Card",
};

// eslint-disable-next-line unused-imports/no-unused-vars
const cvStyles = `
  :where(.${CV_CLASS}) {
    position: relative;
    width: 320px;
    aspect-ratio: 1.586;
    padding: ${spacing[20]}px;
    border-radius: ${radius.lg}px;
    color: var(--nds-card-fg, #fff);
    font-family: ${fontFamily.web};
    background: var(--nds-card-bg, linear-gradient(135deg, #1A1A1A 0%, #444 100%));
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    overflow: hidden;
  }

  :where(.${CV_CLASS}[data-disabled="true"]) {
    filter: grayscale(0.6);
    opacity: 0.7;
  }

  :where(.${CV_BRAND_CLASS}) {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  :where(.${CV_BRAND_CLASS}) > strong {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  :where(.${CV_NUMBER_CLASS}) {
    font-size: 20px;
    font-weight: ${fontWeight.semibold};
    letter-spacing: 0.16em;
    font-variant-numeric: tabular-nums;
  }

  :where(.${CV_BOTTOM_CLASS}) {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: ${spacing[12]}px;
  }

  :where(.${CV_HOLDER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    opacity: 0.85;
  }

  :where(.${CV_EXPIRY_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    font-variant-numeric: tabular-nums;
    opacity: 0.85;
  }

  :where(.${CV_CLASS}__chip) {
    width: 36px;
    height: 26px;
    border-radius: 4px;
    background: linear-gradient(135deg, #C8B870 0%, #E5D690 100%);
    margin-top: ${spacing[8]}px;
    border: 1px solid rgba(0,0,0,0.12);
  }

  :where(.${CV_CLASS}__label) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const formatNumber = (n: string) => {
  const last4 = n.replace(/\D/g, "").slice(-4);
  if (!last4) return "•••• •••• •••• ••••";
  return `•••• •••• •••• ${last4}`;
};

/* ─── Component ─── */

export const CardVisual = React.forwardRef<HTMLDivElement, CardVisualProps>(
  (
    {
      number,
      holder,
      expiry,
      brand = "generic",
      label,
      showChip = true,
      disabled = false,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        data-slot="root"
        data-brand={brand}
        data-disabled={disabled ? "true" : "false"}
        className={cx(CV_CLASS, className)}
        style={
          {
            "--nds-card-bg": BRAND_BG[brand],
            "--nds-card-fg": BRAND_FG[brand],
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        <div>
          <div className={CV_BRAND_CLASS}>
            <strong>{BRAND_LABEL[brand]}</strong>
            {label && <span className={`${CV_CLASS}__label`}>{label}</span>}
          </div>
          {showChip && <div className={`${CV_CLASS}__chip`} aria-hidden />}
        </div>
        <div className={CV_NUMBER_CLASS}>
          {number ? formatNumber(number) : "•••• •••• •••• ••••"}
        </div>
        <div className={CV_BOTTOM_CLASS}>
          <span className={CV_HOLDER_CLASS}>{holder ?? "Card Holder"}</span>
          {expiry && <span className={CV_EXPIRY_CLASS}>{expiry}</span>}
        </div>
      </div>
    );
  },
);

CardVisual.displayName = "CardVisual";
