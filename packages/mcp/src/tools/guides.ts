/**
 * tools/guides.ts — 디자인 가이드 · 원칙 · 어드민/CMS · CLAUDE.md 템플릿
 *
 * server.ts 에서 분리된 read-only tool 핸들러 묶음. 외부 상태에 의존하지 않고
 * `./guides.js` 에서 import 한 정적 데이터(COMPONENT_GUIDES, DESIGN_PRINCIPLES 등)
 * 와 사용자 입력만 받아 응답을 만들기 때문에 server 부트스트랩과 무관하게 단위
 * 테스트가 가능하다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  COMPONENT_GUIDES,
  DESIGN_PRINCIPLES,
  PATTERN_GUIDES,
  buildBackofficeGuide,
  SCOPE_ADVISORY,
  UX_WRITING_GUIDE,
  detectIntentFromText,
  resolveIntentRouting,
  isDsAdminBrand,
  DS_ADMIN_BRANDS,
} from "../guides.js";
import { getBrandProfile } from "@nudge-design/tokens/brand-profiles";
import { SERVICE_OVERLAYS, listBrandVariants, type BrandSlug } from "../guides/services/index.js";
import { mergeServiceOverlay } from "../guides/merge.js";
import { markPrinciplesCalled } from "./session-state.js";
import {
  canonicalBrandSlug,
  readDesignDecisions,
  promoteDesignDecisions,
  DEFAULT_PROMOTE_THRESHOLD,
  type PromotedPrinciple,
} from "@nudge-design/mockup-core";

/**
 * 워크스페이스 브랜드 SSOT 마커. get_setup 이 brand 와 함께 호출되면 cwd 에 이 파일을 박아,
 * 빌드(resolveHtmlBrand)가 html 선언 누락 시에도 정식 brand 를 단일 출처에서 읽게 한다.
 * (회고: 브랜드를 chrome 속성에만 선언 → base 블루 폴백. 마커가 있으면 추론조차 불필요.)
 */
export const BRAND_MARKER_FILE = "nudge.brand";

/** cwd 에 nudge.brand 마커를 canonical slug 로 기록. brand 없으면 no-op. */
function writeBrandMarker(cwd: string, brand?: string): { brandMarker?: string } {
  const canonical = canonicalBrandSlug(brand);
  if (!canonical) return {};
  try {
    fs.writeFileSync(path.join(cwd, BRAND_MARKER_FILE), `${canonical}\n`, "utf-8");
    return { brandMarker: canonical };
  } catch {
    return {}; // 마커 쓰기 실패는 치명적이지 않음 — 빌드의 추론/chrome 폴백이 받쳐 줌
  }
}

/**
 * 워크스페이스 표면 SSOT 마커(nudge.surface). 어드민(b2b) 라우팅 시 'admin' 을 박아
 * validator 의 표면 룰(admin-surface-consumer-chrome 등)이 추론 없이 맞물리게 한다.
 */
export const SURFACE_MARKER_FILE = "nudge.surface";

/** cwd 에 nudge.surface 마커를 기록. surface 없으면 no-op (writeBrandMarker 패턴 미러). */
function writeSurfaceMarker(
  cwd: string,
  surface?: "admin" | "service",
): { surfaceMarker?: string } {
  if (!surface) return {};
  try {
    fs.writeFileSync(path.join(cwd, SURFACE_MARKER_FILE), `${surface}\n`, "utf-8");
    return { surfaceMarker: surface };
  } catch {
    return {};
  }
}

/** cwd 의 nudge.brand 마커를 읽어 canonical slug 로 돌려준다(없으면 undefined). writeBrandMarker 의 read 짝. */
function readBrandMarker(cwd: string): string | undefined {
  try {
    const raw = fs.readFileSync(path.join(cwd, BRAND_MARKER_FILE), "utf-8").trim();
    return canonicalBrandSlug(raw) ?? (raw || undefined);
  } catch {
    return undefined;
  }
}

/** 양수 정수 환경변수 파싱(없거나 비정상이면 undefined). NUDGE_PROMOTE_THRESHOLD 튜닝용. */
function parsePositiveInt(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

/**
 * principles 응답에 머지할 `_learnedPrinciples` 블록을 만든다(Decision Log → Principles 승격).
 * `<cwd>/designDecisions.jsonl` 에서 같은 브랜드의 서로 다른 화면 N개 이상에서 반복된 결정을 끌어올린다.
 * best-effort — 파일이 없거나(첫 작업) brand 를 모르거나 반복이 임계 미만이면 null(응답 불변).
 *  · brand = 명시 인자 → cwd 의 nudge.brand 마커 순.
 *  · cwd  = 명시 인자 → MCP 프로세스 cwd(= save_design_spec 의 기본 기록 위치).
 *  · NUDGE_LEARNED_PRINCIPLES=0 으로 끌 수 있고, NUDGE_PROMOTE_THRESHOLD 로 임계를 조정한다.
 */
function buildLearnedPrinciples(
  cwdArg: string | undefined,
  brandArg: string | undefined,
): { _advisory: string; brand: string; threshold: number; principles: PromotedPrinciple[] } | null {
  if (process.env.NUDGE_LEARNED_PRINCIPLES === "0") return null;
  const cwd = cwdArg ?? process.cwd();
  const brand = canonicalBrandSlug(brandArg) ?? readBrandMarker(cwd);
  if (!brand) return null;
  try {
    const threshold =
      parsePositiveInt(process.env.NUDGE_PROMOTE_THRESHOLD) ?? DEFAULT_PROMOTE_THRESHOLD;
    const principles = promoteDesignDecisions(readDesignDecisions(cwd), { brand, threshold });
    if (principles.length === 0) return null;
    return {
      _advisory:
        "designDecisions.jsonl 에서 자동 승격된, 이 브랜드 화면에서 반복적으로 내린 결정입니다. 새 화면도 특별한 이유가 없으면 따르고, 벗어나면 save_design_spec 의 decisions/rationale 로 근거를 남기세요.",
      brand,
      threshold,
      principles,
    };
  } catch {
    return null;
  }
}

/**
 * MCP 패키지 루트. references/*.png 같은 상대경로를 절대경로로 풀어 응답에 함께
 * 노출하기 위해 사용한다. dist/tools/ 에서 두 단계 올라간 위치가 패키지 루트.
 */
const MCP_PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/** references[].image (패키지 루트 상대경로) 를 절대경로로 풀고, 존재 여부 확인.
 * ComponentGuide / PatternGuide 양쪽이 동일한 형태의 references 를 갖는다. */
function resolvePatternReferenceImages(
  refs: NonNullable<(typeof PATTERN_GUIDES)[string]["references"]>,
) {
  return refs.map((r) => {
    if (!r.image) return r;
    const absolute = path.resolve(MCP_PACKAGE_ROOT, r.image);
    return {
      ...r,
      imageAbsolutePath: absolute,
      imageExists: fs.existsSync(absolute),
    };
  });
}

/**
 * 첫 응답 게이트 질문(SSOT) — 목업/화면 생성 요청 시 **레퍼런스(①)와 화면 영역(②)을 한 번에**
 * 묻고 멈춘다. server.ts(requiredFirstResponseQuestion) · setup.ts · ENTRY_TOOL_ADVISORY 가 공유.
 * 영역(admin/backoffice/service)은 레퍼런스와 동급 — 틀리면 DS vs antd 자체가 어긋난다.
 */
export const VISUAL_REFERENCE_QUESTION =
  "두 가지만 먼저 확인할게요. ① 시각 기준 — Figma 링크나 스크린샷이 있을까요? 이미 첨부하신 자료로 진행해도 될지, 정답/오답 레퍼런스가 있으면 함께(정답 1-2장·피해야 할 오답 1-2장 + 각 1줄 캡션) 알려 주세요. ② 화면 영역 — 이 화면이 (a) 외부 제공 B2B 어드민[Nudge DS], (b) 사내 백오피스·운영툴/CMS[antd v5], (c) 일반 서비스(앱/웹)[Nudge DS] 중 무엇인가요? 캐포비처럼 어드민·서비스가 함께 있는 브랜드면 어느 쪽인지, 어드민이면 페이지패턴 5종(onboarding/dashboard/list/detail/form) 중 어디에 가까운지도 알려 주세요.";

export const ENTRY_TOOL_ADVISORY =
  "FIRST RESPONSE GATE: If the user asks to create, generate, revise, or build any mockup/screen/page, ask BOTH (1) visual references AND (2) the screen area together in ONE message, then stop — before any tool lookup or code work. Never ask only references and start building; the area question (admin/backoffice/service) is co-equal because getting it wrong picks the wrong design system entirely (DS vs antd). " +
  'Use this exact question and stop: "' +
  VISUAL_REFERENCE_QUESTION +
  '" ' +
  "시각 소스 신뢰 위계: **사용자가 채팅에 붙여넣은 스크린샷·이미지는 레이아웃·구성·의도 참고용으로만** 쓰고, 정확한 색/여백/치수/컴포넌트 선택의 근거로 삼지 마세요(거칠고 비공식적인 자료라 그대로 베끼면 회귀의 원인). 픽셀·색·치수·매트릭스의 SSOT 는 **MCP에 저장된 레퍼런스**(get_guide 의 references[].imageAbsolutePath · figmaNodeUrl)이며 더 신뢰합니다 — 사용자 스크린샷과 MCP 레퍼런스가 어긋나면 **MCP 레퍼런스가 우선**입니다. " +
  "Before creating/editing mockup files, do a shallow current-workspace collision check only; if an obvious same-PRD/same-screen work folder is found, ask whether to create a v2 instead and stop. Do not modify the existing folder without that answer. Do not exhaustive-search. " +
  "Every completed mockup response must include the final artifact full absolute path, not only a relative dist/index.html path. " +
  "이 MCP의 역할은 '별도 외부 목업 프로젝트를 빌드하고 목업을 생성하는 것'입니다. " +
  "DS 레포 소스 수정, git commit/push, GitHub 레포 변경, npm publish 같은 작업은 이 MCP의 역할이 아닙니다. " +
  "사용자가 그런 작업을 요청하면 DS 레포에서 직접 작업하라고 안내하세요. " +
  "이 MCP는 사용자 앱(Trost / Geniet / NudgeEAP / CashwalkBiz / Runmile) 컴포넌트만 노출합니다. " +
  "위 게이트 ②(영역) 답에 따라 라우팅(추측 금지): 사내 백오피스/운영툴이면 antd v5 + get_guide({ topic: 'backoffice' }), 외부 제공(b2b) 어드민이면 " +
  "하드게이트 브랜드(cashwalk-biz/nudge-eap)만 DS 로 지원 — get_setup({ intent: 'admin', brand: '<slug>' }). " +
  "두 디자인시스템을 한 화면에서 섞어쓰지 마세요.";

export function getScopeAdvisory() {
  return SCOPE_ADVISORY;
}

export function getDesignPrinciples() {
  return { _advisory: ENTRY_TOOL_ADVISORY, ...DESIGN_PRINCIPLES };
}

export function getDosAndDonts() {
  return {
    _advisory: ENTRY_TOOL_ADVISORY,
    dos: DESIGN_PRINCIPLES.dos,
    donts: DESIGN_PRINCIPLES.donts,
  };
}

export function getUxWritingGuide() {
  return {
    _advisory:
      "사용자에게 노출되는 모든 텍스트(버튼·라벨·placeholder·empty state·에러·다이얼로그)에 적용되는 보이스톤·문장 룰. EAP 멘탈케어 도메인 규칙은 eapDomain 섹션을 함께 보세요. CTA 라벨 규칙은 get_guide({ topic: 'pattern:cta-group' }) 와도 일관.",
    ...UX_WRITING_GUIDE,
  };
}

export type GuideTarget = "react" | "html";
export type GuideView = "examples" | "rules" | "full";

/**
 * 브랜드 chrome React-only 컴포넌트(WebHeader/AppBar/Footer/BottomNav)는 HTML 1:1 대응
 * element 가 없다(_htmlStatus='no-html-equivalent'). 하지만 "대응 element 없음" 이라고만
 * 안내하면 회고처럼 base `<nds-header>` 를 손수 조립하는 막다른 길로 샌다.
 * 실제로는 `<nds-brand-header|footer|bottom-nav>` 한 줄이 BRAND_DATA 에서 전부 렌더한다.
 * 컴포넌트 이름(브랜드 prefix + 슬롯 suffix)에서 올바른 brand element + surface 를 유도해
 * 막다른 길 대신 "이걸 쓰라" 는 표지판으로 바꾼다. (브랜드 신규 컴포넌트도 자동 커버)
 */
const BRAND_CHROME_BRANDS: Array<[prefix: string, slug: string]> = [
  ["NudgeEAP", "nudge-eap"],
  ["CashwalkBiz", "cashwalk-biz"],
  ["Trost", "trost"],
  ["Geniet", "geniet"],
  ["Runmile", "runmile"],
];

export function brandChromeHtmlRedirect(name: string): string | undefined {
  const hit = BRAND_CHROME_BRANDS.find(([prefix]) => name.startsWith(prefix));
  if (!hit) return undefined;
  const [prefix, slug] = hit;
  const slot = name.slice(prefix.length);
  switch (slot) {
    case "WebHeader":
    case "DesktopHeader":
      return (
        `<nds-brand-header brand='${slug}' surface='web' active-key='...' asset-base-url='/assets'> ` +
        `— 상세: get_guide({ topic: 'component:BrandHeader', target: 'html' })`
      );
    case "AppBar":
    case "MobileHeader":
      return (
        `<nds-brand-header brand='${slug}' surface='mobile' active-key='...'> ` +
        `(웹뷰 헤더는 surface='webview') — 상세: get_guide({ topic: 'component:BrandHeader', target: 'html' })`
      );
    case "Footer":
    case "WebFooter":
      return (
        `<nds-brand-footer brand='${slug}' surface='web' asset-base-url='/assets'> ` +
        `(앱 푸터는 surface='app') — 상세: get_guide({ topic: 'component:BrandFooter', target: 'html' })`
      );
    case "AppFooter":
      return (
        `<nds-brand-footer brand='${slug}' surface='app'> ` +
        `— 상세: get_guide({ topic: 'component:BrandFooter', target: 'html' })`
      );
    case "BottomNav":
      return (
        `<nds-brand-bottom-nav brand='${slug}' active-key='...'> ` +
        `— 상세: get_guide({ topic: 'component:BrandBottomNav', target: 'html' })`
      );
    default:
      return undefined;
  }
}

/**
 * 컴포넌트 가이드 공통 advisory — figma 유무와 무관하게 **항상 동일**해야 배치 응답에서
 * _shared 로 1회만 hoist 된다(getGuide 배치 dedup). 픽셀 확인 큐는 "있으면" 조건부 표현이라
 * figma 미연결 컴포넌트에도 부정확하지 않다.
 */
const COMPONENT_GUIDE_ADVISORY =
  "props 함정(pitfalls)·matrix 를 먼저 확인하세요. figmaNodeUrl · references[].imageAbsolutePath 가 있으면 픽셀/색/매트릭스가 의심될 때 우선 확인하세요.";

const PRINCIPLES_DIGEST = [
  "get_guide({ topic: 'principles' }) first for mockup work.",
  "No emoji/text-symbol icons; use find_icon + @nudge-design/icons.",
  "No raw <header>/<footer>/<main>/<nav> when nds/brand components fit.",
  "Use semantic tokens; avoid raw hex/rgb and raw palette tokens.",
  "Use <nds-*> components before custom native controls/CSS lookalikes.",
  "Make every mockup responsive: fluid containers (max-width + padding, flex/grid wrap, min-width:0), no fixed-px-only layout, no horizontal scroll/overlap at ~360/~768.",
];

/**
 * target='html' 호출 시:
 *   - examplesHtml 가 있으면 그 do/dont 를 examples 자리에 매핑하고 examplesHtml 필드는 제거.
 *   - examplesHtml 가 없는 legacy React-only 컴포넌트(_htmlStatus='no-html-equivalent') 는
 *     기존 examples 를 그대로 두고 _htmlAdvisory 로 안내문 첨부.
 *   - 그 외(examplesHtml 도 _htmlStatus 도 없음) 는 examples 가 JSX 임을 명시.
 *
 * target='react' 호출 시 examplesHtml / _htmlStatus 필드는 그대로 응답에 포함된다
 * (디버깅 / 라이브러리 sync 상태 확인용).
 */
export function getComponentGuide(name: string, target: GuideTarget = "html") {
  const guide = COMPONENT_GUIDES[name];
  if (!guide) {
    return {
      error: `No curated guide for '${name}'. Falls back to find_component({ name: '${name}' }) for raw props.`,
      knownGuides: Object.keys(COMPONENT_GUIDES),
    };
  }
  const resolvedReferences = guide.references
    ? resolvePatternReferenceImages(guide.references)
    : undefined;
  // 모든 컴포넌트 가이드에서 동일한 조건부 문구 — hasRef 분기를 없애 혼합 배치에서도
  // _shared 로 hoist 되게 한다(이전엔 hasRef 차이로 토픽 수만큼 반복 노출). figma 픽셀
  // 확인 큐는 "있으면" 조건부라 noRef 컴포넌트에도 부정확하지 않다.
  const baseAdvisory = COMPONENT_GUIDE_ADVISORY;
  // 합성 전용(standalone:false) 컴포넌트는 "단독 사용 금지"를 advisory 로 부각 —
  // AI 가 헬퍼텍스트/검증칩을 부모 없이 덜렁 놓는 오용을 차단.
  const standaloneAdvisory =
    guide.standalone === false
      ? "⚠ 합성 전용 — 단독 사용 금지. 부모 없이는 의미 없는 서브 컴포넌트입니다" +
        (guide.composeWith?.length ? ` (반드시 ${guide.composeWith.join(" · ")} 와 합성해 사용).` : ".")
      : undefined;

  if (target === "html") {
    const { examplesHtml, _htmlStatus, ...rest } = guide;
    let htmlAdvisory: string;
    let examples = guide.examples;
    if (examplesHtml) {
      examples = examplesHtml;
      htmlAdvisory =
        "target=html — examples 필드가 vanilla HTML (<nds-*>) 형태로 교체됐습니다. " +
        "attribute 는 kebab-case, 이벤트는 addEventListener('nds-...', handler) 로 바인딩하세요.";
    } else if (_htmlStatus === "no-html-equivalent") {
      const redirect = brandChromeHtmlRedirect(guide.name);
      if (redirect) {
        // 브랜드 chrome — 막다른 길("대응 element 없음") 대신 brand element 표지판.
        htmlAdvisory =
          "★ target=html — 이 컴포넌트는 React 전용 브랜드 chrome 래퍼입니다. " +
          "HTML 목업에서는 base <nds-header> 를 손수 조립하지 말고(회고: 손수 조립 = 안티패턴) " +
          `다음 한 줄을 쓰세요: ${redirect}. ` +
          "로고 / 메뉴 라벨·href / auth 버튼 / 사업자 정보가 BRAND_DATA 에서 자동 렌더되고, " +
          "surface 값(web / mobile / webview)으로 PC·모바일·웹뷰 헤더가 각각 분기됩니다. " +
          "아래 examples 는 React 용 JSX 라 HTML 에 그대로 붙여넣지 마세요.";
      } else {
        htmlAdvisory =
          "target=html 호출됐지만 이 컴포넌트는 @nudge-design/html 패키지에 1:1 대응되는 nds-* element 가 아직 없습니다. " +
          "find_component({ query }) 로 대체 가능한 다른 HTML 지원 컴포넌트를 검토하세요. " +
          "examples 는 기존 JSX 형태 그대로 노출됩니다.";
      }
    } else {
      htmlAdvisory =
        "target=html 호출됐지만 이 가이드에는 아직 examplesHtml 가 큐레이션되어 있지 않습니다. " +
        "examples 는 JSX 형태입니다 — 동일 prop 을 kebab-case attribute 로 변환해 <nds-*> 로 작성하세요.";
    }
    return {
      _advisory: baseAdvisory,
      ...(standaloneAdvisory ? { _standaloneAdvisory: standaloneAdvisory } : {}),
      _htmlAdvisory: htmlAdvisory,
      _principlesDigest: PRINCIPLES_DIGEST,
      ...rest,
      examples,
      references: resolvedReferences ?? guide.references,
    };
  }

  return {
    _advisory: baseAdvisory,
    ...(standaloneAdvisory ? { _standaloneAdvisory: standaloneAdvisory } : {}),
    _principlesDigest: PRINCIPLES_DIGEST,
    ...guide,
    references: resolvedReferences ?? guide.references,
  };
}

export function getPatternGuide(name: string) {
  const guide = PATTERN_GUIDES[name];
  if (!guide) {
    return {
      error: `No pattern guide for '${name}'.`,
      knownGuides: Object.keys(PATTERN_GUIDES),
    };
  }
  const resolvedReferences = guide.references
    ? resolvePatternReferenceImages(guide.references)
    : undefined;
  // hasRef 분기 제거 — "있으면" 조건부 단일 문구로 통일해 패턴 배치에서도 _shared hoist.
  return {
    _advisory:
      "컴포넌트 API가 아니라 배치/위계/강조 사용량 기준입니다. 목업 작성 전 또는 validate_mockup 경고 수정 시 참고하세요. references[] 가 있으면 픽셀·여백·상태가 의심될 때 references[].imageAbsolutePath 스크린샷을 우선 확인하세요.",
    ...guide,
    references: resolvedReferences ?? guide.references,
  };
}

export function listFigmaSyncStatus() {
  const entries = Object.values(COMPONENT_GUIDES).map((g) => ({
    name: g.name,
    hasFigmaUrl: Boolean(g.figmaNodeUrl),
    figmaNodeUrl: g.figmaNodeUrl ?? null,
    hasSizeMatrix: Boolean(g.sizeMatrix),
    hasStateMatrix: Boolean(g.stateMatrix),
    hasColorMatrix: Boolean(g.colorMatrix),
    hasAccessibility: Boolean(g.accessibility?.length),
  }));
  const synced = entries.filter((e) => e.hasFigmaUrl);
  return {
    _advisory:
      "Figma Library(MqR7O3uvBvH5tVngwzbqGH) 와 sync 된 컴포넌트 목록. " +
      "hasFigmaUrl=true 인 항목은 get_guide({ topic: 'component:<Name>' }) 응답에서 figmaNodeUrl 을 바로 클릭할 수 있습니다.",
    total: entries.length,
    syncedCount: synced.length,
    pendingCount: entries.length - synced.length,
    entries,
  };
}

export function getBackofficeGuide(args: {
  intent?: string;
  brand?: string;
  serviceName?: string;
}) {
  // 어드민 하드게이트 브랜드는 antd 가 아니라 DS 로 만든다 — antd 컨벤션 대신 DS 경로로 리다이렉트.
  // 단, 넛지EAP 는 자체 admin DS 가 없어 '사내 백오피스(NudgeEAPCMS)' 요청일 수 있다 —
  // intent:'admin' 명시일 때만 리다이렉트하고, topic 호출만으로는 antd 백오피스 가이드를 준다.
  if (isDsAdminBrand(args.brand)) {
    const canonicalBrand = canonicalBrandSlug(args.brand) ?? args.brand;
    const ownAdminSystem = !!getBrandProfile(canonicalBrand)?.admin?.pagePatternSystem;
    if (ownAdminSystem) {
      return {
        intent: "html" as const,
        brand: canonicalBrand,
        requestedBrand: args.brand,
        note:
          `${args.brand}(=${canonicalBrand}) 어드민은 antd 가 아니라 Nudge DS 로 만든다. ` +
          "이 브랜드는 DS 안에 자체 admin 디자인 시스템(admin layout/input/Modal admin 토큰)을 갖추고 있어, " +
          "백오피스 antd 컨벤션(240px Sider · INFO/CMS MENU/SETTING 푸터)을 따르지 말 것. " +
          "이 antd 패턴을 캐포비 어드민에 그대로 적용하면 잘못된 화면이 된다.",
        "NDS 쓰기의 의미":
          "캐포비 어드민에서 'NDS 를 쓴다'는 건 단순히 <nds-*> 태그를 남기고 빌더 검증을 통과시키는 게 아니라, " +
          "캐포비 어드민의 실제 화면 패턴(Page Pattern System 5종)과 admin 토큰/사이드바를 따르는 것이다. " +
          "PRD/시안의 화면 맥락이 antd 가이드보다 우선이다.",
        useInstead: [
          `get_setup({ step: 'full', intent: 'admin', brand: '${args.brand}' }) — DS(html) 셋업으로 자동 우회`,
          `get_guide({ topic: 'pattern:cashwalk-biz-page-patterns' }) — 캐포비 어드민 화면 5종(onboarding/dashboard/list/detail/form) 중 PRD 에 맞는 패턴 선언`,
          `get_guide({ topic: 'pattern:cashwalk-biz-admin-sidebar' }) — 캐포비 자체 사이드바(300px·로고 인라인). 백오피스 240px Sider 아님`,
          `get_guide({ topic: 'component:<Name>', brand: '${args.brand}', target: 'html' }) — admin 토큰이 cascade 된 DS 컴포넌트`,
          `get_guide({ topic: 'principles', brand: '${args.brand}' })`,
        ],
        techStack: {
          required: [
            "@nudge-design/html (<nds-*>)",
            "@nudge-design/tokens/css",
            `${canonicalBrand} 브랜드 css`,
          ],
          forbidden: ["antd", "@ant-design/icons"],
        },
      };
    }
    if (args.intent === "admin") {
      // 넛지EAP 어드민(b2b) — 자체 admin 토큰 없이 기존 DS 컴포넌트/토큰으로 목업한다.
      return {
        intent: "html" as const,
        brand: canonicalBrand,
        requestedBrand: args.brand,
        note:
          `${args.brand}(=${canonicalBrand}) 어드민(외부 제공 b2b)은 antd 가 아니라 Nudge DS 로 만든다. ` +
          "캐포비와 달리 전용 admin 토큰/page-pattern 게이트는 없다 — 기존 DS 컴포넌트와 토큰으로 " +
          "어드민 기획서를 목업하면 된다 (design-spec/page-pattern 선언 불필요).",
        useInstead: [
          `get_setup({ step: 'full', intent: 'admin', brand: '${args.brand}' }) — DS(html) 셋업으로 자동 우회`,
          "get_guide({ topic: 'pattern:admin-shell' }) — 어드민 사이드바+톱바 셸 패턴",
          `get_guide({ topic: 'component:<Name>', brand: '${args.brand}', target: 'html' })`,
          `get_guide({ topic: 'principles', brand: '${args.brand}' })`,
        ],
        techStack: {
          required: [
            "@nudge-design/html (<nds-*>)",
            "@nudge-design/tokens/css",
            `${canonicalBrand} 브랜드 css`,
          ],
          forbidden: ["antd", "@ant-design/icons"],
        },
      };
    }
  }
  const guide = buildBackofficeGuide(args.serviceName);
  const canon = canonicalBrandSlug(args.brand);
  const outsideGateBrand = !!args.brand?.trim() && !isDsAdminBrand(args.brand);
  return {
    intent: "backoffice",
    "⚠ 영역 확인 먼저": guide.dsAdminException,
    note:
      "백오피스(사내 어드민/CMS/운영툴) 화면을 만들 때 따라야 할 시각/구조 컨벤션. " +
      "NudgeEAPCMS(antd 5.5.1) 실제 운영 코드에서 추출한 공통 패턴으로, 브랜드 무관 전 서비스 기본 지원입니다. " +
      "푸터 카피 등 서비스 고유 표기는 serviceName 파라미터로 주입하세요 — " +
      "예: get_guide({ topic: 'backoffice', serviceName: 'Runmile' }). " +
      "PRD 의 제품 맥락이 이 공통 백오피스 가이드보다 우선입니다.",
    ...(args.serviceName
      ? { serviceName: args.serviceName }
      : {
          _note:
            "serviceName 미지정 — 푸터 카피가 <서비스명> 플레이스홀더로 나갑니다. " +
            "get_guide({ topic: 'backoffice', serviceName: '<서비스 표기명>' }) 으로 주입하세요.",
        }),
    ...(outsideGateBrand
      ? {
          _advisory:
            `이 브랜드(${canon ?? args.brand})는 어드민(외부 제공 b2b) 미지원입니다 — b2b 어드민 화면이라면 ` +
            `진행하지 말 것 (지원: ${DS_ADMIN_BRANDS.join(", ")} / 편입은 DS 팀에 요청). ` +
            "이 가이드는 사내 백오피스 전제입니다.",
        }
      : {}),
    ...(args.intent &&
    !["admin", "backoffice", "admin-cms", "html"].includes(args.intent) &&
    detectIntentFromText(args.intent) === "operator"
      ? {
          _operatorKeywordNotice:
            "운영자 화면 발화가 감지됐습니다. 이 가이드는 '사내 백오피스' 전제 — 외부 제공(b2b) 어드민이라면 " +
            `intent:'admin' + brand(지원: ${DS_ADMIN_BRANDS.join(", ")}) 로 get_setup 을 재호출하세요. ` +
            "영역이 불확실하면 사용자에게 확답을 받기 전 진행하지 마세요.",
        }
      : {}),
    ...guide,
  };
}

/** @deprecated getBackofficeGuide 로 rename — 구명 호환 export. */
export const getAdminCmsGuide = getBackofficeGuide;

/* ───────────── get_guide 라우터 ─────────────
 *
 * 8개로 흩어져 있던 가이드 도구를 단일 진입점으로 통합.
 * topic 포맷:
 *   - "principles" | "dos-donts" | "backoffice" | "scope-advisory" | "inspector-setup"
 *   - "component:<Name>" — 예: "component:Button"
 *   - "pattern:<name>"   — 예: "pattern:cta-group"
 *
 * 'admin-cms' 는 'backoffice' 의 영구 별칭 — 이미 배포된 외부 CLAUDE.md 가 하드코딩하고
 * 있어 끊으면 기존 워크스페이스가 전부 깨진다.
 * 알 수 없는 topic 은 사용 가능한 목록을 함께 돌려준다.
 */

export const GUIDE_FIXED_TOPICS = [
  "principles",
  "dos-donts",
  "ux-writing",
  "backoffice",
  "admin-cms",
  "scope-advisory",
  "inspector-setup",
  "figma-sync",
] as const;

export type GuideTopic =
  | (typeof GUIDE_FIXED_TOPICS)[number]
  | `component:${string}`
  | `pattern:${string}`;

function listGuideTopics() {
  return {
    fixed: [...GUIDE_FIXED_TOPICS],
    componentExamples: Object.keys(COMPONENT_GUIDES)
      .slice(0, 6)
      .map((n) => `component:${n}`),
    patternExamples: Object.keys(PATTERN_GUIDES).map((n) => `pattern:${n}`),
    componentTopics: Object.keys(COMPONENT_GUIDES).map((n) => `component:${n}`),
    patternTopics: Object.keys(PATTERN_GUIDES).map((n) => `pattern:${n}`),
  };
}

/**
 * 응답에서 sections 로 지정한 top-level 키만 골라 반환한다.
 * - `_advisory` 같은 메타 키는 항상 유지 (sections 가 무엇이든)
 * - 매칭 키가 0개면 availableSections 와 함께 error 반환 (오타 디버깅용)
 *
 * 큰 가이드 (principles 30k+ tokens, admin-cms 등) 를 호출할 때 dos-donts / colors 한 가지만
 * 필요한데 전체를 받게 되던 토큰 사고를 막기 위함.
 */
function pickSections<T extends Record<string, unknown>>(
  full: T,
  sections: string[] | undefined,
): T | { error: string; availableSections: string[] } {
  if (!sections || sections.length === 0) return full;
  // _readyMade: 복붙용 ready-made 트리(예: 캐포비 사이드바 HTML/React). view/sections 와 무관하게
  //   항상 보존 — rules[] 에만 두면 view:'examples'(=['summary','examples'])가 통째로 드롭해
  //   로고/계정/메뉴를 손조립하게 되던 회귀를 차단한다.
  const META_KEYS = new Set([
    "_advisory",
    "_htmlAdvisory",
    "_principlesDigest",
    "_nextSuggestion",
    "_readyMade",
    "intent",
    "scope",
  ]);
  const allKeys = Object.keys(full);
  const matched = sections.filter((s) => allKeys.includes(s));
  if (matched.length === 0) {
    return {
      error: `get_guide: sections ${JSON.stringify(sections)} 가 매칭되지 않습니다.`,
      availableSections: allKeys.filter((k) => !META_KEYS.has(k)),
    };
  }
  const picked: Record<string, unknown> = {};
  for (const k of allKeys) {
    if (META_KEYS.has(k) || matched.includes(k)) picked[k] = full[k];
  }
  picked._sectionsAppliedFrom = allKeys.filter((k) => !META_KEYS.has(k));
  return picked as T;
}

/**
 * 'aspects' → principles 응답의 top-level 키(sections) 별칭 맵.
 *
 * 화면이 실제로 필요한 측면(예: 'radius' · 'spacing' · 'typography')만 친화적 이름으로 고르면
 * pickSections 가 DESIGN_PRINCIPLES 의 해당 블록만 돌려준다. DESIGN_PRINCIPLES 가 이미
 * aspect 별 top-level 키(brandTone/colors/typography/spacing/elevation/shapes/...)로 쪼개져 있어
 * 데이터 재구조화 없이 동작한다. 'radius'→'shapes', 'color'→'colors' 처럼 직관적 이름을 실제
 * 키로 매핑하고, 한 aspect 가 여러 섹션으로 펼쳐질 수 있다(dos-donts → dos+donts+bannedPatterns).
 *
 * 키는 소문자 정규화 후 조회. principles 가 주 대상이지만 sections 로 펼쳐지므로 다른 topic 에도
 * 동일 규칙으로 적용된다(매칭 키가 없으면 pickSections 가 availableSections 와 함께 error).
 */
const ASPECT_TO_SECTIONS: Record<string, string[]> = {
  tone: ["brandTone"],
  "brand-tone": ["brandTone"],
  voice: ["brandTone"],
  color: ["colors"],
  colors: ["colors"],
  colour: ["colors"],
  typography: ["typography"],
  type: ["typography"],
  font: ["typography"],
  text: ["typography"],
  spacing: ["spacing"],
  gap: ["spacing"],
  inset: ["spacing"],
  layout: ["spacing"],
  elevation: ["elevation"],
  shadow: ["elevation"],
  depth: ["elevation"],
  radius: ["shapes"],
  corner: ["shapes"],
  shape: ["shapes"],
  shapes: ["shapes"],
  dos: ["dos"],
  donts: ["donts"],
  "dos-donts": ["dos", "donts", "bannedPatterns"],
  banned: ["bannedPatterns"],
  "banned-patterns": ["bannedPatterns"],
};

/** get_guide({ aspects }) 가 받을 수 있는 친화적 측면 이름 목록(에러 응답용). */
export const GUIDE_ASPECT_NAMES = Object.keys(ASPECT_TO_SECTIONS);

/**
 * view(친화 응답 슬림) → pickSections 용 top-level 섹션 키.
 * 큰 가이드를 배치로 받을 때 metrics/matrixOverrides/references 까지 끌어오지 않도록
 * 'examples'(예시만) / 'rules'(주의·규칙만) 로 슬라이스한다. 'full'/미지정은 슬림 안 함.
 * 명시적 sections 가 우선이므로, 이 함수는 sections 미지정일 때만 호출된다.
 * (_advisory / _htmlAdvisory 같은 메타 키는 pickSections 가 항상 보존.)
 */
function viewToSections(topic: string, view: GuideView): string[] | undefined {
  if (view === "full") return undefined;
  const isPattern = topic.startsWith("pattern:");
  const isComponent = topic.startsWith("component:");
  if (view === "examples") return ["summary", "examples"];
  // view === "rules"
  if (isPattern) return ["summary", "rules", "avoid"];
  if (isComponent) return ["summary", "pitfalls", "recommended"];
  return ["summary", "dos", "donts", "bannedPatterns"]; // principles / dos-donts 등
}

/**
 * 단일 topic 오버사이즈 가드 (2-②a).
 * 배치(topics[])는 slim 기본값이 있지만, 단일 topic 은 기본 view='full' 이라
 * pattern:cashwalk-biz-admin-sidebar(34.7KB·_readyMade 트리) 같은 아웃라이어를 통째로 컨텍스트에 쏟는다.
 * 명시적 슬라이스(view/sections/aspects)가 없고 직렬화 본문이 임계 초과면,
 * 작은 키(summary·_advisory·마커)는 그대로 두고 큰 섹션은 본문을 생략하고 byte 크기만 남긴다.
 * 전체가 필요하면 호출자가 view:'full' 또는 sections:[...] 를 명시한다.
 */
const GUIDE_OVERSIZE_BYTES = 15_000;
const GUIDE_KEEP_KEY_BYTES = 800;

function slimOversizedGuide(
  topic: string,
  result: Record<string, unknown>,
  explicitSlice: boolean,
): Record<string, unknown> {
  if (explicitSlice) return result;
  const json = JSON.stringify(result);
  if (!json || json.length <= GUIDE_OVERSIZE_BYTES) return result;
  const slim: Record<string, unknown> = {};
  const elided: Record<string, number> = {};
  for (const [k, v] of Object.entries(result)) {
    const size = JSON.stringify(v)?.length ?? 0;
    if (k === "summary" || size <= GUIDE_KEEP_KEY_BYTES) slim[k] = v;
    else elided[k] = size;
  }
  slim._oversized = {
    topic,
    totalBytes: json.length,
    elidedSections: elided,
    notice:
      `이 가이드 전체는 ${(json.length / 1024).toFixed(1)}KB 입니다. 큰 섹션은 본문을 생략하고 크기(byte)만 표시했습니다. ` +
      `전체가 필요하면 get_guide({ topic: '${topic}', view: 'full' }), 일부만 필요하면 sections:[...] 또는 aspects 를 지정하세요.`,
  };
  return slim;
}

const DEFAULT_BATCH_PRINCIPLES_SECTIONS = ["colors", "typography", "spacing", "shapes"];

/**
 * topics[] 배치는 "한 번에 많이 가져오기" 경로라 full default 가 토큰을 크게 먹는다.
 * 명시적 sections/aspects/view 가 없을 때만 topic 별 안전한 슬림 기본값을 준다.
 * - component/pattern: 보통 필요한 복붙 예시 중심(examples)
 * - principles/dos-donts/admin-cms 등 fixed topic: examples 키가 없어 에러가 나지 않도록
 *   실제 top-level section 으로 축약
 * - view:'full' 명시 시 기존 full 응답 유지
 */
function defaultBatchArgsForTopic(
  topic: string,
): Pick<Parameters<typeof getGuide>[0], "view" | "sections"> {
  if (topic.startsWith("component:") || topic.startsWith("pattern:")) {
    return { view: "examples" };
  }
  switch (topic) {
    case "principles":
      return { sections: DEFAULT_BATCH_PRINCIPLES_SECTIONS };
    case "dos-donts":
      return { sections: ["dos", "donts"] };
    case "ux-writing":
      return { sections: ["voiceTone", "microcopy", "eapDomain"] };
    case "backoffice":
    case "admin-cms":
      return { sections: ["layout", "searchForm", "table", "forms", "colors"] };
    default:
      return {};
  }
}

/** aspects(친화적 이름)를 pickSections 용 top-level 섹션 키로 펼친다. unknown 은 따로 반환. */
function expandAspects(aspects: string[]): { sections: string[]; unknown: string[] } {
  const sections = new Set<string>();
  const unknown: string[] = [];
  for (const a of aspects) {
    const key = String(a).trim().toLowerCase();
    const mapped = ASPECT_TO_SECTIONS[key];
    if (mapped) mapped.forEach((s) => sections.add(s));
    else unknown.push(a);
  }
  return { sections: [...sections], unknown };
}

/**
 * brand 가 주어지면 SERVICE_OVERLAYS 에서 해당 topic 의 overlay 를 꺼내 머지.
 * brand 미지정 시 _brandVariants 슬림 요약을 첨부 (어느 brand 에 overlay 가 있는지 호출자가 인지하도록).
 *
 * overlay 가 비어 있는 경우 (Pattern 'Overlay 0'): _brandOverlayEmpty 마커만 추가하고 base 그대로 반환.
 *
 * 마커 스코프 주의: '_brandOverlayEmpty: true' 는 'SERVICE_OVERLAYS[brand][topic] 슬롯이 없음'
 * 만을 의미한다. brand-aware metadata (matrixOverrides, brandChrome 등) 는 별도 경로로 여전히
 * 적용될 수 있으므로 "이 brand 에 어떤 brand-specific 데이터도 없음" 으로 읽으면 안 된다.
 * (마커 prefix 컨벤션 통일: _brandApplied / _brandVariants / _brandAwareApplied 와 같은 _brand* 계열)
 */
function applyBrandOverlay(
  topic: string,
  result: Record<string, unknown>,
  brand: BrandSlug | undefined,
): Record<string, unknown> {
  if (brand) {
    const overlay = SERVICE_OVERLAYS[brand]?.[topic];
    if (overlay) {
      const merged = mergeServiceOverlay(result, overlay);
      merged._brandApplied = brand;
      return merged;
    }
    return { ...result, _brandApplied: brand, _brandOverlayEmpty: true };
  }
  const variants = listBrandVariants(topic);
  if (Object.keys(variants).length > 0) {
    return { ...result, _brandVariants: variants };
  }
  return result;
}

/**
 * base.matrixOverrides 는 service overlay 가 아니라 base 안의 brand-aware metadata
 * (Figma 450:68 v2 결정). brand 가 지정되면 해당 brand 의 sizeMatrix/stateMatrix override 를
 * base 매트릭스에 deep merge 하고, dimensions 는 그대로 응답에 노출.
 *
 * raw matrixOverrides map (모든 brand) 은 응답에서 제거 — brand 가 지정됐으면 그 brand 의
 * 적용된 값만 보여주는 게 호출자에게 명확.
 */
function applyMatrixOverrides(
  result: Record<string, unknown>,
  brand: BrandSlug | undefined,
): Record<string, unknown> {
  const all = result.matrixOverrides as
    | Partial<
        Record<
          BrandSlug,
          {
            sizeMatrix?: Record<string, string>;
            stateMatrix?: Record<string, string>;
            dimensions?: Record<string, string>;
          }
        >
      >
    | undefined;
  if (!all) return result;

  if (!brand) {
    const { matrixOverrides: _omit, ...rest } = result;
    const brandsWithOverride = Object.keys(all);
    if (brandsWithOverride.length === 0) return rest;
    return { ...rest, _matrixOverrideBrands: brandsWithOverride };
  }

  const mo = all[brand];
  const { matrixOverrides: _omit, ...rest } = result;
  if (!mo) return rest;

  const merged: Record<string, unknown> = { ...rest, _matrixOverrideApplied: brand };
  if (mo.sizeMatrix) {
    const baseSize = (rest.sizeMatrix as Record<string, string> | undefined) ?? {};
    merged.sizeMatrix = { ...baseSize, ...mo.sizeMatrix };
  }
  if (mo.stateMatrix) {
    const baseState = (rest.stateMatrix as Record<string, string> | undefined) ?? {};
    merged.stateMatrix = { ...baseState, ...mo.stateMatrix };
  }
  if (mo.dimensions) {
    merged.dimensions = mo.dimensions;
  }
  return merged;
}

/**
 * Pattern 'Brand-aware Base' metadata (validPropValues / assetManifest / forcedProps) 처리.
 * BrandHeader (validPropValues + assetManifest) / BrandFooter (forcedProps + assetManifest) 같은
 * brand-aware 컴포넌트가 사용.
 *
 * brand 지정: 해당 brand 의 값만 fold 해서 응답에 노출 (slim).
 * brand 미지정: raw map 그대로 + _brandAwareMetadataBrands 슬림 요약.
 *
 * forcedProps 의 '*' 키는 명시 안 된 brand 의 default 값 (예: footerTone trost=dark, '*'=light).
 */
function applyBrandAwareMetadata(
  result: Record<string, unknown>,
  brand: BrandSlug | undefined,
): Record<string, unknown> {
  const vpvMap = result.validPropValues as
    | Partial<Record<BrandSlug, Record<string, string[]>>>
    | undefined;
  const amMap = result.assetManifest as Partial<Record<BrandSlug, string[]>> | undefined;
  const fpMap = result.forcedProps as
    | Record<string, Partial<Record<BrandSlug | "*", string>>>
    | undefined;
  if (!vpvMap && !amMap && !fpMap) return result;

  if (!brand) {
    const brands = new Set<string>();
    if (vpvMap) Object.keys(vpvMap).forEach((b) => brands.add(b));
    if (amMap) Object.keys(amMap).forEach((b) => brands.add(b));
    if (fpMap) {
      for (const brandMap of Object.values(fpMap)) {
        Object.keys(brandMap).forEach((b) => {
          if (b !== "*") brands.add(b);
        });
      }
    }
    return brands.size > 0
      ? { ...result, _brandAwareMetadataBrands: Array.from(brands).sort() }
      : result;
  }

  const { validPropValues: _vpv, assetManifest: _am, forcedProps: _fp, ...rest } = result;
  const folded: Record<string, unknown> = { ...rest, _brandAwareApplied: brand };

  if (vpvMap) {
    const vpv = vpvMap[brand];
    if (vpv) folded.validPropValues = vpv;
  }
  if (amMap) {
    const am = amMap[brand];
    if (am) folded.assetManifest = am;
  }
  if (fpMap) {
    const fp: Record<string, string> = {};
    for (const [propName, brandMap] of Object.entries(fpMap)) {
      if (brandMap[brand] !== undefined) {
        fp[propName] = brandMap[brand]!;
      } else if (brandMap["*"] !== undefined) {
        fp[propName] = brandMap["*"]!;
      }
    }
    if (Object.keys(fp).length > 0) folded.forcedProps = fp;
  }
  return folded;
}

export function getGuide(args: {
  topic?: string;
  topics?: string[];
  intent?: string;
  target?: GuideTarget;
  /** 응답 슬림(examples/rules/full). 명시적 sections 가 우선. 배치(topics) 토큰 절약의 핵심. */
  view?: GuideView;
  sections?: string[];
  aspects?: string[];
  brand?: BrandSlug;
  /** [backoffice] 서비스 표기명 — 푸터 카피 등 서비스 고유 표기에 주입 (예: 'Runmile'). */
  serviceName?: string;
  /** [principles] 워크스페이스 루트 — designDecisions.jsonl 에서 학습된 원칙을 승격해 머지한다. 기본 MCP 프로세스 cwd. */
  cwd?: string;
}): Record<string, unknown> {
  // aspects(친화적 측면 이름)는 principles 의 slice 어휘(spacing/radius/typography/...)다.
  // 화면이 실제로 필요한 측면만 골라 큰 principles 가이드를 슬림하게 받기 위한 sugar 로,
  // principles 토픽에만 적용한다(컴포넌트/패턴 가이드는 top-level 키 체계가 달라 무의미 → 무시).
  const aspectList = Array.isArray(args.aspects)
    ? args.aspects.filter((a): a is string => typeof a === "string" && a.length > 0)
    : undefined;

  const topics = Array.isArray(args.topics)
    ? args.topics.filter((topic): topic is string => typeof topic === "string" && topic.length > 0)
    : undefined;
  if (topics && topics.length > 0) {
    const hasExplicitSlice =
      args.view !== undefined ||
      (Array.isArray(args.sections) && args.sections.length > 0) ||
      (aspectList && aspectList.length > 0);
    const entries = topics.map((topic) => {
      const batchDefaults = hasExplicitSlice ? {} : defaultBatchArgsForTopic(topic);
      return [
        topic,
        getGuide({
          topic,
          intent: args.intent,
          target: args.target,
          view: args.view ?? batchDefaults.view,
          sections: args.sections ?? batchDefaults.sections,
          aspects: aspectList, // principles 자식에서만 실제 적용된다
          brand: args.brand,
          cwd: args.cwd, // principles 자식에서 학습된 원칙 승격에 사용
        }) as Record<string, unknown>,
      ] as const;
    });
    // ② 배치 보일러플레이트 dedup: 모든 child 에 동일 값으로 들어가는 키(_principlesDigest 등)는
    //    최상위 _shared 로 1회만 올리고 child 에서 제거 — 토픽 수만큼 반복되던 중복 제거.
    const children = entries.map(([, v]) => v);
    const shared: Record<string, unknown> = {};
    // 키를 가진 child(holders)가 2개 이상이고 그 값이 전부 동일하면 _shared 로 hoist 후 제거.
    // 컴포넌트만 갖는 _principlesDigest 처럼 일부 토픽에만 있는 공통 상수도 잡아낸다
    // (패턴은 _principlesDigest 가 없어 'all children' 조건이면 못 잡았던 케이스 보정).
    for (const key of ["_principlesDigest", "_advisory", "_htmlAdvisory"]) {
      const holders = children.filter((c) => key in c);
      if (holders.length < 2) continue;
      const first = JSON.stringify(holders[0][key]);
      if (holders.every((c) => JSON.stringify(c[key]) === first)) {
        shared[key] = holders[0][key];
        for (const c of holders) delete c[key];
      }
    }
    return {
      _advisory:
        "Batch get_guide response. Default batch view is slim; pass view:'full' for full matrices/references. 모든 토픽 공통 값은 _shared 로 한 번만 노출됩니다.",
      ...(Object.keys(shared).length > 0 ? { _shared: shared } : {}),
      topics: Object.fromEntries(entries),
    };
  }

  const topic = args.topic;
  if (typeof topic !== "string" || topic.length === 0) {
    return {
      error:
        "get_guide: pass either 'topic' as a non-empty string or 'topics' as a non-empty string array.",
      availableTopics: listGuideTopics(),
    };
  }

  const target: GuideTarget = args.target === "react" ? "react" : "html";

  // aspects 는 principles 에서만 sections 로 펼친다. 다른 토픽에서는 무시(에러 아님).
  let sections = Array.isArray(args.sections) ? args.sections : undefined;
  let aspectUnknown: string[] = [];
  if (topic === "principles" && aspectList && aspectList.length > 0) {
    const { sections: expanded, unknown } = expandAspects(aspectList);
    if (expanded.length === 0) {
      return {
        error: `get_guide: aspects ${JSON.stringify(
          aspectList,
        )} 를 알 수 없습니다. 화면에 필요한 측면 이름만 고르세요.`,
        validAspects: GUIDE_ASPECT_NAMES,
      };
    }
    sections = [...new Set([...(sections ?? []), ...expanded])];
    aspectUnknown = unknown;
  }

  // ① view → sections sugar. 명시적 sections / (principles) aspects 가 이미 채웠으면 그대로 둔다.
  if ((!sections || sections.length === 0) && args.view && args.view !== "full") {
    sections = viewToSections(topic, args.view);
  }

  // 오버사이즈 가드(2-②a)용 — 호출자가 슬라이스를 명시했는지. 명시했으면 가드 미적용.
  const explicitSlice =
    args.view !== undefined ||
    (Array.isArray(args.sections) && args.sections.length > 0) ||
    (aspectList !== undefined && aspectList.length > 0);

  if (topic.startsWith("component:")) {
    const name = topic.slice("component:".length);
    if (!name) {
      return {
        error: "component:<Name> 형식이어야 합니다. 예: component:Button",
        availableTopics: listGuideTopics(),
      };
    }
    const base = getComponentGuide(name, target) as Record<string, unknown>;
    const withMatrix = applyMatrixOverrides(base, args.brand);
    const withMeta = applyBrandAwareMetadata(withMatrix, args.brand);
    return slimOversizedGuide(
      topic,
      pickSections(applyBrandOverlay(topic, withMeta, args.brand), sections),
      explicitSlice,
    );
  }
  if (topic.startsWith("pattern:")) {
    const name = topic.slice("pattern:".length);
    if (!name) {
      return {
        error: "pattern:<name> 형식이어야 합니다. 예: pattern:cta-group",
        availableTopics: listGuideTopics(),
      };
    }
    const base = getPatternGuide(name) as Record<string, unknown>;
    return slimOversizedGuide(
      topic,
      pickSections(applyBrandOverlay(topic, base, args.brand), sections),
      explicitSlice,
    );
  }

  switch (topic) {
    case "principles": {
      markPrinciplesCalled();
      const picked = pickSections(getDesignPrinciples() as Record<string, unknown>, sections);
      // 일부 aspect 만 오타라 무시된 경우 조용히 떨구지 않고 비치명 마커로 알린다(unknown-brand 경고 패턴 미러).
      if (aspectUnknown.length > 0 && !("error" in picked)) {
        (picked as Record<string, unknown>)._unknownAspects = aspectUnknown;
        (picked as Record<string, unknown>)._validAspects = GUIDE_ASPECT_NAMES;
      }
      // Decision Log → Principles 승격: 이 브랜드 화면에서 반복된 결정을 학습된 원칙으로 머지.
      // 마커 키라 pickSections(섹션 슬라이스) 이후에 붙여 aspects/sections 호출에도 항상 보인다. best-effort.
      if (!("error" in picked)) {
        const learned = buildLearnedPrinciples(args.cwd, args.brand);
        if (learned) (picked as Record<string, unknown>)._learnedPrinciples = learned;
      }
      return picked;
    }
    case "dos-donts":
      return pickSections(getDosAndDonts() as Record<string, unknown>, sections);
    case "ux-writing": {
      const base = getUxWritingGuide() as Record<string, unknown>;
      return pickSections(applyBrandOverlay("ux-writing", base, args.brand), sections);
    }
    case "backoffice":
    case "admin-cms": {
      const guide = getBackofficeGuide({
        intent: args.intent,
        brand: args.brand,
        serviceName: args.serviceName,
      }) as Record<string, unknown>;
      if (topic === "admin-cms") {
        guide._alias = "admin-cms → backoffice (renamed — 'admin-cms' 는 영구 별칭으로 유지)";
      }
      return pickSections(guide, sections);
    }
    case "scope-advisory":
      return pickSections(getScopeAdvisory() as unknown as Record<string, unknown>, sections);
    case "inspector-setup":
      return pickSections(getInspectorSetup() as Record<string, unknown>, sections);
    case "figma-sync":
      return pickSections(listFigmaSyncStatus() as Record<string, unknown>, sections);
    default:
      return {
        error: `Unknown guide topic: '${topic}'.`,
        availableTopics: listGuideTopics(),
      };
  }
}

export function getInspectorSetup() {
  return {
    summary:
      "외부 mockup 프로젝트의 dev 화면 우하단에 floating 버튼을 띄워, DS / antd / native 요소를 색깔별로 outline + 카운트로 시각화. Ctrl/Cmd+Shift+D 토글. dev-only.",
    rationale:
      "AI 생성 화면이 'DS 적용처럼 보이지만 실은 antd/native 잔존' 인지 사용자가 한눈에 검증할 수 있게 함. validate_mockup 의 정적 검증과 보완 — 정적 검증은 코드를, Inspector 는 런타임 DOM 을 봄.",
    package: "@nudge-design/react",
    subpath: "@nudge-design/react/inspector",
    install:
      "이미 @nudge-design/react 가 설치돼 있다면 추가 설치 불필요. subpath export 로 inspector 만 분리되어 있어 tree-shake 가능.",
    setup: {
      file: "src/main.tsx (또는 App.tsx 의 최상단 레벨)",
      action: "DsInspector 를 import 해서 dev 모드에서만 렌더. production 빌드에는 자동 제외.",
      code: `import { DsInspector } from "@nudge-design/react/inspector";

// 기존 App 옆에 dev-only 로 렌더
function Root() {
  return (
    <>
      <App />
      {import.meta.env.DEV ? <DsInspector /> : null}
    </>
  );
}`,
    },
    usage: [
      "dev 화면 우하단 'DS Inspector' 버튼 클릭 (또는 Ctrl/Cmd+Shift+D)",
      "Inspector 패널 펼침: DS(초록) / antd(주황) / native(빨강) 카운트 + 총합 + DS 비율 (%) 표시",
      "'outline 표시' 체크박스 켜면 각 요소에 분류별 outline 표시 (DS=실선 초록, antd=실선 주황, native=점선 빨강)",
      "DS 비율 낮거나 antd/native 가 보이면 → validate_mockup 으로 정적 검증 + 코드 재구성",
    ],
    classification: {
      ds: "className 에 `nds-` prefix → @nudge-design/react 컴포넌트",
      antd: "className 에 `ant-` prefix → antd 컴포넌트 (user-app 에서는 변환 미완료 신호)",
      native: "<button>, <input>, <select>, <textarea>, <form>, <label> 등 raw HTML primitive",
    },
    note: "분류는 DOM className 기반이라 React 컴포넌트 트리가 아니라 *렌더된 결과* 기준입니다. styled-components / emotion 으로 nds-* 클래스를 덮어쓰면 DS 로 인식 안 될 수 있어요.",
  };
}

export type ClaudeMdTemplateVariant = "slim" | "default";

function getSlimClaudeMdTemplate(args: {
  projectName?: string;
  intent?: "user-app" | "backoffice" | "admin-cms" | "html";
  serviceName?: string;
}) {
  const title = args.projectName ? `# ${args.projectName}` : "# Nudge Mockup Workspace";
  if (args.intent === "backoffice" || args.intent === "admin-cms") {
    const serviceNameArg = args.serviceName ? `, serviceName: "${args.serviceName}"` : "";
    return `${title}

## Role

- Build internal backoffice (사내 어드민/CMS) mockups in this external project.
- Do not modify the Nudge Design System repo, publish packages, push git changes, or open DS PRs from here.

## Stack

- Use antd v5 for backoffice screens.
- Do not use @nudge-design/react, @nudge-design/html, @nudge-design/tokens, or @nudge-design/icons in backoffice mockups.
- Check conventions with \`get_guide({ topic: "backoffice"${serviceNameArg} })\`.
- B2B admin services (외부 제공 어드민) are different: only ${DS_ADMIN_BRANDS.join(" / ")} are supported and they are built with the DS, not antd — re-run \`get_setup({ step: "claude-md", intent: "admin", brand: "<slug>" })\` in that case.

## Workflow

1. Read \`get_guide({ topic: "backoffice"${serviceNameArg} })\`.
2. Implement with real antd components, not raw HTML/CSS lookalikes.
3. Run typecheck, then \`dev_server({ action: "start" })\` and open the preview URL in a browser to check it.
4. Build the shareable file with \`build_singlefile_html({})\`.

## Hard Rules

- No hand-written HTML deliverables.
- No direct \`vite build\` as the final export.
- Final deliverable is the single \`dist/index.html\` produced by \`build_singlefile_html\`.
`;
  }

  return `${title}

## Role

- Build vanilla HTML mockups with Nudge DS Web Components in this external project.
- Do not modify the Nudge Design System repo, publish packages, push git changes, or open DS PRs from here.

## Stack

- Use \`@nudge-design/html\` custom elements: \`<nds-*>\`.
- Do not create React/.tsx files and do not import \`@nudge-design/react\`.
- Import tokens/styles/runtime from the HTML setup returned by \`get_setup({ step: "imports", intent: "html" })\`.
- Use shipped DS/component styles first. Custom CSS is only layout glue; do not recreate component visuals that \`@nudge-design/html\` / \`@nudge-design/styles\` already provides.

## Workflow

1. Collect visual references once per mockup task. If the user already answered or \`references.md\` / \`.references/\` exists, do not ask again.
2. Before creating/editing mockup files, do a shallow current-workspace collision check only. If an obvious same-PRD/same-screen folder is found, ask "동일한 기획으로 보이는 작업폴더가 있는데, 새 버전(v2)으로 만들까요?" and stop until the user answers. Do not exhaustive-search and do not modify the existing folder without this answer.
3. Read \`references.md\` before implementation and write a short visual plan: which good cues to apply, which bad cues to avoid.
4. Use MCP-bundled references from \`get_guide\` first as the DS baseline: \`figmaNodeUrl\`, \`references[]\`, and \`imageAbsolutePath\`.
5. For component examples, call \`get_guide({ topic: "component:<Name>", target: "html" })\`. **For brand-specific screens (task slug \`<brand>-<screen>\` exposes the brand), pass \`brand: "trost" | "geniet" | "nudge-eap" | "cashwalk-biz"\`** — service overlay, matrixOverrides spec, and brand-aware metadata fold into the response under \`_brandApplied\` / \`_matrixOverrideApplied\` / \`_brandAwareApplied\`. Without \`brand\` you only get \`_brandVariants\` (slim summary of which brands have overlays).
6. Use \`get_guide({ topic: "principles" })\` and relevant \`pattern:<name>\` guides only as needed. Keep calls small: pass \`aspects\` for the principle slices this screen needs (e.g. \`get_guide({ topic: "principles", aspects: ["spacing","radius","typography","color"] })\`), or \`sections\` for arbitrary top-level keys.
7. Write root \`index.html\` with real \`<nds-*>\` elements.
8. Run \`validate_html_mockup({ filePath: "index.html" })\`; fix until violation count is 0. A clean pass automatically includes DS adoption stats (\`stats.counts.dsRatio\`) — no separate \`withStats\` call needed.
9. Run \`dev_server({ action: "start" })\` and open the preview URL in a browser to check it.
10. Build the shareable file with \`build_singlefile_html({})\`.

## Completion Gate

- Mockups must visibly include DS MCP/package version and DS component usage/adoption status. Use the MCP-reported \`dsUsageSummary\` / \`humanReadable\` value as the source of truth; do not hand-count components.
- Before final response, report which MCP-bundled reference cues and \`references.md\` good/bad cues were applied to layout, spacing, typography, color, and content density.
- Before final response, report spacing status, remaining text-symbol-as-icon issues, and any requested scope left unfinished.
- Before final response, confirm whether the Google Sheets usage POST was sent: \`webhook ok\`, \`webhook queued(...)\`, or \`webhook skipped\`.
- Final response must include the final artifact full absolute path (for example \`/Users/.../dist/index.html\`). Relative paths like \`dist/index.html\` alone are not enough.
- These checks intentionally repeat validator/tool rules. Do not omit them because similar guidance already exists elsewhere.

## Hard Rules

- Do not hand-write a standalone export. The final deliverable is \`dist/index.html\` from \`build_singlefile_html\`.
- Do not use raw \`button\`, \`input\`, \`select\`, or \`textarea\` unless intentionally wrapped/allowed.
- Do not hand-build sidebar/footer/header with raw landmarks when \`<nds-sidebar>\`, \`<nds-footer-*>\`, or \`<nds-header>\` can represent it.
- Do not use inline emoji, decorative text symbols, gradients, raw hex/rgb colors, or arbitrary spacing.
- Do not use text like \`x\` / \`×\` as an icon. Use \`find_icon\` and prefer brand-specific icons first.
- Bind interactions in JS with \`addEventListener\`; avoid inline \`onclick\`.
- For \`nds-input\`, \`nds-textarea\`, and \`nds-select\`, read change event detail or the inner native control value; do not assume the host attribute is live during typing.
- Keep detailed rules out of this file. Fetch them on demand with \`get_guide\`.
`;
}

export function getClaudeMdTemplate(args: {
  projectName?: string;
  intent?: "user-app" | "backoffice" | "admin-cms" | "html";
  template?: ClaudeMdTemplateVariant;
  /** [backoffice] 서비스 표기명 — 푸터 카피 등 서비스 고유 표기에 주입. */
  serviceName?: string;
}) {
  if (args.template !== "default") return getSlimClaudeMdTemplate(args);

  const title = args.projectName ? `# ${args.projectName}` : "# Nudge Mockup Workspace";

  if (args.intent === "html") {
    return `${title}

## ⛔ FIRST RESPONSE GATE — 모든 작업 이전에 (예외 없음)

**이 워크스페이스에서 사용자의 첫 화면-만들기 요청을 받은 직후, 다른 어떤 행동보다 먼저:**

### Step 1. 첫 응답에 반드시 이 질문을 그대로 포함하고 응답을 종료한다

> "시각 기준으로 쓸 Figma 링크나 스크린샷이 있을까요? 가능하면 **정답 1-2장**, **피해야 할 오답 1-2장**에 각각 1줄 캡션을 붙여 주세요. 이미 첨부하신 자료를 기준으로 진행해도 될지도 함께 알려 주세요."

### Step 2. 사용자 답변을 받기 전까지 다음을 절대 하지 않는다

- ❌ \`find_component\` / \`find_icon\` / \`find_token\` / \`get_guide(topic:component:*)\` / \`get_guide(topic:pattern:*)\` 호출
- ❌ 어떤 \`.html\` / \`.ts\` / \`.tsx\` / \`.css\` 파일 작성 또는 edit
- ❌ 코드 outline, pseudo-code, 컴포넌트 트리 스케치 — 머릿속 설계도 글로 풀어내지 말 것
- ❌ "일단 골격만 만들고 나중에 디테일 맞추겠다" / "PRD 에 디자인 톤이 있으니 그걸 기준으로" / "auto-mode 니까 빠르게" — 전부 거부 사유

### Step 3. 기존 작업폴더 충돌을 얕게 확인한다 (hard gate)

- 답변을 받은 뒤 파일을 만들거나 수정하기 전에, 현재 워크스페이스의 바로 보이는 폴더명/파일명만 확인한다. 같은 PRD/같은 화면으로 보이는 작업폴더가 **명백히** 있으면 반드시 질문하고 중단:

> "동일한 기획으로 보이는 작업폴더가 있는데, 새 버전(v2)으로 만들까요?"

- 사용자가 답하기 전까지 기존 폴더의 파일을 수정하지 않는다.
- 억지로 찾지 않는다. 전체 디스크 검색, 깊은 재귀 탐색, 오래 걸리는 유사도 검색은 금지. "보이면 묻고, 안 보이면 진행"이다.

### Step 4. 답변을 받으면 \`references.md\` (워크스페이스 루트) 에 즉시 기록

\`\`\`
# references.md
task: <brand>-<screen-slug>    ← ★ 필수 첫 줄. 예: task: geniet-diary-hub
[good] source=<figma-url|image-name> caption=<1줄 reason>
[good] ...
[bad] source=... caption=...
\`\`\`

\`source\` 로 허용되는 것: **Figma URL** (\`figma.com/...\`) 또는 **이미지 파일** (\`.png/.jpg/.jpeg/.webp/.gif/.svg\`). **PRD/spec/요구사항 \`.md\` 파일은 source 로 인정되지 않음** — 텍스트 문서는 spec 이지 visual reference 가 아니다.

### 예외 (4 가지만)

1. 사용자가 첫 메시지에 Figma 링크/스크린샷을 **명시적으로** 첨부했고, **추가 레퍼런스가 필요 없다고 명시**한 경우 → 그 자료만으로 \`references.md\` 작성하고 진행.
2. 같은 목업 작업에서 이미 질문했고 사용자가 답했거나, 워크스페이스에 유효한 \`references.md\` / \`.references/\` 가 있고 **\`task:\` 첫 줄이 현재 task 와 일치**하는 경우 → 다시 묻지 말고 읽어서 적용. (이전 task 의 stale references.md 는 없는 것으로 간주, 반드시 다시 질문)
3. 화면-만들기 요청이 아닌 경우 (e.g., 코드 리뷰, 버그 수정, 설정 변경). 이 경우 일반 흐름으로 진행.
4. 사용자가 명시적으로 "레퍼런스 없이 진행" 이라고 지시 → 사용자에게 "MCP 의 visual-reference 가드가 무력화되며, 톤/디테일이 어긋날 가능성이 있다" 라고 먼저 경고 후 진행.

### 흔한 우회 패턴 (모두 무효 — 절대 따라가지 말 것)

이 6가지는 실제 사용자 회고에서 게이트 우회 사유로 잡힌 사례다:

1. **stale-references-md** — 이전 task 의 \`references.md\` 가 남아 있음 → "이미 답변 받음" 으로 오인. **Fix:** \`task:\` 슬러그 비교, 다르면 stale 처리하고 다시 질문.
2. **prd-as-visual** — PRD 에 ASCII 레이아웃·컬러 스펙이 있어서 "이게 사실상 visual reference" 라고 자체 합리화. **Fix:** 텍스트 ≠ 시각자료. Figma 노드 또는 이미지 파일이 필요.
3. **decisive-tone** — 사용자 어조 ("바로 만들어줘" / "PRD 지켜서") 를 "묻지 말라" 로 오독. **Fix:** 어조는 게이트 우회 사유가 아님.
4. **soft-prompt-misread** — 가이드 응답의 "soft prompt" 표현을 "skip 해도 되는 권고" 로 약화 해석. **Fix:** 이 게이트는 REQUIRED. soft 가 아님.
5. **checklist-omission** — 메모리/체크리스트에 후반 단계만 있고 이 게이트는 빠져 있어서 advisory 로 격하. **Fix:** 이 게이트는 다른 모든 체크리스트보다 먼저 실행.
6. **same-folder-overwrite** — 새 목업 요청인데 같은 기획으로 보이는 기존 폴더를 발견하고도 확인 없이 수정. **Fix:** 얕게 발견된 경우 반드시 v2 생성 여부를 묻고 답변 전 기존 폴더를 수정하지 않는다.

### 왜 이 게이트가 필요한가

- PRD 본문만 보고 바로 코드 → 톤·픽셀 디테일 (별점 크기, 카드 간격, 헤더 위계) 불일치 → 5+ 라운드 재작업
- Auto-mode 는 **clarifying question 을 줄이는 룰**이지, **절차를 건너뛰는 룰이 아님**
- 빌드 타임의 \`missing-visual-references\` audit 는 이미 일이 다 끝난 후라 너무 늦음 — 이 게이트가 작업 시작 시점의 안전망

**이 게이트를 어기고 작업한 결과물은 사용자가 거절할 수 있으며, MCP 가이드 모든 룰 위반 중 가장 자주 발생하는 위반이다.**

---

## 역할 경계 (먼저 읽을 것)

- 이 프로젝트의 역할은 **별도 vanilla HTML 목업 프로젝트 빌드 + <nds-*> 목업 생성**이다.
- **하지 말 것**: Nudge DS 레포 자체 수정, DS 코드의 git commit/push, GitHub 레포 변경, npm publish, 패키지 버전 bump.
- 사용자가 "DS 컴포넌트를 고쳐줘 / 레포에 푸시해줘 / PR 만들어줘" 같이 요청하면, **이 프로젝트의 역할이 아님을 알리고 DS 레포에서 직접 작업하라고 안내**할 것.

## 분기 — 이 프로젝트는 vanilla HTML / Web Component 목업이다

- 사용 라이브러리: **@nudge-design/html** (vanilla Web Components) + @nudge-design/tokens + @nudge-design/icons
- 템플릿: **Vite vanilla-ts** (\`npm create vite@latest -- --template vanilla-ts\`). React 의존성 없음.
- **금지**: \`@nudge-design/react\` 어떤 형태로도 import 하지 말 것. .tsx 파일 작성 금지.
- nudge-ds MCP는 이 도구들로 작업:
  - \`get_guide({ topic: "principles" })\` / \`get_guide({ topic: "dos-donts" })\` — DS 원칙
  - \`get_guide({ topic: "component:<Name>", target: "html" })\` — <nds-*> form 의 do/dont 예시
  - \`get_guide({ topic: "component:<Name>", target: "html", brand: "trost|geniet|nudge-eap|cashwalk-biz" })\` — brand 별 변형 자동 적용. 응답에 \`_brandApplied\` (service overlay), \`_matrixOverrideApplied\` (spec 차이), \`_brandAwareApplied\` (validPropValues/assetManifest/forcedProps) 메타로 어느 layer 가 적용됐는지 명시. brand 미지정 호출은 \`_brandVariants\` 슬림 요약 첨부 — 어느 brand 에 overlay 가 있는지 확인 후 다시 호출. **task 슬러그가 brand 를 알려주면 (예: \`task: geniet-diary-hub\`) 컴포넌트 가이드 호출 시 \`brand: "geniet"\` 같이 지정.**
  - \`get_guide({ topic: "pattern:<name>" })\` — 패턴 가이드 (cta-group, dark-patterns 등)
  - \`find_component\` / \`find_icon\` / \`find_token\` — DS 자산 조회
  - \`find_asset({ query, brand })\` — **브랜드 이미지**(음식·일러스트·프로필·대회 포스터 등) 검색 → \`inlineRef\` 를 \`<img src>\` 에 박으면 base64 inline. 이미지 필요 시 **먼저 호출**. 에셋에 없으면 placeholder + '에셋 없음' 주석, 브랜드 이미지 AI 생성 금지.
  - \`validate_html_mockup({ filePath })\` — HTML 정적 검증 (위반 0 통과 시 채택 비율 \`stats.counts.dsRatio\` 자동 동봉)
  - \`dev_server({ action: "start" })\` / \`dev_server({ action: "stop" })\` — dev 서버 미리보기 (URL 을 브라우저에서 직접 확인)
  - \`build_singlefile_html\` — vanilla HTML 워크플로우도 1급 지원. inline 산출물 1개 \`.html\` (JS · CSS · nds-* runtime 전부 inline) 로 디자이너/PM 에게 dnd 전달 가능.

## 산출물 형식 강제 (MUST — 우회 절대 금지)

이 워크스페이스의 **유일하게 허용된 작업 흐름**:

  시각 레퍼런스 수집 → root \`index.html\` 에 \`<nds-*>\` 작성 → \`validate_html_mockup\` 통과 → \`build_singlefile_html\` → \`dist/index.html\` (단일 파일)

**아래는 발견 즉시 작업 중단 + 사용자에게 보고 사유. 어떤 변명으로도 우회 금지:**

1. **시각 레퍼런스 확인 전 코드 작성 금지.** 프롬프트에 이미지/Figma 링크/스크린샷이 이미 있어도 **첫 응답에서 한 번만 사용자에게 질문**: *"시각 기준으로 쓸 Figma 링크나 스크린샷이 있을까요? 이미 첨부하신 자료를 기준으로 진행해도 될지, 추가로 정답/오답 레퍼런스가 있으면 함께 알려 주세요. 가능하면 정답 1-2장, 피해야 할 오답 1-2장에 각각 1줄 캡션을 붙여 주세요."* 같은 목업 작업에서 이미 답변을 받았거나 \`references.md\` / \`.references/\` 가 있으면 다시 묻지 말고 읽어서 적용한다. 받은 응답은 \`references.md\` 에 저장. 구현 전 \`references.md\` 를 읽고 good 기준은 레이아웃/간격/타이포/컬러 의사결정으로 매핑하고, bad 기준은 명시적 회피 규칙으로 적은 뒤 작업한다. 자세한 룰: \`get_guide({ topic: "pattern:visual-reference" })\`.
2. **같은 기획 기존 폴더 발견 시 v2 확인 필수.** 새 목업 요청에서 파일 생성/수정 전 현재 워크스페이스를 얕게 보고, 같은 PRD/같은 화면으로 보이는 작업폴더가 명백히 있으면 반드시 *"동일한 기획으로 보이는 작업폴더가 있는데, 새 버전(v2)으로 만들까요?"* 라고 묻고 답변 전까지 기존 폴더를 수정하지 않는다. 억지로 찾지 말 것(깊은 재귀/전체 디스크/유사도 검색 금지). 하지만 보였는데도 묻지 않는 것은 hard rule 위반.
3. **\`.tsx\` 파일 작성 금지.** 이 워크플로우는 React 가 없다. JSX 가 필요하면 intent 를 'user-app' 으로 바꿔 다른 워크스페이스에서 작업하라고 안내. \`<Button color="primary">\` 처럼 PascalCase + JSX 컨테이너 prop 패턴이 나타나면 즉시 \`<nds-button color="primary">\` (kebab-case attribute) 로 교체.
4. **\`<nds-*>\` 흉내 금지 — raw \`<button class="nds-button">\` 으로 시각만 따라 그리기 X.** 반드시 \`<nds-button>\` 같은 실제 custom-element 를 쓸 것. main.ts 의 \`import "@nudge-design/html/runtime"\` 한 줄로 모든 element 가 등록된다.
5. **이벤트는 inline \`onclick="..."\` 대신 \`addEventListener\`.** \`document.querySelector("nds-select").addEventListener("select-change", e => …)\` 패턴. WC 가 dispatch 하는 커스텀 이벤트(\`nds-*-change\`, \`select-change\`, \`tabs-change\` 등) 사용. 자세한 이벤트명은 \`get_guide({ topic: "component:<Name>", target: "html" })\` 응답의 examples.do/dont 참고.
6. **버튼은 반드시 동작해야 한다.** 모든 활성 \`<nds-button>\` / 버튼형 컴포넌트에는 \`data-action\` 또는 \`id\` 를 붙이고, \`addEventListener("click", ...)\` 에서 실제 상태 변경(모달 열기, 선택 적용, 단계 이동, 토스트/라이브 영역 피드백, 값 초기화 등)을 구현한다. 장식용 버튼 금지. \`validate_html_mockup\` 의 \`button-without-interaction\` 룰이 버튼별로 잡는다.
7. **PRD/brief 일부 구현 금지.** 코드 작성 전에 사용자 PRD/brief 의 명시 요구사항을 전부 분해하고, \`index.html\` 에 \`<script type="application/json" data-prd-coverage>{"requirements":[...]}</script>\` 로 남긴다. 각 항목은 \`status:"implemented"\` 와 실제 DOM \`evidence\` selector 를 가져야 한다. \`build_singlefile_html\` 은 매니페스트 누락을 \`missing-prd-coverage\` 로 막고, 최종 응답의 \`prdValidation\` 또는 별도 \`validate_prd_coverage\` 가 미완료/증거 누락을 실패시킨다. DS 품질 점수(\`validate_html_mockup\`)와 PRD 커버리지 verdict 는 분리해서 본다.
8. **\`.css\` 안에 시멘틱 토큰 인라인 재정의 금지.** \`:root { --semantic-*: ...; --nds-*: ...; --color-*: ...; --gap-*: ...; --inset-*: ... }\` 같은 인라인 정의는 \`@nudge-design/tokens/css\` 의 단일 진리원천을 깨는 우회. 토큰은 \`main.ts\` 에서 \`import "@nudge-design/tokens/css"\` 한 줄로만 가져온다.
9. **산출물은 반드시 \`build_singlefile_html\`.** raw \`vite build\` 결과의 다중 파일 \`dist/\` 폴더로 끝내지 말 것. 디자이너/PM 에게 공유 가능한 표준 산출물은 \`vite-plugin-singlefile\` 로 inline 된 \`dist/index.html\` 1개 파일이다. MCP 가 vite.config 패치 + 빌드까지 자동 수행한다.

**우회 자가 감지 체크리스트 — 작업 시작 직후 + 완료 직전 둘 다 통과해야 한다:**

- [ ] 워크스페이스 루트에 \`references.md\` 가 존재하고, 정답/오답 시각 기준이 캡션과 함께 적혀 있다.
- [ ] 새 목업 요청에서 같은 기획으로 보이는 기존 작업폴더가 명백히 보이면 v2 생성 여부를 물었고, 답변 전 기존 폴더를 수정하지 않았다.
- [ ] 구현 전 \`references.md\` 를 읽고 good/bad 기준을 실제 레이아웃·간격·타이포·컬러 결정에 반영했다.
- [ ] root \`index.html\` 이 존재하고 \`<nds-*>\` custom-element 를 1개 이상 사용한다.
- [ ] \`src/\` 에 \`.tsx\` 파일이 없다 (\`.ts\` + 필요 시 \`.css\` 만).
- [ ] \`@nudge-design/react\` 가 어떤 \`.ts\` / \`.html\` 에서도 import / 참조되지 않는다.
- [ ] \`src/\` 의 \`.css\` 어디에도 \`:root { --semantic-* / --nds-* / --color-* / --gap-* / --inset-* }\` 인라인 정의가 없다.
- [ ] 모든 DS 사용처는 \`<nds-*>\` custom-element 이다 (\`<button class="nds-button">\` 같은 className 흉내 없음).
- [ ] 모든 활성 버튼/CTA 는 \`data-action\`/id 와 \`addEventListener("click", ...)\` 로 실제 화면 상태 변경을 만든다.
- [ ] PRD/brief 의 명시 요구사항이 \`data-prd-coverage\` JSON 에 전부 있고, 각 항목의 evidence selector 가 실제 DOM 에 존재한다.
- [ ] main.ts 가 \`import "@nudge-design/html/runtime"\` 을 포함한다.

위 항목 중 하나라도 어긋나면 **HTML 을 폐기하고 처음부터 다시 작성**. 사용자가 명시적으로 허용한 경우에만 예외이며, 이 경우에도 "validate_html_mockup (withStats 채택률 포함) 검증이 무력화됩니다" 라고 먼저 경고할 것.

## 작업 원칙

- 이 프로젝트는 Nudge Design System 의 vanilla HTML 패키지(@nudge-design/html) 기반 목업 워크스페이스다.
- DS 컴포넌트/아이콘/토큰을 추측해서 사용하지 말고, MCP 도구로 확인한 뒤 사용한다.
- 구현 완료의 기준은 코드 작성이 아니라 실제 dev 화면이 에러 없이 렌더링되는 것이다.
- raw \`button\`, \`input\`, \`select\`, \`textarea\` 는 특별한 이유가 없으면 사용하지 않는다 — 대신 \`<nds-button>\` / \`<nds-input>\` / \`<nds-select>\` / \`<nds-textarea>\` 사용.

## 도구 사용 규칙

### 가이드 호출 순서 (토큰 절약 — 절대 한꺼번에 풀-fetch 하지 말 것)

가이드를 12개씩 병렬로 미리 받지 말 것. 컨텍스트 윈도우가 빨리 차서 후반 작업이 막힘.
다음 단계별 호출만 허용:

1. **§1 작업 시작 (필수 2개)**: \`get_guide({ topic: "principles" })\` + \`get_guide({ topic: "pattern:visual-reference" })\`. 이것만 받고 outline 작성.
1-bis. **§1-bis (복잡/다단계 화면이거나 사용자와 구성 합의가 필요할 때 — 단, 캐포비 어드민은 항상 필수)**: 코드 작성 전에 \`save_design_spec\` 으로 경량 DesignSpec(컴포넌트 트리 + 시멘틱 토큰 '이름' + 결정 근거, 좌표·hex 금지)을 만든다. \`ok:true\` 가 되면 사용자에게 한 번 보여주고 동의를 받은 뒤 빌드로 진행(soft gate). 단순 단일 화면이면 생략하고 바로 §2.
    - ⛔ **캐포비(cashwalk-biz) 어드민 화면은 복잡도와 무관하게 \`save_design_spec\` 필수 — 생략 금지.** cashwalk-biz admin 은 \`validate\` 가 5종 Page Pattern(Onboarding/Dashboard/List/Detail/Form) 선언을 hard error 로 강제한다(\`screen.surfaceKind: "admin"\` + \`screen.pagePattern\`). 게다가 \`build_singlefile_html\` 도 design-spec.json(유효 \`pagePattern\` 선언) 이 없으면 \`cashwalk-biz-admin-missing-design-spec\` 로 **빌드를 막는다**(\`allowIncomplete:true\` 로만 우회). spec 을 건너뛰면 이 화면-분류 게이트도 통째로 건너뛰어 어드민 일관성이 깨진다. 코드 전에 먼저 분류부터: \`get_guide({ topic: "pattern:cashwalk-biz-page-patterns" })\`.
    - 룰·스키마: \`get_guide({ topic: "pattern:design-spec" })\`.
2. **§2 outline 작성 중 (사용 컴포넌트가 정해질 때마다 1개씩)**: \`get_guide({ topic: "component:<Name>", target: "html" })\` — outline 에서 실제로 쓸 컴포넌트만, 한 번에 1개.
3. **§3 outline 의 특정 패턴이 모호할 때만**: \`get_guide({ topic: "pattern:<name>" })\` — \`cta-group\` / \`notice\` / \`action-row\` 등 정말 필요한 패턴만.
4. **§4 작성 후 검증 직전 (필수 1개)**: \`get_guide({ topic: "dos-donts" })\`.

가이드를 더 받기 전에 항상 자문: "지금 outline 의 어느 줄을 막고 있길래 이 가이드가 필요한가?" 답이 안 나오면 호출하지 말 것.

### 기본 도구 사용

- **목업 작업을 시작하기 전 반드시 \`get_guide({ topic: "principles" })\` 호출** — 브랜드 톤·컬러 시멘틱·타이포·스페이싱·금지 패턴 로드.
- **모든 mockup 작업은 시각 레퍼런스 수집부터 시작.** \`get_guide({ topic: "pattern:visual-reference" })\` 로 룰 확인.
- 컴포넌트 사용 전 \`find_component({ query })\` → \`get_guide({ topic: "component:<Name>", target: "html" })\` 호출. \`target: "html"\` 을 반드시 명시 — examples.do / examples.dont 가 \`<nds-*>\` form 으로 교체된다. 빠뜨리면 React JSX 예시가 반환됨 (이 워크플로우에선 무용지물).
- 아이콘은 \`find_icon({ query })\` 로 검색 후 \`@nudge-design/icons\` 의 인라인 SVG 사용. 이모지·텍스트 기호 금지 (\`validate_html_mockup\` 의 emoji-banned / text-symbol-banned 룰).
- **사용자 노출 텍스트는 작성 전 \`get_guide({ topic: "ux-writing" })\` 호출** — 해요체·능동형·EAP 도메인 톤.
- 목업 \`.html\` 작성 직후 반드시 \`validate_html_mockup({ filePath })\` 호출. 위반 0건 될 때까지 수정 후 재실행.
- 위반 0건 통과 응답에는 채택 비율 stats 가 자동 동봉된다(별도 withStats 호출 불필요). \`stats.counts.dsRatio\` 가 낮거나 native(\`<button>\` 등) 잔존이 있으면 \`convert_html_to_ds_html\` 호출 또는 손으로 교체.
- 구현 후 \`dev_server({ action: "start" })\` 로 dev 서버 실행.
- dev URL 응답하면 브라우저에서 직접 열어 런타임 에러, unknown custom-element 경고, 빈 화면 여부 확인.
- 완료 전 \`get_guide({ topic: "dos-donts" })\` 로 최종 sanity check.
- 작업 종료 시 \`dev_server({ action: "stop" })\` 로 종료.
- **★ 유저가 DS 선택을 교정/지적하면 — 고치기 직전에 \`log_feedback\` 을 먼저 호출한다 (예외 없음).** 트리거 = "이거 틀렸어 / 아니야 / 왜 이래 / 이거 말고 / 저거 맞아? / 시안이랑 달라 / 색·간격·컴포넌트·variant 가 잘못됐다" 류의, **DS 자체에 대한 교정**. 흐름은 항상 _먼저 \`log_feedback({ text, category, target, brand })\` → 그 다음 수정_. 고치고 나서 잊지 말 것 — 수정에 몰입해 로깅을 건너뛰는 게 가장 흔한 누락이다. (일반 작업 지시 "다음 화면 만들어줘" 는 해당 없음 — DS 가 틀렸다는 신호일 때만.)

## UI 구현 규칙

- 가능한 한 DS 컴포넌트(\`<nds-*>\`) 를 우선 사용한다.
- **★ 헤더/푸터 손수 조립 금지 — 사용자 앱 화면이면 무조건 \`<nds-brand-header brand='trost|geniet|nudge-eap|cashwalk-biz|runmile' surface='web|mobile|webview' active-key='...' asset-base-url='/assets'>\` + \`<nds-brand-footer brand='...' surface='web|app' asset-base-url='/assets'>\` 부터.** 로고 / 메뉴 라벨·href / auth 버튼 / 사업자 정보 / copyright 전부 BRAND_DATA 에서 자동. nds-header / nds-header-logo / nds-header-menu(-item) / nds-header-actions / nds-header-auth-button 를 직접 박는 건 안티패턴. \`get_guide({ topic: "component:BrandHeader", target: "html" })\` 로 브랜드별 필요 로고 파일 (\`public/assets/brand/{brand}/logos/*\`) 확인. **컴포넌트 파일 이름이 generic 해서 (\`nds-brand-chrome\`) find_component 결과만 보고 못 짚는 함정 — BrandHeader/BrandFooter 가이드를 먼저 호출하라.**
- **모든 버튼은 동작한다.** 클릭 후 아무 변화가 없는 버튼은 산출물 결함이다. 필터/탭/모달/선택 피커/초기화/저장/다음/이전/삭제 버튼은 실제 DOM 상태를 바꿔야 하고, 단순 데모 CTA 도 aria-live 피드백이나 모달/상태 텍스트를 갱신해야 한다.
- **DS 뱃지 숫자는 직접 세지 말 것.** \`build_singlefile_html\` 이 산출된 \`dist/index.html\` 기준으로 \`data-ds-badge\` 텍스트를 최신 \`dsUsageSummary\` 로 자동 치환한다. 원본에 임시 숫자를 넣어도 최종 산출물은 build 응답 값을 SSOT 로 삼는다.
- **기존 antd/HTML 코드를 받았을 때 className 만 치환하지 말 것**. \`<button class="nds-button">\` 은 nds-button 흉내일 뿐 실제 Web Component 가 아님 — 반드시 \`<nds-button>\` 으로 element 자체를 바꾼다.
- raw \`button\`, \`input\`, \`select\`, \`textarea\` 는 특별한 이유 없으면 사용하지 않는다. \`validate_html_mockup\` 의 \`native-form-element-without-nds-wrapper\` 룰로 자동 검출됨.
- **이모지·텍스트 기호 절대 금지**. 라벨/제목/empty state 어디에도 이모지(😀 🔥 ⭐ ✅ ⚠️) / 기호(→ ← ✓ ★ •) 박지 말 것. 아이콘이 필요하면 \`find_icon\` 으로 \`@nudge-design/icons\` 에서 찾고, 없으면 인라인 SVG.
- **스타일은 처음부터 클래스/CSS 로 — 인라인 \`style="…"\` 속성을 흩뿌리지 말 것.** 색·간격은 인라인 hex/rgb/px 대신 DS 토큰(\`var(--semantic-* )\` / \`var(--semantic-gap-* )\` / \`var(--semantic-inset-* )\`)을, 반복 스타일은 \`<style>\`/클래스로 한 곳에 모은다. 인라인으로 흩뿌리면 시각 피드백마다 HTML 을 다시 손대 재작성·재검증 라운드가 늘어난다(클래스-퍼스트가 편집 사이클·토큰 소모를 줄인다).
- 인라인 SVG를 직접 만들기보다 \`@nudge-design/icons\` 아이콘을 사용한다.
- **아이콘 선택 필수 우선순위**: 브랜드 전용 > NudgeEAP 기본 > MockupLinear/Bold > 자체 SVG.
- 그라데이션, 과한 장식 배경, 중첩 카드 구조는 피한다.
- 우측 화살표 아이콘은 대표 전진 CTA 1개에만 사용하고 반복 CTA 에 붙이지 않는다.
- primary solid 버튼은 한 화면에 1개만.
- 모든 클릭 가능한 \`<nds-*>\` 는 main.ts 의 \`addEventListener\` 로 동작을 갖는다 — 단순 시각 데모라도 빈 핸들러 OK.

## 검증 루프

1. DS 원칙 확인: \`get_guide({ topic: "principles" })\`.
2. 필요한 컴포넌트/아이콘/토큰 검색 (\`find_component\` / \`find_icon\` / \`find_token\`).
3. 필요한 UX 패턴 확인: \`get_guide({ topic: "pattern:<name>" })\`.
4. \`get_guide({ topic: "component:<Name>", target: "html" })\` 로 do/dont 예시 확보.
5. 목업 \`.html\` 작성 (\`src/mockups/<이름>.html\` 또는 \`index.html\`).
6. \`validate_html_mockup({ filePath })\` 실행. 위반 0건 될 때까지 수정 후 재실행. **응답의 violations[] 와 rule 별 카운트를 사용자에게 그대로 보여줄 것.** **한 라운드에서 잡힌 violation 은 반드시 한 번에 모아서 fix** — 1건 fix → 재실행 → 또 1건 잡힘 패턴 금지 (불필요한 라운드 + 토큰 낭비). 단 validation 호출 자체를 줄여서 라운드 수를 인위적으로 깎지는 말 것 — 최종 clean pass 는 무조건 확인.
6-bis. **2회 self-check 강제** — 위반이 0건이 됐어도 \`validate_html_mockup\` 을 한 번 더 호출해 새로 들어온 위반이 없는지 확인.
7. 위반 0건 통과 응답에 자동 동봉된 \`stats.counts.dsRatio\` 와 \`stats.recommendations[]\` 를 사용자에게 보여주고, native 잔존이 있으면 \`convert_html_to_ds_html\` 호출. (별도 withStats 호출 불필요 — 6-bis 응답에 이미 들어 있다.)
8. \`dev_server({ action: "start" })\` 실행.
9. dev URL 을 브라우저에서 직접 열어 런타임 오류 확인 및 수정. unknown custom-element 경고는 main.ts 의 runtime import 누락 신호.
10. \`get_guide({ topic: "dos-donts" })\` 로 최종 확인.
11. **\`build_singlefile_html\` 호출 → \`dist/index.html\` 1개 파일 산출**. 결과 humanReadable 을 사용자에게 그대로 보여줄 것 (\`[OK] dist/index.html (NN KB, Ms)\`). MCP 가 intent='html' 을 자동 감지해 \`vite-plugin-singlefile\` 설치 + vite.config 패치 + 빌드까지 수행. 산출물 1개 파일이 메신저 dnd / 첨부로 공유 가능. 응답의 \`dsUsageSummary\` (예: \`DS@0.1.10 · DS 12 (45%)\`) 를 \`<footer>\` 안에 visible 하게 렌더 — \`<span data-ds-badge>...</span>\` 형태. (HTML 주석만으로는 디자이너/PM 이 어떤 DS 버전인지 확인 불가)
12. **반드시 \`validate_html_mockup({ filePath: 'dist/index.html', report: true })\` 호출** — build 응답의 \`humanReadable\` 첫 줄 NEXT STEP 라인을 따라 즉시 실행. (vanilla HTML 워크스페이스는 정적 파일이 곧 렌더 결과라 \`filePath\` 그대로 OK.) 사용자에게 묻지 말고 그냥 실행. 이 호출은 (a) DS 사용량을 구글시트에 적재하고 (b) 마지막 위반 검사를 수행. 빠뜨리면 운영팀이 채택 비율 추적 불가 + ds-badge-missing / emoji-banned 같은 마지막 위반이 산출물에 그대로 남음.
13. 사용자에게 dev 서버 URL 또는 \`dist/index.html\` 의 **full 절대경로**를 명확히 전달. 상대경로만 쓰지 말 것. 검토를 마치면 \`dev_server({ action: "stop" })\` 로 종료.

## Self-Check

- [ ] \`@nudge-design/html/runtime\` 이 main.ts 에서 import 되어 있다.
- [ ] \`@nudge-design/react\` / \`@nudge-design/tokens\` 의 React-only entry 를 import 한 곳이 없다.
- [ ] \`.tsx\` 파일이 \`src/\` 에 없다 (\`.ts\` + 필요 시 \`.css\` 만).
- [ ] 모든 DS 사용처는 \`<nds-*>\` custom-element 다 (\`<button class="nds-button">\` 같은 흉내 없음).
- [ ] 이벤트는 \`addEventListener\` 로 — \`onclick=\` 인라인 없음.
- [ ] 토큰은 \`@nudge-design/tokens/css\` 한 줄로만 들어온다 (\`:root\` 인라인 재정의 없음).
- [ ] \`validate_html_mockup\` 위반 0건 (2회 self-check 통과).
- [ ] 통과 응답에 자동 동봉된 \`stats.counts.dsRatio\` 가 충분히 높고 native 잔존이 0/최소.
- [ ] 이모지·텍스트 기호 (→ ✓ ★ • 등) 사용 없음.
- [ ] **브랜드 헤더/푸터 사용 여부 점검**: 사용자 앱 화면이면 해당 브랜드(trost/geniet/nudge-eap)의 표준 헤더/푸터 (또는 GNB·BottomNav) 가 적용됐는가? 인라인으로 손수 그리지 않고 브랜드 별 fixtures 사용. 랜딩/스플래시/모달-only 같은 의도적 예외라면 응답에 "헤더/푸터 의도적으로 생략" 명시.
- [ ] 목업에 DS MCP/Package 버전 및 DS 컴포넌트 사용량/적용 현황이 visible 하게 포함됨. 풋터 뱃지는 \`<span data-ds-badge>DS@x.y.z · DS N (M%)</span>\` 형태를 기본으로 하되, MCP/package 버전까지 함께 보이게 한다. 주석만으로는 부족.
- [ ] \`build_singlefile_html\` 호출 후 \`validate_html_mockup({ filePath, report: true })\` 까지 실행 완료 (구글시트 적재 + 마지막 위반 검사).
- [ ] 최종 응답에 Google Sheets POST 상태를 명시함: \`webhook ok\` / \`webhook queued(...)\` / \`webhook skipped\`.
- [ ] **품질/검증 결과는 분석적으로 제시 — "종합 N점" 한 줄 요약 금지.** \`build_singlefile_html\`/\`validate_html_mockup\` 의 \`scoreGate.scoreCard\` 와 \`score_mockup_quality\` 의 \`card\` 를 **항목별 점수 + 각 항목의 감점 사유("→")까지 그대로** 보여준다(낮은 항목·사유 발췌·생략 금지). **첫 목업 생성과 피드백 후 재생성 모두** 동일 형식으로. 점수만 던지지 말고 "어디서 왜 깎였는지"를 사용자가 보게 할 것.
- [ ] **만족도(👍/👎)는 객관 점수의 짝 — 결과를 보여준 "다음"에 묻는다.** 흐름: \`build_singlefile_html\` 결과(점수·\`dist/index.html\` 경로)를 사용자에게 **먼저 보여준 뒤**, **깨끗한 빌드(DS 에러 0)** 면 이어서 \`prompt_satisfaction({ screen, scoreOverall, brand })\` 를 호출한다 → 사용자에게 👍/👎 **클릭 다이얼로그**가 뜨고(빌드는 이미 끝나 안 막힘), 클릭하면 객관 점수와 함께 자동 기록된다. **화면당 세션 1회만**(같은 화면 재빌드해도 다시 호출 X), 에러 있는 중간 빌드엔 호출 X. 결과 \`supported:false\`(호스트 미지원)면 \`satisfactionOffer.prompt\` 텍스트로 안내하고, 사용자가 **명시적으로** 👍/👎(또는 '좋다'/'별로') 말하면 \`log_feedback({ category:'satisfaction', sentiment, scoreOverall })\` 로 기록(모호 반응 추측·자동 감정분석 금지). AI 가 텍스트로 "어떠세요?"라고 캐묻지 말 것 — 다이얼로그(또는 satisfactionOffer 안내)가 그 역할.
- [ ] 최종 응답에 간격 점검 결과, 텍스트 기호 아이콘 잔존 여부, 요청 범위 누락 항목을 명시함.
- [ ] 최종 응답에 산출물 full 절대경로를 포함함 (상대경로 \`dist/index.html\` 만으로 끝내지 않음).
- [ ] 가이드 호출은 단계별로만 — 시작 시점에 12개씩 병렬 fetch 하지 않음.
- [ ] 최종 산출물은 \`build_singlefile_html\` 이 만든 단일 \`dist/index.html\` 이다 (raw \`vite build\` 결과의 다중파일 dist/ 가 아님).
`;
  }

  if (args.intent === "backoffice" || args.intent === "admin-cms") {
    const serviceNameArg = args.serviceName ? `, serviceName: "${args.serviceName}"` : "";
    const footerCopy = `Copyright © ${args.serviceName?.trim() || "<서비스명>"}. All Rights Reserved.`;
    return `${title}

## 역할 경계 (먼저 읽을 것)

- 이 프로젝트의 역할은 **별도 목업 프로젝트 빌드 + 목업 생성**이다.
- **하지 말 것**: Nudge DS 레포 자체 수정, DS 코드의 git commit/push, GitHub 레포 변경, npm publish, 패키지 버전 bump.
- 사용자가 "DS 컴포넌트를 고쳐줘 / 레포에 푸시해줘 / PR 만들어줘" 같이 요청하면, **이 프로젝트의 역할이 아님을 알리고 DS 레포에서 직접 작업하라고 안내**할 것.
- 이 프로젝트는 DS를 '소비'하는 쪽이고, DS 레포는 별도로 관리된다.

## 분기 — 이 프로젝트는 백오피스(사내 어드민/CMS) 목업이다

- 사용 라이브러리: **antd v5** (NudgeEAPCMS 기준 5.5.1) + @ant-design/icons + dayjs(ko)
- **금지**: \`@nudge-design/react\`, \`@nudge-design/tokens\`, \`@nudge-design/icons\` 어떤 형태로도 import하지 말 것
- 외부 제공(b2b) 어드민 *서비스*는 이 템플릿 대상이 아니다 — ${DS_ADMIN_BRANDS.join(" / ")} 만 지원하며 antd 가 아니라 DS 로 만든다. 해당하면 \`get_setup({ step: "claude-md", intent: "admin", brand: "<slug>" })\` 로 다시 호출.
- nudge-ds MCP는 두 가지 도구만 사용:
  - \`get_guide({ topic: "backoffice"${serviceNameArg} })\` — 사이드바/페이지 헤더/검색 폼/테이블/색상 등 전체 시각 컨벤션
  - \`dev_server({ action: "start" })\` / \`dev_server({ action: "stop" })\` — 백오피스에서도 동일하게 dev 서버 미리보기 (URL 을 브라우저에서 직접 확인)

## 산출물 형식 강제 (MUST — 우회 절대 금지)

백오피스 목업도 **유일하게 허용된 작업 흐름은 동일**:

  \`.tsx\` 작성 (antd v5) → \`tsc --noEmit\` 통과 → \`build_singlefile_html({})\` → \`dist/index.html\` (한 파일)

**아래는 발견 즉시 작업 중단 + 사용자에게 보고 사유. 어떤 변명으로도 우회 금지:**

1. **\`src/\` 하위에 손으로 작성한 \`.html\` 파일 금지.** "스탠드얼론 HTML 로 빠르게 보여드릴게요" 식 우회 X. \`dist/index.html\` 은 \`build_singlefile_html\` 산출물이므로 예외.
2. **antd 컴포넌트를 HTML/CSS 로 "시각만 흉내" 금지.** \`<button className="fake-antd-btn">\`, \`<div className="my-table">\` 식으로 antd Button/Table 모양만 따라 그리지 말 것. 반드시 \`import { Button, Table, Form, ... } from "antd"\` 의 **실제 JSX** 를 쓸 것.
3. **\`.css\` 안에 antd 토큰을 인라인 재정의 금지.** 색·폰트·라디우스가 필요하면 \`ConfigProvider\` 의 \`theme.token\` 으로만 조정. \`.ant-* { ... }\` 강제 override 도 최소화 — 컴포넌트 구조부터 antd 컨벤션에 맞춘다.
4. **\`vite build\` / esbuild / webpack / parcel / rollup 직접 호출 금지.** 단일 HTML 산출은 **오직 \`build_singlefile_html({})\` 로만**.

**우회 자가 감지 체크리스트 — 작업 시작 직후 + 완료 직전 둘 다 통과해야 한다:**

- [ ] \`src/\` 에 손으로 작성한 \`.html\` 파일이 없다 (\`dist/index.html\` 은 빌드 산출물이라 예외).
- [ ] 모든 UI 사용처는 antd v5 의 실제 JSX import 다 (className 으로 시각 모사한 raw HTML 없음).
- [ ] 색·폰트·라디우스 커스텀은 \`ConfigProvider.theme.token\` 으로만 — \`:root\` 인라인 재정의 / 광범위한 \`.ant-*\` override 없음.
- [ ] 산출물은 \`build_singlefile_html({})\` 결과의 \`dist/index.html\` **한 파일** 이다.

위 4개 중 하나라도 어긋나면 **HTML/CSS 를 폐기하고 \`.tsx\` 기반으로 즉시 다시 작성**. 사용자가 명시적으로 허용한 경우에만 예외이며, 이 경우에도 "MCP 검증 파이프라인이 무력화됩니다" 라고 먼저 경고.

## 작업 원칙

- 백오피스는 정보 밀도가 높고 스캔하기 쉬운 레이아웃이 우선. 마케팅/장식 톤 금지.
- antd 컴포넌트를 직접 만들지 말고 그대로 사용 (\`Button\`, \`Form\`, \`Input\`, \`Select\`, \`DatePicker\`, \`Table\`, \`Modal\`, \`Tab\`, \`Tag\`, \`Space\`, \`Card\`, \`Pagination\`).
- 색/타이포/외형은 antd 기본값 유지. \`ConfigProvider\` 토큰은 색·폰트·라디우스 정도만.

## 시각 컨벤션 (NudgeEAPCMS 기반)

- **사이더**: 240px 라이트, \`border-right: 1px solid #ececec\`, 상단 6px 브랜드 액센트(\`var(--semantic-border-brand-default)\`)
- **사이더 내부**: \`INFO\` 블록(이메일+이름 Tag+권한 Tag) → \`CMS MENU\` 블록(<Menu theme="light" mode="inline">) → \`SETTING\` 블록(로그아웃/정보수정)
- **메뉴 선택**: \`border-right: 6px solid var(--semantic-border-brand-default)\`
- **본문**: \`margin-left: 240px\`, \`padding: 40px 60px 200px\`
- **body bg**: \`#f4f4f4\`, **font**: \`Mulish, Gothic_A1, 'Malgun Gothic', '맑은 고딕'\`
- **HeaderSubject**: Breadcrumb \`separator=">"\` + h1 22/700 #383838 + desc 12/#6b6a6a + \`border-bottom: 1px solid #e4e4e4\`
- **검색 폼**: \`Form\` 안 \`Select(100px) + Input.Search(enterButton="검색") + 초기화 Button\` / 우측 액션 / 하단 "검색된 개수: N"
- **Table**: \`size="middle"\`, 컬럼 거의 모두 \`align: "center"\`, 클릭 가능한 셀은 \`<Button type="link">\`, \`pagination={{ defaultPageSize: 20, position: ["bottomCenter"], showSizeChanger: false }}\`
- **Status Tag**: \`width: 60px; text-align: center;\` (TagAdminRole 컨벤션)
- **푸터**: \`${footerCopy}\` (12px / #b1b1b1 / border-top #ececec)

자세한 코드 예시는 \`get_guide({ topic: "backoffice"${serviceNameArg} })\`를 호출해 가져오세요.

## 검증 루프

1. \`get_guide({ topic: "backoffice"${serviceNameArg} })\` 호출해 컨벤션 재확인
2. AdminLayout(Sider+Content+Footer) → 페이지 작성
3. \`tsc --noEmit\` 통과
4. \`dev_server({ action: "start" })\` → 브라우저에서 dev URL 열어 에러 0건 확인
5. \`dev_server({ action: "stop" })\`

## Self-Check

- [ ] antd에서 import (직접 button/input/select 만들지 않음)
- [ ] @nudge-design/* 어떤 패키지도 import하지 않음
- [ ] 사이드바 라이트 240px + 6px 톱 액센트 + INFO/CMS MENU/SETTING 블록 있음
- [ ] HeaderSubject + 검색 폼(Select+Input.Search+초기화) + Table(align center+Button.link) 패턴 일관
- [ ] body \`#f4f4f4\` + 본문 \`padding: 40 60 200\` + 푸터 카피 있음
- [ ] tsc --noEmit 통과
- [ ] \`src/\` 에 손으로 작성한 \`.html\` 파일이 없다 (\`dist/index.html\` 은 빌드 산출물 — 예외)
- [ ] \`.css\` 어디에도 \`:root { ... }\` 토큰 인라인 재정의 없음 / 광범위한 \`.ant-*\` override 없음
- [ ] 산출물은 \`build_singlefile_html({})\` 가 만든 \`dist/index.html\` 한 파일이다
`;
  }

  return `${title}

## ⛔ FIRST RESPONSE GATE — 모든 작업 이전에 (예외 없음)

**이 워크스페이스에서 사용자의 첫 화면-만들기 요청을 받은 직후, 다른 어떤 행동보다 먼저:**

### Step 1. 첫 응답에 반드시 이 질문을 그대로 포함하고 응답을 종료한다

> "시각 기준으로 쓸 Figma 링크나 스크린샷이 있을까요? 가능하면 **정답 1-2장**, **피해야 할 오답 1-2장**에 각각 1줄 캡션을 붙여 주세요. 이미 첨부하신 자료를 기준으로 진행해도 될지도 함께 알려 주세요."

### Step 2. 사용자 답변을 받기 전까지 다음을 절대 하지 않는다

- ❌ \`find_component\` / \`find_icon\` / \`find_token\` / \`get_guide(topic:component:*)\` / \`get_guide(topic:pattern:*)\` 호출
- ❌ 어떤 \`.tsx\` / \`.ts\` / \`.html\` / \`.css\` 파일 작성 또는 edit
- ❌ 코드 outline, pseudo-code, 컴포넌트 트리 스케치 — 머릿속 설계도 글로 풀어내지 말 것
- ❌ "일단 골격만 만들고 나중에 디테일 맞추겠다" / "PRD 에 디자인 톤이 있으니 그걸 기준으로" / "auto-mode 니까 빠르게" — 전부 거부 사유

### Step 3. 기존 작업폴더 충돌을 얕게 확인한다 (hard gate)

- 답변을 받은 뒤 파일을 만들거나 수정하기 전에, 현재 워크스페이스의 바로 보이는 폴더명/파일명만 확인한다. 같은 PRD/같은 화면으로 보이는 작업폴더가 **명백히** 있으면 반드시 질문하고 중단:

> "동일한 기획으로 보이는 작업폴더가 있는데, 새 버전(v2)으로 만들까요?"

- 사용자가 답하기 전까지 기존 폴더의 파일을 수정하지 않는다.
- 억지로 찾지 않는다. 전체 디스크 검색, 깊은 재귀 탐색, 오래 걸리는 유사도 검색은 금지. "보이면 묻고, 안 보이면 진행"이다.

### Step 4. 답변을 받으면 \`references.md\` (워크스페이스 루트) 에 즉시 기록

\`\`\`
# references.md
task: <brand>-<screen-slug>    ← ★ 필수 첫 줄. 예: task: geniet-diary-hub
[good] source=<figma-url|image-name> caption=<1줄 reason>
[good] ...
[bad] source=... caption=...
\`\`\`

\`source\` 로 허용되는 것: **Figma URL** (\`figma.com/...\`) 또는 **이미지 파일** (\`.png/.jpg/.jpeg/.webp/.gif/.svg\`). **PRD/spec/요구사항 \`.md\` 파일은 source 로 인정되지 않음** — 텍스트 문서는 spec 이지 visual reference 가 아니다.

### 예외 (4 가지만)

1. 사용자가 첫 메시지에 Figma 링크/스크린샷을 **명시적으로** 첨부했고, **추가 레퍼런스가 필요 없다고 명시**한 경우 → 그 자료만으로 \`references.md\` 작성하고 진행.
2. 같은 목업 작업에서 이미 질문했고 사용자가 답했거나, 워크스페이스에 유효한 \`references.md\` / \`.references/\` 가 있고 **\`task:\` 첫 줄이 현재 task 와 일치**하는 경우 → 다시 묻지 말고 읽어서 적용. (이전 task 의 stale references.md 는 없는 것으로 간주, 반드시 다시 질문)
3. 화면-만들기 요청이 아닌 경우 (e.g., 코드 리뷰, 버그 수정, 설정 변경). 이 경우 일반 흐름으로 진행.
4. 사용자가 명시적으로 "레퍼런스 없이 진행" 이라고 지시 → 사용자에게 "MCP 의 visual-reference 가드가 무력화되며, 톤/디테일이 어긋날 가능성이 있다" 라고 먼저 경고 후 진행.

### 흔한 우회 패턴 (모두 무효 — 절대 따라가지 말 것)

이 6가지는 실제 사용자 회고에서 게이트 우회 사유로 잡힌 사례다:

1. **stale-references-md** — 이전 task 의 \`references.md\` 가 남아 있음 → "이미 답변 받음" 으로 오인. **Fix:** \`task:\` 슬러그 비교, 다르면 stale 처리하고 다시 질문.
2. **prd-as-visual** — PRD 에 ASCII 레이아웃·컬러 스펙이 있어서 "이게 사실상 visual reference" 라고 자체 합리화. **Fix:** 텍스트 ≠ 시각자료. Figma 노드 또는 이미지 파일이 필요.
3. **decisive-tone** — 사용자 어조 ("바로 만들어줘" / "PRD 지켜서") 를 "묻지 말라" 로 오독. **Fix:** 어조는 게이트 우회 사유가 아님.
4. **soft-prompt-misread** — 가이드 응답의 "soft prompt" 표현을 "skip 해도 되는 권고" 로 약화 해석. **Fix:** 이 게이트는 REQUIRED. soft 가 아님.
5. **checklist-omission** — 메모리/체크리스트에 후반 단계만 있고 이 게이트는 빠져 있어서 advisory 로 격하. **Fix:** 이 게이트는 다른 모든 체크리스트보다 먼저 실행.
6. **same-folder-overwrite** — 새 목업 요청인데 같은 기획으로 보이는 기존 폴더를 발견하고도 확인 없이 수정. **Fix:** 얕게 발견된 경우 반드시 v2 생성 여부를 묻고 답변 전 기존 폴더를 수정하지 않는다.

### 왜 이 게이트가 필요한가

- PRD 본문만 보고 바로 코드 → 톤·픽셀 디테일 (별점 크기, 카드 간격, 헤더 위계) 불일치 → 5+ 라운드 재작업
- Auto-mode 는 **clarifying question 을 줄이는 룰**이지, **절차를 건너뛰는 룰이 아님**
- 빌드 타임의 \`missing-visual-references\` audit 는 이미 일이 다 끝난 후라 너무 늦음 — 이 게이트가 작업 시작 시점의 안전망

**이 게이트를 어기고 작업한 결과물은 사용자가 거절할 수 있으며, MCP 가이드 모든 룰 위반 중 가장 자주 발생하는 위반이다.**

---

## 역할 경계 (먼저 읽을 것)

- 이 프로젝트의 역할은 **별도 목업 프로젝트 빌드 + 목업 생성**이다.
- **하지 말 것**: Nudge DS 레포 자체 수정, DS 코드의 git commit/push, GitHub 레포 변경, npm publish, 패키지 버전 bump.
- 사용자가 "DS 컴포넌트를 고쳐줘 / 레포에 푸시해줘 / PR 만들어줘" 같이 요청하면, **이 프로젝트의 역할이 아님을 알리고 DS 레포에서 직접 작업하라고 안내**할 것.
- 이 프로젝트는 DS를 '소비'하는 쪽이고, DS 레포는 별도로 관리된다.

## 분기 (먼저 확인) — ★ 하드스톱

- **운영자 키워드(어드민/admin/백오피스/CMS/운영툴/관리자)가 보이면 코드 작성 전 작업 중단 + 첫 응답에서 반드시 질문.** 키워드만으로 admin/backoffice 를 **추측하지 말 것** — "어드민"이라고 적혀 있어도 사내 백오피스인지 외부 제공 b2b 어드민인지 사람만 안다(둘은 워크플로우·DS·antd 사용 여부가 통째로 다름). *"운영자 화면으로 보입니다. ① 사내 백오피스인가요, ② 외부에 제공하는 b2b 어드민 서비스인가요?"* 라고 묻고 **확답 전엔 진행 금지.** 추측해서 만들었다가 영역이 틀리면 처음부터 다시 만들어야 한다(실제 회귀). 확답 후:
- **운영자 화면(어드민/CMS/운영툴/백오피스)이라면 이 CLAUDE.md를 따르지 말 것.** 영역을 추측하지 말고 사용자에게 확답을 받은 뒤 분기:
  - **사내 백오피스** → \`get_setup({ step: "claude-md", intent: "backoffice" })\` 로 다시 호출. antd v5 를 사용하고 \`get_guide({ topic: "backoffice" })\` 로 컨벤션 확인.
  - **외부 제공(b2b) 어드민 서비스** → ${DS_ADMIN_BRANDS.join(" / ")} 만 지원(하드게이트). \`get_setup({ step: "claude-md", intent: "admin", brand: "<slug>" })\` 로 다시 호출하면 DS(html) 워크플로우로 우회. 그 외 브랜드는 미지원 — 백오피스로 진행하거나 DS 팀에 편입 요청.
- 이 가이드는 사용자 앱(Trost/Geniet/NudgeEAP) 화면용입니다.

## 산출물 형식 강제 (MUST — 우회 절대 금지)

이 워크스페이스의 **유일하게 허용된 작업 흐름**:

  시각 레퍼런스 수집 → \`.tsx\` 작성 → \`validate_mockup\` 통과 → \`build_singlefile_html({})\` → \`dist/index.html\` (한 파일)

**아래는 발견 즉시 작업 중단 + 사용자에게 보고 사유. 어떤 변명으로도 우회 금지:**

1. **시각 레퍼런스 확인 전 코드 작성 금지.** 프롬프트에 이미지/Figma 링크/스크린샷이 이미 있어도 **첫 응답에서 한 번만 사용자에게 질문**: *"시각 기준으로 쓸 Figma 링크나 스크린샷이 있을까요? 이미 첨부하신 자료를 기준으로 진행해도 될지, 추가로 정답/오답 레퍼런스가 있으면 함께 알려 주세요. 가능하면 정답 1-2장, 피해야 할 오답 1-2장에 각각 1줄 캡션을 붙여 주세요."* 같은 목업 작업에서 이미 답변을 받았거나 \`references.md\` / \`.references/\` 가 있으면 다시 묻지 말고 읽어서 적용한다. 받은 응답은 워크스페이스 루트의 \`references.md\` 에 \`[good|bad] source=<figma-url|image-name> caption=<1-line reason>\` 형식으로 저장. 구현 전 \`references.md\` 를 읽고 good 기준은 레이아웃/간격/타이포/컬러 의사결정으로 매핑하고, bad 기준은 명시적 회피 규칙으로 적은 뒤 작업한다. 이 파일이 비어 있거나 없으면 \`build_singlefile_html\` pre-flight audit 가 차단한다 (\`missing-visual-references\`). "브랜드 톤 가이드 보고 알아서 만들게요" 식 우회 X — brandTone 형용사만 보고 만든 화면이 반복적으로 거절되어 왔다. 자세한 룰: \`get_guide({ topic: "pattern:visual-reference" })\`.
2. **같은 기획 기존 폴더 발견 시 v2 확인 필수.** 새 목업 요청에서 파일 생성/수정 전 현재 워크스페이스를 얕게 보고, 같은 PRD/같은 화면으로 보이는 작업폴더가 명백히 있으면 반드시 *"동일한 기획으로 보이는 작업폴더가 있는데, 새 버전(v2)으로 만들까요?"* 라고 묻고 답변 전까지 기존 폴더를 수정하지 않는다. 억지로 찾지 말 것(깊은 재귀/전체 디스크/유사도 검색 금지). 하지만 보였는데도 묻지 않는 것은 hard rule 위반.
3. **\`src/\` 하위에 손으로 작성한 \`.html\` 파일 금지.** "스탠드얼론 HTML 로 빠르게 보여드릴게요" / "그냥 한 파일로 끝내고 싶어요" / "HTML 이 더 단순해요" 식 우회 X. 결과적으로 DS prop API 검증·\`validate_mockup\` AST 검사·\`report_mockup_usage\` 집계가 **전부 무력화**된다. \`dist/index.html\` 은 \`build_singlefile_html\` 산출물이므로 예외.
4. **\`.css\` 안에 시멘틱 토큰 인라인 재정의 금지.** \`:root { --semantic-*: ...; --nds-*: ...; --color-*: ...; --gap-*: ...; --inset-*: ... }\` 같은 인라인 정의는 \`@nudge-design/tokens/css\` 의 단일 진리원천을 깨는 우회. 토큰은 \`main.tsx\` 에서 \`import "@nudge-design/tokens/css"\` 한 줄로만 가져온다. "인라인이 더 명확해요" / "스탠드얼론이라 어쩔 수 없어요" — 거부 사유.
5. **DS 컴포넌트를 HTML/CSS 로 "시각만 흉내" 금지.** \`<button className="my-btn">\` 으로 Button 모양만 따라 그리기, \`<div className="chip">\` 으로 Chip 흉내 X. 반드시 \`import { Button, Chip, IconButton, ... } from "@nudge-design/react"\` 의 **실제 JSX** 를 쓸 것 — prop API · 토큰 · a11y 가 자동으로 보장된다.
6. **\`vite build\` / esbuild / webpack / parcel / rollup 직접 호출 금지.** 단일 HTML 산출은 **오직 \`build_singlefile_html({})\` 로만**. 다른 번들러 / 손수 inline 화는 \`nds-*\` 클래스 · onClick 인터랙션 · 토큰 변수 해석이 손실됨.

**우회 자가 감지 체크리스트 — 작업 시작 직후 + 완료 직전 둘 다 통과해야 한다:**

- [ ] 운영자 키워드(어드민/admin/백오피스/CMS/운영툴)가 있었으면 **사내 백오피스 vs 외부 b2b 어드민**을 사용자에게 물어 확답받았다(추측 금지).
- [ ] 워크스페이스 루트에 \`references.md\` (또는 \`.references/\` 폴더) 가 존재하고, 정답 1장 + 오답 1장 이상의 시각 기준이 캡션과 함께 적혀 있다.
- [ ] 새 목업 요청에서 같은 기획으로 보이는 기존 작업폴더가 명백히 보이면 v2 생성 여부를 물었고, 답변 전 기존 폴더를 수정하지 않았다.
- [ ] 구현 전 \`references.md\` 를 읽고 good/bad 기준을 실제 레이아웃·간격·타이포·컬러 결정에 반영했다.
- [ ] \`src/\` 에 손으로 작성한 \`.html\` 파일이 없다 (\`dist/index.html\` 은 빌드 산출물이라 예외).
- [ ] \`src/\` 의 \`.css\` / \`.scss\` 어디에도 \`:root { --semantic-* / --nds-* / --color-* / --gap-* / --inset-* }\` 인라인 정의가 없다.
- [ ] 시멘틱 토큰은 \`main.tsx\` 의 \`import "@nudge-design/tokens/css"\` 한 줄로만 들어온다.
- [ ] 모든 DS 컴포넌트 사용처는 \`@nudge-design/react\` 의 실제 JSX import 다 (className 으로 시각 모사한 raw HTML 없음).
- [ ] 산출물은 \`build_singlefile_html({})\` 결과의 \`dist/index.html\` **한 파일** 이다.

위 6개 중 하나라도 어긋나면 **HTML/CSS 를 폐기하고 \`.tsx\` 기반으로 즉시 다시 작성**. 사용자가 명시적으로 "HTML 직접 작성 허용" / "토큰 인라인 정의 허용" / "레퍼런스 없이 진행 허용" 이라고 지시한 경우에만 예외이며, 이 경우에도 사용자에게 "MCP 검증 파이프라인(validate_mockup·report_mockup_usage·visual-reference 가드)이 무력화됩니다" 라고 먼저 경고할 것.

## 작업 원칙

- 이 프로젝트는 Nudge Design System 기반 사용자 앱 목업 작업 공간이다.
- DS 컴포넌트/아이콘/토큰을 추측해서 사용하지 말고, MCP 도구로 확인한 뒤 사용한다.
- 구현 완료의 기준은 코드 작성이 아니라 실제 dev 화면이 에러 없이 렌더링되는 것이다.

## 도구 사용 규칙

- **목업 작업을 시작하기 전 반드시 \`get_guide({ topic: "principles" })\` 호출** — 브랜드 톤·컬러 시멘틱·타이포·스페이싱·금지 패턴을 한 번에 로드. 브랜드를 바꾸면 재호출.
- **모든 mockup 작업은 시각 레퍼런스 확인 질문부터 시작.** \`get_guide({ topic: "pattern:visual-reference" })\` 로 룰 확인 후, 프롬프트에 이미지/Figma 링크가 있어도 위 MUST 1번 질문을 사용자에게 그대로 하고 답을 \`references.md\` 에 저장. \`build_singlefile_html\` 의 \`missing-visual-references\` audit 룰로 강제됨.
- 컴포넌트/아이콘/토큰 사용 전 \`find_component\` / \`find_icon\` / \`find_token\` 호출 (인자 없으면 전체 / \`{ query }\` 면 fuzzy / \`{ name }\` 면 풀 스펙)
- 처음 쓰는 주요 컴포넌트는 \`get_guide({ topic: "component:Button" })\` 형식으로 호출. **brand 화면이면 \`brand: "trost|geniet|nudge-eap|cashwalk-biz"\` 같이 지정** — service overlay (allowed/disallowed/preferred/forbiddenPatterns, servicePitfalls) + matrixOverrides (spec 차이) + brand-aware metadata (validPropValues/assetManifest/forcedProps) 가 자동 fold 되어 응답. 응답 메타 키 (\`_brandApplied\` / \`_matrixOverrideApplied\` / \`_brandAwareApplied\`) 로 어느 layer 적용됐는지 확인. brand 미지정 호출은 \`_brandVariants\` 슬림 요약만 첨부 — 어느 brand 가 overlay 갖고 있는지 본 후 다시 호출.
- CTA 그룹, 아이콘 컬러·사용처, 시멘틱 spacing(--semantic-gap-* / --semantic-inset-*), surface 레이어·brand bg 사용, 시각 레퍼런스, 시각 안티패턴, 안내문 강조, 옵션 많은 드롭다운, 정보 과밀 리스트, 다크패턴(진입 직후 시트·뒤로가기 인터럽트·거절 불가 CTA·중간 광고·라벨 모호성)은 \`get_guide({ topic: "pattern:semantic-spacing" })\` / \`get_guide({ topic: "pattern:surface-layer" })\` / \`get_guide({ topic: "pattern:icon-usage" })\` / \`get_guide({ topic: "pattern:cta-group" })\` / \`get_guide({ topic: "pattern:dark-patterns" })\` 형식으로 호출
- **사용자 노출 텍스트(버튼·라벨·placeholder·empty state·에러·다이얼로그)는 작성 전 \`get_guide({ topic: "ux-writing" })\` 호출** — 해요체·능동형·긍정형·캐주얼 경어·"닫기 vs 취소" 같은 마이크로카피 규칙 + EAP 멘탈케어 도메인 규칙(위기·자해·진단 표현 톤)을 한 번에 로드.
- 워크스페이스 첫 셋업 시 **\`get_setup({ step: "inspector" })\` 한 번 호출** — MCP 가 src/main.tsx 를 직접 패치해 DsInspector 를 dev-only 로 마운트합니다 (idempotent). 성공 후 dev 서버 재시작하면 우하단 floating 버튼으로 DS / antd / native 비율을 실시간 확인 가능 (Ctrl/Cmd+Shift+D 토글). 별도 코드 수정 불필요.
- 목업 \`.tsx\` 작성 직후 반드시 \`validate_mockup\` 호출
- 위반이 있으면 \`suggest_replacement\`로 수정 후 재검증, 최대 3회 루프
- **\`validate_mockup\` 통과 후 반드시 \`npx tsc --noEmit\` 실행** — validate_mockup 은 패턴 검사만 하므로 잘못된 prop union 값(\`IconButton size="md"\` → 유효: x-large/large/medium/small, \`Card variant="content"\` → 유효: outlined/elevated/flat 등)은 못 잡습니다. Vite dev 서버도 esbuild 변환이라 타입 에러를 무시함. tsc 가 0 errors 되어야 다음 단계로.
- 구현 후 \`dev_server({ action: "start" })\` 로 dev 서버 실행
- dev URL이 응답하면 브라우저에서 직접 열어 런타임 에러, Vite overlay, 빈 화면 여부 확인
- 에러가 보이면 수정하고 dev URL 을 다시 확인
- 완료 전 \`get_guide({ topic: "dos-donts" })\`로 최종 sanity check
- 목업 \`.tsx\` 가 완성/수정될 때마다 **반드시 \`report_mockup_usage({ filePath: '<mockup경로.tsx>' })\` 호출** — 로컬 \`.ds-usage-log.jsonl\` 적재 + 공용 Google Sheets webhook으로 자동 전송 (별도 인증/설정 불필요). 빠뜨리면 사용량 집계가 비어 보임.
- **최종 산출물은 항상 단일 HTML 파일**. mockup 완성 후 **반드시 \`build_singlefile_html({})\` 호출** — 사용자에게 "만들까요" 라고 묻지 말 것. 그냥 실행하세요. 사용자가 명시적으로 "빌드하지 마" 라고 거부한 경우에만 생략. 손으로 .html 작성, \`vite build\` 직접 실행, 다른 번들러 사용, .tsx 만 남기고 종료 — **모두 금지**.
- 작업 종료 시 MCP가 띄운 서버는 \`dev_server({ action: "stop" })\` 로 종료

## 완료 게이트 (반복 지시 — 기존 검증/가이드와 중복되어도 생략 금지)

- 목업에는 DS MCP/Package 버전 및 DS 컴포넌트 사용량/적용 현황을 반드시 visible 하게 포함한다. \`report_mockup_usage\` / \`validate_html_mockup(report:true)\` / \`build_singlefile_html\` 응답의 \`humanReadable\` 또는 \`dsUsageSummary\` 를 SSOT 로 사용하고, 직접 카운트하지 않는다. \`build_singlefile_html\` 은 최종 \`dist/index.html\` 의 \`data-ds-badge\` 텍스트를 실제 빌드 산출물 기준으로 자동 치환한다.
- **브랜드 헤더/푸터 사용 여부 점검** — 사용자 앱 화면이면 해당 브랜드의 표준 헤더/푸터 (또는 GNB·BottomNav) 가 적용됐는지 마지막에 한 번 더 확인. brand prop 하나로 자동 분기되는 MockupLayout (\`mockup-layout.tsx\`) 또는 동등 헬퍼를 우선 사용 — 인라인 손수 그리기 금지. 랜딩/스플래시/모달-only 같은 의도적 예외라면 최종 응답에 "헤더/푸터 의도적으로 생략" 명시.
- 최종 응답에는 Google Sheets POST 상태를 반드시 쓴다: \`webhook ok\`, \`webhook queued(...)\`, \`webhook skipped\` 중 하나.
- 최종 응답에는 간격 점검 결과, 텍스트 기호를 아이콘처럼 사용한 곳의 잔존 여부, 요청 범위에서 빠진 항목을 짧게 보고한다.
- 최종 응답에는 산출물 full 절대경로를 반드시 포함한다(예: \`/Users/.../dist/index.html\`). 상대경로 \`dist/index.html\` 만 쓰고 끝내지 않는다.
- 위 항목은 이미 검증 로직이나 다른 가이드에 있어도 반복 확인한다. 확인하지 못한 항목은 확인하지 못했다고 쓴다.

## UI 구현 규칙

- 가능한 한 DS 컴포넌트를 우선 사용한다.
- **★ 헤더/푸터 손수 조립 금지 — 사용자 앱 화면이면 무조건 \`<BrandHeader brand='trost|geniet|nudge-eap|cashwalk-biz|runmile' surface='web|mobile|webview' activeKey='...' assetBaseUrl='/assets' />\` + \`<BrandFooter brand='...' surface='web|app' assetBaseUrl='/assets' />\` 부터.** 로고 / 메뉴 라벨·href / auth 버튼 / 사업자 정보 / copyright 전부 BRAND_DATA 에서 자동. Header / HeaderLogo / HeaderMenu(Item) / HeaderActions / HeaderAuthButton 를 직접 박는 건 안티패턴. \`get_guide({ topic: "component:BrandHeader" })\` 로 브랜드별 필요 로고 파일 (\`public/assets/brand/{brand}/logos/*\`) 확인. **컴포넌트 파일 이름이 generic 해서 (\`nds-brand-chrome\` / \`BrandChrome\`) find_component 결과만 보고 못 짚는 함정 — BrandHeader/BrandFooter 가이드를 먼저 호출하라.**
- **기존 antd/HTML 코드를 받았을 때 변수명만 치환하지 말 것**. 색상값을 \`var(--...)\` 로 바꾸는 것만으론 "DS 적용"이 아니다. antd \`<Table>\` → DS \`<DataTable>\`, antd \`<Form>\` → DS \`Input\`/\`Select\` 조합 식으로 **컴포넌트 구조를 처음부터 재구성**한다. 한 줄이라도 antd import 가 남아 있으면 변환 미완료로 본다 (validate_mockup 의 \`antd-import-in-user-app\` 으로 자동 검출됨).
- raw \`button\`, \`input\`, \`select\`, \`textarea\`는 특별한 이유가 없으면 사용하지 않는다.
- **이모지·텍스트 기호 절대 금지**. 라벨/버튼/제목/placeholder/empty state 어디에도 이모지(😀 🔥 ⭐ 💡 ✅ ⚠️ 등) 박지 말 것. → ← ✓ ★ • 같은 기호 텍스트도 금지. 아이콘이 필요하면 \`find_icon\` 으로 \`@nudge-design/icons\` 에서 찾고, 없으면 인라인 SVG. 진행/별점/불릿은 DS 컴포넌트 사용. \`validate_mockup\` 의 \`emoji-banned\` / \`text-symbol-banned\` 룰로 자동 위반 카운트됨.
- **스타일은 처음부터 클래스/CSS 로 — 인라인 \`style\` 속성을 흩뿌리지 말 것.** 색·간격은 인라인 hex/rgb/px 값보다 DS 토큰을, 반복 스타일은 클래스/styled 로 한 곳에 모은다(인라인으로 흩뿌리면 시각 피드백마다 재작성·재검증 라운드가 늘어난다).
- 인라인 SVG를 직접 만들기보다 \`@nudge-design/icons\` 아이콘을 사용한다.
- **아이콘 선택 필수 우선순위**: 브랜드 전용 아이콘(Geniet*/Trost* 등) > NudgeEAP 기본 브랜드 아이콘 > 목업용 기본 아이콘 패키지(MockupLinear*/MockupBold*) > 자체 생성 SVG. \`find_icon\` 과 \`get_brand({ brand })\` 로 앞 단계 후보를 먼저 확인하고, 없을 때만 다음 단계로 내려간다.
- 그라데이션, 과한 장식 배경, 중첩 카드 구조는 피한다.
- 우측 화살표 아이콘은 대표 전진 CTA 1개에만 사용하고 반복 CTA에는 붙이지 않는다.
- 단독 아이콘은 기본 currentColor에 기대지 말고 주변 UI에 맞는 토큰 컬러를 명시한다.
- 브랜드 모드(\`brand='geniet'\`/\`'trost'\`)에서 작업할 때는 해당 브랜드 prefix 아이콘(예: \`GenietRecordIcon\`, \`GenietGpointIcon\`)을 공용 아이콘보다 **우선 사용**. 매칭 가능한 brand 아이콘은 \`get_brand({ brand: '<slug>' }).detail.brandIconLookup\` 또는 \`find_icon({ query: '<BrandPrefix>' })\` 로 조회. 공통 컴포넌트(Footer/BottomNav 등)의 *구현* 안에 \`if (brand === ...)\` 분기를 박지 말고, 브랜드 전용 화면이 명시적으로 import 해서 icon prop 으로 전달.
- 브랜드 전용 아이콘이 없으면 NudgeEAP 기본 아이콘(\`HomeIcon\`, \`SearchIcon\` 등)을 먼저 사용하고, 그 다음에만 \`MockupLinear*Icon\` / \`MockupBold*Icon\` 을 fallback 으로 사용한다. 자체 생성 SVG는 마지막 수단이다.
- primary solid 버튼은 한 화면의 대표 액션 1개만 사용한다.
- Chip/Badge는 상태, 분류, 짧은 속성 표시용으로만 사용하고 안내문/섹션 장식으로 남발하지 않는다.
- 안내 영역은 neutral surface를 기본으로 하고 색 배경/아이콘/Chip/Badge/굵은 제목 중 1-2개만 조합한다.
- 모든 클릭 가능한 요소는 목업이어도 \`onClick\` 동작을 갖는다.

## 검증 루프

1. DS 원칙 확인: \`get_guide({ topic: "principles" })\`
2. 필요한 컴포넌트/아이콘/토큰 검색
3. 필요한 UX 패턴 확인: \`get_guide({ topic: "pattern:<name>" })\`
4. 목업 구현
5. \`validate_mockup\` 실행 — **응답의 \`summary.checklistReport\` (Self-Check 5항목 결과) 를 코드 아래에 그대로 사용자에게 보여줄 것**. 5항목: ① Spacing 토큰 사용 ② 4pt Grid 준수 ③ Brand BG 1개 이하 ④ 헤딩 장식 아이콘 없음 ⑤ Primary Button 단일성 (영역별). 위반이 1건이라도 있으면 수정 후 재실행. **한 라운드에서 잡힌 violation 은 반드시 한 번에 모아서 fix** — 1건 fix → 재실행 → 또 1건 잡힘 패턴 금지 (불필요한 라운드 + 토큰 낭비). 단 validation 호출 자체를 줄여서 라운드 수를 인위적으로 깎지는 말 것 — 최종 clean pass 는 무조건 확인.
5-bis. **2회 self-check 강제** — 1회차에서 위반이 없었거나 수정해서 0건이 됐어도, \`validate_mockup\` 을 **반드시 한 번 더** 호출해 2회차 결과까지 0건임을 확인. 1회차 통과만 보고 다음 단계로 넘어가는 것 금지 (수정 과정에서 새 위반이 들어올 수 있음). 위반을 인지하고 그대로 제출하는 것도 금지.
5.5. **\`npx tsc --noEmit\` 실행** — invalid prop union(예: \`size="md"\` while only x-large|large|medium|small) 등 validate_mockup 이 못 잡는 타입 에러를 여기서 차단. 0 errors 가 되어야 다음 단계.
6. \`dev_server({ action: "start" })\` 실행
7. dev 서버 미리보기 URL 을 브라우저에서 직접 열어 런타임 오류·빈 화면 여부 확인 후 수정
8. (선택) Inspector 가 셋업돼 있으면 화면 우하단 패널에서 DS 비율 / antd·native 잔존 여부 확인. 미셋업이면 \`get_setup({ step: "inspector" })\` 한 번 호출(자동 패치).
9. \`get_guide({ topic: "dos-donts" })\` 로 최종 확인
10. **\`report_mockup_usage({ filePath: '<mockup경로.tsx>' })\` 호출** — 사용량 집계 적재 (생략 금지). 응답의 \`humanReadable\` 한 줄을 **사용자에게 반드시 보여줄 것**.
11. **단일 HTML 산출물 빌드 (기본 동작 — 물어보지 말 것)**:
    - dev 서버 미리보기 URL 을 명확히 보여주고 직접 확인 권유 (Claude 가 URL 전달을 종종 빠뜨림 — 이 단계 생략 금지).
    - 이 워크스페이스의 **표준 산출물 형식은 단일 HTML 파일**입니다. mockup 작성 후 **반드시 \`build_singlefile_html({})\` 호출** — 사용자에게 "만들어 드릴까요" 라고 묻지 말 것. 그냥 실행하세요.
    - 사용자가 명시적으로 "빌드하지 마" / "TSX 만 줘" / "HTML 필요 없어" 라고 거부한 경우에만 생략 가능.
    - **다른 출력 방식 모두 금지**: 손으로 .html 작성, \`vite build\` 직접 실행, esbuild/parcel/webpack 사용, .tsx 만 남기고 종료 — 모두 금지. nds-* 클래스와 onClick 인터랙션이 손실됨.
    - 빌드 후 \`dist/index.html\` 의 full 절대경로와 파일 크기를 사용자에게 알릴 것 — 이게 슬랙/메일 공유용 최종 산출물입니다. 상대경로만 쓰지 말 것.
12. **최종 검증 + 시트 적재 (필수 · 묻지 말고 즉시 실행)**:
    - 빌드 산출물(\`dist/index.html\`) 또는 렌더된 HTML 을 검증한다 — **\`validate_html_mockup({ filePath: '<프로젝트>/dist/index.html' })\` 또는 \`validate_html_mockup({ source: <렌더된 HTML> })\` 호출** (report 는 default true 라 구글시트까지 자동 적재).
    - React/Vite 워크스페이스는 \`<nds-*>\` 가 런타임에 주입되므로 정적 \`dist/index.html\` shell 만 검증하면 DS 사용량이 낮게 잡힐 수 있다. 정확한 수치가 필요하면 dev 서버에서 렌더된 HTML 을 복사해 \`source\` 로 넘긴다.
    - 응답의 \`dsUsageSummary\` (예: \`DS@0.1.10 · DS 12 (45%)\`) 를 받아 \`<footer>\` 안에 visible 하게 렌더 — \`<span data-ds-badge>DS@0.1.10 · DS 12 (45%)</span>\` 형태. 풋터에 없으면 validator 가 \`ds-badge-missing\` 으로 막음. 통계는 본인이 직접 \`<div>/<span>\` 카운트하지 말 것 — validator 가 단일 SSOT.
13. 사용자에게 dev 서버 URL 또는 \`dist/index.html\` 의 full 절대경로를 명확히 전달한다. 사용자가 검토를 마치면 \`dev_server({ action: "stop" })\` 로 종료.
`;
}

function createInstructionMd(args: {
  cwd?: string;
  projectName?: string;
  overwrite?: boolean;
  intent?: string;
  brand?: string;
  serviceName?: string;
  template?: ClaudeMdTemplateVariant;
  fileName: "CLAUDE.md" | "AGENTS.md";
}) {
  // 라우팅 먼저 — blocked/ambiguous 는 어떤 파일도 만들지 않고 하드스톱한다 (확답 받고 재호출).
  const routing = resolveIntentRouting(args.intent, args.brand);
  if (routing.kind === "blocked-admin") {
    return {
      ok: false,
      filePath: undefined,
      blocked: true,
      error: routing.error,
      options: routing.options,
      supportedAdminBrands: routing.supportedAdminBrands,
    };
  }
  if (routing.kind === "ambiguous-operator") {
    return {
      ok: false,
      filePath: undefined,
      error: undefined,
      needsClarification: routing.question,
      options: routing.options,
    };
  }

  const cwd = path.resolve(args.cwd ?? process.cwd());
  if (!fs.existsSync(cwd)) {
    return { ok: false, filePath: undefined, error: `cwd not found: ${cwd}` };
  }

  const filePath = path.join(cwd, args.fileName);
  const exists = fs.existsSync(filePath);
  if (exists && !args.overwrite) {
    const existing = fs.readFileSync(filePath, "utf-8");
    // 구버전 장문 템플릿 감지 — 2026-05-25 slim 기본 정책 이전에 깔린 파일.
    // 장문 템플릿에만 있는 마커(단계별 호출 게이트 문구)로 판별해 갱신을 1회 유도한다.
    const isLegacyLongTemplate =
      existing.includes("다음 단계별 호출만 허용") || existing.includes("2회 self-check 강제");
    return {
      ok: false,
      filePath,
      exists: true,
      error: `${args.fileName} already exists. Pass overwrite: true to replace it.`,
      ...(isLegacyLongTemplate
        ? {
            _legacyTemplate: true,
            _hint:
              `기존 ${args.fileName} 가 구버전 장문 템플릿입니다. ` +
              `get_setup({ step: 'claude-md', overwrite: true }) 로 갱신하면 슬림 템플릿(토큰 절약 + 최신 워크플로우)으로 교체됩니다. ` +
              `사용자가 ${args.fileName} 를 직접 커스텀했다면 갱신 전에 확인하세요.`,
          }
        : {}),
      preview: existing.slice(0, 1200),
    };
  }

  // 정책 (2026-05-25): backoffice 가 아니면 모두 html 템플릿. 신규 CLAUDE.md 는 slim 이 기본이고,
  // 기존 장문 템플릿은 template: "default" 를 명시했을 때만 생성한다.
  // 어드민 하드게이트 브랜드(캐포비/넛지EAP)는 routing 이 html(surface=admin) 로 우회시켜 DS 템플릿이 나간다.
  const intent = routing.kind === "backoffice" ? "backoffice" : "html";

  const template = args.template === "default" ? "default" : "slim";
  const content = getClaudeMdTemplate({
    projectName: args.projectName,
    intent,
    template,
    serviceName: args.serviceName,
  });
  fs.writeFileSync(filePath, content, "utf-8");

  // 계층 1 — 브랜드 SSOT 마커. brand 가 오면 nudge.brand 를 박아 빌드가 단일 출처에서 읽게 한다.
  const { brandMarker } = writeBrandMarker(cwd, args.brand);
  // 표면 SSOT 마커 — 어드민(b2b) 라우팅이면 nudge.surface=admin 을 박아 validator 표면 룰과 맞물린다.
  const { surfaceMarker } = writeSurfaceMarker(
    cwd,
    routing.kind === "html" ? routing.surface : undefined,
  );

  return {
    ok: true,
    filePath,
    overwritten: exists,
    bytes: Buffer.byteLength(content, "utf-8"),
    intent,
    template,
    brandMarker,
    ...(surfaceMarker ? { surfaceMarker } : {}),
    next:
      args.fileName === "AGENTS.md"
        ? "Restart or reload Codex/agent sessions in this project so the new AGENTS.md instructions are picked up."
        : "Restart or reload Claude Code in this project so the new CLAUDE.md instructions are picked up.",
  };
}

export function createClaudeMd(args: {
  cwd?: string;
  projectName?: string;
  overwrite?: boolean;
  intent?: string;
  brand?: string;
  serviceName?: string;
  template?: ClaudeMdTemplateVariant;
}) {
  return createInstructionMd({ ...args, fileName: "CLAUDE.md" });
}

export function createAgentsMd(args: {
  cwd?: string;
  projectName?: string;
  overwrite?: boolean;
  intent?: string;
  brand?: string;
  serviceName?: string;
  template?: ClaudeMdTemplateVariant;
}) {
  return createInstructionMd({ ...args, fileName: "AGENTS.md" });
}
