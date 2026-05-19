import React from "react";

export interface GenietWriteOffIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietWriteOffIcon = React.forwardRef<SVGSVGElement, GenietWriteOffIconProps>(
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
      <g id="icon/bottomnavi/write/off">
<path id="Vector" fillRule="evenodd" clipRule="evenodd" d="M8.19634 19.8064L5.20534 20.4564C5.04026 20.4923 4.86875 20.4856 4.707 20.4368C4.54525 20.388 4.3986 20.2988 4.28091 20.1776C4.16321 20.0564 4.07835 19.9072 4.03433 19.7441C3.99031 19.581 3.9886 19.4094 4.02934 19.2454L4.74734 16.3454C4.84062 15.9695 5.03416 15.626 5.30734 15.3514L15.9673 4.63042C16.1654 4.4313 16.4007 4.27314 16.6598 4.16497C16.919 4.05681 17.1969 4.00075 17.4777 4.00001C17.7585 3.99926 18.0367 4.05385 18.2964 4.16064C18.5561 4.26744 18.7923 4.42435 18.9913 4.62242L19.8813 5.50842C20.7203 6.34142 20.7233 7.69542 19.8913 8.53242L9.25834 19.2244C8.96814 19.5171 8.59922 19.7193 8.19634 19.8064Z" fill="currentColor"/>
<path id="Vector_2" d="M19.695 18.738C19.9393 18.738 20.1736 18.835 20.3463 19.0078C20.519 19.1805 20.616 19.4147 20.616 19.659C20.616 19.9033 20.519 20.1375 20.3463 20.3102C20.1736 20.483 19.9393 20.58 19.695 20.58H11.68C11.4358 20.58 11.2015 20.483 11.0288 20.3102C10.8561 20.1375 10.759 19.9033 10.759 19.659C10.759 19.4147 10.8561 19.1805 11.0288 19.0078C11.2015 18.835 11.4358 18.738 11.68 18.738H19.695Z" fill="currentColor"/>
</g>
    </svg>
  )
);

GenietWriteOffIcon.displayName = "GenietWriteOffIcon";
