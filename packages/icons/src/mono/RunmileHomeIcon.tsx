import React from "react";

export interface RunmileHomeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileHomeIcon = React.forwardRef<SVGSVGElement, RunmileHomeIconProps>(
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
      <g transform="translate(2 1)">
    <g id="ic_home_stroke">
    <path id="Rectangle 2" d="M8.37598 2.45312C9.28447 1.58437 10.7155 1.58437 11.624 2.45312L18.624 9.14844C19.0874 9.59167 19.3495 10.2055 19.3496 10.8467V19C19.3496 20.2979 18.2979 21.3496 17 21.3496H3C1.70213 21.3496 0.650391 20.2979 0.650391 19V10.8467C0.650501 10.2055 0.912592 9.59167 1.37598 9.14844L8.37598 2.45312Z" stroke="currentColor" strokeWidth="1.3"/>
    <path id="Rectangle 3" d="M10 14.6504C11.2979 14.6504 12.3496 15.7021 12.3496 17V21.3496H7.65039V17C7.65039 15.7021 8.70213 14.6504 10 14.6504Z" stroke="currentColor" strokeWidth="1.3"/>
    </g>
  </g>
    </svg>
  )
);

RunmileHomeIcon.displayName = "RunmileHomeIcon";
