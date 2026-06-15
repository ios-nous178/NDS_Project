import React from "react";

export interface GenietWeightIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietWeightIcon = React.forwardRef<SVGSVGElement, GenietWeightIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0.10 0.10 23.81 23.81"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <g clipPath="url(#clip0_3062_8862)">
<path d="M17.7266 2H6.27336C3.91325 2 2 3.91325 2 6.27336V17.7266C2 20.0868 3.91325 22 6.27336 22H17.7266C20.0868 22 22 20.0868 22 17.7266V6.27336C22 3.91325 20.0868 2 17.7266 2Z" fill="#FFA43F"/>
<path d="M11.9905 9.95864C13.1065 9.95864 14.1618 10.2614 15.0961 10.8064C15.6324 11.1178 16.2726 11.014 16.6791 10.5036L18.2881 8.49671C18.8677 7.77871 18.6947 6.63684 17.9594 6.13511C16.2034 4.94999 14.1705 4.2666 11.9905 4.2666C9.68086 4.2666 7.52688 5.02785 5.71027 6.34273C5.00093 6.85311 4.87982 7.98632 5.45076 8.68702L7.0857 10.6593C7.50093 11.1611 8.15837 11.2562 8.68605 10.9189C9.67221 10.3047 10.7881 9.94999 11.9905 9.94999V9.95864Z" fill="white"/>
<mask id="mask0_3062_8862" maskUnits="userSpaceOnUse" x="5" y="4" width="14" height="8">
<path d="M11.9905 9.95864C13.1065 9.95864 14.1618 10.2614 15.0961 10.8064C15.6324 11.1178 16.2726 11.014 16.6791 10.5036L18.2881 8.49671C18.8677 7.77871 18.6947 6.63684 17.9594 6.13511C16.2034 4.94999 14.1705 4.2666 11.9905 4.2666C9.68086 4.2666 7.52688 5.02785 5.71027 6.34273C5.00093 6.85311 4.87982 7.98632 5.45076 8.68702L7.0857 10.6593C7.50093 11.1611 8.15837 11.2562 8.68605 10.9189C9.67221 10.3047 10.7881 9.94999 11.9905 9.94999V9.95864Z" fill="white"/>
</mask>
<g mask="url(#mask0_3062_8862)">
<path d="M11.6452 6.749C11.7576 6.23862 12.0431 6.23862 12.1556 6.749L12.4064 7.89086L12.9081 10.1833H10.8926L11.3943 7.89086L11.6452 6.749Z" fill="#E84800"/>
</g>
</g>
<defs>
<clipPath id="clip0_3062_8862">
<rect width="20" height="20" fill="white" transform="translate(2 2)"/>
</clipPath>
</defs>
    </svg>
  )
);

GenietWeightIcon.displayName = "GenietWeightIcon";
