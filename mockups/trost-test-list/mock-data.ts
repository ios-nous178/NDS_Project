/**
 * [TROST-TEST-LIST] Mock Data
 * Mockup Renderer 산출물 — ephemeral
 */

export interface PsychTest {
  id: string;
  rank: number;
  name: string;
  typeKeyword: "증상형" | "자기 이해형" | "상황형" | "종합형";
  description: string;
  participants: number;
  duration: string;
  questions: number;
  url: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface TagChip {
  label: string;
  linkedTestUrl: string;
}

export interface EmotionRoute {
  label: string;
  description: string;
  url: string;
  emoji: string;
}

export const tests: PsychTest[] = [
  {
    id: "comprehensive",
    rank: 1,
    name: "종합 심리검사",
    typeKeyword: "종합형",
    description:
      "우울, 불안, 스트레스, 자존감 등 전반적인 심리 상태를 한 번에 점검하는 종합 검사입니다.",
    participants: 284520,
    duration: "약 5분",
    questions: 30,
    url: "/test/comprehensive",
  },
  {
    id: "personality",
    rank: 2,
    name: "종합 성격검사",
    typeKeyword: "종합형",
    description: "나의 성격 유형과 강점, 약점을 파악하여 더 나은 자기 이해를 돕는 검사입니다.",
    participants: 195830,
    duration: "약 7분",
    questions: 40,
    url: "/test/personality",
  },
  {
    id: "depression",
    rank: 3,
    name: "우울증 검사",
    typeKeyword: "증상형",
    description:
      "PHQ-9 기반으로 우울 증상의 수준을 측정합니다. 지속적인 기분 저하, 흥미 상실 등을 점검합니다.",
    participants: 312450,
    duration: "약 3분",
    questions: 9,
    url: "/test/depression",
  },
  {
    id: "self-esteem",
    rank: 4,
    name: "자존감 검사",
    typeKeyword: "자기 이해형",
    description: "로젠버그 자존감 척도를 활용하여 자기 가치감 수준을 확인합니다.",
    participants: 178920,
    duration: "약 3분",
    questions: 10,
    url: "/test/self-esteem",
  },
  {
    id: "mbti-depression",
    rank: 5,
    name: "MBTI 우울증 검사",
    typeKeyword: "자기 이해형",
    description: "MBTI 성격 유형에 따라 우울 증상이 어떻게 나타나는지 알아보는 검사입니다.",
    participants: 156740,
    duration: "약 5분",
    questions: 20,
    url: "/test/mbti-depression",
  },
  {
    id: "job-stress",
    rank: 6,
    name: "직무 스트레스 검사",
    typeKeyword: "상황형",
    description: "직장 내 스트레스 수준을 측정하고 번아웃 위험도를 확인합니다.",
    participants: 98340,
    duration: "약 5분",
    questions: 25,
    url: "/test/job-stress",
  },
  {
    id: "career-stress",
    rank: 7,
    name: "취업 스트레스 검사",
    typeKeyword: "상황형",
    description: "취업 준비 과정에서 느끼는 스트레스와 불안 수준을 점검합니다.",
    participants: 67890,
    duration: "약 4분",
    questions: 15,
    url: "/test/career-stress",
  },
  {
    id: "covid-depression",
    rank: 8,
    name: "코로나 우울증 검사",
    typeKeyword: "증상형",
    description: "코로나19 이후 사회적 고립, 일상 변화로 인한 우울감을 점검합니다.",
    participants: 54210,
    duration: "약 3분",
    questions: 12,
    url: "/test/covid-depression",
  },
  {
    id: "depression-type",
    rank: 9,
    name: "우울 유형 검사",
    typeKeyword: "증상형",
    description: "우울의 원인과 유형을 분석하여 나에게 맞는 대처 방법을 안내합니다.",
    participants: 89670,
    duration: "약 4분",
    questions: 18,
    url: "/test/depression-type",
  },
  {
    id: "panic",
    rank: 10,
    name: "공황 증상 자가점검",
    typeKeyword: "증상형",
    description: "공황 발작 및 관련 증상의 빈도와 수준을 자가점검합니다.",
    participants: 43520,
    duration: "약 3분",
    questions: 10,
    url: "/test/panic",
  },
];

export const faqs: FAQ[] = [
  {
    question: "심리검사는 무료로 할 수 있나요?",
    answer:
      "트로스트의 심리검사는 모두 무료로 제공되며, 언제든지 부담 없이 바로 시작할 수 있습니다.",
  },
  {
    question: "검사 결과는 정확한가요?",
    answer:
      "트로스트의 심리검사는 PHQ-9, 로젠버그 자존감 척도 등 검증된 심리학 도구를 기반으로 합니다. 다만, 자가진단 결과는 참고용이며 전문 상담이 필요할 수 있습니다.",
  },
  {
    question: "검사 결과를 다시 볼 수 있나요?",
    answer:
      "네, 로그인 후 검사를 완료하면 마이페이지에서 과거 검사 결과를 언제든 다시 확인할 수 있습니다.",
  },
  {
    question: "어떤 검사부터 시작하면 좋을까요?",
    answer:
      "특별히 고민되는 증상이 없다면 종합 심리검사부터 시작하는 것을 추천합니다. 전반적인 심리 상태를 파악한 후 필요한 세부 검사를 진행할 수 있습니다.",
  },
  {
    question: "검사는 얼마나 걸리나요?",
    answer:
      "대부분의 검사는 3~7분 정도 소요됩니다. 가장 짧은 검사(우울증 검사)는 약 3분, 가장 긴 검사(종합 성격검사)는 약 7분 정도 걸립니다.",
  },
  {
    question: "검사 후 전문 상담도 받을 수 있나요?",
    answer:
      "네, 검사 결과에 따라 전문 상담사와 1:1 상담을 연결받을 수 있습니다. 검사 결과 페이지에서 바로 상담 신청이 가능합니다.",
  },
  {
    question: "개인정보는 안전하게 보호되나요?",
    answer:
      "검사 결과는 암호화되어 안전하게 보관되며, 본인 외에는 접근할 수 없습니다. 트로스트는 개인정보보호법을 준수합니다.",
  },
  {
    question: "검사 후에는 무엇을 할 수 있나요?",
    answer:
      "검사 결과를 바탕으로 맞춤 콘텐츠 추천, 전문 상담사 연결, 커뮤니티 참여 등 다양한 후속 활동을 이용할 수 있습니다.",
  },
];

export const relatedTags: TagChip[] = [
  { label: "우울증 자가진단 테스트", linkedTestUrl: "/test/depression" },
  { label: "공황장애 자가점검", linkedTestUrl: "/test/panic" },
  { label: "자존감 테스트 무료", linkedTestUrl: "/test/self-esteem" },
  { label: "직장인 번아웃 검사", linkedTestUrl: "/test/job-stress" },
  { label: "취준생 스트레스 자가진단", linkedTestUrl: "/test/career-stress" },
  { label: "온라인 심리검사 무료", linkedTestUrl: "/test/comprehensive" },
  { label: "성격유형 검사", linkedTestUrl: "/test/personality" },
  { label: "우울감 체크리스트", linkedTestUrl: "/test/depression-type" },
  { label: "정신건강 자가진단", linkedTestUrl: "/test/comprehensive" },
];

export const emotionRoutes: EmotionRoute[] = [
  {
    label: "우울",
    description: "기분이 가라앉거나 의욕이 없다면",
    url: "/test/depression-type",
    emoji: "😢",
  },
  {
    label: "자존감",
    description: "나를 더 잘 이해하고 싶다면",
    url: "/test/self-esteem",
    emoji: "💪",
  },
  {
    label: "성격·기질",
    description: "나의 성격 유형이 궁금하다면",
    url: "/test/personality",
    emoji: "🔍",
  },
  {
    label: "스트레스",
    description: "직장이나 일상에서 지쳐있다면",
    url: "/test/job-stress",
    emoji: "😮‍💨",
  },
];

export const infoHubText = `심리검사는 내 마음 상태를 객관적으로 살펴보는 첫걸음입니다. 트로스트에서는 우울, 스트레스, 자존감, 성격 등 다양한 영역의 무료 심리검사를 제공하고 있습니다.

심리검사는 크게 네 가지 유형으로 나눌 수 있습니다. **증상형 검사**는 우울, 공황 등 특정 증상의 수준을 측정합니다. **자기 이해형 검사**는 자존감, 성격 유형 등 자기 자신에 대한 이해를 돕습니다. **상황형 검사**는 직무 스트레스, 취업 스트레스 등 특정 상황에서의 심리 상태를 점검합니다. **종합형 검사**는 여러 영역을 한 번에 평가하여 전반적인 심리 건강 상태를 확인합니다.

어떤 검사를 먼저 해야 할지 모르겠다면, 종합 심리검사부터 시작해보세요. 3분이면 충분합니다.`;

export const selectionGuideText = `**증상이 있다면 — 증상형 검사부터**
우울감, 무기력, 공황 증상 등 특정 증상이 느껴진다면 해당 증상에 맞는 검사를 먼저 진행하세요. 우울증 검사(PHQ-9)는 전 세계적으로 가장 널리 사용되는 우울 선별 도구입니다.

**상황이 힘들다면 — 상황형 검사를**
직장에서의 번아웃, 취업 준비의 압박감 등 특정 상황에서 오는 스트레스가 있다면 상황형 검사가 도움이 됩니다.

**나를 더 알고 싶다면 — 자기 이해형 검사를**
뚜렷한 증상은 없지만 자기 자신에 대해 더 알고 싶다면 자존감 검사나 성격 검사를 추천합니다.

**잘 모르겠다면 — 종합형 검사부터**
종합 심리검사는 여러 영역을 한 번에 점검하므로, 어디서부터 시작할지 모를 때 가장 좋은 선택입니다.`;
