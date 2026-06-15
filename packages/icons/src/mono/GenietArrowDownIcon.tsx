import React from "react";

export interface GenietArrowDownIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietArrowDownIcon = React.forwardRef<SVGSVGElement, GenietArrowDownIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="517.56 298.56 18.89 18.89"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <path id="ic_arrow_down" d="M519.399 303.899C519.067 304.231 519.067 304.769 519.399 305.101L526.399 312.101C526.731 312.432 527.269 312.432 527.601 312.101L534.601 305.101C534.932 304.769 534.932 304.231 534.601 303.899C534.269 303.567 533.731 303.567 533.399 303.899L527 310.299L520.601 303.899C520.269 303.567 519.731 303.567 519.399 303.899Z" fill="currentColor"/>
    </svg>
  )
);

GenietArrowDownIcon.displayName = "GenietArrowDownIcon";
