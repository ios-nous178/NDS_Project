import React from "react";

export interface CashpobiCheckIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashpobiCheckIcon = React.forwardRef<SVGSVGElement, CashpobiCheckIconProps>(
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
      <g transform="scale(1.420118 1.905412)">
<path id="Path 4" d="M14.8357 0.543547C15.2402 0.108208 15.9211 0.083267 16.3565 0.48784C16.7918 0.892413 16.8167 1.5733 16.4122 2.00864L7.07848 12.0521C6.6528 12.5102 5.92766 12.5102 5.50198 12.0521L0.48784 6.65667C0.083267 6.22133 0.108208 5.54044 0.543547 5.13587C0.978887 4.7313 1.65977 4.75624 2.06434 5.19158L6.29066 9.73844L14.8357 0.543547Z" fill="currentColor" stroke="currentColor" strokeWidth="0.4"/>
</g>
    </svg>
  )
);

CashpobiCheckIcon.displayName = "CashpobiCheckIcon";
