/**
 * 디폴트 일러스트 메타데이터 (dataUri 제외).
 *
 * Runmile Figma library (file `Wd1BqKFPvrlLORr7E6EwjB`, section 55:955) 의
 * 빈 상태 / 에러 / 알람 등 화면용 일러스트 10종. 모두 140×140 PNG (flatten).
 *
 * raster PNG (사진/일러스트, ~50KB each) 라 dataUri 미제공 — 파일 호스팅 필수.
 *
 * 카테고리:
 *   - 에러/빈상태: page-error, error, no-result (default/white), q&a
 *   - 활동: shoe, community, alram, chatting (default/white)
 *
 * Figma 원본 노드 이름의 오타는 의도적으로 보존 (외부 컨벤션 호환):
 *   - `commnunity` (commUnity 아님)
 *   - `alram` (alaRm 아님)
 */

export type IllustrationId =
  | "page-error"
  | "error"
  | "no-result-default"
  | "no-result-white"
  | "shoe"
  | "qa"
  | "community"
  | "alram"
  | "chatting-default"
  | "chatting-white";

export interface IllustrationMeta {
  filename: string;
  mimeType: "image/png";
  /** Figma node id. */
  figmaNodeId: string;
  /** 원본 Figma 노드 이름 (오타 포함, 디자이너와의 소통 시 참조). */
  figmaNodeName: string;
}

export const ILLUSTRATION_METADATA: Record<IllustrationId, IllustrationMeta> = {
  "page-error": {
    filename: "illustrations/page-error.png",
    mimeType: "image/png",
    figmaNodeId: "55:969",
    figmaNodeName: "img/page-error",
  },
  error: {
    filename: "illustrations/error.png",
    mimeType: "image/png",
    figmaNodeId: "538:2281",
    figmaNodeName: "img/error",
  },
  "no-result-default": {
    filename: "illustrations/no-result-default.png",
    mimeType: "image/png",
    figmaNodeId: "202:657",
    figmaNodeName: "img/no-result · color=default",
  },
  "no-result-white": {
    filename: "illustrations/no-result-white.png",
    mimeType: "image/png",
    figmaNodeId: "790:839",
    figmaNodeName: "img/no-result · color=whtie",
  },
  shoe: {
    filename: "illustrations/shoe.png",
    mimeType: "image/png",
    figmaNodeId: "230:2016",
    figmaNodeName: "img/shoe",
  },
  qa: {
    filename: "illustrations/qa.png",
    mimeType: "image/png",
    figmaNodeId: "230:2075",
    figmaNodeName: "img/q&a",
  },
  community: {
    filename: "illustrations/community.png",
    mimeType: "image/png",
    figmaNodeId: "281:1677",
    figmaNodeName: "img/commnunity",
  },
  alram: {
    filename: "illustrations/alram.png",
    mimeType: "image/png",
    figmaNodeId: "498:2473",
    figmaNodeName: "img/alram",
  },
  "chatting-default": {
    filename: "illustrations/chatting-default.png",
    mimeType: "image/png",
    figmaNodeId: "484:2830",
    figmaNodeName: "img/chatting · color=default",
  },
  "chatting-white": {
    filename: "illustrations/chatting-white.png",
    mimeType: "image/png",
    figmaNodeId: "522:3258",
    figmaNodeName: "img/chatting · color=white",
  },
};

export const ILLUSTRATION_IDS: readonly IllustrationId[] = Object.keys(
  ILLUSTRATION_METADATA,
) as IllustrationId[];

/** 한 일러스트의 메타데이터 조회. */
export function getIllustration(id: IllustrationId): IllustrationMeta | undefined {
  return ILLUSTRATION_METADATA[id];
}
