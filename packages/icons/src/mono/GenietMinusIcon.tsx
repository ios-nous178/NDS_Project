import React from "react";

export interface GenietMinusIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietMinusIcon = React.forwardRef<SVGSVGElement, GenietMinusIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="964.58 597.58 20.83 20.83"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <g id="ic_minus">
<path id="Vector 324 (Stroke)" d="M967 607.25L983 607.25C983.414 607.25 983.75 607.586 983.75 608C983.75 608.414 983.414 608.75 983 608.75L967 608.75C966.586 608.75 966.25 608.414 966.25 608C966.25 607.586 966.586 607.25 967 607.25Z" fill="currentColor"/>
</g>
    </svg>
  )
);

GenietMinusIcon.displayName = "GenietMinusIcon";
