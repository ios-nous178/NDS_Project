import React from "react";

export interface MockupLinearImportIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearImportIcon = React.forwardRef<SVGSVGElement, MockupLinearImportIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M9.32 11.68l2.56 2.56 2.56-2.56M11.88 4v10.17"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M20 12.18c0 4.42-3 8-8 8s-8-3.58-8-8"></path>
    </svg>
  )
);

MockupLinearImportIcon.displayName = "MockupLinearImportIcon";
