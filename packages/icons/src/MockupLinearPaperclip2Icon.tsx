import React from "react";

export interface MockupLinearPaperclip2IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearPaperclip2Icon = React.forwardRef<SVGSVGElement, MockupLinearPaperclip2IconProps>(
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
      <path d="m12.33 12.15-2.47 2.47a3.495 3.495 0 0 0 0 4.95 3.495 3.495 0 0 0 4.95 0l3.89-3.89a7.007 7.007 0 0 0 0-9.9 7.007 7.007 0 0 0-9.9 0l-4.24 4.24c-2.34 2.34-2.34 6.14 0 8.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearPaperclip2Icon.displayName = "MockupLinearPaperclip2Icon";
