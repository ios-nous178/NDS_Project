import React from "react";

export interface MockupLinearLoginIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearLoginIcon = React.forwardRef<SVGSVGElement, MockupLinearLoginIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M11.68 14.62l2.56-2.56-2.56-2.56M4 12.06h10.17"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M12 4c4.42 0 8 3 8 8s-3.58 8-8 8"></path>
    </svg>
  )
);

MockupLinearLoginIcon.displayName = "MockupLinearLoginIcon";
