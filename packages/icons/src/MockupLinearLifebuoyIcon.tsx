import React from "react";

export interface MockupLinearLifebuoyIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearLifebuoyIcon = React.forwardRef<SVGSVGElement, MockupLinearLifebuoyIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.97 22c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 16.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM4.9 4.93l3.54 3.53M4.9 19.07l3.54-3.53M19.05 19.07l-3.54-3.53M19.05 4.93l-3.54 3.53"></path>
    </svg>
  )
);

MockupLinearLifebuoyIcon.displayName = "MockupLinearLifebuoyIcon";
