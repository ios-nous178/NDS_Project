import React from "react";

export interface MockupLinearBillIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearBillIcon = React.forwardRef<SVGSVGElement, MockupLinearBillIconProps>(
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
      <path d="M3.67 2.5v11.97c0 .98.46 1.91 1.25 2.5l5.21 3.9c1.11.83 2.64.83 3.75 0l5.21-3.9c.79-.59 1.25-1.52 1.25-2.5V2.5H3.67Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"></path><path d="M2 2.5h20" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"></path><path d="M8 8h8M8 13h8" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearBillIcon.displayName = "MockupLinearBillIcon";
