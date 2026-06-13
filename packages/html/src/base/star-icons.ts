/**
 * 공유 별점 아이콘 SSOT — `nds-star-rating` · `nds-review-card` · `nds-media-card` 공용.
 *
 * React `StarRating` 과 동일한 path·토큰·반쪽 그라데이션을 그린다(3중 중복 제거). 색은
 * `--nds-rating-star`(채움) / `--nds-rating-star-empty`(빈 별) 슬롯 — SVG presentation
 * attr 은 var() 미보장이라 `style.fill`/`style.stopColor` 로 적용한다.
 */

const SVGNS = "http://www.w3.org/2000/svg";
const STAR_PATH = "M8 1.3l2 4.1 4.5.6-3.3 3.2.8 4.5L8 11.4l-4 2.3.8-4.5L1.5 6l4.5-.6z";
const FILLED_COLOR = "var(--nds-rating-star, #FFD54F)";
const EMPTY_COLOR = "var(--nds-rating-star-empty, #D8D8D8)";

export type StarPrecision = "full" | "half";
export type StarFill = "full" | "half" | "empty";

/** half 그라데이션 id 충돌 방지용 카운터(한 페이지에 다수 별점 가능). */
let halfGradientUid = 0;

/** 별 i(1-based)의 채움 상태 판정. full=정수 반올림, half=0.5 단위 반쪽 허용. React starFill 미러. */
export const starFillState = (
  starIndex: number,
  value: number,
  precision: StarPrecision,
): StarFill => {
  if (precision === "half") {
    if (value >= starIndex) return "full";
    if (value >= starIndex - 0.5) return "half";
    return "empty";
  }
  return Math.round(value) >= starIndex ? "full" : "empty";
};

/** 채움 상태에 맞는 별 한 개 SVG 를 생성. */
export const createStarSvg = (fill: StarFill, size: number): SVGSVGElement => {
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS(SVGNS, "path");
  path.setAttribute("d", STAR_PATH);

  if (fill === "half") {
    const id = `nds-star-half-${(halfGradientUid += 1)}`;
    const defs = document.createElementNS(SVGNS, "defs");
    const grad = document.createElementNS(SVGNS, "linearGradient");
    grad.setAttribute("id", id);

    const stopFull = document.createElementNS(SVGNS, "stop");
    stopFull.setAttribute("offset", "50%");
    stopFull.style.stopColor = FILLED_COLOR;

    const stopEmpty = document.createElementNS(SVGNS, "stop");
    stopEmpty.setAttribute("offset", "50%");
    stopEmpty.style.stopColor = EMPTY_COLOR;

    grad.appendChild(stopFull);
    grad.appendChild(stopEmpty);
    defs.appendChild(grad);
    svg.appendChild(defs);
    path.setAttribute("fill", `url(#${id})`);
  } else {
    path.style.fill = fill === "full" ? FILLED_COLOR : EMPTY_COLOR;
  }

  svg.appendChild(path);
  return svg;
};

/** 별 max 개를 container 에 추가(비인터랙티브 표시용 — 카드 등). */
export const appendStars = (
  container: Element,
  value: number,
  { size = 14, max = 5, precision = "half" as StarPrecision } = {},
): void => {
  for (let i = 1; i <= max; i++) {
    container.appendChild(createStarSvg(starFillState(i, value, precision), size));
  }
};
