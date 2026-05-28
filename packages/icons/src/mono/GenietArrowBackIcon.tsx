import React from "react";

export interface GenietArrowBackIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietArrowBackIcon = React.forwardRef<SVGSVGElement, GenietArrowBackIconProps>(
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
      <g fill="none" fillRule="evenodd">
<path d="m10.071 5 1.414 1.414-4.597 4.597h13.354v2H6.766l4.722 4.721-1.415 1.415-7.07-7.072L10.072 5z" fill="currentColor"/>
    </g>
    </svg>
  )
);

GenietArrowBackIcon.displayName = "GenietArrowBackIcon";
