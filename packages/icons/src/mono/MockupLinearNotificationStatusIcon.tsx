import React from "react";

export interface MockupLinearNotificationStatusIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearNotificationStatusIcon = React.forwardRef<SVGSVGElement, MockupLinearNotificationStatusIconProps>(
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
      <path d="M19 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM7 13h5M7 17h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M14 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearNotificationStatusIcon.displayName = "MockupLinearNotificationStatusIcon";
