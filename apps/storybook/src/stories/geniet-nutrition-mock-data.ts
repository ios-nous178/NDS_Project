/**
 * [GENIET-NUTRITION] 식품 영양 백과 목 데이터
 */

/* ────────────────────────────────────────────
 * 타입
 * ──────────────────────────────────────────── */

export interface NutrientInfo {
  name: string;
  amount: string;
  unit: string;
  dailyPercent: number; // 0-100
}

export interface FoodItem {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  imageEmoji: string;
  calories: number;
  servingSize: string;
  nutrients: NutrientInfo[];
  tags: string[];
  rating: number;
  reviewCount: number;
  relatedDealCount: number;
  description: string;
  benefits: string[];
  cautions: string[];
}

export interface RelatedRecipe {
  id: string;
  title: string;
  calories: number;
  cookTime: string;
  difficulty: "쉬움" | "보통" | "어려움";
  imageEmoji: string;
  rating: number;
  reviewCount: number;
}

export interface HealthyDeal {
  id: string;
  title: string;
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  imageEmoji: string;
  rating: number;
  reviewCount: number;
  badge?: string;
}

export interface FoodReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
  tags: string[];
}

export interface SimilarFood {
  id: string;
  name: string;
  calories: number;
  imageEmoji: string;
  category: string;
  mainNutrient: string;
  mainNutrientAmount: string;
}

export interface NutritionCategory {
  key: string;
  label: string;
}

export interface SeasonalInfo {
  season: string;
  description: string;
}

/* ────────────────────────────────────────────
 * 현재 식품 상세 데이터
 * ──────────────────────────────────────────── */

export const currentFood: FoodItem = {
  id: "avocado-01",
  name: "아보카도",
  nameEn: "Avocado",
  category: "과일",
  imageEmoji: "🥑",
  calories: 160,
  servingSize: "100g (약 1/2개)",
  nutrients: [
    { name: "탄수화물", amount: "8.5", unit: "g", dailyPercent: 3 },
    { name: "단백질", amount: "2.0", unit: "g", dailyPercent: 4 },
    { name: "지방", amount: "14.7", unit: "g", dailyPercent: 23 },
    { name: "식이섬유", amount: "6.7", unit: "g", dailyPercent: 27 },
    { name: "칼륨", amount: "485", unit: "mg", dailyPercent: 14 },
    { name: "비타민 E", amount: "2.1", unit: "mg", dailyPercent: 14 },
    { name: "비타민 K", amount: "21", unit: "µg", dailyPercent: 18 },
    { name: "엽산", amount: "81", unit: "µg", dailyPercent: 20 },
    { name: "마그네슘", amount: "29", unit: "mg", dailyPercent: 7 },
    { name: "비타민 B6", amount: "0.26", unit: "mg", dailyPercent: 15 },
  ],
  tags: ["고지방", "저탄수화물", "글루텐프리", "비건", "키토"],
  rating: 4.6,
  reviewCount: 2847,
  relatedDealCount: 12,
  description:
    "아보카도는 불포화지방산이 풍부한 과일로, 심혈관 건강에 도움을 줍니다. 크리미한 식감으로 샐러드, 스무디, 토스트 등 다양한 요리에 활용됩니다. 멕시코가 원산지이며, 전 세계적으로 슈퍼푸드로 인정받고 있습니다.",
  benefits: [
    "불포화지방산이 풍부해 심혈관 건강 개선에 도움",
    "식이섬유가 풍부하여 소화 건강과 포만감 유지",
    "비타민 E, K 등 항산화 영양소 풍부",
    "칼륨 함량이 높아 혈압 조절에 도움",
    "엽산 함유로 임산부 영양 보충에 적합",
  ],
  cautions: [
    "칼로리가 높으므로 과다 섭취 주의 (1/2개 권장)",
    "라텍스 알레르기가 있는 경우 교차반응 가능",
    "혈액 희석제 복용 시 비타민 K 섭취량 주의",
  ],
};

/* ────────────────────────────────────────────
 * 영양소 비교 기준 식품
 * ──────────────────────────────────────────── */

export const comparisonFoods = [
  { name: "아보카도", calories: 160, fat: 14.7, protein: 2.0, fiber: 6.7, emoji: "🥑" },
  { name: "바나나", calories: 89, fat: 0.3, protein: 1.1, fiber: 2.6, emoji: "🍌" },
  { name: "사과", calories: 52, fat: 0.2, protein: 0.3, fiber: 2.4, emoji: "🍎" },
  { name: "블루베리", calories: 57, fat: 0.3, protein: 0.7, fiber: 2.4, emoji: "🫐" },
];

/* ────────────────────────────────────────────
 * 관련 레시피
 * ──────────────────────────────────────────── */

export const relatedRecipes: RelatedRecipe[] = [
  {
    id: "r1",
    title: "아보카도 연어 포케볼",
    calories: 420,
    cookTime: "15분",
    difficulty: "쉬움",
    imageEmoji: "🍣",
    rating: 4.8,
    reviewCount: 324,
  },
  {
    id: "r2",
    title: "아보카도 에그 토스트",
    calories: 350,
    cookTime: "10분",
    difficulty: "쉬움",
    imageEmoji: "🍳",
    rating: 4.7,
    reviewCount: 512,
  },
  {
    id: "r3",
    title: "아보카도 그린 스무디",
    calories: 220,
    cookTime: "5분",
    difficulty: "쉬움",
    imageEmoji: "🥤",
    rating: 4.5,
    reviewCount: 189,
  },
  {
    id: "r4",
    title: "과카몰리 & 토르티야",
    calories: 280,
    cookTime: "15분",
    difficulty: "보통",
    imageEmoji: "🫔",
    rating: 4.6,
    reviewCount: 276,
  },
  {
    id: "r5",
    title: "아보카도 새우 샐러드",
    calories: 310,
    cookTime: "20분",
    difficulty: "보통",
    imageEmoji: "🥗",
    rating: 4.4,
    reviewCount: 148,
  },
  {
    id: "r6",
    title: "아보카도 참치 김밥",
    calories: 380,
    cookTime: "30분",
    difficulty: "보통",
    imageEmoji: "🍙",
    rating: 4.3,
    reviewCount: 97,
  },
];

/* ────────────────────────────────────────────
 * 헬시딜 상품
 * ──────────────────────────────────────────── */

export const healthyDeals: HealthyDeal[] = [
  {
    id: "d1",
    title: "유기농 아보카도 6개입",
    originalPrice: 18000,
    salePrice: 12900,
    discountPercent: 28,
    imageEmoji: "🥑",
    rating: 4.7,
    reviewCount: 1243,
    badge: "베스트",
  },
  {
    id: "d2",
    title: "냉동 아보카도 다이스 500g",
    originalPrice: 9900,
    salePrice: 7500,
    discountPercent: 24,
    imageEmoji: "🧊",
    rating: 4.5,
    reviewCount: 567,
  },
  {
    id: "d3",
    title: "아보카도 오일 250ml",
    originalPrice: 15000,
    salePrice: 11200,
    discountPercent: 25,
    imageEmoji: "🫒",
    rating: 4.8,
    reviewCount: 892,
    badge: "인기",
  },
  {
    id: "d4",
    title: "아보카도 프로틴 쉐이크",
    originalPrice: 32000,
    salePrice: 24900,
    discountPercent: 22,
    imageEmoji: "🥤",
    rating: 4.3,
    reviewCount: 234,
  },
];

/* ────────────────────────────────────────────
 * 사용자 리뷰
 * ──────────────────────────────────────────── */

export const foodReviews: FoodReview[] = [
  {
    id: "rv1",
    userName: "건강맘",
    rating: 5,
    date: "2026.04.20",
    content:
      "아보카도를 매일 반 개씩 먹고 있어요. 콜레스테롤 수치가 확실히 좋아졌습니다. 아이도 좋아해서 이유식에도 넣어주고 있어요.",
    helpful: 47,
    tags: ["콜레스테롤 관리", "이유식"],
  },
  {
    id: "rv2",
    userName: "다이어터_진",
    rating: 4,
    date: "2026.04.18",
    content: "키토 식단에 필수! 다만 칼로리가 높으니 양 조절이 중요해요. 반 개면 충분합니다.",
    helpful: 32,
    tags: ["키토 식단", "칼로리 관리"],
  },
  {
    id: "rv3",
    userName: "요리왕",
    rating: 5,
    date: "2026.04.15",
    content:
      "아보카도 연어 포케볼 해먹으면 진짜 맛있어요. 영양 밸런스도 완벽하고요. 레시피 섹션에 있는 거 따라 했어요!",
    helpful: 28,
    tags: ["레시피 활용"],
  },
  {
    id: "rv4",
    userName: "헬스매니아",
    rating: 4,
    date: "2026.04.12",
    content:
      "운동 후 간식으로 좋습니다. 건강한 지방 보충에 최고예요. 다만 익은 정도 판단이 좀 어려워요.",
    helpful: 19,
    tags: ["운동 후 식사", "건강한 지방"],
  },
  {
    id: "rv5",
    userName: "영양사K",
    rating: 5,
    date: "2026.04.10",
    content:
      "영양학적으로 거의 완벽한 식품입니다. 비타민E, 칼륨, 식이섬유까지. 다만 비타민C는 부족하니 과일과 함께 드시면 좋아요.",
    helpful: 65,
    tags: ["전문가 추천", "영양 균형"],
  },
];

/* ────────────────────────────────────────────
 * 유사 식품
 * ──────────────────────────────────────────── */

export const similarFoods: SimilarFood[] = [
  {
    id: "s1",
    name: "올리브",
    calories: 115,
    imageEmoji: "🫒",
    category: "과일",
    mainNutrient: "올레산",
    mainNutrientAmount: "11g",
  },
  {
    id: "s2",
    name: "코코넛",
    calories: 354,
    imageEmoji: "🥥",
    category: "과일",
    mainNutrient: "MCT 지방",
    mainNutrientAmount: "33g",
  },
  {
    id: "s3",
    name: "호두",
    calories: 654,
    imageEmoji: "🌰",
    category: "견과류",
    mainNutrient: "오메가-3",
    mainNutrientAmount: "9g",
  },
  {
    id: "s4",
    name: "아몬드",
    calories: 579,
    imageEmoji: "🫘",
    category: "견과류",
    mainNutrient: "비타민 E",
    mainNutrientAmount: "25mg",
  },
  {
    id: "s5",
    name: "연어",
    calories: 208,
    imageEmoji: "🐟",
    category: "생선",
    mainNutrient: "오메가-3",
    mainNutrientAmount: "2.3g",
  },
  {
    id: "s6",
    name: "치아씨드",
    calories: 486,
    imageEmoji: "🌱",
    category: "씨앗",
    mainNutrient: "식이섬유",
    mainNutrientAmount: "34g",
  },
];

/* ────────────────────────────────────────────
 * 카테고리
 * ──────────────────────────────────────────── */

export const nutritionCategories: NutritionCategory[] = [
  { key: "all", label: "전체" },
  { key: "fruit", label: "과일" },
  { key: "vegetable", label: "채소" },
  { key: "grain", label: "곡물" },
  { key: "protein", label: "단백질" },
  { key: "dairy", label: "유제품" },
  { key: "nut", label: "견과류" },
  { key: "seafood", label: "해산물" },
];

/* ────────────────────────────────────────────
 * FAQ
 * ──────────────────────────────────────────── */

export const nutritionFaqs = [
  {
    question: "아보카도는 하루에 얼마나 먹는 게 좋나요?",
    answer:
      "일반적으로 하루 1/2~1개가 적당합니다. 아보카도는 건강한 지방이 풍부하지만 칼로리가 높은 편이므로 (100g당 약 160kcal), 체중 관리 중이라면 반 개 정도를 권장합니다. 운동량이 많거나 키토 식단 중이라면 1개까지 섭취해도 좋습니다.",
  },
  {
    question: "아보카도가 익었는지 어떻게 알 수 있나요?",
    answer:
      "껍질이 진한 갈색~검은색이고, 손으로 가볍게 눌렀을 때 살짝 들어가면 적당히 익은 상태입니다. 꼭지 부분을 떼어봤을 때 연두색이면 먹기 좋고, 갈색이면 과숙된 것입니다. 딱딱한 아보카도는 상온에서 2~3일 두면 익습니다.",
  },
  {
    question: "아보카도를 보관하는 가장 좋은 방법은?",
    answer:
      "익지 않은 아보카도는 상온에서 보관하세요. 익은 후에는 냉장고에 넣으면 2~3일 더 보관할 수 있습니다. 반으로 자른 아보카도는 씨를 남긴 채로 레몬즙을 뿌리고 랩으로 감싸 냉장 보관하면 갈변을 늦출 수 있습니다.",
  },
  {
    question: "아보카도의 지방이 몸에 나쁘지 않나요?",
    answer:
      "아보카도의 지방은 대부분 불포화지방산(올레산)으로, 오히려 심혈관 건강에 도움을 줍니다. 연구에 따르면 아보카도를 꾸준히 섭취하면 LDL(나쁜) 콜레스테롤은 줄고 HDL(좋은) 콜레스테롤은 증가하는 것으로 나타났습니다.",
  },
  {
    question: "알레르기가 있을 수 있나요?",
    answer:
      "드물지만 아보카도 알레르기가 있을 수 있습니다. 특히 라텍스 알레르기가 있는 분은 교차반응이 나타날 수 있으므로 주의가 필요합니다. 입술이나 목이 붓거나 가려운 증상이 나타나면 섭취를 중단하고 전문의와 상담하세요.",
  },
];

/* ────────────────────────────────────────────
 * 관련 검색 태그 (SEO 내부 링크)
 * ──────────────────────────────────────────── */

export const relatedSearchTags = [
  "아보카도 칼로리",
  "아보카도 효능",
  "아보카도 다이어트",
  "키토 식단 추천 식품",
  "불포화지방산 식품",
  "혈당 관리 음식",
  "식이섬유 많은 과일",
  "비타민 E 식품",
  "건강한 지방 음식",
  "아보카도 레시피",
  "슈퍼푸드 종류",
  "아보카도 보관법",
];

/* ────────────────────────────────────────────
 * 계절 정보
 * ──────────────────────────────────────────── */

export const seasonalInfo: SeasonalInfo = {
  season: "연중 (3~6월 최적)",
  description: "멕시코, 페루 등에서 연중 수입되며, 봄~초여름(3~6월)이 가장 맛있는 시기입니다.",
};

/* ────────────────────────────────────────────
 * 인기 검색 식품 (사이드바/하단 탐색용)
 * ──────────────────────────────────────────── */

export const trendingFoods = [
  { name: "고구마", emoji: "🍠", calories: 86, searches: 12400 },
  { name: "닭가슴살", emoji: "🍗", calories: 165, searches: 18200 },
  { name: "브로콜리", emoji: "🥦", calories: 34, searches: 8900 },
  { name: "귀리", emoji: "🌾", calories: 389, searches: 7600 },
  { name: "연어", emoji: "🐟", calories: 208, searches: 15300 },
  { name: "블루베리", emoji: "🫐", calories: 57, searches: 9800 },
  { name: "계란", emoji: "🥚", calories: 155, searches: 21000 },
  { name: "퀴노아", emoji: "🍚", calories: 120, searches: 5400 },
];
