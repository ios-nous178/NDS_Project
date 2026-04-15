import React from "react";

export interface CounselActiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CounselActiveIcon = React.forwardRef<SVGSVGElement, CounselActiveIconProps>(
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
      <path d="M12 2.6956C17.799 2.6956 22.5 6.50118 22.5 11.1956C22.5 15.89 17.799 19.6956 12 19.6956C11.1816 19.6956 10.3857 19.6163 9.62109 19.4729L6.15332 21.1526C5.15727 21.6347 4.00011 20.9096 4 19.803V16.6976C2.44196 15.2146 1.5 13.2949 1.5 11.1956C1.5 6.50118 6.20101 2.6956 12 2.6956ZM8.2002 10.4183C7.64764 10.4183 7.20033 10.8641 7.2002 11.4153C7.2002 11.9666 7.64756 12.4134 8.2002 12.4134C8.75274 12.4133 9.2002 11.9666 9.2002 11.4153C9.20006 10.8642 8.75266 10.4184 8.2002 10.4183ZM12 10.4183C11.4474 10.4183 11.0001 10.8641 11 11.4153C11 11.9666 11.4474 12.4134 12 12.4134C12.5526 12.4134 13 11.9666 13 11.4153C12.9999 10.8641 12.5525 10.4183 12 10.4183ZM15.8008 10.4183C15.2478 10.4183 14.7999 10.8642 14.7998 11.4153C14.7998 11.9666 15.2494 12.4133 15.8008 12.4134C16.3521 12.4134 16.7998 11.9666 16.7998 11.4153C16.7997 10.8641 16.3538 10.4183 15.8008 10.4183Z" fill="currentColor"/>
    </svg>
  )
);

CounselActiveIcon.displayName = "CounselActiveIcon";
