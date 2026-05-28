import React from "react";

export interface MockupLinearCalendar2IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearCalendar2Icon = React.forwardRef<SVGSVGElement, MockupLinearCalendar2IconProps>(
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
      <path d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M11.995 13.7h.01M8.294 13.7h.01M8.294 16.7h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearCalendar2Icon.displayName = "MockupLinearCalendar2Icon";
