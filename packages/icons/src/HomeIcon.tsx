import React from "react";

export interface HomeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const HomeIcon = React.forwardRef<SVGSVGElement, HomeIconProps>(
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
      <g transform="translate(2 0.5)">
    <g id="Group">
<path id="Rectangle" d="M7.93359 3.3418C9.09145 2.24197 10.9085 2.24197 12.0664 3.3418L18.3779 9.33789C18.7753 9.71546 19 10.24 19 10.7881V18.5C19 19.6046 18.1046 20.5 17 20.5H3C1.89543 20.5 1 19.6046 1 18.5V10.7881C1 10.24 1.22474 9.71546 1.62207 9.33789L7.93359 3.3418Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
<path id="Rectangle_2" d="M10 13.5C11.6569 13.5 13 14.8431 13 16.5V20.5H7V16.5C7 14.8431 8.34315 13.5 10 13.5Z" stroke="currentColor" strokeWidth="2"/>
</g>
  </g>
    </svg>
  )
);

HomeIcon.displayName = "HomeIcon";
