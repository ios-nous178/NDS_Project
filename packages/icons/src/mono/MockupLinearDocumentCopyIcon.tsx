import React from "react";

export interface MockupLinearDocumentCopyIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearDocumentCopyIcon = React.forwardRef<SVGSVGElement, MockupLinearDocumentCopyIconProps>(
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
      <path d="M17 13.4v3c0 4-1.6 5.6-5.6 5.6H7.6c-4 0-5.6-1.6-5.6-5.6v-3.8C2 8.6 3.6 7 7.6 7h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M17 13.4h-3.2c-2.4 0-3.2-.8-3.2-3.2V7l6.4 6.4ZM11.6 2h4M7 5c0-1.66 1.34-3 3-3h2.62M22 8v6.19c0 1.55-1.26 2.81-2.81 2.81M22 8h-3c-2.25 0-3-.75-3-3V2l6 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearDocumentCopyIcon.displayName = "MockupLinearDocumentCopyIcon";
