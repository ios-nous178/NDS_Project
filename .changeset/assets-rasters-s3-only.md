---
"@nudge-design/assets": patch
---

npm tgz 슬림화 — 래스터는 S3 로만 전달 (코드·타입·매니페스트·SVG 만 publish)

`package.json` `files` 를 `dist` 통째 → 코드/타입/매니페스트 + `dist/files/**/*.svg` 로 좁혀,
무거운 래스터(PNG/JPG/WEBP, ~6.7MB · 169개)를 npm 패키지에서 뺀다. `@nudge-design/react` 가
이 패키지를 의존하므로 종전엔 모든 react 소비자가 6.7MB 래스터를 transitive 로 끌어왔다.

래스터는 이제 S3/CDN 으로만 전달한다 — `scripts/publish-assets-s3.mjs` 가 `dist/files` 를
버전별 경로로 sync 하고, 호스팅 앱은 `@nudge-design/assets/remote-url` 의
`assetVersionBaseUrl()`/`joinAssetUrl()` 로 URL 을 조립한다. 빌드(`pnpm build`)는 `dist/files`
전체(래스터 포함)를 계속 생성한다 — S3 업로드 소스이자 로컬 목업 인라이너·desktop mcpb 번들
동봉본(디스크엔 그대로, npm tgz 에만 빠짐). SVG 로고와 `getBrandLogo().dataUri` base64 는
종전대로 tgz 에 포함돼 zero-config 로 동작한다.
