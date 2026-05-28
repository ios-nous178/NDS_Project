import React from "react";

export interface RunmileArrowDownIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileArrowDownIcon = React.forwardRef<SVGSVGElement, RunmileArrowDownIconProps>(
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
      <g transform="translate(4.15 7.65) rotate(-90) scale(-1 1)">
    <path id="ic_arrow_down" d="M0.248959 0.248959C0.580905 -0.0829864 1.11819 -0.0829864 1.45013 0.248959L8.45013 7.24896C8.78208 7.5809 8.78208 8.11819 8.45013 8.45013L1.45013 15.4501C1.11819 15.7821 0.580905 15.7821 0.248959 15.4501C-0.0829864 15.1182 -0.0829864 14.5809 0.248959 14.249L6.64837 7.84955L0.248959 1.45013C-0.0829864 1.11819 -0.0829864 0.580905 0.248959 0.248959Z" fill="currentColor"/>
  </g>
    </svg>
  )
);

RunmileArrowDownIcon.displayName = "RunmileArrowDownIcon";
