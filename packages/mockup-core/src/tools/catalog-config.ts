/**
 * tools/catalog-config.ts — catalog.json → HTML validator 부트스트랩.
 *
 * `validateHtmlMockup` / `validateHtmlSource` 는 `configureHtmlValidator` 로
 * 토큰/nds-* 태그/클래스 prefix/attr enum 셋이 주입되기 전엔 violation 을 0개로
 * 조용히 통과시킨다. MCP 서버는 server.ts 에서 이 셋업을 인라인으로 했지만,
 * 데스크탑 하네스도 동일 catalog 로 validator 를 부트스트랩해야 하므로 그 도출
 * 로직을 여기로 끌어내 SSOT 로 둔다.
 *
 * mockup(React/TSX) validator 의 셋업은 MCP 전용(`inspector-installer` 의존)이라
 * 여기서 다루지 않는다 — 하네스 MVP 는 html intent 만 hard gate 로 강제한다.
 */
import { configureHtmlValidator } from "./html-validator.js";

/** catalog.json 에서 validator 부트스트랩에 필요한 최소 형태. */
export interface ValidatorCatalogInput {
  components: Array<{ name: string }>;
  tokens: Array<{ name: string }>;
  ndsHtmlTags?: string[];
  ndsHtmlElements?: Array<{ tag: string; attrs: Record<string, string[]> }>;
}

/**
 * manifest.components 에 없지만 stylesheet 가 제공하는 layout primitive 클래스 prefix.
 * validator 가 unknown-nds-class 로 잘못 잡지 않게 명시 추가. (server.ts 와 동일)
 */
const EXTRA_CLASS_PREFIXES = ["nds-shell", "nds-section", "nds-form-row"];

/**
 * manifest.ndsHtmlTags 외에 런타임에서 쓰이지만 카탈로그 누락이 잦은 태그들.
 * (server.ts 의 인라인 보강 목록과 동일하게 유지.)
 */
const EXTRA_NDS_TAGS = [
  "nds-select-option",
  "nds-footer-info",
  "nds-footer-tab-bar",
  "nds-footer-tab-item",
  "nds-footer-company-info",
  "nds-footer-web",
  "nds-footer-web-row",
  "nds-footer-web-section",
];

/** catalog → HtmlValidationContext 도출. (configureHtmlValidator 호출 전 단계 분리 — 테스트 용이) */
export function deriveHtmlValidationContext(catalog: ValidatorCatalogInput) {
  const tokenSet = new Set(catalog.tokens.map((t) => t.name));

  const ndsTagSet = new Set(catalog.ndsHtmlTags ?? []);
  for (const tag of EXTRA_NDS_TAGS) ndsTagSet.add(tag);

  // React 컴포넌트 이름 → BEM-ish 베이스 클래스 prefix.
  // "Button" → "nds-button", "IconButton" → "nds-icon-button".
  const ndsClassPrefixSet = new Set<string>();
  for (const c of catalog.components) {
    const kebab = c.name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    ndsClassPrefixSet.add(`nds-${kebab}`);
  }
  for (const prefix of EXTRA_CLASS_PREFIXES) ndsClassPrefixSet.add(prefix);

  const ndsAttrEnums = new Map<string, Map<string, string[]>>();
  for (const el of catalog.ndsHtmlElements ?? []) {
    const attrMap = new Map<string, string[]>();
    for (const [k, v] of Object.entries(el.attrs)) attrMap.set(k, v);
    if (attrMap.size > 0) ndsAttrEnums.set(el.tag, attrMap);
  }

  return { tokenSet, ndsTagSet, ndsClassPrefixSet, ndsAttrEnums };
}

/**
 * catalog 로 HTML validator 를 부트스트랩한다. 데스크탑 main 시작 시 1회 호출.
 * 빈/누락 catalog 는 호출측에서 하드 어서션으로 막아야 한다 (validator 가 조용히 0개로
 * 통과하는 사고 방지).
 */
export function configureValidatorFromCatalog(catalog: ValidatorCatalogInput): void {
  configureHtmlValidator(deriveHtmlValidationContext(catalog));
}
