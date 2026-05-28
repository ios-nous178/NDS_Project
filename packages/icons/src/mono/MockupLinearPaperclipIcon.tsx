import React from "react";

export interface MockupLinearPaperclipIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearPaperclipIcon = React.forwardRef<SVGSVGElement, MockupLinearPaperclipIconProps>(
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
      <path d="M11.97 12v3.5c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5V10c0-3.87-3.13-7-7-7s-7 3.13-7 7v6c0 3.31 2.69 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearPaperclipIcon.displayName = "MockupLinearPaperclipIcon";
