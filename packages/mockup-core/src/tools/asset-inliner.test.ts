import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

import {
  inlineDsAssetReferences,
  resolveAssetsFilesDir,
  ASSET_REF_PREFIX,
} from "./asset-inliner.js";

// 실제 dev 해석 경로(require.resolve("@nudge-design/assets/package.json"))를 그대로 검증.
const resolvedDir = resolveAssetsFilesDir();
if (!resolvedDir)
  throw new Error("dev 에서 @nudge-design/assets/dist/files 를 해석할 수 있어야 한다");
const assetsFilesDir: string = resolvedDir;

// dist/files 안에서 실재하는 png 한 장을 골라 규약 경로를 만든다(하드코딩 회피).
function pickRealAsset(): string {
  const walk = (dir: string): string | undefined => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        const hit = walk(p);
        if (hit) return hit;
      } else if (e.isFile() && e.name.endsWith(".png")) {
        return path.relative(assetsFilesDir, p).split(path.sep).join("/");
      }
    }
    return undefined;
  };
  const rel = walk(assetsFilesDir);
  assert.ok(rel, "dist/files 에 png 자산이 있어야 테스트 가능");
  return rel;
}

test("resolveAssetsFilesDir: dist/files 디렉터리를 해석", () => {
  assert.equal(resolveAssetsFilesDir(), assetsFilesDir);
});

test("img[src] 의 DS 자산 참조를 base64 data URI 로 치환", () => {
  const rel = pickRealAsset();
  const $ = cheerio.load(`<img src="${ASSET_REF_PREFIX}${rel}" alt="x">`);
  const result = inlineDsAssetReferences($);

  assert.deepEqual(result.missing, []);
  assert.deepEqual(result.inlined, [rel]);
  const src = $("img").attr("src") ?? "";
  assert.match(src, /^data:image\/png;base64,/);
});

test("srcset 의 각 URL 만 치환하고 descriptor(2x/3x)는 보존", () => {
  const rel = pickRealAsset();
  const $ = cheerio.load(
    `<img srcset="${ASSET_REF_PREFIX}${rel} 2x, ${ASSET_REF_PREFIX}${rel} 3x">`,
  );
  const result = inlineDsAssetReferences($);
  assert.deepEqual(result.missing, []);

  const srcset = $("img").attr("srcset") ?? "";
  assert.match(srcset, /^data:image\/png;base64,[^ ]+ 2x, data:image\/png;base64,[^ ]+ 3x$/);
});

test("http(s):// 절대 URL · 비 DS 참조는 건드리지 않음", () => {
  const $ = cheerio.load(`<img src="https://cdn.example.com/a.png"><img src="/local/b.png">`);
  const result = inlineDsAssetReferences($);
  assert.deepEqual(result.inlined, []);
  assert.deepEqual(result.missing, []);
  assert.equal($("img").eq(0).attr("src"), "https://cdn.example.com/a.png");
  assert.equal($("img").eq(1).attr("src"), "/local/b.png");
});

test("규약 prefix 인데 파일이 없으면 missing 으로 보고하고 원본 보존", () => {
  const bogus = `${ASSET_REF_PREFIX}does-not-exist/nope.png`;
  const $ = cheerio.load(`<img src="${bogus}">`);
  const result = inlineDsAssetReferences($);
  assert.deepEqual(result.inlined, []);
  assert.deepEqual(result.missing, ["does-not-exist/nope.png"]);
  assert.equal($("img").attr("src"), bogus);
});

test("CSS url() (인라인 style)도 치환", () => {
  const rel = pickRealAsset();
  const $ = cheerio.load(
    `<div style="background: url(${ASSET_REF_PREFIX}${rel}) no-repeat"></div>`,
  );
  const result = inlineDsAssetReferences($);
  assert.deepEqual(result.inlined, [rel]);
  assert.match($("div").attr("style") ?? "", /url\(data:image\/png;base64,/);
});
