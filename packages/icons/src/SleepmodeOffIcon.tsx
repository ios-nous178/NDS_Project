import React from "react";

export interface SleepmodeOffIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const SleepmodeOffIcon = React.forwardRef<SVGSVGElement, SleepmodeOffIconProps>(
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
      <g id="ic_eap_sleepmode_off">
<g id="Rectangle">
</g>
<g id="Group 4736">
<path id="Path" d="M9.04443 3.8988C8.01197 6.92049 8.73045 10.288 10.8989 12.6176L11.1177 12.8441C13.4568 15.1782 16.9542 15.9764 20.0825 14.9125C19.6536 15.9624 19.0362 16.8956 18.2388 17.6908L18.2378 17.6918C16.6354 19.2916 14.5158 20.1673 12.2515 20.1674H12.1841L12.1724 20.1664C9.87944 20.1466 7.7436 19.2299 6.15088 17.5814C3.2391 14.568 3.05936 9.61492 5.67725 6.38416L5.93994 6.07751C6.80185 5.11697 7.84409 4.3871 9.04443 3.8988Z" stroke="currentColor" strokeWidth="2"/>
<path id="Path-2" d="M19 4.25C19.6331 4.25 19.9667 4.97506 19.5983 5.45311L19.5304 5.53033L16.81 8.25H19C19.3797 8.25 19.6935 8.53215 19.7432 8.89823L19.75 9C19.75 9.3797 19.4679 9.69349 19.1018 9.74315L19 9.75H15C14.367 9.75 14.0334 9.02494 14.4017 8.54689L14.4697 8.46967L17.188 5.75H15C14.6203 5.75 14.3065 5.46785 14.2569 5.10177L14.25 5C14.25 4.6203 14.5322 4.30651 14.8983 4.25685L15 4.25H19Z" fill="currentColor"/>
</g>
</g>
    </svg>
  )
);

SleepmodeOffIcon.displayName = "SleepmodeOffIcon";
