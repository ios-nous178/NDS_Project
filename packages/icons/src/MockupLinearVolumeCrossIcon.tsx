import React from "react";

export interface MockupLinearVolumeCrossIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearVolumeCrossIcon = React.forwardRef<SVGSVGElement, MockupLinearVolumeCrossIconProps>(
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
      <path d="M2 10.16v4c0 2 1 3 3 3h1.43c.37 0 .74.11 1.06.3l2.92 1.83c2.52 1.58 4.59.43 4.59-2.54V7.57c0-2.98-2.07-4.12-4.59-2.54L7.49 6.86c-.32.19-.69.3-1.06.3H5c-2 0-3 1-3 3Z" stroke="currentColor" strokeWidth="1.5"></path><path d="m22 14.12-3.96-3.96M21.96 10.2 18 14.16" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearVolumeCrossIcon.displayName = "MockupLinearVolumeCrossIcon";
