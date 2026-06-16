import React from "react";

export interface TrostPlaceIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostPlaceIcon = React.forwardRef<SVGSVGElement, TrostPlaceIconProps>(
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
      <path d="M11.9961 2.06738C7.28805 2.06738 3.34643 5.95426 3.46961 10.7581C3.62016 16.6568 9.32729 21.0091 11.3118 22.3503C11.7224 22.624 12.2561 22.6103 12.653 22.3229C14.6512 20.8448 20.5226 16.0273 20.5226 10.7718C20.5226 5.98163 16.7041 2.06738 11.9961 2.06738ZM11.9961 13.29C10.4222 13.29 9.13569 12.0035 9.13569 10.4296C9.13569 8.85573 10.4222 7.56923 11.9961 7.56923C13.57 7.56923 14.8565 8.85573 14.8565 10.4296C14.8565 12.0035 13.57 13.29 11.9961 13.29Z" stroke="currentColor" strokeWidth="2.13333"/>
    </svg>
  )
);

TrostPlaceIcon.displayName = "TrostPlaceIcon";
