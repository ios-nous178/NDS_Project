import React from "react";

export interface MockupLinearDocumentSketchIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearDocumentSketchIcon = React.forwardRef<SVGSVGElement, MockupLinearDocumentSketchIconProps>(
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
      <path d="M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M22 10h-4c-3 0-4-1-4-4V2l8 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path clipRule="evenodd" d="M8.32 12h2.65c.27 0 .61.18.75.4l1.13 1.7c.23.34.18.85-.11 1.14l-2.46 2.46c-.35.35-.93.35-1.28 0l-2.46-2.46a.935.935 0 0 1-.11-1.14l1.13-1.7c.16-.22.5-.4.76-.4Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearDocumentSketchIcon.displayName = "MockupLinearDocumentSketchIcon";
