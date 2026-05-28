import React from "react";

export interface MockupLinearDocumentText1IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearDocumentText1Icon = React.forwardRef<SVGSVGElement, MockupLinearDocumentText1IconProps>(
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
      <path d="M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M22 10h-4c-3 0-4-1-4-4V2l8 8ZM7 13h6M7 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearDocumentText1Icon.displayName = "MockupLinearDocumentText1Icon";
