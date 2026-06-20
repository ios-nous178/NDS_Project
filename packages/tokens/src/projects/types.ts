/**
 * Brand Theme — 프로젝트별 토큰 오버라이드 타입 정의
 *
 * 시멘틱 트리는 Figma SemanticColorGuide(171:6675) role-based 구조의 Partial.
 * 프로젝트는 자기 정체성에 영향을 주는 그룹만 골라 override 한다 — 누락된 키는
 * base(NudgeEAP) 값이 그대로 cascade 된다.
 */

import type { TypeStyle } from "../typography.js";
import type { ActionsLayout } from "../actionsLayout.js";

/** 팔레트 컬러 — 프로젝트 고유 색상 스케일 */
export type ColorScale = Record<string | number, string>;

/** 시멘틱 컬러 — Figma role-based 트리의 Partial */
export interface SemanticColors {
  bg?: {
    page?: { default?: string };
    surface?: { default?: string; subtle?: string };
    section?: { default?: string };
    brand?: { default?: string; subtle?: string };
    inverse?: { default?: string };
    status?: {
      error?: string;
      success?: string;
      info?: string;
      caution?: string;
    };
    /** Figma `--bg-overlay` */
    overlay?: string;
    /** DS extension — disabled bg */
    disabled?: string;
    /**
     * Point(액센트) 서피스 — 프로젝트 가이드의 코발트(트로스트) 등 보조 강조 컬러.
     * `BG/Point/{Default,Subtle,Surface}`. brand(주 컬러)와 별개의 2차 액센트.
     * NudgeEAP base 는 미정의 — point 패밀리를 둔 brand 만 emit.
     */
    point?: { default?: string; subtle?: string; surface?: string };
  };
  text?: {
    strong?: { default?: string };
    normal?: { default?: string };
    subtle?: { default?: string };
    muted?: { default?: string };
    disabled?: { default?: string };
    inverse?: { default?: string };
    brand?: { default?: string; strong?: string };
    /** Brand 채움(노랑 등) 위에 얹는 텍스트. Figma `Text/OnBrand/Default`. */
    onBrand?: { default?: string };
    /** Point(액센트) 텍스트. Figma `Text/Point/{Default,Strong}`. */
    point?: { default?: string; strong?: string };
    /**
     * Inline 링크 텍스트. CashwalkBiz 가이드에 명시된 `Text/Link/Default` 슬롯.
     * NudgeEAP base 에는 없고, brand 가이드가 link 를 별도 컬러로 분리할 때 사용.
     */
    link?: { default?: string };
    status?: {
      success?: string;
      error?: string;
      caution?: string;
      info?: string;
    };
  };
  buttonBg?: {
    default?: string;
    hover?: string;
    pressed?: string;
    disabled?: string;
    secondary?: { default?: string; hover?: string; disabled?: string };
    outlined?: { default?: string; hover?: string; disabled?: string };
    /**
     * Filled neutral 톤. Geniet 의 "Solid Neutral" 처럼 primary/secondary 보다
     * 낮은 위계에서 사용되는 채워진 회색 버튼 패턴. NudgeEAP base / Trost 는
     * 기본 사용 안 함 (해당 프로젝트는 outlined 로 같은 위계를 표현).
     */
    neutral?: { default?: string; hover?: string; disabled?: string };
  };
  /**
   * `secondary` — Solid/Secondary 텍스트 색. 프로젝트별로 의도가 달라 분리:
   *   · NudgeEAP: brand blue (light blue bg 위)
   *   · Trost: cobalt brand (cobalt-50 bg 위)
   *   · Geniet: white (dark inverse bg 위) — Geniet 고유 패턴
   * `neutral` — Geniet 의 neutral/outlined-neutral 버튼 텍스트 색
   * (보통 gray/strong). 다른 프로젝트는 미사용.
   */
  buttonText?: {
    default?: string;
    brand?: string;
    secondary?: { default?: string; disabled?: string };
    /** Outlined/Weak Neutral enabled 텍스트 (흰/투명 bg → 어두운 톤). */
    neutral?: string;
    /**
     * Solid Neutral 텍스트 — fill 명도 대비용. 어두운 fill(cashpobi #111·nudge cool-gray)=흰,
     * 밝은 fill(geniet #ECECEC·runmile #F2F4F6)=어두운 톤. `neutral`(outlined)과 분리.
     */
    neutralSolid?: string;
    /** Neutral disabled 텍스트 (Outlined). */
    neutralDisabled?: string;
    disabled?: string;
  };
  buttonBorder?: {
    outlined?: { default?: string; hover?: string; disabled?: string };
    neutral?: { default?: string; disabled?: string };
  };
  icon?: {
    strong?: { default?: string };
    normal?: { default?: string };
    /**
     * 약한 아이콘 톤. Figma 런마일 library (20:94) 가 아이콘 컬러 슬롯을
     * `gray600` 으로 명시한 자리 — BottomNav inactive / secondary 아이콘 등에
     * 사용. 다른 brand 는 미정의 시 fallback (base = neutral medium).
     */
    muted?: { default?: string };
    /** 약한 아이콘 톤. Figma `Icon/Subtle/Default`. */
    subtle?: { default?: string };
    disabled?: { default?: string };
    inverse?: { default?: string };
    /** Brand 채움 위 아이콘. Figma `Icon/OnBrand/Default`. */
    onBrand?: { default?: string };
    brand?: { default?: string };
    /** Point(액센트) 아이콘. Figma `Icon/Point/Default`. */
    point?: { default?: string };
    status?: { success?: string; error?: string; caution?: string };
  };
  border?: {
    normal?: { default?: string };
    strong?: { default?: string };
    subtle?: { default?: string };
    focus?: { default?: string };
    brand?: { default?: string; disabled?: string };
    disabled?: { default?: string };
    status?: { error?: string; success?: string; caution?: string };
    /** Point(액센트) 보더. Figma `Border/Point/Default`. */
    point?: { default?: string };
  };
  fill?: {
    brand?: {
      default?: string;
      hover?: string;
      pressed?: string;
      disabled?: string;
      subtle?: string;
    };
    neutral?: { default?: string; subtle?: string };
    inverse?: { default?: string };
    status?: { error?: string; success?: string; info?: string; caution?: string };
    /** Point(액센트) 채움. Figma `Fill/Point/{Default,Hover,Pressed,Subtle}`. */
    point?: { default?: string; hover?: string; pressed?: string; subtle?: string };
    /** 선택 컨트롤(checkbox·radio) on 채움. base=fill-brand 추종, trost=dark. */
    controlOn?: string;
  };
  input?: {
    bg?: string;
    bgDisabled?: string;
    borderDefault?: string;
    borderHover?: string;
    borderFocus?: string;
    borderError?: string;
    borderDisabled?: string;
    placeholder?: string;
    helpertextDefault?: string;
    helpertextSuccess?: string;
    helpertextError?: string;
    helpertextDisabled?: string;
  };
  /**
   * 모달/팝업 confirm(주 액션) 버튼 색. base 는 brand 토큰을 `var(...)` 로 참조 → 프로젝트별
   * 자기 brand 색으로 late-bind. **캐포비만 neutral 검정으로 override**(Primary+Neutral tone 체계).
   * data-project 캐스케이드가 아니라 토큰(`:root` 변수)으로 흐르게 해, data-project 속성을 안 쓰는
   * standalone 목업(프로젝트 :root CSS 교체)에서도 캐포비 모달/팝업 버튼이 검정으로 나오게 한다.
   */
  confirmCta?: {
    bg?: string;
    hover?: string;
    active?: string;
    text?: string;
  };
  // (brandLogo 슬롯 제거 — P3 slice 2. brand→project 리네임으로 로고 자산이
  //  @nudge-design/assets 로 이전되며 고아화, 소비처 0.)
}

/** 타이포그래피 오버라이드 */
export interface TypographyOverrides {
  fontFamily: {
    web: string;
    system: string;
  };
  typeScale: Record<string, TypeStyle>;
}

/** 스페이싱/라디어스 오버라이드 — 모두 partial, 누락 키는 base cascade */
export interface SpacingOverrides {
  /** Atomic spacing scale — `--spacing-{key}` */
  spacing?: Record<string | number, number>;
  /** Semantic gap — `--semantic-gap-{key}` (tight/default/comfortable/loose/wide 등) */
  gap?: Record<string, number>;
  /** Heading 별 다음 요소 간격 — `--semantic-gap-title-{key}` */
  gapTitle?: Record<string, number>;
  /** 컨테이너 내부 padding — `--semantic-inset-{key}` (chip/input/card/modal/section/page 등) */
  inset?: Record<string, number>;
  radius?: Record<string, number>;
  shape?: Record<string, number>;
  borderWidth?: Record<string, number>;
  stroke?: Record<string, number>;
  /** Grid system — gutter / margin / contentWidth 등 */
  grid?: {
    mobile?: {
      columns?: number;
      margin?: number;
      gutter?: number;
      contentWidth?: number;
    };
    desktop?: {
      columns?: number;
      margin?: number;
      minMargin?: number;
      gutter?: number;
      contentWidth?: number;
    };
  };
  /**
   * Admin/page layout 토큰 — CashwalkBiz 가이드의 Layout/Page · Sidebar · Content · MaxContent.
   * NudgeEAP base / Trost / Geniet 는 미사용. emit: `--layout-{key}` (px).
   */
  layout?: {
    page?: number;
    sidebar?: number;
    content?: number;
    maxContent?: number;
  };
}

/** 엘리베이션 오버라이드 */
export interface ElevationOverrides {
  shadow?: Record<string, string>;
  zIndex?: Record<string, number>;
}

/**
 * 컴포넌트 단위 오버라이드 — primitive 토큰(`radius.md` 등)을 손대지 않고
 * 특정 컴포넌트만 프로젝트 가이드에 맞게 보정할 때 사용.
 * emit: `--nds-{component}-{prop}` CSS var. 컴포넌트는 이 var 를 fallback 패턴으로 읽어 cascade.
 * (오버라이드를 안 정의한 프로젝트는 컴포넌트의 fallback 값이 그대로 적용 — 기존 동작 유지)
 * 예) CashwalkBiz admin 은 input radius 10px / height 48px / padding-x = inset-input (base 8/48/inset-card).
 *
 * value 가 number 면 `${value}px` 로 emit, string 이면 그대로 (`var(--semantic-inset-input)` 같은 CSS var 참조 가능).
 */
type ComponentValue = number | string;
export interface ComponentOverrides {
  input?: {
    radius?: ComponentValue;
    height?: ComponentValue;
    paddingX?: ComponentValue;
    /** Input 패밀리 기본 테두리 색 — `--nds-input-border-color`. 미설정 시 input.borderDefault fallback. */
    borderColor?: ComponentValue;
  };
  /**
   * Select(Dropdown). 캐포비 InputGuide(3080:741)는 trigger/option Body2 14/20,
   * 선택 항목 = 회색 배경(#F5F5F5) + Strong 텍스트 + Medium 500 + radius 6 + 메뉴 inset.
   * 다른 프로젝트는 fallback (Body3 13/18, brand-tint 선택, flat option) 유지.
   */
  select?: {
    radius?: ComponentValue;
    height?: ComponentValue;
    paddingX?: ComponentValue;
    fontSize?: ComponentValue;
    lineHeight?: ComponentValue;
    optionPadding?: ComponentValue;
    optionRadius?: ComponentValue;
    optionSelectedBg?: ComponentValue;
    optionSelectedColor?: ComponentValue;
    optionSelectedWeight?: ComponentValue;
    dropdownPadding?: ComponentValue;
    dropdownGap?: ComponentValue;
  };
  textarea?: {
    radius?: ComponentValue;
    paddingX?: ComponentValue;
    paddingY?: ComponentValue;
    minHeight?: ComponentValue;
  };
  datepicker?: {
    radius?: ComponentValue;
    height?: ComponentValue;
    paddingX?: ComponentValue;
    fontSize?: ComponentValue;
    lineHeight?: ComponentValue;
  };
  /** TextField/FormField 라벨 — 캐포비는 Strong(#111). 다른 프로젝트는 Normal(#333) fallback. */
  "form-field"?: { labelColor?: ComponentValue };
  /** ActionChip — 캐포비 radius 6 / bg #ECECEC. 다른 프로젝트는 radius.sm(4) / fill.neutralSubtle fallback. */
  "action-chip"?: { radius?: ComponentValue; bg?: ComponentValue };
  /**
   * Chip(SelectChip) selected 상태의 채움 위 텍스트/보더/배경 override.
   * 캐포비는 노랑 채움 위 가독성을 위해 selectedText=검정(#111). 다른 프로젝트는 fallback
   * (FILL_COLORS — selected 텍스트 inverse 흰) 유지. 좌측 ✓ 체크 아이콘은 currentColor 를 따른다.
   */
  chip?: {
    selectedBackground?: ComponentValue;
    selectedText?: ComponentValue;
    selectedBorder?: ComponentValue;
    /**
     * 치수 override (`--nds-chip-*`). 지니어트 가이드(3058:84): h32 · padding 6/14 ·
     * Medium(500) 13. 미설정 프로젝트는 size(sm/md) 토큰값 fallback 유지.
     */
    height?: ComponentValue;
    paddingX?: ComponentValue;
    paddingY?: ComponentValue;
    fontSize?: ComponentValue;
    lineHeight?: ComponentValue;
    fontWeight?: ComponentValue;
  };
  /**
   * Footer.TabBar 의 nav 시각 변형. Geniet BottomNav 가이드는 active=mint600 + bold,
   * label Pretendard 10/12. 다른 프로젝트는 fallback (active=textRole.normal #333, label 11/14).
   */
  footer?: {
    navActiveColor?: ComponentValue;
    navInactiveColor?: ComponentValue;
    navLabelFontSize?: ComponentValue;
    navLabelLineHeight?: ComponentValue;
    navLabelWeight?: ComponentValue;
    navActiveLabelWeight?: ComponentValue;
    /** 다크 푸터 텍스트 톤 — 회사명/뮤트/부가 링크. 미설정 시 textRole.subtle/muted fallback. */
    companyColor?: ComponentValue;
    mutedColor?: ComponentValue;
    extraColor?: ComponentValue;
  };
  /** Card 셸 — radius / 테두리. 미설정 시 radius.lg / borderRole.normal fallback. */
  card?: { radius?: ComponentValue; borderColor?: ComponentValue };
  /**
   * Modal 컨테이너 radius(`--nds-modal-radius`) + 상단 패딩(`--nds-modal-pad-top`).
   * 미설정 시 radius.md / spacing.28 fallback. 트로스트 가이드(171:9899)는 radius 16 · top 24.
   * shadow/titleColor/bodyColor/bodyFontSize/bodyLineHeight 는 정적 import 였던 값의 슬롯화 —
   * 런마일(5085:27): radius 24·Elevation/3·Title=Strong·Body=Text/Normal(subtle) 13/18.
   */
  modal?: {
    radius?: ComponentValue;
    padTop?: ComponentValue;
    shadow?: ComponentValue;
    titleColor?: ComponentValue;
    bodyColor?: ComponentValue;
    bodyFontSize?: ComponentValue;
    bodyLineHeight?: ComponentValue;
  };
  /**
   * Popup(가운데 confirm 다이얼로그) 컨테이너 radius(`--nds-popup-radius`)·그림자(`--nds-popup-shadow`)·폭.
   * 미설정 시 radius.md / shadow.3 / 400px fallback. 캐포비는 [data-project] 로 16 을 박았으나
   * 슬롯으로 일원화 — 런마일 = radius 20 · Elevation/3.
   */
  popup?: { radius?: ComponentValue; shadow?: ComponentValue; maxWidth?: ComponentValue };
  /** BottomSheet — 상단 radius / drag handle 치수·색. */
  "bottom-sheet"?: {
    radius?: ComponentValue;
    handleWidth?: ComponentValue;
    handleHeight?: ComponentValue;
    handleColor?: ComponentValue;
  };
  /** Toggle 트랙 치수·색 + 썸 그림자 + checked 라벨색. 미설정 시 44×24 / borderRole.normal / fill.brand fallback. */
  toggle?: {
    trackW?: ComponentValue;
    trackH?: ComponentValue;
    trackBg?: ComponentValue;
    trackActiveBg?: ComponentValue;
    /** 썸(knob) 치수·여백·이동거리 — 트랙 크기를 키울 때 함께 조정. 미설정 시 18 / 3 / 20 fallback. */
    thumbSize?: ComponentValue;
    thumbOffset?: ComponentValue;
    thumbTravel?: ComponentValue;
    thumbShadow?: ComponentValue;
    /** checked 트랙 위 내장 라벨 색 (`--nds-toggle-label-active-color`). base button.textDefault. */
    labelActiveColor?: ComponentValue;
  };
  /**
   * Pagination — active 페이지 색(런마일 gray800) + 캐포비 boxed 아이템 re-skin.
   * 캐포비는 테두리 박스(gap/height/border/radius/bg/color/weight) + boxed disabled(opacity/bg/color).
   * 다른 프로젝트 미설정 → 테두리 없는 투명 버튼(fallback).
   */
  pagination?: {
    gap?: ComponentValue;
    itemHeight?: ComponentValue;
    /** 아이템 최소 너비 (`--nds-pagination-item-min-width`). 미설정 시 32px. 런마일 24×24 정사각 셀용. */
    itemMinWidth?: ComponentValue;
    itemBorder?: ComponentValue;
    itemRadius?: ComponentValue;
    itemBg?: ComponentValue;
    itemColor?: ComponentValue;
    itemWeight?: ComponentValue;
    activeBg?: ComponentValue;
    activeBgHover?: ComponentValue;
    activeText?: ComponentValue;
    activeWeight?: ComponentValue;
    /** 이전/다음 화살표 아이콘 치수·색 (`--nds-pagination-arrow-size/-color`). 미설정 시 16px / textRole.subtle. */
    arrowSize?: ComponentValue;
    arrowColor?: ComponentValue;
    disabledOpacity?: ComponentValue;
    disabledBg?: ComponentValue;
    disabledColor?: ComponentValue;
  };
  /**
   * Checkbox 시각 변형. 캐포비 가이드(3082:899)는 box 15×15 / 1.25px border / radius 2px /
   * unchecked border #DDD / disabled = 색 변경 없이 opacity 0.4. 다른 프로젝트는 fallback 유지.
   */
  checkbox?: {
    size?: ComponentValue;
    borderWidth?: ComponentValue;
    radius?: ComponentValue;
    borderColor?: ComponentValue;
    /**
     * checked/indeterminate 채움·테두리·체크아이콘 색 (`--nds-checkbox-checked-bg/-checked-border/-check-color`).
     * 미설정 시 fill.brand(채움) / button.textDefault(체크) fallback. 트로스트 가이드(5158:108)는
     * on 상태를 brand 노랑이 아닌 다크(#333) + 흰 체크로 — 노랑 위 가독성.
     */
    checkedBg?: ComponentValue;
    checkedBorder?: ComponentValue;
    checkColor?: ComponentValue;
    disabledOpacity?: ComponentValue;
    disabledBg?: ComponentValue;
    disabledBorderColor?: ComponentValue;
    disabledCheckedBg?: ComponentValue;
    disabledCheckedBorderColor?: ComponentValue;
  };
  /**
   * Radio 외경 치수(`--nds-radio-size`) + checked 색(`--nds-radio-checked-color` — 테두리+점 공용).
   * 미설정 시 20px / fill.brand fallback. 트로스트는 24px·다크(#333) on 상태.
   */
  radio?: {
    size?: ComponentValue;
    checkedColor?: ComponentValue;
  };
  /**
   * NoticeAlert(인라인 Alert) 컨테이너.
   * - radius(`--nds-notice-alert-radius`): 지니어트·트로스트 = Shape/MD 8. 미설정 프로젝트는 radius.lg(12) fallback.
   * - noticeBg / noticeIcon(`--nds-notice-alert-notice-{bg,icon}`): Notice variant 색.
   *   패턴 기본은 블루(BG/Status/Info). 트로스트는 중립 톤(BG/Surface/Subtle + Icon/Normal)으로 override.
   * - text(`--nds-notice-alert-text`): 본문 텍스트색. 미설정 시 variant 기본(strong / error=status-error).
   *   트로스트는 전 variant Text/Normal 로 통일.
   */
  "notice-alert"?: {
    radius?: ComponentValue;
    noticeBg?: ComponentValue;
    noticeIcon?: ComponentValue;
    text?: ComponentValue;
  };
  /**
   * Button 높이 size별 override (`--nds-button-height-{size}`). 지니어트 ButtonGuide(3047:1032):
   * S 40·XS 36 (base 42·38). mini(32)는 base. 미설정 size 는 base sizing.button fallback.
   */
  button?: {
    heightXl?: ComponentValue;
    heightLg?: ComponentValue;
    heightMd?: ComponentValue;
    heightSm?: ComponentValue;
    heightXs?: ComponentValue;
    heightMini?: ComponentValue;
    heightField?: ComponentValue;
  };
  /**
   * Badge(Label) 시각 변형. 캐포비 ChipGuide(3782:20558 · Rounded Square):
   *   radius 5 · padding 4/10 · Caption 12/16 · Medium(500) (base 는 bold·radius 4/6).
   *   톤(색)은 ghost 변형 + semantic 색이 이미 캐포비값으로 cascade → 별도 색 override 불필요.
   * 다른 프로젝트는 fallback (bold·md radius 4) 유지.
   */
  badge?: {
    radius?: ComponentValue;
    height?: ComponentValue;
    paddingX?: ComponentValue;
    paddingY?: ComponentValue;
    fontSize?: ComponentValue;
    lineHeight?: ComponentValue;
    fontWeight?: ComponentValue;
  };
  /**
   * Tab 시각 변형. 캐포비 가이드(3544:206):
   *   Underline(line) = subtitle1 16/24 · default medium(500) · indicator 2px · padding 16/12(h48)
   *   Box(chip) = radius 10 · padding 20/14(h52) · selected bg-inverse(#111) ·
   *               default button-bg-disabled(#ddd) + 양쪽 흰 텍스트 bold
   * 다른 프로젝트는 fallback (line body3 14/20·indicator 3px, chip pill·subtle gray) 유지.
   */
  tab?: {
    lineFontSize?: ComponentValue;
    lineLineHeight?: ComponentValue;
    lineDefaultWeight?: ComponentValue;
    lineIndicatorHeight?: ComponentValue;
    lineTabHeight?: ComponentValue;
    linePaddingX?: ComponentValue;
    chipRadius?: ComponentValue;
    chipTabHeight?: ComponentValue;
    chipPaddingX?: ComponentValue;
    chipFontSize?: ComponentValue;
    chipLineHeight?: ComponentValue;
    chipSelectedBg?: ComponentValue;
    chipDefaultBg?: ComponentValue;
    chipDefaultColor?: ComponentValue;
    chipDefaultWeight?: ComponentValue;
    /**
     * tone="color"(활성/선택 강조)의 색 — brand 가 아닌 별도 액센트를 쓰는 프로젝트용 슬롯.
     * 트로스트: brand=노랑(면적 채움)이라 탭 액센트는 Point 코발트(#4968FF)로 분리(가독성).
     *   · accentFill = line indicator + chip/segment 활성 채움 (default cv.surface.brand)
     *   · accentText = line 활성 텍스트 (default cv.textRole.brand)
     *   · accentOn   = chip/segment 채움 위 텍스트 (default cv.button.textDefault)
     * 미설정 프로젝트는 fallback 으로 기존 brand 동작 유지(비-Trost 무변).
     */
    accentFill?: ComponentValue;
    accentText?: ComponentValue;
    accentOn?: ComponentValue;
  };
  /**
   * Tooltip 다크 말풍선 배경 슬롯. 캐포비는 Fill/Neutral(#333) — base inverse(#111)와 다름.
   * 다른 프로젝트는 미설정 → 컴포넌트 fallback (surface.inverse) 유지.
   */
  tooltip?: {
    bg?: ComponentValue;
    /** radius(`--nds-tooltip-radius`, 미설정 8) · 본문 폰트(`--nds-tooltip-font-size/-line-height`, 미설정 13/18). 런마일=6·12/16. */
    radius?: ComponentValue;
    fontSize?: ComponentValue;
    lineHeight?: ComponentValue;
    /** 화살표 기하 — arrowW=밑변 절반(미설정 6→밑변12) · arrowH=높이(미설정 8). 런마일 8×8 → arrowW 4·arrowH 8. */
    arrowW?: ComponentValue;
    arrowH?: ComponentValue;
  };
  /**
   * Chart — 어드민 통계 차트 시리즈 색 슬롯 (`--nds-chart-*`).
   * 기본값(캐포비 데이터-뷰 팔레트)은 base(nudge-eap) theme 이 :root 로 emit —
   * 컴포넌트 요소에 박지 않아야 프로젝트 :root override 가 마스킹되지 않는다.
   * 데이터-뷰 색은 아토믹 팔레트 밖(디자이너 토큰화 대기) — hex 직접 기입 허용 예외.
   */
  chart?: {
    line?: ComponentValue;
    "1"?: ComponentValue;
    "2"?: ComponentValue;
    "3"?: ComponentValue;
    "4"?: ComponentValue;
    empty?: ComponentValue;
  };
  /** 별점(StarRating/ReviewCard/각종 카드) — 채움 `--nds-rating-star` · 빈 별 `--nds-rating-star-empty` */
  rating?: { star?: ComponentValue; starEmpty?: ComponentValue };
  /**
   * Toast — 단일 다크 토스트의 배경/그림자 슬롯 (`--nds-toast-bg` / `--nds-toast-shadow`).
   * Figma 1330:2 의 다크값(#212121·0.92)과 drop shadow 는 role-based 시멘틱 변수(Figma SSOT)
   * 집합 밖이라 `--semantic-*` 이 아닌 `--nds-*` 컴포넌트 슬롯으로 둔다. base(nudge-eap) theme 이
   * :root 로 기본값을 emit — 프로젝트 :root override 여지. (캐포비는 Toast 자체가 banned.)
   */
  toast?: { bg?: ComponentValue; shadow?: ComponentValue };
  /**
   * Snackbar — 프로젝트 서피스 override (`--nds-snackbar-bg` ①)가 variant bg(② `--nds-snackbar-variant-bg`)를
   * 덮어 전 variant 를 한 서피스로 통일하고 아이콘 색만 variant 유지.
   * - 캐포비 admin: 'variant 무시 흰카드' + 큰 타이틀/아이콘/회색 닫기.
   * - 런마일(5085:234): 다크 토스트 — bg=Surface/Strong(#221E1F α0.85)·fg=흰(Text/OnBrand)·radius 12·Elevation/2·icon 24.
   * 다른 프로젝트는 미설정 → variant 틴트 카드(fallback).
   */
  snackbar?: {
    bg?: ComponentValue;
    /** 메시지/본문 텍스트색 (`--nds-snackbar-fg`). 미설정 시 text.normal fallback. 다크 서피스 프로젝트는 onBrand(흰). */
    fg?: ComponentValue;
    /** 컨테이너 radius (`--nds-snackbar-radius`). 미설정 시 radius.md(8) fallback. 런마일 = Radius/LG 12. */
    radius?: ComponentValue;
    border?: ComponentValue;
    shadow?: ComponentValue;
    titleFontSize?: ComponentValue;
    titleLineHeight?: ComponentValue;
    /** 메시지 font-weight (`--nds-snackbar-title-font-weight`). 미설정 시 bold(700). 런마일 = Medium "500". (string 으로 — number 면 px 가 붙음) */
    titleFontWeight?: ComponentValue;
    iconSize?: ComponentValue;
    /** info variant 아이콘색 (`--nds-snackbar-info-icon`). 미설정 시 icon.brand fallback. 런마일 = 파랑(text-status-info). */
    infoIcon?: ComponentValue;
    /** 액션 버튼 배경/글자색 (`--nds-snackbar-action-bg/-action-color`). 미설정 시 흰 12% 칩 + inherit. 런마일 = 투명 + Text/Brand 오렌지(text 버튼). */
    actionBg?: ComponentValue;
    actionColor?: ComponentValue;
    closeColor?: ComponentValue;
    closeOpacity?: ComponentValue;
  };
  /** FormSection admin 카드 radius (`--nds-form-section-radius`). base lg(12) → 캐포비 16. */
  "form-section"?: { radius?: ComponentValue };
  /** SelectedItemRow admin 행 — gray fill + radius (`--nds-selected-item-row-bg/radius`). 삭제 글리프는 styles [data-project]. */
  "selected-item-row"?: { bg?: ComponentValue; radius?: ComponentValue };
  /**
   * TagInput admin — add 버튼 색(Secondary 부재→neutral) + stacked 태그 gray fill/radius.
   * `--nds-tag-input-add-bg/add-color` · `--nds-tag-input-stacked-bg/stacked-radius`. 삭제 글리프는 styles [data-project].
   */
  "tag-input"?: {
    addBg?: ComponentValue;
    addColor?: ComponentValue;
    stackedBg?: ComponentValue;
    stackedRadius?: ComponentValue;
  };
}

/** 프로젝트 테마 전체 정의 */
export interface ProjectTheme {
  name: string;
  /**
   * 컴포넌트 액션(버튼) 기본 배치 — Modal/Popup 등 푸터 배치 하네스의 프로젝트 기본값.
   *   · "split" — 가로 균등 분할(2버튼 50/50, 1버튼 full).
   *   · "end"   — 우측 정렬 hug(admin 톤).
   * 색/pill 모양은 토큰/cascade 가 따로 담당하고, 이 값은 구조 variant 만 정한다.
   * 컴포넌트는 `actionsLayout` prop / `actions-layout` 속성으로 override 가능.
   * 미지정 시 `DEFAULT_ACTIONS_LAYOUT`("split") fallback. 새 프로젝트는 반드시 선언해야
   * 하며 `pnpm lint:actions-layout` 가 누락을 막는다. (SSOT — react/html 양쪽이 읽음)
   */
  actionsLayout?: ActionsLayout;
  /** 프로젝트 고유 팔레트 컬러 */
  palette: Record<string, ColorScale>;
  /** 시맨틱 컬러 오버라이드 (Figma role-based 트리의 Partial) */
  semantic: SemanticColors;
  /** 타이포그래피 오버라이드 (미지정 시 기본값 사용) */
  typography?: Partial<TypographyOverrides>;
  /** 스페이싱 오버라이드 (미지정 시 기본값 사용) */
  spacing?: SpacingOverrides;
  /** 엘리베이션 오버라이드 (미지정 시 기본값 사용) */
  elevation?: ElevationOverrides;
  /** 컴포넌트 단위 오버라이드 (input / select / textarea / datepicker 등) */
  components?: ComponentOverrides;
}
