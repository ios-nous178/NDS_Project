/**
 * brand-logo 메타데이터만 (dataUri 제외).
 *
 * MCP / catalog / 외부 도구가 "이 브랜드는 어떤 로고 variant 를 가지고 있나?"
 * 를 알기 위해 사용. base64 fallback 까지 끌어오면 번들이 커지므로 분리.
 *
 * `@nudge-design/assets` 의 BRAND_LOGOS 는 이 메타데이터 + brand-logo-defaults 의
 * dataUri 를 조합한다.
 */

export type BrandSlug = "trost" | "geniet" | "nudge-eap" | "cashwalk-biz" | "runmile";

export type LogoVariant =
  | "default"
  | "mobile"
  | "footer"
  | "svg"
  | "pc"
  | "horizontal"
  | "vertical"
  | "horizontalSvg"
  // 색상 차원 (구조와 별도) — 단색 인쇄/저강조 UI 등에서 사용.
  | "mono" // 단색 (보통 검정)
  | "muted"; // 저강조 (보통 회색)

export type LogoMimeType = "image/webp" | "image/png" | "image/svg+xml";

export interface BrandLogoMeta {
  filename: string;
  mimeType: LogoMimeType;
}

export type BrandLogoMetaSet = Partial<Record<LogoVariant, BrandLogoMeta>>;

/**
 * variant → 파일명 매핑. 파일명은 외부 public API contract — 변경 금지.
 */
export const BRAND_LOGO_METADATA: Record<BrandSlug, BrandLogoMetaSet> = {
  trost: {
    default: { filename: "trost-logo.svg", mimeType: "image/svg+xml" },
    mobile: { filename: "trost-logo-mobile.webp", mimeType: "image/webp" },
  },

  geniet: {
    pc: { filename: "geniet-logo-pc.webp", mimeType: "image/webp" },
    mobile: { filename: "geniet-logo-mobile.webp", mimeType: "image/webp" },
    footer: { filename: "geniet-logo-footer.webp", mimeType: "image/webp" },
  },

  "nudge-eap": {
    default: { filename: "nudge-eap-logo.png", mimeType: "image/png" },
    footer: { filename: "nudge-eap-logo-footer.png", mimeType: "image/png" },
    svg: { filename: "nudge-eap-logo.svg", mimeType: "image/svg+xml" },
  },

  "cashwalk-biz": {
    vertical: { filename: "cashwalk-biz/cashwalk-vertical.png", mimeType: "image/png" },
    horizontal: { filename: "cashwalk-biz/cashwalk-horizontal.png", mimeType: "image/png" },
    horizontalSvg: {
      filename: "cashwalk-biz/cashwalk-for-business-horizontal.svg",
      mimeType: "image/svg+xml",
    },
  },

  // Figma 17:90 (런마일 library) — 3 color variants × 142×32 SVG.
  // SVG 내부에 fill="var(--fill-0, #FF5B37)" 형태로 CSS 변수 fallback 까지 들어있어
  // 테마 override 도 가능. default=red(브랜드 primary), mono=black(단색), muted=gray700(저강조).
  runmile: {
    default: { filename: "runmile-logo.svg", mimeType: "image/svg+xml" },
    mono: { filename: "runmile-logo-black.svg", mimeType: "image/svg+xml" },
    muted: { filename: "runmile-logo-gray700.svg", mimeType: "image/svg+xml" },
  },
};

export const BRAND_SLUGS: readonly BrandSlug[] = Object.keys(BRAND_LOGO_METADATA) as BrandSlug[];

/** 한 브랜드의 보유 variant 키 배열 (정렬됨). */
export function getBrandLogoVariants(slug: BrandSlug): LogoVariant[] {
  return Object.keys(BRAND_LOGO_METADATA[slug] ?? {}) as LogoVariant[];
}
