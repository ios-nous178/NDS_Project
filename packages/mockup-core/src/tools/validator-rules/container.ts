/**
 * 컨테이너 룰 그룹 — html-validator.ts(오케스트레이터)에서 순수 이동(pure-move).
 * Card / Footer / 영역별 CTA / 브랜드 모달 정책 검사.
 */
import * as cheerio from "cheerio";
import { getBrandProfile } from "@nudge-design/tokens/brand-profiles";
import { canonicalBrandSlug } from "../standalone-assets.js";
import {
  type DomElement,
  type HtmlViolation,
  describeElement,
  isPrimarySolidButton,
  lineNumberAt,
} from "./types.js";

/**
 * Card / Footer / 영역별 CTA — cheerio 후손 검색으로 컨테이너 안 카운트.
 *  - nested-card                : <nds-card> 후손에 <nds-card>
 *  - card-badge-overuse         : 1 카드 안 chip+badge ≥ 3
 *  - card-footer-button-overuse : nds-card-footer 안 button ≥ 3
 *  - primary-cta-per-container  : 영역 (Card / section / Modal / BottomSheet / Drawer) 안 primary solid nds-button > 1
 */
export function collectContainerViolations(
  source: string,
  $: cheerio.CheerioAPI,
  out: HtmlViolation[],
): void {
  // Card 단위 검사
  $("nds-card").each((_i, el) => {
    if (el.type !== "tag") return;
    const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
    const line = lineNumberAt(source, offset);
    const selector = describeElement(el);
    const $el = $(el);

    const nestedCount = $el.find("nds-card").length;
    if (nestedCount > 0) {
      out.push({
        rule: "nested-card",
        line,
        selector,
        detail: `nds-card 안에 nds-card 가 ${nestedCount}회 중첩됨.`,
        suggestion:
          "Card 안에 Card 중첩 금지 — 시각 레이어가 깊어지면 정보 계층이 무너짐. 내부 구획은 Divider 또는 surface 배경으로 구분. get_guide({ topic: 'component:Card' }) 참조.",
      });
    }

    const chipCount = $el.find("nds-chip").length;
    const badgeCount = $el.find("nds-badge").length;
    const labelTotal = chipCount + badgeCount;
    if (labelTotal >= 3) {
      out.push({
        rule: "card-badge-overuse",
        line,
        selector,
        detail: `Card 1개에 Badge/Chip 이 ${labelTotal}개 (Chip=${chipCount}, Badge=${badgeCount}).`,
        suggestion:
          "Card 당 Badge/Chip 최대 2개 — 가장 중요한 상태만 남기고 나머지는 Footer 메타텍스트로 처리. get_guide({ topic: 'component:Card' }) 참조.",
      });
    }
  });

  // Card Footer — Button 과다
  $("nds-card-footer").each((_i, el) => {
    if (el.type !== "tag") return;
    const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
    const line = lineNumberAt(source, offset);
    const selector = describeElement(el);
    const buttonCount = $(el).find("nds-button").length;
    if (buttonCount >= 3) {
      out.push({
        rule: "card-footer-button-overuse",
        line,
        selector,
        detail: `nds-card-footer 안에 nds-button 이 ${buttonCount}개.`,
        suggestion:
          "Card Footer 는 Primary 1개 + Secondary 1개까지. 더 필요하면 Modal/BottomSheet 형태 검토. get_guide({ topic: 'component:Card' }) 참조.",
      });
    }
  });

  // 영역별 Primary CTA 단일성
  const ctaContainers: Array<{ selector: string; label: string }> = [
    { selector: "nds-card", label: "nds-card" },
    { selector: "section", label: "<section>" },
    { selector: "nds-modal", label: "nds-modal" },
    { selector: "nds-bottom-sheet", label: "nds-bottom-sheet" },
    { selector: "nds-drawer", label: "nds-drawer" },
    { selector: "dialog, [role='dialog']", label: "dialog" },
  ];
  for (const { selector: sel, label } of ctaContainers) {
    $(sel).each((_i, el) => {
      if (el.type !== "tag") return;
      const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
      const line = lineNumberAt(source, offset);
      const elementSelector = describeElement(el);
      const primarySolid = $(el)
        .find("nds-button")
        .toArray()
        .filter((b) => isPrimarySolidButton(b as unknown as DomElement));
      if (primarySolid.length > 1) {
        out.push({
          rule: "primary-cta-per-container",
          line,
          selector: elementSelector,
          detail: `${label} 1개 안에 primary solid nds-button 이 ${primarySolid.length}개.`,
          suggestion: `한 영역(${label}) 안 Primary Button 은 최대 1개. 보조 액션은 variant="outlined" / color="neutral" / variant="text" 로 낮추세요. get_guide({ topic: 'pattern:cta-group' }) 참조.`,
        });
      }
    });
  }

  // 모달 정책 — 브랜드 프로필 modal.* 선언에 따라 발화(현재 선언 브랜드 = cashwalk-biz).
  const modalBrand = canonicalBrandSlug(
    $("html").attr("data-brand") ?? $("body").attr("data-brand"),
  );
  const modalPolicy = getBrandProfile(modalBrand)?.modal;
  if (modalPolicy) {
    // 단일 버튼 모달 = 우측 정렬 hug 검정 pill — full-width 아님 (modal.singleButtonLayout="hug-right").
    // 흔한 회귀: 버튼 1개인데 full-width 로 깔림(다른 화면의 full-width 적용 버튼을 잘못 가져옴).
    if (modalPolicy.singleButtonLayout === "hug-right")
      $("nds-modal").each((_i, el) => {
        if (el.type !== "tag") return;
        const $el = $(el);
        const footerBtns = $el
          .find('[slot="footer"] nds-button, nds-modal-footer nds-button')
          .toArray();
        // 슬롯 footer 가 없으면(=버튼을 본문에 직접 둔 경우 포함) 모달 내 전체 버튼으로 폴백.
        const buttons = (footerBtns.length
          ? footerBtns
          : $el.find("nds-button").toArray()) as unknown as DomElement[];
        // 단일 버튼 모달에만 적용 — 2개(취소+확정)는 가로 분할이 정상.
        if (buttons.length !== 1) return;
        if (buttons[0].attribs?.["full-width"] === undefined) return;
        const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
        out.push({
          rule: "brand-modal-single-button-fullwidth",
          line: lineNumberAt(source, offset),
          selector: describeElement(el as unknown as DomElement),
          detail: "캐포비 모달의 단일 버튼에 full-width 가 붙음.",
          suggestion:
            "캐포비(cashwalk-biz) 단일 버튼 모달은 우측 정렬 + hug 너비 검정 pill 입니다 — full-width 아님. <nds-button> 에서 full-width 를 제거하고 <div slot=\"footer\"> 로 감싸면 footer cascade 가 우측 hug 로 정렬합니다(버튼 2개일 때만 가로 분할). get_guide({ topic: 'component:Modal', brand: 'cashwalk-biz' }) 참조.",
        });
      });

    // 확인/팝업 모달의 주 action 은 검정 CTA(color="neutral") — primary(노랑) 금지
    //   (modal.confirmCtaColor="neutral" 선언 브랜드만).
    //   근본 원인: <nds-button>/Button 은 color 생략 시 기본값이 primary(노랑)라, 모달 footer 버튼에
    //   color 를 안 적으면 자동으로 노랑이 된다(가이드는 neutral 이라고만 말하고 기본값은 노랑 →
    //   5회+ 재발). isPrimarySolidButton = color 가 primary 이거나 생략(=기본 primary)인 solid 버튼.
    //   예외: 선택/피커(⑥)·데이터로더(⑦) 등 대형 모달은 본문 풀폭 옐로우 '적용'이 정상 → 면제.
    if (modalPolicy.confirmCtaColor === "neutral")
      $("nds-modal").each((_i, el) => {
        if (el.type !== "tag") return;
        const $el = $(el);
        // 대형 선택/데이터 모달 면제 (옐로우 '적용' CTA 가 정상인 모달들)
        const maxW = Number($el.attr("max-width") ?? $el.attr("maxwidth") ?? "0");
        const isLargeDataModal =
          $el.find("nds-data-table, nds-selected-items-panel").length > 0 || maxW >= 720;
        if (isLargeDataModal) return;

        const footerBtns = $el
          .find('[slot="footer"] nds-button, nds-modal-footer nds-button')
          .toArray();
        const buttons = (footerBtns.length
          ? footerBtns
          : $el.find("nds-button").toArray()) as unknown as DomElement[];

        buttons.forEach((btn) => {
          if (!isPrimarySolidButton(btn)) return; // primary 이거나 color 생략(=기본 primary) solid 만
          const offset = (btn as unknown as { startIndex?: number }).startIndex ?? 0;
          const omitted = !(btn.attribs ?? {}).color;
          out.push({
            rule: "brand-modal-confirm-cta",
            line: lineNumberAt(source, offset),
            selector: describeElement(btn),
            detail: omitted
              ? "캐포비 확인/팝업 모달의 주 action 버튼에 color 가 생략됨 — Button 기본값이 primary(노랑)라 자동으로 노랑 CTA 가 됩니다."
              : '캐포비 확인/팝업 모달의 주 action 버튼이 color="primary"(노랑) 입니다.',
            suggestion:
              '캐포비 확인/팝업 모달의 주 action(확인/적용/완료/만들기)은 브랜드 시그니처 검정 CTA — color="neutral" variant="solid" shape="pill" 을 명시하세요(예: <nds-button color="neutral" variant="solid" shape="pill">비즈니스 그룹 만들기</nds-button>). color 를 생략하면 기본값 primary(노랑)로 떨어집니다. 본문 풀폭 옐로우 적용 버튼이 정상인 곳은 선택/데이터 모달뿐(max-width 720+). get_guide({ topic: \'component:Modal\', brand: \'cashwalk-biz\' }) 참조.',
          });
        });
      });

    // 모달 footer 두 버튼은 항상 가로 — 세로 스택 금지(라벨 축약 방향) (modal.footerStackBanned).
    if (modalPolicy.footerStackBanned)
      $("nds-modal").each((_i, el) => {
        if (el.type !== "tag") return;
        const $el = $(el);
        const $footer = $el.find('[slot="footer"], nds-modal-footer').first();
        if ($footer.length === 0) return;
        const btnCount = $footer.find("nds-button").length;
        if (btnCount < 2) return;
        const footerStyle = ($footer.attr("style") ?? "").toLowerCase();
        const layout = (
          $el.attr("actions-layout") ??
          $el.attr("actionslayout") ??
          ""
        ).toLowerCase();
        const stacked =
          /flex-direction\s*:\s*column/.test(footerStyle) ||
          layout === "stack" ||
          layout === "vertical" ||
          layout === "column";
        if (!stacked) return;
        const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
        out.push({
          rule: "brand-modal-footer-stacked",
          line: lineNumberAt(source, offset),
          selector: describeElement(el as unknown as DomElement),
          detail: "모달 footer 의 두 버튼이 세로로 스택되어 있습니다.",
          suggestion:
            "모달/팝업의 두 버튼은 항상 가로 정렬을 유지하세요. 라벨이 길어 가로로 안 들어가면 세로 스택이 아니라 **라벨 텍스트를 축약**하는 방향으로(예: '비즈니스 그룹 만들기'→'그룹 만들기', '나중에 다시 하기'→'나중에'). flex-direction:column / actions-layout=\"stack\" 을 제거하고 캐포비 기본(우측 hug) 또는 split(가로 분할)을 쓰세요. get_guide({ topic: 'pattern:cta-group' }) 참조.",
        });
      });
  }
}
