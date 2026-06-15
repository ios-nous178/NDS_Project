import React from "react";

export interface GenietTicketIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietTicketIcon = React.forwardRef<SVGSVGElement, GenietTicketIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 21 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <path fill="#FFDD57" d="M17.822 0A3.181 3.181 0 0 1 21 3.177v1.212a.776.776 0 0 1-.468.712 2.216 2.216 0 0 0 0 4.07.776.776 0 0 1 .468.712v1.212a3.181 3.181 0 0 1-3.178 3.176H3.178A3.181 3.181 0 0 1 0 11.095V9.779c0-.287.158-.55.412-.685a2.213 2.213 0 0 0 0-3.917A.775.775 0 0 1 0 4.492V3.177A3.181 3.181 0 0 1 3.178 0h14.644Z"/>
    </svg>
  )
);

GenietTicketIcon.displayName = "GenietTicketIcon";
