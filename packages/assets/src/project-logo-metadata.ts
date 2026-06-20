/**
 * project-logo 메타데이터만 (dataUri 제외).
 *
 * MCP / catalog / 외부 도구가 "이 프로젝트는 어떤 로고 variant 를 가지고 있나?"
 * 를 알기 위해 사용. base64 fallback 까지 끌어오면 번들이 커지므로 분리.
 *
 * `@nudge-design/assets` 의 PROJECT_LOGOS 는 이 메타데이터 + project-logo-defaults 의
 * dataUri 를 조합한다.
 */

export type ProjectSlug = "trost" | "geniet" | "nudge-eap" | "cashwalk-biz" | "runmile";

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
    footer: { filename: "project/nudge-eap/logos/nudge-eap-logo-footer.png", mimeType: "image/png" },
    svg: { filename: "project/nudge-eap/logos/nudge-eap-logo.svg", mimeType: "image/svg+xml" },
    koHorizontal: { filename: "project/nudge-eap/logos/nudge-eap-ko.svg", mimeType: "image/svg+xml" },
    koEnHorizontal: { filename: "project/nudge-eap/logos/nudge-eap-koen.svg", mimeType: "image/svg+xml" },
    enHorizontal: { filename: "project/nudge-eap/logos/nudge-eap-en.svg", mimeType: "image/svg+xml" },
    enMono: { filename: "project/nudge-eap/logos/nudge-eap-en-dark.svg", mimeType: "image/svg+xml" },
    symbol: { filename: "project/nudge-eap/logos/nudge-eap-symbol.svg", mimeType: "image/svg+xml" },
  },

  "cashwalk-biz": {
    vertical: { filename: "project/cashwalk-biz/logos/cashwalk-vertical.png", mimeType: "image/png" },
    horizontal: { filename: "project/cashwalk-biz/logos/cashwalk-horizontal.png", mimeType: "image/png" },
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
    muted: { filename: "project/runmile/logos/runmile-logo-gray700.svg", mimeType: "image/svg+xml" },
    white: { filename: "project/runmile/logos/runmile-logo-white.svg", mimeType: "image/svg+xml" },
  },
};

export const PROJECT_SLUGS: readonly ProjectSlug[] = Object.keys(PROJECT_LOGO_METADATA) as ProjectSlug[];

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
