import React from "react";

export interface MymusicIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MymusicIcon = React.forwardRef<SVGSVGElement, MymusicIconProps>(
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
      <path d="M17.5 17V5C17.5 5 21 7 21 10M17.5 17.4C17.5 18.726 16.157 19.8 14.5 19.8C12.843 19.8 11.5 18.725 11.5 17.4C11.5 16.075 12.843 15 14.5 15C16.157 15 17.5 16.075 17.5 17.4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12 6H3M12 10H3M7 14H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

MymusicIcon.displayName = "MymusicIcon";
