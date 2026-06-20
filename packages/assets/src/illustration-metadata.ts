/**
 * 콘텐츠 일러스트 메타데이터 (dataUri 제외).
 *
 * Runmile Figma library (file `Wd1BqKFPvrlLORr7E6EwjB`) 의 콘텐츠 영역 강조용
 * 일러스트. 이미지 네이밍 가이드(5030:979)의 용도중심 5분류 중 **illust** 카테고리.
 * 폴더: `project/runmile/illust/`.
 *
 * 빈상태·로딩·에러·알람 등 "상태"는 별도 **state** 카테고리로 분리됨
 * → `state-image-metadata.ts` (getStateImage). 마라톤 행사 일러스트는
 * `marathon-event-metadata.ts` (illust/event-*).
 *
 * raster PNG (사진/일러스트) 라 dataUri 미제공 — 파일 호스팅 필수.
 * community/shoe/qna 는 1x/@2x/@3x 재export(140×140 기준), chatting 은 1x 만.
 *
 * Figma 원본 노드 이름의 오타는 의도적으로 보존 (외부 컨벤션 호환):
 *   - `commnunity` (commUnity 아님)
 */

export type IllustrationId =
  | "shoe"
  | "qna"
  | "community"
  | "chatting-default"
  | "chatting-white";

export interface IllustrationMeta {
  /** 1x base PNG. */
  filename: string;
  /** 2x PNG (있을 때). */
  filename2x?: string;
  /** 3x PNG (있을 때). */
  filename3x?: string;
  mimeType: "image/png";
  /** Figma node id. */
  figmaNodeId: string;
  /** 원본 Figma 노드 이름 (오타 포함, 디자이너와의 소통 시 참조). */
  figmaNodeName: string;
}

export const ILLUSTRATION_METADATA: Record<IllustrationId, IllustrationMeta> = {
  shoe: {
    filename: "project/runmile/illust/shoe.png",
    filename2x: "project/runmile/illust/shoe@2x.png",
    filename3x: "project/runmile/illust/shoe@3x.png",
    mimeType: "image/png",
    figmaNodeId: "230:2016",
    figmaNodeName: "img/shoe",
  },
  qna: {
    filename: "project/runmile/illust/qna.png",
    filename2x: "project/runmile/illust/qna@2x.png",
    filename3x: "project/runmile/illust/qna@3x.png",
    mimeType: "image/png",
    figmaNodeId: "230:2075",
    figmaNodeName: "img/q&a",
  },
  community: {
    filename: "project/runmile/illust/community.png",
    filename2x: "project/runmile/illust/community@2x.png",
    filename3x: "project/runmile/illust/community@3x.png",
    mimeType: "image/png",
    figmaNodeId: "281:1677",
    figmaNodeName: "img/commnunity",
  },
  "chatting-default": {
    filename: "project/runmile/illust/chatting-default.png",
    mimeType: "image/png",
    figmaNodeId: "484:2830",
    figmaNodeName: "img/chatting · color=default",
  },
  "chatting-white": {
    filename: "project/runmile/illust/chatting-white.png",
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
