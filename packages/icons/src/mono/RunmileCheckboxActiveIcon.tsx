import React from "react";

export interface RunmileCheckboxActiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileCheckboxActiveIcon = React.forwardRef<SVGSVGElement, RunmileCheckboxActiveIconProps>(
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
    <g id="storke">
    <rect id="Rectangle 8" x="0.85" y="0.85" width="18.3" height="18.3" rx="3.15" stroke="currentColor" strokeWidth="1.7"/>
    </g>
  </g>
  <g transform="translate(2 2)">
    <g id="ic_checkbox">
    <rect id="Rectangle 8" x="0.85" y="0.85" width="18.3" height="18.3" rx="3.15" stroke="currentColor" strokeWidth="1.7"/>
    </g>
  </g>
    </svg>
  )
);

RunmileCheckboxActiveIcon.displayName = "RunmileCheckboxActiveIcon";
