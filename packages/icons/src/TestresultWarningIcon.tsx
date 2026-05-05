import React from "react";

export interface TestresultWarningIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TestresultWarningIcon = React.forwardRef<SVGSVGElement, TestresultWarningIconProps>(
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
      <g transform="translate(1.33 2.82)">
        <g id="Group 3753">
          <path
            id="Vector"
            d="M1.66839 18.8918C0.181078 18.8918 -0.425989 17.8395 0.317668 16.5521L9.31491 0.965616C10.0586 -0.321872 11.2752 -0.321872 12.0164 0.965616L21.0161 16.5546C21.7598 17.8421 21.1502 18.8943 19.6654 18.8943H1.66839V18.8918Z"
            fill="currentColor"
          />
          <path
            id="Vector_2"
            d="M11.4395 12.0066C11.4192 12.5226 11.0094 12.7882 10.5997 12.7882C10.1899 12.7882 9.80037 12.5251 9.78013 12.0066L9.59549 7.26639C9.57525 6.77821 10.0736 6.49491 10.5997 6.49491C11.1258 6.49491 11.6342 6.77821 11.614 7.26639L11.4395 12.0066ZM10.6022 13.4787C11.1587 13.4787 11.6064 13.9264 11.6064 14.4627C11.6064 14.9989 11.1587 15.4669 10.6022 15.4669C10.0457 15.4669 9.60813 15.0191 9.60813 14.4627C9.60813 13.9062 10.0558 13.4787 10.6022 13.4787Z"
            fill="currentColor"
          />
        </g>
      </g>
    </svg>
  ),
);

TestresultWarningIcon.displayName = "TestresultWarningIcon";
