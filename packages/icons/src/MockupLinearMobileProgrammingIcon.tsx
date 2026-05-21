import React from "react";

export interface MockupLinearMobileProgrammingIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearMobileProgrammingIcon = React.forwardRef<SVGSVGElement, MockupLinearMobileProgrammingIconProps>(
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
      <path d="m8.93 2 .03 1.53c.02.81.69 1.47 1.5 1.47h3.02c.83 0 1.5-.68 1.5-1.5V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="m17 17-2 2 2 2M20 17l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M13 22H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5v7" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearMobileProgrammingIcon.displayName = "MockupLinearMobileProgrammingIcon";
