/**
 * 토큰 메타 (설명·사용 태그) — 코드 SSOT. 색/값이 아니라 **사람을 위한 라벨**.
 * Figma 가이드(get_screenshot 손작업 컬러가이드)의 패밀리 설명·카테고리 설명을 코드에서 emit 해
 * 플러그인이 자동 표시하게 한다. generate-next.cjs 가 figma-variables.json 의 `meta` 로 포함.
 *
 * ⚠ 디자이너 편집 지점 — 값(색)은 토큰 정의가 SSOT, **설명/태그는 이 파일이 SSOT**.
 * 색 정체성·카테고리 의미·컬렉션 스코핑만 채워둠. 실제 사용처/브랜드 가이드 문구는 여기서 보강.
 */

/** primitive 컬렉션 = 브랜드 스코핑(이름엔 브랜드 안 넣고 컬렉션이 담당). */
export const collectionNotes: Record<string, string> = {
  core: "공통 — 모든 프로젝트가 공유하는 기본 램프",
  trost: "Trost 전용 팔레트",
  geniet: "Geniet 전용 팔레트",
  "cashwalk-biz": "CashwalkBiz 전용 팔레트",
  runmile: "Runmile 전용 팔레트",
};

/** atomic 패밀리 색 정체성(브랜드 무관 이름). 사용처 문구는 designer 보강. */
export const familyNotes: Record<string, { desc: string; tags?: string[] }> = {
  neutral: { desc: "중립 그레이 (텍스트·보더·배경 기본)" },
  coolGray: { desc: "차가운 그레이" },
  blue: { desc: "블루" },
  magenta: { desc: "마젠타" },
  red: { desc: "레드 (오렌지레드)" },
  coralRed: { desc: "코랄 레드" },
  green: { desc: "그린" },
  amber: { desc: "앰버" },
  yellow: { desc: "옐로우" },
  mint: { desc: "민트" },
  cobalt: { desc: "코발트 (포인트/포커스)" },
  pink: { desc: "핑크" },
  purple: { desc: "퍼플" },
  gray: { desc: "그레이" },
  orange: { desc: "오렌지" },
  brown: { desc: "브라운 (로고)" },
  common: { desc: "공통 흑·백" },
  status: { desc: "상태색 alias (error/success/info/caution)" },
};

/** semantic 카테고리 의미. */
export const semanticCategoryNotes: Record<string, string> = {
  bg: "배경 — 페이지·서피스·섹션·브랜드·상태",
  text: "텍스트 — 강도(strong→disabled)·브랜드·상태",
  icon: "아이콘 색",
  border: "테두리 — 기본·강조·포커스·상태",
  fill: "채움 — 브랜드·중립·상태",
  "button-bg": "버튼 배경 (primary·secondary·outlined·neutral)",
  "button-text": "버튼 텍스트",
  "button-border": "버튼 테두리",
  input: "입력 필드 — 배경·보더·헬퍼텍스트·플레이스홀더",
  "confirm-cta": "모달/팝업 확인(주 액션) 버튼",
};

/** Semantic 표 컬럼 헤더용 브랜드 표시명 (한글). 코드 mode 키 → 표시명. */
export const brandLabels: Record<string, string> = {
  "nudge-eap": "넛지EAP",
  "cashwalk-biz": "캐포비",
  cashwalk: "캐시워크",
  geniet: "geniet",
  runmile: "runmile",
  trost: "trost",
};

export const tokenMeta = {
  collections: collectionNotes,
  families: familyNotes,
  semanticCategories: semanticCategoryNotes,
  brandLabels,
};
