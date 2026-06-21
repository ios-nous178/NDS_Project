export {
  PROJECT_PROFILES,
  PROJECT_SLUGS,
  PROJECT_ALIAS_MAP,
  resolveProjectSlug,
  getProjectProfile,
} from "./project-profiles.js";
export type {
  ProjectSlug,
  ProjectProfile,
  ProjectCtaPolicy,
  ProjectModalPolicy,
  ProjectNotificationPolicy,
} from "./project-profiles.js";
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
  PROJECT_ACTIONS_LAYOUT,
  DEFAULT_ACTIONS_LAYOUT,
  resolveActionsLayout,
} from "./actionsLayout.js";
export type { ActionsLayout } from "./actionsLayout.js";

// Project themes
export type {
  ProjectTheme,
  SemanticColors,
  ColorScale,
  TypographyOverrides,
  SpacingOverrides,
  ElevationOverrides,
} from "./projects/index.js";
export {
  nudgeEapTheme,
  nudgeEapSemantic,
  trostTheme,
  genietTheme,
  cashwalkBizTheme,
  cashwalkTheme,
  runmileTheme,
  teamworkTheme,
  teamworkSemantic,
  dongneSanchaekTheme,
  dongneSanchaekSemantic,
} from "./projects/index.js";
export type {
  NudgeEapSemanticTokens,
  TrostSemanticTokens,
  GenietSemanticTokens,
  CashwalkBizSemanticTokens,
  CashwalkSemanticTokens,
  RunmileSemanticTokens,
} from "./projects/index.js";
export {
  trostYellow,
  trostCobalt,
  trostPink,
  trostNeutral,
  trostRed,
  trostBlue,
  trostGreen,
  trostSemantic,
} from "./projects/index.js";
export {
  genietMint,
  genietRed,
  genietYellow,
  genietBlue,
  genietPurple,
  genietGreen,
  genietGray,
  genietNeutral,
  genietSemantic,
} from "./projects/index.js";
export {
  cashwalkBizCommon,
  cashwalkBizNeutral,
  cashwalkBizYellow,
  cashwalkBizCoralRed,
  cashwalkBizBlue,
  cashwalkBizGreen,
  cashwalkBizBrown,
  cashwalkBizSemantic,
} from "./projects/index.js";
export {
  cashwalkCommon,
  cashwalkNeutral,
  cashwalkYellow,
  cashwalkCoralRed,
  cashwalkBlue,
  cashwalkCornflower,
  cashwalkIndigo,
  cashwalkGreen,
  cashwalkBrown,
  cashwalkSemantic,
} from "./projects/index.js";
export {
  runmileOrange,
  runmileBlue,
  runmileRed,
  runmileGray,
  runmileNeutral,
  runmileSemantic,
} from "./projects/index.js";
