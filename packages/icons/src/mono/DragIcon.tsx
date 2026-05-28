import React from "react";

export interface DragIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const DragIcon = React.forwardRef<SVGSVGElement, DragIconProps>(
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
      <g transform="translate(4 5)">
    <g id="menu (1)">
<path id="Path" d="M1 7H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path id="Path_2" d="M1 1H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path id="Path_3" d="M1 13H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</g>
  </g>
    </svg>
  )
);

DragIcon.displayName = "DragIcon";
