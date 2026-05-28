/**
 * 마라톤 행사 이미지 메타데이터 (dataUri 제외).
 *
 * Runmile Figma library (file `Wd1BqKFPvrlLORr7E6EwjB`, frame 27:313) 의
 * 행사별 일러스트 11종 (오류 포함). 모두 180×180 PNG (flatten).
 *
 * Runmile 만의 자산 — 다른 브랜드는 사용하지 않음.
 * raster PNG (~40KB each) 라 dataUri 미제공 — 파일 호스팅 필수.
 */

export type MarathonEventId =
  | "error"
  | "dangdangi-race"
  | "gaenari-run"
  | "pokemon-run"
  | "yeontan-run"
  | "shinhan-donghaeng-run"
  | "santa-claus-run"
  | "seokchon-night-run"
  | "hangang-night-run"
  | "bomkkot-run"
  | "animal-run";

export interface MarathonEventMeta {
  filename: string;
  mimeType: "image/png";
  figmaNodeId: string;
  /** 원본 Figma 노드 이름 (한글). */
  figmaNodeName: string;
}

export const MARATHON_EVENT_METADATA: Record<MarathonEventId, MarathonEventMeta> = {
  error: {
    filename: "marathon-events/error.png",
    mimeType: "image/png",
    figmaNodeId: "27:310",
    figmaNodeName: "오류",
  },
  "dangdangi-race": {
    filename: "marathon-events/dangdangi-race.png",
    mimeType: "image/png",
    figmaNodeId: "27:312",
    figmaNodeName: "댕댕이레이스",
  },
  "gaenari-run": {
    filename: "marathon-events/gaenari-run.png",
    mimeType: "image/png",
    figmaNodeId: "27:311",
    figmaNodeName: "개나리런",
  },
  "pokemon-run": {
    filename: "marathon-events/pokemon-run.png",
    mimeType: "image/png",
    figmaNodeId: "489:2879",
    figmaNodeName: "포켓몬런",
  },
  "yeontan-run": {
    filename: "marathon-events/yeontan-run.png",
    mimeType: "image/png",
    figmaNodeId: "490:2884",
    figmaNodeName: "연탄런",
  },
  "shinhan-donghaeng-run": {
    filename: "marathon-events/shinhan-donghaeng-run.png",
    mimeType: "image/png",
    figmaNodeId: "27:309",
    figmaNodeName: "신한동행런",
  },
  "santa-claus-run": {
    filename: "marathon-events/santa-claus-run.png",
    mimeType: "image/png",
    figmaNodeId: "27:308",
    figmaNodeName: "산타클로스런",
  },
  "seokchon-night-run": {
    filename: "marathon-events/seokchon-night-run.png",
    mimeType: "image/png",
    figmaNodeId: "27:307",
    figmaNodeName: "석촌호수나이트런",
  },
  "hangang-night-run": {
    filename: "marathon-events/hangang-night-run.png",
    mimeType: "image/png",
    figmaNodeId: "27:306",
    figmaNodeName: "한강나이트런",
  },
  "bomkkot-run": {
    filename: "marathon-events/bomkkot-run.png",
    mimeType: "image/png",
    figmaNodeId: "27:305",
    figmaNodeName: "봄꽃런",
  },
  "animal-run": {
    filename: "marathon-events/animal-run.png",
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
