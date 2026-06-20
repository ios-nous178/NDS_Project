/**
 * SNS 로고 메타데이터 (dataUri 제외).
 *
 * Runmile Figma library (file `Wd1BqKFPvrlLORr7E6EwjB`, frame 107:1045) 의 SNS 로그인
 * 버튼용 자산. 4 서비스 × 2 색상 = 8 자산. 모두 60×60 SVG.
 *
 * project-logo 와 분리한 이유:
 *   - SNS 자산은 project 차원이 아니라 *제3자 서비스* 차원 (네이버/카카오/구글/애플)
 *   - 색상 차원이 project 의 LogoVariant 와 호환되지 않음 (white/main/black)
 *   - 외부 소비자는 보통 SNS 8개 묶음을 통째로 호스팅하므로 별도 카테고리가 맞다
 *
 * 색상 컨벤션:
 *   - `white`  — 밝은 배경 위 / inverse 톤 (=서비스 로고가 흰색)
 *   - `main`   — 서비스 프로젝트 시그니처 색상 (naver green / kakao yellow / google multi / apple — 미존재)
 *   - `black`  — 어두운 배경 위 / mono (=서비스 로고가 검은색)
 *
 * 모든 SNS 가 모든 색상을 가지지 않는다 (Figma SSOT 기준):
 *   - naver:  white / main
 *   - kakao:  black / main
 *   - google: white / main
 *   - apple:  white / black
 */

export type SnsService = "naver" | "kakao" | "google" | "apple";

export type SnsLogoColor = "white" | "main" | "black";

export type SnsLogoMimeType = "image/webp" | "image/png" | "image/svg+xml";

export interface SnsLogoMeta {
  filename: string;
  mimeType: SnsLogoMimeType;
  /** Figma node id (단일 자산이라 1:1 매핑). 디자인 SSOT 추적용. */
  figmaNodeId: string;
}

export type SnsLogoMetaSet = Partial<Record<SnsLogoColor, SnsLogoMeta>>;

/** SNS 자산이 위치한 Figma 파일 키 (Runmile library 원본). */
export const SNS_LOGO_FIGMA_FILE_KEY = "Wd1BqKFPvrlLORr7E6EwjB";

/**
 * SNS × color → 파일명 매핑. 파일명은 외부 public API contract — 변경 금지.
 */
export const SNS_LOGO_METADATA: Record<SnsService, SnsLogoMetaSet> = {
  naver: {
    white: {
      filename: "shared/sns-logos/naver-white.svg",
      mimeType: "image/svg+xml",
      figmaNodeId: "107:1044",
    },
    main: {
      filename: "shared/sns-logos/naver-main.svg",
      mimeType: "image/svg+xml",
      figmaNodeId: "107:1043",
    },
  },
  kakao: {
    black: {
      filename: "shared/sns-logos/kakao-black.svg",
      mimeType: "image/svg+xml",
      figmaNodeId: "107:1042",
    },
    main: {
      filename: "shared/sns-logos/kakao-main.svg",
      mimeType: "image/svg+xml",
      figmaNodeId: "107:1041",
    },
  },
  google: {
    white: {
      filename: "shared/sns-logos/google-white.svg",
      mimeType: "image/svg+xml",
      figmaNodeId: "107:1038",
    },
    main: {
      filename: "shared/sns-logos/google-main.svg",
      mimeType: "image/svg+xml",
      figmaNodeId: "107:1040",
    },
  },
  apple: {
    white: {
      filename: "shared/sns-logos/apple-white.svg",
      mimeType: "image/svg+xml",
      figmaNodeId: "107:1037",
    },
    black: {
      filename: "shared/sns-logos/apple-black.svg",
      mimeType: "image/svg+xml",
      figmaNodeId: "107:1039",
    },
  },
};

export const SNS_SERVICES: readonly SnsService[] = Object.keys(SNS_LOGO_METADATA) as SnsService[];

/** 한 SNS 의 보유 color 키 배열. */
export function getSnsLogoColors(sns: SnsService): SnsLogoColor[] {
  return Object.keys(SNS_LOGO_METADATA[sns] ?? {}) as SnsLogoColor[];
}
