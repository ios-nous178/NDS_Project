import React from "react";
import { en_darkLogoData, symbolLogoData } from "./assets/nudge-eap";
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

const LAYOUT_KOEN = {
  symbol: { w: 24.4489, h: 19.5109 },
  text: { w: 91.4696, h: 20 },
  gap: 6.82,
} as const;
const LAYOUT_KO = {
  symbol: { w: 21.0367, h: 16.7881 },
  text: { w: 95.8605, h: 17.2453 },
  gap: 5.84,
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
) => {
  const scale = height / 28;
  return (
    <div
      role="img"
      aria-label={alt}
      style={{
        display: "inline-flex",
        alignItems: "center",
        width,
        height,
        gap: layout.gap * scale,
        flexShrink: 0,
      }}
    >
      <img
        src={symbolSvg}
        alt=""
        width={layout.symbol.w * scale}
        height={layout.symbol.h * scale}
        style={{ display: "block", objectFit: "contain", flexShrink: 0 }}
      />
      <img
        src={textSvg}
        alt=""
        width={layout.text.w * scale}
        height={layout.text.h * scale}
        style={{ display: "block", objectFit: "contain", flexShrink: 0 }}
      />
    </div>
  );
};

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
