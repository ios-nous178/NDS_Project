import React from "react";

export interface GenietCouponIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietCouponIcon = React.forwardRef<SVGSVGElement, GenietCouponIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <mask id="a" fill="#fff">
    <path d="M20 4a3 3 0 0 1 3 3v3a2 2 0 1 0 0 4v3a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3v-3a2 2 0 1 0 0-4V7a3 3 0 0 1 3-3h16Z"/>
  </mask>
  <path fill="currentColor" d="M23 10v1.5a1.5 1.5 0 0 0 1.5-1.5H23Zm0 4h1.5a1.5 1.5 0 0 0-1.5-1.5V14Zm-3 6v1.5V20ZM1 14v-1.5A1.5 1.5 0 0 0-.5 14H1Zm0-4H-.5A1.5 1.5 0 0 0 1 11.5V10Zm3-6V2.5 4Zm16 0v1.5A1.5 1.5 0 0 1 21.5 7h3A4.5 4.5 0 0 0 20 2.5V4Zm3 3h-1.5v3h3V7H23Zm0 3V8.5a3.5 3.5 0 0 0-3.5 3.5h3a.5.5 0 0 1 .5-.5V10Zm-2 2h-1.5a3.5 3.5 0 0 0 3.5 3.5v-3a.5.5 0 0 1-.5-.5H21Zm2 2h-1.5v3h3v-3H23Zm0 3h-1.5a1.5 1.5 0 0 1-1.5 1.5v3a4.5 4.5 0 0 0 4.5-4.5H23Zm-3 3v-1.5H4v3h16V20ZM4 20v-1.5A1.5 1.5 0 0 1 2.5 17h-3A4.5 4.5 0 0 0 4 21.5V20Zm-3-3h1.5v-3h-3v3H1Zm0-3v1.5A3.5 3.5 0 0 0 4.5 12h-3a.5.5 0 0 1-.5.5V14Zm2-2h1.5A3.5 3.5 0 0 0 1 8.5v3a.5.5 0 0 1 .5.5H3Zm-2-2h1.5V7h-3v3H1Zm0-3h1.5A1.5 1.5 0 0 1 4 5.5v-3A4.5 4.5 0 0 0-.5 7H1Zm3-3v1.5h16v-3H4V4Z" mask="url(#a)"/>
  <path fill="currentColor" d="M12.152 16.178h-.158c-.555-.022-1.216-.051-2.012-.528-1.824-1.092-1.996-2.938-1.981-3.678.022-1.43.675-2.66 1.801-3.379 1.314-.85 3.618-.88 5.18.528.36.322.383.864.052 1.216a.895.895 0 0 1-1.246.052c-.886-.8-2.267-.829-3.01-.352-.638.41-.99 1.106-1.006 1.964-.007.557.128 1.575 1.141 2.191.398.242.706.256 1.096.271.69.037 1.426-.264 1.607-.6a.894.894 0 0 0 .112-.477v-.088h-1.344a.877.877 0 0 1-.885-.865c0-.476.398-.865.885-.865h2.23c.488 0 .886.389.886.865v.93c.007.433-.09.88-.308 1.29-.54 1.034-1.9 1.547-3.025 1.547l-.015-.022Z"/>
    </svg>
  )
);

GenietCouponIcon.displayName = "GenietCouponIcon";
