import React from "react";

export interface MockupLinearMirrorIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearMirrorIcon = React.forwardRef<SVGSVGElement, MockupLinearMirrorIconProps>(
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
      <path d="M12 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6 22h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearMirrorIcon.displayName = "MockupLinearMirrorIcon";
