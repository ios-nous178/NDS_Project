import React from "react";

export interface RunmileLocationIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileLocationIcon = React.forwardRef<SVGSVGElement, RunmileLocationIconProps>(
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
      <path d="M12 1.5C16.4183 1.5 20 4.96437 20 9.2373C19.9997 16.9739 12 22.5 12 22.5C12 22.5 4.00032 16.9739 4 9.2373C4 4.96437 7.58172 1.5 12 1.5ZM12 6C10.067 6 8.5 7.567 8.5 9.5C8.5 11.433 10.067 13 12 13C13.933 13 15.5 11.433 15.5 9.5C15.5 7.567 13.933 6 12 6Z" fill="currentColor"/>
    </svg>
  )
);

RunmileLocationIcon.displayName = "RunmileLocationIcon";
