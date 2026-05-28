import React from "react";

export interface MockupLinearLinkCircleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearLinkCircleIcon = React.forwardRef<SVGSVGElement, MockupLinearLinkCircleIconProps>(
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
      <path d="M7.94 14.51c-.62-.23-1.17-.68-1.52-1.32-.8-1.46-.31-3.36 1.11-4.24L9.87 7.5c1.41-.88 3.23-.4 4.03 1.05.8 1.46.31 3.36-1.11 4.24l-.31.22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M16.11 9.45c.62.23 1.17.68 1.52 1.32.8 1.46.31 3.36-1.11 4.24l-2.34 1.45c-1.41.88-3.23.4-4.03-1.05-.8-1.46-.31-3.36 1.11-4.24l.31-.22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearLinkCircleIcon.displayName = "MockupLinearLinkCircleIcon";
