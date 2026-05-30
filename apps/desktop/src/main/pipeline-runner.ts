import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  buildSinglefileHtml,
  convertHtmlToDsHtml,
  type BuildSinglefileHtmlResult,
  type ConvertHtmlChange,
} from "@nudge-design/mockup-core";

const pexec = promisify(execFile);

export interface ConvertPreview {
  original: string;
  converted: string;
  changes: ConvertHtmlChange[];
  changed: boolean;
  /** git tracked + uncommitted 변경 여부. null = git repo 아님/감지 불가. */
  gitDirty: boolean | null;
}

export interface PipelineRunResult {
  applied: boolean;
  backupPath?: string;
  build: BuildSinglefileHtmlResult;
}

/** 대상 파일이 git 에서 uncommitted 상태인지. null = git 아님/실패. */
async function gitDirty(filePath: string): Promise<boolean | null> {
  try {
    const { stdout } = await pexec("git", ["status", "--porcelain", "--", filePath], {
      cwd: dirname(filePath),
    });
    return stdout.trim().length > 0;
  } catch {
    return null;
  }
}

/** DS-wrap 변환 결과를 *적용하지 않고* 미리보여준다 (diff + git dirty 경고용). */
export async function previewConvert(mockupPath: string): Promise<ConvertPreview> {
  const original = readFileSync(mockupPath, "utf8");
  const r = convertHtmlToDsHtml({ source: original });
  return {
    original,
    converted: r.output,
    changes: r.changes,
    changed: r.output !== original,
    gitDirty: await gitDirty(mockupPath),
  };
}

function backupPathFor(mockupPath: string): string {
  return `${mockupPath}.bak`;
}

/**
 * 강제 파이프라인. 앱의 유일한 빌드 경로.
 *  - applyConvert 면 변환 결과를 소스에 write-back (직전 .bak 백업).
 *  - buildSinglefileHtml(intent:"html", skipVisualReferences) — audit→stamp→validate→usage→post 체이닝.
 * write-back 은 파괴적이므로 호출 전 renderer 가 diff/ git dirty 를 보여주고 명시 승인을 받는다.
 */
export async function runPipeline(args: {
  mockupPath: string;
  projectPath: string;
  applyConvert: boolean;
}): Promise<PipelineRunResult> {
  let applied = false;
  let backupPath: string | undefined;

  if (args.applyConvert) {
    const original = readFileSync(args.mockupPath, "utf8");
    const { output } = convertHtmlToDsHtml({ source: original });
    if (output !== original) {
      backupPath = backupPathFor(args.mockupPath);
      copyFileSync(args.mockupPath, backupPath); // 파괴적 쓰기 전 백업
      writeFileSync(args.mockupPath, output, "utf8");
      applied = true;
    }
  }

  const build = await buildSinglefileHtml({
    cwd: args.projectPath,
    intent: "html",
    skipVisualReferences: true,
  });

  return { applied, backupPath, build };
}

/** .bak 에서 원본 복원 (write-back 되돌리기). */
export function rollbackConvert(mockupPath: string): boolean {
  const bak = backupPathFor(mockupPath);
  if (!existsSync(bak)) return false;
  copyFileSync(bak, mockupPath);
  return true;
}
