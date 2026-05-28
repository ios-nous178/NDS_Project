import React from "react";

export interface TrostMentalDepressionIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMentalDepressionIcon = React.forwardRef<SVGSVGElement, TrostMentalDepressionIconProps>(
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
      <g transform="scale(0.75 0.75)">
<g fill="none" fillRule="evenodd">
<path d="M22.686 3C18.51 3.04 17.35 5.772 16 8.026 14.65 5.772 13.49 3.04 9.314 3 3.38 3.182 1.24 8.04 1.41 12.24c0 5.11 5.819 10.69 10.699 14.475 2.249 1.747 5.531 1.747 7.78 0C24.77 22.93 30.59 17.35 30.59 12.24c.171-4.2-1.97-9.058-7.903-9.24z" fill="currentColor" fillRule="nonzero"/>
        <path stroke="#FFF" strokeWidth="1.684" strokeLinecap="round" strokeLinejoin="round" d="M16.073 6.204 13.39 10.93l4.194 3.981-4.194 4.647 4.194 4.216L13.39 29"/>
    </g>
</g>
    </svg>
  )
);

TrostMentalDepressionIcon.displayName = "TrostMentalDepressionIcon";
