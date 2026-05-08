import React from "react";

export interface FilterIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const FilterIcon = React.forwardRef<SVGSVGElement, FilterIconProps>(
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
      <g transform="translate(3 3)">
    <path id="Vector" d="M15.5929 1H2.00086C1.80861 0.999836 1.6204 1.05509 1.45875 1.15914C1.2971 1.26319 1.16886 1.41164 1.08941 1.58669C1.00995 1.76175 0.982641 1.956 1.01074 2.14618C1.03884 2.33636 1.12117 2.51441 1.24786 2.659L6.54986 8.717C6.70932 8.89948 6.7971 9.13366 6.79686 9.376V14.25C6.79686 14.3276 6.81493 14.4042 6.84965 14.4736C6.88436 14.543 6.93476 14.6034 6.99686 14.65L9.99686 16.9C10.0711 16.9557 10.1595 16.9896 10.252 16.998C10.3444 17.0063 10.4374 16.9887 10.5205 16.9472C10.6035 16.9057 10.6734 16.8419 10.7222 16.7629C10.771 16.6839 10.7969 16.5929 10.7969 16.5V9.376C10.7966 9.13366 10.8844 8.89948 11.0439 8.717L16.3459 2.658C16.9119 2.012 16.4519 1 15.5929 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </g>
    </svg>
  )
);

FilterIcon.displayName = "FilterIcon";
