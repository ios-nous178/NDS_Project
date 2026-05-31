import { copyFileSync, existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { createHash } from "node:crypto";
import type { AgentType } from "./agent-runner.js";

/**
 * 목업 인테이크 — 에이전트 시작 *전에* 하네스가 게이트 충족 파일을 결정론적으로 작성한다.
 *
 * "모델이 알아서 시각 레퍼런스 게이트를 지키길" 기대하는 대신, 폼 입력(브랜드·표면·기획서·
 * 스크린샷)을 받아 `<projectPath>/<slug>/` 서브폴더에 references.md / brief.md / CLAUDE.md /
 * AGENTS.md 를 써두고 PTY 첫 프롬프트를 시드한다. Electron 비의존(순수 fs) — 단위 테스트 용이.
 *
 * 라우팅은 MCP `resolveEffectiveIntent`(guides.ts:140) 와 동일 규칙을 미러한다.
 */

export type Surface = "service" | "admin";

/**
 * 제작 대상 플랫폼/폼팩터 — 고객용(service) 화면에서 묻는다(admin 은 항상 데스크탑 웹).
 * 에이전트가 반응형 폭·인터랙션·레이아웃을 어디에 맞출지 결정하는 핵심 입력.
 */
export type Platform = "web-desktop" | "web-mobile" | "web-responsive" | "app";

const PLATFORM_LABELS: Record<Platform, string> = {
  "web-desktop": "웹 · 데스크탑",
  "web-mobile": "웹 · 모바일",
  "web-responsive": "웹 · 데스크탑+모바일(반응형)",
  app: "앱(모바일 네이티브 느낌)",
};

const PLATFORM_GUIDANCE: Record<Platform, string> = {
  "web-desktop":
    "데스크탑 웹 기준(넓은 뷰포트). 좌우 여백·다단 레이아웃·호버 인터랙션을 활용하고, 모바일 전용 패턴(바텀시트/탭바)은 피한다.",
  "web-mobile":
    "모바일 웹 기준(좁은 뷰포트, ~390px). 한 손 조작·세로 스크롤·큰 탭 타겟. 데스크탑 전용 호버 의존 금지.",
  "web-responsive":
    "데스크탑+모바일 반응형. 모바일(~390px)과 데스크탑(~1280px) 양쪽이 자연스럽게 동작하도록 브레이크포인트를 설계한다.",
  app: "모바일 앱 화면(네이티브 느낌). 앱 헤더/바텀 내비 등 브랜드 앱 크롬을 사용하고 ~390px 폭을 기준으로 한다.",
};

/** guides.ts:126 `DS_ADMIN_BRANDS` 미러 — 자체 어드민 디자인을 가진 브랜드(antd 우회, DS 로 제작). */
const DS_ADMIN_BRANDS = ["cashwalk-biz"];

const ALLOWED_IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);
const ALLOWED_DOC_EXT = new Set([".pdf", ".md", ".markdown", ".txt", ".html", ".htm"]);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB / 이미지
const MAX_DOC_BYTES = 20 * 1024 * 1024; // 20MB / 문서(PDF 등)
const MAX_TOTAL_BYTES = 50 * 1024 * 1024; // 50MB / 합(이미지 + 문서)

export interface ScreenshotInput {
  fileName: string;
  /** base64 본문(접두사 제거). click-pick / 붙여넣기 경로. */
  base64?: string;
  /** 절대경로. 드래그드롭(webUtils.getPathForFile) 경로 — 멀티MB IPC 회피. */
  sourcePath?: string;
}

/** 기획 문서 첨부(PDF·MD·TXT). 전송 형태는 ScreenshotInput 과 동일. */
export type AttachmentInput = ScreenshotInput;

export interface RunIntakeArgs {
  projectPath: string;
  brand: string;
  surface: Surface;
  screenName: string;
  /** 사용자가 편집한 슬러그(없으면 brand-kebab(screenName) 자동). */
  slug?: string;
  prd: string;
  extraRequirements?: string;
  /** 고객용 화면의 제작 대상 플랫폼(웹 데스크탑/모바일/반응형 · 앱). admin 이면 무시. */
  platform?: Platform;
  screenshots: ScreenshotInput[];
  /** 기획 문서 첨부(brief/ 폴더에 저장 + brief.md 에 경로 노출). */
  attachments?: AttachmentInput[];
  figmaUrls?: string[];
  agentType: AgentType;
  /**
   * UI 방향 게이트.
   * - auto: PRD 가 명확하면 바로 생성, 불명확하면 먼저 2-3개 방향 제안 후 대기.
   * - propose: 항상 방향 제안 후 사용자 선택 대기.
   * - skip: PRD/selectedDirection 을 확정 방향으로 보고 바로 생성.
   */
  directionMode?: "auto" | "propose" | "skip";
  /** 사용자가 이미 고른/명시한 UI 방향. 있으면 brief.md 에 고정한다. */
  selectedDirection?: string;
}

export interface RunIntakeResult {
  ok: boolean;
  error?: string;
  /** PTY cwd = 이 서브폴더. */
  workspaceDir?: string;
  slug?: string;
  intent?: "html" | "admin-cms";
  seedPrompt?: string;
}

/** 어드민 && 자체 어드민 디자인 없는 브랜드 → antd CMS, 그 외 → HTML(NDS web component). */
export function resolveIntent(surface: Surface, brand: string): "html" | "admin-cms" {
  if (surface === "admin" && !DS_ADMIN_BRANDS.includes(brand)) return "admin-cms";
  return "html";
}

/** 소문자 + 비영숫자 런을 '-' 로, 양끝 '-' 제거. */
function kebab(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function shortHash(s: string): string {
  return createHash("sha256").update(s).digest("hex").slice(0, 6);
}

/** brand-<kebab(screenName)>; kebab 이 비면(한글 등) screen-<hash> 폴백. */
export function computeSlug(brand: string, screenName: string, override?: string): string {
  const overridden = override?.trim();
  if (overridden) return kebab(overridden) || `${brand}-screen-${shortHash(screenName)}`;
  const screenSlug = kebab(screenName) || `screen-${shortHash(screenName)}`;
  return `${brand}-${screenSlug}`;
}

/** 이미 존재하는 서브폴더면 -2, -3 … suffix(비파괴). */
function uniqueWorkspaceDir(projectPath: string, slug: string): { slug: string; dir: string } {
  let candidate = slug;
  let n = 1;
  while (existsSync(join(projectPath, candidate))) {
    n += 1;
    candidate = `${slug}-${n}`;
  }
  return { slug: candidate, dir: join(projectPath, candidate) };
}

function sanitizeFileName(name: string, fallback: string): string {
  const ext = extname(name).toLowerCase();
  const stem = kebab(basename(name, extname(name))) || fallback;
  return `${stem}${ext}`;
}

/** 확장자/크기 사전 검증 + 합계 바이트 측정(디렉토리 만들기 전에 막는다). */
function measureFiles(
  files: ScreenshotInput[],
  allowedExt: Set<string>,
  maxBytes: number,
  kind: string,
): { bytes: number; error?: string } {
  let bytes = 0;
  for (const f of files) {
    const ext = extname(f.fileName).toLowerCase();
    if (!allowedExt.has(ext)) return { bytes, error: `${kind} 형식이 아닙니다: ${f.fileName}` };
    let size = 0;
    if (f.sourcePath) {
      try {
        size = statSync(f.sourcePath).size;
      } catch {
        return { bytes, error: `파일을 읽을 수 없습니다: ${f.fileName}` };
      }
    } else if (f.base64) {
      size = Math.floor((f.base64.length * 3) / 4);
    }
    if (size > maxBytes) {
      return {
        bytes,
        error: `${f.fileName} 이(가) ${Math.round(maxBytes / 1024 / 1024)}MB 를 초과합니다.`,
      };
    }
    bytes += size;
  }
  return { bytes };
}

/** 입력 파일들을 destDir 에 저장(파일명 충돌 시 -1/-2 suffix). 저장된 파일명 목록 반환. */
function saveFiles(files: ScreenshotInput[], destDir: string, fallbackStem: string): string[] {
  if (files.length === 0) return [];
  mkdirSync(destDir, { recursive: true });
  const used = new Set<string>();
  const saved: string[] = [];
  for (const f of files) {
    let name = sanitizeFileName(f.fileName, fallbackStem);
    if (used.has(name)) {
      const ext = extname(name);
      const stem = basename(name, ext);
      let i = 1;
      while (used.has(`${stem}-${i}${ext}`)) i += 1;
      name = `${stem}-${i}${ext}`;
    }
    used.add(name);
    const dest = join(destDir, name);
    if (f.sourcePath) copyFileSync(f.sourcePath, dest);
    else if (f.base64) writeFileSync(dest, Buffer.from(f.base64, "base64"));
    else continue;
    saved.push(name);
  }
  return saved;
}

function bootstrapDoc(brand: string, surface: Surface, intent: string): string {
  return `# DS 목업 워크스페이스

브랜드: ${brand} · 표면: ${surface} · 타겟: ${intent}

이 폴더는 Nudge DS 목업 작업 공간입니다. **nudge-eap-ds MCP 서버가 규칙의 SSOT** 입니다.
- references.md = 시각 레퍼런스(있으면 게이트 충족). brief.md = 기획서 + 추가 요구사항.
- brief.md 의 "UI 방향 결정" 섹션이 있으면 그 결정을 우선한다. auto/propose 모드면 코드 작성 전 방향 판단/제안을 먼저 끝낸다.
- 워크플로우(intent=${intent}): get_guide({topic:'principles'}) + dos-donts → get_brand({brand:'${brand}'})
  → get_guide({topic:'pattern:ui-direction-proposal'})
  → 컴포넌트 가이드 1개씩(target:'html') → index.html 을 <nds-*> + 시멘틱 토큰으로 작성(raw hex 금지)
  → validate_html_mockup → build_singlefile_html (html intent 는 자동 검증).
- **이 폴더에 곧장 index.html 을 쓰세요.** vite/npm·get_setup 스캐폴딩·DS 패키지 설치는 불필요합니다 —
  이 앱(Nudge Studio)이 build_singlefile_html 으로 prebuilt DS runtime/CSS 를 자동 inline 합니다.
  npm create vite / npm install @nudge-design/* 를 실행하지 마세요(이 환경엔 tarball 이 없습니다).
${intent === "admin-cms" ? "- intent=admin-cms: antd / NudgeEAPCMS .tsx 경로 사용(이 경우만 vite react-ts + npm 필요)." : ""}
`;
}

function briefDoc(args: RunIntakeArgs, intent: string, docNames: string[]): string {
  const attachSection = docNames.length
    ? `\n## 첨부 문서 (반드시 읽을 것)\n${docNames.map((n) => `- brief/${n}`).join("\n")}\n`
    : "";
  const directionMode = args.directionMode ?? "auto";
  const selectedDirection = args.selectedDirection?.trim();
  const directionSection = `\n## UI 방향 결정\n- mode: ${directionMode}\n${
    selectedDirection
      ? `\n### 확정/참고 방향\n${selectedDirection}\n`
      : "\n### 확정/참고 방향\n(미입력)\n"
  }\n### 판단 기준\n- PRD 에 첫 화면 강조점, 정보 우선순위, CTA 전략, 핵심 흐름이 명확하면 방향 제안 없이 진행.\n- 기능/데이터 목록만 있고 구성 전략이 불명확하면 코드 작성 전에 이 화면 안에서 가능한 UI/UX 방향 2-3개를 구체적으로 제안하고 사용자 선택을 기다림.\n- 방향 제안은 화면 유형 분류가 아니라 같은 기획서 안의 정보 위계, 사용자 흐름, CTA 배치, 불안/망설임 해소 전략 차이를 비교해야 함.\n`;
  const platformSection =
    args.surface === "service" && args.platform
      ? `\n## 제작 대상 플랫폼\n- ${PLATFORM_LABELS[args.platform]}\n- ${PLATFORM_GUIDANCE[args.platform]}\n`
      : "";
  return `# ${args.screenName}

브랜드: ${args.brand} · 표면: ${args.surface} · intent: ${intent}
${platformSection}
## 기획
${args.prd?.trim() || "(미입력)"}

## 추가 요구사항
${args.extraRequirements?.trim() || "(없음)"}
${directionSection}
${attachSection}`;
}

function seedPrompt(args: RunIntakeArgs, intent: string, hasVisual: boolean): string {
  const visualLine = hasVisual
    ? "references.md 가 시각 레퍼런스 게이트를 충족하므로 레퍼런스 재질문 없이 진행."
    : "시각 레퍼런스가 아직 없음 — 빌드 전에 Figma/스크린샷 1개 이상을 사용자에게 요청할 것(DS 시각 게이트).";
  const mode = args.directionMode ?? "auto";
  const visualGateLine = hasVisual
    ? ""
    : "시각 레퍼런스 게이트가 UI 방향 판단보다 우선한다. 레퍼런스가 없으면 방향 제안/질문은 가능하지만 index.html 작성과 빌드는 Figma/스크린샷 1개 이상을 받은 뒤 진행.";
  const directionLine =
    mode === "propose"
      ? "코드 작성 전에 brief.md 를 읽고 이 화면 안의 UI/UX 방향 2-3개를 먼저 제안한 뒤 사용자 선택을 기다려."
      : mode === "skip"
        ? "brief.md 의 기획/확정 방향을 기준으로 방향 재질문 없이 바로 생성해."
        : "brief.md 를 읽고 UI 방향이 명확하면 바로 생성하고, 불명확하면 코드 작성 전에 이 화면 안의 UI/UX 방향 2-3개를 먼저 제안한 뒤 사용자 선택을 기다려.";
  const platformLine =
    args.surface === "service" && args.platform
      ? `제작 대상 플랫폼=${PLATFORM_LABELS[args.platform]} (${PLATFORM_GUIDANCE[args.platform]}). `
      : "";
  return `이 폴더의 CLAUDE.md/AGENTS.md, ${hasVisual ? "references.md, " : ""}brief.md 를 먼저 읽고 목업을 만들어줘. 브랜드=${args.brand}, 표면=${args.surface}, 타겟 intent=${intent}. ${platformLine}${visualLine} ${visualGateLine} ${directionLine}`;
}

export function runIntake(args: RunIntakeArgs): RunIntakeResult {
  try {
    const intent = resolveIntent(args.surface, args.brand);

    // ── 첨부 사전 검증(확장자/크기/합계) — 디렉토리 만들기 전에 막는다. ──
    const screenshots = args.screenshots ?? [];
    const attachments = args.attachments ?? [];
    const img = measureFiles(screenshots, ALLOWED_IMAGE_EXT, MAX_IMAGE_BYTES, "이미지");
    if (img.error) return { ok: false, error: img.error };
    const doc = measureFiles(attachments, ALLOWED_DOC_EXT, MAX_DOC_BYTES, "문서(PDF·MD·TXT·HTML)");
    if (doc.error) return { ok: false, error: doc.error };
    if (img.bytes + doc.bytes > MAX_TOTAL_BYTES) {
      return { ok: false, error: `첨부 합계가 ${MAX_TOTAL_BYTES / 1024 / 1024}MB 를 초과합니다.` };
    }

    // ── 슬러그 + 워크스페이스(중복 시 비파괴 suffix). ──
    const baseSlug = computeSlug(args.brand, args.screenName, args.slug);
    const { slug, dir: workspaceDir } = uniqueWorkspaceDir(args.projectPath, baseSlug);
    mkdirSync(workspaceDir, { recursive: true });

    const figmaUrls = (args.figmaUrls ?? []).map((u) => u.trim()).filter(Boolean);
    const hasVisual = screenshots.length > 0 || figmaUrls.length > 0;

    // ── 파일 저장: 스크린샷 → .references/, 기획 문서 → brief/. ──
    const savedNames = saveFiles(screenshots, join(workspaceDir, ".references"), "image");
    const savedDocs = saveFiles(attachments, join(workspaceDir, "brief"), "doc");

    // ── references.md (시각 ≥1 일 때만 — 빈 references 로 게이트 거짓 충족 방지). ──
    if (hasVisual) {
      const lines = [`task: ${slug}`];
      for (const url of figmaUrls) lines.push(`[good] source=${url} caption=피그마 레퍼런스`);
      for (const name of savedNames) {
        lines.push(`[good] source=.references/${name} caption=사용자 제공 레퍼런스`);
      }
      writeFileSync(join(workspaceDir, "references.md"), lines.join("\n") + "\n", "utf8");
    }

    // ── brief.md + 부트스트랩(CLAUDE.md = AGENTS.md). ──
    writeFileSync(join(workspaceDir, "brief.md"), briefDoc(args, intent, savedDocs), "utf8");
    const bootstrap = bootstrapDoc(args.brand, args.surface, intent);
    writeFileSync(join(workspaceDir, "CLAUDE.md"), bootstrap, "utf8");
    writeFileSync(join(workspaceDir, "AGENTS.md"), bootstrap, "utf8");

    return {
      ok: true,
      workspaceDir,
      slug,
      intent,
      seedPrompt: seedPrompt(args, intent, hasVisual),
    };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
