import React from "react";

export interface TrostMentalLocationHospitalIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMentalLocationHospitalIcon = React.forwardRef<SVGSVGElement, TrostMentalLocationHospitalIconProps>(
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
<ellipse fill="currentColor" cx="16" cy="29" rx="7" ry="2"/>
        <path d="M16 29c2.493 0 11-9.925 11-16 0-6.075-4.925-11-11-11S5 6.925 5 13s8.507 16 11 16z" fill="currentColor"/>
        <g transform="translate(10.5 7.5)" fill="#FFF">
            <rect y="3.75" width="11" height="3.5" rx="1"/>
            <rect transform="rotate(90 5.5 5.5)" y="3.75" width="11" height="3.5" rx="1"/>
        </g>
    </g>
</g>
    </svg>
  )
);

TrostMentalLocationHospitalIcon.displayName = "TrostMentalLocationHospitalIcon";
