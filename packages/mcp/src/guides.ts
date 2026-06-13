import { canonicalBrandSlug } from "@nudge-design/mockup-core/tools/standalone-assets";
import { getBrandProfile } from "@nudge-design/tokens/brand-profiles";

/**
 * 컴포넌트별 사용 가이드 — d.ts 파싱만으로는 잡히지 않는
 * "이 컴포넌트를 어떻게 써야 하는가"의 큐레이션된 지식.
 *
 * 추가 기준:
 * - DS 매트릭스를 잘못 해석해 시각적 함정에 빠지는 경우(예: neutral solid)
 * - 슬롯/내부 padding 등 이미 적용된 스타일과 충돌 가능성
 * - 표준 variant에 없는 톤이 필요할 때 확장 슬롯 사용 패턴
 */

/* ──────────────────────────────────────────────────────────────────────
 * Intent 감지 / 분기 — 영역 3분화: 서비스 / 어드민(b2b) / 백오피스(사내)
 *
 * 이 MCP는 본질적으로 "사용자 앱(서비스)" DS 컴포넌트 라이브러리를 노출하지만,
 * 운영자가 보는 화면은 두 영역으로 갈린다:
 *
 *   - 어드민(admin): 외부에 제공되는 b2b 어드민 *서비스*. DS_ADMIN_BRANDS 하드게이트
 *     브랜드(캐포비/넛지EAP)만 지원하며 DS(html 워크플로우)로 만든다.
 *     그 외 브랜드는 차단(blocked-admin).
 *
 *   - 백오피스(backoffice): 사내 어드민/운영툴/CMS. 브랜드 무관 전 서비스 기본 지원 —
 *     중립 antd 컨벤션(buildBackofficeGuide, 서비스명 파라미터)으로 만든다.
 *     (구명 'admin-cms' 는 외부 워크스페이스 호환을 위한 영구 별칭.)
 *
 * ★ 키워드로 두 영역을 가르지 않는다 — "어드민"이라 부르는 사내 툴, "CMS"라 부르는 b2b
 *   어드민이 흔해 휴리스틱 오분류가 잦다. 운영자 화면 키워드(OPERATOR_KEYWORDS)가 보이면
 *   추측하지 말고 사용자 확답(ambiguous-operator — 하드스톱)을 받은 뒤 intent:'admin' 또는
 *   intent:'backoffice' 로 진행한다.
 *
 * ★ 캐포비(cashwalk-biz)는 DS 안에 자체 admin 디자인 시스템까지 갖고 있어
 *   (admin layout 1920/sidebar 300, input admin radius4/h40, Modal admin desktop 480),
 *   admin/백오피스 어느 쪽이든 결과가 DS(html + cascade) — 질문 없이 우회한다(회귀 보존).
 *   넛지EAP 어드민은 자체 admin 토큰 없이 기존 DS 컴포넌트/토큰으로 목업한다.
 *   resolveIntentRouting() 이 이 분기를 단일 지점에서 결정한다.
 *
 * 사용자 앱(서비스)으로 간주하는 키워드:
 *   사용자 앱 / 모바일 앱 / 마이페이지 / 회원가입 / 상담 신청 / 챌린지 / 일기 / 콘텐츠 카드
 *   Trost / Geniet / NudgeEAP / CashwalkBiz / Runmile 사용자 화면
 * ────────────────────────────────────────────────────────────────────── */

/**
 * 운영자 화면(어드민/백오피스) 신호 — 합쳐서 '감지'만 하고, 영역(b2b 어드민 vs 사내
 * 백오피스)은 키워드로 가르지 않는다. 사용자 확답을 받은 뒤 intent:'admin' /
 * intent:'backoffice' 명시 재호출로 진행한다.
 */
const OPERATOR_KEYWORDS = [
  "어드민",
  "관리자페이지",
  "관리자 페이지",
  "관리자툴",
  "관리자 툴",
  "admin",
  "백오피스",
  "백 오피스",
  "backoffice",
  "back-office",
  "back office",
  "cms",
  "운영툴",
  "운영 툴",
  "정산 관리",
  "감사 로그",
];

/**
 * vanilla HTML / Web Component 워크플로우를 의미하는 키워드.
 * 사용자가 'HTML 로 작업', '바닐라', '<nds-button>', 'Web Component', 'react 없이' 등을
 * 언급하면 .tsx + Vite + React 워크플로우 대신 @nudge-design/html 셋업으로 분기시킨다.
 */
const HTML_KEYWORDS = [
  "vanilla html",
  "vanilla-html",
  "바닐라 html",
  "vanilla js",
  "vanilla-js",
  "vanilla javascript",
  "vanilla-javascript",
  "vanilla ts",
  "vanilla-ts",
  "vanilla typescript",
  "vanilla-typescript",
  "바닐라 js",
  "바닐라 자바스크립트",
  "바닐라 ts",
  "바닐라 타입스크립트",
  "plain html",
  "정적 html",
  "static html",
  "static site",
  "static-site",
  "web component",
  "web-component",
  "webcomponent",
  "custom element",
  "custom-element",
  "<nds-",
  "@nudge-design/html",
  "html-only",
  "html only",
  "no-react",
  "no react",
  "without react",
  "react 없이",
  "리액트 없이",
  "리액트 없",
];

/**
 * 발화 → 워크스페이스 intent 분류.
 *
 * 정책 변경 (2026-05-25): admin/backoffice 가 아니면 무조건 **html** 로 라우팅.
 * 더 이상 user-app(.tsx + React) 을 default 로 안내하지 않는다 — 신규 mockup
 * 워크스페이스는 모두 vanilla HTML (@nudge-design/html + Vite vanilla-ts) 로 셋업.
 * 기존 React mockup 워크스페이스는 detectWorkspaceIntent (build-html.ts) 가
 * package.json / src 구조로 회귀 없이 react 로 인식하므로 백워드 호환.
 *
 * 반환에 "user-app" 이 포함된 건 호출처가 분기를 유지하기 위한 백워드 호환 — 신규
 * 발화는 "user-app" 으로 떨어지지 않는다.
 */
export function detectIntentFromText(text?: string): "operator" | "user-app" | "html" {
  if (!text) return "html";
  const normalized = text.toLowerCase();
  // 운영자 화면 신호는 '감지'까지만 — admin/backoffice 영역 확정은 사용자 확답으로.
  for (const k of OPERATOR_KEYWORDS) {
    if (normalized.includes(k)) return "operator";
  }
  // HTML_KEYWORDS 매칭은 명시적 신호 — html 분기를 강하게 표현하기 위해 남겨두지만
  // 매칭 안 되는 발화도 default 가 html 이므로 결과는 동일하다.
  for (const k of HTML_KEYWORDS) {
    if (normalized.includes(k.toLowerCase())) return "html";
  }
  return "html";
}

/**
 * 어드민(외부 제공 b2b 어드민 서비스)을 DS 로 만드는 하드게이트 브랜드.
 * 이 목록 밖 브랜드의 어드민 발화는 차단(blocked-admin)된다 — 백오피스(중립 antd)로
 * 진행하거나 DS 팀에 어드민 편입을 요청해야 한다.
 *  - cashwalk-biz: DS 안에 자체 admin 디자인 시스템(admin 토큰/page-pattern) 보유
 *  - nudge-eap:    자체 admin 토큰 없이 기존 DS 컴포넌트/토큰으로 어드민 목업 제작
 */
export const DS_ADMIN_BRANDS = ["cashwalk-biz", "nudge-eap"] as const;

export function isDsAdminBrand(brand?: string | null): boolean {
  // 별칭 정규화 필수 — cashpobi / cash-pobi / cashwalkbiz 등 입력도 cashwalk-biz 로 resolve 해야
  // admin 발화가 antd(백오피스)가 아니라 DS 경로로 우회된다. raw 매치만 하면 brand='cashpobi'
  // 가 새어나가 백오피스 사이드바(240px·INFO·CMS MENU)가 캐포비에 잘못 적용됨.
  const canon = canonicalBrandSlug(brand ?? undefined);
  return !!canon && (DS_ADMIN_BRANDS as readonly string[]).includes(canon);
}

/**
 * DS 안에 '자체 admin 디자인 시스템'(admin 토큰·page-pattern)까지 갖춘 브랜드인지.
 * 이 브랜드(현재 캐포비)는 백오피스/CMS 발화라도 DS 경로로 우회한다 — "캐포비 CMS"
 * 발화가 antd 로 새던 회귀를 막는 게이트. 판정은 brand profile 의 admin.pagePatternSystem
 * 선언을 SSOT 로 쓴다(슬러그 하드코딩 회피).
 */
function hasOwnAdminDesignSystem(canonicalBrand?: string | null): boolean {
  return !!canonicalBrand && !!getBrandProfile(canonicalBrand)?.admin?.pagePatternSystem;
}

/** resolveIntentRouting 의 결과 — 영역 3분화 라우팅의 단일 진리원천. */
export type IntentRouting =
  | { kind: "html"; surface?: "admin"; brand?: string }
  | { kind: "backoffice" }
  | {
      kind: "blocked-admin";
      requestedBrand: string;
      supportedAdminBrands: readonly string[];
      error: string;
      options: string[];
    }
  | {
      kind: "ambiguous-operator";
      requestedBrand?: string;
      question: string;
      options: string[];
    };

/**
 * intent + brand 를 합쳐 영역(서비스/어드민/백오피스) 라우팅을 결정하는 단일 지점.
 *
 *   - intent:'backoffice'(또는 레거시 'admin-cms')                  → backoffice (중립 antd)
 *   - intent:'admin' + DS_ADMIN_BRANDS                             → html (DS admin)
 *   - intent:'admin' + 게이트 밖 브랜드 명시                         → blocked-admin (차단)
 *   - intent:'admin' + 브랜드 미지정                                 → ambiguous-operator (지원 브랜드 확답 필요)
 *   - 운영자 키워드 자유발화(어드민/백오피스/CMS/운영툴/admin/...)    → ambiguous-operator (하드스톱 —
 *     b2b 어드민인지 사내 백오피스인지 확답 받기 전 진행 금지)
 *   - 그 외                                                         → html
 *
 * ★ 예외 — 자체 admin DS 보유 브랜드(캐포비): 운영자 발화가 admin/backoffice 어느 쪽이든
 *   결과가 DS(html) 라 질문이 무의미 — 확답 없이 DS 경로로 우회한다 ("캐포비 CMS" 회귀 보존).
 *
 * ★ blocked/ambiguous 일 때 호출처는 어떤 가이드/셋업 본문도 반환하지 말 것 — 질문/안내와
 *   본문을 같이 주면 소비 에이전트가 질문을 무시하고 본문으로 진행해버린다.
 *
 * 레거시 intent:'admin-cms' 는 "antd 가이드를 달라"는 뜻이므로 차단 대상이 아니라
 * backoffice 로 정규화한다 (이미 배포된 외부 CLAUDE.md 호환).
 * 모든 라우팅 지점(setup / CLAUDE.md 생성)은 detectIntentFromText 대신 이 함수를 써야
 * brand 신호가 누락되지 않는다.
 */
export function resolveIntentRouting(intent?: string, brand?: string | null): IntentRouting {
  const explicit =
    intent === "admin" || intent === "backoffice" || intent === "admin-cms" || intent === "html"
      ? intent
      : undefined;
  const track =
    explicit === "admin-cms" ? "backoffice" : (explicit ?? detectIntentFromText(intent));
  const canon = canonicalBrandSlug(brand ?? undefined);

  if (track === "html" || track === "user-app") return { kind: "html", brand: canon };

  // 자체 admin DS 보유 브랜드(캐포비)는 admin/backoffice/operator 어느 발화든 DS 경로.
  if (hasOwnAdminDesignSystem(canon)) {
    return { kind: "html", surface: "admin", brand: canon };
  }

  if (track === "backoffice") return { kind: "backoffice" };

  if (track === "admin") {
    if (isDsAdminBrand(brand)) return { kind: "html", surface: "admin", brand: canon };
    if (brand && brand.trim()) {
      const requested = canon ?? brand.trim();
      return {
        kind: "blocked-admin",
        requestedBrand: requested,
        supportedAdminBrands: DS_ADMIN_BRANDS,
        error:
          `이 브랜드(${requested})는 어드민(외부 제공 b2b) 미지원입니다. ` +
          `어드민 목업은 ${DS_ADMIN_BRANDS.join(" / ")} 만 DS 로 제작할 수 있습니다.`,
        options: [
          "사내 백오피스 화면이라면 intent:'backoffice' 로 다시 호출 — 중립 antd 컨벤션으로 진행",
          "이 브랜드의 어드민(b2b) 편입이 필요하면 DS 팀에 요청",
        ],
      };
    }
    return {
      kind: "ambiguous-operator",
      question:
        "어드민(b2b)은 하드게이트 브랜드만 지원합니다. 어느 브랜드의 어드민인가요? " +
        `지원 브랜드(${DS_ADMIN_BRANDS.join(", ")}) 를 brand 로 명시해 재호출하세요. ` +
        "확답을 받기 전에는 가이드/셋업을 진행하지 않습니다.",
      options: [
        `b2b 어드민 → brand 명시해 재호출 (지원: ${DS_ADMIN_BRANDS.join(", ")})`,
        "사내 백오피스였다면 → intent:'backoffice' 로 재호출 (중립 antd, 전 서비스 기본 지원)",
      ],
    };
  }

  // track === "operator" — 운영자 화면 발화이지만 영역 미확정. 키워드로 추측하지 않고
  // 사용자 확답을 받은 뒤 intent:'admin' / intent:'backoffice' 명시 재호출로만 진행한다.
  const gateNote =
    brand && brand.trim() && !isDsAdminBrand(brand)
      ? ` 참고: 이 브랜드(${canon ?? brand.trim()})는 어드민(b2b) 미지원 — b2b 어드민이라면 차단되며, ` +
        "사내 백오피스로 진행하거나 DS 팀에 어드민 편입을 요청해야 합니다."
      : "";
  return {
    kind: "ambiguous-operator",
    requestedBrand: canon ?? (brand?.trim() || undefined),
    question:
      "운영자 화면 요청으로 보입니다. 이 화면은 어느 영역인가요? 사용자에게 확답을 받기 전에는 " +
      "가이드/셋업을 진행하지 않습니다. " +
      `(1) 외부 제공(b2b) 어드민 — intent:'admin' + 지원 브랜드(${DS_ADMIN_BRANDS.join(", ")}) 로 재호출, ` +
      "(2) 사내 백오피스 — intent:'backoffice' 로 재호출." +
      gateNote,
    options: [
      `b2b 어드민 → intent:'admin' + brand 명시해 재호출 (지원: ${DS_ADMIN_BRANDS.join(", ")})`,
      "사내 백오피스 → intent:'backoffice' 로 재호출 (중립 antd, 전 서비스 기본 지원)",
    ],
  };
}

/**
 * @deprecated resolveIntentRouting 을 사용할 것 — 이 wrapper 는 blocked/ambiguous 를
 * 구분하지 못하고 "admin-cms" 로 뭉개서 반환한다(구 dist 호환용으로 한 릴리즈 유지).
 */
export function resolveEffectiveIntent(
  intent?: string,
  brand?: string | null,
): "admin-cms" | "html" {
  const routing = resolveIntentRouting(intent, brand);
  return routing.kind === "html" ? "html" : "admin-cms";
}

export const SCOPE_ADVISORY = {
  scope: "사용자 앱 (Trost / Geniet / NudgeEAP / CashwalkBiz / Runmile) 화면 전용",
  role: {
    purpose:
      "이 MCP의 역할은 '별도의 외부 목업 프로젝트(예: Vite + React)에서 DS를 소비해 목업을 만드는 것'이다. " +
      "DS 레포(NudgeEAPDesignSystem) 자체의 소스 코드를 수정하거나 GitHub에 푸시하는 것은 이 MCP의 역할이 아니다.",
    inScope: [
      "외부 목업 프로젝트에서 DS 컴포넌트/아이콘/토큰 조회",
      "외부 목업 프로젝트에 CLAUDE.md / 환경 셋업 생성",
      "서비스(사용자 앱) / 어드민(b2b, 하드게이트 브랜드) / 백오피스(사내, antd) 목업 작성·검증",
      "목업 dev 서버 실행 / preview 확인 / 종료",
    ],
    outOfScope: [
      "DS 레포의 컴포넌트/토큰/아이콘 소스 코드 수정",
      "DS 레포에 대한 git commit, git push, PR 생성, 브랜치 조작",
      "GitHub 레포지토리(이 DS 또는 다른 레포) 직접 변경",
      "DS 패키지 버전 bump, npm publish, 릴리즈 작업",
    ],
    ifAskedToModifyRepo:
      "사용자가 DS 레포 수정이나 GitHub 푸시를 요청하면, 이 MCP의 역할이 아님을 알리고 DS 레포에서 직접 작업하라고 안내할 것. " +
      "이 MCP는 외부 프로젝트에서 DS를 '소비'하는 쪽이며, DS 레포를 '생산'하는 쪽이 아니다.",
  },
  intentBranching: {
    "operator-screens": {
      keywords: OPERATOR_KEYWORDS,
      action:
        "운영자 화면 키워드(어드민/백오피스/CMS/운영툴/admin 등)가 보이면 영역을 키워드로 추측하지 말 것 — " +
        "b2b 어드민인지 사내 백오피스인지 **사용자에게 확답을 받은 뒤** intent:'admin' 또는 intent:'backoffice' 로 " +
        "재호출해 진행한다. 확답 전에는 가이드/셋업/코드 작성을 진행하지 않는다 (get_setup 이 ambiguous-operator " +
        "질문 페이로드로 하드스톱한다). " +
        "★ 예외: 캐포비(cashwalk-biz)는 자체 admin 디자인 시스템 보유 — 어느 쪽이든 DS(html) 경로라 질문 없이 우회.",
    },
    admin: {
      action:
        "어드민(외부 제공 b2b 어드민 서비스)은 하드게이트 브랜드만 지원한다 — " +
        `${DS_ADMIN_BRANDS.join(" / ")}. 이 브랜드들의 어드민은 antd 가 아니라 DS(html 워크플로우)로 ` +
        "만든다 (brand 를 넘기면 get_setup / CLAUDE.md 가 자동으로 DS 경로로 우회). " +
        "그 외 브랜드의 어드민 요청은 차단된다 — 사내 백오피스 화면이면 intent:'backoffice' 로 진행하고, " +
        "이 브랜드의 어드민 편입이 필요하면 DS 팀에 요청할 것.",
      tools: [
        `get_setup({ step: 'full', intent: 'admin', brand: '${DS_ADMIN_BRANDS[0]}' })`,
        "get_guide({ topic: 'backoffice' }) — 사내 백오피스로 전환할 때",
      ],
    },
    backoffice: {
      action:
        "백오피스(사내 어드민/운영툴/CMS)는 브랜드 무관 전 서비스 기본 지원 — 이 DS(@nudge-design/react)를 " +
        "쓰지 말고 antd v5 를 사용한다. 시각/구조 컨벤션은 get_guide({ topic: 'backoffice', serviceName: '<서비스명>' }) 로 " +
        "확인할 것. 두 라이브러리를 한 화면에서 섞어쓰지 말 것. (구명 'admin-cms' 는 영구 별칭으로 계속 동작.) " +
        "★ 단, 캐포비(cashwalk-biz)는 백오피스/CMS 발화라도 DS(html) 경로로 우회한다 — DS 안에 자체 admin " +
        "디자인 시스템을 갖고 있다.",
      tools: [
        "get_guide({ topic: 'backoffice', serviceName: '<서비스명>' })",
        "get_setup({ step: 'full', intent: 'backoffice' })",
      ],
    },
    "admin-cms": "→ 'backoffice' 로 rename 됨 (영구 별칭으로 계속 동작) — backoffice 항목 참조.",
    "user-app": {
      action:
        "[deprecated] React/.tsx + @nudge-design/react 워크플로우. 신규 mockup 워크스페이스는 " +
        "'html' 분기로 진입하세요 (Vite vanilla-ts + @nudge-design/html). 기존 React mockup 을 " +
        "유지보수하는 경우에만 이 분기로 들어옵니다 — build-html / usage 도구가 " +
        "package.json 의 @nudge-design/react 또는 src/main.tsx 를 감지하면 자동으로 React 룰을 적용합니다.",
    },
    html: {
      keywords: HTML_KEYWORDS,
      action:
        "vanilla HTML / Web Component 워크플로우(react 없이 <nds-*> 직접 작성) 라면 " +
        "@nudge-design/html 패키지를 사용한다. .tsx 가 아니라 root index.html 을 직접 작성하고 " +
        "validate_html_mockup({ withStats: true }) 으로 검증(위반 + DS 채택률·통계 한 번에), " +
        "최종 산출물은 build_singlefile_html 로 dist/index.html (단일 파일) 만든다 — 디자이너/PM 에게 dnd 공유 가능. " +
        "get_setup({ step: 'full', intent: 'html' }) 로 Vite vanilla-ts 셋업, " +
        "get_guide({ topic: 'component:<Name>', target: 'html' }) 로 <nds-*> 예시를 가져와 작성.",
      tools: [
        "get_setup({ step: 'full', intent: 'html' })",
        "get_guide({ topic: 'component:<Name>', target: 'html' })",
        "validate_html_mockup({ filePath })",
        "validate_html_mockup({ filePath, withStats: true })",
        "build_singlefile_html({ cwd })",
      ],
    },
  },
  hardRule: "두 디자인시스템을 한 화면에서 혼용 금지.",
};

/* ──────────────────────────────────────────────────────────────────────
 * 백오피스(사내 어드민/CMS/운영툴) 컨벤션 — 브랜드 무관 전 서비스 기본 지원
 *
 * 출처: NudgeEAPCMS 코드베이스(Next.js + antd 5.5.1 + styled-components)에서
 * 추출한 공통 컨벤션. 서비스 고유 표기(푸터 카피 등)는 serviceName 파라미터로 주입.
 *   /src/styled/reset.css           (폰트 스택, body bg)
 *   /src/app/(primary)/layout.tsx   (Shell + content padding + footer)
 *   /src/layout/ScreenLocalNavigationBar.tsx (라이트 사이더 + 6px 브랜드 액센트)
 *   /src/layout/component/SideMenu.tsx       (메뉴 선택 시 right 6px 액센트)
 *   /src/layout/component/SideUserInfo.tsx   (사이드 INFO 블록)
 *   /src/layout/component/SideSetting.tsx    (사이드 SETTING 블록 + 로그아웃/정보수정)
 *   /src/layout/component/TinyHeader.tsx     (10px 200 #adadad 라벨)
 *   /src/components/header/HeaderSubject.tsx (페이지 제목 + Breadcrumb)
 *   /src/feature/partner/screens/ScreenPartnerManagement.tsx (목록 화면 패턴)
 *   /src/feature/partner/components/PartnerSearchForm.tsx    (검색 폼 패턴)
 *   /src/feature/membership/components/SearchMembershipInput.tsx (Select+Input.Search+초기화)
 *   /src/feature/partner/constant/partnerListColumns.tsx     (테이블 컬럼 컨벤션)
 * ────────────────────────────────────────────────────────────────────── */

export interface BackofficeGuide {
  scope: string;
  rationale: string;
  /** antd 가 아니라 DS 로 만드는 어드민 하드게이트 브랜드 안내 (캐포비/넛지EAP). */
  dsAdminException?: string;
  techStack: {
    required: string[];
    forbidden: string[];
    optional: string[];
  };
  layout: {
    body: { background: string; fontFamily: string };
    sider: Record<string, string>;
    sideUserInfo: string;
    sideMenu: Record<string, string>;
    sideSetting: string;
    content: Record<string, string>;
    footer: Record<string, string>;
  };
  pageHeader: {
    component: string;
    structure: string;
    style: Record<string, string>;
  };
  searchForm: {
    pattern: string;
    leftRow: string[];
    rightRow: string[];
    countLine: string;
  };
  table: Record<string, string>;
  tag: Record<string, string>;
  modal: Record<string, string>;
  colors: Record<string, string>;
  forbidden: string[];
  selfCheck: string[];
  example: string;
}

/** 구명 호환 — 'admin-cms' 시절 타입명. 신규 코드는 BackofficeGuide 를 사용. */
export type AdminCmsGuide = BackofficeGuide;

/**
 * 백오피스(사내 어드민) 가이드 본문 생성 — 브랜드 무관 전 서비스 기본 지원.
 * 레이아웃/검색폼/테이블 컨벤션은 NudgeEAPCMS 실코드에서 추출한 공통 패턴 그대로,
 * 서비스 고유 표기(푸터 카피)만 serviceName 으로 주입한다.
 */
export function buildBackofficeGuide(serviceName?: string): BackofficeGuide {
  const name = serviceName?.trim() || "<서비스명>";
  const footerCopy = `Copyright © ${name}. All Rights Reserved.`;
  return {
    scope:
      "백오피스(사내 어드민/CMS/운영툴) 화면. 사용자 앱이 아닌 운영자가 보는 사내 화면. " +
      "브랜드 무관 전 서비스 기본 지원 — 서비스 고유 표기는 serviceName 파라미터로 주입. " +
      "출처: NudgeEAPCMS (Next.js + antd 5.5.1 + styled-components) 실제 운영 코드에서 추출한 공통 컨벤션.",
    rationale:
      "Nudge DS는 B2C 멘탈케어 앱 화면을 위한 컴포넌트 셋이다. 백오피스는 정보 밀도 / 표 / 폼 / " +
      "필터 위주라 antd가 더 적합하고, 운영팀이 익숙한 시각 언어와도 일치한다.",
    dsAdminException:
      "어드민(외부 제공 b2b) 하드게이트 브랜드 — 캐포비(cashwalk-biz)·넛지EAP(nudge-eap) — 의 어드민은 " +
      "이 antd 컨벤션을 따르지 말 것. 이 브랜드들의 어드민은 DS(html 워크플로우)로 만든다 " +
      "(캐포비는 자체 admin 토큰/page-pattern, 넛지EAP 는 기존 DS 컴포넌트/토큰). " +
      "intent:'admin' + brand 를 넘기면 get_setup / CLAUDE.md / get_guide 가 자동으로 DS 경로로 우회한다.",
    techStack: {
      required: [
        "react ^18",
        "antd ^5 (NudgeEAPCMS 기준 5.5.1)",
        "@ant-design/icons ^5",
        "dayjs (locale: ko)",
      ],
      forbidden: [
        "@nudge-design/react — 사용자 앱 DS, 백오피스에서 절대 import 금지",
        "@nudge-design/tokens — 백오피스에서는 antd 기본 토큰 사용",
        "큰 그라디언트, 마케팅 히어로, 장식 배경",
      ],
      optional: ["styled-components (CMS 본 레포 컨벤션)", "react-router-dom (Vite 단독일 때)"],
    },
    layout: {
      body: {
        background: "#f4f4f4",
        fontFamily:
          "Mulish, Gothic_A1, -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', helvetica, 'Apple SD Gothic Neo', sans-serif",
      },
      sider: {
        width: "240px (SIDEBAR_WIDTH 상수)",
        theme: 'antd Sider theme="light"',
        background: "#ffffff",
        position: "fixed (좌측 0, top 0, height 100vh)",
        borderRight: "1px solid #ececec",
        zIndex: "10",
        topAccent:
          "상단 6px 브랜드 컬러 라인 (border-top: 6px solid var(--semantic-border-brand-default))",
      },
      sideUserInfo:
        "Sider 상단 24px padding 영역에 [로고/h1] + TinyHeader('INFO') + 이메일(12px #333) + " +
        "antd Tag(이름, borderRadius 3) + '권한:' + TagAdminRole(60px width center).",
      sideMenu: {
        header: "TinyHeader('CMS MENU', padding '0 24px')",
        menu: '<Menu theme="light" mode="inline" inlineIndent={22} items={...} selectedKeys={[현재경로]} />',
        selectedItem: "border-right: 6px solid var(--color-main); color: #000;",
        submenuSelected: "color: #000; font-weight: 600;",
        itemColors: "기본 #383838 / hover #000 / disabled 회색 (실제 권한 매트릭스에 따라 필터링)",
      },
      sideSetting:
        "Sider 하단에 별도 section. TinyHeader('SETTING', padding '0') + " +
        "두 개의 antd Button (LogoutOutlined '로그아웃', UserOutlined '정보수정' disabled). " +
        "버튼 높이 35px, font-size 12px, 두 버튼 width 48.5%씩.",
      content: {
        marginLeft: "240px",
        padding: "40px 60px 200px",
        width: "100%",
        maxWidth: "고정 max-width 없음 — 전체 폭 사용",
      },
      footer: {
        placement: "content 아래 70px margin-top",
        text: footerCopy,
        style:
          "text-align center / padding 13px 0 / border-top 1px solid #ececec / color #b1b1b1 / font-weight 100 / font-size 12px / letter-spacing 0.2px",
      },
    },
    pageHeader: {
      component: "components/header/HeaderSubject (Breadcrumb + h1 + desc)",
      structure:
        '<HeaderSubject subject="고객사 관리" desc="..." navigationItems={[{title:"Partner"},{title:"Partner Management",href:"/partner/list"}]} />',
      style: {
        wrapper: "border-bottom: 1px solid #e4e4e4; padding: 0 0 25px; margin: 0 0 25px;",
        breadcrumb:
          '<Breadcrumb items={...} separator=">" />, font-size 11px, color #727272, link color #000',
        title:
          "h1: font-size 22px / weight 700 / color #383838 / margin-bottom 12px / text-transform capitalize",
        desc: "font-size 12px / color #6b6a6a / padding-left 3px / text-transform capitalize",
      },
    },
    searchForm: {
      pattern:
        "antd Form 안에 Select(검색 기준) + Input.Search(enterButton='검색') + Button(초기화). " +
        "필터(Segmented / Select 등)와 액션(생성/내보내기)은 우측 정렬. 그 아래 한 줄에 '검색된 개수: N'.",
      leftRow: [
        "<Form.Item name='searchBy'><Select style={{width:100}} options={[{value:'TITLE',label:'멤버십명'},{value:'ID',label:'멤버십 ID'}]} /></Form.Item>",
        "<Form.Item name='keyword'><Input.Search placeholder='검색어를 입력해주세요' enterButton='검색' onSearch={handleSearch} /></Form.Item>",
        "<Button htmlType='button' onClick={handleReset}>초기화</Button>",
      ],
      rightRow: [
        "추가 필터 (Segmented '전체/진행중/대기/종료 포함', 고객사 Select 등)",
        "주요 액션 버튼 (생성, CSV 내보내기 등)",
      ],
      countLine:
        "<div className='cms-search-form__count'>검색된 개수: {count}</div> — font-size 12, color #6b6a6a",
    },
    table: {
      base: '<Table size="middle" rowKey="id" />',
      pagination:
        'pagination={{ defaultPageSize: 20, position: ["bottomCenter"], showSizeChanger: false, size: "default", total }}',
      columns:
        "거의 모든 컬럼에 align:'center'. 행 정보 가독성보다 컬럼 헤더와 셀 정렬을 일관되게 유지하는 게 우선.",
      clickableCell:
        "ID/이름/숫자 등 클릭 가능한 셀은 <Button type='link'>{value}</Button>으로 감싼다. 굵은 텍스트로 대체 X.",
      rowHeight: "size='middle' 기본 (~48px). 직접 px 지정 금지.",
      headerStyle:
        "antd 기본값 유지. headerBg #fafafa, headerColor #727272 정도까지만 ConfigProvider로 조정.",
    },
    tag: {
      statusTagWidth:
        "상태/권한 같은 enum Tag는 width: 60px; text-align: center; (TagAdminRole 컨벤션)",
      statusColors:
        "active=green, pending=gold, ended=default(grey), warning=orange, error=red. 운영자 권한별 색은 admin red / volcano / green / gold / lime / purple / cyan / blue.",
    },
    modal: {
      invocation: "Modal.useModal() 또는 <Modal open={...} />. centered + destroyOnClose 권장.",
      formLayout:
        'Form layout="vertical" 기본. 라벨 좌측 정렬이 필요하면 labelAlign="left" labelCol={{flex:"120px"}} colon={false}.',
      footer:
        "antd 기본 footer (확인/취소) 또는 우측 그룹 액션 정렬. 좌측엔 파괴 액션(종료처리, 삭제) 분리.",
    },
    colors: {
      "--color-main":
        "var(--semantic-border-brand-default) — 사이드바 톱 액센트 / 메뉴 선택 우측 보더 / 링크",
      text: "#383838 (제목) / #727272 (보조) / #aaa (subtle) / #b1b1b1 (footer)",
      border: "#ececec (light) / #e4e4e4 (HeaderSubject 하단)",
      bg: "#f4f4f4 (body) / #fafafa (hover/header) / #ffffff (sider, content surface)",
      note: "백오피스에서는 Nudge DS 토큰을 import하지 말 것. 위 색상을 인라인 또는 styled-components로 직접 지정.",
    },
    forbidden: [
      "@nudge-design/react / @nudge-design/tokens / @nudge-design/icons import (백오피스 화면에서)",
      "큰 히어로 카드, 마케팅 톤, 그라디언트 배경",
      "antd Table 위에 별도 Card wrapper로 그림자+패딩 추가 (CMS는 본문에 직접 노출)",
      "Tab를 페이지 단위로 남발 (CMS는 페이지 단위 Tab 거의 사용 안 함)",
    ],
    selfCheck: [
      "antd에서 import 했는가 (직접 button/input/select 만들지 않았는가)",
      "@nudge-design/* 패키지를 어드민 화면에서 import 하지 않았는가",
      "사이드바에 라이트 240px + 6px 톱 액센트 + INFO + CMS MENU + SETTING 블록이 있는가",
      `본문 padding 40 60 200, body #f4f4f4, footer '${footerCopy}' 있는가`,
      "HeaderSubject(Breadcrumb separator='>', h1 22/700, desc 12)로 페이지 헤더를 구성했는가",
      "검색 폼이 [Select + Input.Search + 초기화] 패턴인가, 검색된 개수 N이 노출되는가",
      "Table 컬럼이 align:center 일관 + pagination position bottomCenter인가",
      "클릭 가능한 셀이 <Button type='link'>인가",
      "tsc --noEmit 통과하는가",
    ],
    example: `// pages/MembershipDetail.tsx (요약)
import { Layout, Menu, Breadcrumb, Tag, Table, Form, Select, Input, Button, Segmented } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";

// AdminLayout = <Sider light 240px + 6px top + INFO + CMS MENU + SETTING>
//             + <Content padding="40 60 200">{children}</Content> + Footer

<AdminLayout>
  <HeaderSubject
    subject="멤버십 관리"
    desc="고객사 멤버십을 관리합니다."
    navigationItems={[{ title: "Membership" }, { title: "List", href: "/membership/list" }]}
  />
  <Form form={form} className="cms-search-form" initialValues={{ searchBy: "TITLE", keyword: "" }}>
    <Form.Item name="searchBy"><Select style={{ width: 100 }} options={...} /></Form.Item>
    <Form.Item name="keyword"><Input.Search enterButton="검색" onSearch={handleSearch} /></Form.Item>
    <Button onClick={handleReset}>초기화</Button>
  </Form>
  <div className="cms-search-form__count">검색된 개수: {count}</div>
  <Table
    size="middle"
    rowKey="id"
    columns={[
      { title: "ID", dataIndex: "id", align: "center", width: 100 },
      { title: "이름", dataIndex: "name", align: "center",
        render: (v, r) => <Button type="link">{v}</Button> },
      { title: "상태", dataIndex: "status", align: "center", width: 100,
        render: v => <Tag color={...} className="tag-fixed">{label}</Tag> },
    ]}
    dataSource={list}
    pagination={{ defaultPageSize: 20, position: ["bottomCenter"], showSizeChanger: false }}
  />
</AdminLayout>`,
  };
}

/**
 * 구명 호환 — serviceName 미주입 기본형(푸터 카피는 <서비스명> 플레이스홀더).
 * 신규 코드는 buildBackofficeGuide(serviceName) 를 사용할 것.
 */
export const ADMIN_CMS_GUIDE: BackofficeGuide = buildBackofficeGuide();
export const BACKOFFICE_GUIDE: BackofficeGuide = ADMIN_CMS_GUIDE;

/* ───────────── 컴포넌트/패턴 가이드 본문 — SSOT 는 guides-src/**.md ─────────────
 * 본문 수정: packages/mcp/guides-src/{components|patterns}/<Name>.md
 * 재생성:   pnpm --filter @nudge-design/mcp build:guides → src/guides.generated.ts
 * (check-ssot 의 build-guides --check 가 stale/스키마를 게이트한다.)
 */
export type { ComponentGuide, PatternGuide } from "./guide-types.js";
export { COMPONENT_GUIDES, PATTERN_GUIDES } from "./guides.generated.js";

/* ───────────── 디자인 원칙 (DESIGN.md 발췌 + 큐레이션) ───────────── */

export interface DesignPrinciples {
  brandTone: string;
  colors: Record<string, string>;
  typography: { family: string; weights: string[]; rules: string[] };
  spacing: { base: number; scale: number[]; rules: string[] };
  elevation: { rule: string; stack: Record<string, string> };
  shapes: Record<string, string>;
  dos: string[];
  donts: string[];
  bannedPatterns: { name: string; rule: string }[];
}

export const DESIGN_PRINCIPLES: DesignPrinciples = {
  brandTone:
    "낮은 진입 장벽과 전문적 신뢰감을 주되, 흔한 SaaS/헬스케어 클리셰처럼 보이면 안 됩니다. Linear/Notion식 회색 카드 그리드, 스톡사진+파스텔 그라데이션, 모든 카드에 아이콘을 꽂는 대시보드 톤, 과한 감성 카피/일러스트 장식은 금지. Neutral surface와 텍스트 위계를 기본으로 두고 primary blue는 대표 CTA와 핵심 인터랙션에만 제한합니다.",
  colors: {
    primary:
      "var(--semantic-bg-brand-default) — CTA, 활성, 핵심 인터랙티브. 화면당 가장 중요한 1개 액션만.",
    secondary: "#ED2E77 — 마젠타 포인트. 프로모션, 감정 표현, 보조 강조.",
    error: "#F13F00 — 유효성 오류, 파괴적 액션.",
    caution: "#FFC303 — 주의 알림. 텍스트는 #FFA100.",
    success: "#13BFA2 — 완료, 긍정 피드백.",
    surface: "#FFFFFF — 페이지/카드 배경.",
    onSurface: "#383838 — 본문 텍스트, 아이콘.",
  },
  typography: {
    family: "Pretendard (한/영 모두)",
    weights: ["Regular(400)", "Medium(500)", "Semibold(600)", "Bold(700)"],
    rules: [
      "Display/Headlines: Bold(700), 18-52px",
      "Body: Medium~Regular, 14-16px",
      "Caption: Regular, 11-13px",
      "한 화면에 2-3개 웨이트만 사용 (3개 이상 혼용 금지)",
    ],
  },
  spacing: {
    base: 4,
    scale: [4, 8, 10, 12, 16, 20, 24],
    rules: [
      "4pt grid 기반. Gap(요소 간 거리)과 Inset(컨테이너 내부 여백)을 명확히 구분한다.",
      "Gap 은 의도 기반 시멘틱 토큰만 사용: --semantic-gap-tight(4) / --semantic-gap-default(10, 표준) / --semantic-gap-comfortable(12) / --semantic-gap-loose(16) / --semantic-gap-wide(24).",
      "헤딩 ↔ 서브타이틀 간격은 level 기반 토큰 사용: --semantic-gap-title-h1(12) / -h2(12) / -h3(12) / -h4(6, ★ 카드 헤딩) / -h5(8, ★ 서브 헤딩). 임의 margin/spacing 직접 지정 금지.",
      "Inset 은 사용처 기반 시멘틱 토큰만 사용: --semantic-inset-chip(8) / --semantic-inset-input(12) / --semantic-inset-card(16, 표준) / --semantic-inset-card-large(20) / --semantic-inset-modal(24).",
      "임의 px (5/7/9/11/13/15) 사용 금지. Primitive(--spacing-N) 직접 사용 금지 — 반드시 semantic 토큰 거치기.",
      "AppBar 52px / BottomBar 56px",
      "Mobile 좌우 마진 16px / Desktop 콘텐츠 1200px center",
      "자세한 매핑·결정 트리는 get_guide({ topic: 'pattern:semantic-spacing' }) 참고.",
    ],
  },
  elevation: {
    rule: "최소한의 그림자. 계층은 배경색/보더로 구분. 그림자와 보더 동시 적용 금지(이중 계층).",
    stack: {
      sm: "0 1px 3px rgba(0,0,0,0.1) — 카드, 드롭다운",
      md: "0 4px 12px rgba(0,0,0,0.15) — Modal",
      lg: "0 11px 15px -7px rgba(0,0,0,0.2) — Popup",
      up: "0 -4px 12px rgba(0,0,0,0.1) — BottomSheet",
    },
  },
  shapes: {
    sm: "4px — 작은 요소, 인풋 내부 장식",
    md: "8px — 버튼/인풋/모달 등 대부분 기본값",
    lg: "12px — 카드, 바텀시트",
    pill: "9999px — 칩, 토글",
  },
  dos: [
    "★ 선언된 표면(surface: admin/service)이 화면 이름 통념을 지배한다 — 작업 시작 시 표면부터 확정하고 모든 레이아웃을 거기 맞춘다. surface=admin 이면 '회원가입/로그인/온보딩'처럼 소비자 플로우를 연상시켜도 어드민 화면(admin-shell 사이드바+톱바, 또는 어드민 온보딩 중앙 카드)으로 만든다. 표면의 SSOT 는 brief/CLAUDE.md 선언 + nudge.surface 마커 — 화면 제목으로 추측하지 말 것.",
    "Primary 색상은 화면당 가장 중요한 1개 액션에만 사용",
    "강조 장치는 화면당 우선순위가 가장 높은 영역에 집중하고, 안내/보조 영역은 기본적으로 neutral surface를 사용",
    "텍스트 대비비 WCAG AA (4.5:1) 이상 유지",
    "터치 타겟은 최소 44px 보장",
    "★ 모든 목업은 반응형으로 — 고정폭 1개 화면으로 끝내지 말 것. 레이아웃은 고정 px 폭이 아니라 유연 컨테이너(max-width + 좌우 패딩, flex/grid + wrap, min-width:0)로 짜고, 좁은 화면(모바일 ~360, 태블릿 ~768)에서 가로 스크롤·요소 깨짐·겹침이 없어야 한다. 콘텐츠 폭은 Desktop center 1200 / Mobile 좌우 16. DataTable 은 responsive='cards', 컴포넌트의 size 분기(예: Tab size mobile/pc, BrandFooter layout desktop/mobile)는 미디어쿼리/JS 로 전환. 입력 필드는 Field Width 6단계(고정 px) 안에서 반응형 컨테이너만 Full 100%.",
    "4pt 그리드에 맞춰 간격 설정. Gap(요소 간)과 Inset(컨테이너 내부)을 구분해 항상 semantic 토큰(--semantic-gap-* / --semantic-inset-*) 사용",
    "Brand background(--semantic-bg-brand-*)는 주의/안내/하이라이트 의미 전달이 필요할 때만, 한 화면당 1개 이내로 사용 — 자세히는 get_guide({ topic: 'pattern:surface-layer' })",
    "인터랙티브 요소(Button/IconButton/Card.Root clickable/Tab)에는 onClick 등 핸들러를 반드시 부착",
    "표준 variant에 없는 톤이 필요하면 컴포넌트의 style/icon 같은 확장 슬롯을 활용 (raw 요소로 대체 금지)",
    "단독 아이콘은 주변 텍스트/배경과 어울리는 토큰 컬러를 명시하거나 부모 color를 토큰으로 지정해 currentColor가 의도한 색을 상속하게 함",
    "아이콘은 행동/상태/affordance 전달 목적에만 사용 — 화이트리스트와 검증 룰은 get_guide({ topic: 'pattern:icon-usage' })",
    "아이콘 선택 필수 우선순위: 1) 현재 브랜드 전용 아이콘(예: Geniet*/Trost*) 2) NudgeEAP 기본 브랜드 아이콘 3) 목업용 기본 아이콘 패키지(MockupLinear*/MockupBold*) 4) 자체 생성 SVG. 이 순서를 건너뛰지 말 것.",
    "Tab 은 동일 depth 콘텐츠 전환·category navigation·section switching 에만 사용 — 필터/CTA/라우팅 대체용 금지",
    "Modal 은 즉각적 판단/응답이 필요할 때만 사용 — 단순 정보는 inline Notice/Banner, 에러는 Toast/inline error 사용",
    "Badge 는 보조 정보 — 일반 카테고리는 ghost/line + neutral 우선, Brand color 는 '현재 선택·핵심 강조' 에만",
    "브랜드 모드(brand='geniet'/'trost' 등)에서 작업할 때, 해당 브랜드 prefix 의 아이콘(예: `GenietRecordIcon`, `GenietGpointIcon`)이 존재하면 공용 아이콘보다 **우선 사용**. find_icon 결과에 brand prefix 가 보이면 그 브랜드 모드에서는 그 쪽이 정답. 브랜드별 아이콘 수와 검색 힌트는 get_brand({ brand: '<slug>' }).detail.brandIconCount / brandIconLookup 으로 확인하고, 실제 후보는 find_icon({ query: '<BrandPrefix>' }) 로 조회.",
    "브랜드 전용 아이콘이 없으면 NudgeEAP 기본 아이콘(`HomeIcon`, `SearchIcon` 등)을 먼저 찾고, 그 다음에만 목업용 기본 아이콘(`MockupLinear*Icon`, `MockupBold*Icon`)을 사용. 자체 생성 SVG는 마지막 수단.",
    "브랜드 분기는 공통 컴포넌트 구현이 아니라 **브랜드 전용 화면/스토리** 에서 처리 — 브랜드 화면이 명시적으로 `Geniet*Icon` 을 import 해 컴포넌트의 icon prop 으로 전달. (예: `<Footer.TabBar tabs={[{ icon: <GenietRecordIcon /> }]} />`)",
    "★ 패턴(pattern:*)을 조립할 때 **각 조각(잎)은 반드시 실재하는 nds-* 컴포넌트로** 그린다 — 셀렉션/피커 모달처럼 여러 컴포넌트의 조립을 단일 컴포넌트로 안 빼고 패턴으로 두는 건 정상이지만, 그 잎(Modal·CheckboxTree·SelectedItemsPanel·SelectedItemRow·Button 등)은 전부 nds-* 여야 한다. 대응 nds-* 가 없어 raw `<div role=…>`·`<div onclick>` 로 잎을 흉내내면 **재발명(avoidable-reinvention)** 으로 검증/점수에서 깎인다. 점수(NDS%)는 '패턴이 한 개의 nds 태그인가'가 아니라 **잎 nds 컴포넌트 수**로 매겨지므로(레이아웃 div 는 분모 제외) 조립 자체는 감점이 아니다. 빠진 잎이 있으면 패턴을 컴포넌트로 감싸지 말고 **그 잎 컴포넌트를 DS 에 신설**(/ds-component)하는 것이 해법.",
  ],
  donts: [
    "표면=admin 화면에 소비자 brand chrome(<nds-brand-header> / <nds-brand-footer> / <nds-brand-bottom-nav>) 사용 금지 — 어드민은 admin-shell(사이드바+톱바) 또는 어드민 온보딩 카드. '회원가입/로그인'이라는 화면 이름으로 소비자 플로우를 추측하지 마세요. build_singlefile_html / validate_html_mockup 의 admin-surface-consumer-chrome 룰(error)로 자동 차단됨.",
    "한 화면에 3개 이상의 폰트 웨이트를 혼용하지 마세요",
    "둥근 코너와 각진 코너를 같은 뷰에서 섞지 마세요",
    "그림자와 보더를 동시에 적용하여 이중 계층을 만들지 마세요",
    "그라데이션 배경 사용 금지 — 단색 토큰만",
    "Card 슬롯(Header/Body/Footer)에 외곽 padding 추가 금지 — 자체 padding과 충돌",
    "Button color='neutral' + variant='solid' 조합을 활성 CTA로 사용 금지 (비활성처럼 보임)",
    "색 배경 + 아이콘 + Chip/Badge + 굵은 제목/그라데이션을 한 안내 영역에 동시에 넣지 마세요",
    "다른 페이지로 이동하는 CTA마다 우측 화살표를 반복하지 마세요",
    "Chip/Badge를 새 섹션 장식이나 일반 안내문 강조 용도로 남발하지 마세요",
    "단독 아이콘을 기본 currentColor 그대로 방치하지 마세요 — 검정/본문색 아이콘이 주변 UI 톤과 어긋날 수 있음",
    "연한 primary 배경 위에 연한 primary filled tag/box를 반복하지 마세요 — 같은 톤 위 같은 톤 강조는 위계를 만들지 못함",
    "로고의 gradient/accent 컬러를 UI 배경/태그/CTA 컬러처럼 사용하지 마세요 — 로고 표현과 UI 시스템 컬러는 분리",
    "DS 컴포넌트에 정확히 매칭되는 쓰임이 있는데 raw <button>/<input>/<span>으로 대체 금지",
    "이모지 절대 사용 금지 — 어떤 위치에서도(라벨/버튼/제목/placeholder/empty state) 이모지를 텍스트로 박지 마세요. 아이콘이 필요하면 find_icon. validate_mockup 의 emoji-banned 룰로 자동 검출됨.",
    "→ ← ✓ ★ • 같은 텍스트 기호 사용 금지 — 화살표/체크/별점/불릿을 문자로 표현하지 마세요. 아이콘은 find_icon, 진행/별점/리스트는 DS 컴포넌트(Timeline/Stepper/Rating/Dense list) 사용. validate_mockup 의 text-symbol-banned 룰로 자동 검출됨.",
    "Primitive spacing(--spacing-N) / 임의 px (5/7/9/11/13/15) 사용 금지 — 반드시 --semantic-gap-* / --semantic-inset-* semantic 토큰으로 표현",
    "Inset(내부 여백) 자리에 Gap 토큰 사용 금지 (또는 그 반대) — padding 자리에 --semantic-gap-*, gap 자리에 --semantic-inset-* 쓰지 않기",
    "Brand background 를 단순 시각 구분·decorative section·KPI 카드·summary 카드 배경으로 사용 금지 — 의미 전달 없는 색 배경은 위계를 망가뜨림",
    "한 화면 안에서 카드마다 다른 pastel background 를 사용해 영역을 색으로 구분하지 마세요 — 구분은 spacing/border/text 위계로",
    "서브타이틀(h3/h4) 앞 장식 아이콘 · Form Label 앞 장식 아이콘 · 본문 텍스트 앞 decorative icon 금지 — 한 화면에서 일부 헤딩에만 아이콘을 붙이면 hierarchy 가 깨짐",
    "헤딩 앞 아이콘 5개 이상 사용 시 자동 위반 — 아이콘을 hierarchy 표현 수단으로 쓰지 마세요",
    "Tab 을 CTA처럼 사용 금지 — '저장/신청/다음 단계' 등 액션은 Button 사용. Tab 은 동일 depth 콘텐츠 전환 전용",
    "세그먼트형 단일 값 선택은 Tab variant='segment' 사용. line/chip 은 패널 전환 전용",
    "단순 정보 전달용으로 Modal 사용 금지 — inline Notice / Banner / section 안내 우선. Modal 은 즉각적 판단/응답이 필요할 때만",
    "Modal 내부에 또 다른 강조(Card·Brand BG·Chip 그룹)를 쌓지 마세요 — 핵심 action 1 + 보조 action 1 구조가 기본",
    "Fill Badge 를 한 카드/Row 안에 2개 이상 두지 마세요 — 일반 카테고리는 ghost/line 우선, Fill 은 카드당 최대 1개",
    // ── Card Everything Syndrome ──
    "모든 영역을 카드로 감싸지 마세요 — 카드는 '독립된 정보 단위' 일 때만. 단순 group/section 은 spacing + h3 + Divider 로 위계를 만드세요",
    "카드 안에 카드를 중첩하지 마세요 — 카드 안에는 Header/Body/Footer 슬롯과 Chip/Badge 같은 inline 요소만. 내부 영역 강조가 필요하면 surface.section bg 한 단계로",
    "카드를 hierarchy 구분 도구로 남용하지 마세요 — 위계는 typography(headline/body/caption) 와 spacing 으로 표현. '카드 = 강조' 는 안티패턴",
    // ── Floating UI Everywhere ──
    "떠 있지 않아야 할 요소(인라인 리스트·일반 카드·기본 입력 필드)에 elevation/shadow 를 적용하지 마세요 — shadow 는 floating UI(Modal/Popup/Dropdown/BottomSheet)에만",
    "한 화면에 floating panel(Modal/Drawer/Popup/Toast) 을 2개 이상 동시에 띄우지 마세요 — 사용자 주의 분산",
    "shadow-heavy layout 금지 — 한 화면에 그림자 있는 요소가 3개를 넘으면 floating 의미를 잃습니다. Border 또는 surface tone 으로 대체",
    "detached card(공중에 떠 있는 카드) 를 의미 없이 만들지 마세요 — 카드는 페이지 흐름 안에 자연스럽게 위치",
    // ── Typography Chaos ──
    "Bold 를 한 화면에서 5곳 이상 남발하지 마세요 — Bold 는 '가장 중요한 1-2 곳' 에만",
    "같은 화면에 h1 / h2 같은 큰 제목을 2개 이상 두지 마세요 — 한 화면당 최상위 헤딩은 1개. 보조 섹션은 h3 이하",
    "hierarchy 가 불명확한 텍스트 위계를 만들지 마세요 — 인접한 두 영역의 텍스트가 같은 fontSize × fontWeight 이면 위계가 무너짐",
    // ── Decorative Surface Abuse ──
    "section 구분을 색상만으로 해결하지 마세요 — 1차는 spacing(--semantic-gap-loose/wide), 2차는 Divider/Border, 마지막에 surface tone. 색으로만 나누면 색맹/저시력 사용자가 길을 잃습니다",
    "decorative background(임의 pastel/tinted surface)를 만들지 마세요 — 모든 bg 는 `--semantic-bg-*` 토큰 안에서. 분위기를 위해 옅은 색을 깔지 마세요",
    // ── Fake Dashboard Disease ──
    "의미 없는 KPI 카드/메트릭 그리드를 만들지 마세요 — 숫자 표시는 사용자가 의사결정에 쓸 때만",
    "장식용 chart/graph 를 추가하지 마세요 — 데이터가 실제 인사이트를 주지 않으면 Sparkline 한 줄로 충분. Generic SaaS dashboard 톤 피하세요",
    "장식 중심 hero section(큰 일러스트 + 큰 카피 + gradient 배경)을 만들지 마세요 — EAP 도메인은 사용자 상태/액션을 직접 보여주는 것이 우선",
    // ── Everything Has an Icon ──
    "한 화면에 여러 icon 스타일(선/면/colorful)을 혼용하지 마세요 — `@nudge-design/icons` 단일 셋만",
    "colorful/멀티컬러 아이콘을 본문 UI 에 과다 사용하지 마세요 — DS icon 은 currentColor monochrome 이 원칙. brand color icon 은 진입점 1-2 개에만",
    // ── Spacing Randomness 보강 ──
    "같은 depth(부모 컨테이너 안의 형제 요소들) 에 서로 다른 spacing 을 적용하지 마세요 — 형제는 같은 --semantic-gap-* 으로 통일",
    // ── Brand Icon ──
    "공통 컴포넌트(Footer/BottomNav/Header 등) 의 *구현* 안에 brand 분기 로직(`if (brand === 'geniet') return <GenietRecordIcon />`)을 넣지 마세요 — DS 컴포넌트는 brand-agnostic 으로 유지. 분기는 사용처(브랜드 전용 화면)에서 명시적 icon prop 으로 표현.",
    "브랜드 모드인데 공용 아이콘(`HomeIcon`/`CouponIcon` 등) 을 그대로 쓰지 마세요 — 같은 의미의 brand prefix 아이콘이 있으면 그게 우선. get_brand({ brand: '<slug>' }).detail.brandIconLookup 또는 find_icon({ query: '<BrandPrefix>' }) 로 매칭 확인.",
    "NudgeEAP 기본 아이콘이나 MockupLinear*/MockupBold* 아이콘을 확인하지 않고 인라인 SVG/직접 생성 아이콘으로 넘어가지 마세요 — 자체 생성은 마지막 수단.",
  ],
  bannedPatterns: [
    {
      name: "gradient-background",
      rule: "linear-gradient / radial-gradient / conic-gradient — 사용 금지",
    },
    {
      name: "entry-bottomsheet",
      rule: "화면 진입 직후 BottomSheet/Modal 자동 노출 금지 — 알림 동의·프로모션 포함. 진입 시점에는 사용자가 의도한 화면을 먼저 보여주세요.",
    },
    {
      name: "back-press-interrupt",
      rule: "뒤로가기/닫기 직후 인터럽트(BottomSheet/Modal) 노출 금지 — 이탈을 막기 위해 의도된 추가 동의/광고/만류 다이얼로그는 다크패턴입니다.",
    },
    {
      name: "no-decline-cta",
      rule: "거절 불가 CTA 구조 금지 — '확인' 1개만 있고 닫기/취소/나중에 옵션이 없는 다이얼로그/풀스크린 카드. 비파괴 옵션 최소 1개를 보장하세요.",
    },
    {
      name: "mid-flow-interstitial",
      rule: "플로우 중간 예상 못한 전면 모달/광고 금지 — 사용자가 메뉴/액션을 눌렀을 때 그 결과 대신 다른 콘텐츠(광고/프로모션/추가 동의)가 먼저 노출되면 안 됩니다.",
    },
    {
      name: "ambiguous-cta-label",
      rule: "CTA 라벨 모호성 금지 — 버튼만 보고 다음 화면/행동을 예측할 수 있어야 합니다. 위 카피의 가치 제안을 그대로 반복한 버튼('지금 시작'·'확인' 등)은 결과를 숨겨 사용자가 클릭을 망설입니다.",
    },
    {
      name: "card-everything",
      rule: "Card Everything Syndrome 금지 — 모든 정보 단위를 카드로 감싸면 위계가 사라집니다. 한 화면에 카드가 5개를 넘으면 80% 이상 안티패턴. 단순 group/section 은 spacing + Divider + heading 으로 표현.",
    },
    {
      name: "nested-card",
      rule: "카드 안 카드 중첩 금지 — 카드 내부 영역 강조는 surface.section tone 한 단계 또는 inline Chip/Badge 로. nested Card 는 위계 표현 도구가 아닙니다.",
    },
    {
      name: "decorative-shadow",
      rule: "떠 있지 않아야 할 요소(인라인 리스트·일반 카드·기본 입력)에 shadow 적용 금지. Shadow 는 floating UI (Modal/Popup/Dropdown/BottomSheet) 와 'hover 시 floating 표현' 에만.",
    },
    {
      name: "fake-dashboard",
      rule: "Fake Dashboard 금지 — 의미 없는 KPI 카드/장식용 chart/장식 hero. EAP 도메인은 사용자 상태/액션 위주. Generic SaaS dashboard 패턴 회피.",
    },
    {
      name: "section-color-only",
      rule: "section 구분을 색상으로만 해결 금지 — 1차 spacing → 2차 Divider/Border → 3차 surface tone. 색맹/저시력 접근성을 위해 색 단독 구분은 불가.",
    },
    {
      name: "repeated-h1",
      rule: "한 화면에 h1/h2 같은 최상위 헤딩 2개 이상 금지 — 페이지 제목은 1개. 보조 섹션은 h3 이하.",
    },
    {
      name: "bold-overuse",
      rule: "한 화면에 Bold 텍스트 5곳 이상 사용 금지 — Bold 는 화면당 1-2개 핵심에만. 본문은 Regular/Medium.",
    },
    {
      name: "mixed-icon-style",
      rule: "한 화면에 여러 icon 스타일(선/면/colorful) 혼용 금지 — `@nudge-design/icons` 단일 셋만. 외부 콜렉션·이모지·multi-color SVG 섞지 마세요.",
    },
  ],
};

/* ───────────── UX 라이팅 가이드 (UX Writing 가이드 + EAP 도메인) ─────────────
 *
 * 모든 사용자 노출 텍스트에 적용되는 보이스톤·문장 규칙.
 * EAP 멘탈케어 도메인은 위기·자해·진단 표현에 추가 룰이 필요해 별도 섹션으로 분리한다.
 */

export interface UxWritingGuide {
  voiceTone: string;
  principles: {
    name: string;
    summary: string;
    do: string[];
    dont: string[];
  }[];
  microcopy: { context: string; rule: string; example?: string }[];
  eapDomain: string[];
}

export const UX_WRITING_GUIDE: UxWritingGuide = {
  voiceTone:
    "낮은 진입 장벽 + 전문적 신뢰감. 친근하지만 단정·당당하게. 캐주얼 경어(해요체)를 기본으로 사용하고 과도한 격식(`~시겠어요?`, `~께`)이나 광고 톤(`바로!`, `놓치지 마세요`)은 피한다. 멘탈케어 도메인 특성상 사용자 평가 어휘와 의료 단정 표현은 별도 룰을 따른다.",
  principles: [
    {
      name: "해요체",
      summary: "상황·맥락 무관 모든 문구에 해요체를 적용한다. 합니다체·반말 금지.",
      do: ["저장했어요", "확인했어요", "다시 시도해 주세요"],
      dont: ["저장되었습니다", "확인", "다시 시도하세요"],
    },
    {
      name: "능동형 말하기",
      summary: "수동형보다 능동형. '~되었습니다'/'~었어요' 보다 '~했어요'. 동사를 바꿔 능동으로.",
      do: ["저장했어요", "이미 신청했어요", "사용 중이에요"],
      dont: ["저장됐어요", "신청이 완료되었어요", "사용되고 있어요"],
    },
    {
      name: "긍정형 말하기",
      summary:
        "부정 표현을 줄이고 긍정형으로. '~ 없어요/안 돼요' 대신 '~하면 할 수 있어요'. 에러도 다음에 무엇을 할 수 있는지 알린다.",
      do: ["다시 시도해 주세요", "조건을 충족하면 받을 수 있어요"],
      dont: ["사용할 수 없어요", "혜택을 받을 수 없어요"],
    },
    {
      name: "캐주얼한 경어",
      summary: "'~시', '계시다', '여쭈다', '~께' 같은 과도한 경어 사용 금지.",
      do: ["연락처를 알려주세요", "이름을 입력해 주세요", "친구에게 보낼래요?"],
      dont: ["연락처를 여쭤봐도 될까요?", "성함을 입력해주시겠어요?", "친구께 보내시겠어요?"],
    },
    {
      name: "{명사}+{명사} 풀어쓰기",
      summary: "한자어 명사 연속은 동사 형태로 풀어 캐주얼하게 표현한다.",
      do: ["입력을 완료했어요", "결제가 끝났어요"],
      dont: ["입력 완료", "결제 완료"],
    },
  ],
  microcopy: [
    {
      context: "다이얼로그 왼쪽 버튼 (취소 자리)",
      rule: "다이얼로그/모달 왼쪽 버튼 라벨은 항상 **닫기**. '취소'는 작업이 취소된다고 오해될 수 있어 사용 금지.",
      example: "[닫기] [확인]   ← Good     /     [취소] [확인]   ← Bad",
    },
    {
      context: "에러 메시지",
      rule: "원인 + 다음 행동을 한 문장에. 사용자 탓으로 들리는 표현(`잘못된 입력입니다`) 금지.",
      example: "비밀번호가 일치하지 않아요. 다시 입력해 주세요.",
    },
    {
      context: "혜택 미충족 안내",
      rule: "'~할 수 없어요' 대신 충족 조건을 긍정형으로 안내한다. 사용자가 서비스 전체를 못 쓴다고 오해하지 않도록.",
      example: "20대만 받을 수 있는 혜택이에요.   ← Good     /     혜택을 받을 수 없어요   ← Bad",
    },
    {
      context: "CTA 라벨",
      rule: "버튼 라벨만 보고 다음 화면/행동을 예측할 수 있어야 한다. 위 카피의 가치 제안을 그대로 반복하지 않는다. 버튼 위 보조 설명이 라벨과 중복되지 않도록.",
      example: "[상담사 보기] [신청하기]   ← Good     /     [지금 시작하기] [확인]   ← Bad",
    },
    {
      context: "Empty state",
      rule: "비어 있다는 사실보다 다음에 할 수 있는 행동을 노출한다.",
      example: "아직 작성한 일기가 없어요. 오늘의 감정을 기록해 보세요.",
    },
  ],
  eapDomain: [
    "위기·자해·자살 관련 표현은 사실 중심으로. 자극적 단어(`극단적 선택`, `~해버리다`) 금지. 위기 콜아웃은 직접적 안내(`24시간 정신건강 위기상담 1577-0199`)와 차분한 톤으로.",
    "평가 어휘 금지: `정상/비정상`, `심각/괜찮음`을 진단처럼 단정하지 않는다. `현재 점수가 OO 구간이에요` 처럼 구간/맥락으로 표현.",
    "의료 행위 단정 금지: `진단`, `처방`, `치료` 같은 용어는 실제 의료진의 행위에만 사용. 자가검사·자기관리 컨텍스트에서는 `자가검사`, `점검`, `관리` 로 표현.",
    "사용자 동의 기반 표현: `~하셔야 합니다` 대신 `~할까요?` / `원하시면 ~할 수 있어요`. 강요·재촉 어휘(`반드시`, `당장`) 금지.",
    "익명성·프라이버시 안내는 명시적으로. `회사에 공유되지 않아요`, `이름을 입력하지 않아도 돼요` 처럼 사용자가 안심할 수 있는 문장을 우선 노출.",
    "검사 결과 라벨은 임상 진단처럼 들리지 않게: `위험군` 대신 `관심 필요`, `정상` 대신 `안정`. 검사 결과 상세에서는 점수·구간·해석을 한 묶음으로.",
  ],
};

/**
 * Figma Iconography(379:490) 라이브러리 분류와 스타일 메타데이터.
 * 카테고리: basic / navigation / action / media / state-reaction / location / eap-service / color
 * 스타일:   line(기본) / filled(강조·활성·소형) / color(다색 일러스트성 아이콘)
 *
 * ── 브랜드 아이콘 사용 정책 ──────────────────────────────────────────────
 * `Geniet*Icon`, `Trost*Icon` 같은 brand prefix 아이콘은 해당 브랜드 디자인을 그대로 옮긴
 * 변종이라 공용 아이콘과 시각이 다릅니다.
 *
 * **브랜드 모드(brand='geniet' / 'trost' 등) 작업 시:**
 *   - 같은 의미의 brand prefix 아이콘이 존재하면 **반드시 그쪽을 우선 사용**.
 *     (예: Geniet bottom nav → `GenietRecordIcon` (단일 그래픽 + color cascade), 공용 PushActiveIcon X)
 *   - 사용 가능한 brand 아이콘은 `get_brand({ brand: '<slug>' }).detail.brandIconLookup` 또는 `find_icon({ query: '<BrandPrefix>' })` 로 조회.
 *   - 매칭이 없으면 공용 아이콘 fallback 으로 사용 (예: `LikeIcon` 은 Geniet 매칭 없음 → 공용 OK).
 *
 * **컴포넌트 구현(공통 DS) 에서는:**
 *   - brand 분기 로직(`if (brand === 'geniet')`)을 컴포넌트 안에 박지 않는다.
 *   - DS 컴포넌트는 brand-agnostic 유지, 브랜드 전용 화면이 명시적으로 icon prop 으로 전달.
 *     예: `<Footer.TabBar tabs={[{ key: 'record', icon: <GenietRecordIcon /> }]} />`
 */
export type IconCategory =
  | "basic"
  | "navigation"
  | "action"
  | "media"
  | "state-reaction"
  | "location"
  | "eap-service"
  | "color";

export type IconStyle = "line" | "filled" | "color";

export interface IconMeta {
  category: IconCategory;
  style: IconStyle;
  /** 같은 의미의 짝(예: HomeIcon ↔ HomeActiveIcon)이 있을 때 페어 이름. */
  pair?: string;
}

export const ICON_CATEGORY_LABELS: Record<IconCategory, string> = {
  basic: "기본 (Basic)",
  navigation: "탐색 (Navigation)",
  action: "액션 (Action)",
  media: "미디어 (Media)",
  "state-reaction": "상태·반응 (State / Reaction)",
  location: "위치·연결 (Location / Connect)",
  "eap-service": "EAP 서비스 (EAP Service)",
  color: "컬러 아이콘 (Color)",
};

export const ICON_METADATA: Record<string, IconMeta> = {
  // ── 기본 (Basic) ─────────────────────────────────────────
  ArrowBackIcon: { category: "basic", style: "line" },
  ArrowNextIcon: { category: "basic", style: "line" },
  ChevronUpIcon: { category: "basic", style: "line" },
  ChevronDownIcon: { category: "basic", style: "line" },
  ChevronLeftIcon: { category: "basic", style: "line" },
  ChevronRightIcon: { category: "basic", style: "line" },
  CloseIcon: { category: "basic", style: "line" },
  LockIcon: { category: "basic", style: "line" },
  InputdeleteIcon: { category: "basic", style: "line" },
  DragIcon: { category: "basic", style: "line" },
  PlusIcon: { category: "basic", style: "line" },
  MinusIcon: { category: "basic", style: "line" },

  // ── 탐색 (Navigation) ─ GNB 탭 / 탐색 보조 ──────────────
  HomeIcon: { category: "navigation", style: "line", pair: "HomeActiveIcon" },
  HomeActiveIcon: { category: "navigation", style: "filled", pair: "HomeIcon" },
  MentalcareIcon: { category: "navigation", style: "line", pair: "MentalcareActiveIcon" },
  MentalcareActiveIcon: { category: "navigation", style: "filled", pair: "MentalcareIcon" },
  CounselIcon: { category: "navigation", style: "line", pair: "CounselActiveIcon" },
  CounselActiveIcon: { category: "navigation", style: "filled", pair: "CounselIcon" },
  TrostHomeIcon: { category: "navigation", style: "line", pair: "TrostHomeActiveIcon" },
  TrostHomeActiveIcon: { category: "navigation", style: "filled", pair: "TrostHomeIcon" },
  TrostCounselIcon: { category: "navigation", style: "line", pair: "TrostCounselActiveIcon" },
  TrostCounselActiveIcon: { category: "navigation", style: "filled", pair: "TrostCounselIcon" },
  TrostCommunityIcon: { category: "navigation", style: "line", pair: "TrostCommunityActiveIcon" },
  TrostCommunityActiveIcon: { category: "navigation", style: "filled", pair: "TrostCommunityIcon" },
  TrostMentalcareIcon: { category: "navigation", style: "line", pair: "TrostMentalcareActiveIcon" },
  TrostMentalcareActiveIcon: {
    category: "navigation",
    style: "filled",
    pair: "TrostMentalcareIcon",
  },
  TrostMyIcon: { category: "navigation", style: "line", pair: "TrostMyActiveIcon" },
  TrostMyActiveIcon: { category: "navigation", style: "filled", pair: "TrostMyIcon" },
  TrostMkHomeIcon: { category: "navigation", style: "line", pair: "TrostMkHomeActiveIcon" },
  TrostMkHomeActiveIcon: { category: "navigation", style: "filled", pair: "TrostMkHomeIcon" },
  TrostMkSoundIcon: { category: "navigation", style: "line", pair: "TrostMkSoundActiveIcon" },
  TrostMkSoundActiveIcon: { category: "navigation", style: "filled", pair: "TrostMkSoundIcon" },
  TrostMkMymusicIcon: { category: "navigation", style: "line", pair: "TrostMkMymusicActiveIcon" },
  TrostMkMymusicActiveIcon: { category: "navigation", style: "filled", pair: "TrostMkMymusicIcon" },
  TrostMkTalkIcon: { category: "navigation", style: "line", pair: "TrostMkTalkActiveIcon" },
  TrostMkTalkActiveIcon: { category: "navigation", style: "filled", pair: "TrostMkTalkIcon" },
  TrostMkMypageIcon: { category: "navigation", style: "line", pair: "TrostMkMypageActiveIcon" },
  TrostMkMypageActiveIcon: { category: "navigation", style: "filled", pair: "TrostMkMypageIcon" },
  // Trost 앱바 (webview 헤더) 아이콘 — Figma 5:1169
  TrostBackIcon: { category: "navigation", style: "line" },
  TrostMkBackIcon: { category: "navigation", style: "line" },
  TrostSearchIcon: { category: "action", style: "line" },
  TrostAlarmIcon: { category: "action", style: "line" },
  TrostSettingIcon: { category: "action", style: "line" },
  ChallengeIcon: { category: "navigation", style: "line", pair: "ChallengeActiveIcon" },
  ChallengeActiveIcon: { category: "navigation", style: "filled", pair: "ChallengeIcon" },
  MypageIcon: { category: "navigation", style: "line", pair: "MypageActiveIcon" },
  MypageActiveIcon: { category: "navigation", style: "filled", pair: "MypageIcon" },
  PushIcon: { category: "navigation", style: "line", pair: "PushActiveIcon" },
  PushActiveIcon: { category: "navigation", style: "filled", pair: "PushIcon" },
  CalendarIcon: { category: "navigation", style: "line" },
  HamburgerIcon: { category: "navigation", style: "line" },
  MoreIcon: { category: "navigation", style: "line" },
  SearchIcon: { category: "navigation", style: "line" },

  // ── 액션 (Action) ────────────────────────────────────────
  EditIcon: { category: "action", style: "line" },
  ShareIcon: { category: "action", style: "line" },
  DownloadIcon: { category: "action", style: "line" },
  AddlistIcon: { category: "action", style: "line" },
  CommentIcon: { category: "action", style: "line" },
  DeleteIcon: { category: "action", style: "line" },
  BlockIcon: { category: "action", style: "line" },
  FilterIcon: { category: "action", style: "line" },
  RefreshIcon: { category: "action", style: "line" },
  SettingIcon: { category: "action", style: "line" },

  // ── 미디어 (Media) ───────────────────────────────────────
  PlayIcon: { category: "media", style: "line" },
  PauseIcon: { category: "media", style: "line" },
  SkipBackIcon: { category: "media", style: "line" },
  SkipForwardIcon: { category: "media", style: "line" },
  RepeatIcon: { category: "media", style: "line" },
  ShuffleIcon: { category: "media", style: "line" },
  VideocameraIcon: { category: "media", style: "line" },
  MicrophoneIcon: { category: "media", style: "line" },
  MymusicIcon: { category: "media", style: "line" },
  DecorationStickerIcon: { category: "media", style: "line" },
  DecorationTextIcon: { category: "media", style: "line" },
  CameraIcon: { category: "media", style: "filled" },
  SleepmodeOffIcon: { category: "media", style: "line", pair: "SleepmodeOnIcon" },
  SleepmodeOnIcon: { category: "media", style: "filled", pair: "SleepmodeOffIcon" },

  // ── 상태·반응 (State / Reaction) ────────────────────────
  StarIcon: { category: "state-reaction", style: "line" },
  FavoriteIcon: { category: "state-reaction", style: "line", pair: "FavoriteActiveIcon" },
  FavoriteActiveIcon: { category: "state-reaction", style: "filled", pair: "FavoriteIcon" },
  LikeIcon: { category: "state-reaction", style: "line", pair: "LikeActiveIcon" },
  LikeActiveIcon: { category: "state-reaction", style: "filled", pair: "LikeIcon" },
  ThumbUpIcon: { category: "state-reaction", style: "line" },
  InfoIcon: { category: "state-reaction", style: "line" },
  ReportIcon: { category: "state-reaction", style: "line" },
  TimeIcon: { category: "state-reaction", style: "line" },
  RecentIcon: { category: "state-reaction", style: "line" },
  EyeIcon: { category: "state-reaction", style: "line", pair: "EyeOffIcon" },
  EyeOffIcon: { category: "state-reaction", style: "line", pair: "EyeIcon" },

  // ── 위치·연결 (Location / Connect) ──────────────────────
  LocateIcon: { category: "location", style: "line" },
  TelephoneIcon: { category: "location", style: "line" },
  WebIcon: { category: "location", style: "line" },
  BluetoothIcon: { category: "location", style: "line" },
  SubwayIcon: { category: "location", style: "line" },
  WalkIcon: { category: "location", style: "line" },
  PinIcon: { category: "location", style: "line" },
  LinkIcon: { category: "location", style: "line" },
  CouponIcon: { category: "location", style: "line" },
  PointIcon: { category: "location", style: "line" },
  MonitorIcon: { category: "location", style: "line" },

  // ── EAP 서비스 (EAP Service) ────────────────────────────
  CounselingChatIcon: { category: "eap-service", style: "line" },
  CounselingVideoIcon: { category: "eap-service", style: "line" },
  TestIcon: { category: "eap-service", style: "line" },
  FacilityIcon: { category: "eap-service", style: "line" },
  CenterIcon: { category: "eap-service", style: "line" },

  // ── 컬러 아이콘 (Color) — 다색 일러스트, 컬러 토큰을 적용하지 않음 ──
  TestresultSafeIcon: { category: "color", style: "color" },
  TestresultWarningIcon: { category: "color", style: "color" },
  TestresultDangerIcon: { category: "color", style: "color" },
  SirenIcon: { category: "color", style: "color" },

  // ── Geniet 브랜드 ─ Geniet 홈페이지에서 가져온 브랜드 전용 아이콘. NudgeEAP 공용과 디자인이 달라 prefix 로 분리.
  GenietAlarmIcon: { category: "state-reaction", style: "filled" },
  GenietArrowBackIcon: { category: "navigation", style: "line" },
  GenietArrowDownIcon: { category: "navigation", style: "line" },
  GenietArrowUpIcon: { category: "navigation", style: "line" },
  GenietArrowRightIcon: { category: "navigation", style: "line" },
  GenietArrowRightStepperIcon: { category: "navigation", style: "line" },
  GenietMenuIcon: { category: "navigation", style: "line" },
  GenietMypageIcon: { category: "navigation", style: "line" },
  GenietCopyIcon: { category: "action", style: "line" },
  GenietLoginIcon: { category: "action", style: "line" },
  GenietLogoutIcon: { category: "action", style: "line" },
  GenietRecordIcon: { category: "action", style: "filled" },
  GenietPlayIcon: { category: "media", style: "filled" },
  GenietCheckcircleIcon: { category: "state-reaction", style: "filled" },
  GenietConfettiIcon: { category: "state-reaction", style: "filled" },
  GenietCouponIcon: { category: "location", style: "line" },
  GenietCashreviewIcon: { category: "eap-service", style: "filled" },
  GenietGpointIcon: { category: "eap-service", style: "filled" },

  // ── Geniet bottomnavi / header (Figma 90:2 — 단일 그래픽 + color cascade) ──
  // on/off 별 그래픽이 동일해 단일 컴포넌트로 통합. active/inactive 는 사용처(BottomNav 등)
  // 의 color cascade(--nds-footer-nav-{active,inactive}-color)로 토글.
  GenietHomeIcon: { category: "navigation", style: "filled" },
  GenietBenefitIcon: { category: "eap-service", style: "filled" },
  GenietReviewIcon: { category: "eap-service", style: "filled" },
  GenietCommunityIcon: { category: "navigation", style: "line" },
  GenietSearchIcon: { category: "navigation", style: "line" },

  // ── Cashwalk for Business 어드민 GNB (Figma 9lJ9XCwVYFSoZGcmRuJtI4 — mono 24×24) ──
  // 어드민 사이드바/GNB 전용. active 별도 그래픽 없이 color cascade 로 토글.
  CashwalkBizGnbBannerIcon: { category: "navigation", style: "line" },
  CashwalkBizGnbCashIcon: { category: "navigation", style: "line" },
  CashwalkBizGnbCatalogIcon: { category: "navigation", style: "line" },
  CashwalkBizGnbChannelIcon: { category: "navigation", style: "line" },
  CashwalkBizGnbChatIcon: { category: "navigation", style: "line" },
  CashwalkBizGnbEditIcon: { category: "navigation", style: "line" },
  CashwalkBizGnbMemberIcon: { category: "navigation", style: "line" },
  CashwalkBizGnbQuizIcon: { category: "navigation", style: "line" },
  CashwalkBizGnbSettingIcon: { category: "navigation", style: "line" },

  // ── Runmile (Figma 런마일 library 20:94 — base 24×24 + currentColor 정규화) ──
  // Active suffix = filled (icon/{name}/state=fill). Suffix 없음 = stroke (line).
  // Multicolor (-Color suffix) 는 디자인 가이드의 컬러 보존.
  RunmileAccountActiveIcon: { category: "navigation", style: "filled" },
  RunmileAccountIcon: { category: "navigation", style: "line" },
  RunmileAlramActiveIcon: { category: "state-reaction", style: "filled" },
  RunmileAlramIcon: { category: "state-reaction", style: "line" },
  RunmileAlramOffIcon: { category: "state-reaction", style: "line" },
  RunmileArrowDownIcon: { category: "basic", style: "line" },
  RunmileArrowLeftIcon: { category: "basic", style: "line" },
  RunmileArrowRightIcon: { category: "basic", style: "line" },
  RunmileArrowUpIcon: { category: "basic", style: "line" },
  RunmileBackIcon: { category: "basic", style: "line" },
  RunmileBanIcon: { category: "action", style: "line" },
  RunmileBookmarkActiveIcon: { category: "action", style: "filled" },
  RunmileBookmarkIcon: { category: "action", style: "line" },
  RunmileBottomIcon: { category: "basic", style: "line" },
  RunmileCalendarActiveIcon: { category: "action", style: "filled" },
  RunmileCalendarIcon: { category: "action", style: "line" },
  RunmileCameraActiveIcon: { category: "action", style: "filled" },
  RunmileCameraIcon: { category: "action", style: "line" },
  RunmileCautionColorIcon: { category: "color", style: "color" },
  RunmileChallengeActiveIcon: { category: "navigation", style: "filled" },
  RunmileChallengeIcon: { category: "navigation", style: "line" },
  RunmileChatsActiveIcon: { category: "navigation", style: "filled" },
  RunmileChatsIcon: { category: "navigation", style: "line" },
  RunmileChattingActiveIcon: { category: "action", style: "filled" },
  RunmileChattingIcon: { category: "action", style: "line" },
  RunmileCheckboxActiveIcon: { category: "state-reaction", style: "filled" },
  RunmileCheckboxIcon: { category: "state-reaction", style: "line" },
  RunmileCircleCheckColorIcon: { category: "color", style: "color" },
  RunmileCircleCheckIcon: { category: "state-reaction", style: "filled" },
  RunmileCircleWarningIcon: { category: "state-reaction", style: "filled" },
  RunmileCircleWarningStrokeIcon: { category: "state-reaction", style: "line" },
  RunmileCloseIcon: { category: "basic", style: "line" },
  RunmileCommunityActiveIcon: { category: "navigation", style: "filled" },
  RunmileCommunityIcon: { category: "navigation", style: "line" },
  RunmileConfettiColorIcon: { category: "color", style: "color" },
  RunmileCopyIcon: { category: "action", style: "line" },
  RunmileExportIcon: { category: "action", style: "line" },
  RunmileEyeIcon: { category: "action", style: "line" },
  RunmileEyeOffIcon: { category: "state-reaction", style: "line" },
  RunmileEyeOnIcon: { category: "state-reaction", style: "line" },
  RunmileFilterIcon: { category: "action", style: "line" },
  RunmileFireColorIcon: { category: "color", style: "color" },
  RunmileHamburgerIcon: { category: "basic", style: "line" },
  RunmileHomeActiveIcon: { category: "navigation", style: "filled" },
  RunmileHomeClassicActiveIcon: { category: "action", style: "filled" },
  RunmileHomeClassicIcon: { category: "action", style: "line" },
  RunmileHomeIcon: { category: "navigation", style: "line" },
  RunmileImageErrorIcon: { category: "action", style: "line" },
  RunmileImageIcon: { category: "action", style: "line" },
  RunmileInformationActiveIcon: { category: "action", style: "filled" },
  RunmileInformationIcon: { category: "action", style: "line" },
  RunmileKebabHorizontalIcon: { category: "basic", style: "filled" },
  RunmileKebabVerticalIcon: { category: "basic", style: "filled" },
  RunmileLikeActiveIcon: { category: "state-reaction", style: "filled" },
  RunmileLikeIcon: { category: "state-reaction", style: "line" },
  RunmileLoginIcon: { category: "action", style: "line" },
  RunmileMailIcon: { category: "action", style: "line" },
  RunmileMinusIcon: { category: "basic", style: "line" },
  RunmileMypageActiveIcon: { category: "navigation", style: "filled" },
  RunmileMypageIcon: { category: "navigation", style: "line" },
  RunmileNullIcon: { category: "basic", style: "line" },
  RunmileOutIcon: { category: "action", style: "line" },
  RunmilePenActiveIcon: { category: "action", style: "filled" },
  RunmilePenIcon: { category: "action", style: "line" },
  RunmilePeopleActiveIcon: { category: "action", style: "filled" },
  RunmilePeopleIcon: { category: "action", style: "line" },
  RunmilePlusIcon: { category: "basic", style: "line" },
  RunmileQuestionmarkActiveIcon: { category: "action", style: "filled" },
  RunmileQuestionmarkIcon: { category: "action", style: "line" },
  RunmileRadioActiveIcon: { category: "state-reaction", style: "filled" },
  RunmileRadioIcon: { category: "state-reaction", style: "line" },
  RunmileRefreshIcon: { category: "basic", style: "line" },
  RunmileReplyIcon: { category: "action", style: "line" },
  RunmileSearchClearIcon: { category: "state-reaction", style: "filled" },
  RunmileSearchIcon: { category: "basic", style: "line" },
  RunmileSettingActiveIcon: { category: "action", style: "filled" },
  RunmileSettingIcon: { category: "action", style: "line" },
  RunmileShareIcon: { category: "action", style: "line" },
  RunmileShoeActiveIcon: { category: "action", style: "filled" },
  RunmileShoeIcon: { category: "action", style: "line" },
  RunmileThumbIcon: { category: "action", style: "line" },
  RunmileTopIcon: { category: "basic", style: "line" },
  RunmileTrashActiveIcon: { category: "action", style: "filled" },
  RunmileTrashIcon: { category: "action", style: "line" },
  RunmileUserActiveIcon: { category: "action", style: "filled" },
  RunmileUserIcon: { category: "action", style: "line" },
};

/** 카테고리별로 아이콘 이름을 묶은 인덱스. find_icon 응답 보강용. */
export function getIconCategoryIndex(): Record<IconCategory, string[]> {
  const index: Record<IconCategory, string[]> = {
    basic: [],
    navigation: [],
    action: [],
    media: [],
    "state-reaction": [],
    location: [],
    "eap-service": [],
    color: [],
  };
  for (const [name, meta] of Object.entries(ICON_METADATA)) {
    index[meta.category].push(name);
  }
  for (const list of Object.values(index)) list.sort();
  return index;
}
