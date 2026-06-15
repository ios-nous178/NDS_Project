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
      viewBox="432.91 298.56 18.89 18.89"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <path id="ic_arrow_right" d="M446.45 300.399C446.118 300.067 445.581 300.067 445.249 300.399L438.249 307.399C437.917 307.731 437.917 308.269 438.249 308.601L445.249 315.601C445.581 315.932 446.118 315.932 446.45 315.601C446.782 315.269 446.782 314.731 446.45 314.399L440.051 308L446.45 301.601C446.782 301.269 446.782 300.731 446.45 300.399Z" fill="currentColor"/>
    </svg>
  )
);

GenietArrowBackIcon.displayName = "GenietArrowBackIcon";
