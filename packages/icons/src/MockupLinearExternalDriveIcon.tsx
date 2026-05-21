import React from "react";

export interface MockupLinearExternalDriveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearExternalDriveIcon = React.forwardRef<SVGSVGElement, MockupLinearExternalDriveIconProps>(
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
      <path d="M16 22H9c-3 0-5-2-5-5V7c0-3 2-5 5-5h7c3 0 5 2 5 5v10c0 3-2 5-5 5ZM4 15h17M7 12h1M7 9.5h1M7 7h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M16.494 18.25h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearExternalDriveIcon.displayName = "MockupLinearExternalDriveIcon";
