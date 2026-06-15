import React from "react";

export interface GenietArrowRightStepperIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietArrowRightStepperIcon = React.forwardRef<SVGSVGElement, GenietArrowRightStepperIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="2.96 2.48 11.04 11.04"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <g transform="scale(1.5 1.5)">
<g fill="none" fillRule="evenodd">
<path d="m6.594 3.362 4.436 4.204c.104.1.16.227.169.357V8a.534.534 0 0 1-.17.433l-4.435 4.204a.605.605 0 0 1-.823 0 .532.532 0 0 1 0-.78L9.84 8l-4.07-3.858a.532.532 0 0 1 0-.78.605.605 0 0 1 .823 0z" fill="#FFF" fillRule="nonzero"/>
    </g>
</g>
    </svg>
  )
);

GenietArrowRightStepperIcon.displayName = "GenietArrowRightStepperIcon";
