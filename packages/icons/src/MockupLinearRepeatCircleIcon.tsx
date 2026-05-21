import React from "react";

export interface MockupLinearRepeatCircleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearRepeatCircleIcon = React.forwardRef<SVGSVGElement, MockupLinearRepeatCircleIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M7.5 8.34h7.4c.89 0 1.6.72 1.6 1.6v1.77"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M9.19 6.66L7.5 8.34l1.69 1.69M16.5 15.66H9.1c-.89 0-1.6-.72-1.6-1.6v-1.77"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M14.81 17.34l1.69-1.68-1.69-1.69"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
    </svg>
  )
);

MockupLinearRepeatCircleIcon.displayName = "MockupLinearRepeatCircleIcon";
