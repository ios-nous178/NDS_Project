import { app } from "electron";

/**
 * 업데이트 "알림"만 — GitHub Releases 의 최신 데스크탑 빌드를 조회해 현재 버전과 비교한다.
 *
 * 자동 다운로드/설치는 하지 않는다(코드서명 미설정 → autoUpdater 부적합). 새 버전이 있으면
 * 렌더러가 헤더/헬프센터에 "다운로드" 링크를 띄우고, 클릭 시 shell.openExternal 로 Release
 * 페이지를 기본 브라우저에 연다. 외부 의존성 없음(전역 fetch + AbortController 타임아웃).
 *
 * 데스크탑 릴리즈는 `desktop-v*` 태그 + prerelease 로 올라온다(release-desktop.yml). 그래서
 * `/releases/latest`(= 최신 정식 릴리즈)가 아니라 목록을 받아 `desktop-v` 태그만 골라
 * 최댓값을 고른다 — MCPB(@nudge-design) 릴리즈와 섞이지 않도록.
 *
 * ⚠️ 레포가 프라이빗이라 무인증 호출은 404 → 배포본(토큰 없음)에선 알림이 뜨지 않는다(조용히 무시).
 * `GH_TOKEN`/`GITHUB_TOKEN` 이 있으면 Authorization 헤더로 인증해 조회한다(dev/CI/토큰 보유 환경).
 * 배포본에서도 작동시키려면 (a) 공개 릴리즈 레포 분리 또는 (b) 읽기전용 토큰 임베드 중 하나가 필요.
 */

const OWNER = "cashwalk";
const REPO = "NudgeEAPDesignSystem";
const TAG_PREFIX = "desktop-v";
const RELEASES_API = `https://api.github.com/repos/${OWNER}/${REPO}/releases?per_page=30`;
const TIMEOUT_MS = 6000;
// 한 세션 동안 같은 결과를 재사용(부팅 시 1회 호출이 기본이지만 중복 호출 방지 + API rate limit 보호).
const CACHE_TTL_MS = 10 * 60 * 1000;

export interface UpdateCheckResult {
  /** 현재 실행 중 앱 버전(package.json). */
  currentVersion: string;
  /** 조회된 최신 데스크탑 릴리즈 버전(없으면 null). */
  latestVersion: string | null;
  /** latest > current 일 때만 true. */
  hasUpdate: boolean;
  /** 새 버전 Release 페이지(브라우저로 열 URL). hasUpdate 일 때만 채워진다. */
  releaseUrl: string | null;
  /** 조회 실패 사유(네트워크/레이트리밋 등) — UI 는 조용히 무시한다. */
  error?: string;
}

interface GitHubRelease {
  tag_name?: string;
  html_url?: string;
  draft?: boolean;
}

/** `x.y.z`(뒤 pre-release/빌드 메타는 무시) 를 숫자 3-튜플로. 파싱 실패 시 [0,0,0]. */
function parseVersion(v: string): [number, number, number] {
  const core = v.trim().replace(/^v/, "").split(/[-+]/)[0];
  const parts = core.split(".").map((n) => Number.parseInt(n, 10));
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
}

/** a > b 면 양수, a < b 면 음수, 같으면 0. */
function compareVersions(a: string, b: string): number {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
}

let cached: { at: number; result: UpdateCheckResult } | undefined;

export async function checkForUpdate(): Promise<UpdateCheckResult> {
  const currentVersion = app.getVersion();
  const now = Date.now();
  if (cached && now - cached.at < CACHE_TTL_MS) return cached.result;

  const base: UpdateCheckResult = {
    currentVersion,
    latestVersion: null,
    hasUpdate: false,
    releaseUrl: null,
  };

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    // GitHub API 는 User-Agent 가 없으면 403. 앱 식별자로 보낸다.
    "User-Agent": `NudgeStudio/${currentVersion}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
  // 프라이빗 레포 조회용 토큰(있을 때만). 없으면 무인증 → 404 로 떨어져 조용히 무시된다.
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(RELEASES_API, { headers, signal: controller.signal });
    if (!res.ok) {
      const result = { ...base, error: `GitHub API ${res.status}` };
      cached = { at: now, result };
      return result;
    }
    const releases = (await res.json()) as GitHubRelease[];
    // desktop-v* 태그 + draft 아님만. (prerelease 는 데스크탑 빌드의 정상 상태라 포함.)
    const candidates: { version: string; url: string | null }[] = [];
    for (const r of Array.isArray(releases) ? releases : []) {
      if (r.draft || typeof r.tag_name !== "string" || !r.tag_name.startsWith(TAG_PREFIX)) continue;
      candidates.push({ version: r.tag_name.slice(TAG_PREFIX.length), url: r.html_url ?? null });
    }

    if (candidates.length === 0) {
      const result = { ...base };
      cached = { at: now, result };
      return result;
    }

    const latest = candidates.reduce((best, cur) =>
      compareVersions(cur.version, best.version) > 0 ? cur : best,
    );
    const hasUpdate = compareVersions(latest.version, currentVersion) > 0;
    const result: UpdateCheckResult = {
      currentVersion,
      latestVersion: latest.version,
      hasUpdate,
      releaseUrl: hasUpdate ? latest.url : null,
    };
    cached = { at: now, result };
    return result;
  } catch (e) {
    // 네트워크 실패/타임아웃/오프라인 — 캐시하지 않는다(다음 호출에서 재시도).
    return {
      ...base,
      error: (e as Error).name === "AbortError" ? "timeout" : (e as Error).message,
    };
  } finally {
    clearTimeout(timer);
  }
}
