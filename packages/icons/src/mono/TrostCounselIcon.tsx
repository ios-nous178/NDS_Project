import React from "react";

export interface TrostCounselIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostCounselIcon = React.forwardRef<SVGSVGElement, TrostCounselIconProps>(
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
      <g transform="translate(1.46 1.86)">
    <path d="M15.9258 15.9514C15.5507 15.5763 15.34 15.0676 15.34 14.5372C15.34 14.0067 15.5507 13.498 15.9258 13.1229C16.3009 12.7479 16.8096 12.5372 17.34 12.5372C17.8704 12.5372 18.3792 12.7479 18.7542 13.1229C19.1293 13.498 19.34 14.0067 19.34 14.5372C19.34 15.0676 19.1293 15.5763 18.7542 15.9514C18.3792 16.3264 17.8704 16.5372 17.34 16.5372C16.8096 16.5372 16.3009 16.3264 15.9258 15.9514Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.34 19.5372C14.34 18.4372 15.24 17.5372 16.34 17.5372H18.34C19.44 17.5372 20.34 18.4372 20.34 19.5372" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
    <path d="M20.2608 9.41C20.2108 4.63 15.8508 0.75 10.5108 0.75C5.17077 0.75 0.750766 4.68 0.750766 9.5C0.750766 10.9005 1.11679 12.2611 1.82043 13.4898C1.98149 13.771 2.02066 14.1093 1.90267 14.4112L0.800766 17.23C0.700766 17.49 0.750766 17.78 0.930766 17.99C1.11077 18.2 1.39077 18.29 1.66077 18.23L5.65621 17.3349C5.87305 17.2864 6.09928 17.3129 6.30323 17.4011C7.59283 17.9591 8.95963 18.25 10.3008 18.25C10.3708 18.25 10.4408 18.25 10.5108 18.25C10.6408 18.25 10.7708 18.24 10.9008 18.23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </g>
    </svg>
  )
);

TrostCounselIcon.displayName = "TrostCounselIcon";
