import React from "react";

export interface TrostMentalMedicineIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMentalMedicineIcon = React.forwardRef<SVGSVGElement, TrostMentalMedicineIconProps>(
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
<g transform="rotate(45 10.293 26.364)">
            <rect fill="currentColor" width="14" height="30" rx="7"/>
            <path d="M7 0a7 7 0 0 1 7 7v8H0V7a7 7 0 0 1 7-7z" fill="currentColor"/>
            <path d="M2.5 10.119V7.63c0-.942.26-1.823.713-2.575A5.019 5.019 0 0 1 5.61 3" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
    </g>
</g>
    </svg>
  )
);

TrostMentalMedicineIcon.displayName = "TrostMentalMedicineIcon";
