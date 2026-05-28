import React from "react";

export interface RunmileUserActiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileUserActiveIcon = React.forwardRef<SVGSVGElement, RunmileUserActiveIconProps>(
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
      <g transform="translate(3.4992 2.94)">
    <g id="ic_user_fill">
    <path id="Ellipse 2" d="M8.5 9.82812C4.98001 9.82812 1.95975 11.9678 0.668875 15.0174C-0.0630877 16.7466 1.52223 18.3281 3.4 18.3281H13.6C15.4778 18.3281 17.0631 16.7466 16.3311 15.0174C15.0402 11.9678 12.02 9.82812 8.5 9.82812Z" fill="currentColor"/>
    <g id="Group">
    <path id="Oval" d="M8.5 8.5C10.8472 8.5 12.75 6.59721 12.75 4.25C12.75 1.90279 10.8472 0 8.5 0C6.15279 0 4.25 1.90279 4.25 4.25C4.25 6.59721 6.15279 8.5 8.5 8.5Z" fill="currentColor"/>
    </g>
    </g>
  </g>
    </svg>
  )
);

RunmileUserActiveIcon.displayName = "RunmileUserActiveIcon";
