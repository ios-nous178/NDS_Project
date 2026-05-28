import React from "react";

export interface MockupLinearDocumentDownloadIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearDocumentDownloadIcon = React.forwardRef<SVGSVGElement, MockupLinearDocumentDownloadIconProps>(
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
      <path d="M9 11v6l2-2M9 17l-2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M22 10h-4c-3 0-4-1-4-4V2l8 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearDocumentDownloadIcon.displayName = "MockupLinearDocumentDownloadIcon";
