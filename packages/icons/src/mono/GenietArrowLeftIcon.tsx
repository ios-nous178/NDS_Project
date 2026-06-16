import React from "react";

export interface GenietArrowLeftIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietArrowLeftIcon = React.forwardRef<SVGSVGElement, GenietArrowLeftIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="684.12 297.41 21.17 21.17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <g id="ic_back">
<path id="Union" d="M692.149 301.399C692.481 301.067 693.019 301.067 693.351 301.399C693.682 301.731 693.682 302.269 693.351 302.601L688.801 307.15H702.75C703.219 307.15 703.6 307.531 703.6 308C703.6 308.469 703.219 308.85 702.75 308.85H688.801L693.351 313.399C693.682 313.731 693.682 314.269 693.351 314.601C693.019 314.932 692.481 314.932 692.149 314.601L686.149 308.601C685.817 308.269 685.817 307.731 686.149 307.399L692.149 301.399Z" fill="currentColor"/>
</g>
    </svg>
  )
);

GenietArrowLeftIcon.displayName = "GenietArrowLeftIcon";
