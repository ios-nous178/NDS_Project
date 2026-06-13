---
"@nudge-design/icons": patch
"@nudge-design/mcp": patch
---

아이콘은 정적 npm 으로만 배포 — S3 런타임 fetch / 버전 surfacing 제거

SVG 아이콘을 S3 로 옮기던 작업을 되돌렸습니다. 아이콘은 작고(수 KB) 트리셰이킹·타입세이프·오프라인 렌더링 이점이 커서 정적 `@nudge-design/icons` npm 패키지로 유지하는 게 맞습니다(런타임 S3 fetch 는 FOUC 만 생기고 얻는 게 없음). 무거운 raster 자산(로고/일러스트)만 S3 하이브리드를 유지합니다.

- `@nudge-design/icons`: `./remote-url`·`./manifest.json` 서브패스 export 제거, 빌드에서 S3용 manifest 생성 단계 제거. 아이콘은 자체 npm 버전 트랙(additive → patch/minor bump)을 유지하되 `manifest.json`/S3 에 미러하지 않습니다.
- MCP/목업 스탬프: 아이콘 버전(`icon_version` / ICON 세그먼트) surfacing 제거. DS·asset 버전 표기는 그대로입니다.
- 퍼블리시 스크립트(`publish-assets-s3`)·버전 sync(`sync-mcpb-version`)·MCPB 번들에서 아이콘 S3 경로 제거(에셋 S3 는 유지).
