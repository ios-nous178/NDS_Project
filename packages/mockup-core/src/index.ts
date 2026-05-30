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

// 공용 타입
export * from "./types/usage.js";
