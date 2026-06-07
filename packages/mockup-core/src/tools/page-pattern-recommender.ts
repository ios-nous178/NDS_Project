/**
 * 캐시워크 포 비즈니스(cashwalk-biz) 어드민 Page Pattern 추천 — SSOT.
 *
 * PRD(자연어 기획) 텍스트를 받아 5종 Page Pattern(onboarding/dashboard/list/detail/form)을
 * 키워드 점수로 랭킹한다. MCP 툴(recommend_page_pattern)·데스크탑 intake 추천 카드가 함께 쓰는
 * 결정론 코어 — "키워드 점수 + Claude/사용자 확정" 하이브리드에서 **점수(1차 후보) 레이어**다.
 * 최종 확정은 사용자가 카드에서 고르거나, 챗에서 Claude 가 PRD 를 읽고 판단한다.
 *
 * 키워드 원천은 가이드 본문(packages/mcp/src/guides.ts 의 cashwalk-biz-page-* rules[0]
 * "언제 쓰나")을 기계가 읽도록 구조화한 것이다 — 키워드를 바꿀 때 그쪽 prose 와 의미를 맞춘다.
 * 키 집합은 CASHWALK_BIZ_PAGE_PATTERNS 와 1:1(테스트가 강제) — 패턴이 늘면 여기도 같이 늘린다.
 */
import { CASHWALK_BIZ_PAGE_PATTERNS, type CashwalkBizPagePattern } from "./standalone-assets.js";

export interface PagePatternSelection {
  pattern: CashwalkBizPagePattern;
  /** 추천 카드/응답에 쓰는 한국어 라벨. */
  label: string;
  /** "언제 쓰나" 한 줄 요약(카드 보조 설명). */
  when: string;
  /** 강한 신호 — PRD 에 있으면 이 패턴일 가능성 큼(KEYWORD_WEIGHT). */
  keywords: string[];
  /** 약한 신호 — 보조 정황(SIGNAL_WEIGHT). */
  signals: string[];
}

const KEYWORD_WEIGHT = 3;
const SIGNAL_WEIGHT = 1;

/** confident 판정: top 이 키워드 최소 1개(=3점) 이상 + 2위와의 격차가 한 키워드 이상일 때만. */
const MIN_CONFIDENT_SCORE = KEYWORD_WEIGHT; // 3
const CONFIDENT_MARGIN = KEYWORD_WEIGHT; // 3

/**
 * 5종 패턴별 PRD 매칭 신호 — 가이드 "언제 쓰나" 의 기계 판독본.
 * antiKeyword(역신호)는 의도적으로 두지 않는다: Detail 화면 PRD 가 "목록에서 클릭"처럼
 * 다른 패턴 단어를 자연히 포함할 수 있어 역신호가 오히려 오탐을 만든다. 모호하면 confident=false 로
 * 떨어뜨려 사용자/Claude 가 확정하게 한다.
 */
export const PAGE_PATTERN_SELECTION: PagePatternSelection[] = [
  {
    pattern: "onboarding",
    label: "온보딩",
    when: "로그인·회원가입·인증처럼 사이드바 없이 단독 흐름 + 단일 폼 + 단일 CTA.",
    keywords: [
      "로그인",
      "회원가입",
      "비밀번호",
      "이메일 인증",
      "본인인증",
      "가입 완료",
      "가입하기",
      "login",
      "sign up",
      "signup",
      "sign in",
    ],
    signals: ["단독 흐름", "단일 폼", "단일 cta", "중앙 카드", "비로그인", "인증"],
  },
  {
    pattern: "dashboard",
    label: "대시보드",
    when: "여러 데이터를 시각화해 한눈에 보여주는, 사용자가 가장 먼저 보는 진입 화면.",
    keywords: [
      "대시보드",
      "현황",
      "kpi",
      "지표",
      "요약",
      "통계",
      "dashboard",
      "summary",
      "overview",
    ],
    signals: ["한눈에", "진입 화면", "메인", "차트", "그래프", "위젯", "시각화"],
  },
  {
    pattern: "list",
    label: "목록(List)",
    when: "검색·필터·페이지네이션으로 여러 row 를 비교·탐색하는, Detail 진입 전 단계.",
    keywords: [
      "목록",
      "리스트",
      "조회",
      "검색",
      "필터",
      "필터링",
      "테이블",
      "페이지네이션",
      "list",
      "table",
    ],
    signals: ["여러 row", "행", "비교", "탐색", "등록하기", "노출 토글", "상태 배지", "리포트"],
  },
  {
    pattern: "detail",
    label: "상세(Detail)",
    when: "List 에서 row 클릭 후 진입하는 단건 상세/수정 화면(탭·관련 액션 동반).",
    keywords: ["상세", "정보 보기", "상세 정보", "수정", "편집", "detail"],
    signals: ["row 클릭", "탭", "breadcrumb", "인포 카드", "삭제", "실행", "관련 액션"],
  },
  {
    pattern: "form",
    label: "등록/폼(Form)",
    when: "항목을 신규 등록/수정하는 입력 화면. 단건(한 화면·Step Progress 없음)이면 pattern:cashwalk-biz-form-layout(제목+부제 + 하단 sticky Footer 바), 다단계(캠페인→광고→소재 등 Step)면 pattern:cashwalk-biz-page-form 으로 조립.",
    keywords: ["등록", "생성", "신규", "만들기", "step", "스텝", "단계", "마법사", "wizard"],
    signals: ["단계별", "계층", "캠페인", "광고", "소재", "summary panel", "여러 단계"],
  },
];

export interface PagePatternCandidate {
  pattern: CashwalkBizPagePattern;
  label: string;
  when: string;
  /** keyword*3 + signal*1 누적 점수. */
  score: number;
  matchedKeywords: string[];
  matchedSignals: string[];
  /** 카드/응답에 그대로 쓰는 한 줄 근거. */
  why: string;
}

export interface RecommendPagePatternResult {
  /** 5종 전부 — score 내림차순(동점은 패턴 정의 순). */
  ranked: PagePatternCandidate[];
  /** 점수 1위 패턴(0점이면 null = 추천 보류). */
  top: CashwalkBizPagePattern | null;
  /** top 을 자신 있게 추천할 수 있는가(2위와 충분히 벌어졌는가). */
  confident: boolean;
  /** 사람이 읽는 한 줄 종합 코멘트. */
  reason: string;
}

/** haystack(소문자화 완료)에 포함된 term 들을 원형 그대로 모은다(부분 문자열 매칭, 1회씩). */
function matchTerms(haystack: string, terms: string[]): string[] {
  const matched: string[] = [];
  for (const t of terms) {
    const needle = t.toLowerCase().trim();
    if (needle && haystack.includes(needle)) matched.push(t);
  }
  return matched;
}

/**
 * PRD 텍스트로 5종 Page Pattern 을 점수화해 랭킹한다(결정론·순수 함수).
 * 키워드는 가중 3, 보조 신호는 가중 1. 동점은 패턴 정의 순서로 안정 정렬.
 */
export function recommendPagePattern(prd: string): RecommendPagePatternResult {
  const text = (prd ?? "").toLowerCase();
  const order = new Map<CashwalkBizPagePattern, number>(
    CASHWALK_BIZ_PAGE_PATTERNS.map((p, i) => [p, i]),
  );

  const ranked: PagePatternCandidate[] = PAGE_PATTERN_SELECTION.map((sel) => {
    const matchedKeywords = matchTerms(text, sel.keywords);
    const matchedSignals = matchTerms(text, sel.signals);
    const score = matchedKeywords.length * KEYWORD_WEIGHT + matchedSignals.length * SIGNAL_WEIGHT;
    const why = matchedKeywords.length
      ? `PRD 에 '${matchedKeywords.slice(0, 4).join(" · ")}' 키워드 매칭`
      : matchedSignals.length
        ? `PRD 정황 '${matchedSignals.slice(0, 3).join(" · ")}' 일부 일치`
        : "직접 매칭 키워드 없음";
    return {
      pattern: sel.pattern,
      label: sel.label,
      when: sel.when,
      score,
      matchedKeywords,
      matchedSignals,
      why,
    };
  });

  ranked.sort((a, b) => b.score - a.score || order.get(a.pattern)! - order.get(b.pattern)!);

  const top = ranked[0];
  const second = ranked[1];
  const confident =
    top.score >= MIN_CONFIDENT_SCORE && (!second || top.score - second.score >= CONFIDENT_MARGIN);

  const reason =
    top.score === 0
      ? "PRD 에서 패턴 키워드를 찾지 못했습니다 — 5종 중 직접 선택이 필요합니다."
      : confident
        ? `'${top.label}' 로 추천 — ${top.why}.`
        : `'${top.label}' 가 가장 근접하나 확신은 낮습니다(경쟁 패턴 존재) — 사용자 확인 권장.`;

  return {
    ranked,
    top: top.score > 0 ? top.pattern : null,
    confident,
    reason,
  };
}
