/**
 * 상태(state) 이미지 메타데이터 (dataUri 제외).
 *
 * Runmile Figma library (file `Wd1BqKFPvrlLORr7E6EwjB`) 의 빈상태·에러·알람 등
 * "사용자에게 현재 상태를 알리는" 이미지. 이미지 네이밍 가이드(5030:979)의
 * 용도중심 5분류 중 **state** 카테고리. 폴더: `project/runmile/state/`.
 *
 * 결정 트리상 illust 보다 우선(빈상태에 일러스트가 와도 state). 콘텐츠 일러스트는
 * `illustration-metadata.ts` (getIllustration).
 *
 * raster PNG 라 dataUri 미제공 — 파일 호스팅 필수.
 * alarm-empty/error-default/error 는 1x/@2x/@3x 재export, no-result·page-error 는 1x.
 *
 * Figma 원본 노드 이름의 오타는 의도적으로 보존:
 *   - `alram` (alaRm 아님) · `whtie` (white 아님)
 */

export type StateImageId =
  | "alarm-empty"
  | "error-default"
  | "error"
  | "page-error"
  | "no-result-default"
  | "no-result-white";

export interface StateImageMeta {
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

export const STATE_IMAGE_METADATA: Record<StateImageId, StateImageMeta> = {
  "alarm-empty": {
    filename: "project/runmile/state/alarm-empty.png",
    filename2x: "project/runmile/state/alarm-empty@2x.png",
    filename3x: "project/runmile/state/alarm-empty@3x.png",
    mimeType: "image/png",
    figmaNodeId: "498:2473",
    figmaNodeName: "img/alram",
  },
  "error-default": {
    filename: "project/runmile/state/error-default.png",
    filename2x: "project/runmile/state/error-default@2x.png",
    filename3x: "project/runmile/state/error-default@3x.png",
    mimeType: "image/png",
    figmaNodeId: "538:2281",
    figmaNodeName: "img/error",
  },
  error: {
    filename: "project/runmile/state/error.png",
    filename2x: "project/runmile/state/error@2x.png",
    filename3x: "project/runmile/state/error@3x.png",
    mimeType: "image/png",
    figmaNodeId: "27:310",
    figmaNodeName: "오류 (이미지 로드 실패)",
  },
  "page-error": {
    filename: "project/runmile/state/page-error.png",
    mimeType: "image/png",
    figmaNodeId: "55:969",
    figmaNodeName: "img/page-error",
  },
  "no-result-default": {
    filename: "project/runmile/state/no-result-default.png",
    mimeType: "image/png",
    figmaNodeId: "202:657",
    figmaNodeName: "img/no-result · color=default",
  },
  "no-result-white": {
    filename: "project/runmile/state/no-result-white.png",
    mimeType: "image/png",
    figmaNodeId: "790:839",
    figmaNodeName: "img/no-result · color=whtie",
  },
};

export const STATE_IMAGE_IDS: readonly StateImageId[] = Object.keys(
  STATE_IMAGE_METADATA,
) as StateImageId[];

/** 한 상태 이미지의 메타데이터 조회. */
export function getStateImage(id: StateImageId): StateImageMeta | undefined {
  return STATE_IMAGE_METADATA[id];
}
