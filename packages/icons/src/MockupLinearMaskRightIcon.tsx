import React from "react";

export interface MockupLinearMaskRightIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearMaskRightIcon = React.forwardRef<SVGSVGElement, MockupLinearMaskRightIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 12c0 2.76-2.24 5-5 5V7c2.76 0 5 2.24 5 5zM12 7v10c-2.76 0-5-2.24-5-5s2.24-5 5-5zM12 22v-5M12 7V2"></path>
    </svg>
  )
);

MockupLinearMaskRightIcon.displayName = "MockupLinearMaskRightIcon";
