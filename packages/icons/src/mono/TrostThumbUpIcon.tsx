import React from "react";

export interface TrostThumbUpIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostThumbUpIcon = React.forwardRef<SVGSVGElement, TrostThumbUpIconProps>(
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
      <path fillRule="evenodd" clipRule="evenodd" d="M6.42601 10.3223H8.83301V20.0003H6.42601C6.17239 19.9997 5.92136 19.9492 5.68727 19.8516C5.45318 19.754 5.24063 19.6112 5.06176 19.4314C4.88288 19.2516 4.7412 19.0384 4.64481 18.8038C4.54843 18.5692 4.49922 18.3179 4.50001 18.0643V12.2583C4.49922 12.0046 4.54843 11.7534 4.64481 11.5188C4.7412 11.2842 4.88288 11.0709 5.06176 10.8911C5.24063 10.7113 5.45318 10.5685 5.68727 10.4709C5.92136 10.3733 6.17239 10.3228 6.42601 10.3223Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
<path fillRule="evenodd" clipRule="evenodd" d="M18.075 10.3222H14.098L14.602 9.1982C15.018 8.26056 15.0461 7.19635 14.6799 6.23811C14.3138 5.27987 13.5833 4.5055 12.648 4.0842C12.5328 4.03277 12.4086 4.0046 12.2825 4.0013C12.1564 3.99801 12.0308 4.01965 11.9131 4.065C11.7954 4.11034 11.6878 4.17849 11.5965 4.26553C11.5051 4.35257 11.4319 4.45678 11.381 4.5722L8.83398 10.3222V20.0002H17.008C17.938 20.0002 18.734 19.3342 18.902 18.4162L19.969 12.6092C20.0214 12.3306 20.0118 12.0439 19.9409 11.7694C19.87 11.495 19.7395 11.2395 19.5587 11.0212C19.3779 10.8029 19.1512 10.627 18.8948 10.5062C18.6384 10.3854 18.3585 10.3226 18.075 10.3222Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
);

TrostThumbUpIcon.displayName = "TrostThumbUpIcon";
