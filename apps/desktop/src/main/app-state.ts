import { app } from "electron";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * 앱 재시작에도 살아남아야 하는 최소 상태(userData/app-state.json).
 *
 * 지금은 마지막으로 연 프로젝트 폴더만 보관한다 — 미리보기 프로토콜(mockup://)의
 * previewRoot 는 main 프로세스 모듈 변수라 재시작하면 null 로 돌아가, 다시 "프로젝트 열기"
 * 하기 전엔 "no preview root" 가 떴다. 시작 시 이 값으로 previewRoot 를 복원한다.
 */
export interface AppState {
  lastProjectPath?: string;
}

function statePath(): string {
  return join(app.getPath("userData"), "app-state.json");
}

export function readAppState(): AppState {
  try {
    return JSON.parse(readFileSync(statePath(), "utf8")) as AppState;
  } catch {
    return {};
  }
}

export function writeAppState(patch: Partial<AppState>): void {
  try {
    const next = { ...readAppState(), ...patch };
    const p = statePath();
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, JSON.stringify(next, null, 2));
  } catch {
    // persistence 실패는 치명적이지 않다 — 다음 "프로젝트 열기" 때 다시 기록된다.
  }
}

/** 저장된 마지막 프로젝트가 아직 디스크에 존재하면 그 경로를, 아니면 null. */
export function lastValidProjectPath(): string | null {
  const last = readAppState().lastProjectPath;
  return last && existsSync(last) ? last : null;
}
