import React from "react";

export interface RunmileAccountActiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileAccountActiveIcon = React.forwardRef<SVGSVGElement, RunmileAccountActiveIconProps>(
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
      <g transform="translate(2 2)">
    <g id="ic/user/fill">
<path id="Exclude" d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM9.99023 10.3496C7.80023 10.3496 5.91035 11.6102 5.11035 13.4102C4.65043 14.43 5.63977 15.3601 6.80957 15.3604H13.1699C14.3398 15.3604 15.3299 14.4301 14.8701 13.4102C14.0701 11.6102 12.1801 10.3497 9.99023 10.3496ZM9.99023 4.19043C8.66029 4.19043 7.58993 5.25992 7.58984 6.58984C7.58984 7.91984 8.66023 8.99023 9.99023 8.99023C11.3201 8.99012 12.3896 7.91977 12.3896 6.58984C12.3896 5.25999 11.3201 4.19054 9.99023 4.19043Z" fill="currentColor"/>
</g>
  </g>
    </svg>
  )
);

RunmileAccountActiveIcon.displayName = "RunmileAccountActiveIcon";
