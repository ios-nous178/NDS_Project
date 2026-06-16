import React from "react";

export interface RunmileSearchDeleteIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileSearchDeleteIcon = React.forwardRef<SVGSVGElement, RunmileSearchDeleteIconProps>(
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
      <g transform="translate(2 2)">
    <g id="ic_serachclear">
    <circle id="Ellipse 1" cx="10" cy="10" r="10" fill="currentColor" fill-opacity="0.4"/>
    <path id="Vector 1 (Stroke)" d="M6.39941 6.39941C6.73136 6.06747 7.26864 6.06747 7.60059 6.39941L13.6006 12.3994C13.9325 12.7314 13.9325 13.2686 13.6006 13.6006C13.2686 13.9325 12.7314 13.9325 12.3994 13.6006L6.39941 7.60059C6.06747 7.26864 6.06747 6.73136 6.39941 6.39941Z" fill="currentColor"/>
    <path id="Vector 2 (Stroke)" d="M13.6006 6.39941C13.2686 6.06747 12.7314 6.06747 12.3994 6.39941L6.39941 12.3994C6.06747 12.7314 6.06747 13.2686 6.39941 13.6006C6.73136 13.9325 7.26864 13.9325 7.60059 13.6006L13.6006 7.60059C13.9325 7.26864 13.9325 6.73136 13.6006 6.39941Z" fill="currentColor"/>
    </g>
  </g>
    </svg>
  )
);

RunmileSearchDeleteIcon.displayName = "RunmileSearchDeleteIcon";
