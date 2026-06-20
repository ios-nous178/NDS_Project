/**
 * 프로필(avatar) 이미지 메타데이터 (dataUri 제외).
 *
 * Runmile Figma library (file `Wd1BqKFPvrlLORr7E6EwjB`, frame 21:136) 의 사용자
 * 프로필 기본 이미지 12종 + 기본 아바타 1종. 이미지 네이밍 가이드(5030:979)의
 * 용도중심 5분류 중 **avatar** 카테고리. 폴더: `project/runmile/avatar/`.
 *
 * 12종 그리드 + default 를 1x/@2x/@3x PNG 로 재export(전부 image/png). 24×24 슬롯
 * 표시지만 원본은 고밀도라 raster — dataUri 미제공, 파일 호스팅 필수.
 *
 * 외부 소비자는 `@nudge-design/assets/files/project/runmile/avatar/...` 또는 CDN mirror 로 사용.
 */

export type ProfileImageId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "default";

export interface ProfileImageMeta {
  /** 1x base PNG. */
  filename: string;
  /** 2x PNG. */
  filename2x: string;
  /** 3x PNG. */
  filename3x: string;
  mimeType: "image/png";
  figmaNodeId: string;
}

function avatar(id: number | "default", figmaNodeId: string): ProfileImageMeta {
  return {
    filename: `project/runmile/avatar/profile-${id}.png`,
    filename2x: `project/runmile/avatar/profile-${id}@2x.png`,
    filename3x: `project/runmile/avatar/profile-${id}@3x.png`,
    mimeType: "image/png",
    figmaNodeId,
  };
}

export const PROFILE_IMAGE_METADATA: Record<ProfileImageId, ProfileImageMeta> = {
  1: avatar(1, "21:135"),
  2: avatar(2, "21:134"),
  3: avatar(3, "21:133"),
  4: avatar(4, "21:132"),
  5: avatar(5, "21:131"),
  6: avatar(6, "21:130"),
  7: avatar(7, "21:129"),
  8: avatar(8, "52:836"),
  9: avatar(9, "510:2667"),
  10: avatar(10, "510:2674"),
  11: avatar(11, "510:2681"),
  12: avatar(12, "510:2688"),
  // 기본 아바타 (미지정 사용자) — 디자이너 재export, 노드는 avatar 그리드 프레임 기준.
  default: avatar("default", "21:136"),
};

export const PROFILE_IMAGE_IDS: readonly ProfileImageId[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, "default",
];

/** 한 프로필(avatar) 이미지의 메타데이터 조회. */
export function getProfileImage(id: ProfileImageId): ProfileImageMeta | undefined {
  return PROFILE_IMAGE_METADATA[id];
}
