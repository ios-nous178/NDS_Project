/**
 * @nudge-design/mockup-core — Nudge DS 목업 결정론 엔진.
 *
 * MCP 서버와 데스크탑 하네스가 공유하는 순수 로직: HTML 빌드(DS-wrap → single-file),
 * 검증(21 룰), DS 버전 감지/스탬프, usage 집계, webhook 전송 IO.
 *
 * MCP transport(@modelcontextprotocol/sdk)·tool 응답 shaping·session-state 같은
 * MCP 전용 레이어는 이 패키지에 들어오지 않는다.
 */

// HTML 분석 / DS-wrap / usage 집계
export * from "./tools/html-analyzer.js";
// 21 룰 검증
export * from "./tools/html-validator.js";
// single-file 빌드 + workspace audit + 버전 badge stamp
export * from "./tools/build-html.js";
// prebuilt DS 단일 자산(dist/standalone) 런타임 로더 — html intent inline 의 자원
export * from "./tools/standalone-assets.js";
// DS 화면 자산(@nudge-design/assets/files/*) on-demand base64 인라이너 — 무배포 단일 HTML
export * from "./tools/asset-inliner.js";
// Vite dev server spawn (하네스는 주로 iframe 미리보기를 쓰지만 보존)
export * from "./tools/preview.js";
// spawn 시 PATH 보강
export * from "./tools/process-env.js";

// usage IO 레이어
export * from "./tools/usage/tracker.js";
export * from "./tools/usage/parser.js";
export * from "./tools/usage/log-path.js";
export * from "./tools/usage/webhook.js";

// catalog → validator 부트스트랩 (데스크탑 main 시작 시 호출)
export * from "./tools/catalog-config.js";

// 유저 피드백 IO 레이어 (데스크탑 하네스 Phase 3)
export * from "./tools/feedback/types.js";
export * from "./tools/feedback/log.js";

// 앱 이벤트 로그 IO 레이어 (데스크탑 하네스 Phase 5)
export * from "./tools/events/types.js";
export * from "./tools/events/log.js";

// 공용 타입
export * from "./types/usage.js";
