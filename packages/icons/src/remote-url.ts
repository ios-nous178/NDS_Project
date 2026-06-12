/**
 * Remote icon bundle URL helpers.
 *
 * `baseUrl` should point at an icon version or channel directory, e.g.
 * https://nudge-design-assets.s3.ap-northeast-2.amazonaws.com/nds-assets/icons/0.0.1
 *
 * 임시로 S3 직접 주소를 기본값으로 사용한다. asset.nudge-dev.com CDN 연결이
 * 확정되면 되돌릴 것.
 */

export const DEFAULT_ICON_CDN_ORIGIN = "https://nudge-design-assets.s3.ap-northeast-2.amazonaws.com";
export const DEFAULT_ICON_CDN_PREFIX = "/nds-assets";

export function joinIconUrl(baseUrl: string, filename: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/${filename.replace(/^\/+/, "")}`;
}

export function iconVersionBaseUrl(version: string, origin = DEFAULT_ICON_CDN_ORIGIN): string {
  return `${origin.replace(/\/+$/, "")}${DEFAULT_ICON_CDN_PREFIX}/icons/${version}`;
}

export function iconChannelBaseUrl(channel: string, origin = DEFAULT_ICON_CDN_ORIGIN): string {
  return `${origin.replace(/\/+$/, "")}${DEFAULT_ICON_CDN_PREFIX}/channels/${channel}`;
}

export function iconVanillaUrl(baseUrl: string): string {
  return joinIconUrl(baseUrl, "vanilla.js");
}

export function iconMonoVanillaUrl(baseUrl: string): string {
  return joinIconUrl(baseUrl, "mono/vanilla.js");
}

export function iconMulticolorVanillaUrl(baseUrl: string): string {
  return joinIconUrl(baseUrl, "multicolor/vanilla.js");
}
