/**
 * AUTO-GENERATED — @nudge-design/assets/src/files/** 에서 build-asset-catalog.mjs 가 생성. 직접 수정 금지.
 *
 * 에셋 추가/이름변경 → packages/assets/src/files/ 를 고치고
 * `pnpm --filter @nudge-design/mcp build:assets` 로 재생성해 함께 커밋한다.
 * 한글 검색 태그는 packages/mcp/asset-tags.ko.json(id→[태그]) 에서 search 토큰으로 머지된다.
 * (check-ssot 의 asset-catalog --check 가 stale 을 차단한다.)
 */

export interface AssetCatalogEntry {
  /** 프로젝트 slug 또는 "shared". */
  project: string;
  scope: "project" | "shared" | "unknown";
  /** 프로젝트 아래 디렉토리 경로(예: "images/food-types", "logos", "profiles"). */
  category: string;
  /** 파일 stem(레티나 접미사 제거) — 보통 의미 있는 kebab id(예: "bibimbap"). */
  id: string;
  /** <img src> 에 그대로 박으면 build_singlefile_html 이 base64 인라인하는 경로. */
  inlineRef: string;
  mimeType: string;
  /** 보유 레티나 변형(예: ["3x"]). 없으면 키 자체가 없음. */
  retina?: string[];
  /** 소문자 검색 토큰(project·category·id 영문 + asset-tags.ko.json 한글 태그). */
  search: string[];
}

export const ASSET_CATALOG: AssetCatalogEntry[] = [
  {
    "project": "cashwalk-biz",
    "scope": "project",
    "category": "illustrations",
    "id": "ads",
    "inlineRef": "@nudge-design/assets/files/project/cashwalk-biz/illustrations/ads.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "cashwalk",
      "biz",
      "illustrations",
      "ads",
      "광고",
      "ad",
      "광고비"
    ]
  },
  {
    "project": "cashwalk-biz",
    "scope": "project",
    "category": "illustrations",
    "id": "channel",
    "inlineRef": "@nudge-design/assets/files/project/cashwalk-biz/illustrations/channel.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "cashwalk",
      "biz",
      "illustrations",
      "channel",
      "채널"
    ]
  },
  {
    "project": "cashwalk-biz",
    "scope": "project",
    "category": "illustrations",
    "id": "charge-alert-bell",
    "inlineRef": "@nudge-design/assets/files/project/cashwalk-biz/illustrations/charge-alert-bell.png",
    "mimeType": "image/png",
    "search": [
      "cashwalk",
      "biz",
      "illustrations",
      "charge",
      "alert",
      "bell",
      "충전알림",
      "알림벨"
    ]
  },
  {
    "project": "cashwalk-biz",
    "scope": "project",
    "category": "illustrations",
    "id": "message",
    "inlineRef": "@nudge-design/assets/files/project/cashwalk-biz/illustrations/message.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "cashwalk",
      "biz",
      "illustrations",
      "message",
      "메시지",
      "확성기",
      "홍보"
    ]
  },
  {
    "project": "cashwalk-biz",
    "scope": "project",
    "category": "illustrations",
    "id": "quiz",
    "inlineRef": "@nudge-design/assets/files/project/cashwalk-biz/illustrations/quiz.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "cashwalk",
      "biz",
      "illustrations",
      "quiz",
      "퀴즈",
      "물음표"
    ]
  },
  {
    "project": "cashwalk-biz",
    "scope": "project",
    "category": "logos",
    "id": "cashwalk-for-business-horizontal",
    "inlineRef": "@nudge-design/assets/files/project/cashwalk-biz/logos/cashwalk-for-business-horizontal.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "cashwalk",
      "biz",
      "logos",
      "for",
      "business",
      "horizontal"
    ]
  },
  {
    "project": "cashwalk-biz",
    "scope": "project",
    "category": "logos",
    "id": "cashwalk-horizontal",
    "inlineRef": "@nudge-design/assets/files/project/cashwalk-biz/logos/cashwalk-horizontal.png",
    "mimeType": "image/png",
    "search": [
      "cashwalk",
      "biz",
      "logos",
      "horizontal"
    ]
  },
  {
    "project": "cashwalk-biz",
    "scope": "project",
    "category": "logos",
    "id": "cashwalk-vertical",
    "inlineRef": "@nudge-design/assets/files/project/cashwalk-biz/logos/cashwalk-vertical.png",
    "mimeType": "image/png",
    "search": [
      "cashwalk",
      "biz",
      "logos",
      "vertical"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/category-heroes",
    "id": "asian",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/category-heroes/asian.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "asian",
      "아시안",
      "아시아음식"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/category-heroes",
    "id": "beverage",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/category-heroes/beverage.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "beverage",
      "음료"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/category-heroes",
    "id": "chinese",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/category-heroes/chinese.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "chinese",
      "중식",
      "중국음식"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/category-heroes",
    "id": "dairy-baby-food",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/category-heroes/dairy-baby-food.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "dairy",
      "baby",
      "food",
      "유제품",
      "이유식"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/category-heroes",
    "id": "diet",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/category-heroes/diet.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "diet",
      "다이어트",
      "식단"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/category-heroes",
    "id": "fast-food",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/category-heroes/fast-food.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "fast",
      "food",
      "패스트푸드"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/category-heroes",
    "id": "health-food",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/category-heroes/health-food.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "health",
      "food",
      "건강식품"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/category-heroes",
    "id": "japanese",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/category-heroes/japanese.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "japanese",
      "일식",
      "일본음식"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/category-heroes",
    "id": "korean",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/category-heroes/korean.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "korean",
      "한식",
      "한국음식"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/category-heroes",
    "id": "livestock",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/category-heroes/livestock.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "livestock",
      "축산",
      "정육"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/category-heroes",
    "id": "marine",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/category-heroes/marine.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "marine",
      "수산",
      "해산물"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/category-heroes",
    "id": "noodle-can-oil-sauce",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/category-heroes/noodle-can-oil-sauce.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "noodle",
      "can",
      "oil",
      "sauce",
      "면류",
      "통조림",
      "소스"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/category-heroes",
    "id": "produce",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/category-heroes/produce.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "produce",
      "농산물",
      "채소"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/category-heroes",
    "id": "rice-cake-bakery-snack",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/category-heroes/rice-cake-bakery-snack.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "rice",
      "cake",
      "bakery",
      "snack",
      "떡",
      "베이커리",
      "간식"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/category-heroes",
    "id": "snack-food",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/category-heroes/snack-food.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "snack",
      "food",
      "간식",
      "과자"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/category-heroes",
    "id": "western",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/category-heroes/western.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "western",
      "양식",
      "서양음식"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/empty-states",
    "id": "coupon-empty",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/empty-states/coupon-empty.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "empty",
      "states",
      "coupon",
      "쿠폰없음",
      "빈쿠폰"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/empty-states",
    "id": "error-thumbnail",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/empty-states/error-thumbnail.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "empty",
      "states",
      "error",
      "thumbnail",
      "에러",
      "오류"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/empty-states",
    "id": "food-empty",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/empty-states/food-empty.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "empty",
      "states",
      "food",
      "음식없음"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/empty-states",
    "id": "food-thumbnail-empty",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/empty-states/food-thumbnail-empty.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "empty",
      "states",
      "food",
      "thumbnail",
      "음식없음"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/empty-states",
    "id": "heart-empty",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/empty-states/heart-empty.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "empty",
      "states",
      "heart",
      "찜없음",
      "좋아요없음"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/empty-states",
    "id": "memo-empty",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/empty-states/memo-empty.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "empty",
      "states",
      "memo",
      "메모없음"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/empty-states",
    "id": "pill-thumbnail-empty",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/empty-states/pill-thumbnail-empty.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "empty",
      "states",
      "pill",
      "thumbnail",
      "영양제없음",
      "약없음"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "alcohol",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/alcohol.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "alcohol",
      "술",
      "주류"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "all",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/all.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "all",
      "전체",
      "모두"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "baby-formula",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/baby-formula.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "baby",
      "formula",
      "분유",
      "이유식"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "bakery",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/bakery.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "bakery",
      "베이커리",
      "빵집",
      "제과"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "beef",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/beef.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "beef",
      "소고기",
      "한우",
      "쇠고기"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "bibimbap",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/bibimbap.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "bibimbap",
      "비빔밥"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "braised-pigs-feet",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/braised-pigs-feet.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "braised",
      "pigs",
      "feet",
      "족발",
      "돼지족발"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "bread",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/bread.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "bread",
      "빵"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "broth",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/broth.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "broth",
      "육수",
      "국물"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "burger",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/burger.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "burger",
      "버거",
      "햄버거"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "candy",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/candy.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "candy",
      "사탕",
      "캔디"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "canned-food",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/canned-food.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "canned",
      "통조림",
      "캔"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "cheese",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/cheese.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "cheese",
      "치즈"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "chicken",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/chicken.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "chicken",
      "닭고기",
      "치킨"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "chicken-breast",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/chicken-breast.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "chicken",
      "breast",
      "닭가슴살"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "coffee",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/coffee.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "coffee",
      "커피"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "cooking-oil",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/cooking-oil.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "cooking",
      "oil",
      "식용유",
      "기름"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "curry",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/curry.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "curry",
      "카레"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "curry-indian",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/curry-indian.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "curry",
      "indian",
      "인도카레",
      "커리"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "diet",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/diet.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "diet",
      "다이어트",
      "식단"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "dim-sum",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/dim-sum.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "dim",
      "sum",
      "딤섬"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "dried-seafood",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/dried-seafood.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "dried",
      "seafood",
      "건어물"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "duck",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/duck.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "duck",
      "오리고기",
      "오리"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "egg",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/egg.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "egg",
      "계란",
      "달걀"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "enzyme",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/enzyme.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "enzyme",
      "효소"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "etc",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/etc.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "etc",
      "기타"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "fish",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/fish.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "fish",
      "생선",
      "물고기"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "fish-cake",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/fish-cake.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "fish",
      "cake",
      "어묵",
      "오뎅"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "fried",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/fried.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "fried",
      "튀김"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "fried-chicken",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/fried-chicken.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "fried",
      "chicken",
      "후라이드치킨",
      "치킨",
      "닭튀김"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "fried-rice",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/fried-rice.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "fried",
      "rice",
      "볶음밥"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "fritters",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/fritters.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "fritters",
      "튀김",
      "부침"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "fruit",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/fruit.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "fruit",
      "과일"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "functional-health-food",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/functional-health-food.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "functional",
      "health",
      "건강기능식품",
      "건기식"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "gimbap",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/gimbap.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "gimbap",
      "김밥"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "grain-shake",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/grain-shake.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "grain",
      "shake",
      "미숫가루",
      "곡물쉐이크"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "gratin",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/gratin.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "gratin",
      "그라탕"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "grilled",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/grilled.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "grilled",
      "구이"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "health-juice",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/health-juice.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "health",
      "juice",
      "건강주스"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "health-snack",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/health-snack.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "health",
      "snack",
      "건강간식"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "hot-dog",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/hot-dog.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "hot",
      "dog",
      "핫도그"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "ice-cream",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/ice-cream.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "ice",
      "cream",
      "아이스크림"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "jjajangmyeon",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/jjajangmyeon.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "jjajangmyeon",
      "짜장면",
      "짜장"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "jjamppong",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/jjamppong.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "jjamppong",
      "짬뽕"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "juice",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/juice.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "juice",
      "주스"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "kimchi",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/kimchi.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "kimchi",
      "김치"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "korean-pancake",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/korean-pancake.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "korean",
      "pancake",
      "전",
      "부침개",
      "파전"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "low-sugar-food",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/low-sugar-food.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "low",
      "sugar",
      "저당식품",
      "저당"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "meal-plan",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/meal-plan.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "meal",
      "plan",
      "식단",
      "밀플랜"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "milk",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/milk.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "milk",
      "우유"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "multigrain",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/multigrain.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "multigrain",
      "잡곡"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "nasi-goreng",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/nasi-goreng.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "nasi",
      "goreng",
      "나시고렝"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "nuts",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/nuts.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "nuts",
      "견과류",
      "너트"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "pad-thai",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/pad-thai.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "pad",
      "thai",
      "팟타이"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "pasta",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/pasta.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "pasta",
      "파스타"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "pizza",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/pizza.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "pizza",
      "피자"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "pork",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/pork.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "pork",
      "돼지고기"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "pork-cutlet",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/pork-cutlet.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "pork",
      "cutlet",
      "돈까스",
      "돈가스"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "pottage",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/pottage.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "pottage",
      "포타주",
      "수프"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "powder",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/powder.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "powder",
      "가루",
      "분말"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "probiotics",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/probiotics.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "probiotics",
      "유산균",
      "프로바이오틱스"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "processed-seafood",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/processed-seafood.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "processed",
      "seafood",
      "수산가공품",
      "가공수산물"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "ramen",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/ramen.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "ramen",
      "라멘"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "ramyeon",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/ramyeon.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "ramyeon",
      "라면"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "red-ginseng",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/red-ginseng.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "red",
      "ginseng",
      "홍삼"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "rice",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/rice.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "rice",
      "밥",
      "쌀"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "rice-bowl",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/rice-bowl.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "rice",
      "bowl",
      "덮밥"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "rice-cake",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/rice-cake.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "rice",
      "cake",
      "떡"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "rice-grain",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/rice-grain.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "rice",
      "grain",
      "쌀",
      "곡물"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "rice-noodle",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/rice-noodle.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "rice",
      "noodle",
      "쌀국수"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "risotto",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/risotto.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "risotto",
      "리조또"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "royal-jelly",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/royal-jelly.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "royal",
      "jelly",
      "로열젤리"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "salad",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/salad.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "salad",
      "샐러드"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "salted-seafood",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/salted-seafood.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "salted",
      "seafood",
      "젓갈"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "sandwich",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/sandwich.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "sandwich",
      "샌드위치"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "sashimi",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/sashimi.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "sashimi",
      "회",
      "사시미"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "sauce",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/sauce.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "sauce",
      "소스",
      "양념"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "seafood",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/seafood.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "seafood",
      "해산물",
      "수산물"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "seaweed",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/seaweed.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "seaweed",
      "김",
      "해조류"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "shake",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/shake.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "shake",
      "쉐이크"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "side-dish",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/side-dish.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "side",
      "dish",
      "반찬"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "smoothie",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/smoothie.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "smoothie",
      "스무디"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "snack",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/snack.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "snack",
      "과자",
      "간식"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "soda",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/soda.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "soda",
      "탄산음료",
      "소다"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "soup",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/soup.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "soup",
      "국",
      "수프"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "sports-drink",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/sports-drink.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "sports",
      "drink",
      "스포츠음료",
      "이온음료"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "steamed",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/steamed.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "steamed",
      "찜"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "stir-fry",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/stir-fry.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "stir",
      "fry",
      "볶음"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "sundae-sausage",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/sundae-sausage.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "sundae",
      "sausage",
      "순대"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "sweet-sour-pork",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/sweet-sour-pork.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "sweet",
      "sour",
      "pork",
      "탕수육"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "syrup",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/syrup.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "syrup",
      "시럽"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "tea",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/tea.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "tea",
      "차"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "tom-yum",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/tom-yum.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "tom",
      "yum",
      "똠얌",
      "똠얌꿍"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "tteokbokki",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/tteokbokki.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "tteokbokki",
      "떡볶이"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "udon",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/udon.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "udon",
      "우동"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "vegetable",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/vegetable.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "vegetable",
      "채소",
      "야채"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "vitamin",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/vitamin.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "vitamin",
      "비타민"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "water",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/water.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "water",
      "물",
      "생수"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/food-types",
    "id": "yogurt",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/food-types/yogurt.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "yogurt",
      "요거트",
      "요구르트"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/misc",
    "id": "alert",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/misc/alert.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "misc",
      "alert",
      "알림",
      "경고"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/misc",
    "id": "cashlotto",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/misc/cashlotto.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "misc",
      "cashlotto",
      "캐시로또",
      "로또"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "images/misc",
    "id": "pill",
    "inlineRef": "@nudge-design/assets/files/project/geniet/images/misc/pill.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "misc",
      "pill",
      "영양제",
      "약",
      "알약"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "logos",
    "id": "geniet-logo-footer",
    "inlineRef": "@nudge-design/assets/files/project/geniet/logos/geniet-logo-footer.webp",
    "mimeType": "image/webp",
    "search": [
      "geniet",
      "logos",
      "logo",
      "footer"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "logos",
    "id": "geniet-logo-mobile",
    "inlineRef": "@nudge-design/assets/files/project/geniet/logos/geniet-logo-mobile.webp",
    "mimeType": "image/webp",
    "search": [
      "geniet",
      "logos",
      "logo",
      "mobile"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "logos",
    "id": "geniet-logo-pc",
    "inlineRef": "@nudge-design/assets/files/project/geniet/logos/geniet-logo-pc.webp",
    "mimeType": "image/webp",
    "search": [
      "geniet",
      "logos",
      "logo",
      "pc"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "logos",
    "id": "symbol",
    "inlineRef": "@nudge-design/assets/files/project/geniet/logos/symbol.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "geniet",
      "logos",
      "symbol"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "logos",
    "id": "wordmark",
    "inlineRef": "@nudge-design/assets/files/project/geniet/logos/wordmark.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "logos",
      "wordmark"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "logos",
    "id": "wordmark-alt",
    "inlineRef": "@nudge-design/assets/files/project/geniet/logos/wordmark-alt.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "logos",
      "wordmark",
      "alt"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "logos",
    "id": "wordmark-en",
    "inlineRef": "@nudge-design/assets/files/project/geniet/logos/wordmark-en.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "logos",
      "wordmark",
      "en"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "logos",
    "id": "wordmark-en-alt",
    "inlineRef": "@nudge-design/assets/files/project/geniet/logos/wordmark-en-alt.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "logos",
      "wordmark",
      "en",
      "alt"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "logos",
    "id": "wordmark-ko",
    "inlineRef": "@nudge-design/assets/files/project/geniet/logos/wordmark-ko.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "logos",
      "wordmark",
      "ko"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "logos",
    "id": "wordmark-koen",
    "inlineRef": "@nudge-design/assets/files/project/geniet/logos/wordmark-koen.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "logos",
      "wordmark",
      "koen"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "logos",
    "id": "wordmark-koen-alt",
    "inlineRef": "@nudge-design/assets/files/project/geniet/logos/wordmark-koen-alt.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "logos",
      "wordmark",
      "koen",
      "alt"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "profiles",
    "id": "profile-01",
    "inlineRef": "@nudge-design/assets/files/project/geniet/profiles/profile-01.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "profiles",
      "profile",
      "01"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "profiles",
    "id": "profile-02",
    "inlineRef": "@nudge-design/assets/files/project/geniet/profiles/profile-02.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "profiles",
      "profile",
      "02"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "profiles",
    "id": "profile-03",
    "inlineRef": "@nudge-design/assets/files/project/geniet/profiles/profile-03.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "profiles",
      "profile",
      "03"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "profiles",
    "id": "profile-04",
    "inlineRef": "@nudge-design/assets/files/project/geniet/profiles/profile-04.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "profiles",
      "profile",
      "04"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "profiles",
    "id": "profile-05",
    "inlineRef": "@nudge-design/assets/files/project/geniet/profiles/profile-05.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "profiles",
      "profile",
      "05"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "profiles",
    "id": "profile-06",
    "inlineRef": "@nudge-design/assets/files/project/geniet/profiles/profile-06.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "profiles",
      "profile",
      "06"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "profiles",
    "id": "profile-07",
    "inlineRef": "@nudge-design/assets/files/project/geniet/profiles/profile-07.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "profiles",
      "profile",
      "07"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "profiles",
    "id": "profile-08",
    "inlineRef": "@nudge-design/assets/files/project/geniet/profiles/profile-08.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "profiles",
      "profile",
      "08"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "profiles",
    "id": "profile-09",
    "inlineRef": "@nudge-design/assets/files/project/geniet/profiles/profile-09.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "profiles",
      "profile",
      "09"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "profiles",
    "id": "profile-10",
    "inlineRef": "@nudge-design/assets/files/project/geniet/profiles/profile-10.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "profiles",
      "profile",
      "10"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "profiles",
    "id": "profile-11",
    "inlineRef": "@nudge-design/assets/files/project/geniet/profiles/profile-11.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "profiles",
      "profile",
      "11"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "profiles",
    "id": "profile-12",
    "inlineRef": "@nudge-design/assets/files/project/geniet/profiles/profile-12.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "profiles",
      "profile",
      "12"
    ]
  },
  {
    "project": "geniet",
    "scope": "project",
    "category": "profiles",
    "id": "profile-default",
    "inlineRef": "@nudge-design/assets/files/project/geniet/profiles/profile-default.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "geniet",
      "profiles",
      "profile",
      "default",
      "기본프로필",
      "프로필"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/circle-icons",
    "id": "bubbles-blue",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/circle-icons/bubbles-blue.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "circle",
      "icons",
      "bubbles",
      "blue",
      "버블",
      "말풍선"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/circle-icons",
    "id": "bubbles-white",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/circle-icons/bubbles-white.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "circle",
      "icons",
      "bubbles",
      "white",
      "버블",
      "말풍선"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/circle-icons",
    "id": "location-white",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/circle-icons/location-white.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "circle",
      "icons",
      "location",
      "white",
      "위치"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/circle-icons",
    "id": "notice-blue",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/circle-icons/notice-blue.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "circle",
      "icons",
      "notice",
      "blue",
      "공지",
      "알림"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/circle-icons",
    "id": "search-white",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/circle-icons/search-white.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "circle",
      "icons",
      "search",
      "white",
      "검색"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/consult",
    "id": "calendar",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/consult/calendar.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "consult",
      "calendar",
      "캘린더",
      "일정"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/consult",
    "id": "inquiry-form",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/consult/inquiry-form.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "consult",
      "inquiry",
      "form",
      "문의",
      "신청서"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/consult",
    "id": "sentence-test",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/consult/sentence-test.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "consult",
      "sentence",
      "test",
      "문장검사",
      "문장완성"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/gift",
    "id": "cafe",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/gift/cafe.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "gift",
      "cafe",
      "카페",
      "커피"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/gift",
    "id": "culture",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/gift/culture.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "gift",
      "culture",
      "문화상품권",
      "컬처"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/gift",
    "id": "market",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/gift/market.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "gift",
      "market",
      "마트",
      "상품권"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/gift",
    "id": "pizza",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/gift/pizza.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "gift",
      "pizza",
      "피자"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/gift",
    "id": "shoppingcart",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/gift/shoppingcart.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "gift",
      "shoppingcart",
      "쇼핑",
      "장바구니"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/menu-app",
    "id": "chat",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/menu-app/chat.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "menu",
      "app",
      "chat",
      "채팅",
      "대화"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/menu-app",
    "id": "counseling",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/menu-app/counseling.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "menu",
      "app",
      "counseling",
      "상담"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/menu-app",
    "id": "courthouse",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/menu-app/courthouse.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "menu",
      "app",
      "courthouse",
      "법률",
      "법원"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/menu-app",
    "id": "emotion",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/menu-app/emotion.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "menu",
      "app",
      "emotion",
      "감정"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/menu-app",
    "id": "life",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/menu-app/life.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "menu",
      "app",
      "life",
      "생활",
      "라이프"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/menu-app",
    "id": "location",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/menu-app/location.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "menu",
      "app",
      "location",
      "위치",
      "지도"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/menu-app",
    "id": "one-to-one",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/menu-app/one-to-one.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "menu",
      "app",
      "one",
      "to",
      "일대일",
      "1대1"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/menu-app",
    "id": "routine",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/menu-app/routine.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "menu",
      "app",
      "routine",
      "루틴",
      "생활습관"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/menu-app",
    "id": "sound-therapy",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/menu-app/sound-therapy.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "menu",
      "app",
      "sound",
      "therapy",
      "사운드테라피",
      "소리치료"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/menu-web",
    "id": "bubbles-default",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/menu-web/bubbles-default.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "menu",
      "web",
      "bubbles",
      "default"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/menu-web",
    "id": "bubbles-selected",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/menu-web/bubbles-selected.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "menu",
      "web",
      "bubbles",
      "selected"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/menu-web",
    "id": "challenge-default",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/menu-web/challenge-default.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "menu",
      "web",
      "challenge",
      "default",
      "챌린지",
      "도전"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/menu-web",
    "id": "challenge-selected",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/menu-web/challenge-selected.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "menu",
      "web",
      "challenge",
      "selected",
      "챌린지",
      "도전"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/menu-web",
    "id": "eap-default",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/menu-web/eap-default.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "menu",
      "web",
      "default"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/menu-web",
    "id": "eap-selected",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/menu-web/eap-selected.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "menu",
      "web",
      "selected"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/menu-web",
    "id": "life-default",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/menu-web/life-default.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "menu",
      "web",
      "life",
      "default",
      "라이프",
      "생활"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/menu-web",
    "id": "life-selected",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/menu-web/life-selected.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "menu",
      "web",
      "life",
      "selected",
      "라이프",
      "생활"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "depression",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/psych-tests/depression.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "psych",
      "tests",
      "depression",
      "우울",
      "우울증"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "dsi",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/psych-tests/dsi.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "psych",
      "tests",
      "dsi",
      "스트레스"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "finance",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/psych-tests/finance.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "psych",
      "tests",
      "finance",
      "재정",
      "금융"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "happy",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/psych-tests/happy.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "psych",
      "tests",
      "happy",
      "행복"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "job-stress",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/psych-tests/job-stress.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "psych",
      "tests",
      "job",
      "stress",
      "직무스트레스",
      "직장스트레스"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "koss",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/psych-tests/koss.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "psych",
      "tests",
      "koss",
      "직무스트레스",
      "스트레스"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "love",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/psych-tests/love.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "psych",
      "tests",
      "love",
      "연애",
      "사랑"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "marriage",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/psych-tests/marriage.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "psych",
      "tests",
      "marriage",
      "결혼",
      "부부"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "mbti",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/psych-tests/mbti.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "psych",
      "tests",
      "mbti",
      "성격유형"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "personality",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/psych-tests/personality.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "psych",
      "tests",
      "personality",
      "성격",
      "성격검사"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "psych",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/psych-tests/psych.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "psych",
      "tests",
      "심리",
      "심리검사"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "selfesteem",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/psych-tests/selfesteem.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "psych",
      "tests",
      "selfesteem",
      "자존감"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/rank",
    "id": "rank-01",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/rank/rank-01.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "rank",
      "01",
      "1등",
      "1위"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/rank",
    "id": "rank-02",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/rank/rank-02.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "rank",
      "02",
      "2등",
      "2위"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/rank",
    "id": "rank-03",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/rank/rank-03.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "rank",
      "03",
      "3등",
      "3위"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/three-d",
    "id": "shopping",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/three-d/shopping.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "three",
      "d",
      "shopping",
      "쇼핑"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "images/three-d",
    "id": "walkranking",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/images/three-d/walkranking.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "three",
      "d",
      "walkranking",
      "걷기랭킹",
      "워크랭킹"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "logos",
    "id": "dain-logo",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/logos/dain-logo.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "nudge",
      "eap",
      "logos",
      "dain",
      "logo"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "logos",
    "id": "nudge-eap-en",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/logos/nudge-eap-en.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "nudge",
      "eap",
      "logos",
      "en"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "logos",
    "id": "nudge-eap-en-dark",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/logos/nudge-eap-en-dark.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "nudge",
      "eap",
      "logos",
      "en",
      "dark"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "logos",
    "id": "nudge-eap-ko",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/logos/nudge-eap-ko.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "nudge",
      "eap",
      "logos",
      "ko"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "logos",
    "id": "nudge-eap-koen",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/logos/nudge-eap-koen.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "nudge",
      "eap",
      "logos",
      "koen"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "logos",
    "id": "nudge-eap-logo",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/logos/nudge-eap-logo.png",
    "mimeType": "image/png",
    "search": [
      "nudge",
      "eap",
      "logos",
      "logo"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "logos",
    "id": "nudge-eap-logo",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/logos/nudge-eap-logo.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "nudge",
      "eap",
      "logos",
      "logo"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "logos",
    "id": "nudge-eap-logo-footer",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/logos/nudge-eap-logo-footer.png",
    "mimeType": "image/png",
    "search": [
      "nudge",
      "eap",
      "logos",
      "logo",
      "footer"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "logos",
    "id": "nudge-eap-symbol",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/logos/nudge-eap-symbol.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "nudge",
      "eap",
      "logos",
      "symbol"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "profiles",
    "id": "client-default",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/profiles/client-default.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "profiles",
      "client",
      "default"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "profiles",
    "id": "counselor-01",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/profiles/counselor-01.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "profiles",
      "counselor",
      "01"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "profiles",
    "id": "counselor-02",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/profiles/counselor-02.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "profiles",
      "counselor",
      "02"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "profiles",
    "id": "counselor-03",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/profiles/counselor-03.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "profiles",
      "counselor",
      "03"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "profiles",
    "id": "counselor-default",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/profiles/counselor-default.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "profiles",
      "counselor",
      "default"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "profiles",
    "id": "user-01",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/profiles/user-01.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "profiles",
      "user",
      "01"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "profiles",
    "id": "user-02",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/profiles/user-02.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "profiles",
      "user",
      "02"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "profiles",
    "id": "user-03",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/profiles/user-03.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "profiles",
      "user",
      "03"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "profiles",
    "id": "user-04",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/profiles/user-04.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "profiles",
      "user",
      "04"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "profiles",
    "id": "user-05",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/profiles/user-05.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "profiles",
      "user",
      "05"
    ]
  },
  {
    "project": "nudge-eap",
    "scope": "project",
    "category": "profiles",
    "id": "user-default",
    "inlineRef": "@nudge-design/assets/files/project/nudge-eap/profiles/user-default.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "profiles",
      "user",
      "default"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "avatar",
    "id": "profile-1",
    "inlineRef": "@nudge-design/assets/files/project/runmile/avatar/profile-1.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "avatar",
      "profile",
      "1"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "avatar",
    "id": "profile-10",
    "inlineRef": "@nudge-design/assets/files/project/runmile/avatar/profile-10.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "avatar",
      "profile",
      "10"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "avatar",
    "id": "profile-11",
    "inlineRef": "@nudge-design/assets/files/project/runmile/avatar/profile-11.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "avatar",
      "profile",
      "11"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "avatar",
    "id": "profile-12",
    "inlineRef": "@nudge-design/assets/files/project/runmile/avatar/profile-12.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "avatar",
      "profile",
      "12"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "avatar",
    "id": "profile-2",
    "inlineRef": "@nudge-design/assets/files/project/runmile/avatar/profile-2.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "avatar",
      "profile",
      "2"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "avatar",
    "id": "profile-3",
    "inlineRef": "@nudge-design/assets/files/project/runmile/avatar/profile-3.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "avatar",
      "profile",
      "3"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "avatar",
    "id": "profile-4",
    "inlineRef": "@nudge-design/assets/files/project/runmile/avatar/profile-4.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "avatar",
      "profile",
      "4"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "avatar",
    "id": "profile-5",
    "inlineRef": "@nudge-design/assets/files/project/runmile/avatar/profile-5.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "avatar",
      "profile",
      "5"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "avatar",
    "id": "profile-6",
    "inlineRef": "@nudge-design/assets/files/project/runmile/avatar/profile-6.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "avatar",
      "profile",
      "6"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "avatar",
    "id": "profile-7",
    "inlineRef": "@nudge-design/assets/files/project/runmile/avatar/profile-7.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "avatar",
      "profile",
      "7"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "avatar",
    "id": "profile-8",
    "inlineRef": "@nudge-design/assets/files/project/runmile/avatar/profile-8.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "avatar",
      "profile",
      "8"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "avatar",
    "id": "profile-9",
    "inlineRef": "@nudge-design/assets/files/project/runmile/avatar/profile-9.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "avatar",
      "profile",
      "9"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "avatar",
    "id": "profile-default",
    "inlineRef": "@nudge-design/assets/files/project/runmile/avatar/profile-default.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "avatar",
      "profile",
      "default",
      "기본프로필",
      "프로필"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "illust",
    "id": "chatting-default",
    "inlineRef": "@nudge-design/assets/files/project/runmile/illust/chatting-default.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "illust",
      "chatting",
      "default",
      "채팅"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "illust",
    "id": "chatting-white",
    "inlineRef": "@nudge-design/assets/files/project/runmile/illust/chatting-white.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "illust",
      "chatting",
      "white",
      "채팅"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "illust",
    "id": "community",
    "inlineRef": "@nudge-design/assets/files/project/runmile/illust/community.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "illust",
      "community",
      "커뮤니티"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "illust",
    "id": "event-animal-run",
    "inlineRef": "@nudge-design/assets/files/project/runmile/illust/event-animal-run.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "runmile",
      "illust",
      "event",
      "animal",
      "run",
      "동물런",
      "애니멀런"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "illust",
    "id": "event-bomkkot-run",
    "inlineRef": "@nudge-design/assets/files/project/runmile/illust/event-bomkkot-run.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "runmile",
      "illust",
      "event",
      "bomkkot",
      "run",
      "봄꽃런"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "illust",
    "id": "event-dog-race",
    "inlineRef": "@nudge-design/assets/files/project/runmile/illust/event-dog-race.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "illust",
      "event",
      "dog",
      "race",
      "댕댕이레이스",
      "강아지레이스"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "illust",
    "id": "event-forsythia",
    "inlineRef": "@nudge-design/assets/files/project/runmile/illust/event-forsythia.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "illust",
      "event",
      "forsythia",
      "개나리런"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "illust",
    "id": "event-hangang-night-run",
    "inlineRef": "@nudge-design/assets/files/project/runmile/illust/event-hangang-night-run.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "runmile",
      "illust",
      "event",
      "hangang",
      "night",
      "run",
      "한강야간런",
      "한강런"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "illust",
    "id": "event-pokemon",
    "inlineRef": "@nudge-design/assets/files/project/runmile/illust/event-pokemon.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "illust",
      "event",
      "pokemon",
      "포켓몬런"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "illust",
    "id": "event-santa-claus-run",
    "inlineRef": "@nudge-design/assets/files/project/runmile/illust/event-santa-claus-run.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "runmile",
      "illust",
      "event",
      "santa",
      "claus",
      "run",
      "산타런",
      "산타클로스런"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "illust",
    "id": "event-seokchon-night-run",
    "inlineRef": "@nudge-design/assets/files/project/runmile/illust/event-seokchon-night-run.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "runmile",
      "illust",
      "event",
      "seokchon",
      "night",
      "run",
      "석촌야간런"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "illust",
    "id": "event-shinhan-donghaeng-run",
    "inlineRef": "@nudge-design/assets/files/project/runmile/illust/event-shinhan-donghaeng-run.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "runmile",
      "illust",
      "event",
      "shinhan",
      "donghaeng",
      "run",
      "신한동행런"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "illust",
    "id": "event-yeontan-run",
    "inlineRef": "@nudge-design/assets/files/project/runmile/illust/event-yeontan-run.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "runmile",
      "illust",
      "event",
      "yeontan",
      "run",
      "연탄런"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "illust",
    "id": "qna",
    "inlineRef": "@nudge-design/assets/files/project/runmile/illust/qna.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "illust",
      "qna",
      "문의",
      "질문"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "illust",
    "id": "shoe",
    "inlineRef": "@nudge-design/assets/files/project/runmile/illust/shoe.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "illust",
      "shoe",
      "신발",
      "운동화"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "logos",
    "id": "runmile-logo",
    "inlineRef": "@nudge-design/assets/files/project/runmile/logos/runmile-logo.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "runmile",
      "logos",
      "logo"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "logos",
    "id": "runmile-logo-black",
    "inlineRef": "@nudge-design/assets/files/project/runmile/logos/runmile-logo-black.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "runmile",
      "logos",
      "logo",
      "black"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "logos",
    "id": "runmile-logo-gray700",
    "inlineRef": "@nudge-design/assets/files/project/runmile/logos/runmile-logo-gray700.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "runmile",
      "logos",
      "logo",
      "gray700"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "logos",
    "id": "runmile-logo-white",
    "inlineRef": "@nudge-design/assets/files/project/runmile/logos/runmile-logo-white.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "runmile",
      "logos",
      "logo",
      "white"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "state",
    "id": "alarm-empty",
    "inlineRef": "@nudge-design/assets/files/project/runmile/state/alarm-empty.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "state",
      "alarm",
      "empty",
      "알림",
      "알람",
      "알림없음"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "state",
    "id": "error",
    "inlineRef": "@nudge-design/assets/files/project/runmile/state/error.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "state",
      "error",
      "이미지오류",
      "오류",
      "로드실패"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "state",
    "id": "error-default",
    "inlineRef": "@nudge-design/assets/files/project/runmile/state/error-default.png",
    "mimeType": "image/png",
    "retina": [
      "2x",
      "3x"
    ],
    "search": [
      "runmile",
      "state",
      "error",
      "default",
      "에러",
      "오류"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "state",
    "id": "no-result-default",
    "inlineRef": "@nudge-design/assets/files/project/runmile/state/no-result-default.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "state",
      "no",
      "result",
      "default",
      "결과없음",
      "검색결과없음"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "state",
    "id": "no-result-white",
    "inlineRef": "@nudge-design/assets/files/project/runmile/state/no-result-white.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "state",
      "no",
      "result",
      "white",
      "결과없음",
      "검색결과없음"
    ]
  },
  {
    "project": "runmile",
    "scope": "project",
    "category": "state",
    "id": "page-error",
    "inlineRef": "@nudge-design/assets/files/project/runmile/state/page-error.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "state",
      "page",
      "error",
      "페이지오류",
      "에러"
    ]
  },
  {
    "project": "shared",
    "scope": "shared",
    "category": "sns-logos",
    "id": "apple-black",
    "inlineRef": "@nudge-design/assets/files/shared/sns-logos/apple-black.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "shared",
      "sns",
      "logos",
      "apple",
      "black",
      "애플"
    ]
  },
  {
    "project": "shared",
    "scope": "shared",
    "category": "sns-logos",
    "id": "apple-white",
    "inlineRef": "@nudge-design/assets/files/shared/sns-logos/apple-white.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "shared",
      "sns",
      "logos",
      "apple",
      "white",
      "애플"
    ]
  },
  {
    "project": "shared",
    "scope": "shared",
    "category": "sns-logos",
    "id": "google-main",
    "inlineRef": "@nudge-design/assets/files/shared/sns-logos/google-main.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "shared",
      "sns",
      "logos",
      "google",
      "main",
      "구글"
    ]
  },
  {
    "project": "shared",
    "scope": "shared",
    "category": "sns-logos",
    "id": "google-white",
    "inlineRef": "@nudge-design/assets/files/shared/sns-logos/google-white.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "shared",
      "sns",
      "logos",
      "google",
      "white",
      "구글"
    ]
  },
  {
    "project": "shared",
    "scope": "shared",
    "category": "sns-logos",
    "id": "kakao-black",
    "inlineRef": "@nudge-design/assets/files/shared/sns-logos/kakao-black.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "shared",
      "sns",
      "logos",
      "kakao",
      "black",
      "카카오"
    ]
  },
  {
    "project": "shared",
    "scope": "shared",
    "category": "sns-logos",
    "id": "kakao-main",
    "inlineRef": "@nudge-design/assets/files/shared/sns-logos/kakao-main.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "shared",
      "sns",
      "logos",
      "kakao",
      "main",
      "카카오"
    ]
  },
  {
    "project": "shared",
    "scope": "shared",
    "category": "sns-logos",
    "id": "naver-main",
    "inlineRef": "@nudge-design/assets/files/shared/sns-logos/naver-main.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "shared",
      "sns",
      "logos",
      "naver",
      "main",
      "네이버"
    ]
  },
  {
    "project": "shared",
    "scope": "shared",
    "category": "sns-logos",
    "id": "naver-white",
    "inlineRef": "@nudge-design/assets/files/shared/sns-logos/naver-white.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "shared",
      "sns",
      "logos",
      "naver",
      "white",
      "네이버"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "images/misc",
    "id": "test-complete",
    "inlineRef": "@nudge-design/assets/files/project/trost/images/misc/test-complete.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "trost",
      "images",
      "misc",
      "test",
      "complete"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "images/profiles",
    "id": "default-profile",
    "inlineRef": "@nudge-design/assets/files/project/trost/images/profiles/default-profile.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "trost",
      "images",
      "profiles",
      "default",
      "profile"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "center",
    "inlineRef": "@nudge-design/assets/files/project/trost/images/psych-tests/center.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "trost",
      "images",
      "psych",
      "tests",
      "center",
      "센터",
      "상담센터"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "corona",
    "inlineRef": "@nudge-design/assets/files/project/trost/images/psych-tests/corona.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "trost",
      "images",
      "psych",
      "tests",
      "corona",
      "코로나"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "d-type",
    "inlineRef": "@nudge-design/assets/files/project/trost/images/psych-tests/d-type.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "trost",
      "images",
      "psych",
      "tests",
      "d",
      "type",
      "d유형",
      "디타입"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "depression",
    "inlineRef": "@nudge-design/assets/files/project/trost/images/psych-tests/depression.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "trost",
      "images",
      "psych",
      "tests",
      "depression",
      "우울",
      "우울증"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "emotion",
    "inlineRef": "@nudge-design/assets/files/project/trost/images/psych-tests/emotion.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "trost",
      "images",
      "psych",
      "tests",
      "emotion",
      "감정"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "employment",
    "inlineRef": "@nudge-design/assets/files/project/trost/images/psych-tests/employment.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "trost",
      "images",
      "psych",
      "tests",
      "employment",
      "취업"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "event",
    "inlineRef": "@nudge-design/assets/files/project/trost/images/psych-tests/event.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "trost",
      "images",
      "psych",
      "tests",
      "event",
      "이벤트"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "job-stress",
    "inlineRef": "@nudge-design/assets/files/project/trost/images/psych-tests/job-stress.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "trost",
      "images",
      "psych",
      "tests",
      "job",
      "stress",
      "직무스트레스",
      "직장스트레스"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "mbti",
    "inlineRef": "@nudge-design/assets/files/project/trost/images/psych-tests/mbti.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "trost",
      "images",
      "psych",
      "tests",
      "mbti",
      "성격유형"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "medicine",
    "inlineRef": "@nudge-design/assets/files/project/trost/images/psych-tests/medicine.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "trost",
      "images",
      "psych",
      "tests",
      "medicine",
      "약",
      "의학"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "panic",
    "inlineRef": "@nudge-design/assets/files/project/trost/images/psych-tests/panic.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "trost",
      "images",
      "psych",
      "tests",
      "panic",
      "공황",
      "공황장애"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "personality",
    "inlineRef": "@nudge-design/assets/files/project/trost/images/psych-tests/personality.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "trost",
      "images",
      "psych",
      "tests",
      "personality",
      "성격",
      "성격검사"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "psych",
    "inlineRef": "@nudge-design/assets/files/project/trost/images/psych-tests/psych.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "trost",
      "images",
      "psych",
      "tests",
      "심리",
      "심리검사"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "routine",
    "inlineRef": "@nudge-design/assets/files/project/trost/images/psych-tests/routine.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "trost",
      "images",
      "psych",
      "tests",
      "routine",
      "루틴",
      "생활습관"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "self-esteem",
    "inlineRef": "@nudge-design/assets/files/project/trost/images/psych-tests/self-esteem.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "trost",
      "images",
      "psych",
      "tests",
      "self",
      "esteem",
      "자존감"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "images/psych-tests",
    "id": "sound",
    "inlineRef": "@nudge-design/assets/files/project/trost/images/psych-tests/sound.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "trost",
      "images",
      "psych",
      "tests",
      "sound",
      "소리",
      "사운드"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "logos",
    "id": "trost-logo",
    "inlineRef": "@nudge-design/assets/files/project/trost/logos/trost-logo.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "trost",
      "logos",
      "logo"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "logos",
    "id": "trost-logo-mobile",
    "inlineRef": "@nudge-design/assets/files/project/trost/logos/trost-logo-mobile.webp",
    "mimeType": "image/webp",
    "search": [
      "trost",
      "logos",
      "logo",
      "mobile"
    ]
  },
  {
    "project": "trost",
    "scope": "project",
    "category": "logos",
    "id": "trost-logo-white",
    "inlineRef": "@nudge-design/assets/files/project/trost/logos/trost-logo-white.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "trost",
      "logos",
      "logo",
      "white"
    ]
  }
];

/** 프로젝트 → 카테고리 → 에셋 수 요약. */
export const ASSET_CATALOG_SUMMARY: Record<string, Record<string, number>> = {
  "cashwalk-biz": {
    "illustrations": 5,
    "logos": 3
  },
  "geniet": {
    "images/category-heroes": 16,
    "images/empty-states": 7,
    "images/food-types": 99,
    "images/misc": 3,
    "logos": 11,
    "profiles": 13
  },
  "nudge-eap": {
    "images/circle-icons": 5,
    "images/consult": 3,
    "images/gift": 5,
    "images/menu-app": 9,
    "images/menu-web": 8,
    "images/psych-tests": 12,
    "images/rank": 3,
    "images/three-d": 2,
    "logos": 9,
    "profiles": 11
  },
  "runmile": {
    "avatar": 13,
    "illust": 15,
    "logos": 4,
    "state": 6
  },
  "shared": {
    "sns-logos": 8
  },
  "trost": {
    "images/misc": 1,
    "images/profiles": 1,
    "images/psych-tests": 16,
    "logos": 3
  }
};
