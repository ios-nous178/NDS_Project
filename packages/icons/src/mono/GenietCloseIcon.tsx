import React from "react";

export interface GenietCloseIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietCloseIcon = React.forwardRef<SVGSVGElement, GenietCloseIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="601.56 598.56 18.89 18.89"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <g id="ic_close">
<path id="Union_16" d="M617.399 600.399C617.731 600.067 618.269 600.067 618.601 600.399C618.932 600.731 618.932 601.269 618.601 601.601L612.201 608L618.601 614.399C618.932 614.731 618.932 615.269 618.601 615.601C618.269 615.932 617.731 615.932 617.399 615.601L611 609.201L604.601 615.601C604.269 615.932 603.731 615.932 603.399 615.601C603.067 615.269 603.067 614.731 603.399 614.399L609.799 608L603.399 601.601C603.067 601.269 603.067 600.731 603.399 600.399C603.731 600.067 604.269 600.067 604.601 600.399L611 606.799L617.399 600.399Z" fill="currentColor"/>
</g>
    </svg>
  )
);

GenietCloseIcon.displayName = "GenietCloseIcon";
