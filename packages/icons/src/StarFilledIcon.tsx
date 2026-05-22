import React from "react";

export interface StarFilledIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const StarFilledIcon = React.forwardRef<SVGSVGElement, StarFilledIconProps>(
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
      <g transform="translate(1.78 1.92) scale(1.769)">
<path fillRule="evenodd" clipRule="evenodd" d="M7.15272 0.086263C7.31702 0.167366 7.45002 0.300361 7.53112 0.464666L9.17586 3.79643L12.8549 4.33473C13.2819 4.39713 13.5856 4.77293 13.567 5.1949L13.559 5.27983C13.5325 5.46104 13.447 5.62848 13.3158 5.75627L10.6539 8.34777L11.2825 12.0101C11.3554 12.4354 11.0922 12.8406 10.6853 12.9537L10.602 12.9723C10.4213 13.0033 10.2355 12.9739 10.0733 12.8886L6.78386 11.1584L3.49447 12.8886C3.11428 13.0885 2.65 12.9654 2.41562 12.617L2.36903 12.5389C2.28371 12.3766 2.25426 12.1908 2.28525 12.0101L2.9132 8.34777L0.25189 5.75627C-0.0558253 5.45655 -0.082393 4.97698 0.176517 4.64632L0.236369 4.57786C0.364152 4.44666 0.531595 4.36122 0.71281 4.33473L4.3912 3.79643L6.03661 0.464666C6.24032 0.0519677 6.74002 -0.117449 7.15272 0.086263Z" fill="#FFC51B"/>
</g>
    </svg>
  )
);

StarFilledIcon.displayName = "StarFilledIcon";
