import React from "react";

export interface MockupLinearMaximizeCircleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearMaximizeCircleIcon = React.forwardRef<SVGSVGElement, MockupLinearMaximizeCircleIconProps>(
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
      <path d="M17 3h4v4M15 9l6-6M7 21H3v-4M9 15l-6 6M14.02 2.2C13.37 2.07 12.69 2 12 2 6.48 2 2 6.48 2 12c0 .69.07 1.36.2 2M9.98 21.8c.65.13 1.33.2 2.02.2 5.52 0 10-4.48 10-10 0-.68-.07-1.35-.2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearMaximizeCircleIcon.displayName = "MockupLinearMaximizeCircleIcon";
