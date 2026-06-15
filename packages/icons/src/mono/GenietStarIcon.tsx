import React from "react";

export interface GenietStarIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietStarIcon = React.forwardRef<SVGSVGElement, GenietStarIconProps>(
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
      <path fill="currentColor" d="M11.081 2.633c.347-.806 1.49-.806 1.837 0l2.091 4.856a1 1 0 0 0 .827.6l5.264.488c.874.081 1.227 1.168.568 1.747l-3.972 3.49a1 1 0 0 0-.316.971l1.163 5.158c.192.856-.732 1.528-1.486 1.08l-4.547-2.7a1 1 0 0 0-1.02 0l-4.547 2.7c-.755.448-1.68-.224-1.486-1.08l1.162-5.158a1 1 0 0 0-.315-.971l-3.972-3.49c-.66-.579-.307-1.666.567-1.747l5.265-.488a1 1 0 0 0 .826-.6l2.091-4.856Z"/>
    </svg>
  )
);

GenietStarIcon.displayName = "GenietStarIcon";
