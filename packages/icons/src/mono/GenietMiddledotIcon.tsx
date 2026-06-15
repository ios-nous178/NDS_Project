import React from "react";

export interface GenietMiddledotIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietMiddledotIcon = React.forwardRef<SVGSVGElement, GenietMiddledotIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="558.71 1304.71 28.57 28.57"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <g id="ic/middledot">
<circle id="Ellipse 512" cx="573" cy="1319" r="12" fill="currentColor"/>
</g>
    </svg>
  )
);

GenietMiddledotIcon.displayName = "GenietMiddledotIcon";
