import React from "react";

export interface SleepmodeOnIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const SleepmodeOnIcon = React.forwardRef<SVGSVGElement, SleepmodeOnIconProps>(
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
      <path fillRule="evenodd" clipRule="evenodd" d="M12.1642 21.1667C9.60302 21.1447 7.21144 20.1181 5.43219 18.2765C2.0616 14.7886 1.95619 9.01633 5.19569 5.40925C6.20494 4.2845 7.43694 3.43841 8.85685 2.89483C9.19144 2.76466 9.57185 2.84533 9.8276 3.09833C10.0834 3.35041 10.1686 3.729 10.0449 4.06633C9.02002 6.86675 9.71852 10.0347 11.8241 12.1367C13.9306 14.2386 17.1069 14.9362 19.9164 13.9132C20.2538 13.7885 20.6333 13.8765 20.8844 14.1313C21.1356 14.3889 21.2154 14.7684 21.0861 15.103C20.6058 16.3524 19.8853 17.4616 18.9448 18.3993C17.1545 20.1868 14.7804 21.1677 12.2513 21.1677C12.2219 21.1677 12.1935 21.1677 12.1642 21.1667Z" fill="currentColor"/>
<path d="M19 4.25C19.6331 4.25 19.9667 4.97506 19.5983 5.45311L19.5304 5.53033L16.81 8.25H19C19.3797 8.25 19.6935 8.53215 19.7432 8.89823L19.75 9C19.75 9.3797 19.4679 9.69349 19.1018 9.74315L19 9.75H15C14.367 9.75 14.0334 9.02494 14.4017 8.54689L14.4697 8.46967L17.188 5.75H15C14.6203 5.75 14.3065 5.46785 14.2569 5.10177L14.25 5C14.25 4.6203 14.5322 4.30651 14.8983 4.25685L15 4.25H19Z" fill="currentColor"/>
    </svg>
  )
);

SleepmodeOnIcon.displayName = "SleepmodeOnIcon";
