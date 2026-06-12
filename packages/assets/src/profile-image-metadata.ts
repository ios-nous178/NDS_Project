/**
 * 프로필 이미지 메타데이터 (dataUri 제외).
 *
 * Runmile Figma library (file `Wd1BqKFPvrlLORr7E6EwjB`, frame 21:136) 의 사용자
 * 프로필 기본 이미지 12종. 24×24 슬롯.
 *
 * Export 출처:
 *   - profile-1, 2:  단일 raster export (1, 2 는 원본 JPEG 사진, 큼)
 *   - profile-3~8:   Figma 화면 screenshot flatten (composite layer, 작음 ~1.5KB)
 *   - profile-9~12:  단일 raster export (PNG 일러스트, 큼)
 *
 * 1, 2, 9~12 는 원본 사이즈가 큼 (~600KB max). 24×24 로 표시하지만 원본은
 * 800×727 같은 사이즈. 파일 호스팅 필수 — dataUri 미제공.
 *
 * 3~8 은 screenshot flatten 이라 24×24 크기 그대로 (~1.5KB). 작아서 base64 인라인
 * 가능하지만, 카테고리 일관성을 위해 마찬가지로 파일 호스팅 권장.
 *
 * 외부 소비자는 `@nudge-design/assets/files/brand/runmile/profiles/...` 또는 CDN mirror 로 사용.
 */

export type ProfileImageId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type ProfileImageMimeType = "image/jpeg" | "image/png";

export interface ProfileImageMeta {
  filename: string;
  mimeType: ProfileImageMimeType;
  figmaNodeId: string;
  /** 단일 export (single) vs Figma screenshot flatten (composite). */
  source: "single-raster" | "screenshot-flatten";
}

export const PROFILE_IMAGE_METADATA: Record<ProfileImageId, ProfileImageMeta> = {
  1: {
    filename: "brand/runmile/profiles/profile-1.jpg",
    mimeType: "image/jpeg",
    figmaNodeId: "21:135",
    source: "single-raster",
  },
  2: {
    filename: "brand/runmile/profiles/profile-2.jpg",
    mimeType: "image/jpeg",
    figmaNodeId: "21:134",
    source: "single-raster",
  },
  3: {
    filename: "brand/runmile/profiles/profile-3.png",
    mimeType: "image/png",
    figmaNodeId: "21:133",
    source: "screenshot-flatten",
  },
  4: {
    filename: "brand/runmile/profiles/profile-4.png",
    mimeType: "image/png",
    figmaNodeId: "21:132",
    source: "screenshot-flatten",
  },
  5: {
    filename: "brand/runmile/profiles/profile-5.png",
    mimeType: "image/png",
    figmaNodeId: "21:131",
    source: "screenshot-flatten",
  },
  6: {
    filename: "brand/runmile/profiles/profile-6.png",
    mimeType: "image/png",
    figmaNodeId: "21:130",
    source: "screenshot-flatten",
  },
  7: {
    filename: "brand/runmile/profiles/profile-7.png",
    mimeType: "image/png",
    figmaNodeId: "21:129",
    source: "screenshot-flatten",
  },
  8: {
    filename: "brand/runmile/profiles/profile-8.png",
    mimeType: "image/png",
    figmaNodeId: "52:836",
    source: "screenshot-flatten",
  },
  9: {
    filename: "brand/runmile/profiles/profile-9.png",
    mimeType: "image/png",
    figmaNodeId: "510:2667",
    source: "single-raster",
  },
  10: {
    filename: "brand/runmile/profiles/profile-10.png",
    mimeType: "image/png",
    figmaNodeId: "510:2674",
    source: "single-raster",
  },
  11: {
    filename: "brand/runmile/profiles/profile-11.png",
    mimeType: "image/png",
    figmaNodeId: "510:2681",
    source: "single-raster",
  },
  12: {
    filename: "brand/runmile/profiles/profile-12.png",
    mimeType: "image/png",
    figmaNodeId: "510:2688",
    source: "single-raster",
  },
};

export const PROFILE_IMAGE_IDS: readonly ProfileImageId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/** 한 프로필 이미지의 메타데이터 조회. */
export function getProfileImage(id: ProfileImageId): ProfileImageMeta | undefined {
  return PROFILE_IMAGE_METADATA[id];
}
