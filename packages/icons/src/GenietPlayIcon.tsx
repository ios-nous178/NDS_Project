import React from "react";

export interface GenietPlayIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietPlayIcon = React.forwardRef<SVGSVGElement, GenietPlayIconProps>(
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
      <g transform="scale(0.444444 0.444444)">
<g fill="none" fillRule="evenodd">
        <circle fill="currentColor" cx="27" cy="27" r="27"/>
        <path d="m36.937 28.061-13.87 8.745A2 2 0 0 1 20 35.114V17.625a2 2 0 0 1 3.067-1.692l13.87 8.745a2 2 0 0 1 0 3.383z" fill="#FFF"/>
    </g>
</g>
    </svg>
  )
);

GenietPlayIcon.displayName = "GenietPlayIcon";
