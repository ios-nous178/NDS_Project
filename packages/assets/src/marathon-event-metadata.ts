/**
 * 마라톤 행사 일러스트 메타데이터 (dataUri 제외).
 *
 * Runmile Figma library (file `Wd1BqKFPvrlLORr7E6EwjB`, frame 27:313) 의 행사별
 * 일러스트 10종. 이미지 네이밍 가이드(5030:979)에 event 카테고리가 없어 **illust**
 * 로 흡수 — 폴더 `brand/runmile/illust/`, 파일/카탈로그 id 는 `event-{name}`.
 * (이미지 로드 실패용 "오류"는 state 로 분리 → `state-image-metadata.ts` 의 `error`.)
 *
 * - `filename`   : 360×360 PNG (base).
 * - `filename2x` : 720×720 PNG (재export 행사만 보유).
 * - `filename3x` : 540×540 PNG (고밀도). srcset `2x/3x` 로 사용.
 *
 * Runmile 만의 자산 — 다른 브랜드는 사용하지 않음. raster PNG 라 dataUri 미제공.
 */

export type MarathonEventId =
  | "dog-race"
  | "forsythia"
  | "pokemon"
  | "yeontan-run"
  | "shinhan-donghaeng-run"
  | "santa-claus-run"
  | "seokchon-night-run"
  | "hangang-night-run"
  | "bomkkot-run"
  | "animal-run";

export interface MarathonEventMeta {
  /** 360×360 PNG (base). illust/event-{id}.png */
  filename: string;
  /** 720×720 PNG (재export 행사만). */
  filename2x?: string;
  /** 540×540 PNG (고밀도). */
  filename3x: string;
  mimeType: "image/png";
  figmaNodeId: string;
  /** 원본 Figma 노드 이름 (한글). */
  figmaNodeName: string;
}

export const MARATHON_EVENT_METADATA: Record<MarathonEventId, MarathonEventMeta> = {
  // 디자이너 재export (영문 의미명 + @2x 보유) — 댕댕이레이스/개나리런/포켓몬런.
  "dog-race": {
    filename: "brand/runmile/illust/event-dog-race.png",
    filename2x: "brand/runmile/illust/event-dog-race@2x.png",
    filename3x: "brand/runmile/illust/event-dog-race@3x.png",
    mimeType: "image/png",
    figmaNodeId: "27:312",
    figmaNodeName: "댕댕이레이스",
  },
  forsythia: {
    filename: "brand/runmile/illust/event-forsythia.png",
    filename2x: "brand/runmile/illust/event-forsythia@2x.png",
    filename3x: "brand/runmile/illust/event-forsythia@3x.png",
    mimeType: "image/png",
    figmaNodeId: "27:311",
    figmaNodeName: "개나리런",
  },
  pokemon: {
    filename: "brand/runmile/illust/event-pokemon.png",
    filename2x: "brand/runmile/illust/event-pokemon@2x.png",
    filename3x: "brand/runmile/illust/event-pokemon@3x.png",
    mimeType: "image/png",
    figmaNodeId: "489:2879",
    figmaNodeName: "포켓몬런",
  },
  // 기존 자산 이동 (1x + @3x).
  "yeontan-run": {
    filename: "brand/runmile/illust/event-yeontan-run.png",
    filename3x: "brand/runmile/illust/event-yeontan-run@3x.png",
    mimeType: "image/png",
    figmaNodeId: "490:2884",
    figmaNodeName: "연탄런",
  },
  "shinhan-donghaeng-run": {
    filename: "brand/runmile/illust/event-shinhan-donghaeng-run.png",
    filename3x: "brand/runmile/illust/event-shinhan-donghaeng-run@3x.png",
    mimeType: "image/png",
    figmaNodeId: "27:309",
    figmaNodeName: "신한동행런",
  },
  "santa-claus-run": {
    filename: "brand/runmile/illust/event-santa-claus-run.png",
    filename3x: "brand/runmile/illust/event-santa-claus-run@3x.png",
    mimeType: "image/png",
    figmaNodeId: "27:308",
    figmaNodeName: "산타클로스런",
  },
  "seokchon-night-run": {
    filename: "brand/runmile/illust/event-seokchon-night-run.png",
    filename3x: "brand/runmile/illust/event-seokchon-night-run@3x.png",
    mimeType: "image/png",
    figmaNodeId: "27:307",
    figmaNodeName: "석촌호수나이트런",
  },
  "hangang-night-run": {
    filename: "brand/runmile/illust/event-hangang-night-run.png",
    filename3x: "brand/runmile/illust/event-hangang-night-run@3x.png",
    mimeType: "image/png",
    figmaNodeId: "27:306",
    figmaNodeName: "한강나이트런",
  },
  "bomkkot-run": {
    filename: "brand/runmile/illust/event-bomkkot-run.png",
    filename3x: "brand/runmile/illust/event-bomkkot-run@3x.png",
    mimeType: "image/png",
    figmaNodeId: "27:305",
    figmaNodeName: "봄꽃런",
  },
  "animal-run": {
    filename: "brand/runmile/illust/event-animal-run.png",
    filename3x: "brand/runmile/illust/event-animal-run@3x.png",
    mimeType: "image/png",
    figmaNodeId: "27:304",
    figmaNodeName: "애니멀런",
  },
};

export const MARATHON_EVENT_IDS: readonly MarathonEventId[] = Object.keys(
  MARATHON_EVENT_METADATA,
) as MarathonEventId[];

/** 한 마라톤 이벤트 이미지의 메타데이터 조회. */
export function getMarathonEvent(id: MarathonEventId): MarathonEventMeta | undefined {
  return MARATHON_EVENT_METADATA[id];
}
