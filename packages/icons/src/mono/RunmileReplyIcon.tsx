import React from "react";

export interface RunmileReplyIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileReplyIcon = React.forwardRef<SVGSVGElement, RunmileReplyIconProps>(
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
      <g transform="translate(4.3992 3.9)">
    <g id="ic_reply">
    <path id="Union" d="M0.849609 0C1.31905 0 1.69922 0.380167 1.69922 0.849609V6.84961C1.69922 9.14159 3.55763 11 5.84961 11H12.2988L10.249 8.9502C9.91708 8.61825 9.91708 8.08097 10.249 7.74902C10.581 7.41708 11.1182 7.41708 11.4502 7.74902L14.9502 11.249C15.2821 11.581 15.2821 12.1183 14.9502 12.4502L11.4502 15.9502C11.1183 16.2821 10.581 16.2821 10.249 15.9502C9.91708 15.6182 9.91708 15.081 10.249 14.749L12.2988 12.6992H5.84961C2.61874 12.6992 0 10.0805 0 6.84961V0.849609C0 0.380167 0.380167 0 0.849609 0Z" fill="currentColor"/>
    </g>
  </g>
    </svg>
  )
);

RunmileReplyIcon.displayName = "RunmileReplyIcon";
