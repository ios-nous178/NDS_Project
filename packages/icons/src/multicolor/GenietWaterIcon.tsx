import React from "react";

export interface GenietWaterIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietWaterIcon = React.forwardRef<SVGSVGElement, GenietWaterIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="-0.61 -1.02 25.21 25.21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <path d="M17.2768 22.1765H6.74415C5.77142 22.1765 4.95559 21.4441 4.851 20.4815L3.01014 3.103C2.89509 1.98349 3.77368 1 4.90329 1H19.0967C20.2263 1 21.1049 1.97303 20.9899 3.09254L19.1595 20.4606C19.0549 21.4232 18.239 22.166 17.2663 22.166L17.2768 22.1765Z" fill="#D3F7FF"/>
<path d="M16.2514 9.18196C15.5192 8.4705 14.7243 8.17755 14.7243 8.17755C13.5842 7.80089 12.5697 8.27171 11.8898 8.76346C10.4987 9.77834 8.58464 9.72602 7.22492 8.65883C7.16216 8.60652 7.1517 8.60652 7.12033 8.58559C6.0953 8.10431 5.26901 8.09384 4.59961 8.28217L5.88612 20.4398C5.93841 20.9106 6.33587 21.2768 6.817 21.2768H17.2032C17.6843 21.2768 18.0818 20.9106 18.1341 20.4398L19.3265 9.14011C18.5315 9.40168 16.9522 9.84111 16.2618 9.18196H16.2514Z" fill="#4EAEFF"/>
    </svg>
  )
);

GenietWaterIcon.displayName = "GenietWaterIcon";
