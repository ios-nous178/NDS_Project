import React from "react";

export interface GenietArrowRightLineIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietArrowRightLineIcon = React.forwardRef<SVGSVGElement, GenietArrowRightLineIconProps>(
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
      <path fill="currentColor" d="M15.45 4.4a.849.849 0 0 0-1.2 0l-7 7a.849.849 0 0 0 0 1.2l7 7a.849.849 0 1 0 1.2-1.2L9.05 12l6.4-6.4a.849.849 0 0 0 0-1.2Z"/>
    </svg>
  )
);

GenietArrowRightLineIcon.displayName = "GenietArrowRightLineIcon";
