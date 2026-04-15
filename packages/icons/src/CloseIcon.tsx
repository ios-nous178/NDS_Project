import React from "react";

export interface CloseIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CloseIcon = React.forwardRef<SVGSVGElement, CloseIconProps>(
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
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
);

CloseIcon.displayName = "CloseIcon";
