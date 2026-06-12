/**
 * Remote icon bundle URL helpers.
 *
 * `baseUrl` should point at an icon version or channel directory, e.g.
 * https://asset.nudge-dev.com/nds-assets/icons/0.0.1
 */

export const DEFAULT_ICON_CDN_ORIGIN = "https://asset.nudge-dev.com";
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
