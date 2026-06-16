/**
 * AUTO-GENERATED — @nudge-design/assets/src/files/** 에서 build-asset-catalog.mjs 가 생성. 직접 수정 금지.
 *
 * 에셋 추가/이름변경 → packages/assets/src/files/ 를 고치고
 * `pnpm --filter @nudge-design/mcp build:assets` 로 재생성해 함께 커밋한다.
 * (check-ssot 의 asset-catalog --check 가 stale 을 차단한다.)
 */

export interface AssetCatalogEntry {
  /** 브랜드 slug 또는 "shared". */
  brand: string;
  scope: "brand" | "shared" | "unknown";
  /** 브랜드 아래 디렉토리 경로(예: "images/food-types", "logos", "profiles"). */
  category: string;
  /** 파일 stem(레티나 접미사 제거) — 보통 의미 있는 kebab id(예: "bibimbap"). */
  id: string;
  /** <img src> 에 그대로 박으면 build_singlefile_html 이 base64 인라인하는 경로. */
  inlineRef: string;
  mimeType: string;
  /** 보유 레티나 변형(예: ["3x"]). 없으면 키 자체가 없음. */
  retina?: string[];
  /** 소문자 검색 토큰(brand·category·id). */
  search: string[];
}

export const ASSET_CATALOG: AssetCatalogEntry[] = [
  {
    "brand": "cashwalk-biz",
    "scope": "brand",
    "category": "illustrations",
    "id": "charge-alert-bell",
    "inlineRef": "@nudge-design/assets/files/brand/cashwalk-biz/illustrations/charge-alert-bell.png",
    "mimeType": "image/png",
    "search": [
      "cashwalk",
      "biz",
      "illustrations",
      "charge",
      "alert",
      "bell"
    ]
  },
  {
    "brand": "cashwalk-biz",
    "scope": "brand",
    "category": "logos",
    "id": "cashwalk-for-business-horizontal",
    "inlineRef": "@nudge-design/assets/files/brand/cashwalk-biz/logos/cashwalk-for-business-horizontal.svg",
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
    "brand": "cashwalk-biz",
    "scope": "brand",
    "category": "logos",
    "id": "cashwalk-horizontal",
    "inlineRef": "@nudge-design/assets/files/brand/cashwalk-biz/logos/cashwalk-horizontal.png",
    "mimeType": "image/png",
    "search": [
      "cashwalk",
      "biz",
      "logos",
      "horizontal"
    ]
  },
  {
    "brand": "cashwalk-biz",
    "scope": "brand",
    "category": "logos",
    "id": "cashwalk-vertical",
    "inlineRef": "@nudge-design/assets/files/brand/cashwalk-biz/logos/cashwalk-vertical.png",
    "mimeType": "image/png",
    "search": [
      "cashwalk",
      "biz",
      "logos",
      "vertical"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/category-heroes",
    "id": "asian",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/category-heroes/asian.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "asian"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/category-heroes",
    "id": "beverage",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/category-heroes/beverage.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "beverage"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/category-heroes",
    "id": "chinese",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/category-heroes/chinese.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "chinese"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/category-heroes",
    "id": "dairy-baby-food",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/category-heroes/dairy-baby-food.png",
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
      "food"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/category-heroes",
    "id": "diet",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/category-heroes/diet.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "diet"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/category-heroes",
    "id": "fast-food",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/category-heroes/fast-food.png",
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
      "food"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/category-heroes",
    "id": "health-food",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/category-heroes/health-food.png",
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
      "food"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/category-heroes",
    "id": "japanese",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/category-heroes/japanese.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "japanese"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/category-heroes",
    "id": "korean",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/category-heroes/korean.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "korean"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/category-heroes",
    "id": "livestock",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/category-heroes/livestock.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "livestock"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/category-heroes",
    "id": "marine",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/category-heroes/marine.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "marine"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/category-heroes",
    "id": "noodle-can-oil-sauce",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/category-heroes/noodle-can-oil-sauce.png",
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
      "sauce"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/category-heroes",
    "id": "produce",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/category-heroes/produce.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "produce"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/category-heroes",
    "id": "rice-cake-bakery-snack",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/category-heroes/rice-cake-bakery-snack.png",
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
      "snack"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/category-heroes",
    "id": "snack-food",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/category-heroes/snack-food.png",
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
      "food"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/category-heroes",
    "id": "western",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/category-heroes/western.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "category",
      "heroes",
      "western"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/empty-states",
    "id": "coupon-empty",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/empty-states/coupon-empty.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "empty",
      "states",
      "coupon"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/empty-states",
    "id": "error-thumbnail",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/empty-states/error-thumbnail.png",
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
      "thumbnail"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/empty-states",
    "id": "food-empty",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/empty-states/food-empty.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "empty",
      "states",
      "food"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/empty-states",
    "id": "food-thumbnail-empty",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/empty-states/food-thumbnail-empty.png",
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
      "thumbnail"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/empty-states",
    "id": "heart-empty",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/empty-states/heart-empty.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "empty",
      "states",
      "heart"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/empty-states",
    "id": "memo-empty",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/empty-states/memo-empty.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "empty",
      "states",
      "memo"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/empty-states",
    "id": "pill-thumbnail-empty",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/empty-states/pill-thumbnail-empty.png",
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
      "thumbnail"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "alcohol",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/alcohol.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "alcohol"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "all",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/all.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "all"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "baby-formula",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/baby-formula.png",
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
      "formula"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "bakery",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/bakery.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "bakery"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "beef",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/beef.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "beef"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "bibimbap",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/bibimbap.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "bibimbap"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "braised-pigs-feet",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/braised-pigs-feet.png",
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
      "feet"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "bread",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/bread.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "bread"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "broth",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/broth.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "broth"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "burger",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/burger.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "burger"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "candy",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/candy.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "candy"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "canned-food",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/canned-food.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "canned"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "cheese",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/cheese.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "cheese"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "chicken",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/chicken.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "chicken"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "chicken-breast",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/chicken-breast.png",
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
      "breast"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "coffee",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/coffee.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "coffee"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "cooking-oil",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/cooking-oil.png",
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
      "oil"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "curry",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/curry.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "curry"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "curry-indian",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/curry-indian.png",
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
      "indian"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "diet",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/diet.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "diet"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "dim-sum",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/dim-sum.png",
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
      "sum"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "dried-seafood",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/dried-seafood.png",
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
      "seafood"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "duck",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/duck.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "duck"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "egg",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/egg.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "egg"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "enzyme",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/enzyme.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "enzyme"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "etc",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/etc.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "etc"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "fish",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/fish.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "fish"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "fish-cake",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/fish-cake.png",
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
      "cake"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "fried",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/fried.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "fried"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "fried-chicken",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/fried-chicken.png",
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
      "chicken"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "fried-rice",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/fried-rice.png",
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
      "rice"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "fritters",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/fritters.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "fritters"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "fruit",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/fruit.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "fruit"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "functional-health-food",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/functional-health-food.png",
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
      "health"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "gimbap",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/gimbap.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "gimbap"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "grain-shake",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/grain-shake.png",
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
      "shake"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "gratin",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/gratin.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "gratin"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "grilled",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/grilled.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "grilled"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "health-juice",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/health-juice.png",
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
      "juice"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "health-snack",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/health-snack.png",
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
      "snack"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "hot-dog",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/hot-dog.png",
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
      "dog"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "ice-cream",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/ice-cream.png",
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
      "cream"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "jjajangmyeon",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/jjajangmyeon.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "jjajangmyeon"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "jjamppong",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/jjamppong.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "jjamppong"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "juice",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/juice.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "juice"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "kimchi",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/kimchi.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "kimchi"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "korean-pancake",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/korean-pancake.png",
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
      "pancake"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "low-sugar-food",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/low-sugar-food.png",
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
      "sugar"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "meal-plan",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/meal-plan.png",
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
      "plan"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "milk",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/milk.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "milk"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "multigrain",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/multigrain.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "multigrain"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "nasi-goreng",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/nasi-goreng.png",
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
      "goreng"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "nuts",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/nuts.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "nuts"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "pad-thai",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/pad-thai.png",
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
      "thai"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "pasta",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/pasta.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "pasta"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "pizza",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/pizza.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "pizza"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "pork",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/pork.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "pork"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "pork-cutlet",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/pork-cutlet.png",
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
      "cutlet"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "pottage",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/pottage.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "pottage"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "powder",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/powder.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "powder"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "probiotics",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/probiotics.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "probiotics"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "processed-seafood",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/processed-seafood.png",
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
      "seafood"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "ramen",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/ramen.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "ramen"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "ramyeon",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/ramyeon.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "ramyeon"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "red-ginseng",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/red-ginseng.png",
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
      "ginseng"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "rice",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/rice.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "rice"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "rice-bowl",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/rice-bowl.png",
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
      "bowl"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "rice-cake",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/rice-cake.png",
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
      "cake"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "rice-grain",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/rice-grain.png",
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
      "grain"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "rice-noodle",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/rice-noodle.png",
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
      "noodle"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "risotto",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/risotto.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "risotto"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "royal-jelly",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/royal-jelly.png",
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
      "jelly"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "salad",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/salad.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "salad"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "salted-seafood",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/salted-seafood.png",
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
      "seafood"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "sandwich",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/sandwich.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "sandwich"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "sashimi",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/sashimi.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "sashimi"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "sauce",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/sauce.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "sauce"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "seafood",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/seafood.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "seafood"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "seaweed",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/seaweed.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "seaweed"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "shake",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/shake.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "shake"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "side-dish",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/side-dish.png",
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
      "dish"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "smoothie",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/smoothie.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "smoothie"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "snack",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/snack.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "snack"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "soda",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/soda.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "soda"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "soup",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/soup.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "soup"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "sports-drink",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/sports-drink.png",
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
      "drink"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "steamed",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/steamed.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "steamed"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "stir-fry",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/stir-fry.png",
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
      "fry"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "sundae-sausage",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/sundae-sausage.png",
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
      "sausage"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "sweet-sour-pork",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/sweet-sour-pork.png",
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
      "pork"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "syrup",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/syrup.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "syrup"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "tea",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/tea.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "tea"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "tom-yum",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/tom-yum.png",
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
      "yum"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "tteokbokki",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/tteokbokki.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "tteokbokki"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "udon",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/udon.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "udon"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "vegetable",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/vegetable.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "vegetable"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "vitamin",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/vitamin.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "vitamin"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "water",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/water.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "water"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/food-types",
    "id": "yogurt",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/food-types/yogurt.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "food",
      "types",
      "yogurt"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/misc",
    "id": "alert",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/misc/alert.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "misc",
      "alert"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/misc",
    "id": "cashlotto",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/misc/cashlotto.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "misc",
      "cashlotto"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "images/misc",
    "id": "pill",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/images/misc/pill.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "geniet",
      "images",
      "misc",
      "pill"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "logos",
    "id": "geniet-logo-footer",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/logos/geniet-logo-footer.webp",
    "mimeType": "image/webp",
    "search": [
      "geniet",
      "logos",
      "logo",
      "footer"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "logos",
    "id": "geniet-logo-mobile",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/logos/geniet-logo-mobile.webp",
    "mimeType": "image/webp",
    "search": [
      "geniet",
      "logos",
      "logo",
      "mobile"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "logos",
    "id": "geniet-logo-pc",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/logos/geniet-logo-pc.webp",
    "mimeType": "image/webp",
    "search": [
      "geniet",
      "logos",
      "logo",
      "pc"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "logos",
    "id": "symbol",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/logos/symbol.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "geniet",
      "logos",
      "symbol"
    ]
  },
  {
    "brand": "geniet",
    "scope": "brand",
    "category": "logos",
    "id": "wordmark",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/logos/wordmark.png",
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
    "brand": "geniet",
    "scope": "brand",
    "category": "logos",
    "id": "wordmark-alt",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/logos/wordmark-alt.png",
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
    "brand": "geniet",
    "scope": "brand",
    "category": "logos",
    "id": "wordmark-en",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/logos/wordmark-en.png",
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
    "brand": "geniet",
    "scope": "brand",
    "category": "logos",
    "id": "wordmark-en-alt",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/logos/wordmark-en-alt.png",
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
    "brand": "geniet",
    "scope": "brand",
    "category": "logos",
    "id": "wordmark-ko",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/logos/wordmark-ko.png",
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
    "brand": "geniet",
    "scope": "brand",
    "category": "logos",
    "id": "wordmark-koen",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/logos/wordmark-koen.png",
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
    "brand": "geniet",
    "scope": "brand",
    "category": "logos",
    "id": "wordmark-koen-alt",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/logos/wordmark-koen-alt.png",
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
    "brand": "geniet",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-01",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/profiles/profile-01.png",
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
    "brand": "geniet",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-02",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/profiles/profile-02.png",
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
    "brand": "geniet",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-03",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/profiles/profile-03.png",
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
    "brand": "geniet",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-04",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/profiles/profile-04.png",
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
    "brand": "geniet",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-05",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/profiles/profile-05.png",
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
    "brand": "geniet",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-06",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/profiles/profile-06.png",
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
    "brand": "geniet",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-07",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/profiles/profile-07.png",
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
    "brand": "geniet",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-08",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/profiles/profile-08.png",
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
    "brand": "geniet",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-09",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/profiles/profile-09.png",
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
    "brand": "geniet",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-10",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/profiles/profile-10.png",
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
    "brand": "geniet",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-11",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/profiles/profile-11.png",
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
    "brand": "geniet",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-12",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/profiles/profile-12.png",
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
    "brand": "geniet",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-default",
    "inlineRef": "@nudge-design/assets/files/brand/geniet/profiles/profile-default.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "geniet",
      "profiles",
      "profile",
      "default"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/circle-icons",
    "id": "bubbles-blue",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/circle-icons/bubbles-blue.png",
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
      "blue"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/circle-icons",
    "id": "bubbles-white",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/circle-icons/bubbles-white.png",
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
      "white"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/circle-icons",
    "id": "location-white",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/circle-icons/location-white.png",
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
      "white"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/circle-icons",
    "id": "notice-blue",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/circle-icons/notice-blue.png",
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
      "blue"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/circle-icons",
    "id": "search-white",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/circle-icons/search-white.png",
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
      "white"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/consult",
    "id": "calendar",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/consult/calendar.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "consult",
      "calendar"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/consult",
    "id": "inquiry-form",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/consult/inquiry-form.png",
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
      "form"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/consult",
    "id": "sentence-test",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/consult/sentence-test.png",
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
      "test"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/gift",
    "id": "cafe",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/gift/cafe.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "gift",
      "cafe"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/gift",
    "id": "culture",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/gift/culture.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "gift",
      "culture"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/gift",
    "id": "market",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/gift/market.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "gift",
      "market"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/gift",
    "id": "pizza",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/gift/pizza.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "gift",
      "pizza"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/gift",
    "id": "shoppingcart",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/gift/shoppingcart.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "gift",
      "shoppingcart"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/menu-app",
    "id": "chat",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/menu-app/chat.png",
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
      "chat"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/menu-app",
    "id": "counseling",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/menu-app/counseling.png",
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
      "counseling"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/menu-app",
    "id": "courthouse",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/menu-app/courthouse.png",
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
      "courthouse"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/menu-app",
    "id": "emotion",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/menu-app/emotion.png",
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
      "emotion"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/menu-app",
    "id": "life",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/menu-app/life.png",
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
      "life"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/menu-app",
    "id": "location",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/menu-app/location.png",
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
      "location"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/menu-app",
    "id": "one-to-one",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/menu-app/one-to-one.png",
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
      "to"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/menu-app",
    "id": "routine",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/menu-app/routine.png",
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
      "routine"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/menu-app",
    "id": "sound-therapy",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/menu-app/sound-therapy.png",
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
      "therapy"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/menu-web",
    "id": "bubbles-default",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/menu-web/bubbles-default.png",
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
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/menu-web",
    "id": "bubbles-selected",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/menu-web/bubbles-selected.png",
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
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/menu-web",
    "id": "challenge-default",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/menu-web/challenge-default.png",
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
      "default"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/menu-web",
    "id": "challenge-selected",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/menu-web/challenge-selected.png",
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
      "selected"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/menu-web",
    "id": "eap-default",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/menu-web/eap-default.png",
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
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/menu-web",
    "id": "eap-selected",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/menu-web/eap-selected.png",
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
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/menu-web",
    "id": "life-default",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/menu-web/life-default.png",
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
      "default"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/menu-web",
    "id": "life-selected",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/menu-web/life-selected.png",
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
      "selected"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/psych-tests",
    "id": "depression",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/psych-tests/depression.png",
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
      "depression"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/psych-tests",
    "id": "dsi",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/psych-tests/dsi.png",
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
      "dsi"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/psych-tests",
    "id": "finance",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/psych-tests/finance.png",
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
      "finance"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/psych-tests",
    "id": "happy",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/psych-tests/happy.png",
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
      "happy"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/psych-tests",
    "id": "job-stress",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/psych-tests/job-stress.png",
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
      "stress"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/psych-tests",
    "id": "koss",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/psych-tests/koss.png",
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
      "koss"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/psych-tests",
    "id": "love",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/psych-tests/love.png",
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
      "love"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/psych-tests",
    "id": "marriage",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/psych-tests/marriage.png",
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
      "marriage"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/psych-tests",
    "id": "mbti",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/psych-tests/mbti.png",
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
      "mbti"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/psych-tests",
    "id": "personality",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/psych-tests/personality.png",
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
      "personality"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/psych-tests",
    "id": "psych",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/psych-tests/psych.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "psych",
      "tests"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/psych-tests",
    "id": "selfesteem",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/psych-tests/selfesteem.png",
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
      "selfesteem"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/rank",
    "id": "rank-01",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/rank/rank-01.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "rank",
      "01"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/rank",
    "id": "rank-02",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/rank/rank-02.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "rank",
      "02"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/rank",
    "id": "rank-03",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/rank/rank-03.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "nudge",
      "eap",
      "images",
      "rank",
      "03"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/three-d",
    "id": "shopping",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/three-d/shopping.png",
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
      "shopping"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "images/three-d",
    "id": "walkranking",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/images/three-d/walkranking.png",
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
      "walkranking"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "logos",
    "id": "dain-logo",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/logos/dain-logo.svg",
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
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "logos",
    "id": "nudge-eap-en",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/logos/nudge-eap-en.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "nudge",
      "eap",
      "logos",
      "en"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "logos",
    "id": "nudge-eap-en-dark",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/logos/nudge-eap-en-dark.svg",
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
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "logos",
    "id": "nudge-eap-ko",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/logos/nudge-eap-ko.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "nudge",
      "eap",
      "logos",
      "ko"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "logos",
    "id": "nudge-eap-koen",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/logos/nudge-eap-koen.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "nudge",
      "eap",
      "logos",
      "koen"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "logos",
    "id": "nudge-eap-logo",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/logos/nudge-eap-logo.png",
    "mimeType": "image/png",
    "search": [
      "nudge",
      "eap",
      "logos",
      "logo"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "logos",
    "id": "nudge-eap-logo",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/logos/nudge-eap-logo.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "nudge",
      "eap",
      "logos",
      "logo"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "logos",
    "id": "nudge-eap-logo-footer",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/logos/nudge-eap-logo-footer.png",
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
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "logos",
    "id": "nudge-eap-symbol",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/logos/nudge-eap-symbol.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "nudge",
      "eap",
      "logos",
      "symbol"
    ]
  },
  {
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "profiles",
    "id": "client-default",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/profiles/client-default.png",
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
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "profiles",
    "id": "counselor-01",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/profiles/counselor-01.png",
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
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "profiles",
    "id": "counselor-02",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/profiles/counselor-02.png",
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
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "profiles",
    "id": "counselor-03",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/profiles/counselor-03.png",
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
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "profiles",
    "id": "counselor-default",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/profiles/counselor-default.png",
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
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "profiles",
    "id": "user-01",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/profiles/user-01.png",
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
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "profiles",
    "id": "user-02",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/profiles/user-02.png",
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
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "profiles",
    "id": "user-03",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/profiles/user-03.png",
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
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "profiles",
    "id": "user-04",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/profiles/user-04.png",
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
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "profiles",
    "id": "user-05",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/profiles/user-05.png",
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
    "brand": "nudge-eap",
    "scope": "brand",
    "category": "profiles",
    "id": "user-default",
    "inlineRef": "@nudge-design/assets/files/brand/nudge-eap/profiles/user-default.png",
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
    "brand": "runmile",
    "scope": "brand",
    "category": "illustrations",
    "id": "alram",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/illustrations/alram.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "illustrations",
      "alram"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "illustrations",
    "id": "chatting-default",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/illustrations/chatting-default.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "illustrations",
      "chatting",
      "default"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "illustrations",
    "id": "chatting-white",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/illustrations/chatting-white.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "illustrations",
      "chatting",
      "white"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "illustrations",
    "id": "community",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/illustrations/community.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "illustrations",
      "community"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "illustrations",
    "id": "error",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/illustrations/error.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "illustrations",
      "error"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "illustrations",
    "id": "no-result-default",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/illustrations/no-result-default.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "illustrations",
      "no",
      "result",
      "default"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "illustrations",
    "id": "no-result-white",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/illustrations/no-result-white.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "illustrations",
      "no",
      "result",
      "white"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "illustrations",
    "id": "page-error",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/illustrations/page-error.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "illustrations",
      "page",
      "error"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "illustrations",
    "id": "qa",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/illustrations/qa.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "illustrations",
      "qa"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "illustrations",
    "id": "shoe",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/illustrations/shoe.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "illustrations",
      "shoe"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "logos",
    "id": "runmile-logo",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/logos/runmile-logo.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "runmile",
      "logos",
      "logo"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "logos",
    "id": "runmile-logo-black",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/logos/runmile-logo-black.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "runmile",
      "logos",
      "logo",
      "black"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "logos",
    "id": "runmile-logo-gray700",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/logos/runmile-logo-gray700.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "runmile",
      "logos",
      "logo",
      "gray700"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "marathon-events",
    "id": "animal-run",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/marathon-events/animal-run.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "runmile",
      "marathon",
      "events",
      "animal",
      "run"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "marathon-events",
    "id": "bomkkot-run",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/marathon-events/bomkkot-run.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "runmile",
      "marathon",
      "events",
      "bomkkot",
      "run"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "marathon-events",
    "id": "dangdangi-race",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/marathon-events/dangdangi-race.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "runmile",
      "marathon",
      "events",
      "dangdangi",
      "race"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "marathon-events",
    "id": "error",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/marathon-events/error.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "runmile",
      "marathon",
      "events",
      "error"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "marathon-events",
    "id": "gaenari-run",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/marathon-events/gaenari-run.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "runmile",
      "marathon",
      "events",
      "gaenari",
      "run"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "marathon-events",
    "id": "hangang-night-run",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/marathon-events/hangang-night-run.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "runmile",
      "marathon",
      "events",
      "hangang",
      "night",
      "run"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "marathon-events",
    "id": "pokemon-run",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/marathon-events/pokemon-run.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "runmile",
      "marathon",
      "events",
      "pokemon",
      "run"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "marathon-events",
    "id": "santa-claus-run",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/marathon-events/santa-claus-run.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "runmile",
      "marathon",
      "events",
      "santa",
      "claus",
      "run"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "marathon-events",
    "id": "seokchon-night-run",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/marathon-events/seokchon-night-run.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "runmile",
      "marathon",
      "events",
      "seokchon",
      "night",
      "run"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "marathon-events",
    "id": "shinhan-donghaeng-run",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/marathon-events/shinhan-donghaeng-run.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "runmile",
      "marathon",
      "events",
      "shinhan",
      "donghaeng",
      "run"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "marathon-events",
    "id": "yeontan-run",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/marathon-events/yeontan-run.png",
    "mimeType": "image/png",
    "retina": [
      "3x"
    ],
    "search": [
      "runmile",
      "marathon",
      "events",
      "yeontan",
      "run"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-1",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/profiles/profile-1.jpg",
    "mimeType": "image/jpeg",
    "search": [
      "runmile",
      "profiles",
      "profile",
      "1"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-10",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/profiles/profile-10.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "profiles",
      "profile",
      "10"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-11",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/profiles/profile-11.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "profiles",
      "profile",
      "11"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-12",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/profiles/profile-12.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "profiles",
      "profile",
      "12"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-2",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/profiles/profile-2.jpg",
    "mimeType": "image/jpeg",
    "search": [
      "runmile",
      "profiles",
      "profile",
      "2"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-3",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/profiles/profile-3.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "profiles",
      "profile",
      "3"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-4",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/profiles/profile-4.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "profiles",
      "profile",
      "4"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-5",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/profiles/profile-5.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "profiles",
      "profile",
      "5"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-6",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/profiles/profile-6.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "profiles",
      "profile",
      "6"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-7",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/profiles/profile-7.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "profiles",
      "profile",
      "7"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-8",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/profiles/profile-8.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "profiles",
      "profile",
      "8"
    ]
  },
  {
    "brand": "runmile",
    "scope": "brand",
    "category": "profiles",
    "id": "profile-9",
    "inlineRef": "@nudge-design/assets/files/brand/runmile/profiles/profile-9.png",
    "mimeType": "image/png",
    "search": [
      "runmile",
      "profiles",
      "profile",
      "9"
    ]
  },
  {
    "brand": "shared",
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
      "black"
    ]
  },
  {
    "brand": "shared",
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
      "white"
    ]
  },
  {
    "brand": "shared",
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
      "main"
    ]
  },
  {
    "brand": "shared",
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
      "white"
    ]
  },
  {
    "brand": "shared",
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
      "black"
    ]
  },
  {
    "brand": "shared",
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
      "main"
    ]
  },
  {
    "brand": "shared",
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
      "main"
    ]
  },
  {
    "brand": "shared",
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
      "white"
    ]
  },
  {
    "brand": "trost",
    "scope": "brand",
    "category": "logos",
    "id": "trost-logo",
    "inlineRef": "@nudge-design/assets/files/brand/trost/logos/trost-logo.svg",
    "mimeType": "image/svg+xml",
    "search": [
      "trost",
      "logos",
      "logo"
    ]
  },
  {
    "brand": "trost",
    "scope": "brand",
    "category": "logos",
    "id": "trost-logo-mobile",
    "inlineRef": "@nudge-design/assets/files/brand/trost/logos/trost-logo-mobile.webp",
    "mimeType": "image/webp",
    "search": [
      "trost",
      "logos",
      "logo",
      "mobile"
    ]
  }
];

/** 브랜드 → 카테고리 → 에셋 수 요약. */
export const ASSET_CATALOG_SUMMARY: Record<string, Record<string, number>> = {
  "cashwalk-biz": {
    "illustrations": 1,
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
    "illustrations": 10,
    "logos": 3,
    "marathon-events": 11,
    "profiles": 12
  },
  "shared": {
    "sns-logos": 8
  },
  "trost": {
    "logos": 2
  }
};
