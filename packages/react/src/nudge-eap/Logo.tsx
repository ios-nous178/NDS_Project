import React from "react";
import { koLogoData, en_darkLogoData, symbolLogoData } from "./assets/nudge-eap";
import {
  koen_symbolSvg,
  koen_textSvg,
  ko_symbolSvg,
  ko_textSvg,
  enSvg,
  dainSvg,
} from "./assets/nudge-eap-svg";

/**
 * NudgeEAPLogo — Figma 698:87 (NudgeEAP Library) Logo Guide 의 6종 variant 자체-포함 React 컴포넌트.
 *
 * 외부 컨슈머는 `@nudge-eap/react` 만 import 하면 별도 자산 import 없이 로고 사용 가능:
 *
 * ```tsx
 * import { NudgeEAPLogo } from "@nudge-eap/react";
 *
 * <NudgeEAPLogo />                          // KO+EN horizontal (대표 로고)
 * <NudgeEAPLogo variant="symbol" size={40} /> // Symbol gradient (앱 아이콘/파비콘)
 * <NudgeEAPLogo variant="dain" />            // (주)다인 자회사 로고
 * ```
 *
 * 자산 정책:
 *   - `koen` / `ko` / `en` / `dain`: SVG base64 inline (Figma asset endpoint 가 사실 SVG 반환).
 *     무한 확대해도 깨지지 않음.
 *   - `en-dark` / `symbol`: gradient mask 등 multi-part 복잡 구조라 1x PNG fallback. 추후
 *     디자이너 SVG export 로 교체 가능.
 *
 * 비율: 124×28 (가로형) / 64×64 (Symbol) / 100×34 (DAIN).
 */

export type NudgeEAPLogoVariant = "koen" | "ko" | "en" | "en-dark" | "symbol" | "dain";

const VARIANT_RATIO: Record<NudgeEAPLogoVariant, { w: number; h: number }> = {
  koen: { w: 124, h: 28 },
  ko: { w: 124, h: 28 },
  en: { w: 124, h: 28 },
  "en-dark": { w: 124, h: 28 },
  symbol: { w: 64, h: 64 },
  dain: { w: 100, h: 34 },
};

const VARIANT_ALT: Record<NudgeEAPLogoVariant, string> = {
  koen: "NudgeEAP",
  ko: "넛지EAP",
  en: "nudge EAP",
  "en-dark": "nudge EAP",
  symbol: "NudgeEAP",
  dain: "DAIN",
};

/* 2-layer SVG layout (Figma inset 값 1:1 정합). */
const LAYOUT_KOEN = {
  symbol: { top: "15.16%", bottom: "15.16%", left: "0", right: "80.28%" },
  text: { top: "14.29%", bottom: "14.29%", left: "25.22%", right: "1.02%" },
} as const;
const LAYOUT_KO = {
  symbol: { top: "18.68%", bottom: "21.36%", left: "0", right: "83.03%" },
  text: { top: "17.86%", bottom: "20.55%", left: "21.68%", right: "1.02%" },
} as const;

export interface NudgeEAPLogoProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** 로고 형태. 기본 "koen" (Symbol + KO+EN horizontal, 대표 로고). */
  variant?: NudgeEAPLogoVariant;
  /** 높이 기준 사이즈 (px). width 는 자동 비례. 미지정 시 자체 원본. */
  size?: number;
  /** alt 텍스트 override. */
  alt?: string;
}

const layered = (
  symbolSvg: string,
  textSvg: string,
  layout: typeof LAYOUT_KOEN | typeof LAYOUT_KO,
  alt: string,
  width: number,
  height: number,
) => (
  <div
    role="img"
    aria-label={alt}
    style={{
      position: "relative",
      display: "inline-block",
      width,
      height,
      flexShrink: 0,
    }}
  >
    <img
      src={symbolSvg}
      alt=""
      style={{
        position: "absolute",
        top: layout.symbol.top,
        bottom: layout.symbol.bottom,
        left: layout.symbol.left,
        right: layout.symbol.right,
        objectFit: "contain",
      }}
    />
    <img
      src={textSvg}
      alt=""
      style={{
        position: "absolute",
        top: layout.text.top,
        bottom: layout.text.bottom,
        left: layout.text.left,
        right: layout.text.right,
        objectFit: "contain",
      }}
    />
  </div>
);

export const NudgeEAPLogo = React.forwardRef<HTMLDivElement, NudgeEAPLogoProps>(
  ({ variant = "koen", size, alt, style, ...rest }, ref) => {
    const ratio = VARIANT_RATIO[variant];
    const computedHeight = size ?? ratio.h;
    const computedWidth = (computedHeight * ratio.w) / ratio.h;
    const altText = alt ?? VARIANT_ALT[variant];

    /* 단일 SVG variant — vector, 무한 확대 가능 */
    if (variant === "en") {
      return (
        <img
          ref={ref as unknown as React.Ref<HTMLImageElement>}
          src={enSvg}
          alt={altText}
          width={computedWidth}
          height={computedHeight}
          style={{ objectFit: "contain", flexShrink: 0, ...style } as React.CSSProperties}
          {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
        />
      );
    }
    if (variant === "dain") {
      return (
        <img
          ref={ref as unknown as React.Ref<HTMLImageElement>}
          src={dainSvg}
          alt={altText}
          width={computedWidth}
          height={computedHeight}
          style={{ objectFit: "contain", flexShrink: 0, ...style } as React.CSSProperties}
          {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
        />
      );
    }

    /* 2-layer SVG variant — vector, 무한 확대 가능 */
    if (variant === "koen") {
      return (
        <div ref={ref} style={style} {...rest}>
          {layered(
            koen_symbolSvg,
            koen_textSvg,
            LAYOUT_KOEN,
            altText,
            computedWidth,
            computedHeight,
          )}
        </div>
      );
    }
    if (variant === "ko") {
      return (
        <div ref={ref} style={style} {...rest}>
          {layered(ko_symbolSvg, ko_textSvg, LAYOUT_KO, altText, computedWidth, computedHeight)}
        </div>
      );
    }

    /* PNG fallback — en-dark / symbol (multi-part 복잡 구조, 추후 SVG 교체 권장) */
    const fallbackSrc = variant === "en-dark" ? en_darkLogoData : symbolLogoData;
    void koLogoData;
    return (
      <img
        ref={ref as unknown as React.Ref<HTMLImageElement>}
        src={fallbackSrc}
        alt={altText}
        width={computedWidth}
        height={computedHeight}
        style={{ objectFit: "contain", flexShrink: 0, ...style } as React.CSSProperties}
        {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
      />
    );
  },
);

NudgeEAPLogo.displayName = "NudgeEAPLogo";
