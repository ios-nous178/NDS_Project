import React from "react";

export interface GenietCloverIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietCloverIcon = React.forwardRef<SVGSVGElement, GenietCloverIconProps>(
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
      <path fill="#10884C" d="M11.472 14.304a.75.75 0 0 1 .975.418c.378.946.655 2.47.351 3.988-.311 1.556-1.24 3.117-3.252 3.98a.75.75 0 0 1-.592-1.38c1.489-.637 2.143-1.743 2.373-2.895.238-1.19.015-2.416-.273-3.137a.75.75 0 0 1 .418-.974Z"/>
  <path fill="#2EB66D" d="M16.05 2a4.95 4.95 0 0 1 2.844 9A4.95 4.95 0 1 1 12 17.894 4.95 4.95 0 1 1 5.105 11 4.95 4.95 0 1 1 12 4.105 4.943 4.943 0 0 1 16.05 2Z"/>
  <path fill="#10884C" d="M6.97 5.98a.75.75 0 0 1 1.06 0l2 2a.75.75 0 1 1-1.06 1.06l-2-2a.75.75 0 0 1 0-1.06Zm0 10.366a.75.75 0 0 0 1.06 0l2-2a.75.75 0 1 0-1.06-1.06l-2 2a.75.75 0 0 0 0 1.06ZM17.028 5.98a.75.75 0 0 0-1.06 0l-2 2a.75.75 0 1 0 1.06 1.06l2-2a.75.75 0 0 0 0-1.06Zm0 10.366a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l2 2a.75.75 0 0 1 0 1.06Z"/>
    </svg>
  )
);

GenietCloverIcon.displayName = "GenietCloverIcon";
