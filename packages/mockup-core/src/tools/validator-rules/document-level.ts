/**
 * 문서-레벨(전역 카운트) 룰 그룹 — html-validator.ts(오케스트레이터)에서 순수 이동(pure-move).
 * 전역 totals(칩/카드/CTA/헤딩/강조 장치) + 캐포비 어드민 Page Pattern scope 룰 + DS 뱃지 검사.
 */
import * as cheerio from "cheerio";
import { getBrandProfile } from "@nudge-design/tokens/brand-profiles";
import {
  type DocumentValidationScope,
  type DomElement,
  type HtmlViolation,
  describeElement,
  isPrimarySolidButton,
  lineNumberAt,
} from "./types.js";

/** 어드민 Page Pattern System 적용 scope — 브랜드 프로필(admin.pagePatternSystem)이 결정. */
function isPagePatternAdminScope(scope: DocumentValidationScope): boolean {
  return (
    scope.surface === "admin" && getBrandProfile(scope.brand)?.admin?.pagePatternSystem === true
  );
}

/**
 * 문서 전체 카운트 룰 — 전역 totals 기반.
 *  - chip-overuse / card-everything / primary-cta-overuse
 *  - repeated-h1 / repeated-h2 / bold-overuse / brand-bg-overuse / decorative-shadow
 *  - tone-on-tone-filled / visual-emphasis-overload / primary-color-role-overload
 */
export function collectDocumentLevelViolations(
  source: string,
  $: cheerio.CheerioAPI,
  out: HtmlViolation[],
  screenCount = 1,
  scope: DocumentValidationScope,
): void {
  const chipTotal = $("nds-chip").length;
  if (chipTotal > 8 * screenCount) {
    const ninth = $("nds-chip").eq(8).get(0) as DomElement | undefined;
    const line = ninth
      ? lineNumberAt(source, (ninth as unknown as { startIndex?: number }).startIndex ?? 0)
      : 1;
    out.push({
      rule: "chip-overuse",
      line,
      detail: `nds-chip 이 ${chipTotal}개 발견됨.`,
      suggestion:
        "Chip 은 상태/분류/짧은 속성에만 제한적으로. 섹션 장식이나 모든 카드 반복 강조는 피하세요. get_guide({ topic: 'component:Chip' }) 참조.",
    });
  }

  // chip-as-entry-grid (model-guard): nds-chip 을 '타일 그리드'처럼 다수 나열 = '카테고리/고민 진입'
  //   그리드를 chip 으로 잘못 만든 신호. 진입(탭→화면 전환) 그리드는 pattern:quick-action-grid
  //   (아이콘+라벨 Card 셀)이고, chip 은 폼 선택/필터값용이다. (회귀: 지니어트 건강고민 아이콘 타일을
  //   nds-chip 그리드로 바꾼 패착 — 스캔성·레이아웃 균형 상실.) 텍스트-only flex-wrap 다중선택
  //   (연령/지역/태그)은 정상이므로 '그리드 레이아웃' 또는 '아이콘 단 칩 다수' 신호로만 한정해 오탐을 줄인다.
  const ENTRY_CHIP_MIN = 6;
  const seenChipGridParents = new Set<unknown>();
  $("nds-chip").each((_i, el) => {
    const $parent = $(el).parent();
    const parentNode = $parent.get(0);
    if (!parentNode || seenChipGridParents.has(parentNode)) return;
    seenChipGridParents.add(parentNode);
    const chips = $parent.children("nds-chip");
    if (chips.length < ENTRY_CHIP_MIN) return;
    const style = ($parent.attr("style") ?? "").toLowerCase();
    const looksGrid = /grid-template|display\s*:\s*grid/.test(style);
    const iconChips = chips.filter((_j, c) => $(c).find("svg, [slot='icon']").length > 0).length;
    if (!looksGrid && iconChips < ENTRY_CHIP_MIN) return;
    out.push({
      rule: "chip-as-entry-grid",
      line: lineNumberAt(source, (parentNode as unknown as { startIndex?: number }).startIndex ?? 0),
      selector: describeElement(parentNode as unknown as DomElement),
      detail: `<nds-chip> ${chips.length}개를 ${looksGrid ? "그리드" : "아이콘 타일"}로 나열했습니다 — '카테고리/고민 진입' 그리드를 chip 으로 만든 신호일 수 있습니다.`,
      suggestion:
        "탭하면 화면이 전환되는 '카테고리/고민 진입' 그리드는 chip 이 아니라 pattern:quick-action-grid (아이콘+라벨 Card 셀 그리드)로 — 스캔성·레이아웃 균형 회복. 폼 안에서 값/필터를 고르는 선택이면 SelectChip 유지가 맞습니다. get_guide({ topic: 'pattern:quick-action-grid' }) / get_guide({ topic: 'pattern:selection-controls' }) 참조.",
    });
  });

  const isCashwalkBizAdmin = isPagePatternAdminScope(scope);

  if (isCashwalkBizAdmin) {
    // region-as-chip: 지역 경로(시/도 > 시/군/구)가 든 Chip = 캐포비 타겟팅 결과를 Chip 으로 잘못 표현한 신호.
    //   캐포비 타겟팅 폼의 '특정 지역' 결과는 SelectedItemsPanel + SelectedItemRow 로 그려야 한다 — 노란
    //   outlined 칩은 SelectionButton 과 혼동되고 '추가 선택/선택 해제'·개수 강조·개별 제거가 빠진다.
    $("nds-chip").each((_i, el) => {
      const txt = $(el).text().replace(/\s+/g, " ").trim();
      if (!/\s>\s/.test(txt)) return; // 시/도 > 시/군/구 같은 지역 경로만 — 일반 칩은 통과
      out.push({
        rule: "region-as-chip",
        line: lineNumberAt(source, (el as unknown as { startIndex?: number }).startIndex ?? 0),
        selector: describeElement(el as unknown as DomElement),
        detail: `캐포비 admin 선택 지역으로 보이는 항목("${txt.slice(0, 32)}")을 <nds-chip> 으로 표현했습니다 — 지역 경로(시/도 > 시/군/구)는 Chip 자리가 아닙니다.`,
        suggestion:
          "캐포비 admin 타겟팅의 동적 지역 선택 결과는 <nds-selected-items-panel> + <nds-selected-item-row> 로 그릴 것 (회색 패널 · '+ 추가 선택' · 개별 제거 X · 개수 강조). 노란 outlined Chip 은 SelectionButton 과 혼동됨. get_guide({ topic: 'component:SelectedItemsPanel' }). Figma 3001:49174.",
      });
    });
  }

  // amount-as-static-display: 폼 입력 필드 자리에 정적 숫자(콤마+단위)를 박은 안티패턴.
  //   대시보드 KPI 통계(정적 숫자 표시)는 정상이므로, 폼 컨텍스트(.nds-form-row / nds-form-field /
  //   .nds-form-field__root) 안에 있을 때만 잡는다. (회귀: 캐포비 '목표 참여자 수' 를 "3,000,000 명"
  //   큰 글씨로 박고 입력이 안 되던 사고.)
  $("div, span, p, strong, b, h1, h2, h3, h4").each((_i, el) => {
    const $el = $(el);
    if ($el.children().length > 0) return; // leaf 텍스트만 — 컨테이너 제외
    const txt = $el.text().replace(/\s+/g, " ").trim();
    if (!/^\d{1,3}(,\d{3})+\s*(명|원|개|건|회|회원|포인트|캐시|점)$/.test(txt)) return;
    if ($el.closest("nds-amount-input, nds-input, input, button, nds-button").length > 0) return;
    if (
      $el.closest(".nds-form-row, .nds-form-row__field, nds-form-field, .nds-form-field__root")
        .length === 0
    )
      return; // 폼 밖(대시보드 통계 등)은 통과
    out.push({
      rule: "amount-as-static-display",
      line: lineNumberAt(source, (el as unknown as { startIndex?: number }).startIndex ?? 0),
      selector: describeElement(el as unknown as DomElement),
      detail: `폼 입력 필드 자리에 정적 숫자("${txt.slice(0, 20)}")를 박았습니다 — 입력이 불가능합니다.`,
      suggestion:
        "폼에서 사용자가 입력하는 수치는 정적 텍스트가 아니라 <nds-amount-input value=... unit='명|원' placeholder='0'>(천단위 콤마·단위·clamp)로. get_guide({ topic: 'component:AmountInput', target: 'html' }) 참조.",
    });
  });

  if (isCashwalkBizAdmin) {
    // selected-item-add-affordance-duplicated: 캐포비 선택 결과 add 어포던스가 2개 이상
    //   (외부 점선 '+ 추가' 버튼 + SelectedItemsPanel '추가 선택'). 추가는 패널 onAdd 한 곳으로 통일.
    //   (회귀: 캐포비 타겟팅 폼 — 모달이 안 뜨고 중복 add UI. 현장 재발 '또 두개 노출'.)
    //   ★ 패널의 '추가 선택' 은 웹컴포넌트가 런타임에 렌더하므로 정적 텍스트엔 안 나온다 — hide-add 없는
    //     페이지 패널을 '암묵적 add 어포던스' 로 세고, nds-add-button 은 label 속성으로도 매칭한다.
    const RE_SELECTED_ITEM_ADD =
      /^\+?\s*((지역|항목|선택\s*결과)\s*추가(하기)?|추가\s*선택|선택\s*추가)$/;
    const matchesSelectedItemAdd = ($el: ReturnType<typeof $>): boolean => {
      const t = $el.text().replace(/\s+/g, " ").trim();
      const label = ($el.attr("label") ?? "").replace(/\s+/g, " ").trim();
      return RE_SELECTED_ITEM_ADD.test(t) || RE_SELECTED_ITEM_ADD.test(label);
    };
    // 패널 '밖' 의 명시 add 어포던스(별도 추가 버튼 등) — 패널 자체 add 와 별개 경로.
    const externalAdds = $("button, nds-button, nds-add-button, a, [role='button']")
      .filter(
        (_i, el) =>
          matchesSelectedItemAdd($(el)) &&
          $(el).closest("nds-selected-items-panel, .nds-selected-items-panel").length === 0,
      )
      .toArray() as unknown as DomElement[];
    // 페이지(모달 밖) 패널이 제공하는 add 경로 — hide-add 없으면 헤더 '추가 선택' 을 런타임 렌더(정적
    //   텍스트엔 안 보임), 또는 패널 안에 명시 '추가 선택' 버튼을 둠. 어느 쪽이든 add 경로 1개.
    const panelAdds = $("nds-selected-items-panel, .nds-selected-items-panel")
      .filter((_i, el) => {
        if ($(el).closest("nds-modal").length > 0) return false; // 모달 안은 hide-add 가 정답(별도 룰)
        if ($(el).attr("hide-add") === undefined) return true;
        return (
          $(el)
            .find("button, nds-button, nds-add-button, [role='button']")
            .filter((_j, b) => matchesSelectedItemAdd($(b))).length > 0
        );
      })
      .toArray() as unknown as DomElement[];
    // 발화: ① 패널 밖 명시 add 가 2개 이상, 또는 ② 패널 add 경로 + 패널 밖 별도 add 가 공존(중복).
    //   (페이지 패널 1개만 = 정답 단일 경로 → 미발화. 멀티 패널 폼도 패널 밖 add 가 없으면 미발화.)
    if (externalAdds.length >= 2 || (externalAdds.length >= 1 && panelAdds.length >= 1)) {
      const marker = externalAdds[externalAdds.length - 1] ?? externalAdds[0];
      const total = externalAdds.length + panelAdds.length;
      out.push({
        rule: "selected-item-add-affordance-duplicated",
        line: marker
          ? lineNumberAt(source, (marker as unknown as { startIndex?: number }).startIndex ?? 0)
          : 1,
        selector: marker ? describeElement(marker) : undefined,
        detail: `캐포비 admin 선택 결과 추가 어포던스가 ${total}개입니다(패널 '추가 선택'${panelAdds.length ? "(컴포넌트 렌더)" : ""} + 패널 밖 별도 추가 등) — 추가 경로가 중복됩니다.`,
        suggestion:
          "캐포비 admin 타겟팅의 추가는 SelectedItemsPanel 의 onAdd(=모달 열기) 한 곳으로 통일하세요. 패널 밖 별도 추가 버튼(nds-add-button)을 또 두지 말 것. '추가 선택' 클릭 → 2단 모달(좌: 검색+체크박스 트리, 우: SelectedItemsPanel hide-add) → 풀폭 '적용'. get_guide({ topic: 'component:SelectedItemsPanel' }) 참조.",
      });
    }
  }

  // selected-item-row-duplicated: SelectedItemsPanel 안 같은 선택 항목이 중복.
  $("nds-selected-items-panel, .nds-selected-items-panel").each((_p, panel) => {
    const seen = new Set<string>();
    $(panel)
      .find("nds-selected-item-row, .nds-selected-item-row, nds-region-row, .nds-region-row")
      .each((_r, row) => {
        const t = $(row).text().replace(/\s+/g, " ").trim();
        if (!t) return;
        if (seen.has(t)) {
          out.push({
            rule: "selected-item-row-duplicated",
            line: lineNumberAt(source, (row as unknown as { startIndex?: number }).startIndex ?? 0),
            selector: describeElement(row as unknown as DomElement),
            detail: `선택 항목 "${t.slice(0, 24)}" 이(가) 패널에 중복으로 들어 있습니다.`,
            suggestion:
              "선택 결과는 유니크해야 합니다 — 같은 항목을 두 번 추가하지 마세요(추가 시 중복 제거). get_guide({ topic: 'component:SelectedItemsPanel' }) 참조.",
          });
        }
        seen.add(t);
      });
  });

  // selected-item-row-outside-panel: nds-selected-item-row / nds-region-row 가 패널 밖 sibling 으로 떨어짐.
  //   (회귀: 추가 후 누적되는 행을 패널 body 가 아니라 패널 다음 sibling 으로 append → 패널
  //   body 의 flex gap(8)을 못 타서 행끼리 간격 없이 붙고, 회색 surface.subtle 패널 밖에 렌더된다.
  //   가이드 SelectedItemsPanel: 갱신은 body 의 selected-item-row 자식만 교체.)
  $("nds-selected-item-row, .nds-selected-item-row, nds-region-row, .nds-region-row").each(
    (_i, el) => {
      if (el.type !== "tag") return;
      if ($(el).closest("nds-selected-items-panel, .nds-selected-items-panel").length > 0) return;
      out.push({
        rule: "selected-item-row-outside-panel",
        line: lineNumberAt(source, (el as unknown as { startIndex?: number }).startIndex ?? 0),
        selector: describeElement(el as unknown as DomElement),
        detail:
          "SelectedItemRow 가 SelectedItemsPanel 밖에 있습니다 — 패널 body 의 flex gap(8)을 못 타서 행끼리 간격 없이 붙고, 회색 패널 밖에 렌더됩니다.",
        suggestion:
          "선택 항목 행은 <nds-selected-items-panel> 의 자식(body)으로 넣으세요. 항목을 추가할 때 패널 다음 sibling 으로 append 하지 말고 패널 body 안 nds-selected-item-row 자식만 교체할 것(헤더/개수는 컴포넌트 chrome). get_guide({ topic: 'component:SelectedItemsPanel' }) 참조.",
      });
    },
  );

  if (isCashwalkBizAdmin) {
    // selected-items-modal-missing-panel: 캐포비 선택 모달(시/도 + 시/군/구)인데 우측 SelectedItemsPanel 이 없음.
    //   (회귀: 캐포비 '지역 추가' 클릭 → 정답은 2단 모달[좌 검색+체크박스 트리 / 우 SelectedItemsPanel
    //   hide-add + 풀폭 '적용']인데, 단순 2컬럼 팝오버[시/도 | 시/군/구]로 작게 떠 우측 선택결과 패널이
    //   통째 빠진 채 렌더됨. dimensions.selectionModal SSOT.)
    $("nds-modal, .nds-modal").each((_i, el) => {
      if (el.type !== "tag") return;
      const $m = $(el);
      const txt = $m.text().replace(/\s+/g, " ");
      if (!(/시\/도/.test(txt) && /시\/군\/구/.test(txt))) return; // 선택 모달 시그니처
      if ($m.find("nds-selected-items-panel, .nds-selected-items-panel").length > 0) return; // 우측 패널 있으면 정답
      out.push({
        rule: "selected-items-modal-missing-panel",
        line: lineNumberAt(source, (el as unknown as { startIndex?: number }).startIndex ?? 0),
        selector: describeElement(el as unknown as DomElement),
        detail:
          "캐포비 admin 선택 모달(시/도 · 시/군/구)에 우측 SelectedItemsPanel(선택한 N개 · 선택 해제 · 제거 가능 리스트)이 없습니다 — 단순 2컬럼 팝오버로 떴습니다.",
        suggestion:
          "캐포비 admin 지역 선택은 대형 2단 모달입니다(width~960 · 2컬럼): 좌 = 검색 input + '전체 선택' + 시/도▸시/군/구 체크박스 트리(선택=옐로우 체크), 우 = <nds-selected-items-panel hide-add>(선택한 N개 + 선택 해제 + 제거 가능 SelectedItemRow), 풋터 = 풀폭 옐로우 '적용'. get_guide({ topic: 'pattern:cashwalk-biz-page-patterns' }) ⑥ 선택/피커 모달 · component:SelectedItemsPanel 참조.",
      });
    });

    // cashwalk-biz-gender-selection-control: 캐포비 타겟팅 폼의 성별 입력은
    //   SelectionButtonGroup(전체/특정) + selection chip(남성/여성/알 수 없음) 조합으로 고정.
    //   표/차트의 '성별' 텍스트는 제외하고, 폼 row/field 안 잘못된 입력 컴포넌트만 잡는다.
    $("nds-form-field, .nds-form-row, .nds-form-field__root").each((_i, el) => {
      if (el.type !== "tag") return;
      const $field = $(el);
      const txt = $field.text().replace(/\s+/g, " ");
      if (!/성별/.test(txt)) return;
      if ($field.find("nds-selection-button-group, .nds-selection-button-group").length > 0) return;
      const wrongControl = $field
        .find(
          "nds-select, nds-segmented, nds-radio-group, nds-checkbox-group, select, input[type='radio'], input[type='checkbox']",
        )
        .get(0) as DomElement | undefined;
      if (!wrongControl) return;
      out.push({
        rule: "cashwalk-biz-gender-selection-control",
        line: lineNumberAt(
          source,
          (wrongControl as unknown as { startIndex?: number }).startIndex ?? 0,
        ),
        selector: describeElement(wrongControl),
        detail:
          "캐포비 admin 성별 타겟팅 필드를 SelectionButtonGroup 없이 다른 입력 컴포넌트로 구현했습니다.",
        suggestion:
          '캐포비 admin 성별 선택은 <nds-selection-button-group options=\'[{"value":"all","label":"전체"},{"value":"custom","label":"특정 성별"}]\'> + 특정 성별일 때 <nds-chip selected interactive>남성</nds-chip> 같은 selection chip 묶음으로 구성하세요. Select/Radio/CheckboxGroup/Segmented 금지. get_guide({ topic: \'pattern:cashwalk-biz-form-layout\' }) 및 component:SelectionButtonGroup 참조.',
      });
    });
  }

  const cardTotal = $("nds-card").length;
  if (cardTotal >= 5 * screenCount) {
    out.push({
      rule: "card-everything",
      line: 1,
      detail: `한 mockup 에 nds-card 가 ${cardTotal}개 — 모든 정보 단위를 카드로 감싸는 패턴.`,
      suggestion:
        "Card 는 '독립된 정보 단위' 에만. 단순 group/section 은 spacing(--semantic-gap-loose) + heading + Divider 로 위계를 표현하세요.",
    });
  }

  // 페이지 레벨 primary solid nds-button 카운트.
  // Modal/BottomSheet/Drawer/dialog 안의 primary action은 해당 surface의 apply/confirm이라
  // 전역 "화면 CTA 1개" 규칙과 별도로 본다. 같은 surface 안 중복은
  // collectContainerViolations 의 primary-cta-per-container 가 잡는다.
  const pagePrimarySolidTotal = $("nds-button")
    .toArray()
    .filter((b) => isPrimarySolidButton(b as unknown as DomElement))
    .filter((b) => !isInsideSecondaryActionContext(b as unknown as DomElement)).length;
  if (pagePrimarySolidTotal > screenCount) {
    out.push({
      rule: "primary-cta-overuse",
      line: 1,
      detail: `페이지 레벨 primary solid nds-button 이 ${pagePrimarySolidTotal}개.`,
      suggestion:
        "페이지 primary solid 는 가장 중요한 액션 1개만. 모달/드로어 내부 확인 액션은 별도 surface CTA 로 허용되지만, 페이지의 나머지 액션은 outlined / neutral / text 계열로 낮추세요.",
    });
  }

  const h1Count = $("h1").length;
  if (h1Count > screenCount) {
    out.push({
      rule: "repeated-h1",
      line: 1,
      detail: `<h1> 이 ${h1Count}개 — 페이지 최상위 헤딩은 1개여야 합니다.`,
      suggestion: "한 mockup 에 h1 은 1개. 보조 섹션은 h3 이하 사용.",
    });
  }
  const h2Count = $("h2").length;
  if (h2Count > 3 * screenCount) {
    out.push({
      rule: "repeated-h2",
      line: 1,
      detail: `<h2> 가 ${h2Count}개 — 같은 화면에 큰 제목이 너무 많습니다.`,
      suggestion: "h2 는 화면당 2-3개 이내. 더 세분화는 h3/h4 로 표현.",
    });
  }

  // Bold 남발 — style="font-weight: bold | 700+" 카운트
  let boldCount = 0;
  $("[style]").each((_i, el) => {
    const style = ((el as unknown as DomElement).attribs?.style ?? "").trim();
    if (/font-weight\s*:\s*(?:bold|700|800|900)\b/i.test(style)) boldCount += 1;
  });
  if (boldCount >= 5 * screenCount) {
    out.push({
      rule: "bold-overuse",
      line: 1,
      detail: `Bold(700+) inline 텍스트 선언이 ${boldCount}곳.`,
      suggestion: "Bold 는 화면당 1-2개 핵심 텍스트에만. 본문은 Regular(400)/Medium(500).",
    });
  }

  // Brand BG 한 화면 1곳 — --semantic-bg-brand-default | subtle 2회 이상이면 위반
  const brandBgMatches = source.match(/var\(--semantic-bg-brand-(?:default|subtle)\)/g) ?? [];
  if (brandBgMatches.length >= 2 * screenCount) {
    out.push({
      rule: "brand-bg-overuse",
      line: 1,
      detail: `Brand background 토큰이 ${brandBgMatches.length}회 사용됨 (한 화면 최대 1곳).`,
      suggestion:
        "Brand BG 는 의미 있는 notice / 핵심 강조 1곳에만. 나머지는 var(--semantic-bg-surface*) 또는 elevated 사용.",
    });
  }

  // Decorative Shadow — inline box-shadow 4곳 이상 (focus ring 제외)
  let decorativeShadowCount = 0;
  $("[style]").each((_i, el) => {
    const style = ((el as unknown as DomElement).attribs?.style ?? "").trim();
    const shadows = style.match(/box-shadow\s*:\s*[^;]+/gi) ?? [];
    for (const s of shadows) {
      if (/var\(--shadow-/.test(s)) continue;
      if (/0\s+0\s+0\s+\d+px/.test(s)) continue; // focus ring 류
      decorativeShadowCount += 1;
    }
  });
  if (decorativeShadowCount >= 4 * screenCount) {
    out.push({
      rule: "decorative-shadow",
      line: 1,
      detail: `인라인 box-shadow 가 ${decorativeShadowCount}곳 — shadow-heavy layout.`,
      suggestion:
        "Shadow 는 floating UI(Modal/Popup/Dropdown/BottomSheet) 에만. 일반 카드/리스트는 border 또는 surface tone 으로 구분.",
    });
  }

  // tone-on-tone-filled — 연한 primary bg + 같은 톤 filled/soft chip/badge
  const lightPrimaryBgRe =
    /background(?:-color)?\s*:\s*var\(--color-(?:semantic-primary-bg|semantic-primary-bgLighter|blue-(?:10|25|50|100)|cobalt-(?:50|100))/;
  const filledChipOrBadgeRe =
    /<\s*nds-(?:chip|badge)\b[^>]*?(?:variant\s*=\s*["'](?:filled|soft)["']|style\s*=\s*["'][^"']*background(?:-color)?\s*:\s*var\(--color-(?:semantic-primary-bg|semantic-primary-bgLighter|blue-(?:10|25|50|100)|cobalt-(?:50|100)))/i;
  if (lightPrimaryBgRe.test(source) && filledChipOrBadgeRe.test(source)) {
    out.push({
      rule: "tone-on-tone-filled",
      line: 1,
      detail: "연한 primary/blue 배경과 같은 계열 filled/soft 라벨이 함께 사용됨.",
      suggestion:
        "같은 톤 위 같은 톤 filled 컴포넌트는 강조 계층이 약합니다. 배경은 neutral 로 낮추거나 라벨을 outlined/text 계열로.",
    });
  }

  // visual-emphasis-overload — 강조 장치가 동시에 4개 이상 사용
  const emphasisSignals = [
    { name: "gradient", matched: /(linear|radial|conic)-gradient\s*\(/.test(source) },
    { name: "chip", matched: $("nds-chip").length > 0 },
    { name: "badge", matched: $("nds-badge").length > 0 },
    {
      name: "semantic-background",
      matched: /background(?:-color)?\s*:\s*var\(--semantic-/.test(source),
    },
    { name: "icon", matched: $("svg").length > 0 },
  ].filter((s) => s.matched);
  if (emphasisSignals.length >= 4) {
    out.push({
      rule: "visual-emphasis-overload",
      line: 1,
      detail: `강조 장치가 동시에 많이 사용됨: ${emphasisSignals.map((s) => s.name).join(", ")}`,
      suggestion:
        "안내/보조 영역은 색 배경, 아이콘, Chip/Badge, 굵은 제목 중 1-2개만 사용하세요. get_guide({ topic: 'pattern:notice' }) 참조.",
    });
  }

  // primary-color-role-overload — primary 계열 색이 여러 역할로 과다 사용
  const primaryTokenRefs =
    source.match(/var\(--color-(?:semantic-primary|blue|cobalt|yellow-primary)[\w-]*\)/g) ?? [];
  const primaryRoleSignals = [
    {
      name: "button",
      matched: $("nds-button")
        .toArray()
        .some((b) => {
          const a = (b as unknown as DomElement).attribs ?? {};
          return a.color === "primary" || a.variant === "solid";
        }),
    },
    {
      name: "chip",
      matched:
        $("nds-chip[variant='filled'], nds-chip[color], nds-chip[style*='background']").length > 0,
    },
    {
      name: "badge",
      matched:
        $("nds-badge[variant='filled'], nds-badge[color], nds-badge[style*='background']").length >
        0,
    },
    {
      name: "background",
      matched:
        /background(?:-color)?\s*:\s*var\(--color-(?:semantic-primary|blue|cobalt|yellow-primary)/.test(
          source,
        ),
    },
    {
      name: "border",
      matched:
        /border(?:-color)?\s*:\s*[^;]*var\(--color-(?:semantic-primary|blue|cobalt|yellow-primary)/.test(
          source,
        ),
    },
    {
      name: "icon",
      matched:
        /<\s*svg\b[^>]*?color\s*=\s*["']var\(--color-(?:semantic-primary|blue|cobalt|yellow-primary)/.test(
          source,
        ),
    },
  ].filter((s) => s.matched);

  if (primaryTokenRefs.length >= 8 || primaryRoleSignals.length >= 4) {
    out.push({
      rule: "primary-color-role-overload",
      line: 1,
      detail: `primary 계열 색상이 여러 역할로 과다 사용됨: ${
        primaryRoleSignals.map((s) => s.name).join(", ") || `${primaryTokenRefs.length} token refs`
      }`,
      suggestion:
        "Primary color 는 CTA/interactive/highlight 중 제한된 역할에만. 배경/태그/카드/포커스까지 모두 primary 로 처리하지 말고 neutral surface 와 텍스트 위계로 낮추세요.",
    });
  }

  // ─── DS 뱃지 풋터 노출 ─────────────────────────────────
  // 풋터(<footer> / <nds-footer-info> / <nds-footer-web>) 안에 DS 버전·사용량 뱃지가
  // 시각적으로 보여야 함. 뱃지는 다음 중 하나로 인식:
  //   - data-ds-badge 속성을 가진 요소
  //   - "DS@<version>" 또는 "DS@버전" 텍스트
  // build_singlefile_html 이 응답으로 dsUsageSummary 를 돌려주는데, 그 값을
  // 풋터에 visible 하게 렌더해야 한다. (HTML 주석으로만 박혀 있으면 디자이너/PM 이
  // 산출물을 받았을 때 어떤 DS 버전인지·DS 사용 비율이 얼마인지 알 수 없다.)
  const footerSelectors = ["footer", "nds-footer-info", "nds-footer-web", "nds-footer-app"];
  const footers = $(footerSelectors.join(", "));
  if (footers.length > 0) {
    let badgeFound = false;
    footers.each((_i, el) => {
      if (badgeFound) return;
      const $el = $(el);
      if ($el.find("[data-ds-badge]").length > 0 || $el.is("[data-ds-badge]")) {
        badgeFound = true;
        return;
      }
      // 풋터 후손 전체 텍스트를 합쳐 검사 (DS@0.1.10 형태 또는 DS@버전 자리표시자)
      const allText = $el.text();
      if (/\bDS\s*@\s*[\w.-]+/i.test(allText)) {
        badgeFound = true;
      }
    });
    if (!badgeFound) {
      const firstFooter = footers.get(0) as DomElement | undefined;
      const line = firstFooter
        ? lineNumberAt(source, (firstFooter as unknown as { startIndex?: number }).startIndex ?? 0)
        : 1;
      out.push({
        rule: "ds-badge-missing",
        line,
        selector: firstFooter ? describeElement(firstFooter) : undefined,
        detail: "풋터에 DS 버전·사용량 뱃지가 없음.",
        suggestion:
          "build_singlefile_html 응답의 dsUsageSummary(예: 'DS@0.1.10 · DS 12 (45%)') 를 풋터 안에 visible 하게 렌더하세요. 인식 패턴: data-ds-badge 속성 또는 'DS@<version>' 텍스트. 예: <span data-ds-badge style=\"font-size:12px;color:var(--semantic-text-tertiary)\">DS@0.1.10 · DS 12 (45%)</span>",
      });
    }
  }
}

function isInsideSecondaryActionContext(el: DomElement): boolean {
  let cur: DomElement | null = (el as unknown as { parent?: DomElement }).parent ?? null;
  while (cur) {
    if (cur.type === "tag") {
      const tag = cur.tagName?.toLowerCase();
      const role = cur.attribs?.role?.toLowerCase();
      if (
        tag === "nds-modal" ||
        tag === "nds-bottom-sheet" ||
        tag === "nds-drawer" ||
        tag === "dialog" ||
        role === "dialog"
      ) {
        return true;
      }
    }
    cur = (cur as unknown as { parent?: DomElement }).parent ?? null;
  }
  return false;
}
