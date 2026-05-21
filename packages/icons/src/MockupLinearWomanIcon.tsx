import React from "react";

export interface MockupLinearWomanIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearWomanIcon = React.forwardRef<SVGSVGElement, MockupLinearWomanIconProps>(
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
      <path d="M12 16a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM12 16v6M15 19H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearWomanIcon.displayName = "MockupLinearWomanIcon";
