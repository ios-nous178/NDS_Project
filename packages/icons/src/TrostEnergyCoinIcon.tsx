import React from "react";

export interface TrostEnergyCoinIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostEnergyCoinIcon = React.forwardRef<SVGSVGElement, TrostEnergyCoinIconProps>(
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
      <g transform="scale(1.2 1.2)">
<g clipPath="url(#443h0xswla)">
        <circle cx="10" cy="10" r="9.167" fill="#333"/>
        <path d="M9.27 4.543c.523-1.014 2.063-.495 1.866.629L10.63 8.06h2.28c.745 0 1.226.789.884 1.452l-3.063 5.945c-.523 1.014-2.063.495-1.866-.629l.506-2.888H7.09a.996.996 0 0 1-.885-1.452L9.27 4.543z" fill="#FFF42E"/>
    </g>
    <defs>
        <clipPath id="443h0xswla">
</clipPath>
    </defs>
</g>
    </svg>
  )
);

TrostEnergyCoinIcon.displayName = "TrostEnergyCoinIcon";
