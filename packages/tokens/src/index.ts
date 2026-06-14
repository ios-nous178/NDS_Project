export {
  BRAND_PROFILES,
  BRAND_SLUGS,
  BRAND_ALIAS_MAP,
  resolveBrandSlug,
  getBrandProfile,
} from "./brand-profiles.js";
export type {
  BrandSlug,
  BrandProfile,
  BrandCtaPolicy,
  BrandModalPolicy,
  BrandNotificationPolicy,
} from "./brand-profiles.js";
export {
  colors,
  neutral,
  coolGray,
  blue,
  magenta,
  yellow,
  red,
  coralRed,
  green,
  amber,
} from "./colors.js";
export { cv } from "./cssVar.js";
export type { CssVarRef } from "./cssVar.js";
export { semanticGuide, getSemanticGuide } from "./guide.js";
export type { GuideStatus, GuideMeta } from "./guide.js";
export { typography, fontFamily, fontWeight, typeScale } from "./typography.js";
export type { TypeStyle } from "./typography.js";
export {
  spacing,
  gap,
  gapTitle,
  inset,
  radius,
  shape,
  borderWidth,
  stroke,
  sizing,
  grid,
} from "./spacing.js";
export { elevation, shadow, zIndex, elevationLevel } from "./elevation.js";
export type { ShadowLevel, ElevationLevelName } from "./elevation.js";
export { motion, duration, easing, transition } from "./motion.js";
export {
  BRAND_ACTIONS_LAYOUT,
  DEFAULT_ACTIONS_LAYOUT,
  resolveActionsLayout,
} from "./actionsLayout.js";
export type { ActionsLayout } from "./actionsLayout.js";

// Brand themes
export type {
  BrandTheme,
  SemanticColors,
  ColorScale,
  TypographyOverrides,
  SpacingOverrides,
  ElevationOverrides,
} from "./brands/index.js";
export {
  nudgeEapTheme,
  nudgeEapSemantic,
  trostTheme,
  genietTheme,
  cashwalkBizTheme,
  runmileTheme,
} from "./brands/index.js";
export type {
  NudgeEapSemanticTokens,
  TrostSemanticTokens,
  GenietSemanticTokens,
  CashwalkBizSemanticTokens,
  RunmileSemanticTokens,
} from "./brands/index.js";
export {
  trostYellow,
  trostCobalt,
  trostPink,
  trostNeutral,
  trostStatus,
  trostSemantic,
} from "./brands/index.js";
export {
  genietMint,
  genietRed,
  genietYellow,
  genietBlue,
  genietPurple,
  genietGreen,
  genietGray,
  genietNeutral,
  genietStatus,
  genietSemantic,
} from "./brands/index.js";
export {
  cashwalkBizCommon,
  cashwalkBizNeutral,
  cashwalkBizYellow,
  cashwalkBizCoralRed,
  cashwalkBizBlue,
  cashwalkBizGreen,
  cashwalkBizBrown,
  cashwalkBizStatus,
  cashwalkBizSemantic,
} from "./brands/index.js";
export {
  runmileOrange,
  runmileBlue,
  runmileRed,
  runmileGray,
  runmileNeutral,
  runmileStatus,
  runmileSemantic,
} from "./brands/index.js";
