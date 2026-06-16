import React from "react";

export interface TrostStarHalfIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostStarHalfIcon = React.forwardRef<SVGSVGElement, TrostStarHalfIconProps>(
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
      <path fillRule="evenodd" clipRule="evenodd" d="M8.58073 8.406L1.07812 9.45981L6.50682 14.5864L5.22595 21.8256L11.9407 18.4071L18.6529 21.8256L17.372 14.5864L22.8007 9.45981L15.2981 8.406L11.9407 1.81836L8.58073 8.406Z" fill="#D8D8D8"/>
<mask id="mask0_5022_1422" maskUnits="userSpaceOnUse" x="1" y="1" width="11" height="22">
<rect x="1" y="1" width="11" height="22" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask0_5022_1422)">
<path fillRule="evenodd" clipRule="evenodd" d="M8.58073 8.406L1.07812 9.45981L6.50682 14.5864L5.22595 21.8256L11.9407 18.4071L18.6529 21.8256L17.372 14.5864L22.8007 9.45981L15.2981 8.406L11.9407 1.81836L8.58073 8.406Z" fill="#FFC107"/>
</g>
    </svg>
  )
);

TrostStarHalfIcon.displayName = "TrostStarHalfIcon";
