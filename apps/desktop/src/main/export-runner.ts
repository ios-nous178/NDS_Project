import { buildSinglefileHtml, type BuildSinglefileHtmlResult } from "@nudge-design/mockup-core";
import { resolveBundledDsVersions } from "./ds-version.js";

export interface ExportResult {
  build: BuildSinglefileHtmlResult;
  /** workspaceDir(빌드 cwd) 기준 상대경로 — 예: "dist/index.html". */
  workspaceOutputRel?: string;
  /** projectPath(미리보기 프로토콜 root) 기준 상대경로 — 예: "geniet-home/dist/index.html".
   *  앱 미리보기/선택 목록은 반드시 이 값을 쓴다(workspace 기준만 주면 루트 dist 를 찾는 버그). */
  projectOutputRel?: string;
}

/**
 * 비파괴 내보내기 — 앱의 유일한 산출 경로.
 *
 * 원본 소스는 절대 건드리지 않는다(skipSourceBadge). vite single-file 빌드로 DS
 * 런타임/스타일/토큰을 inline 한 자체완결 dist/index.html(=공유용 HTML)을 만들고,
 * 그 안에서 audit→버전 stamp(dist)→검증→usage 집계→webhook posting 까지 체이닝된다.
 * 생성은 Claude Code 가 따로 하므로 시각 레퍼런스 게이트는 끈다(skipVisualReferences).
 * DS-wrap 준수는 검증 패널의 native-interactive 등으로 강제(원본을 mutate 하지 않음).
 */
/**
 * @param projectPath 미리보기 프로토콜 root(세션/이벤트 SSOT). rel 경로의 기준.
 * @param workspaceDir 실제 빌드 cwd(인테이크 목업 서브폴더). 없으면 projectPath.
 */
export async function exportMockup(
  projectPath: string,
  workspaceDir: string = projectPath,
  appVersion?: string,
): Promise<ExportResult> {
  const bundledVersions = resolveBundledDsVersions();
  const build = await buildSinglefileHtml({
    cwd: workspaceDir,
    intent: "html",
    skipVisualReferences: true,
    skipSourceBadge: true,
    // 고정 DS 스탬프 바를 공유본에 박는다(하네스 전용). Nudge Studio 버전 + 동봉 DS 버전 노출.
    stampBar: true,
    appVersion,
    dsVersion: bundledVersions.dsVersion ?? undefined,
    assetVersion: bundledVersions.assetVersion ?? undefined,
  });

  let workspaceOutputRel: string | undefined;
  let projectOutputRel: string | undefined;
  if (build.ok && build.outputPath) {
    const rel = (base: string): string | undefined =>
      build.outputPath!.startsWith(base)
        ? build.outputPath!.slice(base.length).replace(/^[/\\]+/, "")
        : undefined;
    workspaceOutputRel = rel(workspaceDir) ?? build.outputPath;
    projectOutputRel = rel(projectPath) ?? build.outputPath;
  }
  return { build, workspaceOutputRel, projectOutputRel };
}
