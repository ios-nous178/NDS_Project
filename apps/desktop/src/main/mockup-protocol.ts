import { app, protocol, net } from "electron";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import {
  countHtmlUsage,
  detectDsVersions,
  injectDsStampBar,
  injectStandaloneRuntime,
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
        const html = injectStandaloneRuntime(raw);
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
      } catch {
        // 주입 실패 시 원본 그대로 서빙(미리보기 자체는 살린다).
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
