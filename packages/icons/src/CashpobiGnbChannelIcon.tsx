import React from "react";

export interface CashpobiGnbChannelIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashpobiGnbChannelIcon = React.forwardRef<SVGSVGElement, CashpobiGnbChannelIconProps>(
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
      <g transform="scale(1.116279 1.116279)">
<g id="shape">
<path id="Fill-1" fillRule="evenodd" clipRule="evenodd" d="M15.052 13.9932H12.6979V13.2466C12.6979 10.9446 11.4585 8.9998 9.99158 8.9998V7.50676C12.127 7.50676 13.8483 9.52508 14.1871 12.2555C14.2043 12.3943 14.3236 12.5002 14.4686 12.5002H14.7686C14.9252 12.5002 15.052 12.6223 15.052 12.7732V13.9932Z" fill="currentColor"/>
<path id="Fill-3" fillRule="evenodd" clipRule="evenodd" d="M18.858 13.9932H16.504V13.2466C16.504 10.9446 15.2645 8.9998 13.7976 8.9998V7.50676C15.933 7.50676 17.6544 9.52508 17.9932 12.2555C18.0103 12.3943 18.1296 12.5002 18.2746 12.5002H18.5747C18.7313 12.5002 18.858 12.6223 18.858 12.7732V13.9932Z" fill="currentColor"/>
<path id="Fill-6" fillRule="evenodd" clipRule="evenodd" d="M3.90814 13.9932H2.64185V11.4784H3.4166C4.49736 11.4784 5.41065 10.0014 5.41065 8.2532V7.50676H6.1854C8.32079 7.50676 10.0423 9.52508 10.3809 12.2555C10.3981 12.3943 10.5174 12.5002 10.6624 12.5002H10.9626C11.119 12.5002 11.246 12.6223 11.246 12.7732V13.9932H8.89177V13.2466C8.89177 11.3299 8.03267 9.66075 6.89825 9.15575C6.64853 10.9389 5.66895 12.3385 4.37215 12.8047C4.26272 12.8438 4.19152 12.9457 4.19152 13.0583V13.7202C4.19152 13.8711 4.06474 13.9932 3.90814 13.9932Z" fill="currentColor"/>
<path id="bg" d="M16.4257 0.75H5.07432C2.68607 0.75 0.75 2.68607 0.75 5.07432V16.4257C0.75 18.8139 2.68607 20.75 5.07432 20.75H16.4257C18.8139 20.75 20.75 18.8139 20.75 16.4257V5.07432C20.75 2.68607 18.8139 0.75 16.4257 0.75Z" stroke="currentColor" strokeWidth="1.5"/>
</g>
</g>
    </svg>
  )
);

CashpobiGnbChannelIcon.displayName = "CashpobiGnbChannelIcon";
