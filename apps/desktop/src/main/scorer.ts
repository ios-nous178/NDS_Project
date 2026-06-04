/**
 * 독립 LLM 품질 scorer (Eval D2) — **SSOT 는 @nudge-design/mockup-core 로 이동**.
 *
 * 루브릭/파싱/클램프/라벨/임계값/verdict(순수) 는 mockup-core/tools/quality-score-core,
 * `claude -p` spawn 실행기는 mockup-core/tools/quality-score-runner 에 있고 MCP 와 공유한다.
 * 이 파일은 기존 import 경로(`./scorer.js`)를 깨지 않으려는 얇은 re-export 일 뿐 — 새 코드는
 * mockup-core 서브패스를 직접 import 해도 된다.
 */
export {
  LLM_SCORE_KEYS,
  type LlmScoreKey,
  type LlmScoreResult,
  reduceHtmlForScoring,
  clampScore,
  buildScoringPrompt,
  parseScores,
  llmOverall,
  D1_DIMENSION_LABELS,
  D2_SCORE_LABELS,
  scoreLabel,
  SCORE_THRESHOLDS,
  type ScoreVerdict,
  VERDICT_LABELS,
  verdictFor,
  type QualityGrade,
  gradeQuality,
  gateGuidance,
  formatScoreCard,
} from "@nudge-design/mockup-core/tools/quality-score-core";

export {
  scoreMockupQuality,
  type ScoreMockupArgs,
} from "@nudge-design/mockup-core/tools/quality-score-runner";
