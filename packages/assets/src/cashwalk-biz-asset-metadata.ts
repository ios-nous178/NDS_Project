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
 * - quiz / channel / message / ads: admin 대시보드 기능 일러스트(퀴즈·채널·메시지·광고).
 *   @2x/@3x retina 풀세트 보유. quiz 는 디자이너 원본의 투명 여백을 trim 해 타이트
 *   프레임으로 편입(140×144 @1x). figma 노드 미수령 — 노드 받으면 figmaNodeId 후속 보강.
 */

export type CashwalkBizAssetId = "charge-alert-bell" | "quiz" | "channel" | "message" | "ads";

export interface CashwalkBizAssetMeta {
  /** `{category}/{id}.png` — src 기준 상대 경로(= 호스팅 파일 경로). */
  filename: string;
  mimeType: "image/png";
  /** 원본 픽셀 크기(@1x base). */
  width: number;
  height: number;
  /** 보유 retina 변형(예: ["2x", "3x"]). base 만 있으면 생략. */
  retina?: ("2x" | "3x")[];
  /** Figma 노드 id. 디자이너에게서 노드를 받지 못한 자산은 생략. */
  figmaNodeId?: string;
  /** 원본 Figma 노드 이름 (디자이너 소통용). */
  figmaNodeName?: string;
}

export const CASHWALK_BIZ_ASSET_METADATA: Record<CashwalkBizAssetId, CashwalkBizAssetMeta> = {
  "charge-alert-bell": {
    filename: "brand/cashwalk-biz/illustrations/charge-alert-bell.png",
    mimeType: "image/png",
    width: 400,
    height: 413,
    figmaNodeId: "3001:21381",
    figmaNodeName: "img/alarm",
  },
  quiz: {
    filename: "brand/cashwalk-biz/illustrations/quiz.png",
    mimeType: "image/png",
    width: 140,
    height: 144,
    retina: ["2x", "3x"],
  },
  channel: {
    filename: "brand/cashwalk-biz/illustrations/channel.png",
    mimeType: "image/png",
    width: 110,
    height: 130,
    retina: ["2x", "3x"],
  },
  message: {
    filename: "brand/cashwalk-biz/illustrations/message.png",
    mimeType: "image/png",
    width: 107,
    height: 120,
    retina: ["2x", "3x"],
  },
  ads: {
    filename: "brand/cashwalk-biz/illustrations/ads.png",
    mimeType: "image/png",
    width: 109,
    height: 139,
    retina: ["2x", "3x"],
  },
};
