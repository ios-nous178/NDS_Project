import React from "react";

export interface TrostMentalEventIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMentalEventIcon = React.forwardRef<SVGSVGElement, TrostMentalEventIconProps>(
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
<g clipPath="url(#c6feadlwda)">
        <path fillRule="evenodd" clipRule="evenodd" d="M28.6 19.5v7a2.8 2.8 0 0 1-2.8 2.8H6.2a2.8 2.8 0 0 1-2.8-2.8v-7h25.2z" fill="currentColor"/>
        <path d="M20.55 3.2a3.7 3.7 0 0 1 0 7.4h-5.01l.613-3.675A4.458 4.458 0 0 1 20.55 3.2z" fill="currentColor" stroke="currentColor"/>
        <path d="M11.45 3.2a3.7 3.7 0 0 0 0 7.4h5.01l-.613-3.675A4.458 4.458 0 0 0 11.45 3.2z" fill="currentColor" stroke="currentColor"/>
        <path d="M27.2 9H4.8A2.8 2.8 0 0 0 2 11.8v2.8a2.8 2.8 0 0 0 2.8 2.8h22.4a2.8 2.8 0 0 0 2.8-2.8v-2.8A2.8 2.8 0 0 0 27.2 9z" fill="currentColor"/>
        <path d="M16 19.5v9.8M16 9v8.4" stroke="currentColor" strokeWidth="2.5"/>
    </g>
    <defs>
        <clipPath id="c6feadlwda">
</clipPath>
    </defs>
</g>
    </svg>
  )
);

TrostMentalEventIcon.displayName = "TrostMentalEventIcon";
