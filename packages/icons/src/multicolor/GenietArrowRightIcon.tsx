import React from "react";

export interface GenietArrowRightIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietArrowRightIcon = React.forwardRef<SVGSVGElement, GenietArrowRightIconProps>(
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
      <g transform="scale(1.333333 1.333333)">
<g fill="none" fillRule="evenodd">
<path d="m7.418 3.782 4.99 4.73a.604.604 0 0 1 .19.401v.088a.6.6 0 0 1-.19.487l-4.99 4.73a.68.68 0 0 1-.926 0 .598.598 0 0 1 0-.878L11.072 9l-4.58-4.34a.598.598 0 0 1 0-.878.68.68 0 0 1 .926 0z" fill="#FFF" fillRule="nonzero"/>
    </g>
</g>
    </svg>
  )
);

GenietArrowRightIcon.displayName = "GenietArrowRightIcon";
