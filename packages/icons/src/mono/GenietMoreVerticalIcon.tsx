import React from "react";

export interface GenietMoreVerticalIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietMoreVerticalIcon = React.forwardRef<SVGSVGElement, GenietMoreVerticalIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="474.29 1308.29 21.43 21.43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <g id="ic/more_vertical">
<circle id="Ellipse 509" cx="485" cy="1312" r="2" fill="currentColor"/>
<circle id="Ellipse 510" cx="485" cy="1319" r="2" fill="currentColor"/>
<circle id="Ellipse 511" cx="485" cy="1326" r="2" fill="currentColor"/>
</g>
    </svg>
  )
);

GenietMoreVerticalIcon.displayName = "GenietMoreVerticalIcon";
