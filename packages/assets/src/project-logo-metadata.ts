/**
 * project-logo 메타데이터만 (dataUri 제외).
 *
 * MCP / catalog / 외부 도구가 "이 프로젝트는 어떤 로고 variant 를 가지고 있나?"
 * 를 알기 위해 사용. base64 fallback 까지 끌어오면 번들이 커지므로 분리.
 *
 * `@nudge-design/assets` 의 PROJECT_LOGOS 는 이 메타데이터 + project-logo-defaults 의
 * dataUri 를 조합한다.
 */

export type ProjectSlug =
  | "trost"
  | "geniet"
  | "nudge-eap"
  | "cashwalk-biz"
  | "runmile"
  | "cashwalk";

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
  | "white" // 흰색 (어두운 배경 위 — black 의 반전 변종)
  // Cashwalk 로고 가이드 (Figma 140:56) — color × layout 매트릭스. Full Color = brown #605151.
  // 메인 가로 = default(full)/mono(black)/white. 아래는 추가 layout 의 color 변종.
  | "horizontalCompact" // 가로(짧은) Full — 작은 가로 영역
  | "horizontalCompactMono" // 가로(짧은) Black
  | "horizontalCompactWhite" // 가로(짧은) White
  | "verticalMono" // 세로 Black
  | "verticalWhite" // 세로 White
  | "symbolMono" // 심볼 단독 Black
  | "symbolWhite" // 심볼 단독 White
  | "shoeIcon" // 신발 시그니처 아이콘 (brown on yellow #FFD200) — 앱 아이콘/일러스트 강조
  // NudgeEAP 공식 로고 가이드 (Figma Library MqR7O3uvBvH5tVngwzbqGH, 698:87)
  | "koHorizontal" // 심볼 + 한글 / 가로 — 국내 서비스·한국어 자료
  | "koEnHorizontal" // 심볼 + 한글+영문 / 가로 — 대표 로고
  | "enHorizontal" // 심볼 + 영문 / 가로 — 영문/글로벌 (밝은 배경)
  | "enMono" // 심볼 + 영문 / 가로 / 단색 — 어두운 배경·다크모드
  | "symbol"; // 심볼 단독 / 그라디언트 — 앱 아이콘·파비콘·SNS 프로필

export type LogoMimeType = "image/webp" | "image/png" | "image/svg+xml";

export interface ProjectLogoMeta {
  filename: string;
  mimeType: LogoMimeType;
}

export type ProjectLogoMetaSet = Partial<Record<LogoVariant, ProjectLogoMeta>>;

/**
 * variant → 파일명 매핑. filename 은 `@nudge-design/assets/files/` 아래 public path.
 */
export const PROJECT_LOGO_METADATA: Record<ProjectSlug, ProjectLogoMetaSet> = {
  // default(검정 워드마크, 밝은 배경) + white(흰 워드마크, 어두운 배경) — 디자이너 Figma 로고 가이드.
  trost: {
    default: { filename: "project/trost/logos/trost-logo.svg", mimeType: "image/svg+xml" },
    mobile: { filename: "project/trost/logos/trost-logo-mobile.webp", mimeType: "image/webp" },
    white: { filename: "project/trost/logos/trost-logo-white.svg", mimeType: "image/svg+xml" },
  },

  geniet: {
    pc: { filename: "project/geniet/logos/geniet-logo-pc.webp", mimeType: "image/webp" },
    mobile: { filename: "project/geniet/logos/geniet-logo-mobile.webp", mimeType: "image/webp" },
    footer: { filename: "project/geniet/logos/geniet-logo-footer.webp", mimeType: "image/webp" },
  },

  // 기존 default/footer/svg 는 외부 contract — 유지.
  // ko/koEn/en/enMono/symbol 은 공식 로고 가이드(698:87) SVG (124×28, symbol 64×64).
  // DAIN 로고는 프로젝트 variant 가 아니라 별도 DAIN_LOGO 로 분리 (아래 참고).
  "nudge-eap": {
    default: { filename: "project/nudge-eap/logos/nudge-eap-logo.png", mimeType: "image/png" },
    footer: {
      filename: "project/nudge-eap/logos/nudge-eap-logo-footer.png",
      mimeType: "image/png",
    },
    svg: { filename: "project/nudge-eap/logos/nudge-eap-logo.svg", mimeType: "image/svg+xml" },
    koHorizontal: {
      filename: "project/nudge-eap/logos/nudge-eap-ko.svg",
      mimeType: "image/svg+xml",
    },
    koEnHorizontal: {
      filename: "project/nudge-eap/logos/nudge-eap-koen.svg",
      mimeType: "image/svg+xml",
    },
    enHorizontal: {
      filename: "project/nudge-eap/logos/nudge-eap-en.svg",
      mimeType: "image/svg+xml",
    },
    enMono: {
      filename: "project/nudge-eap/logos/nudge-eap-en-dark.svg",
      mimeType: "image/svg+xml",
    },
    symbol: { filename: "project/nudge-eap/logos/nudge-eap-symbol.svg", mimeType: "image/svg+xml" },
  },

  "cashwalk-biz": {
    vertical: {
      filename: "project/cashwalk-biz/logos/cashwalk-vertical.png",
      mimeType: "image/png",
    },
    horizontal: {
      filename: "project/cashwalk-biz/logos/cashwalk-horizontal.png",
      mimeType: "image/png",
    },
    horizontalSvg: {
      filename: "project/cashwalk-biz/logos/cashwalk-for-business-horizontal.svg",
      mimeType: "image/svg+xml",
    },
  },

  // 런마일 로고 가이드 (Figma library 5089:16) — 4 color variants × 142×32 SVG.
  // SVG 내부에 fill="var(--fill-0, #HEX)" 형태로 CSS 변수 fallback 까지 들어있어
  // 테마 override 도 가능. default=red(프로젝트 primary), mono=black(단색), muted=gray700(저강조),
  // white=흰색(어두운/컬러 배경 위).
  runmile: {
    default: { filename: "project/runmile/logos/runmile-logo.svg", mimeType: "image/svg+xml" },
    mono: { filename: "project/runmile/logos/runmile-logo-black.svg", mimeType: "image/svg+xml" },
    muted: {
      filename: "project/runmile/logos/runmile-logo-gray700.svg",
      mimeType: "image/svg+xml",
    },
    white: { filename: "project/runmile/logos/runmile-logo-white.svg", mimeType: "image/svg+xml" },
  },

  // Cashwalk 소비자앱 로고 가이드 (Figma 140:56). Full Color = brown #605151 / mono = #111111 / white.
  // 4 lockup(가로 긴/가로 짧은/세로/심볼) × 3 color + 신발 시그니처 아이콘 = 13 SVG.
  // default = 메인 가로(긴) Full — 헤더/푸터 등 가로 폭 충분한 영역. 임의 회전·색변경·비율조정 금지.
  cashwalk: {
    default: {
      filename: "project/cashwalk/logos/cashwalk-horizontal.svg",
      mimeType: "image/svg+xml",
    },
    mono: {
      filename: "project/cashwalk/logos/cashwalk-horizontal-black.svg",
      mimeType: "image/svg+xml",
    },
    white: {
      filename: "project/cashwalk/logos/cashwalk-horizontal-white.svg",
      mimeType: "image/svg+xml",
    },
    horizontalCompact: {
      filename: "project/cashwalk/logos/cashwalk-horizontal-compact.svg",
      mimeType: "image/svg+xml",
    },
    horizontalCompactMono: {
      filename: "project/cashwalk/logos/cashwalk-horizontal-compact-black.svg",
      mimeType: "image/svg+xml",
    },
    horizontalCompactWhite: {
      filename: "project/cashwalk/logos/cashwalk-horizontal-compact-white.svg",
      mimeType: "image/svg+xml",
    },
    vertical: {
      filename: "project/cashwalk/logos/cashwalk-vertical.svg",
      mimeType: "image/svg+xml",
    },
    verticalMono: {
      filename: "project/cashwalk/logos/cashwalk-vertical-black.svg",
      mimeType: "image/svg+xml",
    },
    verticalWhite: {
      filename: "project/cashwalk/logos/cashwalk-vertical-white.svg",
      mimeType: "image/svg+xml",
    },
    symbol: { filename: "project/cashwalk/logos/cashwalk-symbol.svg", mimeType: "image/svg+xml" },
    symbolMono: {
      filename: "project/cashwalk/logos/cashwalk-symbol-black.svg",
      mimeType: "image/svg+xml",
    },
    symbolWhite: {
      filename: "project/cashwalk/logos/cashwalk-symbol-white.svg",
      mimeType: "image/svg+xml",
    },
    shoeIcon: {
      filename: "project/cashwalk/logos/cashwalk-shoe-icon.svg",
      mimeType: "image/svg+xml",
    },
  },
};

export const PROJECT_SLUGS: readonly ProjectSlug[] = Object.keys(
  PROJECT_LOGO_METADATA,
) as ProjectSlug[];

/**
 * DAIN 서브프로젝트 로고.
 *
 * DAIN 은 DS 프로젝트(ProjectSlug)가 아니라 NudgeEAP 문맥에서만 노출되는
 * 서브프로젝트라, 공유 LogoVariant union / project-logo 매트릭스에 넣지 않고
 * 독립 상수로 분리. (로고 가이드 Figma Library 698:87 Section_DAIN)
 */
export const DAIN_LOGO: ProjectLogoMeta = {
  filename: "project/nudge-eap/logos/dain-logo.svg",
  mimeType: "image/svg+xml",
};

/** 한 프로젝트의 보유 variant 키 배열 (정렬됨). */
export function getProjectLogoVariants(slug: ProjectSlug): LogoVariant[] {
  return Object.keys(PROJECT_LOGO_METADATA[slug] ?? {}) as LogoVariant[];
}
