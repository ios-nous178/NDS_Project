/* ─── 복용약 상세 페이지 더미 데이터 ─── */

export interface SideEffectDetail {
  name: string;
  frequency: "매우 흔함" | "흔함" | "보통" | "드묾" | "매우 드묾";
  /** 발생 비율 (%) */
  percent: number;
  description: string;
  severity: "경미" | "보통" | "심각";
}

export interface InteractionDetail {
  drugName: string;
  severity: "주의" | "경고" | "금기";
  description: string;
}

export interface DosageInfo {
  target: string;
  initial: string;
  maintenance: string;
  max: string;
}

export interface UserReview {
  id: string;
  nickname: string;
  age: string;
  duration: string;
  rating: number;
  content: string;
  helpful: number;
  date: string;
  tags: string[];
}

export interface RelatedArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  url: string;
}

export interface MedicationDetail {
  id: string;
  name: string;
  genericName: string;
  englishName: string;
  category: string;
  subCategory: string;
  cautionLevel: "낮음" | "보통" | "높음";
  manufacturer: string;
  approvalDate: string;
  insuranceCovered: boolean;
  pill: { shape: string; color: string; imprint: string; size: string };
  userCount: number;
  reviewCount: number;
  avgRating: number;

  /** 상세 설명 */
  description: string;
  /** 작용 기전 */
  mechanism: string;
  /** 적응증 */
  indications: string[];
  /** 금기 사항 */
  contraindications: string[];

  /** 부작용 상세 */
  sideEffects: SideEffectDetail[];
  /** 상호작용 상세 */
  interactions: InteractionDetail[];
  /** 용법·용량 */
  dosages: DosageInfo[];
  /** 복용 시 주의사항 */
  precautions: string[];
  /** 보관 방법 */
  storage: string;

  /** 사용자 리뷰 */
  reviews: UserReview[];
  /** 관련 콘텐츠 */
  relatedArticles: RelatedArticle[];
  /** 유사 약물 (비교 데이터 포함) */
  similarDrugs: SimilarDrug[];
  /** 커뮤니티 게시글 */
  communityPosts: CommunityPost[];
  /** 추천 상담사 */
  recommendedCounselors: Counselor[];

  /** 자주 묻는 질문 */
  faqs: { question: string; answer: string }[];
}

export interface SimilarDrug {
  id: string;
  name: string;
  genericName: string;
  category: string;
  avgRating: number;
  reviewCount: number;
  /** 대표 부작용 3개 */
  topSideEffects: string[];
  /** 장점 키워드 */
  pros: string[];
  /** 단점 키워드 */
  cons: string[];
  cautionLevel: "낮음" | "보통" | "높음";
  insuranceCovered: boolean;
}

export interface CommunityPost {
  id: string;
  title: string;
  preview: string;
  author: string;
  category: string;
  likeCount: number;
  commentCount: number;
  date: string;
  tags: string[];
}

export interface Counselor {
  id: string;
  name: string;
  title: string;
  profileImage: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  experience: string;
  introduction: string;
  availableToday: boolean;
  price: number;
  /** 이 약물 관련 상담 횟수 */
  medicationCounselCount: number;
}

/* ══════════════════════════════════════════
 * 렉사프로 (에스시탈로프람) 상세 데이터
 * ══════════════════════════════════════════ */

export const medicationDetail: MedicationDetail = {
  id: "escitalopram",
  name: "렉사프로",
  genericName: "에스시탈로프람 (Escitalopram)",
  englishName: "Lexapro",
  category: "항우울제",
  subCategory: "선택적 세로토닌 재흡수 억제제 (SSRI)",
  cautionLevel: "보통",
  manufacturer: "한국룬드벡",
  approvalDate: "2004.03.15",
  insuranceCovered: true,
  pill: { shape: "원형", color: "흰색", imprint: "FL 10", size: "직경 8mm" },
  userCount: 48200,
  reviewCount: 1247,
  avgRating: 4.2,

  description: `렉사프로(에스시탈로프람)는 선택적 세로토닌 재흡수 억제제(SSRI) 계열의 항우울제입니다. 뇌 속 세로토닌 농도를 높여 우울감, 불안감을 완화하는 데 도움을 줍니다.

시탈로프람(Citalopram)의 활성 이성질체로, 기존 시탈로프람 대비 더 선택적으로 세로토닌 수송체에 작용하여 부작용이 적고 효과가 빠른 것이 특징입니다.

우울증과 범불안장애에 대해 FDA 승인을 받았으며, 국내에서도 건강보험 급여가 적용되는 1차 치료 약물입니다.`,

  mechanism: `에스시탈로프람은 시냅스 전 뉴런의 세로토닌 수송체(SERT)에 선택적으로 결합하여 세로토닌의 재흡수를 차단합니다. 이를 통해 시냅스 간극의 세로토닌 농도가 높아지며, 이것이 기분 개선과 불안 감소로 이어집니다.

SSRI 중에서도 세로토닌 수송체에 대한 선택성이 가장 높아, 다른 신경전달물질(노르에피네프린, 도파민 등)에 대한 영향이 적습니다. 이 때문에 다른 SSRI 대비 부작용이 적은 편입니다.

일반적으로 복용 시작 후 2~4주 뒤부터 항우울 효과가 나타나기 시작하며, 최대 효과는 6~8주 정도 소요됩니다.`,

  indications: [
    "주요 우울장애 (Major Depressive Disorder)",
    "범불안장애 (Generalized Anxiety Disorder)",
    "사회불안장애 (Social Anxiety Disorder)",
    "공황장애 (Panic Disorder)",
    "강박장애 (OCD) — 국내 허가외 사용",
  ],

  contraindications: [
    "에스시탈로프람 또는 시탈로프람에 과민반응이 있는 경우",
    "MAO 억제제를 복용 중이거나, 중단 후 14일 이내인 경우",
    "피모자이드(Pimozide)를 복용 중인 경우",
    "QT 연장 증후군이 있거나 QT 연장을 유발하는 약물 복용 중인 경우",
    "리네졸리드(Linezolid) 정맥 투여 중인 경우",
  ],

  sideEffects: [
    {
      name: "메스꺼움",
      frequency: "매우 흔함",
      percent: 18,
      description:
        "복용 초기 1~2주간 가장 흔하게 나타나며, 대부분 시간이 지나면 완화됩니다. 식후 복용하면 줄일 수 있습니다.",
      severity: "경미",
    },
    {
      name: "두통",
      frequency: "흔함",
      percent: 14,
      description: "복용 초기에 나타날 수 있으며, 보통 1~2주 내에 호전됩니다.",
      severity: "경미",
    },
    {
      name: "불면",
      frequency: "흔함",
      percent: 12,
      description: "수면 패턴에 영향을 줄 수 있습니다. 아침에 복용하면 줄일 수 있습니다.",
      severity: "경미",
    },
    {
      name: "졸림",
      frequency: "흔함",
      percent: 9,
      description:
        "일부 환자에서 졸림이 나타날 수 있습니다. 저녁 복용으로 전환을 고려할 수 있습니다.",
      severity: "경미",
    },
    {
      name: "입마름",
      frequency: "흔함",
      percent: 8,
      description: "침 분비 감소로 인해 발생합니다. 수분을 충분히 섭취하세요.",
      severity: "경미",
    },
    {
      name: "성기능 장애",
      frequency: "흔함",
      percent: 7,
      description: "성욕 감소, 발기부전, 오르가즘 지연 등이 나타날 수 있습니다. 의사와 상담하세요.",
      severity: "보통",
    },
    {
      name: "체중 변화",
      frequency: "보통",
      percent: 5,
      description:
        "체중 증가 또는 감소가 나타날 수 있습니다. 장기 복용 시 정기적인 체중 확인이 권장됩니다.",
      severity: "경미",
    },
    {
      name: "어지러움",
      frequency: "보통",
      percent: 4,
      description: "일어설 때 어지러움이 느껴질 수 있습니다. 천천히 일어나세요.",
      severity: "경미",
    },
    {
      name: "발한 증가",
      frequency: "보통",
      percent: 4,
      description: "비정상적인 발한이 나타날 수 있습니다.",
      severity: "경미",
    },
    {
      name: "설사",
      frequency: "보통",
      percent: 3,
      description: "위장관 증상으로 설사가 나타날 수 있습니다.",
      severity: "경미",
    },
    {
      name: "세로토닌 증후군",
      frequency: "매우 드묾",
      percent: 0.1,
      description:
        "다른 세로토닌 활성 약물과 병용 시 드물게 발생할 수 있습니다. 고열, 근육 경직, 의식 변화 시 즉시 응급실을 방문하세요.",
      severity: "심각",
    },
    {
      name: "QT 연장",
      frequency: "매우 드묾",
      percent: 0.05,
      description:
        "고용량(20mg 초과) 복용 시 심전도 QT 간격이 연장될 수 있습니다. 정기적인 심전도 검사가 권장됩니다.",
      severity: "심각",
    },
  ],

  interactions: [
    {
      drugName: "MAO 억제제 (모클로베미드, 셀레길린 등)",
      severity: "금기",
      description:
        "치명적인 세로토닌 증후군을 유발할 수 있습니다. 반드시 14일 간격을 두고 교체해야 합니다.",
    },
    {
      drugName: "피모자이드 (Pimozide)",
      severity: "금기",
      description: "심장 부정맥(QT 연장) 위험이 크게 증가합니다.",
    },
    {
      drugName: "트라마돌 (Tramadol)",
      severity: "경고",
      description: "세로토닌 증후군 위험이 증가하고, 경련 역치가 낮아질 수 있습니다.",
    },
    {
      drugName: "세인트존스워트 (St. John's Wort)",
      severity: "경고",
      description:
        "세로토닌 증후군 위험이 증가합니다. 건강기능식품이므로 간과하기 쉬우니 주의하세요.",
    },
    {
      drugName: "와파린 (Warfarin)",
      severity: "주의",
      description: "출혈 위험이 증가할 수 있습니다. 정기적인 INR 모니터링이 필요합니다.",
    },
    {
      drugName: "NSAIDs (이부프로펜, 아스피린 등)",
      severity: "주의",
      description: "위장관 출혈 위험이 증가할 수 있습니다.",
    },
    {
      drugName: "리튬 (Lithium)",
      severity: "주의",
      description: "세로토닌 작용이 증강될 수 있으며, 리튬 농도 상승 가능성이 있습니다.",
    },
    {
      drugName: "트립탄 계열 (수마트립탄 등)",
      severity: "주의",
      description: "편두통 치료제와 병용 시 세로토닌 증후군 위험이 있습니다.",
    },
    {
      drugName: "알코올",
      severity: "주의",
      description: "중추신경 억제 작용이 증강되어 졸림, 판단력 저하가 심해질 수 있습니다.",
    },
    {
      drugName: "오메프라졸 (Omeprazole)",
      severity: "주의",
      description: "에스시탈로프람의 혈중 농도를 약간 높일 수 있습니다.",
    },
  ],

  dosages: [
    {
      target: "성인 우울증",
      initial: "10mg 1일 1회",
      maintenance: "10~20mg 1일 1회",
      max: "20mg/일",
    },
    {
      target: "성인 범불안장애",
      initial: "10mg 1일 1회",
      maintenance: "10~20mg 1일 1회",
      max: "20mg/일",
    },
    {
      target: "노인 (65세 이상)",
      initial: "5mg 1일 1회",
      maintenance: "5~10mg 1일 1회",
      max: "10mg/일",
    },
    {
      target: "간 기능 저하",
      initial: "5mg 1일 1회",
      maintenance: "5~10mg 1일 1회",
      max: "10mg/일",
    },
    {
      target: "청소년 (12~17세)",
      initial: "10mg 1일 1회",
      maintenance: "10~20mg 1일 1회",
      max: "20mg/일",
    },
  ],

  precautions: [
    "복용 시작 후 2~4주간은 자살 충동이 일시적으로 증가할 수 있으므로, 가족이나 주변 사람의 관심이 필요합니다.",
    "갑자기 중단하면 두통, 어지러움, 이명, 감각 이상 등 금단 증상이 나타날 수 있습니다. 반드시 의사 지시에 따라 서서히 감량하세요.",
    "운전이나 위험한 기계 조작 시 주의가 필요합니다. 특히 복용 초기에는 졸림이나 어지러움이 나타날 수 있습니다.",
    "음주를 삼가세요. 알코올은 약물의 효과를 감소시키고 부작용을 증가시킬 수 있습니다.",
    "임신 중 복용은 신생아에게 금단 증상을 유발할 수 있으므로, 임신을 계획 중이라면 미리 의사와 상담하세요.",
    "18세 미만 소아·청소년의 경우 자살 관련 행동 위험이 증가할 수 있어 면밀한 모니터링이 필요합니다.",
    "다른 약물(건강기능식품 포함)을 복용하기 전에 반드시 의사나 약사에게 알려주세요.",
  ],

  storage:
    "실온(15~30°C)에서 습기와 직사광선을 피해 보관하세요. 어린이의 손이 닿지 않는 곳에 보관하세요.",

  reviews: [
    {
      id: "r1",
      nickname: "마음이맑은날",
      age: "30대",
      duration: "6개월",
      rating: 5,
      content:
        "처음 2주는 메스꺼움이 좀 있었는데, 3주차부터 확 나아졌어요. 지금은 아침에 일어나는 게 훨씬 수월하고, 일상이 다시 돌아온 느낌이에요. 상담사님도 약이 잘 맞는 것 같다고 하셨어요.",
      helpful: 234,
      date: "2024.12.03",
      tags: ["효과 좋음", "초기 부작용 있음", "상담 병행"],
    },
    {
      id: "r2",
      nickname: "하루하루",
      age: "20대",
      duration: "3개월",
      rating: 4,
      content:
        "불안감이 많이 줄었어요. 회사에서 발표할 때 심장이 덜 뛰는 게 느껴져요. 다만 성기능 쪽 부작용이 좀 있어서 의사선생님과 상담 중이에요.",
      helpful: 187,
      date: "2024.11.28",
      tags: ["불안 개선", "부작용 상담 중"],
    },
    {
      id: "r3",
      nickname: "새벽별",
      age: "40대",
      duration: "1년",
      rating: 5,
      content:
        "1년째 복용 중인데 우울증이 많이 나아졌어요. 처음엔 약 먹는 게 부끄러웠는데, 트로스트 상담사님이 약물 치료의 중요성을 잘 설명해주셔서 꾸준히 복용하고 있어요. 정기적으로 상담도 받고 있습니다.",
      helpful: 312,
      date: "2024.11.15",
      tags: ["장기 복용", "상담 병행", "꾸준한 효과"],
    },
    {
      id: "r4",
      nickname: "조용한산책",
      age: "30대",
      duration: "2개월",
      rating: 3,
      content:
        "효과는 아직 잘 모르겠어요. 의사선생님이 최소 4~6주는 기다려보라고 하셨는데... 메스꺼움은 있고, 잠이 좀 안 오는 편이에요. 아침 복용으로 바꿨더니 불면은 좀 나아졌어요.",
      helpful: 89,
      date: "2024.12.10",
      tags: ["효과 대기 중", "불면 개선 팁"],
    },
    {
      id: "r5",
      nickname: "봄날의곰",
      age: "50대",
      duration: "8개월",
      rating: 4,
      content:
        "갱년기 우울증으로 복용 시작했어요. 5mg으로 시작해서 10mg으로 올렸는데, 기분이 훨씬 안정됐어요. 체중이 약간 늘었지만 감당할 만해요. 트로스트 커뮤니티에서 같은 경험을 가진 분들 이야기 듣는 것도 도움이 돼요.",
      helpful: 156,
      date: "2024.10.22",
      tags: ["갱년기", "저용량 시작", "커뮤니티 도움"],
    },
    {
      id: "r6",
      nickname: "달빛소년",
      age: "20대",
      duration: "4개월",
      rating: 4,
      content:
        "군 전역 후 적응장애로 복용 시작했습니다. 처음엔 졸려서 힘들었는데, 저녁에 먹으니까 괜찮아졌어요. 공황 증상도 많이 줄었고, 상담과 병행하니 시너지가 있는 것 같아요.",
      helpful: 98,
      date: "2024.11.01",
      tags: ["적응장애", "공황 개선", "상담 병행"],
    },
    {
      id: "r7",
      nickname: "치유의시간",
      age: "30대",
      duration: "1년 6개월",
      rating: 5,
      content:
        "산후우울증으로 시작했는데, 지금은 거의 회복된 상태예요. 수유 중이라 처음엔 걱정이 많았는데, 의사선생님이 잘 설명해주시고 모니터링하면서 안전하게 복용할 수 있었어요.",
      helpful: 267,
      date: "2024.09.18",
      tags: ["산후우울증", "장기 복용", "회복 성공"],
    },
  ],

  relatedArticles: [
    {
      id: "a1",
      title: "항우울제, 언제까지 복용해야 할까?",
      summary: "항우울제 복용 기간에 대한 가이드라인과, 감량 및 중단 시 주의사항을 알아봅니다.",
      category: "약물 가이드",
      readTime: "5분",
      url: "/contents/antidepressant-duration",
    },
    {
      id: "a2",
      title: "SSRI 부작용, 이렇게 대처하세요",
      summary: "SSRI 계열 약물의 흔한 부작용과 각 부작용별 실질적인 대처법을 정리했습니다.",
      category: "약물 가이드",
      readTime: "7분",
      url: "/contents/ssri-side-effects",
    },
    {
      id: "a3",
      title: "약물 치료와 심리 상담, 함께하면 더 좋은 이유",
      summary: "연구 결과에 따르면 약물 치료와 심리 상담을 병행할 때 재발률이 50% 이상 감소합니다.",
      category: "상담 가이드",
      readTime: "4분",
      url: "/contents/medication-plus-counseling",
    },
    {
      id: "a4",
      title: "우울증 자가진단: 내 상태는 어느 정도일까?",
      summary: "PHQ-9 기반 우울증 자가진단 검사로 현재 내 상태를 확인해보세요.",
      category: "심리검사",
      readTime: "3분",
      url: "/test/depression-phq9",
    },
    {
      id: "a5",
      title: "약 먹으면서 술 마셔도 될까?",
      summary: "정신건강 약물과 알코올의 상호작용, 그리고 현실적인 가이드라인을 알려드립니다.",
      category: "생활 가이드",
      readTime: "4분",
      url: "/contents/medication-alcohol",
    },
    {
      id: "a6",
      title: "불안할 때 바로 할 수 있는 호흡법 3가지",
      summary: "약물과 함께 활용하면 효과적인 불안 완화 호흡법을 소개합니다.",
      category: "셀프케어",
      readTime: "3분",
      url: "/contents/breathing-techniques",
    },
  ],

  similarDrugs: [
    {
      id: "sertraline",
      name: "졸로푸트",
      genericName: "설트랄린",
      category: "SSRI",
      avgRating: 4.0,
      reviewCount: 892,
      topSideEffects: ["설사", "메스꺼움", "두통"],
      pros: ["공황장애에 효과적", "소아 우울증 승인", "가격 저렴"],
      cons: ["위장관 부작용 다소 많음", "약물 상호작용 주의"],
      cautionLevel: "보통",
      insuranceCovered: true,
    },
    {
      id: "fluoxetine",
      name: "프로작",
      genericName: "플루옥세틴",
      category: "SSRI",
      avgRating: 3.9,
      reviewCount: 743,
      topSideEffects: ["불안", "불면", "식욕 감소"],
      pros: ["반감기 길어 금단 증상 적음", "폭식증 치료 가능", "역사 오래됨"],
      cons: ["활성화 부작용(불안, 불면)", "약물 상호작용 많음"],
      cautionLevel: "보통",
      insuranceCovered: true,
    },
    {
      id: "paroxetine",
      name: "팍실",
      genericName: "파록세틴",
      category: "SSRI",
      avgRating: 3.7,
      reviewCount: 621,
      topSideEffects: ["체중 증가", "졸림", "성기능 장애"],
      pros: ["불안에 강한 효과", "진정 작용"],
      cons: ["금단 증상 심함", "체중 증가 가능성", "임신 시 주의"],
      cautionLevel: "보통",
      insuranceCovered: true,
    },
    {
      id: "venlafaxine",
      name: "이팩사",
      genericName: "벤라팍신",
      category: "SNRI",
      avgRating: 3.8,
      reviewCount: 534,
      topSideEffects: ["메스꺼움", "발한", "혈압 상승"],
      pros: ["통증 동반 우울증에 효과적", "에너지 증가 효과"],
      cons: ["금단 증상 심함", "혈압 모니터링 필요"],
      cautionLevel: "보통",
      insuranceCovered: true,
    },
    {
      id: "duloxetine",
      name: "심발타",
      genericName: "둘록세틴",
      category: "SNRI",
      avgRating: 4.1,
      reviewCount: 678,
      topSideEffects: ["메스꺼움", "입마름", "변비"],
      pros: ["신경성 통증에도 효과", "섬유근통 승인"],
      cons: ["간 기능 모니터링 필요", "중단 시 금단 주의"],
      cautionLevel: "보통",
      insuranceCovered: true,
    },
    {
      id: "mirtazapine",
      name: "레메론",
      genericName: "미르타자핀",
      category: "NaSSA",
      avgRating: 3.6,
      reviewCount: 412,
      topSideEffects: ["졸림", "체중 증가", "식욕 증가"],
      pros: ["수면 개선 효과 빠름", "성기능 부작용 적음", "메스꺼움 없음"],
      cons: ["체중 증가 현저", "졸림 강함"],
      cautionLevel: "보통",
      insuranceCovered: true,
    },
  ],

  communityPosts: [
    {
      id: "cp1",
      title: "렉사프로 3개월차, 솔직한 후기 공유합니다",
      preview:
        "처음 2주는 정말 힘들었는데, 지금은 '아 이래서 사람들이 약을 먹는구나'라는 생각이 드네요. 매일 아침 10mg 복용 중이고...",
      author: "마음이맑은날",
      category: "복약 후기",
      likeCount: 89,
      commentCount: 34,
      date: "2024.12.15",
      tags: ["렉사프로", "SSRI", "3개월 후기"],
    },
    {
      id: "cp2",
      title: "렉사프로 부작용 메스꺼움, 이렇게 극복했어요",
      preview:
        "처음에 메스꺼움이 너무 심해서 약을 끊을까 했는데, 식후 바로 복용하니까 훨씬 나아졌어요. 저처럼 고민하시는 분들...",
      author: "하루의시작",
      category: "부작용 극복",
      likeCount: 156,
      commentCount: 48,
      date: "2024.12.08",
      tags: ["부작용", "메스꺼움", "대처법"],
    },
    {
      id: "cp3",
      title: "항우울제 처음 처방받았는데, 무서워요",
      preview:
        "오늘 정신건강의학과에서 렉사프로를 처방받았어요. 주변에 말도 못하겠고, 약 먹는 게 두렵기도 하고...",
      author: "익명의용기",
      category: "고민/질문",
      likeCount: 203,
      commentCount: 67,
      date: "2024.12.12",
      tags: ["처음 복용", "불안", "고민"],
    },
    {
      id: "cp4",
      title: "렉사프로 → 졸로푸트 약 변경 경험",
      preview:
        "렉사프로 6개월 복용 후 성기능 부작용 때문에 졸로푸트로 바꿨어요. 교차 감량(cross-taper) 과정을 공유합니다...",
      author: "새로운시작",
      category: "약물 변경",
      likeCount: 112,
      commentCount: 29,
      date: "2024.11.28",
      tags: ["약 변경", "졸로푸트", "교차감량"],
    },
    {
      id: "cp5",
      title: "직장 다니면서 항우울제 복용하는 분들 계신가요?",
      preview:
        "회사에서 졸림이 오면 어떻게 하시나요? 회의 중에 너무 졸려서 난감한 적이... 복용 시간을 바꿔볼까 고민 중입니다.",
      author: "워킹데드",
      category: "일상 팁",
      likeCount: 178,
      commentCount: 52,
      date: "2024.12.01",
      tags: ["직장인", "졸림", "복용시간"],
    },
    {
      id: "cp6",
      title: "렉사프로 1년 복용 후 감량 시작합니다",
      preview:
        "드디어 주치의님과 감량을 시작하기로 했어요. 10mg → 5mg으로 2주간 줄인 후 경과를 보기로... 감량 과정을 기록할게요.",
      author: "치유의길",
      category: "감량/중단",
      likeCount: 245,
      commentCount: 71,
      date: "2024.11.20",
      tags: ["감량", "테이퍼링", "1년 복용"],
    },
  ],

  recommendedCounselors: [
    {
      id: "c1",
      name: "김서연",
      title: "임상심리전문가",
      profileImage: "",
      specialties: ["약물 상담", "우울증", "불안장애"],
      rating: 4.9,
      reviewCount: 387,
      experience: "12년",
      introduction:
        "약물 복용 과정에서의 심리적 어려움을 함께 다루겠습니다. 약이 잘 맞는지 불안하신 분, 부작용으로 힘드신 분, 복약을 중단하고 싶으신 분 모두 편하게 상담해주세요.",
      availableToday: true,
      price: 50000,
      medicationCounselCount: 234,
    },
    {
      id: "c2",
      name: "박지훈",
      title: "정신건강임상심리사 1급",
      profileImage: "",
      specialties: ["복약 순응", "인지행동치료", "공황장애"],
      rating: 4.8,
      reviewCount: 256,
      experience: "9년",
      introduction:
        "약물 치료와 인지행동치료를 병행하면 재발률이 크게 줄어듭니다. 약만으로 해결하기 어려운 사고 패턴과 행동을 함께 바꿔나가요.",
      availableToday: true,
      price: 55000,
      medicationCounselCount: 189,
    },
    {
      id: "c3",
      name: "이하은",
      title: "상담심리사 1급",
      profileImage: "",
      specialties: ["약물 부작용 스트레스", "직장인 우울", "자존감"],
      rating: 4.7,
      reviewCount: 198,
      experience: "7년",
      introduction:
        "항우울제 부작용으로 인한 스트레스, 약을 먹는다는 사실 자체에 대한 자책감, 직장에서의 어려움까지 함께 이야기 나눠요.",
      availableToday: false,
      price: 45000,
      medicationCounselCount: 156,
    },
    {
      id: "c4",
      name: "정민수",
      title: "임상심리전문가",
      profileImage: "",
      specialties: ["약물 감량 지원", "우울증 재발 방지", "마음챙김"],
      rating: 4.9,
      reviewCount: 312,
      experience: "15년",
      introduction:
        "15년간 정신건강의학과와 협력하며 약물 치료 환자분들의 심리 상담을 진행해왔습니다. 특히 약물 감량·중단 과정에서의 심리적 지원에 전문성이 있습니다.",
      availableToday: true,
      price: 60000,
      medicationCounselCount: 312,
    },
  ],

  faqs: [
    {
      question: "렉사프로는 얼마나 오래 복용해야 하나요?",
      answer:
        "일반적으로 처음 우울증 에피소드에서는 증상 호전 후 최소 6~9개월간 유지 치료가 권장됩니다. 재발 경험이 있는 경우 1~3년 이상 장기 복용이 필요할 수 있습니다. 복용 기간은 반드시 담당 의사와 상의하여 결정하세요.",
    },
    {
      question: "렉사프로를 먹고 있는데 살이 찌나요?",
      answer:
        "에스시탈로프람은 다른 항우울제(미르타자핀, 파록세틴 등)에 비해 체중 증가가 적은 편입니다. 단기적으로는 체중 변화가 거의 없지만, 장기 복용 시 일부 환자에서 경미한 체중 증가(1~3kg)가 보고됩니다.",
    },
    {
      question: "아침에 먹어야 하나요, 저녁에 먹어야 하나요?",
      answer:
        "정해진 규칙은 없으며 사람마다 다릅니다. 졸림이 있으면 저녁에, 불면이 있으면 아침에 복용하는 것이 좋습니다. 중요한 것은 매일 같은 시간에 복용하는 것입니다.",
    },
    {
      question: "렉사프로를 먹다가 갑자기 끊으면 어떻게 되나요?",
      answer:
        "갑자기 중단하면 두통, 어지러움, 이명, 감각 이상('뇌 진탕' 느낌), 불안, 짜증, 수면 장애 등 금단 증상이 나타날 수 있습니다. 2~4주에 걸쳐 서서히 감량하는 것이 안전합니다.",
    },
    {
      question: "렉사프로와 술을 같이 먹으면 안 되나요?",
      answer:
        "권장하지 않습니다. 알코올은 에스시탈로프람의 효과를 감소시키고, 졸림·판단력 저하 등 부작용을 증가시킬 수 있습니다. 완전한 금주가 어렵다면 최소한 복용일에는 음주를 피하세요.",
    },
    {
      question: "렉사프로 복용 중 임신해도 되나요?",
      answer:
        "임신 1분기에 SSRI 복용 시 일부 선천성 기형 위험이 보고되어 있으나, 복용을 갑자기 중단하는 것의 위험(우울증 악화)도 고려해야 합니다. 임신을 계획 중이라면 반드시 사전에 의사와 상의하세요.",
    },
    {
      question: "트로스트 상담사에게 약물 관련 상담을 받을 수 있나요?",
      answer:
        "네. 트로스트 상담사는 약물 복용 과정에서의 심리적 어려움(부작용 스트레스, 복약 순응도, 약물 의존 불안 등)에 대해 전문적인 상담을 제공합니다. 약물 처방 자체는 의사만 가능하지만, 복약 과정에서의 심리적 지원을 받으실 수 있습니다.",
    },
  ],
};
