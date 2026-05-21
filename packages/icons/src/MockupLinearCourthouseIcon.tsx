import React from "react";

export interface MockupLinearCourthouseIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearCourthouseIcon = React.forwardRef<SVGSVGElement, MockupLinearCourthouseIconProps>(
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
      <path d="M2 22h20M12 2c1.6.64 3.4.64 5 0v3c-1.6.64-3.4.64-5 0V2ZM12 5v3M17 8H7c-2 0-3 1-3 3v11h16V11c0-2-1-3-3-3ZM4.58 12h14.84" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M7.99 12v10M11.99 12v10M15.99 12v10" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearCourthouseIcon.displayName = "MockupLinearCourthouseIcon";
