/* ─── 복용약 찾기 더미 데이터 ─── */

export type MedicationCategory = "항우울제" | "항불안제" | "수면제" | "기분안정제" | "ADHD 치료제";

export type CautionLevel = "낮음" | "보통" | "높음";

export type PillShape = "원형" | "타원형" | "캡슐" | "장방형" | "삼각형";
export type PillColor = "흰색" | "노란색" | "분홍색" | "파란색" | "초록색" | "주황색" | "빨간색";

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  category: MedicationCategory;
  description: string;
  sideEffects: string[];
  cautionLevel: CautionLevel;
  userCount: number;
  interactions: string[];
  /** 관련 증상 키워드 */
  symptoms: string[];
  /** 약 외형 정보 */
  pill: { shape: PillShape; color: PillColor; imprint?: string };
  /** 제약사 */
  manufacturer: string;
}

export const categories: { key: "전체" | MedicationCategory; label: string }[] = [
  { key: "전체", label: "전체" },
  { key: "항우울제", label: "항우울제" },
  { key: "항불안제", label: "항불안제" },
  { key: "수면제", label: "수면제" },
  { key: "기분안정제", label: "기분안정제" },
  { key: "ADHD 치료제", label: "ADHD 치료제" },
];

export const symptoms = [
  { key: "우울", label: "우울감", icon: "😢" },
  { key: "불안", label: "불안/초조", icon: "😰" },
  { key: "불면", label: "불면증", icon: "🌙" },
  { key: "공황", label: "공황발작", icon: "💨" },
  { key: "집중", label: "집중력 저하", icon: "🎯" },
  { key: "기분변화", label: "기분 기복", icon: "🎭" },
  { key: "강박", label: "강박 증상", icon: "🔄" },
  { key: "식욕", label: "식욕 변화", icon: "🍽️" },
];

export const pillShapes: { key: PillShape; label: string; svg: string }[] = [
  { key: "원형", label: "원형", svg: "M12 2a10 10 0 100 20 10 10 0 000-20z" },
  { key: "타원형", label: "타원형", svg: "M6 12c0-4 2.7-7 6-7s6 3 6 7-2.7 7-6 7-6-3-6-7z" },
  { key: "캡슐", label: "캡슐", svg: "M7 6h10a5 5 0 010 10H7a5 5 0 010-10z" },
  {
    key: "장방형",
    label: "장방형",
    svg: "M4 8h16a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2z",
  },
  { key: "삼각형", label: "삼각형", svg: "M12 4l9 16H3z" },
];

export const pillColors: { key: PillColor; hex: string }[] = [
  { key: "흰색", hex: "#F5F5F5" },
  { key: "노란색", hex: "#FFD54F" },
  { key: "분홍색", hex: "#F48FB1" },
  { key: "파란색", hex: "#64B5F6" },
  { key: "초록색", hex: "#81C784" },
  { key: "주황색", hex: "#FFB74D" },
  { key: "빨간색", hex: "#E57373" },
];

export const medications: Medication[] = [
  {
    id: "escitalopram",
    name: "렉사프로",
    genericName: "에스시탈로프람 (Escitalopram)",
    category: "항우울제",
    description: "선택적 세로토닌 재흡수 억제제(SSRI). 우울증 및 범불안장애 치료에 사용됩니다.",
    sideEffects: ["메스꺼움", "두통", "불면", "성기능 장애", "입마름"],
    cautionLevel: "보통",
    userCount: 48200,
    interactions: ["트라마돌", "세인트존스워트", "MAO 억제제"],
    symptoms: ["우울", "불안"],
    pill: { shape: "원형", color: "흰색", imprint: "FL 10" },
    manufacturer: "한국룬드벡",
  },
  {
    id: "sertraline",
    name: "졸로푸트",
    genericName: "설트랄린 (Sertraline)",
    category: "항우울제",
    description: "SSRI 계열 항우울제. 우울증, 공황장애, PTSD, 강박장애 치료에 사용됩니다.",
    sideEffects: ["설사", "메스꺼움", "두통", "어지러움", "불면"],
    cautionLevel: "보통",
    userCount: 35600,
    interactions: ["피모자이드", "MAO 억제제", "와파린"],
    symptoms: ["우울", "공황", "강박"],
    pill: { shape: "타원형", color: "파란색", imprint: "ZLT 50" },
    manufacturer: "한국화이자",
  },
  {
    id: "fluoxetine",
    name: "프로작",
    genericName: "플루옥세틴 (Fluoxetine)",
    category: "항우울제",
    description: "SSRI 계열. 우울증, 강박장애, 폭식증 치료에 널리 사용되는 대표적 항우울제입니다.",
    sideEffects: ["불안", "불면", "두통", "메스꺼움", "식욕 감소"],
    cautionLevel: "보통",
    userCount: 29100,
    interactions: ["MAO 억제제", "티오리다진", "피모자이드"],
    symptoms: ["우울", "강박", "식욕"],
    pill: { shape: "캡슐", color: "초록색", imprint: "LILLY 3105" },
    manufacturer: "한국릴리",
  },
  {
    id: "alprazolam",
    name: "자낙스",
    genericName: "알프라졸람 (Alprazolam)",
    category: "항불안제",
    description: "벤조디아제핀 계열 항불안제. 급성 불안과 공황장애의 단기 치료에 사용됩니다.",
    sideEffects: ["졸림", "어지러움", "기억력 저하", "의존성", "집중력 감소"],
    cautionLevel: "높음",
    userCount: 42300,
    interactions: ["알코올", "오피오이드", "케토코나졸"],
    symptoms: ["불안", "공황"],
    pill: { shape: "타원형", color: "주황색", imprint: "XANAX 0.5" },
    manufacturer: "한국화이자",
  },
  {
    id: "lorazepam",
    name: "아티반",
    genericName: "로라제팜 (Lorazepam)",
    category: "항불안제",
    description: "벤조디아제핀 계열. 불안장애, 불면증, 수술 전 진정에 사용됩니다.",
    sideEffects: ["졸림", "무력감", "어지러움", "의존성"],
    cautionLevel: "높음",
    userCount: 31500,
    interactions: ["알코올", "클로자핀", "발프로산"],
    symptoms: ["불안", "불면"],
    pill: { shape: "원형", color: "흰색", imprint: "A 1" },
    manufacturer: "한국화이자",
  },
  {
    id: "zolpidem",
    name: "스틸녹스",
    genericName: "졸피뎀 (Zolpidem)",
    category: "수면제",
    description: "비벤조디아제핀 수면제. 단기 불면증 치료에 사용되며, 수면 유도를 돕습니다.",
    sideEffects: ["졸림", "두통", "어지러움", "몽유병", "기억상실"],
    cautionLevel: "높음",
    userCount: 52100,
    interactions: ["알코올", "CNS 억제제", "리팜핀"],
    symptoms: ["불면"],
    pill: { shape: "장방형", color: "분홍색", imprint: "AMB 10" },
    manufacturer: "사노피",
  },
  {
    id: "trazodone",
    name: "트라조돈",
    genericName: "트라조돈 (Trazodone)",
    category: "수면제",
    description: "세로토닌 조절제. 저용량에서 불면증 치료에, 고용량에서 우울증 치료에 사용됩니다.",
    sideEffects: ["졸림", "어지러움", "입마름", "저혈압"],
    cautionLevel: "보통",
    userCount: 18700,
    interactions: ["MAO 억제제", "케토코나졸", "디곡신"],
    symptoms: ["불면", "우울"],
    pill: { shape: "원형", color: "흰색", imprint: "TR 50" },
    manufacturer: "명인제약",
  },
  {
    id: "lithium",
    name: "리튬",
    genericName: "리튬 (Lithium)",
    category: "기분안정제",
    description:
      "조울증(양극성장애) 치료의 1차 약물. 조증 삽화 예방과 자살 위험 감소에 효과적입니다.",
    sideEffects: ["손떨림", "갈증", "빈뇨", "체중 증가", "갑상선 기능 저하"],
    cautionLevel: "높음",
    userCount: 15400,
    interactions: ["NSAIDs", "ACE 억제제", "이뇨제"],
    symptoms: ["기분변화"],
    pill: { shape: "원형", color: "흰색", imprint: "LI 300" },
    manufacturer: "대웅제약",
  },
  {
    id: "valproate",
    name: "데파코트",
    genericName: "발프로산 (Valproate)",
    category: "기분안정제",
    description: "항경련제 겸 기분안정제. 양극성장애, 간질, 편두통 예방에 사용됩니다.",
    sideEffects: ["체중 증가", "졸림", "탈모", "간 기능 이상", "떨림"],
    cautionLevel: "높음",
    userCount: 22800,
    interactions: ["카바페넴", "라모트리진", "아스피린"],
    symptoms: ["기분변화"],
    pill: { shape: "타원형", color: "빨간색", imprint: "DP 250" },
    manufacturer: "한국애브비",
  },
  {
    id: "methylphenidate",
    name: "콘서타",
    genericName: "메틸페니데이트 (Methylphenidate)",
    category: "ADHD 치료제",
    description: "중추신경자극제. ADHD의 집중력 향상과 충동 조절에 사용됩니다.",
    sideEffects: ["식욕 감소", "불면", "두통", "복통", "심박수 증가"],
    cautionLevel: "보통",
    userCount: 38900,
    interactions: ["MAO 억제제", "혈압약", "항경련제"],
    symptoms: ["집중"],
    pill: { shape: "캡슐", color: "노란색", imprint: "alza 18" },
    manufacturer: "한국얀센",
  },
  {
    id: "atomoxetine",
    name: "스트라테라",
    genericName: "아토목세틴 (Atomoxetine)",
    category: "ADHD 치료제",
    description: "비자극제 ADHD 치료제. 노르에피네프린 재흡수를 억제하여 집중력을 높입니다.",
    sideEffects: ["메스꺼움", "식욕 감소", "구토", "피로", "어지러움"],
    cautionLevel: "보통",
    userCount: 14200,
    interactions: ["MAO 억제제", "플루옥세틴", "파록세틴"],
    symptoms: ["집중"],
    pill: { shape: "캡슐", color: "파란색", imprint: "LILLY 3228" },
    manufacturer: "한국릴리",
  },
  {
    id: "quetiapine",
    name: "쎄로퀠",
    genericName: "퀘티아핀 (Quetiapine)",
    category: "수면제",
    description: "비정형 항정신병 약물. 저용량에서 수면 유도 및 불안 완화에 사용됩니다.",
    sideEffects: ["졸림", "체중 증가", "어지러움", "입마름", "변비"],
    cautionLevel: "보통",
    userCount: 27600,
    interactions: ["케토코나졸", "페니토인", "카바마제핀"],
    symptoms: ["불면", "불안"],
    pill: { shape: "원형", color: "노란색", imprint: "SEROQUEL 25" },
    manufacturer: "한국아스트라제네카",
  },
];

export const popularSearches = [
  "렉사프로",
  "자낙스",
  "스틸녹스",
  "콘서타",
  "졸로푸트",
  "리튬",
  "프로작",
];

export const faqs = [
  {
    question: "약물 정보는 어디서 가져오나요?",
    answer:
      "트로스트의 약물 정보는 식약처 공개 데이터와 전문 약사의 감수를 거쳐 제공됩니다. 단, 의학적 진단이나 처방을 대체하지 않으며, 정확한 복용법은 반드시 담당 의료진과 상담하세요.",
  },
  {
    question: "약을 바꾸고 싶은데 어떻게 해야 하나요?",
    answer:
      "약물 변경은 반드시 담당 의사와 상의해야 합니다. 임의로 약을 중단하거나 변경하면 금단 증상이나 증상 악화가 발생할 수 있습니다. 트로스트에서 전문 상담사와 먼저 이야기해 보세요.",
  },
  {
    question: "부작용이 심한데 어떻게 해야 하나요?",
    answer:
      "부작용이 일상생활에 지장을 줄 정도라면 즉시 담당 의사에게 알려주세요. 용량 조절이나 약물 변경으로 개선될 수 있습니다. 급성 부작용(호흡곤란, 심한 발진 등)은 응급실을 방문하세요.",
  },
  {
    question: "여러 약을 함께 먹어도 되나요?",
    answer:
      "약물 간 상호작용은 매우 중요합니다. 복용 중인 모든 약물(건강기능식품 포함)을 담당 의사에게 알려주세요. 트로스트의 약물 상호작용 정보를 참고하되, 최종 판단은 의료진과 함께 하세요.",
  },
  {
    question: "트로스트 상담사에게 약물 상담을 받을 수 있나요?",
    answer:
      "네, 트로스트에는 약물 복용과 관련된 심리적 어려움(부작용 스트레스, 약물 의존 불안 등)을 상담할 수 있는 전문 상담사가 있습니다. 약물 처방 자체는 의사만 가능하지만, 복약 과정에서의 심리적 지원을 받으실 수 있습니다.",
  },
];

export const relatedTags = [
  { label: "항우울제 종류", url: "/medication?category=항우울제" },
  { label: "수면제 부작용", url: "/medication?q=수면제+부작용" },
  { label: "ADHD 약 비교", url: "/medication?category=ADHD+치료제" },
  { label: "벤조디아제핀 의존성", url: "/medication?q=벤조디아제핀" },
  { label: "항불안제 종류", url: "/medication?category=항불안제" },
  { label: "기분안정제 리튬", url: "/medication/lithium" },
  { label: "SSRI vs SNRI", url: "/medication?q=SSRI" },
  { label: "약 부작용 대처법", url: "/guide/side-effects" },
  { label: "복약 상담", url: "/counselor?specialty=medication" },
];

export const cautionGuides = [
  {
    title: "임의로 약을 끊지 마세요",
    description:
      "갑작스런 단약은 금단 증상을 유발할 수 있습니다. 약 변경이나 중단은 반드시 의사와 상의하세요.",
    icon: "🚫",
  },
  {
    title: "복용 중인 약을 모두 알리세요",
    description:
      "건강기능식품, 한약 포함 복용 중인 모든 약을 의사에게 알려야 상호작용 위험을 줄일 수 있습니다.",
    icon: "📋",
  },
  {
    title: "음주를 피하세요",
    description: "대부분의 정신건강 약물은 알코올과 상호작용합니다. 복용 중에는 음주를 삼가세요.",
    icon: "🍷",
  },
];
