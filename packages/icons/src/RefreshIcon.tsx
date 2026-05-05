import React from "react";

export interface RefreshIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RefreshIcon = React.forwardRef<SVGSVGElement, RefreshIconProps>(
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
      <g transform="translate(2.12 1)">
        <g id="Style=Outlined">
          <path
            id="Path"
            d="M9.01815 2.28181L8.16019 1.42386C7.8493 1.09026 7.85844 0.570407 8.18085 0.247984C8.50338 -0.0744376 9.02323 -0.0836155 9.35682 0.227235L11.6146 2.48501C11.9447 2.81558 11.9447 3.35108 11.6146 3.68164L9.35682 5.93942C9.02628 6.26957 8.49073 6.26957 8.16019 5.93942C7.82999 5.60885 7.82999 5.07335 8.16019 4.74279L8.90526 3.99773C5.10384 4.46861 2.14129 7.51967 1.78253 11.3333C1.42377 15.1469 3.76531 18.6969 7.4123 19.8685C11.0592 21.04 15.0301 19.5178 16.9595 16.2087C18.8888 12.8997 18.2575 8.69412 15.4415 6.09746C15.1686 5.77298 15.1778 5.29669 15.463 4.98298C15.7482 4.66927 16.2214 4.61487 16.5704 4.85568C20.0043 8.01862 20.7548 13.1537 18.3699 17.1671C15.9849 21.1806 11.1157 22.9763 6.69602 21.4723C2.27642 19.9682 -0.486761 15.5753 0.0713617 10.9402C0.629485 6.30512 4.3564 2.69369 9.00686 2.28181H9.01815Z"
            fill="currentColor"
          />
        </g>
      </g>
    </svg>
  ),
);

RefreshIcon.displayName = "RefreshIcon";
