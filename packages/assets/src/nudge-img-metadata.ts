/**
 * NudgeEAP "IMG" 화면 자산 메타데이터 (dataUri 제외).
 *
 * NudgeEAP Dev Figma (file `mvecozaRQoGRePffskRgmh`, section 20:1699 "img") 의
 * 화면용 이미지 자산 58종 · 8 카테고리:
 *   - psych-tests   (12) 심리검사 진입 아이콘   (frame 20:1700 IMG/test)
 *   - menu-app       (9) 앱 메뉴 진입점         (frame 20:1839 IMG/MenuApp)
 *   - menu-web       (8) 웹 메뉴 (default/selected) (frame 20:2265 IMG/MenuWeb)
 *   - circle-icons   (5) 원형 뱃지 아이콘        (frame 20:1944 IMG/Circle)
 *   - consult        (3) 상담탭 아이콘          (frame 20:1994 IMG/consult)
 *   - gift           (5) 기프트 카테고리        (frame 20:2354 IMG/gift)
 *   - 3d             (2) 3D 일러스트            (frame 20:2126 IMG/3d)
 *   - rank           (3) 랭킹 메달 1·2·3위      (frame 20:2219 IMG/rank)
 *   - eap-profiles  (11) user/client/counselor 프로필 (frame 20:2151 IMG/profile)
 *
 * 로고(IMG/logo, 20:2035)는 의도적으로 제외 — 별도 가이드.
 *
 * **해상도**: 2x(base) + 3x(`@3x`) PNG — marathon-events 와 동일 컨벤션.
 * 디자이너가 Figma Export(PNG 2x/3x)로 내보낸 원본이라 합성 컴포넌트
 * (CSS 사각형 · 마스크 · 회전 · 라이브 텍스트)까지 픽셀퍼펙트. base 는
 * 노드 native 의 2x (대부분 128×128, profiles 120, rank 80, 3d 198×148),
 * `filename3x` 는 3x. `srcset="… 2x, …@3x 3x"` 로 사용.
 *
 * raster PNG 라 dataUri 미제공 — 파일 호스팅 필수.
 * 외부 소비자는 `@nudge-design/assets/files/{filename}` 로 참조.
 */

export type NudgeImgCategory =
  | "psych-tests"
  | "menu-app"
  | "menu-web"
  | "circle-icons"
  | "consult"
  | "gift"
  | "3d"
  | "rank"
  | "eap-profiles";

export interface NudgeImgMeta {
  /** 카테고리 (src 디렉토리명과 1:1). */
  category: NudgeImgCategory;
  /** 카테고리 내 식별자 (kebab-case, 파일명 stem). */
  id: string;
  /** `files/{category}/{id}.png` — base(2x) 호스팅 경로. */
  filename: string;
  /** `files/{category}/{id}@3x.png` — 3x (고밀도, srcset 용). */
  filename3x: string;
  mimeType: "image/png";
  /** Figma 노드 id. */
  figmaNodeId: string;
  /** 원본 Figma 노드 이름 (variant 표기 포함, 디자이너 소통용). */
  figmaNodeName: string;
}

function meta(
  category: NudgeImgCategory,
  id: string,
  figmaNodeId: string,
  figmaNodeName: string,
): NudgeImgMeta {
  return {
    category,
    id,
    filename: `${category}/${id}.png`,
    filename3x: `${category}/${id}@3x.png`,
    mimeType: "image/png",
    figmaNodeId,
    figmaNodeName,
  };
}

export const NUDGE_IMG_METADATA: readonly NudgeImgMeta[] = [
  // ── psych-tests (심리검사) ──────────────────────────────────────────
  meta("psych-tests", "psych", "20:1701", "name=Psych"),
  meta("psych-tests", "personality", "20:1708", "name=personality"),
  meta("psych-tests", "depression", "20:1718", "name=depression"),
  meta("psych-tests", "selfesteem", "20:1726", "name=selfesteem"),
  meta("psych-tests", "mbti", "20:1736", "name=mbti"),
  meta("psych-tests", "job-stress", "20:1753", "name=jobStress"),
  meta("psych-tests", "dsi", "20:1765", "name=DSI"),
  meta("psych-tests", "koss", "20:1769", "name=KOSS"),
  meta("psych-tests", "happy", "20:1785", "name=happy"),
  meta("psych-tests", "marriage", "20:1792", "name=marriage"),
  meta("psych-tests", "love", "20:1802", "name=love"),
  meta("psych-tests", "finance", "20:1810", "name=finance"),

  // ── menu-app (앱 메뉴 진입점) ───────────────────────────────────────
  meta("menu-app", "chat", "20:1840", "type=chat"),
  meta("menu-app", "one-to-one", "20:1852", "type=1to1"),
  meta("menu-app", "location", "20:1862", "type=location"),
  meta("menu-app", "counseling", "20:1872", "counseling"),
  meta("menu-app", "sound-therapy", "20:1879", "type=SoundTherapy"),
  meta("menu-app", "emotion", "20:1890", "type=emotion"),
  meta("menu-app", "routine", "20:1900", "type=Routine"),
  meta("menu-app", "courthouse", "20:1910", "type=courthouse"),
  meta("menu-app", "life", "20:1922", "type=life"),

  // ── menu-web (웹 메뉴, default/selected) ────────────────────────────
  meta("menu-web", "life-default", "20:2266", "type=life, state=default"),
  meta("menu-web", "life-selected", "20:2288", "type=life, state=selected"),
  meta("menu-web", "bubbles-default", "20:2310", "type=bubbles, state=default"),
  meta("menu-web", "bubbles-selected", "20:2322", "type=bubbles, state=selected"),
  meta("menu-web", "eap-default", "20:2339", "type=EAP, state=default"),
  meta("menu-web", "eap-selected", "20:2334", "type=eap, state=selected"),
  meta("menu-web", "challenge-default", "20:2344", "type=challenge, state=default"),
  meta("menu-web", "challenge-selected", "20:2349", "type=challenge, state=selected"),

  // ── circle-icons (원형 뱃지) ────────────────────────────────────────
  meta("circle-icons", "bubbles-blue", "20:1945", "type=bubbles, color=blue"),
  meta("circle-icons", "notice-blue", "20:1957", "type=notice, color=blue"),
  meta("circle-icons", "bubbles-white", "20:1966", "type=bubbles, color=white"),
  meta("circle-icons", "search-white", "20:1978", "type=search, color=white"),
  meta("circle-icons", "location-white", "20:1985", "type=location, color=white"),

  // ── consult (상담탭) ────────────────────────────────────────────────
  meta("consult", "sentence-test", "20:1995", "name=SentenceTest"),
  meta("consult", "inquiry-form", "20:2012", "name=InquiryForm"),
  meta("consult", "calendar", "20:2024", "name=Calendar"),

  // ── gift (기프트) ───────────────────────────────────────────────────
  meta("gift", "cafe", "20:2355", "type=cafe"),
  meta("gift", "pizza", "20:2370", "type=pizza"),
  meta("gift", "market", "20:2396", "type=market"),
  meta("gift", "culture", "20:2413", "type=culture"),
  meta("gift", "shoppingcart", "20:2420", "type=shoppingcart"),

  // ── 3d (3D 일러스트) ────────────────────────────────────────────────
  meta("3d", "walkranking", "20:2127", "Property 1=walkranking"),
  meta("3d", "shopping", "20:2141", "Property 1=shopping"),

  // ── rank (랭킹 메달) ────────────────────────────────────────────────
  meta("rank", "rank-01", "20:2220", "Property 1=01"),
  meta("rank", "rank-02", "20:2235", "Property 1=02"),
  meta("rank", "rank-03", "20:2250", "Property 1=03"),

  // ── eap-profiles (프로필) ───────────────────────────────────────────
  meta("eap-profiles", "user-default", "20:2152", "type=user, state=default"),
  meta("eap-profiles", "user-01", "20:2160", "type=user, state=01"),
  meta("eap-profiles", "user-02", "20:2166", "type=user, state=02"),
  meta("eap-profiles", "user-03", "20:2172", "type=user, state=03"),
  meta("eap-profiles", "user-04", "20:2178", "type=user, state=04"),
  meta("eap-profiles", "user-05", "20:2184", "type=user, state=05"),
  meta("eap-profiles", "client-default", "20:2190", "type=client, state=default"),
  meta("eap-profiles", "counselor-default", "20:2196", "type=counselor, state=default"),
  meta("eap-profiles", "counselor-01", "20:2203", "type=counselor, state=01"),
  meta("eap-profiles", "counselor-02", "20:2209", "type=counselor, state=02"),
  meta("eap-profiles", "counselor-03", "20:2214", "type=counselor, state=03"),
];

export const NUDGE_IMG_CATEGORIES: readonly NudgeImgCategory[] = [
  "psych-tests",
  "menu-app",
  "menu-web",
  "circle-icons",
  "consult",
  "gift",
  "3d",
  "rank",
  "eap-profiles",
];

/** 한 자산의 메타데이터 조회 (category + id). */
export function getNudgeImg(category: NudgeImgCategory, id: string): NudgeImgMeta | undefined {
  return NUDGE_IMG_METADATA.find((m) => m.category === category && m.id === id);
}

/** 한 카테고리의 전체 자산 조회. */
export function getNudgeImgCategory(category: NudgeImgCategory): NudgeImgMeta[] {
  return NUDGE_IMG_METADATA.filter((m) => m.category === category);
}
