import React from "react";

export interface GenietSearchDeleteIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietSearchDeleteIcon = React.forwardRef<SVGSVGElement, GenietSearchDeleteIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="-1.90 -1.90 23.81 23.81"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <g transform="translate(2 2)">
    <circle cx="10" cy="10" r="10" fill="currentColor" fill-opacity="0.4"/>
    <path d="M13.33361 5.555582C13.64043 5.248757 14.13789 5.248758 14.44472 5.555583C14.75154 5.862408 14.75154 6.35987 14.44472 6.66669L6.66694 14.44447C6.36011 14.7513 5.862651 14.7513 5.555827 14.44447C5.249002 14.13765 5.249002 13.64019 5.555827 13.33336L13.33361 5.555582Z" fill="currentColor"/>
    <path d="M5.555555 6.66683C5.24873 6.36 5.248731 5.862543 5.555556 5.555718C5.862381 5.248893 6.35984 5.248894 6.66667 5.555719L14.44445 13.3335C14.75127 13.64032 14.75127 14.13778 14.44444 14.44461C14.13762 14.75143 13.64016 14.75143 13.33333 14.44461L5.555555 6.66683Z" fill="currentColor"/>
  </g>
    </svg>
  )
);

GenietSearchDeleteIcon.displayName = "GenietSearchDeleteIcon";
