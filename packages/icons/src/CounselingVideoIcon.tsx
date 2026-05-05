import React from "react";

export interface CounselingVideoIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CounselingVideoIcon = React.forwardRef<SVGSVGElement, CounselingVideoIconProps>(
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
      <g transform="translate(1 3)">
        <path
          id="Vector"
          d="M19.8732 3.00343C19.4532 2.77714 18.5722 2.54057 17.3737 3.384L15.8678 4.45371C15.7551 1.25486 14.3722 0 11.0122 0H4.86585C1.36244 0 0 1.368 0 4.88571V13.1143C0 15.48 1.28049 18 4.86585 18H11.0122C14.3722 18 15.7551 16.7451 15.8678 13.5463L17.3737 14.616C18.0088 15.0686 18.562 15.2126 19.0024 15.2126C19.3815 15.2126 19.6785 15.0994 19.8732 14.9966C20.2932 14.7806 21 14.1943 21 12.7234V5.27657C21 3.80571 20.2932 3.21943 19.8732 3.00343ZM9.47561 8.36229C8.42049 8.36229 7.54976 7.49829 7.54976 6.42857C7.54976 5.35886 8.42049 4.49486 9.47561 4.49486C10.5307 4.49486 11.4015 5.35886 11.4015 6.42857C11.4015 7.49829 10.5307 8.36229 9.47561 8.36229Z"
          fill="currentColor"
        />
      </g>
    </svg>
  ),
);

CounselingVideoIcon.displayName = "CounselingVideoIcon";
