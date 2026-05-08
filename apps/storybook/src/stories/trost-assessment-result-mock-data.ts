/**
 * [TROST-ASSESSMENT-RESULT] 트로스트 검사 결과 페이지 mock 데이터
 */
import type { GaugeSegment, TimelineItem, AssessmentLevel } from "@nudge-eap/react";

export interface AssessmentResult {
  examName: string;
  examShort: string;
  takenAt: string;
  score: number;
  maxScore: number;
  level: AssessmentLevel;
  summary: string;
  detail: string;
  segments: GaugeSegment[];
}

export interface RecommendedCounselor {
  id: string;
  name: string;
  jobTitle: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  bio: string;
}

export interface CrisisInfo {
  show: boolean;
  title: string;
  description: string;
  phones: { label: string; phoneNumber: string; variant?: "solid" | "outlined" }[];
}

/**
 * 시나리오: PHQ-9 14점 → moderate (중등도 우울)
 */
export const result: AssessmentResult = {
  examName: "PHQ-9 우울 자가 검사",
  examShort: "PHQ-9",
  takenAt: "2026.05.07 14:32",
  score: 14,
  maxScore: 27,
  level: "moderate",
  summary: "중등도 우울로, 전문가 상담이 권장됩니다.",
  detail:
    "지난 2주 동안 일상에 영향을 주는 우울 증상이 자주 나타났습니다. 일시적 기분 저하와 달리 일·관계·수면 등 여러 영역에 걸쳐 어려움이 보고되었어요. 혼자 이겨내려 하지 마시고, 전문가와 함께 단계적으로 접근하시는 것이 회복에 효과적입니다.",
  segments: [
    { level: "normal", label: "정상", from: 0, to: 5 },
    { level: "mild", label: "경증", from: 5, to: 10 },
    { level: "moderate", label: "중등도", from: 10, to: 20 },
    { level: "severe", label: "심각", from: 20, to: 28 },
  ],
};

/** severe 시나리오 — Mobile 스토리 등에서 분기 표시용 */
export const severeResult: AssessmentResult = {
  ...result,
  takenAt: "2026.05.07 14:32",
  score: 23,
  level: "severe",
  summary: "심한 우울 상태로, 즉각적인 전문가의 도움이 필요합니다.",
  detail:
    "현재 보고된 증상의 강도와 빈도가 매우 높아 일상 기능이 크게 저하된 상태입니다. 자해·자살에 대한 생각이 있다면 절대 혼자 견디지 마시고, 아래 핫라인을 통해 즉시 도움을 받으세요.",
};

export const crisisInfo: CrisisInfo = {
  show: false, // result.level === "severe" 일 때만 true
  title: "혼자 견디지 마세요",
  description:
    "지금 너무 힘드시다면 24시간 상담받을 수 있어요. 비용은 무료이며, 익명 통화도 가능합니다.",
  phones: [
    { label: "1393 자살예방상담", phoneNumber: "1393" },
    { label: "1577-0199 정신건강위기상담", phoneNumber: "15770199", variant: "outlined" },
  ],
};

export const recommendedCounselors: RecommendedCounselor[] = [
  {
    id: "park",
    name: "박민지",
    jobTitle: "임상심리전문가 · 경력 8년",
    rating: 4.8,
    reviewCount: 312,
    tags: ["우울", "직장스트레스", "CBT"],
    bio: "인지행동치료(CBT) 기반으로 지금 느끼는 감정과 그 원인을 함께 정리해드립니다.",
  },
  {
    id: "kim",
    name: "김도윤",
    jobTitle: "정신건강의학과 전문의",
    rating: 4.9,
    reviewCount: 892,
    tags: ["우울", "불면", "약물 상담"],
    bio: "약물치료가 필요한 단계의 우울·불안을 안전하게 다룹니다.",
  },
];

export const history: TimelineItem[] = [
  {
    key: "h-2026-05-07",
    date: "2026.05.07",
    title: "PHQ-9 우울 자가 검사",
    description: "총점 14점 (중등도)",
    status: "ongoing",
    statusLabel: "오늘",
  },
  {
    key: "h-2026-04-09",
    date: "2026.04.09",
    title: "PHQ-9 우울 자가 검사",
    description: "총점 9점 (경증)",
    status: "warning",
    statusLabel: "경증",
  },
  {
    key: "h-2026-03-12",
    date: "2026.03.12",
    title: "GAD-7 불안 자가 검사",
    description: "총점 6점 (정상)",
    status: "completed",
    statusLabel: "정상",
  },
  {
    key: "h-2026-02-25",
    date: "2026.02.25",
    title: "박민지 상담사와 1:1 상담",
    description: "초기 상담 · 50분",
    status: "completed",
    statusLabel: "완료",
  },
];
