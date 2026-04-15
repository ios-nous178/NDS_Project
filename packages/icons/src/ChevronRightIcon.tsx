import React from "react";

export interface ChevronRightIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ChevronRightIcon = React.forwardRef<SVGSVGElement, ChevronRightIconProps>(
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
      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

ChevronRightIcon.displayName = "ChevronRightIcon";
