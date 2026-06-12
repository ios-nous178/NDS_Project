/**
 * Remote asset URL helpers.
 *
 * `baseUrl` should point at the `files` directory, e.g.
 * https://nudge-design-assets.s3.ap-northeast-2.amazonaws.com/nds-assets/assets/0.0.1/files
 *
 * 임시로 S3 직접 주소를 기본값으로 사용한다. asset.nudge-dev.com CDN 연결이
 * 확정되면 되돌릴 것.
 */

export const DEFAULT_ASSET_CDN_ORIGIN = "https://nudge-design-assets.s3.ap-northeast-2.amazonaws.com";
export const DEFAULT_ASSET_CDN_PREFIX = "/nds-assets";

export function joinAssetUrl(baseUrl: string, filename: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/${filename.replace(/^\/+/, "")}`;
}

export function assetVersionBaseUrl(version: string, origin = DEFAULT_ASSET_CDN_ORIGIN): string {
  return `${origin.replace(/\/+$/, "")}${DEFAULT_ASSET_CDN_PREFIX}/assets/${version}/files`;
}

export function assetChannelBaseUrl(channel: string, origin = DEFAULT_ASSET_CDN_ORIGIN): string {
  return `${origin.replace(/\/+$/, "")}${DEFAULT_ASSET_CDN_PREFIX}/channels/${channel}/files`;
}
