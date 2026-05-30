import { protocol, net } from "electron";
import { existsSync, statSync } from "node:fs";
import { extname, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

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
    if (!previewRoot) return new Response("no preview root", { status: 404 });

    const url = new URL(request.url);
    const relPath = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    const abs = resolve(previewRoot, relPath);

    // 경로 탈출 차단: 반드시 previewRoot 하위여야 한다.
    const rel = relative(previewRoot, abs);
    if (rel.startsWith("..") || rel.startsWith(sep) || abs === previewRoot) {
      return new Response("forbidden", { status: 403 });
    }
    if (!existsSync(abs) || !statSync(abs).isFile()) {
      return new Response("not found", { status: 404 });
    }

    const res = await net.fetch(pathToFileURL(abs).toString());
    const mime = MIME[extname(abs).toLowerCase()];
    if (mime) {
      const headers = new Headers(res.headers);
      headers.set("content-type", mime);
      return new Response(res.body, { status: res.status, headers });
    }
    return res;
  });
}
