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
      viewBox="858.21 297.42 21.17 21.17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <g id="ic_next">
<path id="Union_11" d="M871.351 314.601C871.019 314.933 870.481 314.933 870.149 314.601C869.818 314.269 869.818 313.731 870.149 313.399L874.699 308.85H860.75C860.281 308.85 859.9 308.469 859.9 308C859.9 307.531 860.281 307.15 860.75 307.15H874.699L870.149 302.601C869.818 302.269 869.818 301.731 870.149 301.399C870.481 301.068 871.019 301.068 871.351 301.399L877.351 307.399C877.683 307.731 877.683 308.269 877.351 308.601L871.351 314.601Z" fill="currentColor"/>
</g>
    </svg>
  )
);

GenietArrowRightIcon.displayName = "GenietArrowRightIcon";
