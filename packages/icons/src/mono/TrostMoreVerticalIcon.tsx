import React from "react";

export interface TrostMoreVerticalIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMoreVerticalIcon = React.forwardRef<SVGSVGElement, TrostMoreVerticalIconProps>(
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
      <path fillRule="evenodd" clipRule="evenodd" d="M12 16.5C11.175 16.5 10.5 17.175 10.5 18C10.5 18.825 11.175 19.5 12 19.5C12.825 19.5 13.5 18.825 13.5 18C13.5 17.175 12.825 16.5 12 16.5Z" fill="currentColor"/>
<path fillRule="evenodd" clipRule="evenodd" d="M12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5Z" fill="currentColor"/>
<path fillRule="evenodd" clipRule="evenodd" d="M12 7.5C12.825 7.5 13.5 6.825 13.5 6C13.5 5.175 12.825 4.5 12 4.5C11.175 4.5 10.5 5.175 10.5 6C10.5 6.825 11.175 7.5 12 7.5Z" fill="currentColor"/>
    </svg>
  )
);

TrostMoreVerticalIcon.displayName = "TrostMoreVerticalIcon";
