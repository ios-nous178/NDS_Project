import React from "react";

export interface MockupLinearFormatSquareIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearFormatSquareIcon = React.forwardRef<SVGSVGElement, MockupLinearFormatSquareIconProps>(
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
      <path d="M20 6.95v10.1A2.5 2.5 0 0 0 17.05 20H6.95A2.5 2.5 0 0 0 4 17.05V6.95A2.5 2.5 0 0 0 6.95 4h10.1A2.5 2.5 0 0 0 20 6.95Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M7 4.5a2.5 2.5 0 0 1-5 0A2.5 2.5 0 0 1 6.95 4c.03.16.05.33.05.5ZM22 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM7 19.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM22 19.5a2.5 2.5 0 0 1-4.95.5 2.5 2.5 0 1 1 4.95-.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearFormatSquareIcon.displayName = "MockupLinearFormatSquareIcon";
