import React from "react";

export interface MockupLinearDocumentCode2IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearDocumentCode2Icon = React.forwardRef<SVGSVGElement, MockupLinearDocumentCode2IconProps>(
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
      <path d="M11 22h5c3.5 0 5-2 5-5V7c0-3-1.5-5-5-5H8C4.5 2 3 4 3 7v7" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M14.5 4.5v2c0 1.1.9 2 2 2h2M4 17l-2 2 2 2M7 17l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearDocumentCode2Icon.displayName = "MockupLinearDocumentCode2Icon";
