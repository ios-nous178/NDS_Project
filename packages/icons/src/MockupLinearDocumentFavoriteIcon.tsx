import React from "react";

export interface MockupLinearDocumentFavoriteIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearDocumentFavoriteIcon = React.forwardRef<SVGSVGElement, MockupLinearDocumentFavoriteIconProps>(
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
      <path d="M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M22 10h-4c-3 0-4-1-4-4V2l8 8ZM6.62 15.73c-.33-1.03.06-2.3 1.13-2.65.57-.18 1.27-.03 1.66.52.37-.57 1.1-.7 1.66-.52 1.08.35 1.46 1.62 1.14 2.65-.51 1.63-2.3 2.48-2.8 2.48-.49-.01-2.26-.84-2.79-2.48Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearDocumentFavoriteIcon.displayName = "MockupLinearDocumentFavoriteIcon";
