import React from "react";

export interface MockupLinearLocationDiscoverIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearLocationDiscoverIcon = React.forwardRef<SVGSVGElement, MockupLinearLocationDiscoverIconProps>(
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
      <path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"></path><path d="M13.5 8C10.47 8 8 10.48 8 13.5c0 1.37 1.12 2.5 2.5 2.5 3.02 0 5.5-2.48 5.5-5.5C16 9.13 14.87 8 13.5 8Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearLocationDiscoverIcon.displayName = "MockupLinearLocationDiscoverIcon";
