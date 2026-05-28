import React from "react";

export interface MockupLinearCropIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearCropIcon = React.forwardRef<SVGSVGElement, MockupLinearCropIconProps>(
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
      <path d="M9.9 19H19V9.9C19 6 18 5 14.1 5H5v9.1C5 18 6 19 9.9 19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M5 5V2M5 5H2M19 19v3M19 19h3" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearCropIcon.displayName = "MockupLinearCropIcon";
