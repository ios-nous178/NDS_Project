import React from "react";

export interface TrostTimeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostTimeIcon = React.forwardRef<SVGSVGElement, TrostTimeIconProps>(
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
      <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="1.5"/>
<path d="M16.5 12H12.25C12.1837 12 12.1201 11.9737 12.0732 11.9268C12.0263 11.8799 12 11.8163 12 11.75V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
);

TrostTimeIcon.displayName = "TrostTimeIcon";
