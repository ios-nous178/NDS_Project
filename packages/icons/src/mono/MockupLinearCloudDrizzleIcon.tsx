import React from "react";

export interface MockupLinearCloudDrizzleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearCloudDrizzleIcon = React.forwardRef<SVGSVGElement, MockupLinearCloudDrizzleIconProps>(
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
      <path d="M16.61 20c1.34.01 2.63-.49 3.62-1.39 3.27-2.86 1.52-8.6-2.79-9.14C15.9.13 2.43 3.67 5.62 12.56" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M7.28 12.97c-.53-.27-1.12-.41-1.71-.4-4.66.33-4.65 7.11 0 7.44M15.82 9.89c.52-.26 1.08-.4 1.66-.41M9.97 20l-2 2M13.97 20l-2 2M13.97 16l-2 2M9.97 16l-2 2" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearCloudDrizzleIcon.displayName = "MockupLinearCloudDrizzleIcon";
