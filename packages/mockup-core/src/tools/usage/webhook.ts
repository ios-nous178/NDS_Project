/**
 * tools/usage/webhook.ts — 공용 usage/feedback 전송 엔드포인트 SSOT.
 *
 * 이전에는 `tools/usage.ts` 와 `tools/html-analyzer.ts` 두 곳에 같은 URL 상수가
 * 중복 정의돼 drift 위험이 있었다. 이제 core 의 이 모듈 하나가 유일한 출처다.
 * (Phase 3 에서 feedback 전송용 `postJsonToWebhook` 일반화가 여기 추가될 예정.)
 */
export const USAGE_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbzgWCu2Y5BygcMakF9qItU3d-bvducUD3mFkryqLQ5RiSRPF1ExzUnkyYDimsTb7d74/exec";
