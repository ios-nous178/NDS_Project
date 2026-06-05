/**
 * 캐시워크 포 비즈니스(캐포비) admin 화면 자산 메타데이터 (dataUri 제외).
 *
 * Cashwalk for Business Library (file `7dCJU5lNPfgcAjFPwbbLIu`) 의 admin 전용
 * 일러스트/이미지 자산. raster PNG 라 dataUri 미제공 — 파일 호스팅 필수.
 * 외부 소비자는 `@nudge-design/assets/files/{filename}` 로 참조.
 *
 * - charge-alert-bell: '광고비가 곧 소진됩니다' 충전 안내 배너 좌측 종 일러스트.
 *   배너 스펙은 get_guide({ topic: 'pattern:cashwalk-biz-admin-alert-banner' }).
 *   단일 해상도(@3x 미제공) — 디자이너가 2x/3x 원본 줄 때 후속 보강.
 */

export type CashwalkBizAssetId = "charge-alert-bell";

export interface CashwalkBizAssetMeta {
  /** `{category}/{id}.png` — src 기준 상대 경로(= 호스팅 파일 경로). */
  filename: string;
  mimeType: "image/png";
  /** 원본 픽셀 크기. */
  width: number;
  height: number;
  /** Figma 노드 id. */
  figmaNodeId: string;
  /** 원본 Figma 노드 이름 (디자이너 소통용). */
  figmaNodeName: string;
}

export const CASHWALK_BIZ_ASSET_METADATA: Record<CashwalkBizAssetId, CashwalkBizAssetMeta> = {
  "charge-alert-bell": {
    filename: "cashwalk-biz/charge-alert-bell.png",
    mimeType: "image/png",
    width: 400,
    height: 413,
    figmaNodeId: "3001:21381",
    figmaNodeName: "img/alarm",
  },
};
