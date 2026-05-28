import React from "react";

export interface TrostMentalMbtiIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMentalMbtiIcon = React.forwardRef<SVGSVGElement, TrostMentalMbtiIconProps>(
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
      <g transform="scale(0.705882 0.685714)">
<g fill="none" fillRule="evenodd">
        <path d="M0 1h32v32H0z"/>
        <rect fill="currentColor" x="3" y="3" width="24" height="27" rx="3"/>
        <rect fill="#FFF" x="5" y="5" width="20" height="23" rx="1.5"/>
        <g transform="translate(8.5 9)" fill="currentColor">
            <rect width="13" height="1.5" rx=".75"/>
            <rect y="4.5" width="13" height="1.5" rx=".75"/>
            <rect y="9" width="13" height="1.5" rx=".75"/>
            <rect y="13.5" width="13" height="1.5" rx=".75"/>
        </g>
        <rect fill="currentColor" x="10" y="2" width="10" height="4" rx="1.5"/>
        <rect fill="currentColor" x="12.5" width="5" height="4" rx="2"/>
        <g transform="translate(17.011 18)" stroke="#FFF" strokeWidth="1.5">
            <circle fill="currentColor" cx="7.5" cy="7.5" r="8.25"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.026 6.793 9.5l3.707-4"/>
        </g>
    </g>
</g>
    </svg>
  )
);

TrostMentalMbtiIcon.displayName = "TrostMentalMbtiIcon";
