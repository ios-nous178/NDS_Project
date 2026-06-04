import { app, protocol, net } from "electron";
import { existsSync, readFileSync, statSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import {
  countHtmlUsage,
  detectDsVersions,
  injectDsStampBar,
  injectStandaloneRuntime,
  inlineDsAssetReferencesInHtml,
} from "@nudge-design/mockup-core";
import { resolveBundledDsVersion } from "./ds-version.js";

/**
 * mockup:// — 활성 프로젝트 루트 안의 파일을 iframe 미리보기로 서빙한다.
 *
 * URL 형태: mockup://preview/<프로젝트 루트 기준 상대경로>
 * host(`preview`)는 무시하고 pathname 만 사용. 경로 탈출(../)은 차단한다.
 *
 * Phase 1 은 "선택한 HTML 파일 + 그 상대 자산"을 그대로 서빙한다. <nds-*> 소스
 * 목업의 완전 렌더는 Phase 2 의 enforcePipeline 이 만드는 self-contained
 * dist/index.html 부터 — 그때도 같은 프로토콜로 띄운다.
 */
let previewRoot: string | null = null;

export function setPreviewRoot(root: string | null): void {
  previewRoot = root ? resolve(root) : null;
}

const MIME: Record<string, string> = {
  ".html": "text/html",
  ".htm": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

/**
 * 미리보기 로드 실패를 흰/빈 창(plain-text "not found")이 아니라 읽을 수 있는 다크 안내
 * 페이지로 돌려준다. loadURL 은 404/403 응답을 reject 하지 않고 resolve 하므로(별도 창이든
 * in-app iframe 이든) 본문이 곧 사용자가 보는 화면이 된다 — 그래서 본문을 안내로 채운다.
 */
function errorPage(status: number, title: string, detail: string): Response {
  const esc = (s: string): string =>
    s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] ?? c);
  const html = `<!doctype html><meta charset="utf-8"><title>${esc(title)}</title>
<body style="margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#1e1e1e;color:#d4d4d4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;text-align:center">
<div style="padding:32px;max-width:560px">
<div style="font-size:15px;font-weight:600;color:#f0f0f0;margin-bottom:10px">${esc(title)}</div>
<div style="font-size:12.5px;line-height:1.6;color:#9a9a9a;word-break:break-all">${esc(detail)}</div>
</div></body>`;
  return new Response(html, { status, headers: { "content-type": "text/html; charset=utf-8" } });
}

/** app.whenReady 전에 호출 — privileged 스킴 등록. */
export function registerMockupScheme(): void {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: "mockup",
      privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true },
    },
  ]);
}

/** app.whenReady 후 호출 — 실제 핸들러 등록. */
export function registerMockupProtocol(): void {
  protocol.handle("mockup", async (request) => {
    if (!previewRoot)
      return errorPage(
        404,
        "미리보기를 표시할 수 없어요",
        "활성 프로젝트(미리보기 루트)가 아직 설정되지 않았습니다.",
      );

    const url = new URL(request.url);
    const relPath = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    const abs = resolve(previewRoot, relPath);

    // 경로 탈출 차단: 반드시 previewRoot 하위여야 한다.
    const rel = relative(previewRoot, abs);
    if (rel.startsWith("..") || rel.startsWith(sep) || abs === previewRoot) {
      return errorPage(403, "접근할 수 없는 경로예요", relPath);
    }
    if (!existsSync(abs) || !statSync(abs).isFile()) {
      return errorPage(404, "파일을 찾을 수 없어요", relPath);
    }

    const ext = extname(abs).toLowerCase();
    const mime = MIME[ext];

    // HTML 은 고정 DS 스탬프 바를 인메모리로 주입해 서빙한다(원본 파일 무변경 = 비파괴).
    // 공유용 dist 와 동일한 바를 라이브 미리보기에도 똑같이 박아 "강제 노출"을 일관되게 만든다.
    // (dist 는 이미 박혀 있어도 injectDsStampBar 가 멱등 — 먼저 걷어내고 최신 수치로 다시 박는다.)
    if (ext === ".html" || ext === ".htm") {
      try {
        const raw = readFileSync(abs, "utf8");
        // 작업 중 원본엔 DS runtime/CSS 가 없다(빌드 시점에만 inline) → <nds-*> 가 업그레이드
        // 안 돼 옵션/자식 텍스트가 그대로 노출된다. 미리보기 서빙 직전에 in-memory 로 주입해
        // export 와 동일하게 렌더(원본 무변경·멱등, 이미 인라인된 dist 는 그대로 둠).
        const runtime = injectStandaloneRuntime(raw);
        // DS 화면 자산(@nudge-design/assets/files/*) 을 export 와 동일하게 base64 인라인 —
        // 안 하면 미리보기 iframe 이 규약 경로를 못 풀어 이미지가 엑박으로 깨진다.
        const html = inlineDsAssetReferencesInHtml(runtime).html;
        // NDS% 는 작성자가 쓴 원본 기준 — 주입된 runtime/CSS 가 섞인 html 로 세지 않는다.
        const counts = countHtmlUsage(raw);
        // 동봉 DS 버전(=inline 되는 runtime/CSS 버전)을 우선, 없으면 폴더 기준 자동 감지.
        const dsVersion = resolveBundledDsVersion() ?? detectDsVersions(dirname(abs)).primary;
        const stamped = injectDsStampBar(html, {
          dsVersion,
          ratio: counts.dsRatio,
          appVersion: app.getVersion(),
        });
        return new Response(stamped, {
          status: 200,
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      } catch (err) {
        // 주입 실패 시 원본 그대로 서빙(미리보기 자체는 살린다). 단, 실패 원인을 더 이상
        // 삼키지 않는다 — 콘솔 + 임시 로그 파일에 남겨 "CSS 안 뜸" 진단을 가능하게 한다.
        const e = err as Error;
        const line = `[${new Date().toISOString()}] mockup inject FAILED for ${abs}\n  ${e?.message}\n  ${(e?.stack ?? "").split("\n").slice(1, 5).join("\n  ")}\n`;

        console.error("[mockup-protocol]", line);
        try {
          appendFileSync(join(tmpdir(), "nds-preview-error.log"), line);
        } catch {
          // 로그 파일 쓰기 실패는 무시.
        }
      }
    }

    const res = await net.fetch(pathToFileURL(abs).toString());
    if (mime) {
      const headers = new Headers(res.headers);
      headers.set("content-type", mime);
      return new Response(res.body, { status: res.status, headers });
    }
    return res;
  });
}
