import React from "react";

export interface MockupLinearPercentageCircleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearPercentageCircleIcon = React.forwardRef<SVGSVGElement, MockupLinearPercentageCircleIconProps>(
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
      <path d="m8.57 15.27 6.54-6.54M8.98 10.37a1.23 1.23 0 1 0 0-2.46 1.23 1.23 0 0 0 0 2.46ZM15.52 16.09a1.23 1.23 0 1 0 0-2.46 1.23 1.23 0 0 0 0 2.46Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearPercentageCircleIcon.displayName = "MockupLinearPercentageCircleIcon";
