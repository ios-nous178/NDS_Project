import { buildSinglefileHtml, type BuildSinglefileHtmlResult } from "@nudge-design/mockup-core";

export interface ExportResult {
  build: BuildSinglefileHtmlResult;
  /** projectPath 기준 공유용 산출물 상대경로 (성공 시). */
  outputRel?: string;
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
export async function exportMockup(projectPath: string): Promise<ExportResult> {
  const build = await buildSinglefileHtml({
    cwd: projectPath,
    intent: "html",
    skipVisualReferences: true,
    skipSourceBadge: true,
  });

  let outputRel: string | undefined;
  if (build.ok && build.outputPath) {
    outputRel = build.outputPath.startsWith(projectPath)
      ? build.outputPath.slice(projectPath.length).replace(/^[/\\]+/, "")
      : build.outputPath;
  }
  return { build, outputRel };
}
