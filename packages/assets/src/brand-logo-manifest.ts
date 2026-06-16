/**
 * 5 브랜드 로고의 단일 매니페스트 (런타임용).
 *
 * 메타데이터는 `brand-logo-metadata.ts` 에서 가져오고, 여기서 base64 dataUri 만
 * 합성. 메타데이터 전용 소비자 (MCP, catalog) 는 `brand-logo-metadata` 만 import
 * 해서 base64 페이로드를 번들에 끌고 오지 않을 수 있다.
 */

import * as defaults from "./brand-logo-defaults.js";
import {
  BRAND_LOGO_METADATA,
  type BrandLogoMeta,
  type BrandLogoMetaSet,
  type BrandSlug,
  type LogoMimeType,
  type LogoVariant,
} from "./brand-logo-metadata.js";

export type { BrandSlug, LogoVariant, LogoMimeType, BrandLogoMeta };
export {
  BRAND_LOGO_METADATA,
  BRAND_SLUGS,
  getBrandLogoVariants,
  DAIN_LOGO,
} from "./brand-logo-metadata.js";

export interface BrandLogo extends BrandLogoMeta {
  /** base64 data URI fallback. 자산 호스팅 없이도 헤더/푸터가 깨지지 않게. */
  dataUri: string;
}

export type BrandLogoSet = Partial<Record<LogoVariant, BrandLogo>>;

/**
 * filename → base64 dataUri 매핑.
 * brand-logo-defaults 의 상수명은 SCREAMING_SNAKE_CASE 라 직접 매핑 테이블로 둔다.
 */
const DATA_URI_BY_FILENAME: Record<string, string> = {
  "brand/trost/logos/trost-logo.svg": defaults.TROST_LOGO_DATA_URI,
  "brand/trost/logos/trost-logo-mobile.webp": defaults.TROST_LOGO_MOBILE_DATA_URI,
  "brand/trost/logos/trost-logo-white.svg": defaults.TROST_LOGO_WHITE_DATA_URI,

  "brand/geniet/logos/geniet-logo-pc.webp": defaults.GENIET_LOGO_PC_DATA_URI,
  "brand/geniet/logos/geniet-logo-mobile.webp": defaults.GENIET_LOGO_MOBILE_DATA_URI,
  "brand/geniet/logos/geniet-logo-footer.webp": defaults.GENIET_LOGO_FOOTER_DATA_URI,

  "brand/nudge-eap/logos/nudge-eap-logo.png": defaults.NUDGE_EAP_LOGO_DATA_URI,
  "brand/nudge-eap/logos/nudge-eap-logo.svg": defaults.NUDGE_EAP_LOGO_SVG_DATA_URI,
  "brand/nudge-eap/logos/nudge-eap-logo-footer.png": defaults.NUDGE_EAP_LOGO_FOOTER_DATA_URI,
  // 공식 로고 가이드 변종 (구 NudgeEAPLogo 컴포넌트에서 이관) — 벡터 SVG SSOT
  "brand/nudge-eap/logos/nudge-eap-ko.svg": defaults.NUDGE_EAP_KO_DATA_URI,
  "brand/nudge-eap/logos/nudge-eap-koen.svg": defaults.NUDGE_EAP_KOEN_DATA_URI,
  "brand/nudge-eap/logos/nudge-eap-en.svg": defaults.NUDGE_EAP_EN_DATA_URI,
  "brand/nudge-eap/logos/nudge-eap-en-dark.svg": defaults.NUDGE_EAP_EN_DARK_DATA_URI,
  "brand/nudge-eap/logos/nudge-eap-symbol.svg": defaults.NUDGE_EAP_SYMBOL_DATA_URI,
  "brand/nudge-eap/logos/dain-logo.svg": defaults.DAIN_LOGO_DATA_URI,

  "brand/cashwalk-biz/logos/cashwalk-vertical.png": defaults.CASHWALK_BIZ_LOGO_DATA_URI,
  "brand/cashwalk-biz/logos/cashwalk-horizontal.png": defaults.CASHWALK_BIZ_LOGO_DATA_URI,
  "brand/cashwalk-biz/logos/cashwalk-for-business-horizontal.svg":
    defaults.CASHWALK_BIZ_LOGO_DATA_URI,

  "brand/runmile/logos/runmile-logo.svg": defaults.RUNMILE_LOGO_DATA_URI,
  "brand/runmile/logos/runmile-logo-black.svg": defaults.RUNMILE_LOGO_BLACK_DATA_URI,
  "brand/runmile/logos/runmile-logo-gray700.svg": defaults.RUNMILE_LOGO_GRAY700_DATA_URI,
};

function augment(meta: BrandLogoMeta): BrandLogo {
  return { ...meta, dataUri: DATA_URI_BY_FILENAME[meta.filename] ?? "" };
}

function augmentSet(set: BrandLogoMetaSet): BrandLogoSet {
  const out: BrandLogoSet = {};
  for (const key of Object.keys(set) as LogoVariant[]) {
    const meta = set[key];
    if (meta) out[key] = augment(meta);
  }
  return out;
}

export const BRAND_LOGOS: Record<BrandSlug, BrandLogoSet> = {
  trost: augmentSet(BRAND_LOGO_METADATA.trost),
  geniet: augmentSet(BRAND_LOGO_METADATA.geniet),
  "nudge-eap": augmentSet(BRAND_LOGO_METADATA["nudge-eap"]),
  "cashwalk-biz": augmentSet(BRAND_LOGO_METADATA["cashwalk-biz"]),
  runmile: augmentSet(BRAND_LOGO_METADATA.runmile),
};

/** 한 브랜드의 보유 로고 전체 (variant → BrandLogo). */
export function getBrandLogos(slug: BrandSlug): BrandLogoSet {
  return BRAND_LOGOS[slug] ?? {};
}

/**
 * 단일 로고 조회. variant 미지정 시 합리적 default 로 fallback.
 *   default → pc → horizontal → mobile → svg → footer → vertical → horizontalSvg
 */
export function getBrandLogo(slug: BrandSlug, variant?: LogoVariant): BrandLogo | undefined {
  const set = getBrandLogos(slug);
  if (variant) return set[variant];

  const fallbackOrder: LogoVariant[] = [
    "default",
    "pc",
    "horizontal",
    "mobile",
    "svg",
    "footer",
    "vertical",
    "horizontalSvg",
    "mono",
    "muted",
    "white",
  ];
  for (const key of fallbackOrder) {
    const logo = set[key];
    if (logo) return logo;
  }
  return undefined;
}
