import React from "react";

export interface MockupLinearGridEditIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearGridEditIcon = React.forwardRef<SVGSVGElement, MockupLinearGridEditIconProps>(
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
      <path d="M22 11V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7h1M2.03 8.5H22M2.03 15.5H12M8.51 21.99V2.01M15.51 11.99V2.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="m18.73 14.67-4.15 4.15c-.16.16-.31.47-.35.69L14 21.1c-.08.57.32.98.89.89l1.59-.23c.22-.03.53-.19.69-.35l4.15-4.15c.71-.71 1.05-1.55 0-2.6-1.04-1.04-1.87-.71-2.59.01Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M18.14 15.26a3.761 3.761 0 0 0 2.6 2.6" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearGridEditIcon.displayName = "MockupLinearGridEditIcon";
