import React from "react";

export interface RunmileChatColorIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileChatColorIcon = React.forwardRef<SVGSVGElement, RunmileChatColorIconProps>(
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
      <path d="M12 1.9917C17.799 1.9917 22.5 6.19766 22.5 11.3862C22.4999 14.4293 20.8813 17.1323 18.374 18.8491L18.1514 21.3901C18.0837 22.1589 17.2081 22.5643 16.5781 22.1187L14.3486 20.5415C13.5933 20.696 12.8076 20.7808 12 20.7808C6.20109 20.7808 1.50013 16.5747 1.5 11.3862C1.5 6.19766 6.20101 1.9917 12 1.9917Z" fill="#D6EDFF"/>
  <circle cx="8.13157" cy="11.386" r="1.10526" fill="#009EFF"/>
  <circle cx="12" cy="11.386" r="1.10526" fill="#009EFF"/>
  <circle cx="15.8684" cy="11.386" r="1.10526" fill="#009EFF"/>
    </svg>
  )
);

RunmileChatColorIcon.displayName = "RunmileChatColorIcon";
