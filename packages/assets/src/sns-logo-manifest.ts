/**
 * SNS 로고 매니페스트 (런타임용).
 *
 * 메타데이터는 `sns-logo-metadata.ts` 에서 가져오고, 여기서 base64 dataUri 만 합성.
 * 메타데이터 전용 소비자 (MCP, catalog) 는 `sns-logo-metadata` 만 import 해서
 * base64 페이로드를 번들에 끌고 오지 않을 수 있다.
 */

import * as defaults from "./sns-logo-defaults.js";
import {
  SNS_LOGO_METADATA,
  type SnsLogoMeta,
  type SnsLogoMetaSet,
  type SnsLogoColor,
  type SnsService,
  type SnsLogoMimeType,
} from "./sns-logo-metadata.js";

export type { SnsService, SnsLogoColor, SnsLogoMimeType, SnsLogoMeta };
export { SNS_LOGO_METADATA, SNS_SERVICES, getSnsLogoColors } from "./sns-logo-metadata.js";

export interface SnsLogo extends SnsLogoMeta {
  /** base64 data URI fallback. 자산 호스팅 없이도 SNS 로그인 버튼이 깨지지 않게. */
  dataUri: string;
}

export type SnsLogoSet = Partial<Record<SnsLogoColor, SnsLogo>>;

/**
 * filename → base64 dataUri 매핑.
 * sns-logo-defaults 의 상수명은 SCREAMING_SNAKE_CASE 라 직접 매핑 테이블로 둔다.
 */
const DATA_URI_BY_FILENAME: Record<string, string> = {
  "sns-logos/naver-white.svg": defaults.SNS_NAVER_WHITE_DATA_URI,
  "sns-logos/naver-main.svg": defaults.SNS_NAVER_MAIN_DATA_URI,
  "sns-logos/kakao-black.svg": defaults.SNS_KAKAO_BLACK_DATA_URI,
  "sns-logos/kakao-main.svg": defaults.SNS_KAKAO_MAIN_DATA_URI,
  "sns-logos/google-white.svg": defaults.SNS_GOOGLE_WHITE_DATA_URI,
  "sns-logos/google-main.svg": defaults.SNS_GOOGLE_MAIN_DATA_URI,
  "sns-logos/apple-white.svg": defaults.SNS_APPLE_WHITE_DATA_URI,
  "sns-logos/apple-black.svg": defaults.SNS_APPLE_BLACK_DATA_URI,
};

function augment(meta: SnsLogoMeta): SnsLogo {
  return { ...meta, dataUri: DATA_URI_BY_FILENAME[meta.filename] ?? "" };
}

function augmentSet(set: SnsLogoMetaSet): SnsLogoSet {
  const out: SnsLogoSet = {};
  for (const key of Object.keys(set) as SnsLogoColor[]) {
    const meta = set[key];
    if (meta) out[key] = augment(meta);
  }
  return out;
}

export const SNS_LOGOS: Record<SnsService, SnsLogoSet> = {
  naver: augmentSet(SNS_LOGO_METADATA.naver),
  kakao: augmentSet(SNS_LOGO_METADATA.kakao),
  google: augmentSet(SNS_LOGO_METADATA.google),
  apple: augmentSet(SNS_LOGO_METADATA.apple),
};

/** 한 SNS 의 보유 로고 전체 (color → SnsLogo). */
export function getSnsLogos(sns: SnsService): SnsLogoSet {
  return SNS_LOGOS[sns] ?? {};
}

/**
 * 단일 SNS 로고 조회. color 미지정 시 합리적 default 로 fallback.
 *   main → black → white 순.
 *   (서비스 로고는 보통 "브랜드 색상" 이 가장 흔하게 쓰임)
 */
export function getSnsLogo(sns: SnsService, color?: SnsLogoColor): SnsLogo | undefined {
  const set = getSnsLogos(sns);
  if (color) return set[color];

  const fallbackOrder: SnsLogoColor[] = ["main", "black", "white"];
  for (const key of fallbackOrder) {
    const logo = set[key];
    if (logo) return logo;
  }
  return undefined;
}
