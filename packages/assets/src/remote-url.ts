/**
 * Remote asset URL helpers.
 *
 * `baseUrl` should point at the `files` directory, e.g.
 * https://asset.nudge-dev.com/nds-assets/assets/0.0.1/files
 */

export const DEFAULT_ASSET_CDN_ORIGIN = "https://asset.nudge-dev.com";
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
