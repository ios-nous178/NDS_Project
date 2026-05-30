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
  | "muted" // 저강조 (보통 회색)
  // NudgeEAP 공식 로고 가이드 (Figma Library MqR7O3uvBvH5tVngwzbqGH, 698:87)
  | "koHorizontal" // 심볼 + 한글 / 가로 — 국내 서비스·한국어 자료
  | "koEnHorizontal" // 심볼 + 한글+영문 / 가로 — 대표 로고
  | "enHorizontal" // 심볼 + 영문 / 가로 — 영문/글로벌 (밝은 배경)
  | "enMono" // 심볼 + 영문 / 가로 / 단색 — 어두운 배경·다크모드
  | "symbol"; // 심볼 단독 / 그라디언트 — 앱 아이콘·파비콘·SNS 프로필

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

  // 기존 default/footer/svg 는 외부 contract — 유지.
  // ko/koEn/en/enMono/symbol 은 공식 로고 가이드(698:87) SVG (124×28, symbol 64×64).
  // DAIN 로고는 브랜드 variant 가 아니라 별도 DAIN_LOGO 로 분리 (아래 참고).
  "nudge-eap": {
    default: { filename: "nudge-eap-logo.png", mimeType: "image/png" },
    footer: { filename: "nudge-eap-logo-footer.png", mimeType: "image/png" },
    svg: { filename: "nudge-eap-logo.svg", mimeType: "image/svg+xml" },
    koHorizontal: { filename: "nudge-eap/nudge-eap-ko.svg", mimeType: "image/svg+xml" },
    koEnHorizontal: { filename: "nudge-eap/nudge-eap-koen.svg", mimeType: "image/svg+xml" },
    enHorizontal: { filename: "nudge-eap/nudge-eap-en.svg", mimeType: "image/svg+xml" },
    enMono: { filename: "nudge-eap/nudge-eap-en-dark.svg", mimeType: "image/svg+xml" },
    symbol: { filename: "nudge-eap/nudge-eap-symbol.svg", mimeType: "image/svg+xml" },
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

/**
 * DAIN 서브브랜드 로고.
 *
 * DAIN 은 DS 브랜드(BrandSlug)가 아니라 NudgeEAP 문맥에서만 노출되는
 * 서브브랜드라, 공유 LogoVariant union / brand-logo 매트릭스에 넣지 않고
 * 독립 상수로 분리. (로고 가이드 Figma Library 698:87 Section_DAIN)
 */
export const DAIN_LOGO: BrandLogoMeta = {
  filename: "nudge-eap/dain-logo.svg",
  mimeType: "image/svg+xml",
};

/** 한 브랜드의 보유 variant 키 배열 (정렬됨). */
export function getBrandLogoVariants(slug: BrandSlug): LogoVariant[] {
  return Object.keys(BRAND_LOGO_METADATA[slug] ?? {}) as LogoVariant[];
}
