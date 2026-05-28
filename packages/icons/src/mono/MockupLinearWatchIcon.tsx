import React from "react";

export interface MockupLinearWatchIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearWatchIcon = React.forwardRef<SVGSVGElement, MockupLinearWatchIconProps>(
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
      <path d="M8.5 19h7c2.33 0 3.5-1.17 3.5-3.5v-7C19 6.17 17.83 5 15.5 5h-7C6.17 5 5 6.17 5 8.5v7C5 17.83 6.17 19 8.5 19ZM16 2H8M16 22H8" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M11.5 9.5v3h3" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearWatchIcon.displayName = "MockupLinearWatchIcon";
