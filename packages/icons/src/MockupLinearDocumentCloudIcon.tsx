import React from "react";

export interface MockupLinearDocumentCloudIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearDocumentCloudIcon = React.forwardRef<SVGSVGElement, MockupLinearDocumentCloudIconProps>(
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
      <path d="M14 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7M22 10v3M22 10h-4c-3 0-4-1-4-4V2l8 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M13.76 18.26c-2.35.17-2.35 3.57 0 3.74h5.56c.67 0 1.33-.25 1.82-.7 1.65-1.44.77-4.32-1.4-4.59-.78-4.69-7.56-2.91-5.96 1.56" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearDocumentCloudIcon.displayName = "MockupLinearDocumentCloudIcon";
