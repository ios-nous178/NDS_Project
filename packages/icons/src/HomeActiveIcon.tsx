import React from "react";

export interface HomeActiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const HomeActiveIcon = React.forwardRef<SVGSVGElement, HomeActiveIconProps>(
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
      <g transform="translate(2 2.02)">
    <g id="Group">
<path id="Combined Shape" d="M7.24512 1.09976C8.78891 -0.366587 11.2111 -0.366586 12.7549 1.09976L19.0664 7.09585C19.6625 7.66219 20 8.44843 20 9.27066V16.9826C20 18.6394 18.6569 19.9826 17 19.9826H14V14.9826C13.9998 12.7736 12.209 10.9826 10 10.9826C7.79097 10.9826 6.00018 12.7736 6 14.9826V19.9826H3C1.34315 19.9826 0 18.6394 0 16.9826V9.27066C4.95478e-05 8.44843 0.337502 7.66219 0.933594 7.09585L7.24512 1.09976ZM10.1494 12.9884C11.1841 13.0649 11.9998 13.9284 12 14.9826V19.9826H8V14.9826C8.00018 13.8782 8.89554 12.9826 10 12.9826L10.1494 12.9884Z" fill="currentColor"/>
</g>
  </g>
    </svg>
  )
);

HomeActiveIcon.displayName = "HomeActiveIcon";
