import React from "react";

export interface MockupLinearTextItalicIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearTextItalicIcon = React.forwardRef<SVGSVGElement, MockupLinearTextItalicIconProps>(
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
      <path d="M9.62 3h9.25M5.12 21h9.25M14.25 3l-4.5 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearTextItalicIcon.displayName = "MockupLinearTextItalicIcon";
