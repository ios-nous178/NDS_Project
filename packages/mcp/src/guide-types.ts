/**
 * guide-types.ts — 컴포넌트/패턴 가이드의 타입 정의.
 *
 * 가이드 본문 데이터의 SSOT 는 guides-src/**.md — build-guides.mjs 가 파싱해
 * src/guides.generated.ts 로 방출하고, guides.ts 가 타입·데이터를 함께 re-export
 * 한다(기존 import 경로 호환). 타입을 바꾸면 build-guides.mjs 의 필드 허용목록과
 * guides-md.mjs 의 본문 섹션 매핑도 함께 점검할 것.
 */

export interface ComponentGuide {
  name: string;
  summary: string;
  pitfalls: string[];
  recommended?: string[];
  usagePolicy?: {
    useFor?: string[];
    doNotUseFor?: string[];
    limits?: Record<string, string | number | boolean>;
    /** color 별 사용 정책 (Badge 등) */
    colorPolicy?: Record<string, string>;
    /** variant 별 사용 정책 (Badge / Tabs 등) */
    variantPolicy?: Record<string, string>;
    /** shape 별 사용 정책 (Badge default/pill 등) */
    shapePolicy?: Record<string, string>;
    /** 추가 룰 한 줄 (Modal emphasisRule 등) */
    emphasisRule?: string;
  };
  examples?: {
    do: string;
    dont: string;
  };
  /**
   * vanilla HTML / Web Component(<nds-*>) 형태의 do/dont 예시.
   * `get_guide({ topic: 'component:<Name>', target: 'html' })` 호출 시
   * 라우터가 이 값을 `examples` 자리에 끼워 응답한다.
   *
   * 작성 규칙:
   * - 태그는 kebab-case `<nds-button>` 형태.
   * - attribute 도 kebab-case (`full-width`, `right-icon`).
   * - 이벤트는 attribute (`onclick="..."`) 가 아니라 `addEventListener("nds-...", ...)` 패턴으로 설명.
   * - JSON-encoded attribute 값 (예: `<nds-select options='[...]' />`) 은 적절한 따옴표 escape 로 표기.
   * - children 콜백/compound 패턴 등 React 전용 표현은 단순화하거나 `slot=` 으로 표현.
   */
  examplesHtml?: {
    do: string;
    dont: string;
  };
  /**
   * `target: 'html'` 호출 시 examplesHtml 가 비어 있는 react-only 컴포넌트임을 명시.
   * 값은 'no-html-equivalent' 만 허용 (현재 정의된 마커).
   * 라우터는 이 값이 있으면 `_htmlAdvisory` 한 줄을 응답에 첨부하고 react examples 를 그대로 노출.
   *
   * 브랜드 크롬(BrandX WebHeader / AppBar / Footer)에도 이 마커를 쓰되, 라우터의
   * `brandChromeHtmlRedirect(name)` 가 컴포넌트 이름으로 `<nds-brand-header>` / `<nds-brand-footer>`
   * 표지판 advisory 를 자동 생성한다 (막다른 길 안내가 아니라 brand wrapper 로 유도). 단, 본문
   * summary/recommended 에도 wrapper 한 줄을 같이 박아 조회 순서와 무관하게 노출되게 할 것
   * (BottomNav 가이드 패턴 — 회고: 진입점 하나만 보고 멈추는 실수 방지).
   */
  _htmlStatus?: "no-html-equivalent";
  /** color × variant 별 표시 톤 요약 */
  colorMatrix?: Record<string, string>;
  /** size 값 × 픽셀 스펙 (Figma 실측 기준) */
  sizeMatrix?: Record<string, string>;
  /** state(active/hover/disabled) 별 토큰/배경 매핑 */
  stateMatrix?: Record<string, string>;
  /** brand 별 sizeMatrix/stateMatrix 의 부분 override + 자유 dimensions 객체.
   *  service overlay 가 아니라 base 안의 brand-aware metadata (Figma 450:68 v2 결정).
   *
   *  brand 가 지정된 get_guide 호출 시 router 가 해당 brand 의 override 를 base 매트릭스에 deep merge 한다.
   *  dimensions 는 base 에 없는 spec 을 brand 별로 신설할 때 사용 (예: Modal Cashwalk-biz 의 admin desktop 변형 width/radius/padding/typography). */
  matrixOverrides?: Partial<
    Record<
      "trost" | "geniet" | "cashwalk-biz" | "nudge-eap",
      {
        sizeMatrix?: Partial<Record<string, string>>;
        stateMatrix?: Partial<Record<string, string>>;
        /** base 에 없는 spec 키. 키 이름은 자유 (width / radius / padding / typo* 등). 응답에 dimensions 그대로 노출. */
        dimensions?: Record<string, string>;
      }
    >
  >;
  /** brand 별 valid prop 값 — Pattern 'Brand-aware Base' (Figma 450:68 v2).
   *  예: BrandHeader.activeKey = { trost: ['home','counsel',...], geniet: ['home','community',...] }.
   *  brand 가 지정된 get_guide 호출 시 router 가 해당 brand 값만 응답에 fold. */
  validPropValues?: Partial<
    Record<"trost" | "geniet" | "cashwalk-biz" | "nudge-eap", Record<string, string[]>>
  >;
  /** brand 별 필요 파일 manifest — Pattern 'Brand-aware Base'.
   *  예: { trost: ['trost-logo.svg'], geniet: ['geniet-logo-pc.webp', ...] }. 호스트 앱이 public/ 에 배치해야 할 자산. */
  assetManifest?: Partial<Record<"trost" | "geniet" | "cashwalk-biz" | "nudge-eap", string[]>>;
  /** brand 별 강제 prop 값 — Pattern 'Brand-aware Base'.
   *  예: { footerTone: { trost: 'dark', '*': 'light' } } — 키 '*' 는 명시 안 된 brand 의 default. */
  forcedProps?: Record<
    string,
    Partial<Record<"trost" | "geniet" | "cashwalk-biz" | "nudge-eap" | "*", string>>
  >;
  /** 출처 Figma 노드 URL (Library 파일) */
  figmaNodeUrl?: string;
  /** 추가 레퍼런스 (스크린샷 URL · Figma/Zeplin 다중 노드 등). PatternGuide.references 와 동일 형태. */
  references?: Array<{
    label: string;
    /** Figma/Zeplin 또는 외부 URL. image 와 둘 중 하나는 있어야 의미가 있음. */
    url?: string;
    /** 패키지 내 상대경로 (`references/...`) — MCP server 가 절대경로로 풀어준다. */
    image?: string;
    caption?: string;
    brand?: "trost" | "geniet" | "cashwalk-biz" | "nudge-eap" | "runmile";
  }>;
  /** 접근성 가이드 (aria/대비/타겟 사이즈 등) */
  accessibility?: string[];
  interactivePattern?: string;
  /**
   * 합성 전용(standalone 금지) 여부. `false` 면 부모 없이는 의미 없는 필드/카드 서브 컴포넌트 —
   * 단독 사용 금지(예: HelperText·ValidationChip·FieldActionRow). 미설정(=true)은 단독 사용 가능.
   */
  standalone?: boolean;
  /** `standalone: false` 일 때 함께 합성되는 부모/형제 컴포넌트 (예: ["Input", "FormField"]). */
  composeWith?: string[];
}

export interface PatternGuide {
  name: string;
  summary: string;
  /** 평탄 룰 리스트 — MCP consumers (외부 mockup AI) 가 보는 진실 소스. ruleGroups 가 있어도 항상 채워야 한다. */
  rules: string[];
  /** 평탄 회피 리스트 — MCP consumers 진실 소스. avoidGroups 가 있어도 항상 채워야 한다. */
  avoid: string[];
  /** docs 사이트의 카테고리 subheading 용. 있으면 generate-guide-docs 가 ### 로 묶어 렌더한다. 없으면 flat rules 로 폴백. */
  ruleGroups?: Array<{ heading: string; items: string[] }>;
  /** docs 사이트의 회피 패턴 subheading 용. */
  avoidGroups?: Array<{ heading: string; items: string[] }>;
  metrics?: Record<string, string | number | boolean>;
  referenceInputs?: {
    accepted: string[];
    minimum: string;
    format: string;
    fallbackQuestion: string;
  };
  examples?: Array<{
    verdict: "good" | "bad";
    source: string;
    caption: string;
  }>;
  /** 대표 Figma 노드 URL — 단일 레퍼런스 (브랜드 가이드 / 어드민 표준 등). */
  figmaNodeUrl?: string;
  /** 추가 레퍼런스 (스크린샷 URL · Figma 다중 노드 등). label/caption 으로 무엇을 보여주는지 식별. */
  references?: Array<{
    label: string;
    /** Figma 또는 외부 URL. image 와 둘 중 하나는 있어야 의미가 있음. */
    url?: string;
    /** 로컬 이미지 경로 (`apps/storybook/public/...` 등). */
    image?: string;
    caption?: string;
    brand?: "trost" | "geniet" | "cashwalk-biz" | "nudge-eap" | "runmile";
  }>;
  /**
   * 복붙용 ready-made 트리(예: 캐포비 사이드바 HTML/React/SHELL). `_` prefix 라 pickSections 가
   * 모든 view(examples/rules/full)에서 항상 보존한다 — view:'examples' 가 rules 를 드롭해도
   * 로고/계정/메뉴가 안 사라진다(손조립 회귀 차단). rules[] 에는 여기로의 포인터만 둔다(토큰 중복 방지).
   */
  _readyMade?: {
    note?: string;
    html?: string;
    react?: string;
    shellHtml?: string;
  };
}
