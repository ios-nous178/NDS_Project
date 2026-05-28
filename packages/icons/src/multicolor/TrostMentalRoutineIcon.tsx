import React from "react";

export interface TrostMentalRoutineIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMentalRoutineIcon = React.forwardRef<SVGSVGElement, TrostMentalRoutineIconProps>(
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
<g clipPath="url(#xb6ayslfza)">
        <path d="M30 6.844C30 4.169 27.861 2 25.223 2 23.393 2 21.802 3.044 21 4.577L27.678 11A4.855 4.855 0 0 0 30 6.844zM2 6.844C2 4.169 4.139 2 6.777 2 8.607 2 10.198 3.044 11 4.577L4.322 11A4.855 4.855 0 0 1 2 6.844z" fill="currentColor"/>
        <circle cx="16" cy="16" r="11.25" fill="#fff" stroke="currentColor" strokeWidth="3.5"/>
        <path d="M16 11v5.4l3 2.6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
        <clipPath id="xb6ayslfza">
</clipPath>
    </defs>
</g>
    </svg>
  )
);

TrostMentalRoutineIcon.displayName = "TrostMentalRoutineIcon";
